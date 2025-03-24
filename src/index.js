const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

// Create the bot
const bot = mineflayer.createBot({
  host: 'localhost', // Connect to localhost
  port: 61619,       // Use port 61619 as specified
  username: 'MinecraftBot', // Bot username
  auth: 'offline',    // Offline mode for local testing
  version: false      // Auto-detect the version
});

// Load pathfinder plugin
bot.loadPlugin(pathfinder);

// Event handlers
bot.on('login', () => {
  console.log('Bot has logged in to the server!');
  console.log(`Position: ${bot.entity.position}`);
  console.log(`Health: ${bot.health}`);
  console.log(`Food: ${bot.food}`);
  
  // Announce bot's presence and location after login
  setTimeout(() => {
    bot.chat('Hello! I am a bot created with Mineflayer!');
    bot.chat('Type "come to me" to teleport me in front of you');
    announcePosition();
  }, 2000);
});

bot.on('spawn', () => {
  console.log('Bot spawned in the world');
  console.log(`Position: ${bot.entity.position}`);
});

bot.on('chat', (username, message) => {
  // Avoid responding to own messages
  if (username === bot.username) return;
  
  // Respond to hello
  if (message.toLowerCase() === 'hello') {
    bot.chat(`Hello, ${username}!`);
  }
  
  // List inventory
  if (message.toLowerCase() === 'inventory') {
    listInventory();
  }
  
  // Announce position when asked
  if (message.toLowerCase() === 'where are you' || message.toLowerCase() === 'position') {
    announcePosition();
  }
  
  // Jump when asked
  if (message.toLowerCase() === 'jump') {
    bot.setControlState('jump', true);
    setTimeout(() => {
      bot.setControlState('jump', false);
    }, 500);
    bot.chat('Jumping!');
  }
  
  // Teleport the bot in front of the player
  if (message.toLowerCase() === 'come to me') {
    const player = bot.players[username];
    if (!player || !player.entity) {
      bot.chat("I can't see you. Please make sure you're in range.");
      return;
    }
    
    try {
      // Get player position and looking direction
      const playerPos = player.entity.position;
      const yaw = player.entity.yaw;
      
      // Calculate a position 3 blocks in front of the player
      // Using yaw to determine the direction the player is facing
      const x = playerPos.x - Math.sin(yaw) * 3;
      const y = playerPos.y;
      const z = playerPos.z + Math.cos(yaw) * 3;
      
      // Check if the target position is safe (not inside a solid block)
      const targetPos = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
      const blockAtTarget = bot.blockAt(new bot.vec3(targetPos.x, targetPos.y, targetPos.z));
      const blockAboveTarget = bot.blockAt(new bot.vec3(targetPos.x, targetPos.y + 1, targetPos.z));
      
      if (blockAtTarget && blockAtTarget.boundingBox === 'block' || 
          blockAboveTarget && blockAboveTarget.boundingBox === 'block') {
        // Position is not safe, try to find a safe position nearby
        bot.chat("Can't teleport there - it's obstructed. Looking for a safe spot nearby...");
        
        // Try several positions around the player in increasing distance
        const directions = [
          { dx: -1, dz: 0 }, { dx: 1, dz: 0 }, { dx: 0, dz: -1 }, { dx: 0, dz: 1 },
          { dx: -1, dz: -1 }, { dx: -1, dz: 1 }, { dx: 1, dz: -1 }, { dx: 1, dz: 1 }
        ];
        
        let safeFound = false;
        for (let distance = 2; distance <= 5; distance++) {
          for (const dir of directions) {
            const testX = playerPos.x + (dir.dx * distance);
            const testZ = playerPos.z + (dir.dz * distance);
            
            // Check if this position is safe
            const testPos = new bot.vec3(testX, playerPos.y, testZ);
            const blockAtTest = bot.blockAt(testPos);
            const blockAboveTest = bot.blockAt(testPos.offset(0, 1, 0));
            
            if ((!blockAtTest || blockAtTest.boundingBox !== 'block') && 
                (!blockAboveTest || blockAboveTest.boundingBox !== 'block')) {
              // Found a safe position
              bot.chat(`/tp @s ${testX.toFixed(1)} ${playerPos.y.toFixed(1)} ${testZ.toFixed(1)}`);
              bot.chat("I've teleported to a safe position near you!");
              safeFound = true;
              
              // Make the bot look at the player after teleporting
              setTimeout(() => {
                bot.lookAt(player.entity.position.offset(0, 1.6, 0)); // Look at player's head
              }, 500);
              break;
            }
          }
          if (safeFound) break;
        }
        
        if (!safeFound) {
          bot.chat("Sorry, I couldn't find a safe position nearby.");
        }
      } else {
        // Original position is safe, teleport there
        bot.chat(`/tp @s ${x.toFixed(1)} ${y.toFixed(1)} ${z.toFixed(1)}`);
        bot.chat("I've teleported in front of you!");
        
        // Make the bot look at the player after teleporting
        setTimeout(() => {
          bot.lookAt(player.entity.position.offset(0, 1.6, 0)); // Look at player's head
        }, 500);
      }
    } catch (error) {
      bot.chat("Error teleporting: " + error.message);
      console.error("Teleport error:", error);
    }
  }
  
  // Make the bot look at the player
  if (message.toLowerCase() === 'look at me') {
    const player = bot.players[username];
    if (player && player.entity) {
      bot.lookAt(player.entity.position.offset(0, 1.6, 0)); // Look at player's head
      bot.chat(`Looking at you, ${username}!`);
    } else {
      bot.chat("I can't see you. Please make sure you're in range.");
    }
  }
});

// Function to announce bot position in chat
function announcePosition() {
  const pos = bot.entity.position;
  bot.chat(`I am at position X: ${Math.round(pos.x)}, Y: ${Math.round(pos.y)}, Z: ${Math.round(pos.z)}`);
}

// Function to list inventory items
function listInventory() {
  const items = bot.inventory.items();
  if (items.length === 0) {
    bot.chat('My inventory is empty');
    return;
  }
  
  const itemList = items.map(item => `${item.count} ${item.name}`).join(', ');
  bot.chat(`In my inventory: ${itemList}`);
}

// Handle errors and disconnections
bot.on('error', (err) => {
  console.error('Error:', err);
});

bot.on('kicked', (reason) => {
  console.log('Bot was kicked from the server:', reason);
});

bot.on('end', () => {
  console.log('Bot disconnected from the server');
});

console.log('Bot is attempting to connect to the Minecraft server...');
