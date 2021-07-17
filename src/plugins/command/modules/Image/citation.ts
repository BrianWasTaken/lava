import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('citation', {
			aliases: ['citation'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Citation',
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
		
		return ctx.client.memer.generate('citation', params, 'png')
			.then(g => ctx.channel.send(g))
			.then(() => false);
	}
}