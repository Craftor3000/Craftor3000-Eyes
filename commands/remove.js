const vars = require("../variables.js");

module.exports = {
    name: "remove",
    description: "Retire la première musique de la playlist",
    execute (message, args, isInteraction) {
        if(message.member.roles.cache.has("991245511887691776")){
            if(vars.get("musicQueue").length != 0){
                message.reply(vars.get("musicQueue")[0] + " a été retiré de la playlist");
                var user;
                if(isInteraction){
                    user = message.user.username;
                } else {
                    user = message.author.username;
                }
                console.log(user + " : Remove : " + vars.get("musicQueue")[0]);
                vars.get("musicQueue").shift();
            } else {
                message.reply("La playlist est déjà vide");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }   
    }
}