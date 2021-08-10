import { MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

export class Imgen {
	public constructor(
		/**
		 * Dank Memer's api URL
		 */
		public apiURL: string,
		/**
		 * Your requested token from the memegods.
		 */
		public token = process.env.MEME_TOKEN
	) {}

	/**
	 * The main thing. Generate something from a certain endpoint.
	 * @param endpoint a valid endpoint from it's docs
	 * @param args the main body of the request
	 * @param ext the extension to use on the attachment
	 */
	generate(endpoint: string, args: URLSearchParams, ext: 'gif' | 'png') {
		return fetch(`${this.apiURL}/api/${endpoint}?${args.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: this.token,
			},
		}).then(res => new MessageAttachment(res.body, `${endpoint}.${ext}`));
	}
}