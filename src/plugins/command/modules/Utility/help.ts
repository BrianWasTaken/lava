import { Collection, Message } from 'discord.js';
import { Argument, Category } from 'discord-akairo';
import { Command, Context } from 'lava/index';

export default class extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'cmd'],
			description: 'View specific info about a certain command or just view \'em all',
			name: 'Help',
			args: [
				{
					id: 'query',
					default: null,
					type: Argument.union('command', 'commandAlias')
				}
			]
		});
	}

	exec(ctx: Context, { query }: { query: Command }) {
		if (query instanceof Command) {
			return ctx.channel.send({ embeds: [{
				title: `${query.name} Command`,
				color: ctx.guild.me.roles.highest?.color,
				fields: [
					{ name: 'Description', value: query.description as unknown as string ?? 'No description provided.' },
					{ name: 'Triggers', value: `\`${query.aliases.join('`, `')}\`` },
					{ name: 'Cooldown', value: `Normie: ${ctx.client.util.parseTime(query.cooldown / 1000, true)}` },
					{ name: 'Permissions', value: `\`${['SEND_MESSAGES'].concat(query.userPermissions as string[] ?? []).join('\n')}\`` }
				]
			}]}).then(() => false);
		}

		return ctx.channel.send({ embeds: [{
			thumbnail: { url: ctx.client.user.avatarURL() },
			title: `${ctx.client.user.username} Commands`,
			color: ctx.guild.me.roles.highest.color,
			fields: this.handler.categories
				.map((category, key) => {
					return { commands: [...category.values()], category: key }
				})
				.map(({ commands, category }) => ({
					name: `${category} Commands • ${commands.length}`,
					value: `\`${commands.map(c => c.aliases[0]).join('`, `')}\``
				})),
			footer: {
				text: `${this.handler.modules.size.toLocaleString()} Total Commands`,
				iconURL: ctx.client.user.avatarURL()
			}
		}]}).then(() => false);
	} 
}