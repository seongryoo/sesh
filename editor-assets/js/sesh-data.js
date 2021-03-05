import { el, registerBlock } from './guten-helpers.js';
import { fetchPosts } from './fetch-posts.js';
import { getAttr, storeAttr } from './attr-helpers.js';
import { removeText } from './ui-wrappers.js';

const {apiFetch} = wp;
const {RichText} = wp.blockEditor;
const {TextControl, Button} = wp.components;

(function(scriptData) {
  const seshEdit = fetchPosts('post_speaker', 'speakers')(function(props) {
    if (!props.speakers) {
      return 'Fetching speakers...';
    }
    if (props.speakers.length == 0) {
      return 'Could not find any speakers to work with.'
        + ' Make some speaker posts to get started!';
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
          const newSpeakers = getAttr(props, 'speakers');
          newSpeakers.push(speaker.id);
          storeAttr(props, 'speakers', newSpeakers);
          return '';
        },
      },
    ];
    const speakerAutocomplete = el(
        RichText,
        {
          autocompleters: speakerAutocompleters,
          placeholder: 'Search for speakers to add...',
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
    const drawSpeakers = function() {
      const speakersObj = getAttr(props, 'speakers');
      const renderArr = [];
      for (const [speakerIndex, speakerId] of speakersObj.entries()) {
        const speaker = getSpeakerById(speakerId);
        if (speaker == undefined) {
          return;
        }
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
                storeAttr(props, 'speakers', speakersObj);
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
      if (speakersObj.length == 0) {
        const emptyMsg = el(
            'div',
            {
              className: 'appia-chosen-empty',
            },
            'No speakers chosen'
        );
        renderArr.push(emptyMsg);
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
