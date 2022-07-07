const vars = require("../variables.js");
const { MessageEmbed } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
    name: "interactionCreate",
    execute (interaction) {
        if(interaction.isCommand()) {
            var message = interaction;
            var args = [interaction.commandName]
            if(interaction.commandName === "suppr"){
                args.push(interaction.options.getInteger("nombre"));
            }
            var isInteraction = true;
            if(!interaction.client.commands.has(interaction.commandName)) return;
            interaction.client.commands.get(interaction.commandName).execute(message, args, isInteraction);
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
                        client: interaction.client,
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
                if(vars.get("connectionChange")[0]){
                    vars.set("connection", joinVoiceChannel({
                        channelId: interaction.member.voice.channelId,
                        guildId: interaction.guildId,
                        adapterCreator: interaction.guild.voiceAdapterCreator
                    }));
                    vars.set("connectionChannelId", interaction.member.voice.channelId);
                    const stream = ytdl(vars.get("lastPlayerStream"), {filter: 'audioonly'});
                    const resource = createAudioResource(stream);
                    vars.get("connection").subscribe(vars.get("player"));
                    vars.get("player").play(resource);
                    vars.set("audioPlaying", true);
                    vars.get("musicQueue").push(vars.get("lastPlayerStream"));
                    interaction.reply("Le bot viens de rejoindre votre salon vocal et commence la lecture de l'audio");
                    console.log(interaction.user.username + " : Yes : Rejoin : " + vars.get("connectionChannelId") + " + Play : " + vars.get("lastPlayerStream"));
                    vars.get("connectionChange").shift();
                    vars.set("lastPlayerStream", null);
                } else {
                    interaction.reply({content: "Aucune réponse ne vous a été demandée", ephemeral: true});
                }
            }
    
            //Répond Non à la reconnection du bot dans le bon channel vocal
            if(interaction.customId === "rejoinQuestionNo"){
                if(vars.get("connectionChange")[0]){
                    const stream = ytdl(vars.get("lastPlayerStream"), {filter: 'audioonly'});
                    const resource = createAudioResource(stream);
                    vars.get("connection").subscribe(vars.get("player"));
                    vars.get("player").play(resource);
                    vars.set("audioPlaying", true);
                    interaction.reply("Lecture de l'audio dans le salon vocal");
                    console.log(interaction.user.username + " : No : Rejoin + Play");
                    vars.get("connectionChange").shift();
                } else {
                    interaction.reply({content: "Aucune réponse ne vous a été demandée", ephemeral: true});
                }
            }
        }
    }
}