const bot = require('./bot')
const authAdmin = require('./middleware/authAdmin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { session } = require('telegraf')
const { db } = require('..')


let canKey = 'Cancel'

bot.use(session());

bot.use((ctx, next) => {
    if (!ctx.session) ctx.session = {}
    next()
})


bot.start(authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML(`
        <b>
        Hello dear admin, ${ctx.from.first_name}\nChoose an option from below buttons
        </b>
        `, {
            reply_markup: {
                keyboard: [
                    [{ text: 'Merchant Account' }, { text: 'User Account' }],
                    [{ text: 'Payout Settings' }, { text: 'Withdraw settings' }],
                    [{ text: 'Add fund settings' }]
                ]
            }
        })
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Add fund settings', authAdmin, async (ctx) => {
    try {
        let adminData = await db.collection('adminData').findOne({ fund_adding_settings: 1 }) || {}
        await ctx.reply('Add Fund Settings', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Minimum Fund' }, { text: 'Maximum Fund' }],
                    [{ text: adminData.disabled ? 'Enable Fund Adding' : 'Disable Fund Adding' }],
                ]
            }
        })
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Enable Fund Adding', authAdmin, async (ctx) => {
    try {
        await db.collection('adminData').updateOne({ fund_adding_settings: 1 }, { $unset: { disabled: 1 } }, { upsert: true })
        await ctx.replyWithHTML('<b>Withdrawls enabled</b>')
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Disable Fund Adding', authAdmin, async (ctx) => {
    try {
        await db.collection('adminData').updateOne({ fund_adding_settings: 1 }, { $set: { disabled: true } }, { upsert: true })
        await ctx.replyWithHTML('<b>Withdrawls disabled</b>')
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Minimum Fund', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Send amount you want to set as minimum add</b>')
        ctx.session.wait_for_answer = true
        ctx.session.target = 'minimum_add_fund'
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Maximum Fund', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Send amount you want to set as maximum add</b>')
        ctx.session.wait_for_answer = true
        ctx.session.target = 'maximum_add_fund'
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Withdraw settings', authAdmin, async (ctx) => {
    try {
        let adminData = await db.collection('adminData').findOne({ withdraw_settings: 1 }) || {}
        await ctx.reply('Withdraw Settings', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Minimum Withdraw' }, { text: 'Maximum Withdraw' }],
                    [{ text: adminData.disabled ? 'Enable Withdrawls' : 'Disable Withdrawls' }],
                ]
            }
        })
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Minimum Withdraw', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Send amount you want to set as minimum withdraw</b>')
        ctx.session.wait_for_answer = true
        ctx.session.target = 'minimum_withdraw'
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Maximum Withdraw', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Send amount you want to set as maximum withdraw</b>')
        ctx.session.wait_for_answer = true
        ctx.session.target = 'maximum_withdraw'
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Enable Withdrawls', authAdmin, async (ctx) => {
    try {
        await db.collection('adminData').updateOne({ withdraw_settings: 1 }, { $unset: { disabled: 1 } }, { upsert: true })
        await ctx.replyWithHTML('<b>Withdrawls enabled</b>')
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Disable Withdrawls', authAdmin, async (ctx) => {
    try {
        await db.collection('adminData').updateOne({ withdraw_settings: 1 }, { $set: { disabled: true } }, { upsert: true })
        await ctx.replyWithHTML('<b>Withdrawls disabled</b>')
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Payout Settings', authAdmin, async (ctx) => {
    try {
        let adminData = await db.collection('adminData').findOne({ payout_settings: 1 }) || {}
        await ctx.reply('Payout Settings', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Minimum Payout' }, { text: 'Maximum Payout' }],
                    [{ text: adminData.disabled ? 'Enable Payouts' : 'Disable Payouts' }],
                ]
            }
        })
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Minimum Payout', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Send amount you want to set as minimum payout</b>')
        ctx.session.wait_for_answer = true
        ctx.session.target = 'minimum_payout'
    } catch (error) {
        console.log(error)
    }
})


