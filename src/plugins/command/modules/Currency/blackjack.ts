import { Context, Colors } from 'lava/index';
import { GambleCommand } from '../..';

export default class extends GambleCommand {
	constructor() {
		super('blackjack', {
			aliases: ['blackjack', 'bj', 'cards'],
			description: 'Play a game of cards! Warning, I\'m very good at stealing your coins.',
			name: 'Blackjack',
		});
	}

	async exec(ctx: Context, args: { amount: number | string }) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const bet = this.parseArgs(ctx, args, entry);
		if (typeof bet === 'string') return ctx.reply(bet).then(() => false);
		const state = this.checkArgs(bet, entry);
		if (typeof state === 'string') return ctx.reply(state).then(() => false);

		const faces = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
		const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

		let winnings = 0;
		let stood = false;
		let first = true;

		let cards = {
			bot: [deal(), deal()],
			user: [deal(), deal()],
		};

		while (addCards('user') === 21 || addCards('bot') === 21) {
			cards = {
				bot: [deal(), deal()],
				user: [deal(), deal()],
			};
		}

		function deal() {
			return {
				face: ctx.client.util.randomInArray(faces),
				suit: ctx.client.util.randomInArray(suits),
			};
		}

		function getRespectiveIcon(suit: string) {
			switch (suit) {
				case 'spades':
					return '♠';
				case 'hearts':
					return '♥';
				case 'diamonds':
					return '♦';
				case 'clubs':
					return '♣';
			}
		}

		function getValue(card: { face: string; suit: string }) {
			return { value: values[faces.indexOf(card.face)], card };
		}

		function addCards(type: 'bot' | 'user') {
			const aceCount = cards[type].filter((card) => card.face === 'A').length;
			let baseSum = cards[type].reduce((p, c) => p + getValue(c).value, 0);
			for (let i = 0; i < aceCount; i++) {
				baseSum += baseSum + 10 <= 21 ? 10 : 0;
			}
			return baseSum;
		}

		function score() {
			if (addCards('user') > 21) {
				// User busted
				return { result: false, emoji: 'nope', message: 'You lose! Busted!' };
			} else if (addCards('bot') > 21) {
				// Bot busted
				return {
					result: true,
					emoji: 'ok',
					message: 'You win! Your opponent busted!',
				};
			} else if (addCards('user') === 21) {
				// User has exactly 21
				return { result: true, emoji: 'ok', message: 'You win! You have 21!' };
			} else if (addCards('bot') === 21) {
				// Bot has exactly 21
				return {
					result: false,
					emoji: 'nope',
					message: 'You lose! Your opponent reached 21 before you!',
				};
			} else if (addCards('bot') === addCards('user') && stood) {
				// Tie
				return {
					result: null,
					emoji: 'empty',
					message: 'You tied with your opponent!',
				};
			} else if (addCards('user') <= 21 && cards.user.length === 5) {
				// User took more than 5 cards without going over 21
				return {
					result: true,
					emoji: 'ok',
					message: 'You win! You took 5 cards without going over 21.',
				};
			} else if (addCards('bot') <= 21 && cards.bot.length === 5) {
				// Bot took more than 5 cards without going over 21
				return {
					result: false,
					emoji: 'nope',
					message:
						'You lose! Your opponent took 5 cards without going above 21.',
				};
			} else if (addCards('bot') > addCards('user') && stood) {
				// If the bot has a score of 17 or more and the user has less than the bot, and the user is also stood
				return {
					result: false,
					emoji: 'nope',
					message: `You lose! You have ${addCards(
						'user'
					)}, Dealer has ${addCards('bot')}.`,
				};
			} else if (addCards('user') > addCards('bot') && stood) {
				// If the user has a higher score than the bot and they are
				return {
					result: true,
					emoji: 'nope',
					message: `You win! You have ${addCards(
						'user'
					)}, Dealer has ${addCards('bot')}.`,
				};
			} else {
				return addCards('user'); // else
			}
		}

