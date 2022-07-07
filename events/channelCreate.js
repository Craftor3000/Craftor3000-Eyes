const vars = require("../variables.js");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    name: "channelCreate",
    execute (channel) {
        let channelName = channel.name.split("-");
        let creatorName = channel.topic.split("│")[0].toLowerCase();
        if(channelName[1] === creatorName){
            if(channel.isText()){
                let info = channel.topic.split("│");
                let name = info[2];
                let description = info[3];
                let person = info[0];
                let currentDate = new Date();
                let currentTextDate = currentDate.toLocaleString();
                let dates = currentTextDate.split(",");
                const ticketStart = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Ticket de " + person)
                    .setDescription("*Créé le " + dates[0] + " à" + dates[1] + "*\n\n**Sujet du ticket :** \n" + name + "\n\n**Description :**\n" + description + "\n\n*Un membre de notre notre équipe de <@&987781162992820254> vas traiter votre ticket rapidement !*")
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("ticketPing")
                            .setLabel("🔔 Ping l'équipe de support")
                            .setStyle("SECONDARY")
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId("ticketSuccess")
                            .setLabel("✅ Ticket résolu")
                            .setStyle("SUCCESS")
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId("ticketFail")
                            .setLabel("❌ Fermer le ticket")
                            .setStyle("DANGER")
                    )
                channel.send({ embeds: [ticketStart], components: [row] });
            }
        }
    }
}