bot.hears('Maximum Payout', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Send amount you want to set as maximum payout</b>')
        ctx.session.wait_for_answer = true
        ctx.session.target = 'maximum_payout'
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Enable Payouts', authAdmin, async (ctx) => {
    try {
        await db.collection('adminData').updateOne({ payout_settings: 1 }, { $unset: { disabled: 1 } }, { upsert: true })
        await ctx.replyWithHTML('<b>Payouts enabled</b>')
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Disable Payouts', authAdmin, async (ctx) => {
    try {
        await db.collection('adminData').updateOne({ payout_settings: 1 }, { $set: { disabled: true } }, { upsert: true })
        await ctx.replyWithHTML('<b>Payouts disabled</b>')
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Merchant Account', authAdmin, async (ctx) => {
    try {
        await ctx.replyWithHTML(`Merchants Sections`, {
            reply_markup: {
                keyboard: [
                    [{ text: 'Manage Merchant Account' }]
                ],
                resize_keyboard: true,
            }
        })
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Manage Merchant Account', authAdmin, async (ctx) => {
    try {
        ctx.replyWithHTML('Send email/phone/id/guid of merchant', { reply_markup: { keyboard: [[{ text: canKey }]] } })
        ctx.session.target = 'manage_merchant'
        ctx.session.wait_for_answer = true
    } catch (error) {
        console.log(error)
    }
})

bot.hears('Manage user Account', authAdmin, async ctx => {
    try {
        ctx.replyWithHTML('Send email/phone/id of user', { reply_markup: { keyboard: [[{ text: canKey }]] } })
        ctx.session.wait_for_answer = true
        ctx.session.target = 'manage_user'
    } catch (error) {
        console.log(error)
    }
})

bot.hears('User Account', authAdmin, async ctx => {
    try {
        await ctx.replyWithHTML(`Users Section`, {
            reply_markup: {
                keyboard: [
                    [{ text: 'Manage user Account' }]
                ],
                resize_keyboard: true,
            }
        })
    } catch (error) {
        console.log(error)
    }
})

bot.action(/unban (.*?)$/, authAdmin, async (ctx) => {
    try {
        await ctx.deleteMessage()
        let target = ctx.match[1].split(' ')[1]
        if (target == 'merchant') {
            let merchant_token = ctx.match[1].split(' ')[0]
            await db.collection('merchant_accounts').updateOne({ secret_token: merchant_token }, { $unset: { blocked: 1 } })
            await ctx.replyWithHTML('Merchant Account Unblocked')
        } else if (target == 'user') {
            let phone = ctx.match[1].split(' ')[0]
            await db.collection('user_accounts').updateOne({ phone: phone }, { $unset: { blocked: 1 } })
            await ctx.replyWithHTML('User account unblocked')
        }
    } catch (error) {
        console.log(error)
    }
})


bot.action(/ban (.*?)$/, authAdmin, async (ctx) => {
    try {
        await ctx.deleteMessage()
        let target = ctx.match[1].split(' ')[1]
        if (target == 'merchant') {
            let merchant_token = ctx.match[1].split(' ')[0]
            await db.collection('merchant_accounts').updateOne({ secret_token: merchant_token }, { $set: { blocked: true } })
            await ctx.replyWithHTML('Merchant Account Blocked')
        } else if (target == 'user') {
            let phone = ctx.match[1].split(' ')[0]
            await db.collection('user_accounts').updateOne({ phone: phone }, { $set: { blocked: true } })
            await ctx.replyWithHTML('User Account Blocked')
        }
    } catch (error) {
        console.log(error)
    }
})


bot.action(/change_password (.*?)$/, authAdmin, async (ctx) => {
    try {
        await ctx.deleteMessage()
        let target = ctx.match[1].split(' ')[1]
        ctx.session.target_2 = target
        ctx.session.wait_for_answer = true
        ctx.session.target = 'new_password'
        ctx.session.info = ctx.match[1].split(' ')[0]
        await ctx.replyWithHTML('<b>Please send new password.....</b>')

    } catch (error) {
        console.log(error)
    }
})

bot.on('message', async (ctx, next) => {
    try {
        if (ctx.message.text == canKey) {
            delete ctx.session.wait_for_answer
            await ctx.replyWithHTML(`
                <b>
                Hello dear admin, ${ctx.from.first_name}\nChoose an option from below buttons
                </b>
                `, {
                reply_markup: {
                    keyboard: [
                        [{ text: 'Merchant Account' }, { text: 'User Account' }],
                        [{ text: 'Payout Settings' }, { text: 'Withdraw settings' }],
                        [{ text: 'Add fund settings' }]
                    ]
                }
            })
        }
        if (!ctx.session.wait_for_answer) return next()
        let answer = ctx.message.text
        switch (ctx.session.target) {
            case "maximum_add_fund":
                if (isNaN(answer)) return await ctx.replyWithHTML('<b>Must send a valid amount.</b>')
                await db.collection('adminData').updateOne({ fund_adding_settings: 1 }, { $set: { maximum: parseFloat(answer) } }, { upsert: true })
                await ctx.replyWithHTML(`<b>Maximum fund adding is updated to: ${answer}</b>`)
                delete ctx.session.wait_for_answer
                break;
            case "minimum_add_fund":
                if (isNaN(answer)) return await ctx.replyWithHTML('<b>Must send a valid amount.</b>')
                await db.collection('adminData').updateOne({ fund_adding_settings: 1 }, { $set: { minimum: parseFloat(answer) } }, { upsert: true })
                await ctx.replyWithHTML(`<b>Minimum fund adding is updated to: ${answer}</b>`)
                delete ctx.session.wait_for_answer
                break;
            case "minimum_withdraw":
                if (isNaN(answer)) return await ctx.replyWithHTML('<b>Must send a valid amount.</b>')
                await db.collection('adminData').updateOne({ withdraw_settings: 1 }, { $set: { minimum: parseFloat(answer) } }, { upsert: true })
                await ctx.replyWithHTML(`<b>Minimum Withdraw is updated to: ${answer}</b>`)
                delete ctx.session.wait_for_answer
                break;

            case "maximum_withdraw":
                if (isNaN(answer)) return await ctx.replyWithHTML('<b>Must send a valid amount.</b>')
                await db.collection('adminData').updateOne({ withdraw_settings: 1 }, { $set: { maximum: parseFloat(answer) } }, { upsert: true })
                await ctx.replyWithHTML(`<b>Maximum Withdraw is updated to: ${answer}</b>`)
                delete ctx.session.wait_for_answer
                break;

            case "minimum_payout":
                if (isNaN(answer)) return await ctx.replyWithHTML('<b>Must send a valid amount.</b>')
                await db.collection('adminData').updateOne({ payout_settings: 1 }, { $set: { minimum: parseFloat(answer) } }, { upsert: true })
                await ctx.replyWithHTML(`<b>Minimum Payout is updated to: ${answer}</b>`)
                delete ctx.session.wait_for_answer
                break;

            case "maximum_payout":
                if (isNaN(answer)) return await ctx.replyWithHTML('<b>Must send a valid amount.</b>')
                await db.collection('adminData').updateOne({ payout_settings: 1 }, { $set: { maximum: parseFloat(answer) } }, { upsert: true })
                await ctx.replyWithHTML(`<b>Maximum Payout is updated to: ${answer}</b>`)
                delete ctx.session.wait_for_answer
                break;

            case 'new_password':
                console.log(ctx.session)
                let salt = await bcrypt.genSalt(10)
                let password_hash = await bcrypt.hash(answer, salt)
                if (ctx.session.target_2 == 'merchant') {
                    await db.collection('merchant_accounts').updateOne({ secret_token: ctx.session.info }, { $set: { password: password_hash } })
                } else if (ctx.session.target_2 == 'user') {
                    console.log(await db.collection('user_accounts').updateOne({ phone: ctx.session.info }, { $set: { password: password_hash } }))
                }
                await ctx.replyWithHTML(`<b>Password changed to:</b><code>${answer}</code>`)
                delete ctx.session.wait_for_answer
                break;

            case 'manage_merchant':
                const info = answer
                const MData = await db.collection('merchant_accounts').findOne({
                    $or: [
                        { _id: info == 'string' ? new ObjectId(info) : info },
                        { email: info },
                        { phone: info },
                        { secret_token: info },
                    ]
                })
                if (!MData) return ctx.replyWithHTML(`Merhant account not found,try again`)
                await ctx.replyWithHTML(
                    `Merchant Account Found\n\nName: ${MData.name}\nPhone: ${MData.phone}\nEmail: ${MData.email}\n\nAvailable Funds: ${MData.balance} Rs\nTotal Payout: ${MData.total_payout} Rs\n\nSecret Token/Guid Key: ${MData.secret_token}`,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [(MData.blocked ? { text: "Unban", callback_data: `/unban ${MData.secret_token} merchant` } : { text: `Ban`, callback_data: `/ban ${MData.secret_token} merchant` }), { text: 'Change Password', callback_data: `/change_password ${MData.secret_token} merchant` }]
                            ]
                        }
                    }
                )
                delete ctx.session.wait_for_answer
                break;
            case 'manage_user':
                var UData = await db.collection('user_accounts').findOne({
                    $or: [
                        { _id: answer == 'string' ? new ObjectId(answer) : answer },
                        { email: answer },
                        { phone: answer },
                    ]
                })
                console.log(UData)
                if (!UData) return await ctx.replyWithHTML('<b>User account not found , try again</b>')
                await ctx.replyWithHTML(`<b>User Account Found\n\nName: ${UData.name}\nPhone: ${UData.phone}\nEmail: ${UData.email}\nBalance: ${UData.balance}\nTotal Withdraw: ${UData.total_withdraw || 0}</b>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [(UData.blocked ? { text: "Unban", callback_data: `/unban ${UData.phone} user` } : { text: `Ban`, callback_data: `/ban ${UData.phone} user` }), { text: 'Change Password', callback_data: `/change_password ${UData.phone} user` }]
                        ]
                    }
                })
                delete ctx.session.wait_for_answer
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error)
    }
})


bot.launch().catch((err) => {
    console.log(`Bot stopped working , because of:`, err)
})