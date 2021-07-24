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

	exec(ctx: Message, cmd: Command): Promise<boolean> {
		return ctx.author.lava.fetch().then(bot => bot.banned);
	}
}