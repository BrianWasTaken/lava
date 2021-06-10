import { Argument, CommandOptions } from 'discord-akairo';
import { Currency, GambleMessages } from 'lava/utility';
import { CurrencyEntry } from 'lava/mongo';
import { Command } from 'lava/akairo';
import { Context } from 'lava/discord';

export class GambleCommand extends Command {
	constructor(id: string, options: CommandOptions) {
		super(id, { 
			cooldown: 5000,
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			args: [{ id: 'amount', type: Argument.union('number', 'string') }],
			...options
		});
	}

	parseArgs(ctx: Context, args: { amount: string | number }, entry: CurrencyEntry): string | number {
		const { MIN_BET, MAX_BET, MAX_POCKET } = Currency;
		const { isInteger } = ctx.client.util;
		const { pocket } = entry.props;
		const { amount } = args;

		if (!amount) return null;
		if (!isInteger(Number(amount))) {
			switch((amount as string).toLowerCase()) {
				case 'all':
					return pocket;
				case 'max':
					return Math.min(MAX_BET, pocket);
				case 'half':
					return Math.trunc(Math.min(MAX_BET, pocket) / 2);
				case 'min':
					return MIN_BET;
				default:
					if ((amount as string).match(/k/g)) {
						const kay = (amount as string).replace(/k$/g, '');
						return isInteger(kay) ? Number(kay) * 1e3 : null;
					}
					return null;
			}
		}

		return parseFloat(amount as string) || args.amount;
	}

	checkArgs(bet: string | number, entry: CurrencyEntry) {
		switch(true) {
			case !Number.isInteger(Number(bet)):
				return GambleMessages.IS_NAN;
			case entry.props.pocket <= 0:
				return GambleMessages.NO_COINS;
			case entry.props.pocket > Currency.MAX_POCKET:
				return GambleMessages.TOO_RICH;
			case bet > entry.props.pocket:
				return GambleMessages.BET_HIGHER_POCKET;
			case bet < Currency.MIN_BET:
				return GambleMessages.BET_IS_LOWER;
			case bet > Currency.MAX_BET:
				return GambleMessages.BET_IS_HIGHER;
			default:
				return null;
		}
	}

	calcWinnings(multi: number, bet: number) {
		const winnings = Math.ceil(bet * (Math.random() + 0.6));
		return Math.min(Currency.MAX_WIN, winnings + Math.ceil(winnings * (multi / 100)));
	}
}