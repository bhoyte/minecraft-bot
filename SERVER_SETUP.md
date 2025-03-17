# Minecraft Server Setup Guide

For the Mineflayer bot to connect successfully, you need to have a Minecraft server running on port 61619. Below are instructions to set up a simple Minecraft server.

## Prerequisites

- Java 17 or newer installed on your machine
- A Minecraft Java Edition server JAR file (e.g., `server.jar`)

## Setup Steps

1. Create a new directory for your Minecraft server (or use an existing one)

2. Download the Minecraft server JAR file from the official Minecraft website:
   - Visit: https://www.minecraft.net/en-us/download/server
   - Download the server.jar file

3. Move the server.jar to your server directory

4. Create a start script for the server with a custom port:

   **For Windows (create a file named `start_server.bat`):**
   ```bat
   @echo off
   java -Xmx2G -Xms1G -jar server.jar nogui -p 61619
   pause
   ```

5. Run the start script once. It will create an `eula.txt` file.

6. Open `eula.txt` and change `eula=false` to `eula=true` to accept the End User License Agreement.

7. If you want to use offline mode (for testing without a Minecraft account), also edit `server.properties` and set:
   ```
   online-mode=false
   ```

8. Run the start script again to start the server on port 61619.

9. Once the server is running, you can start the bot with:
   ```
   npm start
   ```

## Troubleshooting

- If the port 61619 is already in use by another application, you may need to choose a different port.
- Ensure your firewall is not blocking connections to the server.
- If you're using a different port, update the port in the bot's `index.js` file.

## Using an Existing Server

If you already have a Minecraft server running, you can modify its configuration to use port 61619:

1. Stop the server
2. Edit the `server.properties` file
3. Set `server-port=61619`
4. Save the file and restart the server
