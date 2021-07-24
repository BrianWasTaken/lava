import { Command, Context, Currency, Colors } from 'lava/index';

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

	async exec(ctx: Context, { page }: { page: number }) {
		const multis = await ctx.author.currency.fetch().then(d => d.calcMulti(ctx));
		const pages = ctx.client.util.paginateArray(
			multis.unlocked.map(({ name, value }) => `${name} (\`${value < 1 ? `${value}` : `+${value}`}%\`)`
		));

		if (!pages[page - 1]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		return ctx.channel.send({ embeds: [{
			author: { name: `${ctx.author.username}'s Multipliers`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
			footer: { text: `${multis.unlocked.length}/${multis.all.length} Active — Page ${page} of ${pages.length}` },
			color: Colors.BLURPLE, fields: [{
				name: `Total Multi: ${multis.unlocked.reduce((p, c) => p + c.value, 0)}% (max of ${Currency.MAX_MULTI}%)`,
				value: pages[page - 1].join('\n')
			}],
		}]}).then(() => false);
	}
}