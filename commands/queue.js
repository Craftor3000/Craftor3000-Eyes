const vars = require("../variables.js");

module.exports = {
    name: "queue",
    description: "Affiche la playlist",
    execute (message, args, isInteraction) {
        if(vars.get("musicQueue").length != 0){
            if(vars.get("musicQueue").length == 1){
                message.reply(vars.get("musicQueue").toString());
            } else {
                let reply = vars.get("musicQueue").toString().replace(",", "\n");
                message.reply(reply);
            }
            console.log(message.member.user.username + " : Playlist : " + vars.get("musicQueue").length);
        } else {
            message.reply("La playlist est vide");
        }
    }
}