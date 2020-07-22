(function(wp) {
  // React aliases
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  // Select function for db call
  const withSelect = wp.data.withSelect;
  // Wordpress components
  const TextControl = wp.components.TextControl;
  const Button = wp.components.Button;
  // Helper method for drag events
  const eventOverride = function(event) {
    event.stopPropagation();
    event.preventDefault();
  };
  // The star of the show
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
        const theString = props.attributes[attr];
        const theJSON = JSON.parse(theString);
        return theJSON;
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
    const storeNewSlotData = function() {
      const slotsObj = getAttr('slots');
      slotsObj.push({
        name: '',
      });
      storeAttr('slots', slotsObj);
    };
    const storeNewTrackData = function() {
      const tracksObj = getAttr('tracks');
      tracksObj.push({
        name: '',
      });
      storeAttr('tracks', tracksObj);
    };
    // Empty properties case
    if (getAttr('slots').length == 0) {
      storeNewSlotData();
    }
    if (getAttr('tracks').length == 0) {
      storeNewTrackData();
    }
    // Get sessions grid
    const grid = getAttr('sessions');
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
      event.dataTransfer.setData('text/plain', data);
    };
    const handleDragEnd = function(event) {
    };
    // Returns react component for a single session
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
    // given index and session obj, handles data retrieval & work division
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
    // Sessions element is top-level
    const sessions = el(
        'div',
        {
          className: 'sidebar-sessions',
        },
        drawSessions()
    );
    // Generic add button text
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
    // Args for add time slot button
    const slotButtonArgs = {
      onClick: storeNewSlotData,
      className: 'button-add',
    };
    // Add time slot button
    const addSlotButton = el(
        Button,
        slotButtonArgs,
        addText('Add time slot')
    );
    // Display current slots
    const drawSlots = function(mult) {
      const slotsObj = getAttr('slots');
      const renderArr = [];
      for (const [slotIndex, slot] of slotsObj.entries()) {
        // Create a slot in the grids object if there isn't one
        if (grid.length < slotIndex + 1) {
          grid.push([]);
        }
        const slotNameEditable = el(
            TextControl,
            {
              'className': 'ungarnished',
              'data-id': slotIndex,
              'value': slot.name,
              'onChange': function(value) {
                slotsObj[slotIndex].name = value != null ? value : '';
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
                  slotsObj.splice(slotIndex, 1);
                  storeAttr('slots', slotsObj);
                  grid.splice(slotIndex, 1);
                  storeAttr('sessions', grid);
                }
              },
            },
            removeText('Remove slot')
        );
        let displaySlotNameArray;
        if (slotsObj.length != 1) {
          displaySlotNameArray = [slotNameEditable, removeSlotButton];
        } else {
          displaySlotNameArray = [slotNameEditable];
        }
        // Left side of slot flex group
        const displaySlotName = el(
            'div',
            {
              className: 'slot-name',
            },
            displaySlotNameArray
        );
        // Generate one dropzone for each track
        const tracksObj = getAttr('tracks');
        const childrenArr = [];
        for (const [trackIndex, track] of tracksObj.entries()) {
          if (grid[slotIndex].length < trackIndex + 1) {
            grid[slotIndex].push([]);
          }
          const trackStorage = [];
          for (const [itemIndex, id] of grid[slotIndex][trackIndex].entries()) {
            const removeStoredItemButton = el(
                Button,
                {
                  onClick: function() {
                    grid[slotIndex][trackIndex].splice(itemIndex, 1);
                    // console.log(grid)
                    storeAttr('sessions', grid);
                  },
                },
                removeText('Remove session from slot')
            );
            const storedItem = el(
                'div',
                {},
                [id, removeStoredItemButton]
            );
            trackStorage.push(storedItem);
          }
          const trackElement = el(
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
                  const data = event.dataTransfer.getData('text/plain');
                  grid[slotIndex][trackIndex].push(data);
                  storeAttr('sessions', grid);
                },
              },
              trackStorage
          );
          childrenArr.push(trackElement);
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
            [displaySlotName, children]
        );
        renderArr.push(element);
      }
      return renderArr;
    };
    const displaySlots = el(
        'div',
        {},
        drawSlots()
    );
    const slotForm = el(
        'div',
        {
          className: 'sched-slot sched',
        },
        [displaySlots, addSlotButton]
    );
    // Add track button
    const trackButtonArgs = {
      onClick: storeNewTrackData,
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
                  tracksObj.splice(index, 1);
                  storeAttr('tracks', tracksObj);
                  for (const [slotIndex, slot] of grid.entries()) {
                    grid[slotIndex].splice(index, 1);
                  }
                  storeAttr('sessions', grid);
                }
              },
            },
            removeText('Remove track')
        );
        let trackFormArray = [];

        if (tracksObj.length != 1) {
          trackFormArray = [trackNameEditable, removeTrackButton];
        } else {
          trackFormArray = [trackNameEditable];
        }
        const element = el(
            'div',
            {
              className: 'track',
            },
            trackFormArray
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
