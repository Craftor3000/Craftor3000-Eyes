const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ticketPing",
    description: "Ping le staff dans un ticket",
    execute (interaction) {
        interaction.channel.send("<@&987781162992820254>").then(message => {if(message.deletable) message.delete();});
        const embed = new MessageEmbed()
            .setColor("0099ff")
            .setDescription("Un membre de notre équipe de support a été prévenu et arrivera dès que possible !")
        interaction.reply({embeds: [embed], ephemeral: true});
        console.log(interaction.user.username + " : ticketPing : " + interaction.channel.name);
    }
}