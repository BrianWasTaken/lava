import { Command, Context, ItemSale, Item, Inventory, Colors } from 'lava/index';
import { Argument } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('shop', {
			aliases: ['shop', 'store'],
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			description: 'Check the shop items!',
			name: 'Shop',
			args: [
				{
					id: 'query',
					default: 1,
					type: Argument.union('number', 'item')
				}
			]
		});
	}

	getIcon(item: Item, inv: Inventory) {
		return item.upgrades[inv.level].premium ? ':key:' : ':coin:';
	}

	displayItem(item: Item, invs: CollectionPlus<Inventory>, saleNav = false) {
		const { intro, info, emoji } = item;
		const { discount, item: saleItem } = item.handler.sale;
		const { name, price, icon } = invs.get(item.id).upgrade;
		const saleInv = invs.get(saleItem.id);

		if (saleNav) {
			const off = `[${price.toLocaleString()}](https://google.com) ( [***${discount}% OFF!***](https://discord.gg/memer) )`;
			return `**${emoji} ${name}** — ${this.getIcon(saleItem, saleInv)} ${off}\n${info}`;
		}

		return `**${emoji} ${name}** — ${icon} [${price.toLocaleString()}](https://google.com)\n${intro}`;
	}

	async exec(ctx: Message, args: { query: number | Item }) {
		const { paginateArray, parseTime } = ctx.client.util;
		const { item: handler } = ctx.client.handlers;
		const entry = await ctx.author.currency.fetch();
		const items = [...handler.modules.values()];

		if (typeof args.query === 'number') {
			const shop = paginateArray(items.sort((a, b) => b.price - a.price).filter(i => i.shop).map(i => this.displayItem(i, entry.props.items)));
			const left = parseTime((handler.sale.nextSale - Date.now()) / 1000);
			if (args.query > shop.length) {
				return ctx.reply(`Page \`${args.query}\` doesn't exist.`).then(() => false);
			}

			return ctx.channel.send({ embeds: [{
				title: 'Lava Shop', color: Colors.ORANGE, footer: {
					text: `Lava Shop — Page ${args.query} of ${shop.length}`
				}, fields: [
					{
						name: `**__LIGHTNING SALE__** (resets in ${left})`,
						value: this.displayItem(handler.sale.item, entry.props.items, true)
					},
					{
						name: 'Shop Items',
						value: shop[args.query - 1].join('\n\n')
					}
				]
			}]}).then(() => false);
		}

		const { query } = args;
		const { sale } = handler;

		if (!query) {
			return ctx.reply('That item doesn\'t exist tho').then(() => false);
		}

		const { price, sellRate, emoji, name, icon, info } = entry.props.items.get(query.id).upgrade;
		const { owned, level } = entry.props.items.get(query.id);

		return ctx.channel.send({ 
			embeds: [query.getEmbed(this.client.util.embed({
				title: `${emoji} ${name}${owned > 0 ? ` (${owned.toLocaleString()} owned)` : ''} — Level ${level === query.upgrades.length - 1 ? `${level} (Max)` : level}`,
				color: ctx.client.util.randomColor(), 
				description: [
					`${info}\n`, [
						`**BUY** — ${query.buyable ? `${icon} ${price.toLocaleString()}` : '**Not Buyable**'}`,
						`**SELL** — ${query.sellable ?	 `${icon} ${Math.round(price * sellRate).toLocaleString()}` : '**Not Sellable**'}`
					].join('\n')
				].join('\n'),
				footer: {
					text: `Item Type: ${query.category.id}`
				}
			}))],
		}).then(() => false);
	}
}