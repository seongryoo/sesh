import { el } from './guten-helpers.js';

const { Icon } = wp.components;

// Generic add button text
export const addText = function(msg) {
  return el(
      Icon,
      {
        'icon': 'plus-alt',
        'aria-label': msg,
      }
  );
};
// Generic delete button text
export const removeText = function(msg) {
  return el(
      Icon,
      {
        'icon': 'trash',
        'aria-label': msg,
      }
  );
};

export const customTextControl = function(formLabel, formId, args) {
  const htmlArgs = {
    id: formId,
    type: 'text',
    className: 'components-text-control__input',
  }
  const combinedArgs = {
    ...htmlArgs,
    ...args,
  }
  const inputForm = el(
      'input',
      combinedArgs
  );
  const inputLabel = el(
      'label',
      {
        className: 'components-base-control__label',
        for: formId,
      },
      formLabel
  );
  const animatedLine = el(
      'span',
      {
        className: 'sched-input-underline',
      }
  );
  const inputGroup = el(
      'div',
      {
        className: 'sched-text-input',
      },
      [inputForm, animatedLine]
  );
  const wrapper = el(
      'div',
      {
        className: 'components-base-control__field',
      },
      [inputLabel, inputGroup]
  );
  return wrapper;
}