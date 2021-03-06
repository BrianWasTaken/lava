import { ButtonPaginator, ButtonPaginatorControl, ButtonControls, Command, Inventory, Colors } from 'lava/index';
import { Message, GuildMember, MessageButton, MessageActionRow, MessageOptions } from 'discord.js';
import { Argument } from 'discord-akairo';

interface InventoryArgs {
	member: GuildMember | number;
	page: number;
}

export default class extends Command {
	constructor() {
		super('inventory', {
			aliases: ['inventory', 'items', 'inv'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View all items you own.',
			name: 'Inventory',
			args: [
				{
					id: 'member',
					default: 1,
					type: Argument.union('number', 'memberMention')
				},
				{
					id: 'page',
					type: 'number',
					default: 1
				}
			]
		});
	}

	resolveArgs(ctx: Message, args: InventoryArgs) {
		const isMemberNumber = typeof args.member === 'number';
		return <{ member: GuildMember, page: number }>{
			member: isMemberNumber ? ctx.member : (args.member ?? ctx.member),
			page: isMemberNumber ? args.member : (args.page ?? 1)
		}
	}

	async exec(ctx: Message, args: InventoryArgs) {
		const { member, page } = this.resolveArgs(ctx, args);
		const isContext = ctx.author.id === member.user.id;

		const entry = await member.user.currency.fetch();
		const inventory = ctx.client.util.paginateArray(this.mapItems(entry.props.items));

		if (inventory.length < 1) {
			return ctx.reply(`${isContext ? 'You' : 'They'} don't have any items on ${isContext ? 'your' : 'their'} inventory!`).then(() => false);
		}
		if (page > inventory.length) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		const controls: ButtonPaginatorControl[] = [
			{ customId: ButtonControls.FIRST, label: 'First', style: 'PRIMARY' },
			{ customId: ButtonControls.PREVIOUS, label: 'Previous', style: 'PRIMARY' },
			{ customId: ButtonControls.STOP, label: 'Stop', style: 'DANGER' },
			{ customId: ButtonControls.NEXT, label: 'Next', style: 'PRIMARY' },
			{ customId: ButtonControls.LAST, label: 'Last', style: 'PRIMARY' },
		];

		const pages: MessageOptions[] = inventory.map((currPage, index, array) => ({
			embeds: [{
				color: Colors.BLURPLE,
				author: {
					name: `${member.user.username}'s inventory`,
					icon_url: member.user.avatarURL({ dynamic: true })
				},
				fields: [
					{
						name: 'Owned Items',
						value: currPage.join('\n\n')
					}
				],
				footer: {
					text: `Owned Items ??? Page ${index + 1} of ${array.length}`
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
			time: 60000,
			user: ctx.author,
			focus: page - 1,
		});

		return false;
	}

	mapItems(items: CollectionPlus<Inventory>) {
		return [...items.values()]
			.filter(inv => inv.isOwned())
			.filter(inv => inv.module.inventory)
			.map(inv => inv.id).sort()
			.map(inv => items.get(inv))
			.map(inv => ({
				mod: inv.module,
				owned: inv.owned,
				level: inv.level,
				inv: inv
			}))
			.map(({ mod, owned, level, inv }) => {
				const { category, id, upgrades } = mod;
				const { emoji, name } = mod.getUpgrade(items.get(mod.id));
				const state = inv.isMaxLevel() ? '`MAX LEVEL`' : `${upgrades.length - 1 - level} more`;
				return `**${emoji} ${name}** ??? ${owned.toLocaleString()}\n*ID* \`${id}\` ??? ${category.id}\n*LVL* \`${level}\` ??? ${state}`
			});
	}
}