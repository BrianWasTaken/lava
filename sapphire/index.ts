import 'dotenv/config';

import { DonationStore, QuestStore, ItemStore } from '#core/index';
import { join } from 'path';
import Lava from './client';

Lava.on('ready', client => {
	client.logger.info(`[CLIENT => ready] ${client.user.tag} is now online!`);
}).stores
	.register(new DonationStore())
	.register(new QuestStore())
	.register(new ItemStore())
	.load();

Lava.login(process.env.DISCORD_TOKEN);