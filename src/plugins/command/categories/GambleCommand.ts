import { Argument, CommandOptions } from 'discord-akairo';
import { CurrencyEntry } from 'lava/mongo';
import { Currency } from 'lava/utility';
import { Context } from 'lava/discord';
import { Command } from 'lava/akairo';

export class GambleCommand extends Command {
	public ['constructor']: typeof GambleCommand;

	/**
	 * Construct a gambling command.
	 * @param id the id of this command
	 * @param options the command options
	 */
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

	/**
	 * The new disgusting parser I made for gambling.
	 * @param entry the user's entry from mongodb
	 * @param amount the amount akairo parsed for us
	 */
	public static parseBet(entry: CurrencyEntry, amount: string) {
		const { MIN_BET, MAX_BET } = Currency;
		const { isInteger } = entry.client.util;
		const { pocket } = entry.props;
		let bet: number;

		if (!amount) return 'You need something to play!';

		if (!isInteger(Number(amount))) {
			const amt = amount.toLowerCase();
			if (amt === 'all') bet = pocket;
			if (amt === 'min') bet = MIN_BET;
			if (amt === 'max') bet = Math.min(MAX_BET, pocket);
			if (amt === 'half') bet = Math.trunc(Math.min(MAX_BET, pocket) / 2);
			if (amt.match(/k/g)) bet = Number(amt.replace(/k$/g, '')) * 1000;
		} else if (typeof amount !== 'undefined') {
			bet = parseFloat(amount);
		}

		return this.checkBet(bet, entry);
	}

	/**
	 * Check if the bet or user's pocket are blocked.
	 * @param bet the parsed bet amount
	 * @param entry the user's entry from mongodb
	 */
	public static checkBet(bet: number, entry: CurrencyEntry) {
		if (!bet || typeof bet === 'undefined') 
			return 'You need something to play!';
		if (entry.props.pocket <= 0) 
			return 'You have no coins to gamble with.';
		if (entry.props.pocket > Currency.MAX_POCKET)
			return 'You are too rich to play!';
		if (bet < Currency.MIN_BET)
			return `You can't bet lower than **${Currency.MIN_BET.toLocaleString()}** :rage:`;
		if (bet > Currency.MAX_BET) 
			return `You can't bet higher than **${Currency.MAX_BET.toLocaleString()}** smh`;
		if (bet > entry.props.pocket)
			return `You only have **${entry.props.pocket.toLocaleString()}** coins lol`;

		return bet;
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
		const base = Math.ceil(bet * ((Math.random() * 0.8) + 0.2));
		const raw = base + Math.ceil(base * (multi / 100));
		return cap ? Math.min(Currency.MAX_WIN, raw) : raw;
	}
}