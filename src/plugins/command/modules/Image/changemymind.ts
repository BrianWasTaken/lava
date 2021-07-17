import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('changemymind', {
			aliases: ['changemymind', 'cmm'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Change My Mind',
			args: [
				{ 
					id: 'text', 
					match: 'rest', 
					default: 'You need some text bruh.' 
				},
			],
		});
	}

	async exec(ctx: Context, { text }: { text: string }) {
		const params = new URLSearchParams();
		params.set('text', text);
		
		const g = await ctx.client.memer.generate('changemymind', params, 'png');
		await ctx.channel.send(g);
		return false;
	}
}