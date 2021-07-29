import { Message, GuildMember } from 'discord.js';
import { SubCommand } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('daccess', {
			aliases: ['daccess', 'da'],
			clientPermissions: ['MANAGE_ROLES'],
			description: 'Add or remove the donation queue role.',
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
		const role = ctx.guild.roles.cache.get('715507078860505091');
		const hasRole = some1.roles.cache.has(role.id);
		await (hasRole ? some1.roles.remove(role.id) : some1.roles.add(role.id));
		await ctx.reply(`${hasRole ? 'Removed' : 'Added'} **${role.name}** from **${some1.user.tag}**.`);
		return false;
	}
}