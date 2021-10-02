import {el} from './guten-helpers.js';
import {storeAttr, getAttr} from './attr-helpers.js';
import {addText, removeText,
  customTextControl, iconText, iconNoText} from './ui-wrappers.js';
import { PopupSearch } from './popup-search.js';

const {Button, Popover} = wp.components;
const {useState} = wp.element;
export const doSlots = function(props, grid) {
  const [popoverElement, setPopoverElement] = useState(null);
  const getSessionById = function(id) {
    if (!props.sessions) {
      return;
    }
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
  const storeNewDaySlot = function() {
    const slotsObj = getAttr(props, 'slots');
    slotsObj.push({
      name: '',
      day: true,
    });
    storeAttr(props, 'slots', slotsObj);
  };
  const storeNewSlotData = function() {
    const slotsObj = getAttr(props, 'slots');
    slotsObj.push({
      name: '',
      shared: false,
    });
    storeAttr(props, 'slots', slotsObj);
  };
  if (getAttr(props, 'slots').length == 0) {
    storeNewSlotData();
  }
  const addDayButton = el(
      Button,
      {
        onClick: function() {
          storeNewDaySlot();
        },
      },
      addText('Add Day')
  );
  // Add time slot button
  const addSlotButton = el(
      Button,
      {
        onClick: function() {
          storeNewSlotData();
        },
      },
      addText('Add time slot')
  );
  // Display current slots
  const drawSlots = function() {
    const slotsObj = getAttr(props, 'slots');
    const renderArr = [];
    for (const [slotIndex, slot] of slotsObj.entries()) {
      // Create a slot in the grids object if there isn't one
      if (grid.length < slotIndex + 1) {
        grid.push([]);
      }
      if ('day' in slot && slot.day) {
        const addBeforeButton = el(
            Button,
            {
              onClick: function() {
                const blankSlot = {
                  name: '',
                  shared: false,
                };
                slotsObj.splice(slotIndex, 0, blankSlot);
                storeAttr(props, 'slots', slotsObj);
                grid.splice(slotIndex, 0, []);
                storeAttr(props, 'sessions', grid);
              },
              className: 'button-add add-before',
            },
            addText('Add time slot before day marker')
        );
        const dayNameEditable = customTextControl(
            'Day name',
            'day_name_' + slotIndex,
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
        const dayDescription = customTextControl(
            'Day subheader',
            'day_subheader_' + slotIndex,
            {
              'data-id': slotIndex,
              'value': slot.desc,
              'onChange': function(e) {
                const value = e.target.value;
                slotsObj[slotIndex].desc = value != null ? value : '';
                storeAttr(props, 'slots', slotsObj);
              },
            }
        );
        const removeDayButton = el(
            Button,
            {
              'className': 'slot-button button-remove',
              'data-id': slotIndex,
              'onClick': function() {
                if (window.confirm('Delete the day marker named "'
                  + slot.name + '"?')) {
                  slotsObj.splice(slotIndex, 1);
                  storeAttr(props, 'slots', slotsObj);
                  grid.splice(slotIndex, 1);
                  storeAttr(props, 'sessions', grid);
                }
              },
            },
            removeText('Remove this day marker')
        );
        let options;
        if (slotsObj.length != 1) {
          options = [addBeforeButton, removeDayButton];
        } else {
          options = [addBeforeButton];
        }
        const displayDayName = el(
            'div',
            {
              className: 'slot-name sched-editable',
            },
            [dayNameEditable, dayDescription, options]
        );
        const element = el(
            'div',
            {
              'className': 'slot day',
              'data-slot-id': slotIndex,
            },
            displayDayName
        );
        renderArr.push(element);
      } else {
        const addBeforeButton = el(
            Button,
            {
              onClick: function() {
                const blankSlot = {
                  name: '',
                  shared: false,
                };
                slotsObj.splice(slotIndex, 0, blankSlot);
                storeAttr(props, 'slots', slotsObj);
                grid.splice(slotIndex, 0, []);
                storeAttr(props, 'sessions', grid);
              },
              className: 'button-add add-before',
            },
            addText('Add time slot before slot ' + (slotIndex + 1))
        );
        const addDayBeforeButton = el(
            Button,
            {
              onClick: function() {
                const blankSlot = {
                  name: '',
                  day: true,
                  desc: '',
                };
                slotsObj.splice(slotIndex, 0, blankSlot);
                storeAttr(props, 'slots', slotsObj);
                grid.splice(slotIndex, 0, []);
                storeAttr(props, 'sessions', grid);
              },
              className: 'button-add add-before',
            },
            iconText('clock', 'Add new day before slot ' + (slotIndex + 1))
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
            removeText('Remove this slot')
        );
        const isChecked = slotsObj[slotIndex].shared;
        let makeShared;
        if (!isChecked) {
          makeShared = iconText('calendar', 'Make into a shared slot');
        } else {
          makeShared = iconText('calendar-alt', 'Undo shared slot');
        }
        const isShared = el(
            Button,
            {
              'className': 'slot-button button-shared',
              'data-id': slotIndex,
              'onClick': function() {
                slotsObj[slotIndex].shared = !isChecked;
                storeAttr(props, 'slots', slotsObj);
              },
            },
            makeShared
        );
        const options = [addBeforeButton, addDayBeforeButton];
        if (slotsObj.length != 1) {
          options.push(removeSlotButton);
        }
        const tracksObj = getAttr(props, 'tracks');
        if (tracksObj.length != 1) {
          options.unshift(isShared);
        }
        // Left side of slot flex group
        const displaySlotName = el(
            'div',
            {
              className: 'slot-name sched-editable',
            },
            [slotNameEditable, options]
        );
        // Generate one dropzone for each track
        const childrenArr = [];
        for (const [trackIndex, track] of tracksObj.entries()) {
          if (slotsObj[slotIndex].shared && trackIndex > 0) {
            break;
          }
          if (grid[slotIndex].length < trackIndex + 1) {
            grid[slotIndex].push([]);
          }
          const trackStorage = [];
          if (props.sessions) {
            for (const [itemIndex, id] of grid[slotIndex][trackIndex].entries()) {
              const theSession = getSessionById(id);
              // Pruning nonexistent session ids
              if (theSession === undefined) {
                grid[slotIndex][trackIndex].splice(itemIndex, 1);
                storeAttr(props, 'sessions', grid);
                continue;
              }
              const removeStoredItemButton = el(
                  Button,
                  {
                    onClick: function() {
                      grid[slotIndex][trackIndex].splice(itemIndex, 1);
                      storeAttr(props, 'sessions', grid);
                    },
                  },
                  iconNoText('trash', 'Remove session "' + theSession.title.raw + '" from slot')
              );
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
          }


          const popButton = () => {
            const [isPopoverOpen, setPopoverOpen] = useState(false);
            const id = "" + trackIndex + slotIndex;
            const addSession = (session) => {
              // console.log(session);
              grid[slotIndex][trackIndex].push(session.id);
              storeAttr(props, 'sessions', grid);
            };

            const popover = PopupSearch({
              sessions: props.sessions != null ? [...props.sessions] : [],
              setPopoverOpen, 
              setPopoverElement,
              addSession,
            });
            const openPopover = el(
                Button,
                {
                  onClick: () => {
                    if (isPopoverOpen) {
                      setPopoverOpen(false);
                    } else {
                      setPopoverElement(id);
                      setPopoverOpen(true);
                    }
                  },
                  className: 'components-button block-editor-button-block-appender',
                },
                iconNoText('plus-alt2', 'Add session')
            );
            return el(
                'div',
                {},
                [openPopover, isPopoverOpen && popoverElement == id ? popover : null]
            );
          };


          
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
              [trackStorage, popButton()]
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
      [displaySlots, addSlotButton, addDayButton]
  );
};
