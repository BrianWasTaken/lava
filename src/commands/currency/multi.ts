import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import config from 'config/index' ;
import { Embed } from 'lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('multi', {
      aliases: ['multiplier', 'multi'],
      channel: 'guild',
      description: 'View your current multipliers.',
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'page',
          type: 'number',
          default: 1,
        },
      ],
    });
  }

  public async exec(
    ctx: Context<{ page: number }>
  ): Promise<string | MessageOptions> {
    const { maxMulti } = config.currency;
    const { utils } = this.client.db.currency;
    const { util } = this.client;
    const { page } = ctx.args;
    const multi = utils.calcMulti(ctx.client, ctx, (await ctx.db.fetch()).data);

    const multis = util.paginateArray(multi.unlocked, 5);
    if (page > multis.length) return "That page doesn't exist.";

    const embed: Embed = new Embed()
      .addField(
        `Total Multi — ${multi.total >= maxMulti ? maxMulti : multi.total}%`,
        multis[page - 1].join('\n')
      )
      .setAuthor(
        `${ctx.member.user.username}'s multipliers`,
        ctx.author.avatarURL({ dynamic: true })
      )
      .setFooter(
        false,
        `${multi.unlocked.length}/${multi.multis} active — Page ${page} of ${multis.length}`
      )
      .setColor('BLURPLE');

    return { embed };
  }
}