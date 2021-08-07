/**
 * ClientUtil extension, with different types of classtards.
 * @author BrianWasTaken
*/

import { ClientUtil as OldClientUtil } from 'discord-akairo';
import { Snowflake, Collection } from 'discord.js';
import { Colors, ItemEffects } from 'lava/index';
import { LavaClient } from '.';

export declare interface ClientUtil<Client extends LavaClient = never> extends OldClientUtil {
	/**
	 * The client instance for this client util.
	 */
	client: Client;
}

export class ClientUtil<Client extends LavaClient = never> extends OldClientUtil {
	/**
	 * The constructor for utilities of our client.
	 * @param client the discord.js client instance
	 */
	public constructor(client: Client) {
		super(client);
		client.once('ready', this._patch.bind(this));
	}

	/**
	 * Patch certain stuff when the bot's ready.
	 */
	protected _patch() {
		for (const color of Object.keys(Colors)) {
			require('discord.js').Constants.Colors[color.toUpperCase()] = Colors[color];
		}
	}
	
	/**
	 * Construct an item effect. 
	*/
	effects = () => ItemEffects.create();

	/**
	 * Deeply filter an array.
	 * @param src the array to filter from
	 * @param filt array of elements to exclude from the source array
	 */
	deepFilter = <T>(src: T[], filt: T[]): T[] => {
		return src.filter(s => !filt.some(f => f === s));
	}

	/**
	 * Divide the items of an array into chunks of arrays. 
	 * {@link https://dankmemer.lol/source Source}
	 * @param array the array to paginate
	 * @param size the number of elements per page
	*/
	paginateArray = <T>(array: T[], size?: number): T[][] => {
		let pages: T[][] = [];
		let j = 0;
		for (let i = 0; i < Math.ceil(array.length / (size || 5)); i++) {
			pages.push(array.slice(j, j + (size || 5)));
			j = j + (size || 5);
		}
		return pages;
	}

	/**
	 * Create a simple progress bar.
	 * @param percent a valid integer between 1 and 10
	 * @param filledChar the character to fill on completed parts
	 * @param emptyChar the character in-place on incomplete parts
	*/
	progressBar = (percent = 1, filledChar = '■', emptyChar = '□') => {
		return `${filledChar.repeat(percent)}${emptyChar.repeat(10 - percent)}`;
	}

	/**
	 * Simple number check.
	 * @param x a string or number to check
	*/
	isInteger = (x: string | number): x is number => Number.isInteger(Number(x));

	/**
	 * Pick a random item from the array.
	 * @param array the array to pick a random element from
	*/
	randomInArray = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

	/**
	 * Pick random items from the array.
	 * @param array the array to pick the random elements from
	 * @param amount amount of elements to pick
	 */
	randomsInArray = <T>(array: T[], amount = 1): T[] => {
		const randoms: T[] = [];

		array.forEach((_, i, a) => {
			const random = this.randomInArray(this.deepFilter(array, randoms));
			randoms.push(random);
		});

		return randoms.slice(0, amount);
	}

	/**
	 * Generate a random number between 2 numbers. 
	 * @param min the possible minimum number
	 * @param max the max possible number
	*/
	randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

	/**
	 * Generate a random decimal color. 
	*/
	randomColor = (): number => Math.random() * 0xffffff;

	/**
	 * Shuffle the array.
	 * @param array the array to shuffle
	 */
	shuffle = <T>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

	/**
	 * Delay something for x time.
	 * @param ms the amount of time in milliseconds
	*/
	sleep = (ms: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(ms), ms));

	/**
	 * Convert a number to roman numerals. 
	 * @param int the interger to convert to roman numerals
	*/
	romanize = (int: number): string => {
		let romans = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
			values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
			roman = '',
			index = 0;

		while (index < romans.length) {
			roman += romans[index].repeat(int / values[index]);
			int %= values[index]; index++;
		}

		return roman;
	}

	/**
	 * Opposite of that shit above.
	 * @param roman a roman numeral to convert to numbers
	*/
	deromanize = (roman: string): number => {
		const split = roman.split('');
		const sym: { [k: string]: number } = {
			'I': 1,
			'V': 5,
			'X': 10,
			'L': 50,
			'C': 100,
			'D': 500,
			'M': 1000
		}

		let result = 0;
		for (let i = 0; i < split.length; i++) {
			const cur = sym[split[i]];
			const next = sym[split[i + 1]];

			if (cur < next) {
				result += next - cur // IV -> 5 - 1 = 4
				i++;
			} else {
				result += cur
			}
		}

		return result;
	}

	/**
	 * Parse time to human readables for god sake.
	 * @param time the time in seconds
	 * @param short whether to short 
	 * @param returnArray whether to return the parsed times in array
	*/
	parseTime = (time: number, short = false, returnArray = false) => {
		const methods = [
			{ name: ['mo', 'month'], count: 2592000 },
			{ name: ['d', 'day'], count: 86400 },
			{ name: ['h', 'hour'], count: 3600 },
			{ name: ['m', 'minute'], count: 60 },
			{ name: ['s', 'second'], count: 1 },
		];

		/**
		 * Pluralize time method names.
		*/
		const pluralize = (str: string, num: number) => {
			if (short || num <= 1) return str;
			return `${str}s`;
		};

		/**
		 * Joins "and" onto our second to the last and last index of array.
		*/
		const and = (arr: string[]): string[] => {
			const secondToLast = arr[arr.length - 2];
			const last = arr.pop();
			return [...arr.slice(0, arr.length - 1), [secondToLast, last].join(' and ')];
		}

		const fCount = Math.floor(time / methods[0].count);
		const timeStr = [`${fCount.toString()}${short ? '' : ' '}${pluralize(methods[0].name[short ? 0 : 1], fCount)}`];
		for (let i = 0; i < methods.length - 1; i++) {
			const mathed = Math.floor((time % methods[i].count) / methods[i + 1].count);
			timeStr.push(`${mathed.toString()}${short ? '' : ' '}${pluralize(methods[i + 1].name[short ? 0 : 1], mathed)}`);
		}

		const filtered = timeStr.filter(ts => !ts.startsWith('0'));
		return filtered.length > 1 ? and(filtered).join(', ') : filtered[0];
	}
}