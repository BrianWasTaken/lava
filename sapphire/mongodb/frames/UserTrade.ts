import type { UserTrade, UserProfile } from '#db/bundles/UserBundle';
import type { UserCircuit } from '#db/bundles/UserCircuit';
import { Frame } from '#db/Frame';

export interface TradeFrame extends Frame<UserProfile> {
	circuit: UserCircuit;
}

export class TradeFrame extends Frame<UserProfile> implements UserTrade {
	public in: number;
	public out: number;
	public constructor(circuit: UserCircuit, data: UserTrade) {
		super(circuit, data.id);
		this.in = data.in;
		this.out = data.out;
	}

	/**
	 * The command piece this frame is based on.
	 */
	public get piece() {
		const store = this.circuit.bundle.db.client.stores.get('commands');
		return store.get(this.id);
	}
}