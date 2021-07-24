import { Command, Context, Item, ItemMessages, Currency, CurrencyEntry, Colors } from 'lava/index';

interface SellArgs { 
	amount: number;
	item: Item;
};

export default class extends Command {
	constructor() {
		super('sell', {
			aliases: ['sell'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 10,
			description: 'Sell something to the shop!',
			name: 'Sell',
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

	check(entry: CurrencyEntry, args: SellArgs) {
		const { amount, item } = args;

		if (!item) {
			return ItemMessages.NEED_TO_SELL;
		}
		
		const inv = entry.props.items.get(item.id);
		const { pocket } = entry.props;

		if (!item.sellable) {
			return ItemMessages.NOT_SELLABLE;
		}
		if (amount < 1) {
			return ItemMessages.SELLING_NONE;
		}
		if (amount > inv.owned) {
			return ItemMessages.CANT_FOOL_ME(inv.owned);
		}
	}

	async exec(ctx: Context, args: SellArgs) {
		const entry = await ctx.author.currency.fetch();
		const check = this.check(entry, args);
		if (check) return ctx.reply(check).then(() => false);

		const { amount, item } = args;
		const { price, sellRate } = await item.sell(entry, {
			amount, discount: entry.effects.discount
		});

		return ctx.reply({ embeds: [{
			author: {
				name: 'Successfully Sold',
				iconURL: ctx.author.avatarURL({
					dynamic: true
				})
			},
			color: Colors.GREEN,
			description: ItemMessages.SELL_MSG(item, price * sellRate * amount, amount),
			footer: {
				text: 'Thanks for stopping by!'
			}
		}]}).then(() => false);
	}
}