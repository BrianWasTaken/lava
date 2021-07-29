import { MessageEmbedOptions, Message, GuildMember } from 'discord.js';
import { Command, Currency } from 'lava/index';

export default class extends Command {
	constructor() {
		super('balance', {
			aliases: ['balance', 'bal'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Check yours or someone elses balance.',
			name: 'Balance',
			args: [{
				id: 'member',
				type: 'member',
				default: (c: Message) => c.member,
				description: 'The user you who you wanna check the balance.',
			}]
		});
	}

	async exec(ctx: Message, args: { member: GuildMember }) {
		const entry = await args.member.user.currency.fetch();

		return ctx.channel.send({
			embeds: [{
				title: `${args.member.user.username}'s balance`,
				color: ctx.client.util.randomColor(),
				description: Object.entries({
					'Wallet': entry.props.pocket.toLocaleString(),
					'Bank': `${entry.props.vault.amount.toLocaleString()}${args.member.user.id === ctx.author.id
							? `/${entry.props.space.toLocaleString()}`
							: ''
						}`,
					'Items': `${entry.props.items.filter(i => i.owned > 0).size.toLocaleString()}/${this.client.handlers.item.modules.size.toLocaleString()
						}`
				})
					.map(([label, val]) => `**${label}:** ${val}`)
					.join('\n'),
			}]
		}).then(() => false);
	}
}