import { Message, GuildMember } from 'discord.js';
import { Command } from 'lava/akairo';

export default class extends Command {
	constructor() {
		super('blacklist', {
			aliases: ['blacklist', 'bl'],
			ownerOnly: true,
			description: 'Hey u know da meaning of dis',
			name: 'Blacklist',
			args: [
				{
					id: 'some1',
					type: 'member',
				}
			]
		});
	}

	async exec(ctx: Message, { some1 }: { some1: GuildMember }) {
		if (!some1) {
			return ctx.reply('smh, u need someone to bl.').then(() => false);
		}
		if (some1.user.id === ctx.author.id) {
			return ctx.reply('dont try and break ur own bot smfh').then(() => false);
		}

		const lava = await some1.user.lava.fetch();
		if (lava.blocked) {
			return ctx.reply('they\'re already blacklisted lol').then(() => false);
		}

		await lava.blacklist(1000 * 60).save();
		return ctx.reply(`done.`).then(() => false);
	}
}