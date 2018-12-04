// import 'babel-polyfill'
// import 'whatwg-fetch'

import {parse} from './compile/parse'
import {writer} from './compile/writer'
import {scanner} from './compile/scanner'
import {context} from "./compile/context"

import {commonUtils} from './utils/commonUtils'

class pettyTpl {
  constructor(ptCfg = {template}) {
    this.tags = ptCfg.tags || []
    this.contextInc = new context()
    this.parseInc = new parse()
    this.writerInc = new writer(this.contextInc)
    this.scannerInc = null;

    this.sections = [];
    this.tokens = [];
    this.spaces = [];
    this.hasTag = false;
    this.nonSpace = false;
  }

  parse(template) {
    this.scannerInc = new scanner({string: template, pos: 0})
    let tokensArray = this.scannerInc.scanTpl({
      writerInc: this.writerInc,
      parseInc: this.parseInc,
    });
    // this.parseInc.parseTemplate({
    //     scannerInc: this.scannerInc,
    //     writerInc: this.writerInc,
    //     parseInc: this.parseInc
    // })
    // writerInc()
    this.contextInc.vw = {name: 123, name1: 1234}
    this.contextInc.ctx = tokensArray
    let s = this.writerInc.renderTokens(tokensArray, {name: 123, name1: 1234})
    debugger
  }
}

// index.version = '1.0.0';

let template = `
{#if name}
    <h1>吧北京 {{ name }}!</h1>
    <ul>
        <li>{{name1}}</li>
    </ul>
{#endif}
`;

(function () {
  var _pettyTpl = new pettyTpl();
  console.log(_pettyTpl.parse(template))
})();


// let pettyTplInc = new pettyTpl();
// pettyTplInc.parse(template);
// let rendered = pettyTpl.render(template, {name: "Luke", name1: 11});
