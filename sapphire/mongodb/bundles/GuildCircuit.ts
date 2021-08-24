import type { SapphireClient } from '@sapphire/framework';
import type { GuildProfile } from '#db/bundles/GuildBundle';
import { GuildBundle, GuildCommandStates, GuildPunishmentStates } from '#db/bundles/GuildBundle';
import { NumberUtils } from '#util/Native';
import { Circuit } from '#db/Circuit';

export interface GuildCircuit extends Circuit<GuildProfile> {
	bundle: GuildBundle;
}

/**
 * Base circuit to manage guild-related data.
 */
export class GuildCircuit extends Circuit<GuildProfile> {
	/**
	 * Blacklist the guild from the bot.
	 * @param duration The duration of the blacklist.
	 */
	public blacklist(duration: number): this {
		this.data.punishments.expire = duration;
		this.data.punishments.state = GuildPunishmentStates.BLOCK;
		this.data.punishments.count++;
		return this;
	}

	/**
	 * Ban the guild from the bot.
	 */
	public ban(): this {
		this.data.punishments.state = GuildPunishmentStates.BAN;
		this.data.punishments.count++;
		return this;
	}

	/**
	 * Revoke any active punishments from the guild.
	 */
	public revokePunishment(): this {
		this.data.punishments.state = GuildPunishmentStates.NONE;
		this.data.punishments.expire = 0;
		return this;
	}

	/**
	 * Enable a guild command.
	 * @param id The id of the command.
	 * @param toggle The kind of toggle.
	 */
	public enableCommand(id: string, toggle: GuildCommandStates): this {
		const thisCommand = this.data.commands.find(c => c.id === id);
		if (!thisCommand) return this;
		thisCommand.toggles = toggle;
		thisCommand.enabled = true;
		return this;
	}

	/**
	 * Disable a guild command.
	 * @param id The id of the command.
	 * @param toggle The kind of toggle.
	 */
	public disableCommand(id: string, toggle: GuildCommandStates): this {
		const thisCommand = this.data.commands.find(c => c.id === id);
		if (!thisCommand) return this;
		thisCommand.toggles = toggle;
		thisCommand.enabled = false;
		return this;
	}

	/**
	 * Adds a cooldonw to the command.
	 * @param id The id of the command.
	 * @param expire The expiration date.
	 */
	public addCooldown(id: string, expire: number): this {
		const thisCommand = this.data.commands.find(c => c.id === id);
		if (!thisCommand) return this;
		thisCommand.cooldown = expire;
		return this;
	}

	/**
	 * Increment a user donation.
	 * @param id The id of the donation.
	 * @param userId The user id to add the dono.
	 * @param amount The amount to add.
	 */
	public addDonation(id: string, userId: string, amount: number): this {
		const thisDono = this.data.donations.find(d => d.id === id);
		if (!thisDono) return this;
		const user = thisDono.records.find(r => r.userId = userId);
		if (!user) {
			thisDono.records.push({ userId, amount, recorded: 1 });
			return this.addDonation(id, userId, amount);
		}
		user.amount += amount;
		user.recorded++;
		return this;
	}

	/**
	 * Decrement a user donation.
	 * @param id The id of the donation.
	 * @param userId The user id to deduct the dono.
	 * @param amount The amount to deduct.
	 */
	public subDonation(id: string, userId: string, amount: number): this {
		const thisDono = this.data.donations.find(d => d.id === id);
		if (!thisDono) return this;
		const user = thisDono.records.find(r => r.userId = userId);
		if (!user) {
			thisDono.records.push({ userId, amount, recorded: 0 });
			return this.subDonation(id, userId, amount);
		}
		user.amount -= amount;
		user.recorded++;
		return this;
	}
}

declare module 'discord.js' {
	interface Guild {
		client: SapphireClient;
		db: GuildCircuit;
	}
}