import { el } from './guten-helpers.js';

const { apiFetch } = wp;
const { RichText } = wp.blockEditor;

const handleDragStart = function(event, data) {
  event.stopPropagation();
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', data);
  const dragItem = event.target;
  dragItem.classList.add('dragging');
  const slots = document.getElementsByClassName('slot');
  for (const slot of slots) {
    slot.classList.add('no-pointer');
  }
};
const handleDragEnd = function(event) {
  const dragItem = event.target;
  dragItem.classList.remove('dragging');
  const slots = document.getElementsByClassName('slot');
  for (const slot of slots) {
    slot.classList.remove('no-pointer');
  }
};

const sessionAutocompleters = [
  {
    name: 'sessions',
    className: 'editor-autocompleters__session',
    triggerPrefix: '',
    options: function(search) {
      let payload = '';
      if (search) {
        payload = '?search=' + encodeURIComponent(search);
      }
      return apiFetch(
          {
            path: '/wp/v2/post_sesh' + payload,
          }
      );
    },
    getOptionKeywords: function(session) {
      return [session.title.rendered];
    },
    getOptionLabel: function(session) {
      const id = session.id;
      console.log(session.title);
      const sessionName = session.title.rendered;
      const sessionHTML = {
        __html: sessionName,
      };
      return el(
          'div',
          {
            className: 'appia-draggable session',
            draggable: true,
            onDragStart: function(event) {
              handleDragStart(event, id);
            },
            onDragEnd: function(event) {
              handleDragEnd(event);
            },
            dangerouslySetInnerHTML: sessionHTML,
          }
      );
    },
    allowContext: function(value) {
      return value != '';
    },
    getOptionCompletion: function(session) {
      console.log('no');
      return '';
    },
  },
];
const searchBar = el(
    RichText,
    {
      autocompleters: sessionAutocompleters,
      placeholder: 'Search for sessions to add...',
      keepPlaceholderOnFocus: true,
      className: 'appia-search-bar',
      onChange: function(value) {
        return;
      },
    }
);
const searchIcon = el(
    'span',
    {
      className: 'appia-search-icon',
    }
);


export const sessionAutocomplete = el(
    'div',
    {
      className: 'appia-search-sidebar',
    },
    [searchBar]
);