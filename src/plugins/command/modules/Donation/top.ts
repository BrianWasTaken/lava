import { Command, Donation, CribEntry, Colors } from 'lava/index';
import { Snowflake, Message } from 'discord.js';

export default class extends Command {
	constructor() {
		super('donoTop', {
			aliases: ['donoTop', 'd='], 
			clientPermissions: ['EMBED_LINKS'],
			name: 'Donation Top',
			staffOnly: true,
			args: [
				{
					id: 'event',
					type: 'dono',
					default: (c: Message) => c.client.handlers.donation.modules.get('default'),
				},
				{
					id: 'page',
					type: 'number',
					default: 1,
				}
			]
		});
	}

	async exec(ctx: Message, { event, page }: { event: Donation, page: number; }) {
		const docs = await ctx.client.db.crib.model.find({}).exec().then(d => d.map(e => new CribEntry(null, ctx.client.db.crib, e)));
		const pages = ctx.client.util.paginateArray(docs.filter(d => {
			return ctx.guild.members.cache.has(d.cache._id);
		}).filter(d => d.donos.get(event.id).amount > 0).sort((a, b) => {
			const x = a.donos.get(event.id);
			const y = b.donos.get(event.id);
			return y.amount - x.amount;
		}).map((d, i) => {
			const user = ctx.guild.members.cache.get(d.cache._id);
			const emoji = Array(3).fill('moneybag')[i] ?? 'small_red_triangle';
			const dono = d.donos.get(event.id);
			return `**:${emoji}: ${dono.amount.toLocaleString()}** - ${user.user.tag ?? 'Unknown User'}`;
		}), 10);

		if (!pages[page - 1]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		return ctx.channel.send({ embeds: [{
			author: {
				name: `${event.name} Donations`,
				iconURL: ctx.guild.iconURL({ dynamic: true })
			},
			color: Colors.BLUE,
			description: pages[page - 1].join('\n'),
		}]}).then(() => false);
	}
}