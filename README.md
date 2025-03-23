# Minecraft Bot using Mineflayer

A Minecraft bot created using the Mineflayer library that connects to a Minecraft server and responds to player commands. The bot can be used as a foundation for creating more complex Minecraft automation.

## Features

- Connect to a Minecraft server on port 61619 (configurable)
- Respond to in-game chat commands
- Navigate the Minecraft world
- Basic inventory management
- Error handling and reconnection capabilities
- First-person view capabilities through a web interface
- Path visualization for tracking bot movements

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- A running Minecraft Java Edition server (or LAN world)
- Modern web browser for viewing the first-person perspective
- Optional: Conda for environment management

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/bhoyte/minecraft-bot.git
   cd minecraft-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. If using conda for environment management:
   ```bash
   conda activate minecraft-bot
   ```

## Configuration

You can configure the bot by editing the parameters in `index.js`:

```javascript
const bot = mineflayer.createBot({
  host: 'localhost', // Server IP address
  port: 61619,       // Server port
  username: 'MinecraftBot', // Bot username
  auth: 'offline',    // Authentication type (offline or microsoft)
  version: false      // Game version (false for auto-detect)
});
```

## Usage

### Starting the Bot

To start the bot, run:
```bash
npm start
```

Or directly with:
```bash
node index.js
```

### First-Person View

The bot now features a first-person view capability:

1. After the bot connects to the server, a web server starts on port 3000
2. Open your web browser and navigate to `http://localhost:3000`
3. You'll see the Minecraft world from the bot's perspective in real-time

### Bot Commands

The bot responds to the following in-game chat commands:

- `hello`: The bot will greet you
- `inventory`: The bot will list items in its inventory
- `position` or `where are you`: The bot will announce its position
- `jump`: The bot will jump (useful for locating it)
- `look at me`: The bot will turn to face you
- `come to me`: The bot will teleport in front of you (requires commands to be enabled)
- `viewer` or `view`: The bot will remind you of the URL for the first-person view
- `toggle path`: Enables or disables the visualization of the bot's movement path

### Server Setup

For instructions on setting up a Minecraft server for your bot to connect to, see [SERVER_SETUP.md](SERVER_SETUP.md).

## Project Structure

- `index.js` - Main bot code
- `package.json` - Project configuration and dependencies
- `README.md` - This documentation file
- `SERVER_SETUP.md` - Instructions for setting up a Minecraft server
- `doc.md` - Documentation for advanced features and architecture
- `bot-view.md` - Documentation for the first-person view implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- [PrismarineJS](https://github.com/PrismarineJS) for creating the Mineflayer library
- [prismarine-viewer](https://github.com/PrismarineJS/prismarine-viewer) for the web-based visualization
- Minecraft community for their continuous support

## Troubleshooting

If you encounter any issues:

1. Ensure your Minecraft server is running on the correct port (default: 61619)
2. Check that the server is in offline mode if you're using `auth: 'offline'`
3. Verify that your Node.js version is compatible (v14+)
4. Check the console for any error messages
5. Make sure your firewall isn't blocking the connection
6. If the viewer doesn't work, ensure you have all required dependencies installed
