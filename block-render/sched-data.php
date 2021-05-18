<?php
/* Registration  ----------------------- */

function appia_register_sched_data_block() {
  if ( ! function_exists( 'register_block_type' ) ) {
    return;
  }
  
  $register_args = array(
    'attributes' => array(
      'tracks' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_sched_meta_tracks', 
      ),
      'slots' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_sched_meta_slots', 
      ),
      'sessions' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_sched_meta_sessions', 
      ),
    ),
    'render_callback' => 'appia_sched_data_block_render',
  );

  register_block_type( 'appia/sched-data', $register_args );

}

add_action( 'init', 'appia_register_sched_data_block' );


/* Rendering -------------------------------------*/

function appia_get_table_name( $tables, $index ) {
  $name = '';
  if ( count( $tables ) > $index ) {
    $the_object = $tables[ $index ];
    appia_get_name( $the_object );
  }
  return $name;
}

function appia_get_name( $table ) {
  $name = '';
  if ( isset( $table['name'] ) ) {
    $name = $table['name'];
  }
  return $name;
}

function appia_sessions( $all_sessions, $slot_num, $track_num ) {
  $the_sessions = array();
  if ( isset( $all_sessions[ $slot_num ] ) ) {
    $slot = $all_sessions[ $slot_num ];
    if ( isset( $slot[ $track_num ] ) ) {
      $the_sessions = $slot[ $track_num ];
    }
  }
  return $the_sessions;
}

function appia_in_schedule( $field_name ) {
  global $show_in_schedule;
  if ( isset( $show_in_schedule[ $field_name ] ) && $show_in_schedule[ $field_name ] == true ) {
    return true;
  } else {
    return false;
  }
}

