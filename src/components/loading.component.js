class controller {
  static get $inject() {
    return [];
  }

  constructor() {}
}

let component = {
  template:
    '<div class="od-loader__spinner"><div class="od-loader__cube_one"></div><div class="od-loader__cube_two"></div>',
  controller
};

export default component;
