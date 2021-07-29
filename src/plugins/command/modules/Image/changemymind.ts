import { MessageOptions, Message } from 'discord.js';
import { Command} from 'lava/index';

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
					default: 'You need some text idiot.' 
				},
			],
		});
	}

	async exec(ctx: Message, { text }: { text: string }) {
		const params = new URLSearchParams();
		params.set('text', text);
		
		const g = await ctx.client.memer.generate('changemymind', params, 'png');
		await ctx.channel.send({ files: [g] });
		return false;
	}
}