import { Store } from '@sapphire/framework';
import { Command } from '.';

/**
 * The command store.
 * If you're wondering why there's another store for commands, it's here to update typings for a modified command.
 */
export class CommandStore extends Store<Command> {
	public constructor() {
		super(Command, { name: 'commands' });
	}
}