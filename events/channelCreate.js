const vars = require("../variables.js");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
    name: "channelCreate",
    execute (channel) {
        if(vars.get("uploadTicketEmbed")){
            if(vars.get("lastTicketData").length > 2){
                if(channel.isText()){
                    let name = vars.get("lastTicketData")[0];
                    let description = vars.get("lastTicketData")[1];
                    let person = vars.get("lastTicketData")[2];
                    vars.get("lastTicketData").shift();
                    vars.get("lastTicketData").shift();
                    vars.get("lastTicketData").shift();
                    vars.set("uploadTicketEmbed", false);
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
}