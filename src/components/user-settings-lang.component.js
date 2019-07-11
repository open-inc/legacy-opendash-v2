const template = `
<p>
  {{ 'od.user.settings.language.info' | translate }}
</p>

<select 
  ng-if="$ctrl.languages"
  ng-options="lang.key as lang.label for lang in $ctrl.languages"
  ng-model="$ctrl.lang"
  ng-change="$ctrl.onChange()"
></select>
`;

class controller {
  static get $inject() {
    return ["$injector"];
  }

  constructor($injector) {
    this.init($injector);
  }

  async init($injector) {
    try {
      const $user = $injector.get("opendash/services/user");
      const $notification = $injector.get("opendash/services/notification");
      const $q = $injector.get("$q");
      const $translate = $injector.get("$translate");

      const languages = $translate.getAvailableLanguageKeys().map(key => ({
        key,
        label: key
      }));

      for (const l of languages) {
        $translate(`languages.${l.key}.label`).then(
          translation => {
            l.label = translation;
          },
          e => {
            console.warn(e);
          }
        );
      }

      this.lang = $translate.use();
      this.languages = languages;

      this.onChange = () => {
        $translate.use(this.lang);

        window.localStorage.setItem("opendash/language", this.lang);
      };

      await $q.resolve();
    } catch (error) {
      console.error(error);
    }
  }

  $onInit() {
    try {
      this.modal.header = false;

      this.modal.addFooterAction({
        label: "od.ui.ok",
        icon: "fa-ban",
        cls: "button--outline",
        floatRight: true,
        isVisible: () => true,
        action: ({ close }) => {
          close();
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
