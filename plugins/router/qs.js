export default function(options) {
  return function(instance, module, name) {
    const r = instance.router;
    const qsparam = "odroute";
    let ignoreChange = false;

    go(true);

    r.onChange(state => {
      if (!ignoreChange) {
        let newHref = SetQS(qsparam, r.path);

        if (newHref !== window.location.href) {
          window.history.pushState(null, null, newHref);
        }
      }
    });

    window.onpopstate = e => {
      ignoreChange = true;
      go();
      ignoreChange = false;
    };

    function go(setPath = false) {
      let path = GetQS(qsparam);

      if (path) {
        if (setPath) {
          r.path = path;
        } else {
          r.go(path);
        }
      }
    }
  };
}

function GetQS(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

function SetQS(key, value) {
  const re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi");

  let qs = window.location.href;
  let hash;

  if (re.test(qs)) {
    if (typeof value !== "undefined" && value !== null)
      return qs.replace(re, "$1" + key + "=" + value + "$2$3");
    else {
      hash = qs.split("#");
      qs = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
      if (typeof hash[1] !== "undefined" && hash[1] !== null)
        qs += "#" + hash[1];
      return qs;
    }
  } else {
    if (typeof value !== "undefined" && value !== null) {
      var separator = qs.indexOf("?") !== -1 ? "&" : "?";
      hash = qs.split("#");
      qs = hash[0] + separator + key + "=" + value;
      if (typeof hash[1] !== "undefined" && hash[1] !== null)
        qs += "#" + hash[1];
      return qs;
    } else return qs;
  }
}
