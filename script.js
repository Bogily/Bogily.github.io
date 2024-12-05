// TV-Overlay
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

// Trail effect mouse
let lastTrailTime = 0;
let trailDelay = localStorage.getItem('trailDelay') ? parseInt(localStorage.getItem('trailDelay'), 10) : 80; // Customizable delay between dots in milliseconds

document.addEventListener('mousemove', function(e) {
  const currentTime = Date.now();
  if (currentTime - lastTrailTime >= trailDelay) {
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
    }, 0);

    lastTrailTime = currentTime;
  }
});

// Ensure the body does not scroll
document.body.style.overflow = 'hidden';

// Command box functionality
document.addEventListener('DOMContentLoaded', function() {
  const cmdInput = document.getElementById('cmd-input');
  const sendBtn = document.getElementById('send-btn');
  const chatBox = document.getElementById('chat-box');
  const titleText = "geiselnah.me ";
  let index = 0;

  function scrollTitle() {
    document.title = titleText.substring(index) + titleText.substring(0, index);
    index = (index + 1) % titleText.length;
  }

  setInterval(scrollTitle, 200);

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
    const [cmd, ...args] = command.split(' ');
    switch (cmd.toLowerCase()) {
      case 'about':
        appendMessage('This is a command line interface built using HTML, CSS, and JavaScript.');
        break;
      case 'clear':
        chatBox.innerHTML = '';
        break;
      case 'links':
        appendMessage('My Link:<br>1. <a href="https://github.com/bogily" target="_blank" style="color: #8b5cf6; text-decoration: underline;">GitHub</a><br>2. <a href="https://youtube.com/@bro" target="_blank" style="color: #8b5cf6; text-decoration: underline;">Youtube</a>', true);
        break;
      case 'help':
        appendMessage('Available commands:<br>1. about<br>2. clear<br>3. links<br>4. setdelay [milliseconds]', true);
        break;
      case 'setdelay':
        if (args.length > 0 && !isNaN(args[0])) {
          trailDelay = parseInt(args[0], 10);
          localStorage.setItem('trailDelay', trailDelay);
          appendMessage(`Trail delay set to ${trailDelay} milliseconds.`);
        } else {
          appendMessage('Usage: setdelay [milliseconds]');
        }
        break;
      default:
        appendMessage(`Unknown command: ${command}`);
    }
  }

  // sendBtn click event (send button)
  sendBtn.addEventListener('click', function() {
    const command = cmdInput.value.trim();
    if (command) {
      appendMessage(`> ${command}`);
      handleCommand(command);
      cmdInput.value = '';
    }
  });
  //sendBtn keydown event (Enter key)
  cmdInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendBtn.click();
    }
  });
});

//cmd-toggle
const cmdToggleButton = document.getElementById('cmd-toggle');
const cmdMenu = document.getElementById('cmd-menu');

cmdToggleButton.addEventListener('click', function() {
  cmdMenu.classList.toggle('hidden');
  
});