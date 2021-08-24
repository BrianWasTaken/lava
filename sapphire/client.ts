import { LavaClient } from '#core/Client';
import { LogLevel } from '@sapphire/framework';
import { Intents } from 'discord.js';
import { join } from 'path';

export default new LavaClient({
	baseUserDirectory: join(__dirname, 'pieces'),
	defaultPrefix: 'lava',
	intents: Object.values(Intents.FLAGS),
	logger: { level: LogLevel.Info },
	messageSweepInterval: 60,
});