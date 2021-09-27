import moment from "moment";
const milliseconds = ["ms", "milliseconds"];
const seconds = ["s", "sec", "sek", "seconds", "sekunden"];
const minutes = ["min", "minutes", "minuten"];
const hours = ["std", "h", "hr", "hrs", "stunden", "hours"];
const days = ["days", "tage"];
const weeks = ["wochen", "weeks"];
const month = ["months", "monate"];
const years = ["jahre", "years"];
const duration_modes = ["unix", "full", "humanize"];
const date_modes = ["unix", "full", "date", "time", "humanize"];
const momentsUnits = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
const momentsLabels = ["J", "Mon", "Wo", "T", "Std", "Min", "Sek", "Ms"];
let $compile;
export default function OpenDashDataDisplayDateTime(_$compile) {
    
    $compile = _$compile;
    return {
        restrict: "E",
        scope: {
            value: "=time",
            unit: "@tsunit",
            timeMode: "@",
            mode: "@"
        },
        link: OpenDashDataDisplayDateTimeLink
    };
}

function render(scope, elem, attr) {
    if (!scope.mode) scope.mode = "full";
    if (!scope.timeMode) {
        if (seconds.indexOf(scope.unit.toLowerCase() != 1 || milliseconds.indexOf(scope.unit.toLowerCase() != 1))) {
            if (scope.value > (1000 * 3600 * 24 * 365 * 10)) {
                scope.timeMode = "date";
            } else {
                scope.timeMode = "duration";
            }
        } else {
            scope.timeMode = "date";
        }
    }
    if (scope.timeMode === "duration") {
        if (years.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "years");
        }
        if (month.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "months");
        }
        if (weeks.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "weeks");
        }
        if (days.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "days");
        }
        if (hours.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "hours");
        }
        if (minutes.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "minutes");
        }
        if (seconds.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value, "seconds");
        }
        if (milliseconds.indexOf(scope.unit.toLowerCase()) != -1) {
            scope.date = moment.duration(scope.value);
        }
    } else {
        try {
            scope.date = moment(parseInt(scope.value));
        } catch (error) {
            scope.date = moment(scope.value);
        }

    }
    scope.getTimeString = () => {
        if (!isDateUnit(scope.unit) || !scope.date.isValid()) return scope.value;
        if (scope.timeMode === "duration") {
            if (scope.mode === "full") {
                let string = "";

                string += scope.date.years() ? scope.date.years() + " Jahr(e) " : "";
                string += scope.date.months() ? scope.date.months() + " Monat(e) " : "";
                string += scope.date.days() ? scope.date.days() + " Tag(e) " : "";
                string += scope.date.hours() ? scope.date.hours() + " Stunde(n) " : "";
                string += scope.date.minutes() ? scope.date.minutes() + " Minute(n) " : "";
                string += scope.date.seconds() ? scope.date.seconds() + " Sekunde(n) " : "";

                return string;
            }
            if (scope.mode === "humanize") return scope.date.humanize();
            if (scope.mode === "unix") return scope.date.asMilliseconds() + " ms";
        }
        else {
            //["unix", "full", "date", "time", "humanize"];
            if (scope.mode === "unix") return "" + scope.date.valueOf();
            if (scope.mode === "full") return scope.date.format("DD.MM.YYYY @ HH:mm:ss");
            if (scope.mode === "date") return scope.date.format("DD.MM.YYYY");
            if (scope.mode === "time") return scope.date.format("HH:mm:ss");
            if (scope.mode === "humanize") return scope.date.fromNow();
        }
    }
    scope.switchView = () => {
        if (!isDateUnit(scope.unit) || !scope.date.isValid()) return;
        if (scope.timeMode === "duration") {
            scope.mode = duration_modes[(duration_modes.indexOf(scope.mode) + 1) % duration_modes.length]
            elem.html($compile('<span ng-click="switchView()">' + scope.getTimeString() + '</span>')(scope));
        } else {
            scope.mode = date_modes[(date_modes.indexOf(scope.mode) + 1) % date_modes.length]
            elem.html($compile('<span ng-click="switchView()">' + scope.getTimeString() + '</span>')(scope));
        }
    }
    if (!isDateUnit(scope.unit) || !scope.date.isValid()) {
        elem.html($compile('<span">' + scope.getTimeString() + '</span>')(scope));
    } else {
        
        elem.html($compile('<span ng-click="switchView()">' + scope.getTimeString() + '</span>')(scope));
    }



}
function OpenDashDataDisplayDateTimeLink(scope, elem, attr) {
    
    scope.$watch("value", () => {
        render(scope, elem, attr);
        
    });


}
const isDateUnit = (unit) => {

    unit = unit.toLowerCase();
    if (milliseconds.indexOf(unit) != -1) {
        return true;
    }
    if (seconds.indexOf(unit) != -1) {
        return true;
    }
    if (minutes.indexOf(unit) != -1) {
        return true;
    }
    if (hours.indexOf(unit) != -1) {
        return true;
    }
    if (days.indexOf(unit) != -1) {
        return true;
    }
    if (weeks.indexOf(unit) != -1) {
        return true;
    }
    if (month.indexOf(unit) != -1) {
        return true;
    }
    if (years.indexOf(unit) != -1) {
        return true;
    }
    return false;
    //console.log("Not a date uint")
}
export { OpenDashDataDisplayDateTime, isDateUnit };