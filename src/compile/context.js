import {commonUtils} from "../utils/commonUtils";

class context {
  constructor(vw, ctx) {
    this.vw = vw;
    this.ctx = ctx;
  }

  lookup(name) {

    var value;

    var context = this, names, index, lookupHit = false;

    while (context) {
      if (name.indexOf('.') > 0) {
        value = context.vw;
        names = name.split('.');
        index = 0;
        while (value != null && index < names.length) {
          if (index === names.length - 1)
            lookupHit = commonUtils.hasProperty(value, names[index]);

          value = value[names[index++]];
        }
      } else {
        value = context.vw[name];
        lookupHit = commonUtils.hasProperty(context.vw, name);
      }

      if (lookupHit)
        break;

      context = context.parent;
    }


    if (commonUtils.isFunction(value))
      value = value.call(this.vw);

    return value;
  };

}

export {context}
