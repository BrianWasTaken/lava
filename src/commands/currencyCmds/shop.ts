import { Message, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Argument } from 'discord-akairo';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('shop', {
      aliases: ['shop', 'item'],
      channel: 'guild',
      description: 'View or buy something from the shop.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'query',
          type: (msg: MessagePlus, phrase: string) => {
            if (!phrase) return 1; // shop page
            const { resolver } = this.handler;
            return (
              resolver.type('number')(msg, phrase) ||
              resolver.type('shopItem')(msg, phrase)
            );
          },
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    { query }: { query: number | Item }
  ): Promise<string | MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const items = Handler.modules.array();
    const embed = new Embed();

    if (typeof query === 'number') {
      const shop = this.client.util.paginateArray(
        items
          .sort((a, b) => b.cost - a.cost)
          .map((i) => {
            const { emoji, cost, info } = i;
            return `**${emoji} ${
              i.name
            }** — [${cost.toLocaleString()}](https://discord.gg/memer)\n${info}`;
          }),
        5
      );

      if (query > shop.length) return "That page doesn't even exist lol";
      
      embed
        .setFooter(false, `Lava Shop — Page ${query} of ${shop.length}`)
        .addField('Shop Items', shop[(query as number) - 1].join('\n\n'))
        .setTitle('Lava Shop')
        .setColor('RANDOM');
    } else {
      if (!query)
        return "That item doesn't even exist in the shop what're you doing?";
      const data = await msg.author.fetchDB();
      const inv = data.items.find((i) => i.id === query.id);

      let info: string[] = [];
      info.push(
        `**Item Price** — ${
          query.buyable
            ? query.cost.toLocaleString()
            : '**cannot be purchased**'
        }`
      );
      info.push(
        `**Sell Price** — ${(query.sellable
          ? query.cost / 4
          : '**cannot be sold**'
        ).toLocaleString()}`
      );

      embed
        .setTitle(
          `${query.emoji} ${query.name} — ${inv.amount.toLocaleString()} Owned`
        )
        .addField('Description', query.info)
        .addField('Item Info', info.join('\n'))
        .setColor('RANDOM');
    }

    return { embed };
  }
}