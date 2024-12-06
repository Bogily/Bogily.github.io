document.addEventListener('DOMContentLoaded', () => {
    const particles = [];
    const gravity = 0.5;
    const floorY = window.innerHeight - 10; // Adjust based on particle size
    const leftWallX = 0;
    const rightWallX = window.innerWidth - 10; // Adjust based on particle size
    const particleRadius = 5; // Half of the particle size (10px / 2)
    const friction = 0.99; // Friction factor to slow down particles
    window.bounceEnabled = false; // Global variable to control bounce
    window.collisionEnabled = false; // Global variable to control bounce
  
    document.addEventListener('mousemove', (event) => {
      const particle = document.createElement('div');
      particle.className = 'trail';
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      document.body.appendChild(particle);
  
      particles.push({
        element: particle,
        x: event.clientX,
        y: event.clientY,
        velocityY: 0,
        velocityX: (Math.random() - 0.5) * 2 // Random initial horizontal velocity
      });
    });
  
    window.clearParticles = function() {
      particles.forEach(particle => {
        document.body.removeChild(particle.element);
      });
      particles.length = 0;
    };
  
    function updateParticles() {
      particles.forEach((particle, index) => {
        particle.velocityY += gravity;
        particle.velocityY *= friction; // Apply friction to slow down
        particle.velocityX *= friction; // Apply friction to slow down
        particle.y += particle.velocityY;
        particle.x += particle.velocityX;
  
        // Ground collision
        if (particle.y >= floorY) {
          particle.y = floorY;
          if (window.bounceEnabled) {
            particle.velocityY = -particle.velocityY * 0.7; // Bounce with damping
          } else {
            particle.velocityY = 0; // Stop movement
          }
        }
  
        if (window.bounceEnabled) {
          // Bounce off the walls
          if (particle.x <= leftWallX) {
            particle.x = leftWallX;
            particle.velocityX = -particle.velocityX * 0.7; // Bounce with damping
          } else if (particle.x >= rightWallX) {
            particle.x = rightWallX;
            particle.velocityX = -particle.velocityX * 0.7; // Bounce with damping
          }
        }
  
        // Check for collisions with other particles
        if (window.collisionEnabled) {
            for (let i = 0; i < particles.length; i++) {
              if (i !== index) {
                const otherParticle = particles[i];
                const dx = otherParticle.x - particle.x;
                const dy = otherParticle.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < particleRadius * 2) {
                  // Simple elastic collision response
                  const angle = Math.atan2(dy, dx);
                  const sin = Math.sin(angle);
                  const cos = Math.cos(angle);
    
                  // Rotate particle velocities to collision axis
                  const v1 = { x: particle.velocityX * cos + particle.velocityY * sin, y: particle.velocityY * cos - particle.velocityX * sin };
                  const v2 = { x: otherParticle.velocityX * cos + otherParticle.velocityY * sin, y: otherParticle.velocityY * cos - otherParticle.velocityX * sin };
    
                  // Swap velocities
                  const temp = v1.x;
                  v1.x = v2.x;
                  v2.x = temp;
    
                  // Rotate velocities back
                  particle.velocityX = v1.x * cos - v1.y * sin;
                  particle.velocityY = v1.y * cos + v1.x * sin;
                  otherParticle.velocityX = v2.x * cos - v2.y * sin;
                  otherParticle.velocityY = v2.y * cos + v2.x * sin;
    
                  // Separate particles to avoid overlap
                  const overlap = particleRadius * 2 - distance;
                  const separationX = overlap * cos / 2;
                  const separationY = overlap * sin / 2;
    
                  particle.x -= separationX;
                  particle.y -= separationY;
                  otherParticle.x += separationX;
                  otherParticle.y += separationY;
                }
              }
            }
          }

  
        particle.element.style.top = `${particle.y}px`;
        particle.element.style.left = `${particle.x}px`;
      });
  
      requestAnimationFrame(updateParticles);
    }
  
    updateParticles();
  

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
        appendMessage('Available commands:<br>1. about<br>2. clear<br>3. links<br>4. setdelay [milliseconds]<br>5. physic (redirects to phyisc simulation page)<br>6. home (redirects you to the main page)<br>7. clearp (clearsparticles)<br>8. togglebounce (toggles particle bounce)<br>9. togglecollision (toggles particle collision)', true);
        break;
      case 'physic':
        window.location.replace("physic.html");
        break;
      case 'home':
        window.location.replace("index.html");
        break;
      case 'clearp':
        clearParticles();
        appendMessage('Particles cleared.');
        break;
      case 'togglebounce':
        bounceEnabled = !bounceEnabled;
        appendMessage(`Bounce is now ${bounceEnabled ? 'enabled' : 'disabled'}.`);
        break;
      case 'togglecollision':
        window.collisionEnabled = !window.collisionEnabled;
        appendMessage(`Collision is now ${window.collisionEnabled ? 'enabled' : 'disabled'}.`);
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
