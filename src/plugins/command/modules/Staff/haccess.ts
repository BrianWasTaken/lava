import { Message, GuildMember } from 'discord.js';
import { SubCommand } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('haccess', {
			aliases: ['haccess', 'ha'],
			clientPermissions: ['MANAGE_ROLES'],
			description: 'Add or remove the heist sponsor role.',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [some1]',
			args: [
				{
					id: 'some1',
					type: 'member',
					default: (ctx: Message) => ctx.member
				}
			]
		});
	}

	async exec(ctx: Message, { some1 }: { some1: GuildMember }) {
		await ctx.channel.send(`${some1.user.tag} - heist channel access`);
		return false;
	}
}