/**
 * Reply private message from member
 * @param {String} helpMessage 
 * @returns Message replied to author member
 */
module.exports = (
  helpMessage
) => {
  const { AVOCADO_BOT_TOKEN, AVOCADO_SERVER_ID } = process.env;
  const Discord = require('discord.js');
  const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES']});
  const prefix = "/";

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  // emitted whenever a message is created
  client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
  
    if (message.channel.type === 'GUILD_TEXT') { 
      // for guild message to trigger direct message
      if (command === 'help') {
        const msg = { embeds: [{
          color: 3447003,
          title: "Welcome to Avocado",
          fields: [{
            name: "Please use listed commands to interact with our bot:",
            value: `/dm -> Iniatiate direct message with bot`
          },
          {
            name: "\u200b",
            value: "-"
          }],
          timestamp: new Date(),
          footer: {
            text: "Type /help for more info on a bot command."
          }
        }]};
        message.reply(msg);
      }
      else if (command === 'dm') {
        const msg = { embeds: [{
          color: 3447003,
          title: "Welcome to Avocado",
          fields: [{
            name: "Bot ready",
            value: "\u200b"
          }],
          timestamp: new Date(),
          footer: {
            text: "Type /help for more info on a bot command."
          }
        }]};
        message.author.send(msg);
      }
    } else if (message.channel.type === 'DM') {
      // for direct message
      if (command === 'help') {
        const msg = { embeds: [{
          color: 3447003,
          title: "Welcome to Avocado",
          fields: [{
            name: "Please use listed commands to interact with our bot:",
            value: `/ping -> Pong! \n /one -> first command \n /two -> second command`
          },
          {
            name: "\u200b",
            value: "-"
          }],
          timestamp: new Date(),
          footer: {
            text: "Type /help for more info on a bot command."
          }
        }]};
        message.reply(msg);
      }
      else if (command === 'ping') {
        message.reply('pong');
      }
    }
  });

  // make sure this line is the last line
  client.login( AVOCADO_BOT_TOKEN );
}