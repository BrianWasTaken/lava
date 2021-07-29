import { Message, MessageCollector, ReactionCollector, GuildMember, Snowflake, CollectorFilter, Collection, TextChannel } from 'discord.js';
import { AbstractHandler, AbstractHandlerOptions, LavaClient } from 'lava/akairo';
import { Spawner } from 'lava/index';
import { Spawn } from '.';

export class SpawnHandler extends AbstractHandler<Spawn> {
	/**
	 * Map of channel cooldowns.
	 */
	public cooldowns: CollectionPlus<CollectionPlus<Message>> = new Collection();
	/**
	 * Construct a spawn handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);

		/**
		 * Message Listener to spawn bullshit.
		 */
		client.once('ready', () => {
			client.on('message', (ctx: Message) => {
				const { randomInArray, randomNumber } = ctx.client.util;
				const spawn = randomInArray(this.modules.array());
				const odds = randomNumber(1, 100);

				if (ctx.author.bot || ctx.channel.type === 'DM') return;
				if (this.cooldowns.has(ctx.channel.id)) return;
				if (spawn.queue.has(ctx.channel.id)) return;
				if (odds < 100 - spawn.config.odds) return;

				this.handle(ctx, spawn);
			});
		});
	}

	/**
	 * Handle a spawn.
	 */
	handle(ctx: Message, spawn: Spawn): Spawn {
		const deleteCooldown = () => this.cooldowns.delete(ctx.channel.id);
		setTimeout(deleteCooldown, spawn.config.cooldown);

		switch(spawn.config.method) {
			case 'spam':
				return spawn;
			case 'message':
				return spawn;
			case 'react':
				return spawn;
			default:
				return spawn;
		}
	}
}