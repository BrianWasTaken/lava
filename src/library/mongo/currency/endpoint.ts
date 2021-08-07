import { Endpoint, UserEntry, CurrencyEntry, EndpointEvents } from 'lava/mongo';
import { User, Snowflake } from 'discord.js';
import { Item, Command } from 'lava/akairo';

export interface CurrencyEndpointEvents extends EndpointEvents<CurrencyEntry> {
	/** Emitted when a user dies.  */
	death: [entry: CurrencyEntry, user: User, args: { item: Item; amount: number; coins: number; }];
	/** Emitted when someone shares coins.  */
	coinShare: [entry: CurrencyEntry, user: User, args: { sharer: User; coins: number; }];
	/** Emitted when someone gifts items. */
	itemGift: [entry: CurrencyEntry, user: User, args: { gifter: User; amount: number }];
	/** Emitted when they leveled up. */
	levelUp: [entry: CurrencyEntry, user: User, /** args: { rewards: { multi?: number; coins?: number; keys?: number; items?: [number, string] } } */]
}

export interface CurrencyEndpoint extends Endpoint<CurrencyProfile> {
	/** 
	 * Listen for currency events. 
	 */
	on: <K extends keyof CurrencyEndpointEvents>(event: K, listener: (...args: CurrencyEndpointEvents[K]) => PromiseUnion<void>) => this;
	/**
	 * Emit currency events.
	 */
	emit: <K extends keyof CurrencyEndpointEvents>(event: K, ...args: CurrencyEndpointEvents[K]) => boolean;
}

export class CurrencyEndpoint extends Endpoint<CurrencyProfile> {
	/** 
	 * Fetch something from the db. 
	 */
	public async fetch(_id: Snowflake): Promise<CurrencyProfile> {
		const doc = await this.model.findById({ _id }) ?? await this.model.create({ _id });
		const pushed = [this.updateItems(doc), this.updateGames(doc), this.updateTrade(doc)];
		const saved = pushed.some(s => s.length > 1) ? await doc.save() : doc;
		if (!this.cache.has(_id)) this.cache.set(_id, saved);
		return saved;
	}

	/**
	 * Update user inventory.
	 */
	public updateItems(doc: CurrencyProfile) {
		const updated: Item[] = [];
		for (const mod of this.client.handlers.item.modules.filter(i => i.push).values()) {
			if (!doc.items.find(i => i.id === mod.id)) {
				doc.items.push({ id: mod.id, amount: 0, uses: 0, expire: 0, level: 0, multi: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}

	/**
	 * Update gamble stats.
	 */
	public updateGames(doc: CurrencyProfile) {
		const updated: Command[] = [];
		for (const mod of ['blackjack', 'gamble', 'slots', 'pair'].map(c => this.client.handlers.command.modules.get(c))) {
			if (!doc.gamble.find(g => g.id === mod.id)) {
				doc.gamble.push({ id: mod.id, wins: 0, loses: 0, won: 0, lost: 0, streak: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}

	/**
	 * Update trade stats.
	 */
	public updateTrade(doc: CurrencyProfile) {
		const updated: Command[] = [];
		for (const mod of ['give', 'gift'].map(c => this.client.handlers.command.modules.get(c))) {
			if (!doc.trade.find(t => t.id === mod.id)) {
				doc.trade.push({ id: mod.id, in: 0, out: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}
}