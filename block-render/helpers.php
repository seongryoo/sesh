<?php

function appia_get_meta( $id, $meta_name ) {
  $the_string = get_post_meta( $id, $meta_name, true );
  $cleaned = utf8_encode( $the_string );
  $the_object = json_decode( $cleaned, true );
  $the_data = array();
  if ( isset( $the_object['data'] ) ) {
    $the_data = $the_object['data'];
  }
  return $the_data;
}