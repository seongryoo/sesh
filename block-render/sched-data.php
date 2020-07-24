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
  $the_data = $the_object['data'];
  return $the_data;
}

function appia_sched_data_block_render( $attributes ) {
  global $post;
  $id = $post->ID;
  $sessions = appia_get_meta( $id, 'post_sched_meta_sessions' );
  var_dump( $sessions );
  $markup = 'no';
  $markup .= $id;
  // $markup .= $sessionsJSON;
  
  return $markup;
}
