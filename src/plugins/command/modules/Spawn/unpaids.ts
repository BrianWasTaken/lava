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

	async exec(ctx: Context<{ member: GuildMemberPlus }>): Promise<MessageOptions> {
		const entry = await ctx.spawn.fetch(ctx.args.member.user.id);
		const balance = {
			'Remaining Unpaids': entry.props.unpaids.toLocaleString(),
			'Events Joined': entry.props.joined.toLocaleString(),
		};

		return { 
			embed: {
				author: { 
					name: `Spawn Balance — ${ctx.args.member.user.username}`, 
					iconURL: ctx.args.member.user.avatarURL({ dynamic: true }) 
				},
				color: ctx.client.util.randomColor(),
				description: Object.entries(balance).map(([f, v]) => `**${f}:** ${v}`).join('\n'),
				footer: {
					text: ctx.client.user.username,
					icon_url: ctx.client.user.avatarURL()
				}
			}
		};
	};
}