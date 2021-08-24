import type { UserItem, UserProfile } from '#db/bundles/UserBundle';
import type { UserCircuit } from '#db/bundles/UserCircuit';
import { Frame } from '#db/Frame';

export interface ItemFrame extends Frame<UserProfile> {
	circuit: UserCircuit;
}

export class ItemFrame extends Frame<UserProfile> implements UserItem {
	public amount: number;
	public expire: number;
	public level: number;
	public value: number;
	public xp: number;
	public constructor(circuit: UserCircuit, data: UserItem) {
		super(circuit, data.id);
		this.amount = data.amount;
		this.expire = data.expire;
		this.level = data.level;
		this.value = data.value;
		this.xp = data.xp;
	}

	/**
	 * The item piece this frame is based on.
	 */
	public get piece() {
		const store = this.circuit.bundle.db.client.stores.get('items');
		return store.get(this.id);
	}

	/**
	 * The upgrade information based on the current level.
	 */
	public get upgrade() {
		return this.piece?.upgrades[this.level];
	}

	/**
	 * Whether this item is on an active state.
	 */
	public isActive(): boolean {
		return this.expire > Date.now();
	}

	/**
	 * Whether the user owns this item.
	 */
	public isOwned(): boolean {
		return this.amount > 0;
	}
}