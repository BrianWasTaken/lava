import { Listener, Context, Command } from 'lava/index';
import { Constants } from 'discord-akairo';
import { Message } from 'discord.js';

const { BuiltInReasons } = Constants;

export default class extends Listener {
	constructor() {
		super('commandBlocked', {
			category: 'Command',
			emitter: 'command',
			event: 'commandBlocked',
			name: 'Command Blocked'
		});
	}

	getReason(reason: string): string {
		switch(reason.toLowerCase()) {
			case BuiltInReasons.DM:
				return "Hey this command does not work here";
			case BuiltInReasons.GUILD: 
				return "Ur not allowed to use dis commands in discord servers";
			case BuiltInReasons.OWNER:
				return 'Only my "owners" can run dis';
			case 'blacklist':
				return "U can't use the bot, 2badfor2 you";
			case 'staff':
				return 'Only the "staffs" can run dis';
			default:
				return 'Breh idk what happened but u cant use this command';
		}
	}

	exec(ctx: Message, cmd: Command, reason: string) {
		return ctx.reply(this.getReason(reason));
	}
}