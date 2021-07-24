import { Command, Context } from 'lava/index';
import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('dono', {
			aliases: ['dono', 'n'],
			description: 'Manage giveaway and other server donations.',
			name: 'Dono',
			usage: '{command} breh',
			ownerOnly: true
		});
	}

	*args(ctx: Message) {
		const subs = this.subCommands.filter(c => c.parent === this.id);
		const sub: string = yield [...subs.map(s => [s.id])];

		return sub ? Flag.continue(sub) : null;
	}

	async exec(ctx: Message, args: any) {
		ctx.client.console.log('Client', args);
		await ctx.reply('what');
		return false;
	}
}