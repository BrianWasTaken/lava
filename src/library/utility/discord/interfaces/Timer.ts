import { EventEmitter } from 'events';
import { Awaited } from 'discord.js';

export enum TimerTypes {
	INTERVAL = 'INTERVAL', // emits 'tick', 'start', and 'end'
	STATIC = 'STATIC', // only emits 'start' and 'end'
};

/**
 * Options to pass to the timer's constructor.
 */
export interface TimerOptions {
	/**
	 * The possible interval of this timer to re-tick.
	 */
	tickInterval?: number;
	/**
	 * The fricking wait time to end this timer.
	 */
	duration: number;
	/**
	 * Wether to start the timer immediately after instantiation.
	 */
	start?: boolean;
	/**
	 * The gender of this timer.
	 */
	type?: TimerTypes;
}

/**
 * The timer events.
 */
export interface TimerEvents {
	/**
	 * Emitted when the timer has started.
	 */
	start: [expiration: number, isRestart: boolean];
	/**
	 * Emitted when you itch the itchy part.
	 */
	tick: [remaining: number];
	/**
	 * Emitted when you end the timer's life :(
	 */
	end: [reason: string];
}

export declare interface Timer extends EventEmitter {
	/**
	 * Call this method to listen for that certain event.
	 * @param event the event to listen for
	 * @param listener the function to run when the event is emitted
	 */
	on<E extends keyof TimerEvents>(event: E, listener: (...args: TimerEvents[E]) => Awaited<void>): this;
	/**
	 * Emit a certain event calling all listeners at once.
	 * @param event the event to emit
	 * @param args the parameters to pass
	 */
	emit<E extends keyof TimerEvents>(event: E, ...args: TimerEvents[E]): boolean;
}

export abstract class Timer extends EventEmitter {
	/**
	 * The timeout handler.
	 */
	private _timeout: NodeJS.Timeout = null;
	/**
	 * The timestamp of when this timer ticked the last.
	 */
	private _lastTick: number;
	/**
	 * The expiration timestamp of this timer.
	 */
	private _expire: number;
	/**
	 * The interval (in ms) to emit 'tick'.
	 */
	public tickInterval: number;
	/**
	 * The type of this timer.
	 */
	public timerType: TimerTypes;
	/**
	 * The duration of this timer.
	 */
	public duration: number;
	/**
	 * Whether this timer has ended or not.
	 */
	public ended: boolean;

	/**
	 * Base constructor for all timers.
	 */
	public constructor(options: TimerOptions) {
		super();
		this._expire = options.duration + Date.now();
		this._timeout = null;
		this._lastTick = Date.now();
		
		this.ended = false;
		this.duration = options.duration;
		this.timerType = options.type ?? TimerTypes.STATIC;
		this.tickInterval = this.timerType === TimerTypes.INTERVAL ? (options.tickInterval ?? 1000) : null;
	}

	/**
	 * Call this method to start ticking!
	 */
	public start(): this {
		const intervalFn = () => {
			if (this._expire < Date.now()) return this.stop('time');
			return this.tick(this._expire - Date.now());
		};

		switch(this.timerType) {
			case TimerTypes.STATIC:
				this.emit('start', this._expire, false);
				this._timeout = setTimeout(() => this.stop('time'), this.duration).unref();
				return this;

			case TimerTypes.INTERVAL:
				this.emit('start', this._expire, false);
				this._timeout = setInterval(intervalFn.bind(this), this.tickInterval).unref();
				return this;
		}
	}

	/**
	 * Tick this timer.
	 * @param remaining the remaining time in ms
	 */
	public tick(remaining: number): this {
		if (this.timerType !== TimerTypes.STATIC) return this;
		this.emit('tick', remaining);
		this._lastTick = Date.now();
		return this;
	}

	/**
	 * Stop this timer.
	 * @param reason the reason why you stopped this timer.
	 */
	public stop(reason = 'time') {
		clearTimeout(this._timeout);
		this._timeout = null;
		this.emit('end', reason);
		return this;
	}
}