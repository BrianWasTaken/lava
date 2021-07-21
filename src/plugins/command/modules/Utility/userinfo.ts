import { Command, Context, GuildMemberPlus } from 'lava/index';

export default class extends Command {
	constructor() {
		super('userinfo', {
			aliases: ['userinfo', 'ui'],
			description: 'View basic info to someone in the server',
			name: 'About',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (c: Context) => c.member
				}
			]
		});
	}

	async exec(ctx: Context, { member }: { member: GuildMemberPlus }) {
		const { user, joinedAt, nickname } = member;
		const { createdAt } = user;
		const data = await ctx.lava.fetch(user.id);
		const created = new Date(createdAt);
		const joined = new Date(joinedAt);

		return ctx.channel.send({ embeds: [{
			title: `${user.tag} — ${user.id}`,
			thumbnail: { url: user.avatarURL({
				dynamic: true
			}) }, color: ctx.client.util.randomColor(),
			fields: [
				{ name: 'Created at', value: created.toDateString(), inline: true },
				{ name: 'Joined at', value: joined.toDateString(), inline: true },
				{ name: 'Commands Ran', value: data.data.commands.commands_ran.toLocaleString(), inline: true },
				{ name: 'Avatar URL', value: `[Click Here](${user.avatarURL({ dynamic: true })})`, inline: true },
				{ name: 'Nickname', value: nickname ?? 'No Nickname here', inline: true },
				{ name: 'Last Command ran', value: data.data.commands.last_cmd, inline: true }
			]
		}]}).then(() => false);
	}
} 