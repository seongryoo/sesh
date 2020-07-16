<?php

/**
 * Plugin Name: Sesh Scheduler
 */

// Assets file loads in js and css needed to render blocks in WP editor
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-assets.php');

// Block-render file loads in php files needed for any custom block-based rendering
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-block-render.php');

// Block-categories file handles block category registration
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-block-categories.php');

// Custom posts files connects php files which register individual custom post types
include( plugin_dir_path( __FILE__ ) . 'includes/sesh-custom-posts.php');