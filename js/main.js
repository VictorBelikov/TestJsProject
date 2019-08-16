//qaru.site/questions/30550/how-can-you-detect-the-version-of-a-browser
http: //  jQuery 1.9.1 и выше удалили функциональность $.browser.

http://qaru.site/questions/5292316/jquery-cookie-pop-up-to-show-only-once-per-session

function getBrowser() {
  var ua = navigator.userAgent,
    tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: tem[1] || '' };
  }

  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) {
      return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }

  return { name: M[0], version: M[1] };
}

console.log(getBrowser()); // Object { name: "Firefox", version: "42" }
