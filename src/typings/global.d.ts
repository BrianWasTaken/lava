/**
 * Global custom types.
*/
export declare global {
	import { Collection } from 'discord.js';

	/**
	 * Cast a union type of a promise and a not.
	*/
	type PromiseUnion<T> = Promise<T> | T;

	/**
	 * Cast a union of an array and a not.
	*/
	type ArrayUnion<T> = Array<T> | T;

	/**
	 * Cast a union of a partial object and a not.
	*/
	type PartialUnion<T> = Partial<T> | T;

	/**
	 * Cast a collection with a key string to value pair.
	*/
	type CollectionPlus<V> = Collection<string, V>;

	/**
	 * Custom console interface.
	*/
	interface Console {
		/** 
		 * Logs to stdin.
		*/
		log(tag: string, ...message: any[]): void;
	}

	/**
	 * Custom overrides/additions for NodeJS.
	 */
	namespace NodeJS {
		/**
		 * Process Environments.
		 */
		interface ProcessEnv {
			/**
			 * Your discord bot token.
			 */
			DISCORD_TOKEN: string;
			/**
			 * Your meme token.
			 */
			MEME_TOKEN: string;
			/**
			 * Your mongo url.
			 */
			MONGO_URI: string;
			/**
			 * Wether to enable verbose mode.
			 */
			DEV_MODE: string;
		}
	}
}