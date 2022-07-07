const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ticketFail",
    description: "Ferme un ticket par un échec",
    execute (interaction) {
        let chan = interaction.guild.channels.cache.get("987785363252715570");
        let args = interaction.channel.topic.split("│");
        let date = args[1].split(",");
        let closeDate = new Date().toLocaleString().split(",");
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Echec du ticket de " + args[0])
            .setDescription("*Ticket créé le " + date[0] + " à" + date[1] + " et fermé le " + closeDate[0] + " à" + closeDate[1] + "*\n\n**Sujet du ticket :**\n" + args[2] + "\n\n**Description :**\n" + args[3]);
        chan.send({ embeds: [embed]});
        console.log(interaction.user.username + " : ticketFail : " + args[0] + " : " + args[2]);
        if(interaction.channel.deletable){
            interaction.channel.delete();
        } 
    }
}