(function(wp) {
  const el = wp.element.createElement;
  const registerBlock = wp.blocks.registerBlockType;
  const TextControl = wp.components.TextControl;
  const Button = wp.components.Button;
  const schedEdit = function(props) {
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
    // Slot name
    let currSlotName = '';
    const slotNameArgs = {
      onChange: function(value) {
        currSlotName = value;
      },
      id: 'slot-name-form',
      placeholder: 'Start typing...',
      label: 'Time slot name (can be left blank)',
    };
    const slotName = el(TextControl, slotNameArgs);
    // Add slot button
    const slotButtonArgs = {
      onClick: function(value) {
        const slotsObj = getAttr('slots');
        slotsObj.push({
          name: [currSlotName],
        });
        storeAttr('slots', slotsObj);
        const form = document.getElementById('slot-name-form');
        currSlotName = '';
        form.value = currSlotName;
      },
    };
    const drawSlot = function(mult) {
      const slotsObj = getAttr('slots');
      const renderArr = [];
      for (const [index, slot] of slotsObj.entries()) {
        const slotElement = el(
            TextControl,
            {
              'className': 'ungarnished',
              'data-id': [index],
              'value': [slot.name],
              'onChange': function(value) {
                slotsObj[index].name = value;
                storeAttr('slots', slotsObj);
              },
            }
        );
        const closeButton = el(
            Button,
            {
              'className': 'slot-button-close button-close',
              'data-id': [index],
              'onClick': function() {
                const indexString = event.target.getAttribute('data-id');
                const indexInt = parseInt(indexString);
                slotsObj.splice(indexInt, 1);
                storeAttr('slots', slotsObj);
              },
            },
            'Remove slot'
        );
        const element = el(
            'div',
            {
              className: 'slot',
            },
            [slotElement, closeButton]
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
    const slotButton = el(
        Button,
        slotButtonArgs,
        'Add time slot'
    );
    const slotForm = el(
        'div',
        {
          className: 'sched-slot sched',
        },
        [displaySlots, slotName, slotButton]
    );
    return el(
        'div',
        {
          className: 'appia-block',
        },
        [slotForm]
    );
  };
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
