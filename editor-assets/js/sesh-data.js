(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const CheckboxControl = wp.components.CheckboxControl;
  const Autocomplete = wp.components.Autocomplete;
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

    const SpeakersAutocomplete = () => {
      const speakerAutocompleters = [
        {
  name: 'users',
  className: 'editor-autocompleters__user',
  triggerPrefix: '~',
  options( search ) {
    let payload = '';
    if ( search ) {
      payload = '?search=' + encodeURIComponent( search );
    }
    console.log(apiFetch( { path: '/wp/v2/users' + payload } ));
    return apiFetch( { path: '/wp/v2/users' + payload } );
  },
  isDebounced: true,
  getOptionKeywords( user ) {
    return [ user.slug, user.name ];
  },
  getOptionLabel( user ) {
    return el(
      'p',
      {},
      user.name
    );
  },
  getOptionCompletion( user ) {
    return `~${ user.slug }`;
  },
        }
      ];
      const auto = el(
        RichText,
        {
          autocompleters: speakerAutocompleters,
        }
      );

      return auto;
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
    
    const speakerList = el(
      SpeakersAutocomplete,
      {},
    );
    // The final element
    return el(
        'div',
        {
          className: 'appia-blocks',
        },
        [speakerList, link, descWrapped]
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
