(function(wp, scriptData) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
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

    const generateTextField = function(attribute, label) {
      const elText = elWrap(
          TextControl,
          {
            value: props.attributes[attribute],
            onChange: function(value) {
              props.setAttributes({
                [attribute]: value,
                className: 'appia-input__text',
              });
            },
            placeholder: 'Start typing...',
            label: label,
          }
      );
      return elText;
    };
    const generateRichText = function(attribute, label) {
      const elText = el(
          RichText,
          {
            value: props.attributes[attribute],
            onChange: function(value) {
              props.setAttributes({
                [attribute]: value,
              });
            },
            placeholder: 'Start typing...',
            id: 'richtext-' + attribute,
            className: 'appia-input__rich-text',
            multiline: true,
          }
      );
      const elHint = el(
          'p',
          {
            className: 'hint',
          },
          'Hint: you can insert links or use bold/italic text'
      );
      const elLabel = el(
          'label',
          {
            for: 'richtext-' + attribute,
          },
          label
      );
      return elWrap(
          'div',
          {},
          [elLabel, elHint, elText]
      );
    };
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
    const role = generateRichText('role', 'Position or affiliated organization(s)');
    const profile = generateTextField('link', 'Link to speaker\'s personal website or profile');
    const desc = generateRichText('desc', 'Speaker description');
    // Final element
    return el(
        'div',
        {
          className: 'appia-blocks',
        },
        [role, profile, uploadImageBlock, desc]
    );
  }; // End speakerEdit()
  const speakerArgs = {
    title: 'Speaker Data',
    category: 'appia-blocks',
    icon: 'id',
    edit: speakerEdit,
    save: function(props) {
      return null;
    },
  };
  registerBlock('appia/speaker-data', speakerArgs);
})(window.wp, window.scriptData);
