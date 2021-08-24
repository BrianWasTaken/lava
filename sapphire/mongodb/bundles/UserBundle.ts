import type { Model, Document } from 'mongoose';
import type { FrameInterface } from '#db/Frame';
import type { BaseProfile } from '#db/Bundle';
import type { Client } from '#db/Client';
import { UserCircuit } from '#db/bundles/UserCircuit';
import { Bundle } from '#db/Bundle';
import UserModel from './UserModel';

/**
 * Represents the entry of a discord user in the mongodb database.
 */
export interface UserProfile extends BaseProfile {
	props: UserProps; // basic shit
	punishments: UserPunishment; // blocks and bans
	commands: UserCommand[]; // cooldowns, commands run, commands spam
	gambles: UserGamble[]; // streaks, games
	inventory: UserItem[]; // owned, upgrades, xp
	claims: UserClaim[]; // streak, last time claimed
	quests: UserQuest[]; // count, fail amount, accomplished amount
	settings: UserSetting[]; // settings
	trades: UserTrade[]; // give/gift
}

/**
 * A bundle for user-specific data and stuff.
 * @since 4.0.0
 */
export class UserBundle extends Bundle<UserProfile> {
	public constructor(client: Client) {
		super(client, UserModel, UserCircuit);
	}
}

/**
 * Represents the basic properties of user bullshit.
 */
export interface UserProps {
	/**
	 * Amount of premium keys they own.
	 */
	keys: number;
	/**
	 * The base multipliers when starting up.
	 */
	multi: number;
	/**
	 * Amount of coins on their pocket.
	 */
	pocket: number;
	/**
	 * Represents their prestige level.
	 */
	prestige: number;
	/**
	 * Represents the coins in their bank.
	 */
	space: number;
	/**
	 * Represents the capacity of their bank.
	 */
	vault: number;
	/**
	 * Their experience points earned by abusing the bot.
	 */
	xp: number;
}

/**
 * Represents user commands.
 */
export interface UserCommand extends FrameInterface {
	/**
	 * When the command's cooldown would expire.
	 */
	cooldown: number;
	/**
	 * The last timestamp they run this command.
	 */
	last_run: number;
	/**
	 * Amount of times they ran this command.
	 */
	runs: number;
	/**
	 * Amount of times they tried spamming this command (hit the cooldown)
	 */
	spams: number;
}

/**
 * Represents a gambling statistic.
 */
export interface UserGamble extends FrameInterface {
	/**
	 * How many times they lost in this game.
	 */
	loses: number;
	/**
	 * Their highest lose streak.
	 */
	losies: number;
	/**
	 * Amount of coins they've lost.
	 */
	lost: number;
	/**
	 * Amount of times they won.
	 */
	wins: number;
	/**
	 * Their highest win streak.
	 */
	winnies: number;
	/**
	 * Total coins they won.
	 */
	won: number;
}

/**
 * Represents the basic form of objects for user inventory.
 */
export interface UserItem extends FrameInterface {
	/**
	 * Amount of bitches they own.
	 */
	amount: number;
	/**
	 * When they bitch would die.
	 */
	expire: number;
	/**
	 * Custom value for this crap, usually multipliers.
	 */
	value: number;
	/**
	 * Represents the level of this item.
	 */
	level: number;
	/**
	 * Represents the xp of this item to be upgrade-ready.
	 */
	xp: number;
}

/**
 * Enums for user punishments.
 */
export const enum UserPunishmentStates {
	NONE,
	BLOCK,
	BAN
};

/**
 * Represents the user's bot punishment.
 */
export interface UserPunishment {
	/**
	 * The state of the punishment.
	 */
	state: UserPunishmentStates;
	/**
	 * When this punishment would expire. Ignored when `state` set to `BAN`.
	 */
	expire: number;
	/**
	 * Amount of times they got punished, useful for idiot tracking.
	 */
	count: number;
}

/**
 * Represents a user's claim info.
 */
export interface UserClaim {
	/**
	 * Coins/Keys they earn from this claim.
	 */
	earned: number;
	/**
	 * Their daily/hourly/weekly streak.
	 */
	streak: number;
	/**
	 * Last time they've claimed.
	 */
	timestamp: number;
}

/**
 * Object to manage user settings. */
export interface UserSetting extends FrameInterface {
	/**
	 * Whether this setting is currently enabled or not.
	 */
	enabled: boolean;
	/**
	 * The date in the future when the user's allowed to re-enable this setting.
	 */
	cooldown: number;
}

/**
 * Base object to manage trades.
 */
export interface UserTrade extends FrameInterface {
	/**
	 * The coins/items they got from someone.
	 */
	in: number;
	/**
	 * Coins/items they gave out.*/
	out: number;
}

/**
 * Interface to manage quests.
 */
export interface UserQuest extends FrameInterface {
	/**
	 * Whether this quest is active or not.
	 */
	active: boolean;
	/**
	 * The progress of the quest.
	 */
	count: number;
	/**
	 * The expiration date of this quest.
	 */
	expire: number;
	/**
	 * The amount of times they've done this quest.
	 */
	done: number;
	/**
	 * Amount of times they've failed this quest.
	 * e.g ran out of time
	 */
	fails: number;
}