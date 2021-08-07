import { Message, Snowflake } from 'discord.js';
import { LavaClient } from 'lava/akairo';

declare module 'discord.js' {	
	interface Message {
		/**
		 * The client instance.
		 */
		client: LavaClient;
		/**
		 * The author of this message.
		 */
		author: User;
		/**
		 * Await a message from the message author.
		 * @param userId the user to await the message from
		 * @param time the time in ms to wait for collection
		 */
		awaitMessage(userId?: Snowflake, time?: number): Promise<Message>;
	}
}

/**
 * Defines the awaitMessage method for the Message class.
 */
Reflect.defineProperty(Message.prototype, 'awaitMessage', {
	value: function (this: Message, userId = this.author.id, time = 30000) {
		return this.channel.awaitMessages({ 
			time, 
			max: 1, 
			filter: m => m.author.id === userId 
		}).then(col => col.first());
	}
});

export { Message };