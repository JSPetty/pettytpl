import {commonUtils} from "../utils/commonUtils";

class scanner {
  constructor(cfg) {
    this.string = cfg.string;
    this.tail = cfg.string;
    this.pos = 0;
  }

  eos() {
    return this.tail === '';
  }

  scan(re) {
    var match = this.tail.match(re);
    if (!match || match.index !== 0)
      return '';
    var string = match[0];
    this.tail = this.tail.substring(string.length);
    this.pos += string.length;
    return string;
  }

  scanUntil(re) {
    let index = this.tail.search(re), match;
    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }
    this.pos += match.length;
    return match;
  }


  //-------------
  scanTpl(scanObj) {

    const parseInc = scanObj.parseInc
    let sections = parseInc.sections
    let tokens = parseInc.tokens

    let start = 0
    let type = undefined
    let value = undefined
    let chr = undefined
    let token = [];

    while (!this.eos()) {
      start = this.pos;
      value = this.scanUntil(commonUtils.openingTagRe);
      if (value) {
        for (let i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);
          tokens.push(['text', chr, start, start + 1]);
          start += 1;
        }
      }

      // 左侧没有未关闭的标签的时候结束搜索
      if (!this.scan(commonUtils.openingTagRe))
        break;
      type = this.scan(commonUtils.tagRe) || 'name';
      this.scan(commonUtils.whiteRe);

      // 对应的key 赋值
      if (type === '=') {
        value = this.scanUntil(commonUtils.equalsRe);
        this.scan(commonUtils.equalsRe);
        this.scanUntil(commonUtils.closingTagRe);
      } else if (type === '{') {
        value = this.scanUntil(commonUtils.closingCurlyRe);
        this.scan(commonUtils.curlyRe);
        this.scanUntil(commonUtils.closingTagRe);
        type = '&';
      } else {
        value = this.scanUntil(commonUtils.closingTagRe);
      }

      // Match the closing tag.
      if (!this.scan(commonUtils.closingTagRe))
        throw new Error('Unclosed tag at ' + this.pos);

      token = [type, value, start, this.pos];
      tokens.push(token);

      if (type === '#') {
        sections.push(token);
      }
      // else if (type === '/') {
      //   openSection = sections.pop();
      //
      //   if (!openSection)
      //     throw new Error('Unopened section "' + value + '" at ' + start);
      //
      //   if (openSection[1] !== value)
      //     throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      // }
      // else if (type === 'name' || type === '{' || type === '&') {
      //   nonSpace = true;
      // }
      // else if (type === '=') {
      //     // Set the tags for the next time around.
      //     compileTags(value);
      // }

    }

    // openSection = sections.pop();
    //
    // if (openSection)
    //   throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    let nextTokensArray = this.nestTokens(this.squashTokens(tokens));
    return nextTokensArray;
  }

  squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  nestTokens(tokens) {
    let nestedTokens = [];
    let collector = nestedTokens;
    let sections = [];

    let token = undefined;
    let section = undefined;
    for (let i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

}

export {scanner}
