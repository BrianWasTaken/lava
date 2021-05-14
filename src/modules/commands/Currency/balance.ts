import { GuildMember, MessageOptions } from 'discord.js';
import { Context, ContextDatabase } from 'lib/extensions';
import { MemberPlus, UserPlus } from 'lib/extensions';
import { Command, Item } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('balance', {
			name: 'Balance',
			aliases: ['balance', 'bal'],
			channel: 'guild',
			description: "Check yours or someone else's lava balance.",
			category: 'Currency',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (m: Context) => m.member,
				},
			],
		});
	}

	async exec(ctx: Context<{ member: MemberPlus }>, entry: ContextDatabase): Promise<MessageOptions> {
		const { id } = ctx.args.member.user;
		const isContext = id === ctx.author.id;
		const userEntry = isContext ? entry : await ctx.db.fetch(id),
			{ pocket, vault, space, items, prem } = userEntry.data,
			{ modules } = ctx.client.handlers.item;

		// Functions
		const filter = (i: Currency.InventorySlot) => i.amount >= 1;
		const reduce = (a: number, b: number) => a + b;
		const map = (i: Currency.InventorySlot) => {
			const it = modules.get(i.id);
			return it.cost * i.amount;
		};

		// Display
		const inv = items.filter(filter).map(map).reduce(reduce, 0);
		const show = isContext ? `/${space.toLocaleString()}` : '';
		const info = {
			Pocket: pocket.toLocaleString(),
			Vault: `${vault.toLocaleString()}${show}`,
			Inventory: inv.toLocaleString(),
			'Net Worth': (pocket + vault + inv).toLocaleString(),
		};

		return {
			embed: {
				title: `:key: Keys — ${prem.toLocaleString()}`, footer: { text: ctx.guild.name, icon_url: ctx.guild.iconURL({ dynamic: true }) }, color: 'RANDOM',
				author: { name: `${ctx.args.member.user.username}'s balance`, icon_url: ctx.args.member.user.avatarURL({ dynamic: true }) },
				description: Object.entries(info).map(([k, v]) => `**${k}:** ${v}`).join('\n'),
			}
		};
	}
}