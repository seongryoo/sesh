import { el, registerBlock } from './guten-helpers.js';
import { fetchPosts } from './fetch-posts.js';
import { getAttr, storeAttr } from './attr-helpers.js';

const {apiFetch} = wp;
const {RichText} = wp.blockEditor;
const {TextControl, Button, SelectControl, CheckboxControl} = wp.components;
const {useState} = wp.element;

const displayEdit = fetchPosts('post_sched', 'schedules')((props) => {
  let chooseSchedule;
  const loadingSchedules = 'Fetching Schedules...';
  const noSchedules = 'Could not find any Schedules. Make a Schedule post to get started.';

  if (!props.schedules) {
    chooseSchedule = loadingSchedules;
  } else if (props.schedules.length == 0) {
    chooseSchedule =  noSchedules;
  } else {
    const optionList = props.schedules.map((schedule) => {
      return {
        label: schedule.title.rendered,
        value: schedule.id,
      };
    });
    optionList.unshift({
      label: '(None)',
      value: -1,
    });
    const dropdown = el(
        SelectControl,
        {
          label: 'Select the Schedule to display on this page',
          value: props.attributes.schedule,
          options: optionList,
          onChange: (value) => {
            props.setAttributes({
              schedule: value,
            });
          },
        }
    );
    chooseSchedule = dropdown;
  }
  let displayOptions;
  if (props.attributes.schedule && props.attributes.schedule != -1) {
    displayOptions = 'Display options';
  } else {
    displayOptions = null;
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
  
  const selectedSchedule = el(
      'p',
      {},
      props.attributes.schedule
  );
  const sched = elWrap(
      'div',
      {},
      [chooseSchedule, selectedSchedule, displayOptions]
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
