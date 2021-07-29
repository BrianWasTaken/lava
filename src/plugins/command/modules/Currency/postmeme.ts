import { Command} from 'lava/index';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('postmeme', {
			aliases: ['postmeme', 'pm'],
			cooldown: 45e3,
			description: 'Post a meme on reddit.',
			name: 'Post Meme',
		});
	}

	async exec(ctx: Message) {
		const entry = await ctx.author.currency.fetch();
		const comp = entry.props.items.get('computer');

		if (!entry.hasInventoryItem(comp.id)) {
			return ctx.reply(`You need **1 ${comp.module.emoji} ${comp.module.name}** to post memes.`).then(() => false);
		}

		return comp.module.use(ctx, entry).then(() => true);
	}
}
