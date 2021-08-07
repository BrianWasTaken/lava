/**
 * Base class for all first-level subcommands.
 */

import { CommandOptions } from 'discord-akairo';
import { Command } from './Command';

interface SubCommandOptions extends CommandOptions {
	/**
	 * The parent command id.
	 */
	parent: string;
}

export class SubCommand extends Command {
	/**
	 * The parent command id.
	 */
	public parent: string;
	/**
	 * Construct a subcommand.
	 * @param id the id of this subcommand
	 * @param options the command options, omitting the type of this command
	 */
	public constructor(id: string, options: Omit<SubCommandOptions, 'type'>) {
		super(id, { ...options, type: 'subcommand' });
		/** @type {string} */
		this.parent = options.parent;
	}
}