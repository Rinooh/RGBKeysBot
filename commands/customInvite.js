const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createinvite')
        .setDescription('Creates a custom invite link')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to create the invite for')
                .setRequired(false))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to create the invite for')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const user = interaction.options.getUser('user');

        if (!channel && !user) {
            return interaction.reply('You must specify either a channel or a user.');
        }

        let inviteChannel;
        if (channel) {
            inviteChannel = channel;
        } else if (user) {
            inviteChannel = interaction.guild.channels.cache
                .filter(ch => ch.permissionsFor(user).has(Permissions.FLAGS.VIEW_CHANNEL))
                .first();
        }

        if (!inviteChannel) {
            return interaction.reply('Could not find a suitable channel for the invite.');
        }

        try {
            const invite = await inviteChannel.createInvite({
                maxAge: 0, // 0 means never expire
                maxUses: 0, // 0 means unlimited uses
                unique: true
            });
            return interaction.reply(`Here is your invite link: ${invite.url}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('There was an error creating the invite link.');
        }
    }
};