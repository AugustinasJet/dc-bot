// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const cron = require('cron');


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!', new Date().toLocaleString());
	const cronjob = new cron.CronJob(
		'0 0 1,13 * * *',
		async () => {
			const user = client.users.fetch(process.env.DISCORD_RECIEVER_ID);
			(await user).send('Laikas vaistukam');
		});
	cronjob.start();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\n Current time: ${new Date().toLocaleString()}`);
	}
	else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

// client.on('message');
// cronjob

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);


// const scheduledMessage = new cron.CronJob('* * * * * *', () => {
// 	(await user).send('Laikas vaistukam')
// });
// scheduledMessage.start();