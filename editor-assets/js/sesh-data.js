(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const CheckboxControl = wp.components.CheckboxControl;
  const TextareaControl = wp.components.TextareaControl;
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
    // Speaker list
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
      // console.log(props.speakers);
      const speakerArray = [];
      const selectedSpeakers = getAttr('speakers');
      // console.log(selectedSpeakers)
      const isSelectedIndex = function(speaker) {
        for (const [index, value] of selectedSpeakers.entries()) {
          // console.log('value')
          // console.log(value)
          // console.log('othervalue')
          // console.log(speaker)
          if (value == speaker) {
            // console.log(index)
            return index;
          }
        }
        // console.log(-1)
        return -1;
      };
      const isSelected = function(speaker) {
        return isSelectedIndex(speaker) != -1;
      };

      for (const speaker of props.speakers) {
        const name = speaker.title.raw;
        const id = speaker.id;
        const elCheck = el(
            CheckboxControl,
            {
              checked: isSelected(id),
              onChange: function(value) {
                if (isSelected(id)) {
                  const index = isSelectedIndex(id);
                  selectedSpeakers.splice(index, 1);
                } else {
                  selectedSpeakers.push(id);
                }
                storeAttr('speakers', selectedSpeakers);
                // console.log(selectedSpeakers)
              },
              label: name,
            }
        );
        const elDiv = el(
            'div',
            {},
            elCheck
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
