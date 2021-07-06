import { Command, Context, Item } from 'lava/index';

export default class extends Command {
	constructor() {
		super('upgrade', {
			aliases: ['upgrade', 'upg'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 1,
			description: 'Upgrade an item!',
			name: 'Upgrade',
			args: [
				{
					id: 'item',
					type: 'item',
				}
			]
		});
	}

	async exec(ctx: Context, { item }: { item: Item }) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		if (!item) return ctx.reply('You need to upgrade something!').then(() => false);

		const inv = entry.props.items.get(item.id);
		const isMax = inv.isMaxLevel();
		const { upgrade, icon, premium } = inv.upgrade;
		const e = premium ? 'keys' : 'coins';

		if (inv.upgrade.upgrade > (item.premium ? entry.props.prem : entry.props.pocket)) {
			return ctx.reply(`You need **${icon} ${upgrade.toLocaleString()} ${e}** to upgrade this item!`).then(() => false);
		}
		if (isMax) {
			return ctx.reply(`Your **${inv.upgrade.emoji} ${inv.upgrade.name}** is already at max level!`).then(() => false);
		}

		await ctx.channel.send({ embed: { color: 'ORANGE', description: `Are you sure you wanna upgrade your **${item.emoji} ${item.name}** to **Level ${inv.level + 1}** for **${upgrade.toLocaleString()} ${e}** right now?` }});
		const choice = await ctx.awaitMessage();
		if (!choice || !choice.content) {
			return ctx.reply({ embed: { color: 'RED', description: 'Imagine not answering to me lmfaooo' }}).then(() => false);
		}
		if (choice.content.toLowerCase().slice(0, 1) === 'n') {
			return ctx.reply({ embed: { color: 'INDIGO', description: 'ok then.' }}).then(() => false);
		}

		const newInv = await entry.removePocket(inv.upgrade.upgrade).upgradeItem(item.id).save().then(e => e.props.items.get(item.id));
		return ctx.reply({ embed: {
			color: 'GREEN', author: { 
				name: `${inv.upgrade.name} finally reached ${
					isMax ? 'max level' : `level ${newInv.level}`
				}!`,
				iconURL: ctx.author.avatarURL({ 
					dynamic: true 
				})
			},
		}}).then(() => true);
	}
}