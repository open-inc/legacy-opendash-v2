const template =
  `<div>{{ $ctrl.message | translate }}</div>` +
  `<div ng-if="$ctrl.prompt">` +
  `<input type="text" ng-model="$ctrl.output">` +
  `</div>`;

class controller {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {}

  $onInit() {
    try {
      this.message = this.modal.data.message;
    } catch (error) {
      this.message = "Empty message.";
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
          close(this.prompt ? this.output : true);
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
