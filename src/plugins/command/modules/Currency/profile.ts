import { Command, Context, GuildMemberPlus, Currency, Colors } from 'lava/index';
const { MAX_LEVEL, XP_COST } = Currency;

interface ProfileArgs {
	member: GuildMemberPlus;
	gamble: boolean;
	active: boolean;
}

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
		super('profile', {
			aliases: ['profile', 'level'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View your currency profile!',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (c: Context) => c.member
				},
				{
					id: 'gamble',
					match: 'flag',
					flag: ['--gamble', '-g'],
					default: null
				},
				{
					id: 'active',
					match: 'flag',
					flag: ['--active', '-a'],
					default: null
				}
			]
		});
	}

	xp(xp: number): { next: number, barable: number, bar: string; } {
		const next = Math.min((Math.trunc(xp / XP_COST) + 1) * XP_COST, MAX_LEVEL * XP_COST);
		const barable = Math.round((XP_COST - (next - xp)) / (XP_COST / 10));
		return { next, barable, bar: this.client.util.progressBar(barable) };
	}

	level(xp: number, level: number): { next: number, barable: number, bar: string; } {
		const next = Math.min(level + 1, MAX_LEVEL);
		const barable = Math.round((XP_COST - ((next * XP_COST) - xp)) / (XP_COST / 10));
		return { next, barable, bar: this.client.util.progressBar(barable) };
	}

	async exec(ctx: Context, { member, gamble, active }: ProfileArgs) {
		const { progressBar } = ctx.client.util;

		const entry = await ctx.currency.fetch(member.user.id);

		if (gamble) {
			const loses = entry.props.gambles.reduce((a, c) => a + c.loses, 0);
			const wins = entry.props.gambles.reduce((a, c) => a + c.wins, 0);
			const won = entry.props.gambles.reduce((a, c) => a + c.won, 0);
			const lost = entry.props.gambles.reduce((a, c) => a + c.lost, 0);

			return ctx.channel.send({ embeds: [{
				author: { name: `${member.user.username}'s gambling stats` },
				color: Colors.GREEN, fields: [...entry.props.gambles.map(g => ({
					inline: true, name: `${g.id.toUpperCase()} (${(g.wins + g.loses).toLocaleString()})`,
					value: [
						`Won: ${g.won.toLocaleString()}`,
						`Lost: ${g.lost.toLocaleString()}`,
						`Net: ${(g.won - g.lost).toLocaleString()}`,
						`Win: ${Math.round(100 * (g.wins / (g.wins + g.loses))).toLocaleString()}%`,
					].join('\n')
				})), {
					inline: true, name: `TOTAL (${(loses + wins).toLocaleString()})`,
					value: [
						`Won: ${won.toLocaleString()}`,
						`Lost: ${lost.toLocaleString()}`,
						`Net: ${(won - lost).toLocaleString()}`,
						`Win: ${Math.round(100 * (wins / (wins + loses))).toLocaleString()}%`,
					].join('\n')
				}]
			}]}).then(() => false);
		}

		if (active) {
			const actives = entry.actives.map(active => {
				const { emoji, name } = active.item.upgrade;
				const expireMS = active.item.expiration - Date.now();
				const time = ctx.client.util.parseTime(Math.round(expireMS / 1e3), true);
				return `**${emoji} ${name}** expires in ${time}`;
			});

			return ctx.channel.send({ embeds: [{
				title: `${member.user.username}'s active items`,
				color: Colors.BLUE, description: actives.length > 0 ? actives.join('\n') : `No active items.`
			}]}).then(() => false);
		}

		const exp = entry.props.xp;
		const level = Math.trunc(exp / XP_COST);
		const levels = this.level(exp, level);
		const xps = this.xp(exp);

		const levelBar = `[${levels.bar}](https://discord.gg/invite/memer)`;
		const xpBar = `[${xps.bar}](https://discord.gg/invite/memer)`;

		const prestige = entry.props.prestige.level;

		return ctx.channel.send({ embeds: [{
			author: { 
				name: `${member.user.username}'s profile`, 
				iconURL: member.user.avatarURL({ dynamic: true }) 
			}, 
			description: [
				prestige > 0 ? `**${emojis[prestige - 1] ?? emojis[emojis.length - 1]} Prestige ${ctx.client.util.romanize(prestige)}**` : ''
			].join('\n'),
			color: Colors.BLURPLE, fields: [
				{
					name: 'Level',
					inline: true,
					value: `**\`${level.toLocaleString()}\`**\n${levelBar}`,
				},
				{
					name: 'Experience',
					inline: true,
					value: `**\`${exp.toLocaleString()}/${xps.next.toLocaleString()}\`**\n${xpBar}`
				},
				{
					name: 'Coins',
					inline: true,
					value: [
						`**Wallet:** ${entry.props.pocket.toLocaleString()}`,
						`**Bank:** ${entry.props.vault.amount.toLocaleString()}`,
						`**Multi:** ${entry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0)}%`
					].join('\n')
				},
				{
					name: 'Inventory',
					inline: true,
					value: `\`${entry.props.items.filter(i => i.isOwned()).size}\` items (${
						entry.props.items.reduce((p, i) => i.owned + p, 0).toLocaleString()
					} total) worth \`${
						entry.props.items.reduce((p, i) => p + (i.owned * i.upgrade.price), 0).toLocaleString()
					}\` coins`,
				}
			]
		}]}).then(() => false);
	}
}