import { Endpoint, LavaEntry, EndpointEvents } from 'lava/mongo';
import { Command, Setting } from 'lava/akairo';
import { User } from 'discord.js';

export interface LavaEndpointEvents extends EndpointEvents<LavaEntry> {
	/** Emitted on profile creation. */
	create: [entry: LavaEntry, user: User];
	/** Emitted when someone got banned temporarily.  */
	botBlock: [entry: LavaEntry, user: User, args: { duration: number; reason: string; }];
	/** Emitted when someone got bot banned. */
	botBan: [entry: LavaEntry, user: User, args: { duration: number; reason: string; }];
}

export interface LavaEndpoint extends Endpoint<LavaProfile> {
	/** 
	 * Listen for crib events. 
	 */
	on: <K extends keyof LavaEndpointEvents>(event: K, listener: (...args: LavaEndpointEvents[K]) => PromiseUnion<void>) => this;
	/**
	 * Emit crib events.
	 */
	emit: <K extends keyof LavaEndpointEvents>(event: K, ...args: LavaEndpointEvents[K]) => boolean;
}

export class LavaEndpoint extends Endpoint<LavaProfile> {
	/**
	 * Fetch some idiot from the db.
	 */
	public async fetch(_id: Snowflake): Promise<LavaProfile> {
		const doc = await this.model.findById({ _id }) ?? await this.model.create({ _id });
		const pushed = [this.updateCooldowns(doc), this.updateSettings(doc)];
		return pushed.some(s => s.length > 1) ? await doc.save() : doc;
	}

	/**
	 * Push all missing settings.
	 */
	public updateSettings(doc: LavaProfile) {
		const updated: Setting[] = [];
		for (const mod of this.client.handlers.setting.modules.values()) {
			if (!doc.settings.find(i => i.id === mod.id)) {
				doc.settings.push({ id: mod.id, cooldown: 0, enabled: mod.default });
				updated.push(mod);
			}
		}

		return updated;
	}

	/**
	 * Push all commands for cooldowns.
	 */
	public updateCooldowns(doc: LavaProfile) {
		const updated: Command[] = [];
		for (const mod of this.client.handlers.command.modules.values()) {
			if (!doc.cooldowns.find(i => i.id === mod.id)) {
				doc.cooldowns.push({ id: mod.id, expire: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}
}