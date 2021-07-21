import { LavaClient } from 'lava/index';
import { Structure } from 'lava/discord';

export class UserSetting extends Structure {
	/**
	 * The possible cooldown for this setting.
	 */
	public cooldown: number;
	/**
	 * Wether this setting is enabled or not.
	 */
	public enabled: boolean;
	/**
	 * Constructor for this setshit.
	 */
	public constructor(client: LavaClient, data: LavaSettings) {
		super({ client, id: data.id });
		/** @type {number} */
		this.cooldown = data.cooldown ?? 0;
		/** @type {number} */
		this.enabled = data.enabled;
	}

	/**
	 * Just a shortcut, nothin' special.
	 */
	get module() {
		return this.client.handlers.setting.modules.get(this.id);
	}
}