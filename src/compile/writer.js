import {commonUtils} from "../utils/commonUtils";

class writer {
  constructor(ctx) {
    this.ctx = ctx;
    // this.tags = wInc.tags;
    // this.tokens = [];
  }

  // parse(template, tags) {
  //     tokens = this.parseTemplate(template, this.tags);
  // }

  renderTokens(tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      // if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      // else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      // else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      // else if (symbol === '&') value = this.unescapedValue(token, context);
      // else if (symbol === 'name') value = this.escapedValue(token, context);
      if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  }

  escapedValue(token, context) {
    var value = this.ctx.lookup(token[1]);
    if (value != null)
      return commonUtils.escapeHtml(value);
  };

  rawValue(token) {
    return token[1];
  };

}

export {writer}
