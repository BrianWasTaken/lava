import { SubCommand, GuildMemberPlus, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('eaccess', {
			aliases: ['eaccess', 'ea'],
			clientPermissions: ['MANAGE_ROLES'],
			description: 'Add or remove the events access role.',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [some1]',
			args: [
				{
					id: 'some1',
					type: 'member',
					default: (ctx: Context) => ctx.member
				}
			]
		});
	}

	async exec(ctx: Context, { some1 }: { some1: GuildMemberPlus }) {
		await ctx.channel.send(`${some1.user.tag} - events chan access`);
		return false;
	}
}