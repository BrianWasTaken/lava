import { Intents, Options, LimitedCollection } from 'discord.js';
import { LavaClient } from 'lava/index';

export default new LavaClient({ 
	ownerID: ['605419747361947649'],
	intents: Object.values(Intents.FLAGS).reduce((p, c) => p | c, 0),
	shards: 'auto',
	messageCacheLifetime: 20,
	messageSweepInterval: 30,
	allowedMentions: {
		repliedUser: true,
	},
	presence: {
		status: 'idle',
		activities: [{ 
			type: 'WATCHING', 
			name: 'things load...' 
		}]
	},
	makeCache: Options.cacheWithLimits({
		MessageManager: 100,
	})
});