const allowDrop = function(event) {
  event.preventDefault();
};
const drag = function(event) {
  event.dataTransfer.setData('text', event.target.id);
  console.log(event.target.id)
};
const drop = function(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  event.target.appendChild(document.getElementById(data));
};
