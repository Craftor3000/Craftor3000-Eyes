const vars = require("../variables.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    execute (member) {
        const embed = new MessageEmbed()
            .setTitle("Bienvenue dans la Mine de Craftor3000 !")
            .setDescription("Vous venez de rejoindre la Mine de Craftor3000, un serveur communautaire sympatique.\nAfin de passer un agréable moment au sein de ce serveur, veuillez respecter les règles et être cool avec les autres memebres du serveur.\nA propos de moi, je suis Craftor3000's Eyes, un bot conçu spécialement pour ce serveur afin de le rendre unique et de lui attribuer des fonctionnalitées spécifiques.\nBon minage !")
        member.send({embeds: [embed]});
        member.roles.add("991245603797487657");
        member.roles.add("991245511887691776");
    }
}