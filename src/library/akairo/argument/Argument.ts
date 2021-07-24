import { AbstractModule, AbstractModuleOptions, } from 'lava/akairo';
import { ArgumentHandler } from '.';
import { Message } from 'discord.js';

export abstract class Argument extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: ArgumentHandler;

	/**
	 * Method to run this argument.
	 */
	public exec(ctx: Message, args: string): PromiseUnion<any> {
		return null;
	}
}