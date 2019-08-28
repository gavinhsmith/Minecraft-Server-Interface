console.clear();

const proc = require('child_process');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const colors = require('colors');
const server_list = require('./servers.js');
const fs = require('fs');
const ff = require('./fileforwarder.js');
const port = (process.argv[2]) ? Number(process.argv[2]) : 600;
const gamedig = require('gamedig');
const got = require('got');
const ipAdd = require('./ipaddress.js');
let server = null;
let server_proc = null;
let server_active = false;
let website_proc = null;
let reset_title_f = false

renameConsoleWindow('MSI');

colors.setTheme({
  rainbow: 'rainbow',
  important: 'bold',
  error: 'red'
});

app.use(express.static('client'));

app.use(function (req,res) {
	if (req.url == '/serverdata') {
		res.write(fs.readFileSync('scripts/serverdata.js'));
		res.end();
		return;
	};
	if (req.url == '/p_main.css') {
		res.write(fs.readFileSync('serverPages/p_main.css'));
		res.end();
		return;
	};
	if (req.url == '/p_main.js') {
		res.write(fs.readFileSync('serverPages/p_main.js'));
		res.end();
		return;
	};
	if (req.url == '/json/status') {
		if (server_active) {
			if (server.platform == 'java') {
				got('https://mcapi.us/server/status?ip='+ipAdd+'&port='+server.port, { json: false }).then(response => {
					res.write(""+response.body);
					res.end();
				}).catch(error => {
					throw error;
				});
				return;
			} else {
				res.write(fs.readFileSync('errPage/cant_json_bedrock.html'));
				res.end();
				return;
			};
		};
	};
	if (req.url == '/background') {
		res.write(fs.readFileSync('client/bk.jpg'));
		res.end();
		return;
	};
	if (req.url == '/properties') {
		if (server_active) {
			res.write(ff('Server Properties | '+server.name,fs.readFileSync('servers/'+server.folder+'/server.properties')));
			res.end();
			return;
		};
	};
	if (req.url == '/ops') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/op/index.html'));
			res.end();
			return;
		};
	};
	if (req.url == '/ops/main.js') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/op/main.js'));
			res.end();
			return;
		};
	};
	if (req.url == '/ops/main.css') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/op/main.css'));
			res.end();
			return;
		};
	};
	if (req.url == '/whitelist') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/whitelist/index.html'));
			res.end();
			return;
		};
	};
	if (req.url == '/whitelist/main.js') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/whitelist/main.js'));
			res.end();
			return;
		};
	};
	if (req.url == '/whitelist/main.css') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/whitelist/main.css'));
			res.end();
			return;
		};
	};
	if (req.url == '/banned-players') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/bannedPlayers/index.html'));
			res.end();
			return;
		};
	};
	if (req.url == '/banned-players/main.js') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/bannedPlayers/main.js'));
			res.end();
			return;
		};
	};
	if (req.url == '/banned-players/main.css') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/bannedPlayers/main.css'));
			res.end();
			return;
		};
	};
	if (req.url == '/banned-ips') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/bannedIps/index.html'));
			res.end();
			return;
		};
	};
	if (req.url == '/banned-ips/main.js') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/bannedIps/main.js'));
			res.end();
			return;
		};
	};
	if (req.url == '/banned-ips/main.css') {
		if (server_active) {
			res.write(fs.readFileSync('serverPages/bannedIps/main.css'));
			res.end();
			return;
		};
	};
	res.write(fs.readFileSync('errPage/must_start_server_first.html'));
	res.end();
});


function renameConsoleWindow (text) {
	proc.exec('title '+text);
};
var minecraft_console = {
	log: function (msg) {
		io.emit('res.logData', ""+msg);
		console.log(String(""+msg));
	},
	error: function (msg) {
		io.emit('res.logError', ""+msg);
		console.log(String("Error: "+msg).error);
	},
	send: function (msg,buffer) {
		if (buffer) {
			server_proc.stdin.write(msg);
		} else {
			server_proc.stdin.write(msg + "\r");
		};
	},
	clear: function () {
		console.clear();
		console.log('Console was cleared'.gray.italic);
		io.emit('res.clearConsole');
	},
	brodcast: function (msg) {
		this.send('tellraw @a ["",{"text":"<Server> '+msg+'"}]');
	}
};

http.listen(port,function () {
	minecraft_console.log("[MSI SERVER]: "+'MSI Server started');
});

function startServerHandler(name) {
	if (server_active == false) {
		minecraft_console.log("[MSI SERVER]: "+'Starting server "'+name+'"');
		server_active = true;
		server = server_list[name];
		
		renameConsoleWindow('MSI ^| '+server.name);
		
		if (server.platform == 'java') {
			server_proc = proc.spawn(
				"java",
				['-Xms1024M', '-Xmx1024M', '-jar', server.folder+'.jar', 'nogui'],
				{cwd: 'servers/'+server.folder}
			);
		} else if (server.platform == 'bedrock') {
			if (server.type == "PocketMine-MP") {
				server_proc = proc.spawn(
					"cmd.exe",
					['/c', 'start.cmd'],
					{cwd: 'servers/'+server.folder}
				);
			} else if (server.type == "Vanilla") {
				server_proc = proc.spawn(
					server.folder+".exe",
					[],
					{cwd: 'servers/'+server.folder}
				);
			};
		};
		
		console.log(server_proc.pid);
		
		io.emit('res.serverStarted', server);
		
		server_proc.stdout.on('data', function (data) {
			if (data) {
				minecraft_console.log("[MSI SERVER]: "+data);
			}
		});

		server_proc.stderr.on('data', function (data) {
			if (data) {
				minecraft_console.error("[MSI SERVER]: "+data);
			}
		});

		server_proc.on('exit', function () {
			minecraft_console.log("[MSI SERVER]: "+'Stopping server "'+server.name+'"');
			minecraft_console.clear();
			renameConsoleWindow('MSI');
			server_active = false;
			server_proc = server = null;
			io.emit('res.stopServer');
		});
	};
};

