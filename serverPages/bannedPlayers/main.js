const socket = io();

socket.emit('req.bannedPlayersData');
socket.emit('req.currentConnectedServer');

let bannedPlayers;

const page_title = document.getElementById('page_title');
const acc_master = document.getElementById('acc_master');
var dataholder = document.createElement('pre');
dataholder.style.display = 'none';

socket.on('res.bannedPlayersData',function (data,server) {
	if (localStorage.msi_loggedin == String(true)) {
		dataholder.style.display = 'block';
		acc_master.style.display = 'block';
	} else {
		window.location.href = '/?from=lrerr';
		return;
	};
	if (server.type == 'bedrock') {
		bannedPlayers = data;
		
		acc_master.style.display = 'none'
		
		dataholder.style.setProperty('word-wrap','break-word');
		dataholder.style.setProperty('white-space','pre-wrap');
		dataholder.style.setProperty('font-family','Arial');
		
		dataholder.innerHTML = data;
		document.body.appendChild(dataholder);
	} else {
		bannedPlayers = JSON.parse(data);
		
		if (bannedPlayers.length == 0) {
			acc_master.style.textAlign = 'center';
			var h1Err = document.createElement('h1');
			h1Err.innerHTML = 'Nobodys here...'
			acc_master.appendChild(h1Err);
		};
		
		for (var u in bannedPlayers) {
			newAccount(bannedPlayers[u].name,bannedPlayers[u].uuid,bannedPlayers[u].reason);
		};
	}
});
socket.on('res.currentConnectedServer',function (data) {
	page_title.innerHTML = 'Banned Players | '+data.name;
});

function newAccount (name,uuid,reason) {
	var newAccContainer = document.createElement('div');
	newAccContainer.classList.add('accContainer');
	
	var newAccImg = new Image(100,100);
	newAccImg.src = "https://crafatar.com/avatars/"+uuid;
	newAccImg.classList.add('accImg');
	
	var newAccName = document.createElement('h2');
	newAccName.classList.add('accName');
	newAccName.innerHTML = name;
	
	var newAccUUID = document.createElement('h4');
	newAccUUID.classList.add('accUUID');
	newAccUUID.innerHTML = uuid;
	
	var newAccReason = document.createElement('h4');
	newAccReason.classList.add('accReason');
	newAccReason.innerHTML = 'Reason: '+reason;
	
	newAccContainer.appendChild(newAccImg);
	newAccContainer.appendChild(newAccName);
	newAccContainer.appendChild(newAccUUID);
	newAccContainer.appendChild(newAccReason);
	
	acc_master.appendChild(newAccContainer);
};