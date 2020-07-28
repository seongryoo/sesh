<?php

// Register sessions post type
function appia_register_sesh() {
  $labels = array(
    'name'                    => 'Sessions',
    'singular_name'           => 'Session',
    'menu_name'               => 'Sessions',
    'name_admin_bar'          => 'Session',
    'add_new'                 => 'Add New',
    'add_new_item'            => 'Add New Session',
    'new_item'                => 'New Session',
    'edit_item'               => 'Edit Session',
    'view_item'               => 'View Session',
    'all_items'               => 'All Sessions',
    'not_found'               => 'No sessions found.',
    'not_found_in_trash'      => 'No sessions found in Trash.',
    'archives'                => 'Session archives',
    'filter_items_list'       => 'Filter sessions list',
    'items_list_navigation'   => 'Sessions list navigation',
    'items_list'              => 'Sessions list',
  );

  $args = array(
    'labels'                  => $labels,
    'public'                  => true,
    'menu_icon'               => 'dashicons-tickets-alt',
    'show_in_rest'            => true,
    'publicly_queryable'      => true,
    'rest_controller_class'   => 'WP_REST_Posts_Controller',
    'rewrite'                 => array( 'slug' => 'session' ),
  );

  register_post_type( 'post_sesh', $args );

  $supports = array(
    'custom-fields',
  );
  add_post_type_support( 'post_sesh', $supports );
}
add_action( 'init', 'appia_register_sesh' );

// Register custom meta
function appia_register_sesh_meta() {
  $single = array(
    'show_in_rest'            => true,
    'single'                  => true,
    'type'                    => 'string',
  );

  $multi = array(
    'show_in_rest'            => true,
    'single'                  => false,
    'type'                    => 'string',
  );

  register_post_meta( 'post_sesh', 'post_sesh_meta_speakers', $single );
  register_post_meta( 'post_sesh', 'post_sesh_meta_desc', $single );
  register_post_meta( 'post_sesh', 'post_sesh_meta_link', $single );
}
add_action( 'init', 'appia_register_sesh_meta' );

function appia_register_sesh_data_block_template() {
  $sesh_object = get_post_type_object( 'post_sesh' );
  $sesh_object->template = array(
    array( 'appia/sesh-data' ),
  );
  $sesh_object->template_lock = 'all';
}

add_action( 'init', 'appia_register_sesh_data_block_template' );

function appia_flush_sessions() {
  appia_register_sesh();
  flush_rewrite_rules();
}
register_activation_hook( PLUGIN_FILE_URL, 'appia_flush_sessions' );

function appia_deflush_sessions() {
  flush_rewrite_rules();
}
register_deactivation_hook( PLUGIN_FILE_URL, 'appia_deflush_sessions' );