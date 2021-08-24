import type { Model, Document } from 'mongoose';
import type { FrameInterface } from '#db/Frame';
import type { BaseProfile } from '#db/Bundle';
import type { Client } from '#db/Client';
import { GuildCircuit } from '#db/bundles/GuildCircuit';
import { Bundle } from '#db/Bundle';
import GuildModel from './GuildModel';

/**
 * Represents the entry of a discord user in the mongodb database.
 */
export interface GuildProfile extends BaseProfile {
	punishments: GuildPunishment; // same for user
	donations: GuildDonation[]; // { id, donors: { userId, amount, recorded }[] }[]
	commands: GuildCommand[]; // cooldowns, enabled commands, commands ran
}

/**
 * A bundle for guild-specific data and stuff.
 * @since 4.0.0
 */
export class GuildBundle extends Bundle<GuildProfile> {
	public constructor(client: Client) {
		super(client, GuildModel, GuildCircuit);
	}
}

export interface GuildDonation extends FrameInterface {
	/**
	 * The records created for each individual members.
	 */
	records: {
		/**
		 * Total amount of something they've donated.
		 */
		amount: number;
		/**
		 * How many times they've got this shit recorded.
		 */
		recorded: number;
		/**
		 * The user who owns this.
		 */
		userId: string;
	}[];
}

export const enum GuildPunishmentStates {
	NONE,
	BLOCK,
	BAN
}

export interface GuildPunishment {
	/**
	 * The state of the punishment, whether they're blocked or banned from using the bot.
	 * @default GuildPunishmentStates.NONE
	 */
	state: GuildPunishmentStates;
	/**
	 * When the punishment would expire. Ignored when `state` is set to {@link GuildPunishmentStates.BAN}.
	 */
	expire: number;
	/**
	 * Amount of times the guild got any of the available punishments.
	 * Suitable for more idiot tracking.
	 */
	count: number;
}

export const enum GuildCommandStates {
	EVERYONE,
	CHANNEL,
	USER,
	ROLE
}

export interface GuildCommand extends FrameInterface {
	/**
	 * Whether this command is enabled by default.
	 * @default true
	 */
	enabled: boolean;
	/**
	 * The cooldown for this command for the guild.
	 * @default 0
	 */
	cooldown: number;
	/**
	 * Whether the `enabled` configuration is set to the something.
	 * @default GuildCommandStates.EVERYONE
	 */
	toggles: GuildCommandStates;
}