// import OpenDashWidgetConfig from '../classes/WidgetConfig';
import OpenDashWidgetOperations from "../classes/WidgetOperations";
import OpenDashWidgetState from "../classes/WidgetState";
// import OpenDashMultiSubscription from '../classes/MultiSubscription';

export default class OpenDashWidget {
  constructor(widget) {
    if (!widget) {
      throw new Error(
        "[opendash/services/dashboard] You can not create an empty Widget."
      );
    }

    if (!widget.name) {
      throw new Error(
        "[opendash/services/dashboard] You can not create a Widget without a name."
      );
    }

    if (!widget.type) {
      throw new Error(
        "[opendash/services/dashboard] You can not create a Widget without a type."
      );
    }

    this.name = widget.name;
    this.type = widget.type;
    this.grid = widget.grid;

    this.requestListener = {};

    this.state = new OpenDashWidgetState();
    this.operations = new OpenDashWidgetOperations(this);

    this.config = widget.config;
  }

  hasRequestListener(name) {
    return !!this.requestListener[name];
  }

  async request(name, message = null) {
    if (!this.hasRequestListener(name)) {
      throw new Error(
        `[opendash/classes/Widget] Request '${name}' is not (yet) available for the widget.`
      );
    }

    return await this.requestListener[name](message);
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      grid: this.grid,
      config: this.config
    };
  }
}
