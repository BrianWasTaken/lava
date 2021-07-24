import { Message, MessageCollector, ReactionCollector, CollectorFilter, Collection, TextChannel } from 'discord.js';
import { AbstractHandler, AbstractHandlerOptions, LavaClient } from 'lava/akairo';
import { Context, GuildMemberPlus, Spawner } from 'lava/index';
import { Spawn } from '.';

export class SpawnHandler extends AbstractHandler<Spawn> {
	/**
	 * Map of channel cooldowns.
	 */
	public cooldowns: CollectionPlus<CollectionPlus<Context>> = new Collection();
	/**
	 * Construct a spawn handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);

		/**
		 * Message Listener to spawn bullshit.
		 */
		this.client.once('ready', () => {
			this.client.on('message', ((ctx: Context) => {
				const { randomInArray, randomNumber } = ctx.client.util;
				const spawn = randomInArray(this.modules.array());
				const odds = randomNumber(1, 100);

				if (ctx.author.bot || ctx.channel.type !== 'dm') return;
				if (this.cooldowns.has(ctx.channel.id)) return;
				if (spawn.queue.has(ctx.channel.id)) return;
				if (odds < 100 - spawn.config.odds) return;

				this.handle(ctx, spawn);
			}) as (m: Message) => PromiseUnion<void>);
		});
	}

	/**
	 * Handle a spawn.
	 */
	handle(ctx: Context, spawn: Spawn): Spawn {
		const deleteCooldown = () => this.cooldowns.delete(ctx.channel.id);
		this.client.setTimeout(deleteCooldown, spawn.config.cooldown);
		const channelQueue = spawn.queue.get(ctx.channel.id) ?? spawn.queue.set(ctx.channel.id, new Collection<string, GuildMemberPlus>()).get(ctx.channel.id);

		switch(spawn.config.method) {
			case 'spam':
			case 'message':
				const string = this.client.util.randomInArray(spawn.display.strings);
				const filter: CollectorFilter<[Context]> = async m => {
					// Check if they don't hit the cap
					return (await m.author.spawn.fetch()).props.unpaids <= Spawner.UNPAIDS_CAP
						// Check if the spawn is spammable or spammablen't
						&& (spawn.config.method === 'spam' ? true : !channelQueue.has(m.member.user.id))
						// The string to type obviously
						&& m.content.toLowerCase() === string.toLowerCase()
						// Ensure the user ain't a bot
						&& !m.author.bot;
				};
				const collector = new MessageCollector(ctx.channel as TextChannel, { 
					max: spawn.config.maxEntries, 
					time: spawn.config.duration,
					filter: filter as ((m: Message) => PromiseUnion<boolean>)
				});

				collector.on('collect', m => { 
					channelQueue.set(m.author.id, m.member);
					if (spawn.config.method === 'spam') {
						const filter: CollectorFilter<[Context]> = msg => msg.author.id === m.author.id;
						const entry = collector.collected.array().filter(filter as (m: Message) => boolean);
						if (entry.length > 1) collector.collected.delete(m.id);
					}

					this.emit('messageCollect', ctx, spawn, collector, this);
				});
				collector.on('end', (c: Collection<string, Message>) => {
					channelQueue.clear();
					this.emit('messageEnd', ctx, spawn, c, this);
				});
				return spawn;
			default:
				return spawn; // for now
		}
	}
}