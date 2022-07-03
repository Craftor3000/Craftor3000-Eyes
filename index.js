const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require("ytdl-core");
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu  } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, generateDependencyReport, AudioPlayerStatus } = require('@discordjs/voice');
const { Player, Queue } = require("discord-player");
const discordModals = require('discord-modals');
const { Modal, TextInputComponent, showModal } = discordModals;
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
discordModals(Client);
Client.player = new Player(Client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

Client.login("OTgxOTg0MDczNzQ2NjI4Njc5.Gz2H4i.zkeGzeHolbo2YzPN0zOKuiwzEaFSYUR8XOG7I8");

var connection = null;
var connectionChannelId = null;
var connectionChange = [];
var lastPlayerStream = null;
var flashStream = null;
var flashMusic = null;
const player = createAudioPlayer();
var playerPause = false;
var musicQueue = [];
var audioPlaying = false;
var uploadTicketEmbed = false;
var lastTicketData = [];

//===================================================================================================================

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


Client.on("ready", () => {
    
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
})

//===================================================================================================================
Client.on("interactionCreate", interaction  => {
    if(interaction.isCommand()) {

        //Commande /join
        if(interaction.commandName == "info"){
            const embed = new MessageEmbed()
                .setColor("GOLD")
                .setTitle("Informations de Craftor3000's Eyes")
                .setDescription("**Autheur :** <@927990159495008266>\n**Version :** Bêta 1.0b")
            interaction.reply({allowedMentions: false, embeds: [embed]})
            console.log(interaction.user.username + " : Info")      
        }

        //Commande /suppr
        if(interaction.commandName == "suppr"){
            if(interaction.member.roles.cache.has("991245759867535360")){
                let number = interaction.options.getInteger("nombre");
                if(number > 0 && number < 101){
                    interaction.channel.bulkDelete(number);
                    console.log(interaction.user.username + " : Suppression de " + number + " messages");
                    interaction.reply(number + " messages ont été supprimés");
                } else {
                    interaction.reply("Le nombre de message à supprimer doit se trouver entre 1 et 100");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }
        }

        //Commande /join
        if(interaction.commandName == "join"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                if(interaction.member.voice.channel){
                    if(connection == null){
                        connection = joinVoiceChannel({
                            channelId: interaction.member.voice.channelId,
                            guildId: interaction.guildId,
                            adapterCreator: interaction.guild.voiceAdapterCreator
                        });
                        connectionChannelId = interaction.member.voice.channelId;
                        interaction.reply("Le bot viens de rejoindre votre salon vocal");
                        console.log(interaction.user.username + " : Join : " + connectionChannelId);
                    } else {
                        if(connectionChannelId === interaction.member.voice.channelId){
                            interaction.reply("Le bot est déjà connecté à votre salon vocal");
                        } else {
                            connection = joinVoiceChannel({
                                channelId: interaction.member.voice.channelId,
                                guildId: interaction.guildId,
                                adapterCreator: interaction.guild.voiceAdapterCreator
                            });
                            connectionChannelId = interaction.member.voice.channelId;
                            interaction.reply("Le bot viens de rejoindre votre salon vocal");
                            console.log(interaction.user.username + " : Rejoin : " + connectionChannelId);
                        }
                    }
                } else {
                    interaction.reply("Veuillez vous connecter à un salon vocal");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }
            
        }

        //Commande /play
        if(interaction.commandName == "play"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                if(interaction.member.voice.channel){
                    if(connection != null){
                        if(interaction.options.getString("url") != null){
                            let music = interaction.options.getString("url");
                            if(ytdl.validateURL(music)){
                                const stream = ytdl(music, {filter: 'audioonly'});
                                flashStream = stream;
                                flashMusic = music;
                            } else {
                                interaction.reply("URL invalide");
                            }
                        } else {
                            if(musicQueue.length != 0){
                                const stream = ytdl(musicQueue[0], {filter: 'audioonly'});
                                flashStream = stream;
                                flashMusic = musicQueue[0];
                            } else {
                                interaction.reply("La playlist est vide");
                            }
                        }
                        if(flashStream != null){
                            const resource = createAudioResource(flashStream);
                            if(connectionChannelId != interaction.member.voice.channelId) {
                                connectionChange.push(true);
                                const row = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId("rejoinQuestionYes")
                                            .setLabel("Oui")
                                            .setStyle("SUCCESS")
                                    )
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId("rejoinQuestionNo")
                                            .setLabel("Non")
                                            .setStyle("DANGER")
                                    )
                                interaction.reply({content: "Voulez-vous reconnecter le bot dans le bon salon vocal ?", components: [row]});
                                lastPlayerStream = flashStream;
                                console.log(interaction.user.username + " : Question : Rejoin : " + interaction.member.voice.channelId + " + Play : " + flashMusic);
                            } else {
                                connection.subscribe(player);
                                player.play(resource);
                                audioPlaying = true;
                                playerPause = false;
                                musicQueue.unshift(flashMusic);
                                interaction.reply("Lecture de l'audio dans le salon vocal");
                                console.log(interaction.user.username + " : Play : " + flashMusic);
                            }
                        } else {
                            interaction.reply("Problème dans le stockage de la musique");
                        }
                        flashStream = null;
                        flashMusic = null; 
                    } else {
                        interaction.reply("Veuillez connecter le bot à un salon vocal");
                    }
                } else {
                    interaction.reply("Veuillez vous connecter à un salon vocal");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            } 
        }

        //Commande /pause
        if(interaction.commandName == "pause"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                if(connection != null){
                    if(playerPause == false){
                        player.pause();
                        playerPause = true;
                        interaction.reply("Le bot a été mis en pause");
                        console.log(interaction.user.username + " : Pause : " + connectionChannelId);
                    } else {
                        interaction.reply("Le bot est déjà en pause");
                    }                   
                } else {
                    interaction.reply("Veuillez connecter le bot à un salon vocal");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            } 
        }

        //Commande /unpause
        if(interaction.commandName == "unpause"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                if(connection != null){
                    if(playerPause == true){
                        player.unpause();
                        playerPause = false;
                        interaction.reply("Le bot vient d'arrêter sa pause");
                        console.log(interaction.user.username + " : Unpause : " + connectionChannelId);
                    } else {
                        interaction.reply("Le bot n'est pas en pause");
                    }  
                } else {
                    interaction.reply("Veuillez connecter le bot à un salon vocal");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }
        }

        //Commande /stop
        if(interaction.commandName == "stop"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                if(connection != null){
                    connection.disconnect();
                    connection = null;
                    console.log(interaction.user.username + " : Stop : " + connectionChannelId);
                    connectionChannelId = null;
                    interaction.reply("Le bot vient de se déconnecter de votre salon vocal");
                } else {
                    interaction.reply("Le bot est déjà déconnecté");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }
        }

        //Commande /queue
        if(interaction.commandName == "queue"){
            if(musicQueue.length != 0){
                if(musicQueue.length == 1){
                    interaction.reply(musicQueue.toString());
                } else {
                    let reply = musicQueue.toString().replace(",", "\n");
                    interaction.reply(reply);
                }
                console.log(interaction.user.username + " : Playlist : " + musicQueue.length);
            } else {
                interaction.reply("La playlist est vide");
            }
        }

        //Commande /add
        if(interaction.commandName == "add"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                let newMusic = interaction.options.getString("url");
                if(ytdl.validateURL(newMusic)){
                    musicQueue.push(newMusic);
                    interaction.reply(newMusic + " a été ajouté dans la playlist");
                    console.log(interaction.user.username + " : Add : " + newMusic);
                } else {
                    interaction.reply("URL invalide");
                } 
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }
        }

        //Commande /remove
        if(interaction.commandName == "remove"){
            if(interaction.member.roles.cache.has("991245511887691776")){
                if(musicQueue.length != 0){
                    interaction.reply(musicQueue[0] + " a été retiré de la playlist");
                    console.log(interaction.user.username + " : Remove : " + musicQueue[0]);
                    musicQueue.shift();
                } else {
                    interaction.reply("La playlist est déjà vide");
                }
            } else {
                interaction.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }
        }
    }

    //Boutons
    if(interaction.isButton()){
        //Création du ticket et affichage du modal
        if(interaction.customId === "ticket"){
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
                    client: Client,
                    interaction: interaction,
                });
            } else {
                interaction.reply({content: "Vous n'avez pas la permission de créer un ticket", ephemeral: true});
            }
        }

        //Fermeture du ticket par un succès
        if(interaction.customId === "ticketSuccess"){
            let chan = interaction.guild.channels.cache.get("987785363252715570");
            let args = interaction.channel.topic.split("│");
            let date = args[1].split(",");
            let closeDate = new Date().toLocaleString().split(",");
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Résolution du ticket de " + args[0])
                .setDescription("*Ticket créé le " + date[0] + " à" + date[1] + " et fermé le " + closeDate[0] + " à" + closeDate[1] + "*\n\n**Sujet du ticket :**\n" + args[2] + "\n\n**Description :**\n" + args[3]);
            chan.send({ embeds: [embed]});
            console.log(interaction.user.username + " : ticketSuccess : " + args[0] + " : " + args[2]);
            if(interaction.channel.deletable){
                interaction.channel.delete();
            } 
        }

        //Fermeture du ticket par un échec
        if(interaction.customId === "ticketFail"){
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

        //Ping le staff dans un ticket
        if(interaction.customId === "ticketPing"){
            interaction.channel.send("<@&987781162992820254>").then(message => {if(message.deletable) message.delete();});
            const embed = new MessageEmbed()
                .setColor("0099ff")
                .setDescription("Un membre de notre équipe de support a été prévenu et arrivera dès que possible !")
            interaction.reply({embeds: [embed], ephemeral: true});
            console.log(interaction.user.username + " : ticketPing : " + interaction.channel.name);
        }

        //Attribue le role @Notif bot
        if(interaction.customId === "roleNotifBot"){
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

        //Répond Oui à la reconnection du bot dans le bon channel vocal
        if(interaction.customId === "rejoinQuestionYes"){
            if(connectionChange[0]){
                connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });
                connectionChannelId = interaction.member.voice.channelId;
                const stream = ytdl(lastPlayerStream, {filter: 'audioonly'});
                const resource = createAudioResource(stream);
                connection.subscribe(player);
                player.play(resource);
                audioPlaying = true;
                musicQueue.push(lastPlayerStream);
                interaction.reply("Le bot viens de rejoindre votre salon vocal et commence la lecture de l'audio");
                console.log(interaction.user.username + " : Yes : Rejoin : " + connectionChannelId + " + Play : " + lastPlayerStream);
                connectionChange.shift();
                lastPlayerStream = null;
            } else {
                interaction.reply({content: "Aucune réponse ne vous a été demandée", ephemeral: true});
            }
        }

        //Répond Non à la reconnection du bot dans le bon channel vocal
        if(interaction.customId === "rejoinQuestionNo"){
            if(connectionChange[0]){
                const stream = ytdl(lastPlayerStream, {filter: 'audioonly'});
                const resource = createAudioResource(stream);
                connection.subscribe(player);
                player.play(resource);
                audioPlaying = true;
                interaction.reply("Lecture de l'audio dans le salon vocal");
                console.log(interaction.user.username + " : No : Rejoin + Play");
                connectionChange.shift();
            } else {
                interaction.reply({content: "Aucune réponse ne vous a été demandée", ephemeral: true});
            }
        }
    }
});

