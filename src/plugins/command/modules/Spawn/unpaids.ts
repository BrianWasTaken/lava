import { Command, Context, GuildMemberPlus } from 'lava/index';
import { MessageOptions } from 'discord.js';

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
				default: (ctx: Context) => ctx.member
			}]
		});
	}

	async exec(ctx: Context, args: { member: GuildMemberPlus }) {
		const entry = await ctx.spawn.fetch(args.member.user.id);
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