import { Command, Context, GuildMemberPlus } from 'lava/index';

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
				}
				{
					id: 'member',
					type: 'member',
					default: (c: Context) => c.member,
				},
			]
		});
	}

	async exec(ctx: Context, { member, page }: { member: GuildMemberPlus, page: number; }) {
		const entry = await ctx.crib.fetch(member.user.id);
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

		return ctx.channel.send({ embed: {
			author: {
				name: `${member.user.username}'s donations`,
				iconURL: member.user.avatarURL({ dynamic: true })
			},
			color: 'BLUE',
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
		}}).then(() => false);
	}
}