import { SubCommand, Context } from 'lava/index';
import { Message } from 'discord.js';

export default class extends SubCommand {
	constructor() {
		super('hunlock', {
			aliases: ['hunlock', 'hul'],
			clientPermissions: ['MANAGE_CHANNELS'],
			description: 'Lock the heist channel.',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [timeout=60]',
			args: [
				{
					id: 'tout',
					type: 'number',
					default: 1000 * 60
				}
			]
		});
	}

	async exec(ctx: Message, { tout }: { tout: number }) {
		await ctx.channel.send(`Unlocking in: ${tout} seconds`);
		return false;
	}
}