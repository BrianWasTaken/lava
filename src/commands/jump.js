import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'jump',
	aliases: ['skipto'],
	description: 'skip to a specified index in the queue.',
	usage: '<index>'
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
		log('error', 'jump@checkQueue', error.stack);
		return errorEmbed({ title: 'jump@checkQueue', error: error });
	}

	// not a number
	if (isNaN(args[0]) || !args[0]) {
		return simpleEmbed(message, `Cannot parse your specified index number as number.`);
	}

	// queue limits
	const index = parseInt(args[0], 10);
	if (index > queue.songs.length) {
		return simpleEmbed(message, 'Your specified index is greater than the length of songs in queue.');
	} else if (index < 1) {
		return simpleEmbed(message, 'Cannot jump to songs that already been finished.');
	}

	/** Do the thing */
	try {
		await bot.player.jump(message, index - 1);
	} catch(error) {
		log('commandError', 'loop', error)
		return errorEmbed(message, error);
	}
})