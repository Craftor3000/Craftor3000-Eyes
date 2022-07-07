module.exports = {
    name: "roleNotifBot",
    description: "Attribue le role @Notif bot",
    execute (interaction) {
        if(!interaction.member.roles.cache.has("988887653179064340")){
            interaction.member.roles.add("988887653179064340");
            interaction.reply({content: "Vous avez maintenant le role <@&988887653179064340>", ephemeral: true});
            console.log(interaction.user.username + " : roleNotifBot : add");
        } else {
            interaction.member.roles.remove("988887653179064340");
            interaction.reply({content: "Vous n'avez plus le role <@&988887653179064340>", ephemeral: true});
            console.log(interaction.user.username + " : roleNotifBot : remove");
        }
    }
}