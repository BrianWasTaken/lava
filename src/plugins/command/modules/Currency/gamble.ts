import { Context, UserPlus } from 'lava/index';
import { EmbedFieldData } from 'discord.js';
import { GambleCommand } from '../..';

export default class extends GambleCommand {
	constructor() {
		super('gamble', {
			aliases: ['gamble', 'bet', 'roll'],
			description: 'Take your chances by rolling a dice! Warning, I\'m very good at stealing your coins.',
			name: 'Gamble',
		});
	}

	async exec(ctx: Context, args: { amount: number | string }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state).then(() => false);

		const { userD, botD } = this.roll(false);
		if (botD > userD || botD === userD) {
			const lost = botD === userD ? 0 : bet;
			if (botD > userD) entry.updateStats(this.id, lost, false);
			const props = await entry.removePocket(lost).save().then(d => d.props);

			return ctx.channel.send({
				embeds: [{
					author: {
						name: `${ctx.author.username}'s ${userD === botD ? 'tie' : 'losing'} gambling game`,
						iconURL: ctx.author.avatarURL({ dynamic: true })
					},
					color: userD === botD ? 'YELLOW' : 'RED',
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

		const multi = this.calcMulti(ctx, entry);
		const winnings = this.calcWinnings(multi, bet);
		const { props } = await entry.addPocket(winnings).updateStats(this.id, winnings, true).save();

		return ctx.channel.send({
			embeds: [{
				author: { 
					name: `${ctx.author.username}'s winning gambling game`,
					iconURL: ctx.author.avatarURL({ dynamic: true })
				},
				footer: { text: 'winner winner' }, color: 'GREEN', description: [
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

	displayField({ username, client }: UserPlus, userD: number, botD: number): EmbedFieldData[] {
		const fields = {
			[username]: `Rolled a \`${userD}\``,
			[client.user.username]: `Rolled a \`${botD}\``
		};

		return Object.entries(fields).map(([name, value]) => ({ inline: true, name, value }));
	}
}