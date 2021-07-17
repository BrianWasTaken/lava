import { Command, Context, GuildMemberPlus } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('airpods', {
			aliases: ['airpods'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Airpods',
			args: [
				{ 
					id: 'member', 
					type: 'member', 
					default: (c: Context) => c.member 
				},
			],
		});
	}

	exec(ctx: Context, { member }: { member: GuildMemberPlus }) {
		const params = new URLSearchParams();
		params.set('avatar1', member.user.avatarURL({ format: 'png' }));
		
		return ctx.client.memer.generate('airpods', params, 'gif')
			.then(g => ctx.channel.send(g))
			.then(() => false);
	}
}