import { Snowflake, GuildMember, Collection, Message } from 'discord.js';
import { Command, CurrencyEntry, Colors } from 'lava/index';

const emojis = [
	'<:prestigeI:733606604326436897>',
	'<:prestigeII:733606705287397407>',
	'<:prestigeIII:733606758727024702>',
	'<:prestigeIV:733606800665870356>',
	'<:prestigeV:733606838523920405>',
	'<:prestigeVI:733606963471974500>',
	'<:prestigeVII:733607038969577473>',
	'<:prestigeVIII:733608252562079784>',
	'<:prestigeIX:733607250584797214>',
	'<:prestigeX:733607342263894056>',
];

export default class extends Command {
	constructor() {
		super('rich', {
			aliases: ['rich'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View the top rich users of currency.',
			name: 'Rich',
		});
	}

	top(members: Collection<Snowflake, GuildMember>, amount = 10) {
		const docs = this.client.db.currency.model.find({ 'props.pocket': { $gte: 1 } }).sort({ 'props.pocket': 'desc' }).exec();
		return docs.then(docs => 
			docs.map(doc => new CurrencyEntry(null, this.client.db.currency, doc))
				.filter(doc => members.has(doc.cache._id))
				.slice(0, amount)
		);
	}

	async exec(ctx: Message) {		
		return ctx.channel.send({ embeds: [{
			author: { name: 'richest users in this server' },
			footer: { text: 'These are WALLETS, not net worths' },
			color: Colors.RED, description: await this.top(ctx.guild.members.cache)
				.then(docs => docs.map((doc, i) => {
					const user = ctx.client.users.cache.get(doc.cache._id)?.tag ?? 'LOL WHO DIS';
					const emoji = Array(3).fill('coin')[i] ?? 'small_red_triangle';
					const prestige = doc.props.prestige.level;
					const prestigeIcon = emojis[prestige - 1] ?? emojis[emojis.length - 1];
					return `**:${emoji}: ${doc.props.pocket.toLocaleString()}** - ${prestige >= 1 ? prestigeIcon : ''}${user}`;
				}).join('\n')),
		}]}).then(() => false);
	}
}