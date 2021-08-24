import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '#core/index';

@ApplyOptions<CommandOptions>({
	aliases: ['pong'],
	description: 'views shard latency',
	name: 'ping',
	runIn: ['GUILD_TEXT', 'DM'],
	cooldownDelay: 10000,
	cooldownLimit: 3,
	flags: ['msg'],
})
export default class extends Command {
	public async run(msg: Message, args: Args) {
		if (args.getFlags('msg')) {
			return await msg.channel.send(`**:ping_pong: | Message Pong: \`${Date.now() - msg.createdTimestamp}ms\``);
		}

		const { ping } = msg.guild?.shard ?? msg.client.ws;
		return await msg.reply(`**:ping_pong: | Client Pong:** \`${ping}ms\``);
	}

	public onLoad() {
		this.container.logger.info(`[COMMAND]`, `Loaded ${this.name} command.`);
	}
}