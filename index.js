const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const tiers = require('./tiers');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const app = require('express')();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.login(process.env.TOKEN);

app.get('/done', async (req, res) => {
  const { session } = req.query;

  const { client_reference_id } = await stripe.checkout.sessions.retrieve(
    session
  );
  // console.dir(client_reference_id, { depth: Infinity, colors: true });
  const [userId, tierId] = client_reference_id.split('-');

  const tier = tiers.find((v) => v.id === +tierId);

  // add role

  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  // console.log(guild);
  const role = await guild.roles.fetch(tier.role);
  const member = await guild.members.fetch(userId);

  // const member = interaction.options.getMember('target');
  const result = await member.roles.add(role);

  console.log(result);

  res.write(`You succeed. Close this tab`);
  res.end();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
