document.addEventListener('DOMContentLoaded', function() {
  const tvToggleButton = document.getElementById('TV-Toggle');
  let overlayState = localStorage.getItem('overlayState');

  if (!overlayState) {
    overlayState = 'off';
    localStorage.setItem('overlayState', 'off');
  }

  if (overlayState === 'off') {
    document.body.classList.add('no-overlay');
  } else {
    document.body.classList.remove('no-overlay');
  }

  tvToggleButton.addEventListener('click', function() {
    document.body.classList.toggle('no-overlay');
    const isOverlayOff = document.body.classList.contains('no-overlay');
    localStorage.setItem('overlayState', isOverlayOff ? 'off' : 'on');
  });
});