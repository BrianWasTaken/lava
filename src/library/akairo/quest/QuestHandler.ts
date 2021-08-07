import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/akairo';
import { Quest } from '.';

export class QuestHandler extends AbstractHandler<Quest> {
	/**
	 * Construct a quest handler.
	 * @param client the client instance
	 * @param options the options for this quest handler
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}