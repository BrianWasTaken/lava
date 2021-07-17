import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('balloon', {
			aliases: ['balloon'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Balloon',
			args: [
				{ 
					id: 'text', 
					match: 'rest', 
					default: 'You need some text bruh.' 
				},
			],
		});
	}

	exec(ctx: Context, { text }: { text: string }) {
		const params = new URLSearchParams();
		params.set('text', text);
		
		return ctx.client.memer.generate('balloon', params, 'png')
			.then(g => ctx.channel.send(g))
			.then(() => false);
	}
}