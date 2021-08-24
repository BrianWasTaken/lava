import type { UserQuest, UserProfile } from '#db/bundles/UserBundle';
import type { UserCircuit } from '#db/bundles/UserCircuit';
import { Frame } from '#db/Frame';

export interface QuestFrame extends Frame<UserProfile> {
	circuit: UserCircuit;
}

export class QuestFrame extends Frame<UserProfile> implements UserQuest {
	public active: boolean;
	public count: number;
	public expire: number;
	public done: number;
	public fails: number;
	public constructor(circuit: UserCircuit, data: UserQuest) {
		super(circuit, data.id);
		this.active = data.active;
		this.count = data.count;
		this.expire = data.expire;
		this.done = data.done;
		this.fails = data.fails;
	}

	/**
	 * The quest piece this frame is based on.
	 */
	public get piece() {
		const store = this.circuit.bundle.db.client.stores.get('quests');
		return store.get(this.id);
	}
}