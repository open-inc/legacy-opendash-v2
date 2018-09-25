export default class OpenDashWidgetState {
  constructor() {
    this._state_ = {
      enabled: true,
      loading: true,
      config: true,
      data: true,
      alert: false
    };
  }

  get loading() {
    return this._state_.loading;
  }

  set loading(value) {
    this._state_.loading = value;
  }

  get config() {
    return this._state_.config;
  }

  set config(value) {
    this._state_.config = value;
    this._state_.enabled = value;
    this._state_.loading = value;

    if (value === true) {
      this._state_.data = value;
    }
  }

  get data() {
    return this._state_.data;
  }

  set data(value) {
    this._state_.data = value;
    this._state_.config = value;
    this._state_.enabled = value;
    this._state_.loading = value;
  }

  get alert() {
    return this._state_.alert;
  }

  set alert(value) {
    this._state_.alert = value;
  }

  get enabled() {
    return this._state_.enabled;
  }

  set enabled(value) {
    this._state_.enabled = value;
  }
}
