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

function appia_get_meta( $id, $meta_name ) {
  $the_string = get_post_meta( $id, $meta_name, true );
  $cleaned = utf8_encode( $the_string );
  $the_object = json_decode( $cleaned, true );
  $the_data = array();
  if ( isset( $the_object['data'] ) ) {
    $the_data = $the_object['data'];
  }
  return $the_data;
}

function appia_get_table_name( $tables, $index ) {
  $name = '';
  if ( count( $tables ) > $index ) {
    $the_object = $tables[$index];
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
  if ( isset( $all_sessions[$slot_num] ) ) {
    $slot = $all_sessions[$slot_num];
    if ( isset( $slot[$track_num] ) ) {
      $the_sessions = $slot[$track_num];
    }
  }
  return $the_sessions;
}

function appia_sched_data_block_render( $attributes ) {
  global $post;
  $id = $post->ID;

  $sessions = appia_get_meta( $id, 'post_sched_meta_sessions' );
  $tracks = appia_get_meta( $id, 'post_sched_meta_tracks' );
  $slots = appia_get_meta( $id, 'post_sched_meta_slots' );
  
  $markup = '';

  $markup .= '<div class="tracks-container">';
    $markup .= '<div class="track-offset"></div>';

    foreach( $tracks as $track ) {
      $markup .= '<div class="track">';
        $markup .= appia_get_name( $track );
      $markup .= '</div>';
    }

  $markup .= '</div>'; // end tracks-container

  $markup .= '<div class="slots-container">';
    foreach( $slots as $slot_index=>$slot ) {
      $markup .= '<div class="slot">';
        $markup .= '<div class="slot-name">';
          $markup .= appia_get_name( $slot );
        $markup .= '</div>'; // end slot-name

        $markup .= '<div class="slot-dropzones-container">';
          foreach( $tracks as $track_index=>$track ) {
            $stored = appia_sessions( $sessions,
                                      $slot_index,
                                      $track_index );
            foreach( $stored as $sesh ) {
              $sesh_id = intval( $sesh );
              $sesh_name = get_the_title( $sesh_id );
              $sesh_speakers = get_post_meta( $sesh_id, 'post_sesh_meta_speakers', true );
              $sesh_desc = get_post_meta( $sesh_id, 'post_sesh_meta_desc', true );
              $sesh_watch_link = get_post_meta( $sesh_id, 'post_sesh_meta_link', true );
              $sesh_page_url = get_permalink( $sesh_id );

                $markup .= '<div class="session">';

                  $markup .= '<div class="session-name">';
                    $markup .= '<a href="' . $sesh_page_url . '" '
                               . 'class="session-name-link" '
                               . 'aria-label="Open detailed page for ' . $sesh_name . '">';
                      $markup .= $sesh_name;
                    $markup .= '</a>';
                  $markup .= '</div>';

                  $markup .= '<div class="track-number">';
                    $markup .= 'Track ' . ( $track_index + 1 );
                  $markup .= '</div>';

                  $markup .= '<div class="watch-session">';
                    $markup .= '<a href="' . $sesh_watch_link . '" '
                               . 'aria-label="Watch a recording of '
                               . $sesh_name . '">';
                      $markup .= 'Watch recording';
                    $markup .= '</a>';
                  $markup .= '</div>';

                  $markup .= '<div class="session-speakers">';
                    $markup .= $sesh_speakers;
                  $markup .= '</div>';

                  $markup .= '<div class="session-desc">';
                    $markup .= $sesh_desc;
                  $markup .= '</div>';
                $markup .= '</div>';

            }
            // var_dump( $sessions );

          }
        $markup .= '</div>';
      $markup .= '</div>';
    }
  
  return $markup;
}
