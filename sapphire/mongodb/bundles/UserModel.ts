/**
 * Represents the mongoose model for users.
 * @since 4.0.0
 */
import { UserProfile, UserPunishmentStates } from './UserBundle';
import { model, Schema, Model } from 'mongoose';

export default model<GuildProfile>('User', new Schema<UserProfile, Model<UserProfile>, UserProfile>({
	_id: {
		type: String,
		required: true
	},
	props: {
		keys: { type: Number, default: 0 },
		multi: { type: Number, default: 3 },
		pocket: { type: Number, default: 500 },
		prestige: { type: Number, default: 0 },
		space: { type: Number, default: 0 },
		vault: { type: Number, default: 0 },
		xp: { type: Number, default: 0 }
	},
	punishments: {
		state: { type: String, default: UserPunishmentStates.NONE },
		expire: { type: Number, default: 0 },
		count: { type: Number, default: 0 }
	},
	commands: [{
		id: { type: String, default: 'ping' },
		cooldown: { type: Number, default: 0 },
		last_run: { type: Number, default: 0 },
		runs: { type: Number, default: 0 },
		spams: { type: Number, default: 0 }
	}],
	gambles: [{
		id: { type: String, default: 'gamble' },
		loses: { type: Number, default: 0 },
		losies: { type: Number, default: 0 },
		lost: { type: Number, default: 0 },
		wins: { type: Number, default: 0 },
		winnies: { type: Number, default: 0 },
		won: { type: Number, default: 0 },
	}],
	inventory: [{
		id: { type: String, default: 'trophy' },
		amount: { type: String, default: 0 },
		expire: { type: String, default: 0 },
		value: { type: Number, default: 0 },
		level: { type: Number, default: 0 },
		xp: { type: Number, default: 0 },
	}],
	claims: [{
		id: { type: String, default: 'daily' },
		earned: { type: Number, default: 0 },
		streak: { type: Number, default: 0 },
		timestamp: { type: Number, default: 0 },
	}],
	settings: [{
		id: { type: Number, default: 'dmnotifications' },
		enabled: { type: Boolean, default: false },
		cooldown: { type: Number, default: 0 }
	}],
	trades: [{
		id: { type: Number, default: 'share' },
		in: { type: Number, default: 0 },
		out: { type: Number, default: 0 },
	}],
	quests: [{
		id: { type: Number, default: 'what' },
		active: { type: Boolean, default: false },
		count: { type: Number, default: 0 },
		expire: { type: Number, default: 0 },
		done: { type: Number, default: 0 },
		fails: { type: Number, default: 0 },
	}]
}));