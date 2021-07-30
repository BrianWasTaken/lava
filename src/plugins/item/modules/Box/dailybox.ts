import { BoxItem } from '../..';

export default class Box extends BoxItem {
	constructor() {
		super('dailybox', {
			assets: {
				name: 'Daily Box',
				price: 0,
				intro: 'Do you grind daily?',
				info: 'A box of goodies for daily streakers!'
			},
			config: {
				buyable: false,
				shop: false,
			},
			contents: {
				coins: [1, 1000],
				items: [
					{ id: 'bacon', amount: [1, 3] },
					{ id: 'taco', amount: [1, 3] },
					{ id: 'beer', amount: [1, 3] },
					{ id: 'wine', amount: [1, 3] },
					{ id: 'computer', amount: [1, 3] },
				]
			}
		});
	}
}