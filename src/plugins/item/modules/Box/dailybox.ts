import { BoxItem } from '../..';

export default class Box extends BoxItem {
	constructor() {
		super('dailybox', {
			assets: {
				name: 'Daily Box',
				price: 0,
				intro: 'Do you grind daily injections?',
				info: 'A box of goodies for daily streakers!'
			},
			config: {
				buyable: false,
				shop: false,
			},
			contents: {
				coins: [1000, 100000],
				items: [
					{ item: 'bacon', amount: [1, 100] },
					{ item: 'taco', amount: [1, 20] },
					{ item: 'beer', amount: [1, 30] },
					{ item: 'wine', amount: [1, 30] },
					{ item: 'computer', amount: [1, 10] },
				]
			}
		});
	}
}