import { SubCommand} from 'lava/index';
import { Message } from 'discord.js';

export default class extends SubCommand {
	constructor() {
		super('hlock', {
			aliases: ['hlock', 'hl'],
			clientPermissions: ['MANAGE_CHANNELS'],
			description: 'Lock the heist channel.',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [timeout=0]',
			args: [
				{
					id: 'tout',
					type: 'number',
					default: 0
				}
			]
		});
	}

	async exec(ctx: Message, { tout }: { tout: number }) {
		await ctx.channel.send(`Locking in: ${tout} seconds`);
		return false;
	}
}