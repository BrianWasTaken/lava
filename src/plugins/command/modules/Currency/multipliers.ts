import { PaginatorPage, ButtonPaginator, ButtonControls, ButtonPaginatorControl, Command, Currency, Colors } from 'lava/index';
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
		const map = ctx.client.util.paginateArray(
			multis.unlocked.map(({ name, value }) => `${name} (\`${value < 1 ? `${value}` : `+${value}`}%\`)`
		));

		if (!map[page - 1]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		const controls: ButtonPaginatorControl[] = [
			{ customId: ButtonControls.PREVIOUS, label: 'Previous', style: 'PRIMARY' },
			{ customId: ButtonControls.STOP, label: 'Stop', style: 'DANGER' },
			{ customId: ButtonControls.NEXT, label: 'Next', style: 'PRIMARY' },
		];

		const pages: PaginatorPage[] = map.map((currPage, index, arr) => ({
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
		}));

		const message = await ctx.channel.send({ 
			embeds: pages[page - 1].embeds,
			components: [new MessageActionRow({
				components: [...controls.map(c => new MessageButton(c))]
			})],
		});

		const paginator = new ButtonPaginator({
			pages,
			message,
			controls,
			user: ctx.author,
			time: 30000,
			focus: page - 1,
		});

		return false;
	}
}