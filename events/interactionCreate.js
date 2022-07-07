const vars = require("../variables.js");
const { MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
    name: "interactionCreate",
    execute (interaction) {
        //Commandes
        if(interaction.isCommand()) {
            var message = interaction;
            var args = [interaction.commandName]
            if(interaction.commandName === "suppr"){
                args.push(interaction.options.getInteger("nombre"));
            }
            if(interaction.commandName === "play"){
                if(interaction.options.getString("url") != null){
                    args.push(interaction.options.getString("url"));
                }
            }
            if(interaction.commandName === "add"){
                args.push(interaction.options.getString("url"));
            }
            var isInteraction = true;
            if(interaction.client.commands.has(interaction.commandName)){
                interaction.client.commands.get(interaction.commandName).execute(message, args, isInteraction);
            }
        }
    
        //Boutons
        if(interaction.isButton()){
            if(interaction.client.buttons.has(interaction.customId)){
                interaction.client.buttons.get(interaction.customId).execute(interaction);
            }
        }
    }
}