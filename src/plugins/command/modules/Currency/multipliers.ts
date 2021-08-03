import { AbstractPaginator, PaginatorControlId, PaginatorControl, Command, Currency, Colors } from 'lava/index';
import { Message, MessageButton, MessageActionRow } from 'discord.js';

export default class extends Command {
	constructor() {
		super('multipliers', {
			aliases: ['multipliers', 'multi'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View your secret multipliers for gambling.',
			name: 'Multiplier',
			args: [
				{
					id: 'page',
					type: 'number',
					default: 1
				}
			]
		});
	}

	async exec(ctx: Message, { page }: { page: number }) {
		const multis = await ctx.author.currency.fetch().then(d => d.calcMulti(ctx));
		const pages = ctx.client.util.paginateArray(
			multis.unlocked.map(({ name, value }) => `${name} (\`${value < 1 ? `${value}` : `+${value}`}%\`)`
		));

		if (!pages[page - 1]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		const controls: PaginatorControl[] = [
			{ customId: PaginatorControlId.FIRST, label: 'First', style: 'PRIMARY' },
			{ customId: PaginatorControlId.PREVIOUS, label: 'Previous', style: 'PRIMARY' },
			{ customId: PaginatorControlId.STOP, label: 'Stop', style: 'DANGER' },
			{ customId: PaginatorControlId.FIRST, label: 'Next', style: 'PRIMARY' },
			{ customId: PaginatorControlId.FIRST, label: 'Last', style: 'PRIMARY' },
		]

		const msg = await ctx.channel.send({ 
			components: [new MessageActionRow({
				components: [...controls.map(c => new MessageButton(c))]
			})],
			embeds: [{
				author: { name: `${ctx.author.username}'s Multipliers`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
				footer: { text: `${multis.unlocked.length}/${multis.all.length} Active — Page ${page} of ${pages.length}` },
				color: Colors.BLURPLE, fields: [{
					name: `Total Multi: ${multis.unlocked.reduce((p, c) => p + c.value, 0)}% (max of ${Currency.MAX_MULTI}%)`,
					value: pages[page - 1].join('\n')
				}],
			}]
		});

		const paginator = new AbstractPaginator({
			message: msg,
			time: 10000,
			pages: pages.map((currPage, index, arr) => ({
				embeds: [{
					author: {
						name: `${ctx.author.username}'s Multipliers`,
						iconURL: ctx.author.avatarURL({ dynamic: true })
					},
					color: Colors.BLURPLE,
					fields: [{
						name: `Total Multi: ${multis.unlocked.reduce((p, c) => p + c.value, 0)}% (max of ${Currency.MAX_MULTI}%)`,
						value: currPage.join('\n')
					}],
					footer: {
						text: `${multis.unlocked.length}/${multis.all.length} Active — Page ${index + 1} of ${arr.length}`
					}
				}]
			})),
			controls
		});

		return false;
	}
}