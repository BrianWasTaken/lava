import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'queue',
	aliases: ['q'],
	description: 'sends a list of songs on the queue of your server.',
	usage: '[--clear]'
}, async (bot, message, args) => {

	/** Check Playing State */
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) {
			return simpleEmbed({
				title: 'Player Empty',
				color: 'RED',
				text: 'There\'s nothing playing in the queue.'
			})
		}
	} catch(error) {
		log('error', 'queue@checkQueue', error.stack);
		return errorEmbed({ title: 'queue@checkQueue', error: error });
	}

	/** Check if args contains a flag to clear the queue */
	if (args.join(' ').includes('--clear')) {
		await bot.player.stop(message)
		return simpleEmbed(message, 'The player has been stopped and the queue has been cleared.');
	}

	/** Map Songs */
	const songs = queue ? queue.songs.map((song, index) => `**${index === 0 ? ':musical_note:' : `#${index + 1}:`}** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\` `) : false;
	
	/** Send Queue */
	try {
		const msg = await message.channel.send(dynamicEmbed({
			title: 'Server Queue',
			color: 'BLUE',
			fields: {
				'Currently Playing': { 	content: songs[0] },
				'Server Queue': { 			content: songs[1] ? songs.slice(1).join('\n') : 'No more left to play in queue.' }
			},
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		}));

		/** Message Reactions */
		try {
			/** Emojis -> queueMessage */
			const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀', ':x:'];
			for (const emoji of emojis) {
				setTimeout(async () => {
					await msg.react(emoji);
				}, 1000) // Apply a timeout to preserve rateLimits.
			}

			/** Collector */
			const filter = (reaction, user) => user.id !== bot.user.id && user.id === message.author.id;
			const collector = await msg.createReactionCollector(filter, { time: 60000 });
			
			/** Controls */
			collector.on('collect', async (reaction, user) => {
				switch(reaction.emoji.name) {

					// Previous
					case emojis[0]:
						await message.channel.send('Coming Soon:tm:');
						break;

					// Next/Skip
					case emojis[1]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.skip(message);
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> skip', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						}
						break;

					// Pause
					case emojis[2]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.pause(message);
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> pause', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						}
						break;

					// Stop
					case emojis[3]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.stop(message);
								collector.stop();
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> stop', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						}
						break;

					// repeat
					case emojis[4]:
						message.channel.send('repeat');
						break;

					// shuffle
					case emojis[5]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.shuffle(message);
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> shuffle', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						};
						break;

					// cancel
					case emojis[6]:
					try {
						await reaction.users.removeAll();
						try {
							collector.stop();
						} catch(error) {
							log('commandError', 'queue@collector -> switch -> collector.stop', error);	
						}
					} catch(error) {
						log('commandError', 'queue@collector -> switch -> removeReactions', error);
					}
				}
			})

			/** End */
			collector.on('end', async (reaction, user) => {
				await message.channel.send('ended')
				await msg.reactions.removeAll()
			});
		} catch (error) {
			log('commandError', 'queue@create_collector', error.stack);
			return errorEmbed(message, error);
		}
	} catch(error) {
		log('commandError', 'queue@send_queue_msg', error.stack);
		return errorEmbed(message, error);
	}
})