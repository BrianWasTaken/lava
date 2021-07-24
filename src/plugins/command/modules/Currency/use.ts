import { Command, Context, Item } from 'lava/index';

export default class extends Command {
	constructor() {
		super('use', {
			aliases: ['use', 'abuse', 'consume'],
			cooldown: 1000 * 5,
			description: 'Use an item!',
			args: [
				{
					id: 'item',
					type: 'item'
				}
			]
		});
	}

	async exec(ctx: Context, { item }: { item: Item }) {
		const entry = await ctx.author.currency.fetch();
		if (!item) {
			return ctx.reply(`You need to use something!`).then(() => false);
		}

		const inv = entry.props.items.get(item.id);
		if (!entry.hasInventoryItem(inv.id)) {
			return ctx.reply("You don't own this item!").then(() => false);
		}
		if (inv.isActive()) {
			return ctx.reply('This item is active right now.').then(() => false);
		}
		if (!item.usable) {
			return ctx.reply("You can't use this item :thinking:").then(() => false);
		}

		const used = await item.use(ctx, entry);
		if (!used) {
			return ctx.reply(`HMMMMM You can use it but you didn't actually used it, wait for the real show okie?`).then(() => false);
		}

		return true;
	}
}