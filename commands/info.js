const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "info",
    description: "Donne les informations du bot",
    execute (message, args) {
        const embed = new MessageEmbed()
            .setColor("GOLD")
            .setTitle("Informations de Craftor3000's Eyes")
            .setDescription("**Autheur :** <@927990159495008266>\n**Version :** Bêta 1.0c")
        message.reply({allowedMentions: false, embeds: [embed]});
        console.log(message.author.username + " : Info");
    }
}