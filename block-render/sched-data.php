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

// function appia_get_table_name( $tables, $index ) {
//   $name = '';
//   if ( count( $tables ) > $index ) {
//     $the_object = $tables[ $index ];
//     appia_get_name( $the_object );
//   }
//   return $name;
// }

// function appia_get_name( $table ) {
//   $name = '';
//   if ( isset( $table['name'] ) ) {
//     $name = $table['name'];
//   }
//   return $name;
// }

// function appia_sessions( $all_sessions, $slot_num, $track_num ) {
//   $the_sessions = array();
//   if ( isset( $all_sessions[ $slot_num ] ) ) {
//     $slot = $all_sessions[ $slot_num ];
//     if ( isset( $slot[ $track_num ] ) ) {
//       $the_sessions = $slot[ $track_num ];
//     }
//   }
//   return $the_sessions;
// }

// function appia_in_schedule( $field_name ) {
//   global $show_in_schedule;
//   if ( isset( $show_in_schedule[ $field_name ] ) && $show_in_schedule[ $field_name ] == true ) {
//     return true;
//   } else {
//     return false;
//   }
// }

function appia_sched_data_block_render( $attributes ) {
  return '';
}