//-----------------------------------------------------------------------------------------------------------------------

const prefix = "!";

Client.on("messageCreate", message => {
    //Commandes avec préfix "!"
    if(!message.author.bot){
        var args = message.content.split(" ");
        var command = args[0];
        //Commandes classiques
        if(message.channelId === "982295220517482557"){
            if(args[0] === prefix + "info"){
                const embed = new MessageEmbed()
                    .setColor("GOLD")
                    .setTitle("Informations de Craftor3000's Eyes")
                    .setDescription("**Autheur :** <@927990159495008266>\n**Version :** Bêta 1.0b")
                message.reply({allowedMentions: false, embeds: [embed]})
                console.log(message.author.username + " : Info")
            }                

            //Fait rejoindre un salon vocal au bot
            if(command === prefix + "join"){
                if(message.member.roles.cache.has("991245511887691776")){
                    if(message.member.voice.channel){
                        if(connection == null){
                            connection = joinVoiceChannel({
                                channelId: message.member.voice.channelId,
                                guildId: message.guildId,
                                adapterCreator: message.guild.voiceAdapterCreator
                            });
                            connectionChannelId = message.member.voice.channelId;
                            message.reply("Le bot viens de rejoindre votre salon vocal");
                            console.log(message.author.username + " : Join : " + connectionChannelId);
                        } else {
                            if(connectionChannelId === message.member.voice.channelId){
                                message.reply("Le bot est déjà connecté à votre salon vocal");
                            } else {
                                connection = joinVoiceChannel({
                                    channelId: message.member.voice.channelId,
                                    guildId: message.guildId,
                                    adapterCreator: message.guild.voiceAdapterCreator
                                });
                                connectionChannelId = message.member.voice.channelId;
                                message.reply("Le bot viens de rejoindre votre salon vocal");
                                console.log(message.author.username + " : Rejoin : " + connectionChannelId);
                            }
                        }
                    } else {
                        message.reply("Veuillez vous connecter à un salon vocal");
                    }
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }                
            }

            //Joue de la musique dans le salon vocal où le bot est connecté
            if(command === prefix + "play"){
                if(message.member.roles.cache.has("991245511887691776")){
                    if(message.member.voice.channel){
                        if(connection != null){
                            if(ytdl.validateURL(args[1])){
                                if(args.length > 1){
                                    const stream = ytdl(args[1], {filter: 'audioonly'});
                                    flashStream = stream;
                                } else {
                                    if(musicQueue.length != 0){
                                        const stream = ytdl(musicQueue[0], {filter: 'audioonly'});
                                        flashStream = stream;
                                    } else {
                                        message.reply("La playlist est vide");
                                    }
                                }
                                if(flashStream != null){
                                    const resource = createAudioResource(flashStream);
                                    if(connectionChannelId != message.member.voice.channelId) {
                                        connectionChange.push(true);
                                        const row = new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId("rejoinQuestionYes")
                                                    .setLabel("Oui")
                                                    .setStyle("SUCCESS")
                                            )
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId("rejoinQuestionNo")
                                                    .setLabel("Non")
                                                    .setStyle("DANGER")
                                            )
                                        message.reply({content: "Voulez-vous reconnecter le bot dans le bon salon vocal ?", components: [row]});
                                        lastPlayerStream = args[1];
                                        console.log(message.author.username + " : Question : Rejoin : " + message.member.voice.channelId + " + Play : " + args[1]);
                                    } else {
                                        connection.subscribe(player);
                                        player.play(resource);
                                        audioPlaying = true;
                                        playerPause = false;
                                        musicQueue.unshift(args[1]);
                                        message.reply("Lecture de l'audio dans le salon vocal");
                                        console.log(message.author.username + " : Play : " + args[1]);
                                    }
                                } else {
                                    message.reply("Problème dans le stockage de la musique");
                                }
                            } else {
                                message.reply("URL invalide");
                            }
                        } else {
                            message.reply("Veuillez connecter le bot à un salon vocal");
                        }
                    } else {
                        message.reply("Veuillez vous connecter à un salon vocal");
                    }
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }
            }

            //Met en pause la musique
            if(command === prefix + "pause"){
                if(message.member.roles.cache.has("991245511887691776")){
                    if(connection != null){
                        if(playerPause == false){
                            player.pause();
                            playerPause = true;
                            audioPlaying = false;
                            message.reply("Le bot a été mis en pause");
                            console.log(message.author.username + " : Pause : " + connectionChannelId);
                        } else {
                            message.reply("Le bot est déjà en pause");
                        }                   
                    } else {
                        message.reply("Veuillez connecter le bot à un salon vocal");
                    } 
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }
            }

            //Arrête la pause de la musique
            if(command === prefix + "unpause"){
                if(message.member.roles.cache.has("991245511887691776")){
                    if(connection != null){
                        if(playerPause == true){
                            player.unpause();
                            playerPause = false;
                            audioPlaying = true;
                            message.reply("Le bot vient d'arrêter sa pause");
                            console.log(message.author.username + " : Unpause : " + connectionChannelId);
                        } else {
                            message.reply("Le bot n'est pas en pause");
                        }  
                    } else {
                        message.reply("Veuillez connecter le bot à un salon vocal");
                    }
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }
            }

            //Déconnecte le bot du salon vocal
            if(command === prefix + "stop"){
                if(message.member.roles.cache.has("991245511887691776")){
                    if(connection != null){
                        connection.disconnect();
                        connection = null;
                        console.log(message.author.username + " : Stop : " + connectionChannelId);
                        connectionChannelId = null;
                        audioPlaying = false;
                        message.reply("Le bot vient de se déconnecter de votre salon vocal");
                    } else {
                        message.reply("Le bot est déjà déconnecté");
                    }
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }
            }

            //Affiche la playlist
            if(command === prefix + "queue"){
                if(musicQueue.length != 0){
                    if(musicQueue.length == 1){
                        message.reply(musicQueue.toString());
                    } else {
                        let reply = musicQueue.toString().replace(",", "\n");
                        message.reply(reply);
                    }
                    console.log(message.author.username + " : Playlist : " + musicQueue.length);
                } else {
                    message.reply("La playlist est vide");
                }
            }

            //Ajouter une musique à la playlist
            if(command === prefix + "add"){
                if(message.member.roles.cache.has("991245511887691776")){
                    let newMusic = args[1];
                    if(args.length > 1){
                        if(ytdl.validateURL(newMusic)){
                            musicQueue.push(newMusic);
                            message.reply(newMusic + " a été ajouté dans la playlist");
                            console.log(message.author.username + " : Add : " + newMusic);
                        } else {
                            message.reply("URL invalide");
                        }
                    } else {
                        message.reply("Arguments insuffisants : !add <lien>");
                    } 
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }
            }

            //Retire une musique de la playlist
            if(command === prefix + "remove"){
                if(message.member.roles.cache.has("991245511887691776")){
                    if(musicQueue.length != 0){
                        message.reply(musicQueue[0] + " a été retiré de la playlist");
                        console.log(message.author.username + " : Remove : " + musicQueue[0]);
                        musicQueue.shift();
                    } else {
                        message.reply("La playlist est déjà vide");
                    }
                } else {
                    message.reply("Vous n'avez pas la permission d'exécuter cette commande");
                }   
            }
        }
    }
        //Commandes utilitaires
        if(command === prefix + "suppr"){
            if(message.member.roles.cache.has("991245759867535360")){
                if(args.length > 1){
                    let textNumber = args[1];
                    let number = Number(textNumber);
                    if(number > 0 && number < 101){
                        message.channel.bulkDelete(number + 1);
                        console.log(message.author.username + " : Suppr : " + textNumber + " messages");
                    } else {
                        message.reply("Le nombre de message à supprimer doit se trouver entre 1 et 100");
                    }
                } else {
                    message.reply("Arguments insuffisants : !suppr <nombre>");
                }
            } else {
                message.reply("Vous n'avez pas la permission d'exécuter cette commande");
            }            
        }
        //COMMANDES TEMPORAIRE
        if(command === prefix + "ticket"){
            if(message.author.id === "927990159495008266"){
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ticket')
                            .setLabel('📥 Créer un ticket')
                            .setStyle("SUCCESS")
                    )
                
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Créer un ticket')
                    .setDescription("Appuyez sur le bouton ci-dessous pour créer un ticket. Une fois le ticket créé, veuillez expliquer en détail votre demande ou pourquoi vous contactez le staff. Ainsi, vous devez respecter le règlement général et ne pas ping de façon excessive l'équipe de support. De plus, la création de tickets est limitée à deux tickets par personne.\n\n*L'abus de ce système entraînera l'interdiction de créer de futurs tickets.*");
                
                message.channel.send({  embeds: [embed], components: [row] });
                message.delete();
            }
        }
        if(command === prefix + "roleslist"){
            if(message.author.id === "927990159495008266"){
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("roleNotifBot")
                            .setLabel("Notif bot")
                            .setStyle("PRIMARY")
                    )
                const embed = new MessageEmbed()
                    .setColor("PURPLE")
                    .setTitle("Roles")
                    .setDescription("**Roles Principaux :**\n- <@&982357949026533416> : Administrateurs du serveur\n- <@&982712695990145115> : Managers du serveur\n- <@&989598479967998002> : Modérateurs du serveur\n- <@&982358755821895721> : Role d'honneur attribué aux meilleurs membres du serveur\n- <@&987781162992820254> : Reponsables de la gestion des tickets et des questions\n- <@&982712433137311765> : Bots du serveur\n\n**Roles de niveaux :**\n- <@&982296027887452222> : 5 xp\n- <@&982356350237569085> : 10 xp\n- <@&982296180010680400> : 20 xp\n- <@&982356702265491496> : 30 xp\n- <@&982296232363978834> : 50 xp\n- <@&982356513433739304> : 75 xp\n- <@&982296310751322216> : 100 xp\n- <@&982296372831219744> : 150 xp\n- <@&982356878229114921> : 200 xp\n\n**Roles de Notifications** (Boutons ci-dessous) **:**\n- <@&988887653179064340> : Notifie une nouvelle version de Craftor3000's Eyes\n\n\n*En cas de problèmes, merci de contacter l'équipe de support ou un administrateur*")
                message.channel.send({embeds: [embed], components: [row]});
                message.delete();
            }
        }

        //COMMANDES ADMINS
        if(message.member.id === "927990159495008266" || message.member.id === "817708844335235112"){
            if(message.content === "$botStop"){
                console.log(message.member.user.username + " : EXIT");
                if(connection != null){
                    connection.disconnect();
                    connection = null;
                }
                Client.destroy();
                process.exit();
            }
            if(message.content === "$botRestart"){
                console.log(message.member.user.username + " : RESTART");
                if(connection != null){
                    connection.disconnect();
                    connection = null;
                }
                Client.destroy();
                Client.login("OTgxOTg0MDczNzQ2NjI4Njc5.Gz2H4i.zkeGzeHolbo2YzPN0zOKuiwzEaFSYUR8XOG7I8");
            }
        }
    
    //Analyse et traitement de messages
    if(message.channelId === "982295220517482557"){
        setTimeout(() => {if(message.deletable) message.delete();}, 180000); //Supprimer les messages du channel "commandes" après 3 minutes
    }
});

