(function(wp, scriptData) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const Button = wp.components.Button;
  const apiFetch = wp.apiFetch;
  const RichText = wp.blockEditor.RichText;
  // Select function for db call
  const withSelect = wp.data.withSelect;
  const fetchSpeakers = withSelect(function(select) {
    const queryArgs = {
      per_page: 5,
      offset: 0,
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
    if (!props.speakers) {
      return 'Fetching speakers...';
    }
    if (props.speakers.length == 0) {
      return 'Could not find any speakers to work with.'
        + ' Make some speaker posts to get started!';
    }
    const getAttr = function(attr) {
      if (props.attributes[attr] != '') {
        const theString = props.attributes[attr];
        try {
          const theJSON = JSON.parse(theString);
          return theJSON.data;
        } catch (e) {
          console.log('Empty data returned warning!');
          return [];
        }
      } else {
        const emptyArray = [];
        return emptyArray;
      }
    };
    // Helper method which stores JSON object as string attribute
    const storeAttr = function(attr, value) {
      const theJSON = {
        data: value,
      };
      const theString = JSON.stringify(theJSON);
      props.setAttributes({
        [attr]: theString,
      });
    };
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
    // Getting autocompleting speakers
    const speakerAutocompleters = [
      {
        name: 'speakers',
        className: 'editor-autocompleters__speaker',
        triggerPrefix: '',
        options: function(search) {
          let payload = '';
          if (search) {
            payload = '?search=' + encodeURIComponent(search);
          }
          return apiFetch(
              {
                path: '/wp/v2/post_speaker' + payload,
              }
          );
        },
        getOptionKeywords: function(speaker) {
          return [speaker.title.rendered];
        },
        getOptionLabel: function(speaker) {
          const name = el(
              'p',
              {},
              speaker.title.rendered
          );
          const imageLink = speaker.meta.post_speaker_meta_img_url;
          // Image attribute
          const placeHolderUrl = scriptData.pluginUrl
            + 'editor-assets/img/image.png';
          const img = el(
              'img',
              {
                src: imageLink != '' ? imageLink : placeHolderUrl,
                alt: speaker.title.rendered,
              }
          );
          return el(
              'div',
              {
                className: 'speaker-option appia-auto-option',
              },
              [img, name]
          );
        },
        allowContext: function(value) {
          return value != '';
        },
        getOptionCompletion: function(speaker) {
          const newSpeakers = getAttr('speakers');
          newSpeakers.push(speaker.id);
          storeAttr('speakers', newSpeakers);
          return '';
        },
      },
    ];
    const speakerAutocomplete = el(
        RichText,
        {
          autocompleters: speakerAutocompleters,
          placeholder: 'Search for speakers...',
          className: 'appia-search-bar',
          onChange: function(value) {
            return;
          },
        }
    );
    const getSpeakerById = function(id) {
      for (const speaker of props.speakers) {
        if (speaker.id == id) {
          return speaker;
        }
      }
    };
    // Generic delete button text
    const removeText = function(msg) {
      return el(
          'div',
          {
            'className': 'button-remove-text',
            'aria-label': msg,
          },
          ''
      );
    };
    const drawSpeakers = function() {
      const speakersObj = getAttr('speakers');
      const renderArr = [];
      for (const [speakerIndex, speakerId] of speakersObj.entries()) {
        const speaker = getSpeakerById(speakerId);
        const speakerName = el(
            'p',
            {},
            speaker.title.rendered
        );
        const removeSpeaker = el(
            Button,
            {
              onClick: function() {
                speakersObj.splice(speakerIndex, 1);
                storeAttr('speakers', speakersObj);
              },
              className: 'speaker-remove',
            },
            removeText('Remove the speaker '
              + speaker.title.rendered
              + ' from the session')
        );
        const flexDiv = el(
            'div',
            {
              className: 'appia-flex',
            },
            [speakerName, removeSpeaker]
        );
        const chosenSpeaker = el(
            'div',
            {
              className: 'appia-chosen-speakers',
            },
            flexDiv
        );
        renderArr.push(chosenSpeaker);
      }
      return renderArr;
    };
    const chosenSpeakers = el(
        'div',
        {},
        drawSpeakers()
    );
    const speakers = elWrap(
        'div',
        {},
        [speakerAutocomplete, chosenSpeakers]
    );
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
        [speakers, link, descWrapped]
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
})(window.wp, window.scriptData);
