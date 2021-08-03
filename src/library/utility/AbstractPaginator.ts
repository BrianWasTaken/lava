import { Message, Collection, MessageOptions, MessageButton, MessageButtonOptions, MessageActionRow, InteractionCollector, ButtonInteraction } from 'discord.js';
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
	 * The sent message.
	 */
	message: Message;
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

		this.collector = this.message.createMessageComponentCollector<ButtonInteraction>({
			time: this.timeout,
			maxComponents: Infinity,
			filter: interaction => {
				const controlIds = Object.values(PaginatorControlId);
				return controlIds.some(id => id === interaction.customId) 
					&& interaction.user.id === this.message.author.id;
			},
		});

		this.collector.on('collect', this._handleIncoming.bind(this));
		this.collector.on('end', this._handleEnd.bind(this));
	}

	private async _disableAll(int: ButtonInteraction, props = this.pages[this.current]) {
		if (!int) return;
		const buttons = int.message.components.flatMap(row => row.components.filter(c => c.type === 'BUTTON')).map(c => c.setDisabled(true));
		await int.update({ ...props, components: [new MessageActionRow({ components: [...buttons] })] });
	}

	private async _handleEnd(collected: Collection<Snowflake, ButtonInteraction>, reason: string) {
		await this._disableAll(collected.first());
	}

	private async _handleIncoming(int: ButtonInteraction) {
		switch(int.customId) {
			case PaginatorControlId.FIRST:
				await int.update(this.pages[this.current = 0]);
				break;

			case PaginatorControlId.PREVIOUS:
				await int.update(this.pages[this.current > 0 ? this.current-- : this.current]);
				break;

			case PaginatorControlId.STOP:
				await this._disableAll(int);
				this.collector.stop('force');
				break;

			case PaginatorControlId.NEXT:
				await int.update(this.pages[this.current === this.pages.length - 1 ? this.current++ : this.current]);
				break;

			case PaginatorControlId.LAST:
				await int.update(this.pages[this.pages.length - 1]);
				break;

			default:
				throw new TypeError('Invalid Button ID');
		}
	}
}