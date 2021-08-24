import { Awaited, User, Snowflake, Collector, CollectorOptions, Collection } from 'discord.js';
import { EventEmitter } from 'events';

/**
 * The predicate for all choice responses.
 */
export interface PromptChoicePredicate<V, E extends unknown[]> {
	/**
	 * @param this the "this" value for this predicate
	 * @param res the initial value passed by the collector
	 * @param args the extra arguments after the initial argument
	*/
	(this: Prompt<V, E>, res: V, ...args: E): Awaited<boolean>;
}

/**
 * Options for choices.
 */
export interface PromptChoice<V, E extends unknown[]> {
	/**
	 * The predicate. Called when one of each responses were triggered.
	 */
	predicate: PromptChoicePredicate<V, E>;
	/**
	 * The possible responses.
	 */
	response: string[];
}

/**
 * Options for this prompt.
 */
export interface PromptOptions<V, E extends unknown[]> extends CollectorOptions<[V, ...E]> {
	/**
	 * The choices for this prompt.
	 */
	choices: PromptChoice<V, E>[];
	/**
	 * The user who owns this prompt.
	 */
	user: User;
}

export abstract class Prompt<V, E extends unknown[]> extends EventEmitter {
	/**
	 * The collector to manage this prompt.
	 */
	public abstract collector: Collector<Snowflake, V, E>;
	/**
	 * The choices for this prompt.
	 */
	public choices: PromptChoice<V, E>[];
	/**
	 * The user who owns this prompt.
	 */
	public user: User;

	/**
	 * The base constructor for all prompts.
	 * @param options the options for this prompt
	 */
	public constructor(options: PromptOptions<V, E>) {
		super();
		this.choices = options.choices;
		this.user = options.user;
	}

	/**
	 * Binds collector events to this prompt's methods.
	 * @param collector the collector assigned for this prompt
	 */
	public bind(collector: this['collector']) {
		collector.on('collect', (...args: [V, ...E]) => this.collect(...args));
		collector.on('end', this.end.bind(this));
		return collector;
	}

	/**
	 * The method called when this collector emits the 'collect' event.
	 * @param value the initial value for this prompt to handle
	 * @param args the other arguments after the initial value
	 */
	public abstract collect(value: V, ...args: E): Awaited<void>;

	/**
	 * Handles the end event of this prompt's collector.
	 * @param collection the collection stuff by the collector
	 * @param reason the reason why the prompt has ended
	 */
	public abstract end(collection: Collection<Snowflake, V>, reason: string): Awaited<void>;
}