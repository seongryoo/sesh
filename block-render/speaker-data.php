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
    'editor_script' => 'appia-speaker-data',
    'render_callback' => 'appia_speaker_data_block_render',
  );

  register_block_type( 'appia/speaker-data', $register_args );
}
add_action( 'init', 'appia_register_speaker_data_block' );

// Rendering
function appia_speaker_data_block_render( $attributes ) {

  global $post;
  $id = $post->ID;

  $name = get_the_title( $id );
  $role = get_post_meta( $id, 'post_speaker_meta_role', true );
  $img_url = get_post_meta( $id, 'post_speaker_meta_img_url', true);
  $link = get_post_meta( $id, 'post_speaker_meta_link', true);
  $desc = get_post_meta( $id, 'post_speaker_meta_desc', true);

  $markup = '';

  $markup .= '<div class="appia-speaker">';

    if ( $img_url != '' ) {
      $markup .= '<img src="' . $img_url . '" aria-label="' . $name . '" class="appia-speaker-image">';
    }

    if ( $role != '' ) {
      $markup .= '<div class="appia-speaker-role>';
        $markup .= $role;
      $markup .= '</div>';
    }

    if ( $link != '' ) {
      $markup .= '<a href="' . esc_url( $link ) . '" aria-label="Open website of ' . $name . '" class="appia-speaker-site">';
        $markup .= 'Website';
      $markup .= '</a>';
    }


    if ( $desc != '' ) {
      $markup .= '<div class="appia-speaker-desc">';
        $markup .= $desc;
      $markup .= '</div>';
    }

  $markup .= '</div>';
  return $markup;
}