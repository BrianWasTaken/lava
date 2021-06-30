/**
 * Literally all important things i don't wanna type as always :rolling_eyes:
 * @author BrianWasTaken
*/

import { Item } from 'lava/index';

/**
 * Colors for discord.js
*/
const Colors: { [color: string]: number } = {
	// RED: 0xf44336,
	RED: 0xFF5050,
	ORANGE: 0xff9800,
	YELLOW: 0xffeb3b,
	GREEN: 0x4caf50,
	BLUE: 0x2196f3,
	INDIGO: 0x3f51b5,
	VIOLET: 0x9c27b0,
	PINK: 0xe91e63,
	DEEP_PURPLE: 0x673ab7,
	LIGHT_BLUE: 0x03a9f4,
	CYAN: 0x00bcd4,
	TEAL: 0x009688,
	LIGHT_GREEN: 0x8bc34a,
	LIME: 0xcddc39,
	AMBER: 0xffc107,
	DEEP_ORANGE: 0xff5722,
};

/**
 * Gambling and other currency limits
*/
const Currency = {
	PRESTIGE_MULTI_VALUE: 2, 
	PRESTIGE_POCKET_REQ: 250000,
	PRESTIGE_LEVEL_REQ: 25,
	MAX_SAFE_POCKET: 100e6,
	MAX_INVENTORY: 100000,
	MAX_PRESTIGE: 3000,
	MAX_POCKET: 50000000,
	MAX_LEVEL: 1000,
	MAX_MULTI: 100,
	MAX_WIN: 1600001,
	MAX_BET: 500000,
	MIN_BET: 10,
};

/**
 * Gamble messages. 
*/
const GambleMessages = {
	IS_NAN: 'It needs to be a real number yeah?',
	NO_ARGS: 'You need something to play!',
	TOO_RICH: 'You are too rich to play!',
	NO_COINS: 'You have no coins to play for RIP',
	BET_IS_NAN: 'It should be a positive number yeah?',
	BET_IS_LOWER: `You can't bet lower than **${Currency.MIN_BET.toLocaleString()}**, sorry not sorry`,
	BET_IS_HIGHER: `You can't bet higher than **${Currency.MAX_BET.toLocaleString()}** coins :rage:`,
	BET_HIGHER_POCKET: (pocket: number) => `You only have **${pocket.toLocaleString()}** coins lol don't try and lie to me hoe`,
};

/**
 * Item messages.
*/
const ItemMessages = {
	BUY_MSG: (item: Item, paid: number, amount: number) => `Successfully purchased **${amount.toLocaleString()} ${item.emoji} ${item.name}** and paid **:${item.premium ? 'key' : 'coin'}: ${paid.toLocaleString()}** ${item.premium ? 'keys' : 'coins'}.`,
	SELL_MSG: (item: Item, got: number, amount: number) => `Successfully sold **${amount.toLocaleString()} ${item.emoji} ${item.name}** and got **:${item.premium ? 'key' : 'coin'}: ${got.toLocaleString()}** ${item.premium ? 'keys' : 'coins'}.`,

	// Buy Command
	AMOUNT_CAP: `R u really going to buy more than ${Currency.MAX_INVENTORY.toLocaleString()} of these?`,
	NEED_TO_BUY: 'You need something to buy!',
	BROKE_TO_BUY: "You don't have enough coins to buy this item!",
	NOT_BUYABLE: "You can't buy this item :thinking:",
	NOT_BUYABLE_BULK: "You don't have enough coins to buy this item for bulk!",
	AMOUNT_BELOW_ONE: 'Your amount has to be a real number greater than 0',
	INVENTORY_IS_FULL: `You already have more than ${Currency.MAX_INVENTORY.toLocaleString()} of this item!`,

	// Sell Command
	NEED_TO_SELL: 'You need something to sell!',
	NOT_SELLABLE: "You can't sell this item :thinking:",
	SELLING_NONE: "C'mon man, don't make yourself sell nothing.",
	CANT_FOOL_ME: (thiss: number) => `Hey you only have ${thiss} of these!`,
}

export { Colors, Currency, GambleMessages, ItemMessages };