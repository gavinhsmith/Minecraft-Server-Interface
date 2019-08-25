const socket = io();

const server_list = document.getElementById('server_list');
const msi_main = document.getElementById('msi_main');
const msi_console = document.getElementById('msi_console');
const msi_enter_command = document.getElementById('msi_enter_command');
const msi_title = document.getElementById('msi_title');
const page_title = document.getElementById('page_title');
const loading_gif = document.getElementById('loading_gif');
const close_server_button = document.getElementById('close_server_button');
const err = document.getElementById('err');
const err_text = document.getElementById('err_text');
const msi_version = document.getElementById('msi_version');
const server_list_internal = document.getElementById('server_list_internal');
const msi_cover = document.getElementById('msi_cover');
const msi_pasword = document.getElementById('msi_password');

var currentServer = null;

let serverList;

function sendCommand(e) {
	if (e.keyCode == 13 && msi_enter_command.value != '') {
		socket.emit('req.sendCommand',msi_enter_command.value);
		msi_enter_command.value = '';
	};
};
function appendCommand(data) {
	var newCommand = document.createElement('span');
	newCommand.innerHTML = ""+data;
	newCommand.style.marginBottom = '4px';
	
	var isAtBottom = false;
	
	if (msi_console.scrollTop = msi_console.scrollHeight) {
		isAtBottom = true;
	};
	
	msi_console.appendChild(newCommand);
	msi_console.appendChild(document.createElement('br'));
	msi_console.appendChild(document.createElement('br'));
	
	if (isAtBottom) {
		scrollBottom(msi_console);
	};
};
function clearTextMsg() {
	var newCommand = document.createElement('span');
	newCommand.innerHTML = "Console was cleared";
	newCommand.style.marginBottom = '4px';
	newCommand.style.color = 'gray';
	newCommand.style.fontStyle = 'italic';
	msi_console.appendChild(newCommand);
	msi_console.appendChild(document.createElement('br'));
	msi_console.appendChild(document.createElement('br'));
};

let server_status;

function updateServerStatus () {
	socket.emit('req.serverStatusJSON')
};

socket.on('res.serverStatusJSON',function (obj) {
	server_status = obj;
	server_status.server_image = function (upscale) {
		var upscaleC = document.createElement('canvas');
		upscaleC.width = 64 * upscale;
		upscaleC.height = 64 * upscale;
		var upscaleCtx = upscaleC.getContext('2d');
		var img1 = new Image();
		img1.src = server_status.favicon;
		upscaleCtx.drawImage(img1,0,0,64,64,0,0,64 * upscale,64 * upscale);
		var img2 = new Image();
		img2.src = upscaleC.toDataURL();
		
		upscaleC = null;
		upscaleCtx = null;
		img1 = null;
		
		return img2;
	};
	var motdParsed = document.createElement('span');
	motdParsed.id = "server_motd";
	
	var motdSplit = server_status.motd.split('\n');
	
	var motdL1 = document.createElement('span');
	motdL1.id = "server_motd_line1";
	motdL1.innerHTML = MinecraftTextJS.toHTML(motdSplit[0]);
	motdParsed.appendChild(motdL1);
	
	if (motdSplit[1] != null | undefined) {
		motdParsed.appendChild(document.createElement('br'));
		var motdL2 = document.createElement('span');
		motdL2.id = "server_motd_line2";
		motdL2.innerHTML = MinecraftTextJS.toHTML(motdSplit[1]);
		motdParsed.appendChild(motdL2);
	};
	
	server_status.htmlMotd = motdParsed;
});

function appendCommandErr(data) {
	showErr(""+data);
};

socket.emit('req.consoleAlreadyActive');

socket.on('res.consoleAlreadyActive',function (data) {
	server_list.style.display = 'none';
	msi_title.innerHTML = 'Minecraft Server: '+data.name;
	msi_version.innerHTML = 'Server: '+data.type+', Version: '+data.version+', Platform: '+((data.platform == 'java') ? 'Java Edition' : 'Bedrock Edition');
	page_title.innerHTML = 'MSI | '+data.name;
	currentServer = data.name;
	msi_main.style.display = 'block';
});

