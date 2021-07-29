import { Command} from 'lava/index';

export default class extends Command {
	constructor() {
		super('sudo', {
			name: 'Sudo',
			aliases: ['sudo'],
			ownerOnly: true
		});
	}
}