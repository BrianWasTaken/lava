import { Command, Context, Item, ItemMessages, Currency, CurrencyEntry, Colors } from 'lava/index';
import { Message } from 'discord.js';

interface BuyArgs { 
	amount: number;
	item: Item;
};

export default class extends Command {
	constructor() {
		super('buy', {
			aliases: ['buy', 'purchase'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 10,
			description: 'Buy something from the shop!',
			name: 'Buy',
			args: [
				{
					id: 'item',
					type: 'item',
					default: null,
				},
				{
					id: 'amount',
					type: 'number',
					default: 1
				}
			]
		});
	}

	check(entry: CurrencyEntry, args: BuyArgs) {
		const { amount, item } = args;
		if (!item) {
			return ItemMessages.NEED_TO_BUY;
		}

		const inv = entry.props.items.get(item.id);
		const cost = inv.upgrade.price;
		const pocket = entry.props.pocket;

		if (!item.buyable) {
			return ItemMessages.NOT_BUYABLE;
		}
		if (inv.owned >= Currency.MAX_INVENTORY) {
			return ItemMessages.INVENTORY_IS_FULL;
		}
		if (amount > Currency.MAX_INVENTORY - inv.owned) {
			return ItemMessages.AMOUNT_CAP;
		}
		if (amount < 1) {
			return ItemMessages.AMOUNT_BELOW_ONE;
		}
		if (amount > 1 && pocket < cost * amount) {
			return ItemMessages.NOT_BUYABLE_BULK;
		}
		if (pocket < cost * amount) {
			return ItemMessages.BROKE_TO_BUY;
		}
	}

	async exec(ctx: Message, args: BuyArgs) {
		const entry = await ctx.author.currency.fetch();
		const check = this.check(entry, args);
		if (check) return ctx.reply(check).then(() => false);

		const { amount, item } = args;
		const { price } = await item.buy(entry, { 
			amount, discount: entry.effects.discount
		});

		return ctx.reply({ embeds: [{
			author: {
				name: 'Successful Purchase',
				iconURL: ctx.author.avatarURL({
					dynamic: true
				})
			},
			color: Colors.GREEN,
			description: ItemMessages.BUY_MSG(item, price * amount, amount),
			footer: {
				text: 'Thanks for your purchase!'
			}
		}]}).then(() => false);
	}
}