const { joinVoiceChannel } = require("@discordjs/voice");
const vars = require("../variables.js");

module.exports = {
    name: "join",
    description: "Fait rejoindre un salon vocal au bot",
    execute (message, args) {

        if(message.member.roles.cache.has("991245511887691776")){
            if(message.member.voice.channel){
                if(vars.get("connection") == null){
                    vars.set("connection", joinVoiceChannel({
                        channelId: message.member.voice.channelId,
                        guildId: message.guildId,
                        adapterCreator: message.guild.voiceAdapterCreator
                    }));
                    vars.set("connectionChannelId", message.member.voice.channelId);
                    message.reply("Le bot viens de rejoindre votre salon vocal");
                    console.log(message.author.username + " : Join : " + vars.get("connectionChannelId"));
                } else {
                    if(vars.get("connectionChannelId") === message.member.voice.channelId){
                        message.reply("Le bot est déjà connecté à votre salon vocal");
                    } else {
                        vars.set("connection", joinVoiceChannel({
                            channelId: message.member.voice.channelId,
                            guildId: message.guildId,
                            adapterCreator: message.guild.voiceAdapterCreator
                        }));
                        vars.set("connectionChannelId", message.member.voice.channelId);
                        message.reply("Le bot viens de rejoindre votre salon vocal");
                        console.log(message.author.username + " : Rejoin : " + vars.get("connectionChannelId"));
                    }
                }
            } else {
                message.reply("Veuillez vous connecter à un salon vocal");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }                
    }
}

