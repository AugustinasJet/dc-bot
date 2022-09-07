// Require the necessary discord.js classes
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();
const cron = require('cron');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base('appMym8genVACdBko');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!', new Date().toLocaleString());
	const cronjob = new cron.CronJob(
		'0 0 5,17 * * *',
		async () => {
			const user = client.users.fetch(process.env.DISCORD_RECIEVER_ID);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('primary')
						.setLabel('Išgėriau!')
						.setStyle(ButtonStyle.Primary),
				);
			(await user).send({ content: 'Paspausk kai išgersi vaistus', components: [row] });
		});
	cronjob.start();
});

client.on('interactionCreate', async interaction => {
	if (interaction.isButton() && interaction.customId == 'primary') {
		base('drug').create([
			{
				'fields': {
					'Date': new Date().toLocaleString(),
				},
			},
		], function(err, records) {
			if (err) {
				console.error(err);
				return;
			}
			records.forEach(function(record) {
				console.log(record.getId());
			});
		});
		await interaction.update({ content: 'Ačiū!', components: [] });
	}
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

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