		const gambed = async (final?: boolean): Promise<boolean> => {
			const status = score() as {
				result: boolean;
				emoji: string;
				message: string;
			};
			let state: string = '';
			let desc = '';
			if (status.constructor === Object) {
				const newEntry = await ctx.currency.fetch(ctx.author.id); // ugh don't really know else how to do this thanks to reversal
				if (bet > newEntry.props.pocket) {
					await newEntry.removePocket(bet).updateStats(this.id, bet, false).save();
					return ctx.reply(`What the hell man, you don't have the coins to cover this bet anymore??? I'm keeping your bet since you tried to SCAM ME.`).then(() => true);
				}
				let finalMsg = '';
				// Win
				if (status.result) {
					const multi = newEntry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0);
					winnings = this.calcWinnings(multi, bet);
					const pocket = await newEntry.addPocket(winnings).updateStats(this.id, winnings, true).save().then(d => d.props.pocket);
					finalMsg += `\nYou won **${winnings.toLocaleString()}**. You now have ${pocket.toLocaleString()}.`;
					state = 'winning';
				} else {
					// Tie
					if (status.result === null) {
						await newEntry.save();
						finalMsg += `\nYour wallet hasn't changed! You have **${entry.props.pocket.toLocaleString()}** still.`;
						state = 'tie';
					} else {
						// Loss
						const { pocket } = await newEntry.removePocket(bet).updateStats(this.id, bet, false).save().then(d => d.props);
						finalMsg += `\nYou lost **${Number(bet).toLocaleString()}**. You now have ${pocket.toLocaleString()}.`;
						state = 'losing';
					}
				}
				final = true;
				desc = `**${status.message}** ${finalMsg}`;
			}
			const satisfied = final;
			await ctx.channel.send({
				content: !final
					? `${first ? 'What do you want to do?\n' : ''
					}Type \`h\` to **hit**, type \`s\` to **stand**, or type \`e\` to **end** the game.`
					: null,
				embeds: [{
					author: {
						name: `${ctx.author.username}'s${state ? ` ${state} ` : ' '
							}blackjack game`,
						icon_url: ctx.author.avatarURL({ dynamic: true }),
					},
					color: final
						? status.result === null
							? Colors.ORANGE
							: winnings
								? Colors.GREEN
								: Colors.RED
						: 2533018,
					description: desc,
					fields: [
						{
							name: ctx.author.username,
							value: `Cards - **${cards.user
								.map(
									(card) =>
										`[\`${getRespectiveIcon(card.suit)} ${card.face
										}\`](https://google.com)`
								)
								.join('  ')}**\nTotal - \`${addCards('user')}\``,
							inline: true,
						},
						{
							// Always show the first card, all other cards are unknown until stood or final is called
							name: ctx.client.user.username,
							value: `Cards - **${cards.bot
								.slice(0, satisfied ? cards.bot.length : 2)
								.map((card, i) =>
									!i || satisfied
										? `[\`${getRespectiveIcon(card.suit)} ${card.face
										}\`](https://google.com)`
										: '`?`'
								)
								.join('  ')}**\nTotal - \`${satisfied ? addCards('bot') : ' ? '
								}\``,
							inline: true,
						},
					],
					footer: {
						text: !final
							? 'K, Q, J = 10  |  A = 1 or 11'
							: `Percent Won: ${Math.round((winnings / bet) * 100)}%`,
					},
				}],
			});
			first = false;
			if (final) return;
			const choice = await ctx.awaitMessage();
			if (!choice) {
				// No bank space for you bitch
				await entry.removePocket(bet).updateStats(this.id, bet, false).save();
				return ctx.reply("You ended the game since you didn't respond. The dealer is keeping your money to deal with your bullcrap.").then(() => true);
			}
			switch (choice.content.toLowerCase().slice(0, 1)) {
				case 'h':
					cards.user.push(deal());
					return gambed();
				case 's':
					stood = true;
					return dealersTurn(stood);
				case 'e':
					// You too, no space for you :P
					await entry.removePocket(bet).updateStats(this.id, bet, false).save();
					return ctx.reply('You ended the game. The dealer is keeping your money to deal with your bullcrap.').then(() => true);
				default:
					// You too, no space for you :P
					await entry.removePocket(bet).updateStats(this.id, bet, false).save();
					return ctx.reply('Ur an idiot you need to give a valid response. You lost your entire bet.').then(() => true);
			}
		};

		const dealersTurn = (end?: boolean): Promise<boolean> => {
			if (addCards('user') > 21) {
				return gambed();
			}
			const thoughts = [];
			if (cards.bot.length < 5) {
				if (addCards('bot') <= 16) {
					thoughts.push('Drawing.');
					cards.bot.push(deal());
				} else {
					thoughts.push('Standing.');
				}
				if (end) {
					return dealersTurn(cards.bot.length < 5 && addCards('bot') < 17);
				}
			}
			return gambed();
		};

		return gambed();
	}
}