export default class OpenDashModalInstance {
  constructor({ data, close }) {
    this.data = data;
    this.close = close;

    this.header = {
      title: null
    };

    this.footer = [];
  }

  set title(label) {
    if (!this.header) {
      this.header = {};
    }

    this.header.title = label;
  }

  addFooterAction({
    label = "missing label",
    icon,
    cls,
    action = () => {},
    floatRight = false,
    isDisabled = () => false,
    isVisible = () => true
  }) {
    this.footer.push({
      label,
      icon,
      cls,
      action,
      floatRight,
      isDisabled,
      isVisible
    });
  }
}
