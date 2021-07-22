import { Argument, CommandOptions } from 'discord-akairo';
import { Currency, GambleMessages } from 'lava/utility';
import { CurrencyEntry } from 'lava/mongo';
import { Context } from 'lava/discord';
import { Command } from 'lava/akairo';

export class GambleCommand extends Command {
	public ['constructor']: typeof GambleCommand;

	public constructor(id: string, options: CommandOptions) {
		super(id, { 
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 500,
			args: [
				{ 
					id: 'amount', 
					type: 'string'
				}
			], 
			...options
		});
	}

	parseArgs(ctx: Context, args: { amount: string | number }, entry: CurrencyEntry) {
		const { MIN_BET, MAX_BET } = Currency;
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
					return GambleMessages.IS_NAN;
			}
		}

		return parseFloat(amount as string) || parseFloat(args.amount as string) || null;
	}

	checkArgs(bet: string | number, entry: CurrencyEntry) {
		switch(true) {
			case entry.props.pocket <= 0:
				return GambleMessages.NO_COINS;
			case entry.props.pocket > Currency.MAX_POCKET:
				return GambleMessages.TOO_RICH;
			case bet > entry.props.pocket:
				return GambleMessages.BET_HIGHER_POCKET(entry.props.pocket);
			case bet < Currency.MIN_BET:
				return GambleMessages.BET_IS_LOWER;
			case bet > Currency.MAX_BET:
				return GambleMessages.BET_IS_HIGHER;
			default:
				return bet as number;
		}
	}

	/**
	 * Shortcut to get user multipliers.
	 * @param ctx The discord message object
	 * @param entry The user's currency entry
	 * @param [cap] Wether to cap the multis or not.
	 */
	public static getMulti(ctx: Context, entry: CurrencyEntry, cap = true) {
		const multi = entry.calcMulti(ctx).unlocked.reduce((p, c) => c.value + p, 0);
		return cap ? Math.min(Currency.MAX_MULTI, multi) : multi;
	}

	/**
	 * Get the winnings of multiplier-based gamble commands.
	 * @param multi the user multipliers
	 * @param bet the user gamble amount
	 * @param [extra] any extra winnings
	 */
	public static getWinnings(multi: number, bet: number, cap = true) {
		const base = Math.ceil(bet * ((Math.random() * 0.5) + 0.2));
		const raw = base + Math.ceil(base * (multi / 100));
		return cap ? Math.min(Currency.MAX_WIN, raw) : raw;
	}
}