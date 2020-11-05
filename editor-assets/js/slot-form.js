import { el } from './guten-helpers.js';
import { storeAttr, getAttr } from './attr-helpers.js';
import { addText, removeText, customTextControl } from './ui-wrappers.js';

const { TextControl, Button, CheckboxControl } = wp.components;
const { useState } = wp.element;

export const doSlots = function(props, grid) {
  const getSessionById = function(id) {
    for (const sesh of props.sessions) {
      if (sesh.id == id) {
        return sesh;
      }
    }
  };
  // Helper method for drag events
  const eventOverride = function(event) {
    event.stopPropagation();
    event.preventDefault();
  };
  const storeNewSlotData = function() {
    const slotsObj = getAttr(props, 'slots');
    slotsObj.push({
      name: '',
    });
    storeAttr(props, 'slots', slotsObj);
  };
  if (getAttr(props, 'slots').length == 0) {
    storeNewSlotData();
  }
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
    const slotsObj = getAttr(props, 'slots');
    const renderArr = [];
    for (const [slotIndex, slot] of slotsObj.entries()) {
      // Create a slot in the grids object if there isn't one
      if (grid.length < slotIndex + 1) {
        grid.push([]);
      }
      const addBeforeButton = el(
          Button,
          {
            onClick: function() {
              const slotsObj = getAttr(props, 'slots');
              const blankSlot = {
                name: '',
              };
              slotsObj.splice(slotIndex, 0, blankSlot);
              storeAttr(props, 'slots', slotsObj);
              // console.log(grid[slotIndex])
              grid.splice(slotIndex, 0, []);
              storeAttr(props, 'sessions', grid);
            },
            className: 'button-add add-before',
          },
          addText('Add time slot before session ' + (slotIndex + 1))
      );
      const slotNameEditable = customTextControl(
          'Time Slot Name',
          'time_slot_name_' + slotIndex,
          {
            'data-id': slotIndex,
            'value': slot.name,
            'onChange': function(e) {
              const value = e.target.value;
              slotsObj[slotIndex].name = value != null ? value : '';
              storeAttr(props, 'slots', slotsObj);
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
                storeAttr(props, 'slots', slotsObj);
                grid.splice(slotIndex, 1);
                storeAttr(props, 'sessions', grid);
              }
            },
          },
          removeText('Remove slot')
      );
      let state;
      if (slotsObj[slotIndex].shared) {
        state = true;
      } else {
        state = false;
      }
      const [isChecked, setChecked] = useState( state );
      const isShared = el(
          CheckboxControl,
          {
            label: 'Trackless/shared slot',
            checked: isChecked,
            onChange: function(stateData) {
              setChecked(stateData);
              // console.log(stateData);
              slotsObj[slotIndex].shared = stateData;
              storeAttr(props, 'slots', slotsObj);
              // console.log(slotsObj)
            },
          }
      );
      let displaySlotNameArray;
      if (slotsObj.length != 1) {
        displaySlotNameArray = [slotNameEditable, removeSlotButton];
      } else {
        displaySlotNameArray = [slotNameEditable];
      }
      const displaySlotAndDelete = el(
          'div',
          {
            className: 'slot-name-delete',
          },
          displaySlotNameArray
      );
      // Left side of slot flex group
      const displaySlotName = el(
          'div',
          {
            className: 'slot-name sched-editable',
          },
          [displaySlotAndDelete, isShared]
      );
      // Generate one dropzone for each track
      const tracksObj = getAttr(props, 'tracks');
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
                  storeAttr(props, 'sessions', grid);
                },
              },
              removeText('Remove session from slot')
          );
          const theSession = getSessionById(id);
          const theTitle = el(
              'p',
              {},
              theSession.title.raw
          );
          const storedItem = el(
              'div',
              {
                className: 'stored-session',
              },
              [theTitle, removeStoredItemButton]
          );
          trackStorage.push(storedItem);
        }
        const trackElement = el(
            'div',
            {
              'data-track-id': trackIndex,
              'data-slot-id': slotIndex,
              'data-track-name': track.name,
              'className': 'slot-child dropzone drop-session',
              'onDragLeave': function(event) {
                eventOverride(event);
                const dropZone = event.target;
                dropZone.classList.remove('dropzone-entered');
              },
              'onDragOver': function(event) {
                eventOverride(event);
              },
              'onDragEnter': function(event) {
                eventOverride(event);
                const dropZone = event.target;
                dropZone.classList.add('dropzone-entered');
              },
              'onDrop': function(event) {
                eventOverride(event);
                const dropZone = event.target;
                dropZone.classList.remove('dropzone-entered');
                const data = event.dataTransfer.getData('text/plain');
                grid[slotIndex][trackIndex].push(data);
                storeAttr(props, 'sessions', grid);
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
          [addBeforeButton, displaySlotName, children]
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
  return el(
      'div',
      {
        className: 'sched-slot sched',
      },
      [displaySlots, addSlotButton]
  );
};
