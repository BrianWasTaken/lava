import { SubCommand} from 'lava/index';
import { Message } from 'discord.js';

export default class extends SubCommand {
	constructor() {
		super('pping', {
			aliases: ['pping', 'pp'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Partnership Ping role.',
			name: 'Partner Ping',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					default: 'Try this server!'
				}
			]
		});
	}

	async exec(ctx: Message, { msg }: { msg: string }) {
		const role = ctx.guild.roles.cache.get('857158450890801152');

		await ctx.delete();
		await ctx.channel.send({ 
			content: [`:handshake: ${role.toString()}`, msg].join('\n'), 
			allowedMentions: { roles: [role.id] },
		});

		return false;
	}
}