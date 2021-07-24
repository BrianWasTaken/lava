/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { UserSetting, UserEntry, CribEndpoint } from 'lava/mongo';
import { GiveawayDonation } from '.';
import { Collection } from 'discord.js';

export declare interface CribEntry extends UserEntry<CribProfile> {
	/** The endpoint of this entry. */
	endpoint: CribEndpoint;
} 

export class CribEntry extends UserEntry<CribProfile> {
	/** Their booster shit */
	get booster() {
		return this.cache.booster;
	}

	/** Their donos in memers crib */
	get donos() {
		return super.map('donations', GiveawayDonation);
	}

	/** Manage user donos */
	private donation(id: string, amount: number) {
		const thisDono = this.cache.donations.find(d => d.id === id);

		return {
			add: (count: boolean, push = true) => {
				if (count) thisDono.count++;
				if (push) thisDono.donations.push(amount);
				thisDono.amount += amount;
				return this;
			},
			sub: () => {
				thisDono.amount -= amount;
				return this;
			}
		}
	}

	/** Manage crib boosts */
	private boost() {
		return {
			activate: (expire: number) => {
				this.cache.booster.expires = expire;
				return this;
			},
			deactivate: () => {
				this.cache.booster.expires = 0;
				this.cache.booster.role = '';
				return this;
			},
			setRole: (role: string) => {
				this.cache.booster.role = role;
				return this;
			}
		}
	}

	/** Trigger their booster crap */
	triggerBoost(expire = 1000 * 60 * 60 * 24 * 7) {
		return this.boost().activate(expire);
	}

	/** Deactivate their perks. */
	endBoost() {
		return this.boost().deactivate();
	}

	/** Booster custom role */
	setBoostRole(role: string) {
		return this.boost().setRole(role);
	}

	/** Add donos */
	addDono(id: string, amount: number, count = true, push = true) {
		return this.donation(id, amount).add(count, push);
	}

	/** Remove donos */
	subDono(id: string, amount: number) {
		return this.donation(id, amount).sub();
	}
}