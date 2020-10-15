export const getAttr = function(props, attr) {
  if (props.attributes[attr] != '') {
    const theString = props.attributes[attr];
    try {
      const theJSON = JSON.parse(theString);
      return theJSON.data;
    } catch (e) {
      return [];
    }
  } else {
    const emptyArray = [];
    return emptyArray;
  }
};
// Helper method which stores JSON object as string attribute
export const storeAttr = function(props, attr, value) {
  const theJSON = {
    data: value,
  };
  const theString = JSON.stringify(theJSON);
  props.setAttributes({
    [attr]: theString,
  });
};
