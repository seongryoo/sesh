<?php

// Register speakers post type
function appia_register_speaker() {
  $labels = array(
    'name'                    => 'Speakers',
    'singular_name'           => 'Speaker',
    'menu_name'               => 'Speakers',
    'name_admin_bar'          => 'Speaker',
    'add_new'                 => 'Add New',
    'add_new_item'            => 'Add New Speaker',
    'new_item'                => 'New Speaker',
    'edit_item'               => 'Edit Speaker',
    'view_item'               => 'View Speaker',
    'all_items'               => 'All Speakers',
    'not_found'               => 'No speakers found.',
    'not_found_in_trash'      => 'No speakers found in Trash.',
    'archives'                => 'Speaker archives',
    'filter_items_list'       => 'Filter speakers list',
    'items_list_navigation'   => 'Speakers list navigation',
    'items_list'              => 'Speakers list',
  );

  $args = array(
    'labels'                  => $labels,
    'public'                  => true,
    'menu_icon'               => 'dashicons-businesswoman',
    'show_in_rest'            => true,
    'publicly_queryable'      => true,
    'rest_controller_class'   => 'WP_REST_Posts_Controller',
    'rewrite'                 => array( 'slug' => 'speaker' ),
  );

  register_post_type( 'post_speaker', $args );

  $supports = array(
    'custom-fields',
  );
  add_post_type_support( 'post_speaker', $supports );
}
add_action( 'init', 'appia_register_speaker' );

// Register custom meta
function appia_register_speaker_meta() {
  $string_args = array(
    'show_in_rest'            => true,
    'single'                  => true,
    'type'                    => 'string',
  );
  $strings = array(
    'role',
    'img_url',
    'desc',
    'link',
  );
  foreach ( $strings as $slug ) {
    $full_slug = 'post_speaker_meta_' . $slug;
    register_post_meta( 'post_speaker', $full_slug, $string_args );
  }

  $num_args = array(
    'show_in_rest'            => true,
    'single'                  => true,
    'type'                    => 'number',
  );
  $numbers = array(
    'img_id',
  );
  foreach( $numbers as $slug ) {
    $full_slug = 'post_speaker_meta_' . $slug;
    register_post_meta( 'post_speaker', $full_slug, $num_args );
  }
}
add_action( 'init', 'appia_register_speaker_meta' );

function appia_speaker_change_title_text( $title ) {
  $screen = get_current_screen();

  if ( 'post_speaker' == $screen->post_type ) {
    $title = 'Enter speaker\'s full name';
  }

  return $title;
}
add_filter( 'enter_title_here', 'appia_speaker_change_title_text' );

function appia_register_speaker_data_block_template() {
  $speaker_object = get_post_type_object( 'post_speaker' );
  $speaker_object->template = array(
    array( 'appia/speaker-data' ),
  );
  $speaker_object->template_lock = 'all';
}
add_action( 'init', 'appia_register_speaker_data_block_template' );

function appia_flush_speakers() {
  appia_register_speaker();
  flush_rewrite_rules();
}
register_activation_hook( PLUGIN_FILE_URL, 'appia_flush_speakers' );

function appia_deflush_speakers() {
  flush_rewrite_rules();
}
register_deactivation_hook( PLUGIN_FILE_URL, 'appia_deflush_speakers' );