const vars = require("../variables.js");

module.exports = {
    name: "unpause",
    description: "Arrête la pause de la musique",
    execute (message, args, isInteraction) {
        if(message.member.roles.cache.has("991245511887691776")){
            if(vars.get("connection") != null){
                if(vars.get("playerPause") == true){
                    vars.get("player").unpause();
                    vars.set("playerPause", false);
                    vars.set("audioPlaying", true);
                    message.reply("Le bot vient d'arrêter sa pause");
                    console.log(message.member.user.username + " : Unpause : " + vars.get("connectionChannelId"));
                } else {
                    message.reply("Le bot n'est pas en pause");
                }  
            } else {
                message.reply("Veuillez connecter le bot à un salon vocal");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }
    }
}