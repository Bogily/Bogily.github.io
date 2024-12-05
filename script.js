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

  const randomX = (Math.random() - 0.5) * 20; // Random horizontal movement
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

// Command box functionality
const chatBox = document.getElementById('chat-box');
const cmdInput = document.getElementById('cmd-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', function() {
  const command = cmdInput.value.trim();
  if (command) {
    const commandOutput = document.createElement('div');
    commandOutput.className = 'chat-msg';
    commandOutput.innerHTML = `<div class="chat-msg-content"><p>${executeCommand(command)}</p></div>`;
    chatBox.appendChild(commandOutput);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    cmdInput.value = ''; // Clear the input
  }
});

function executeCommand(command) {
  switch (command.toLowerCase()) {
    case 'help':
      return 'Available commands: help';
    default:
      return `Unknown command: ${command}`;
  }
}

// Toggle command menu
const cmdToggleButton = document.getElementById('cmd-toggle');
const cmdMenu = document.getElementById('cmd-menu');

cmdToggleButton.addEventListener('click', function() {
  cmdMenu.classList.toggle('hidden');
  
});

// Send command on Enter key
document.addEventListener('DOMContentLoaded', function() {
  const cmdInput = document.getElementById('cmd-input');
  const sendBtn = document.getElementById('send-btn');

  cmdInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendBtn.click();
    }
  });
});