//Quand quelqu'un arrive dans le serveur, les roles perms sont attribués
Client.on("guildMemberAdd", member => {
    const embed = new MessageEmbed()
        .setTitle("Bienvenue dans la Mine de Craftor3000 !")
        .setDescription("Vous venez de rejoindre la Mine de Craftor3000, un serveur communautaire sympatique.\nAfin de passer un agréable moment au sein de ce serveur, veuillez respecter les règles et être cool avec les autres memebres du serveur.\nA propos de moi, je suis Craftor3000's Eyes, un bot conçu spécialement pour ce serveur afin de le rendre unique et de lui attribuer des fonctionnalitées spécifiques.\nBon minage !")
    member.send({embeds: [embed]});
    member.roles.add("991245603797487657");
    member.roles.add("991245511887691776");
});

//Auto-play dans la playlist quand la musique actuelle est terminé
player.on(AudioPlayerStatus.Idle, () => {
    if(audioPlaying){
        if(musicQueue.length != 0){
            musicQueue.shift();
        }
        if(musicQueue.length != 0){
            if(ytdl.validateURL(musicQueue[0])){
                const stream = ytdl(musicQueue[0], {filter: 'audioonly'});
                const resource = createAudioResource(stream);
                connection.subscribe(player);
                player.play(resource);
                console.log("AutoPlay : " + musicQueue[0]);
            }
        }
    }
});

