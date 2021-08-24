import type { StoreOptions } from '@sapphire/framework';
import { Store } from '@sapphire/framework';
import { Quest } from './Quest';

/**
 * Store for all quests.
 * @since 4.0.0
 */
export class QuestStore extends Store<Quest> {
	public constructor() {
		super(Quest, {
			name: 'quests'
		});
	}
}

declare module '@sapphire/pieces' {
	interface StoreRegistryEntries {
		quests: QuestStore;
	}
}