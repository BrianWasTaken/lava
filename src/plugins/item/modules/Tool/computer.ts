import { Message, MessageButton, MessageActionRow, ButtonInteraction } from 'discord.js';
import { CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('computer', {
			assets: {
				name: 'Prob\'s Computer',
				emoji: ':computer:',
				price: 4000,
				intro: 'An item from a redditor.',
				info: 'Post specific type of memes on reddit!'
			},
			config: {
				usable: false,
				push: true,
			},
		});
	}

	get types() {
		return ['Funny', 'Unoriginal', 'Copyrighted', 'Karen'];
	}

	async use(ctx: Message, entry: CurrencyEntry) {
		const msg = await ctx.reply({
			components: [new MessageActionRow().addComponents(
				...this.types.map(label => new MessageButton({
					customId: label.toLowerCase(),
					label, style: 'PRIMARY', 
				}))
			)],
			content: [
				`**What type of meme do you wanna post?**`,
				'*Choose a meme below.*'
			].join('\n')
		});
		const choice = await msg.awaitMessageComponent<ButtonInteraction>({
			time: 15000, filter: int => int.user.id === ctx.author.id
		}).catch(() => {});

		let components = [new MessageActionRow({ 
			components: [...msg.components.flatMap(row => {
				return row.components.filter(comp => comp.type === 'BUTTON')
			}).map(btn => btn.setDisabled(true))]
		})];

		if (!choice) {
			return msg.edit({ components, content: 'You should click/tap a button smh.' });
		}

		components = [new MessageActionRow({ 
			components: [...msg.components.flatMap(row => {
				return row.components.filter(comp => comp.type === 'BUTTON') as MessageButton[]
			}).map(btn => 
				btn.customId === choice.customId 
					? btn.setStyle('SUCCESS')
					: btn.setDisabled(true)
			)]
		})];

		const karma = ctx.client.util.randomNumber(-1e3, 1e4);
		const won = ctx.client.util.randomNumber(1, 10) * karma;
		if (karma < 0) {
			await entry.subItem(this.id).save(false);
			return choice.update({ components, content: `**You broke your ${this.id} LMAO!**\n\nBecause you got **${karma.toLocaleString()} karmas** yikes that's bad` });
		}

		await entry.addPocket(won).save();
		return choice.update({ components, content: `**Congratulations! Your meme got at least one upvote.**\n\nYou got **${won.toLocaleString()} coins** from posting a ${choice.customId} meme on reddit!` });
	}
}