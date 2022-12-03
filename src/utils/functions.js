/**
 * @param {*} username 
 * @returns type: "email" : "discord"
 */
function getUsernameType(username) {
  let discordRegex = /^((.+?)#\d{4})/;
  let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let type = null
  if (discordRegex.test(username.toLowerCase()))
    return 'discord'
  if (emailRegex.test(username.toLowerCase()))
    return 'email'

  return type
}

module.exports = {
  getUsernameType
}