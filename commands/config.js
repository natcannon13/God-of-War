const {SlashCommandBuilder} = require('discord.js');
const config_util = require('../utils/config_util.js');

const command = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configures the bot for the server')
    .addChannelOption(option =>
        option.setName('outputchannel')
            .setDescription('The channel to output scheduled games to')
            .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName('modrole')
        .setDescription('The role of match moderators')
        .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName('videochannel')
            .setDescription('The channel to post game videos to')
            .setRequired(true)
    )
    ;

async function execute(interaction){
   const outputChannel = interaction.options.getChannel('outputchannel');
   const modRole = interaction.options.getRole('modrole');
   const videoChannel = interaction.options.getChannel('videochannel');
   let configString = await config_util.saveConfig(interaction.guildId, outputChannel.id, modRole.id, videoChannel.id);
   return interaction.reply("Config saved" + configString);
}

module.exports = {
    data: command,
    execute
}