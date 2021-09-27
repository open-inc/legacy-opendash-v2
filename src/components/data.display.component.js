import {isDateUnit} from "./data.display.datetime";
let $compile, stringmap,$injector,$notification;

export default function OpenDashDataDisplay(_$compile, _stringmap,_$injector) {
    $compile = _$compile;
    stringmap =_stringmap;
    $injector = _$injector;
    $notification = $injector.get("opendash/services/notification");
    return {
        restrict: "E",
        scope: {
            type: "=",
            value: "=",
            unit: "=",
            showUnit:"=",
            
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
    if(!scope.type || scope.type===""){
        scope.type ="string"
    }
    let type = scope.type.toLowerCase();
    let value = scope.value;
    let toShow = ""+value;
    
    if(scope.showUnit) {
        toShow += (" "+unit);
    }
    //console.log("DataDisplay", unit, type, value, toShow)
    if(type==="number"){
        
        if(isDateUnit(unit)){
            
            elem.html($compile('<od-data-dt tsunit="'+unit+'" time='+parseInt(scope.value)+' />')(scope));    
            return;
        };
        
        elem.html($compile('<span>' + toShow + '</span>')(scope));
        return;
    }
    if(type==="string"){
        if(isBase64Image(""+value)){
            elem.html($compile('<a href="#" ng-click="openNewTab()"  >  <img src="'+value+'" />  </a>')(scope));
            return;    
        }
        if(isLink(""+value)){
            elem.html($compile('<span title='+value+'>  <a target="_blank" href="'+value+'" >Link</a></span>')(scope));
            return;    
        }
        
        if(toShow.trim() ===""){
            toShow ="--"
        }
        elem.html($compile('<span ng-click="copytoclip()"title="'+toShow+'">' + stringmap.get(toShow.trim()) + '</span>')(scope));
        return;
    }
    if(type==="boolean"){
        
        
        let string ="";
        if(value){
            string+= '<i class="fa fa-circle ng-scope" style="height: 50%; color: rgb(0, 99, 172);" aria-hidden="true"></i>'
        }else{
            string+= '<i class="fa fa-circle-o ng-scope" style="height:50%;" aria-hidden="true"></i>'
        }
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
    scope.openNewTab =()=>{
        var win = window.open();
        win.document.write('<iframe src="' + scope.value  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    }
    scope.copytoclip =()=>{
        let data = [new ClipboardItem({ "text/plain": new Blob([""+scope.value], { type: "text/plain" }) })];
        navigator.clipboard.write(data).then(function() {
           $notification.success("od.datadisplay.c2clip");
            
        }, function() {
        console.error("Unable to write to clipboard. :-(");
        });
    }

}

export {OpenDashDataDisplay};