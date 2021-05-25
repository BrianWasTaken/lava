import { Quest } from 'lib/objects';

export default class Medium extends Quest {
	constructor() {
	    super('gift', {
			rewards: { coins: 5e4, item: [5, 'herb'] },
			target: [5e3, 'gift', 'shareItems'],
			difficulty: 'Medium',
			info: 'Gift 5,000 pieces of any item type to someone.',
			name: 'Gift It',
	    });
	}
}