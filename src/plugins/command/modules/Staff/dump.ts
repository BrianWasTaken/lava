import { SubCommand} from 'lava/index';
import { Role, Message } from 'discord.js';

export default class extends SubCommand {
	constructor() {
		super('dump', {
			aliases: ['dump'],
			description: 'View the list of people who has a specific role.',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} <role_name>',
			args: [
				{
					id: 'role',
					type: 'role',
				}
			]
		});
	}

	async exec(ctx: Message, { role }: { role: Role }) {
		if (!role || role.members.size < 1) {
			await ctx.reply('No members to dump.');
			return false;
		}

		const idiots = role.members.map(member => `${member.user.tag} (${member.user.id})`);
		await ctx.channel.send(idiots.join('\n'));
		return false;
	}
}