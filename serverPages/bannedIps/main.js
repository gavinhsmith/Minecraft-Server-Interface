const socket = io();

socket.emit('req.bannedIpsData');
socket.emit('req.currentConnectedServer');

let bannedIps;

const page_title = document.getElementById('page_title');
const acc_master = document.getElementById('acc_master');
var dataholder = document.createElement('pre');
dataholder.style.display = 'none';

socket.on('res.bannedIpsData',function (data,server) {
	if (localStorage.msi_loggedin == String(true)) {
		dataholder.style.display = 'block';
		acc_master.style.display = 'block';
	} else {
		window.location.href = '/?from=lrerr';
		return;
	};
	if (server.type == 'bedrock') {
		bannedIps = data;
		
		acc_master.style.display = 'none'
		
		dataholder.style.setProperty('word-wrap','break-word');
		dataholder.style.setProperty('white-space','pre-wrap');
		dataholder.style.setProperty('font-family','Arial');
		
		dataholder.innerHTML = data;
		document.body.appendChild(dataholder);
	} else {
		bannedIps = JSON.parse(data);
		
		if (bannedIps.length == 0) {
			acc_master.style.textAlign = 'center';
			var h1Err = document.createElement('h1');
			h1Err.innerHTML = 'Nobodys here...'
			acc_master.appendChild(h1Err);
		};
		
		for (var u in bannedIps) {
			newAccount(bannedIps[u].ip,whitelist[u].reason);
		};
	}
});
socket.on('res.currentConnectedServer',function (data) {
	page_title.innerHTML = 'Banned Players | '+data.name;
});

function newAccount (ip,reason) {
	var newAccContainer = document.createElement('div');
	newAccContainer.classList.add('accContainer');
	
	var newAccIp = document.createElement('h2');
	newAccIp.classList.add('accIp');
	newAccIp.innerHTML = 'Banned IP: '+ip;
	
	var newAccReason = document.createElement('h4');
	newAccReason.classList.add('accReason');
	newAccReason.innerHTML = 'Reason: '+reason;
	
	newAccContainer.appendChild(newAccIp);
	newAccContainer.appendChild(newAccReason);
	
	acc_master.appendChild(newAccContainer);
};