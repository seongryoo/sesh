import { el, registerBlock } from './guten-helpers.js';
import { fetchPosts } from './fetch-posts.js';
import { getAttr, storeAttr } from './attr-helpers.js';
import { sessionAutocomplete } from './autocomplete-sessions.js';
import { doSlots } from './slot-form.js';
import { doTracks } from './track-form.js';
import { addText, removeText } from './ui-wrappers.js';

const schedEdit = fetchPosts('post_sesh', 'sessions')(function(props) {
  const loadingSessions = 'Fetching session posts...';
  const noSessions = 'Could not find any sessions to work with. Make some session posts to add them to the schedule!';
  let autocomplete;
  if (!props.sessions) {
    autocomplete = loadingSessions;
  } else if (props.sessions && props.sessions.length == 0) {
    autocomplete = noSessions;
  } else {
    autocomplete = sessionAutocomplete;
  }
  // Get sessions grid
  const grid = getAttr(props, 'sessions');
  const slotForm = doSlots(props, grid);
  const trackForm = doTracks(props, grid);
  const tracksAndSlots = el(
      'div',
      {
        className: 'tracks-and-slots',
      },
      [trackForm, slotForm]
  );
  return el(
      'div',
      {
        className: 'appia-blocks schedule',
      },
      [tracksAndSlots]
  );
});
const schedArgs = {
  title: 'Schedule Data',
  category: 'appia-blocks',
  icon: 'index-card',
  edit: schedEdit,
  save: function() {
    return null;
  },
}; /* End schedArgs */
registerBlock('appia/sched-data', schedArgs);