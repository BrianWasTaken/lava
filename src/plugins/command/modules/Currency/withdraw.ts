import { Command, Context, CurrencyEntry } from 'lava/index';
import { Argument, ArgumentTypeCaster } from 'discord-akairo';
import { Message } from 'discord.js'; 

export default class extends Command {
	constructor() {
		super('withdraw', {
			aliases: ['withdraw', 'with', 'take'],
			description: 'Withdraw your coins from your bank!',
			name: 'Withdraw',
			args: [
				{
					id: 'amount',
					type: Argument.union('number', (c: Message, p: string) => {
						return ['all', 'max'].some(dep => dep === p.toLowerCase()) ? p.toLowerCase() : 'invalid';
					})
				}
			]
		});
	}

	parseArgs(arg: number | string, entry: CurrencyEntry) {
		if (typeof arg === 'number') return arg as number;
		if (['all', 'max'].some(a => arg === a)) return entry.props.vault.amount;
	}

	async exec(ctx: Message, { amount }: { amount: number | string }) {
		const entry = await ctx.author.currency.fetch();
		if (amount === 'invalid') {
			return ctx.reply('U need to withdraw something lol').then(() => false);
		}

		const { pocket, vault, space } = entry.props;
		const withd = this.parseArgs(amount, entry);
		if (vault.locked) {
			return ctx.reply("You're being heisted so you can't withdraw lol").then(() => false);
		}
		if (vault.amount < 1) {
			return ctx.reply('You have nothing to withdraw?').then(() => false);
		}
		if (withd < 1) {
			return ctx.reply('Needs to be a whole number greater than 0').then(() => false);
		}
		if (withd > vault.amount) {
			return ctx.reply(`U only have **${vault.amount.toLocaleString()}** coins in your vault tf u on?`).then(() => false);
		}

		const { props } = await entry.withdraw(withd, true).save();
		return ctx.reply(`**${withd.toLocaleString()}** coins withdrawn. You now have **${props.vault.amount.toLocaleString()}** coins in your vault.`).then(() => false);
	}
}