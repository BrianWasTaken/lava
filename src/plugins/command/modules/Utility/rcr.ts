import { Message, MessageButton, MessageActionRow, ButtonInteraction } from 'discord.js';
import { Command } from 'lava/index';

export default class extends Command {
	constructor() {
		super('rcr', {
			aliases: ['rcr'],
			clientPermissions: ['MANAGE_ROLES'],
			cooldown: 1000 * 60,
			description: 'Change the daily random color role to a random color.',
			userPermissions: ['MANAGE_ROLES'],
		});
	}

	async exec(ctx: Message) {
		const rcr = ctx.guild.roles.resolve('716344676634066964') ?? await ctx.guild.roles.fetch('716344676634066964', { force: true });
		const firstColor = ctx.client.util.randomColor();

		const btns = ['Yes', 'No'].map(label => new MessageButton({
			label, customId: label.toLowerCase(), style: 'SECONDARY'
		}));
		const components = [new MessageActionRow({ components: btns })];
		const msg = await ctx.reply({ 
			components, embeds: [{
				title: 'Do you like this color?',
				color: firstColor
			}]
		});

		const disabledStates = [new MessageActionRow({
			components: [...msg.components.flatMap(row => 
				row.components.filter(c => c.type === 'BUTTON')
			).map(btn => btn.setDisabled(true))]
		})];

		const prompt = async (color: number): Promise<boolean | number | Function> => {
			const choice = await msg.awaitMessageComponent<ButtonInteraction>({
				time: 10000, filter: int => int.user.id === ctx.author.id
			}).catch(() => {});

			if (!choice) {
				await msg.edit({ 
					components: disabledStates, 
					embeds: msg.embeds.map(e => ({
						title: 'You should answer the question next time.',
						color: null
					})) 
				});
				return false;
			}

			switch(choice.customId) {
				case 'no':
					await msg.edit({ components, embeds: msg.embeds.map(e => ({ ...e, color })) });
					return prompt(ctx.client.util.randomColor());
				case 'yes':
					return color;
			}
		};

		const color = await prompt(firstColor);
		if (!color) return false;
		await rcr.edit({ color: color as number }).catch(() => {});
		await msg.edit({ components: disabledStates, embeds: [{ color: color as number, title: 'Color changed, enjoy!' }] });
		return true;
	}
}