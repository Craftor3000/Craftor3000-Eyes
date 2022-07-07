const Discord = require("discord.js");
const vars = require("./variables.js");
const fs = require("fs");
const ytdl = require("ytdl-core");
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Player } = require("discord-player");
const discordModals = require("discord-modals");
const { channel } = require("diagnostics_channel");
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
discordModals(Client);
Client.player = new Player(Client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

Client.login("OTgxOTg0MDczNzQ2NjI4Njc5.Gz2H4i.zkeGzeHolbo2YzPN0zOKuiwzEaFSYUR8XOG7I8");

Client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for(const file of commandFiles){
    const command = require("./commands/" + file);
    Client.commands.set(command.name, command);
}
for (const file of eventFiles) {
	const event = require("./events/" + file);
	if (event.once) {
		Client.once(event.name, (...args) => event.execute(...args));
	} else {
		Client.on(event.name, (...args) => event.execute(...args));
	}
}

//Auto-play dans la playlist quand la musique actuelle est terminé
vars.get("player").on(AudioPlayerStatus.Idle, () => {
    if(vars.get("audioPlaying")){
        if(vars.get("musicQueue").length != 0){
            vars.get("musicQueue").shift();
        }
        if(vars.get("musicQueue").length != 0){
            if(ytdl.validateURL(vars.get("musicQueue")[0])){
                const stream = ytdl(vars.get("musicQueue")[0], {filter: 'audioonly'});
                const resource = createAudioResource(stream);
                vars.get("connection").subscribe(vars.get("player"));
                vars.get("player").play(resource);
                console.log("AutoPlay : " + vars.get("musicQueue")[0]);
            }
        }
    }
});

//Crash Handlers
Client.on("error", err => {
    console.log("Erreur : général : " + err.name);
    console.log(err.message);
});
Client.on("shardError", err => {
    console.log("Erreur : Websocket and Network : " + err.name);
    console.log(err.message);
})
vars.get("player").on("error", err => {
    console.log("Erreur : player : " + err.message);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});