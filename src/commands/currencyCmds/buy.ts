import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';
import Constants from '@lib/utility/constants';

export default class Currency extends Command {
  constructor() {
    super('buy', {
      aliases: ['buy', 'purchase'],
      channel: 'guild',
      description: 'Buy something from the shop.',
      category: 'Currency',
      cooldown: 5e3,
      args: [
        {
          id: 'item',
          type: 'shopItem',
        },
        {
          id: 'amount',
          type: 'number',
          default: 1,
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    args: {
      amount: number;
      item: Item;
    }
  ): Promise<string | MessageOptions> {
    const { amount = 1, item } = args;
    const { maxInventory } = this.client.config.currency;
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;
    const data = await msg.author.fetchDB();

    if (!item) return 'You need something to buy';

    let inv = data.items.find((i) => i.id === item.id);
    if (amount < 1) 
      return 'Imagine buying none.';
    if (!item.buyable) 
      return "You can't buy this item what?";
    if (data.pocket < item.cost)
      return "You're too broke to buy this item!";
    if (data.pocket < amount * item.cost)
      return "You don't have enough to buy this item on bulk!";
    if (inv.amount >= maxInventory)
      return `You already have enough of this item (${maxInventory.toLocaleString()} limit)!`;

    await Items.buy(Math.trunc(amount), data, item.id);
    this.client.handlers.quest.emit('itemBuy', { msg, item, amount });

    return { replyTo: msg.id, embed: {
      color: 'GREEN',
      description: Constants.ITEM_MESSAGES.SELL
        .replace(/{paid}/gi, (amount * item.cost).toLocaleString())
        .replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
        .replace(/{emoji}/gi, item.emoji)
        .replace(/{item}/gi, item.name),
      author: {
        name: 'Item Bought',
        iconURL: msg.author.avatarURL({ dynamic: true })
      },
    }};
  }
}
