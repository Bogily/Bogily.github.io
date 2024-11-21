document.addEventListener('DOMContentLoaded', function() {
  const tvToggleButton = document.getElementById('TV-Toggle');
  const overlayState = localStorage.getItem('overlayState');

  if (overlayState === 'off') {
    document.body.classList.add('no-overlay');
  }

  tvToggleButton.addEventListener('click', function() {
    document.body.classList.toggle('no-overlay');
    const isOverlayOff = document.body.classList.contains('no-overlay');
    localStorage.setItem('overlayState', isOverlayOff ? 'off' : 'on');
  });
});