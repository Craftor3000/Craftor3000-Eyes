const vars = require("../variables.js");
const ytdl = require("ytdl-core");
const { createAudioResource } = require("@discordjs/voice");

module.exports = {
    name: "rejoinQuestionNo",
    description: "Répond Non à la reconnection du bot dans le bon channel vocal",
    execute (interaction) {
        if(vars.get("connectionChange")[0]){
            const stream = ytdl(vars.get("lastPlayerStream"), {filter: 'audioonly'});
            const resource = createAudioResource(stream);
            vars.get("connection").subscribe(vars.get("player"));
            vars.get("player").play(resource);
            vars.set("audioPlaying", true);
            interaction.reply("Lecture de l'audio dans le salon vocal");
            console.log(interaction.user.username + " : No : Rejoin + Play");
            vars.get("connectionChange").shift();
        } else {
            interaction.reply({content: "Aucune réponse ne vous a été demandée", ephemeral: true});
        }
    }
}