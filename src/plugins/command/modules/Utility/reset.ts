import { Command, Colors } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('reset', {
			aliases: ['reset'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60,
			description: 'Reset your currency data.',
			name: 'Reset',
			args: [
				{
					id: 'all',
					match: 'flag',
					flag: ['--all', '-a'],
					default: null
				}
			]
		});
	}

	async exec(ctx: Message, args: { all: boolean; }) {
		const { cache } = await ctx.author.currency.fetch();

		await ctx.reply({ embeds: [{ color: Colors.RED, description: 'Are u sure you wanna reset rn?' }] });
		const prompt1 = await ctx.awaitMessage();
		if (!prompt1 || !prompt1.content) {
			await ctx.reply('Imagine not replying to me with a yes or no.');
			return false;
		}
		if (!['yes', 'y', 'ye'].includes(prompt1.content)) {
			await prompt1.reply({ embeds: [{ color: Colors.INDIGO, description: 'Okay then.' }] });
			return false;
		}

		if (args.all && ctx.client.isOwner(ctx.author.id)) {
			await ctx.client.db.currency.model.deleteMany({});
		} else {
			await cache.delete();
		}

		await ctx.author.currency.fetch(); // to remove that shitty error
		return ctx.reply({ embeds: [{ color: Colors.GREEN, description: 'Ok ur data has been deleted, enjoy the new life kid' }] }).then(() => false);
	}
}