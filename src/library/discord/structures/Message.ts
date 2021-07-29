import { LavaClient } from 'lava/akairo';
import { Message } from 'discord.js';

declare module 'discord.js' {	
	interface Message {
		client: LavaClient;
		author: User;
		awaitMessage(userID?: `${bigint}`, time?: number): Promise<Message>;
	}
}

Reflect.defineProperty(Message.prototype, 'awaitMessage', {
	get: function (this: Message, userID = this.author.id, time = 30000) {
		return this.channel.awaitMessages({ 
			time, 
			max: 1, 
			filter: m => m.author.id === userID 
		}).then(col => col.first());
	}
});

export { Message };