<?php

// Loading appia block assets (js files and administrative css)
function appia_load_block_assets() {
  $scripts = array(
    'drag',
    'sesh-data',
    'sched-data',
  );
  $wp_deps = array(
    'wp-blocks',
    'wp-i18n',
    'wp-editor',
    'wp-date',
  );
  foreach( $scripts as $slug ) {
    $script_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../editor-assets/js/' . $slug . '.js';
    wp_enqueue_script( $script_name, $url, $wp_deps );
  }

  $styles = array(
    'admin',
    'schedule-admin',
  );
  foreach( $styles as $slug ) {
    $style_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../editor-assets/css/' . $slug . '.css';
    wp_enqueue_style( $style_name, $url );
  }
  wp_enqueue_style( 'dashicons' );
}
add_action( 'enqueue_block_editor_assets', 'appia_load_block_assets' );

// Load in assets related to frontend rendering of custom posts
function appia_load_render_assets() {
  $styles = array(
    'schedule-render',
  );
  foreach( $styles as $slug ) {
    $style_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../render-assets/css/' . $slug . '.css';
    wp_enqueue_style( $style_name, $url );
  }
}
add_action( 'wp_enqueue_scripts', 'appia_load_render_assets' );