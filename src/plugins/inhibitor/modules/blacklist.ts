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
		return false;
		const user = await ctx.author.lava.fetch();
		return user.banned;
	}
}