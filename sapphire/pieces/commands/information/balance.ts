import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageEmbed } from 'discord.js';
import { Command } from '#core/index';

@ApplyOptions<CommandOptions>({
	aliases: ['bal'],
	description: 'View the amount of coins you currently have.',
	name: 'balance',
	runIn: ['GUILD_TEXT', 'DM'],
	cooldownDelay: 10000,
	cooldownLimit: 3,
})
export default class extends Command {
	public async run(msg: Message, args: Args) {
		const user = await args.pick('user').catch(() => msg.author);
		const { pocket, vault, space } = (await msg.client.db.users.fetch(user.id)).data.props;
		
		const balance = new MessageEmbed()
			.setTitle(`${msg.author.username}'s balance`)
			.setFooter('imagine being rich')
			.setDescription([
				`**Wallet**: ${pocket.toLocaleString()}`,
				`**Bank**: ${vault.toLocaleString()}/${space.toLocaleString()} \`(${((vault / space) * 100).toFixed(1)}%)\``
			].join('\n'));

		return msg.channel.send({ embeds: [balance] });
	}
}