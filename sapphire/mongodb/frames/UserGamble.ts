import type { UserGamble, UserProfile } from '#db/bundles/UserBundle';
import type { UserCircuit } from '#db/bundles/UserCircuit';
import { Frame } from '#db/Frame';

export interface GambleFrame extends Frame<UserProfile> {
	circuit: UserCircuit;
}

export class GambleFrame extends Frame<UserProfile> implements UserGamble {
	public loses: number;
	public losies: number;
	public lost: number;
	public wins: number;
	public winnies: number;
	public won: number;
	public constructor(circuit: UserCircuit, data: UserGamble) {
		super(circuit, data.id);
		this.loses = data.loses;
		this.losies = data.losies;
		this.lost = data.lost;
		this.wins = data.wins;
		this.winnies = data.winnies;
		this.won = data.won;
	}

	/**
	 * The command piece this frame is based on.
	 */
	public get piece() {
		const store = this.circuit.bundle.db.client.stores.get('commands');
		return store.get(this.id);
	}
}