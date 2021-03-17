import template from "./presets.component.html";

let $translate;

class controller {
  static get $inject() {
    return ["od.widget.presets", "$translate"];
  }

  constructor(presets, _$translate) {
    this.presets = presets;
    $translate = _$translate;
  }

  getLanguage() {
    var langBool = true;
    if($translate.use() === "de") {
      langBool = false;
    }
    return langBool
  }
}

let component = {
  controller,
  template,
  bindings: {
    add: "<"
  }
};

export default component;
