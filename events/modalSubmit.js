const vars = require("../variables.js");

module.exports = {
    name: "modalSubmit",
    execute (modal) {
        if(modal.customId === 'ticketCreation'){
            const name = modal.getTextInputValue('ticketType');
            const description = modal.getTextInputValue("ticketDescription");
            let channelName = name + "-" + modal.user.username;
            const date = new Date().toLocaleString();
            modal.guild.channels.create(channelName, { type: "GUILD_TEXT", parent: modal.guild.channels.cache.get("987034784163311717"), permissionOverwrites: [{id: "981985626868047942", deny: ["VIEW_CHANNEL"]},{id: "982712695990145115", allow: ["VIEW_CHANNEL"]},{id: "987781162992820254", allow: ["VIEW_CHANNEL"]},{id: modal.user.id, allow: ["VIEW_CHANNEL"]}], topic: modal.user.username + "│" + date + "│" + name + "│" + description});
            modal.reply({content: "Votre ticket vient d'être créé !", ephemeral: true});
            console.log(modal.user.username + " : TicketCreation : " + name);
        }   
    }
}