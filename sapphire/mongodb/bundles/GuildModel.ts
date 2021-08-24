/**
 * Represents the mongoose model for guilds.
 * @since 4.0.0
 */
import { GuildProfile, GuildPunishmentStates, GuildCommandStates } from './GuildBundle';
import { model, Schema, Model } from 'mongoose';

export default model<GuildProfile>('Guild', new Schema<GuildProfile, Model<GuildProfile>, GuildProfile>({
	_id: {
		type: String,
		required: true
	},
	punishments: {
		state: { type: String, default: GuildPunishmentStates.NONE },
		expire: { type: Number, default: 0 },
		count: { type: Number, default: 0 }
	},
	donations: [{
		id: { type: String, default: 'default' },
		records: [{
			amount: { type: Number, default: 0 },
			recorded: { type: Number, default: 0 },
			userId: { type: String, default: '' }
		}]
	}],
	commands: [{
		id: { type: String, default: 'ping', },
		enabled: { type: Boolean, default: true, },
		cooldown: { type: Number, default: 0 },
		toggles: { type: String, default: GuildCommandStates.EVERYONE }
	}]
}));