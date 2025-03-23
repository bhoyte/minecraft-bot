const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer');

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
  
  // Initialize the viewer with first-person perspective
  mineflayerViewer(bot, { 
    port: 3000, 
    firstPerson: true 
  });
  console.log('First-person view started! Open http://localhost:3000 in your browser');
  bot.chat('First-person view is now available at http://localhost:3000');
  
  // Track bot's path
  const path = [bot.entity.position.clone()];
  bot.on('move', () => {
    if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
      path.push(bot.entity.position.clone());
      if (bot.viewer) {
        bot.viewer.drawLine('path', path);
      }
    }
  });
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
      
      // Teleport command (requires op or command blocks enabled)
      bot.chat(`/tp @s ${x.toFixed(1)} ${y.toFixed(1)} ${z.toFixed(1)}`);
      bot.chat("I've teleported in front of you!");
      
      // Make the bot look at the player after teleporting
      setTimeout(() => {
        bot.lookAt(player.entity.position.offset(0, 1.6, 0)); // Look at player's head
      }, 500);
    } catch (err) {
      console.error('Error trying to teleport:', err);
      bot.chat("I couldn't teleport. Make sure commands are enabled!");
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

  // Handle viewer commands
  if (message.toLowerCase() === 'viewer' || message.toLowerCase() === 'view') {
    bot.chat(`First-person view is available at http://localhost:3000`);
  }

  // Toggle path visualization
  if (message.toLowerCase() === 'toggle path') {
    if (bot.viewer && bot.viewer._drawPoints.path) {
      bot.viewer.erase('path');
      bot.chat('Path visualization disabled');
    } else {
      bot.chat('Path visualization will begin with your next movements');
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
  // Close the viewer if it's running
  if (bot.viewer) {
    try {
      bot.viewer.close();
      console.log('Viewer closed');
    } catch (err) {
      console.error('Error closing viewer:', err);
    }
  }
});

console.log('Bot is attempting to connect to the Minecraft server...');
