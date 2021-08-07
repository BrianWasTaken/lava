import { LavaClient, AbstractHandler, AbstractHandlerOptions } from 'lava/akairo';
import { Donation } from '.';
import { Message } from 'discord.js';

export class DonationHandler extends AbstractHandler<Donation> {
	/**
	 * Construct a donation handler.
	 * @param client the discord.js client instance
	 * @param options the options for this donation handler
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);
	}
}