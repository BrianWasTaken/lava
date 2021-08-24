import type { UserCommand, UserProfile } from '#db/bundles/UserBundle';
import type { UserCircuit } from '#db/bundles/UserCircuit';
import { Frame } from '#db/Frame';

export interface UserCommandFrame extends Frame<UserProfile> {
	circuit: UserCircuit;
}

export class UserCommandFrame extends Frame<UserProfile> implements UserCommand {
	public cooldown: number;
	public last_run: number;
	public runs: number;
	public spams: number;
	public constructor(circuit: UserCircuit, data: UserCommand) {
		super(circuit, data.id);
		this.cooldown = data.cooldown;
		this.last_run = data.last_run;
		this.runs = data.runs;
		this.spams = data.spams;
	}

	/**
	 * The command piece this frame is based on.
	 */
	public get piece() {
		const store = this.circuit.bundle.db.client.stores.get('commands');
		return store.get(this.id);
	}

	/**
	 * Check whether the command's cooldown is active.
	 */
	public isCdActive(): boolean {
		return Date.now() > this.cooldown;
	}
}