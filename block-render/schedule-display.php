<?php
/* Registration  ----------------------- */

function appia_register_display_block() {
  if ( ! function_exists( 'register_block_type' ) ) {
    return;
  }
  
  $register_args = array(
    'attributes' => array(
      'schedule' => array(
        'type' => 'string',
      ),
    ),
    'render_callback' => 'appia_display_block_render',
  );

  register_block_type( 'appia/schedule-display', $register_args );

}

add_action( 'init', 'appia_register_display_block' );

function is_multiday( $slots ) {
  foreach ( $slots as $slot ) {
    if ( isset( $slot['day'] ) && $slot['day'] ) {
      return true;
    }
  }
  return false;
}

function slots_to_days( $slots ) {
  if ( is_multiday( $slots ) ) {
    $new_day = array(
      'day_info' => array(),
      'slots' => array(),
      'offset' => 0,
    );
    $slots_by_day = array(
      $new_day,
    );
    $current_day_num = 0;
    foreach ( $slots as $offset=>$slot ) {
      // "Days" of a conference are represented as slots with 
      // a day attribute set to true.
      if ( isset( $slot[ 'day' ] ) && $slot[ 'day' ] ) {
        // Increment current day number
        $current_day_num++;
        // Create new day data frame
        $new_day = array(
          // Store information about day (title, caption, etc.)
          'day_info' => $slot,
          'slots' => array(),
          'offset' => $offset + 1,
        );
        // Append to array of days
        $slots_by_day[] = $new_day;
      } else {
        // If slot is not a day and is a normal time slot...
        // add the time slot to the current day
        $slots_by_day[ $current_day_num ][ 'slots' ][] = $slot;
      }
    }
    return $slots_by_day;
  } else {
    // If multiday feature is not used
    $new_day = array(
      'day_info' => array(),
      // Lump all the slots into a single day
      'slots' => $slots,
      'offset' => 0,
    );
    $slots_by_day = array(
      $new_day,
    );
    return $slots_by_day;
  }
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

function appia_get_name( $table ) {
  $name = '';
  if ( isset( $table['name'] ) ) {
    $name = $table['name'];
  }
  return $name;
}

function render_session( $id, $options ) {
  $title = get_the_title( $id );
  $url = get_permalink( $id );
  $speakers = appia_get_meta( $id, 'post_sesh_meta_speakers' );
  $desc = get_post_meta( $id, 'post_sesh_meta_desc', true );
  $cta = get_post_meta( $id, 'post_sesh_meta_link', true );

  $markup = '';
  $markup .= '<div class="session">';

  if ( $options['clickable_events'] ) {
    $markup .= '<a href="' . esc_url( $url ) . '">';
      $markup .= esc_html( $title );
    $markup .= '</a>';
  } else {
    $markup .= esc_html( $title );
  }


  $markup .= '</div>';

  return $markup;
}

function render_day( $day_num, $day, $tracks, $sessions, $options ) {
  $day_info = $day[ 'day_info' ];
  $day_name = isset( $day_info['name'] ) && $day_info['name'] != '' ? $day_info['name'] : 'Day ' . ($day_num + 1);
  $day_desc = isset( $day_info['desc'] ) ? $day_info['desc'] : '';
  $num_tracks = count( $tracks );

  $markup = '';
  $markup .= '<div class="day">';
  $markup .= '<h3>' . esc_html( $day_name ) . '</h3>';
  if ( $day_desc != '' ) {
    $markup .= '<p>' . esc_html( $day_desc ) . '</p>';
  }

  $markup .= '<table class="day-schedule">';
  $markup .= '<caption>Events on ' . esc_html( $day_name ) . '</caption>';

  $markup .= '<thead class="tracks">';
    $markup .= '<tr>';
      // spacer
      $markup .= '<td></td>';
      foreach ( $tracks as $track ) {
        $markup .= '<th scope="col" class="track-name">' . appia_get_name( $track ) . '</th>';
      }
    $markup .= '</tr>';
  $markup .= '</thead>';

  $markup .= '<tbody>';
    foreach ( $day['slots'] as $slot_index => $slot ) {
      $is_shared;
      if ( isset( $slot['shared' ] ) && $slot['shared'] ) {
        $is_shared = true;
      } else {
        $is_shared = false;
      }
      $markup .= '<tr class="slot">';
        $markup .= '<th scope="row">';
          $markup .= appia_get_name( $slot );
        $markup .= '</th>';
        if ( $is_shared ) {
          $markup .= '<td colspan="' . $num_tracks . '">';
          // Only grab the sessions in the "first track"
          $slot_items = appia_sessions( $sessions, $day['offset'] + $slot_index, 0);
          $markup .= json_encode( $slot_items );
          foreach ( $slot_items as $sesh_id ) {
            $session = render_session( $sesh_id, $options );
            $markup .= $session;
          }
          $markup .= '</td>';
        } else {
          foreach ( $tracks as $track_num => $track ) {
            $markup .= '<td>';
            $slot_items = appia_sessions( $sessions, $day['offset'] + $slot_index, $track_num );
            $markup .= json_encode( $slot_items );
            foreach ( $slot_items as $sesh_id ) {
              $session = render_session( $sesh_id, $options );
              $markup .= $session;
            }
            $markup .= '</td>';
          }
        }
      $markup .= '</tr>';
    }
  $markup .= '</tbody>';
  $markup .= '</table>';
  $markup .= '</div>';
  return $markup;
}

/* Rendering -------------------------------------*/
function appia_display_block_render( $attributes ) {
  $json = $attributes['schedule'];
  $id = appia_parse( $json );

  $options = array(
    'clickable_events' => true,
    'show_speakers' => true,
    'show_desc' => true,
    'show_cta' => true,
    'cta_verb' => 'View',
  );

  $schedule_obj = get_post( $id );
  if ($schedule_obj == null) {
    return 'This schedule has either been deleted or does not exist: ' . $id;
  }

  $title = get_the_title( $id );
  $sessions = appia_get_meta( $id, 'post_sched_meta_sessions' );
  $tracks = appia_get_meta( $id, 'post_sched_meta_tracks' );
  $slots = appia_get_meta( $id, 'post_sched_meta_slots' );
  
  $slots_by_day = slots_to_days( $slots );

  $markup = '';
  $markup .= '<h2>Schedule</h2>';
  $markup .= json_encode( $slots_by_day );

  foreach ( $slots_by_day as $day_num => $day ) {
    $markup .= render_day( $day_num, $day, $tracks, $sessions, $options );
  }

  return $markup;
}
