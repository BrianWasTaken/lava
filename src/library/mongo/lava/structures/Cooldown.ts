import { LavaClient } from 'lava/index';
import { Structure } from '../../../discord/structures/Structure';

export class Cooldown extends Structure {
	/**
	 * Expiration time for this cooldown.
	 */
	public expiresAt: number;
	/**
	 * Constructor for this bullshit.
	 */
	public constructor(client: LavaClient, data: LavaCooldowns) {
		super({ client, id: data.id });
		/**
		 * Expiration date of this item.
		*/
		this.expiresAt = data.expire;
	}

	/**
	 * Shortcut for returning the cooldown as a command module.
	*/
	get module() {
		return this.client.handlers.command.modules.get(this.id);
	}

	/**
	 * Check if cooldown is active.
	*/
	isActive() {
		return this.expiresAt > Date.now();
	}
}