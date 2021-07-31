import { Command, CurrencyEntry } from 'lava/index';
import { Argument, ArgumentTypeCaster } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('deposit', {
			aliases: ['deposit', 'dep', 'put'],
			description: 'Deposit your coins into your bank!',
			name: 'Deposit',
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
		if (typeof arg === 'number') return { dep: arg as number, all: false };
		if (['all', 'max'].some(a => arg === a)) return { dep: entry.props.pocket, all: true };
	}

	async exec(ctx: Message, { amount }: { amount: number | string }) {
		const entry = await ctx.author.currency.fetch();
		if (amount === 'invalid') {
			return ctx.reply('U need to deposit something lol')
				.then(() => false);
		}

		const { pocket, vault, space } = entry.props;
		const { dep, all } = this.parseArgs(amount, entry);
		if (pocket < 1) {
			return ctx.reply('U have nothing to deposit lol').then(() => false);
		}
		if (dep < 1) {
			return ctx.reply('Needs to be a whole number greater than 0').then(() => false);
		}
		if (dep > pocket) {
			return ctx.reply(`U only have **${pocket.toLocaleString()}** coins lol don't lie to me hoe`).then(() => false);
		}
		if (vault.amount >= space && all) {
			return ctx.reply('U already have full bank!').then(() => false);
		}
		if ((dep > space - vault.amount) && !all) {
			return ctx.reply(`You can only hold **${space.toLocaleString()}** coins right now. To hold more, use the bot more.`).then(() => false);
		}

		const deposit = dep >= space - vault.amount ? space - vault.amount : dep;
		const { props } = await entry.deposit(deposit, true).save(false);
		return ctx.reply(`**${deposit.toLocaleString()}** coins deposited. You now have **${props.vault.amount.toLocaleString()}** coins in your vault.`).then(() => false);
	}
}