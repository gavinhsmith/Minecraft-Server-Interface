function Server (name,version,platform,type,folder,port) {
	this.name = name;
	this.version = version;
	this.type = (type != undefined | null) ? type : 'Vanilla';
	this.platform = platform;
	this.folder = (folder != null | undefined) ? folder : this.name;
	this.port = (port != null | undefined) ? port : (this.platform == 'bedrock') ? 19132 : 25565;
};

module.exports = {};