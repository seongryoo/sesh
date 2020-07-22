(function(wp) {
  // React aliases
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  // Select function for db call
  const withSelect = wp.data.withSelect;
  // State control
  const withState = wp.compose.withState;
  const setState = wp.compose.setState;
  // Wordpress components
  const TextControl = wp.components.TextControl;
  const Button = wp.components.Button;

  const eventOverride = function(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const schedEdit = withSelect(function(select) {
    // Get session post types from wordpress db
    const posts = select('core').getEntityRecords(
        'postType',
        'post_sesh',
        {per_page: -1}
    );
    // Pass the array of posts to schedEdit as props.sessions
    return {
      sessions: posts != null ? posts : [],
    };
  })(function(props) {
    // Helper method which pulls attribute data and converts to JSON
    const getAttr = function(attr) {
      if (props.attributes[attr] != '') {
        return JSON.parse(props.attributes[attr]);
      } else {
        return [];
      }
    };
    // Helper method which stores JSON object as string attribute
    const storeAttr = function(attr, value) {
      props.setAttributes({
        [attr]: JSON.stringify(value),
      });
    };
    const elSessionName = function(name) {
      return el(
          'div',
          {
            className: 'session-name',
          },
          name
      );
    };
    const handleDragStart = function(event, data) {
      event.stopPropagation();
      event.dataTransfer.effectAllowed = 'move';
      console.log(data)
      event.dataTransfer.setData('text/plain', data)
    };
    const handleDragEnd = function(event) {
      console.log('drag ended');
    }
    const elSession = function(index, sesh, sessionName) {
      return el(
          'div',
          {
            className: 'appia-draggable',
            draggable: true,
            onDragStart: function(event) {
              handleDragStart(event, sesh.id);
            },
            onDragEnd: function(event) {
              handleDragEnd(event);
            },
          },
          sessionName
      );
    };
    const drawSession = function(index, sesh) {
      const name = sesh.title.raw;
      const sessionName = elSessionName(name);
      return elSession(index, sesh, sessionName);
    };
    // Generates array of rendered session elements
    const drawSessions = function() {
      const sessionElements = [];
      // Add one rendered element per object in sessions array
      for (const [index, sesh] of props.sessions.entries()) {
        const sessionElement = drawSession(index, sesh);
        sessionElements.push(sessionElement);
      }
      return sessionElements;
    };
    const sessions = el(
        'div',
        {
          className: 'sidebar-sessions',
        },
        drawSessions()
    );

    // Slot name
    let currSlotName = '';
    const addSlotNameArgs = {
      onChange: function(value) {
        currSlotName = value;
      },
      id: 'slot-name-form',
      placeholder: 'Start typing...',
      label: 'Time slot name (can be left blank)',
    };
    const addSlotName = el(TextControl, addSlotNameArgs);
    // Add slot button
    const addText = function(msg) {
      return el(
          'div',
          {
            'className': 'button-add-text',
            'aria-label': msg,
          },
          ''
      );
    };
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
    const slotButtonArgs = {
      onClick: function(value) {
        const slotsObj = getAttr('slots');
        slotsObj.push({
          name: currSlotName,
        });
        storeAttr('slots', slotsObj);
        const form = document.getElementById('slot-name-form');
        currSlotName = '';
        form.value = currSlotName;
      },
      className: 'button-add',
    };
    const addSlotButton = el(
        Button,
        slotButtonArgs,
        addText('Add time slot')
    );

    // Display current slots
    const drawSlot = function(mult) {
      const slotsObj = getAttr('slots');
      const renderArr = [];


      for (const [slotIndex, slot] of slotsObj.entries()) {
        const slotNameEditable = el(
            TextControl,
            {
              'className': 'ungarnished',
              'data-id': slotIndex,
              'value': slot.name,
              'onChange': function(value) {
                slotsObj[slotIndex].name = value;
                storeAttr('slots', slotsObj);
              },
            }
        );
        const removeSlotButton = el(
            Button,
            {
              'className': 'slot-button button-remove',
              'data-id': slotIndex,
              'onClick': function() {
                if (window.confirm('Delete the timeslot named "'
                  + slot.name + '"?')) {
                  const indexString = event.target.getAttribute('data-id');
                  const indexInt = parseInt(indexString);
                  slotsObj.splice(indexInt, 1);
                  storeAttr('slots', slotsObj);
                }
              },
            },
            removeText('Remove slot')
        );
        const name = el(
            'div',
            {
              className: 'slot-name',
            },
            [slotNameEditable, removeSlotButton]
        );
        const tracksObj = getAttr('tracks');
        const childrenArr = [];
        for (const [trackIndex, track] of tracksObj.entries()) {
          const child = el(
              'div',
              {
                'data-track-id': trackIndex,
                'data-slot-id': slotIndex,
                'data-track-name': track.name,
                'className': 'slot-child',
                'onDragOver': (event) => eventOverride(event),
                'onDragEnter': (event) => eventOverride(event),
                'onDrop': function(event) {
                  eventOverride(event);
                  console.log("I got et")
                },
              },
              'hello'
          );
          childrenArr.push(child);
        }
        const children = el(
            'div',
            {
              className: 'slot-children',
            },
            childrenArr
        );
        const element = el(
            'div',
            {
              'className': 'slot',
              'data-slot-id': slotIndex,
            },
            [name, children]
        );
        renderArr.push(element);
      }
      return renderArr;
    };
    const displaySlots = el(
        'div',
        {},
        drawSlot()
    );
    const slotForm = el(
        'div',
        {
          className: 'sched-slot sched',
        },
        [displaySlots, addSlotButton]
    );
    // Track name
    let currTrackName = '';
    const addTrackNameArgs = {
      onChange: function(value) {
        currTrackName = value;
      },
      id: 'track-name-form',
      placeholder: 'Start typing...',
      label: 'Schedule track name (can be left blank)',
    };
    const addTrackName = el(TextControl, addTrackNameArgs);
    // Add track button
    const trackButtonArgs = {
      onClick: function(value) {
        const tracksObj = getAttr('tracks');
        tracksObj.push({
          name: currTrackName,
        });
        storeAttr('tracks', tracksObj);
        const form = document.getElementById('track-name-form');
        currTrackName = '';
        form.value = currTrackName;
      },
      className: 'button-add',
    };
    const addTrackButton = el(
        Button,
        trackButtonArgs,
        addText('Add schedule track')
    );
    const drawTrack = function() {
      const tracksObj = getAttr('tracks');
      const renderArr = [];
      for (const [index, track] of tracksObj.entries()) {
        const trackNameEditable = el(
            TextControl,
            {
              'className': 'ungarnished',
              'data-id': index,
              'value': track.name,
              'onChange': function(value) {
                tracksObj[index].name = value;
                storeAttr('tracks', tracksObj);
              },
            }
        );
        const removeTrackButton = el(
            Button,
            {
              'className': 'track-button button-remove',
              'data-id': [index],
              'onClick': function() {
                if (window.confirm('Delete the schedule track named "'
                  + track.name + '"?')) {
                  const indexString = event.target.getAttribute('data-id');
                  const indexInt = parseInt(indexString);
                  tracksObj.splice(indexInt, 1);
                  storeAttr('tracks', tracksObj);
                }
              },
            },
            removeText('Remove track')
        );
        const element = el(
            'div',
            {
              className: 'track',
            },
            [trackNameEditable, removeTrackButton]
        );
        renderArr.push(element);
      }
      return renderArr;
    };
    const displayTracks = el(
        'div',
        {
          className: 'tracks-container',
        },
        drawTrack()
    );
    const trackForm = el(
        'div',
        {
          className: 'sched-tracks sched',
        },
        [displayTracks, addTrackButton]
    );
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
        [sessions, tracksAndSlots]
    );
  });
  const schedArgs = {
    title: 'Schedule Data',
    category: 'appia-blocks',
    icon: 'index-card',
    attributes: {
      tracks: {
        type: 'string',
        source: 'meta',
        meta: 'post_sched_meta_tracks',
      },
      slots: {
        type: 'string',
        source: 'meta',
        meta: 'post_sched_meta_slots',
      },
      sessions: {
        type: 'string',
        source: 'meta',
        meta: 'post_sched_meta_sessions',
      }, /* End attributes */
    },
    edit: schedEdit,
    save: function(props) {
      return null;
    },
  }; /* End schedArgs */
  registerBlock('appia/sched-data', schedArgs);
})(window.wp);
