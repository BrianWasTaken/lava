import { 
	Message, Guild, Collection, GuildMember, User, Snowflake,
	CollectorFilter, MessageEmbed, MessageCollector
} from 'discord.js'
import { 
	SpawnVisuals, SpawnConfig, 
	LavaSpawner, LavaClient 
} from 'discord-akairo'

export class Spawner implements LavaSpawner {
	public queue: Collection<Snowflake, User>;
	public spawn: SpawnVisuals;
	public config: SpawnConfig;
	public answered: Collection<Snowflake, GuildMember>;
	public client: LavaClient;
	public constructor(
		client: LavaClient, 
		config: SpawnConfig,
		spawn: SpawnVisuals
	) {
		/**
		 * The Spawn Info
		 * @type {SpawnVisuals}
		*/
		this.spawn = spawn;

		/**
		 * The Spawn Configuration
		 * @type {SpawnConfig}
		*/
		this.config = config;

		/**
		 * The Spawn Answerees
		 * @type {Collection<Snowflake, User>}
	  */
	  this.answered = new Collection();

		/**
		 * The Discord Client
		 * @type {LavaClient}
		*/
		this.client = client;
	}

	public checkSpawn({ channel, member }: any): boolean {
		const { whitelisted, blacklisted } = this.client.config.spawn;

		if (this.client.queue.has(member.user.id)) return false;
		if (!whitelisted.categories.includes(channel.parentID)) return false;
		if (blacklisted.channels.includes(channel.id)) return false;
		return true;
	}

	public runCooldown(member: any): void {
		const rateLimit: number = this.config.cooldown(member) 
		|| this.client.config.spawn.rateLimit;
		
		this.client.setTimeout(() => {
			this.client.queue.delete(member.user.id);
		}, rateLimit * 60 * 1000);
	}

	public async run({ channel, guild, member }: Message): Promise<MessageEmbed> {
		const check = this.checkSpawn(member);
		if (!check) return;

		this.client.queue.set(member.user.id, channel);
		const event: Message = await this.spawnMessage(channel);
		const results: MessageEmbed = await this.collectMessages(event, channel, guild);
		this.runCooldown(member);
		return results;
	}

	public async spawnMessage(channel: any): Promise<Message> {
		const { emoji, type, title, description } = this.spawn;
		const event: Message = await channel.send(`**${emoji} \`${type} EVENT WOO HOO!\`**\n**${title}**\n${description}`);
		return event;
	}

	public async collectMessages(event: Message, channel: any, guild: Guild): Promise<any> {
		return new Promise(async resolve => {
			// Destruct
			const { entries, timeout, rewards } = this.config;
			const { strings, emoji, title } = this.spawn;
			const string: string = this.client.util.random('arr', strings);

			// Collectors
			await channel.send(`Type \`${string}\``);
			const filter: CollectorFilter = (m: Message): boolean => {
				let contentMatch = m.content.toLocaleLowerCase() === string.toLocaleLowerCase();
				return contentMatch && !this.answered.has(m.author.id);
			};
			const collector: MessageCollector = await event.channel.createMessageCollector(filter, {
				max: entries, time: timeout
			});

			// Handle Collect
			collector.on('collect', async (msg: Message) => {
				this.answered.set(msg.author.id, msg.member);
				if (collector.collected.first().id === msg.id) {
					await msg.channel.send(`\`${msg.author.username}\` got it first!`);
				} else {
					await msg.react(emoji);
				}
			});

			// Handle End
			collector.on('end', async (collected: Collection<Snowflake, Message>) => {
				await event.edit(`${event.content}\n\n**<:memerRed:729863510716317776> \`This event has expired.\`**`);
				if (!collected.size) return resolve({ color: 'RED', description: '**<:memerRed:729863510716317776> No one got the event.**' });

				// Vars
				const { min, max } = rewards;
				const verbs: string[] = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
				const verb: string = this.client.util.random('arr', verbs);
				const results: string[] = [];

				// Loop through
				collected.array().forEach(async (m: Message): Promise<void> => {
					const coins: number = this.client.util.random('num', [min / 1000, max / 1000]) * 1000;
					results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
					await this.client.db.spawns.add({ 
						userID: m.author.id, amount: coins, type: 'unpaid' });
					await this.client.db.spawns.add({ 
						userID: m.author.id, amount: 1, type: 'eventsJoined' });
					await m.author.send([
						`**${emoji} Congratulations!**`,
						`You ${verb} **${coins.toLocaleString()}** coins from the "${title}" event.`,
						`**${coins.toLocaleString()}** coins has been added to your unpaid credits (use our \`lava unpaids\` command).`
					].join('\n')).catch(() => {});
				});

				// Stuff
				const payouts: any = guild.channels.cache.get('791659327148261406') || collector.channel;
				await payouts.send({ embed: {
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'RANDOM',
					footer: { text: `From: ${channel.name}` }
				}}).catch(() => {});

				// Resolve the resulting embed
				return resolve({
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'GOLD',
					footer: { text: `Check your direct messages.` }
				});
			});
		});
	}
}
