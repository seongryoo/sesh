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
  const chosen = (props.attributes.schedule && props.attributes.schedule != -1);

  let displayOptions;
  if (chosen) {
    const clickableEvents = el(
        CheckboxControl,
        {
          label: 'Clickable events',
          help: 'Whether events on the schedule should link to their individual event pages',
          checked: props.attributes.clickable_events,
          onChange: (value) => {
            props.setAttributes({
              clickable_events: value,
            });
          }
        }
    );
    const showSpeakers = el(
        CheckboxControl,
        {
          label: 'Show speakers',
          help: 'Show list of speakers below every session',
          checked: props.attributes.show_speakers,
          onChange: (value) => {
            props.setAttributes({
              show_speakers: value,
            });
          }
        }
    );
    const showDesc = el(
        CheckboxControl,
        {
          label: 'Show session descriptions',
          help: 'Show the descriptions for each session',
          checked: props.attributes.show_desc,
          onChange: (value) => {
            props.setAttributes({
              show_desc: value,
            });
          }
        }
    );
    const showCta = el(
        CheckboxControl,
        {
          label: 'Show session call-to-action links',
          help: 'Show the link to join/view each session',
          checked: props.attributes.show_cta,
          onChange: (value) => {
            props.setAttributes({
              show_cta: value,
            });
          }
        }
    );
    const ctaText = el(
        TextControl,
        {
          label: 'Call-to-action text',
          help: 'e.g. "View session", "Join meeting", "Watch recording" '
            + '\nNote that the name of the session will be added to the end of the link for screen readers'
            + ' (i.e. "View session" would become "View session Conference Keynote")',
          onChange: (value) => {
            props.setAttributes({
              cta_text: value,
            });
          },
          value: props.attributes.cta_text,
        }
    );
    const clickableSpeakers = el(
        CheckboxControl,
        {
          label: 'Clickable speakers',
          help: 'Whether displayed speakers should link to their individual profiles',
          checked: props.attributes.clickable_speakers,
          onChange: (value) => {
            props.setAttributes({
              clickable_speakers: value,
            });
          }
        }
    );
    const legend = el(
        'legend',
        {},
        'Display options',
    );
    displayOptions = el(
        'fieldset',
        {
          id: 'display-options',
        },
        [
          legend,
          clickableEvents, 
          showSpeakers, 
          props.attributes.show_speakers == true ? clickableSpeakers : null, 
          showDesc, 
          showCta,
          props.attributes.show_cta == true ? ctaText : null,
        ]
    );
  } else {
    displayOptions = null;
  }
  
  const selectedSchedule = el(
      'p',
      {},
      props.attributes.schedule
  );
  return el(
      'div',
      {},
      [chooseSchedule, displayOptions]
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
