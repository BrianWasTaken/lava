import { Command, Context, GuildMemberPlus, Currency } from 'lava/index';
import { Argument, ArgumentTypeCaster } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('give', {
			aliases: ['give', 'share'],
			cooldown: 1000 * 10,
			description: 'Share coins to others!',
			name: 'Share',
			args: [
				{
					id: 'member',
					type: 'member',
					default: null,
					unordered: true,
				},
				{
					id: 'amount',
					type: Argument.union('number', (c: Message, a: string) => {
						return ['all', 'max'].some(e => e.includes(a.toLowerCase())) ? a.toLowerCase() : null;
					}),
					default: null,
					unordered: true
				}
			]
		});
	}

	async exec(ctx: Message, { member, amount }: { member: GuildMemberPlus, amount: number }) {
		const entry = await ctx.author.currency.fetch();
		if (!member) {
			return ctx.reply('Bruh who are you giving coins to?').then(() => false);
		}
		if (!amount) {
			return ctx.reply('You need to give something!').then(() => false);
		}

		const entry2 = await member.user.currency.fetch();
		if (ctx.author.id === member.user.id) {
			return ctx.reply('Are you being dumb or just dumb?').then(() => false);
		}
		if (entry2.props.pocket > Currency.MAX_SAFE_POCKET) {
			return ctx.reply(`Their pocket is overloaded with coins, give them time to spend 'em all.`).then(() => false);
		}
		if (!ctx.client.util.isInteger(amount) || amount < 1 || amount !== Math.trunc(amount)) {
			return ctx.reply('It needs to be a whole number greater than 0 yeah?').then(() => false);
		}
		if (amount > entry.props.pocket) {
			return ctx.reply(`You only have ${entry.props.pocket.toLocaleString()} coins dont try and lie to me how`).then(() => false);
		}

		const tax = 0.05;
		const paid = Math.round(amount - amount * tax);
		const taxed = Math.round((amount * (tax * 10)) / (amount / 10));

		const pocket = await entry.removePocket(amount).save().then(p => p.props.pocket);
		const pocket2 = await entry2.addPocket(paid).save(false).then(p => p.props.pocket);

		return ctx.reply(`You gave ${member.user.username
			} **${paid.toLocaleString()
			}** coins after a **${taxed
			}%** tax. They now have **${pocket2.toLocaleString()
			}** coins while you have **${pocket.toLocaleString()
			}** coins left.
		`).then(() => true);
	}
}