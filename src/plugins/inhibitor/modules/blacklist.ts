import { Inhibitor, Context, Command } from 'lava/index';

export default class extends Inhibitor {
	constructor() {
		super('blacklist', {
			name: 'Blacklist',
			priority: 1,
			reason: 'blacklist',
			type: 'pre',
		});
	}

	exec(ctx: Context, cmd: Command): Promise<boolean> {
		return ctx.lava.fetch(ctx.author.id).then(bot => bot.banned);
	}
}