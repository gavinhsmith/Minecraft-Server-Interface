const socket = io();

socket.emit('req.whitelistData');
socket.emit('req.currentConnectedServer');

let whitelist;

const page_title = document.getElementById('page_title');
const acc_master = document.getElementById('acc_master');
var dataholder = document.createElement('pre');
dataholder.style.display = 'none';

socket.on('res.whitelistData',function (data,server) {
	if (localStorage.msi_loggedin == String(true)) {
		dataholder.style.display = 'block';
		acc_master.style.display = 'block';
	} else {
		window.location.href = '/?from=lrerr';
		return;
	};
	if (server.type == 'bedrock') {
		whitelist = data;
		
		acc_master.style.display = 'none'
		
		dataholder.style.setProperty('word-wrap','break-word');
		dataholder.style.setProperty('white-space','pre-wrap');
		dataholder.style.setProperty('font-family','Arial');
		
		dataholder.innerHTML = data;
		document.body.appendChild(dataholder);
	} else {
		whitelist = JSON.parse(data);
		
		if (whitelist.length == 0) {
			acc_master.style.textAlign = 'center';
			var h1Err = document.createElement('h1');
			h1Err.innerHTML = 'Nobodys here...'
			acc_master.appendChild(h1Err);
		};
		
		for (var u in whitelist) {
			newAccount(whitelist[u].name,whitelist[u].uuid);
		};
	}
});
socket.on('res.currentConnectedServer',function (data) {
	page_title.innerHTML = 'Server Whitelist | '+data.name;
});

function newAccount (name,uuid) {
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
	
	newAccContainer.appendChild(newAccImg);
	newAccContainer.appendChild(newAccName);
	newAccContainer.appendChild(newAccUUID);
	
	acc_master.appendChild(newAccContainer);
};