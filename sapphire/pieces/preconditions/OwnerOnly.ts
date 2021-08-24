import { Precondition, Command, PreconditionResult } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class OwnerOnlyPrecondition extends Precondition {
	public async run(message: Message, command: Command) {
		const app = await message.client.application!.fetch();
		return app.owner?.id !== message.author.id ? this.ok() : this.error({ 
			identifier: 'OwnerOnly',
			message: 'Only my "owner" can run this', 
		});
	}
}