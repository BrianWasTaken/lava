import { LavaClient } from 'lava/index';
import { Structure } from 'lava/discord';

export class TradeStat extends Structure {
	/**
	 * Coins they shared.
	 */
	public shared: number;
	/**
	 * Coins they recieved.
	 */
	public recieved: number;
	/**
	 * Constructor for this trade stat.
	 */
	public constructor(client: LavaClient, data: CurrencyTrade) {
		super({ client, id: data.id });
		/** @type {number} */
		this.shared = data.out;
		/** @type {number} */
		this.recieved = data.in;
	}

	/**
	 * Shortcut to the command module this trade stat belongs to.
	 */
	get module() {
		return this.client.handlers.command.modules.get(this.id);
	}
}