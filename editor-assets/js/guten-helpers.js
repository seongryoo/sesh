const { createElement } = wp.element;
const { registerBlockType } = wp.blocks;

export const el = createElement;
export const registerBlock = registerBlockType;
export const p = (str) => el('p', {}, str);