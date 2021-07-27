import { Spawn } from 'lava/index';

export default class extends Spawn {
	constructor() {
		super('crib', {
			display: {
				description: 'The babies are in need of milk!',
				title: 'Memers Crib',
				strings: ['bruh'],
				tier: SpawnTier.GODLY
			}, 
			config: {
				enabled: true,
				method: 'message',
				cooldown: 60e3, // do "nextPossibleRun" instead of timeout.
				duration: 10e3,
				odds: 5,
				maxEntries: 3,
				rewards: {
					coins: [1000, 10000],
					items: [
						{ id: 'card', odds: 0.3, amount: 1 }
					]
				}
			}
		});
	}
}