import { LavaClient } from 'lava/index';
import { Structure } from '../../../discord/structures/Structure';

export class GambleStat extends Structure {
	/**
	 * Coins they won.
	 */
	public won: number;
	/**
	 * Coins they lost.
	 */
	public lost: number;
	/**
	 * Amount of times they won.
	 */
	public wins: number;
	/**
	 * Times they lost this game.
	 */
	public loses: number;
	/**
	 * Constructor for this shitfuckery.
	 */
	public constructor(client: LavaClient, data: CurrencyGamble) {
		super({ client, id: data.id });
		/** @type {number} */
		this.won = data.won;
		/** @type {number} */
		this.lost = data.lost;
		/** @type {number} */
		this.wins = data.wins;
		/** @type {number} */
		this.loses = data.loses;
	}

	/**
	 * Shortcut to the command module this stat holds from.
	 */
	get module() {
		return this.client.handlers.command.modules.get(this.id);
	}

	/**
	 * The net worth for coins won/lost.
	 */
	get netCoins(): number {
		return this.won - this.lost;
	}

	/**
	 * Calcs the winrate for this bs.
	 */
	calcWinRate(places = 0): string {
		return (100 * (this.wins / (this.wins + this.loses))).toFixed(places);
	}
}