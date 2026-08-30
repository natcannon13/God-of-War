const {SlashCommandBuilder} = require('discord.js');
const schedule_manager = require("../schedule/schedule_manager.js");

const command = new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Looks up a scheduled game')
    .addStringOption(option => 
        option.setName('id')
            .setDescription('The ID of the game to lookup')
            .setRequired(true)
    );

async function execute(interaction){
    const id = interaction.options.getString('id');
   let gameString = await schedule_manager.findGame(id)
   return interaction.reply({
    content: gameString,
    allowedMentions: {roles: []}
    });
}

module.exports = {
    data: command,
    execute
}
