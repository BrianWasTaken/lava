import { Snowflake, Collection, ButtonInteraction, MessageActionRow, InteractionButtonOptions, InteractionCollector } from 'discord.js';
import { Paginator, PaginatorOptions, PaginatorControl } from './interfaces/Paginator';

/**
 * Values of buttons per custom button id.
 */
export enum ButtonControls {
	FIRST = 'first',
	PREVIOUS = 'prev',
	STOP = 'stop',
	NEXT = 'next',
	LAST = 'last'
}

/**
 * The controls for this button paginator.
 */
export interface ButtonPaginatorControl extends PaginatorControl, InteractionButtonOptions {
	/**
	 * The custom id for this controller.
	 */
	customId: ButtonControls;
}

export interface ButtonPaginatorOptions extends PaginatorOptions {
	/**
	 * The button paginator controls.
	 */
	controls: ButtonPaginatorControl[];
}

export class ButtonPaginator extends Paginator<ButtonInteraction> {
	/**
	 * The interaction collector for this paginator.
	 */
	public collector: InteractionCollector<ButtonInteraction>;
	/**
	 * The button controls for this button paginator.
	 */
	public controls: ButtonPaginatorControl[];

	/**
	 * The constructor for this buttonshit.
	 * @param options the optionshit for this buttonshit
	 */
	public constructor(options: ButtonPaginatorOptions) {
		super(options);
		super.bind(this.collector = this.message.createMessageComponentCollector<ButtonInteraction>({
			...options, filter: interaction => interaction.user.id === this.user.id
		}));
	}

	/**
	 * Handles incoming interactions.
	 * @param int the button interaction to cover
	 */
	public async collect(int: ButtonInteraction) {
		switch(int.customId) {
			case ButtonControls.FIRST:
				await int.update(this.pages[super.shift(-(this.page - 1))]);
				break;

			case ButtonControls.PREVIOUS:
				await int.update(this.pages[super.shift(-1)]);
				break;

			case ButtonControls.STOP:
				await int.update(this.pages[0]);
				this.collector.stop();
				break;

			case ButtonControls.NEXT:
				await int.update(this.pages[super.shift(1)]);
				break;

			case ButtonControls.LAST:
				this.page = this.pages.length - 1;
				await int.update(this.pages[this.pages.length - 1]);
				break;
		}
	}

	/**
	 * Handles end results of the collector
	 * @param collected the collection of button interactions
	 * @param reason the reason why the hell the collector has ended
	 */
	public async end(collected: Collection<Snowflake, ButtonInteraction>, reason: string) {
		const buttons = this.message.components.flatMap(row => row.components.filter(c => c.type === 'BUTTON')).map(c => c.setDisabled(true));
		await this.message.edit({ ...this.pages[this.page], components: [new MessageActionRow({ components: [...buttons] })] });
	}
}