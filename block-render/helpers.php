<?php

function appia_get_meta( $id, $meta_name ) {
  $the_string = get_post_meta( $id, $meta_name, true );
  return appia_parse( $the_string );
}

function appia_parse( $the_string ) {
  $cleaned = utf8_encode( $the_string );
  $the_object = json_decode( $cleaned, true );
  $the_data = array();
  if ( isset( $the_object['data'] ) ) {
    $the_data = $the_object['data'];
  }
  return $the_data;
}