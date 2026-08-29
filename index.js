require ('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {Client, GatewayIntentBits, ActivityType, Collection, Events, MessageFlags} = require('discord.js');
const ReminderManager = require('./schedule/ReminderManager');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{
      name: "scheduling",
      type: ActivityType.Custom,
      state: "Scheduling your next Root game"
    }],
    status: 'online'
  });
  ReminderManager.initialize(client).catch((err) => {
    console.error('Failed to initialize reminders:', err);
  });
});

client.commands = new Collection();

const commandFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandFolder).filter((file) => file.endsWith('.js'));
for(const file of commandFiles){
    const filePath = path.join(commandFolder, file);
    const command = require(filePath);
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    }
    else{
        console.log(`[WARNING] The command at ${filePath} is missing a required property.`);
    }
}

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try{
        await command.execute(interaction);
    } catch(error){
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({
                content: 'There was an error executing this command.',
                flags: MessageFlags.Ephemeral,
            });
        } else{
            await interaction.reply({
                content: 'There was an error executing this command.',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
})

client.login(process.env.DISCORD_TOKEN);