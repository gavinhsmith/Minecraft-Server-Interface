function Server(ip) {
	var ip = ip.split(':')[0];
	var port = (ip.split(';')[1] != null | undefined) ? Number(ip.split(';')[1]) : 25565;
	
	MinecraftAPI.getServerStatus(ip,{
		port: port
	},function (err,res) {
		if (err) {
			throw err;
			return;
		};
		var pre = document.createElement('pre');
		pre.style.wordWrap = 'break-word';
		pre.style.whiteSpace = 'pre-wrap';
		pre.innerHTML = JSON.stringify(res);
		document.body.appendChild(pre);
	});
};

Server('96.60.13.193');