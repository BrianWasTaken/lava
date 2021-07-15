import { Context, CurrencyEntry } from 'lava/index';
import { PowerUpItem } from '../..';

export default class Tool extends PowerUpItem {
	constructor() {
		super('card', {
			assets: {
				name: 'Porsche\'s Card',
				emoji: ':credit_card:',
				price: 50000,
				intro: 'Do you need coin space?',
				info: 'Gives you 5000-500000 coins of expanded storage!'
			},
			config: {
				push: true
			},
			upgrades: [
				{
					price: 78000,
					info: 'Give yourself up to 700K bank storage!',
				},
				{
					price: 81000,
					info: 'Expand up to 1M bank storage!'
				},
				{
					price: 90000,
					info: 'Expand up to 2M bank storage NICE!'
				},
				{
					price: 105000,
					info: 'Expand up to 3M bank storage NICE!'
				},
				{
					price: 125000,
					info: 'Expand up to 5M bank storage NICE!'
				},
				{
					price: 150000,
					info: 'Expand up to 10M bank storage NICE!'
				},
				{
					price: 250000,
					info: 'Expand up to 15M bank storage NICE!'
				},
				{
					price: 750000,
					info: 'Expand up to 20M bank storage NICE!'
				},
				{
					price: 1000000,
					info: 'Expand up to 30M bank storage NICE!'
				},
				{
					price: 2500000,
					info: 'Expand up to 50M bank storage NICE!'
				},

			]
		});
	}

	get thresholds() {
		return [5e5, 7e5, 1e6, 2e6, 3e6, 5e6, 1e7, 15e6, 20e6, 30e6, 50e6];
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { randomNumber, isInteger } = ctx.client.util;
		const { owned, level } = entry.props.items.get(this.id);

		await ctx.reply(`You have **${owned.toLocaleString()} cards** to swipe right now, how many of it do you wanna swipe?`);
		const choice = await ctx.awaitMessage(ctx.author.id, 15000);
		if (!choice) {
			return ctx.reply(`You need to reply and not waste my time okay?`);
		}
		if (!isInteger(choice.content) || Number(choice.content) > owned) {
			return ctx.reply(`It needs to be a real number and no more than what you own alright?`);
		}

		const gained = Array(Number(choice.content)).fill(null).map(() => randomNumber(5000, this.thresholds[level])).reduce((p, c) => p + c, 0);
		const space = await entry.subItem(this.id, Number(choice.content)).expandVault(gained).save(false).then(e => e.props.space);
		return ctx.reply(`**You swiped __${
			Number(choice.content).toLocaleString()
		}__ cards into your bank.**\nThis brings you to **${
			space.toLocaleString()
		}** of total bank capacity, with **${
			gained.toLocaleString()
		} (${
			Math.round(gained / Number(choice.content)).toLocaleString()
		} average)** being increased.`);
	}
}