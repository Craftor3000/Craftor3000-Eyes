const vars = require("../variables.js");

module.exports = {
    name: "suppr",
    description: "Supprime un nombre de message déterminé",
    execute (message, args, isInteraction) {
        if(message.member.roles.cache.has("991245759867535360")){
            if(args.length > 1){
                let textNumber = args[1];
                let number = Number(textNumber);
                if(number > 0 && number < 101){
                    var user;
                    if(isInteraction){
                        message.channel.bulkDelete(number);
                        user = message.user.username;
                    } else {
                        message.channel.bulkDelete(number + 1);
                        user = message.author.username
                    }
                    console.log(user + " : Suppr : " + textNumber + " messages");
                    if(number == 1){
                        message.reply("1 message a été supprimé");
                    } else {
                        message.reply(textNumber + " messages ont été supprimés");
                    }
                } else {
                    message.reply("Le nombre de message à supprimer doit se trouver entre 1 et 100");
                }
            } else {
                message.reply("Arguments insuffisants : !suppr <nombre>");
            }
        } else {
            message.reply("Vous n'avez pas la permission d'exécuter cette commande");
        }   
    }
}