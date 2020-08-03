(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const TextareaControl = wp.components.TextareaControl;
  // Select function for db call
  const withSelect = wp.data.withSelect;
  const fetchSpeakers = withSelect(function(select) {
    const queryArgs = {
      per_page: -1,
      status: 'publish',
    };
    const posts = select('core').getEntityRecords(
        'postType',
        'post_speaker',
        queryArgs
    );
    return {
      speakers: posts,
    };
  });
  const seshEdit = fetchSpeakers(function(props) {
    let speakerList;
    if (!props.speakers) {
      return 'Fetching speakers...';
    }
    if (props.speakers.length == 0) {
      speakerList = el(
          'div',
          {},
          'Could not find any speakers to work with. '
            + 'Make some speaker posts to get started!'
      );
    } else {
      console.log(props.speakers);
      const speakerArray = [];
      for (const speaker of props.speakers) {
        const name = speaker.title.raw;
        const imgUrl = speaker
            .meta
            .post_speaker_meta_img_url;
        const id = speaker.id;
        const elName = el(
            'div',
            {
              className: 'speaker-select-name',
            },
            name
        );
        const elImg = el(
            'img',
            {
              className: 'speaker-select-img',
              src: imgUrl,
            }
        );
        const elDiv = el(
            'div',
            {
              'className': 'speaker-select',
              'data-id': id,
            },
            [elImg, elName]
        );
        speakerArray.push(elDiv);
      }
      speakerList = el(
          'div',
          {
            className: 'speakers-select',
          },
          speakerArray
      );
    }
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
    // The final element
    return el(
        'div',
        {
          className: 'appia-blocks',
        },
        [speakerList, link, speakers, descWrapped]
    );
  });

  const seshArgs = {
    title: 'Session Data',
    category: 'appia-blocks',
    icon: 'tickets-alt',
    edit: seshEdit,
    save: function(props) {
      return null;
    },
  }; /* End seshArgs */
  registerBlock('appia/sesh-data', seshArgs);
})(window.wp);
