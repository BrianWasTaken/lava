import { Item, ItemOptions, ItemAssets, ItemConfig, ItemCategories } from 'lava/akairo';
import type { CurrencyEntry, Inventory } from 'lava/mongo';
import { Message, MessageEmbed } from 'discord.js';

export type BoxItemAssets = Omit<ItemAssets, 'emoji' | 'category' | 'sellRate' | 'upgrade'>;

export type BoxItemConfig = Omit<ItemConfig, 'premium' | 'sellable'>;

export type BoxItemCoinContents = [number, number]; // [min, max];

export type BoxItemItemContents = { item: string, amount: [number, number] }; // [min, max];

export interface BoxItemOptions extends Omit<ItemOptions, 'assets' | 'config' | 'upgrades'> {
	/** The basic info about this box. */ 
	assets: BoxItemAssets;
	/** The config for this box. */
	config: BoxItemConfig;
	/** The shit inside this box. */
	contents: BoxItemContents;
}

export interface BoxItemContents {
	/** The coin rewards for this box. */
	coins: BoxItemCoinContents;
	/** The possible items the box have. */
	items: BoxItemItemContents[];
}

export class BoxItem extends Item {
	/** The shit inside this box. */
	public contents: BoxItemContents;

	public constructor(id: string, options: BoxItemOptions) {
		super(id, {
			assets: {
				emoji: ':package:',
				sellRate: 0,
				upgrade: 0,
				category: ItemCategories.BOX,
				...options.assets
			},
			config: {
				premium: true,
				sellable: false,
				...options.config
			},
			upgrades: []
		});

		this.contents = options.contents;
	}

	public getEmbed(embed: MessageEmbed) {
		return embed.addField('Possible Items', `\`${
			this.contents.items.map(i => i.item).join('`, `')
		}\``);
	}

	public async use(ctx: Message, entry: CurrencyEntry, times = 1) {
		const { randomsInArray, randomInArray, randomNumber, sleep } = ctx.client.util;
		const { coins, items } = this.getContents(entry);
		const thisBox = entry.props.items.get(this.id);
		const uses = Math.min(Math.max(1, times), 10);

		if (uses > thisBox.owned) {
			return ctx.reply(`Jokes on you, you only have ${thisBox.owned.toLocaleString()} of these.`);
		}

		const msg = await ctx.reply(`**__${this.emoji} | Opening ${uses} ${this.name}...__**`);
		const cois = Array.from({ length: uses }, () => randomNumber(...coins)).reduce((p, c) => p + c, 0);
		const ites: { item: Inventory, amount: number }[] = [];
		Array.from({ length: uses }, () => randomsInArray(items.map(i => i.item.id), randomNumber(1, Math.max(1, Math.min(3, items.length))))
			.forEach(id => {
				const exists = ites.find(i => i.item.id === id);
				const amount = randomNumber(...items.find(i => i.item.id === id).amount);
				return exists 
					? (ites.find(i => i.item.id === id).amount += amount) 
					: ites.push({ amount, item: entry.props.items.get(id) });
			})
		);

		ites.forEach(iw => entry.addItem(iw.item.id, iw.amount));
		await entry.subItem(this.id, uses).addPocket(cois).save();
		await sleep(1000 * 3);

		return await msg.edit({ 
			content: [
				`**__${this.emoji} | ${ctx.author.username}'s ${this.name}__**\n`,
				`**:coin: ${cois.toLocaleString()}** coins`,
				...ites.map(i => `**${i.item.upgrade.emoji} ${i.amount}** ${i.item.upgrade.name}`)
			].join('\n'),
		});
	}

	public getContents(entry: CurrencyEntry) {
		return {
			coins: this.contents.coins,
			items: this.contents.items.map(c => ({ 
				item: entry.props.items.get(c.item),
				amount: c.amount 
			}))
		};
	}
}