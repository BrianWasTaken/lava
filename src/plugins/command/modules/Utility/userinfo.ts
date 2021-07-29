import { Message, GuildMember } from 'discord.js';
import { Command } from 'lava/index';

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
					default: (c: Message) => c.member
				}
			]
		});
	}

	async exec(ctx: Message, { member }: { member: GuildMember }) {
		const { user, joinedAt, nickname } = member;
		const { createdAt } = user;
		const data = await member.user.lava.fetch();
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
				{ name: 'Commands Ran', value: data.cache.commands.commands_ran.toLocaleString(), inline: true },
				{ name: 'Avatar URL', value: `[Click Here](${user.avatarURL({ dynamic: true })})`, inline: true },
				{ name: 'Nickname', value: nickname ?? 'No Nickname here', inline: true },
				{ name: 'Last Command ran', value: data.cache.commands.last_cmd, inline: true }
			]
		}]}).then(() => false);
	}
} 