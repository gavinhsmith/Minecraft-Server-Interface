const socket = io();

socket.emit('req.opsData');
socket.emit('req.currentConnectedServer');

let ops;

const page_title = document.getElementById('page_title');
const acc_master = document.getElementById('acc_master');
var dataholder = document.createElement('pre');
dataholder.style.display = 'none';

socket.on('res.opsData',function (data,server) {
	if (localStorage.msi_loggedin == String(true)) {
		dataholder.style.display = 'block';
		acc_master.style.display = 'block';
	} else {
		window.location.href = '/?from=lrerr';
		return;
	};
	if (server.type == 'bedrock') {
		ops = data;
		
		acc_master.style.display = 'none'
		
		dataholder.style.setProperty('word-wrap','break-word');
		dataholder.style.setProperty('white-space','pre-wrap');
		dataholder.style.setProperty('font-family','Arial');
		
		dataholder.innerHTML = data;
		document.body.appendChild(dataholder);
	} else {
		ops = JSON.parse(data);
		
		if (ops.length == 0) {
			acc_master.style.textAlign = 'center';
			var h1Err = document.createElement('h1');
			h1Err.innerHTML = 'Nobodys here...'
			acc_master.appendChild(h1Err);
		};
		
		for (var u in ops) {
			newAccount(ops[u].name,ops[u].uuid,ops[u].level);
		};
	}
});
socket.on('res.currentConnectedServer',function (data) {
	page_title.innerHTML = 'Server OPs | '+data.name;
});

function newAccount (name,uuid,opLevel) {
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
	
	var newAccOpLvl = document.createElement('h4');
	newAccOpLvl.classList.add('accOpLvl');
	newAccOpLvl.innerHTML = 'Operator Level: '+opLevel;
	
	newAccContainer.appendChild(newAccImg);
	newAccContainer.appendChild(newAccName);
	newAccContainer.appendChild(newAccUUID);
	newAccContainer.appendChild(newAccOpLvl);
	
	acc_master.appendChild(newAccContainer);
};