function appia_sched_data_block_render( $attributes ) {
  global $post;
  $id = $post->ID;

  $sessions = appia_get_meta( $id, 'post_sched_meta_sessions' );
  $tracks = appia_get_meta( $id, 'post_sched_meta_tracks' );
  $numTracks = count( $tracks );
  $slots = appia_get_meta( $id, 'post_sched_meta_slots' );
  $multiday = false;
  // Detect if schedule is using multi-day feature
  foreach ( $slots as $slot ) {
    if ( isset( $slot['day'] ) && $slot['day'] ) {
      $multiday = true;
      break;
    }
  }
  // Chunking up the slots if so
  if ( $multiday ) {
    $newDay = array(
      'dayInfo' => array(),
      'slots' => array(),
    );
    $slotsByDay = array(
      $newDay,
    );
    $currentDayNum = 0;
    foreach ( $slots as $slot ) {
      if ( isset( $slot[ 'day' ] ) && $slot[ 'day' ] ) {
        $currentDayNum++;
        $newDay = array(
          'dayInfo' => $slot,
          'slots' => array(),
        );
        $slotsByDay[] = $newDay;
      } else {
        $slotsByDay[ $currentDayNum ][ 'slots' ][] = $slot;
      }
    }
  } else {
    $newDay = array(
      'dayInfo' => array(),
      'slots' => $slots,
    );
    $slotsByDay = array(
      $newDay,
    );
  }

  $markup = '';
  $markup .= '<div class="schedule-container">';
    // Title of the schedule
    $markup .= '<h1>' . esc_html( $post->title ) . '</h1>';

    foreach( $slotsByDay as $dayId => $day ) {
      $dayInfo = $day[ 'dayInfo' ];
      $dayName = isset( $dayInfo[ 'name' ] ) ? $dayInfo[ 'name' ] : 'Unnamed Day';
      $dayDesc = isset( $dayInfo[ 'desc' ] ) ? $dayInfo[ 'desc' ] : '';

      $markup .= '<section aria-labelledby="day-' . $dayId . '">';
        $markup .= '<header id="day-' . $dayId . '">';
          $markup .= '<h2>' . esc_html( $dayName ) . '</h2>';
          $markup .= '<p>' . esc_html( $dayDesc ) . '</p>';
        $markup .= '</header>';
        $markup .= '<table>';

          // Label for the table
          $markup .= '<caption>' . esc_html( $dayName ) . '</caption>';
          
          // Tracks labelled at top
          $markup .= '<thead>';
            $markup .= '<tr>';
              $markup .= '<td></td>';
              foreach ( $tracks as $track ) {
                $markup .= '<th scope="col">' . appia_get_name( $track ) . '</th>'; 
              }
            $markup .= '</tr>';
          $markup .= '</thead>';

          $markup .= '<tbody>';
            foreach( $day[ 'slots' ] as $slot_index=>$slot ) {
              if ( isset( $slot[ 'shared' ] ) && $slot[ 'shared' ] ) {
                $isShared = true;
              } else {
                $isShared = false;
              }
              $markup .= '<tr class="slot">';
                $markup .= '<th class="slot-name" scope="row">';
                  $markup .= appia_get_name( $slot );
                $markup .= '</th>';
                foreach ( $tracks as $track_index=>$track ) {
                  $track_name = appia_get_name( $track );
                  $track_clean = preg_replace( '/\W+/', '-', strtolower( strip_tags( $track_name ) ) );
                  $track_slug = $track_clean . ' track-' . ( $track_index + 1 );
                $stored = appia_sessions( $sessions, $slot_index, $track_index );

                if ( $isShared ) {
                  $markup .= '<td class="slot-dropzone" rowspan="' . $numTracks . '">';
                } else {
                  $markup .= '<td class="slot-dropzone">';
                }
                foreach ( $stored as $sesh ) {
                  $sesh_id = intval( $sesh );
                  $sesh_name = get_the_title( $sesh_id );
                  $sesh_page_url = get_permalink( $sesh_id );

                  $sesh_speakers = array();
                  $sesh_desc = '';
                  $sesh_watch_link = '';

                  if ( appia_in_schedule( 'speakers' ) ) {
                    $sesh_speakers = appia_get_meta( $sesh_id, 'post_sesh_meta_speakers' );
                  }
                  if ( appia_in_schedule( 'description' ) ) {
                    $sesh_desc = get_post_meta( $sesh_id, 'post_sesh_meta_desc', true );
                  }
                  if ( appia_in_schedule( 'link-to-recording' ) ) {
                    $sesh_watch_link = get_post_meta( $sesh_id, 'post_sesh_meta_link', true );
                  }
                  $markup .= '<div class="session">';
                    $markup .= '<div class="session-name">';
                      $markup .= '<a href="' . esc_url( $sesh_page_url ) . '" '
                        . 'class="session-name-link" '
                        . 'aria-label="Open detailed page for ' . $sesh_name . '">';
                        $markup .= $sesh_name;
                      $markup .= '</a>';
                    $markup .= '</div>'; // end .session-name

                    if ( $sesh_watch_link != '' ) {
                      $markup .= '<div class="watch-session">';
                        $markup .= '<a href="' . $sesh_watch_link . '" '
                                   . 'aria-label="Link to join '
                                   . $sesh_name . '">';
                          $markup .= 'Join session';
                        $markup .= '</a>';
                      $markup .= '</div>';
                    }

                    if ( $sesh_desc != '' ) {
                      $markup .= '<div class="session-desc">';
                        $markup .= $sesh_desc;
                      $markup .= '</div>';
                    }

                    if ( count( $sesh_speakers ) > 0 ) {
                      $markup .= '<div class="session-speakers" style="white-space: pre-wrap;">';
                        foreach( $sesh_speakers as $speaker_id ) {
                          $img = get_post_meta( $speaker_id, 'post_speaker_meta_img_url', true );
                          $role = get_post_meta( $speaker_id, 'post_speaker_meta_role', true );
                          $name = get_the_title( $speaker_id );
                          $permalink = get_permalink( $speaker_id );

                          $markup .= '<div class="session-speaker">';
                            $markup .= '<a class="session-speaker-link" href="' . esc_url( $permalink ) . ' "' . 'aria-label="' . $name . ' profile">';

                              if ( $img != '' ) {
                                $markup .= '<div class="speaker-img">';
                                  $markup .= '<img src="' . esc_url( $img ) . '" alt="' . $name . '">';
                                $markup .= '</div>';
                              }
                              
                              $markup .= '<div class="speaker-info">';
                                
                                $markup .= '<div class="speaker-name">';
                                  $markup .= $name;
                                $markup .= '</div>';

                                $markup .= '<div class="speaker-role">';
                                  $markup .= $role;
                                $markup .= '</div>';

                              $markup .= '</div>';

                            $markup .= '</a>';
                          $markup .= '</div>'; // .session-speaker
                        }
                      $markup .= '</div>';
                    }
                    
                  $markup .= '</div>'; // end session
                }
                $markup .= '</div>'; // end slot-dropzone
              }
              $markup .= '</tr>'; // end slot
            }
          $markup .= '</tbody>';
        $markup .= '</table>';
      $markup .= '</section>';
    }
  $markup .= '</div>'; // .schedule-container
  return $markup;
}
