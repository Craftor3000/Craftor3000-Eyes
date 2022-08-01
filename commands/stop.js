const vars = require("../variables.js");

module.exports = {
    name: "stop",
    description: "Déconnecte le bot du salon vocal",
    execute (message, args, isInteraction) {
        if(message.member.roles.cache.has("991245511887691776")){
            if(vars.get("connection") != null){
                vars.get("connection").disconnect();
                vars.set("connection", null);
                console.log(message.member.user.username + " : Stop : " + vars.get("connectionChannelId"));
                vars.set("connectionChannelId", null);
                vars.set("audioPlaying", false);
                message.reply("Le bot vient de se déconnecter de votre salon vocal");
            } else {
                message.reply("Le bot est déjà déconnecté");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }
    }
}