import 'module-alias/register';
import 'dotenv/config';

import Lava from './client';

Lava.on('debug', m => {
	Lava.console.debug('Client', m);
});

Lava.db.connect(process.env.MONGO_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

Lava.handlers.argument.addTypes(Lava.handlers.command);
Lava.login(process.env.DISCORD_TOKEN);