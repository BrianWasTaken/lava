const Token = require('./Token');

module.exports = class Parser {
	static async parse(tokens, stopToken = 'NONE', index = 0) {
		const end = [];
		for (let i = index; i < tokens.length; i++) {
			const token = tokens[i];
			if ((Array.isArray(stopToken) && stopToken.includes(token.type)) || stopToken === token.type) {
				return { value: end, lastToken: i, lastTokenType: token.type };
			}

			if (token.type === 'LBRACKET') {
				const bracketGroup = await this.parse(tokens, ['RBRACKET', 'EOF'], i + 1);

				if (bracketGroup.lastTokenType === 'EOF') {
					end.push([new Token('WORD', token.value)]);
					break;
				}

				end.push(new Token('BRACKETGROUP', Array.isArray(bracketGroup) ? bracketGroup : bracketGroup.value));
				i = bracketGroup.lastToken;
			} else if (token.type === 'SEMI') {
				const argsGroup = await this.parse(tokens, ['SEMI', 'RBRACKET', 'EOF'], i + 1);
				end.push(argsGroup.value);
				i = argsGroup.lastToken - 1;
			} else {
				end.push(token);
			}
		}
		return end;
	}
}