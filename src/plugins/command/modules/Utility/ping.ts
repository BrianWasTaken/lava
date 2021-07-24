import { MessageOptions, Message } from 'discord.js';
import { Command, Context } from 'lava/index';

export default class Utility extends Command {
	public constructor() {
		super('ping', {
			name: 'Ping',
			aliases: ['ping', 'pong'],
			description: 'Ping me i ping you, lets ping each other :smirk:'
		});
	}

	public exec = (ctx: Message) => ctx.reply({
		content: `**:ping_pong: Ponge:** \`${ctx.guild.shard.ping}ms\``
	}).then(() => false);
}