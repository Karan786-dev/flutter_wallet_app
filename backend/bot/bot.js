const { Telegraf } = require("telegraf");
const { token } = require("../config").bot

const bot = new Telegraf(token)

module.exports = bot