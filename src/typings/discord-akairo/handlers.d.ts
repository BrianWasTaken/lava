/**
 * Type overrides for "discord-akairo".
 * @author BrianWasTaken
 */

/**
 * Client.
 */
declare module 'discord-akairo' {
	
}

/**
 * Command.
 */
declare module 'discord-akairo' {
	import { 
		LavaClient, AbstractHandler, CommandQueue, 
		Context, AbstractModule, AbstractModuleOptions,
	} from 'lava/index';
	import { 
		Message, MessageOptions 
	} from 'discord.js';

	/**
	 * Argument Type Caster.
	 */
	type ArgumentTypeCaster	= (message: Context, args: string) => PromiseUnion<any>;
	
	/**
	 * The command class.
	 * @extends {AkairoModule}
	 */
	interface Command extends AkairoModule {
		/**
		 * The client instance for this command.
		 */
		client: LavaClient;
		/**
		 * The command description.
		 */
		description: CommandDescription;
		/**
		 * The category this command belongs to.
		 */
		category: Category<string, this>;
		/**
		 * The name of this command.
		 */
		name: string;
		/**
		 * Method to run this command.
		 */
		exec(message: Message, args: any): PromiseUnion<boolean>;
	}

	/**
	 * CommandDescription.
	 */
	interface CommandDescription {
		/**
		 * Array of examples to use this command.
		 */
		examples: string[];
		/**
		 * The short description for this command.
		 */
		short: string;
		/**
		 * The longest bullshit for this command.
		 */
		long: string;
	}

	/**
	 * CommandOptions.
	 * @extends {AbstractModuleOptions}
	 */
	interface CommandOptions extends AbstractModuleOptions {
		/**
		 * The optional description for the command.
		 */
		description?: CommandDescription;
		/**
		 * The optional name for this command.
		 */
		name?: string;
		/**
		 * Wether to show this command in the help menu.
		 */
		help?: boolean;
		/**
		 * Type of this command. Defaults to 'command' 
		 */
		type?: 'subcommand' | 'command';
		/**
		 * Usage of this command.
		 */
		usage?: string;
		/**
		 * Wether this command is for staffs only.
		 */
		staffOnly?: boolean;
	}

	/**
	 * The parsed component bullshit.
	 */
	interface ParsedComponentData {
		/**
		 * The command bullshit.
		 */
		command?: Command;
	}

	interface CommandHandler extends AkairoHandler {
		/**
		 * The client instance for this command handler.
		 */
		client: LavaClient;
		/**
		 * The command queue to prevent people from spamming commands.
		 */
		commandQueue: CommandQueue;
		/**
		 * Manages cooldowns on our mongodb database.
		 */
		checkCooldowns(message: Message, command: Command): Promise<boolean>;
		/**
		 * Runs a command.
		 */
		runCommand(message: Message, command: Command, args: any): Promise<void>;
		/**
		 * Run command permissions checks.
		 */
		runPermissionChecks(message: Message, command: Command): Promise<boolean>;
		/**
		 * Run all inhibitors with type "pre".
		 */
		runPostTypeInhibitors(message: Message, command: Command): Promise<boolean>;
	}

	/**
	 * The type resolver for command agruments.
	 */
	interface TypeResolver {
		/**
		 * The command handler for this resolver.
		 */
		commandHandler: CommandHandler;
		/**
		 * The listener handler for this resolver.
		 */
		listenerHandler: ListenerHandler;
		/**
		 * The inhibitor handler for this resolver.
		 */
		inhibitorHandler: InhibitorHandler;
		/**
		 * The collection of types to be used in command arguments.
		 */
		types: CollectionPlus<ArgumentTypeCaster>;
		/**
		 * Adds built in types from akairo.
		 */
		addBuiltInTypes(): void;
		/**
		 * Add our custom argument type.
		 */
		addType(name: string, fn: ArgumentTypeCaster): this;
		/**
		 * Add multiple types at once.
		 */
		addTypes(types: { [x: string]: ArgumentTypeCaster }): this;
		/**
		 * Get a type from our collection of types.
		 */
		type(name: string): ArgumentTypeCaster;
	}
}

/**
 * Listener.
 */
declare module 'discord-akairo' {
	import { LavaClient, AbstractModuleOptions } from 'lava/index';

	interface Listener extends AkairoModule {
		/**
		 * The handler this listener owns from.
		 */
		handler: ListenerHandler;
		/**
		 * The category this listener belongs to.
		 */
		category: Category<string, this>;
	}

	interface ListenerOptions extends AbstractModuleOptions {
		/**
		 * The name of this listener.
		 */
		name?: string;
	}

	interface ListenerHandler extends AkairoHandler {
		/**
		 * The client instance.
		 */
		client: LavaClient;
	}
}

/**
 * Inhibitor.
 */
declare module 'discord-akairo' {
	import { LavaClient, AbstractModuleOptions, Context } from 'lava/index';
	import { Message } from 'discord.js';

	interface Inhibitor extends AkairoModule {
		/**
		 * The name of this inhibitor.
		 */
		name: string;
		/**
		 * The method to run this inhibitor.
		 */
		exec(message: Message, command: Command): PromiseUnion<boolean>;
	}

	interface InhibitorOptions extends AbstractModuleOptions {
		/**
		 * The name for this inhibitor.
		 */
		name?: string;
	}

	interface InhibitorHandler extends AkairoHandler {
		/**
		 * The client instance for this inhibitor bullshit.
		 */
		client: LavaClient;
	}
}