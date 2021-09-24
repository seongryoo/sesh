import { el, registerBlock } from './guten-helpers.js';
import { fetchPosts } from './fetch-posts.js';
import { getAttr, storeAttr } from './attr-helpers.js';

const {apiFetch} = wp;
const {RichText} = wp.blockEditor;
const {TextControl, Button} = wp.components;

const displayEdit = fetchPosts('post_sched', 'schedules')((props) => {
  if (!props.schedules) {
    return 'Fetching schedules...';
  }
  if (props.schedules.length == 0) {
    return 'Could not find any schedules to work with.'
      + ' Make a Schedule to get started!';
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
  const scheduleAutocompleters = [
    {
      name: 'schedules',
      className: 'editor-autocompleters__schedule',
      triggerPrefix: '',
      options: function(search) {
        let payload = '';
        if (search) {
          payload = '?search=' + encodeURIComponent(search);
        }
        return apiFetch(
            {
              path: '/wp/v2/post_sched' + payload,
            }  
        );
      },
      getOptionKeywords: function(schedule) {
        return [schedule.title.rendered];
      },
      getOptionLabel: function(schedule) {
        const name = el(
            'p',
            {},
            schedule.title.rendered
        );
        return el(
            'div',
            {
              className: 'schedule-option appia-auto-option',
            },
            name
        );
      },
      allowContext: function(value) {
        return value != '';
      },
      getOptionCompletion: function(schedule) {
        storeAttr(props, 'schedule', schedule.id);
        return '';
      },
    },
  ];
  const scheduleAutocomplete = el(
      RichText,
      {
        autocompleters: scheduleAutocompleters,
        placeholder: 'Search for a schedule to display',
        className: 'appia-search-bar',
        onChange: function(value) {
          return;
        },
      }
  );
  const renderSelected = () => {
    const selected = getAttr(props, 'schedule');
    return el(
        'p',
        {},
        selected
    );
  };
  const sched = elWrap(
      'div',
      {},
      [scheduleAutocomplete, renderSelected()]
  );
  return el(
      'div',
      {
        className: 'appia-blocks',
      },
      sched
  );
});
const displayArgs = {
  title: 'Schedule Display',
  category: 'appia-blocks',
  icon: 'tickets-alt',
  edit: displayEdit,
  save: (props) => null,
};
registerBlock('appia/schedule-display', displayArgs);
