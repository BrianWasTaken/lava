import { Command, Context, Item, Currency, GuildMemberPlus, CurrencyEntry } from 'lava/index';
import { Message } from 'discord.js';
const { MAX_INVENTORY } = Currency;

interface GiftArgs {
	amount: number;
	item: Item;
	member: GuildMemberPlus;
	dev: boolean;
}

export default class extends Command {
	constructor() {
		super('gift', {
			aliases: ['gift', 'yeet'],
			description: 'Gift items to users!',
			cooldown: 10000,
			name: 'Gift',
			args: [
				{
					id: 'amount',
					type: 'number'
				},
				{
					id: 'item',
					type: 'item',
				},
				{
					id: 'member',
					type: 'member',
					match: 'rest',
				},
				{
					id: 'dev',
					match: 'flag',
					flag: ['--dev', '-d'],
					default: null
				}
			]
		});
	}

	async exec(ctx: Message, { amount, item, member, dev }: GiftArgs) {
		if (!amount || !item || !member) {
			return ctx.reply(`**Wrong Usage:**\n\`${ctx.util.parsed.prefix} ${this.aliases[0]} <amount> <item> <user>\``).then(() => false);
		}
		if (member.user.id === ctx.author.id) {
			return ctx.reply(`Lol imagine gifting urself items dummy`).then(() => false);
		}
		if (amount < 1 || !ctx.client.util.isInteger(amount) || amount !== Math.trunc(amount)) {
			return ctx.reply(`It needs to be a whole number greater than 0 yeah?`).then(() => false);
		}
		if (!item.giftable) {
			return ctx.reply(`You can't gift this item :thinking:`).then(() => false);
		}

		const isOwner = ctx.client.isOwner(ctx.author.id);
		const entry = await ctx.author.currency.fetch();
		const entry2 = await member.user.currency.fetch();
		const inv = entry.props.items.get(item.id);
		const inv2 = entry2.props.items.get(item.id);

		if (amount > inv.owned) {
			if ((!isOwner && dev) || (!dev && isOwner)) {
				return ctx.reply(`You only have ${inv.owned.toLocaleString()} of this don't try and lie to me.`).then(() => false);
			}
		}
		if (MAX_INVENTORY <= inv2.owned) {
			return ctx.reply(`Hey! They already have over ${MAX_INVENTORY.toLocaleString()} of this item. That's the cap.`).then(() => false);
		}

		const returnNew = (e: CurrencyEntry) => e.props.items.get(item.id).owned;
		const count = await entry.subItem(item.id, dev && isOwner ? 0 : amount).save().then(returnNew);
		const count2 = await entry2.addItem(item.id, amount).save().then(returnNew);

		const es = (id: string) => amount > 1 ? `${id}s` : id;
		return ctx.reply(`You gave ${member.nickname ?? member.user.username} **${amount.toLocaleString()}** ${es(item.id)}! They now have **${count2.toLocaleString()}** ${es(item.id)} while you have **${count.toLocaleString()}** ${es(item.id)} left.`).then(() => true);
	}
}