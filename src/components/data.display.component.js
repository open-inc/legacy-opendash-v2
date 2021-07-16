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
let $compile, stringmap;
export default function OpenDashDataDisplay(_$compile, _stringmap) {
    $compile = _$compile;
    stringmap =_stringmap;
    return {
        restrict: "E",
        scope: {
            type: "=",
            value: "=",
            unit: "=",
            showUnit:"="
        },
        link: OpenDashDataDisplayLink
    };
}
function isLink(text) {
    let urlEx = new RegExp("((http|ftp|https):/{2})");
    return urlEx.test(text);
    //return match.length > 0;
    //return ("" + text).toLowerCase().indexOf("http") == 0;
};
function isBase64Image(text){
    if (typeof text !== "string") return false;
    return text.startsWith("data:image");
};
function render(scope, elem, attr) {
    
    let unit = scope.unit;
    let type = scope.type.toLowerCase();
    let value = scope.value;
    let toShow = value;
    if(scope.showUnit) {
        toShow += (" "+unit);
    }
    if(type==="number"){
        elem.html($compile('<span>' + toShow + '</span>')(scope));
        return;
    }
    if(type==="string"){
        if(isBase64Image(""+value)){
            elem.html($compile('<span  >  <img src="'+value+'" />  </span>')(scope));
            return;    
        }
        if(isLink(""+value)){
            elem.html($compile('<span title='+value+'>  <a target="_blank" href="'+value+'" >Link</a></span>')(scope));
            return;    
        }
        elem.html($compile('<span>' + stringmap.get(toShow.trim()) + '</span>')(scope));
        return;
    }
    if(type==="boolean"){
        let string = '<span title='+value+' class="ow-sidebar-data__boolean '+ (value?'ow-sidebar-data__boolean__active':'')+'" />';
        elem.html($compile(string)(scope))
        return;
    }
    if(type==="object"){
        let string = '<span title='+JSON.stringify(value)+'>  <a href="#">Data-Object</a></span>';
        elem.html($compile(string)(scope));
        return;
    }
    if(type==="geo"){
        let string = '<span title='+JSON.stringify(value)+'>  <a href="#">Geo-Position</a></span>';
        elem.html($compile(string)(scope));
        return;
    }
    
}
function OpenDashDataDisplayLink(scope, elem, attr) {
    scope.$watch("value", () => {
        render(scope, elem, attr);
    });
    scope.$watch("type", () => {
        render(scope, elem, attr);
    });


}

export {OpenDashDataDisplay};