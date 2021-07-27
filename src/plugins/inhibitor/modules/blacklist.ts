import { Inhibitor, Command } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Inhibitor {
	constructor() {
		super('blacklist', {
			name: 'Blacklist',
			priority: 1,
			reason: 'blacklist',
			type: 'pre',
		});
	}

	async exec(ctx: Message, cmd: Command): Promise<boolean> {
		const user = await ctx.author.lava.fetch();
		const expire = user.cache.punishments.expire;
		if (expire > Date.now()) {
			return user.banned || user.blocked;
		}
		
		return false;
	}
}