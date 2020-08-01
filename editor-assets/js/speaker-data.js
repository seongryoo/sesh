(function(wp, scriptData) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const TextareaControl = wp.components.TextareaControl;
  const RichText = wp.blockEditor.RichText;
  const Button = wp.components.Button;
  const MediaUpload = wp.blockEditor.MediaUpload;
  const MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
  const speakerEdit = function(props) {
    // Helper method that generates appia field wrapper
    const elWrap = function(element, args, value) {
      let generatedElement;
      if (arguments.length == 3) {
        generatedElement = el(element, args, value);
      } else if (arguments.length == 2) {
        generatedElement = el(element, args);
      } else if (arguments.length == 1) {
        generatedElement = el(element);
      }
      return el(
          'div',
          {
            className: 'appia-field-block',
          },
          generatedElement
      );
    }; // End elWrap()
    // Role/title field
    const roleArgs = {
      onChange: function(value) {
        props.setAttributes({role: value});
      },
      label: 'Position/affiliated organization descriptions:',
      placeholder: 'Start typing...',
      className: 'appia-input__text',
      value: props.attributes.role,
    };
    const roleWrapped = elWrap(TextareaControl, roleArgs);
    // Profile link field
    const linkArgs = {
      onChange: function(value) {
        props.setAttributes({link: value});
      },
      label: 'Link to speaker personal website or profile:',
      placeholder: 'Enter a URL...',
      className: 'appia-input__text',
      value: props.attributes.link,
    };
    const linkWrapped = elWrap(TextControl, linkArgs);
    // Image attribute
    const placeHolderUrl = scriptData.pluginUrl + 'editor-assets/img/image.png';
    // Upload icon
    const dashiUpload = el(
        'span',
        {
          'className': 'dashicons dashicons-upload',
          'aria-hidden': 'true',
        },
        ''
    );
    // Rendering for button elements
    const renderImgButton = function({open}) {
      return el(
          Button,
          {onClick: open, id: 'imgButton', className: 'upload-button'},
          [dashiUpload, 'Upload file']
      );
    };
    const updateImg = function(media) {
      props.setAttributes({
        img_id: media.id,
        img_url: media.url,
      });
    };
    const imgUploadArgs = {
      onSelect: updateImg,
      value: props.attributes.img_id,
      render: renderImgButton,
    };
    const img = el(
        MediaUpload,
        imgUploadArgs
    );
    // Final elements: imgWrapped, imgLabel, imgDisplay
    const imgWrapped = el(
        MediaUploadCheck,
        {},
        img
    );
    const imgLabel = el(
        'label',
        {
          for: 'imgButton',
        },
        'Speaker image:'
    );
    const imgDisplay = el(
        'img',
        {
          id: 'img-display',
          class: 'uploaded-image-display',
          src: props.attributes.img_url != '' ?
            props.attributes.img_url : placeHolderUrl,
        }
    );
    // Combined image block
    const uploadImageBlock = elWrap(
        'div',
        {
          className: 'upload-image',
        },
        [imgLabel, imgWrapped, imgDisplay]
    );
    // Description field
    const descArgs = {
      onChange: function(value) {
        props.setAttributes({desc: value});
      },
      value: props.attributes.desc,
      multiline: true,
      className: 'appia-input__rich-text',
      id: 'appia-speaker-desc',
      placeholder: 'Start typing...',
    };
    const desc = el(
        RichText,
        descArgs
    );
    const descLabel = el(
        'label',
        {
          for: 'appia-speaker-desc',
        },
        'Speaker description:'
    );
    const descWrapped = elWrap('div', {}, [descLabel, desc]);
    // Final element
    return el(
        'div',
        {
          className: 'appia-blocks',
        },
        [roleWrapped, linkWrapped, uploadImageBlock, descWrapped]
    );
  }; // End speakerEdit()
  const speakerArgs = {
    title: 'Speaker Data',
    category: 'appia-blocks',
    icon: 'businesswoman',
    edit: speakerEdit,
    save: function(props) {
      return null;
    },
  };
  registerBlock('appia/speaker-data', speakerArgs);
})(window.wp, window.scriptData);
