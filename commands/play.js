const ytdl = require("ytdl-core");
const { MessageActionRow, MessageButton } = require("discord.js");
const { createAudioResource } = require("@discordjs/voice");
const vars = require("../variables.js");

module.exports = {
    name: "play",
    description: "Joue de la musique dans le salon vocal où le bot est connecté",
    execute (message, args, isInteraction) {
        if(message.member.roles.cache.has("991245511887691776")){
            if(message.member.voice.channel){
                if(vars.get("connection") != null){
                    var stream = null;
                    if(args.length > 1){
                        if(ytdl.validateURL(args[1])){
                            stream = ytdl(args[1], {filter: 'audioonly'});
                        } else {
                            message.reply("URL invalide");
                        }
                    } else {
                        if(vars.get("musicQueue").length != 0){
                            stream = ytdl(vars.get("musicQueue")[0], {filter: 'audioonly'});
                        } else {
                            message.reply("La playlist est vide");
                        }
                    }
                    if(stream != null){
                        const resource = createAudioResource(stream);
                        if(vars.get("connectionChannelId") != message.member.voice.channelId) {
                            vars.get("connectionChange").push(true);
                            const row = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("rejoinQuestionYes")
                                        .setLabel("Oui")
                                        .setStyle("SUCCESS")
                                )
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("rejoinQuestionNo")
                                        .setLabel("Non")
                                        .setStyle("DANGER")
                                )
                            message.reply({content: "Voulez-vous reconnecter le bot dans le bon salon vocal ?", components: [row]});
                            vars.set("lastPlayerStream", args[1]);
                            console.log(message.member.user.username + " : Question : Rejoin : " + message.member.voice.channelId + " + Play : " + args[1]);
                        } else {
                            vars.get("connection").subscribe(vars.get("player"));
                            vars.get("player").play(resource);
                            vars.set("audioPlaying", true);
                            vars.set("playerPause", false);
                            let musicSource;
                            if(args.length > 1){
                                vars.get("musicQueue").unshift(args[1]);
                                musicSource = args[1];
                            } else {
                                musicSource = vars.get("musicQueue")[0];
                            }
                            message.reply("Lecture de l'audio dans le salon vocal");
                            console.log(message.member.user.username + " : Play : " + musicSource);
                        }
                    }
                } else {
                    message.reply("Veuillez connecter le bot à un salon vocal");
                }
            } else {
                message.reply("Veuillez vous connecter à un salon vocal");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }
    }
}