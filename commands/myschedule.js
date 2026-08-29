const {SlashCommandBuilder} = require('discord.js');
const schedule_manager = require("../schedule/schedule_manager.js");

const command = new SlashCommandBuilder()
    .setName('myschedule')
    .setDescription('Displays your schedule of games')

async function execute(interaction){
   let scheduleString = await schedule_manager.getSchedule(interaction.guildId, interaction.member.id)
   if(!scheduleString){
    return interaction.reply(`No games found for **${interaction.member.displayName}**!`);
   }
   return interaction.reply({
    content: `Upcoming games for for **${interaction.member.displayName}**` + scheduleString,
    allowedMentions: {roles: []}
    });
}

module.exports = {
    data: command,
    execute
}
