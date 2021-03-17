import * as Highcharts from "highcharts/highstock";
import moment from "moment";

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
        
        this.setHighchartsLang();

      };

      await $q.resolve();
    } catch (error) {
      console.error(error);
    }
  }

  setHighchartsLang() {
    console.log("Set Language: " +this.lang);
    if(this.lang == "de") {
      moment.locale("de");
      Highcharts.setOptions({lang: {
        thousandsSep: ".",
        decimalPoint: ",",
        months: [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember",
        ],
        weekdays: [
          "Sonntag",
          "Montag",
          "Dienstag",
          "Mittwoch",
          "Donnerstag",
          "Freitag",
          "Samstag",
        ],
        shortMonths: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mai",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Okt",
          "Nov",
          "Dez",
        ],
        notData: "Keine Daten verfügbar",
        resetZoom: "Zoom zurücksetzen",
      }});
    } else {
      moment.locale("en-gb");
      Highcharts.setOptions({lang: {
        thousandsSep: ".",
        decimalPoint: ",",
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        weekdays: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Satarday",
        ],
        shortMonths: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        notData: "No Data available",
        resetZoom: "Reset Zoom",
      }});
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
