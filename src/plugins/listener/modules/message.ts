import { Collection, TextChannel, Snowflake } from 'discord.js';
import { Listener, Context } from 'lava/index';

const donorQuestions = {
	'Bot Support': {
		Question: 'What do you wanna ask, e.g. latest updates, bot rules.',
		Problem: 'Please specify the number of problem.',
		Message: 'Any extra message for the developers?',
	},
	'Bug Report': {
		'Bug Occur location':
			'Please specify where the bug occured and include a message link.',
		'Reported?':
			"Is this bug already reported?",
		Message:
			'Any messages for the developers?',
	},
	'Server Support': {
		Problem: 'Please specify the problem. If this is a user report, send an image link.',
		Message: 'Any other messages for the Server Admins/Developers?',
	},
	'Server Feedback': {
		Problems: 'Is the server having problems and requires fixing?',
		Suggestions: 'Any suggestions on how to improve?',
		Message: 'Any messages for the Server Admins/Developers?'
	}
};

const donorTypes: { [t: number]: DonationType } = {
	1: 'Bot Support',
	2: 'Bug Report',
	3: 'Server Support',
	4: 'Server Feedback',
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
			'Bot Support': '801996041217376266',
			'Bug Report': '801996041217376266',
			'Server Support': '801996041217376266',
			'Server Feedback': '801996041217376266',
			donQ: '811077994886070273',
		};
	}

	get channels() {
		return {
			donation: '824944685344751616',
			donationCmds: '824213887004049458',
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
				await dm.send(`**Welcome to our interactive support menu!**\nI'll be asking you questions to assist you with your support query. You have 60 seconds for each question. Type \`cancel\` anytime to cancel. Type anything to continue.`)

				const firstRes = (await dm.awaitMessages(m => m.author.id === ctx.author.id, { max: 1, time: 60000 })).first();
				if (!firstRes || firstRes.content === 'cancel') return dm.send('Your support request has been cancelled.');

				const questionsArr = Object.keys(questions);
				let currentIndex = 0;

				const collect = async (question: string): Promise<boolean | Function> => {
					await dm.send(question);
					const donRes = (await dm.awaitMessages(m => m.author.id === ctx.author.id, { max: 1, time: 60000 })).first();

					if (!donRes || donRes.content === 'cancel') return false;
					res.set(questionsArr[currentIndex], donRes.content);
					currentIndex++;

					const next = questions[questionsArr[currentIndex]];
					return next ? await collect(next) : true;
				};

				const cols = await collect(questions[questionsArr[currentIndex]]);
				if (!cols) return dm.send('Your support request has been cancelled.');

				const donoChan = ctx.guild.channels.cache.get(this.channels.donationCmds as Snowflake) as TextChannel;
				const mngrRole = ctx.guild.roles.cache.get(this.roles[type]);

				await donoChan.send({
					content: `${mngrRole.toString()} ${ctx.author.toString()}`,
					allowedMentions: { roles: [mngrRole.id], users: [ctx.author.id] },
					embed: {
						description: res.map((v, k) => `**${k}:** ${v}`).join('\n'),
						title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
						color: 'RANDOM',
						footer: {
							text: `${ctx.author.tag} (${ctx.author.id})`,
							icon_url: ctx.author.avatarURL({ dynamic: true }),
						},
					},
				});

				await ctx.member.roles.add(this.roles.donQ);
				return dm.send(`You now have access to ${donoChan.toString()} to let our staff handle your support request. Thanks!`);
			} catch(error) {
				return dm.send({ embed: { 
					color: 'RED', 
					description: 'Something wrong occured :c'
				}});
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
