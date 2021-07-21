import { Command, Context, Colors } from 'lava/index';

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

	async exec(ctx: Context, args: { all: boolean; }) {
		const { data } = await ctx.currency.fetch(ctx.author.id);

		await ctx.reply({ embed: { color: 'RED', description: 'Are u sure you wanna reset rn?' } });
		const prompt1 = await ctx.awaitMessage();
		if (!prompt1 || !prompt1.content) {
			await ctx.reply('Imagine not replying to me with a yes or no.');
			return false;
		}
		if (!['yes', 'y', 'ye'].includes(prompt1.content)) {
			await prompt1.reply({ embeds: [{ color: Colors.INDIGO, description: 'Okay then.' }] });
			return false;
		}

		if (args.all && ctx.client.isOwner(ctx.author)) {
			await ctx.client.db.currency.model.deleteMany({});
		} else {
			await data.delete();
		}

		return ctx.reply({ embeds: [{ color: Colors.GREEN, description: 'Ok ur data has been deleted, enjoy the new life kid' }] }).then(() => false);
	}
}