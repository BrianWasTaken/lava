import type { StoreOptions } from '@sapphire/framework';
import { Donation } from './Donation';
import { Store } from '@sapphire/framework';

/**
 * A store for all donation types.
 * @since 4.0.0
 */
export class DonationStore extends Store<Donation> {
	public constructor() {
		super(Donation, {
			name: 'donations',
		});
	}
}

declare module '@sapphire/pieces' {
	interface StoreRegistryEntries {
		donations: DonationStore;
	}
}