const template =
  `<div ng-if="$ctrl.message">{{ $ctrl.message | translate }}</div>` +
  `<div ng-if="$ctrl.prompt">` +
  `<input type="text" ng-model="$ctrl.output">` +
  `</div>` +
  `<div ng-if="$ctrl.form">` +
  `<od-form ng-if="$ctrl.form" data="$ctrl.formData" form="$ctrl.form"></od-form>` +
  `</div>`;

class controller {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {}

  $onInit() {
    try {
      this.modal.title = this.modal.data.title;
    } catch (error) {
      // that's ok...
    }

    try {
      this.message = this.modal.data.message;
    } catch (error) {
      // that's ok...
      // this.message = "Empty message.";
    }

    try {
      if (this.modal.data.placeholder) {
        this.output = this.modal.data.placeholder;
      }
    } catch (error) {
      this.output = "";
    }

    try {
      this.prompt = this.modal.data.prompt;
    } catch (error) {
      this.prompt = false;
    }

    try {
      this.form = this.modal.data.form;
      this.formData = this.modal.data.formData;
    } catch (error) {
      this.prompt = false;
    }

    try {
      this.modal.header = false;

      this.modal.addFooterAction({
        label: "od.ui.cancel",
        icon: "fa-ban",
        cls: "button--outline",
        floatRight: true,
        isVisible: () => true,
        action: ({ close }) => {
          close(false);
        }
      });

      this.modal.addFooterAction({
        label: "od.ui.ok",
        // icon: "fa-ban",
        // cls: "",
        floatRight: true,
        isVisible: () => true,
        isDisabled: () => this.prompt && !this.output,
        action: ({ close }) => {
          if (this.prompt) {
            return close(this.output);
          }

          if (this.form) {
            return close(this.formData);
          }

          return close(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

let component = {
  controller,
  template,
  bindings: {
    modal: "<"
  }
};

export default component;
