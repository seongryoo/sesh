(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const TextareaControl = wp.components.TextareaControl;
  const seshEdit = function(props) {
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
    };
    // Session link
    const linkArgs = {
      onChange: function(value) {
        props.setAttributes({link: value});
      },
      label: 'Link to session videos/files:',
      placeholder: 'Enter a URL...',
      className: 'appia-input__text',
      value: props.attributes.link,
    };
    const link = elWrap(TextControl, linkArgs);
    const speakersArgs = {
      onChange: function(value) {
        props.setAttributes({speakers: value});
      },
      label: 'Speaker list:',
      help: 'Type a list of names, starting a new line for each new person',
      placeholder: 'Type here...',
      value: props.attributes.speakers,
    };
    const speakers = elWrap(TextareaControl, speakersArgs);
    // Description field
    const descArgs = {
      onChange: function(value) {
        props.setAttributes({desc: value});
      },
      value: props.attributes.desc,
      multiline: true,
      className: 'appia-input__rich-text',
      id: 'sesh-desc',
      placeholder: 'Start typing...',
    };
    const desc = el(
        wp.blockEditor.RichText,
        descArgs
    );
    const descLabel = el(
        'label',
        {
          for: 'sesh-desc',
        },
        'Session description:'
    );
    const descWrapped = elWrap('div', {}, [descLabel, desc]);
    // const descLabelled = el(
    //     'div',
    //     {
    //       className: 'appi-field appia-field-text',
    //     },
    //     [descLabel, desc]
    // );
    // const descWrapped = el(
    //     'div',
    //     {
    //       className: 'appia-field-wrapper appia-field-desc',
    //     },
    //     descLabelled
    // );
    // The final element
    return el(
        'div',
        {
          className: 'appia-blocks',
        },
        [link, speakers, descWrapped]
    );
  };

  const seshArgs = {
    title: 'Session Data',
    category: 'appia-blocks',
    icon: 'tickets-alt',
    // attributes: {
    //   speakers: {
    //     type: 'string',
    //     source: 'meta',
    //     meta: 'post_sesh_meta_speakers',
    //   },
    //   desc: {
    //     type: 'string',
    //     source: 'meta',
    //     meta: 'post_sesh_meta_desc',
    //   },
    //   link: {
    //     type: 'string',
    //     source: 'meta',
    //     meta: 'post_sesh_meta_link',
    //   },
    // }, /* End attributes */
    edit: seshEdit,
    save: function(props) {
      return null;
    },
  }; /* End seshArgs */
  registerBlock('appia/sesh-data', seshArgs);
})(window.wp);
