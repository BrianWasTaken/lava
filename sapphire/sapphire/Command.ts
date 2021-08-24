import type { PieceContext, CommandOptions, CommandContext, Args } from '@sapphire/framework';
import type { Awaited, Message, MessageOptions } from 'discord.js';
import type { CommandStore } from '.';
import { Command as _Command } from '@sapphire/framework';

export interface Command<T = Args> extends _Command<T> {
	store: CommandStore;
}

/**
 * Base class for every command's logic.
 */
export class Command<T = Args> extends _Command<T> {
	/**
	 * Determines whether this command should only be available for the bot's application owner.
	 */
	public ownerOnly: boolean;
	/**
	 * Whether this command should only be available to support server staffs.
	 */
	public staffOnly: boolean;
	public constructor(context: PieceContext, options?: CommandOptions) {
		super(context, options);
		this.ownerOnly = options?.ownerOnly ?? false;
		this.staffOnly = options?.staffOnly ?? false;
	}

	/**
	 * Executes the command's logic.
	 * @param message The message that triggered the command.
	 * @param args The value returned by {@link _Command.preParse}, by default an instance of {@link Args}.
	 * @param context Contains extra information about the command store.
	 */
	public run(message: Message, args: T, context: CommandContext): Awaited<unknown> {
		return;
	}
}

declare module '@sapphire/framework' {
	interface CommandOptions {
		ownerOnly?: boolean;
		staffOnly?: boolean;
	}
}