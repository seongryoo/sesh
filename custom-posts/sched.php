<?php

// Register schedule post type
function appia_register_sched() {
  $labels = array(
    'name'                    => 'Schedules',
    'singular_name'           => 'Schedule',
    'menu_name'               => 'Schedules',
    'name_admin_bar'          => 'Schedule',
    'add_new'                 => 'Add New',
    'add_new_item'            => 'Add New Schedule',
    'new_item'                => 'New Schedule',
    'edit_item'               => 'Edit Schedule',
    'view_item'               => 'View Schedule',
    'all_items'               => 'All Schedules',
    'not_found'               => 'No schedules found.',
    'not_found_in_trash'      => 'No schedules found in Trash.',
    'archives'                => 'Schedule archives',
    'filter_items_list'       => 'Filter schedules list',
    'items_list_navigation'   => 'Schedules list navigation',
    'items_list'              => 'Schedules list',
  );

  $args = array(
    'labels'                  => $labels,
    'public'                  => true,
    'menu_icon'               => 'dashicons-index-card',
    'show_in_rest'            => true,
    'publicly_queryable'      => true,
    'rewrite'                 => array( 'slug' => 'schedule' ),
  );

  register_post_type( 'post_sched', $args );

  $supports = array(
    'custom-fields',
  );
  add_post_type_support( 'post_sched', $supports );
}
add_action( 'init', 'appia_register_sched' );

// Register custom meta
function appia_register_sched_meta() {
  $multi_array = array(
    'show_in_rest'            => true,
    'single'                  => true,
    'type'                    => 'string',
  );

  register_post_meta( 'post_sched', 'post_sched_meta_tracks', $multi_array );
  register_post_meta( 'post_sched', 'post_sched_meta_slots', $multi_array );
  register_post_meta( 'post_sched', 'post_sched_meta_sessions', $multi_array );
}
add_action( 'init', 'appia_register_sched_meta' );

function appia_register_sched_data_block_template() {
  $sched_object = get_post_type_object( 'post_sched' );
  $sched_object->template = array(
    array( 'appia/sched-data' ),
  );
  $sched_object->template_lock = 'all';
}
add_action( 'init', 'appia_register_sched_data_block_template' );

function appia_flush_schedules() {
  appia_register_sched();
  flush_rewrite_rules();
}
register_activation_hook( PLUGIN_FILE_URL, 'appia_flush_schedules' );

function appia_deflush_schedules() {
  flush_rewrite_rules();
}
register_deactivation_hook( PLUGIN_FILE_URL, 'appia_deflush_schedules' );