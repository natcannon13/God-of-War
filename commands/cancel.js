const {SlashCommandBuilder} = require('discord.js');
const schedule_manager = require("../schedule/schedule_manager.js");

const command = new SlashCommandBuilder()
    .setName('cancel')
    .setDescription('Cancels a Root game')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('The ID of the game to cancel')
            .setRequired(true)
    )
    ;

async function execute(interaction){
   const id = interaction.options.getString('id');
   const response = await schedule_manager.cancel(interaction.member, id);
   return interaction.reply(response);
}

module.exports = {
    data: command,
    execute
}