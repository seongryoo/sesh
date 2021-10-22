<?php

/**
 * Plugin Name: Sesh Scheduler
 */

// Edit this araay to customize what fields are displayed on the full schedule
// Field options:
//    speakers
//    description
//    link-to-recording
//    track-number
$show_in_schedule = array(
  'speakers'                  => true,
  'description'               => true,
  'link-to-recording'         => true,
  'track-number'              => true,
);

// Defines constant which is useful for register_activation hook
if ( ! defined( 'PLUGIN_FILE_URL' ) ) {
	define( 'PLUGIN_FILE_URL', __FILE__ );
}

// Assets file loads in js and css needed to render blocks in WP editor
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-assets.php');


// Block-categories file handles block category registration
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-block-categories.php');

// Block-render file loads in php files needed for any custom block-based rendering
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-block-render.php');


// Custom posts files connects php files which register individual custom post types
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-custom-posts.php');