const {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  ButtonStyle,
} = require('discord.js');
const tiers = require('../tiers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Get access to tiers of content'),

  async execute(interaction) {
    const buttons = [];

    for (const tier of tiers) {
      buttons.push(
        new ButtonBuilder()
          .setURL(
            `${tier.paymentLink}?client_reference_id=${interaction.user.id}-${tier.id}`
          )
          .setLabel(tier.name)
          .setStyle(ButtonStyle.Link)
      );
    }

    const row = new ActionRowBuilder().addComponents(...buttons);

    await interaction.reply({
      content: 'Use buttons below to start you subscription',
      ephemeral: true,
      components: [row],
    });
  },
};

// How do I add a role to a guild member?

// const role = interaction.options.getRole('role');
// const member = interaction.options.getMember('target');
// member.roles.add(role);

// How do I check if a guild member has a specific role?

// const member = interaction.options.getMember('target');
// if (member.roles.cache.some(role => role.name === 'role name')) {
// 	// ...
// }
