import { User, Snowflake, Message, MessageOptions, Collector, CollectorOptions } from 'discord.js';

/**
 * The page of the paginator.
 */
export type PaginatorPage = Omit<MessageOptions, 'components'>;

/**
 * The base options for this paginator.
 */
export interface PaginatorOptions<T extends unknown[] = []> extends Omit<CollectorOptions<T>, 'dispose'> {
	/**
	 * The page to focus when this paginator starts.
	 */
	focus?: number;
	/**
	 * The client's message to paginate from.
	 */
	message: Message;
	/**
	 * The pages to scroll through.
	 */
	pages: PaginatorPage[];
	/**
	 * The user who owns this paginator.
	 */
	user: User;
}

/**
 * The controls to manage pages in this paginator.
 */
export interface PaginatorControl extends Omit<MessageOptions, 'components'> {}

export abstract class Paginator<V, T extends unknown[] = []>  {
	/**
	 * The discord.js collector to manage this paginator.
	 */
	public abstract collector: Collector<Snowflake, V>;
	/**
	 * The controls to manage pages in this paginator.
	 */
	public abstract controls: PaginatorControl[];
	/**
	 * The client's message to paginate from.
	 */
	public message: Message;
	/**
	 * The current page focused on the message.
	 */
	public page: number;
	/**
	 * The pages to scroll through.
	 */
	public pages: PaginatorPage[];
	/**
	 * The timeout for this paginator.
	 */
	public timeout: number;
	/**
	 * The user who owns this pager.
	 */
	public user: User;

	/**
	 * The constructor for this paginator.
	 * @param options the options to pass for this paginator
	 */
	public constructor(options: PaginatorOptions<T>) {
		this.message = options.message;
		this.page = options.focus ?? 0;
		this.pages = options.pages;
		this.user = options.user;
	}

	/**
	 * Binds events to paginator methods.
	 * @param collector this paginator's collector
	 */
	public bind(collector: this['collector']) {
		collector.on('collect', this.collect.bind(this));
		collector.on('end', this.end.bind(this));
		return collector;
	}

	/**
	 * Change the page of this paginator.
	 * @param to negative to walk back, positive to walk to the quarantine facility because you caught covid 
	 */
	public shift(to: number) {
		return to < 0 
			? (this.page = this.page - to < 0 ? 0 : this.page - 1) 
			: (this.page = this.page + to > this.pages.length - 1
					? this.pages.length - 1
					: this.page + to); 
	}

	/**
	 * Called when the collector emits the 'collect' event.
	 * @param args the args passed by the collect event of the collector
	 */
	public abstract collect(value: V): PromiseUnion<void>;

	/**
	 * Called when the collector has ended through the 'end' event.
	 * @param collected the collection gathered by the collection
	 * @param reason the reason why the collector has stopped
	 */
	public abstract end(collected: Collector<Snowflake, V, T>['collected'], reason: string): PromiseUnion<void>;
}