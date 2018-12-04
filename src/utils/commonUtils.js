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


  // 获取正则匹配对
  static compileTags(tagsToCompile) {
    if (typeof tagsToCompile === 'string')
      tagsToCompile = tagsToCompile.split(commonUtils.spaceRe, 2);

    if (!commonUtils.isArray(tagsToCompile) || tagsToCompile.length !== 2)
      throw new Error('错误的 tags: ' + tagsToCompile);
    // /\{\{\s*/
    let openingTagRe = new RegExp(commonUtils.escapeRegExp(tagsToCompile[0]) + '\\s*');
    // /\s*\}\}/
    let closingTagRe = new RegExp('\\s*' + commonUtils.escapeRegExp(tagsToCompile[1]));
    // /\s*\}\}\}/
    let closingCurlyRe = new RegExp('\\s*' + commonUtils.escapeRegExp('}' + tagsToCompile[1]));

    commonUtils.openingTagRe = openingTagRe;
    commonUtils.closingTagRe = closingTagRe;
    commonUtils.closingCurlyRe = closingCurlyRe;

    return {
      openingTagRe,
      closingTagRe,
      closingCurlyRe
    }
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
commonUtils.tagRe = /#|\^|\/|>|\{|&|=|!/;

commonUtils.nonSpaceRe = /\S/;

commonUtils.openingTagRe = /\{\{\s*/;
commonUtils.closingTagRe = /\s*\}\}/;
commonUtils.closingCurlyRe = /\s*\}\}\}/;

commonUtils.tags = ['{{', '}}'];
// commonUtils.objToStringFunction = Object.prototype.toString();

export {commonUtils}
