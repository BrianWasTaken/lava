import { Argument, CommandOptions } from 'discord-akairo';
import { CurrencyEntry } from 'lava/mongo';
import { Currency } from 'lava/utility';
import { Command } from 'lava/akairo';
import { Message } from 'discord.js';

export class GambleCommand extends Command {
	/**
	 * Construct a gambling command.
	 * @param id the id of this command
	 * @param options the command options
	 */
	public constructor(id: string, options: CommandOptions) {
		super(id, { 
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 3000,
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
		const { MIN_BET, MAX_BET, MAX_POCKET, MAX_SAFE_POCKET } = Currency;
		const { isInteger } = entry.client.util;
		const { pocket } = entry.props;
		let bet: number;

		if (pocket > MAX_POCKET)
			return 'You are too rich to play!';
		if (!amount)
			return 'You need to bet something, smh.';
		if (Number(amount) < 1 || !Number.isInteger(Number(amount))) {
			if (amount.toLowerCase().match(/k$/g)) {
				const kay = Number(amount.replace(/k$/g, ''));
				if (!Number.isInteger(Number(kay * 1000)) || isNaN(kay * 1000)) {
					return 'You actually have to bet an actual number, dummy.';
				} else {
					bet = kay * 1000;
				}
			} else if (amount.toLowerCase() === 'all') {
				bet = pocket;
			} else if (amount.toLowerCase() === 'max') {
				bet = Math.min(MAX_BET, pocket);
			} else if (amount.toLowerCase() === 'half') {
				bet = Math.round(pocket / 2);
			} else if (amount.toLowerCase() === 'min') {
				bet = MIN_BET;
			} else {
				return 'You have to bet actual coins, don\'t try and break me.';
			}
		}

		return this.checkBet(Number(amount) || bet, entry);
	}

	/**
	 * Check if the bet or user's pocket are blocked.
	 * @param bet the parsed bet amount
	 * @param entry the user's entry from mongodb
	 */
	public static checkBet(bet: number, entry: CurrencyEntry) {
		const { MAX_BET, MIN_BET } = Currency;
		const { pocket } = entry.props;

		if (pocket <= 0) 
			return 'You have no coins in your pocket to gamble with lol.';
		if (bet > pocket)
			return `You only have ${pocket.toLocaleString()} coins, don't try and lie to me hoe.`;
		if (bet > MAX_BET)
			return `You can't bet more than **${MAX_BET.toLocaleString()} coins** at once, sorry not sorry`;
		if (bet < MIN_BET)
			return `You can't bet less than **${MIN_BET.toLocaleString()} coins**, sorry not sorry`;

		return bet;
	}

	/**
	 * Shortcut to get user multipliers.
	 * @param ctx The discord message object
	 * @param entry The user's currency entry
	 * @param [cap] Wether to cap the multis or not.
	 */
	public static getMulti(ctx: Message, entry: CurrencyEntry, cap = true) {
		const multi = entry.calcMulti(ctx).unlocked.reduce((p, c) => c.value + p, 0);
		return cap ? Math.min(Currency.MAX_MULTI, multi) : multi;
	}

	/**
	 * Get the winnings of multiplier-based gamble commands.
	 * @param multi the user multipliers
	 * @param bet the user gamble amount
	 * @param [cap] wether to cap their winnings
	 */
	public static getWinnings(multi: number, bet: number, cap = true, extraWinnings = 0) {
		const base = Math.ceil(bet * (Math.random() + 0.1 + extraWinnings));
		const raw = base + Math.ceil(base * (multi / 100));
		return cap ? Math.min(Currency.MAX_WIN, raw) : raw;
	}
}