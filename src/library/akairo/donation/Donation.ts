import { AbstractModule, AbstractModuleOptions } from 'lava/akairo';
import { DonationHandler } from '.';

export abstract class Donation extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: DonationHandler;
}