/**
 * Command Handler v2
 * @author BrianWasTaken
*/

import { AbstractHandler, AbstractHandlerOptions, AbstractModuleOptions, LavaClient, InhibitorHandler, ListenerHandler } from 'lava/akairo';
import { CommandHandler as OldCommandHandler, CommandHandlerOptions, Category, Constants } from 'discord-akairo';
import { CommandQueue, Cooldown } from 'lava/index';
import { Collection, Snowflake, Message } from 'discord.js';
import { Command } from '.';

const { CommandHandlerEvents, BuiltInReasons } = Constants;

export declare interface CommandHandler extends OldCommandHandler {
	/**
	 * All categories this command handler hold.
	 */
	categories: Collection<string, Category<string, Command>>;
	/**
	 * All commands this handler hold.
	 */
	modules: Collection<string, Command>;
	/**
	 * The client instance for this handler.
	 */
	client: LavaClient;
	/**
	 * Add a command.
	 * @param filename the name of the module file
	 */
	add: (filename: string) => Command;
	/**
	 * Find a category of commands.
	 * @param name the name of the category to resolve
	 */
	findCategory: (name: string) => Category<string, Command>;
	/**
	 * Load a command based from the file path or a class.
	 * @param thing the path of the module or the module class to load
	 * @param isReload whether loading the module is a reload or not
	 */
	load: (thing: string | Function, isReload?: boolean) => Command;
	/**
	 * Reload a command.
	 * @param id the id of the command
	 */
	reload: (id: string) => Command;
	/**
	 * Remove a command.
	 * @param id the id of the command
	 */
	remove: (id: string) => Command;
}

export class CommandHandler extends OldCommandHandler implements AbstractHandler<Command> {
	/**
	 * Prevent running multiple commands at once.
	 */
	public commandQueue = new CommandQueue();
	/**
	 * Events spawned by using some commands.
	 */
	public events = new Collection<Snowflake, Message>();

	/**
	 * Run all post type inhibitors.
	 * @param context the message object emitted by the client
	 * @param command the command to be abused by this handler
	 */
	public async runPostTypeInhibitors(context: Message, command: Command): Promise<boolean> {
		if (command.ownerOnly) {
			const isOwner = this.client.isOwner(context.author);
			if (!isOwner) {
				this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, BuiltInReasons.OWNER);
				return true;
			}
		}

		if (command.channel === 'guild' && !context.guild) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, BuiltInReasons.GUILD);
			return true;
		}

		if (command.channel === 'dm' && context.guild) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, BuiltInReasons.DM);
			return true;
		}

		if (await this.runPermissionChecks(context, command)) {
			return true;
		}

		const reason = this.inhibitorHandler ? await this.inhibitorHandler.test('post', context, command) : null;
		if (reason != null) {
			this.emit(CommandHandlerEvents.COMMAND_BLOCKED, context, command, reason);
			return true;
		}

		if (await this.checkCooldowns(context, command)) {
			return true;
		}

		return false;
	}

	/**
	 * Run cooldowns.
	 * @param context the discord.js message object
	 * @param command the command to manage
	 */
	public async checkCooldowns(context: Message, command: Command): Promise<boolean> {
		const ignorer = command.ignoreCooldown || this.ignoreCooldown;
		const isIgnored = Array.isArray(ignorer)
			? ignorer.includes(context.author.id)
			: typeof ignorer === 'function'
				? ignorer(context, command)
				: context.author.id === ignorer;

		if (isIgnored) return false;

		const time = command.cooldown != null ? command.cooldown : this.defaultCooldown;
		if (!time) return false;

		const entry = await context.author.lava.fetch();
		const expire = context.createdTimestamp + time;

		const cooldown: Cooldown = entry.cooldowns.get(command.id);
		const diff = cooldown.expiresAt - context.createdTimestamp;
		if (diff >= 1) {
			this.emit(CommandHandlerEvents.COOLDOWN, context, command, diff);
			return true;
		}

		return false;
	}

	/**
	 * Run a command.
	 * @param context the discord.js message object
	 * @param command the command to execute
	 * @param args the parsed command arguments
	 */
	public async runCommand(context: Message, command: Command, args: any) {
		await this.commandQueue.wait(context.author.id);
		this.emit(CommandHandlerEvents.COMMAND_STARTED, context, command, args);

		try {
			const returned = await command.exec(context, args);
			const lava = await context.author.lava.fetch();
			if (returned) lava.addCooldown(command);
			await lava.updateCommand(command.id).addUsage(command.id).save();
			this.emit(CommandHandlerEvents.COMMAND_FINISHED, context, command, args);
		} catch (error) {
			this.emit(CommandHandlerEvents.ERROR, error, context, command);
		} finally {
			this.commandQueue.next(context.author.id);
		}
	}
}