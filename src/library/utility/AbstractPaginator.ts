import { User, Message, Collection, MessageOptions, MessageButton, MessageButtonOptions, MessageActionRow, InteractionCollector, ButtonInteraction } from 'discord.js';
import { LavaClient } from 'lava/akairo';

export type PaginatorPage = Omit<MessageOptions, 'components'>;

/**
 * Controls:
 * 'first' - first page
 * 'previous' - previous page
 * 'stop' - stop collector
 * 'next' - next page
 * 'last' - last page 
 */
export enum PaginatorControlId {
	FIRST = 'first',
	PREVIOUS = 'prev',
	STOP = 'stop',
	NEXT = 'next',
	LAST = 'last'
}

export interface PaginatorControl extends MessageButtonOptions {
	/**
	 * The id of this paginator.
	 */
	customId: PaginatorControlId;
}

export interface PaginatorOptions {
	/**
	 * The timeout for collecting interactions.
	 */
	time: number;
	/**
	 * The controls for this paginator.
	 */
	controls: PaginatorControl[];
	/**
	 * The page to focus.
	 */
	focus?: number;
	/**
	 * The sent message by the bot.
	 */
	message: Message;
	/**
	 * The user for filter purposes.
	 */
	user: User;
	/**
	 * The pages to paginate.
	 */
	pages: PaginatorPage[];
}

export class AbstractPaginator {
	public collector: InteractionCollector<ButtonInteraction>;
	public controls: PaginatorControl[];
	public message: Message;
	public current: number;
	public timeout: number;
	public pages: PaginatorPage[];
	public user: User;

	/**
	 * @param message the message sent to the channel/user
	 * @param options the options for this paginator
	 */
	public constructor(options: PaginatorOptions) {
		if (options.pages.length < 1) {
			throw new TypeError('Property "pages" is empty');
		}
		if (options.focus > options.pages.length - 1) {
			throw new TypeError('Property "focus" is greater than pages length');
		}

		this.controls = options.controls;
		this.current = options.focus ?? 0;
		this.message = options.message;
		this.timeout = options.time;
		this.pages = options.pages;
		this.user = options.user;

		const collector = this.message.createMessageComponentCollector<ButtonInteraction>({
			time: this.timeout,
			max: Infinity,
			filter: interaction => {
				// const controlIds = Object.values(PaginatorControlId);
				// return controlIds.some(id => id === interaction.customId) 
				// 	&& 
				return interaction.user.id === this.user.id;
			},
		});

		collector.on('collect', (int: ButtonInteraction) => this._handleIncoming(int));
		collector.on('end', this._handleEnd.bind(this));
		this.collector = collector;
	}

	private async _disableAll(props = this.pages[this.current]) {
		const buttons = this.message.components.flatMap(row => row.components.filter(c => c.type === 'BUTTON')).map(c => c.setDisabled(true));
		await this.message.edit({ ...props, components: [new MessageActionRow({ components: [...buttons] })] });
	}

	private async _handleEnd(collected: Collection<Snowflake, ButtonInteraction>, reason: string) {
		await this._disableAll();
	}

	private async _handleIncoming(int: ButtonInteraction) {
		switch(int.customId) {
			case PaginatorControlId.FIRST:
				await this.message.channel.send('first');
				this.current = 0;
				await this.message.edit(this.pages[this.current]);
				break;

			case PaginatorControlId.PREVIOUS:
				await this.message.channel.send('prev');
				this.current -= 1;
				await this.message.edit(this.pages[this.current] ?? this.pages[0]);
				break;

			case PaginatorControlId.STOP:
				this.collector.stop('force');
				await this._disableAll();
				break;

			case PaginatorControlId.NEXT:
				await this.message.channel.send('next');
				this.current += 1;
				await this.message.edit(this.pages[this.current] ?? this.pages[this.pages.length - 1]);
				break;

			case PaginatorControlId.LAST:
				await this.message.channel.send('last');
				this.current = this.pages.length - 1;
				await this.message.edit(this.pages[this.current]);
				break;

			default:
				throw new TypeError('Invalid Button ID');
				break;
		}
	}
}