document.addEventListener('DOMContentLoaded', () => {
  const particles = [];
  const gravity = 0.5;
  const floorY = window.innerHeight - 10; // Adjust based on particle size
  const leftWallX = 0;
  const rightWallX = window.innerWidth - 10; // Adjust based on particle size
  const particleRadius = 5; // Half of the particle size (10px / 2)
  const friction = 0.99; // Friction factor to slow down particles
  const minHeight = 100;
  const particleFallSpeed = 7; // Customizable particle fall speed
  const playerSpeed = 3;
  const jumpStrength = 10;
  let gameOver = false;
  let playerHealth = 100;
  let isHurt = false;
  const hurtDuration = 500; // Hurt time in milliseconds
  let lastTime = performance.now();
  const timeScale = 90; // Customizable timescale variable
  let points = 0; // Points counter
  let particleSpawnInterval = 50; // Initial particle spawn interval in milliseconds
  let highScore = localStorage.getItem('highScore') || 0;
  highScore = Math.floor(highScore) // Retrieve high score from localStorage

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

  // Create points counter
  const pointsCounter = document.createElement('div');
  pointsCounter.className = 'points-counter';
  pointsCounter.style.position = 'absolute';
  pointsCounter.style.top = '40px';
  pointsCounter.style.left = '10px';
  pointsCounter.style.fontSize = '20px';
  pointsCounter.style.color = 'white';
  pointsCounter.innerText = `Points: ${points}`;
  document.body.appendChild(pointsCounter);

   // Create high score counter
   const highScoreCounter = document.createElement('div');
   highScoreCounter.className = 'high-score-counter';
   highScoreCounter.style.position = 'absolute';
   highScoreCounter.style.top = '70px';
   highScoreCounter.style.left = '10px';
   highScoreCounter.style.fontSize = '20px';
   highScoreCounter.style.color = 'white';
   highScoreCounter.innerText = `High Score: ${highScore}`;
   document.body.appendChild(highScoreCounter);

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

  // Create game over menu
  const gameOverMenu = document.createElement('div');
  gameOverMenu.className = 'game-over-menu';
  gameOverMenu.style.position = 'absolute';
  gameOverMenu.style.top = '50%';
  gameOverMenu.style.left = '50%';
  gameOverMenu.style.zIndex = '2828828';
  gameOverMenu.style.transform = 'translate(-50%, -50%)';
  gameOverMenu.style.padding = '20px';
  gameOverMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  gameOverMenu.style.color = 'white';
  gameOverMenu.style.fontSize = '24px';
  gameOverMenu.style.textAlign = 'center';
  gameOverMenu.style.display = 'none';
  gameOverMenu.innerHTML = `
    <p>Game Over!</p>
    <p>Points: <span id="final-points">${points}</span></p>
    <p>High Score: <span id="final-high-score">${highScore}</span></p>
    <button id="restart-button">Restart</button>
  `;
  document.body.appendChild(gameOverMenu);

  document.getElementById('restart-button').addEventListener('click', () => {
    location.reload(); // Reload the page to restart the game
  });
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
    const numParticles = 10; // Number of particles for the initial burst
    const trailParticles = 10; // Number of particles for the trailing effect
    const colors = ['white','whitesmoke',]; // Array of colors for variation
  
    // Initial burst particles
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'jump-particle';
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 3 + 5}px`; // Random width between 5 and 15px
      particle.style.height = `${Math.random() * 3 + 5}px`; // Random height between 5 and 15px
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // Random color
      particle.style.left = `${playerState.x + playerState.width / 2}px`;
      particle.style.top = `${playerState.y + 20}px`;
      document.body.appendChild(particle);
  
      const randomX = (Math.random() - 0.5) * 300; // Increase horizontal movement for side burst effect
      const randomY = (Math.random() - 0.5) * 50; // Reduce vertical movement
      const burstDuration = 300; // Duration for the burst effect
  
      setTimeout(() => {
        particle.style.transition = `transform ${burstDuration}ms ease-out, opacity ${burstDuration}ms ease-out`;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`; // Move to the sides and slightly up/down
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, burstDuration);
      }, 0);
    }
  
    // Trailing particles
    for (let i = 0; i < trailParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 5 + 2}px`; // Random width between 2 and 7px
      particle.style.height = `${Math.random() * 23 + 2}px`; // Random height between 2 and 7px
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // Random color
      particle.style.left = `${playerState.x + playerState.width / 2}px`;
      particle.style.top = `${playerState.y + 10}px`;
      document.body.appendChild(particle);
  
      const randomX = (Math.random() - 0.5) * 50; // Small horizontal movement for trailing effect
      const randomY = -Math.random() * 10 - 50; // Upward movement for trailing effect
      const trailDuration = 200; // Duration for the trailing effect
  
      setTimeout(() => {
        particle.style.transition = `transform ${trailDuration}ms ease-out, opacity ${trailDuration}ms ease-out`;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`; // Move upwards and slightly to the side
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, trailDuration);
      }, 0);
    }
  }

  function updatePlayer(deltaTime) {
    if (gameOver) return;

    if (keys.w && !playerState.isJumping) {
      playerState.velocityY = -jumpStrength;
      playerState.isJumping = true;
      spawnJumpParticles(); // Spawn particles when player jumps
    }
    if (keys.a) {
      playerState.x = Math.max(playerState.x - playerSpeed * deltaTime, leftWallX);
    }
    if (keys.d) {
      playerState.x = Math.min(playerState.x + playerSpeed * deltaTime, rightWallX - playerState.width);
    }

    playerState.velocityY += gravity * deltaTime;
    playerState.y += playerState.velocityY * deltaTime;

    // Ground collision
    if (playerState.y >= floorY - playerState.height) {
      playerState.y = floorY - playerState.height;
      playerState.velocityY = 0;
      playerState.isJumping = false;
    }

    player.style.left = `${playerState.x}px`;
    player.style.top = `${playerState.y}px`;
  }

  function updateEnemy(deltaTime) {
    if (gameOver) return;

    enemyState.x += enemyState.velocityX * deltaTime;

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
      playerHealth = 0;
      setGameOver();
  }}

  function triggerHurtState() {
    isHurt = true;
    player.style.backgroundColor = 'yellow';
    setTimeout(() => {
      isHurt = false;
      player.style.backgroundColor = 'red';
    }, hurtDuration);
  }

  function updateParticles(deltaTime) {
    if (gameOver) return;

    particles.forEach((particle, index) => {
      particle.y += particle.velocityY * deltaTime;

      // Ground collision
      if (particle.y >= floorY) {
        particle.y = floorY;
        document.body.removeChild(particle.element);
        particles.splice(index, 1);
        return; // Skip further processing for this particle
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

      // Remove particle if it goes off screen
      if (particle.y > window.innerHeight) {
        document.body.removeChild(particle.element);
        particles.splice(index, 1);
      }
    });

    updatePlayer(deltaTime);
    updateEnemy(deltaTime);
  }
  function setGameOver() {
    gameOver = true;

    // Save high score on game over
    if (points > highScore) {
      highScore = points;
      localStorage.setItem('highScore', highScore);
      highScoreCounter.innerText = `High Score: ${Math.floor(highScore)}`;
    }

    // Show game over menu
    document.getElementById('final-points').innerText = Math.floor(points);
    document.getElementById('final-high-score').innerText = Math.floor(highScore);
    gameOverMenu.style.display = 'block';
  }

  function gameLoop(currentTime) {
    const deltaTime = ((currentTime - lastTime) / 1000) * timeScale; // Convert to seconds and apply timeScale
    lastTime = currentTime;

    updateParticles(deltaTime);

    if (!gameOver) {
      points += deltaTime; // Increase points based on time survived
      pointsCounter.innerText = `Points: ${Math.floor(points)}`;
      requestAnimationFrame(gameLoop);
    }else {
      // Save high score on game over
      if (points > highScore) {
        highScore = points;
        localStorage.setItem('highScore', highScore);
        highScoreCounter.innerText = `High Score: ${Math.floor(highScore)}`;
      }
    }
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
      velocityY: particleFallSpeed, // Use customizable particle fall speed
      velocityX: 0
    });
  }

  // Create falling particles at intervals
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const particle = document.createElement('div');
    particle.className = 'falling-particle';
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = 'blue';
    particle.style.left = `${x}px`;
    particle.style.top = '0px';
    document.body.appendChild(particle);

    particles.push({
      element: particle,
      x: x,
      y: 0,
      velocityY: particleFallSpeed, // Use customizable particle fall speed
      velocityX: 0
    });
  }, particleSpawnInterval);

  requestAnimationFrame(gameLoop);
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
