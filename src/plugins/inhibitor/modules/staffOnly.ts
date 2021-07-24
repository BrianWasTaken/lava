import { Inhibitor, Command } from 'lava/index';
import { Message } from 'discord.js'

export default class extends Inhibitor {
	constructor() {
		super('staffOnly', {
			name: 'Staff Only',
			priority: 2,
			reason: 'staff',
			type: 'post',
		});
	}

	exec(ctx: Message, cmd: Command): boolean {
		if (ctx.channel.type !== 'dm') {
			return !ctx.member.roles.cache.has('692941106475958363') && cmd.staffOnly;
		}

		return false;
	}
}