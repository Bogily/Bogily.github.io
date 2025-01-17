document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to load
  const particles = []; // Array to store particle elements
  const gravity = 0.5; // Customizable gravity variable
  const floorY = window.innerHeight - 10; // Adjust based on particle size
  const leftWallX = 0; // Left wall position
  const rightWallX = window.innerWidth - 10; // Adjust based on particle size --> right wall position
  const particleRadius = 5; // Half of the particle size (10px / 2)
  const friction = 0.99; // Friction factor to slow down particles (deprecated)
  const minHeight = 100; // Minimum height for particle spawn 
  const particleFallSpeed = 7; // Customizable particle fall speed
  const playerSpeed = 3; // Customizable player speed
  const jumpStrength = 10; // Customizable jump strength
  let gameOver = false; // Game over flag
  let playerHealth = 100; // Player health
  let isHurt = false; // Hurt state flag
  const hurtDuration = 500; // Hurt time in milliseconds
  let lastTime = performance.now(); // Last frame time used for delta time calculation
  const timeScale = 90; // Customizable timescale variable for delta time
  let points = 0; // Points counter
  let particleSpawnInterval = 50; // Initial particle spawn interval in milliseconds
  let highScore = localStorage.getItem('highScore') || 0; // High score 
  highScore = Math.floor(highScore) // Retrieve high score from localStorage

  window.autoDeleteOnLand = true; // Global variable to control auto-delete on land (deprecated)
  window.bounceEnabled = false; // Global variable to control bounce (deprecated)
  window.collisionEnabled = false; // Global variable to control bounce (deprecated)

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
    x: window.innerWidth / 2, // Start in the middle of the screen
    y: floorY - 20, // Start on the floor,
    width: 20, // Player width
    height: 20, // Player height
    velocityY: 0, // Y velocity
    isJumping: false // Jumping flag
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
    x: 100, // Start at 100px
    y: floorY - 20, // Start on the floor
    width: 20, // Enemy width
    height: 20, // Enemy height
    velocityX: 2 // X velocity
  };

  const keys = {
    w: false, // Jump
    a: false, // Move left
    s: false, // Unused --> could be used for falling down faster maybe
    d: false // Move right
  };

  // Handle key down
  document.addEventListener('keydown', (event) => { // => is the same as function() {}
    if (gameOver) return;
    if (event.key in keys) {
      keys[event.key] = true;
    }
  });

  // Handle key up
  document.addEventListener('keyup', (event) => { // => is the same as function() {}
    if (event.key in keys) {
      keys[event.key] = false;
    }
  });

  function spawnJumpParticles() {
    const numParticles = 10; // Number of particles for the initial burst
    const trailParticles = 10; // Number of particles for the trailing effect
    const colors = ['white','whitesmoke',]; // Array of colors for variation
  
    // Initial burst particles (Left and right)
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
  
      setTimeout(() => { // => is the same as function() {}
        particle.style.transition = `transform ${burstDuration}ms ease-out, opacity ${burstDuration}ms ease-out`;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`; // Move to the sides and slightly up/down
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, burstDuration);
      }, 0);
    }
  
    // Trailing particles (upwards)
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
  
      setTimeout(() => {  // => is the same as function() {}
        particle.style.transition = `transform ${trailDuration}ms ease-out, opacity ${trailDuration}ms ease-out`;
        particle.style.transform = `translate(${randomX}px, ${randomY}px)`; // Move upwards and slightly to the side
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, trailDuration);
      }, 0);
    }
  }

  // Update player position based on key input using deltaTime
  function updatePlayer(deltaTime) {
    if (gameOver) return; // Skip player update if game is over (early exit)

    if (keys.w && !playerState.isJumping) { // Jump if not already jumping
      playerState.velocityY = -jumpStrength; // Set jump strength
      playerState.isJumping = true; // Set jumping flag
      spawnJumpParticles(); // Spawn particles when player jumps
    }
    if (keys.a) {
      playerState.x = Math.max(playerState.x - playerSpeed * deltaTime, leftWallX); // Move left calculation
    }
    if (keys.d) {
      playerState.x = Math.min(playerState.x + playerSpeed * deltaTime, rightWallX - playerState.width); // Move right calculation
    }

    playerState.velocityY += gravity * deltaTime;
    playerState.y += playerState.velocityY * deltaTime;

    // Ground collision
    if (playerState.y >= floorY - playerState.height) { // Check if player is on the floor
      playerState.y = floorY - playerState.height; // Set player on the floor
      playerState.velocityY = 0; // Reset vertical velocity
      playerState.isJumping = false; // Reset jumping flag
    }

    player.style.left = `${playerState.x}px`; // Update player position
    player.style.top = `${playerState.y}px`; // Update player position
  }

  function updateEnemy(deltaTime) {
    if (gameOver) return; // early exit if game is over

    enemyState.x += enemyState.velocityX * deltaTime; // Update enemy position

    // Wall collision
    if (enemyState.x <= leftWallX || enemyState.x >= rightWallX - enemyState.width) {
      enemyState.velocityX = -enemyState.velocityX; // Reverse direction
    }

    enemy.style.left = `${enemyState.x}px`; // Update enemy position

    // Check for collision with player
    if (
      !isHurt && // Skip collision check if player is hurt
      enemyState.x < playerState.x + playerState.width && // Checks for overlap on the x-axis
      enemyState.x + enemyState.width > playerState.x && 
      enemyState.y < playerState.y + playerState.height && // Checks for overlap on the y-axis
      enemyState.y + enemyState.height > playerState.y 
    ) {
      playerHealth -= 10; // Decrease player health
      updateHealthBar(); // Update health bar
      triggerHurtState(); // Trigger hurt state
    }
  }

  function updateHealthBar() { // Update health bar width based on player health
    healthBar.style.width = `${playerHealth * 2}px`; // Scale health bar width
    if (playerHealth <= 0) { // Check if player health is zero
      playerHealth = 0; // Set player health to zero
      setGameOver(); // Set game over state
  }}

  function triggerHurtState() { // Trigger hurt state for player to prevent multiple collisions --> instant death
    isHurt = true; // Set hurt state flag
    player.style.backgroundColor = 'yellow'; // Change player color to yellow
    setTimeout(() => { // Reset hurt state after duration (hurtDuration)
      isHurt = false; // Reset hurt state flag
      player.style.backgroundColor = 'red'; // Reset player color to red
    }, hurtDuration); 
  }

  function updateParticles(deltaTime) { // Update particles based on deltaTime
    if (gameOver) return; // early exit 

    particles.forEach((particle, index) => { // Loop through particles
      particle.y += particle.velocityY * deltaTime; // Update particle position based on velocity

      // Ground collision (for particles)
      if (particle.y >= floorY) { 
        particle.y = floorY; // Set particle on the floor
        document.body.removeChild(particle.element); // Remove particle from DOM
        particles.splice(index, 1); // Remove particle from array
        return; // Skip further processing for this particle
      }

      particle.element.style.top = `${particle.y}px`; // Update particle position y
      particle.element.style.left = `${particle.x}px`; // Update particle position x

      // Check for collision with player (for particles currently only used for falling particles i think)
      if (
        !isHurt && // Skip collision check if player is hurt
        particle.x < playerState.x + playerState.width && // Checks for overlap on the x-axis
        particle.x + particleRadius * 2 > playerState.x && 
        particle.y < playerState.y + playerState.height && // Checks for overlap on the y-axis
        particle.y + particleRadius * 2 > playerState.y
      ) {
        playerHealth -= 10; // Decrease player health
        updateHealthBar(); // Update health bar
        document.body.removeChild(particle.element); // Remove particle from DOM
        particles.splice(index, 1); // Remove particle from array
        triggerHurtState(); // Trigger hurt state
      }

      // Remove particle if it goes off screen
      if (particle.y > window.innerHeight) { // Check if particle is off screen
        document.body.removeChild(particle.element); // Remove particle from DOM
        particles.splice(index, 1); // Remove particle from array
      }
    });

    updatePlayer(deltaTime); // Update player position passing deltaTime
    updateEnemy(deltaTime); // Update enemy position passing deltaTime
  }
  function setGameOver() { // Set game over state
    gameOver = true; // Set game over flag

    // Save high score on game over
    if (points > highScore) { // Check if points are higher than high score
      highScore = points; // Set high score to points
      localStorage.setItem('highScore', highScore); // Save high score to localStorage
      highScoreCounter.innerText = `High Score: ${Math.floor(highScore)}`; // Update high score counter
    }

    // Show game over menu
    document.getElementById('final-points').innerText = Math.floor(points); // Update final points in game over menu
    document.getElementById('final-high-score').innerText = Math.floor(highScore); // Update final high score in game over menu
    gameOverMenu.style.display = 'block'; // Show game over menu
  }

  function gameLoop(currentTime) { // Game loop function

    //delta time system to support different frame / update times caused by different hardware --> deltaTime thanks to copilot / ai
    const deltaTime = ((currentTime - lastTime) / 1000) * timeScale; // Convert to seconds and apply timeScale
    lastTime = currentTime; // Update lastTime for next frame

    updateParticles(deltaTime); // Update particles passing deltaTime

    if (!gameOver) { // Check if game is not over
      points += deltaTime; // Increase points based on time survived
      pointsCounter.innerText = `Points: ${Math.floor(points)}`; // Update points counter
      requestAnimationFrame(gameLoop); // Continue game loop every frame fixed frame differences in logic by using delta time system
    }else { // Check if game is over
      // Save high score on game over
      if (points > highScore) { // Check if points are higher than high score
        highScore = points; // Set high score to points
        localStorage.setItem('highScore', highScore); // Save high score to localStorage
        highScoreCounter.innerText = `High Score: ${Math.floor(highScore)}`; // Update high score counter
      }
    }
  }

  // Randomly spawn particles (falling particles)
  const numParticles = 10000; // Number of particles to spawn (idk if this is useful maybe someday)
  for (let i = 0; i < numParticles; i++) { // Loop to spawn particles
    let x, y; // Declare x and y variables
    do { // Do while loop to prevent particles from spawning inside the player
      x = Math.random() * window.innerWidth; // Random x position
      y = minHeight + Math.random() * (window.innerHeight - minHeight); // Random y position
    } while ( // Check if particle is inside player
      x < playerState.x + playerState.width && // Check for overlap on the x-axis
      x + particleRadius * 2 > playerState.x &&
      y < playerState.y + playerState.height && // Check for overlap on the y-axis
      y + particleRadius * 2 > playerState.y
    );

    // Create particle element ()
    const particle = document.createElement('div'); // Create div element for particle
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    particles.push({ // Add particle to particles array
      element: particle, // Store particle element
      x: x, // Store particle x position
      y: y, // Store particle y position
      velocityY: particleFallSpeed, // Use customizable particle fall speed
      velocityX: 0 // Set particle horizontal velocity to 0 --> particles only fall down (useless i think)
    });
  }

  // okay this pretty wierd i first spawn particles as "particle" and then i set them as "falling-particle"
  // if it isn't broke don't fix it i guess

  // Create falling particles at intervals
  setInterval(() => {  // Set interval to spawn particles (particleSpawnInterval)
    const x = Math.random() * window.innerWidth;
    const particle = document.createElement('div');
    particle.className = 'falling-particle';
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = 'white';
    particle.style.left = `${x}px`;
    particle.style.top = '0px';
    document.body.appendChild(particle);

    particles.push({ // Add particle to particles array
      element: particle, // Store particle element
      x: x, // Store particle x position
      y: 0, // Start particle at the top of the screen
      velocityY: particleFallSpeed, // Use customizable particle fall speed
      velocityX: 0 
    });
  }, particleSpawnInterval); 

  requestAnimationFrame(gameLoop); // Start game loop --> gameloop every frame
});



// ------------- End of physic.js -------------

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
        appendMessage('Available commands:<br>1. about<br>2. clear<br>3. links<br>4. setdelay [milliseconds] (legacy)<br>5. Starfall (redirects to my game page (this))<br>6. home (redirects you to the main page)<br>7. clearp (clearsparticles) (legacy)<br>8. togglebounce (toggles particle bounce) (legacy)<br>9. togglecollision (toggles particle collision) (legacy)<br>10. toggledelete (toggles auto-delete on land) (legacy)', true);
        break;
      case 'starfall':
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
