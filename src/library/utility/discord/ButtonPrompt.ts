import { Message, ButtonInteraction, InteractionCollector, MessageButton, Collection, Snowflake, MessageActionRow } from 'discord.js';
import { Prompt, PromptChoice, PromptOptions, PromptChoicePredicate } from './interfaces/Prompt';

interface ButtonPromptOptions extends PromptOptions<ButtonInteraction, []> {
	/**
	 * The message to handle for selective purposes.
	 */
	message: Message;
}

class ButtonPrompt extends Prompt<ButtonInteraction, []> {
	/**
	 * The collector to handle this prompt.
	 */
	public collector: InteractionCollector<ButtonInteraction>;
	/**
	 * The message to handle for selective purposes.
	 */
	public message: Message;

	/**
	 * The constructor for this button prompt.
	 * @param options the options for this button prompt
	 */
	public constructor(options: ButtonPromptOptions) {
		super(options);
		this.message = options.message;
		super.bind(this.collector = options.message.createMessageComponentCollector<ButtonInteraction>({
			filter: async int => int.user.id === this.user.id && (await options.filter(int)), 
			dispose: true,
			time: 30000, 
			max: 1
		}));
	}

	/**
	 * Handles incoming button interactions emitted by the collector.
	 * @param int the button interaction collected by the collector.
	 */
	public async collect(int: ButtonInteraction) {
		const choice = this.choices.find(c => c.response.includes(int.customId));
		if (!choice) return;

		if (!(await choice.predicate.call(this, int))) {
			await this.collector.handleDispose(int);
		}
	}

	/**
	 * Handles the collected elements by the collector.
	 * @param collected the collection of button interactions collected by the collector. Yes. That's a shit ton of collects.
	 * @param reason the reason why the collector killed itself
	 */
	public async end(collected: Collection<Snowflake, ButtonInteraction>, reason: string) {
		const buttons = this.message.components.flatMap(r => r.components.filter(c => c.type === 'BUTTON')) as MessageButton[];
		const selected = buttons.find(btn => btn.customId === collected.first()?.customId) ?? null;
		await this.message.edit({ 
			components: [new MessageActionRow().addComponents(...buttons.map(btn => btn.setDisabled(true)).map(btn => {
				return btn.customId === selected?.customId ? btn.setStyle('SUCCESS') : btn;
			}))]
		});
	}
}