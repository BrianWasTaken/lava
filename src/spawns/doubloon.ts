import { SpawnConfig, SpawnVisuals } from 'discord-akairo'

export const config: SpawnConfig = {
	odds: 3,
	cooldown: (member) => {
		// "Crib Booster" role
		if (member.roles.cache.has('693324853440282654')) return 15;
		// "Donator #M+" roles (minimum)
		if (member.roles.cache.has('768858996659453963')) return 20;
		// "Mastery #" roles (minimum)
		if (member.roles.cache.has('794834783582421032')) return 25;
		// "Amari #" roles (minimum)
		if (member.roles.cache.has('693380605760634910')) return 30;
		// Else
		return 60;
	},
	enabled: true,
	timeout: 15000,
	entries: 1,
	rewards: {
		min: 500000,
		max: 500000
	} 
}

export const visuals: SpawnVisuals = {
	emoji: '<:memerGold:753138901169995797>',
	type: 'GODLY',
	title: 'Gold Doubloon',
	description: 'wow a very rare event themks',
	strings: [
		'gold', 'dis serber op', 'gg', 'what\'s the prize?',
		'how much tho', 'you got to be kidding me', 
		'peter piper picked a pack of pickled pepper',
		'a pack of pickled peper peter piper picked',
		'spill the beans of the jelly beans'
	]
}
