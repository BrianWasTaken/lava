import { Argument, Context, Item } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Argument {
	constructor() {
		super('item', {
			category: 'Currency',
			name: 'Item',
		});
	}

	exec(ctx: Message, args: string): Item {
		if (!args || args.length <= 2) return null;
		const { modules } = ctx.client.handlers.item;
		const mod = modules.get(args.toLowerCase());

		let found: Item;
		found = modules.find(mod => {
			return mod.id.toLowerCase().includes(args.toLowerCase())
			|| mod.name.toLowerCase().includes(args.toLowerCase());
		});

		return mod || found || null;
	}
}