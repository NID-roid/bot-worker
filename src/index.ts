import { ChannelType, Client, type Message, Partials } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const regexCache = new Map<string, RegExp>();

export const sasudaiReaction = (message: Message) => {
  message.react('1223834970863177769');
  message.react('🔥');
};

export const handleMessageCreate =
  ({
    client,
    regexCache,
  }: { client: Client; regexCache: Map<string, RegExp> }) =>
  async (message: Message) => {
    if (message.content.match(/代\s*[\s\S]{0,2}\s*表/)) {
      sasudaiReaction(message);
    }

    if (message.reference?.messageId) {
      const repliedMessage = await message.fetchReference();
      if (message.content === '!daihyo') {
        message.delete();
        sasudaiReaction(repliedMessage);
      }
    }

    if (message.content === '!sasudai') {
      message.reply('https://x.com/STECH_FES/status/1773995315420631265');
      sasudaiReaction(message);
    } else if (message.channel.type === ChannelType.DM) {
      if (process.env.AUDIT_LOG_WEBHOOK) {
        await fetch(process.env.AUDIT_LOG_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message.content,
            username: message.author.username,
            avatar_url: message.author.displayAvatarURL(),
            flags: 4100,
          }),
        });
      }

      if (message.author.bot) {
        return;
      }

      message.reply(process.env.DM_MESSAGE_CONTENT ?? '');
    } else if (client.user && message.mentions.users.has(client.user.id)) {
      if (message.author.bot) {
        return;
      }

      message.reply(process.env.MENTION_MESSAGE_CONTENT ?? '');
    }
  };

const client = new Client({
  intents: ['DirectMessages', 'Guilds', 'GuildMessages', 'MessageContent'],
  partials: [Partials.Channel],
});

client.on('messageCreate', handleMessageCreate({ client, regexCache }));

client.login(process.env.DISCORD_BOT_TOKEN);
