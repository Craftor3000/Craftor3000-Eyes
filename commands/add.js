const vars = require("../variables.js");
const ytdl = require("ytdl-core");

module.exports = {
    name: "add",
    description: "Ajoute une musique à la playlist",
    execute (message, args) {
        if(message.member.roles.cache.has("991245511887691776")){
            if(args.length > 1){
                let newMusic = args[1];
                if(ytdl.validateURL(newMusic)){
                    vars.get("musicQueue").push(newMusic);
                    message.reply(newMusic + " a été ajouté dans la playlist");
                    console.log(message.author.username + " : Add : " + newMusic);
                } else {
                    message.reply("URL invalide");
                }
            } else {
                message.reply("Arguments insuffisants : !add <lien>");
            } 
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }
    }
}