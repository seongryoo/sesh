import { storeAttr, getAttr } from './attr-helpers.js';
import { addText, removeText, customTextControl } from './ui-wrappers.js';
import { el } from './guten-helpers.js';

const { TextControl, Button } = wp.components;

export const doTracks = function(props, grid) {
  const storeNewTrackData = function() {
    const tracksObj = getAttr(props, 'tracks');
    tracksObj.push({
      name: '',
    });
    storeAttr(props, 'tracks', tracksObj);
  };
  if (getAttr(props, 'tracks').length == 0) {
    storeNewTrackData();
  }
  const addTrackButton = el(
      Button,
      {
        onClick: function() {
          storeNewTrackData();
        },
      },
      addText('Add schedule track')
  );
  const addTrack = el(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
        },
      },
      addTrackButton
  );
  const drawTrack = function() {
    const tracksObj = getAttr(props, 'tracks');
    const renderArr = [];
    renderArr.push(el(
      'div',
      {
        style: {
          width: '25%',
          height: 'auto',
          flex: '0 0 auto',
        },
      }
    ));
    for (const [index, track] of tracksObj.entries()) {
      const trackNameControl = customTextControl(
          'Track Name',
          'track_name_edit_' + index,
          {
            'data-id': index,
            'value': track.name,
            'onChange': function(e) {
              const value = e.target.value;
              tracksObj[index].name = value;
              storeAttr(props, 'tracks', tracksObj);
            },
          }
      );
      const trackNameEditable = el(
          'div',
          {
            className: 'track-name',
          },
          trackNameControl
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
                storeAttr(props, 'tracks', tracksObj);
                for (const [slotIndex, slot] of grid.entries()) {
                  grid[slotIndex].splice(index, 1);
                }
                storeAttr(props, 'sessions', grid);
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
  return el(
      'div',
      {
        className: 'sched-tracks sched',
      },
      [displayTracks, addTrack]
  );
};
