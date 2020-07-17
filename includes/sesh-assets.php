<?php

// Loading appia block assets (js files and administrative css)
function appia_load_block_assets() {
  $scripts = array(
    'sesh-data',
    'sched-data',
  );
  $deps = array(
    'wp-blocks',
    'wp-i18n',
    'wp-editor',
    'wp-date',
  );
  foreach( $scripts as $slug ) {
    $script_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../assets/js/' . $slug . '.js';
    wp_enqueue_script( $script_name, $url, $deps );
  }

  $styles = array(
    'admin',
  );
  foreach( $styles as $slug ) {
    $style_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../assets/css/' . $slug . '.css';
    wp_enqueue_style( $style_name, $url );
  }
}

add_action( 'enqueue_block_editor_assets', 'appia_load_block_assets' );