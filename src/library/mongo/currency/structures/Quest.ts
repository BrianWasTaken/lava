import { LavaClient } from 'lava/index';
import { Structure } from 'lava/discord';

export class Mission extends Structure {
	/**
	 * The amount of times they hit this quest.
	 */
	public count: number;
	/**
	 * Constructor for this bs.
	 */
	public constructor(client: LavaClient, data: CurrencyQuests) {
		super({ client, id: data.id });
		/** @type {number} */
		this.count = data.count;
	}

	/**
	 * Shortcut to the quest module.
	 */
	get module() {
		return this.client.handlers.quest.modules.get(this.id);
	}

	/**
	 * Check if the human who owns this quest already finished.
	 */
	isFinished() {
		return this.count >= this.module.target;
	}
}