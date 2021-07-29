/**
 * Command v2
 * @author BrianWasTaken
*/

import { Collection, Snowflake, Message, MessageOptions, MessageEmbedOptions, MessageEmbed } from 'discord.js';
import { Command as OldCommand, CommandOptions, CommandDescription, Category } from 'discord-akairo';
import { AbstractModule, LavaClient } from 'lava/akairo';
import { CommandHandler, SubCommand } from '.';

export declare interface Command extends OldCommand {
	/**
	 * The category this command belongs to.
	 */
	category: Category<string, this>;
	/**
	 * The handler who owns this command.
	 */
	handler: CommandHandler;
	/**
	 * The client instance.
	 */
	client: LavaClient;
	/**
	 * The description of this command.
	 */
	description: CommandDescription;
}

export class Command extends OldCommand implements AbstractModule {
	/**
	 * The name of this command.
	 */
	public name: string;
	/**
	 * Wether to show this command in help command.
	 */
	public help: boolean;
	/**
	 * Wether this command is a subcommand or not.
	 */
	public type: 'subcommand' | 'command';
	/**
	 * Usage of this command.
	 */
	public usage: string;
	/**
	 * Wether this command is staff only.
	 */
	public staffOnly: boolean;

	/**
	 * Construct a command.
	 */
	public constructor(id: string, options: CommandOptions) {
		super(id, options);
		/** @type {string} */
		this.name = options.name ?? id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
		/** @type {boolean} */
		this.help = options.help ?? true;
		/** @type {'subcommand'|'command'} */
		this.type = options.type ?? 'command';
		/** @type {string} */
		this.usage = (options.usage ?? '{command}').replace('{command}', this.aliases[0]);
		/** @type {boolean} */
		this.staffOnly = options.staffOnly ?? false;
		if (process.env.DEV_MODE === 'true') {
			/** @type {boolean} */
			this.ownerOnly = true;
		}
	}

	/**
	 * Make use of currency events.
	 */
	public async event(ctx: Message) {
		if (this.category.id !== 'Currency') return;
		if (this.handler.events.get(ctx.channel.id)) return;

		const entry = await ctx.author.currency.fetch();
		const actives = entry.actives.find(a => a.effects.entities.keys.length > 0);
		if (!actives) return;

		const { randomNumber } = ctx.client.util;
		const odds = actives.effects.entities.keys.reduce((p, c) => p + c, 0);
		if (randomNumber(1, 100) < 95 - odds) return;

		const got = randomNumber(1, 10);
		await entry.addKeys(got).save();
		return ctx.channel.send(`You got **${got} :key: Key** from using a command!`);
	}

	/**
	 * Method to run this command.
	 * Return `true` to add cooldown, `false` otherwise.
	 */
	public exec(context: Message, args?: any): PromiseUnion<boolean> {
		return super.exec(context, args);
	}

	/**
	 * The subcommands of this command.
	 */
	get subCommands(): SubCommand[] {
		const subs = this.handler.modules.filter(m => m.type === 'subcommand');
		return subs.size > 0 ? subs.array() as SubCommand[] : null;
	}
}