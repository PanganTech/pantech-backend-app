/**
 * Send private message to member listed in avocado discord server by discord user id
 * @param {Array} userList 
 * @param {String} message 
 * @returns Message sent to member listed
 */
module.exports = (userList, message) => {
  const { AVOCADO_BOT_TOKEN, AVOCADO_SERVER_ID } = process.env;
  const Discord = require('discord.js');
  const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES','DIRECT_MESSAGES']});

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // fetch avocado's server (guild) by server id
    client.guilds.fetch( AVOCADO_SERVER_ID ).then( guild => {
      // fetch avocado's member by providing listed discord user id
      guild.members.fetch({ user: userList }).then( members => {
        // for each member then send message
        members.forEach( member => {
          member.send( message ).catch( console.error )
        })
      })
    });
  });
  // make sure this line is the last line
  client.login( AVOCADO_BOT_TOKEN );
}