msi_enter_command.addEventListener('keydown',sendCommand);

function openInterface1(data) {
	socket.emit('req.updateClientInterface',data);
	socket.emit('req.startServer',data);
};

socket.on('res.updateClientInterface',openInterface);

msi_pasword.addEventListener('keydown',function (e) {
	if (e.keyCode == 13) {
		confirmPassword();
	};
});

function confirmPassword() {
	var password = msi_pasword.value;
	msi_pasword.value = '';
	
	socket.emit('req.confirmPassword',password);
};

if (localStorage.msi_loggedin == String(true)) {
	msi_cover.style.display = 'none';
};

function logout() {
	localStorage.msi_loggedin = false;
	window.location.reload();
};

function resPasswordCHandle(data) {
	if (data.status) {
		msi_cover.style.display = 'none';
		localStorage.msi_loggedin = true;
	};
};
socket.on('res.confirmPassword',resPasswordCHandle);

function openInterface(data) {
	for (var k in serverList) {
		if (serverList[k].folder == data) {
			server_list.style.display = 'none';
			msi_title.innerHTML = 'Minecraft Server: '+serverList[k].name;
			msi_version.innerHTML = 'Server: '+serverList[k].type+', Version: '+serverList[k].version+', Platform: '+((serverList[k].platform == 'java') ? 'Java Edition' : 'Bedrock Edition');
			page_title.innerHTML = 'MSI | '+serverList[k].name;
	
			currentServer = serverList[k];
	
			msi_main.style.display = 'block';
		};
	};
};

function getQueryVariable (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    };
    return(false);
};

function showErr (text) {
	err_text.innerHTML = text;
	err.style.display = 'block';
};
function hideErr() {
	err.style.display = 'none';
};

if (getQueryVariable('from')) {
	var variable = getQueryVariable('from');
	if (variable == 'mssferr') {
		showErr('You cannot view the server properties or other files as such until you start a server.');
	};
	if (variable == 'cjberr') {
		showErr('MSI does not currently have support to get Bedrock Edition server information.');
	};
	if (variable == 'lrerr') {
		showErr('You must be logged in to view that content.');
	};
};

socket.on('res.clearConsole',function () {
	msi_console.innerHTML = '';
	
});
socket.on('res.logData',appendCommand);
socket.on('res.logError',appendCommandErr);

function closeServer() {
	socket.emit('req.stopServer');
};

function stopServerStyle2() {
	loading_gif.style.opacity = '1';
	close_server_button.style.opacity = '0.5';
	close_server_button.removeEventListener('click',closeServer);
	setTimeout(function () {
		server_list.style.display = 'block';
		msi_main.style.display = 'none';
		loading_gif.style.opacity = '0';
		close_server_button.style.opacity = '1';
		close_server_button.addEventListener('click',closeServer);
		page_title.innerHTML = 'MSI';
		clearTextMsg();
	},2000);
};

function stopServerStyle () {
	if (currentServer != null) {
		currentServer = null;
		stopServerStyle2();
	};
};

socket.on('res.stopServer',stopServerStyle);

socket.emit('req.serverList');

socket.on('res.serverList',function (list) {
	serverList = JSON.parse(list);
	for (var i in JSON.parse(list)) {
		var newServer = document.createElement('button');
		newServer.innerHTML = `${JSON.parse(list)[i].name} (${(JSON.parse(list)[i].platform == 'java') ? 'Java Edition' : 'Bedrock Edition'} | ${JSON.parse(list)[i].type} ${JSON.parse(list)[i].version})`;
		newServer.setAttribute('onclick','openInterface1("'+JSON.parse(list)[i].folder+'")');
		newServer.classList.add('serverSelect');
		server_list_internal.appendChild(newServer);
		server_list_internal.appendChild(document.createElement('br'));
		server_list_internal.appendChild(document.createElement('br'));
	};
});

function scrollBottom(element){
    element.scrollTop = element.scrollHeight;
};

function seconds(number) {
	return number*1000
};

setInterval(function () {
	updateServerStatus();
	MinecraftTextJS.refeashObfuscate();
},seconds(30));