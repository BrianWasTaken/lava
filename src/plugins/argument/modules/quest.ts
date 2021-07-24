import { Argument, Context, Quest } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Argument {
	constructor() {
		super('quest', {
			category: 'Currency',
			name: 'Quest',
		});
	}

	exec(ctx: Message, args: string): Quest {
		if (!args || args.length <= 2) return null;
		const { modules } = ctx.client.handlers.quest;
		const mod = modules.get(args.toLowerCase());

		let found: Quest;
		found = modules.find(mod => {
			return mod.id.toLowerCase().includes(args.toLowerCase())
			|| mod.name.toLowerCase().includes(args.toLowerCase());
		});

		return mod || found || null;
	}
}