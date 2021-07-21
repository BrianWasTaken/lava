import { Collection, TextChannel, Snowflake } from 'discord.js';
import { Listener, Context } from 'lava/index';

const donorQuestions = {
	giveaway: {
		Giveaway: 'What do you wanna giveaway?',
		Winners: 'Please specify the number of winners.',
		Duration: 'What is the duration of this giveaway?',
		Requirement: 
		'What should be the requirement for this giveaway? Type none if none.',
		Message: 'Any extra message or comments for your giveaway?',
	},
	event: {
		'Event Type':
			'What type of event do you wanna host?\nlast to leave, fish/hunt event, race event, or other assorted events.',
		Winners:
			"If your type of event requires a giveaway bot, please tell us the number of winners. Type none otherwise.",
		Donation:
			'What do you want the winners to receive? Any items or coin amount.',
	},
	heist: {
		Amount: 'How much coins you wanna sponsor?',
		Requirement: 'What should be the requiement? Type none if none.',
	},
	nitro: {
		Type: 'Is it nitro full or classic?',
		Winners: 'How many winners?',
		Requirement: 'What requirement?',
		Duration: 'What is the duration for this nitro giveaway?'
	}
};

const donorTypes: { [t: number]: DonationType } = {
	1: 'giveaway',
	2: 'event',
	3: 'heist',
	4: 'nitro',
};

type DonationType = keyof typeof donorQuestions;

export default class extends Listener {
	constructor() {
		super('message', {
			category: 'Client',
			emitter: 'client',
			event: 'message',
			name: 'Message',
		});
	}

	get roles() {
		return <{ [role: string]: Snowflake }> {
			giveaway: '692892567787929691',
			heist: '697007407011725312',
			event: '697007407011725312',
			nitro: '692892567787929691',
			donQ: '715507078860505091',
		};
	}

	get channels() {
		return {
			donation: '818667160918425630',
			donationCmds: '691596367776186379',
		}
	}

	async handleDonation(ctx: Context) {
		if (ctx.channel.id !== this.channels.donation) return;

		const type = donorTypes[Number(ctx.content)];
		if (ctx.author.bot) return;
		if (!type) return ctx.delete();

		await ctx.delete().catch(() => {});

		try {
			const dm = await ctx.author.createDM();
			const res = new Collection<string, string>();
			try {
				const questions: { [q: string]: string } = donorQuestions[type];
				await dm.send(`**Welcome to our interactive donation menu!**\nI'll be asking you questions to assist you with your giveaway. You have 60 seconds for each question. Type \`cancel\` anytime to cancel. Type anything to continue.`)

				const firstRes = (await dm.awaitMessages({ filter: m => m.author.id === ctx.author.id, max: 1, time: 60000 })).first();
				if (!firstRes || firstRes.content === 'cancel') return dm.send('Your dono has been cancelled.');

				const questionsArr = Object.keys(questions);
				let currentIndex = 0;

				const collect = async (question: string): Promise<boolean | Function> => {
					await dm.send(question);
					const donRes = (await dm.awaitMessages({ filter: m => m.author.id === ctx.author.id, max: 1, time: 60000 })).first();

					if (!donRes || donRes.content === 'cancel') return false;
					res.set(questionsArr[currentIndex], donRes.content);
					currentIndex++;

					const next = questions[questionsArr[currentIndex]];
					return next ? await collect(next) : true;
				};

				const cols = await collect(questions[questionsArr[currentIndex]]);
				if (!cols) return dm.send('Your dono has been cancelled.');

				const donoChan = ctx.guild.channels.cache.get(this.channels.donationCmds as Snowflake) as TextChannel;
				const mngrRole = ctx.guild.roles.cache.get(this.roles[type]);

				await donoChan.send({
					content: `${mngrRole.toString()} ${ctx.author.toString()}`,
					allowedMentions: { roles: [mngrRole.id], users: [ctx.author.id] },
					embeds: [{
						description: res.map((v, k) => `**${k}:** ${v}`).join('\n'),
						title: `${type.charAt(0).toUpperCase() + type.slice(1)} Donation`,
						color: ctx.client.util.randomColor(),
						footer: {
							text: `${ctx.author.tag} (${ctx.author.id})`,
							icon_url: ctx.author.avatarURL({ dynamic: true }),
						},
					}],
				});

				await ctx.member.roles.add(this.roles.donQ);
				return dm.send(`You now have access to ${donoChan.toString()} to let our staff handle your donation. Thanks!`);
			} catch(error) {
				return dm.send({ embeds: [{ 
					color: 'RED', 
					description: 'Something wrong occured :c'
				}]});
			}
		} catch {
			const msg = await ctx.channel.send(`${ctx.author} open your DMs.`);
			return ctx.client.util.sleep(5000).then(() => msg.delete());
		}
	}

	exec(ctx: Context) {
		this.handleDonation(ctx);
	}
}