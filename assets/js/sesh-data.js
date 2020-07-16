(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const seshEdit = function(props) {
    // Session name
    const nameArgs = {
      onChange: function(value) {
        props.setAttributes({name: value});
      },
      label: 'Session name:',
      placeholder: 'e.g. "Panel: Environmental justice during a pandemic"',
      value: props.attributes.name,
    };
    const name = el(TextControl, nameArgs);
    // Session link
    const linkArgs = {
      onChange: function(value) {
        props.setAttributes({link: value});
      },
      label: 'Link to session videos/files',
      placeholder: 'Enter a URL...',
      value: props.attributes.link,
    };
    const link = el(TextControl, linkArgs);
    // Speakers list
    const speakersArgs = {
      onChange: function(value) {
        props.setAttributes({speakers: value});
      },
      label: 'Speaker list:',
      help: 'Enter a list of names separated by commas.',
      placeholder: 'e.g. "Lorraine Hansberry, June Jordan"',
      value: props.attributes.speakers,
    };
    const speakers = el(TextControl, speakersArgs);
    // Description field
    const descArgs = {
      onChange: function(value) {
        props.setAttributes({desc: value});
      },
      value: props.attributes.desc,
      multiline: true,
      className: 'sesh-description',
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
    const descLabelled = el(
        'div',
        {
          className: 'components-base-control__field',
        },
        [descLabel, desc]
    );
    const descWrapped = el(
        'div',
        {
          className: 'components-base-control sesh-description-block',
        },
        descLabelled
    );
    // The final element
    return el(
        'div',
        {
          className: 'sesh-block',
        },
        [name, link, speakers, descWrapped]
    );
  };

  const seshArgs = {
    title: 'Session Data',
    category: 'appia-blocks',
    icon: 'calendar-alt',
    attributes: {
      name: {
        type: 'string',
        source: 'meta',
        meta: 'post_sesh_meta_name',
      },
      speakers: {
        type: 'string',
        source: 'meta',
        meta: 'post_sesh_meta_speakers',
      },
      desc: {
        type: 'string',
        source: 'meta',
        meta: 'post_sesh_meta_desc',
      },
      link: {
        type: 'string',
        source: 'meta',
        meta: 'post_sesh_meta_link',
      },
    }, /* End attributes */
    edit: seshEdit,
    save: function(props) {
      return null;
    },
  }; /* End seshArgs */
  registerBlock('appia/sesh-data', seshArgs);
})(window.wp);
