import { 
	Message, 
	GuildMember, 
	ButtonInteraction,
	MessageActionRow,
	MessageButton,
	MessageButtonOptions
} from 'discord.js';
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

		const buttons: MessageButton[] = ['Blacklist', 'Cancel']
			.map(label => new MessageButton({ 
				label, customId: label.toLowerCase(), style: 'PRIMARY' 
			}));

		const msg = await ctx.channel.send({
			components: [new MessageActionRow().addComponents(...buttons)],
			content: `are you sure?`,
		});
		const choice = await msg.awaitMessageComponent<ButtonInteraction>({
			time: 10000, filter: int => int.user.id === ctx.author.id
		}).catch(() => {});

		const components = [new MessageActionRow({ 
			components: [...msg.components.flatMap(row => {
				return row.components.filter(comp => comp.type === 'BUTTON')
			}).map(btn => btn.setDisabled(true))]
		})];

		if (!choice) {
			return await msg.edit({ components, content: 'breh, u should press one of those buttons, you\'re timed out.' }).then(() => false);
		}
		if (choice.customId === 'cancel') {
			return await choice.update({ components, content: 'ok weirdo', }).then(() => false);
		}
		const lava = await some1.user.lava.fetch();
		if (lava.cache.punishments.expire > Date.now()) {
			return await choice.update({ components, content: 'they\'re already blacklisted lol' }).then(() => false);
		}

		await lava.blacklist(1000 * 60).save();
		return await choice.update({ components, content: `done.` }).then(() => false);
	}
}