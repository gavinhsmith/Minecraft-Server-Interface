# Minecraft Server Interface (MSI)
Minecraft Server Interface (MSI) is a Node.js application that allows you to easily manage your Minecraft Java Edition and Bedrock Edition Servers.
## Set the access password
open the `password.js` file and change the *password_here* to your password.
## Set the public IP
 1. Get your public IP (google *my ip adress*)
 2. open the `ipaddress.js` file
 2. place the ip where you see *ip_here*
## Install
 1. Get the latest version of [Node.js](https://nodejs.org/en/).
 2. Clone this repository.
 3. Open the console window inside the downloaded repository.
 4. run the command `npm install`.
 5. Thats it.
## Adding your servers
### Adding the server
When creating a server, make a folder (with no spaces) inside the servers folder. This will be the "key" for your server.

Download the server software for your respective platform and rename the .jar ore .exe file to your folder name

*Note: as long as that .jar file for your java server takes the same console arguments as the offical minecraft java server software, it should work.*

*Note 2: Currently, the only bedrock server software supported is PocketMine-MP. You must use that for a bedrock server.*
### Defining your server to MSI
open the `servers.js`

next, create a new Server inside `module.exports`:

The arguments for the new Server are as followed (In order):

 - Display Name: *String* ("GrateCraft", ect.)
 - Version: *String* ("1.12.2", ect.)
 - Platform: *String* (MUST BE "java" or "bedrock")
 - Server Type: *String* (CraftBukkit, Spiggot, Vanilla; enter *null* to
   default to Vanilla)
 - Server Folder: *String* (Enter your servers folder)
 - Server Port: *Interger* (If your server runs on a non-default port,
   enter it here; enter *null* to default to the port for your platform)

example: 

    `module.exports = {
		GrateCraft: new Server('GrateCraft','1.14.4','java','CraftBukkit',null,null),
		SinglePlayer: new Server('SinglePlayer','1.14.4','java','Vanilla',null,7000),
		GrateCraftMobile: new Server('GrateCraft Mobile','1.12.0','bedrock','PocketMine-MP','GrateCraftMobile',null)
	};`
## Starting MSI
as of right now, MSI only works on windows, so you MacOSX and Linux users will have to wait.

open your console in the repository and run the command `msi`

The MSI server will have started and you can now access it at `http://localhost:600/`

## Using MSI
### Basic
Go to `http://localhost:600/` and enter your password.

Click one of your servers (Black buttons with quick information).

To run a command, click on the *Command* box, enter your command, and press *enter*.

Click *stop server* to stop the server

### Others
the urls
 `http://localhost:600/properties`
 `http://localhost:600/ops`
 `http://localhost:600/banned-ips`
 `http://localhost:600/whitelist`
 `http://localhost:600/banned-players` 
 are also valid (given a server is started and you are logged in).
 
If you want to get some raw JSON data about the current running server, go to the url `http://localhost:600/json/status`

*Note: Raw JSON only works for Java Edition Servers*

## Notes

 - If you want to access your minecraft servers outside your network, you must forward the respective ports and make your servers ip static.
 - Due to an error in the Windows 10 UWP apps LoopBack, you cannot access local bedrock servers (on the same network as your PC) on Windows 10. To get around this, people will exempt the Minecraft Windows 10 Edition from the loopback: open `powershell` and run the command `CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"`
 - Whenever you have to mess with your internet or pc settings, you run the risk of damaging your pc, to proceed with caution.
 - MSI only works on Windows.
## Contribute
Feel free to fork the project and add your own twists!

Want me to fix/add something? send something in the issue tab! 