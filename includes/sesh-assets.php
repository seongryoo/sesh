<?php

$script_modules = array(
  'guten-helpers',
  'attr-helpers',
  'ui-wrappers',
  'fetch-posts',
  'autocomplete-sessions',
  'slot-form',
  'sesh-data',
  'sched-data',
  'speaker-data',
);

// Add type="module" to scripts
function appia_scripts_to_modules( $tag, $handle, $src ) {
  global $script_modules;
  foreach( $script_modules as $module ) {
    $the_handle = 'appia-' . $module;
    if ( $the_handle == $handle ) {
      return '<script type="module" src="' . esc_url( $src ) . '"></script>';
    }
  }
  return $tag;
}
add_filter('script_loader_tag', 'appia_scripts_to_modules' , 10, 3);

// Loading appia block assets (js files and administrative css)
function appia_load_block_assets() {
  global $script_modules;
  $wp_deps = array(
    'wp-blocks',
    'wp-i18n',
    'wp-editor',
    'wp-date',
  );
  foreach( $script_modules as $slug ) {
    $script_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../editor-assets/js/' . $slug . '.js';
    wp_enqueue_script( $script_name, $url, $wp_deps );
  }
  wp_localize_script( 
    'appia-speaker-data', 
    'scriptData', 
    array(
      'pluginUrl' => plugin_dir_url( __FILE__ ) . '../',
    ) 
  );
  wp_localize_script( 
    'appia-sesh-data', 
    'scriptData', 
    array(
      'pluginUrl' => plugin_dir_url( __FILE__ ) . '../',
    ) 
  );

  wp_enqueue_style( 'dashicons' );
  $styles = array(
    'admin',
    'schedule-admin',
  );
  foreach( $styles as $slug ) {
    $style_name = 'appia-' . $slug;
    $url = plugin_dir_url( __FILE__ ) . '../editor-assets/css/' . $slug . '.css';
    wp_enqueue_style( $style_name, $url );
  }
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