//Modal (popups) pour une réponse
Client.on('modalSubmit', (modal) => {
    if (modal.customId === 'ticketCreation') {
        const name = modal.getTextInputValue('ticketType');
        const description = modal.getTextInputValue("ticketDescription");
        let channelName = name + "-" + modal.user.username;
        lastTicketData.push(name);
        lastTicketData.push(description);
        lastTicketData.push(modal.user.username);
        const date = new Date().toLocaleString();
        uploadTicketEmbed = true;
        modal.guild.channels.create(channelName, { type: "GUILD_TEXT", parent: modal.guild.channels.cache.get("987034784163311717"), permissionOverwrites: [{id: "981985626868047942", deny: ["VIEW_CHANNEL"]},{id: "982712695990145115", allow: ["VIEW_CHANNEL"]},{id: "987781162992820254", allow: ["VIEW_CHANNEL"]},{id: modal.user.id, allow: ["VIEW_CHANNEL"]}], topic: modal.user.username + "│" + date + "│" + name + "│" + description});
        modal.reply({content: "Votre ticket vient d'être créé !", ephemeral: true});
        console.log(modal.user.username + " : TicketCreation : " + name);
    }   
});

Client.on("channelCreate", (chan) => {
    if(uploadTicketEmbed){
        if(lastTicketData.length > 2){
            if(chan.isText()){
                let name = lastTicketData[0];
                let description = lastTicketData[1];
                let person = lastTicketData[2];
                lastTicketData.shift();
                lastTicketData.shift();
                lastTicketData.shift();
                uploadTicketEmbed = false;
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
                chan.send({ embeds: [ticketStart], components: [row] });
            }
        }
    }
});

//Crash Handlers
Client.on("error", err => {
    console.log("Erreur : général : " + err.name);
    console.log(err.message);
});
Client.on("shardError", err => {
    console.log("Erreur : Websocket and Network : " + err.name);
    console.log(err.message);
})
player.on("error", err => {
    console.log("Erreur : player : " + err.message);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});