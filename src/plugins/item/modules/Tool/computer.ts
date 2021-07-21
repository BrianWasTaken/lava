import { Context, CurrencyEntry } from 'lava/index';
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

	get options() {
		return <{ [type: string]: string }> {
			f: 'Funny',
			u: 'Unoriginal',
			c: 'Copyrighted',
			k: 'Karen'
		};
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const [k, v] = [Object.keys(this.options), Object.values(this.options)];
		const options = Array(k.length).fill(null).map((_, i) => `**\`${k[i]}\` ■ ${v[i]} Meme**`);
		await ctx.channel.send({
			content: `**__${ctx.author} What type of meme?__**\n${options.join('\n')}`, 
			allowedMentions: { users: [ctx.author.id] } 
		});

		const choice = await ctx.awaitMessage();
		if (!choice) {
			return ctx.reply(`imagine ignoring me smh`);
		}
		if (!this.options[choice.content.toLowerCase()]) {
			return ctx.reply(`bruh that's not even a meme`);
		}

		const karma = ctx.client.util.randomNumber(-5e3, 1e4);
		const won = karma * 10;

		if (karma < 1) {
			await entry.subItem(this.id).save(false);
			return ctx.reply(`Your meme got **${karma.toLocaleString()}** karmas so you broke your **${this.emoji} ${this.name}** lmao sucks to be you`);
		}

		await entry.addPocket(won).save();
		return ctx.reply(`You got **__${won.toLocaleString()} coins__** (${karma.toLocaleString()} karmas) from posting a ${this.options[choice.content.toLowerCase()].toLowerCase()} meme on reddit.`);
	}
}