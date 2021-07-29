import { Listener, Command } from 'lava/index';
import { Message } from 'discord.js';

export default class extends Listener {
	constructor() {
		super('commandError', {
			category: 'Command',
			emitter: 'command',
			event: 'error',
			name: 'Command Error'
		});
	}

	exec(error: Error, ctx: Message, cmd: Command) {
		this.client.console.error('Command', error, true);
		ctx.reply('Something wrong occured :c');
	}
}