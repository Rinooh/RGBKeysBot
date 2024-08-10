require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const SOURCE_CHANNEL_ID = process.env.EVENT_SUBMISSIONS_PUBLIC_CHANNEL;
const TARGET_CHANNEL_ID = process.env.EVENT_SUBMISSIONS_PRIVATE_CHANNEL;
const NON_DELETABLE_MESSAGE_ID = process.env.EVENT_SUBMISSIONS_STICKY_MESSAGE;

module.exports = async (client, message) => {
    if (message.channel.id === SOURCE_CHANNEL_ID && !message.author.bot && message.id !== NON_DELETABLE_MESSAGE_ID) {
        const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('approve')
                    .setLabel('Approve')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('other')
                    .setLabel('Other')
                    .setStyle(ButtonStyle.Danger)
            );

        const files = message.attachments.map(attachment => attachment.url);

        await targetChannel.send({
            content: `**User:** <@${message.author.id}>\n**Message:** ${message.content}`,
            components: [row],
            files: files
        });

        // Delete the message from the source channel
        await message.delete();
    }
};