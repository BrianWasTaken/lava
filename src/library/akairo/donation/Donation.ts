import { AbstractModule, AbstractModuleOptions } from 'lava/akairo';
import { DonationHandler } from '.';

export interface DonationOptions extends AbstractModuleOptions {
	/**
	 * The weekly coins target because nice.
	 */
	weeklyTarget?: number;
}

export abstract class Donation extends AbstractModule {
	/**
	 * The handler this agrument belongs to.
	 */
	public handler: DonationHandler;
	/**
	 * The weekly amount to target or else demote.
	 */
	public weeklyTarget: number;

	public constructor(id: string, options: DonationOptions) {
		super(id, options);
		/** @type {number} */
		this.weeklyTarget = options.weeklyTarget ?? 0;
	}
}