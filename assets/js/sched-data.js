(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const Button = wp.components.Button;
  const withSelect = wp.data.withSelect;

  const schedEdit = withSelect(function(select) {
    const posts = select('core')
        .getEntityRecords('postType', 'post_sesh', {per_page: -1});
    return {
      sessions: posts != null ? posts : [],
    };
  })(function(props) {
    // Helper methods for JSON to metadata string conversion
    const getAttr = function(attr) {
      if (props.attributes[attr] != '') {
        return JSON.parse(props.attributes[attr]);
      } else {
        return [];
      }
    };
    const storeAttr = function(attr, value) {
      props.setAttributes({
        [attr]: JSON.stringify(value),
      });
    };
    const drawSession = function() {
      console.log("ha!")
      console.log(props.sessions);
      const sessionElements = [];
      for (const sesh of props.sessions) {
        console.log(sesh);
        const sessionElement = el(
            'div',
            {},
            sesh.title.raw
        );
        sessionElements.push(sessionElement);
      }
      return sessionElements;
    };
    const sessions = el(
      'div',
      {

      },
      drawSession()
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
    };
    const addSlotButton = el(
        Button,
        slotButtonArgs,
        'Add time slot'
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
                const indexString = event.target.getAttribute('data-id');
                const indexInt = parseInt(indexString);
                slotsObj.splice(indexInt, 1);
                storeAttr('slots', slotsObj);
              },
            },
            'Remove slot'
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
              },
              'TEMP'
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
        [addSlotName, addSlotButton, displaySlots]
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
    };
    const addTrackButton = el(
        Button,
        trackButtonArgs,
        'Add schedule track'
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
                const indexString = event.target.getAttribute('data-id');
                const indexInt = parseInt(indexString);
                tracksObj.splice(indexInt, 1);
                storeAttr('tracks', tracksObj);
              },
            },
            'Remove track'
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
        {},
        drawTrack()
    );
    const trackForm = el(
        'div',
        {
          className: 'sched-track sched',
        },
        [addTrackName, addTrackButton, displayTracks]
    );
    return el(
        'div',
        {
          className: 'appia-blocks',
        },
        [sessions, slotForm, trackForm]
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
      },
      allSessions: {
        type: 'string',
      }, /* End attributes */
    },
    edit: schedEdit,
    save: function(props) {
      return null;
    },
  }; /* End schedArgs */
  registerBlock('appia/sched-data', schedArgs);
})(window.wp);
