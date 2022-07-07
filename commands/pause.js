const vars = require("../variables.js");

module.exports = {
    name: "pause",
    description: "Met en pause la musique",
    execute (message, args, isInteraction) {
        if(message.member.roles.cache.has("991245511887691776")){
            if(vars.get("connection") != null){
                if(vars.get("playerPause") == false){
                    vars.get("player").pause();
                    vars.set("playerPause", true);
                    vars.set("audioPlaying", false);
                    message.reply("Le bot a été mis en pause");
                    var user;
                    if(isInteraction){
                        user = message.user.username;
                    } else {
                        user = message.author.username;
                    }
                    console.log(user + " : Pause : " + vars.get("connectionChannelId"));
                } else {
                    message.reply("Le bot est déjà en pause");
                }                   
            } else {
                message.reply("Veuillez connecter le bot à un salon vocal");
            } 
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }
    }
}