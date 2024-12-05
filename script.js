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

document.addEventListener('mousemove', function(e) {
  const trail = document.createElement('div');
  trail.className = 'trail';
  document.body.appendChild(trail);
  trail.style.left = `${e.pageX}px`;
  trail.style.top = `${e.pageY}px`;

  const randomX = (Math.random() - 0.5) * 200; // Random horizontal movement
  const fallDuration = 2000; // Duration of the fall

  setTimeout(() => {
    trail.style.transition = `transform ${fallDuration}ms ease-in, opacity ${fallDuration}ms ease-in`;
    trail.style.transform = `translate(${randomX}px, calc(100vh - ${e.pageY}px))`;
    trail.style.opacity = '0';
    setTimeout(() => {
      trail.remove();
    }, fallDuration);
  }, 100);
});

// Ensure the body does not scroll
document.body.style.overflow = 'hidden';