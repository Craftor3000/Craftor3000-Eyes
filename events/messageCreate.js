const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const vars = require("../variables.js");

module.exports = {
    name: "messageCreate",
    execute (message) {
        const prefix = "!";
        //Commandes avec préfix "!"
        if(!message.author.bot){
            if(message.content.startsWith(prefix)){
                var args = message.content.split(" ");
                var command = args[0];
                var commandName = command.replace(prefix, "");
                var isInteraction = false;
                if(message.client.commands.has(commandName)){
                    message.client.commands.get(commandName).execute(message, args, isInteraction);
                }
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
                    if(message.deletable) message.delete();
                    console.log(message.member.user.username + " : EXIT");
                    if(vars.get("connection") != null){
                        vars.get("connection").disconnect();
                        vars.set("connection", null);
                    }
                    message.client.destroy();
                    process.exit();
                }
                if(message.content === "$botRestart"){
                    if(message.deletable) message.delete();
                    console.log(message.member.user.username + " : RESTART");
                    if(vars.get("connection") != null){
                        vars.get("connection").disconnect();
                        vars.set("connection", null);
                    }
                    Client.destroy();
                    Client.login("OTgxOTg0MDczNzQ2NjI4Njc5.Gz2H4i.zkeGzeHolbo2YzPN0zOKuiwzEaFSYUR8XOG7I8");
                }
            }
        
        //Analyse et traitement de messages
        if(message.channelId === "982295220517482557"){
            setTimeout(() => {if(message.deletable) message.delete();}, 180000); //Supprimer les messages du channel "commandes" après 3 minutes
        }
    }
}