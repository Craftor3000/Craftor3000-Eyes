const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
    name: "ticket",
    description: "Affiche le modal pour la création d'un ticket",
    execute (interaction) {
        if(interaction.member.roles.cache.has("991245603797487657")){
            const modal = new Modal()
                .setCustomId('ticketCreation')
                .setTitle('Créer un ticket')
                .addComponents([
                    new TextInputComponent()
                        .setCustomId('ticketType')
                        .setLabel('Le nom de votre ticket')
                        .setStyle('SHORT')
                        .setMinLength(3)
                        .setMaxLength(15)
                        .setPlaceholder('Report, Suggestion, Sanction, etc... ')
                        .setRequired(true),
                ])
                .addComponents([
                    new TextInputComponent()
                        .setCustomId("ticketDescription")
                        .setLabel("Description")
                        .setStyle("LONG")
                        .setMaxLength(2000)
                        .setPlaceholder("J'aimerai que le bot puisse cuisiner des gâteaux !")
                        .setRequired(true)
                ])
        
            showModal(modal, {
                client: interaction.client,
                interaction: interaction,
            });
        } else {
            interaction.reply({content: "Vous n'avez pas la permission de créer un ticket", ephemeral: true});
        }
    }
}