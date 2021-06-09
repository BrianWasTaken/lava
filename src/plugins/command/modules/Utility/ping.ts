import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class Utility extends Command {
	public constructor() {
		super('ping', {
			name: 'Ping',
			channel: 'guild',
			aliases: ['ping', 'pong'],
			category: 'Utility',
		});
	}

	public exec = (ctx: Context): MessageOptions => ({
		content: `**:ping_pong: Ponge:** \`${ctx.guild.shard.ping}ms\``,
		reply: { messageReference: ctx.id, failIfNotExists: true },
	});
}