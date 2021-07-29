import { Command} from 'lava/index';
import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('dev', {
			aliases: ['dev', 'd'],
			description: 'Dev tools for you fools',
			name: 'Dev',
			usage: '{command} u dont need docs for dis',
			ownerOnly: true
		});
	}

	*args(ctx: Message) {
		const { modules } = ctx.client.handlers.command;
		const subs = this.subCommands.filter(c => c.parent === this.id);
		const sub: string = yield [...subs.map(s => [s.id])];

		return sub ? Flag.continue(sub) : null;
	}

	exec(ctx: Message, args: any) {
		ctx.client.console.log('Client', args);
		return ctx.reply('what').then(() => false);
	}
}