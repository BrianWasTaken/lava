/**
 * Literally all important things i don't wanna type as always :rolling_eyes:
 * @author BrianWasTaken
*/

import { Constants } from 'discord.js';
import { Item } from 'lava/index';

/**
 * Colors for discord.js
*/
const Colors: { [color: string]: number } = {
	...Constants.Colors,
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
	PRESTIGE_LEVEL_REQ_CAP: 10,
	PRESTIGE_MULTI_VALUE: 2, 
	PRESTIGE_POCKET_REQ: 150000,
	PRESTIGE_LEVEL_REQ: 10,
	MAX_SAFE_POCKET: 1000e6,
	MAX_INVENTORY: 100000,
	MAX_PRESTIGE: 1000,
	MAX_POCKET: 50000000,
	MAX_LEVEL: 1000,
	MAX_MULTI: 100,
	MAX_WIN: 600001,
	MAX_BET: 250000,
	MIN_BET: 50,
	XP_COST: 100,
};

/**
 * Spawner stuff.
 */
const Spawner = {
	UNPAIDS_CAP: 100000,
	COOLDOWN: 60000,
};

/**
 * Item messages.
*/
const ItemMessages = {
	BUY_MSG: (item: Item, paid: number, amount: number) => `Successfully purchased **${amount.toLocaleString()} ${item.emoji} ${item.name}** and paid ** ${paid.toLocaleString()}** ${item.premium ? 'keys' : 'coins'}.`,
	SELL_MSG: (item: Item, got: number, amount: number) => `Successfully sold **${amount.toLocaleString()} ${item.emoji} ${item.name}** for ** ${got.toLocaleString()}** ${item.premium ? 'keys' : 'coins'}.`,

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

/**
 * Dank Memer old emojis.
 */
const Emojis = {
	SQUARE_RED: '<:memerRed:729863510716317776>',
	SQUARE_BLUE: '<:memerBlue:729863510330310727>',
	SQUARE_GOLD: '<:memerGold:753138901169995797>',
	SQUARE_GREEN: '<:memerGreen:729863510296887398>',
};

export { Emojis, Colors, Currency, Spawner, ItemMessages };