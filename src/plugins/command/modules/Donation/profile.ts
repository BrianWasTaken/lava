import { Command, Context, GuildMemberPlus, Colors } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('donoProfile', {
			aliases: ['donoProfile', 'dprofile'], 
			clientPermissions: ['EMBED_LINKS'],
			name: 'Donation Profile',
			staffOnly: true,
			args: [
				{
					id: 'page',
					type: 'number',
					default: 1,
				},
				{
					id: 'member',
					type: 'member',
					default: (c: Message) => c.member,
				},
			]
		});
	}

	async exec(ctx: Message, { member, page }: { member: GuildMemberPlus, page: number; }) {
		const entry = await member.user.crib.fetch();
		const pages = ctx.client.util.paginateArray(entry.donos.map(d => ({
			name: `${d.module.name} Donations`,
			value: [
				`Donations Recorded: **${d.records.length.toLocaleString()}**`,
				`Amount Donated: **${d.amount.toLocaleString()}**`,
				`Highest Donation: **${(d.records.sort((a, b) => b - a)[0] ?? 0).toLocaleString()}**`
			].join('\n')
		})), 1);

		if (!pages[page - 1]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		const recorded = entry.donos.reduce((p, c) => p + c.records.length, 0);
		const donated = entry.donos.reduce((p, c) => p + c.amount, 0);

		return ctx.channel.send({ embeds: [{
			author: {
				name: `${member.user.username}'s donations`,
				iconURL: member.user.avatarURL({ dynamic: true })
			},
			color: Colors.BLUE,
			fields: [
				{
					name: 'Total Donations',
					value: [
						`Donations Recorded: **${recorded.toLocaleString()}**`,
						`Amount Donated: **${donated.toLocaleString()}**`,
					].join('\n'),
				},
				...pages[page - 1]
			],
			footer: {
				text: `Page ${page} of ${pages.length}`
			}
		}]}).then(() => false);
	}
}