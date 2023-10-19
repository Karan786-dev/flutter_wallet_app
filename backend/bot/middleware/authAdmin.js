const { admins } = require('../../config').bot

const authAdmin = async (ctx, next) => {
    if (!(admins.includes(ctx.from.id))) return ctx.reply('You are allowed to use this function')
    next()
}

module.exports = authAdmin