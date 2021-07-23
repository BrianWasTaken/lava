import { Context, CurrencyEntry } from 'lava/index';
import { PowerUpItem } from '../..';

export default class Tool extends PowerUpItem {
	constructor() {
		super('card', {
			assets: {
				name: 'Porsche\'s Card',
				emoji: ':credit_card:',
				price: 15000,
				intro: 'Do you need coin space?',
				info: 'Gives you 1000-5000 coins of expanded storage!'
			},
			config: {
				push: true,
				buyable: false // this is ur punishment
			},
			upgrades: [
				{
					price: 12500,
					info: 'Give yourself up to 7K bank storage!',
				},
				{
					price: 10000,
					info: 'Expand up to 10K bank storage!'
				},
				{
					price: 7000,
					info: 'Expand up to 20K bank storage NICE!'
				},
				{
					price: 4000,
					info: 'Expand up to 30K bank storage NICE!'
				},
				{
					price: 1000,
					info: 'Expand up to 50K bank storage NICE!'
				},
				{
					price: 750,
					info: 'Expand up to 100K bank storage NICE!'
				},
				{
					price: 500,
					info: 'Expand up to 150K bank storage NICE!'
				},
				{
					price: 250,
					info: 'Expand up to 200K bank storage NICE!'
				},
				{
					price: 100,
					info: 'Expand up to 300K bank storage NICE!'
				},
				{
					price: 10,
					info: 'Expand up to 500K bank storage NICE!'
				},

			]
		});
	}

	get thresholds() {
		return [5e3, 7e3, 10e3, 20e3, 30e3, 50e3, 100e3, 150e3, 200e3, 300e3, 500e3];
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

		const gained = Array.from({ length: Number(choice.content) }, () => randomNumber(1000, this.thresholds[level])).reduce((p, c) => p + c, 0);
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