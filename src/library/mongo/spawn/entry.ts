/**
 * User Entry to manage their spawn datatards.
 * @author BrianWasTaken
*/

import { UserEntry, SpawnEndpoint } from 'lava/mongo';

export declare interface SpawnEntry extends UserEntry<SpawnProfile> {
	/** The endpoint of this entry. */
	endpoint: SpawnEndpoint;
} 

export class SpawnEntry extends UserEntry<SpawnProfile> {
	/**
	 * Basic props.
	*/
	get props() {
		return this.cache;
	}

	/**
	 * Manage their unpaids.
	*/
	private balance(amount: number) {
		return {
			add: () => {
				this.cache.unpaids += amount;
				return this;
			},
			remove: () => {
				this.cache.unpaids -= amount;
				return this;
			}
		}
	}

	/**
	 * Manage their joined events.
	*/
	private joined(inc = 1) {
		return {
			increment: () => {
				this.cache.joined += inc;
				return this;
			},
			decrement: () => {
				this.cache.joined -= inc;
				return this
			}
		}
	}
}