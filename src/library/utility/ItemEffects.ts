/**
 * Our helper class for all item effects. 
 * @author BrianWasTaken
*/

export interface ItemEntities {
	/** The discount whenever they buy an item. */
	discount: number[];
	/** The possible rewarded multis if they own one of this. */
	multipliers: number[];
	/** The possible steal shields they'll get if they own this collectible. */
	shield: number[];
	/** The rate between 1-100% for more payouts on multiplier-based gambling commands. */
	payouts: number[];
	/** The possible xp boost between 10-100% */
	xpBoost: number[];
	/** Increase odds in some commands.*/
	luck: number[];
	/** Luck in slots. */
	slots: number[];
	/** Increase chance of dropping keys. */
	keys: number[];
	/** Luck in rob. */
	rob: number[];
}

export class ItemEffects {
	public entities: ItemEntities = {
		rob: [],
		discount: [],
		payouts: [],
		xpBoost: [],
		shield: [],
		luck: [],
		multipliers: [],
		slots: [],
		keys: []
	};

	public static create() {
		const instance = new this();
		return instance;
	}

	public discount(v: number) {
		this.entities.discount.push(v);
		return this;
	}

	public multi(v: number) {
		this.entities.multipliers.push(v);
		return this;
	}

	public shield(v: number) {
		this.entities.shield.push(v);
		return this;
	}

	public payouts(v: number) {
		this.entities.payouts.push(v);
		return this;
	}

	public xpBoost(v: number) {
		this.entities.xpBoost.push(v);
		return this;
	}

	public luck(v: number) {
		this.entities.luck.push(v);
		return this;
	}

	public slots(v: number) {
		this.entities.slots.push(v);
		return this;
	}

	public keys(v: number) {
		this.entities.keys.push(v);
		return this;
	}

	public rob(v: number) {
		this.entities.rob.push(v);
		return this;
	}
}