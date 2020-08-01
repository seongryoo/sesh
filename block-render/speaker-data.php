<?php
// Registration

function appia_register_speaker_data_block() {
  if ( ! function_exists( 'register_block_type' ) ) {
    return;
  }

  $register_args = array(
    'attributes' => array(
      'role' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_speaker_meta_role',
      ),
      'img_id' => array(
        'type' => 'number',
        'source' => 'meta',
        'meta' => 'post_speaker_meta_img_id',
      ),
      'img_url' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_speaker_meta_img_url',
      ),
      'desc' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_speaker_meta_desc',
      ),
      'link' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_speaker_meta_link',
      ),
    ),
    'render_callback' => 'appia_speaker_data_block_render',
  );

  register_block_type( 'appia/speaker-data', $register_args );
}
add_action( 'init', 'appia_register_speaker_data_block' );

// Rendering
function appia_speaker_data_block_render( $attributes ) {
  return 'what';
}