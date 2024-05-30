import { ChannelType, Client, Partials } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: ['DirectMessages'],
  partials: [Partials.Channel],
});

client.on('messageCreate', async (message) => {
  if (message.channel.type === ChannelType.DM) {
    // biome-ignore lint:noNonNullAssertion - We know this is defined
    await fetch(process.env.AUDIT_LOG_WEBHOOK!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message.content,
        username: message.author.tag,
        avatar_url: message.author.displayAvatarURL(),
        flags: 4100,
      }),
    });

    if (message.author.bot) {
      return;
    }

    message.reply(process.env.DM_MESSAGE_CONTENT ?? '');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
