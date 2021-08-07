import { LavaClient, CommandHandler, AbstractHandler, AbstractHandlerOptions } from 'lava/akairo';
import { Argument } from '.';
import { Message } from 'discord.js';

export class ArgumentHandler extends AbstractHandler<Argument> {
	/**
	 * Construct an argument handler.
	 * @param client the discord.js client instance.
	 * @param options the options for this argument handler. 
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}

	/**
	 * Add custom arguments to the command handler.
	 * @param handler the command handler to add the arguments to.
	 */
	public addTypes(handler: CommandHandler) {
		for (const arg of this.modules.values()) {
			handler.resolver.addType(arg.id, arg.exec.bind(arg));
		}
	}
}