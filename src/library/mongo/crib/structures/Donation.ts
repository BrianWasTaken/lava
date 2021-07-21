import { LavaClient } from 'lava/index';
import { Structure } from 'lava/discord';

export class GiveawayDonation extends Structure {
	/**
	 * Amount of their donos.
	 */
	public amount: number;
	/**
	 * Times they donated.
	 */
	public times: number;
	/**
	 * The donation records.
	 */
	public records: number[];

	/**
	 * Constructor for this donation.
	 */
	public constructor(client: LavaClient, data: CribDonation) {
		super({ client, id: data.id });
		/** @type {number} */
		this.amount = data.amount;
		/** @type {number} */
		this.times = data.count;
		/** @type {number[]} */
		this.records = data.donations;
	}

	/**
	 * The donation module.
	 */
	get module() {
		return this.client.handlers.donation.modules.get(this.id);
	}
}