/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { UserEntry, LavaEndpoint } from 'lava/mongo';
import { Cooldown, UserSetting } from '.';
import { Collection } from 'discord.js';
import { Snowflake } from 'discord.js';
import { Command } from 'lava/akairo';

export declare interface LavaEntry extends UserEntry<LavaProfile> {
	/** The endpoint of this entry. */
	endpoint: LavaEndpoint;
} 

export class LavaEntry extends UserEntry<LavaProfile> {
	/** Wether they are blacklisted from the bot or not */
	get blocked() {
		return this.cache.punishments.blocked;
	}

	/** Check if they're banned from the bot */
	get banned() {
		return this.cache.punishments.banned;
	}

	/** User cooldowns mapped from command id to cooldown */
	get cooldowns() {
		return super.map('cooldowns', Cooldown);
	}

	/** User settings mapped from setting id to setting */
	get settings() {
		return super.map('settings', UserSetting);
	}

	/** Bot bans and blacklist methods */
	private punish(duration?: number) {
		return {
			blacklist: (state = true) => {
				if (this.cache.punishments.banned) return this;
				this.cache.punishments.blocked = state;
				this.cache.punishments.expire = Date.now() + duration;
				this.cache.punishments.count++;
				return this;
			},
			ban: (state = true) => {
				if (this.cache.punishments.blocked) return this;
				this.cache.punishments.banned = state;
				this.cache.punishments.count++;
				return this;
			}
		}
	}

	/** Command usage */
	private command(id = 'help') {
		return {
			spam: (amt = 1) => {
				this.cache.commands.spams += amt;
				return this;
			},
			inc: () => {
				this.cache.commands.commands_ran++;
				return this;
			},
			record: () => {
				this.cache.commands.last_ran = Date.now();
				this.cache.commands.last_cmd = id;
				return this;
			}
		}
	}

	/** Update user settings */
	updateSetting(setting: string, state: boolean, cooldown = 0) {
		const thisSetting = this.cache.settings.find(s => s.id === setting);
		thisSetting.cooldown = cooldown;
		thisSetting.enabled = state;
		return this;
	}

	/** Update user command cooldowns */
	updateCooldown(command: string, expire: number) {
		const thisCooldown = this.cache.cooldowns.find(cd => cd.id === command);
		const user = this.client.users.cache.get(this.cache._id as Snowflake);
		if (this.client.isOwner(user) || process.env.DEV_MODE === 'true') return this;
		thisCooldown.expire = expire;
		return this;
	}

	/** Update command records */
	updateCommand(command: string) {
		return this.command(command).record();
	}

	/** Add cooldown */
	addCooldown(command: Command) {
		return this.updateCooldown(command.id, Date.now() + command.cooldown);
	}

	/** Add spam count for spamfucks */
	addSpam() {
		return this.command().spam();
	}

	/** Add command usage */
	addUsage(id: string) {
		return this.command(id).inc();
	}

	/** Blacklist them temporarily */
	blacklist(duration: number) {
		return this.punish(duration).blacklist();
	}

	/** Ban them from this bot */
	ban() {
		return this.punish().ban();
	}

	/** Save dis shit */
	save(addCommandRan = false, addSpam = false) {
		if (addCommandRan) {
			this.cache.commands.commands_ran++;
		}
		if (addSpam) {
			this.cache.commands.spams++;
		}

		return super.save();
	}
}