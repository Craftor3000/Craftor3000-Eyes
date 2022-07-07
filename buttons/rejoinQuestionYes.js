const vars = require("../variables.js");
const ytdl = require("ytdl-core");
const { createAudioResource } = require("@discordjs/voice");

module.exports = {
    name: "rejoinQuestionYes",
    description: "Répond Oui à la reconnection du bot dans le bon channel vocal",
    execute (interaction) {
        if(vars.get("connectionChange")[0]){
            vars.set("connection", joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            }));
            vars.set("connectionChannelId", interaction.member.voice.channelId);
            const stream = ytdl(vars.get("lastPlayerStream"), {filter: 'audioonly'});
            const resource = createAudioResource(stream);
            vars.get("connection").subscribe(vars.get("player"));
            vars.get("player").play(resource);
            vars.set("audioPlaying", true);
            vars.get("musicQueue").push(vars.get("lastPlayerStream"));
            interaction.reply("Le bot viens de rejoindre votre salon vocal et commence la lecture de l'audio");
            console.log(interaction.user.username + " : Yes : Rejoin : " + vars.get("connectionChannelId") + " + Play : " + vars.get("lastPlayerStream"));
            vars.get("connectionChange").shift();
            vars.set("lastPlayerStream", null);
        } else {
            interaction.reply({content: "Aucune réponse ne vous a été demandée", ephemeral: true});
        }
    }
}