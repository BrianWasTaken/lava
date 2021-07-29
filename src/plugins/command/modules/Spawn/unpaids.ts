import { MessageOptions, Message, GuildMember } from 'discord.js';
import { Command } from 'lava/index';

export default class extends Command {
	constructor() {
		super('unpaids', {
			aliases: ['unpaids'],
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			name: 'Unpaids',
			args: [{
				id: 'member',
				type: 'member',
				default: (ctx: Message) => ctx.member
			}]
		});
	}

	async exec(ctx: Message, args: { member: GuildMember }) {
		const entry = await args.member.user.spawn.fetch();
		const balance = {
			'Remaining Unpaids': entry.props.unpaids.toLocaleString(),
			'Events Joined': entry.props.joined.toLocaleString(),
		};

		return ctx.channel.send({ 
			embeds: [{
				author: { 
					name: `Spawn Balance — ${args.member.user.username}`, 
					iconURL: args.member.user.avatarURL({ dynamic: true }) 
				},
				color: ctx.client.util.randomColor(),
				description: Object.entries(balance).map(([f, v]) => `**${f}:** ${v}`).join('\n'),
				footer: {
					text: ctx.client.user.username,
					icon_url: ctx.client.user.avatarURL()
				}
			}]
		}).then(() => false);
	};
}