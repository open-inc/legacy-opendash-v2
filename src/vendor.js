import jquery from "jquery";

// TODO workaround to make jquery available in window.jquery
window.jQuery = jquery;
window.$ = jquery;

import moment from "moment";
//import "moment/locale/en-gb";
import "moment/locale/de";
moment.locale("de");
