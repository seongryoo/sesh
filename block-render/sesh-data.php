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

  if ( $speakers != '' ) {
    $speaker_array = explode( "\n", $speakers );
    $markup .= '<div class="speakers-container session-section">';

      $markup .= '<div class="session-section-title">';
        $markup .= 'Speakers';
      $markup .= '</div>';

      $markup .= '<div class="session-speakers">';
        foreach( $speaker_array as $speaker_line) {
          if ( $speaker_line != '' ) {   
            $markup .= '<div class="session-speaker">';
              $markup .= $speaker_line;
            $markup .= '</div>';
          }
        }
      $markup .= '</div>';
    $markup .= '</div>';
  }
    
  if ( $link != '' ) {
    $markup .= '<div class="session-link session-section">';

      $markup .= '<div class="session-section-title">';
        $markup .= 'Session link';
      $markup .= '</div>';

      $markup .= '<a href="' . $link . '" '
                  . 'aria-label="Watch recording of session '
                  . $name
                  . '">' . $link;
      $markup .= '</a>';
    $markup .= '</div>';
  }
    
  if ( $desc != '' ) {
    $markup .= '<div class="session-desc session-section">';

      $markup .= '<div class="session-section-title">';
        $markup .= 'Session Description';
      $markup .= '</div>';

      $markup .= $desc;
    $markup .= '</div>';
  }
    

  $markup .= '</div>';

  return $markup;
}
