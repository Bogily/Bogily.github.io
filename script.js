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

// Command box functionality
document.addEventListener('DOMContentLoaded', function() {
  const cmdInput = document.getElementById('cmd-input');
  const sendBtn = document.getElementById('send-btn');
  const chatBox = document.getElementById('chat-box');

  function appendMessage(message, isHtml = false) {
    const messageElement = document.createElement('div');
    if (isHtml) {
      messageElement.innerHTML = message;
    } else {
      messageElement.textContent = message;
    }
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  function handleCommand(command) {
    switch (command.toLowerCase()) {
      case 'about':
        appendMessage('This is a command line interface built using HTML, CSS, and JavaScript.');
        break;
      case 'clear':
        chatBox.innerHTML = '';
        break;
      case 'links':
        appendMessage('Useful links:<br>1. <a href="https://github.com" target="_blank" style="color: #8b5cf6; text-decoration: underline;">GitHub</a><br>2. <a href="https://stackoverflow.com" target="_blank" style="color: #8b5cf6; text-decoration: underline;">Stack Overflow</a>', true);
        break;
      case 'help':
        appendMessage('Available commands:<br>1. about<br>2. clear<br>3. links', true);
        break;
      default:
        appendMessage(`Unknown command: ${command}`);
    }
  }
  
  sendBtn.addEventListener('click', function() {
    const command = cmdInput.value.trim();
    if (command) {
      appendMessage(`> ${command}`);
      handleCommand(command);
      cmdInput.value = '';
    }
  });

  cmdInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendBtn.click();
    }
  });
});

const cmdToggleButton = document.getElementById('cmd-toggle');
const cmdMenu = document.getElementById('cmd-menu');

cmdToggleButton.addEventListener('click', function() {
  cmdMenu.classList.toggle('hidden');
  
});