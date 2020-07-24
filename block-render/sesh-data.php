<?php
/* Registration  ----------------------- */

function appia_register_sesh_data_block() {
  if ( ! function_exists( 'register_block_type' ) ) {
    return;
  }
  
  $register_args = array(
    'attributes' => array(
      'speakers' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_sesh_meta_speakers', 
      ),
      'desc' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_sesh_meta_desc', 
      ),
      'link' => array(
        'type' => 'string',
        'source' => 'meta',
        'meta' => 'post_sesh_meta_link', 
      ),
    ),
    'render_callback' => 'appia_sesh_data_block_render',
  );

  register_block_type( 'appia/sesh-data', $register_args );

}

add_action( 'init', 'appia_register_sesh_data_block' );


/* Rendering -------------------------------------*/
function appia_sesh_data_block_render( $attributes ) {
  global $post;
  $id = $post->ID;

  $name = get_the_title( $id );
  $speakers = get_post_meta( $id, 'post_sesh_meta_speakers', true);
  $desc = get_post_meta( $id, 'post_sesh_meta_desc', true);
  $link = get_post_meta( $id, 'post_sesh_meta_link', true);

  $markup = '';
  $markup .= '<div class="session-post">';

    $markup .= '<div class="session-speakers" style="white-space: pre-wrap;">';
      $markup .= $speakers;
    $markup .= '</div>';

    $markup .= '<div class="session-link">';
      $markup .= '<a href="' . $link . '" '
                  . 'aria-label="Watch recording of session '
                  . $name
                  . '">' . $link;
      $markup .= '</a>';
    $markup .= '</div>';

    $markup .= '<div class="session-desc">';
      $markup .= $desc;
    $markup .= '</div>';

  $markup .= '</div>';

  return $markup;
}
