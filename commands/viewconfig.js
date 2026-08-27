const {SlashCommandBuilder} = require('discord.js');
const config_util = require('../utils/config_util.js');

const command = new SlashCommandBuilder()
    .setName('viewconfig')
    .setDescription('Displays the bot configuration for the server')

async function execute(interaction){
    if(!interaction.member.permissions.has("Administrator")){
        return interaction.reply("You must be an administrator to use this command!");
    }
   let configString = await config_util.displayConfig(interaction.guildId);
   if(!configString){
    return `No config found for **${interaction.guild.name}**!`;
   }
   return interaction.reply({
    content: `Config for **${interaction.guild.name}**` + configString,
    allowedMentions: {roles: []}
    });
}

module.exports = {
    data: command,
    execute
}