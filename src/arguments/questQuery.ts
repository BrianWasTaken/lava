import { ArgumentTypeCaster } from 'discord-akairo';
import { Context } from 'lib/extensions/message';
import { Quest } from 'lib/handlers/quest';

export default { type: 'questQuery', fn: ((ctx: Context, args: string): string | Quest => {
	if (!args || args.length <= 2) return null; // dm update regarding arg searches
	if (['stop', 'check', 'list'].some(c => {
		return args.toLowerCase() === c;
	})) { return args; }

	const { modules } = ctx.client.handlers.quest;
	const mod = modules.get(args.toLowerCase());

	let found: Quest;
	if (!found) {
		found = modules.find(mod => [mod.name, mod.id]
		.map(things => things.toLowerCase())
		.includes(args.toLowerCase()));
	}

	return mod || found || null;
}) as ArgumentTypeCaster };