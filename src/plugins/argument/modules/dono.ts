import { Argument, Donation } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Argument {
	constructor() {
		super('dono', {
			category: 'Donation',
			name: 'Donation',
		});
	}

	exec(ctx: Message, args: string): Donation {
		if (!args || args.length <= 2) return null;
		const { modules } = ctx.client.handlers.donation;
		const mod = modules.get(args.toLowerCase());

		let found: Donation;
		found = modules.find(mod => {
			return mod.id.toLowerCase().includes(args.toLowerCase())
			|| mod.name.toLowerCase().includes(args.toLowerCase());
		});

		return mod || found || null;
	}
}