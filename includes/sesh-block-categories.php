<?php

// Creating block categories for appia

function appia_block_categories( $categories, $post ) {
  $appia_cat = array(
    'slug' => 'appia-blocks',
    'title' => __( 'Appia Schedule Blocks', 'appia-blocks' ),
    'icon' => 'dashicons-calendar',
  );

  return array_merge(
    $categories,
    array(
      $appia_cat,
    )
  );
}

add_filter( 'block_categories_all', 'appia_block_categories', 10, 2 );