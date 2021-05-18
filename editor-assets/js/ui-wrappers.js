import { el } from './guten-helpers.js';

const { Icon } = wp.components;

export const iconNoText = function(iconName, msg) {
  const label = el(
      'div',
      {
        className: 'visually-hidden',
      },
      msg
  );
  const icon = el(
      Icon,
      {
        icon: iconName,
      }
  );
  return el(
      'div',
      {},
      [icon, label]
  );
}

export const iconText = function(iconName, msg) {
  const icon = el(
    Icon,
    {
      icon: iconName,
    }
  );
  return el(
    'div',
    {},
    [icon, msg]
  );
}
export const addDay = function(msg) {
  return iconText('clock', msg);
};
// Generic add button text
export const addText = function(msg) {
  return iconText('table-row-before', msg);
};
// Generic delete button text
export const removeText = function(msg) {
  return iconText('trash', msg);
};

export const removeNoText = function(msg) {
  return iconNoText('trash', msg);
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