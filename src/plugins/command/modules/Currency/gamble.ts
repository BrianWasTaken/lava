import { EmbedFieldData, User } from 'discord.js';
import { Colors } from 'lava/index';
import { GambleCommand } from '../..';
import { Message } from 'discord.js';

export default class extends GambleCommand {
	constructor() {
		super('gamble', {
			aliases: ['gamble', 'bet', 'roll'],
			description: 'Take your chances by rolling a dice! Warning, I\'m very good at stealing your coins.',
			name: 'Gamble',
		});
	}

	async exec(ctx: Message, args: { amount: string }) {
		const entry = await ctx.author.currency.fetch();
		const bet = GambleCommand.parseBet(entry, args.amount);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);

		const { userD, botD } = this.roll(false);
		if (botD > userD || botD === userD) {
			if (botD > userD) entry.updateStats(this.id, bet, false);
			const props = await entry.removePocket(botD === userD ? 0 : bet).save().then(d => d.props);

			return ctx.channel.send({
				embeds: [{
					author: {
						name: `${ctx.author.username}'s ${userD === botD ? 'tie' : 'losing'} gambling game`,
						iconURL: ctx.author.avatarURL({ dynamic: true })
					},
					color: Colors[userD === botD ? 'YELLOW' : 'RED'],
					description: [
						`You lost ${botD === userD ? 'nothing!' : `**${bet.toLocaleString()}** coins.`}\n`,
						botD === userD 
							? `You have **${props.pocket.toLocaleString()}** coins` 
							: `**New Balance:** ${props.pocket.toLocaleString()}` 
					].join('\n'),
					fields: this.displayField(ctx.author, userD, botD),
					footer: {
						text: 'sucks to suck'
					},
				}]
			}).then(() => true);
		}

		const multi = GambleCommand.getMulti(ctx, entry);
		const winnings = GambleCommand.getWinnings(multi, bet, true, entry.effects.payouts);
		const { props } = await entry.addPocket(winnings).updateStats(this.id, winnings, true).save();

		return ctx.channel.send({
			embeds: [{
				author: { 
					name: `${ctx.author.username}'s winning gambling game`,
					iconURL: ctx.author.avatarURL({ dynamic: true })
				},
				footer: { text: 'winner winner' }, color: Colors.GREEN, description: [
					`You won **${winnings.toLocaleString()}** coins.\n`,
					`**Percent Won:** ${Math.round(winnings / bet * 100)}%`,
					`**New Balance:** ${props.pocket.toLocaleString()}`
				].join('\n'), fields: this.displayField(ctx.author, userD, botD),
			}]
		}).then(() => true);
	}

	roll(rig = true, add = 0) {
		const { randomNumber } = this.client.util;
		let userD = randomNumber(1, 12);
		let botD = randomNumber(1, 12);

		/**
		 * Rig the dice because why not >:)
		 */
		function set(a: number, b: number) {
			return a > b ? [b, a] : [a, b];
		}

		if (rig) {
			if (Math.random() > 0.45) {
				[botD, userD] = set(botD, userD);
			} else {
				[userD, botD] = set(botD, userD);
			}
		}

		return { botD, userD: userD + add };
	}

	displayField({ username, client }: User, userD: number, botD: number): EmbedFieldData[] {
		const fields = {
			[username]: `Rolled a \`${userD}\``,
			[client.user.username]: `Rolled a \`${botD}\``
		};

		return Object.entries(fields).map(([name, value]) => ({ inline: true, name, value }));
	}
}