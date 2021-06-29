import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class Utility extends Command {
	public constructor() {
		super('ping', {
			name: 'Ping',
			aliases: ['ping', 'pong'],
			description: 'Ping me i ping you, lets ping each other :smirk:'
		});
	}

	public exec = (ctx: Context) => ctx.reply({
		content: `**:ping_pong: Ponge:** \`${ctx.guild.shard.ping}ms\``
	});
}