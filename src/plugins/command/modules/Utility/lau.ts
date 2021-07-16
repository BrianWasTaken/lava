import { Command, Context } from 'lava/index';
import { Snowflake } from 'discord.js';

export default class extends Command {
	constructor() {
		super('lau', {
			aliases: ['lau'],
			description: 'Random command or easter egg?',
			name: 'Lau',
		});
	}

	async exec(ctx: Context) {
		const idiot = ctx.client.users.cache.get((ctx.client.ownerID as Snowflake[])[0]);
		await ctx.reply(`Lau`);
		return false;
	}
} 
