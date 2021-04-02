import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

export default class ClientListener extends Listener {
  constructor() {
    super('lotto', {
      emitter: 'client',
      event: 'ready',
    });
  }

  async exec(): Promise<void> {
    return void 0;
  }
}