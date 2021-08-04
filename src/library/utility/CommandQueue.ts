/**
 * "AsyncQueue" from @sapphire but modified.
 * Awaits for another command to finish before running another command.
 * @author BrianWasTaken
*/

/**
 * Queue data for a command.
*/
interface QueueData {
	/**
	 * The promise of nothing.
	 */
	promise: Promise<void>;
	/**
	 * The resolve function from this data.
	 */
	resolve: Function;
}

/**
 * Object of queues.
 * User.id to QueueData
 */
type Queues = {
	[id: string]: QueueData[];
}

export class CommandQueue {
	/**
	 * The object of queues.
	 */
	public queues: Queues = {};

	/**
	 * Wait a command to resolve.
	 */
	public wait(id: string) {
		if (!this.queues[id] || this.queues[id].length < 1) this.queues[id] = [];
		const next = this.queues[id].length ? this.queues[id][this.queues[id].length - 1].promise : Promise.resolve();
		let resolve; const promise = new Promise<void>(res => { resolve = res });
		this.queues[id].push({ promise, resolve });
		return next;
	}

	/**
	 * Resolve the current item.
	 */
	public next(id: string) {
		const next = this.queues[id].shift();
		if (typeof next !== 'undefined') next.resolve();
	}
}