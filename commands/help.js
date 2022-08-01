const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche l'aide du bot, listant les commandes",
    execute (message, args, isInteraction) {
        const embed = new MessageEmbed()
            .setColor("GREY")
            .setTitle("Menu d'aide")
            .setDescription("**Commandes générales :**\n- help : Affiche le menu d'aide\n- suppr : Supprime un nombre déterminé de messages\n\n**Commandes de musique :**\n- join : Fait rejoindre un channel vocal au bot\n- play [url] : Joue de la musique dans le channel vocal où le bot est connecté\n- pause : Met en pause la musique en cours de lecture\n- unpause : Rétablie la lecture de la musique\n- stop : Arrête la diffusion de la musique et déconnecte le bot du channel vocal\n- queue : Affiche le contenu de la playlist\n- add <url> : Ajoute une musique dans la playlist\n- remove : Retire la première musique de la playlist")
        message.reply({embeds: [embed]});
        console.log(message.member.user.username + " : help");
    }
}