const msi_password = require('./password.js');

if (process.argv[3] == 'start') {
	if (process.argv[4]) {
		startServerHandler(process.argv[4]);
	};
};

proc.exec('taskkill /F /IM php.exe');

function killServerHandler() {
	if (server_active) {
		proc.exec('taskkill /F /IM php.exe');
		server_proc.kill();
	};
};

io.emit('res.stopServer');

io.on('connection',function (client) {
	minecraft_console.log("[MSI SERVER]: "+'MSI Client connected');
	client.on('req.serverList',function () {
		client.emit('res.serverList',JSON.stringify(server_list));
	});
	client.on('req.startServer',startServerHandler);
	client.on('req.stopServer',killServerHandler);
	client.on('req.clearConsole',function () {
		minecraft_console.clear();
	});
	client.on('req.updateClientInterface',function (data) {
		io.emit('res.updateClientInterface',data);
	});
	client.on('req.confirmPassword',function (password) {
		if (password == msi_password) {
			client.emit('res.confirmPassword',{
				password: password,
				status: true
			});
		} else {
			client.emit('res.confirmPassword',{
				password: password,
				status: false
			});
		};
	});
	client.on('req.sendCommand', function(cmd) {
		minecraft_console.log("[MSI SERVER]: "+"Player Command: " + cmd);
		if (cmd.slice(0,3) == 'msi') {
			if (cmd.slice(4,9) == 'clear') {
				minecraft_console.clear();
				return;
			};
			if (cmd.slice(4,9) == 'start') {
				startServerHandler(cmd.slice(10));
				return;
			};
			if (cmd.slice(4,8) == 'stop' && server_active) {
				killServerHandler();
				return;
		}	;
			if (cmd.slice(4,13) == 'broadcast') {
				if (server_active) {
					minecraft_console.brodcast(String(cmd.slice(14)));
				} else {
					minecraft_console.error("[MSI SERVER]: "+'No server has been started!');
				};
				return;
			};
			return;
		};
		if (server_proc) {
			if (server.type == "bedrock") {
				minecraft_console.send(cmd,true);
			} else {
				minecraft_console.send(cmd);
			};
		} else {
			client.emit('res.fail',2);
		};
	});
	client.on('req.serverStatusJSON',function () {
		got('https://mcapi.us/server/status?ip='+ipAdd+'&port='+((server != null | undefined) ? server.port : 25565), { json: true }).then(response => {
			client.emit('res.serverStatusJSON',response.body);
		}).catch(error => {
			throw error;
		});
	});
	client.on('req.consoleAlreadyActive',function () {
		if (server_active) {
			client.emit('res.consoleAlreadyActive',server);
		};
	});
	client.on('req.whitelistData',function () {
		client.emit('res.whitelistData',fs.readFileSync('servers/'+server.folder+'/'+((server.platform == 'bedrock') ? 'white-list.txt' : 'whitelist.json')).toString(),server);
	});
	client.on('req.opsData',function () {
		client.emit('res.opsData',fs.readFileSync('servers/'+server.folder+'/ops.'+((server.platform == 'bedrock') ? 'txt' : 'json')).toString(),server);
	});
	client.on('req.bannedPlayersData',function () {
		client.emit('res.bannedPlayersData',fs.readFileSync('servers/'+server.folder+'/banned-players.'+((server.platform == 'bedrock') ? 'txt' : 'json')).toString(),server);
	});
	client.on('req.bannedIpsData',function () {
		client.emit('res.bannedIpsData',fs.readFileSync('servers/'+server.folder+'/banned-ips.'+((server.platform == 'bedrock') ? 'txt' : 'json')).toString(),server);
	});
	client.on('req.currentConnectedServer',function () {
		client.emit('res.currentConnectedServer',server);
	});
});

process.stdin.resume();
process.stdin.on('data', function (cmd) {
	var cmdStr = cmd.toString();
	minecraft_console.log("[MSI SERVER]: "+"Player Command: " + cmdStr);
	if (cmdStr.slice(0,3) == 'msi') {
		if (cmdStr.slice(4,8) == 'stop' && server_active) {
			killServerHandler();
			return;
		};
		if (cmdStr.slice(4,9) == 'start') {
			startServerHandler('"'+cmdStr.slice(10)+'"');
			return;
		};
		if (cmdStr.slice(4,9) == 'clear') {
			minecraft_console.clear();
			return;
		};
		if (cmdStr.slice(4,13) == 'broadcast') {
			if (server_active) {
				minecraft_console.brodcast(String(cmdStr.slice(14)));
			} else {
				minecraft_console.error("[MSI SERVER]: "+'No server has been started!');
			};
			return;
		};
		return;
	};
	if (server_proc) {
		minecraft_console.send(cmd,true);
	};
});