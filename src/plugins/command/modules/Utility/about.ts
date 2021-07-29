import { Snowflake, Message } from 'discord.js';
import { Command} from 'lava/index';

export default class extends Command {
	constructor() {
		super('about', {
			aliases: ['about'],
			description: 'About me obviously who else?',
			name: 'About',
		});
	}

	async exec(ctx: Message) {
		const idiot = ctx.client.users.cache.get((ctx.client.ownerID as Snowflake[])[0]);
		await ctx.reply(`Hi my name is ${ctx.client.user.username} and my owner is ${idiot.tag} and you're cute <3`);
		return false;
	}
} 