import { Command, Colors } from 'lava/index';
import { Message } from 'discord.js';
import { inspect } from 'util';

export default class extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			description: 'Run js code if u know whatchu doin duh',
			clientPermissions: ['EMBED_LINKS'],
			category: 'Developer',
			ownerOnly: true,
			args: [
				{
					id: 'code',
					match: 'content'
				}
			]
		});
	}

	codeblock(code: string, lang = 'js') {
		return `${'```'}${lang}\n${code}\n${'```'}`;
	}

	async exec(ctx: Message, args: { code: string }) {
		const { code } = args;
		if (!code) return;

		const isPromise = ['await', 'return'].some(kw => code.includes(kw));
		let before: number, evaled: string, time: number, type: string, token: RegExp;

		before = Date.now();
		try { evaled = await eval(isPromise ? `(async() => {${code}})()` : code); }
		catch(error) { evaled = error.message ?? 'Unknown Error'; }
		time = Date.now() - before;
		type = typeof evaled;

		if (type !== 'string') evaled = inspect(evaled, { depth: 0 });
		token = new RegExp(ctx.client.token, 'gi');
		evaled = evaled.replace(token, '*');

		return ctx.channel.send({ embeds: [{
			color: Colors.RED,
			description: this.codeblock(evaled),
			footer: { text: `Latency: ${time}ms` },
			fields: [{
				name: 'Return Type',
				value: this.codeblock(type),
			}],
		}]}).then(() => false);
	}
}