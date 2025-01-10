document.addEventListener('DOMContentLoaded', () => {
  const particles = [];
  const gravity = 0.5;
  const floorY = window.innerHeight - 10; // Adjust based on particle size
  const leftWallX = 0;
  const rightWallX = window.innerWidth - 10; // Adjust based on particle size
  const particleRadius = 5; // Half of the particle size (10px / 2)
  const friction = 0.99; // Friction factor to slow down particles
  const minHeight = 100;
  const playerSpeed = 5;
  const jumpStrength = 10;
  let gameOver = false;
  let playerHealth = 100;
  let isHurt = false;
  const hurtDuration = 2000; // Hurt time in milliseconds

  window.autoDeleteOnLand = true; // Global variable to control auto-delete on land
  window.bounceEnabled = false; // Global variable to control bounce
  window.collisionEnabled = false; // Global variable to control bounce

  // Create health bar
  const healthBar = document.createElement('div');
  healthBar.className = 'health-bar';
  healthBar.style.position = 'absolute';
  healthBar.style.top = '10px';
  healthBar.style.left = '10px';
  healthBar.style.width = '200px';
  healthBar.style.height = '20px';
  healthBar.style.backgroundColor = 'green';
  document.body.appendChild(healthBar);

  // Create player character
  const player = document.createElement('div');
  player.className = 'player';
  player.style.position = 'absolute';
  player.style.width = '20px';
  player.style.height = '20px';
  player.style.backgroundColor = 'red';
  player.style.left = '50%';
  player.style.top = `${floorY - 20}px`;
  document.body.appendChild(player);

  const playerState = {
    x: window.innerWidth / 2,
    y: floorY - 20,
    width: 20,
    height: 20,
    velocityY: 0,
    isJumping: false
  };

  // Create enemy
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.position = 'absolute';
  enemy.style.width = '20px';
  enemy.style.height = '20px';
  enemy.style.backgroundColor = 'blue';
  enemy.style.left = '100px';
  enemy.style.top = `${floorY - 20}px`;
  document.body.appendChild(enemy);

  const enemyState = {
    x: 100,
    y: floorY - 20,
    width: 20,
    height: 20,
    velocityX: 2
  };

  const keys = {
    w: false,
    a: false,
    s: false,
    d: false
  };

  // Handle key down
  document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    if (event.key in keys) {
      keys[event.key] = true;
    }
  });

  // Handle key up
  document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
      keys[event.key] = false;
    }
  });

  function spawnJumpParticles() {
    const numParticles = 5; // Number of particles to spawn
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'jump-particle';
      particle.style.position = 'absolute';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.backgroundColor = 'yellow';
      particle.style.left = `${playerState.x + playerState.width / 2}px`;
      particle.style.top = `${playerState.y}px`;
      document.body.appendChild(particle);

      const randomX = (Math.random() - 0.5) * 20; // Random horizontal movement
      const randomY = -Math.random() * 50; // Random vertical movement
      const fallDuration = 1000; // Duration of the fall

      setTimeout(() => {
        particle.style.transition = `transform ${fallDuration}ms ease-in, opacity ${fallDuration}ms ease-in`;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`; // Move upwards and to the side
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, fallDuration);
      }, 0);
    }
  }

  function updatePlayer() {
    if (gameOver) return;

    if (keys.w && !playerState.isJumping) {
      playerState.velocityY = -jumpStrength;
      playerState.isJumping = true;
      spawnJumpParticles(); // Spawn particles when player jumps
    }
    if (keys.a) {
      playerState.x = Math.max(playerState.x - playerSpeed, leftWallX);
    }
    if (keys.d) {
      playerState.x = Math.min(playerState.x + playerSpeed, rightWallX - playerState.width);
    }

    playerState.velocityY += gravity;
    playerState.y += playerState.velocityY;

    // Ground collision
    if (playerState.y >= floorY - playerState.height) {
      playerState.y = floorY - playerState.height;
      playerState.velocityY = 0;
      playerState.isJumping = false;
    }

    player.style.left = `${playerState.x}px`;
    player.style.top = `${playerState.y}px`;
  }

  function updateEnemy() {
    if (gameOver) return;

    enemyState.x += enemyState.velocityX;

    // Wall collision
    if (enemyState.x <= leftWallX || enemyState.x >= rightWallX - enemyState.width) {
      enemyState.velocityX = -enemyState.velocityX; // Reverse direction
    }

    enemy.style.left = `${enemyState.x}px`;

    // Check for collision with player
    if (
      !isHurt &&
      enemyState.x < playerState.x + playerState.width &&
      enemyState.x + enemyState.width > playerState.x &&
      enemyState.y < playerState.y + playerState.height &&
      enemyState.y + enemyState.height > playerState.y
    ) {
      playerHealth -= 10;
      updateHealthBar();
      triggerHurtState();
    }
  }

  function updateHealthBar() {
    healthBar.style.width = `${playerHealth * 2}px`; // Scale health bar width
    if (playerHealth <= 0) {
      gameOver = true;
      alert('Game Over!');
    }
  }

  function triggerHurtState() {
    isHurt = true;
    player.style.backgroundColor = 'yellow';
    setTimeout(() => {
      isHurt = false;
      player.style.backgroundColor = 'red';
    }, hurtDuration);
  }

  function updateParticles() {
    if (gameOver) return;

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
        }
      }

      // Wall collision
      if (particle.x <= leftWallX || particle.x >= rightWallX) {
        particle.velocityX = -particle.velocityX * 0.7; // Bounce with damping
      }

      particle.element.style.top = `${particle.y}px`;
      particle.element.style.left = `${particle.x}px`;

      // Check for collision with player
      if (
        !isHurt &&
        particle.x < playerState.x + playerState.width &&
        particle.x + particleRadius * 2 > playerState.x &&
        particle.y < playerState.y + playerState.height &&
        particle.y + particleRadius * 2 > playerState.y
      ) {
        playerHealth -= 10;
        updateHealthBar();
        document.body.removeChild(particle.element);
        particles.splice(index, 1);
        triggerHurtState();
      }
    });

    updatePlayer();
    updateEnemy();
    requestAnimationFrame(updateParticles);
  }

  // Randomly spawn particles
  const numParticles = 100; // Number of particles to spawn
  for (let i = 0; i < numParticles; i++) {
    let x, y;
    do {
      x = Math.random() * window.innerWidth;
      y = minHeight + Math.random() * (window.innerHeight - minHeight);
    } while (
      x < playerState.x + playerState.width &&
      x + particleRadius * 2 > playerState.x &&
      y < playerState.y + playerState.height &&
      y + particleRadius * 2 > playerState.y
    );

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    particles.push({
      element: particle,
      x: x,
      y: y,
      velocityY: 0,
      velocityX: (Math.random() - 0.5) * 2 // Random initial horizontal velocity
    });
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
        appendMessage('Available commands:<br>1. about<br>2. clear<br>3. links<br>4. setdelay [milliseconds]<br>5. physic (redirects to phyisc simulation page)<br>6. home (redirects you to the main page)<br>7. clearp (clearsparticles)<br>8. togglebounce (toggles particle bounce)<br>9. togglecollision (toggles particle collision)<br>10. toggledelete (toggles auto-delete on land)', true);
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
      case 'toggledelete':
        autoDeleteOnLand = !autoDeleteOnLand;
        appendMessage(`Auto-delete on land is now ${autoDeleteOnLand ? 'enabled' : 'disabled'}.`);
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
