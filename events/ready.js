const { SlashCommandBuilder } = require("@discordjs/builders");

const help = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Affiche l'aide du bot, listant les commandes")

const info = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Les informations de Craftor3000's Eyes")

const suppr = new SlashCommandBuilder()
    .setName("suppr")
    .setDescription("Supprime le nombre de message souhaite")
    .addIntegerOption(option => option.setName("nombre").setDescription("Nombre de message à supprimer").setRequired(true))

const join = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Fait rejoindre un salon vocal au bot")

const play = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Joue de la musique dans le salon vocal ou le bot est connecte")
    .addStringOption(option => option.setName("url").setDescription("Lien url de la musique à insérer dans la playlist"))

const pause = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Met en pause la musique")

const unpause = new SlashCommandBuilder()
    .setName("unpause")
    .setDescription("Arrete la pause de la musique")

const stop = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Deconnecte le bot du salon vocal")

const queue = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Donne la playlist")

const add = new SlashCommandBuilder()
    .setName("add")
    .setDescription("Ajoute une musique à la playlist")
    .addStringOption(option => option.setName("url").setDescription("Lien url de la musique à insérer dans la playlist").setRequired(true))

const remove = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Retire la première musique de la playlist")

module.exports = { 
    name: "ready",
    once: true,
    execute (Client) {
        Client.guilds.cache.get("981985626868047942").commands.create(help);
        Client.guilds.cache.get("981985626868047942").commands.create(info);
        Client.guilds.cache.get("981985626868047942").commands.create(suppr);
        Client.guilds.cache.get("981985626868047942").commands.create(join);
        Client.guilds.cache.get("981985626868047942").commands.create(play);
        Client.guilds.cache.get("981985626868047942").commands.create(pause);
        Client.guilds.cache.get("981985626868047942").commands.create(unpause);
        Client.guilds.cache.get("981985626868047942").commands.create(stop);
        Client.guilds.cache.get("981985626868047942").commands.create(queue);
        Client.guilds.cache.get("981985626868047942").commands.create(add);
        Client.guilds.cache.get("981985626868047942").commands.create(remove);
        
        Client.user.setActivity("!help | By @Craftor3000#5844");
        
        console.log("Bot en ligne...");
    }
}  