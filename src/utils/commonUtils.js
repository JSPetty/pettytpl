class commonUtils {

  // fixme 等待支持后引入
  // #whiteRe = /\s*/;
  // #spaceRe = /\s+/;
  // #equalsRe = /\s*=/;
  // #curlyRe = /\s*\}/;
  // #tagRe = /#|\^|\/|>|\{|&|=|!/;


  /**
   * 平常的字符转换成正则样子 -> { 变成 \{ 让政策可以识别
   * @param {String} strReg
   * @returns {String} 返回一个正则str
   */
  static escapeRegExp(strReg) {
    return strReg.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * 返回Object 下的toString
   * @returns {*}
   */
  static objToStringFunction() {
    return Object.prototype.toString;
  }

  /**
   * 检测是不是array
   * @param {Object} 检测对象
   * @returns {Boolean} 是否是Array
   */
  static isArray(object) {
    return Array.isArray ? Array.isArray(object) : commonUtils.objToStringFunction.call(object) === '[object Array]';
  }

  /**
   * 检测是不是函数
   * @param {Object} 检测对象
   * @returns {boolean} 是否是函数
   */
  static isFunction(obj) {
    return typeof obj === 'function';
  }

  static isWhitespace(string) {
    return !commonUtils.testRegExp(commonUtils.nonSpaceRe, string);
  }

  static testRegExp(re, string) {
    let _reg = RegExp.prototype.test;
    return _reg.call(re, string);
  }

  static escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
  }

  static hasProperty(obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  constructor() {
  }
}

commonUtils.whiteRe = /\s*/;
commonUtils.spaceRe = /\s+/;
commonUtils.equalsRe = /\s*=/;
commonUtils.curlyRe = /\s*\}/;
// (/(?:(?:(?:[\/|#][(*f)|(else)|(each)])))/) 正则确认
commonUtils.tagRe = /(?:([\/|#][(if)|(else)|(each)])\}\})|\=|\./;

commonUtils.nonSpaceRe = /\S/;

commonUtils.openingTagRe = /\{\{\s*/
commonUtils.closingTagRe = /\s*\}\}/
commonUtils.closingCurlyRe = /\s*\}\}\}/

commonUtils.tags = ['{{', '}}'];
// commonUtils.objToStringFunction = Object.prototype.toString();

export {commonUtils}
