import { Command} from 'lava/index';
import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('staff', {
			aliases: ['staff', 's'],
			description: 'Get yo ash up and spam deez commands owo',
			name: 'Staph',
			usage: '{command} --demote me',
			ownerOnly: true
		});
	}

	*args(ctx: Message, ...args: any) {
		const { modules } = ctx.client.handlers.command;
		const subs = this.subCommands.filter(c => c.parent === this.id);
		const sub: string = yield [...subs.map(s => [s.id])];

		console.log(args);
		return sub ? Flag.continue(sub) : null;
	}

	async exec(ctx: Message, args: any) {
		ctx.client.console.log('Client', args);
		await ctx.reply('what');
		return false;
	}
}