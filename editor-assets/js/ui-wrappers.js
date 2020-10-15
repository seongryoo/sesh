import { el } from './guten-helpers.js';

// Generic add button text
export const addText = function(msg) {
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
export const removeText = function(msg) {
  return el(
      'div',
      {
        'className': 'button-remove-text',
        'aria-label': msg,
      },
      ''
  );
};