const { readdirSync } = require('fs');
const { join } = require('path');

const random = arr => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.run = async ctx => {
	ctx.on('message', async msg => {
		const { channel } = msg;
		const events = readdirSync(join(__dirname, '..', 'spawns'));
		const { config: {
			emoji, type, event, string,
			description, coins, color
		} } = require(join(__dirname, '..', 'spawns', random(events)));

		if (Math.random() < 0.75) return;

		/* First Message */
		const message = await channel.send([
			`**${emoji} ${type} \`ENCOUNTERED\`**`,
			`**${event}**`, description,
		].join('\n'));
		await channel.send(`Type \`${string}\``);
		const collected = new (require('discord.js').Collection)();
		const collector = await channel.createMessageCollector(
			m => (m.content.toLowerCase() === string.toLowerCase())
				&& !collected.has(m.author.id), {
			max: 1, time: 15000
		});

		/* Collector */
		collector
			.on('collect', async m => {
				if (collector.collected.first().id === m.id) {
					await m.channel.send(`\`${m.author.username}\` answered first!`);
				}
				
				await m.react('✅');
			})
			.on('end', async col => {
				if (col.size < 1) {
					await message.edit([
						message.content, 
						`**<:memerRed:729863510716317776> \`Nobody joined the event.\`**`
					].join('\n'));
				}

				let answerees = [];
				answerees = col.array()
				.filter(m => m.content.toLowerCase() === string.toLowerCase())
				.forEach(m => {
					answerees.push(
						`\`${m.author.username}\` grabbed **${randomNum(coins.min, coins.max).toLocaleString()}** coins`
					);
				});

				await channel.send({ embed: {
					author: { name: `Results for \`${event}\` event` },
					color: random(['#8bc34a', '#ef5350']),
					description: answerees.join('\n'),
					footer: {
						text: 'Please note this event is on experimental mode. You won\'t get the coins you won YET.'
					}
				}});
			});
	});
}