import { Command, Context, Currency } from 'lava/index';
import { Message } from 'discord.js';

const { PRESTIGE_POCKET_REQ, PRESTIGE_LEVEL_REQ, XP_COST, PRESTIGE_LEVEL_REQ_CAP } = Currency;

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
		super('prestige', {
			aliases: ['prestige'],
			cooldown: 1000 * 60,
			description: 'Upgrade your progress!',
			name: 'Prestige',
		});
	}

	async exec(ctx: Message) {
		const entry = await ctx.author.currency.fetch();
		const prestige = entry.props.prestige.level;
		const { romanize } = ctx.client.util;
		const { pocket, xp } = entry.props;

		const getPrestigeLevel = () => Math.min(PRESTIGE_LEVEL_REQ_CAP - 1, prestige);
		const next = {
			prestige: getPrestigeLevel() + 1,
			pocket: (getPrestigeLevel() + 1) * PRESTIGE_POCKET_REQ,
			level: (getPrestigeLevel() + 1) * PRESTIGE_LEVEL_REQ,
		};
		const current = {
			pocket: Number((pocket / next.pocket * 100).toFixed(1)),
			level: Number(((xp / XP_COST) / next.level * 100).toFixed(1))
		};

		if (!Object.values(current).every(c => c >= 100)) {
			return ctx.reply({ embeds: [{
				author: { name: `Prestige ${next.prestige} Requirements for ${ctx.author.username}` },
				color: ctx.client.util.randomColor(), description: [
					`**Pocket Amount**: \`${pocket.toLocaleString()}/${next.pocket.toLocaleString()}\` \`(${current.pocket}%)\``,
					`**Levels Required**: \`${Math.trunc(xp / XP_COST).toLocaleString()}/${next.level.toLocaleString()}\` \`(${current.level}%)\``,
				].join('\n'), footer: { text: 'Imagine thinking you can prestige already' }
			}]}).then(() => false);
		}

		const tries = { tries: 0, max: 1 };
		const ask = async (question: string): Promise<string | boolean | Function> => {
			const res =  await ctx.channel.send(question).then(() => ctx.awaitMessage());
			if (!res || !res.content) return 'Hey next time don\'t waste my time kay?';
			switch(res.content.toLowerCase().slice(0, 1)) {
				case 'y':
					if (tries.tries >= tries.max) return true;
					tries.tries++;
					return ask(`Are you really sure?`);
				case 'n':
				default:
					return 'Ok weirdo';
			}
		} 

		const nice = await ask(`Do you wanna prestige to **${emojis[next.prestige - 1] ?? emojis[emojis.length - 1]} Prestige ${romanize(next.prestige)}** right now?`);
		if (typeof nice === 'string') return ctx.reply(nice).then(() => false);

		const items: [string, number][] = [['card', next.prestige * 1000], ['bacon', 50], ['statue', 1]];
		const got = items.map(i => ({ item: entry.props.items.get(i[0]).upgrade, amount: i[1]}));
		const owo = await entry.prestige(next.prestige)
			.setItems(items.map(([id, amount]) => ({ id, amount })))
			.setSpace(0).setPocket(0).setVault(0).setLevel(0)
			.save().then(p => p.props.prestige.level);

		return ctx.channel.send([
			`**${emojis[owo - 1] ?? emojis[emojis.length - 1]} Congratulations ${ctx.author.username}!**`,
			`You're now **Prestige ${romanize(owo)}** congratulations! Enjoy further grinding as you go up to your journey. You got the following items:\n`,
			got.map(({ item, amount }) => `**${amount} ${item.emoji} ${item.name}**`).join('\n')
		].join('\n')).then(() => true);
	}
}