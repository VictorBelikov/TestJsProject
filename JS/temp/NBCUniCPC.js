/**
 * branch- cpcpdk6_prod
 * docroot/sites/usanetwork/modules/custom/usanetwork_tve_video/js/usa_config_tve_auth2/usa-tve-custom-services.js
 * нужно закоментить 215стр. window.location.reload();
 * http://local.usanetwork.com/admin/usanetwork/video - здесть меняем откуда грузить NBCUniCPC.js
 * http://local.usanetwork.com/wizardingworld/watch/clip-making-memories-the-great-hall - страница для проверки
 */

(function(NBCUniCPC, undefined) {
  /**
   * @type {Number}
   */
  NBCUniCPC.LogLevel = {
    ALL: 0,
    DEBUG: 100,
    INFO: 200,
    WARN: 300,
    ERROR: 400,
    FATAL: 500,
    OFF: 1000,
  };
  /**
   * Allows the page to filter output to the console log
   * @type {Number}
   * @example NBCUniCPC.DEFAULT_LOG_LEVEL = NBCUniCPC.LogLevel.OFF;
   */
  NBCUniCPC.DEFAULT_LOG_LEVEL = NBCUniCPC.LogLevel.ERROR;

  //end fix for IE
  /**
   * @desc Basic logger that abstract console calls
   * This object supports log, warn, and error.
   * @param identifier A string to prepend to any log messages
   * @constructor
   * @example
   * // will print to console: "[CPC][MyClass] Foobar!"
   * var logger = new Logger(MyClass);
   * logger.log("Foobar!");
   *
   * @constructor
   */

  function Logger(identifier) {
    var id = identifier;
    var loglevel = NBCUniCPC.DEFAULT_LOG_LEVEL;
    /**
     * pass through to console.log
     * @param message
     */
    this.log = function(message) {
      if (loglevel <= NBCUniCPC.LogLevel.ALL) {
        console.log('[CPC][' + id + '] ' + message);
      }
    };
    /**
     * pass through to console.debug
     * @param message
     */
    this.debug = function(message) {
      if (loglevel <= NBCUniCPC.LogLevel.DEBUG) {
        console.debug('[CPC][' + id + '] ' + message);
      }
    };
    /**
     * pass through to console.debug
     * @param message
     */
    this.info = function(message) {
      if (loglevel <= NBCUniCPC.LogLevel.INFO) {
        console.info('[CPC][' + id + '] ' + message);
      }
    };
    /**
     * pass through to console.warn
     * @param message
     */
    this.warn = function(message) {
      if (loglevel <= NBCUniCPC.LogLevel.WARN) {
        console.warn('[CPC][' + id + '] ' + message);
      }
    };
    /**
     * pass through to console.error
     * @param message
     */
    this.error = function(message) {
      if (loglevel <= NBCUniCPC.LogLevel.ERROR) {
        console.error('[CPC][' + id + '] ' + message);
      }
    };

    this.setLogLevel = function(n) {
      if (!isNaN(n)) {
        loglevel = n;
      }
    };
  }

  // BEGIN CONVIVA CODE TO BE REPLACED WITH A CUSTOM IMPLEMENTATION
  function Html5Time() {
    function _constr() {
      // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.getEpochTimeMs = function() {
      var d = new Date();
      return d.getTime();
    };

    this.release = function() {
      // nothing to release
    };
  }

  function Html5Timer() {
    function _constr() {
      // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.createTimer = function(timerAction, intervalMs, actionName) {
      var timerId = setInterval(timerAction, intervalMs);
      var cancelTimerFunc = function() {
        if (timerId !== -1) {
          clearInterval(timerId);
          timerId = -1;
        }
      };
      return cancelTimerFunc;
    };

    this.release = function() {
      // nothing to release
    };
  }

  function Html5Http() {
    function _constr() {
      // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.makeRequest = function(httpMethod, url, data, contentType, timeoutMs, callback) {
      // XDomainRequest only exists in IE, and is IE8-IE9's way of making CORS requests.
      // It is present in IE10 but won't work right.
      // if (typeof XDomainRequest !== "undefined" && navigator.userAgent.indexOf("MSIE 10") === -1) {
      // 	return this.makeRequestIE89.apply(this, arguments);
      // }
      return this.makeRequestStandard.apply(this, arguments);
    };

    this.makeRequestStandard = function(httpMethod, url, data, contentType, timeoutMs, callback) {
      var xmlHttpReq = new XMLHttpRequest();

      xmlHttpReq.open(httpMethod, url, true);

      if (contentType && xmlHttpReq.overrideMimeType) {
        xmlHttpReq.overrideMimeType = contentType;
      }
      if (contentType && xmlHttpReq.setRequestHeader) {
        xmlHttpReq.setRequestHeader('Content-Type', contentType);
      }
      if (timeoutMs > 0) {
        xmlHttpReq.timeout = timeoutMs;
        xmlHttpReq.ontimeout = function() {
          // Often this callback will be called after onreadystatechange.
          // The first callback called will cleanup the other to prevent duplicate responses.
          xmlHttpReq.ontimeout = xmlHttpReq.onreadystatechange = null;
          if (callback) {
            callback(false, 'timeout after ' + timeoutMs + ' ms');
          }
        };
      }

      xmlHttpReq.onreadystatechange = function() {
        if (xmlHttpReq.readyState === 4) {
          xmlHttpReq.ontimeout = xmlHttpReq.onreadystatechange = null;
          if (xmlHttpReq.status === 200) {
            if (callback) {
              callback(true, xmlHttpReq.responseText);
            }
          } else {
            if (callback) {
              callback(false, 'http status ' + xmlHttpReq.status);
            }
          }
        }
      };

      xmlHttpReq.send(data);

      return null; // no way to cancel the request
    };

    //   this.makeRequestIE89 = function (httpMethod, url, data, contentType, timeoutMs, callback) {
    //    // IE8-9 does not allow changing the contentType on CORS requests.
    //    // IE8-9 does not like mixed intranet/extranet CORS requests.
    //    // IE8-9 does not like mixed HTTPS-in-HTTP-page / HTTP-in-HTTPS-page CORS requests.

    //    var xmlHttpReq = new XDomainRequest();

    //    xmlHttpReq.open(httpMethod, url, true); // async=true

    //    if (timeoutMs != null) {
    //        xmlHttpReq.timeout = timeoutMs;
    //        xmlHttpReq.ontimeout = function () {
    //            xmlHttpReq.onload = xmlHttpReq.onerror = null;
    //            if (callback) callback(false, "timeout after "+timeoutMs+" ms");
    //        };
    //    }

    // // onreadystatechange won't trigger for XDomainRequest.
    //    xmlHttpReq.onload = function () {
    //    	xmlHttpReq.ontimeout = null;
    //    	if (callback) callback(true, xmlHttpReq.responseText);
    //    };
    //    xmlHttpReq.onerror = function () {
    //    	xmlHttpReq.ontimeout = null;
    //    	if (callback) callback(false, "http status " + xmlHttpReq.status);
    //    };

    //    xmlHttpReq.send(data);

    //    return null; // no way to cancel the request
    //   };

    this.release = function() {
      // nothing to release
    };
  }

  function Html5Storage() {
    function _constr() {
      // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.saveData = function(storageSpace, storageKey, data, callback) {
      var localStorageKey = storageSpace + '.' + storageKey;
      try {
        localStorage.setItem(localStorageKey, data);
        callback(true, null);
      } catch (e) {
        callback(false, e.toString());
      }
    };

    this.loadData = function(storageSpace, storageKey, callback) {
      var localStorageKey = storageSpace + '.' + storageKey;
      try {
        var data = localStorage.getItem(localStorageKey);
        callback(true, data);
      } catch (e) {
        callback(false, e.toString());
      }
    };

    this.release = function() {
      // nothing to release
    };
  }

  function Html5Metadata() {
    function _constr() {
      // nothing to initialize
    }

    _constr.apply(this, arguments);

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getBrowserName = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getBrowserVersion = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceBrand = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceManufacturer = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceModel = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getDeviceType = function() {
      return null;
    };

    // There is no value we can access that qualifies as the device version.
    this.getDeviceVersion = function() {
      return null;
    };

    // HTML5 can qualify as an application framework of sorts.
    this.getFrameworkName = function() {
      return 'HTML5';
    };

    // No convenient way to detect HTML5 version.
    this.getFrameworkVersion = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getOperatingSystemName = function() {
      return null;
    };

    // Relying on HTTP user agent string parsing on the Conviva Platform.
    this.getOperatingSystemVersion = function() {
      return null;
    };

    this.release = function() {
      // nothing to release
    };
  }

  function Html5Logging() {
    function _constr() {
      // nothing to initialize
    }

    _constr.apply(this, arguments);

    this.consoleLog = function(message, logLevel) {
      if (typeof console === 'undefined') {
        return;
      }
      if (
        (console.log && logLevel === Conviva.SystemSettings.LogLevel.DEBUG) ||
        logLevel === Conviva.SystemSettings.LogLevel.INFO
      ) {
        console.log(message);
      } else if (console.warn && logLevel === Conviva.SystemSettings.LogLevel.WARNING) {
        console.warn(message);
      } else if (console.error && logLevel === Conviva.SystemSettings.LogLevel.ERROR) {
        console.error(message);
      }
    };

    this.release = function() {
      // nothing to release
    };
  }

  // END CONVIVA CODE

  /**
   * @namespace NBCUniCPC.FontEdge
   * @desc Constants for identifying the font edge value for closed captioning.
   */
  NBCUniCPC.FontEdge = {
    /**
     * @type {string}
     * @default
     * @readonly
     */
    DROP_SHADOW: 'DropShadow',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    DEPRESSED: 'Depressed',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    NONE: 'None',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    RAISED: 'Raised',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    UNIFORM: 'Uniform',
  };

  /**
   * Value Object for getting/setting subtitle styles in Closed Captions.
   * This class is a member of the <code>NBCUniCPC</code> namespace and should
   * be instantiated as <code>new NBCUniCPC.SubtitleStyle()</code>
   * @constructor
   * @example
   * var style = new NBCUniCPC.SubtitleStyle();
   * style.fontColor = "#FF0000";
   *
   * cpcplayer.setSubtitleStyle(style);
   */
  NBCUniCPC.SubtitleStyle = function() {
    /**
     * @type {string}
     * @description The color of the background region for closed caption text.
     * Any hexadecimal value valid for defining color in CSS is allowed (for
     * example, "#ff0000").
     * @default "#000000"
     */
    this.backgroundColor = '#000000';
    /**
     * @type {number}
     * @description The opacity level for the closed caption background. Valid
     * values are from 0 to 1, where 0 is invisible, 1 is opaque, and values in
     * between are interpreted as a percentage. If this value is not specified,
     * the value of opacity is used.
     * @default 1
     */
    this.backgroundOpacity = 1;
    /**
     * setCCBold(Bool)
     * @type {boolean}
     * @description Indicates whether the subtitle text is bolded.
     * @default false
  
     */
    this.bold = false;
    /**
     * @type {string}
     * @description The color of the background region for closed caption text.
     * Any hexadecimal value valid for defining color in CSS is allowed (for
     * example, "#ff0000").
     * @default "#FFFFFF"
     */
    this.fontColor = '#FFFFFF';
    /**
     * @type {string}
     * @description The edge or border of the font for closed caption text.
     * @see {@link NBCUniCPC.FontEdge} for valid values.
     * @default "None"
     */
    this.fontEdge = NBCUniCPC.FontEdge.NONE;
    /**
     * @type {string}
     * @description The color of the background region for closed caption text.
     * Any hexadecimal value valid for defining color in CSS is allowed (for
     * example, "#ff0000").
     * @default "#000000"
     */
    this.fontEdgeColor = '#000000';
    /**
     * @type {string}
     * @description The name of a font that will be applied to closed-caption
     * text. Possible Values: "Arial", "Arial Black", "Courier New", "Georgia",
     * "Impact", "Palatino", "Tahoma", "Verdana", "Times New Roman"
     * @default "Arial"
     */
    this.fontFamily = 'Arial';

    /**
     * @type {float}
     * @description The scale percentage value of the font for closed caption
     * text. Relative to the player area.
     * @default 1
     * */
    this.fontScale = 1;

    /**
     * @type {number}
     * @description The opacity level for all closed caption content, including
     * text, font edge, and background (unless backgroundOpacity is set). Valid
     * values are from 0 to 1, where 0 is invisible, 1 is opaque, and values in
     * between are interpreted as a percentage.
     * @default 1
     */
    this.opacity = 1;
  };

  /**
   * @namespace NBCUniCPC.CardDecks
   * @desc Constants for identifying the type of the card deck (PDK sepcific value)
   */
  NBCUniCPC.CardDecks = {
    /**
     * @type {string}
     * @default
     * @readonly
     */
    PAUSE_DECK: 'rational-pause-deck',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    END_CARD_DECK: 'rational-end-card-deck',
  };

  /**
   * @namespace NBCUniCPC.CardTypes
   * @desc Constants for identifying the card id/type (PDK specific value)
   */
  NBCUniCPC.CardTypes = {
    /**
     * @type {string}
     * @default
     * @readonly
     */
    PAUSE_CARD: 'rational-pause-card',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    END_CARD: 'rational-end-card',
  };

  /**
   * Asyncronously loads configuration data from a web service
   *
   * @param {object} mediator - Manages HTTP requests
   * @param {EventDispatcher} dispatcher An event dispatcher instance
   * @returns {AsyncConfigLoader}
   * @constructor
   */
  function AsyncConfigLoader(mediator, dispatcher, url) {
    var _this = this;
    var _key, _secret, _currentConfig;

    function onConfigLoaded(data) {
      _currentConfig = data;
      _this.dispatchEvent(new NBCUniCPC.Event.ConfigLoadedEvent(NBCUniCPC.Event.CONFIG_LOADED, _currentConfig, _key));
    }

    /**
     * Initiates the process of asyncrounously loading the player configution from
     * a web service.
     *
     * @param {string} key The configuration identifier
     * @param {string} secret The token required to access the configuration
     */
    this.loadConfig = function(key, secret) {
      _currentConfig = null;

      _key = key;
      _secret = secret;

      mediator.makeConfigRequest(_key, _secret, onConfigLoaded);
    };

    this.getCurrentConfig = function() {
      return _currentConfig;
    };

    this.addEventListener = function(type, callback) {
      dispatcher.addEventListener(type, callback);
    };

    this.removeEventListener = function(type, callback) {
      dispatcher.removeEventListener(type, callback);
    };

    this.dispatchEvent = function(evt) {
      dispatcher.dispatchEvent(evt);
    };
  }

  var configConstants = {
    tokens: {
      homeZip: '[MVPD_HOMEZIP]',
      encryptedHomeZip: '[MVPD_ENCRYPTED_HOMEZIP]',
      userGuid: '[USER_GUID]',
    },
    production: {
      getFlashURL: '//tve-nbc.nbcuni.com/player/GetFlash_New.html',
      unsupportedDeviceURL: '//tve-nbc.nbcuni.com/player/UnsupportedDevice_New.html?guid=[VIDEO_ID]',
      anvload: '//up.nbc.anvato.net/vodprod/scripts/anvload.js',
      pdkControllerURL: '//player.theplatform.com/pdk/HNK2IC/tpPdkController.js',
      blackoutServiceURL: 'http://tkx-prod.nbc.anvato.net/rest/v2/blackout/upid/',
      rsnControllerURL: '//client-cloudpath.nbcuni.com/rsn/current/RSN/RSNPlayer.libs.concat.min.js',
    },
    stage: {
      getFlashURL: '//tve-staging-nbc.nbcuni.com/player/stage/GetFlash_New.html',
      unsupportedDeviceURL: '//tve-staging-nbc.nbcuni.com/player/stage/UnsupportedDevice_New.html?guid=[VIDEO_ID]',
      pdkControllerURL: '//player.theplatform.com/pdk/dCK2IC/tpPdkController.js',
    },
  };

  /**
   * @desc JSON object used to resolve account requests with a player implementation
   * @example
   * //returns {'PlayerType':'MPX','playerURL':'//player.theplatform.com/p/HNK2IC/bravo_live_p3'}
   * NBCUniCPC.Config['LIVE']['BRAVO']
   * @constructor
   */
  NBCUniCPC.Config = {
    LIVE: {
      LOCAL: {
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: '//up.nbc.anvato.net/prod/scripts/anvload.js',
        anvpdata: '{}',
      },
      LOCAL_STAGE: {
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.stage.getFlashURL,
        unsupportedDeviceURL: configConstants.stage.unsupportedDeviceURL,
        anvload: '//up.nbc.anvato.net/stage/scripts/anvload.js',
        anvpdata: '{}',
      },
      LOCAL_DEV: {
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.stage.getFlashURL,
        unsupportedDeviceURL: configConstants.stage.unsupportedDeviceURL,
        anvload: '//up.nbc.anvato.net/prod/scripts/anvload.js',
        anvpdata: '{}',
      },
      NBC: {
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      NBC_STAGE: {
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.stage.getFlashURL,
        unsupportedDeviceURL: configConstants.stage.unsupportedDeviceURL,
        anvload: '//up.nbc.anvato.net/vodstage/scripts/anvload.js',
        anvpdata: '{}',
      },
      NBC_DEV: {
        PlayerType: 'ANVATO',
        getFlashURL: '//tve-dev.nbcuni.com/nbc/player/GetFlash_New.html',
        unsupportedDeviceURL: '//tve-dev.nbcuni.com/nbc/player/UnsupportedDevice_New.html?guid=[VIDEO_ID]',
        anvload: '//up.nbc.anvato.net/dev/scripts/anvload.js',
        anvpdata: '{}',
      },
      BRAVO: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/bravo_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      BRAVO_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/bravo_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      CNBC: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/cnbc_live_p3/embed[QUERYSTRING_OPTIONS]',
        enableBlackout: false,
        blackoutServiceURL: configConstants.production.blackoutServiceURL,
        blackoutKey: 'nbcu_cnbc_mpx_web_prod_ae35fa7b391a10ba9718a3c6ba98a5d758c6a6ce',
        resourceId: 'cnbc',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      CNBC_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/cnbc_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        enableBlackout: false,
        blackoutServiceURL: configConstants.production.blackoutServiceURL,
        blackoutKey: 'nbcu_cnbc_mpx_web_prod_ae35fa7b391a10ba9718a3c6ba98a5d758c6a6ce',
        resourceId: 'cnbc',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      csn_bay_area: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      csn_california: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      csn_chicago: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      'csn_mid-atlantic': {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      csn_new_england: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      csn_northwest: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      csn_philadelphia: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      E: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/e_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      E_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/e_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      ESQUIRE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/esquire_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      ESQUIRE_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/esquire_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      GOLF: {
        PlayerType: 'MPX',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/golf_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      GOLF_STAGE: {
        PlayerType: 'MPX',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/golf_live_stage_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      MSNBC: {
        PlayerType: 'MPX',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/msnbc_live[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      MSNBC_STAGE: {
        PlayerType: 'MPX',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/msnbc_live_stage[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      NBCUNIVERSO: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/nbcuniverso_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      NBCUNIVERSO_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/nbcuniverso_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      OXYGEN: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/oxygen_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      OXYGEN_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/oxygen_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      SPORTS: {
        PlayerType: 'MPX',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/nbcsports_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      SPORTS_STAGE: {
        PlayerType: 'MPX',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/nbcsports_live_stage_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      SPROUT: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/sprout_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      SPROUT_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/sprout_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      SYFY: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/syfy_live_p3/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      SYFY_STAGE: {
        PlayerType: 'MPX_P3',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/syfy_live_p3_stage/embed[QUERYSTRING_OPTIONS]',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      tcn_philadelphia: {
        PlayerType: 'PRIMETIME_RSN',
        controllerURL: configConstants.production.rsnControllerURL,
        rsn_key: 'SPORTS_RSN',
        rsn_as: 'kljjkj8Ge7GuvLC2KPu2LT',
        homeZip: configConstants.tokens.homeZip,
        encryptedHomeZip: configConstants.tokens.encryptedHomeZip,
        userGuid: configConstants.tokens.userGuid,
      },
      TELEMUNDO: {
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      USA: {
        PlayerType: 'MPX',
        controllerURL: configConstants.production.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/HNK2IC/usa_live[QUERYSTRING_OPTIONS]',
        enableBlackout: false,
        blackoutServiceURL: configConstants.production.blackoutServiceURL,
        blackoutKey: 'nbcu_usa_mpx_web_prod_b7b2715d77f2bcdabc404f78684cebd4858bf479',
        resourceId: 'usa',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      USA_STAGE: {
        PlayerType: 'MPX',
        controllerURL: configConstants.stage.pdkControllerURL,
        playerURL: '//player.theplatform.com/p/dCK2IC/usa_live_stage[QUERYSTRING_OPTIONS]',
        enableBlackout: false,
        blackoutServiceURL: configConstants.production.blackoutServiceURL,
        blackoutKey: 'nbcu_usa_mpx_web_prod_b7b2715d77f2bcdabc404f78684cebd4858bf479',
        resourceId: 'usa',
        options: ['autoPlay', 'fwsitesection', 'mvpdId'],
      },
      USA_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      USA_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      SYFY_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      SYFY_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      BRAVO_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      BRAVO_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      CNBC_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      CNBC_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      E_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      E_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      MSNBC_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      MSNBC_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      NBCUNIVERSO_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      NBCUNIVERSO_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      OXYGEN_ONEAPP: {
        PlayerType: 'MPX',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      OXYGEN_ONEAPP_STAGE: {
        PlayerType: 'MPX',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      UNIVERSALKIDS_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      UNIVERSALKIDS_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      TELEMUNDO_ONEAPP: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
      TELEMUNDO_ONEAPP_STAGE: {
        PlayerType: 'ANVATO_V3',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
      },
    },

    VOD: {
      NBC: {
        feedURL: '//feed.media.theplatform.com/f/NnzsPC/cpc?byGuid=[VIDEO_ID]',
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.production.getFlashURL,
        unsupportedDeviceURL: configConstants.production.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
        options: [
          'autoPlay',
          'carouselID',
          'dfp_300',
          'dfp_728',
          'disableEndCard',
          'endCardSeconds',
          'excludeSharing',
          'fwautoplay',
          'fwsitesection',
          'krux_user',
          'krux_segment',
          'mParticleId',
          'sequenceCompleteStrategy',
          'sp',
          'station',
          'sessionId',
          'suppressCompanions',
        ],
      },
      NBC_STAGE: {
        feedURL: '//feed.media.theplatform.com/f/0YslOC/cpcstage?byGuid=[VIDEO_ID]',
        PlayerType: 'ANVATO',
        getFlashURL: configConstants.stage.getFlashURL,
        unsupportedDeviceURL: configConstants.stage.unsupportedDeviceURL,
        anvload: configConstants.production.anvload,
        anvpdata: '{}',
        options: [
          'autoPlay',
          'carouselID',
          'dfp_300',
          'dfp_728',
          'disableEndCard',
          'endCardSeconds',
          'excludeSharing',
          'fwautoplay',
          'fwsitesection',
          'krux_user',
          'krux_segment',
          'sequenceCompleteStrategy',
          'sp',
          'station',
          'suppressCompanions',
        ],
      },
      NBC_DEV: {
        feedURL: '//feed.media.theplatform.com/f/yHjoOC/cpcdev?byGuid=[VIDEO_ID]',
        PlayerType: 'ANVATO',
        getFlashURL: '//tve-dev.nbcuni.com/nbc/player/GetFlash_New.html',
        unsupportedDeviceURL: '//tve-dev.nbcuni.com/nbc/player/UnsupportedDevice_New.html?guid=[VIDEO_ID]',
        anvload: '//up.nbc.anvato.net/dev/scripts/anvload.js',
        anvpdata: '{}',
        options: [
          'autoPlay',
          'carouselID',
          'dfp_300',
          'dfp_728',
          'disableEndCard',
          'endCardSeconds',
          'excludeSharing',
          'fwautoplay',
          'fwsitesection',
          'krux_user',
          'krux_segment',
          'sequenceCompleteStrategy',
          'sp',
          'station',
          'suppressCompanions',
        ],
      },
      BRAVO: {
        feedURL: '//feed.media.theplatform.com/f/HNK2IC/bravo_cpc?byGuid=[VIDEO_ID]',
        players: {
          longform: {
            PlayerType: 'MPX',
            controllerURL: configConstants.production.pdkControllerURL,
            playerURL: '//player.theplatform.com/p/HNK2IC/bravo_vod_p3/select/media/[MEDIA_PID][QUERYSTRING_OPTIONS]',
          },
          shortform: {
            PlayerType: 'MPX',
            controllerURL: configConstants.production.pdkControllerURL,
            playerURL:
              '//player.theplatform.com/p/HNK2IC/bravo_vod_noauth/select/media/[MEDIA_PID][QUERYSTRING_OPTIONS]',
          },
        },
        options: ['autoPlay'],
      },
      CNBC: {
        feedURL: '//feed.media.theplatform.com/f/HNK2IC/cnbc_cpc?byGuid=[VIDEO_ID]',
        players: {
          longform: {
            PlayerType: 'MPX',
            controllerURL: configConstants.production.pdkControllerURL,
            playerURL: '//player.theplatform.com/p/HNK2IC/cnbc_vod_p3',
          },
          shortform: {
            PlayerType: 'MPX',
            controllerURL: configConstants.production.pdkControllerURL,
            playerURL:
              '//player.theplatform.com/p/HNK2IC/cnbc_vod_noauth/select/media/[MEDIA_PID][QUERYSTRING_OPTIONS]',
          },
        },
        options: ['autoPlay'],
      },
    },
  };

  function ConfigParser(_config, _defaults) {
    var config = _config;
    var defaults = _defaults;
    var htmlId, contentInitializationObject, account, options;

    function getStreamType() {
      return contentInitializationObject.videoId === NBCUniCPC.StreamType.LIVE
        ? NBCUniCPC.StreamType.LIVE
        : NBCUniCPC.StreamType.VOD;
    }

    function canGetAccountObject() {
      return config && config[getStreamType()] && config[getStreamType()][account];
    }

    function getAccountObject() {
      return canGetAccountObject() ? config[getStreamType()][account] : null;
    }

    function getQueryString() {
      var arr = [];
      var accountOptions = getAccountObject().options;
      if (accountOptions) {
        for (var i = 0; i < accountOptions.length; i++) {
          var key = accountOptions[i];
          if (options[key] !== undefined) {
            arr.push(key + '=' + options[key]);
          }
        }
      }

      return arr.length > 0 ? '?' + arr.join('&') : '';
    }

    function canGetConfigDefaults() {
      return defaults;
    }

    function mvpdIdToConfigDefaultsKey(mvpdId) {
      return String(mvpdId)
        .toUpperCase()
        .replace(/-/g, '_');
    }

    function getConfigDefaults() {
      return canGetConfigDefaults() ? defaults[mvpdIdToConfigDefaultsKey(options.mvpdId)] : null;
    }

    function getDefaultValueByName(name) {
      var defaultObj = getConfigDefaults();
      return defaultObj && defaultObj.hasOwnProperty(name) ? defaultObj[name] : null;
    }

    /**
     * @see https://github.com/NBCUOTS/rp-helper/blob/master/rpHelper.js#L362
     * @returns {array} A list of segment identifiers.
     */
    function getFwSegValues() {
      var aamValues = [];
      var currCookieValue = NBCUniCPC.utils.Storage.getItem('vpsegs');
      var cList = currCookieValue ? currCookieValue.split('%3D') : [];
      if (typeof cList[1] !== 'undefined' && cList[1].match(/\w+/)) {
        var vList = cList[1].split('%2C');
        if (typeof vList[0] !== 'undefined') {
          aamValues = vList;
        }
      }
      // limit values to a max of 200
      return aamValues.slice(0, 200);
    }

    function getMpsUidCookie() {
      return NBCUniCPC.utils.Storage.getItem('mps_uuid') || '';
    }

    function getUidCookie() {
      return NBCUniCPC.utils.Storage.getItem('_uid') || '';
    }

    function replaceKeys(str) {
      str = str.replace(/\[PROTOCOL\]/g, window.location.protocol);
      str = str.replace(/\[MPS_COOKIE_ID\]/g, getMpsUidCookie());
      str = str.replace(/\[UID_COOKIE_ID\]/g, getUidCookie());
      str = str.replace(/\[VPSEGS\]/g, getFwSegValues());
      str = str.replace(/\[MEDIA_PID\]/g, contentInitializationObject.mediaPid);
      str = str.replace(/\[HTML_ID\]/g, htmlId);
      str = str.replace(/\[VIDEO_ID\]/g, contentInitializationObject.videoId);
      str = str.replace(/\[MPX_ACCOUNT_ID\]/g, contentInitializationObject.ownerId);
      str = str.replace(/\"\[AUTOPLAY\]\"/g, Boolean(options.autoPlay)); // autoplay has to be a Boolean, so you have to replace the quotes as well
      str = str.replace(/\"\[SHARE_ENABLED\]\"/g, !Boolean(options.excludeSharing)); // share has to be a Boolean, so you have to replace the quotes as well
      str = str.replace(/\[QUERYSTRING_OPTIONS\]/g, getQueryString());
      str = str.replace(/\[ANVACK_VALUE\]/g, getDefaultValueByName('anvato_key'));
      str = str.replace(/\[SITE_SECTION\]/g, options.fwsitesection || getDefaultValueByName('fwsitesection'));
      str = str.replace(/\[MVPD_ID\]/g, options.mvpdId || '');
      str = str.replace(/\[MVPD_LABEL\]/g, getDefaultValueByName('ssid_label'));
      str = str.replace(/\"\[SHOW_CONTROLS\]\"/g, Boolean(getDefaultValueByName('showPlayerControls'))); // has to be a Boolean, so you have to replace the quotes as well
      str = str.replace(/\[MAX_RATING\]/g, options.userMaxRating || '');
      str = str.replace(/\[MVPD_HOMEZIP\]/g, options.mvpdServiceZip || '');
      str = str.replace(/\[MVPD_ENCRYPTED_HOMEZIP\]/g, options.mvpdEncryptedServiceZip || '');
      str = str.replace(/\"\[START_POSITION\]\"/g, options.sp || 0); // default to 0 when no value specified. value should be a number, so you have to replace quotes as well
      str = str.replace(/\[EXTERNAL_ADVERTISER_ID\]/g, contentInitializationObject.externalAdvertiserId);
      str = str.replace(/\[RSN_KEY\]/g, getDefaultValueByName('rsn_key'));
      str = str.replace(/\[RSN_AS\]/g, getDefaultValueByName('rsn_as'));
      str = str.replace(/\[USER_GUID\]/g, options.userGuid);
      str = str.replace(/\[M_PARTICLE_ID\]/g, options.mParticleId);
      str = str.replace(/\[PAGE_APP_VERSION\]/g, options.pageAppVersion);
      str = str.replace(/\[IP_ADDRESS\]/g, options.ipAddress);
      str = str.replace(/\[APP_SESSION_ID\]/g, options.appSessionId);
      str = str.replace(/\[GENERATED_GUID\]/g, NBCUniCPC.utils.guid());

      return str;
    }

    function isVOD() {
      return getStreamType() === NBCUniCPC.StreamType.VOD;
    }

    function isFullEpisode() {
      return isVOD() && contentInitializationObject.fullEpisode;
    }

    function getContentType() {
      return isFullEpisode() ? 'longform' : 'shortform';
    }

    function isValidPlayerType(str) {
      for (var prop in PlayerType) {
        if (PlayerType[prop] === str) {
          return true;
        }
      }
      return false;
    }

    function isPlayerObject(obj) {
      return isValidPlayerType(obj.PlayerType);
    }

    function hasPlayerDisableEndCard(player, _options) {
      if (player.disableEndCard) {
        if (_options && _options.disableEndCard && isPlayerObject(player.disableEndCard)) {
          return player.disableEndCard;
        } else if (isPlayerObject(player.default)) {
          return player.default;
        }
      }
      return false;
    }

    function accountHasPlayers(players, contentType, _options) {
      var player = players[contentType];
      if (player) {
        if (isPlayerObject(player)) {
          return player;
        }
        var playerWithDisableEndCard = hasPlayerDisableEndCard(player, _options);
        if (playerWithDisableEndCard) {
          return playerWithDisableEndCard;
        }
      }
      return false;
    }

    function getRawPlayerObject(_account, _contentInitializationObject, _options) {
      var accountObject = getAccountObject();
      if (canGetAccountObject()) {
        if (isPlayerObject(accountObject)) {
          return accountObject;
        } else if (accountObject.players) {
          var player = accountHasPlayers(accountObject.players, getContentType(), _options);
          if (player) {
            return player;
          }
        }
      }

      throw new Error(
        "Unable to retrieve valid player object. Check your configuration's account object for a valid PlayerType.",
      );
    }

    this.getPlayerObject = function(_htmlId, _account, _contentInitializationObject, _options) {
      htmlId = _htmlId;
      account = _account;
      contentInitializationObject = _contentInitializationObject;
      options = _options || {};

      var playerObj = NBCUniCPC.utils.shallowCopy(getRawPlayerObject(_account, _contentInitializationObject, _options));
      //do URL replacement for string values. Added check for string type b/c booleans, etc may end up in config
      for (var prop in playerObj) {
        if (typeof playerObj[prop] === 'string') {
          playerObj[prop] = replaceKeys(playerObj[prop]);
        }
      }

      return playerObj;
    };

    this.getPlayerType = function(_htmlId, _account, _contentInitializationObject, _options) {
      return this.getPlayerObject(_htmlId, _account, _contentInitializationObject, _options).PlayerType;
    };
  }

  /**
   * Resolves conflicts or discrepancies between an asyncronously loaded configuration
   * object and an existing, bundled configuration
   *
   * @param {object} newConfig The latest, asyncronously loaded configuration object
   * @param {object} targetConfig The existing or bundled configuration object
   */
  function ConfigResolver(newConfig, targetConfig) {
    var _account, _videoId;

    function getStreamType() {
      return _videoId === NBCUniCPC.StreamType.LIVE ? NBCUniCPC.StreamType.LIVE : NBCUniCPC.StreamType.VOD;
    }

    function getChannelConfigForAccount() {
      var channels = newConfig.channelsConfig;
      for (var i = 0; i < channels.length; i++) {
        if (channels[i].id === _account) {
          return channels[i];
        }
      }

      return null;
    }

    function getModuleNameForVideoType() {
      var channelConfig = getChannelConfigForAccount();

      return getStreamType() === NBCUniCPC.StreamType.LIVE
        ? channelConfig.live.playerModule
        : channelConfig.vod.playerModule;
    }

    function getSpecificConfig() {
      var moduleName = getModuleNameForVideoType();

      var modules = newConfig.modules;
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].name === moduleName) {
          return modules[i].specificConfig;
        }
      }

      return null;
    }

    function fixSyntax(obj) {
      if (obj && obj.hasOwnProperty('anvpdata') && typeof obj.anvpdata !== 'string') {
        obj.anvpdata = JSON.stringify(obj.anvpdata);
      }

      return obj;
    }

    this.resolve = function(account, videoId) {
      _account = account;
      _videoId = videoId;

      targetConfig[getStreamType()][_account] = fixSyntax(getSpecificConfig());
    };
  }

  /**
   * @desc Default configuration values for the onsite CPC players. Compare with
   * {@link MVPDConfigDefaults.js}. The ConfigDefaults file that gets included
   * with a player is determined by the build configuration.
   */
  var ConfigDefaults;

  /**
   * Manages interactions between the content metadata, the skip into buttons, and
   * the player.
   *
   * @param {ConfigParser} parser - A ConfigParser instance
   * @param {Player} player - A Player instance
   * @param {ContentMetadataDAO} cmdao - provides ContentMetadata for the current
   * asset
   * @param {MetadataRequestMediator} mediator - Sends and interprets requests for
   * content metadata.
   * @param {window} win - The window object
   */
  function SkipIntroController(parser, player, cmdao, mediator, win) {
    var logger = new Logger('SkipIntroController');
    var HIDDEN = 'hidden';
    var VISIBLE = 'visible';
    var state;
    var _htmlId;
    var currentCIO;
    var metadata;
    var config;
    var targetWindow;
    var introStartTimeMS;
    var introEndTimeMS;

    function isValidState(value) {
      return value === HIDDEN || value === VISIBLE;
    }

    function sendHideMessages() {
      targetWindow.postMessage(config.hideButtonMessage, config.targetOrigin);
    }

    function sendShowMessages() {
      if (config.setButtonTextMessage) {
        targetWindow.postMessage(config.setButtonTextMessage, config.targetOrigin);
      }
      targetWindow.postMessage(config.showButtonMessage, config.targetOrigin);
    }

    function setState(value) {
      if (!targetWindow || state === value || !isValidState(value)) {
        return;
      }

      state = value;
      switch (state) {
        case HIDDEN:
          sendHideMessages();
          break;
        case VISIBLE:
          sendShowMessages();
          break;
      }
    }

    function onButtonClick() {
      setState(HIDDEN);
      player.play();
      player.seekToMilliseconds(introEndTimeMS);
    }

    function handleFilteredMessage(evt) {
      if (evt.origin === config.targetOrigin && config.buttonClickedMessage.type === evt.data.type) {
        onButtonClick();
      }
    }

    function initTargetsMaybe() {
      if (targetWindow) {
        return;
      }

      try {
        targetWindow = win.document.getElementById(_htmlId).contentWindow;
      } catch (err) {
        logger.warn('Unable to retrieve target window.');
      }

      if (targetWindow) {
        win.addEventListener('message', handleFilteredMessage, false);
      }
    }

    function isIntroPlaying(evt) {
      var seconds = Number(evt.data.currentTimeAggregate);
      return seconds >= introStartTimeMS && seconds <= introEndTimeMS;
    }

    function shouldShowButtons(evt) {
      return evt.data.isMainTimeline && isIntroPlaying(evt);
    }

    function onPlayheadUpdate(evt) {
      initTargetsMaybe();

      setState(shouldShowButtons(evt) ? VISIBLE : HIDDEN);
    }

    function reset(cio) {
      player.removeEventListener(NBCUniCPC.Event.PLAYHEAD_UPDATE, onPlayheadUpdate);
      currentCIO = cio;
      introStartTimeMS = -1;
      introEndTimeMS = -1;
      setState(HIDDEN);
      metadata = null;
    }

    function addPlayheadListenerMaybe() {
      if (introEndTimeMS > introStartTimeMS && introStartTimeMS >= 0) {
        player.addEventListener(NBCUniCPC.Event.PLAYHEAD_UPDATE, onPlayheadUpdate);
      }
    }

    function onMetadataReceived(value) {
      if (currentCIO.videoId !== value.videoId()) {
        logger.warn('Received video id does not match expected value');
        return;
      }

      metadata = value;
      introStartTimeMS =
        Math.max(metadata.startPreviouslyOnSequence(), metadata.startTeaseSequence(), metadata.startTitleSequence()) *
        1000;
      introEndTimeMS =
        Math.max(metadata.endPreviouslyOnSequence(), metadata.endTeaseSequence(), metadata.endTitleSequence()) * 1000;
      addPlayheadListenerMaybe();
    }

    function getMergedConfigOrNull(htmlId, account, cio, playerParameters) {
      var playerObj = parser.getPlayerObject(htmlId, account, cio, playerParameters);
      if (
        !playerObj ||
        !playerObj.hasOwnProperty('skipIntroFeatureEnabled') ||
        playerObj.skipIntroFeatureEnabled !== true ||
        !playerObj.hasOwnProperty('skipIntroConfig')
      ) {
        return null;
      }

      var merged = null;
      try {
        merged = JSON.parse(playerObj.skipIntroConfig);
        merged.metadataSettings = playerObj.metadataSettings;
      } catch (err) {
        logger.warn('Unable to parse skip intro config');
      }

      return merged;
    }

    /**
     * @param {string} htmlId - The ID of an existing HTML element that will be
     * replaced with a player
     * @param {string} account - The account (a.k.a brand or channel) associated
     * with the media and player
     * @param {ContentInitializationObject} cio - an instance of {@link NBCUniCPC.ContentInitializationObject}
     * @param {PlayerParameters} [playerParameters] - an instance of {@link NBCUniCPC.PlayerParameters}
     */
    this.setEventInfo = function(htmlId, account, cio, playerParameters) {
      reset(cio);
      _htmlId = htmlId;

      config = getMergedConfigOrNull(htmlId, account, cio, playerParameters);
      if (!config) {
        return;
      }

      mediator.setRequestSettings(config.metadataSettings);
      cmdao.requestContentMetadata(cio, onMetadataReceived);
    };
  }

  var EntitlementStatus = {
    UNINITIALIZED: 'uninitialized',
    READY: 'ready',
    UNLOADED: 'unloaded',
  };

  function AbstractEntitlementStrategy(_coreStrategy, _playerWrapper, _concurrencyValidator, _apCore, _playerConfig) {
    var logger = new Logger('AbstractEntitlementStrategy');
    var _this = this;
    var status = EntitlementStatus.UNINITIALIZED;

    var assetmetadata;
    var firstProgramChangeEventReceived = false;

    function debug(str) {
      logger.log(str);
    }

    function warn(str) {
      logger.warn(str);
    }

    this.getStatus = function() {
      return status;
    };

    function setStatus(value) {
      debug('setStatus. status is currently: ' + status + ', supplied value is: ' + value);
      if (EntitlementStatus.READY === value) {
        // READY state is reachable only from UNINITIALIZED or UNLOADED
        if (EntitlementStatus.UNINITIALIZED === status || EntitlementStatus.UNLOADED === status) {
          status = value;
        }
      } else if (EntitlementStatus.UNLOADED === value) {
        // UNLOADED state is reachable only from READY
        if (EntitlementStatus.READY === status) {
          status = value;
        }
      }
    }

    this.hasReceivedProgramChange = function() {
      return firstProgramChangeEventReceived;
    };

    this.kill = function(logoutIfLoggedIn) {
      debug('*KILL*');
      //	option 1:
      //	_playerWrapper.unload();
      //
      //
      //option 2:
      setStatus(EntitlementStatus.UNLOADED);
      _playerWrapper.pause(true);
      debug('** PAUSE INVOKED **');
    };

    function checkConcurrency() {
      _concurrencyValidator.updateAssetMetadata(assetmetadata);
    }

    function onConcurrencyEvent(evt) {
      debug('onConcurrencyEvent : ' + JSON.stringify(evt));
      switch (evt.type) {
        case ConcurrencyValidator.STATUS_EVENT:
          _apCore.getAuthorization(assetmetadata);
          break;
        case ConcurrencyValidator.ERROR_EVENT:
          _this.kill();
          break;
        default:
          debug('Unhandled concurrency event type: ' + evt.type);
      }
    }

    function onAuthenticationStatusEvent(e) {
      debug('onAuthenticationStatusEvent');
      if (e.data.isAuthenticated) {
        checkConcurrency();
      }
    }

    /* *
     * Starting point for the sequence of calls to gain user authorization for
     * content
     */
    this.executeAuth = function() {
      debug('executeAuth');
      _apCore.executeAuth();
    };

    function initAuthKillChecksAtRelevantProgramBoundaries(evt) {
      debug('initAuthKillChecksAtRelevantProgramBoundaries');
      if (firstProgramChangeEventReceived) {
        // check auth kill switch starting at the second program boundary. Anvato
        // sends an initial PROGRAM_CHANGED at stream start, so we should skip
        // the first call.
        _this.requestAssetMetadata();
      }
      firstProgramChangeEventReceived = true;
    }

    function continueExecution() {
      setStatus(EntitlementStatus.READY);
      _playerWrapper.addEventListener(NBCUniCPC.Event.PROGRAM_CHANGED, initAuthKillChecksAtRelevantProgramBoundaries);
      _coreStrategy.execute();
    }

    function resumeAfterUnload() {
      setStatus(EntitlementStatus.READY);
      _playerWrapper.pause(false);
    }

    this.loadPlayer = function() {
      debug('loadPlayer');
      switch (status) {
        case EntitlementStatus.UNINITIALIZED:
          continueExecution();
          break;
        case EntitlementStatus.UNLOADED:
          resumeAfterUnload();
          break;
        default:
          warn('loadPlayer called more than once from ready state.');
      }
    };

    this.onAssetMetadataUpdate = function(updated) {
      throw new Error('onAssetMetadataUpdate is an abstract method that must be defined by a subclass');
    };

    this.updateAssetMetadata = function(value) {
      assetmetadata = value;
      _this.onAssetMetadataUpdate(assetmetadata);
    };

    this.requestAssetMetadata = function() {
      throw new Error('requestAssetMetadata is an abstract method that must be defined by a subclass');
    };

    this.onAuthorizationSuccess = function(evt) {
      throw new Error('onAuthorizationSuccess is an abstract method that must be defined by a subclass');
    };

    this.canLoadPlayer = function() {
      throw new Error('canLoadPlayer is an abstract method that must be defined by a subclass');
    };

    function embedWhenReady() {
      debug('embedWhenReady');
      if (_this.canLoadPlayer()) {
        _this.requestAssetMetadata();
      }
    }

    function getDependencies() {
      debug('getDependencies');
      embedWhenReady(); // no dependencies, now that jQuery has moved to GeoRequestFactory
    }

    this.execute = function() {
      debug('execute');
      _apCore.initWithDependencies(_playerConfig, _playerWrapper);
      _apCore.addEventListener(NBCUniCPC.Event.AUTHENTICATION_STATUS, onAuthenticationStatusEvent);
      _apCore.addEventListener(AdobePassCore.AUTHORIZATION_SUCCESS_EVENT, _this.onAuthorizationSuccess);

      _concurrencyValidator.addEventListener(ConcurrencyValidator.ERROR_EVENT, onConcurrencyEvent);
      _concurrencyValidator.addEventListener(ConcurrencyValidator.STATUS_EVENT, onConcurrencyEvent);

      getDependencies();
    };
  }

  /**
   * Manages all interactions with Adobe Access Enabler.
   *
   * This class implements the decorator pattern to run its logic and then delegate
   * a call to <code>execute()</code> on the underlying strategy when possible.
   *
   * <b>Important:</b> This strategy assumes that the user is attempting to play
   * linear content.
   *
   * @param {EventDispatcher} dispatcher An EventDispatcher instance
   * @param {object} _accessEnablerProxy Provides an instance of accessEnabler
   * through a callback
   *
   * @constructor
   */
  function AdobePassCore(dispatcher, _accessEnablerProxy, _tempPass) {
    var logger = new Logger('AdobePassCore');
    var _this = this;
    var _playerWrapper = null;
    var _playerConfig = null;

    _this.addEventListener = dispatcher.addEventListener;
    _this.removeEventListener = dispatcher.removeEventListener;
    _this.dispatchEvent = dispatcher.dispatchEvent;

    var UNINITIALIZED = 'uninitialized';
    var READY = 'ready';
    var status = UNINITIALIZED;
    var onReadyCallback;

    var MVPD_IFRAME_CONTAINER_ID = 'mvpddiv';
    var MVPD_IFRAME_ID = 'mvpdframe';
    var ZIP = 'zip';
    var ENCRYPTED_ZIP = 'encryptedZip';
    var MAX_RATING = 'maxRating';
    var usermetadata = new AdobePassCore.UserMetadata();
    var firstProgramChangeEventReceived = false;
    var _accessEnabler;
    var encodedAuthorizationToken;

    var authenticator = null;
    var authorizer = null;
    var requestor = null;
    var resourceId = null;
    var aeNeedsReset = false;

    function debug(str) {
      logger.log(str);
    }

    function warn(str) {
      logger.warn(str);
    }

    /**
     * This bad boy became necessary when new classes needed to listen for events
     * that did not have access to the playerWrapper
     */
    function twoWayDispatch(eventObj) {
      _this.dispatchEvent(eventObj);
      _playerWrapper.dispatchEvent(eventObj);
    }

    this.getUserMetadata = function() {
      debug('getUserMetadata : ' + JSON.stringify(usermetadata));
      return usermetadata;
    };

    function executeWhenReady() {
      debug('AdobePassCore::executeWhenReady');
      debug('onReadyCallback: ' + onReadyCallback + ', status is: ' + status);

      if (onReadyCallback && READY === status) {
        onReadyCallback();
      }
    }

    function setStatus(value) {
      // READY state is reachable only from UNINITIALIZED
      if (READY === value && UNINITIALIZED === status) {
        status = value;
        executeWhenReady();
      }
    }

    function kill(logoutIfLoggedIn) {
      //	option 1:
      //	_playerWrapper.unload();
      //
      //
      //option 2:
      _playerWrapper.pause(true);

      if (logoutIfLoggedIn && aeNeedsReset) {
        aeNeedsReset = false;
        _accessEnabler.setSelectedProvider(null);
        _accessEnabler.getAuthentication(null);
      }
    }

    /* *
     * Trigger: getAuthentication(), only if the user has not selected a provider
     * (an MVPD), and is not yet authenticated.
     * @param {Array} mvpds - an array of providers available to the user.
     */
    function displayProviderDialog(mvpds) {
      if (_tempPass.enabled && _tempPass.getStatus() !== TempPassAuthentication.Status.ENDED) {
        debug('displayProviderDialog::Temp Pass is enabled, so....');
        _tempPass.startSession();
      } else {
        if (firstProgramChangeEventReceived) {
          debug('AdobePassCore::displayProviderDialog user is NOT authenticated. Stop playback / logout if necessary.');
          kill(true);
        }

        debug('AdobePassCore::displayProviderDialog');
        var eventObj = {
          type: NBCUniCPC.Event.AUTHENTICATION_STATUS,
          data: {
            isAuthenticated: false,
            authenticator: authenticator,
            error_code: '',
            message: 'Authentication status has changed.',
          },
        };
        _playerWrapper.dispatchEvent(eventObj);

        var eventObj2 = {
          type: NBCUniCPC.Event.PICKER_REQUESTED,
          data: {
            message: 'MVPD picker has been requested.',
          },
        };
        _playerWrapper.dispatchEvent(eventObj2);
      }
    }

    /**
     * Helper function to format an MRSS string for Adobe Pass authorization with
     * correctly formatted tv rating value. The tv rating value defaults to "TV-Y"
     * if no rating is supplied in the asset metadata
     * @param {object} metadata - Contains metadata about the asset. This is
     * probably the parsed JSON response from the geo service.
     * @returns {string} The appropiately formatted tv rating value
     */
    this.getMRSSForMetadata = function(metadata) {
      //	The geo response looks something like this:
      //	{
      //	  "assetInfo": {
      //	  ...
      //	  "tvRating": "TVG"
      //	},
      //	...
      //
      // We need the tv rating value that we send to Adobe to look like "TV-G"

      var tvRating = 'TV-Y'; // default, in case no rating is supplied
      if (
        metadata &&
        metadata.hasOwnProperty('assetInfo') &&
        metadata.assetInfo.hasOwnProperty('tvRating') &&
        metadata.assetInfo.tvRating &&
        metadata.assetInfo.tvRating.hasOwnProperty('length') &&
        metadata.assetInfo.tvRating.length > 0
      ) {
        var upperRating = metadata.assetInfo.tvRating.toUpperCase();
        var prefix = 'TV';
        var divider = '-';
        var split1 = upperRating.split(prefix);
        var root = split1[split1.length - 1];
        var split2 = root.split(divider);
        tvRating = prefix + divider + split2[split2.length - 1];
      } else {
        warn('No tv rating specified. Using default value: ' + tvRating);
      }
      if (metadata && metadata.hasOwnProperty('assetInfo') && metadata.assetInfo.hasOwnProperty('resourceId')) {
        resourceId = metadata.assetInfo.resourceId;
      }

      var rss = '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">';
      rss += '<channel>';
      rss += '<title>' + requestor + '</title>';
      rss += '<item>';
      rss += '<title><![CDATA[' + requestor + ']]></title>';
      rss += '<guid>' + resourceId + '</guid>';
      rss += '<media:rating scheme="urn:v-chip">' + tvRating + '</media:rating>';
      rss += '</item>';
      rss += '</channel>';
      rss += '</rss>';
      return rss;
    };

    /**
     * This needs to be called by the driver
     */
    this.getAuthorization = function(assetmetadata) {
      aeNeedsReset = true;
      debug('AdobePassCore::setAuthenticationStatus user is authenticated. Check authorization');
      _accessEnabler.getSelectedProvider();
      _accessEnabler.getAuthorization(_this.getMRSSForMetadata(assetmetadata));
    };

    /* *
     * Trigger: checkAuthentication(), getAuthentication(), checkAuthorization()
     *
     * Called upon completion of a checkAuthentication() request. Passes the authentication status (1=authenticated or 0=not authenticated)
     * @param {boolean} isAuthenticated - Provides authentication status: 1 (authenticated) or 0 (not authenticated).
     * @param {string} errorCode - Any error that occurred when determining authentication status. An empty string if none.
     */
    function setAuthenticationStatus(isAuthenticated, errorCode) {
      debug('AdobePassCore::setAuthenticationStatus');
      if (
        _tempPass.enabled &&
        _tempPass.getStatus() === TempPassAuthentication.Status.UNINITIALIZED &&
        !isAuthenticated
      ) {
        debug('setAuthenticationStatus::Temp Pass is enabled, so....');
        _tempPass.startSession();
      } else {
        // we explicitly cast 1 to true to accommodate NBCD
        var eventObj = {
          type: NBCUniCPC.Event.AUTHENTICATION_STATUS,
          data: {
            isAuthenticated: isAuthenticated ? true : false,
            authenticator: authenticator,
            error_code: errorCode,
            message: 'Authentication status has changed.',
          },
        };
        twoWayDispatch(eventObj);
        if (!isAuthenticated) {
          debug(
            'AuthKillSwitchStrategy::setAuthenticationStatus user is NOT authenticated. Stop playback / logout if necessary.',
          );
          kill(true);
        }
      }
    }

    /* *
     * Trigger: getSelectedProvider().
     * @param {type} mvpd - The user's selected MVPD or null
     */
    function selectedProvider(mvpd) {
      debug('AdobePassCore::selectedProvider');
      debug(JSON.stringify(mvpd));

      usermetadata.adobeMvpdId = mvpd;
      var eventObj = {
        type: NBCUniCPC.Event.PROVIDER_SELECTED,
        data: {
          provider_id: usermetadata.adobeMvpdId,
          message: 'User selected a provider/previously selected provider has been set.',
        },
      };
      twoWayDispatch(eventObj);
    }

    function onAuthorizationSuccess() {
      debug('AdobePassCore::onAuthorizationSuccess');
      _this.dispatchEvent(new AdobePassCore.Event.AuthorizationSuccessEvent(usermetadata));
    }

    /* *
     * Trigger: getMetadata().
     */
    function setMetadataStatus(key, encrypted, data) {
      debug('setMetadataStatus key: ' + key + ', encrypted: ' + encrypted + ', data: ' + data);
      switch (key) {
        case ZIP:
          usermetadata.serviceZip = data;
          break;
        case ENCRYPTED_ZIP:
          usermetadata.encryptedZip = data;
          break;
        case MAX_RATING:
          usermetadata.maxRating = data;
          break;
      }

      if (usermetadata.serviceZip !== '' && usermetadata.encryptedZip !== '' && usermetadata.maxRating !== '') {
        onAuthorizationSuccess();
      }
    }

    /* *
     * â€‹Trigger:  checkAuthorization() and getAuthorization() after a successful
     * authorization to view a resource.
     *
     * @param {type} resource - the content that the user is authorized to view.
     * @param {type} token - the short-lived media token
     */
    function setToken(resource, token) {
      debug('AdobePassCore::setToken');
      debug(JSON.stringify(resource));
      debug(JSON.stringify(token));
      encodedAuthorizationToken = encodeURIComponent(token);
      debug('encodedAuthorizationToken : ' + encodedAuthorizationToken);

      var eventObj = {
        type: NBCUniCPC.Event.AUTHORIZATION_STATUS,
        data: {
          resource: resource,
          authorizer: authorizer,
          error_code: null,
          isAuthorized: true,
          message: 'Authorization status has changed.',
          token: encodedAuthorizationToken,
        },
      };

      twoWayDispatch(eventObj);

      usermetadata.serviceZip = '';
      usermetadata.encryptedZip = '';
      usermetadata.maxRating = '';

      _playerWrapper.setToken(encodedAuthorizationToken);
      _accessEnabler.getMetadata(ZIP);
      _accessEnabler.getMetadata(ENCRYPTED_ZIP);
      _accessEnabler.getMetadata(MAX_RATING);
    }

    /* *
     * â€‹Trigger: checkAuthorization() and getAuthorization() after an unsuccessful authorization.
     * @param {type} resource - the content that the user was attempting to view
     * @param {type} code - the error code indicating what type of failure
     * occurred
     * @param {type} description - describes the error associated with the error
     * code
     */
    function tokenRequestFailed(resource, code, description) {
      debug('AdobePassCore::tokenRequestFailed');
      debug(JSON.stringify(resource));
      debug(JSON.stringify(code));
      var message = description.trim().replace('\n', '');
      debug(JSON.stringify(message));
      var eventObj = {
        type: NBCUniCPC.Event.AUTHORIZATION_STATUS,
        data: {
          resource: resource,
          authorizer: authorizer,
          error_code: code,
          isAuthorized: false,
          message: message,
          token: null,
        },
      };
      twoWayDispatch(eventObj);
    }

    function appendDivMaybe() {
      debug('AdobePassCore::appendDivMaybe');
      var div, iframe, body;

      body = document.getElementsByTagName('body')[0];

      div = document.getElementById(MVPD_IFRAME_CONTAINER_ID) || document.createElement('div');
      div.id = MVPD_IFRAME_CONTAINER_ID;
      div.name = MVPD_IFRAME_CONTAINER_ID;
      div.style = 'display: none;';

      iframe = document.getElementById(MVPD_IFRAME_ID) || document.createElement('iframe');
      iframe.id = MVPD_IFRAME_ID;
      iframe.name = MVPD_IFRAME_ID;
      iframe.src = '#';

      body.appendChild(div);
      div.appendChild(iframe);
    }

    function destroyIFrame() {
      debug('AdobePassCore::destroyIFrame');
      var el = document.getElementById(MVPD_IFRAME_CONTAINER_ID);
      el.parentNode.removeChild(el);

      _playerWrapper.dispatchEvent({
        type: NBCUniCPC.Event.PROVIDER_IFRAME_REMOVED,
        data: {
          container_id: MVPD_IFRAME_CONTAINER_ID,
        },
      });
    }

    /* *
     * This function is called if the selected provider is configured to display in an IFrame.
     * A provider is configured to render its authentication screen as either a redirect or in an iFrame, and the Programmer needs to account for both.
     * Trigger: setSelectedProvider(providerID)
     *
     * @see http://tve.helpdocsonline.com/javascript-api-reference-v2$$getAuthZ
     */
    function createIFrame(width, height) {
      debug('AdobePassCore::createIFrame');
      debug('width: ' + width + ', height: ' + height);
      appendDivMaybe();

      // Move the div to be centered on the page relative to the size of the iframe.
      var mvpddiv = document.getElementById(MVPD_IFRAME_CONTAINER_ID);
      mvpddiv.style.position = 'absolute';
      mvpddiv.style.display = 'block';
      mvpddiv.style.top = '50px';
      mvpddiv.style.left = '50%';
      mvpddiv.style.zIndex = '100';
      mvpddiv.style.background = 'white';
      mvpddiv.style.marginLeft = '-' + width / 2 + 'px';

      // Create the iframe to the specified width and height for the MVPD login page.
      var iframe = document.getElementById('mvpdframe');
      iframe.style.width = width + 'px';
      iframe.style.height = height + 'px';

      // Force the name into the DOM since it is still not refreshed, for IE.
      window.frames['mvpdframe'].name = 'mvpdframe';

      _playerWrapper.dispatchEvent({
        type: NBCUniCPC.Event.PROVIDER_IFRAME_INJECTED,
        data: {
          provider_id: usermetadata.adobeMvpdId,
          container_id: MVPD_IFRAME_CONTAINER_ID,
          width: width,
          height: height,
        },
      });
    }

    function onSetSelectedProviderInvoked(evt) {
      debug('AdobePassCore::onSetSelectedProviderInvoked');
      usermetadata.adobeMvpdId = evt.data.provider_id;
      if (_accessEnabler) {
        _accessEnabler.setSelectedProvider(evt.data.provider_id);
      }
    }

    /* *
     * Callback for the access enabler's bind function used for Advanced Error Reporting
     *
     * The event object looks like this:
  {
    errorId: "CFG410",
    level: "error",
    subErrorId:  "10002321239",       // Optional
    message: "This a fancy message",  // Optional
    .
    .                                 // Optional key/value pairs
    .
  }
     * @see http://tve.helpdocsonline.com/error-reporting$advanced
     */
    function myCustomErrorHandler(e) {
      debug('BIND :: ' + JSON.stringify(e));
    }

    function processCallbackEvent(evt) {
      switch (evt.type) {
        case AccessEnablerWrapper.DISPLAY_PROVIDER_DIALOG_EVENT:
          // @see AccessEnablerWrapper.Event.DisplayProviderDialogEvent
          displayProviderDialog(evt.providers);
          break;
        case AccessEnablerWrapper.SET_TOKEN_EVENT:
          // @see AccessEnablerWrapper.Event.SetTokenEvent
          setToken(evt.resource, evt.token);
          break;
        case AccessEnablerWrapper.TOKEN_REQUEST_FAILED_EVENT:
          // @see AccessEnablerWrapper.Event.TokenRequestFailedEvent
          tokenRequestFailed(evt.resource, evt.code, evt.description);
          break;
        case AccessEnablerWrapper.SET_AUTHENTICATION_STATUS_EVENT:
          // @see AccessEnablerWrapper.Event.SetAuthenticationStatusEvent
          setAuthenticationStatus(evt.isAuthenticated, evt.errorCode);
          break;
        case AccessEnablerWrapper.SET_METADATA_STATUS_EVENT:
          // @see AccessEnablerWrapper.Event.SetMetadataStatusEvent
          setMetadataStatus(evt.key, evt.encrypted, evt.data);
          break;
        case AccessEnablerWrapper.CREATE_IFRAME_EVENT:
          // @see AccessEnablerWrapper.Event.CreateIFrameEvent
          createIFrame(evt.width, evt.height);
          break;
        case AccessEnablerWrapper.DESTROY_IFRAME_EVENT:
          // @see AccessEnablerWrapper.Event.DestroyIFrameEvent
          destroyIFrame();
          break;
        case AccessEnablerWrapper.SELECTED_PROVIDER_EVENT:
          // @see AccessEnablerWrapper.Event.SelectedProviderEvent
          selectedProvider(evt.mvpd);
          break;
      }
    }

    function onAccessEnabler(ae) {
      debug('AdobePassCore::onAccessEnabler');
      _accessEnabler = ae;
      _accessEnabler.addEventListener(AccessEnablerWrapper.DISPLAY_PROVIDER_DIALOG_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.SET_TOKEN_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.TOKEN_REQUEST_FAILED_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.SET_AUTHENTICATION_STATUS_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.SET_METADATA_STATUS_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.CREATE_IFRAME_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.DESTROY_IFRAME_EVENT, processCallbackEvent);
      _accessEnabler.addEventListener(AccessEnablerWrapper.SELECTED_PROVIDER_EVENT, processCallbackEvent);

      NBCUniCPC.accessEnablerErrorHandler = myCustomErrorHandler;
      _accessEnabler.bind('errorEvent', 'NBCUniCPC.accessEnablerErrorHandler');

      setStatus(READY);
    }

    function getDependencies() {
      debug('AdobePassCore::getDependencies');
      _accessEnablerProxy.getAccessEnabler(onAccessEnabler); // !!! this line needs to be commented to works Auth correctly !!!
    }

    function _execute() {
      // backgroundLogin and backgroundLogout options enable refreshless login
      // @see http://tve.helpdocsonline.com/refreshless-login-/-logout
      _accessEnabler.setRequestor(requestor, null, {
        callSetConfig: true,
        backgroundLogin: true,
        backgroundLogout: true,
      });
      _accessEnabler.getAuthentication();
    }

    /* *
     * Starting point for the sequence of calls to gain user authorization for
     * content. This needs to be called by the driver.
     */
    this.executeAuth = function() {
      debug('AdobePassCore::executeAuth');
      onReadyCallback = _execute;
      executeWhenReady();
    };

    function updateMvpdOnPlayerLoad(evt) {
      _playerWrapper.removeEventListener(NBCUniCPC.Event.PLAYER_LOADED, updateMvpdOnPlayerLoad);
      try {
        _playerWrapper.updateMvpd(usermetadata.adobeMvpdId);
      } catch (e) {
        logger.warn(e);
      }
    }

    function onProgramChangedEvent(e) {
      firstProgramChangeEventReceived = true;
    }

    function onTempPassSessionStart(e) {
      debug('onTempPassSessionStart e: ' + JSON.stringify(e));
      usermetadata.adobeMvpdId = TempPassAuthentication.ID;
      onAuthorizationSuccess();
    }

    function onTempPassSessionEnd(e) {
      debug('onTempPassSessionEnd e: ' + JSON.stringify(e));
      _this.executeAuth();
    }

    function init() {
      var params = JSON.parse(_playerConfig.entitlement);
      authenticator = params.authenticator;
      authorizer = params.authorizer;
      requestor = params.requestor;
      resourceId = params.resourceId;

      debug('AdobePassCore::init');
      _playerWrapper.canSetSelectedProvider = function() {
        return false;
      };
      _playerWrapper.addEventListener(NBCUniCPC.Event.PROGRAM_CHANGED, onProgramChangedEvent);
      _playerWrapper.addEventListener(NBCUniCPC.Event.PLAYER_LOADED, updateMvpdOnPlayerLoad);
      _playerWrapper.addEventListener(
        PlayerWrapperEvent.SET_SELECTED_PROVIDER_INVOKED_EVENT,
        onSetSelectedProviderInvoked,
      );

      _tempPass.initWithDependencies(_playerConfig, _playerWrapper);
      _tempPass.addEventListener(NBCUniCPC.Event.TEMP_PASS_SESSION_START, onTempPassSessionStart);
      _tempPass.addEventListener(NBCUniCPC.Event.TEMP_PASS_SESSION_END, onTempPassSessionEnd);
      getDependencies();
    }

    /* *
     * This needs to be called by the driver.
     */
    this.initWithDependencies = function(config, wrapper) {
      _playerConfig = config;
      _playerWrapper = wrapper;
      init();
    };
  }

  AdobePassCore.UserMetadata = function() {
    this.adobeMvpdId = '';
    this.serviceZip = '';
    this.encryptedZip = '';
    this.maxRating = '';
  };

  AdobePassCore.AUTHORIZATION_SUCCESS_EVENT = 'AUTHORIZATION_SUCCESS_EVENT';

  /**
   * @namespace AdobePassCore.Event
   * @desc Events dispatched by the AdobePassCore in response to authentication
   * authorization status updates
   */
  AdobePassCore.Event = {
    /**
     * Fires upon successful authorization
     * @event
     * @param {string} type - {@link AdobePassCore.AUTHORIZATION_SUCCESS_EVENT}
     * @param {AdobePassCore.UserMetadata} usermetadata - An object containing the
     * Adobe Pass user metadata
     */
    AuthorizationSuccessEvent: function(usermetadata) {
      this.type = AdobePassCore.AUTHORIZATION_SUCCESS_EVENT;
      this.usermetadata = usermetadata;
    },
  };

  /**
   *
   * This strategy embeds an Anvato player directly in the page and initializes it.
   *
   * @param {object} _playerConfig The simple player configuration object containing
   *    information about the player type, script URL, configuration options, etc.
   * @param {String} _htmlId The id of an existing HTML element that will contain
   *    the output of this strategy
   * @param {Object} _playerWrapper The wrapper class for the underlying player
   * @param {Object} jQueryProxy Provides an instance of jQuery through a callback
   * @param {window} [_scope=window] - The window object
   *
   * @returns {AsyncAnvatoEmbedStrategy}
   * @constructor
   */
  function AsyncAnvatoEmbedStrategy(_playerConfig, _htmlId, _playerWrapper, jQueryProxy, _scope) {
    var scope = _scope || window;
    var ANVATO_MAX_LOAD_TIME = 5 * 1000;

    var playerConfig = _playerConfig;
    var htmlId = _htmlId;
    var playerWrapper = _playerWrapper;

    var _jQuery;

    function getAnvloadURL() {
      return playerConfig.anvload;
    }

    function getDataAnvp() {
      return playerConfig.anvpdata;
    }

    function getPlayerInstanceName() {
      return htmlId;
    }

    function loadPlayer() {
      var doc = scope.document;
      var script, head, timeout;
      var promise = _jQuery.Deferred();

      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = getAnvloadURL();

      // When the script has finished loading, merge the instance object so we can
      // react to the player"s onReady event.
      script.onload = function() {
        // SDK successfully loaded, so re-use timeout for ready event
        clearTimeout(timeout);
        timeout = setTimeout(
          _jQuery.proxy(promise, 'rejectWith', 'AnvatoPlayer: Player Timeout'),
          ANVATO_MAX_LOAD_TIME,
        );

        window.anvp = window.anvp || {};
        playerWrapper.setPlayerInstance(scope.AnvatoPlayer(getPlayerInstanceName()));
        anvp.listener = playerWrapper.globalListener;
        scope.AnvatoPlayer(getPlayerInstanceName()).onReady = function(playerInstance) {
          playerWrapper.onReady(playerInstance);
        };

        var initObj = 'string' === typeof getDataAnvp() ? JSON.parse(getDataAnvp()) : getDataAnvp();
        scope.AnvatoPlayer(getPlayerInstanceName()).init(initObj);
      };

      // Should Anvato"s API script fail, report back to caller.
      script.onerror = _jQuery.proxy(promise, 'rejectWith', 'AnvatoPlayer: SDK Error');

      // Should Anvato"s Player fail in some unknown way, report back to caller.
      timeout = setTimeout(_jQuery.proxy(promise, 'rejectWith', 'AnvatoPlayer: SDK Timeout'), ANVATO_MAX_LOAD_TIME);

      // Attach script to the DOM.
      head = doc.getElementsByTagName('head')[0];
      head.appendChild(script);

      return promise;
    }

    function onJQuery(jq) {
      _jQuery = jq;
      loadPlayer();
    }

    /**
     *
     * Create an instance of an Anvato player using the Anvato Player
     * iFramed embed method.
     *
     * @return {jQuery.Deferred}
     *   Promise resolved when Anvato player is ready
     *   Promise rejected when Anvato player fails to load
     */
    this.execute = function() {
      jQueryProxy.getJQuery(onJQuery);
    };
  }

  function AnvatoAssembler(requestFactory, swfObjectProxy, jQueryProxy, apCore) {
    var concurrencyValidator = new NullConcurrencyValidator(new EventDispatcher());
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      var coreStrategy = new AsyncAnvatoEmbedStrategy(playerConfig, htmlId, playerWrapper, jQueryProxy);
      if (playerConfig.hasOwnProperty('authKillSettings')) {
        var requestMediator = new GeoRequestMediator(requestFactory, apCore, playerConfig.authKillSettings);
        coreStrategy = new AuthKillSwitchStrategy(
          coreStrategy,
          playerWrapper,
          concurrencyValidator,
          apCore,
          requestMediator,
          playerConfig,
        );
      }
      return new ErrorCardStrategy(coreStrategy, playerConfig, htmlId, jQueryProxy, swfObjectProxy, new DeviceInfo());
    };
  }

  function AnvatoV3Assembler(requestFactory, accessEnablerProxy, jQueryProxy, apCore) {
    var concurrencyValidator = new NullConcurrencyValidator(new EventDispatcher());
    var videoCallSignBuilder = new VideoCallSignBuilder();
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      var coreStrategy = new AsyncAnvatoEmbedStrategy(playerConfig, htmlId, playerWrapper, jQueryProxy);

      if (playerParameters !== undefined && playerParameters.hasOwnProperty('callsign')) {
        var overrideValue = playerParameters.callsign;
        if (playerConfig.hasOwnProperty('anvpdata')) {
          playerConfig.anvpdata = videoCallSignBuilder.buildAnvpCallSignData(playerConfig.anvpdata, overrideValue);
        }
      }

      if (playerConfig.hasOwnProperty('authKillSettings')) {
        playerConfig.authKillSettings = videoCallSignBuilder.buildGeoServiceCallSign(playerConfig.authKillSettings);
        if (playerConfig.hasOwnProperty('concurrencyInitializationSettings')) {
          var session = new ConcurrencySessionManager(
            new EventDispatcher(),
            playerConfig,
            new ConcurrencyValidatorDM(accessEnablerProxy, new ConcurrencyRequestMediator(requestFactory)),
            new ConcurrencyRequestDelay(new EventDispatcher()),
          );
          concurrencyValidator = new ConcurrencyValidator(playerWrapper, new EventDispatcher(), session);
        }
        var requestMediator = new GeoRequestMediator(requestFactory, apCore, playerConfig.authKillSettings);
        coreStrategy = new AuthKillSwitchStrategy(
          coreStrategy,
          playerWrapper,
          concurrencyValidator,
          apCore,
          requestMediator,
          playerConfig,
        );
      }
      return new ErrorCardStrategyAnvatoV3(coreStrategy, playerConfig, htmlId, jQueryProxy, new DeviceInfo());
    };
  }

  function MPXAssembler(jQueryProxy, pdkProxy) {
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      return new AsyncPDKEmbedStrategy(playerConfig, htmlId, playerWrapper, jQueryProxy, pdkProxy);
    };
  }

  function MPXMVPDAssembler(jQueryProxy, pdkProxy) {
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      return new MVPDAsyncPDKEmbedStrategy(playerConfig, htmlId, playerWrapper, jQueryProxy, pdkProxy);
    };
  }

  function PDK6Assembler(requestFactory, jQueryProxy, pdkProxy, mvpdHashMapProxy, apCore, urlBuilder) {
    var concurrencyValidator = new NullConcurrencyValidator(new EventDispatcher());
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      var strategy, coreStrategy;

      var adsModule = new AdParamsRequestMediator2(
        playerConfig.adsModuleFeatureEnabled,
        playerConfig.adsModuleSettings,
        requestFactory,
        apCore,
      );
      urlBuilder.setAdParamsMediator(adsModule);
      var dm = new AsyncPDK6EmbedStrategyDM(
        mvpdHashMapProxy,
        jQueryProxy,
        pdkProxy,
        playerConfig.controllerURL,
        window,
      );
      coreStrategy = new AsyncPDK6EmbedStrategy(
        dm,
        playerConfig,
        htmlId,
        playerWrapper,
        contentInitializationObject,
        playerParameters,
        urlBuilder,
      );
      if (
        playerConfig.hasOwnProperty('brightlineSettings') &&
        playerConfig.hasOwnProperty('brightlineFeatureEnabled') &&
        playerConfig.brightlineFeatureEnabled
      ) {
        console.log('using brightline');
        coreStrategy = new BrightlineStrategy(
          coreStrategy,
          playerWrapper,
          new BrightlineProxy(playerConfig.brightlineSettings),
          playerConfig.brightlineSettings,
        );
      }
      if (
        (playerConfig.hasOwnProperty('forcePageLevelEntitlement') && playerConfig.forcePageLevelEntitlement) ||
        (playerParameters &&
          playerParameters.hasOwnProperty('mvpdId') &&
          playerParameters.mvpdId &&
          playerParameters.hasOwnProperty('encodedAuthorizationToken') &&
          playerParameters.encodedAuthorizationToken)
      ) {
        strategy = new PDK6PageLevelEntitlementStrategy(coreStrategy, playerWrapper, playerParameters);
      } else {
        strategy = new PDK6EntitlementStrategy(
          coreStrategy,
          playerWrapper,
          concurrencyValidator,
          apCore,
          contentInitializationObject,
          playerConfig,
        );
      }

      return strategy;
    };
  }

  function PrimetimeRSNAssembler(swfObjectProxy, jQueryProxy) {
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      return new PrimetimeRSNEmbedStrategy(playerConfig, htmlId, playerWrapper, jQueryProxy, swfObjectProxy);
    };
  }

  function AsyncExitAssmbler(jQueryProxy) {
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      return new AsyncExitStrategy(htmlId, jQueryProxy);
    };
  }

  function AssemblerManager(requestFactory, accessEnablerProxy, pdkProxy, jQueryProxy, apCore, urlBuilder) {
    var swfObjectProxy = new SwfObjectProxy();
    var mvpdHashMapProxy = new MVPDHashMapProxy();

    this.getAssemblerForPlayerType = function(type) {
      switch (type) {
        case PlayerType.MPX:
        case PlayerType.MPX_P3:
          return new MPXAssembler(jQueryProxy, pdkProxy);
        case PlayerType.PDK_6:
          return new PDK6Assembler(requestFactory, jQueryProxy, pdkProxy, mvpdHashMapProxy, apCore, urlBuilder);
        case PlayerType.MPX_MVPD:
          return new MPXMVPDAssembler(jQueryProxy, pdkProxy);
        case PlayerType.ANVATO:
          return new AnvatoAssembler(requestFactory, swfObjectProxy, jQueryProxy, apCore);
        case PlayerType.ANVATO_V3:
          return new AnvatoV3Assembler(requestFactory, accessEnablerProxy, jQueryProxy, apCore);
        case PlayerType.PRIMETIME_RSN:
          return new PrimetimeRSNAssembler(swfObjectProxy, jQueryProxy);
        default:
          return new AsyncExitAssmbler(jQueryProxy);
      }
    };
  }

  function AsyncEmbedStrategyFactory(requestFactory, accessEnablerProxy, pdkProxy, jQueryProxy, apCore, urlBuilder) {
    var mgr = new AssemblerManager(requestFactory, accessEnablerProxy, pdkProxy, jQueryProxy, apCore, urlBuilder);
    this.getEmbedStrategy = function(
      playerConfig,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    ) {
      var strategy = mgr
        .getAssemblerForPlayerType(playerConfig.PlayerType)
        .getEmbedStrategy(playerConfig, htmlId, playerWrapper, contentInitializationObject, playerParameters);
      if (playerConfig.enableBlackout === true) {
        var blackoutService = new BlackoutService(
          jQueryProxy,
          playerConfig.blackoutServiceURL,
          playerConfig.blackoutKey,
        );
        var entitlementManager = new EntitlementManager(
          jQueryProxy,
          htmlId,
          playerConfig.blackoutSlateURL,
          blackoutService,
        );
        return new BlackoutStrategy(strategy, entitlementManager, playerWrapper);
      } else {
        return strategy;
      }
    };
  }

  /**
   *
   * Show some kind of error messaging when no other strategy can be determined.
   *
   * @param {String} htmlId The id of an existing HTML element that will contain
   *	the output of this strategy
   * @param {Object} jQueryProxy Provides an instance of jQuery through a callback
   *
   * @returns {ExitStrategy}
   */
  function AsyncExitStrategy(htmlId, jQueryProxy) {
    var _jQuery;

    function embed() {
      _jQuery('#' + htmlId).replaceWith("<div id='" + htmlId + "'>unable to locate configuration</div>");
    }

    function onJQuery(jq) {
      _jQuery = jq;
      embed();
    }

    function getDependencies() {
      jQueryProxy.getJQuery(onJQuery);
    }

    this.execute = function() {
      getDependencies();
    };
  }

  /**
   * Dependency manager
   * @param {Object} MVPDHashMapProxy - Provides an instance of mvpdHashMap through a callback
   * @param {Object} jQueryProxy - Provides an instance of jQuery through a callback
   * @param {Object} pdkProxy - The object that holds our reference to the PDK
   * @param {string} controllerURL - URL of the PDK controller
   * @param {window} win - The window object
   * @returns {AsyncPDKEmbedStrategy}
   */
  function AsyncPDK6EmbedStrategyDM(MVPDHashMapProxy, jQueryProxy, pdkProxy, controllerURL, win) {
    var callback, _jQuery, _mvpdHashMap; // mvpdHashMap is required by rpHelper.js

    function callbackWhenReady() {
      if (_mvpdHashMap && _jQuery && pdkProxy.getPDK()) {
        callback({
          jQuery: _jQuery,
          mvpdHashMap: _mvpdHashMap,
          pdk: pdkProxy.getPDK(),
        });
      }
    }

    function loadController() {
      var script, body;

      script = win.document.createElement('script');
      script.type = 'text/javascript';
      script.src = controllerURL;

      script.onload = function() {
        pdkProxy.setPDK($pdk);
        callbackWhenReady();
      };

      body = win.document.body || win.document.getElementsByTagName('body')[0];
      body.appendChild(script);
    }

    function onMvpdHashMap(mhm) {
      _mvpdHashMap = mhm;
      callbackWhenReady();
    }

    function onJQuery(jq) {
      _jQuery = jq;
      callbackWhenReady();
    }

    function downloadControllerMaybe() {
      if (pdkProxy.getPDK()) {
        callbackWhenReady();
      } else {
        loadController();
      }
    }

    /**
     * Returns a usable version of jQuery through a callback.
     *
     * @param {AsyncPDK6EmbedStrategyDM~callback} callback The callback that receives the jQuery reference
     */
    this.loadDependencies = function(cb) {
      callback = cb;
      downloadControllerMaybe();
      jQueryProxy.getJQuery(onJQuery);
      MVPDHashMapProxy.getMvpdHashMap(onMvpdHashMap);
    };
  }
  /**
   * This callback receives dependencies in an object
   * @callback AsyncPDK6EmbedStrategyDM~callback
   * @param {Object} obj - An object containing the fields jQuery, mvpdHashMap,
   *  and userData
   * @example
   * var jq, mhm, pdk;
   * var dm = new AsyncPDK6EmbedStrategyDM(MVPDHashMapProxy, jQueryProxy, pdkProxy, window);
   *
   * function onDependenciesLoaded(obj)
   * {
   *	 jq = obj.jQuery;
   *	 mhm = obj.mvpdHashMap;
   *	 pdk = obj.pdk;
   * }
   *
   * // request dependencies from the manager and supply a callback to recieve the values
   * dm.loadDependencies( onDependenciesLoaded );
   */

  /**
   *
   * This strategy loads an MPX player into the specified HTML element. It will
   * check for the existence of the $pdk and load the appropriate external con-
   * troller if the $pdk is not found.
   *
   * @param {AsyncPDK6EmbedStrategyDM} dm - Dependency manager
   * @param {object} playerConfig - The simple player configuration object containing
   *	information about the player type, script URL, configuration options, etc.
   * @param {String} htmlId - The id of an existing HTML element that will contain
   *	the output of this strategy
   * @param {Object} playerWrapper - The wrapper class for the underlying player
   * @param {NBCUniCPC.ContentInitializationOptions} cio - ContentInitializationOptions instance populated by the page
   * @param {NBCUniCPC.PlayerParameters} options - PlayerParameters instance populated by the page
   * @param {object} urlBuilder - Helper class for generating PDK 6 SSAI URLs
   *
   * @returns {AsyncPDKEmbedStrategy}
   */
  function AsyncPDK6EmbedStrategy(dm, playerConfig, htmlId, playerWrapper, cio, options, urlBuilder) {
    var playerURL;
    var _jQuery;

    function loadPlayer() {
      var iframe = _jQuery('<iframe allowfullscreen  ></iframe>');
      iframe.attr('allow', 'autoplay');
      iframe.attr('id', htmlId);
      iframe.attr('width', '100%');
      iframe.attr('height', '100%');
      iframe.attr('frameBorder', '0');
      iframe.attr('style', 'border:0;');
      iframe.attr('src', playerURL);
      _jQuery('#' + htmlId).replaceWith(iframe);
      playerWrapper.bind(htmlId);
    }

    function onPrepSSAIURL(url) {
      playerURL = url;
      loadPlayer();
    }

    function invokePrepSSAI() {
      urlBuilder.buildURL(playerConfig.playerURL, cio, options, onPrepSSAIURL);
    }

    function onDependenciesLoaded(obj) {
      _jQuery = obj.jQuery;
      invokePrepSSAI();
    }

    function getDependencies() {
      dm.loadDependencies(onDependenciesLoaded);
    }

    this.execute = function() {
      getDependencies();
    };
  }

  /**
   * Dependency manager
   * @param {Object} jQueryProxy - Provides an instance of jQuery through a callback
   * @param {Object} pdkProxy - The object that holds our reference to the PDK
   * @param {string} controllerURL - URL of the PDK controller
   * @returns {AsyncPDKEmbedStrategy}
   */
  function AsyncPDKEmbedStrategyDM(jQueryProxy, pdkProxy, controllerURL) {
    var callback, _jQuery;

    function callbackWhenReady() {
      if (_jQuery && pdkProxy.getPDK()) {
        callback({
          jQuery: _jQuery,
          pdk: pdkProxy.getPDK(),
        });
      }
    }

    function loadController() {
      var script, body;

      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = controllerURL;

      script.onload = function() {
        pdkProxy.setPDK($pdk);
        callbackWhenReady();
      };

      // Attach script to the DOM.
      body = document.getElementsByTagName('body')[0];
      body.appendChild(script);
    }

    function onJQuery(jq) {
      _jQuery = jq;
      callbackWhenReady();
    }

    function downloadControllerMaybe() {
      if (pdkProxy.getPDK()) {
        callbackWhenReady();
      } else {
        loadController();
      }
    }

    /**
     * Returns a usable version of jQuery through a callback.
     *
     * @param {AsyncPDK6EmbedStrategyDM~callback} callback The callback that receives the jQuery reference
     */
    this.loadDependencies = function(cb) {
      callback = cb;
      downloadControllerMaybe();
      jQueryProxy.getJQuery(onJQuery);
    };
  }
  /**
   * This callback receives dependencies in an object
   * @callback AsyncPDKEmbedStrategyDM~callback
   * @param {Object} obj - An object containing the fields jQuery and pdk
   * @example
   * var jq, pdk;
   * var dm = new AsyncPDKEmbedStrategyDM(jQueryProxy, pdkProxy, controllerURL);
   *
   * function onDependenciesLoaded(obj)
   * {
   *	 jq = obj.jQuery;
   *	 pdk = obj.pdk;
   * }
   *
   * // request dependencies from the manager and supply a callback to recieve the values
   * dm.loadDependencies( onDependenciesLoaded );
   */

  /**
   *
   * This strategy loads an MPX player into the specified HTML element. It will
   * check for the existence of the $pdk and load the appropriate external con-
   * troller if the $pdk is not found.
   *
   * @param {AsyncPDKEmbedStrategyDM} dm - Dependency manager
   * @param {object} playerURL - URL of the player iframe src
   * @param {String} htmlId The id of an existing HTML element that will contain
   *	the output of this strategy
   * @param {Object} playerWrapper The wrapper class for the underlying player
   *
   * @returns {AsyncPDKEmbedStrategy}
   */
  function AsyncPDKEmbedStrategy(dm, playerURL, htmlId, playerWrapper) {
    var _jQuery;

    function loadPlayer() {
      var iframe = _jQuery('<iframe allowfullscreen  ></iframe>');
      iframe.attr('allow', 'autoplay');
      iframe.attr('id', htmlId);
      iframe.attr('width', '100%');
      iframe.attr('height', '100%');
      iframe.attr('frameBorder', '0');
      iframe.attr('style', 'border:0;');
      iframe.attr('src', playerURL);
      _jQuery('#' + htmlId).replaceWith(iframe);
      playerWrapper.bind(htmlId);
    }

    function onDependenciesLoaded(obj) {
      _jQuery = obj.jQuery;
      loadPlayer();
    }

    function getDependencies() {
      dm.loadDependencies(onDependenciesLoaded);
    }

    this.execute = function() {
      getDependencies();
    };
  }

  var AuthKillStatus = {
    ON: 'on',
    OFF: 'off',
  };

  /**
   * Manages all interactions with Adobe Access Enabler, including downloading,
   * authenticating, authorizing, and checking auth kill and program boundaries.
   *
   * This class implements the decorator pattern to run its logic and then delegate
   * a call to <code>execute()</code> on the underlying strategy when possible.
   *
   * <b>Important:</b> This strategy assumes that the user is attempting to play
   * linear content.
   *
   * @param {object} _coreStrategy The underlying strategy to execute when there
   * are no errors.
   * @param {Object} _playerWrapper The wrapper class for the underlying player
   * @param {ConcurrencyValidator} _concurrencyValidator Validates user compliance with for concurrency rules.
   * through a callback
   * @param {AdobePassCore} _apCore Handles underlying interactions with Adobe Pass
   * @param {GeoRequestMediator} _geoRequestMediator Handles requests to geo service
   * @param {object} _playerConfig The simple player configuration object containing
   *    information about the player type, script URL, configuration options, etc.
   *
   * @returns {AuthKillSwitchStrategy}
   */
  function AuthKillSwitchStrategy(
    _coreStrategy,
    _playerWrapper,
    _concurrencyValidator,
    _apCore,
    _geoRequestMediator,
    _playerConfig,
  ) {
    var parent = new AbstractEntitlementStrategy(
      _coreStrategy,
      _playerWrapper,
      _concurrencyValidator,
      _apCore,
      _playerConfig,
    );
    var aks = AuthKillStatus.OFF;

    function onFailure() {
      var errorCode = null;
      var errorDefinition = 'Unable to retrieve auth kill switch data.';
      var isCritical = true;
      var evt = new NBCUniCPC.Event.PlayerErrorEvent(
        NBCUniCPC.Event.PLAYER_ERROR,
        errorCode,
        errorDefinition,
        isCritical,
      );
      _playerWrapper.dispatchEvent(evt);
    }

    function authenticateOrLoad(assetmetadata) {
      if (assetmetadata.hasOwnProperty('assetInfo')) {
        var assetInfo = assetmetadata.assetInfo;
        if (assetInfo.hasOwnProperty('authenticated')) {
          aks = assetInfo.authenticated ? AuthKillStatus.OFF : AuthKillStatus.ON;
          _playerWrapper.dispatchEvent(
            new NBCUniCPC.Event.AuthKillSwitchCheckEvent(
              NBCUniCPC.Event.AUTH_KILL_SWITCH_CHECK,
              assetInfo.authenticated,
            ),
          );
          if (assetInfo.authenticated) {
            // assetInfo.authenticated:true means that the auth kill switch is OFF, so we have to check the user's authentication/authorization
            parent.executeAuth();
          } else {
            // assetInfo.authenticated:false means that the auth kill switch is ON, so we allow playback regardless of auth status or tv rating
            parent.loadPlayer();
          }
        } else {
          onFailure();
        }
      } else {
        onFailure();
      }
    }

    parent.onAssetMetadataUpdate = function(updated) {
      var _aksFeatureEnabled = _playerConfig.hasOwnProperty('authKillFeatureEnabled')
        ? _playerConfig.authKillFeatureEnabled
        : false;
      if (_aksFeatureEnabled) {
        authenticateOrLoad(updated);
      } else {
        parent.executeAuth();
      }
    };

    function onAssetMetadataReceived(response, textStatus, xhr) {
      parent.updateAssetMetadata(response);
    }

    parent.requestAssetMetadata = function() {
      _geoRequestMediator.execute(onAssetMetadataReceived, onFailure);
    };

    parent.canLoadPlayer = function() {
      return !parent.hasReceivedProgramChange();
    };

    /* *
     * It is possible to log out before the player loads, in which case, pausing
     * playback does not take effect and the video continues to play (with sound)
     * in the background. This hack will capture all state change events from the
     * video player and attempt to pause the player if the status is UNLOADED
     */
    function onStateChangeEvent(evt) {
      if (AuthKillStatus.OFF === aks && EntitlementStatus.UNLOADED === parent.getStatus()) {
        parent.kill();
      }
    }

    function validateUserRights(response, textStatus, xhr) {
      if (!response.restricted) {
        parent.loadPlayer();
      } else {
        var restrictionDetails = response.restrictionDetails;
        var errorCode = restrictionDetails.code;
        var errorDefinition = restrictionDetails.description;
        var isCritical = true;
        var evt = new NBCUniCPC.Event.PlayerErrorEvent(
          NBCUniCPC.Event.PLAYER_ERROR,
          errorCode,
          errorDefinition,
          isCritical,
        );
        _playerWrapper.dispatchEvent(evt);
        parent.kill();
      }
    }

    parent.onAuthorizationSuccess = function() {
      _geoRequestMediator.execute(validateUserRights, onFailure);
    };

    this.execute = function() {
      _playerWrapper.addEventListener(NBCUniCPC.Event.STATE_CHANGE, onStateChangeEvent);
      parent.execute();
    };
  }

  /**
   * This is the unminified code used in Phase1ConcurrencyStrategy. It was copied+
   * modified from https://stackoverflow.com/a/6740027
   */
  var Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function(input) {
      var output = '';
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i);
        i++;
        chr2 = input.charCodeAt(i);
        i++;
        chr3 = input.charCodeAt(i);
        i++;

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output =
          output +
          Base64._keyStr.charAt(enc1) +
          Base64._keyStr.charAt(enc2) +
          Base64._keyStr.charAt(enc3) +
          Base64._keyStr.charAt(enc4);
      }

      return output;
    },
    decode: function(input) {
      var output = '';
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

      while (i < input.length) {
        enc1 = Base64._keyStr.indexOf(input.charAt(i));
        i++;
        enc2 = Base64._keyStr.indexOf(input.charAt(i));
        i++;
        enc3 = Base64._keyStr.indexOf(input.charAt(i));
        i++;
        enc4 = Base64._keyStr.indexOf(input.charAt(i));
        i++;

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
          output = output + String.fromCharCode(chr3);
        }
      }

      output = Base64._utf8_decode(output);

      return output;
    },
    _utf8_encode: function(string) {
      var utftext = '';

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    },
    _utf8_decode: function(utftext) {
      var string = '';
      var i = 0;
      var c, c2, c3;

      while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    },
  };

  /**
   * This strategy checks Blackout entitlement before loading a player. If entitlement fails, then this strategy will
   * display a user-friendly error message.
   *
   * @param {object} strategy - The strategy to execute if Blackout is not enforced.
   * @param {object} entitlementManager - Entitlement to monitor for blackout markers.
   * @param {Object} playerWrapper - The wrapper class for the underlying player
   */

  function BlackoutStrategy(strategy, entitlementManager, playerWrapper) {
    var logger = new Logger('BlackoutStrategy');
    var _playerWrapper = playerWrapper;

    function onBlackoutStatus(event) {
      logger.warn('BlackoutStrategy onBlackoutStatus. Entitled? ' + event.data.entitled);
      entitlementManager.removeEventListener(NBCUniCPC.Event.BLACKOUT_STATUS, onBlackoutStatus);
      _playerWrapper.dispatchEvent(event);
    }

    function loadPlayer() {
      strategy.execute();
    }

    function checkEntitlement() {
      entitlementManager.addEventListener(NBCUniCPC.Event.BLACKOUT_STATUS, onBlackoutStatus);
      entitlementManager.monitorBlackout(playerWrapper);
      //pass off loading to original strategy
      loadPlayer();
    }

    this.execute = function() {
      checkEntitlement();
    };
  }

  /**
   * Manages interactions between a player and brightline.
   *
   * @param {object} coreStrategy The underlying strategy to execute when there
   * are no errors.
   * @param {Object} playerWrapper The wrapper class for the underlying player
   * @param {object} blProxy Provides a reference to the brightline implementation
   * @param {string} settings - The CPC configuration settings for Brightline as a JSON string
   * @param {object} [scope] - The window object
   */
  function BrightlineStrategy(coreStrategy, playerWrapper, blProxy, settingsString, scope) {
    var logger = new Logger('BrightlineStrategy');
    var bl;
    var win = scope || window;

    function debug(str) {
      logger.log(str);
    }

    function onDeviceInfoCallback() {
      var str = settingsString;
      str = str.replace(/@@WINDOW_NAVIGATOR_APPVERSION@@/g, win.navigator.appVersion);
      str = str.replace(/@@WINDOW_NAVIGATOR_PLATFORM@@/g, win.navigator.platform);
      str = str.replace(/@@WINDOW_DOCUMENT_LOCATION_HOSTNAME@@/g, win.document.location.hostname);
      str = str.replace(/@@WINDOW_SCREEN_WIDTH@@/g, win.screen.width);
      str = str.replace(/@@WINDOW_SCREEN_HEIGHT@@/g, win.screen.height);

      // We replace the quotes around the connection token after everything else
      // has been parsed because we are assigning an object, not a string
      var settings = JSON.parse(str);
      if (settings.deviceInfo) {
        for (var prop in settings.deviceInfo) {
          if ('@@WINDOW_NAVIGATOR_CONNECTION@@' === settings.deviceInfo[prop]) {
            settings.deviceInfo[prop] = win.navigator.connection;
          }
        }
      }
      return settings.deviceInfo || {};
    }

    function onCollapsedCallback() {
      playerWrapper.pause(false);
    }

    function onExpandedCallback() {
      playerWrapper.pause(true);
    }

    function isBrightlineEvent(evt) {
      if (
        evt &&
        evt.hasOwnProperty('data') &&
        evt.data.hasOwnProperty('contentCustomData') &&
        evt.data.contentCustomData.hasOwnProperty('CreativeLibrary-CreativeAPI')
      ) {
        return 'brightline' === evt.data.contentCustomData['CreativeLibrary-CreativeAPI'];
      }
      return false;
    }

    function hasBannerSrc(evt) {
      return (
        evt &&
        evt.hasOwnProperty('data') &&
        evt.data.hasOwnProperty('banners') &&
        evt.data.banners.hasOwnProperty('length') &&
        evt.data.banners.length > 0 &&
        evt.data.banners[0].hasOwnProperty('src')
      );
    }

    function getBannerSrc(evt) {
      return hasBannerSrc(evt) ? evt.data.banners[0].src : null;
    }

    function openBrightlineMaybe(evt) {
      debug('openBrightlineMaybe::evt: ' + JSON.stringify(evt));
      if (isBrightlineEvent(evt)) {
        var src = getBannerSrc(evt);
        if (src) {
          bl.openAd(src);
        }
      }
    }

    function closeBrightlineMaybe(evt) {
      debug('closeBrightlineMaybe::evt: ' + JSON.stringify(evt));
      if (isBrightlineEvent(evt)) {
        bl.closeAd();
      }
    }

    function onBL(_bl) {
      bl = _bl;

      playerWrapper.addEventListener('OnMediaStart', openBrightlineMaybe);
      playerWrapper.addEventListener('OnMediaEnd', closeBrightlineMaybe);

      bl.on_deviceInfo = onDeviceInfoCallback;
      bl.on_BL_collapsed = onCollapsedCallback;
      bl.on_BL_expanded = onExpandedCallback;
      bl.init();

      coreStrategy.execute();
    }

    this.execute = function() {
      blProxy.getBrightline(onBL);
    };
  }

  /**
   * Dependency manager.
   *
   * @param {object} _accessEnablerProxy - Provides an instance of accessEnabler
   * @param {object} mediator - Manages requests to the concurrency endpoint
   * through a callback
   */
  function ConcurrencyValidatorDM(_accessEnablerProxy, mediator) {
    var UNINITIALIZED = 'uninitialized';
    var userData = {
      mvpd: UNINITIALIZED,
      upstreamUserID: UNINITIALIZED,
    };

    var mvpdKey = 'mvpd';
    var upstreamUserKey = 'upstreamUserID';

    var _accessEnabler;
    var callback;

    function isUserDataAvailable() {
      for (var prop in userData) {
        if (UNINITIALIZED === userData[prop]) {
          return false;
        }
      }

      return true;
    }

    function isReady() {
      return isUserDataAvailable();
    }

    function callbackWhenReady() {
      if (isReady()) {
        callback({
          userData: userData,
          mediator: mediator,
        });

        return true;
      }
      return false;
    }

    function _setMetadataStatus(key, encrypted, data) {
      if (userData.hasOwnProperty(key)) {
        userData[key] = data;
        callbackWhenReady();
      }
    }

    function onMetadataEvent(evt) {
      _setMetadataStatus(evt.key, evt.encrypted, evt.data);
    }

    function onAccessEnabler(ae) {
      _accessEnabler = ae;

      _accessEnabler.addEventListener(AccessEnablerWrapper.SET_METADATA_STATUS_EVENT, onMetadataEvent);
      _accessEnabler.getMetadata(upstreamUserKey);
      _accessEnabler.getMetadata(mvpdKey);

      callbackWhenReady();
    }

    /**
     * Returns dependencies through a callback
     *
     * @param {ConcurrencyValidatorDM~callback} callback The callback that receives the dependencies
     */
    this.loadDependencies = function(cb) {
      callback = cb;
      _accessEnablerProxy.getAccessEnabler(onAccessEnabler);
    };
  }
  /**
   * This callback receives dependencies in an object
   * @callback ConcurrencyValidatorDM~callback
   * @param {Object} obj - An object containing the fields mediator
   *  and userData
   * @example
   * var mediator, mvpd, uid;
   * var dm = new ConcurrencyValidatorDM(jQueryProxy, accessEnablerProxy);
   *
   * function onDependenciesLoaded(obj)
   * {
   *	 mvpd = obj.userData.mvpd;
   *	 uid = obj.userData.upstreamUserID;
   *	 mediator = obj.mediator;
   * }
   *
   * dm.loadDependencies( onDependenciesLoaded ); // request dependencies from the manager and supply a callback to recieve the values
   *
   *
   */

  function ConcurrencyCountdownEvent(_type) {
    this.type = _type;
  }
  ConcurrencyCountdownEvent.COMPLETE = 'COMPLETE';

  function ConcurrencyRequestDelay(dispatcher) {
    var _this = this;
    var interval;
    _this.addEventListener = dispatcher.addEventListener;
    _this.removeEventListener = dispatcher.removeEventListener;
    _this.dispatchEvent = dispatcher.dispatchEvent;

    function onCountdownComplete() {
      _this.dispatchEvent(new ConcurrencyCountdownEvent(ConcurrencyCountdownEvent.COMPLETE));
    }

    this.stopCountdown = function() {
      clearInterval(interval);
    };
    this.startCountdown = function(ms) {
      interval = setTimeout(onCountdownComplete, ms);
    };
  }

  function ConcurrencySessionEvent(_type, _details, _status) {
    this.type = _type;
    this.details = _details;
    this.status = _status;
  }
  ConcurrencySessionEvent.FAILURE = 'FAILURE';
  ConcurrencySessionEvent.TERMINATION = 'TERMINATION';
  ConcurrencySessionEvent.STATUS = 'STATUS';

  function ConcurrencySessionManager(dispatcher, _playerConfig, dm, delay) {
    var logger = new Logger('ConcurrencySessionManager');
    var _this = this;
    var inited = false;
    /**
     * It seems that pause events are dispatched immediately after unpausing video,
     * which results in repeated termination requests for the same session. This is
     * bad. In order to prevent multiple termination and polling confirmations for
     * the same session, we keep track of the session URLs or ids, so we can check
     * if a session has been terminated before resending the request
     *
     */
    var deleted = []; // a list of succesfully terminated sessions by calling the termination endpoint with a DELETE method
    var gone = []; // a list of confirmed "gone" sessions by calling the polling endpoint with a POST method
    var inSession = false; // are we in a concurrency session
    var Location;
    var _mediator, _mvpd, _upstreamUserID; // loaded by the dependency manager

    _this.addEventListener = dispatcher.addEventListener;
    _this.removeEventListener = dispatcher.removeEventListener;
    _this.dispatchEvent = dispatcher.dispatchEvent;

    function debug(str) {
      logger.log(str);
    }

    function warn(str) {
      logger.warn(str);
    }

    /*
     * @see http://docs.adobeptime.io/cm-api-v2/ for relevant status codes
     */
    function isGoodStatusCode(code) {
      return code >= 201 && code <= 204;
    }

    function canCheckConcurrency() {
      return undefined !== _mediator && undefined !== _mvpd && undefined !== _upstreamUserID;
    }

    function replaceKeys(str) {
      str = str.replace(/\[MVPD\]/g, _mvpd);
      str = str.replace(/\[ENCODED_UPSTREAM_USER_ID\]/g, Base64.encode(_upstreamUserID));
      str = str.replace(/\[LOCATION\]/g, Location);
      return str;
    }

    function parseSettingsString(str) {
      return JSON.parse(replaceKeys(str));
    }

    function failWith(details, status) {
      debug('failWith :: details: ' + details + ', status: ' + status);
      _this.dispatchEvent(new ConcurrencySessionEvent(ConcurrencySessionEvent.FAILURE, details, status));
    }

    function newFailureDetail(type, message) {
      return {
        type: type,
        message: message,
      };
    }

    function getEventDetailsFromResponse(response) {
      var dataObj = response.hasOwnProperty('responseJSON') ? response.responseJSON : response;
      if (dataObj.hasOwnProperty('associatedAdvice') && dataObj.associatedAdvice.length > 0) {
        return dataObj.associatedAdvice[0];
      } else {
        return newFailureDetail('status-failure', dataObj);
      }
    }

    function onFailure(jqXHR, textStatus, errorThrown) {
      warn('onFailure :: textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
      failWith(getEventDetailsFromResponse(jqXHR), errorThrown);
    }

    function onTerminationResponse(response, textStatus, xhr) {
      if (isGoodStatusCode(xhr.status)) {
        _this.dispatchEvent(new ConcurrencySessionEvent(ConcurrencySessionEvent.TERMINATION));
        // "this" is a reference to the ajax settings
        deleted[this.url] = true;
      } else {
        warn('onTerminationResponse :: unsuccessful termination response status: ' + xhr.status);
        failWith(getEventDetailsFromResponse(response), textStatus);
      }
    }

    this.killSession = function() {
      if (inSession) {
        inSession = false;
        delay.stopCountdown();
        var settings = parseSettingsString(_playerConfig.concurrencyTerminationSettings);
        if (!deleted[settings.url]) {
          _mediator.makeSessionRequest(settings, onTerminationResponse, onFailure);
        } else {
          debug('killSession :: deleted[' + settings.url + '] was previously terminated.');
        }
      }
    };

    function onHeartbeatFailure(jqXHR, textStatus, errorThrown) {
      // "this" is a reference to the ajax settings
      gone[this.url] = true;
      failWith(getEventDetailsFromResponse(jqXHR.responseText), errorThrown);
    }

    function prepNextPollRequest(xhr) {
      var now = Date.parse(xhr.getResponseHeader('Date'));
      var expires = Date.parse(xhr.getResponseHeader('Expires'));
      var diff = expires - now;
      if (!isNaN(diff) && diff > 0) {
        delay.startCountdown(diff);
        return true;
      } else {
        return false;
      }
    }

    function validatePollingResponse(response, textStatus, xhr) {
      debug(JSON.stringify(xhr) + 'inSession: ' + inSession);
      if (isGoodStatusCode(xhr.status)) {
        prepNextPollRequest(xhr);
      } else {
        warn(
          'validatePollingResponse :: unsuccessful polling response status: ' +
            xhr.status +
            '. inSession: ' +
            inSession,
        );
        // make sure that the session has not been terminated before trying to send the failure event
        if (inSession) {
          failWith(getEventDetailsFromResponse(response), textStatus);
        }
      }
    }

    function checkHeartbeat() {
      var settings = parseSettingsString(_playerConfig.concurrencyPollingSettings);
      debug('checkHeartbeat :: request settings is ' + JSON.stringify(settings));
      if (!gone[settings.url]) {
        _mediator.makeSessionRequest(settings, validatePollingResponse, onHeartbeatFailure);
      } else {
        debug('checkHeartbeat :: gone[' + settings.url + '] is gone');
      }
    }

    function validateInitializationResponse(response, textStatus, xhr) {
      if (!inSession) {
        // guard against a session terminating during an in-flight request.
        return;
      }
      var status = xhr.status;
      if (isGoodStatusCode(status)) {
        Location = xhr.getResponseHeader('Location');
        if (prepNextPollRequest(xhr)) {
          _this.dispatchEvent(new ConcurrencySessionEvent(ConcurrencySessionEvent.STATUS));
        } else {
          failWith(newFailureDetail('heartbeat-failure', 'Unable to prepare next heartbeat request.'), textStatus);
        }
      } else {
        warn('ConcurrencyValidator :: unsuccessful initialziation response status: ' + status);
        warn(
          'validateInitializationResponse :: response: ' +
            JSON.stringify(response) +
            ', textStatus: ' +
            JSON.stringify(textStatus) +
            ', xhr: ' +
            JSON.stringify(xhr),
        );
        failWith(getEventDetailsFromResponse(response), textStatus);
      }
    }

    function onCountdownComplete(evt) {
      checkHeartbeat();
    }

    function checkConcurrency() {
      if (!inSession) {
        delay.stopCountdown();
        inSession = true;
        var settings = parseSettingsString(_playerConfig.concurrencyInitializationSettings);
        _mediator.makeSessionRequest(settings, validateInitializationResponse, onFailure);
      }
    }

    function onDependenciesLoaded(obj) {
      _mvpd = obj.userData.mvpd;
      _upstreamUserID = obj.userData.upstreamUserID;
      _mediator = obj.mediator;
      checkConcurrency();
    }

    function getDependencies() {
      dm.loadDependencies(onDependenciesLoaded);
    }
    this.startSession = function() {
      if (!inited) {
        inited = true;
        delay.addEventListener(ConcurrencyCountdownEvent.COMPLETE, onCountdownComplete);
      }
      if (canCheckConcurrency()) {
        checkConcurrency();
      } else {
        getDependencies();
      }
    };
  }

  /**
   * Enforces concurrency rules:
   *
   * This class is designed to provide callbacks indicating the state of the business
   * rules around concurrency. 1) A separate, managing class will be responsible for
   * initializing the concurrency checks at startup and when the asset metadata
   * updates. 2) A separate class (possibly the same class as in section 1) will
   * be responsible for stopping playback when this class indicates that the concurrency
   * rules have been violated.
   *
   * @constructor
   * @param {EventDispatcher} player - An EventDispatcher instance that dispatches
   *	events on behalf of the underlying video player
   * @param {EventDispatcher} dispatcher - an EventDispatcher instance that adds
   *	event dispatching capabilities to this class
   * @param {ConcurrencySessionManager} session - ConcurrencySessionManager instance
   *  responsible for managing session starts, and ends
   *
   * @returns {ConcurrencyValidator}
   * @see https://wiki.inbcu.com/display/CPPRODUCT/Live+Stream+Concurrency+for+EPL
   */
  function ConcurrencyValidator(player, dispatcher, session) {
    var _this = this;
    var assetInfo; // metadata about the currently playing asset

    _this.addEventListener = dispatcher.addEventListener;
    _this.removeEventListener = dispatcher.removeEventListener;
    _this.dispatchEvent = dispatcher.dispatchEvent;

    function isAssetConcurrencyRestricted() {
      return assetInfo && assetInfo.hasOwnProperty('epl') && true === assetInfo.epl;
    }

    function getAssetInfoFromMetadata(obj) {
      return obj && obj.hasOwnProperty('assetInfo') ? obj.assetInfo : null;
    }

    function killSession() {
      session.killSession();
    }

    function startSession() {
      session.startSession();
    }

    /**
     * Instructs this class to check the concurrency rules for the provided metadata
     * @param {object} obj - information about the currently playing asset containing
     * flags for concurrency. This will likely be the parsed JSON response from the
     * geo service.
     */
    this.updateAssetMetadata = function(obj) {
      assetInfo = getAssetInfoFromMetadata(obj);
      if (isAssetConcurrencyRestricted()) {
        startSession();
      } else {
        killSession();
        _this.dispatchEvent(new ConcurrencyValidator.Event.ConcurrencyStatusEvent());
      }
    };

    function onPlayerStateChange(evt) {
      if (evt.data.playerState === NBCUniCPC.VideoState.STATE_PAUSED) {
        killSession();
      } else if (isAssetConcurrencyRestricted() && evt.data.playerState === NBCUniCPC.VideoState.STATE_PLAYING) {
        startSession();
      }
    }

    function onSessionFailure(evt) {
      _this.dispatchEvent(new ConcurrencyValidator.Event.ConcurrencyFailureEvent(evt.details, evt.status));
    }

    function onSessionTermination(evt) {
      _this.dispatchEvent(new ConcurrencyValidator.Event.ConcurrencyTerminationEvent());
    }

    function onSessionStatus(evt) {
      _this.dispatchEvent(new ConcurrencyValidator.Event.ConcurrencyStatusEvent());
    }

    player.addEventListener(NBCUniCPC.Event.STATE_CHANGE, onPlayerStateChange);
    session.addEventListener(ConcurrencySessionEvent.FAILURE, onSessionFailure);
    session.addEventListener(ConcurrencySessionEvent.TERMINATION, onSessionTermination);
    session.addEventListener(ConcurrencySessionEvent.STATUS, onSessionStatus);
  }

  ConcurrencyValidator.STATUS_EVENT = 'CONCURRENCY_STATUS_EVENT';
  ConcurrencyValidator.TERMINATION_EVENT = 'CONCURRENCY_TERMINATION_EVENT';
  ConcurrencyValidator.ERROR_EVENT = 'CONCURRENCY_ERROR_EVENT';

  /**
   * @namespace ConcurrencyValidator.Event
   * @desc Events dispatched by the ConcurrencyValidator in response to concurrency
   * checks
   */
  ConcurrencyValidator.Event = {
    /**
     * Fires when all concurrency checks have passed, and the user is allowed playback
     * on this device
     * @event
     * @param {string} type - {@link ConcurrencyValidator.STATUS_EVENT}
     */
    ConcurrencyStatusEvent: function() {
      this.type = ConcurrencyValidator.STATUS_EVENT;
    },
    /**
     * Fires when a concurrency session has been terminated
     * @event
     * @param {string} type - {@link ConcurrencyValidator.TERMINATION_EVENT}
     */
    ConcurrencyTerminationEvent: function() {
      this.type = ConcurrencyValidator.TERMINATION_EVENT;
    },
    /**
     * Fires when all concurrency checks have passed, and the user is allowed playback
     * on this device
     * @event
     * @param {string} type - {@link ConcurrencyValidator.ERROR_EVENT}
     */
    ConcurrencyFailureEvent: function(details, status) {
      this.type = ConcurrencyValidator.ERROR_EVENT;
      this.details = details;
      this.status = status;
    },
  };

  /*
  Failure respose object from Adobe looks like this:
  {
    "associatedAdvice": [
          {
            "attribute": "sessionId",
            "conflicts": {
              "00000164-cd4a-85b9-5e00-31ebde88a927": [
                {
                  "applicationName": "NBC Entertainment",
                  "channel": "Unknown",
                  "deviceName": "Unknown",
                  "startedAt": "2018-07-24T17:16:10.553Z",
                  "terminationCode": "ae22b12e"
                }
              ],
              "00000164-cd4a-9eb6-093e-271502e23db4": [
                {
                  "applicationName": "NBC Entertainment",
                  "channel": "Unknown",
                  "deviceName": "Unknown",
                  "startedAt": "2018-07-24T17:16:16.950Z",
                  "terminationCode": "fef3a91"
                }
              ]
            },
            "message": "You have reached the maximum of two concurrent streams allowed during EPL games",
            "policyName": "NBCU/EPL",
            "ruleName": "max 2 streams",
            "scope": [],
            "threshold": 2,
            "type": "rule-violation"
          }
    ],
    "obligations": []
  }
  */

  /**
   * Returns information about the client device
   *
   * @param {object} [_navigator=navigator] The navigator object contains
   *    information about the browser. The navigator is globally available, but is
   *    an optional parameter for unit testing / development.
   **/
  function DeviceInfo(_navigator) {
    /*
     * @returns {boolean} `true` if this is considered a mobile device by our
     *	criteria or `false` otherwise
     */
    this.isMobile = function() {
      if (!_navigator) {
        _navigator = navigator;
      }

      // http://detectmobilebrowsers.com/about
      var a = _navigator.userAgent || _navigator.vendor || window.opera;
      // https://stackoverflow.com/a/34755045
      var r1 = new RegExp(
        '' +
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|android|ipad|playbook|silk|/
            .source +
          /ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|/
            .source +
          /psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/.source,
        'i',
      );
      var r2 = new RegExp(
        '' +
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|/
            .source +
          /as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|/
            .source +
          /cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|/
            .source +
          /ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|/
            .source +
          /hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|/
            .source +
          /jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|/
            .source +
          /ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|/
            .source +
          /n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|/
            .source +
          /pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|/
            .source +
          /rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|/
            .source +
          /sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|/
            .source +
          /to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|/
            .source +
          /vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/
            .source,
        'i',
      );
      return r1.test(a) || r2.test(a.substr(0, 4));
    };
  }

  /**
   * Displays user friendly messaging when content is unable to play. Possible
   * reasons for inability to play content include:
   * <ul>
   * <li>Content requires Flash plugin on desktop</li>
   * <li>Content requires playback in an app on mobile device</li>
   * <li>Content is expired</li>
   * <li>Content is not yet available</li>
   * </ul>
   *
   * This class implements the decorator pattern to run its logic and then delegate
   * a call to <code>execute()</code> on the underlying strategy when possible.
   *
   * <b>Important:</b> This strategy assumes that the user is attempting to play
   * long form content.
   *
   * @param {object} _coreStrategy The underlying strategy to execute when there
   * are no errors.
   * @param {object} _playerConfig The simple player configuration object containing
   *    information about the player type, script URL, configuration options, etc.
   * @param {string} _htmlId The id of an existing HTML element that will contain
   *    the output of this strategy
   * @param {object} _jQueryProxy Provides an instance of jQuery through a callback
   * @param {object} _swfobjectProxy Provides an instance of swfobject through a
   *    callback
   * @param {object} _deviceInfo Provides information about the client device
   *
   * @returns {ErrorCardStrategy}
   */
  function ErrorCardStrategy(_coreStrategy, _playerConfig, _htmlId, _jQueryProxy, _swfobjectProxy, _deviceInfo) {
    var _jQuery, _swfObject;

    function getFlashMessageURL() {
      return _playerConfig.getFlashURL;
    }

    function getUnsupportedDeviceURL() {
      return _playerConfig.unsupportedDeviceURL;
    }

    function isMobile() {
      return _deviceInfo.isMobile();
    }

    function isFlashFormat() {
      return _swfObject.hasFlashPlayerVersion('1');
    }

    function canLoadPlayer() {
      return isFlashFormat() && !isMobile();
    }

    function displayError() {
      var errorURL = isMobile() ? getUnsupportedDeviceURL() : getFlashMessageURL();

      var iframe = _jQuery('<iframe allowfullscreen></iframe>');
      iframe.attr('id', _htmlId);
      iframe.attr('width', '100%');
      iframe.attr('height', '100%');
      iframe.attr('src', errorURL);
      _jQuery('#' + _htmlId).replaceWith(iframe);
    }

    function loadPlayer() {
      _coreStrategy.execute();
    }

    function embedWhenReady() {
      if (_jQuery && _swfObject) {
        if (canLoadPlayer()) {
          loadPlayer();
        } else {
          displayError();
        }
      }
    }

    function onJQuery(jq) {
      _jQuery = jq;
      embedWhenReady();
    }

    function onSwfObject(so) {
      _swfObject = so;
      embedWhenReady();
    }

    this.execute = function() {
      _jQueryProxy.getJQuery(onJQuery);
      _swfobjectProxy.getSwfObject(onSwfObject);
    };
  }

  /**
   * Displays user friendly messaging when content is unable to play. Possible
   * reasons for inability to play content include:
   * <ul>
   * <li>Content requires playback in an app on mobile device</li>
   * </ul>
   *
   * This class implements the decorator pattern to run its logic and then delegate
   * a call to <code>execute()</code> on the underlying strategy when possible.
   *
   * <b>Important:</b> This strategy assumes that the user is attempting to play
   * long form content.
   *
   * @param {object} _coreStrategy The underlying strategy to execute when there
   * are no errors.
   * @param {object} _playerConfig The simple player configuration object containing
   *    information about the player type, script URL, configuration options, etc.
   * @param {string} _htmlId The id of an existing HTML element that will contain
   *    the output of this strategy
   * @param {object} _jQueryProxy Provides an instance of jQuery through a callback
   * @param {object} _deviceInfo Provides information about the client device
   *
   * @returns {ErrorCardStrategyAnvatoV3}
   */
  function ErrorCardStrategyAnvatoV3(_coreStrategy, _playerConfig, _htmlId, _jQueryProxy, _deviceInfo) {
    var _jQuery;

    function getUnsupportedDeviceURL() {
      return _playerConfig.unsupportedDeviceURL;
    }

    function isMobile() {
      return _deviceInfo.isMobile();
    }

    function canLoadPlayer() {
      return !isMobile() || typeof getUnsupportedDeviceURL() === 'undefined';
    }

    function displayError() {
      var errorURL = getUnsupportedDeviceURL();

      var iframe = _jQuery('<iframe allowfullscreen></iframe>');
      iframe.attr('id', _htmlId);
      iframe.attr('width', '100%');
      iframe.attr('height', '100%');
      iframe.attr('src', errorURL);
      _jQuery('#' + _htmlId).replaceWith(iframe);
    }

    function loadPlayer() {
      _coreStrategy.execute();
    }

    function embedWhenReady() {
      if (canLoadPlayer()) {
        loadPlayer();
      } else {
        displayError();
      }
    }

    function onJQuery(jq) {
      _jQuery = jq;
      embedWhenReady();
    }

    this.execute = function() {
      _jQueryProxy.getJQuery(onJQuery);
    };
  }

  /**
   *
   * This strategy loads an MPX MVPD player into the specified HTML element. It will
   * check for the existence of the $pdk and load the appropriate external con-
   * troller if the $pdk is not found.  Once the controller is found, setReleaseURL is called.
   *
   * @param {AsyncPDKEmbedStrategyDM} dm - Dependency manager
   * @param {object} playerConfig The simple player configuration object containing
   *	information about the player type, script URL, configuration options, etc.
   * @param {String} htmlId The id of an existing HTML element that will contain
   *	the output of this strategy
   * @param {Object} playerWrapper The wrapper class for the underlying player
   *
   * @returns {MVPDAsyncPDKEmbedStrategy}
   */
  function MVPDAsyncPDKEmbedStrategy(dm, playerConfig, htmlId, playerWrapper) {
    var _jQuery;

    function loadPlayer() {
      var iframe = _jQuery('<iframe allowfullscreen  ></iframe>');
      iframe.attr('id', htmlId);
      iframe.attr('width', '100%');
      iframe.attr('height', '100%');
      iframe.attr('frameBorder', '0');
      iframe.attr('style', 'border:0;');
      iframe.attr('src', playerConfig.playerURL);
      _jQuery('#' + htmlId).replaceWith(iframe);
      playerWrapper.bind(htmlId);
    }

    function onPlayerLoaded(e) {
      playerWrapper.setReleaseURL(playerConfig.releaseURL);
    }

    function onDependenciesLoaded(obj) {
      _jQuery = obj.jQuery;
      loadPlayer();
    }

    function getDependencies() {
      dm.loadDependencies(onDependenciesLoaded);
    }

    this.execute = function() {
      playerWrapper.addEventListener(NBCUniCPC.Event.PLAYER_LOADED, onPlayerLoaded);
      getDependencies();
    };
  }

  /**
   * Null implementation for concurrency rules:
   *
   * This class is a stub for player configurations that do not
   * support concurrency checks. This class will always implement callbacks,
   * dispatch events, and return values as if all concurrency rules are properly
   * in effect to allow playback.
   *
   * @constructor
   * @param {EventDispatcher} dispatcher - an EventDispatcher instance
   *
   * @returns {NullConcurrencyValidator}
   * @see {@link ConcurrencyValidator}
   * @see https://nbcu-ato.atlassian.net/wiki/spaces/CPC/pages/90857620/Live+Stream+Concurrency+for+EPL
   */
  function NullConcurrencyValidator(dispatcher) {
    var _this = this;
    _this.addEventListener = dispatcher.addEventListener;
    _this.removeEventListener = dispatcher.removeEventListener;
    _this.dispatchEvent = dispatcher.dispatchEvent;
    /**
     * Instructs this class to check the concurrency rules for the provided metadata
     * @param {object} obj - information about the currently playing asset containing
     * flags for concurrency. This will likely be the parsed JSON response from the
     * geo service.
     */
    this.updateAssetMetadata = function(obj) {
      _this.dispatchEvent(new ConcurrencyValidator.Event.ConcurrencyStatusEvent());
    };
  }

  /**
   * Manages all interactions with Adobe Access Enabler, including downloading,
   * authenticating, authorizing, and checking auth kill and program boundaries.
   *
   * This class implements the decorator pattern to run its logic and then delegate
   * a call to <code>execute()</code> on the underlying strategy when possible.
   *
   * <b>Important:</b> This strategy assumes that the user is attempting to play
   * linear content.
   *
   * @param {object} _coreStrategy The underlying strategy to execute when there
   * are no errors.
   * @param {Object} _playerWrapper The wrapper class for the underlying player
   * @param {ConcurrencyValidator} _concurrencyValidator Validates user compliance with for concurrency rules.
   * through a callback
   * @param {AdobePassCore} _apCore Handles underlying interactions with Adobe Pass
   * @param {NBCUniCPC.ContentInitializationObject} _contentInitializationObject
   * The initialization object for this content. Can include mcp video id, mpx
   * media id, and the full episode flag.
   * @param {object} _playerConfig - The simple player configuration object containing
   *    information about the player type, script URL, configuration options, etc.
   *
   * @returns {PDK6EntitlementStrategy}
   */
  function PDK6EntitlementStrategy(
    _coreStrategy,
    _playerWrapper,
    _concurrencyValidator,
    _apCore,
    _contentInitializationObject,
    _playerConfig,
  ) {
    var parent = new AbstractEntitlementStrategy(
      _coreStrategy,
      _playerWrapper,
      _concurrencyValidator,
      _apCore,
      _playerConfig,
    );
    parent.onAssetMetadataUpdate = function(updated) {
      var assetInfo = updated.assetInfo;
      if (assetInfo.authenticated) {
        // assetInfo.authenticated:true means that the auth kill switch is OFF, so we have to check the user's authentication/authorization
        parent.executeAuth();
      } else {
        // assetInfo.authenticated:false means that the auth kill switch is ON, so we allow playback regardless of auth status or tv rating
        parent.loadPlayer();
      }
    };

    parent.requestAssetMetadata = function() {
      var authenticated = String(_contentInitializationObject.entitlement).toLowerCase() === NBCUniCPC.Entitlement.AUTH;
      var tvRating = _contentInitializationObject.rating;
      var metadata = {
        assetInfo: {
          authenticated: authenticated,
          tvRating: tvRating,
        },
      };

      parent.updateAssetMetadata(metadata);
    };

    parent.onAuthorizationSuccess = function(evt) {
      parent.loadPlayer();
    };

    parent.canLoadPlayer = function() {
      return true;
    };

    this.execute = function() {
      parent.execute();
    };
  }

  /**
   * Use this strategy when CPC is configured to allow the page to manage the
   * Adobe Pass configuration. This will pass the supplied values from the page
   * through the application in the same workflow used when CPC manages
   * entitlement.
   *
   * This class implements the decorator pattern to run its logic and then delegate
   * a call to <code>execute()</code> on the underlying strategy when possible.
   *
   * @param {object} _coreStrategy The underlying strategy to execute when there
   * are no errors.
   * @param {Object} _playerWrapper The wrapper class for the underlying player
   * @param {NBCUniCPC.PlayerParameters} options PlayerParameters instance populated by
   * the page. This object contains the values that would have otherwise been
   * retrieved from Adobe Pass by CPC.
   *
   * @returns {PDK6PageLevelEntitlementStrategy}
   */
  function PDK6PageLevelEntitlementStrategy(_coreStrategy, _playerWrapper, options) {
    this.execute = function() {
      var providerSelectedEventObj = {
        type: NBCUniCPC.Event.PROVIDER_SELECTED,
        data: {
          provider_id: options.mvpdId,
          message: 'User selected a provider/previously selected provider has been set.',
        },
      };

      var authorizationStatusEventObj = {
        type: NBCUniCPC.Event.AUTHORIZATION_STATUS,
        data: {
          resource: null,
          authorizer: null,
          error_code: null,
          isAuthorized: true,
          message: 'Authorization status has changed.',
          token: options.encodedAuthorizationToken,
        },
      };

      _playerWrapper.dispatchEvent(providerSelectedEventObj);
      _playerWrapper.dispatchEvent(authorizationStatusEventObj);
      _coreStrategy.execute();
    };
  }

  /**
   * Builds VOD URLs for player and selector requests
   *
   * @param {Object} rphScope - The scope of the RPHelper helper functions
   * @param {AdobePassCore} apCore - Handles underlying interactions with Adobe Pass
   * @param {AdParamsMediator} adParamsMediator - Retrieves parameters to be used
   *	in the ad request. This is responsible for making requests to the ad params
   *	service if necessary and formatting the response in a way that this class
   *	can understand.
   * @class
   */
  function PDK6URLBuilder(rphScope, apCore) {
    var logger = new Logger('PDK6URLBuilder');
    var adParamsMediator;
    var _callback = null;
    var _token = null;
    var _cio = null;
    var _options = null;
    var _callbackURL = null;

    var _tokenPending = true;

    function warn(str) {
      logger.warn(str);
    }

    function getPreFetchedToken() {
      return _options && _options.encodedAuthorizationToken ? _options.encodedAuthorizationToken : _token;
    }

    function canAuthorizeContent() {
      return getPreFetchedToken();
    }

    function contentRequiresAuth() {
      return _cio && _cio.hasOwnProperty('entitlement') && _cio.entitlement === NBCUniCPC.Entitlement.AUTH;
    }

    function cioToAssetMetadata() {
      return {
        assetInfo: {
          tvRating: _cio.rating,
          resourceId: _cio.videoId,
        },
      };
    }

    function finalize() {
      if (_callback && _callbackURL) {
        _callback(_callbackURL);
        _callback = null;
        _token = null;
        _cio = null;
        _options = null;
        _callbackURL = null;
      }
    }

    function appendTokenMaybe() {
      if (contentRequiresAuth()) {
        _callbackURL = rphScope.setAuthToken(_callbackURL, getPreFetchedToken());
      }

      finalize();
    }

    function onPrepSSAIURL(url) {
      _callbackURL = url;
      _callbackURL = rphScope.addTearsheetSupport(_callbackURL, true);
      appendTokenMaybe();
    }

    function onAdParams(params) {
      var isProd = true;
      var includeGeoInAdRequest = Boolean(_options.includeGeoInAdRequest);
      rphScope.prepSSAI(_callbackURL, params, isProd, includeGeoInAdRequest, onPrepSSAIURL);
    }

    function invokePrepSSAI() {
      adParamsMediator.getParams(_cio, _options, onAdParams);
    }

    function onAuthenticationStatusEvent(evt) {
      apCore.removeEventListener(NBCUniCPC.Event.AUTHENTICATION_STATUS, onAuthenticationStatusEvent);
      if (evt.data.isAuthenticated) {
        apCore.getAuthorization(cioToAssetMetadata());
      }
    }

    function hasCallbackRequirements() {
      return _callbackURL && _cio && _options && _callback;
    }

    function canInvokePrepSSAI() {
      return contentRequiresAuth() ? canAuthorizeContent() && hasCallbackRequirements() : hasCallbackRequirements();
    }

    this.setAdParamsMediator = function(_adParamsMediator) {
      adParamsMediator = _adParamsMediator;
    };

    /**
     * This method will construct a player or selector URL with all of the Freewheel
     * and authentication parameters required for SSAI.
     *
     * It will use the <code>mvpdId</code> and <code>encodedAuthorizationToken</code>
     * values supplied in the <code>options</code> parameter, if they are
     * available. Otherwise, it will listen for events from the <code>apCore</code>
     * instance supplied to the constructor to retrieve these values. If the content
     * requires authorization, but no token has been made available through the <code>options</code>
     * or through events then this class will invoke the necessary methods on the
     * <code>apCore</code> instance to retrieve the token. The token will be
     * nullified before every {@link PDK6URLBuilder~requestCallback} invocation to
     * prevent token reuse.
     *
     * @param {string} baseURL - The URL that should form the base of the player
     * URL or the selector request.
     * @param {NBCUniCPC.ContentInitializationObject} cio - An object containing
     * asset metadata. The <code>entitlement</code> property will be inspected to
     * determine whether the asset requires authorization or not.
     * @param {NBCUniCPC.PlayerParameters} options - An object containing any
     * Freewheel- or entitlement-related parameters needed to build the request
     * URL.
     * @param {PDK6URLBuilder~buildCallback} callback - The callback that handles the response.
     */
    this.buildURL = function(baseURL, cio, options, callback) {
      _callbackURL = baseURL;
      _tokenPending = true;
      _cio = cio;
      _options = options || {};
      _callback = callback;
      if (canInvokePrepSSAI()) {
        invokePrepSSAI();
      } else if (contentRequiresAuth() && !canAuthorizeContent()) {
        apCore.addEventListener(NBCUniCPC.Event.AUTHENTICATION_STATUS, onAuthenticationStatusEvent);
        apCore.executeAuth();
      } else {
        warn('Unable to build PDK 6 URL for SSAI.');
      }
    };

    function onAuthorizationStatus(evt) {
      if (_tokenPending && evt.data.isAuthorized) {
        _tokenPending = false;
        _token = evt.data.token;
      }
      if (canInvokePrepSSAI()) {
        invokePrepSSAI();
      }
    }

    apCore.addEventListener(NBCUniCPC.Event.AUTHORIZATION_STATUS, onAuthorizationStatus);
  }

  /**
   * The callback that will be invoked after a URL has been constructed.
   *
   * @callback PDK6URLBuilder~buildCallback
   * @param {string} URL - The URL to be used for the player URL or the selector
   * request
   */

  /**
   *
   * This strategy loads a Primetime RSN player into the specified HTML element.
   *
   * @param {object} playerConfig The simple player configuration object containing
   *	information about the player type, script URL, configuration options, etc.
   * @param {String} htmlId The id of an existing HTML element that will contain
   *	the output of this strategy
   * @param {Object} playerWrapper The wrapper class for the underlying player
   * @param {Object} jQueryProxy Provides an instance of jQuery through a callback
   * @param {object} swfobjectProxy Provides an instance of swfobject through a
   *    callback
   *
   * @returns {PrimetimeRSNEmbedStrategy}
   *  */
  function PrimetimeRSNEmbedStrategy(playerConfig, htmlId, playerWrapper, jQueryProxy, swfobjectProxy) {
    var _jQuery, _swfObject;

    function getControllerURL() {
      return playerConfig.controllerURL;
    }

    function loadPlayer() {
      playerWrapper.setPlayerInstance(
        new RSN.core.Player(
          htmlId,
          _jQuery,
          'ON-DOMAIN Desktop CPC',
          '[TAG] jenkins-CloudPath-Prod-55 [ID] 55 [Build Number] 55',
        ),
      );
      playerWrapper.setPlayerConfig(playerConfig);
    }

    function embedWhenReady() {
      if (_jQuery && _swfObject && typeof RSN !== 'undefined') {
        loadPlayer();
      }
    }

    function loadController() {
      var script, body;

      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = getControllerURL();

      script.onload = function() {
        embedWhenReady();
      };

      // Attach script to the DOM.
      body = document.getElementsByTagName('body')[0];
      body.appendChild(script);
    }

    function onJQuery(jq) {
      _jQuery = jq;
      embedWhenReady();
    }

    function onSwfObject(so) {
      _swfObject = so;
      embedWhenReady();
    }

    function getDependencies() {
      jQueryProxy.getJQuery(onJQuery);
      swfobjectProxy.getSwfObject(onSwfObject);
      loadController();
    }

    this.execute = function() {
      getDependencies();
    };
  }

  /*
  Sample response from the cp services:
  {
    "code": "1002",
    "message": "Authorization failed.",
    "tempPass": {
      "activeSessionExpiration": "2018-03-28T20:11:53.066Z",
      "duration": 900000,
      "lockoutExpiration": 1522310400000
    },
    "value": {
      "message": "Missing serviceZip (for example: 60647)"
    }
  }
  */
  function TempPassAuthentication(dispatcher, mediator, storage) {
    var logger = new Logger('TempPassStrategy');
    var _this = this;
    var playerConfig = null;
    var tempPassCookieName = 'cpc__tempPassDeviceId';
    var deviceId; // cryptographic security is not important. We just want reasonable randomness.
    var interval;

    var status = TempPassAuthentication.Status.UNINITIALIZED;

    this.addEventListener = dispatcher.addEventListener;
    this.removeEventListener = dispatcher.removeEventListener;
    this.dispatchEvent = dispatcher.dispatchEvent;
    this.enabled = false;

    function debug(str) {
      logger.log(str);
    }

    function warn(str) {
      logger.warn(str);
    }

    this.getStatus = function() {
      return status;
    };

    function setStatus(value) {
      status = value;
    }

    // https://stackoverflow.com/a/105074
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function generateIdForDevice() {
      return guid();
    }

    function getStoredDeviceId() {
      return storage.getItem(tempPassCookieName);
    }

    function getDeviceId() {
      var stored = getStoredDeviceId();
      var generated = generateIdForDevice();
      debug('getStoredDeviceId returned: ' + stored);
      debug('generateIdForDevice returning: ' + generated);
      return stored || generated;
    }

    function save() {
      storage.setItem(tempPassCookieName, deviceId);
    }

    function getEventDetailsFromJSON(response) {
      var details = {
        message: 'Expired',
        description: 'Invalid session.',
      };
      if (response) {
        if (response.hasOwnProperty('message') && typeof response.message === 'string') {
          details.message = response.message;
        }
        if (response.hasOwnProperty('description') && typeof response.description === 'string') {
          details.description = response.description;
        }
      }
      return details;
    }

    function getEventDetailsFromXHR(xhr) {
      var response = JSON.parse(xhr.responseText);
      return getEventDetailsFromJSON(response);
    }

    function killTempPassSession() {
      clearInterval(interval);

      setStatus(TempPassAuthentication.Status.ENDED);
      _this.dispatchEvent(new NBCUniCPC.Event.TempPassSessionEndEvent(getEventDetailsFromJSON(null)));
    }

    function isGoodStatusCode(code) {
      return code === 200;
    }

    function prepNextPollRequest(response) {
      var duration = 0;
      if (response && response.hasOwnProperty('tempPass') && response.tempPass.hasOwnProperty('duration')) {
        duration = parseInt(response.tempPass.duration);
      }
      if (!isNaN(duration) && duration > 0) {
        setStatus(TempPassAuthentication.Status.STARTED);
        _this.dispatchEvent(new NBCUniCPC.Event.TempPassSessionStartEvent(duration));
      } else {
        killTempPassSession();
      }
    }

    function validateSessionResponse(response, textStatus, xhr) {
      if (isGoodStatusCode(xhr.status)) {
        prepNextPollRequest(response);
      } else {
        setStatus(TempPassAuthentication.Status.ENDED);
        _this.dispatchEvent(new NBCUniCPC.Event.TempPassSessionEndEvent(getEventDetailsFromXHR(xhr)));
      }
    }

    function onFailure(xhr, textStatus, errorThrown) {
      setStatus(TempPassAuthentication.Status.ENDED);
      _this.dispatchEvent(new NBCUniCPC.Event.TempPassSessionEndEvent(getEventDetailsFromXHR(xhr)));
    }

    function startSessionWhenReady() {
      if (!playerConfig.tempPassSettings) {
        warn('Player config has no tempPassSettings. Temp pass will not be used.');
      } else {
        mediator.getSessionConfig(playerConfig.tempPassSettings, deviceId, validateSessionResponse, onFailure);
      }
    }

    function handleSessionStart(evt) {
      interval = setTimeout(startSessionWhenReady, evt.data.duration);
    }

    function handleSessionEnd(evt) {
      _this.removeEventListener(NBCUniCPC.Event.TEMP_PASS_SESSION_END, handleSessionEnd);
      _this.removeEventListener(NBCUniCPC.Event.TEMP_PASS_SESSION_START, handleSessionStart);
    }

    this.startSession = function() {
      if (_this.enabled) {
        _this.addEventListener(NBCUniCPC.Event.TEMP_PASS_SESSION_START, handleSessionStart);
        _this.addEventListener(NBCUniCPC.Event.TEMP_PASS_SESSION_END, handleSessionEnd);
        debug('startSession');
        startSessionWhenReady();
      }
    };

    function init() {
      if (_this.enabled) {
        deviceId = getDeviceId();
        debug('deviceId is: ' + deviceId);
        save();
      }
    }

    this.initWithDependencies = function(config, wrapper) {
      playerConfig = config;
      _this.enabled = Boolean(
        playerConfig.hasOwnProperty('tempPassFeatureEnabled') && playerConfig.tempPassFeatureEnabled,
      );
      init();
    };
  }

  TempPassAuthentication.ID = 'CPC__TempPassAuthentication';
  TempPassAuthentication.Status = {
    UNINITIALIZED: 'uninitialized',
    STARTED: 'started',
    ENDED: 'ended',
  };

  function VideoCallSignBuilder() {
    var _this = this;

    var whitelistedBrands = ['BRAVO', 'SYFY', 'E!', 'OXYGEN', 'USA', 'UNIVERSO'];

    var _callSignOverride = false;

    this.isBrandWhitelisted = function(brand) {
      return whitelistedBrands.indexOf(brand.toUpperCase()) >= 0;
    };

    this.buildAnvpCallSignData = function(anvpdata, locationOverride) {
      if (typeof anvpdata === 'string') {
        anvpdata = JSON.parse(anvpdata);
      }
      if (anvpdata.hasOwnProperty('video')) {
        var videoValue = anvpdata.video;
        if (videoValue.toLowerCase().includes('-dt')) {
          videoValue = videoValue.split('-dt')[0];
        }
        if (_this.isBrandWhitelisted(videoValue)) {
          _callSignOverride = locationOverride;
          anvpdata.video = locationOverride + '-dt';
          console.log(
            'NBCUniCPC.js:VideoCallSignBuilder(): SUCCESS: Callsign Override [' + locationOverride + '] ALLOWED.',
          );
          return JSON.stringify(anvpdata);
        }
      }
      console.log(
        'NBCUniCPC.js:VideoCallSignBuilder(): ERROR: Callsign Override [' + locationOverride + '] NOT ALLOWED.',
      );
      return JSON.stringify(anvpdata);
    };

    this.buildGeoServiceCallSign = function(configSettings) {
      configSettings = JSON.stringify(configSettings);
      var replaceStr = ', \\\\\\"callsign\\\\\\":\\\\\\"' + _this.callSignOverride() + '\\\\\\"';
      configSettings = configSettings.replace(', @CALLSIGN_OVERRIDE@', _this.callSignOverride() ? replaceStr : '');
      return JSON.parse(configSettings);
    };

    this.callSignOverride = function() {
      return _callSignOverride;
    };
  }

  /**
   *
   * @constructor
   */

  /**
   *
   * @param jQueryProxy
   * @param serviceURL
   * @constructor
   */
  function BlackoutService(jQueryProxy, serviceURL, anvack) {
    var logger = new Logger('BlackoutService');

    var _jQueryProxy = jQueryProxy;
    var _this = this;
    var _upip;
    var _serviceURL = serviceURL;
    var _anvack = anvack;
    var _dispatcher = new EventDispatcher();

    var processFailure = function(response) {
      logger.warn('[BlackoutService] Service failed. HTTP Status:' + response.status);
      var event = new NBCUniCPC.Event.BlackoutEvent(NBCUniCPC.Event.BLACKOUT_STATUS);
      event.data.entitled = false;
      event.data.isError = true;
      event.data.responseObject = response;
      _this.dispatchEvent(event);
    };

    var processResponse = function(response) {
      logger.log('[BlackoutService] Response. ' + response);
      logger.log(response);
      var event = new NBCUniCPC.Event.BlackoutEvent(NBCUniCPC.Event.BLACKOUT_STATUS, false, false, {});
      //default state blocks user from stream
      event.data.entitled = false;
      event.data.responseObject = response;
      event.data.isError = false;

      if (response.blackout === 'false') {
        event.data.entitled = true;
      } else if (response.blackout === 'true') {
        logger.warn('[BlackoutService] Response contains blackout=true. Stream will be blocked.');
      } else if (response.hasOwnProperty('exception')) {
        logger.warn('[BlackoutService] Response contains an exception. Request may be malformed.');
        event.data.isError = true;
      } else if (!response) {
        logger.warn('[BlackoutService] Response is an Error. The response is totally empty of content.');
        event.data.isError = true;
        event.data.responseObject = {
          error: '[BlackoutService] The service returned an empty string.',
        };
      }
      _this.dispatchEvent(event);
    };

    function executeRequest(jQuery) {
      var requestUrl = _this.getRequestUrl();
      logger.log('[BlackoutService] Request URL: ' + requestUrl);
      jQuery
        .getJSON(requestUrl, function(response) {
          processResponse(response);
        })
        .fail(function(e) {
          processFailure(e);
        });
    }

    this.getRequestUrl = function() {
      var requestUrl = _serviceURL + _upip + '?format=jsonp&anvack=' + _anvack;
      if (_serviceURL.search('stage') >= 0) {
        requestUrl += '&returnDebugInfo=1';
      }
      requestUrl += '&callback=?';
      return requestUrl;
    };

    /**
     *
     * @param adobeMvpdId {string} Adobe Pass MVPD id, e.g. 'Comcast'
     * @param upip {string} program ID
     */
    this.doRequest = function(upip) {
      _upip = upip;
      _jQueryProxy.getJQuery(executeRequest);
    };

    this.addEventListener = function(type, callback) {
      _dispatcher.addEventListener(type, callback);
    };

    this.removeEventListener = function(type, callback) {
      _dispatcher.removeEventListener(type, callback);
    };

    this.dispatchEvent = function(evt) {
      _dispatcher.dispatchEvent(evt);
    };
  }

  /*
   You can see the regional blackout flag is on in the below instream events.. See the following highlighted in yellow â€œnrb=0â€:
  
   MetricsPlugin-min.js:23 [Metrics] [InStreamMetadataEventCallback] AnvatoInStreamContentBeaconEvent :
  {
    "data": {
      "cuepoint": {
        "name": "program_begin",
        "parameters": {
          "arc": "0",
          "der": "0",
          "nrb": "0",
          "type": "prg",
          "upip": "3450358439",
          "wda": "0"
        },
        "time": "28805.563000",
        "type": "event"
      }
    },
    "type": "AnvatoInStreamAdProgramBeginEvent"
  }
  
   Nrb = non regional blackout
   Nrb = 0 (Flag is set to on and program is subject to blackout)
   Nrb = 1 (Flag is set to off and program is not subject to blackout)
   */

  function EntitlementManager(jQueryProxy, htmlId, blackoutSlateUrl, blackoutService) {
    var logger = new Logger('EntitlementManager');
    var _blackoutSlateUrl = blackoutSlateUrl || '//client-cloudpath.nbcuni.com/current/resources/blackout_slate.png';

    var _jQueryProxy = jQueryProxy;
    var _player;
    var _dispatcher = new EventDispatcher();

    /*
    event.data looks like this:
    {
    "type": "AnvatoInStreamAdProgramBeginEvent",
      "data": {
        "cuepoint": {
        "time": "14405.585000",
          "parameters": {
          "der": "0",
          "nrb": "0",
          "upip": "3456687844",
          "wda": "0",
          "type": "prg",
          "arc": "0"
          },
        "type": "event",
        "name": "program_begin"
        }
      }
    }
     nrb = no regional blackout
     nrb = 0 (Flag is set to false, program is subject to blackout, double negative!!)
     nrb = 1 (Flag is set to true,  program is not subject to blackout)
  
  if no restriction, 'nrb' is not defined
  {
  "type": "AnvatoInStreamAdProgramBeginEvent",
    "data": {
      "cuepoint": {
        "time": "36005.356000",
        "parameters": {
          "type": "prg",
          "upip": "3459392942"
        },
        "type": "event",
        "name": "program_begin"
      }
    }
  }
   */
    /*
      {
        "type": "AnvatoInStreamAdContentIdentificationEvent",
        "data": {
        "cuepoint": {
          "time": "46391.933000",
            "parameters": {
            "type": "cid",
              "upip": "3463161028"
          },
          "type": "event",
            "name": "content_identification"
        }
      }
      }
      */

    var checkForBlackout = function(upip) {
      logger.warn('[EntitlementManager] checkForBlackout upip: ' + upip);
      blackoutService.doRequest(upip);
    };

    var getTypeAndParameters = function(event) {
      var dataType, params;
      try {
        dataType = event.data.type;
        params = event.data.data.cuepoint.parameters;
      } catch (e) {
        // Nothing to handle for now.
      }
      return {
        dataType: dataType,
        params: params,
      };
    };

    var onFirstContentBeacon = function(event) {
      var obj = getTypeAndParameters(event);
      var dataType = obj.dataType;
      var params = obj.params;
      if (dataType === 'AnvatoInStreamAdContentIdentificationEvent') {
        logger.log('[EntitlementManager] InstreamDebug type:' + dataType);
        logger.log(dataType);
        _player.removeEventListener(NBCUniCPC.Event.INSTREAM_DATA, onFirstContentBeacon);
        if (params && params.hasOwnProperty('upip')) {
          checkForBlackout(params.upip);
        }
      }
    };

    var onInStreamData = function(event) {
      var obj = getTypeAndParameters(event);
      var dataType = obj.dataType;
      var params = obj.params;
      if (dataType === 'AnvatoInStreamAdProgramBeginEvent') {
        logger.log('[EntitlementManager] InstreamDebug type:' + dataType);
        logger.log(dataType);
        if (params && params.hasOwnProperty('nrb')) {
          logger.log('[EntitlementManager] params.nrb = ' + params.nrb);
          if (params.nrb === 0 || params.nrb === '0') {
            checkForBlackout(params.upip);
          }
        }
      }
    };

    function embed(jQuery) {
      jQuery('#' + htmlId).replaceWith(
        '<div id="' +
          htmlId +
          '" style="height:100%;width:100%;background-color:#000">' +
          '<img style="width:100%;" src="' +
          _blackoutSlateUrl +
          '" alt="This content is not available due to a regional blackout.">' +
          '</img></div>',
      );
    }

    function blockPlayback() {
      logger.warn('[EntitlementManager] Blackout is in play. Halt Stream.');
      _player.unload();
      _jQueryProxy.getJQuery(embed);
    }

    var onBlackoutStatus = function(event) {
      if (!event.data.entitled) {
        blockPlayback();
      } else {
        logger.log('[EntitlementManager] Blackout not enforced. Proceed.');
      }
      //not sure if our event dispatcher will barf on redispatching an event, so just make a new one.
      var e = new NBCUniCPC.Event.BlackoutEvent(NBCUniCPC.Event.BLACKOUT_STATUS);
      e.data = event.data;
      _dispatcher.dispatchEvent(e);
    };

    this.monitorBlackout = function(player) {
      _player = player;
      _player.addEventListener(NBCUniCPC.Event.INSTREAM_DATA, onFirstContentBeacon);
      _player.addEventListener(NBCUniCPC.Event.INSTREAM_DATA, onInStreamData);
      blackoutService.addEventListener(NBCUniCPC.Event.BLACKOUT_STATUS, onBlackoutStatus);
    };

    this.addEventListener = function(type, callback) {
      _dispatcher.addEventListener(type, callback);
    };

    this.removeEventListener = function(type, callback) {
      _dispatcher.removeEventListener(type, callback);
    };
  }

  function EventDispatcher() {
    var eventListeners = {};

    function indexOf(needle, haystack) {
      for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] === needle) {
          return i;
        }
      }

      return -1;
    }

    this.addEventListener = function(type, listener) {
      eventListeners[type] = eventListeners[type] || [];
      if (indexOf(listener, eventListeners[type]) < 0) {
        eventListeners[type].push(listener);
      }
    };

    this.removeEventListener = function(type, listener) {
      var listeners = eventListeners[type] ? eventListeners[type].slice(0) : [];

      if (listener) {
        if (listeners) {
          var index = -1;

          for (var i = 0; listeners[i]; i++) {
            if (listeners[i] === listener) {
              index = i;
              break;
            }
          }

          if (index > -1) {
            listeners.splice(index, 1);
            eventListeners[type] = listeners;
          }
        }
      }
    };

    this.dispatchEvent = function(event) {
      var listeners = eventListeners[event.type] ? eventListeners[event.type].slice(0) : [];
      for (var i = 0; listeners[i]; i++) {
        listeners[i](event);
      }
    };
  }

  /**
   * @namespace NBCUniCPC.Event
   * @desc Events dispatched by the CPC Player.
   */
  NBCUniCPC.Event = {
    /**
     * Fires when the player determines the status of the auth kill switch. For
     * players configured with auth kill switch capabilities, these checks will
     * happen before player load and at every program boundary for linear streams.
     * @event
     * @param {string} type NBCUniCPC.Event.AUTH_KILL_SWITCH_CHECK
     * @param {boolean} authenticated Indicates whether the current event requires
     * an authenticated user. A value of <code>true</code> indicates that the auth
     * kill switch is off, so the user must be authenticated. A value of <code>false</code>
     * indicates that the auth kill switch is on, so all users are able to access
     * the video regardless of authentication status or tv rating.
     */
    AuthKillSwitchCheckEvent: function(type, authenticated) {
      this.type = type;
      this.data = {
        authenticated: authenticated,
      };
    },

    /**
     * Fires when a player configuration is asyncronously loaded
     * @event
     * @param {string} type NBCUniCPC.Event.CONFIG_LOADED
     * @param {object} config The JSON payload containing the configuration details.
     * @param {string} configId The id of the loaded config
     */
    ConfigLoadedEvent: function(type, config, configId) {
      this.type = type;
      this.data = {
        config: config,
        configId: configId,
      };
    },

    /**
     *
     * This type of event fires when companion ad data is made available through the
     * video player
     *
     * @event
     * @param {string} type NBCUniCPC.Event.COMPANION_AD
     * @param {string} message The contents of the companion ad to be written to the
     * page
     * @param {string} holderId The id of the html element where the companion is
     * expected to be displayed
     * @param {number} timestamp The number of milliseconds between midnight January
     * 1, 1970 UTC and when this event is created.
     *
     */
    CompanionAdEvent: function(type, message, holderId, timestamp) {
      this.type = type;
      this.data = {
        message: message,
        holderId: holderId,
        timestamp: timestamp,
      };
    },

    /**
     *
     * This type of event fires when an ad-related event happens
     *
     * @event
     * @param {string} type NBCUniCPC.Event.AD_STARTED, NBCUniCPC.Event.AD_LOAD_START
     * @param {string} id The id of the ad
     *
     *
     */
    AdEvent: function(type, id) {
      this.type = type;
      this.data = {
        id: id,
      };
    },

    /**
     *
     * Fires when the user interacts with the player
     *
     * @event
     * @param {string} type NBCUniCPC.Event.USER_INTERACTION
     * @param {string} interactionType Indicates the type of user interaction
     *
     *
     */
    UserInteractionEvent: function(type, interactionType) {
      this.type = type;
      this.data = {
        interactionType: interactionType,
      };
    },
    /**
     *
     * Fires when player state changes, e.g. from buffering to playing
     *
     * @event
     * @param {string} type NBCUniCPC.Event.STATE_CHANGE
     * @param {string} playerState Indicates the video state of the player. See {@link NBCUniCPC.VideoState} for expected values.
     *
     *
     */
    VideoStateChangeEvent: function(type, playerState) {
      this.type = type;
      this.data = {
        playerState: playerState,
      };
    },
    /**
     *
     * Fires for linear playback 1) when the stream starts 2) at program boudaries
     * 3) when stream source switches from national to local content
     * and vice-versa. The `data` object contains the fields `programId` `title`
     * and `description`. If no metadata are available for those fields, then the
     * value will be either `null` or empty string.
     * @event
     * @param {string} type NBCUniCPC.Event.PROGRAM_CHANGED
     * @param {object} data -  Expects keys 'programId','title','description'
     *
     *
     */
    ProgramChangedEvent: function(type, data) {
      this.type = type;
      this.data = {
        programId: data.programId,
        title: data.title,
        description: data.description,
      };
    },
    /**
     *
     * Fires when a the segment type has changed. This event indicates that a
     * segment has changed from content to an ad and vice-versa
     * @event
     * @param {string} type NBCUniCPC.Event.SEGMENT_TYPE_CHANGED
     * @param {string} segmentType The segment type. See {@link NBCUniCPC.SegmentType} for expected values.
     *
     *
     */
    SegmentTypeChangedEvent: function(type, segmentType) {
      this.type = type;
      this.data = {
        segmentType: segmentType,
      };
    },
    /**
     *
     * Fires when a playback error occurs
     * @event
     * @param {string} type NBCUniCPC.Event.PLAYER_ERROR
     * @param {string} errorCode A unique identifying code for this error
     * @param {string} errorDefinition A description of the error
     * @param {boolean} isCritical Indicates whether the playback will stop/not
     * start at all or the error is recoverable.
     *
     *
     */
    PlayerErrorEvent: function(type, errorCode, errorDefinition, isCritical) {
      this.type = type;
      this.data = {
        errorCode: errorCode,
        errorDefinition: errorDefinition,
        isCritical: isCritical,
      };
    },

    /**
     *
     * This type of event fires when the user or the player logic selects a
     * related video from the end state UI
     * @event
     * @param {string} type NBCUniCPC.Event.RELATED_VIDEO_SELECTED
     * @param {string} guid The MCP id (aka the MPX reference id) of the
     * selected assset
     * @param {string} permalink The permalink URL of the slected asset
     * @param {string} clipId An identifier for the selected asset
     * @param {boolean} clicked When true, indicates that the user selected the
     * asset by clicking a link to the selected asset. When false, indicates
     * that the asset was selected programatically, usually triggered by the
     * expiration of the end card countdown timer.
     *
     *
     */
    VideoSelectedEvent: function(type, guid, permalink, clipId, clicked) {
      this.type = type;
      this.data = {
        guid: guid,
        permalink: permalink,
        clipId: clipId,
        clicked: clicked,
      };
    },

    /**
     * This event fires when the Blackout service returns a response.
     * @event
     * @param type {string} - NBCUniCPC.Event.BLACKOUT_STATUS
     * @param entitled {boolean} - Whether the content is allowed (true) or blocked (false)
     * @param isError {boolean} - Whether the service is totally hosed (like a 404), or returned an exception due to a malformed request.
     * @param responseObj {object} - raw response object from blackout service
     */
    BlackoutEvent: function(type, entitled, isError, responseObj) {
      this.type = type;
      this.data = {
        entitled: entitled,
        isError: isError,
        responseObject: responseObj,
      };
    },

    /**
     * This event fires when the player is MUTED or UNMUTED.
     * @event
     * @param type {string} - NBCUniCPC.Event.MUTE_EVENT
     * @param data {boolean} - Whether the player is muted (true) or un-muted (false)
     */
    MuteEvent: function(type, data) {
      this.type = type;
      this.data = {
        muted: data,
      };
    },

    /**
     * This event fires in response to a call to getCaptionsEnabled().
     * @event
     * @param type {string} - NBCUniCPC.Event.CAPTION_STATE_EVENT
     * @param enabled {boolean} - Whether cations are enabled (true) or disabled (false)
     * @param language {string} - langCode, if available (platform player specific)
     */
    CaptionStateEvent: function(type, enabled, language) {
      this.type = type;
      this.data = {
        enabled: enabled,
        language: language,
      };
    },

    /**
     * This event fires in response to a call to getVolume().
     * @event
     * @param type {string} - NBCUniCPC.Event.VOLUME_EVENT
     * @param level {number} - Current volume level.  Value expressed as percentage (0 to 1).
     */
    VolumeEvent: function(type, level) {
      this.type = type;
      this.data = {
        level: level,
      };
    },

    /**
     * This event fires in response to a call to getSubtitleStyle().
     * @event
     * @param type {string} - NBCUniCPC.Event.SUBTITLE_STYLE
     * @param subtitleStyle {NBCUniCPC.SubtitleStyle} - SubtitleStyle object
     */
    SubtitleEvent: function(type, subtitleStyle) {
      this.type = type;
      this.data = {
        subtitleStyle: subtitleStyle,
      };
    },

    /**
     * This event fires when the current program sends call to action (C2A) data.
     * @event
     * @param type {string} - NBCUniCPC.Event.CALL_TO_ACTION
     * @param datasource {string} - The url (as string) containing C2A data.
     */
    CallToActionEvent: function(type, datasource) {
      this.type = type;
      this.data = {
        datasource: datasource,
      };
    },

    /**
     * Fires when a temp pass session starts
     * @event
     * @param {string} type - {@link TempPassAuthentication.SESSION_START}
     * @param duration {number} - The number of milliseconds remaining in the temp pass session
     */
    TempPassSessionStartEvent: function(duration) {
      this.type = NBCUniCPC.Event.TEMP_PASS_SESSION_START;
      this.data = {
        duration: duration,
      };
    },
    /**
     * Fires when a temp pass session ends
     * @event
     * @param {string} type - {@link TempPassAuthentication.SESSION_END}
     * @param details {object} - Contains addional information about the temp pass session for a given session.
     *	The details object contains the fields `message` and `description`
     */
    TempPassSessionEndEvent: function(details) {
      this.type = NBCUniCPC.Event.TEMP_PASS_SESSION_END;
      this.data = {
        message: details.message,
        description: details.description,
      };
    },

    /**
     * Fires for each time update
     * @event
     * @param {string} type - NBCUniCPC.Event.PLAYHEAD_UPDATE
     */
    PlayheadUpdateEvent: function(type, currentTime, currentTimeAggregate, isDvr, isLive, isMainTimeline) {
      this.type = NBCUniCPC.Event.PLAYHEAD_UPDATE;
      this.data = {
        currentTime: currentTime,
        currentTimeAggregate: currentTimeAggregate,
        isDvr: isDvr,
        isLive: isLive,
        isMainTimeline: isMainTimeline,
      };
    },
  };

  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:AuthKillSwitchCheckEvent
   */
  NBCUniCPC.Event.AUTH_KILL_SWITCH_CHECK = 'AUTH_KILL_SWITCH_CHECK';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.AUTHENTICATION_STATUS = 'AUTHENTICATION_STATUS';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.AUTHORIZATION_STATUS = 'AUTHORIZATION_STATUS';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.BLACKOUT_STATUS = 'BLACKOUT_STATUS';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:CallToActionEvent
   */
  NBCUniCPC.Event.CALL_TO_ACTION = 'CALL_TO_ACTION';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:CompanionAdEvent
   */
  NBCUniCPC.Event.COMPANION_AD = 'companion_ad';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:ConfigLoadedEvent
   */
  NBCUniCPC.Event.CONFIG_LOADED = 'CONFIG_LOADED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PROVIDER_SELECTED = 'PROVIDER_SELECTED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:VideoSelectedEvent
   */
  NBCUniCPC.Event.RELATED_VIDEO_SELECTED = 'RelatedVideoSelected';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.MUTE_EVENT = 'MUTE_EVENT';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.TEMP_PASS_SESSION_START = 'TEMP_PASS_SESSION_START';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.TEMP_PASS_SESSION_END = 'TEMP_PASS_SESSION_END';
  /**
   *
   * @readonly
   * @default
   * @deprecated Use NBCUniCPC.Event.PLAYHEAD_UPDATE instead
   * @type {string}
   * @see NBCUniCPC.Event.event:PlayheadUpdateEvent
   */
  NBCUniCPC.Event.TIME_UPDATED = 'TIME_UPDATED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.VOLUME_EVENT = 'VOLUME_EVENT';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.CAPTION_STATE_EVENT = 'CAPTION_STATE_EVENT';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:UserInteractionEvent
   */
  NBCUniCPC.Event.USER_INTERACTION = 'USER_INTERACTION';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PROVIDER_IFRAME_INJECTED = 'PROVIDER_IFRAME_INJECTED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PROVIDER_IFRAME_REMOVED = 'PROVIDER_IFRAME_REMOVED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PREVIEW_STATUS = 'PREVIEW_STATUS';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PREVIEW_EXPIRED = 'PREVIEW_EXPIRED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PICKER_REQUESTED = 'PICKER_REQUESTED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:VideoStateChangeEvent
   */
  NBCUniCPC.Event.STATE_CHANGE = 'STATE_CHANGE';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.FIRST_FRAME_READY = 'FIRST_FRAME_READY';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:ProgramChangedEvent
   */
  NBCUniCPC.Event.PROGRAM_CHANGED = 'PROGRAM_CHANGED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:SegmentTypeChangedEvent
   */
  NBCUniCPC.Event.SEGMENT_TYPE_CHANGED = 'SEGMENT_TYPE_CHANGED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.SEGMENT_STARTED = 'SEGMENT_STARTED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.SEGMENT_COMPLETED = 'SEGMENT_COMPLETED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.POPUP_BLOCKED = 'POPUP_BLOCKED';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:PlayerErrorEvent
   */
  NBCUniCPC.Event.PLAYER_ERROR = 'PLAYER_ERROR';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.AD_BREAK_STARTED = 'AD_BREAK_STARTED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.AD_BREAK_COMPLETED = 'AD_BREAK_COMPLETED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:AdEvent
   */
  NBCUniCPC.Event.AD_LOAD_START = 'AD_LOAD_START';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:AdEvent
   */
  NBCUniCPC.Event.AD_STARTED = 'AD_STARTED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   * @see NBCUniCPC.Event.event:AdEvent
   */
  NBCUniCPC.Event.AD_COMPLETED = 'AD_COMPLETED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.INSTREAM_DATA = 'INSTREAM_DATA';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PLAYER_LOADED = 'PLAYER_LOADED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PLAYBACK_READY = 'PLAYBACK_READY';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PLAYBACK_STARTED = 'PLAYBACK_STARTED';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PLAYHEAD_UPDATE = 'PLAYHEAD_UPDATE';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.SUBTITLE_STYLE = 'SUBTITLE_STYLE';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.PLAYER_UNLOADING = 'PLAYER_UNLOADING';

  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.CONCURRENCY_STATUS_EVENT = 'CONCURRENCY_STATUS_EVENT';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.CONCURRENCY_TERMINATION_EVENT = 'CONCURRENCY_TERMINATION_EVENT';
  /**
   *
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.CONCURRENCY_ERROR_EVENT = 'CONCURRENCY_ERROR_EVENT';

  /**
   * @description Indicates that the user has selected to replay the current asset.
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.END_CARD_REPLAY_CLIP_EVENT = 'endCardReplayClipEvent';
  /**
   * @description Indicates that the end card countdown timer has completed, so the page should take the default action.
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.END_CARD_COUNTDOWN_TIMER_COMPLETE_EVENT = 'endCardCountdownTimerCompleteEvent';
  /**
   * @description Indicates that the user has selected to play the next asset immediately.
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.END_CARD_PLAY_NEXT_ITEM_EVENT = 'endCardPlayNextItemEvent';

  /**
   * @description This event type is dispatched when VOD video playback has completed, either by playing through to the end, or by being unloaded after playback starts.
   * @readonly
   * @default
   * @type {string}
   */
  NBCUniCPC.Event.VIDEO_PLAYBACK_COMPLETED = 'VIDEO_PLAYBACK_COMPLETED';

  function ContentMetadata(source) {
    var NOT_SET = {};
    var DEFAULT_UNDEFINED_STRING = '';
    var DEFAULT_UNDEFINED_NUMBER = -1;

    // setting the values to NOT_SET lets us avoid mistakenly evaluating a falsy statement
    // like if(!"") or if(!0) in an unexpected way that prevents caching falsy values
    var _videoId = NOT_SET;
    var _assetTitle = NOT_SET;
    var _category = NOT_SET;
    var _description = NOT_SET;
    var _startPreviouslyOnSequence = NOT_SET;
    var _endPreviouslyOnSequence = NOT_SET;
    var _startTeaseSequence = NOT_SET;
    var _endTeaseSequence = NOT_SET;
    var _startTitleSequence = NOT_SET;
    var _endTitleSequence = NOT_SET;
    var _imageUrl = NOT_SET;
    var _nbcuId = NOT_SET;
    var _openingCuePoint = NOT_SET;
    var _showTitle = NOT_SET;

    function isSet(param) {
      return param !== NOT_SET;
    }

    this.videoId = function() {
      if (!isSet(_videoId)) {
        _videoId = source && source.videoId ? String(source.videoId) : DEFAULT_UNDEFINED_STRING;
      }
      return _videoId;
    };

    this.assetTitle = function() {
      if (!isSet(_assetTitle)) {
        _assetTitle = source && source.assetTitle ? String(source.assetTitle) : DEFAULT_UNDEFINED_STRING;
      }
      return _assetTitle;
    };

    function parseCategory() {
      var defaultCategory = [DEFAULT_UNDEFINED_STRING];
      if (!source) {
        return defaultCategory;
      }
      if ('string' === typeof source.category) {
        return [source.category];
      } else if (Array.isArray(source.category) && source.category.length > 0) {
        return source.category;
      }

      return defaultCategory;
    }

    this.category = function() {
      if (!isSet(_category)) {
        _category = parseCategory();
      }
      return _category;
    };

    this.description = function() {
      if (!isSet(_description)) {
        _description = source && source.description ? String(source.description) : DEFAULT_UNDEFINED_STRING;
      }
      return _description;
    };

    this.startPreviouslyOnSequence = function() {
      if (!isSet(_startPreviouslyOnSequence)) {
        var value = source ? parseFloat(source.startPreviouslyOnSequence) : DEFAULT_UNDEFINED_NUMBER;
        _startPreviouslyOnSequence = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _startPreviouslyOnSequence;
    };

    this.endPreviouslyOnSequence = function() {
      if (!isSet(_endPreviouslyOnSequence)) {
        var value = source ? parseFloat(source.endPreviouslyOnSequence) : DEFAULT_UNDEFINED_NUMBER;
        _endPreviouslyOnSequence = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _endPreviouslyOnSequence;
    };

    this.startTeaseSequence = function() {
      if (!isSet(_startTeaseSequence)) {
        var value = source ? parseFloat(source.startTeaseSequence) : DEFAULT_UNDEFINED_NUMBER;
        _startTeaseSequence = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _startTeaseSequence;
    };

    this.endTeaseSequence = function() {
      if (!isSet(_endTeaseSequence)) {
        var value = source ? parseFloat(source.endTeaseSequence) : DEFAULT_UNDEFINED_NUMBER;
        _endTeaseSequence = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _endTeaseSequence;
    };

    this.startTitleSequence = function() {
      if (!isSet(_startTitleSequence)) {
        var value = source ? parseFloat(source.startTitleSequence) : DEFAULT_UNDEFINED_NUMBER;
        _startTitleSequence = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _startTitleSequence;
    };

    this.endTitleSequence = function() {
      if (!isSet(_endTitleSequence)) {
        var value = source ? parseFloat(source.endTitleSequence) : DEFAULT_UNDEFINED_NUMBER;
        _endTitleSequence = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _endTitleSequence;
    };

    this.imageUrl = function() {
      if (!isSet(_imageUrl)) {
        _imageUrl = source && source.imageUrl ? String(source.imageUrl) : DEFAULT_UNDEFINED_STRING;
      }
      return _imageUrl;
    };

    this.nbcuId = function() {
      if (!isSet(_nbcuId)) {
        _nbcuId = source && source.nbcuId ? String(source.nbcuId) : DEFAULT_UNDEFINED_STRING;
      }
      return _nbcuId;
    };

    this.openingCuePoint = function() {
      if (!isSet(_openingCuePoint)) {
        var value = source ? parseFloat(source.openingCuePoint) : DEFAULT_UNDEFINED_NUMBER;
        _openingCuePoint = !isNaN(value) ? value : DEFAULT_UNDEFINED_NUMBER;
      }
      return _openingCuePoint;
    };

    this.showTitle = function() {
      if (!isSet(_showTitle)) {
        _showTitle = source && source.showTitle ? String(source.showTitle) : DEFAULT_UNDEFINED_STRING;
      }
      return _showTitle;
    };
  }

  /**
   * Provides access to ContentMetadata instances. This class asyncronously
   * retrieves metadata if necessary and caches the results.
   *
   * @param {MetadataRequestMediator} mediator - Sends and interprets requests for
   * content metadata.
   */
  function ContentMetadataDAO(mediator) {
    var INITIALIZED = 'initialized';
    var PENDING = 'pending';
    var AVAILABLE = 'available';
    var cache = {};

    function onMetadataRetrieved(metadata) {
      var item = cache[metadata.videoId()];
      item.status = AVAILABLE;
      item.metadata = metadata;

      while (item.callbacks.length > 0) {
        var popped = item.callbacks.pop();
        popped(item.metadata);
      }
    }

    function newItem(id) {
      return {
        status: INITIALIZED,
        metadata: null,
        callbacks: [],
      };
    }

    function getItemById(id) {
      if (!cache[id]) {
        cache[id] = newItem(id);
      }
      return cache[id];
    }

    function sendInitialRequest(item, cio) {
      if (INITIALIZED === item.status) {
        item.status = PENDING;
        mediator.getMetadata(cio, onMetadataRetrieved);
      }
    }

    function addCallback(item, callback) {
      item.callbacks.push(callback);
    }

    /**
     * Asyncronously retrieves <code>ContentMetadata</code> by video id and
     * returns the result in a callback.
     *
     * @param {ContentInitializationObject} cio - a {@link ContentInitializationObject}
     * instance that contains the video id to request.
     * @param {ContentMetadataDAO~callback} callback - The callback to be
     * invoked after the metadata have been retrieved and parsed.
     */
    this.requestContentMetadata = function(cio, callback) {
      var item = getItemById(cio.videoId);
      if (item.metadata) {
        callback(item.metadata);
      } else {
        addCallback(item, callback);
        sendInitialRequest(item, cio);
      }
    };
  }

  /**
   * The callback that will be invoked after the metadata have been retrieved
   * and parsed.
   *
   * @callback {ContentMetadataDAO~callback}
   * @param {ContenteMetadata} metadata - A ContenteMetadata instance with the response
   * values as the data source.
   */

  function ClientMeasureInterface() {
    var playheadTime = -1;

    function onTimeUpdated(evt) {
      playheadTime = evt.data.currentTimeAggregate;
    }

    this.getPHT = function() {
      return playheadTime; // Play Head Time in milli seconds or -1 if not available
    };
    this.getBufferLength = function() {
      return -1; // Buffer Length in milli seconds or -1 if not available
    };
    this.getSignalStrength = function() {
      return 1000; // Signal Strength in dBm or 1000 if not available
    };
    this.getRenderedFrameRate = function() {
      return -1; // Rendered Framerate of video or -1 if not available
    };

    this.setPlayer = function(player) {
      player.addEventListener(NBCUniCPC.Event.PLAYHEAD_UPDATE, onTimeUpdated);
    };

    this.removeCmiListener = function(player) {
      player.removeEventListener(NBCUniCPC.Event.PLAYHEAD_UPDATE, onTimeUpdated);
    };
  }

  function GeoResponseParser() {
    var logger = new Logger('GeoResponseParser');
    var program = {};
    var response = {};
    var isAuthenticated = false;
    var selectedProvider = null;

    function warn(str) {
      logger.warn(str);
    }

    this.updateGeoInfo = function(info) {
      response = info;
    };
    this.updateProgramInfo = function(info) {
      program = info;
    };

    this.getCallSign = function() {
      var callSign = '';
      if (
        response.hasOwnProperty('localizedChannelInfo') &&
        response.localizedChannelInfo.hasOwnProperty('geoChannel') &&
        response.localizedChannelInfo.geoChannel &&
        response.localizedChannelInfo.geoChannel.length > 0
      ) {
        callSign = response.localizedChannelInfo.geoChannel;
      } else if (
        response.hasOwnProperty('localizedChannelInfo') &&
        response.localizedChannelInfo.hasOwnProperty('channel') &&
        response.localizedChannelInfo.channel &&
        response.localizedChannelInfo.channel.length > 0
      ) {
        callSign = response.localizedChannelInfo.channel;
      } else {
        warn('Unable to retrieve callsign from geo service.');
      }
      return callSign;
    };

    this.getProgramId = function() {
      var programId = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('assetId') &&
        response.assetInfo.assetId &&
        response.assetInfo.assetId.length > 0
      ) {
        programId = response.assetInfo.assetId;
      } else {
        warn('Unable to retrieve program id from geo service.');
      }
      return programId || program.programId || ''; // the programId from the geo response OR the programId from the program update event OR empty string as default
    };

    this.getTitle = function() {
      var title = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('title') &&
        response.assetInfo.title &&
        response.assetInfo.title.length > 0
      ) {
        title = response.assetInfo.title;
      } else {
        warn('Unable to retrieve program title from geo service.');
      }
      return title || program.title || ''; // the title from the geo response OR the title from the program update event OR empty string as default
    };

    this.getEpisodeNumber = function() {
      var episodeNumber = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('episodeNumber') &&
        response.assetInfo.episodeNumber
      ) {
        episodeNumber = response.assetInfo.episodeNumber;
      } else {
        warn('Unable to retrieve episodeNumber from geo service.');
      }
      return episodeNumber;
    };

    this.getCategory = function() {
      var category = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('genres') &&
        response.assetInfo.genres &&
        response.assetInfo.genres.length > 0
      ) {
        category = JSON.stringify(response.assetInfo.genres);
      } else {
        warn('Unable to retrieve category from geo service.');
      }
      return category;
    };

    this.getOriginalAirDate = function() {
      var originalAirDate = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('originalAirDate') &&
        response.assetInfo.originalAirDate &&
        response.assetInfo.originalAirDate.length > 0
      ) {
        originalAirDate = response.assetInfo.originalAirDate;
      } else {
        warn('Unable to retrieve originalAirDate from geo service.');
      }
      return originalAirDate;
    };

    this.getRating = function() {
      var rating = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('tvRating') &&
        response.assetInfo.hasOwnProperty('tvRating') &&
        response.assetInfo.tvRating &&
        response.assetInfo.tvRating.length > 0
      ) {
        rating = response.assetInfo.tvRating;
      } else {
        warn('Unable to retrieve tvRating from geo service.');
      }
      return rating;
    };

    this.getSeasonNumber = function() {
      var seasonNumber = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('seasonNumber') &&
        response.assetInfo.hasOwnProperty('seasonNumber') &&
        response.assetInfo.seasonNumber &&
        response.assetInfo.seasonNumber.length > 0
      ) {
        seasonNumber = response.assetInfo.seasonNumber;
      } else {
        warn('Unable to retrieve seasonNumber from geo service.');
      }
      return seasonNumber;
    };

    this.getEpisodeTitle = function() {
      var episodeTitle = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('episodeTitle') &&
        response.assetInfo.hasOwnProperty('episodeTitle') &&
        response.assetInfo.episodeTitle &&
        response.assetInfo.episodeTitle.length > 0
      ) {
        episodeTitle = response.assetInfo.episodeTitle;
      } else {
        warn('Unable to retrieve episodeTitle from geo service.');
      }
      return episodeTitle;
    };

    this.getLongTitle = function() {
      var longTitle = '';
      if (
        response.hasOwnProperty('assetInfo') &&
        response.assetInfo.hasOwnProperty('longTitle') &&
        response.assetInfo.hasOwnProperty('longTitle') &&
        response.assetInfo.longTitle &&
        response.assetInfo.longTitle.length > 0
      ) {
        longTitle = response.assetInfo.longTitle;
      } else {
        warn('Unable to retrieve longTitle from geo service.');
      }
      return longTitle;
    };

    this.getAccessTypeValue = function() {
      return isAuthenticated ? 'Authenticated' : 'Free';
    };

    this.setIsAuthenticated = function(value) {
      isAuthenticated = value;
    };
    this.getSelectedProviderValue = function() {
      return selectedProvider && isAuthenticated ? selectedProvider : 'unauthenticated';
    };
    this.setSelectedProvider = function(value) {
      selectedProvider = value;
    };
  }

  function CustomConvivaMetadata(config, model, scope) {
    function getPlayerVersion() {
      return scope.hasOwnProperty('anvp') && scope.anvp.hasOwnProperty('version') ? scope.anvp.version : '';
    }

    this.getAdCustomMetadata = function() {
      return {
        brand: config.brand,
        product: config.product,
        episodeTitle: model.getEpisodeTitle(),
        show: model.getLongTitle(),
        videoId: model.getProgramId(),
      };
    };

    this.getCustomMetadata = function() {
      return {
        accessType: model.getAccessTypeValue(),
        appSessionId: config.appSessionId,
        appVersion: config.appVersion,
        brand: config.brand,
        cloudpathSDKVersion: NBCUniCPC.getVersion(),
        deviceId: config.deviceId || '',
        episodeTitle: model.getEpisodeTitle(),
        episodeNumber: model.getEpisodeNumber(),
        genre: model.getCategory(),
        geoStation: model.getCallSign(),
        product: config.product,
        playbackDevice: config.playbackDevice,
        playbackStartPosition: '0',
        playerVendor: config.playerVendor,
        playerVersion: getPlayerVersion(),
        pubDate: model.getOriginalAirDate(),
        rating: model.getRating(),
        season: model.getSeasonNumber(),
        show: model.getLongTitle(),
        streamLen: '0',
        syndicator: model.getSelectedProviderValue(),
        stitchType: config.stitchType,
        stitchVendor: config.stitchVendor,
        streamProtocol: config.streamProtocol,
        videoId: model.getProgramId(),
        videoType: config.streamType,
        videoInitialized: config.videoInitialized,
      };
    };
  }

  /* *
   * @see https://community.conviva.com/site/global/platforms/other_platforms/sdks/javascript_sdk/tutorials/index.gsp
   * @see https://wiki.inbcu.com/display/CPPRODUCT/Conviva+Live+and+VOD+Metadata+Specification
   * @see https://docs.google.com/spreadsheets/d/1L1PrUh4udTIrwZqO6UGWg4FQI1sCxmtTMYB6Y-gkg3c/edit#gid=1348621288
   *
   * @param {window} [_scope=window] - The window object
   * */
  function ConvivaMonitor(model, cmi, config, geoRequestStrategy, scope) {
    var customMetadata = new CustomConvivaMetadata(config, model, scope);

    var _Conviva = scope.Conviva;
    var playerState = _Conviva.PlayerStateManager.PlayerState.BUFFERING;
    var adPlayerState = _Conviva.PlayerStateManager.PlayerState.BUFFERING;
    var player,
      systemInterface,
      systemSettings,
      systemFactory,
      clientSettings,
      client,
      playerStateManager,
      adPlayerStateManager,
      contentMetadata,
      sessionKey,
      adSessionKey,
      adMetadata,
      currentSegmentType,
      previousSegmentType;

    function getAssetName() {
      var str = config.assetName;
      str = str.replace(/@@PROGRAM_ID@@/g, model.getProgramId());
      str = str.replace(/@@TITLE@@/g, model.getTitle());
      var episodeTitle = model.getEpisodeTitle();
      if (episodeTitle) {
        str = str.replace(/@@EPISODE_TITLE@@/g, ' - ' + episodeTitle);
      } else {
        str = str.replace(/@@EPISODE_TITLE@@/g, episodeTitle);
      }
      return str;
    }

    function getStreamUrl() {
      return config.streamUrl.replace('@@CALL_SIGN@@', model.getCallSign());
    }

    function updateContentMetadata() {
      contentMetadata.custom = customMetadata.getCustomMetadata();

      contentMetadata.streamUrl = getStreamUrl();
      contentMetadata.assetName = getAssetName();

      if ('undefined' !== typeof sessionKey) {
        client.updateContentMetadata(sessionKey, contentMetadata);
      }
    }

    function getViewerId() {
      if (
        config.hasOwnProperty('viewerId') &&
        String(config.viewerId).length > 0 &&
        'undefined' !== String(config.viewerId)
      ) {
        return config.viewerId;
      }
      return NBCUniCPC.utils.guid();
    }

    function canSetConvivaPlayerState() {
      return 'undefined' !== typeof sessionKey && 'undefined' !== typeof playerStateManager;
    }

    function canSetConvivaAdPlayerState() {
      return 'undefined' !== typeof adSessionKey && 'undefined' !== typeof adPlayerStateManager;
    }

    function setAdPlayerState(state) {
      // Player state should be of BUFFERING, STOPPED, PLAYING, PAUSED or UNKNOWN
      switch (state) {
        case _Conviva.PlayerStateManager.PlayerState.BUFFERING:
        case _Conviva.PlayerStateManager.PlayerState.STOPPED:
        case _Conviva.PlayerStateManager.PlayerState.PLAYING:
        case _Conviva.PlayerStateManager.PlayerState.PAUSED:
        case _Conviva.PlayerStateManager.PlayerState.UNKNOWN:
          adPlayerState = state;
          if (canSetConvivaAdPlayerState()) {
            adPlayerStateManager.setPlayerState(adPlayerState);
          }
          break;
        default:
      }
    }

    function setPlayerState(state) {
      // Player state should be of BUFFERING, STOPPED, PLAYING, PAUSED or UNKNOWN
      switch (state) {
        case _Conviva.PlayerStateManager.PlayerState.BUFFERING:
        case _Conviva.PlayerStateManager.PlayerState.STOPPED:
        case _Conviva.PlayerStateManager.PlayerState.PLAYING:
        case _Conviva.PlayerStateManager.PlayerState.PAUSED:
        case _Conviva.PlayerStateManager.PlayerState.UNKNOWN:
          playerState = state;
          if (canSetConvivaPlayerState()) {
            playerStateManager.setPlayerState(playerState);
          }
          break;
        default:
      }
    }

    function startSessionMaybe() {
      // sessionKey can be 0, so check for "undefined" rather than for a "falsy" value
      if ('undefined' === typeof sessionKey) {
        sessionKey = client.createSession(contentMetadata);
        client.attachPlayer(sessionKey, playerStateManager);

        // from https://community.conviva.com/site/global/platforms/other_platforms/sdks/javascript_sdk/tutorials/index.gsp:
        // Note: The time from initial video loading to the start of rendering should be reported as BUFFERING, followed by PLAYING, once the video starts rendering.
        // We'll initially set the playerstate to BUFFERING and then attempt to update it with a maybe different value in case these calls are happening in an unexpected order
        playerStateManager.setPlayerState(_Conviva.PlayerStateManager.PlayerState.BUFFERING); // set the initial state to the expected initial value
        setPlayerState(playerState); // set the state to our own, internal state
      }
    }

    function updateGeoInfo(response) {
      model.updateGeoInfo(response);
    }

    function onGeoSuccess(response, textStatus, xhr) {
      updateGeoInfo(response);

      updateContentMetadata();
      startSessionMaybe();
    }

    function onGeoFailure() {
      startSessionMaybe();
    }

    function makeGeoRequest() {
      geoRequestStrategy.execute(onGeoSuccess, onGeoFailure);
    }

    function onProgramChanged(evt) {
      model.updateProgramInfo(evt.data);
      makeGeoRequest();
    }

    function onAuthenticationStatus(e) {
      model.setIsAuthenticated(e.data.isAuthenticated);
    }

    function onProviderSelected(e) {
      model.setSelectedProvider(e.data.provider_id);
      updateContentMetadata();
    }

    function updateSegmentType(value) {
      previousSegmentType = currentSegmentType;
      currentSegmentType = value;
    }

    function isAdEventValid() {
      if ('undefined' === typeof sessionKey || currentSegmentType === previousSegmentType) {
        return false;
      }
      return true;
    }

    function adBreakStart(evt) {
      updateSegmentType('adBreakStart');
      if (!isAdEventValid()) {
        return;
      }
      var podAttr = {};
      podAttr['podPosition'] = 'Mid-roll';
      client.sendCustomEvent(sessionKey, 'Conviva.PodStart', podAttr);
      if (client.isPlayerAttached(sessionKey)) {
        // Detach the main content session so we do not monitor content while playing Ads.
        client.detachPlayer(sessionKey);
      }
    }

    function adBreakStop(evt) {
      updateSegmentType('adBreakStop');
      if (!isAdEventValid()) {
        return;
      }
      var podAttr = {};
      podAttr['podPosition'] = 'Mid-roll';
      client.sendCustomEvent(sessionKey, 'Conviva.PodEnd', podAttr);
      if (!client.isPlayerAttached(sessionKey)) {
        client.attachPlayer(sessionKey, playerStateManager);
      }
    }

    function createAdSession(evt) {
      adMetadata = new _Conviva.ContentMetadata();
      adMetadata.assetName = getAssetName();
      adMetadata.streamType = config.streamType;
      adMetadata.streamUrl = getStreamUrl();
      adMetadata.defaultResource = config.defaultResource;

      adMetadata.custom = customMetadata.getAdCustomMetadata();

      // sessionKey is the return value of createSession() for the main content session
      // If we do not have main video content session then return;
      if ('undefined' === typeof sessionKey) {
        return;
      }

      // Create a Conviva monitoring ad session.
      adSessionKey = client.createAdSession(sessionKey, adMetadata);
      // Attach your player state manager to session
      adPlayerStateManager = client.getPlayerStateManager();
      client.attachPlayer(adSessionKey, adPlayerStateManager);

      adPlayerStateManager.setPlayerState(_Conviva.PlayerStateManager.PlayerState.BUFFERING); // set the initial state to the expected initial value
      setAdPlayerState(adPlayerState); // set the state to our own, internal state
    }

    function cleanupAdSession() {
      if ('undefined' === typeof adSessionKey) {
        return;
      }
      client.cleanupSession(adSessionKey);
    }

    function onStateChangeEvent(evt) {
      switch (evt.data.playerState) {
        case NBCUniCPC.VideoState.STATE_BUFFERING:
          setPlayerState(_Conviva.PlayerStateManager.PlayerState.BUFFERING);
          setAdPlayerState(_Conviva.PlayerStateManager.PlayerState.BUFFERING);
          break;
        case NBCUniCPC.VideoState.STATE_PAUSED:
          setPlayerState(_Conviva.PlayerStateManager.PlayerState.PAUSED);
          setAdPlayerState(_Conviva.PlayerStateManager.PlayerState.PAUSED);
          break;
        case NBCUniCPC.VideoState.STATE_PLAYING:
          setPlayerState(_Conviva.PlayerStateManager.PlayerState.PLAYING);
          setAdPlayerState(_Conviva.PlayerStateManager.PlayerState.PLAYING);
          break;
        default:
      }
    }

    function onPlayerLoaded(evt) {
      player.removeEventListener(NBCUniCPC.Event.PLAYER_LOADED, onPlayerLoaded);
      updateContentMetadata(); // this updates the player version, now that it is available
    }

    this.setPlayer = function(_player) {
      player = _player;
      player.addEventListener(NBCUniCPC.Event.PLAYER_LOADED, onPlayerLoaded);
      player.addEventListener(NBCUniCPC.Event.PROGRAM_CHANGED, onProgramChanged);
      player.addEventListener(NBCUniCPC.Event.AUTHENTICATION_STATUS, onAuthenticationStatus);
      player.addEventListener(NBCUniCPC.Event.PROVIDER_SELECTED, onProviderSelected);
      player.addEventListener(NBCUniCPC.Event.STATE_CHANGE, onStateChangeEvent);
      player.addEventListener(NBCUniCPC.Event.AD_STARTED, createAdSession);
      player.addEventListener(NBCUniCPC.Event.AD_COMPLETED, cleanupAdSession);
      player.addEventListener(NBCUniCPC.Event.AD_BREAK_STARTED, adBreakStart);
      player.addEventListener(NBCUniCPC.Event.AD_BREAK_COMPLETED, adBreakStop);
      cmi.setPlayer(player);
    };

    function removePlayerListeners() {
      player.removeEventListener(NBCUniCPC.Event.PLAYER_LOADED, onPlayerLoaded);
      player.removeEventListener(NBCUniCPC.Event.PROGRAM_CHANGED, onProgramChanged);
      player.removeEventListener(NBCUniCPC.Event.AUTHENTICATION_STATUS, onAuthenticationStatus);
      player.removeEventListener(NBCUniCPC.Event.PROVIDER_SELECTED, onProviderSelected);
      player.removeEventListener(NBCUniCPC.Event.STATE_CHANGE, onStateChangeEvent);
      player.removeEventListener(NBCUniCPC.Event.AD_STARTED, createAdSession);
      player.removeEventListener(NBCUniCPC.Event.AD_COMPLETED, cleanupAdSession);
      player.removeEventListener(NBCUniCPC.Event.AD_BREAK_STARTED, adBreakStart);
      player.removeEventListener(NBCUniCPC.Event.AD_BREAK_COMPLETED, adBreakStop);
      cmi.removeCmiListener(player);
    }

    this.init = function() {
      systemSettings = new _Conviva.SystemSettings();
      systemSettings.logLevel = _Conviva.SystemSettings.LogLevel.DEBUG; // log everything
      systemSettings.allowUncaughtExceptions = true; // do not silently catch exceptions, may help debugging

      systemInterface = new _Conviva.SystemInterface(
        new Html5Time(),
        new Html5Timer(),
        new Html5Http(),
        new Html5Storage(),
        new Html5Metadata(),
        new Html5Logging(),
      );
      systemFactory = new _Conviva.SystemFactory(systemInterface, systemSettings);

      clientSettings = new _Conviva.ClientSettings(config.CUSTOMER_KEY);
      clientSettings.gatewayUrl = config.TOUCHSTONE_SERVICE_URL;

      client = new _Conviva.Client(clientSettings, systemFactory);

      playerStateManager = client.getPlayerStateManager();
      playerStateManager.setClientMeasureInterface(cmi);

      contentMetadata = new _Conviva.ContentMetadata();
      contentMetadata.assetName = getAssetName();
      contentMetadata.streamUrl = getStreamUrl();
      contentMetadata.streamType = config.streamType;
      contentMetadata.applicationName = config.applicationName;
      contentMetadata.defaultResource = config.defaultResource;
      contentMetadata.viewerId = getViewerId();
      contentMetadata.custom = customMetadata.getCustomMetadata();

      makeGeoRequest();
    };

    this.cleanupSession = function() {
      client.cleanupSession(sessionKey);
      cleanupAdSession();
      removePlayerListeners();
    };
  }

  /**
   * Manages CPC-level metrics
   *
   * @param {Object} requestFactory - Creates Request objects for retrieving data
   *	from a web service
   */
  function MonitorManager(requestFactory) {
    var _player, _config, _conviva;

    function objectify(o) {
      if ('object' === typeof o) {
        return o;
      } else if ('string' === typeof o) {
        return JSON.parse(o);
      } else {
        return {};
      }
    }

    function getUserMetadata() {
      return {};
    }

    function newGeoRequest() {
      return new GeoRequestMediator(
        requestFactory,
        {
          getUserMetadata: getUserMetadata,
        },
        _config.authKillSettings,
      );
    }

    function newConvivaMonitor(params) {
      return Boolean(params.enabled)
        ? new ConvivaMonitor(new GeoResponseParser(), new ClientMeasureInterface(), params, newGeoRequest(), window)
        : NullMonitor.getInstance();
    }

    /**
     *
     * @param {object} config The parsed, specificConfig object within the CPC
     * config file.
     * @param {Player} player A Player instance
     *
     * @see {@link ConfigParser.getPlayerObject}
     * @see {@link Player}
     */
    this.start = function(config, player) {
      _config = config;
      _player = player;

      // If Conviva already exists then clean the earlier session
      if (_conviva !== undefined) {
        _conviva.cleanupSession();
        _conviva = null;
      }
      _conviva = newConvivaMonitor(objectify(_config.conviva));
      _conviva.setPlayer(_player);
      _conviva.init();
    };
  }

  /**
   * This class is a stub for player configurations that do not
   * support monitoring. It contains stub implementations for all methods required
   * by the monitor interface. This class implements a singleton pattern as
   * recommended by the Refactoring book.
   */
  var NullMonitor = (function(lock) {
    'use strict';
    var instance; //prevent modification of "instance" variable

    function Singleton(caller) {
      if (instance || caller !== lock) {
        throw new Error('NullMonitor is a singleton. Use NullMonitor.getInstance() instead.');
      }

      // define properties we want
      this.setPlayer = function() {};
      this.init = function() {};
      this.cleanupSession = function() {};

      instance = this;
    }

    Singleton.getInstance = function() {
      return instance || new Singleton(lock);
    };

    return Singleton;
  })({});

  /**
   * @namespace NBCUniCPC.MVPDPartners
   * @desc Constants for distinguishing MVPD Partner names/ids.
   * @example
   * var params = new NBCUniCPC.PlayerParameters();
   * params.mvpdId = NBCUniCPC.MVPDPartners.COMCAST;
   */
  NBCUniCPC.MVPDPartners = {
    /**
     * @type {string}
     * @readonly
     * @default
     */
    ARMSTRONG: 'auth_armstrongmywire_com',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    ASTOUND: 'astound',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    ATLANTICBB: 'auth_atlanticbb_net',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    ATT: 'ATT',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    BLUERIDGE: 'www_websso_mybrctv_com',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    CABLEONE: 'auth_cableone_net',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    CENTURYLINK: 'auth_centurylink_net',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    CHARTER: 'Charter_Direct',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    COMCAST: 'Comcast_SSO',

    /**
     * @type {string}
     * @readonly
     * @default
     */
    DIRECTV: 'DTV',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    DISH: 'Dish',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    GOOGLE: 'Google',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    HOTWIRE: 'hotwirecommunications_auth-gateway_net',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    MEDIACOM: 'Mediacom',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    OPTIMUM: 'Cablevision',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    SONY: 'SONY',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    SUDDENLINK: 'Suddenlink',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    SUREWEST: 'consolidated_auth-gateway_net',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    TWC: 'twc',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    VERIZON: 'Verizon',
    /**
     * @type {string}
     * @readonly
     * @default
     */
    WOW: 'WOW',
  };

  /**
   * @param {object} pdkProxy The object that holds our reference to the PDK
   * @param {EventDispatcher} dispatcher an EventDispatcher instance
   * @param {object} messenger - RPHelperEvents reference for communicating with the
   * player iframe
   * @constructor
   */
  function AbstractPDKPlayerWrapper(pdkProxy, dispatcher, messenger) {
    var _this = this;
    var controller; // pdk.controller returned from the call to bind()

    var playerState, currentSegmentType, previousSegmentType, subtitleLangCode, canSendCompletedEvent;
    var logger = new Logger('PDKPlayerWrapper');

    function debug(str) {
      logger.log(str);
    }

    function warn(str) {
      logger.warn(str);
    }

    var cachedReleaseUrl = null;
    this.currentVolume;
    var playbackReady = false; // flag for sending the first PLAYBACK_READY event

    function isAd(_clipData) {
      return _clipData && _clipData.baseClip && _clipData.baseClip.isAd;
    }

    function onAdStartEvent(e) {
      var _clipData = e.data.clip || e.data;

      if (isAd(_clipData)) {
        var evt = new NBCUniCPC.Event.AdEvent(NBCUniCPC.Event.AD_STARTED, _clipData.id);
        _this.dispatchEvent(evt);
      }
    }

    function onAdEndEvent(e) {
      var _clipData = e.data.clip || e.data;

      if (isAd(_clipData)) {
        var evt = new NBCUniCPC.Event.AdEvent(NBCUniCPC.Event.AD_COMPLETED, _clipData.id);
        _this.dispatchEvent(evt);
      }
    }

    function onFirstFrameReady(e) {
      controller.removeEventListener('OnShowControls', onFirstFrameReady);
      controller.removeEventListener('OnMediaPlaying', onFirstFrameReady);

      _this.dispatchEvent({
        type: NBCUniCPC.Event.FIRST_FRAME_READY,
        data: e,
      });
    }

    function onProgramChangeEvent(e) {
      _this.dispatchEvent(
        new NBCUniCPC.Event.ProgramChangedEvent(NBCUniCPC.Event.PROGRAM_CHANGED, {
          programId: e.data.event_id,
          title: e.data.title,
          description: e.data.description,
        }),
      );
    }

    function dispatchUserInteractionEvent(type) {
      var evt = new NBCUniCPC.Event.UserInteractionEvent(NBCUniCPC.Event.USER_INTERACTION, type);
      _this.dispatchEvent(evt);
    }

    function onMediaClick(e) {
      dispatchUserInteractionEvent(e.data.globalDataType);
    }

    function checkForUserInteraction(e) {
      if (e.type === 'OnShowFullScreen' && e.data) {
        dispatchUserInteractionEvent('fullScreenEnter');
      }
    }

    function updatePlayerState(state) {
      if (playerState !== state) {
        playerState = state;
        var evt = new NBCUniCPC.Event.VideoStateChangeEvent(NBCUniCPC.Event.STATE_CHANGE, playerState);
        _this.dispatchEvent(evt);
      }
    }

    function onCaptioningInfoEvent(e) {
      if (e.data.release && e.data.release.captions && e.data.release.captions.length) {
        if (e.data.release.captions[0].hasOwnProperty('language')) {
          subtitleLangCode = e.data.release.captions[0]['language'];
        }
      }
    }

    function handleStateChangeEvent(e) {
      switch (e.type) {
        case 'OnMediaPause':
          updatePlayerState(NBCUniCPC.VideoState.STATE_PAUSED);
          break;
        case 'OnMediaBuffer':
          updatePlayerState(NBCUniCPC.VideoState.STATE_BUFFERING);
          break;
        case 'OnMediaStart':
        case 'OnMediaPlay':
        case 'OnMediaUnpause':
          updatePlayerState(NBCUniCPC.VideoState.STATE_PLAYING);
          break;
        case 'OnMediaLoadStart':
          updatePlayerState(NBCUniCPC.VideoState.STATE_LOADING);
          break;
      }
    }

    function updateSegmentType(value) {
      previousSegmentType = currentSegmentType;
      currentSegmentType = value;
    }

    /**
     * This dispatches events related to a segment boundary only when a type change
     * is required to know that we should dispatch an event, i.e, we send a
     * <code>SegmentTypeChangedEvent</code> and events for ad breaks. We don't send
     * segment/chapter events for the video content because it is possible that two
     * video segments can play back-to-back with no ad breaks between them.
     *
     * @param {string} type A segment type, e.g., <code>NBCUniCPC.SegmentType.AD</code>
     *  or <code>NBCUniCPC.SegmentType.MASTER</code>
     */
    function dispatchSegmentTypeEventsThatRequireChange(type) {
      if (currentSegmentType !== type) {
        updateSegmentType(type);

        // process ad break end
        switch (previousSegmentType) {
          case NBCUniCPC.SegmentType.AD:
          case NBCUniCPC.SegmentType.SLATE:
            _this.dispatchEvent({
              type: NBCUniCPC.Event.AD_BREAK_COMPLETED,
              data: null,
            });
            break;
        }

        var evt = new NBCUniCPC.Event.SegmentTypeChangedEvent(NBCUniCPC.Event.SEGMENT_TYPE_CHANGED, currentSegmentType);
        _this.dispatchEvent(evt);

        // process ad break start
        switch (currentSegmentType) {
          case NBCUniCPC.SegmentType.AD:
          case NBCUniCPC.SegmentType.SLATE:
            _this.dispatchEvent({
              type: NBCUniCPC.Event.AD_BREAK_STARTED,
              data: null,
            });
            break;
        }
      }
    }

    function handleSegmentTypeChangeEvent(e) {
      var _clipData = e.data.clip || e.data;
      dispatchSegmentTypeEventsThatRequireChange(
        isAd(_clipData) ? NBCUniCPC.SegmentType.AD : NBCUniCPC.SegmentType.MASTER,
      );
    }

    function onVideoSegmentStart(e) {
      var _clipData = e.data.clip || e.data;
      if (!isAd(_clipData)) {
        _this.dispatchEvent({
          type: NBCUniCPC.Event.SEGMENT_STARTED,
          data: null,
        });
      }
    }

    function onVideoSegmentEnd(e) {
      var _clipData = e.data.clip || e.data;
      if (!isAd(_clipData)) {
        _this.dispatchEvent({
          type: NBCUniCPC.Event.SEGMENT_COMPLETED,
          data: null,
        });
      }
    }

    function onErrorEvent(e) {
      _this.dispatchEvent(
        new NBCUniCPC.Event.PlayerErrorEvent(NBCUniCPC.Event.PLAYER_ERROR, null, e.data.message, true),
      );
    }

    function onVideoSelectedEvent(e) {
      _this.dispatchEvent(
        new NBCUniCPC.Event.VideoSelectedEvent(
          NBCUniCPC.Event.RELATED_VIDEO_SELECTED,
          e.data.guid,
          e.data.permalink,
          e.data.clipId,
          e.data.clicked,
        ),
      );
    }

    this.relayEvent = function(e) {
      _this.dispatchEvent(e);
    };

    function onAdLoadStart(e) {
      var _clipData = e.data.clip || e.data;
      if (isAd(_clipData)) {
        var evt = new NBCUniCPC.Event.AdEvent(NBCUniCPC.Event.AD_LOAD_START, _clipData.id);
        _this.dispatchEvent(evt);
      }
    }

    function onAuthZFail(event) {
      var eventObj = {
        type: NBCUniCPC.Event.AUTHORIZATION_STATUS,
        data: {
          isAuthorized: false,
          authorizer: '',
          token: '',
          error_code: '',
          message: 'Authorization status has changed.',
        },
      };
      _this.dispatchEvent(eventObj);
    }

    function onAuthZSuccess(event) {
      var eventObj = {
        type: NBCUniCPC.Event.AUTHORIZATION_STATUS,
        data: {
          isAuthorized: true,
          authorizer: '',
          token: '',
          error_code: '',
          message: 'Authorization status has changed.',
        },
      };
      _this.dispatchEvent(eventObj);
    }

    function onInStreamContentIdentifer(event) {
      if (event.data.type === 'AnvatoInStreamCaptionEvent708' || event.type === 'AnvatoInStreamCaptionEvent708') {
        return;
      }
      if (event.data.type === 'AnvatoInStreamContentBeaconEvent') {
        controller.removeEventListener('InStreamMetadataEvent', onInStreamContentIdentifer);
        var programData = {
          programId: event.data.data.event_id,
          title: event.data.data.title,
          description: event.data.data.description,
        };
        var programEvent = new NBCUniCPC.Event.ProgramChangedEvent(NBCUniCPC.Event.PROGRAM_CHANGED, programData);
        _this.dispatchEvent(programEvent);
        debug('ProgramChangedEvent:' + programData.title);
      }
    }

    function onInStreamData(event) {
      if (event.data.type === 'AnvatoInStreamCaptionEvent708' || event.type === 'AnvatoInStreamCaptionEvent708') {
        return;
      }
      var eventObj = {
        type: NBCUniCPC.Event.INSTREAM_DATA,
        data: event.data,
      };
      _this.dispatchEvent(eventObj);
      if (event.data.type === 'AnvatoInStreamAdProgramBeginEvent') {
        controller.addEventListener('InStreamMetadataEvent', onInStreamContentIdentifer);
      }
    }

    function onPlayerLoaded(event) {
      var eventObj = {
        type: NBCUniCPC.Event.PLAYER_LOADED,
        data: {},
      };

      _this.dispatchEvent(eventObj);
    }

    this.onPlaybackReady = function() {
      if (!playbackReady) {
        playbackReady = true;
        var eventObj = {
          type: NBCUniCPC.Event.PLAYBACK_READY,
          data: {},
        };

        _this.dispatchEvent(eventObj);
      }
    };

    function onFirstMediaStart(evt) {
      controller.removeEventListener('OnMediaStart', onFirstMediaStart);
      _this.onPlaybackReady();
    }

    function onPlaybackStarted(event) {
      controller.removeEventListener('OnMediaPlaying', onPlaybackStarted);

      var eventObj = {
        type: NBCUniCPC.Event.PLAYBACK_STARTED,
        data: {},
      };

      _this.dispatchEvent(eventObj);
    }

    function onMuteEvent(event) {
      var eventObj = {
        type: NBCUniCPC.Event.MUTE_EVENT,
        data: {
          muted: event.data,
        },
      };
      _this.dispatchEvent(eventObj);
    }

    function onGetSubtitleLanguage(event) {
      var evt = new NBCUniCPC.Event.CaptionStateEvent(
        NBCUniCPC.Event.CAPTION_STATE_EVENT,
        event.data.langCode !== 'none',
        event.data.langCode,
      );
      _this.dispatchEvent(evt);
    }

    function stringToFontEdge(str) {
      switch (String(str).toLowerCase()) {
        case NBCUniCPC.FontEdge.DEPRESSED.toLowerCase():
          return NBCUniCPC.FontEdge.DEPRESSED;
        case NBCUniCPC.FontEdge.DROP_SHADOW.toLowerCase():
          return NBCUniCPC.FontEdge.DROP_SHADOW;
        case NBCUniCPC.FontEdge.RAISED.toLowerCase():
          return NBCUniCPC.FontEdge.RAISED;
        case NBCUniCPC.FontEdge.UNIFORM.toLowerCase():
          return NBCUniCPC.FontEdge.UNIFORM;
        default:
          return NBCUniCPC.FontEdge.NONE;
      }
    }

    function fontEdgeToString(val) {
      switch (val) {
        case NBCUniCPC.FontEdge.DEPRESSED:
          return NBCUniCPC.FontEdge.DEPRESSED.toLowerCase();
        case NBCUniCPC.FontEdge.DROP_SHADOW:
          return NBCUniCPC.FontEdge.DROP_SHADOW.toLowerCase();
        case NBCUniCPC.FontEdge.RAISED:
          return NBCUniCPC.FontEdge.RAISED.toLowerCase();
        case NBCUniCPC.FontEdge.UNIFORM:
          return NBCUniCPC.FontEdge.UNIFORM.toLowerCase();
        default:
          return NBCUniCPC.FontEdge.NONE.toLowerCase();
      }
    }

    function onGetSubtitleStyle(event) {
      var style = new NBCUniCPC.SubtitleStyle();
      style.backgroundColor = event.data.backgroundColor;
      style.backgroundOpacity = event.data.backgroundOpacity;
      style.bold = event.data.bold;
      style.fontColor = event.data.fontColor;
      style.fontEdge = stringToFontEdge(event.data.fontEdge);
      style.fontEdgeColor = event.data.fontEdgeColor;
      style.fontFamily = event.data.fontFamily;
      style.fontScale = event.data.fontSize;
      style.opacity = event.data.opacity;

      _this.dispatchEvent(new NBCUniCPC.Event.SubtitleEvent(NBCUniCPC.Event.SUBTITLE_STYLE, style));
    }

    function onBlackoutStatus(evt) {
      var blackoutEvent = new NBCUniCPC.Event.BlackoutEvent(
        NBCUniCPC.Event.BLACKOUT_STATUS,
        evt.data.entitled,
        false,
        evt.data,
      );
      _this.dispatchEvent(blackoutEvent);
    }

    function onReleaseEnd(evt) {
      if (canSendCompletedEvent) {
        canSendCompletedEvent = false;
        _this.dispatchEvent({
          type: NBCUniCPC.Event.VIDEO_PLAYBACK_COMPLETED,
        });
      }
    }

    function prepForPlaybackCompleteEvent(evt) {
      canSendCompletedEvent = true;
    }

    this.addCustomListeners = function(_controller) {
      throw new Error('addCustomListeners is an abstract method that must be defined by a subclass');
    };

    function onPlayheadUpdate(evt) {
      /*
      PDK 5 event object during SSAI ad:
      {
        "data": {
          "currentTime": 26483.5431,
          "duration": 28906.417999999998,
          "percentComplete": 91.61821122215835
        },
        "globalDataType": "com.theplatform.pdk.events::PdkEvent",
        "originator": {
          "controlId": "player",
          "globalDataType": "com.theplatform.pdk.communication::ScopeInfo",
          "isAny": false,
          "isEmpty": false,
          "isGlobal": true,
          "scopeIds": []
        },
        "type": "OnMediaPlaying"
      }
  
      PDK 5 event object during content playback:
      {
        "data": {
          "currentTime": 4972,
          "currentTimeAggregate": 4972,
          "duration": 134008,
          "durationAggregate": 134008,
          "globalDataType": "com.theplatform.pdk.data::TimeObject",
          "isAggregate": false,
          "isLive": false,
          "mediaTime": 4972,
          "percentComplete": 3.710226255148946,
          "percentCompleteAggregate": 3.710226255148946
        },
        "globalDataType": "com.theplatform.pdk.events::PdkEvent",
        "originator": {
          "controlId": "player",
          "globalDataType": "com.theplatform.pdk.communication::ScopeInfo",
          "isAny": false,
          "isEmpty": false,
          "isGlobal": true,
          "scopeIds": []
        },
        "type": "OnMediaPlaying"
      }
  
      PDK 6 ad:
      {
        "data": {
          "chapters": [],
          "count": 1,
          "currentTime": 8191.495,
          "currentTimeAggregate": 8191.495,
          "duration": 30151,
          "durationAggregate": 30151,
          "endTimeAbsolute": null,
          "globalDataType": "com.theplatform.pdk.data::TimeInfo",
          "index": 1,
          "isAbsolute": false,
          "isAggregate": false,
          "isDvr": false,
          "isLive": false,
          "isMainTimeline": false,
          "percentComplete": 27.168236542734903,
          "percentCompleteAggregate": 27.168236542734903,
          "sourceFileTime": 8191.495,
          "startTimeAbsolute": null,
          "timeUntilSkippable": 0,
          "windowDuration": null
        },
        "globalDataType": "com.theplatform.pdk.data::PdkEvent",
        "scope": "player",
        "timestamp": 14241.200000047684,
        "type": "OnMediaPlaying"
      }
  
      PDK 6 content:
      {
        "data": {
          "chapters": [],
          "count": 1,
          "currentTime": 1780,
          "currentTimeAggregate": 1780,
          "duration": 134211,
          "durationAggregate": 134211,
          "endTimeAbsolute": null,
          "globalDataType": "com.theplatform.pdk.data::TimeInfo",
          "index": 1,
          "isAbsolute": false,
          "isAggregate": false,
          "isDvr": false,
          "isLive": false,
          "isMainTimeline": true,
          "percentComplete": 1.3262698288515844,
          "percentCompleteAggregate": 1.3262698288515844,
          "sourceFileTime": 1780,
          "startTimeAbsolute": null,
          "timeUntilSkippable": 0,
          "windowDuration": null
        },
        "globalDataType": "com.theplatform.pdk.data::PdkEvent",
        "scope": "player",
        "timestamp": 1989117.0000000857,
        "type": "OnMediaPlaying"
      }
      PDK 5: @see https://docs.theplatform.com/help/player-timeobject
      PDK 6: @see https://docs.theplatform.com/help/timeinfo
      */
      var playheadUpdateEvent = new NBCUniCPC.Event.PlayheadUpdateEvent(
        NBCUniCPC.Event.PLAYHEAD_UPDATE,
        parseInt(evt.data.currentTime),
        parseInt(evt.data.currentTimeAggregate || evt.data.currentTime),
        evt.data.isDvr,
        evt.data.isLive,
        evt.data.hasOwnProperty('isMainTimeline')
          ? evt.data.isMainTimeline
          : evt.data.hasOwnProperty('currentTimeAggregate'),
      );
      _this.dispatchEvent(playheadUpdateEvent);
    }

    this.seekToMilliseconds = function(ms) {
      controller.seekToPosition(ms);
    };

    // https://docs.theplatform.com/help/player-pdkevent-reference
    function addPdkEventListeners() {
      controller.addEventListener('OnMediaStart', prepForPlaybackCompleteEvent);
      controller.addEventListener('OnReleaseEnd', onReleaseEnd);
      controller.addEventListener('OnMediaStart', onFirstMediaStart);

      controller.addEventListener('OnMediaClick', onMediaClick);
      controller.addEventListener('NBCU_BLACKOUT_STATUS', onBlackoutStatus);
      controller.addEventListener('OnPlayerLoaded', onPlayerLoaded);
      controller.addEventListener('OnMediaPlaying', onPlayheadUpdate);
      controller.addEventListener('OnMediaPlaying', onPlaybackStarted);
      controller.addEventListener('OnMediaLoadStart', onAdLoadStart);
      controller.addEventListener('RelatedVideoSelected', onVideoSelectedEvent);
      controller.addEventListener('OnMediaError', onErrorEvent);
      controller.addEventListener('OnVersionError', onErrorEvent);

      // I think the order of the next few lines is important here.
      // We want ad break start/end events to happen before individual ad start/end events
      controller.addEventListener('OnMediaEnd', onVideoSegmentEnd); // should come before a segment type change event
      controller.addEventListener('OnMediaEnd', onAdEndEvent); // should come before a segment type change event
      controller.addEventListener('OnMediaStart', handleSegmentTypeChangeEvent);
      controller.addEventListener('OnMediaStart', onVideoSegmentStart); // should come after a segment type change event
      controller.addEventListener('OnMediaStart', onAdStartEvent); // should come after a segment type change event

      controller.addEventListener('AnvatoInStreamContentBeaconEvent', onProgramChangeEvent);
      controller.addEventListener('OnShowControls', onFirstFrameReady);
      controller.addEventListener('OnMediaPlaying', onFirstFrameReady);
      controller.addEventListener('OnShowFullScreen', checkForUserInteraction);
      controller.addEventListener('OnLoadReleaseUrl', onCaptioningInfoEvent);
      controller.addEventListener('OnReleaseStart', onCaptioningInfoEvent);
      controller.addEventListener('OnMediaBuffer', handleStateChangeEvent);
      controller.addEventListener('OnMediaStart', handleStateChangeEvent);
      controller.addEventListener('OnMediaPlay', handleStateChangeEvent);
      controller.addEventListener('OnMediaLoadStart', handleStateChangeEvent);
      controller.addEventListener('OnMediaPause', handleStateChangeEvent);
      controller.addEventListener('OnMediaUnpause', handleStateChangeEvent);
      controller.addEventListener('OnMute', onMuteEvent);
      controller.addEventListener(NBCUniCPC.Event.COMPANION_AD, _this.relayEvent);
      controller.addEventListener('OnSetToken', onAuthZSuccess);
      controller.addEventListener('auth_token_failed', onAuthZFail);
      controller.addEventListener('auth_success', onAuthZSuccess);
      controller.addEventListener('InStreamMetadataEvent', onInStreamData);
      controller.addEventListener('InStreamMetadataEvent', onInStreamContentIdentifer);
      controller.addEventListener('OnGetSubtitleStyle', onGetSubtitleStyle);
      controller.addEventListener('OnGetSubtitleLanguage', onGetSubtitleLanguage);

      _this.addCustomListeners(controller);
    }

    function onPostMessage(message) {
      var eventObj = {};
      var type = message && message.data && message.data.hasOwnProperty('type') ? message.data.type : '';
      switch (type) {
        case RPEventConstants.END_CARD_PLAY_NEXT_ITEM_EVENT:
          eventObj.type = NBCUniCPC.Event.END_CARD_PLAY_NEXT_ITEM_EVENT;
          _this.dispatchEvent(eventObj);
          break;
        case RPEventConstants.END_CARD_COUNTDOWN_TIMER_COMPLETE_EVENT:
          eventObj.type = NBCUniCPC.Event.END_CARD_COUNTDOWN_TIMER_COMPLETE_EVENT;
          _this.dispatchEvent(eventObj);
          break;
        case RPEventConstants.END_CARD_REPLAY_CLIP_EVENT:
          eventObj.type = NBCUniCPC.Event.END_CARD_REPLAY_CLIP_EVENT;
          _this.dispatchEvent(eventObj);
          break;
        default:
          warn('Unknown post message received ' + JSON.stringify(message));
      }
    }

    /**
     * This will set the internal player of the pdk player we integrate with
     * @param iFrameId concrete player of pdk player
     */
    this.bind = function(iFrameId) {
      controller = pdkProxy.getPDK().bind(iFrameId);

      addPdkEventListeners();
      messenger.subscribeToEvents(onPostMessage);

      if (cachedReleaseUrl != null) {
        _this.setReleaseURL(cachedReleaseUrl);
        cachedReleaseUrl = null;
      }
    };

    this.setReleaseURL = function(value) {
      debug('setReleaseURL: ' + value);
      if (typeof controller !== 'undefined') {
        controller.setReleaseURL(value);
      } else {
        cachedReleaseUrl = value;
      }
    };

    /**
     * A pass-through for controller.setToken
     * @param {string} token - the encoded AuthN token supplied by page-level Adobe Pass
     * @param {string} type - the type of token, e.g. 'authToken'
     */
    this.setToken = function(token, type) {
      throw new Error('setToken is an abstract method that must be implemented by a subclass');
    };

    this.pause = function(bool) {
      debug('pause');
      //handle the API call to play() in the PDK way.
      if (!bool) {
        controller.clickPlayButton();
      }
      controller.pause(bool);
    };

    this.play = function() {
      _this.pause(false);
    };

    this.unload = function() {
      debug('Unload.');
      if (controller) {
        controller.clearCurrentRelease();
      }
    };

    this.mute = function() {
      controller.mute(true);
    };

    this.unmute = function() {
      controller.mute(false);
    };

    this.addPlayerCard = function(deckId, cardId, config) {
      controller.addPlayerCard(deckId, cardId, null, null, config, null, 1);
    };

    this.authenticate = function() {
      warn('authenticate is not implemented.');
    };

    this.setSelectedProvider = function(provider) {
      throw new Error('setSelectedProvider is an abstract method that must be implemented by a subclass');
    };

    function isSubtitleLanguageCodeKnown() {
      return typeof subtitleLangCode !== 'undefined' && subtitleLangCode !== 'none';
    }

    this.setCaptionsEnabled = function(bool) {
      /*
      if (subtitleLangCode && bool) {
        controller.setSubtitleLanguage(subtitleLangCode);
      } else {
        controller.setSubtitleLanguage('none');
      }
      controller.setShowSubtitles(bool);
      /**/

      /**/
      if (bool) {
        controller.setSubtitleLanguage(isSubtitleLanguageCodeKnown() ? subtitleLangCode : 'en');
      } else {
        controller.setSubtitleLanguage('none');
      }
      controller.setShowSubtitles(bool);
      /**/
      debug('enableCaptioning. Called with value: ' + bool);
    };

    this.getCaptionsEnabled = function() {
      controller.getSubtitleLanguage();
    };

    this.showControlBar = function() {
      warn('showControlBar is not implemented.');
    };

    this.hideControlBar = function() {
      warn('hideControlBar is not implemented.');
    };

    this.getVolume = function() {
      var eventObj = {
        type: NBCUniCPC.Event.VOLUME_EVENT,
        data: {
          level: _this.currentVolume,
        },
      };

      _this.dispatchEvent(eventObj);
    };

    this.setVolume = function(level) {
      throw new Error('setVolume is an abstract method that must be implemented by a subclass');
    };

    this.goLive = function() {
      controller.seekToPercentage(100);
    };

    /**
     * Pass through to PDK [setSubtitleStyle]{@link http://help.theplatform.com/display/pdk/SubtitleStyle}
     * @param subtitleStyle instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.setSubtitleStyle = function(subtitleStyle) {
      subtitleStyle.globalDataType = 'com.theplatform.pdk.data::SubtitleStyle';
      if (typeof subtitleStyle.fontSize === 'undefined') {
        subtitleStyle.fontSize = subtitleStyle.fontScale;
      }
      subtitleStyle.fontEdge = fontEdgeToString(subtitleStyle.fontEdge);

      controller.setSubtitleStyle(JSON.parse(JSON.stringify(subtitleStyle)));
    };

    /**
     * Pass through to PDK [getSubtitleStyle]{@link http://help.theplatform.com/display/pdk/SubtitleStyle}
     * @param subtitleStyle instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.getSubtitleStyle = function(subtitleStyle) {
      controller.getSubtitleStyle();
    };

    this.addEventListener = function(type, callback) {
      dispatcher.addEventListener(type, callback);
    };

    this.removeEventListener = function(type, callback) {
      dispatcher.removeEventListener(type, callback);
    };

    this.dispatchEvent = function(e) {
      dispatcher.dispatchEvent(e);
    };
  }

  /**
   * @namespace
   * @desc The "brand" or "channel" that owns the video content. Some channels
   * have associated staging or development accounts that contain video content or
   * backend configurations suitable for testing.
   * @example
   * cpcplayer = NBCUniCPC.controller.loadEvent("videoplayer", NBCUniCPC.Account.NBC, contentInitObj, parameters);
   */
  NBCUniCPC.Account = {};
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.LOCAL = 'LOCAL';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBC = 'NBC';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBC_STAGE = 'NBC_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBC_DEV = 'NBC_DEV';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.GOLF = 'GOLF';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SPORTS = 'SPORTS';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.BRAVO = 'BRAVO';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CNBC = 'CNBC';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_BAY_AREA = 'csn_bay_area';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_CALIFORNIA = 'csn_california';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_CHICAGO = 'csn_chicago';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_MID_ATLANTIC = 'csn_mid-atlantic';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_NEW_ENGLAND = 'csn_new_england';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_NORTHWEST = 'csn_northwest';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CSN_PHILADELPHIA = 'csn_philadelphia';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.E = 'E';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.ESQUIRE = 'ESQUIRE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MUN2 = 'MUN2';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MSNBC = 'MSNBC';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBCUNIVERSO = 'NBCUNIVERSO';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.OXYGEN = 'OXYGEN';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SPROUT = 'SPROUT';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SYFY = 'SYFY';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.TCN_PHILADELPHIA = 'tcn_philadelphia';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.TELEMUNDO = 'TELEMUNDO';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.TELEMUNDO_LOCAL = 'TELEMUNDO_LOCAL';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.USA = 'USA';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MVPD = 'MVPD';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MVPDCOMPANION = 'MVPDCOMPANION';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.GOLF_STAGE = 'GOLF_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBCUNIVERSO_STAGE = 'NBCUNIVERSO_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SPORTS_STAGE = 'SPORTS_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.BRAVO_STAGE = 'BRAVO_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CNBC_STAGE = 'CNBC_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.E_STAGE = 'E_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.ESQUIRE_STAGE = 'ESQUIRE_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MUN2_STAGE = 'MUN2_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MSNBC_STAGE = 'MSNBC_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.ONEAPP = 'ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.ONEAPP_STAGE = 'ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.USA_ONEAPP = 'USA_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SYFY_ONEAPP = 'SYFY_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.BRAVO_ONEAPP = 'BRAVO_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CNBC_ONEAPP = 'CNBC_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.E_ONEAPP = 'E_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MSNBC_ONEAPP = 'MSNBC_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBCUNIVERSO_ONEAPP = 'NBCUNIVERSO_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.OXYGEN_ONEAPP = 'OXYGEN_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.UNIVERSALKIDS_ONEAPP = 'UNIVERSALKIDS_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.TELEMUNDO_ONEAPP = 'TELEMUNDO_ONEAPP';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.USA_ONEAPP_STAGE = 'USA_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SYFY_ONEAPP_STAGE = 'SYFY_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.BRAVO_ONEAPP_STAGE = 'BRAVO_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.CNBC_ONEAPP_STAGE = 'CNBC_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.E_ONEAPP_STAGE = 'E_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MSNBC_ONEAPP_STAGE = 'MSNBC_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.NBCUNIVERSO_ONEAPP_STAGE = 'NBCUNIVERSO_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.OXYGEN_ONEAPP_STAGE = 'OXYGEN_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.UNIVERSALKIDS_ONEAPP_STAGE = 'UNIVERSALKIDS_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.TELEMUNDO_ONEAPP_STAGE = 'TELEMUNDO_ONEAPP_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.OXYGEN_STAGE = 'OXYGEN_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SPROUT_STAGE = 'SPROUT_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.SYFY_STAGE = 'SYFY_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.USA_STAGE = 'USA_STAGE';
  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.MVPD_STAGE = 'MVPD_STAGE';

  /**
   *
   * @type {string}
   * @default
   * @readonly
   */
  NBCUniCPC.Account.UNIHD = 'UNIHD';

  /**
   *
   * @constructor
   *
   * @param {string} _instanceName The pInstance value for this player in the
   * Anvato configuration.
   * @param {EventDispatcher} dispatcher an EventDispatcher instance
   *
   * @see https://dev.anvato.net/api/playerv3#api-methods-and-events
   */
  function AnvatoWrapper(_instanceName, dispatcher) {
    var _this = this;
    var instanceName = _instanceName;
    var player, ready, currentSegmentType, previousSegmentType;
    var logger = new Logger('AnvatoWrapper');
    _this.subtitleStyle = new NBCUniCPC.SubtitleStyle();

    function hexer(i) {
      var h = i.toString(16);
      if (h.length === 1) {
        h = '0' + h;
      }
      return h;
    }

    function convertHexToInt(hex) {
      var str = hex.replace(/^#/, '');
      str = '0x' + str;
      return parseInt(str);
    }

    function convertIntToHex(c) {
      var foo = {
        r: (c & 0xff0000) >> 16,
        g: (c & 0x00ff00) >> 8,
        b: c & 0x0000ff,
      };
      var rr = hexer(foo.r);
      var gg = hexer(foo.g);
      var bb = hexer(foo.b);
      var str = '#' + rr + gg + bb;
      return str.toUpperCase();
    }

    /**
     *
     * @param _player
     */
    this.setPlayerInstance = function(_player) {
      player = _player;
    };

    /**
     *
     * @param bool
     */
    this.pause = function(bool) {
      if (player && typeof player.pause === 'function' && typeof player.play === 'function') {
        if (bool) {
          player.pause();
        } else {
          player.play();
        }
      }
    };

    this.play = function() {
      _this.pause(false);
    };

    /**
     *
     * @param type
     * @param callback
     */
    this.addEventListener = function(type, callback) {
      dispatcher.addEventListener(type, callback);
    };
    /**
     *
     * @param type
     * @param callback
     */
    this.removeEventListener = function(type, callback) {
      dispatcher.removeEventListener(type, callback);
    };
    /**
     *
     * @param e
     */
    this.dispatchEvent = function(e) {
      dispatcher.dispatchEvent(e);
    };
    /**
     *
     * @param value
     */
    this.setReleaseURL = function(value) {
      logger.warn('setReleaseURL  is not implemented. Called with value: ' + value);
    };

    /**
     * A pass-through for $pdk.controller.setToken
     * @param {string} token - the AuthZ token supplied by page-level Adobe Pass
     */
    this.setToken = function(token) {
      logger.warn('setToken  is not implemented. Called with token: ' + token);
    };
    /**
     *
     */
    this.authenticate = function() {
      player.authenticate();
    };
    /**
     *
     */
    this.mute = function() {
      player.mute();
    };
    /**
     *
     */
    this.unmute = function() {
      player.unmute();
    };
    /**
     *
     */
    this.addPlayerCard = function(deckId, cardId, config) {
      logger.warn('addPlayerCard  is not available for this player.');
    };
    /**
     *
     */
    this.unload = function() {
      if (player) {
        _this.dispatchEvent({
          type: NBCUniCPC.Event.PLAYER_UNLOADING,
          data: null,
        });
        player.unload();
      }
    };
    /**
     *
     */
    this.hideControlBar = function() {
      player.hideControlBar();
    };
    /**
     *
     */
    this.showControlBar = function() {
      player.showControlBar();
    };

    /**
     * internal function should be redefined to return false for
     * auth-kill-switch-enabled players; otherwise Anvato throws an error after
     * logout / login.
     * @see {AuthKillSwitchStrategy}
     * @returns {boolean}
     */
    this.canSetSelectedProvider = function() {
      return player && player.hasOwnProperty('setSelectedProvider') && 'function' === typeof player.setSelectedProvider;
    };

    /**
     * internal function available to players with page-level auth for metrics
     * @see https://theplatform.jira.com/browse/NBCUTP-6322
     * @param {string} mvpd - the user's selected MVPD id
     * @returns nothing
     */
    this.updateMvpd = function(mvpd) {
      player.updateMvpd(mvpd);
    };
    /**
     *
     * @param provider
     */
    this.setSelectedProvider = function(provider) {
      if (_this.canSetSelectedProvider()) {
        player.setSelectedProvider(provider);
      }
      _this.dispatchEvent({
        type: PlayerWrapperEvent.SET_SELECTED_PROVIDER_INVOKED_EVENT,
        data: {
          provider_id: provider,
        },
      });
    };
    /**
     *
     */
    this.getCaptionsEnabled = function() {
      player.getCaptionState(function(event) {
        var e = new NBCUniCPC.Event.CaptionStateEvent(NBCUniCPC.Event.CAPTION_STATE_EVENT, event);
        _this.dispatchEvent(e);
      });
    };
    /**
     *
     * @param bool
     */
    this.setCaptionsEnabled = function(bool) {
      if (bool) {
        player.showCaption();
      } else {
        player.hideCaption();
      }
    };
    /**
     *
     */
    this.getVolume = function() {
      player.getVolume(function(data) {
        var e = new NBCUniCPC.Event.VolumeEvent(NBCUniCPC.Event.VOLUME_EVENT, data);
        _this.dispatchEvent(e);
      });
    };
    /**
     *
     * @param level
     */
    this.setVolume = function(level) {
      player.setVolume(level);
    };
    /**
     *
     */
    this.goLive = function() {
      player.goLive();
    };

    this.seekToMilliseconds = function(ms) {
      player.seekTo(ms / 1000);
    };

    /**
     * Takes a style object and translates it to Anvato calls.
     * @param {SubtitleStyle} subtitleStyle - instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.setSubtitleStyle = function(subtitleStyle) {
      //text stuff
      player.setCCFontFamily(subtitleStyle.fontFamily);
      player.setCCFontScale(subtitleStyle.fontScale);
      player.setCCBold(subtitleStyle.bold);

      //opacity stuff
      player.setCCBackgroundOpacity(subtitleStyle.backgroundOpacity);
      player.setCCTextOpacity(subtitleStyle.opacity);
      //hide the highlight, we do not use it
      player.setCCHighlightOpacity(0);

      //font edge stuff
      var edge;
      switch (subtitleStyle.fontEdge.toLowerCase()) {
        case NBCUniCPC.FontEdge.DROP_SHADOW.toLowerCase():
          edge = 1;
          break;
        case NBCUniCPC.FontEdge.RAISED.toLowerCase():
          edge = 2;
          break;
        case NBCUniCPC.FontEdge.DEPRESSED.toLowerCase():
          edge = 3;
          break;
        case NBCUniCPC.FontEdge.UNIFORM.toLowerCase():
          edge = 4;
          break;
        default:
          edge = 0;
      }
      player.setCCEdgeType(edge);

      if (subtitleStyle.fontEdgeColor.length === 7) {
        var ec = convertHexToInt(subtitleStyle.fontEdgeColor);
        player.setCCEdgeColor(ec);
      }

      if (subtitleStyle.fontColor.length === 7) {
        var tc = convertHexToInt(subtitleStyle.fontColor);
        player.setCCTextColor(tc);
      }
      if (subtitleStyle.backgroundColor.length === 7) {
        var bc = convertHexToInt(subtitleStyle.backgroundColor);
        player.setCCBackgroundColor(bc);
      }
    };

    /**
     * Takes a style object and translates it to Anvato calls.
     * @param {SubtitleStyle} subtitleStyle - instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.getSubtitleStyle = function() {
      /*
      not implelented:
       getCCHighlightColor
       getCCHighlightOpacity
       getCCCapitalize
       getCCScaleInFullScreen
       getCCEdgeOpacity
       */
      player.getCCBackgroundColor(function(value) {
        var bgColor = value;
        _this.subtitleStyle.backgroundColor = convertIntToHex(bgColor);
      });
      player.getCCBackgroundOpacity(function(value) {
        _this.subtitleStyle.backgroundOpacity = value;
      });
      player.getCCBold(function(value) {
        _this.subtitleStyle.bold = value;
      });
      player.getCCEdgeColor(function(value) {
        var eColor = value;
        _this.subtitleStyle.fontEdgeColor = convertIntToHex(eColor);
      });
      player.getCCEdgeType(function(value) {
        var edge = value;
        switch (edge) {
          case 1:
            _this.subtitleStyle.fontEdge = NBCUniCPC.FontEdge.DROP_SHADOW;
            break;
          case 2:
            _this.subtitleStyle.fontEdge = NBCUniCPC.FontEdge.RAISED;
            break;
          case 3:
            _this.subtitleStyle.fontEdge = NBCUniCPC.FontEdge.DEPRESSED;
            break;
          case 4:
            _this.subtitleStyle.fontEdge = NBCUniCPC.FontEdge.UNIFORM;
            break;
          default:
            _this.subtitleStyle.fontEdge = NBCUniCPC.FontEdge.NONE;
            break;
        }
      });
      player.getCCFontFamily(function(value) {
        _this.subtitleStyle.fontFamily = value;
      });
      player.getCCFontScale(function(value) {
        _this.subtitleStyle.fontScale = value;
      });
      player.getCCFontSize(function(value) {
        _this.subtitleStyle.fontSize = value;
      });
      player.getCCTextColor(function(value) {
        var fColor = value;
        _this.subtitleStyle.fontColor = convertIntToHex(fColor);
      });
      player.getCCTextOpacity(function(value) {
        _this.subtitleStyle.opacity = value;
      });

      //broadcast our newly formed subtitle object
      var subtitleEvent = new NBCUniCPC.Event.SubtitleEvent(NBCUniCPC.Event.SUBTITLE_STYLE, _this.subtitleStyle);
      setTimeout(function() {
        _this.dispatchEvent(subtitleEvent);
      }, 1000);
    };

    function relayEvent(e) {
      _this.dispatchEvent({
        type: e.name,
        data: e,
      });
    }

    function updateSegmentType(value) {
      previousSegmentType = currentSegmentType;
      currentSegmentType = value;
    }

    function processSegmentTypeChangedEvent(args) {
      updateSegmentType(args[0]);

      // process segment end / ad break end for previous segment
      switch (previousSegmentType) {
        case NBCUniCPC.SegmentType.AD:
        case NBCUniCPC.SegmentType.SLATE:
          _this.dispatchEvent({
            type: NBCUniCPC.Event.AD_BREAK_COMPLETED,
            data: null,
          });
          break;
        case NBCUniCPC.SegmentType.MASTER:
          _this.dispatchEvent({
            type: NBCUniCPC.Event.SEGMENT_COMPLETED,
            data: null,
          });
          break;
      }

      var evt = new NBCUniCPC.Event.SegmentTypeChangedEvent(NBCUniCPC.Event.SEGMENT_TYPE_CHANGED, currentSegmentType);
      _this.dispatchEvent(evt);

      // process segment start / ad break start for current segment
      switch (currentSegmentType) {
        case NBCUniCPC.SegmentType.AD:
        case NBCUniCPC.SegmentType.SLATE:
          _this.dispatchEvent({
            type: NBCUniCPC.Event.AD_BREAK_STARTED,
            data: null,
          });
          break;
        case NBCUniCPC.SegmentType.MASTER:
          _this.dispatchEvent({
            type: NBCUniCPC.Event.SEGMENT_STARTED,
            data: null,
          });
          break;
      }
    }

    function processPlayerErrorEvent(args) {
      var evt = new NBCUniCPC.Event.PlayerErrorEvent(NBCUniCPC.Event.PLAYER_ERROR, args[0], args[1], args[2]);
      _this.dispatchEvent(evt);
    }

    function dispatchCallToActionEventMaybe(args) {
      if (args.length > 3) {
        var obj = args[3];
        if (obj.hasOwnProperty('custom_metadata_map')) {
          var metadata = obj.custom_metadata_map;
          if (metadata.hasOwnProperty('display_c2a')) {
            _this.dispatchEvent(
              new NBCUniCPC.Event.CallToActionEvent(NBCUniCPC.Event.CALL_TO_ACTION, metadata.display_c2a),
            );
          }
        }
      }
    }

    function processProgramChangedEvent(args) {
      var data = {
        programId: args[0],
        title: args[2].title,
        description: args[2].description,
      };
      var evt = new NBCUniCPC.Event.ProgramChangedEvent(NBCUniCPC.Event.PROGRAM_CHANGED, data);
      _this.dispatchEvent(evt);

      dispatchCallToActionEventMaybe(args);
    }

    function processStateChangeEvent(args) {
      var videoState;
      switch (args[0]) {
        case 'videoLoading':
        case 'playerReady':
          videoState = NBCUniCPC.VideoState.STATE_LOADING;
          break;
        case 'videoPlay':
        case 'playingVideoContent':
          videoState = NBCUniCPC.VideoState.STATE_PLAYING;
          break;
        case 'videoPause':
        case 'pausedVideoContent':
          videoState = NBCUniCPC.VideoState.STATE_PAUSED;
          break;
        case 'videoBuffer':
        case 'bufferingVideoContent':
          videoState = NBCUniCPC.VideoState.STATE_BUFFERING;
          break;
        default:
          videoState = args[0];
      }

      var evt = new NBCUniCPC.Event.VideoStateChangeEvent(NBCUniCPC.Event.STATE_CHANGE, videoState);
      _this.dispatchEvent(evt);
    }

    function processUserInteractionEvent(args) {
      var evt = new NBCUniCPC.Event.UserInteractionEvent(NBCUniCPC.Event.USER_INTERACTION, args[0]);
      _this.dispatchEvent(evt);
    }

    function processAdStartedEvent(args) {
      var evt = new NBCUniCPC.Event.AdEvent(NBCUniCPC.Event.AD_LOAD_START, args[0]);
      _this.dispatchEvent(evt);

      evt = new NBCUniCPC.Event.AdEvent(NBCUniCPC.Event.AD_STARTED, args[0]);
      _this.dispatchEvent(evt);
    }

    function processAdCompletedEvent(args) {
      var evt = new NBCUniCPC.Event.AdEvent(NBCUniCPC.Event.AD_COMPLETED, args[0]);
      _this.dispatchEvent(evt);
    }

    function processCompanion(args) {
      //Anvato returns an array, translate this into a  PDK-like signature in CompanionAdEvent
      var _payloadType = args[0],
        //_creativeType = args[1], // commented out, so jshint will pass
        _width = args[2],
        _height = args[3],
        _payload = args[4],
        _data = decodeURIComponent(_payload.data),
        //_creativeView = _payload.creativeView, // commented out, so jshint will pass
        _clickTarget = _payload.clickTarget;
      // Process the companion data based on the provided information

      var holderId = 'ad_' + _width + 'x' + _height + '_1';

      var message = '';
      if (_payloadType === 'static') {
        message =
          "<a href='" +
          _clickTarget +
          "' target='_blank'><img src='" +
          _data +
          "' width='" +
          _width +
          "' height='" +
          _height +
          "'></a>";
      } else {
        logger.warn('NEEDS PAYLOAD TYPE: ' + _payloadType);
      }

      var evt = new NBCUniCPC.Event.CompanionAdEvent(
        NBCUniCPC.Event.COMPANION_AD,
        message,
        holderId,
        Number(new Date().valueOf()),
      );
      _this.dispatchEvent(evt);
    }

    function onPlayingStart(e) {
      _this.dispatchEvent({
        type: NBCUniCPC.Event.PLAYBACK_STARTED,
        data: null,
      });
    }

    function onCompanionAvailable(e) {
      if (e.name === 'COMPANION_AVAILABLE' && e.args && e.args.length > 4) {
        processCompanion(e.args);
      } else {
        relayEvent(e);
      }
    }

    function onPreviewStatus(e) {
      if (e.name === 'PREVIEW_STATUS' && e.args && e.args.length) {
        var eventObj = {
          type: NBCUniCPC.Event.PREVIEW_STATUS,
          data: {
            preview_state: e.args[0],
            preview_id: e.args[1],
            expiration_time: e.args[2],
            message: 'Remaining time for the preview has changed.',
          },
        };
        _this.dispatchEvent(eventObj);
      } else {
        relayEvent(e);
      }
    }

    function onAuthenticationStatus(e) {
      if (e.name === 'AUTHENTICATION_STATUS' && e.args && e.args.length) {
        var eventObj = {
          type: NBCUniCPC.Event.AUTHENTICATION_STATUS,
          data: {
            isAuthenticated: e.args[0],
            authenticator: e.args[1],
            message: 'Authentication status has changed.',
          },
        };
        _this.dispatchEvent(eventObj);
      } else {
        relayEvent(e);
      }
    }

    function onAuthorizationStatus(e) {
      if (e.name === 'AUTHORIZATION_STATUS' && e.args && e.args.length) {
        var eventObj = {
          type: NBCUniCPC.Event.AUTHORIZATION_STATUS,
          data: {
            isAuthorized: e.args[0],
            authorizer: e.args[1],
            token: e.args[2],
            error_code: e.args[3],
            message: 'Authorization status has changed.',
          },
        };
        _this.dispatchEvent(eventObj);
      } else {
        relayEvent(e);
      }
    }

    function onProviderSelected(e) {
      if (e.name === 'PROVIDER_SELECTED' && e.args && e.args.length) {
        var eventObj = {
          type: NBCUniCPC.Event.PROVIDER_SELECTED,
          data: {
            provider_id: e.args[0],
            message: 'User selected a provider/previously selected provider has been set.',
          },
        };
        _this.dispatchEvent(eventObj);
      } else {
        relayEvent(e);
      }
    }

    function onPickerRequested(e) {
      var eventObj = {
        type: NBCUniCPC.Event.PICKER_REQUESTED,
        data: {
          message: 'MVPD picker has been requested.',
        },
      };
      _this.dispatchEvent(eventObj);
    }

    function onAdStarted(e) {
      processAdStartedEvent(e.args);
    }

    function onAdCompleted(e) {
      processAdCompletedEvent(e.args);
    }

    function onFirstFrameReady(e) {
      _this.dispatchEvent({
        type: NBCUniCPC.Event.FIRST_FRAME_READY,
        data: null,
      });
    }

    function onUserInteraction(e) {
      processUserInteractionEvent(e.args);
    }

    function onProviderIframeInjected(e) {
      _this.dispatchEvent({
        type: NBCUniCPC.Event.PROVIDER_IFRAME_INJECTED,
        data: null,
      });
    }

    function onPreviewExpired(e) {
      _this.dispatchEvent({
        type: NBCUniCPC.Event.PREVIEW_EXPIRED,
        data: null,
      });
    }

    function onStateChange(e) {
      processStateChangeEvent(e.args);
    }

    function onPlayerError(e) {
      processPlayerErrorEvent(e.args);
    }

    function onProgramChanged(e) {
      processProgramChangedEvent(e.args);
    }

    function onSegmentTypeChanged(e) {
      processSegmentTypeChangedEvent(e.args);
    }

    function onPopupBlocked(e) {
      _this.dispatchEvent({
        type: NBCUniCPC.Event.POPUP_BLOCKED,
        data: null,
      });
    }

    function onMuted(e) {
      var muted = e.name === 'MUTED';
      var muteEvent = new NBCUniCPC.Event.MuteEvent(NBCUniCPC.Event.MUTE_EVENT, muted);
      _this.dispatchEvent(muteEvent);
    }

    function onTimeUpdated(e) {
      // sample event object: {"name":"TIME_UPDATED","time":"01:09:824","args":[1549649925,true,"nbc","Days of our Lives"],"sender":"videoplayer"}
      // the args values represent
      // 0: video time (VOD) / time stamp (Live) in seconds
      // 1: live flag
      // 2: video id
      // 3: video title

      var arr = e.time.split(':');
      var milliseconds = parseInt(arr[2]);
      var seconds = parseInt(arr[1]);
      var minutes = parseInt(arr[0]);
      var playheadTime = minutes * 60 * 1000 + seconds * 1000 + milliseconds;

      var playheadUpdateEvent = new NBCUniCPC.Event.PlayheadUpdateEvent(
        NBCUniCPC.Event.PLAYHEAD_UPDATE,
        playheadTime,
        playheadTime,
        true,
        true,
        NBCUniCPC.SegmentType.MASTER === currentSegmentType,
      );
      _this.dispatchEvent(playheadUpdateEvent);
    }

    var commandMap = {
      PLAYING_START: onPlayingStart,
      COMPANION_AVAILABLE: onCompanionAvailable,
      PREVIEW_STATUS: onPreviewStatus,
      AUTHENTICATION_STATUS: onAuthenticationStatus,
      AUTHORIZATION_STATUS: onAuthorizationStatus,
      PROVIDER_SELECTED: onProviderSelected,
      PICKER_REQUESTED: onPickerRequested,
      AD_STARTED: onAdStarted,
      AD_COMPLETED: onAdCompleted,
      FIRST_FRAME_READY: onFirstFrameReady,
      USER_INTERACTION: onUserInteraction,
      PROVIDER_IFRAME_INJECTED: onProviderIframeInjected,
      PREVIEW_EXPIRED: onPreviewExpired,
      STATE_CHANGE: onStateChange,
      PLAYER_ERROR: onPlayerError,
      PROGRAM_CHANGED: onProgramChanged,
      SEGMENT_TYPE_CHANGED: onSegmentTypeChanged,
      TIME_UPDATED: onTimeUpdated,
      POPUP_BLOCKED: onPopupBlocked,
      MUTED: onMuted,
      UNMUTED: onMuted,
    };

    function listener(e) {
      var command = commandMap[e.name] || relayEvent;
      command.call(_this, e);
    }

    /**
     * Callback for anvp.onReady;
     * translates to anvp.onReady = [callback];
     * @param {object} _player A reference to the Anvato player instance.
     */
    this.onReady = function(_player) {
      _this.setPlayerInstance(_player);

      player.setListener(listener);
      ready = true;

      var eventObj = {
        type: NBCUniCPC.Event.PLAYER_LOADED,
        data: {},
      };
      _this.dispatchEvent(eventObj);
      var eventObj2 = {
        type: NBCUniCPC.Event.PLAYBACK_READY,
        data: {},
      };
      _this.dispatchEvent(eventObj2);
    };

    /**
     *
     * @param e
     */
    this.globalListener = function(e) {
      if (!ready && e.sender === instanceName) {
        listener(e);
      }
    };
  }

  /**
   * Object with properties required to initialize the player with video content.
   * This class is a member of the <code>NBCUniCPC</code> namespace and should
   * be instantiated as <code>new NBCUniCPC.ContentInitializationObject()</code>
   * @constructor
   * @example
   * var cio = new NBCUniCPC.ContentInitializationObject();
   * cio.videoId = NBCUniCPC.StreamType.LIVE;
   */
  NBCUniCPC.ContentInitializationObject = function() {
    /**
     * @description The MCP id for the video; also known as the guid or the
     *	reference id. For linear content, the value of this field should be "LIVE"
     * @type {string}
     */
    this.videoId;
    /**
     * @description The MPX account id that owns this media asset.
     * @type {string}
     */
    this.ownerId;
    /**
     * @description The entitlement value for the asset, indicating whether the asset
     * requires authorization before viewing. See {@link NBCUniCPC.Entitlement} for expected values.
     * @type {string}
     */
    this.entitlement;
    /**
     * @description The external advertiser id for identifying this asset in the
     * Freewheel system.
     * @type {string}
     */
    this.externalAdvertiserId;
    /**
     * @description Boolean flag indicates whether the content is a full episode
     *	(<code>true</code>) or not (<code>false</code>). This value is ignored when the
     * <code>videoId</code> value is "LIVE".
     * @type {boolean}
     */
    this.fullEpisode;

    /**
     * @description The TV rating for this asset, e.g., TV-PG
     * @type {boolean}
     */
    this.rating;

    /**
     * @description The MPX media public id. This value is ignored when the
     * <code>videoId</code> value is "LIVE".
     * @type {string}
     * @deprecated Use <code>videoId</code> instead
     */
    this.mediaPid;

    /**
     * @description The name of the show (series) for this video.
     * @type {string}
     * @deprecated This field is not used
     */
    this.showName;
  };

  /**
   * @namespace NBCUniCPC.Entitlement
   * @desc Constants for identifying whether an asset is subject to entitlement restrictions
   */
  NBCUniCPC.Entitlement = {
    /**
     * @description Indicates that an asset does not require authorization
     * @type {string}
     * @default
     * @readonly
     */
    FREE: 'free',
    /**
     * @description Indicates that an asset requires authorization
     * @type {string}
     * @default
     * @readonly
     */
    AUTH: 'auth',
  };

  /**
   *
   * @param {object} pdkProxy The object that holds our reference to the PDK
   * @param {EventDispatcher} dispatcher an EventDispatcher instance
   * @param {object} messenger - RPHelperEvents reference for communicating with the
   * player iframe
   * @constructor
   */
  function PDK6PlayerWrapper(pdkProxy, dispatcher, messenger) {
    var logger = new Logger('PDKPlayerWrapper');
    var controller;
    var _this = this;
    var parent = new AbstractPDKPlayerWrapper(pdkProxy, dispatcher, messenger);
    for (var prop in parent) {
      this[prop] = parent[prop];
    }

    function debug(str) {
      logger.log(str);
    }

    function warn(str) {
      logger.warn(str);
    }

    function onReleaseError(e) {
      // e.data.exception is more narrowly descriptive of the error than the e.data.responseCode
      // see the unit tests for an exact copy of an OnReleaseError event
      var evt = new NBCUniCPC.Event.PlayerErrorEvent(
        NBCUniCPC.Event.PLAYER_ERROR,
        e.data.exception,
        e.data.description,
        true,
      );
      // sneakily jam in the URL for debugging
      evt.data.url = e.data.url;

      _this.dispatchEvent(evt);
    }

    function onVolumeChangeEvent(event) {
      parent.currentVolume = event.data;
    }

    function onPlayerStateChanged(e) {
      if (e.data.state === 'Warmed') {
        parent.onPlaybackReady();
      }
    }

    parent.addCustomListeners = function(_controller) {
      controller = _controller;

      controller.addEventListener('OnPlayerStateChanged', onPlayerStateChanged);
      controller.addEventListener('OnReleaseError', onReleaseError);
      controller.addEventListener('OnVolumeChange', onVolumeChangeEvent);
      // Relay events for brightline
      // @see https://jira.inbcu.com/browse/CPCWEB-8189
      controller.addEventListener('OnMediaStart', parent.relayEvent); // brightline
      controller.addEventListener('OnMediaEnd', parent.relayEvent); // brightline
    };

    this.setVolume = function(level) {
      controller.setVolume(parseFloat(level));
    };

    this.setToken = function(token, type) {
      debug('setToken: ' + token);
      if (controller) {
        controller.setToken(token, type);
      } else {
        warn('controller unavailable');
      }
    };

    this.setSelectedProvider = function(provider) {
      _this.dispatchEvent({
        type: PlayerWrapperEvent.SET_SELECTED_PROVIDER_INVOKED_EVENT,
        data: {
          provider_id: provider,
        },
      });
    };
    /**
     * internal function should be redefined to return false for
     * auth-kill-switch-enabled players; otherwise Anvato throws an error after
     * logout / login.
     * @see {AuthKillSwitchStrategy}
     * @returns {boolean}
     */
    this.canSetSelectedProvider = function() {
      return true;
    };
    /**
     * internal function available to players with page-level auth for metrics
     * @see https://theplatform.jira.com/browse/NBCUTP-6322
     * @param {string} mvpd - the user's selected MVPD id
     * @returns nothing
     */
    this.updateMvpd = function(mvpd) {};
  }

  /**
   * @param {object} pdkProxy The object that holds our reference to the PDK
   * @param {EventDispatcher} dispatcher an EventDispatcher instance
   * @param {object} messenger - RPHelperEvents reference for communicating with the
   * player iframe
   * @constructor
   */
  function PDKPlayerWrapper(pdkProxy, dispatcher, messenger) {
    var logger = new Logger('PDKPlayerWrapper');

    var controller;
    var _this = this;
    var parent = new AbstractPDKPlayerWrapper(pdkProxy, dispatcher, messenger);
    for (var prop in parent) {
      this[prop] = parent[prop];
    }

    function warn(str) {
      logger.warn(str);
    }

    function onErrorEvent(e) {
      _this.dispatchEvent(
        new NBCUniCPC.Event.PlayerErrorEvent(NBCUniCPC.Event.PLAYER_ERROR, null, e.data.message, true),
      );
    }

    function onSetVolumeEvent(event) {
      parent.currentVolume = event.data / 100;
    }

    function onShowPlayOverlay(event) {
      parent.onPlaybackReady();
    }

    parent.addCustomListeners = function(_controller) {
      controller = _controller;

      controller.addEventListener('OnReleaseError', onErrorEvent);
      controller.addEventListener('OnSetVolume', onSetVolumeEvent);
      controller.addEventListener('OnShowPlayOverlay', onShowPlayOverlay);
    };

    this.setVolume = function(level) {
      controller.setVolume(level * 100);
    };

    this.setToken = function(token, type) {
      controller.setToken(token, type);
    };

    this.setSelectedProvider = function(provider) {
      warn('setSelectedProvider is not implemented. Called with provider: ' + provider);
    };
  }

  /**
   * Configuration options for this player.
   * This class is a member of the <code>NBCUniCPC</code> namespace and should
   * be instantiated as <code>new NBCUniCPC.PlayerParameters()</code>
   * @constructor
   * @example
   * var params = new NBCUniCPC.PlayerParameters();
   * params.autoPlay = true;
   */

  NBCUniCPC.PlayerParameters = function() {
    /**  @type {boolean} */
    this.autoPlay;
    /**  @type {string} */
    this.carouselID;
    /**  @type {string} */
    this.dfp_300;
    /**  @type {string} */
    this.dfp_728;
    /**  @type {boolean} */
    this.disableEndCard;
    /**  @type {number} */
    this.endCardSeconds;
    /** @type {boolean} */
    this.excludeSharing;
    /** @type {boolean} */
    this.fwautoplay;
    /** @type {string} */
    this.fwsitesection;
    /** @type {string} */
    this.fallbackSiteSectionIdMobile;
    /** @type {string} */
    this.fallbackSiteSectionIdDesktop;
    /** @type {string} */
    this.adPolicy;
    /** @type {boolean} */
    this.isCoppaCompliant;
    /** @type {string} */
    this.mvpdId;
    /** @type {string} */
    this.mvpdEncryptedServiceZip;
    /** @type {string} */
    this.mvpdServiceZip;
    /** @type {string} */
    /**
     * Used to enforce parental control on Linear players. For example, "TV-Y"
     * @type {string} */
    this.userMaxRating;
    /**
     * Value for "kuid" key in FreeWheel "keyValues" configuration object.
     * @type {string} */
    this.krux_user;
    /**
     * Value for "ksg" key in FreeWheel "keyValues" configuration object.
     * @type {string} */
    this.krux_segment;
    /** @type {string} */
    this.sequenceCompleteStrategy;
    /**
     * Start Position. defaults to 0 when no value specified. Value should be a number.
     * @type {number}
     * */
    this.sp;
    /** @type {string} */
    this.station;
    /** @type {boolean} */
    this.suppressCompanions;
    /** @type {string} */
    this.resourceId;
    /**
     * @description MVPD user identifier that is required for some player configurations.
     * @type {string}
     * */
    this.userGuid;
    /**
     * @description URI-encoded authorization token, usually an Adobe Pass authZ token, that is required for some player configurations.
     * @type {string}
     * */
    this.encodedAuthorizationToken;
    /**
     * @type {string}
     * */
    this.mParticleId;
    /**
     * @description Allows the containing page to identify the version of its "application" that is using CPC. This is not the CPC version. Used for Conviva custom metrics.
     * @type {string}
     */
    this.pageAppVersion;
    /**
     * @description Session id generated by the page to identify an app session. Used for Conviva custom metrics.
     * @type {string}
     */
    this.ipAddress;
    /**
     * @description IP address generated by the page to identify the device id. Used for Conviva custom metrics.
     * @type {string}
     */
    this.appSessionId;
    /**
     * @description Indicates whether or not to prompt the user to share geographical location
     * @type {boolean}
     */
    this.includeGeoInAdRequest;
  };

  /**
   * @desc Constants for distinguishing between Anvato and MPX players
   */
  var PlayerType = {
    /**
     * @type {string}
     * @constant
     * @default
     */
    ANVATO: 'ANVATO',
    /**
     * @type {string}
     * @constant
     * @default
     */
    ANVATO_V3: 'ANVATO_V3',
    /**
     * @type {string}
     * @constant
     * @default
     */
    MPX: 'MPX',
    /**
     * @type {string}
     * @constant
     * @default
     */
    MPX_P3: 'MPX_P3',
    /**
     * @type {string}
     * @constant
     * @default
     */
    MPX_MVPD: 'MPX_MVPD',
    /**
     * @type {string}
     * @constant
     * @default
     */
    PDK_6: 'PDK_6',
    /**
     * @type {string}
     * @constant
     * @default
     */
    PRIMETIME_RSN: 'PRIMETIME_RSN',
  };

  var PlayerWrapperEvent = {
    SET_SELECTED_PROVIDER_INVOKED_EVENT: 'SET_SELECTED_PROVIDER_INVOKED_EVENT',
  };

  /**
   *
   * Factory class instantiates the appropriate player wrapper by player type
   *
   * @param {Object} pdkProxy - The object that holds our reference to the PDK
   * @param {string} serverURL - The hacked environment for web services
   * @param {object} messenger - RPHelperEvents reference for communicating with the
   * player iframe
   * @returns {PlayerWrapperFactory}
   * @constructor
   * @see https://nbcu-ato.atlassian.net/browse/DVLPMNT-73
   */
  function PlayerWrapperFactory(pdkProxy, serverURL, messenger) {
    /**
     *
     * Factory method instantiates a new player wrapper
     *
     * @param {string} playerType Valid values are "ANVATO" or "MPX"
     * @param {string} id The player instance id
     * @param {type} account The account id for this stream
     *
     * @returns {object} a new player wrapper that conforms to the
     * NBCUniCPC.Player API.
     * @throws Will throw an error if the playerType is not valid
     *
     * @see PlayerType
     * @see NBCUniCPC.Account
     */
    this.getNewWrapper = function(playerType, id, account) {
      switch (playerType) {
        case PlayerType.ANVATO:
        case PlayerType.ANVATO_V3:
          return new AnvatoWrapper(id, new EventDispatcher());
        case PlayerType.MPX:
        case PlayerType.MPX_MVPD:
        case PlayerType.MPX_P3:
          return new PDKPlayerWrapper(pdkProxy, new EventDispatcher(), messenger);
        case PlayerType.PDK_6:
          return new PDK6PlayerWrapper(pdkProxy, new EventDispatcher(), messenger);
        case PlayerType.PRIMETIME_RSN:
          return new PrimetimeRSNWrapper(serverURL, account, new EventDispatcher());
        default:
          throw new Error('Unexpected playerType value. See the PlayerType class for expected values');
      }
    };
  }

  var _RSN = _RSN || {};
  _RSN.events = _RSN.events || {};

  _RSN.events.Event = {
    ERROR_EVENT: 'errorEvent',
    CONFIG_LOADED: 'configLoaded',
    CHANNEL_CHANGING: 'channelChanging',
    PLAYBACK_STATUS_CHANGED: 'playbackStatusChanged',
    CURRENT_TIME_CHANGED: 'currentTimeChanged',
    DURATION_CHANGED: 'durationChanged',
    PLAY_RANGE_CHANGED: 'playRangeChanged',
    METADATA_EVENT: 'timedMetadataReceived',
    EVENT_INFO_METADATA: 'eventInfoMetadataReceived',
    BLACKOUT: 'blackedOutEvent',
  };

  _RSN.events.ADEvent = {
    AD_BREAK_STARTED: 'adBreakStarted',
    AD_BREAK_COMPLETED: 'adBreakCompleted',
    AD_STARTED: 'adStarted',
    AD_COMPLETED: 'adCompleted',
    AD_PROGRESS: 'adProgress',
  };

  _RSN.events.PlayerEvent = {
    PLAYER_PLAY: 'playerPlay',
    PLAYER_PAUSE: 'playerPause',
    PLAYER_SEEK_CHANGED: 'playerSeekChange',
    PLAYER_VOLUME_CHANGED: 'playerVolumeChanged',
    PLAYER_MUTE_STATE_CHANGED: 'playerMuteStateChanged',
    PLAYER_SCREEN_STATE_CHANGED: 'playerScreenStateChanges',
    PLAYER_CLOSED_CAPTION_STATE_CHANGED: 'playerClosedCaptionStateChanged',
  };

  // @see http://help.adobe.com/en_US/primetime/api/psdk/asdoc-dhls/index.html
  _RSN.MediaPlayerStatus = {
    COMPLETED: 'complete',
    ERROR: 'error',
    IDLE: 'idle',
    INITIALIZED: 'initialized',
    INITIALIZING: 'initializing',
    PAUSED: 'paused',
    PLAYING: 'playing',
    PREPARED: 'prepared',
    PREPARING: 'preparing',
    RELEASED: 'released',
    SEEKING: 'seeking',
  };

  /**
   * Translates our CPC subtitle styles into values that the Adobe Primetime
   * Player can understand and vicey-versey.
   * @param {EventDispatcher} dispatcher An EventDispatcher instance
   * @param {SubtitleStyle} subtitleStyle - instance of {@link NBCUniCPC.SubtitleStyle}
   * @returns {PrimetimeSubtitleStyleTranslator}
   */
  function PrimetimeSubtitleStyleTranslator(dispatcher, subtitleStyle) {
    var _this = this;
    var _dispatcher = dispatcher;
    var _subtitleStyle = subtitleStyle;
    var _player;

    function getSubtitleStyleForCPC() {
      return _subtitleStyle;
    }

    /**
     * Request a style object.
     * Will trigger a NBCUniCPC.Event.SUBTITLE_STYLE event
     * @returns nothing.
     */
    this.getSubtitleStyle = function() {
      _dispatcher.dispatchEvent(
        new NBCUniCPC.Event.SubtitleEvent(NBCUniCPC.Event.SUBTITLE_STYLE, getSubtitleStyleForCPC()),
      );
    };

    function scaleToSizeName(scale) {
      if (scale < 1) {
        return 'small';
      } else if (scale > 1) {
        return 'large';
      }

      return 'medium';
    }

    var hexNames = {
      '#000000': 'black',
      '#808080': 'gray',
      '#C0C0C0': 'white',
      '#FFFFFF': 'bright_white',
      '#C00000': 'red',
      '#400000': 'dark_red',
      '#FF0000': 'bright_red',
      '#00C000': 'green',
      '#004000': 'dark_green',
      '#00FF00': 'bright_green',
      '#0000C0': 'blue',
      '#000040': 'dark_blue',
      '#0000FF': 'bright_blue',
      '#C0C000': 'yellow',
      '#404000': 'dark_yellow',
      '#FFFF00': 'bright_yellow',
      '#C000C0': 'magenta',
      '#400040': 'dark_magenta',
      '#FF00FF': 'bright_magenta',
      '#00C0C0': 'cyan',
      '#004040': 'dark_cyan',
      '#00FFFF': 'bright_cyan',
    };

    function hexToColorName(hex) {
      var value = hexNames[hex.toUpperCase()];
      return value ? value : 'default';
    }

    function fontNameToPrimetimeFont(fontName) {
      switch (fontName) {
        case 'Arial':
        case 'Arial Black':
        case 'Impact':
        case 'Verdana':
        case 'Tahoma':
          return 'proportional_without_serifs';
        case 'Georgia':
        case 'Palatino':
        case 'Times New Roman':
          return 'proportional_with_serifs';
        case 'Courier New':
          return 'monospaced_with_serifs';
        default:
          return 'default';
      }
    }

    function fontEdgeToSyleName(suppliedValue) {
      switch (suppliedValue.toLowerCase()) {
        case 'none':
        case 'depressed':
        case 'raised':
        case 'uniform':
          return suppliedValue.toLowerCase();
        case 'dropshadow':
          return 'drop_shadow_right';
        default:
          return 'default';
      }
    }

    function floatToConstrainedPercentage(suppliedValue) {
      return Math.min(Math.max(suppliedValue * 100, 0), 100);
    }

    function setFontFamily(value) {
      _player.setCCStyle({
        font: value,
      });
    }

    function setBackgroundOpacity(value) {
      _player.setCCStyle({
        backgroundOpacity: value,
      });
    }

    function setFontOpacity(value) {
      _player.setCCStyle({
        fontOpacity: value,
      });
    }

    function setCCSizeStyle(styleValue) {
      if (styleValue) {
        var style = {
          size: styleValue,
        };
        _player.setCCStyle(style);
      }
    }

    function setCCEdgeStyle(styleValue) {
      if (styleValue) {
        var style = {
          fontEdge: styleValue,
        };
        _player.setCCStyle(style);
      }
    }

    function setCCEdgeColorStyle(styleValue) {
      if (styleValue) {
        var style = {
          edgeColor: styleValue,
        };
        _player.setCCStyle(style);
      }
    }

    function setCCColorStyle(styleValue) {
      if (styleValue) {
        var style = {
          fontColor: styleValue,
        };
        _player.setCCStyle(style);
      }
    }

    function setCCBackgroundColorStyle(styleValue) {
      if (styleValue) {
        var style = {
          backgroundColor: styleValue,
        };
        _player.setCCStyle(style);
      }
    }

    /**
     * Takes a style object and translates it to vendor calls.
     * @param {SubtitleStyle} subtitleStyle - instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.setSubtitleStyle = function(subtitleStyle) {
      _subtitleStyle = subtitleStyle;
      setCCEdgeColorStyle(hexToColorName(_subtitleStyle.fontEdgeColor));
      setCCColorStyle(hexToColorName(_subtitleStyle.fontColor));
      setCCBackgroundColorStyle(hexToColorName(_subtitleStyle.backgroundColor));
      setCCEdgeStyle(fontEdgeToSyleName(_subtitleStyle.fontEdge));
      setCCSizeStyle(scaleToSizeName(_subtitleStyle.fontScale));
      setFontOpacity(floatToConstrainedPercentage(_subtitleStyle.opacity));
      setBackgroundOpacity(floatToConstrainedPercentage(_subtitleStyle.backgroundOpacity));
      setFontFamily(fontNameToPrimetimeFont(_subtitleStyle.fontFamily));
    };

    function onChannelChanging(evt) {
      _this.getSubtitleStyle();
    }
    /**
     * @param {Object} player The RSN player instance.
     */
    this.setPlayerInstance = function(player) {
      _player = player;
      _player.addEventListener(_RSN.events.Event.CHANNEL_CHANGING, onChannelChanging);
    };
  }

  /* *
   *
   * @param {string} serverURL The hacked environment for web services
   * @param {type} account The account id for this stream
   * @param {EventDispatcher} dispatcher an EventDispatcher instance
   *
   * @returns {PrimetimeRSNWrapper}
   *
   * @see NBCUniCPC.Account
   * @see https://nbcu-ato.atlassian.net/browse/DVLPMNT-73
   *  */
  function PrimetimeRSNWrapper(serverURL, account, dispatcher) {
    var player, playerConfig, playerState, maxSeekTime, programId;

    var _this = this;

    /**
     * Factory method
     * @returns {SubtitleStyle} Our best guess at the SubtitleStyle that best
     * represents the default Primetime player subtitle styles
     */
    function newSubtitleStyle() {
      var style = new NBCUniCPC.SubtitleStyle();
      style.backgroundColor = '#000000';
      style.backgroundOpacity = 1;
      style.bold = false;
      style.fontColor = '#FFFFFF';
      style.fontEdge = NBCUniCPC.FontEdge.NONE;
      style.fontEdgeColor = '#000000';
      style.fontFamily = 'Courier New';
      style.fontScale = 1;
      style.opacity = 1;
      return style;
    }

    /**
     * Factory method
     * @returns {PrimetimeSubtitleStyleTranslator}
     */
    function newPrimetimeSubtitleStyleTranslator() {
      return new PrimetimeSubtitleStyleTranslator(dispatcher, newSubtitleStyle());
    }

    var subtitleTranslator = newPrimetimeSubtitleStyleTranslator();

    this.addEventListener = function(type, callback) {
      dispatcher.addEventListener(type, callback);
    };

    this.removeEventListener = function(type, callback) {
      dispatcher.removeEventListener(type, callback);
    };

    this.seekToMilliseconds = function(ms) {
      player.seekToTime(ms);
    };

    this.setToken = function(token) {};

    this.setReleaseURL = function(url) {};

    this.authenticate = function() {};

    this.setSelectedProvider = function(provider) {};

    this.mute = function() {
      if (!player.getIsMuted()) {
        player.toggleMute();
      }
    };

    this.unmute = function() {
      if (player.getIsMuted()) {
        player.toggleMute();
      }
    };

    this.addPlayerCard = function(deckId, cardId, config) {};

    this.unload = function() {};

    this.showControlBar = function() {};

    this.hideControlBar = function() {};

    /**
     * Takes a style object and translates it to vendor calls.
     * @param {SubtitleStyle} subtitleStyle - instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.setSubtitleStyle = function(subtitleStyle) {
      subtitleTranslator.setSubtitleStyle(subtitleStyle);
    };

    /**
     * Request a style object.
     * Will trigger a NBCUniCPC.Event.SUBTITLE_STYLE event
     * @returns nothing.
     */
    this.getSubtitleStyle = function() {
      subtitleTranslator.getSubtitleStyle();
    };

    /**
     * Initiates content playback if the stream is loaded and autoPlay is false. If playback has started and content is paused, resumes playback.
     */
    this.play = function() {
      _this.pause(false);
    };

    this.pause = function(bool) {
      if (bool) {
        player.pause();
      } else {
        player.play();
      }
    };

    this.setCaptionsEnabled = function(bool) {
      if (bool !== player.getIsCCEnabled()) {
        player.toggleCC();
      }
    };

    this.getCaptionsEnabled = function() {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.CAPTION_STATE_EVENT,
        data: {
          enabled: player.getIsCCEnabled(),
          language: player.getIsCCEnabled() ? 'en' : 'none',
        },
      });
    };

    /**
     * Sets volume level.
     * @param {number} level - A percentage value from 0 to 1.
     */
    this.setVolume = function(level) {
      player.setVolume(level);
    };

    /**
     * Request for VolumeEvent to be dispatched with current player volume level
     */
    this.getVolume = function() {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.VOLUME_EVENT,
        data: {
          level: player.getVolume(),
        },
      });
    };

    /**
     * Request for linear player to seek to the latest point in the stream
     */
    this.goLive = function() {
      if (!isNaN(maxSeekTime)) {
        player.seekToTime(maxSeekTime);
      }
    };

    function handlePlaybackStarted(e) {
      if (e.status === _RSN.MediaPlayerStatus.PLAYING) {
        player.removeEventListener(_RSN.events.Event.PLAYBACK_STATUS_CHANGED, handlePlaybackStarted);
        var eventObj = {
          type: NBCUniCPC.Event.PLAYBACK_STARTED,
          data: {},
        };

        dispatcher.dispatchEvent(eventObj);
      }
    }

    function updatePlayerState(state) {
      if (playerState !== state) {
        playerState = state;
        var evt = new NBCUniCPC.Event.VideoStateChangeEvent(NBCUniCPC.Event.STATE_CHANGE, playerState);
        dispatcher.dispatchEvent(evt);
      }
    }

    function handleFirstFrameReady(e) {
      if (e.status === _RSN.MediaPlayerStatus.PREPARED) {
        player.removeEventListener(_RSN.events.Event.PLAYBACK_STATUS_CHANGED, handleFirstFrameReady);
        dispatcher.dispatchEvent({
          type: NBCUniCPC.Event.FIRST_FRAME_READY,
          data: e,
        });
      }
    }

    function onPlaybackStatusChanged(e) {
      switch (e.status) {
        case _RSN.MediaPlayerStatus.PAUSED:
          updatePlayerState(NBCUniCPC.VideoState.STATE_PAUSED);
          break;
        case _RSN.MediaPlayerStatus.PLAYING:
          updatePlayerState(NBCUniCPC.VideoState.STATE_PLAYING);
          break;
        case _RSN.MediaPlayerStatus.INITIALIZING:
        case _RSN.MediaPlayerStatus.PREPARING:
          updatePlayerState(NBCUniCPC.VideoState.STATE_LOADING);
          break;
      }
    }

    function onPlayRangeChanged(evt) {
      maxSeekTime = evt.endTime;
    }

    function updateEventInfo(payload) {
      if (programId !== payload.event_id) {
        programId = payload.event_id;
        var programData = {
          programId: payload.event_id,
          title: payload.title,
          description: payload.description,
        };
        var programEvent = new NBCUniCPC.Event.ProgramChangedEvent(NBCUniCPC.Event.PROGRAM_CHANGED, programData);
        dispatcher.dispatchEvent(programEvent);
      }
    }

    function isBeaconEvent(evt) {
      return evt.hasOwnProperty('key') && evt.key === 'beacon';
    }

    function onEventInfoMetadata(evt) {
      if (isBeaconEvent(evt)) {
        updateEventInfo(evt.eventInfo.payload);
      }

      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.INSTREAM_DATA,
        data: evt,
      });
    }

    function onEventInfoMedata(evt) {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.INSTREAM_DATA,
        data: evt,
      });
    }

    function onBlackoutEvent(evt) {
      var isEntitled =
        typeof evt.data !== 'undefined' && typeof evt.data.entitled !== 'undefined' && evt.data.entitled === 'yes';
      var responseObj =
        typeof evt.data !== 'undefined'
          ? evt.data
          : {
              message: player.getBlackoutMessage(),
            };
      var blackoutEvent = new NBCUniCPC.Event.BlackoutEvent(
        NBCUniCPC.Event.BLACKOUT_STATUS,
        isEntitled,
        false,
        responseObj,
      );
      dispatcher.dispatchEvent(blackoutEvent);
    }

    function onMuteStateChanged(e) {
      dispatcher.dispatchEvent(new NBCUniCPC.Event.MuteEvent(NBCUniCPC.Event.MUTE_EVENT, e.muted));
    }

    function onAdCompleted(e) {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.AD_COMPLETED,
        data: {},
      });
    }

    function onAdStarted(e) {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.AD_STARTED,
        data: {},
      });
    }

    function onAdBreakStarted(e) {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.SEGMENT_COMPLETED,
        data: {},
      });
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.AD_BREAK_STARTED,
        data: {},
      });
      dispatcher.dispatchEvent(new NBCUniCPC.Event.SegmentTypeChangedEvent(NBCUniCPC.Event.SEGMENT_TYPE_CHANGED));
    }

    function onAdBreakCompleted(e) {
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.AD_BREAK_COMPLETED,
        data: {},
      });
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.SEGMENT_STARTED,
        data: {},
      });
      dispatcher.dispatchEvent(
        new NBCUniCPC.Event.SegmentTypeChangedEvent(NBCUniCPC.Event.SEGMENT_TYPE_CHANGED, NBCUniCPC.SegmentType.MASTER),
      );
    }

    function onChannelChanging(evt) {
      player.removeEventListener(_RSN.events.Event.CHANNEL_CHANGING, onChannelChanging);

      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.PLAYER_LOADED,
        data: evt,
      });
      dispatcher.dispatchEvent({
        type: NBCUniCPC.Event.PLAYBACK_READY,
        data: evt,
      });
    }

    function onErrorEvent(evt) {
      dispatcher.dispatchEvent(
        new NBCUniCPC.Event.PlayerErrorEvent(NBCUniCPC.Event.PLAYER_ERROR, evt.detail, evt.error.message, true),
      );
    }

    function onConfigLoaded(evt) {
      player.removeEventListener(_RSN.events.Event.CONFIG_LOADED);
      player.setUserInfo(playerConfig.userGuid, playerConfig.homeZip, playerConfig.mvpdId);
      player.loadEvent('now', account);
    }

    function onCurrentTimeChanged(evt) {
      var playheadUpdateEvent = new NBCUniCPC.Event.PlayheadUpdateEvent(
        NBCUniCPC.Event.PLAYHEAD_UPDATE,
        evt.time,
        evt.time,
        true,
        true,
        true,
      );
      dispatcher.dispatchEvent(playheadUpdateEvent);
    }

    function initWithConfigWhenReady() {
      if (player && playerConfig) {
        player.addEventListener(_RSN.events.Event.ERROR_EVENT, onErrorEvent);
        player.addEventListener(_RSN.events.Event.CHANNEL_CHANGING, onChannelChanging);
        player.addEventListener(_RSN.events.ADEvent.AD_BREAK_STARTED, onAdBreakStarted);
        player.addEventListener(_RSN.events.ADEvent.AD_BREAK_COMPLETED, onAdBreakCompleted);
        player.addEventListener(_RSN.events.ADEvent.AD_COMPLETED, onAdCompleted);
        player.addEventListener(_RSN.events.ADEvent.AD_STARTED, onAdStarted);
        player.addEventListener(_RSN.events.PlayerEvent.PLAYER_MUTE_STATE_CHANGED, onMuteStateChanged);
        player.addEventListener(_RSN.events.Event.BLACKOUT, onBlackoutEvent);
        player.addEventListener(_RSN.events.Event.CURRENT_TIME_CHANGED, onCurrentTimeChanged);
        player.addEventListener(_RSN.events.Event.PLAYBACK_STATUS_CHANGED, handlePlaybackStarted);
        player.addEventListener(_RSN.events.Event.PLAYBACK_STATUS_CHANGED, handleFirstFrameReady);
        player.addEventListener(_RSN.events.Event.PLAYBACK_STATUS_CHANGED, onPlaybackStatusChanged);
        player.addEventListener(_RSN.events.Event.PLAY_RANGE_CHANGED, onPlayRangeChanged);
        player.addEventListener(_RSN.events.Event.EVENT_INFO_METADATA, onEventInfoMetadata);
        player.addEventListener(_RSN.events.Event.METADATA_EVENT, onEventInfoMedata);
        player.addEventListener(_RSN.events.Event.CONFIG_LOADED, onConfigLoaded);
        player.setServerUrl(serverURL);
        player.loadConfig(playerConfig.rsn_key, playerConfig.rsn_as);
      }
    }

    /* *
     *
     * @param _player The underlying RSN.core.Player instance that this class
     *	works with.
     */
    this.setPlayerInstance = function(_player) {
      player = _player;
      subtitleTranslator.setPlayerInstance(player);
      initWithConfigWhenReady();
    };

    this.setPlayerConfig = function(_playerConfig) {
      playerConfig = _playerConfig;
      initWithConfigWhenReady();
    };
  }

  /**
   * @desc Constants for distinguishing identifying the status of a segement
   * within a stream
   * @constructor
   */
  NBCUniCPC.SegmentStatus = {
    /**
     * @type {string}
     * @constant
     * @default
     */
    START: 'start',
    /**
     * @type {string}
     * @constant
     * @default
     */
    COMPLETE: 'complete',
  };

  /**
   * @namespace NBCUniCPC.SegmentType
   * @desc Constants for distinguishing identifying segment types within a stream
   */
  NBCUniCPC.SegmentType = {
    /**
     * @type {string}
     * @default
     * @readonly
     */
    MASTER: 'master',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    SLATE: 'slate',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    AD: 'ad',
  };

  /**
   * @namespace NBCUniCPC.StreamType
   * @desc Constants for distinguishing between Live and VOD content
   */
  NBCUniCPC.StreamType = {
    /**
     * @type {string}
     * @default
     * @readonly
     */
    LIVE: 'LIVE',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    VOD: 'VOD',
  };

  /**
   * @namespace NBCUniCPC.VideoState
   * @desc Constants for identifying the state of the video stream
   */
  NBCUniCPC.VideoState = {
    /**
     * @type {string}
     * @default
     * @readonly
     */
    STATE_LOADING: 'videoLoading',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    STATE_BUFFERING: 'videoBuffering',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    STATE_PLAYING: 'videoPlay',
    /**
     * @type {string}
     * @default
     * @readonly
     */
    STATE_PAUSED: 'videoPause',
  };

  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError("'this' is null or not defined");
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, Â« kValue, k, O Â»)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      },
      configurable: true,
      writable: true,
    });
  }

  // Fix for IE
  if (typeof window.console === 'undefined') {
    console = {};
    console.log = function() {};
    console.debug = function() {};
    console.info = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.time = function() {};
    console.timeEnd = function() {};
  }

  /**
   * Provides access to Adobe Access Enabler through a callback. If an acceptable
   * version of Access Enabler is already available, then this class will return
   * that instance; otherwise, this class will inject Access Enabler into the page
   * and return it.
   * @constructor
   * @param {AccessEnablerWrapper} wrapper - an instance of {@link AccessEnablerWrapper} for decorating the access enabler with event dispatching capability
   * @param {window} [_scope=window] - The window object
   */
  function AccessEnablerProxy(wrapper, _scope) {
    var scope = _scope || window;

    var _accessEnabler;
    var _callback;
    if (scope.hasOwnProperty('accessEnabler') && typeof scope.accessEnabler === 'object') {
      wrapper.setAccessEnabler(scope.accessEnabler);
      _accessEnabler = wrapper;
    }

    function hasValidAccessEnabler() {
      return typeof _accessEnabler === 'object' && typeof _accessEnabler.getMetadata === 'function';
    }

    function entitlementLoaded() {
      wrapper.setAccessEnabler(scope.accessEnabler);
      _accessEnabler = wrapper;
      _callback(_accessEnabler);
    }

    function loadAccessEnabler(callback) {
      scope.entitlementLoaded = entitlementLoaded;
      var script, head;
      var doc = scope.document;

      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = '//entitlement.auth.adobe.com/entitlement/AccessEnabler.js';

      // Attach script to the DOM.
      head = doc.head || doc.getElementsByTagName('head')[0];
      head.appendChild(script);
    }

    /**
     * Returns an instance of {@link AccessEnablerWrapper} for decorating the
     * access enabler with event dispatching capability
     *
     * @param {AccessEnablerProxy~callback} callback The callback that receives
     * the {@link AccessEnablerWrapper} reference
     */
    this.getAccessEnabler = function(callback) {
      _callback = callback;
      if (hasValidAccessEnabler()) {
        _callback(_accessEnabler);
      } else {
        loadAccessEnabler();
      }
    };
  }

  /**
   * This callback receives the accessEnabler instance
   * @callback AccessEnablerProxy~callback
   * @param {Object} accessEnabler - An instance of accessEnabler
   * @example
   * var myAccessEnabler;
   * var proxy = new AccessEnablerProxy();
   *
   * function onAccessEnabler(ae)
   * {
   *	 myAccessEnabler = ae; // ae is the accessEnabler instance provided by the proxy.
   * }
   *
   * proxy.getAccessEnabler( onAccessEnabler ); // request accessEnabler from the proxy and provide a callback to receive the accessEnabler instance
   *
   *
   */

  /**
   * Provides a robust interface to allow multiple objects to interact with the
   * Adobe Access Enabler without having to manipulate the DOM or overwrite the
   * unique callbacks provided by the Access Enabler. This class delegates method
   * calls into the access enabler, and provides an event dispatching mechanism
   * in lieu of direct callbacks from the underlying access enabler, allowing
   * multiple objects to receive notification of access enabler callbacks.
   * @constructor
   * @param {EventDispatcher} dispatcher - an EventDispatcher instance
   * @param {Window} win - The Window element that receives the access enabler callbacks
   * @returns {AccessEnablerWrapper}
   * @see http://tve.helpdocsonline.com/javascript-api-reference-v2
   * @see http://tve.helpdocsonline.com/error-reporting$advanced
   */
  function AccessEnablerWrapper(dispatcher, win) {
    var logger = new Logger('AccessEnablerWrapper');

    function debug(str) {
      logger.log(str);
    }

    function error(str) {
      logger.error(str);
    }

    var _this = this;
    _this.addEventListener = dispatcher.addEventListener;
    _this.removeEventListener = dispatcher.removeEventListener;
    _this.dispatchEvent = dispatcher.dispatchEvent;

    /**
     * This method must be called after the Access Enabler becomes available in
     * the entitlementLoaded callback.
     *
     * @param {type} ae an instance of the javascript Access Enabler.
     *
     * @see http://tve.helpdocsonline.com/javascript-api-reference-v2$entLoaded
     */
    _this.setAccessEnabler = function(ae) {
      _this.getSelectedProvider = ae.getSelectedProvider;
      _this.setSelectedProvider = ae.setSelectedProvider;
      _this.setRequestor = ae.setRequestor;
      _this.getAuthorization = ae.getAuthorization;
      _this.getAuthentication = ae.getAuthentication;
      _this.checkAuthentication = ae.checkAuthentication;
      _this.checkAuthorization = ae.checkAuthorization;
      _this.checkPreauthorizedResources = ae.checkPreauthorizedResources;
      _this.getMetadata = ae.getMetadata;
      _this.logout = ae.logout;
      _this.bind = ae.bind;
    };
    // _this.entitlementLoaded is defined either in the page or in AccessEnablerProxy before instantiating this class.
    /* *
     * Triggered by: setProviderDialogURL(), getAuthentication(), getAuthorization()
     * @param {array} providers - An array of Objects representing the requested
     * MVPDs: ` var mvpd = {ID: "someprov",displayName: "Some Provider",logoURL: "http://www.someprov.com/images/logo.jpg"} `
     */
    _this.displayProviderDialog = function(providers) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.DisplayProviderDialogEvent(providers));
    };
    /* *
     * â€‹Trigger:  checkAuthorization() and getAuthorization() after a successful
     * authorization to view a resource.
     *
     * @param {type} resource - the content that the user is authorized to view.
     * @param {type} token - the short-lived media token
     */
    _this.setToken = function(resource, token) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SetTokenEvent(resource, token));
    };
    /* *
     * â€‹Trigger: checkAuthorization() and getAuthorization() after an unsuccessful authorization.
     * @param {type} resource - the content that the user was attempting to view
     * @param {type} code - the error code indicating what type of failure
     * occurred
     * @param {type} description - describes the error associated with the error
     * code
     */
    _this.tokenRequestFailed = function(resource, code, description) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.TokenRequestFailedEvent(resource, code, description));
    };
    /* *
     * Trigger: checkAuthentication(), getAuthentication(), checkAuthorization()
     *
     * Called upon completion of a checkAuthentication() request. Passes the authentication status (1=authenticated or 0=not authenticated)
     * @param {boolean} isAuthenticated - Provides authentication status: 1 (authenticated) or 0 (not authenticated).
     * @param {string} errorCode - Any error that occurred when determining authentication status. An empty string if none.
     */
    _this.setAuthenticationStatus = function(isAuthenticated, errorCode) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SetAuthenticationStatusEvent(isAuthenticated, errorCode));
    };
    /* *
     * Callback triggered by the Access Enabler that delivers the authorized
     * resources list returned after a call to checkPreauthorizedResources().
     * @param {array} authorizedResources: The list of authorized resources.
     */
    _this.preauthorizedResources = function(authorizedResources) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.PreauthorizedResourcesEvent(authorizedResources));
    };
    /* *
     * Callback triggered by setRequestor().  Delivers configuration information and MVPD list.
     * @param {string} configXML: xml object holding the configuration for the
     * current REQUESTOR including the MVPD list.
     */
    _this.setConfig = function(configXML) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SetConfigEvent(configXML));
    };
    /* *
     * Callback triggered by setRequestor() if handleRedirect parameter=true.
     * @param {string} data - JSON object containing a property (redirectURL)
     * with the MVPD login URL.
     */
    _this.setMvpdRedirectURL = function(data) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SetMVPDRedirectEvent(data));
    };
    /*
     * Trigger: getMetadata().
     * @param {string} key - The key of the metadata for which the request was made.
     * @param {boolean} encrypted - A flag signifying whether the "value" is
     * encrypted or not. If this is "true" then "value" will actually be a JSON
     * Web Encrypted  representation of the actual value.
     * @param {string} data - A JSON Object with the representation of the
     * metadata.
     */
    _this.setMetadataStatus = function(key, encrypted, data) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SetMetadataStatusEvent(key, encrypted, data));
    };
    /* *
     * This function is called if the selected provider is configured to display in an IFrame.
     * A provider is configured to render its authentication screen as either a redirect or in an iFrame, and the Programmer needs to account for both.
     * Trigger: setSelectedProvider(providerID)
     *
     * @param {number} width - the pixel width of the iframe
     * @param {number} height - the pixel height of the iframe
     *
     * @see http://tve.helpdocsonline.com/javascript-api-reference-v2$$getAuthZ
     */
    _this.createIFrame = function(width, height) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.CreateIFrameEvent(width, height));
    };
    _this.destroyIFrame = function() {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.DestroyIFrameEvent());
    };
    /* *
     * Trigger: getSelectedProvider().
     * @param {object} result - provides information about the provider selected by the user.
     * The result parameter is an Object with these properties:
     * - MVPD The currently selected MVPD, or null if no MVPD was selected.
     * - AE_State The result of authentication for the current customer, one of "New User", "User Not Authenticated", or "User Authenticated
     */
    _this.selectedProvider = function(result) {
      debug('** selectedProvider. result: ' + JSON.stringify(result));
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SelectedProviderEvent(result.MVPD, result.AE_State));
    };
    /* *
     * Triggered by: checkAuthentication(), getAuthentication(), checkAuthorization(), getAuthorization()
     * Called to provide tracking data when specific events occur. You can use
     * this, for example, to keep track of how many users have logged in with the
     * same credentials. Tracking is not currently configurable.
     *
     * @param {string} trackingEventType
     * @param {array} data
     * @see http://tve.helpdocsonline.com/javascript-api-reference-v2$sendTracking
     */
    _this.sendTrackingData = function(trackingEventType, data) {
      _this.dispatchEvent(new AccessEnablerWrapper.Event.SendTrackingDataEvent(trackingEventType, data));
    };

    function defineCallbackFor(f) {
      // https://stackoverflow.com/a/12348736/7220992
      if (win[f]) {
        var oldPrototype = win[f].prototype;
        var oldFunction = win[f];
        win[f] = function() {
          try {
            oldFunction.apply(win, arguments);
          } catch (e) {
            error(e);
          }
          _this[f].apply(_this, arguments);
        };
        win[f].prototype = oldPrototype;
      } else {
        win[f] = _this[f];
      }
    }

    defineCallbackFor('displayProviderDialog');
    defineCallbackFor('setToken');
    defineCallbackFor('tokenRequestFailed');
    defineCallbackFor('setAuthenticationStatus');
    defineCallbackFor('preauthorizedResources');
    defineCallbackFor('setConfig');
    defineCallbackFor('setMvpdRedirectURL');
    defineCallbackFor('setMetadataStatus');
    defineCallbackFor('createIFrame');
    defineCallbackFor('destroyIFrame');
    defineCallbackFor('selectedProvider');
    defineCallbackFor('sendTrackingData');
  }

  AccessEnablerWrapper.DISPLAY_PROVIDER_DIALOG_EVENT = 'DISPLAY_PROVIDER_DIALOG_EVENT';
  AccessEnablerWrapper.SET_TOKEN_EVENT = 'SET_TOKEN_EVENT';
  AccessEnablerWrapper.TOKEN_REQUEST_FAILED_EVENT = 'TOKEN_REQUEST_FAILED_EVENT';
  AccessEnablerWrapper.SET_AUTHENTICATION_STATUS_EVENT = 'SET_AUTHENTICATION_STATUS_EVENT';
  AccessEnablerWrapper.PREAUTHORIZED_RESOURCES_EVENT = 'PREAUTHORIZED_RESOURCES_EVENT';
  AccessEnablerWrapper.SET_CONFIG_EVENT = 'SET_CONFIG_EVENT';
  AccessEnablerWrapper.SET_MVPD_REDIRECT_EVENT = 'SET_MVPD_REDIRECT_EVENT';
  AccessEnablerWrapper.SET_METADATA_STATUS_EVENT = 'SET_METADATA_STATUS_EVENT';
  AccessEnablerWrapper.CREATE_IFRAME_EVENT = 'CREATE_IFRAME_EVENT';
  AccessEnablerWrapper.DESTROY_IFRAME_EVENT = 'DESTROY_IFRAME_EVENT';
  AccessEnablerWrapper.SELECTED_PROVIDER_EVENT = 'SELECTED_PROVIDER_EVENT';
  AccessEnablerWrapper.SEND_TRACKING_DATA_EVENT = 'SEND_TRACKING_DATA_EVENT';

  /**
   * @namespace AccessEnablerWrapper.Event
   * @desc Events dispatched by the AccessEnablerWrapper in response to Access
   * Enabler callbacks.
   */
  AccessEnablerWrapper.Event = {
    /**
     * Fires when Adobe Access Enabler displayProviderDialog callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.DISPLAY_PROVIDER_DIALOG_EVENT}
     * @param {array} providers - An array of Objects representing the requested
     */
    DisplayProviderDialogEvent: function(providers) {
      this.type = AccessEnablerWrapper.DISPLAY_PROVIDER_DIALOG_EVENT;
      this.providers = providers;
    },
    /**
     * Fires when Adobe Access Enabler setToken callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SET_TOKEN_EVENT}
     * @param {type} resource - the content that the user is authorized to view.
     * @param {type} token - the short-lived media token
     */
    SetTokenEvent: function(resource, token) {
      this.type = AccessEnablerWrapper.SET_TOKEN_EVENT;
      this.resource = resource;
      this.token = token;
    },
    /**
     * Fires when Adobe Access Enabler tokenRequestFailed callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.TOKEN_REQUEST_FAILED_EVENT}
     * @param {type} resource - the content that the user was attempting to view
     * @param {type} code - the error code indicating what type of failure
     * occurred
     * @param {type} description - describes the error associated with the error
     * code
     */
    TokenRequestFailedEvent: function(resource, code, description) {
      this.type = AccessEnablerWrapper.TOKEN_REQUEST_FAILED_EVENT;
      this.resource = resource;
      this.code = code;
      this.description = description;
    },
    /**
     * Fires when Adobe Access Enabler setAuthenticationStatus callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SET_AUTHENTICATION_STATUS_EVENT}
     * @param {boolean} isAuthenticated - Provides authentication status: 1 (authenticated) or 0 (not authenticated).
     * @param {string} errorCode - Any error that occurred when determining authentication status. An empty string if none.
     */
    SetAuthenticationStatusEvent: function(isAuthenticated, errorCode) {
      this.type = AccessEnablerWrapper.SET_AUTHENTICATION_STATUS_EVENT;
      this.isAuthenticated = isAuthenticated;
      this.errorCode = errorCode;
    },
    /**
     * Fires when Adobe Access Enabler preauthorizedResources callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.PREAUTHORIZED_RESOURCES_EVENT}
     * @param {array} authorizedResources: The list of authorized resources.
     */
    PreauthorizedResourcesEvent: function(authorizedResources) {
      this.type = AccessEnablerWrapper.PREAUTHORIZED_RESOURCES_EVENT;
      this.authorizedResources = authorizedResources;
    },
    /**
     * Fires when Adobe Access Enabler setConfig callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SET_CONFIG_EVENT}
     * @param {string} configXML: xml object holding the configuration for the
     * current REQUESTOR including the MVPD list.
     */
    SetConfigEvent: function(configXML) {
      this.type = AccessEnablerWrapper.SET_CONFIG_EVENT;
      this.configXML = configXML;
    },
    /**
     * Fires when Adobe Access Enabler setMvpdRedirectURL callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SET_MVPD_REDIRECT_EVENT}
     * @param {string} data - JSON object containing a property (redirectURL)
     * with the MVPD login URL.
     */
    SetMVPDRedirectEvent: function(data) {
      this.type = AccessEnablerWrapper.SET_MVPD_REDIRECT_EVENT;
      this.data = data;
    },
    /**
     * Fires when Adobe Access Enabler setMetadataStatus callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SET_METADATA_STATUS_EVENT}
     * @param {string} key - The key of the metadata for which the request was made.
     * @param {boolean} encrypted - A flag signifying whether the "value" is
     * encrypted or not. If this is "true" then "value" will actually be a JSON
     * Web Encrypted  representation of the actual value.
     * @param {string} data - A JSON Object with the representation of the
     * metadata.
     */
    SetMetadataStatusEvent: function(key, encrypted, data) {
      this.type = AccessEnablerWrapper.SET_METADATA_STATUS_EVENT;
      this.key = key;
      this.encrypted = encrypted;
      this.data = data;
    },
    /**
     * Fires when Adobe Access Enabler createIFrame callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.CREATE_IFRAME_EVENT}
     * @param {number} width - the pixel width of the iframe
     * @param {number} height - the pixel height of the iframe
     */
    CreateIFrameEvent: function(width, height) {
      this.type = AccessEnablerWrapper.CREATE_IFRAME_EVENT;
      this.width = width;
      this.height = height;
    },
    /**
     * Fires when Adobe Access Enabler destroyIFrame callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.DESTROY_IFRAME_EVENT}
     */
    DestroyIFrameEvent: function() {
      this.type = AccessEnablerWrapper.DESTROY_IFRAME_EVENT;
    },
    /**
     * Fires when Adobe Access Enabler selectedProvider callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SELECTED_PROVIDER_EVENT}
     * @param {string} mvpd - The currently selected MVPD, or null if no MVPD was selected.
     * @param {string state - The result of authentication for the current customer, one of "New User", "User Not Authenticated", or "User Authenticated
     */
    SelectedProviderEvent: function(mvpd, state) {
      this.type = AccessEnablerWrapper.SELECTED_PROVIDER_EVENT;
      this.mvpd = mvpd;
      this.state = state;
    },
    /**
     * Fires when Adobe Access Enabler sendTrackingData callback is invoked
     * @event
     * @param {string} type - {@link AccessEnablerWrapper.SEND_TRACKING_DATA_EVENT}
     * @param {string} trackingEventType
     * @param {object} data
     */
    SendTrackingDataEvent: function(trackingEventType, data) {
      this.type = AccessEnablerWrapper.SEND_TRACKING_DATA_EVENT;
      this.trackingEventType = trackingEventType;
      this.data = data;
    },
  };

  /**
   * Provides access to Brightline through a callback. If an acceptable
   * version of Brightline is already available, then this class will return
   * that instance; otherwise, this class will inject Brightline into the page
   * and return it. If there is a problem loading Brightline, then a null instance
   * of the Brightline API will be returned
   *
   * @constructor
   * @param {object} _settings - The CPC configuration object for Brightline
   * @param {document} [_doc=document] - The document object
   * @param {window} [_scope=window] - The window object
   */

  function BrightlineProxy(_settings, _doc, _scope) {
    var logger = new Logger('BrightlineProxy');
    var scope;

    // Get the fallback here, so we can test that the actual brightline instance
    // and the fallback have all of the same methods available. We can verify
    // that the fallback and the actual instance are in sync in hasValidBL().
    var fallback = NullBrightline.getInstance();

    function warn(str) {
      logger.warn(str);
    }

    function hasValidBL() {
      scope = _scope || window;
      if (!(scope && typeof scope.BL !== 'undefined' && null !== scope.BL && typeof scope.BL === 'object')) {
        return false;
      }

      for (var prop in fallback) {
        if (typeof fallback[prop] !== typeof scope.BL[prop]) {
          return false;
        }
      }
      return true;
    }

    function loadBrightline(callback) {
      var settings, doc, timeout, script, timeoutId, body;
      settings = _settings || {};
      doc = _doc || document;
      timeout = parseInt(settings.timeout);

      if (isNaN(timeout)) {
        timeout = 2000;
      }

      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = settings.hasOwnProperty('src')
        ? settings.src
        : '//cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.0.0.js';

      script.onload = function() {
        clearTimeout(timeoutId);
        if (hasValidBL()) {
          callback(scope.BL);
        } else {
          warn('Downloaded Brightline is incompatible with CPC. Using fallback instead.');
          callback(fallback);
        }
      };
      script.onerror = function() {
        warn('There was a problem loading Brightline. Using fallback instead.');
        clearTimeout(timeoutId);
        callback(fallback);
      };

      timeoutId = setTimeout(script.onerror, timeout);

      // Attach script to the DOM.
      body = doc.getElementsByTagName('body')[0];
      body.appendChild(script);
    }

    this.getBrightline = function(callback) {
      if (hasValidBL()) {
        callback(scope.BL);
      } else {
        loadBrightline(callback);
      }
    };
  }

  /**
   * Provides access to jQuery through a callback. If an acceptable version of
   * jQuery is already available, then this class will return that jQuery instance;
   * otherwise, this class will inject jQuery into the page and return it.
   * @constructor
   * @param {window} [_scope=window] - The window object
   */
  function JQueryProxy(_scope) {
    var scope = _scope || window;

    var _jQuery, _requiresNoConflictOnLoad;
    if (typeof scope.jQuery === 'function') {
      _jQuery = scope.jQuery;
      _requiresNoConflictOnLoad = true; // in the case that hasValidJQuery fails (the existing jQuery is outdated), then we will end up with 2 jQuery instances
    }

    function hasValidJQuery() {
      return (
        typeof _jQuery === 'function' &&
        typeof _jQuery.getJSON === 'function' &&
        typeof _jQuery().on === 'function' &&
        typeof _jQuery.ajax === 'function' &&
        typeof _jQuery.attr === 'function' &&
        typeof _jQuery().replaceWith === 'function' &&
        typeof _jQuery.Deferred === 'function' &&
        typeof _jQuery.proxy === 'function'
      );
    }

    function loadJQuery(callback) {
      var script, head;
      var doc = scope.document;

      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = '//code.jquery.com/jquery-1.11.2.min.js';

      script.onload = function() {
        _jQuery = _requiresNoConflictOnLoad ? scope.jQuery.noConflict(true) : scope.jQuery;
        callback(_jQuery);
      };

      // Attach script to the DOM.
      head = doc.head || doc.getElementsByTagName('head')[0];
      head.appendChild(script);
    }

    /**
     * Returns a usable version of jQuery through a callback.
     *
     * @param {JQueryProxy~callback} callback The callback that receives the jQuery reference
     */
    this.getJQuery = function(callback) {
      if (hasValidJQuery()) {
        callback(_jQuery);
      } else {
        loadJQuery(callback);
      }
    };
  }

  /**
   * This callback receives the jQuery instance
   * @callback JQueryProxy~callback
   * @param {Object} jQuery - An instance of jQuery
   * @example
   * var myJQuery;
   * var proxy = new JQueryProxy();
   *
   * function onJQuery(jq)
   * {
   *	 myJQuery = jq; // jq is the jQuery instance provided by the proxy.
   * }
   *
   * proxy.getJQuery( onJQuery ); // request jQuery from the proxy and provide a callback to receive the jQuery instance
   *
   *
   */

  /**
   * Provides access to mvpdHashMap through a callback. If the mvpdHashMap object
   * is available in the window, then this class will return that instance;
   * otherwise, this class will inject mvpdHashMap into the page and return it.
   * @constructor
   * @param {window} [_scope=window] - The window object
   */
  function MVPDHashMapProxy(_scope) {
    var scope = _scope || window;
    // guard against downloading an empty map multiple times
    var downloaded = false;

    function isEmpty(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }

      return true;
    }

    function hasValidInstance() {
      return (
        downloaded ||
        (scope &&
          scope.hasOwnProperty('mvpdHashMap') &&
          typeof scope.mvpdHashMap === 'object' &&
          !isEmpty(scope.mvpdHashMap))
      );
    }

    function loadInstance(callback) {
      var script, head;
      var doc = scope.document;

      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = '//tve-common.nbcuni.com/web/js/nbcuni_hash_config.js';

      script.onload = function() {
        downloaded = true;
        // convert MVPDs to lowerCase(); (this is what RP helper does)
        var newHashMap = {};
        for (var i in scope.mvpdHashMap) {
          newHashMap[i.toString().toLowerCase()] = scope.mvpdHashMap[i];
        }
        scope.mvpdHashMap = newHashMap;
        callback(scope.mvpdHashMap);
      };

      // Attach script to the DOM.
      head = doc.getElementsByTagName('head')[0];
      head.appendChild(script);
    }

    /**
     * Returns a usable version of mvpdHashMap through a callback.
     *
     * @param {MVPDHashMapProxy~callback} callback The callback that receives the mvpdHashMap reference
     */
    this.getMvpdHashMap = function(callback) {
      if (hasValidInstance()) {
        callback(scope.mvpdHashMap);
      } else {
        loadInstance(callback);
      }
    };
  }

  /**
   * This callback receives the mvpdHashMap instance
   * @callback MVPDHashMapProxy~callback
   * @param {Object} mvdpHashMap - An instance of mvpdHashMap
   * @example
   * var myHashMap;
   * var proxy = new MVPDHashMapProxy();
   *
   * function onHashMap(mhm)
   * {
   *	 myHashMap = mhm; // mhm is the mvpdHashMap instance provided by the proxy.
   * }
   *
   * proxy.getMvpdHashMap( onHashMap ); // request mvpdHashMap from the proxy and provide a callback to receive the mvpdHashMap instance
   *
   *
   */

  /**
   * This class is a stub for player configurations that do not
   * support Brightline or as a fallback when Brightline fails to load. It
   * contains stub implementations for all methods required
   * by the brightline interface. This class implements a singleton pattern as
   * recommended by the Refactoring book.
   *
   * User story: https://jira.inbcu.com/browse/CPCWEB-8189
   */
  var NullBrightline = (function(lock) {
    'use strict';
    var instance; //prevent modification of "instance" variable

    function Singleton(caller) {
      if (instance || caller !== lock) {
        throw new Error('NullBrightline is a singleton. Use NullBrightline.getInstance() instead.');
      }

      // define properties we want
      this.openAd = function() {};
      this.closeAd = function() {};
      this.on_deviceInfo = function() {};
      this.on_BL_expanded = function() {};
      this.on_BL_collapsed = function() {};
      this.init = function() {};

      instance = this;
    }

    Singleton.getInstance = function() {
      return instance || new Singleton(lock);
    };

    return Singleton;
  })({});

  /**
   * Holds a reference to the $pdk
   */
  function PDKProxy() {
    var pdk = typeof $pdk !== 'undefined' ? $pdk : null;

    this.getPDK = function() {
      return pdk;
    };

    this.setPDK = function(value) {
      pdk = value;
    };
  }

  /**
   * Provides access to swfobject through a callback. If an acceptable
   * version of swfobject is already available, then this class will return
   * that instance; otherwise, this class will inject swfobject into the page
   * and return it.
   *
   * @constructor
   * @param {window} [_scope=window] - The window object
   */
  function SwfObjectProxy(_scope) {
    var scope = _scope || window;

    function hasValidSwfObject() {
      return (
        scope &&
        typeof scope.swfobject !== 'undefined' &&
        typeof scope.swfobject.embedSWF === 'function' &&
        typeof scope.swfobject.hasFlashPlayerVersion === 'function'
      );
    }

    function loadSwfObject(callback) {
      var script, body;
      var doc = scope.document;

      script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = '//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js';

      script.onload = function() {
        callback(scope.swfobject);
      };

      // Attach script to the DOM.
      body = doc.body || doc.getElementsByTagName('body')[0];
      body.appendChild(script);
    }

    this.getSwfObject = function(callback) {
      if (hasValidSwfObject()) {
        callback(scope.swfobject);
      } else {
        loadSwfObject(callback);
      }
    };
  }

  /*
   * This handles responses from the ad params service. It
   * merges the supplied parameters with those retrieved from the service and
   * formats them in a way that RPHelper can use. This class is similar to
   * {@link AdParamsRequestMediator}, but it can replace tokens in the AJAX
   * template and pass the parsed settings to a generic request factory.
   *
   * @param {boolean} enabled - Indicates whether this feature is enabled or not
   * @param {Object} settingsTemplate - Template for the AJAX request. Replaceable
   *	string tokens should be surrounded with "@" symbols, e.g., ` @MVPD_ID@ `
   * @param {Object} requestFactory - Creates Request objects for retrieving data
   *	from a web service
   * @param {Object} userMetadataProvider - Provides usermetadata. This is
   *	probably an instance of AdobePassCore
   */
  function AdParamsRequestMediator2(enabled, settingsTemplate, requestFactory, userMetadataProvider) {
    var logger = new Logger('AdParamsRequestMediator2');

    function RequestHandler(options, callback) {
      var _options = options || {};

      function getSelectedMVPD() {
        var usermetadata = userMetadataProvider.getUserMetadata();
        return usermetadata.adobeMvpdId || _options.mvpdId;
      }

      // this is the original function that returns the page-supplied FW values
      function getFwOptions() {
        return {
          fwSiteSection: _options.fwsitesection,
          fallbackSiteSectionIdMobile: _options.fallbackSiteSectionIdMobile,
          fallbackSiteSectionIdDesktop: _options.fallbackSiteSectionIdDesktop,
          mvpd: getSelectedMVPD(),
          adPolicy: _options.adPolicy,
          isCoppaCompliant: Boolean(_options.isCoppaCompliant),
        };
      }

      // merge the values from the web service with the page-supplied values
      this.onSuccess = function(data, textStatus, jqXHR) {
        var obj = getFwOptions();
        if (!data || !data.hasOwnProperty('adparams')) {
          callback(obj);
          return;
        }

        for (var prop in data.adparams) {
          obj[prop] = data.adparams[prop];
        }

        callback(obj);
      };

      // just return the original, page-supplied values when the web service fails
      this.onFailure = function(jqXHR, textStatus, errorThrown) {
        callback(getFwOptions());
      };
    }

    function getRequestSettingsFor(cio, options) {
      if (!settingsTemplate || 'string' !== typeof settingsTemplate) {
        return null;
      }

      var _cio = cio || {};
      var _options = options || {};

      var usermetadata = userMetadataProvider.getUserMetadata();
      var str = settingsTemplate.replace(/@MVPD_ID@/g, usermetadata.adobeMvpdId);
      str = str.replace(/@MVPD_HOMEZIP@/g, usermetadata.serviceZip ? usermetadata.serviceZip : '');
      str = str.replace(/@MVPD_ENCRYPTED_HOMEZIP@/g, usermetadata.encryptedZip ? usermetadata.encryptedZip : '');
      str = str.replace(/@MPX_ACCOUNT_ID@/g, _cio.ownerId);
      str = str.replace(/@EXTERNAL_ADVERTISER_ID@/g, _cio.externalAdvertiserId);
      str = str.replace(/@M_PARTICLE_ID@/g, _options.mParticleId);

      var obj;
      try {
        obj = JSON.parse(str);
      } catch (err) {
        logger.warn('Unable to parse settings string');
      }
      return obj;
    }

    /*
     * @param {NBCUniCPC.ContentInitializationObject} cio - An instance of
     *	NBCUniCPC.ContentInitializationObject
     * @param {NBCUniCPC.PlayerParameters} options - An instance of
     *	NBCUniCPC.PlayerParameters
     *	@param {AdParamsMediator~buildCallback} callback - The callback to be
     *	invoked after the ad parameters have been retrieved and parsed.
     */
    this.getParams = function(cio, options, callback) {
      logger.log('getParams. requestFactory: ' + requestFactory);
      var handler = new RequestHandler(options, callback);
      if (enabled) {
        var settings = getRequestSettingsFor(cio, options);
        var request = requestFactory.newRequest(settings);
        request.execute(handler.onSuccess, handler.onFailure);
      } else {
        handler.onFailure();
      }
    };
  }

  /**
   * The callback that will be invoked after the ad parameters have been retrieved
   * and parsed.
   *
   * @callback AdParamsRequestMediator2~buildCallback
   * @param {object} params - The parsed ad parameters object with all of the
   *	fields and values to be used by RPHelper to build the player or selector URL.
   */

  /*
   * Makes asyncronous requests to the config service
   * @param {Object} requestFactory - Creates Request objects for retrieving data
   *	from a web service
   * @param {string} serviceURL - URL of the configuration web service.
   */
  function AsyncConfigRequestMediator(requestFactory, serviceURL) {
    function RequestHandler(callback) {
      this.onSuccess = function(data, textStatus, jqXHR) {
        callback(data);
      };

      this.onFailure = function(jqXHR, textStatus, errorThrown) {};
    }

    function getRequestSettings(key, secret) {
      return {
        type: 'GET',
        url: serviceURL.replace(/\[KEY\]/g, key),
        headers: {
          Accept: 'application/cpc.config-v2+json',
          Authorization: 'CONFIG-TOKEN token=' + secret,
        },
      };
    }

    this.makeConfigRequest = function(key, secret, callback) {
      var handler = new RequestHandler(callback);
      var settings = getRequestSettings(key, secret);
      var request = requestFactory.newRequest(settings);
      request.execute(handler.onSuccess, handler.onFailure);
    };
  }

  /*
   * Makes asyncronous requests to the concurrency endpoint
   * @param {Object} requestFactory - Creates Request objects for retrieving data
   *	from a web service
   *
   *	@see http://docs.adobeptime.io/cm-api-v2/
   */
  function ConcurrencyRequestMediator(requestFactory) {
    function RequestHandler(success, failure) {
      this.onSuccess = function(data, textStatus, jqXHR) {
        // "this" is a reference to the ajax settings
        success.call(this, data, textStatus, jqXHR);
      };

      this.onFailure = function(jqXHR, textStatus, errorThrown) {
        // "this" is a reference to the ajax settings
        failure.call(this, jqXHR, textStatus, errorThrown);
      };
    }

    this.makeSessionRequest = function(settings, onSuccess, onFailure) {
      var handler = new RequestHandler(onSuccess, onFailure);
      var request = requestFactory.newRequest(settings);
      request.execute(handler.onSuccess, handler.onFailure);
    };
  }

  /*
   * Makes asyncronous requests to the geo service to retrieve asset metadata
   * @param {Object} requestFactory - Creates Request objects for retrieving data
   *	from a web service
   * @param {Object} userMetadataProvider Provides usermetadata
   * @param {Object} settingsTemplate - Template for the AJAX request. Replaceable
   *	string tokens should be surrounded with "@" symbols, e.g., ` @MVPD_ID@ `
   *
   *	@see https://mediaservices.docs.apiary.io/#reference/media/geo-version-1
   */
  function GeoRequestMediator(requestFactory, userMetadataProvider, settingsTemplate) {
    var logger = new Logger('GeoRequestMediator');

    function debug(str) {
      logger.log(str);
    }

    function RequestHandler(success, failure) {
      this.onSuccess = function(data, textStatus, jqXHR) {
        if (data && data.hasOwnProperty('restricted')) {
          success(data);
        } else {
          failure();
        }
      };

      this.onFailure = function(jqXHR, textStatus, errorThrown) {
        debug('**onFailure');
        failure();
      };
    }

    function replaceKeys(str) {
      debug('replaceKeys :: template string is ' + str);
      var usermetadata = userMetadataProvider.getUserMetadata();
      str = str.replace('@MVPD_ID@', usermetadata.adobeMvpdId);
      str = str.replace('@MVPD_HOMEZIP@', usermetadata.serviceZip ? usermetadata.serviceZip : '');
      str = str.replace('@MVPD_ENCRYPTED_HOMEZIP@', usermetadata.encryptedZip ? usermetadata.encryptedZip : '');
      return str;
    }

    function getRequestSettings() {
      var str = replaceKeys(settingsTemplate);
      debug('executeWhenReady: ' + str);
      return JSON.parse(str);
    }

    this.execute = function(onSuccess, onFailure) {
      var handler = new RequestHandler(onSuccess, onFailure);
      var request = requestFactory.newRequest(getRequestSettings());
      request.execute(handler.onSuccess, handler.onFailure);
    };
  }

  /*
   * This creates requests and handles responses from the metadata service. It
   * generates a ContenteMetadata instance with values from the response.
   *
   * @param {Object} requestFactory - Creates Request objects for retrieving ad
   *	params from a web service
   */
  function MetadataRequestMediator(requestFactory) {
    var logger = new Logger('MetadataRequestMediator');

    var requestSettings;

    function RequestHandler(cio, callback) {
      var source = cio;

      function newContentMetadata() {
        return new ContentMetadata(source);
      }

      this.onSuccess = function(data, textStatus, jqXHR) {
        if (data && data.hasOwnProperty('metadata')) {
          source = data.metadata;
        }

        callback(newContentMetadata());
      };

      // just return the default ContentMetadata when the web service fails
      this.onFailure = function(jqXHR, textStatus, errorThrown) {
        callback(newContentMetadata());
      };
    }

    function getRequestSettingsForCIO(cio) {
      if (!requestSettings || 'string' !== typeof requestSettings) {
        return null;
      }

      var str = requestSettings.replace(/@VIDEO_ID@/g, cio.videoId);
      var obj;
      try {
        obj = JSON.parse(str);
      } catch (err) {
        logger.warn('Unable to parse settings string');
      }
      return obj;
    }

    this.setRequestSettings = function(settings) {
      requestSettings = settings;
    };

    /*
     * @param {NBCUniCPC.ContentInitializationObject} cio - An instance of
     *	NBCUniCPC.ContentInitializationObject
     * @param {MetadataRequestMediator~buildCallback} callback - The callback to be
     *	invoked after the ad parameters have been retrieved and parsed.
     */
    this.getMetadata = function(cio, callback) {
      var settings = getRequestSettingsForCIO(cio);
      var request = requestFactory.newRequest(settings);
      var handler = new RequestHandler(cio, callback);
      request.execute(handler.onSuccess, handler.onFailure);
    };
  }

  /**
   * The callback that will be invoked after the metadata have been retrieved
   * and parsed.
   *
   * @callback MetadataRequestMediator~buildCallback
   * @param {ContenteMetadata} contentMetadata - A ContenteMetadata instance with the response
   * values as the data source.
   */

  /**
   * This class is a stub for player configurations that do not support features
   * that require HTTP requests. It contains stub implementations for all methods
   * by the Request interface. This class implements a singleton pattern
   * as recommended by the Refactoring book.
   */
  var NullRequest = (function NullRequest(lock) {
    'use strict';
    var instance;

    function Singleton(caller) {
      if (instance || caller !== lock) {
        throw new Error('NullRequest is a singleton. Use NullRequest.getInstance() instead.');
      }
      var response = {};
      this.execute = function(success, fail) {
        success(response);
      };

      instance = this;
    }

    Singleton.getInstance = function() {
      return instance || new Singleton(lock);
    };

    return Singleton;
  })({});

  /**
   * Creates Request instances for web requests
   *
   * @param {Object} jQueryProxy - Provides an instance of jQuery through a
   * callback
   */
  function RequestFactory(jQueryProxy) {
    function Request(settings) {
      var _onSuccess, _onFailure, _jQuery;

      function executeWhenReady() {
        _jQuery
          .ajax(settings)
          .done(_onSuccess)
          .fail(_onFailure);
      }

      function onJQuery(jq) {
        _jQuery = jq;
        executeWhenReady();
      }

      function run() {
        jQueryProxy.getJQuery(onJQuery);
      }

      this.execute = function(onSuccess, onFailure) {
        _onSuccess = onSuccess;
        _onFailure = onFailure;
        run();
      };
    }

    function hasSomewhatValidSettings(settings) {
      return settings && settings.hasOwnProperty('url') && 'string' === typeof settings.url && settings.url.length > 0;
    }
    /**
     * @param {object} settings - Settings for an AJAX request.
     * @see http://api.jquery.com/jquery.ajax/
     *
     * @returns {object} A new Request instance.
     */
    this.newRequest = function(settings) {
      return hasSomewhatValidSettings(settings) ? new Request(settings) : NullRequest.getInstance();
    };
  }

  /*
   * Makes asyncronous requests to the geo service to retrieve asset metadata
   * @param {Object} requestFactory - Creates Request objects for retrieving data
   *	from a web service
   *
   *	@see https://cloudpathservicesaccessnode.docs.apiary.io/#reference/live-stream-temppass/post
   */
  function TempPassRequestMediator(requestFactory) {
    var logger = new Logger('TempPassRequestMediator');

    function debug(str) {
      logger.log(str);
    }

    function RequestHandler(success, failure) {
      this.onSuccess = function(data, textStatus, jqXHR) {
        success(data, textStatus, jqXHR);
      };

      this.onFailure = function(jqXHR, textStatus, errorThrown) {
        failure(jqXHR);
      };
    }

    function getTimestampInMilliseconds() {
      var d = new Date();
      return d.getTime() * 1000;
    }

    function replaceKeys(str, deviceId) {
      str = str.replace(/@TIMESTAMP@/g, getTimestampInMilliseconds());
      str = str.replace(/@DEVICE_ID@/g, deviceId);

      return str;
    }

    function getRequestSettings(settingsTemplate, deviceId) {
      var str = replaceKeys(settingsTemplate, deviceId);
      debug('getRequestSettings: ' + str);
      return JSON.parse(str);
    }

    this.getSessionConfig = function(settingsTemplate, deviceId, onSuccess, onFailure) {
      var handler = new RequestHandler(onSuccess, onFailure);
      var settings = getRequestSettings(settingsTemplate, deviceId);
      var request = requestFactory.newRequest(settings);
      request.execute(handler.onSuccess, handler.onFailure);
    };
  }

  var RPEventConstants = {
    END_CARD_REPLAY_CLIP_EVENT: 'endCardReplayClipEvent',
    END_CARD_COUNTDOWN_TIMER_COMPLETE_EVENT: 'endCardCountdownTimerCompleteEvent',
    END_CARD_PLAY_NEXT_ITEM_EVENT: 'endCardPlayNextItemEvent',
  };

  var RPEventConstants;
  var RPHelperEvents = {
    win: window,
  };
  RPHelperEvents.handlerFunction = null;
  RPHelperEvents.allowedOrigins = [
    'player.theplatform.com',
    'tverationalplayer-stage.akamaized.net',
    'tverationalplayer.akamaized.net',
    'nbc.com',
    'nbcuni.com',
  ];

  RPHelperEvents.handleEvent = function(event) {
    if (RPHelperEvents.canHandleEvent(event) && typeof RPHelperEvents.handlerFunction === 'function') {
      RPHelperEvents.handlerFunction(event);
    }
  };

  RPHelperEvents.canHandleEvent = function(event) {
    return this.isAllowedOrigins(event.origin) && this.isAllowedEventType(event.data.type);
  };

  RPHelperEvents.isAllowedEventType = function(type) {
    var items = Object.keys(RPEventConstants).map(function(e) {
      return RPEventConstants[e];
    });
    var found = items.find(function(element) {
      return element === type;
    });
    return found !== undefined;
  };

  RPHelperEvents.isAllowedOrigins = function(origin) {
    for (var i = 0; i < this.allowedOrigins.length; i++) {
      var expectedIndex = origin.length - this.allowedOrigins[i].length;
      var actualIndex = origin.indexOf(this.allowedOrigins[i]);
      var precedingCharacter = origin.charAt(actualIndex - 1);
      if (actualIndex === expectedIndex && (precedingCharacter === '.' || precedingCharacter === '/')) {
        return true;
      }
    }
    return false;
  };

  RPHelperEvents.subscribeToEvents = function(handlerFunction) {
    this.handlerFunction = handlerFunction;
    if (typeof this.win.addEventListener !== 'undefined') {
      this.win.addEventListener('message', RPHelperEvents.handleEvent, false);
    } else if (typeof this.win.attachEvent !== 'undefined') {
      this.win.attachEvent('onmessage', RPHelperEvents.handleEvent);
    }
  };

  var RPHelper = {
    ltlg: {},
    documentQueryParams: {},
    in_url: '',
    ssid: '',
    fssid_m: '',
    fssid_d: '',
    mvpdid: '',
    adPolicy: '',
    isProd: '',
    includeGeoInAdRequest: false,
    completion: null,
    PLAYER_URL: 'player_url',
    SELECTOR_URL: 'selector_url',
    SUCCESS: 'success',
    FAILURE: 'failure',
    isCoppaCompliant: false,
    AAM_COOKIE_NAME: 'vpsegs',
    AAM_PARAM_NAME: 'aam_segments',
    FW_ID_COOKIE_NAME: '_uid',
    FW_ID_PARAM_NAME: '_fw_vcid2',
    adsModuleParams: {},
  };

  RPHelper.doQuerySearch = function(searchStr) {
    var dictionary = {};
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function(s) {
        return decodeURIComponent(s.replace(pl, ' '));
      },
      query = searchStr;

    while ((match = search.exec(query))) {
      dictionary[decode(match[1])] = decode(match[2]);
    }
    return dictionary;
  };

  RPHelper.normalizeURL = function(url) {
    return url.slice(0, url.indexOf('#') >= 1 ? url.indexOf('#') : url.length);
  };

  (function() {
    // convert MVPD"s to lowerCase();
    var newHashMap = {};
    for (var i in window.mvpdHashMap) {
      newHashMap[i.toString().toLowerCase()] = window.mvpdHashMap[i];
    }
    window.mvpdHashMap = newHashMap;

    RPHelper.documentQueryParams = RPHelper.doQuerySearch(window.location.search.substring(1));
  })();

  RPHelper.getUserGeoLocation = function() {
    if (navigator.geolocation && 'function' === typeof navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(this.setUserGeoLocation, this.onGeoError);
    } else {
      //Geolocation not supported.  Do nothing
      RPHelper.prepSSAI();
    }
  };

  RPHelper.setUserGeoLocation = function(position) {
    //set ltlg param to position.coords.latitude + "," + position.coords.longitude
    RPHelper.ltlg = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    RPHelper.prepSSAI();
  };

  RPHelper.onGeoError = function(error) {
    console.warn('**RPHelper unable to calculate client location.');
    RPHelper.prepSSAI();
  };

  RPHelper.convertParamKeysToLower = function() {
    var items = {};
    for (var item in RPHelper.documentQueryParams) {
      items[item.toString().toLowerCase()] = RPHelper.documentQueryParams[item];
    }
    return items;
  };

  function fw_isMobile() {
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|webos|playbook|silk/i.test(navigator.userAgent);
  }

  function getHostname() {
    return window.location.hostname || '';
  }

  function addNormalParam(name, value, obj) {
    obj.kvobj[name] = value;
  }

  function addParamParam(name, value, obj) {
    if (obj.urlType === RPHelper.PLAYER_URL) {
      obj.paramsparams[name] = value;
    } else {
      addNormalParam(name, value, obj);
    }
  }
  /**
   * Convert a URL into an object with the following properties:
   * @property {String} baseURL The complete URL before "?" or "#"
   * @property {String} urlType One of either "player_url" or "selector_url". When
   * the provided url starts with "link", then the urlType value will be
   * "selector_url"; otherwise, the value will be "player_url".
   * @property {Object} kvobj (key value object) Holds key value pairs from the
   * query string as an object/hash/dictionary
   * @property {Object} paramsparams (params parameters object) Holds decoded key-
   * value pairs for the special "params" query string value as an
   * object/hash/dictionary
   *
   * @param {String} url The original url to be modified to support SSAI (can be a
   * player url or a selector url)
   * */
  function playerURLToObj(url) {
    var _url = RPHelper.normalizeURL(url);
    var arr = _url.split('?');
    var _baseURL = arr[0];
    var _queryParams = arr[1] || '';
    var obj = {
      baseURL: _baseURL,
      urlType: _url.split('.')[0].indexOf('link') >= 0 ? RPHelper.SELECTOR_URL : RPHelper.PLAYER_URL,
      kvobj: {},
      paramsparams: {},
    };

    var kvpairs = _queryParams.indexOf('=') >= 1 ? _queryParams.split('&') : [];
    var k, kv;
    for (k in kvpairs) {
      kv = kvpairs[k].split('=');
      obj.kvobj[kv[0]] = kv[1];
    }
    if (obj.kvobj.hasOwnProperty('params')) {
      var decodedParams = decodeURIComponent(obj.kvobj.params);
      // check if this parameter is doubly-encoded, if so, double-decode it
      if (decodedParams.indexOf('=') < 0) {
        decodedParams = decodeURIComponent(decodedParams);
      }

      var paramspairs = decodedParams.indexOf('=') >= 1 ? decodedParams.split('&') : [];
      for (k in paramspairs) {
        kv = paramspairs[k].split('=');
        obj.paramsparams[kv[0]] = kv[1];
      }
    }

    return obj;
  }
  /**
   * Convert a playerURLToObj object to a properly formatted URL
   * */
  function objToPlayerURL(obj) {
    var k;
    var kvpairs = [];
    var paramspairs = [];
    for (k in obj.paramsparams) {
      paramspairs.push(k + '=' + obj.paramsparams[k]);
    }
    obj.kvobj.params = encodeURIComponent(paramspairs.join('&'));

    for (k in obj.kvobj) {
      kvpairs.push(k + '=' + obj.kvobj[k]);
    }

    var qs = kvpairs.join('&');
    return obj.baseURL + '?' + qs;
  }
  RPHelper.setAuthToken = function(url, token) {
    var o = playerURLToObj(url);
    addParamParam('auth', token, o);
    return objToPlayerURL(o);
  };
  RPHelper.addTearsheetSupport = function(url) {
    var documentQueryParams = this.convertParamKeysToLower();
    if (!('fwcampaignid' in documentQueryParams)) {
      return url;
    }

    var o = playerURLToObj(url);
    var cookieTemplateString =
      '_ro%3DCandidate-Ads%3D@@campaignToken@@%3BInternal-Call%3BOpt-Out%3BTesting-Placement%3B%3B';
    var cookie = cookieTemplateString.replace('@@campaignToken@@', documentQueryParams.fwcampaignid);
    addParamParam('cookie', cookie, o);
    return objToPlayerURL(o);
  };

  function updateManifest(o) {
    if (!('manifest' in o.paramsparams)) {
      addParamParam('manifest', 'manifest' in o.kvobj ? o.kvobj.manifest : 'm3u', o);
    }
  }

  function updateSwitch(o) {
    if (!('switch' in o.paramsparams)) {
      addParamParam('switch', 'switch' in o.kvobj ? o.kvobj.switch : 'HLSOriginSecure', o);
    }
  }

  RPHelper.prepSSAI = function() {
    var aam_values = this.getAAMCookie();
    var fw_uid = this.getFWuidCookie();

    var o = playerURLToObj(this.in_url);

    if (this.mvpdid !== undefined && this.mvpdid !== '') {
      addParamParam('_fw_ae', mvpdHashMap[this.mvpdid.toString().toLowerCase()], o);
    }
    if (this.adPolicy !== undefined && this.adPolicy !== '') {
      addParamParam('policy', this.adPolicy, o);
    }

    var baseSiteSectionId = this.ssid || '';
    addParamParam('fallbackSiteSectionId', this.fssid_d || '', o);
    addParamParam('siteSectionId', baseSiteSectionId, o);
    if (fw_isMobile()) {
      addParamParam('fallbackSiteSectionId', this.fssid_m || '', o);
      addParamParam('siteSectionId', baseSiteSectionId + '_mobile', o);
    }

    updateManifest(o);
    updateSwitch(o);

    if (this.includeGeoInAdRequest && 'lat' in this.ltlg && 'lon' in this.ltlg) {
      addParamParam('ltlg', this.ltlg.lat + ',' + this.ltlg.lon, o);
    }

    // https://theplatform.jira.com/browse/NBCUTP-6970
    // Add MVPDid as a first order query param
    addNormalParam('MVPDid', this.mvpdid, o);

    if (aam_values.length) {
      addParamParam(this.AAM_PARAM_NAME, aam_values.join(','), o);
    }

    // https://theplatform.jira.com/browse/NBCUTP-7720
    if (fw_uid) {
      addParamParam(this.FW_ID_PARAM_NAME, fw_uid, o);
    }

    // https://theplatform.jira.com/browse/NBCUTP-7470 (Add _fw_h_referer | Syfy)
    addParamParam('_fw_h_referer', getHostname(), o);

    //https://theplatform.jira.com/browse/NBCUTP-7511 (Add schema=2.0 | Enable ad
    //grace period)
    addParamParam('schema', '2.0', o);

    for (var prop in this.adsModuleParams) {
      addParamParam(prop, this.adsModuleParams[prop], o);
    }

    this.ltlg = {};
    if (this.completion) {
      this.completion(objToPlayerURL(o));
    }
  };

  RPHelper.validateCampaignId = function(id, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      var resp = {
        result: RPHelper.SUCCESS,
      };
      if (this.readyState === 4) {
        if (this.status !== 200) {
          resp = {
            result: RPHelper.FAILURE,
          };
        }
        callback(resp);
      }
    };

    var placementUrl = 'https://api.freewheel.tv/services/placement/' + id + '.xml';
    var token = '2d3071db5b2f';
    xmlHttp.open('GET', placementUrl);
    xmlHttp.setRequestHeader('X-FreeWheelToken', token);
    xmlHttp.send(null);
  };

  RPHelper.parseCookie = function(cookieName) {
    var currCookieLabel,
      currCookieValue,
      cookieArr = document.cookie.split(';');
    for (var i = 0; i < cookieArr.length; i++) {
      currCookieLabel = cookieArr[i].substr(0, cookieArr[i].indexOf('='));
      currCookieValue = cookieArr[i].substr(cookieArr[i].indexOf('=') + 1);
      currCookieLabel = currCookieLabel.replace(/^\s+|\s+$/g, '');
      if (currCookieLabel === cookieName) {
        return currCookieValue;
      }
    }
    return null;
  };

  RPHelper.getAAMCookie = function() {
    var aamValues = [];
    var cList;
    var value = this.parseCookie(this.AAM_COOKIE_NAME);
    if (value) {
      cList = value.split('%3D');
      if (typeof cList[1] !== 'undefined' && cList[1].match(/\w+/)) {
        var vList = cList[1].split('%2C');
        if (typeof vList[0] !== 'undefined') {
          aamValues = vList;
        }
      }
    }
    // limit values to a max of 200
    return aamValues.slice(0, 200);
  };

  RPHelper.getFWuidCookie = function() {
    return this.parseCookie(this.FW_ID_COOKIE_NAME);
  };

  function addTearsheetSupport(playerURL, isProd) {
    var documentQueryParams = RPHelper.convertParamKeysToLower();
    RPHelper.isProd = isProd;
    if (!('fwcampaignid' in documentQueryParams)) {
      return playerURL;
    }
    return RPHelper.addTearsheetSupport(RPHelper.normalizeURL(playerURL));
  }

  function updateAdsModuleParameters(fwOptions) {
    // list of known parameters from the ads module service
    // @see https://cloudpathservicesaccessnode.docs.apiary.io/#reference/ad-params/retrieve-ad-parameters/post
    var adsModuleParams = [
      'mode',
      'uuid',
      'did',
      'am_crmid',
      'am_playerv',
      'am_sdkv',
      'am_appv',
      'am_buildv',
      'am_stitcherv',
      'uoo',
      'am_cpsv',
      'metr',
      'prof',
      'am_extmp',
      'am_abvrtd',
      'am_abtestid',
      'afid',
      'sfid',
      'csid',
      'nw',
      'userAgent',
      'fw_ae', // note the lack of an underscore
      '_fw_did',
    ];

    RPHelper.adsModuleParams = {};
    for (var i in adsModuleParams) {
      var name = adsModuleParams[i];
      var value = fwOptions[name];
      if (value) {
        RPHelper.adsModuleParams[name] = value;
      }
    }
  }

  /**
   * Information passed by the page that is used to populate values in the SSAI
   * freewheel request.
   * @typedef {Object}  fwOptions
   * @property {String} fwSiteSection - The base site section for this page.
   * @property {String} fallbackSiteSectionIdMobile -  The mobile fallback site
   * section id for this page
   * @property {String} fallbackSiteSectionIdDesktop - The desktop fallback site
   * section id for this page
   * @property {String} mvpd - The mvpd used to authenticate.  Null if non-
   * authenticated content
   * @property {String} adPolicy - The Freewheel SSAI ad policy this player should
   * use.  Null if it should use media's default.
   * @property {Boolean} isCoppaCompliant - Indicates whether a sire is coppa-
   * compliant or not.  This will impact what tracking is available.  Defaults to
   * <code>false<code>.
   */

  /**
   * @param {String} url - The original url to be modified to support SSAI (can be
   * a player url or a selector url)
   * @param {Object} fwOptions - An object containing the freewheel related
   * information.  Object definition defined above.
   * @param {Boolean} isProd - Boolean to indicate if this is a prod or non-prod
   * environment
   * @param {Boolean} includeGeoInAdRequest - Flag to indicate whether the page
   * should calculate the geo location client side to send to freewheel as part of
   * ad requests (only used for mobile)
   * @param {requestCallback} completion - The callback that handles the new url
   **/
  function prepSSAI(url, fwOptions, isProd, includeGeoInAdRequest, completion) {
    updateAdsModuleParameters(fwOptions);

    var options = {
      fwsitesection: undefined,
      fallbacksitesectionidmobile: undefined,
      fallbacksitesectioniddesktop: undefined,
      mvpd: undefined,
      adpolicy: undefined,
      iscoppacompliant: false,
    };

    for (var item in fwOptions) {
      var prop = item.toString().toLowerCase();
      if (prop in options && fwOptions[item] !== undefined) {
        options[prop] = fwOptions[item];
      }
    }

    if (options.mvpd === '' || options.mvpd === undefined || options.mvpd === null) {
      RPHelper.mvpdid = '';
    } else {
      RPHelper.mvpdid = options.mvpd;
    }
    if (options.adpolicy === '' || options.adpolicy === undefined || options.adpolicy === null) {
      RPHelper.adPolicy = '';
    } else {
      RPHelper.adPolicy = options.adpolicy;
    }
    if (options.iscoppacompliant !== '') {
      RPHelper.isCoppaCompliant = options.iscoppacompliant;
    } else {
      RPHelper.isCoppaCompliant = false;
    }

    RPHelper.in_url = RPHelper.normalizeURL(url);
    RPHelper.ssid = options.fwsitesection;
    RPHelper.fssid_m = options.fallbacksitesectionidmobile;
    RPHelper.fssid_d = options.fallbacksitesectioniddesktop;
    RPHelper.isProd = isProd;
    RPHelper.includeGeoInAdRequest = includeGeoInAdRequest;
    RPHelper.completion = completion;

    if (includeGeoInAdRequest) {
      console.log('**includeGeoInAdRequest');
      RPHelper.getUserGeoLocation();
    } else {
      RPHelper.prepSSAI();
    }
  }

  function setAuthToken(url, token) {
    var _url = RPHelper.normalizeURL(url);
    return RPHelper.setAuthToken(_url, token);
  }

  /**
   *
   * @desc A facade for interacting with an underlying video player. A
   * <code>Player</code> instance is intended to replace '$pdk.controller' &
   * 'anvp' objects when interacting with video players. The <code>Player</code>
   * class is not meant to be instantiated by consumers of the CloudPath Client,
   * but an instance of it is returned when loading a video.
   *
   * @param {object} concretePlayer This is the underlying video player, which
   * acts as the command receiver.
   * @see {@tutorial Basic Example}
   * @see Controller#loadEvent
   * @constructor
   *
   * @fires NBCUniCPC.Event.AdEvent
   * @fires NBCUniCPC.Event.CaptionStateEvent
   * @fires NBCUniCPC.Event.CompanionAdEvent
   * @fires NBCUniCPC.Event.UserInteractionEvent
   * @fires NBCUniCPC.Event.VideoStateChangeEvent
   * @fires NBCUniCPC.Event.ProgramChangedEvent
   * @fires NBCUniCPC.Event.SegmentTypeChangedEvent
   * @fires NBCUniCPC.Event.PlayerErrorEvent
   */
  function Player(concretePlayer) {
    /**
     * This class implements the command pattern to delay calls to the underlying
     * video player until the player is ready. The class itself acts as the
     * command client. The concretePlayer is the receiver.
     *
     * @see https://en.wikipedia.org/wiki/Command_pattern
     */

    var commandQueue = []; // holds the list of commands to execute
    var playerReady = false; // indicates when the player is ready to receive commands
    var pickerRequested = false; // indicates when the player is ready to receive commands

    /**
     * Invoker function
     */
    function emptyQueueWhenReady() {
      if (playerReady) {
        var shifted;
        while ((shifted = commandQueue.shift())) {
          shifted.execute();
        }
      }
    }

    function onPlayerReady(evt) {
      concretePlayer.removeEventListener(NBCUniCPC.Event.PLAYBACK_READY, onPlayerReady);

      playerReady = true;
      emptyQueueWhenReady();
    }

    function onPickerRequested(evt) {
      concretePlayer.removeEventListener(NBCUniCPC.Event.PICKER_REQUESTED, onPickerRequested);
      pickerRequested = true;
    }

    /**
     * bookkeeping for the invoker
     *
     * @param {object} command A command object
     * @see newCommand
     */
    function invokeWhenReady(command) {
      commandQueue.push(command);
      emptyQueueWhenReady();
    }

    /**
     * Factory method to generate command objects
     *
     * @param {string} fname The name of the function to invoke
     * @param {Array} args The array-like arguments property of a javascript
     * function
     * @return {object}	A command object containing receiver and method info.
     */
    function newCommand(fname, args) {
      return {
        execute: function() {
          concretePlayer[fname].apply(concretePlayer, args);
        },
      };
    }

    /**
     * Add and remove event listeners immediately; startup events could
     * conceivably happen before the rest of the player API is ready, so there is
     * no need to put these in the command queue
     */

    /**
     * Registers an event listener object with an EventDispatcher object so that
     * the listener receives notification of an event.
     *
     * @param {string} type The type of event
     * @param {function} callback The listener function that processes the event.
     *
     * @see NBCUniCPC.Event
     *
     */
    this.addEventListener = function(type, callback) {
      concretePlayer.addEventListener(type, callback);
    };

    /**
     * Removes a listener from the EventDispatcher object. If there is no matching
     * listener registered with the EventDispatcher object, a call to this method
     * has no effect.
     *
     * @param {string} type - The type of event
     * @param {function} callback - The listener function that processes the event.
     *
     * @see NBCUniCPC.Event
     */
    this.removeEventListener = function(type, callback) {
      concretePlayer.removeEventListener(type, callback);
    };

    /**
     *
     * adds a specified card to the player
     * @param {string} deckId - the id of the deck to add the card to (i.e. "rational-pause-deck")
     * @param {string} cardId - the id of the card being added (i.e. "rational-pause-card")
     * @param {object} config - the custom configuration for the card
     * */
    this.addPlayerCard = function(deckId, cardId, config) {
      invokeWhenReady(newCommand('addPlayerCard', arguments));
    };

    /**
     * Starts Authentication process
     */
    this.authenticate = function() {
      invokeWhenReady(newCommand('authenticate', arguments));
    };

    /**
     * Triggers a {@link NBCUniCPC.Event.event:CaptionStateEvent} event
     *
     * @example
     * function onCaptionStateEvent(evt)
     * {
     *	console.log("captions enabled: " + evt.data.enabled);
     * }
     *
     * player.addEventListener(NBCUniCPC.Event.CAPTION_STATE_EVENT, onCaptionStateEvent);
     * player.getCaptionsEnabled();
     *
     */
    this.getCaptionsEnabled = function() {
      invokeWhenReady(newCommand('getCaptionsEnabled', arguments));
    };

    /**
     * Request a style object.
     * Will trigger a NBCUniCPC.Event.SUBTITLE_STYLE event
     * @returns nothing.
     */
    this.getSubtitleStyle = function() {
      invokeWhenReady(newCommand('getSubtitleStyle', arguments));
    };

    /**
     * Request for VolumeEvent to be dispatched with current player volume level
     */
    this.getVolume = function() {
      invokeWhenReady(newCommand('getVolume', arguments));
    };

    /**
     * Request for linear player to seek to the latest point in the stream
     */
    this.goLive = function() {
      invokeWhenReady(newCommand('goLive', arguments));
    };

    /**
     * Hide UI for controls.
     */
    this.hideControlBar = function() {
      invokeWhenReady(newCommand('hideControlBar', arguments));
    };

    /**
     *
     * mutes player
     * */
    this.mute = function() {
      invokeWhenReady(newCommand('mute', arguments));
    };

    /**
     * Pauses/unpauses playback.
     * @param {boolean} bool - true will pause, false will unpause
     */
    this.pause = function(bool) {
      invokeWhenReady(newCommand('pause', arguments));
    };

    /**
     * Initiates content playback if the stream is loaded and autoPlay is false.
     * If playback has started and content is paused, resumes playback.
     */
    this.play = function() {
      invokeWhenReady(newCommand('play', arguments));
    };

    /**
     * Seeks to the specified position in the video.
     * @param {number} ms - The position of the asset to seek to, in milliseconds
     */
    this.seekToMilliseconds = function(ms) {
      invokeWhenReady(newCommand('seekToMilliseconds', arguments));
    };

    /**
     * Enables/disables captions.
     * @param {boolean} bool - true will enable captions, false will disable captions
     */
    this.setCaptionsEnabled = function(bool) {
      invokeWhenReady(newCommand('setCaptionsEnabled', arguments));
    };

    /**
     *
     * @param {string} url - the URL to thePlatform media, e.g. 'http://link.theplatform.com/s/dCK2IC/wvMj2Ctnu_lY'
     */
    this.setReleaseURL = function(url) {
      invokeWhenReady(newCommand('setReleaseURL', arguments));
    };

    /**
     * Sets selected provider for entitlement with Adobe Pass
     *
     * @param {string} provider - A valid MVPD ID registered with Adobe Pass (Case sensitive)
     */
    this.setSelectedProvider = function(provider) {
      if (pickerRequested) {
        concretePlayer.setSelectedProvider(provider);
      } else {
        invokeWhenReady(newCommand('setSelectedProvider', arguments));
      }
    };

    /**
     * Takes a style object and translates it to vendor calls.
     * @param {SubtitleStyle} subtitleStyle - instance of {@link NBCUniCPC.SubtitleStyle}
     */
    this.setSubtitleStyle = function(style) {
      invokeWhenReady(newCommand('setSubtitleStyle', arguments));
    };

    /**
     * Set AuthZ token manually. For page-level entitlement.
     * @param {string} token - the AuthZ token supplied by page-level Adobe Pass.
     * Must be URL encoded, use JavaScript's built in `encodeURIComponent` method.
     * @param {string} [type=authToken] - the type of token, defaults to "authToken"
     * @deprecated Use {@link PlayerParameters.encodedAuthorizationToken} instead
     */
    this.setToken = function(token, type) {
      if (!type) {
        this.setToken(token, 'authToken');
      } else {
        invokeWhenReady(newCommand('setToken', arguments));
      }
    };

    /**
     * Sets volume level.
     * @param {number} level - A percentage value from 0 to 1.
     */
    this.setVolume = function(level) {
      invokeWhenReady(newCommand('setVolume', arguments));
    };

    /**
     * Show UI for controls.
     */
    this.showControlBar = function() {
      invokeWhenReady(newCommand('showControlBar', arguments));
    };

    /**
     *
     * Destroys the player iframe, should shut-down communication.
     */
    this.unload = function() {
      invokeWhenReady(newCommand('unload', arguments));
    };

    /**
     * unmutes player
     */
    this.unmute = function() {
      invokeWhenReady(newCommand('unmute', arguments));
    };

    concretePlayer.addEventListener(NBCUniCPC.Event.PLAYBACK_READY, onPlayerReady);
    concretePlayer.addEventListener(NBCUniCPC.Event.PICKER_REQUESTED, onPickerRequested);
  }

  NBCUniCPC.utils = NBCUniCPC.utils || {};
  // https://stackoverflow.com/a/105074
  NBCUniCPC.utils.guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
  NBCUniCPC.utils.Storage = {
    // h/t https://stackoverflow.com/a/15724300
    getItem: function(name) {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
        return parts
          .pop()
          .split(';')
          .shift();
      }

      return null;
    },

    setItem: function(name, value) {
      document.cookie = name + '=' + value + '; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT';
    },
  };
  NBCUniCPC.utils.shallowCopy = function(obj) {
    var copy = {};
    for (var prop in obj) {
      copy[prop] = obj[prop];
    }

    return copy;
  };

  /**
   * All the functionality for the CloudPath Client is contained in the <code>NBCUniCPC</code> namespace.
   * @namespace NBCUniCPC
   */
  var inited;
  var parser;
  var factory;
  var embedStrategyProvider;
  var pdkProxy;
  var jQueryProxy;
  var accessEnablerProxy;
  var entitlementManager;
  var configLoader;
  var serverURL;
  var monitor;
  var apCore;
  var urlBuilder;
  var requestFactory;

  function init() {
    if (typeof serverURL === 'undefined') {
      NBCUniCPC.setServerUrl(); // set server to default
    }
    NBCUniCPC.Config = NBCUniCPC.Config || {
      LIVE: {},
      VOD: {},
    };
    pdkProxy = new PDKProxy();
    jQueryProxy = new JQueryProxy();
    requestFactory = new RequestFactory(jQueryProxy);
    accessEnablerProxy = new AccessEnablerProxy(new AccessEnablerWrapper(new EventDispatcher(), window));
    parser = new ConfigParser(NBCUniCPC.Config, ConfigDefaults);
    factory = new PlayerWrapperFactory(pdkProxy, serverURL, RPHelperEvents);
    var tempPass = new TempPassAuthentication(
      new EventDispatcher(),
      new TempPassRequestMediator(requestFactory),
      NBCUniCPC.utils.Storage,
    );
    apCore = new AdobePassCore(new EventDispatcher(), accessEnablerProxy, tempPass);
    urlBuilder = new PDK6URLBuilder(
      {
        prepSSAI: prepSSAI,
        addTearsheetSupport: addTearsheetSupport,
        setAuthToken: setAuthToken,
      },
      apCore,
    );
    embedStrategyProvider = new AsyncEmbedStrategyFactory(
      requestFactory,
      accessEnablerProxy,
      pdkProxy,
      jQueryProxy,
      apCore,
      urlBuilder,
    );
    configLoader = new AsyncConfigLoader(
      new AsyncConfigRequestMediator(requestFactory, serverURL + '/cpc/ws/services/config?key=[KEY]'),
      new EventDispatcher(),
    );
    monitor = new MonitorManager(requestFactory);

    inited = true;
  }

  NBCUniCPC.getVersion = function() {
    return ''; // This value is assigned by the build server
  };

  /**
   * Allows the client to load a config from a non-production config server. Check
   * with the CPC team for which server to use if required.
   *
   * @param {string} url - A URL in the format "https://ws-cloudpath.media.nbcuni.com"
   */
  NBCUniCPC.setServerUrl = function(url) {
    switch (url) {
      case 'https://rsngc-dev.cdn.nbcuni.com':
      case 'https://rsngc-stage.cdn.nbcuni.com':
      case 'https://ws-cloudpath.nbcuni.com':
      case 'https://ws-cloudpath-dev.media.nbcuni.com':
      case 'https://ws-cloudpath-tempdev.media.nbcuni.com':
      case 'https://ws-cloudpath-qa.media.nbcuni.com':
      case 'https://ws-cloudpath-stage.media.nbcuni.com':
        serverURL = url;
        break;
      default:
        serverURL = 'https://ws-cloudpath.media.nbcuni.com';
    }
  };

  /**
   * @see Controller#loadConfig
   * @see Controller#loadEvent
   *
   * @param {string} htmlId - The ID of an existing HTML element that will be
   * replaced with a player
   * @param {string} account - The account (a.k.a brand or channel) associated
   * with the media and player
   * @param {ContentInitializationObject} contentInitializationObject - an
   * instance of {@link NBCUniCPC.ContentInitializationObject}
   * @param {PlayerParameters} [playerParameters] - an instance of
   * {@link NBCUniCPC.PlayerParameters}
   *
   * @throws Will throw an error if any of the required parameters is missing
   * @deprecated Use <code>NBCUniCPC.controller.loadConfig</code> and <code>NBCUniCPC.controller.loadEvent</code> instead.
   */
  NBCUniCPC.load = function(htmlId, account, contentInitializationObject, playerParameters) {
    if (!htmlId || !account || !contentInitializationObject) {
      throw new Error('[CPC] load() requires an htmlId, account, and content object');
    }

    if (!inited) {
      init();
    }

    var playerObj = parser.getPlayerObject(htmlId, account, contentInitializationObject, playerParameters);
    var playerWrapper = factory.getNewWrapper(playerObj.PlayerType, htmlId, account);
    var strategy = embedStrategyProvider.getEmbedStrategy(
      playerObj,
      htmlId,
      playerWrapper,
      contentInitializationObject,
      playerParameters,
    );
    strategy.execute();

    var player = new Player(playerWrapper);
    monitor.start(playerObj, player);

    return player;
  };

  /**
   * @desc Indicates whether the CloudPath Client API is ready to receive calls.
   * This can be used in combination with the {@link NBCUniCPC.onReady} callback
   * to delay code execution until the API is ready.
   * @type {boolean}
   * @readonly
   * @example
   * var cpcplayer;
   * var contentInitObj = new NBCUniCPC.ContentInitializationObject();
   * contentInitObj.externalAdvertiserId = "NBC_ANV_2836294";
   * contentInitObj.fullEpisode = true;
   * contentInitObj.mediaPid = "fEJtzIQOPLvp";
   * contentInitObj.showName = "Saturday Night Live";
   * contentInitObj.videoId = "2780564";
   * var parameters = new NBCUniCPC.PlayerParameters();
   * parameters.autoPlay = true;
   *
   * function onConfigLoaded(evt)
   * {
   *	NBCUniCPC.controller.removeEventListener(NBCUniCPC.Event.CONFIG_LOADED, onConfigLoaded);
   *	cpcplayer = NBCUniCPC.controller.loadEvent("videoplayer", NBCUniCPC.Account.NBC, contentInitObj, parameters);
   * }
   *
   * function loadPlayer()
   * {
   *	NBCUniCPC.controller.addEventListener(NBCUniCPC.Event.CONFIG_LOADED, onConfigLoaded);
   *	NBCUniCPC.controller.loadConfig("configId", "secret");
   * }
   *
   * NBCUniCPC.onReady = loadPlayer;
   * if(NBCUniCPC.ready) loadPlayer();
   * */
  NBCUniCPC.ready = true;

  /**
   * User-defined callback that gets called when the CloudPath Client is ready.
   * @see NBCUniCPC.ready
   */
  NBCUniCPC.onReady = function() {};

  /**
   *
   * @desc This class is responsible for loading configuration files and video content.
   * The <code>Controller</code> class is not meant to be instantiated by consumers of the CloudPath Client,
   * but an instance of it is accessible through the {@link NBCUniCPC.controller} property.
   * @constructor
   * @param {EventDispatcher} dispatcher An EventDispatcher instance
   *
   * @fires NBCUniCPC.Event.ConfigLoadedEvent
   */
  function Controller(dispatcher) {
    var instance = this;
    var playerData = {};

    function getStreamType(obj) {
      return obj.videoId === NBCUniCPC.StreamType.LIVE ? NBCUniCPC.StreamType.LIVE : NBCUniCPC.StreamType.VOD;
    }

    function getReleaseURLForPlayerObj(obj) {
      return obj && obj.hasOwnProperty('releaseURL') ? obj.releaseURL : '';
    }

    function newDiscreteController(player) {
      var mediator = new MetadataRequestMediator(requestFactory);
      var cmDAO = new ContentMetadataDAO(mediator);
      return new SkipIntroController(parser, player, cmDAO, mediator, window);
    }

    function updateEvent2(_htmlId, _cio, _params) {
      if (!_htmlId) {
        throw new Error('Missing parameter htmlId');
      }

      if (!playerData[_htmlId]) {
        throw new Error('No player found for id ' + _htmlId);
      }
      if (!_cio || !_cio.videoId) {
        throw new Error('updateEvent requires a ContentInitializationObject parameter.');
      }

      if (
        getStreamType(_cio) !== NBCUniCPC.StreamType.VOD ||
        getStreamType(playerData[_htmlId].cio) !== NBCUniCPC.StreamType.VOD
      ) {
        throw new Error('updateEvent supports only VOD content');
      }

      var playerObj = parser.getPlayerObject(_htmlId, playerData[_htmlId].account, _cio, _params);
      urlBuilder.buildURL(getReleaseURLForPlayerObj(playerObj), _cio, _params, function(url) {
        playerData[_htmlId].player.setReleaseURL(url);
        playerData[_htmlId].controller.setEventInfo(_htmlId, playerData[_htmlId].account, _cio, _params);
      });
    }

    function updateLiveEvent2(_htmlId, _account, _cio, _params) {
      if (!_htmlId) {
        throw new Error('Missing parameter htmlId');
      }
      if (!_account) {
        throw new Error('Missing parameter account');
      }
      if (!playerData[_htmlId]) {
        throw new Error('No player found for id ' + _htmlId);
      }
      if (!_cio || !_cio.videoId) {
        throw new Error('updateLiveEvent requires a ContentInitializationObject parameter.');
      }

      if (
        getStreamType(_cio) !== NBCUniCPC.StreamType.LIVE ||
        getStreamType(playerData[_htmlId].cio) !== NBCUniCPC.StreamType.LIVE
      ) {
        throw new Error('updateLiveEvent supports only live content');
      }

      var resolver = new ConfigResolver(configLoader.getCurrentConfig(), NBCUniCPC.Config);
      resolver.resolve(_account, _cio.videoId);
      var playerObj = parser.getPlayerObject(_htmlId, _account, _cio, _params);
      // Start the Conviva Monitor.
      monitor.start(playerObj, playerData[_htmlId].player);

      if (_params !== undefined && _params.hasOwnProperty('callsign')) {
        var videoCallSignBuilder = new VideoCallSignBuilder();
        var overrideValue = _params.callsign;
        if (playerObj.hasOwnProperty('anvpdata')) {
          playerObj.anvpdata = videoCallSignBuilder.buildAnvpCallSignData(playerObj.anvpdata, overrideValue);
        }
      }
      var initObj = JSON.parse(playerObj.anvpdata);
      window.AnvatoPlayer(_htmlId).init(initObj);
    }

    function load2(_htmlId, _account, _cio, _params) {
      var resolver = new ConfigResolver(configLoader.getCurrentConfig(), NBCUniCPC.Config);
      resolver.resolve(_account, _cio.videoId);

      var _player = NBCUniCPC.load(_htmlId, _account, _cio, _params); // continue only if the player loaded successfully
      var discreteController = newDiscreteController(_player);
      playerData[_htmlId] = {
        player: _player,
        account: _account,
        cio: _cio,
        controller: discreteController,
      };
      discreteController.setEventInfo(_htmlId, _account, _cio, _params);

      instance.updateEvent = updateEvent2;

      instance.updateLiveEvent = updateLiveEvent2;

      return playerData[_htmlId].player;
    }

    function onConfigLoaded(evt) {
      configLoader.removeEventListener(NBCUniCPC.Event.CONFIG_LOADED, onConfigLoaded);
      instance.loadEvent = load2;

      instance.dispatchEvent(evt);
    }

    /**
     * Registers an event listener object with an EventDispatcher object so that
     * the listener receives notification of an event.
     *
     * @function
     * @param {string} type The type of event
     * @param {function} callback The listener function that processes the event.
     *
     * @see NBCUniCPC.Event
     *
     */
    this.addEventListener = dispatcher.addEventListener;
    /**
     * Removes a listener from the EventDispatcher object. If there is no matching
     * listener registered with the EventDispatcher object, a call to this method
     * has no effect.
     *
     * @function
     * @param {string} type - The type of event
     * @param {function} callback - The listener function that processes the event.
     *
     * @see NBCUniCPC.Event
     */
    this.removeEventListener = dispatcher.removeEventListener;
    this.dispatchEvent = dispatcher.dispatchEvent;

    /**
     * Initiates the process of asyncronously loading the player configuration from
     * a web service. A <code>NBCUniCPC.Event.ConfigLoadedEvent</code> will be dispatched
     * after the configuration has been successfully loaded. The <code>key</code> and <code>secret</code> values to use
     * for your application will be supplied by the CloudPath Client team.
     *
     * @param {string} key The configuration identifier
     * @param {string} secret The token required to access the configuration
     *
     * @see NBCUniCPC.Event.event:ConfigLoadedEvent
     */
    this.loadConfig = function(key, secret) {
      if (!inited) {
        init();
      }
      configLoader.addEventListener(NBCUniCPC.Event.CONFIG_LOADED, onConfigLoaded);
      configLoader.loadConfig(key, secret);
    };

    /**
     * Creates a player in an existing HTML element and loads VOD or linear video content in the player. Use this method in conjunction
     * with <code>loadConfig</code> in favor of the deprecated <code>NBCUniCPC.load</code>.
     * Calling this method before receiving the <code>NBCUniCPC.Event.ConfigLoadedEvent</code>
     * will have no effect.
     *
     * @param {string} htmlId - The id of an existing HTML element that will be
     *    replaced with the new CloudPath Client
     * @param {string} account - The account that owns the video content. Use {@link NBCUniCPC.Account} for expected values.
     * @param {NBCUniCPC.ContentInitializationObject} contentInitializationObject - The initialization object for this
     *    content. Can include stream type, mcp video id, mpx media id, and the full
     *    episode flag.
     * @param {NBCUniCPC.PlayerParameters} [playerParameters] - Configuration options for this player.
     *
     * @throws Will throw an error if any of the required parameters is missing
     *
     * @returns {Player} a new {@link Player} instance.
     *
     * @see NBCUniCPC.Account
     * @see NBCUniCPC.PlayerParameters
     * @see NBCUniCPC.ContentInitializationObject
     * @see NBCUniCPC.Event.event:ConfigLoadedEvent
     * @see #loadConfig
     *
     * @example
     * var cpcplayer;
     * function onConfigLoaded(evt)
     * {
     *	NBCUniCPC.controller.removeEventListener(NBCUniCPC.Event.CONFIG_LOADED, onConfigLoaded);
     *
     *	var contentInitObj = new NBCUniCPC.ContentInitializationObject();
     *	contentInitObj.externalAdvertiserId = "NBC_ANV_2836294";
     *	contentInitObj.fullEpisode = true;
     *	contentInitObj.mediaPid = "fEJtzIQOPLvp";
     *	contentInitObj.showName = "Saturday Night Live";
     *	contentInitObj.videoId = "2780564";
     *	var parameters = new NBCUniCPC.PlayerParameters();
     *	parameters.autoPlay = true;
     *	cpcplayer = NBCUniCPC.controller.loadEvent("videoplayer", NBCUniCPC.Account.NBC, contentInitObj, parameters);
     * }
     *
     * NBCUniCPC.controller.addEventListener(NBCUniCPC.Event.CONFIG_LOADED, onConfigLoaded);
     * NBCUniCPC.controller.loadConfig("configId", "secret");
     */
    this.loadEvent = function(htmlId, account, contentInitializationObject, playerParameters) {};

    /**
     * Loads new VOD content in an existing player. The content's {@link NBCUniCPC.StreamType} must
     * match the {@link NBCUniCPC.StreamType} of the {@link NBCUniCPC.ContentInitializationObject}
     * used when calling <code>loadEvent</code>. In other words, mixing VOD and LIVE
     * content is not allowed.
     *
     * Calling this method before <code>loadEvent</code> will have no effect.
     *
     * @param {string} htmlId - The id of an existing HTML element that will be
     *    replaced with the new CloudPath Client. This value must match the id supplied to <code>loadEvent</code>
     * @param {NBCUniCPC.ContentInitializationObject} contentInitializationObject - The initialization object for this
     *    content. Can include stream type, mcp video id, mpx media id, and the full
     *    episode flag.
     * @param {NBCUniCPC.PlayerParameters} [playerParameters] - Configuration options for this player.
     *
     * @throws Will throw an error if any of the required parameters is missing or if the {@link NBCUniCPC.StreamType} is invalid.
     */
    this.updateEvent = function(htmlId, contentInitializationObject, playerParameters) {};

    /**
     * Loads new live content in an existing player. The content's {@link NBCUniCPC.StreamType} must
     * match the {@link NBCUniCPC.StreamType} of the {@link NBCUniCPC.ContentInitializationObject}
     * used when calling <code>loadEvent</code>. In other words, mixing VOD and LIVE
     * content is not allowed.
     *
     * Calling this method before <code>loadEvent</code> will have no effect.
     *
     * @param {string} htmlId - The id of an existing HTML element that will be
     *    replaced with the new CloudPath Client. This value must match the id supplied to <code>loadEvent</code>
     * @param {string} account - The account that owns the video content. Use {@link NBCUniCPC.Account} for expected values.
     * @param {NBCUniCPC.ContentInitializationObject} contentInitializationObject - The initialization object for this
     *    content. Can include stream type, mcp video id, mpx media id, and the full
     *    episode flag.
     * @param {NBCUniCPC.PlayerParameters} [playerParameters] - Configuration options for this player.
     *
     * @throws Will throw an error if any of the required parameters is missing or if the {@link NBCUniCPC.StreamType} is invalid.
     */
    this.updateLiveEvent = function(htmlId, account, contentInitializationObject, playerParameters) {};
  }

  /**
   * @desc A {@link Controller} instance accessible by calling <code>NBCUniCPC.controller</code>. Use this property to load application configurations and videos.
   * @type {Controller}
   * @readonly
   */
  NBCUniCPC.controller = new Controller(new EventDispatcher());

  // The API is immediately available. In some future world, we might want to
  // delay making the API available until dependencies have loaded/initialized or
  // some other readiness criteria have been met. For now, we add this ready flag
  // and expose a callback so clients will not have to update their API if our
  // implementation changes.
  NBCUniCPC.onReady();
})((window.NBCUniCPC = window.NBCUniCPC || {}));

/* Conviva v2.146.0.36444 11-JAN-2019 */
/*! (C) 2016 Conviva, Inc. All rights reserved. Confidential and proprietary. */
!(function(a, b) {
  'function' == typeof define && define.amd ? define(b) : 'object' == typeof exports && (module.exports = b()),
    void 0 === a.Conviva && (a.ConvivaLoading || ((a.ConvivaLoading = !0), (a.Conviva = b()), delete a.ConvivaLoading));
})(this, function() {
  var a = {};
  return (
    (function() {
      'use strict';
      var b = {};
      !(function() {
        var c = (a.Client = function(b, g) {
          function i(a, b) {
            if (!(a instanceof d)) throw new Error('clientSettings parameter should be an instance of ClientSettings.');
            if (!(b instanceof f)) throw new Error('systemFactory parameter should be an instance of SystemFactory.');
            (a.gatewayUrl == d._httpsProtocol + d.defaultProductionGatewayDNS ||
              a.gatewayUrl == d._httpProtocol + d.defaultProductionGatewayDNS) &&
              (this.defaultGatewayURLError = !0),
              (this._settings = a.clone()),
              (this._systemFactory = b),
              this._systemFactory.configure('SDK', this._settings),
              (this._exceptionCatcher = this._systemFactory.buildExceptionCatcher()),
              this._exceptionCatcher.runProtected(
                'Client.init',
                function() {
                  (j._id = F.uinteger32()),
                    (j._logger = j._systemFactory.buildLogger()),
                    j._logger.setModuleName('Client'),
                    j.defaultGatewayURLError &&
                      j._logger.info(
                        'Gateway URL should not be set to https://cws.conviva.com or http://cws.conviva.com, therefore this call is ignored',
                      ),
                    j._logger.info('init(): url=' + j._settings.gatewayUrl + ' customerKey=' + j._settings.customerKey),
                    (j._config = j._systemFactory.buildConfig()),
                    j._config.load(),
                    (j._sessionFactory = j._systemFactory.buildSessionFactory(j, j._settings, j._config)),
                    j._logger.info('init(): done.');
                },
                function(a) {
                  throw new Error('Client constructor failed: ' + a.message);
                },
              );
          }
          var j = this;
          (this.defaultGatewayURLError = !1),
            (this._logger = null),
            (this._sessionFactory = null),
            (this._systemFactory = null),
            (this._globalSessionKey = -1),
            (this._settings = null),
            (this._systemSettings = null),
            (this._exceptionCatcher = null),
            (this._config = null),
            (this._id = -1),
            (this._released = !1),
            i.apply(this, arguments),
            (this.release = function() {
              this._released ||
                this._exceptionCatcher.runProtected('Client.release', function() {
                  j._logger.info('release()'),
                    j._sessionFactory.cleanup(),
                    (j._sessionFactory = null),
                    (j._globalSessionKey = -1),
                    (j._logger = null),
                    (j._id = -1),
                    (j._exceptionCatcher = null),
                    (j._settings = null),
                    (j._systemSettings = null),
                    (j._systemFactory = null),
                    (j._released = !0);
                });
            }),
            (this.createSession = function(a) {
              var b = c.NO_SESSION_KEY;
              return this._released
                ? b
                : null == a || a instanceof e
                ? (this._exceptionCatcher.runProtected('Client.createSession', function() {
                    b = j._sessionFactory.makeVideoSession(a, u.SESSION_TYPE.VIDEO);
                  }),
                  b)
                : (j._logger.error(
                    'createSession(): expecting an instance of ContentMetadata for contentMetadata parameter',
                  ),
                  b);
            }),
            (this.createAdSession = function(a, b) {
              var d = c.NO_SESSION_KEY;
              return this._released
                ? d
                : null == b || b instanceof e
                ? (this._exceptionCatcher.runProtected('Client.createAdSession', function() {
                    var c = j._sessionFactory.getVideoSession(a);
                    null != c &&
                      ((null == b.applicationName || null == b.viewerId) &&
                        (null == b.viewerId &&
                          null != c._contentMetadata.viewerId &&
                          (b.viewerId = c._contentMetadata.viewerId),
                        null == b.applicationName &&
                          null != c._contentMetadata.applicationName &&
                          (b.applicationName = c._contentMetadata.applicationName)),
                      (b.custom['c3.csid'] = C.ToString(c._id))),
                      (d = j._sessionFactory.makeVideoSession(b, u.SESSION_TYPE.AD));
                  }),
                  d)
                : (j._logger.error(
                    'createAdSession(): expecting an instance of ContentMetadata for adMetadata parameter',
                  ),
                  d);
            }),
            (this.reportError = function(b, c, d) {
              return this._released
                ? void 0
                : C.isValidString(c)
                ? d !== a.Client.ErrorSeverity.FATAL && d !== a.Client.ErrorSeverity.WARNING
                  ? void this._logger.error('reportError(): invalid error severity: ' + d)
                  : void this._exceptionCatcher.runProtected('Client.reportError', function() {
                      var a = j._sessionFactory.getVideoSession(b);
                      null != a && a.reportError(c, d);
                    })
                : void this._logger.error('reportError(): invalid error message string: ' + c);
            }),
            (this.updateContentMetadata = function(a, b) {
              return this._released
                ? void 0
                : b instanceof e
                ? void this._exceptionCatcher.runProtected('Client.updateContentMetadata', function() {
                    var c = j._sessionFactory.getVideoSession(a);
                    if (null != c) {
                      var d = b.clone();
                      c.updateContentMetadata(d);
                    }
                  })
                : void j._logger.error(
                    'updateContentMetadata(): expecting an instance of ContentMetadata for contentMetadata parameter',
                  );
            }),
            (this.detachPlayer = function(a) {
              this._released ||
                this._exceptionCatcher.runProtected('Client.detachPlayer', function() {
                  var b = j._sessionFactory.getVideoSession(a);
                  null != b && b.detachPlayer();
                });
            }),
            (this.attachPlayer = function(a, b) {
              return this._released
                ? void 0
                : b instanceof h
                ? void this._exceptionCatcher.runProtected('Client.attachPlayer', function() {
                    var c = j._sessionFactory.getVideoSession(a);
                    null != c && c.attachPlayer(b);
                  })
                : void j._logger.error(
                    'attachPlayer(): expecting an instance of PlayerStateManager for playerStateManager parameter',
                  );
            }),
            (this.contentPreload = function(a) {
              this._released ||
                this._exceptionCatcher.runProtected('Client.contentPreload', function() {
                  var b = j._sessionFactory.getVideoSession(a);
                  null != b && b.contentPreload();
                });
            }),
            (this.contentStart = function(a) {
              this._released ||
                this._exceptionCatcher.runProtected('Client.contentStart', function() {
                  var b = j._sessionFactory.getVideoSession(a);
                  null != b && b.contentStart();
                });
            }),
            (this.sendCustomEvent = function(a, b, d) {
              return this._released
                ? void 0
                : C.isValidString(b)
                ? void this._exceptionCatcher.runProtected('Client.sendCustomEvent', function() {
                    if (a == c.NO_SESSION_KEY) {
                      if (j._globalSessionKey < 0) {
                        var f = new e();
                        j._globalSessionKey = j._sessionFactory.makeGlobalSession(f, null);
                      }
                      a = j._globalSessionKey;
                    }
                    var g = C.sanitizeStringToStringObject(d),
                      h = j._sessionFactory.getSession(a);
                    null != h && h.sendCustomEvent(b, g);
                  })
                : void j._logger.error('sendCustomEvent(): eventName parameter must be a valid string.');
            }),
            (this.adStart = function(a, b, d, e) {
              return this._released
                ? void 0
                : b !== c.AdStream.CONTENT && b !== c.AdStream.SEPARATE
                ? void this._logger.error('adStart(): ignored, invalid value for adStream parameter: ' + b)
                : d !== c.AdPlayer.CONTENT && d !== c.AdPlayer.SEPARATE
                ? void this._logger.error('adStart(): ignored, invalid value for adPlayer parameter: ' + d)
                : e !== c.AdPosition.BUMPER &&
                  e !== c.AdPosition.PREROLL &&
                  e !== c.AdPosition.MIDROLL &&
                  e !== c.AdPosition.POSTROLL
                ? void this._logger.error('adStart(): ignored, invalid value for adPosition parameter: ' + e)
                : void this._exceptionCatcher.runProtected('Client.adStart', function() {
                    var c = j._sessionFactory.getVideoSession(a);
                    null != c && c.adStart(b, d, e);
                  });
            }),
            (this.adEnd = function(a) {
              this._released ||
                this._exceptionCatcher.runProtected('Client.adEnd', function() {
                  var b = j._sessionFactory.getVideoSession(a);
                  null != b && b.adEnd();
                });
            }),
            (this.cleanupSession = function(a) {
              return this._released
                ? void 0
                : a === c.NO_SESSION_KEY
                ? void this._logger.warning("cleanupSession(): ignored, can't cleanup Client.NO_SESSION_KEY")
                : void this._exceptionCatcher.runProtected('Client.cleanupSession', function() {
                    var b = j._sessionFactory.getVideoSession(a);
                    null != b && j._sessionFactory.cleanupSession(a);
                  });
            }),
            (this.getAttachedPlayer = function(a) {
              var b = null;
              return this._released
                ? b
                : a === c.NO_SESSION_KEY
                ? (this._logger.warning('getAttachedPlayer(): ignored for Client.NO_SESSION_KEY'), b)
                : (this._exceptionCatcher.runProtected('Client.getAttachedPlayer', function() {
                    var c = j._sessionFactory.getVideoSession(a);
                    null != c && (b = c.getPlayerStateManager());
                  }),
                  b);
            }),
            (this.isPlayerAttached = function(a) {
              return this._released ? !1 : null !== this.getAttachedPlayer(a) ? !0 : !1;
            }),
            (this.getPlayerStateManager = function() {
              if (this._released) throw new Error('This instance of Conviva.Client has been released.');
              return new h(this._systemFactory);
            }),
            (this.releasePlayerStateManager = function(a) {
              if (this._released) throw new Error('This instance of Conviva.Client has been released.');
              this._exceptionCatcher.runProtected('Client.releasePlayerStateManager', function() {
                a instanceof h && a.release();
              });
            }),
            (this.getSettings = function() {
              return this._settings;
            }),
            (this.getId = function() {
              return this._id;
            });
        });
        (c.version = '2.146.0.36444'),
          (c.NO_SESSION_KEY = -2),
          (c.AdPosition = { BUMPER: 'BUMPER', PREROLL: 'PREROLL', MIDROLL: 'MIDROLL', POSTROLL: 'POSTROLL' }),
          (c.AdStream = { CONTENT: 'CONTENT', SEPARATE: 'SEPARATE' }),
          (c.AdPlayer = { CONTENT: 'CONTENT', SEPARATE: 'SEPARATE' }),
          (c.ErrorSeverity = { FATAL: 0, WARNING: 1 }),
          (c.DeviceType = {
            DESKTOP: 'DESKTOP',
            CONSOLE: 'Console',
            SETTOP: 'Settop',
            MOBILE: 'Mobile',
            TABLET: 'Tablet',
            SMARTTV: 'SmartTV',
            UNKNOWN: 'Unknown',
          }),
          (c.AdTechnology = { CLIENT_SIDE: 'Client Side', SERVER_SIDE: 'Server Side' }),
          (c.AdType = {
            BLACKOUT_SLATE: 'Blackout slate',
            TECHNICAL_DIFFICULTIES_SLATE: 'Technical Difficulties slate',
            COMMERCIAL_SLATE: 'Commercial Break slate',
            OTHER_SLATE: 'Other slate',
            VPAID: 'VPAID',
            REGULAR: 'Regular Ad',
          }),
          (c.AdServingType = { INLINE: 'Inline', WRAPPER: 'Wrapper' });
        var d = (a.ClientSettings = function(a) {
          function b(a) {
            if (!C.isValidString(a)) throw new Error('customerKey must be valid');
            this.customerKey = a;
          }
          function c(a) {
            if (C.isValidString(a)) {
              var b = a.split('://');
              if ('cws.conviva.com' != b[1] && ('https' == b[0] || 'http' == b[0])) return a;
            }
            return 'https://' + e.customerKey + '.' + d.defaultProductionGatewayDNS;
          }
          var e = this;
          (this._customerKey = null),
            C.defGet(this, 'customerKey', function() {
              return this._customerKey;
            }),
            C.defSet(this, 'customerKey', function(a) {
              C.isValidString(a) && (this._customerKey = a);
            }),
            (this._heartbeatInterval = d.defaultProductionHeartbeatInterval),
            C.defGet(this, 'heartbeatInterval', function() {
              return this._heartbeatInterval;
            }),
            C.defSet(this, 'heartbeatInterval', function(a) {
              if ('number' == typeof a) {
                var b = C.NumberToUnsignedInt(a);
                b === a && (this._heartbeatInterval = b);
              }
            }),
            (this._gatewayUrl = null),
            C.defGet(this, 'gatewayUrl', function() {
              return this._gatewayUrl;
            }),
            C.defSet(this, 'gatewayUrl', function(a) {
              C.isValidString(a) && (this._gatewayUrl = a);
            }),
            b.apply(this, arguments),
            (this.equals = function(a) {
              return (
                this.customerKey === a.customerKey &&
                this.gatewayUrl === a.gatewayUrl &&
                this.heartbeatInterval === a.heartbeatInterval
              );
            }),
            (this.clone = function() {
              var a = new d(this.customerKey);
              return (a.gatewayUrl = c(this.gatewayUrl)), (a.heartbeatInterval = this.heartbeatInterval), a;
            });
        });
        (d.defaultDevelopmentGatewayUrl = 'https://conviva.testonly.conviva.com'),
          (d.defaultProductionGatewayUrl = 'https://cws.conviva.com'),
          (d.defaultProductionGatewayDNS = 'cws.conviva.com'),
          (d.defaultDevelopmentGatewayDNS = 'conviva.testonly.conviva.com'),
          (d._httpsProtocol = 'https://'),
          (d._httpProtocol = 'http://'),
          (d.defaultDevelopmentHeartbeatInterval = 5),
          (d.defaultProductionHeartbeatInterval = 20);
        var e = (a.ContentMetadata = function() {
          function a() {
            return this._assetName;
          }
          function b(a) {
            'string' == typeof a && (this._assetName = a);
          }
          function c() {
            return this._custom;
          }
          function d(a) {
            'object' == typeof a && (this._custom = C.sanitizeStringToStringObject(a));
          }
          function f() {
            return this._defaultResource;
          }
          function g(a) {
            'string' == typeof a && (this._defaultResource = a);
          }
          function h() {
            return this._viewerId;
          }
          function i(a) {
            'string' == typeof a && (this._viewerId = a);
          }
          function j() {
            return this._applicationName;
          }
          function k(a) {
            'string' == typeof a && (this._applicationName = a);
          }
          function l() {
            return this._streamUrl;
          }
          function m(a) {
            'string' == typeof a && (this._streamUrl = a);
          }
          function n() {
            return this._streamType;
          }
          function o(a) {
            (a === e.StreamType.UNKNOWN || a === e.StreamType.VOD || a === e.StreamType.LIVE) && (this._streamType = a);
          }
          function p() {
            return this._duration;
          }
          function q(a) {
            this._duration = G.sanitizeSpecialIntegerValue(a);
          }
          function r() {
            return this._encodedFrameRate;
          }
          function s(a) {
            this._encodedFrameRate = G.sanitizeSpecialIntegerValue(a);
          }
          function t() {}
          (this._assetName = null),
            C.defGet(this, 'assetName', a),
            C.defSet(this, 'assetName', b),
            (this._custom = {}),
            C.defGet(this, 'custom', c),
            C.defSet(this, 'custom', d),
            (this._defaultResource = null),
            C.defGet(this, 'defaultResource', f),
            C.defSet(this, 'defaultResource', g),
            (this._viewerId = null),
            C.defGet(this, 'viewerId', h),
            C.defSet(this, 'viewerId', i),
            (this._applicationName = null),
            C.defGet(this, 'applicationName', j),
            C.defSet(this, 'applicationName', k),
            (this._streamUrl = null),
            C.defGet(this, 'streamUrl', l),
            C.defSet(this, 'streamUrl', m),
            (this._streamType = e.StreamType.UNKNOWN),
            C.defGet(this, 'streamType', n),
            C.defSet(this, 'streamType', o),
            (this._duration = -1),
            C.defGet(this, 'duration', p),
            C.defSet(this, 'duration', q),
            (this._encodedFrameRate = -1),
            C.defGet(this, 'encodedFrameRate', r),
            C.defSet(this, 'encodedFrameRate', s),
            t.apply(this, arguments),
            (this.clone = function() {
              var a = new e();
              (a.assetName = this.assetName),
                (a.applicationName = this.applicationName),
                (a.streamUrl = this.streamUrl),
                (a.viewerId = this.viewerId),
                (a.defaultResource = this.defaultResource),
                (a.streamType = this.streamType),
                (a.duration = this.duration),
                (a.encodedFrameRate = this.encodedFrameRate);
              for (var b in this.custom) a.custom[b] = this.custom[b];
              return a;
            });
        });
        e.StreamType = { UNKNOWN: 'UNKNOWN', LIVE: 'LIVE', VOD: 'VOD' };
        var f = ((a.ErrorType = {
            ERROR_UNKNOWN: 'ERROR_UNKNOWN',
            ERROR_IO: 'ERROR_IO',
            ERROR_TIMEOUT: 'ERROR_TIMEOUT',
            ERROR_NULL_ASSET: 'ERROR_NULL_ASSET',
            ERROR_MISSING_PARAMETER: 'ERROR_MISSING_PARAMETER',
            ERROR_NO_AD_AVAILABLE: 'ERROR_NO_AD_AVAILABLE',
            ERROR_PARSE: 'ERROR_PARSE',
            ERROR_INVALID_VALUE: 'ERROR_INVALID_VALUE',
            ERROR_INVALID_SLOT: 'ERROR_INVALID_SLOT',
            ERROR_3P_COMPONENT: 'ERROR_3P_COMPONENT',
            ERROR_UNSUPPORTED_3P_FEATURE: 'ERROR_UNSUPPORTED_3P_FEATURE',
            ERROR_DEVICE_LIMIT: 'ERROR_DEVICE_LIMIT',
            ERROR_UNMATCHED_SLOT_SIZE: 'ERROR_UNMATCHED_SLOT_SIZE',
          }),
          (a.Events = {
            AD_REQUESTED: 'Conviva.AdRequested',
            AD_RESPONSE: 'Conviva.AdResponse',
            AD_SLOT_STARTED: 'Conviva.SlotStarted',
            AD_ATTEMPTED: 'Conviva.AdAttempted',
            AD_SLOT_ENDED: 'Conviva.SlotEnded',
            AD_IMPRESSION_START: 'Conviva.AdImpression',
            AD_START: 'Conviva.AdStart',
            AD_FIRST_QUARTILE: 'Conviva.AdFirstQuartile',
            AD_MID_QUARTILE: 'Conviva.AdMidQuartile',
            AD_THIRD_QUARTILE: 'Conviva.AdThirdQuartile',
            AD_COMPLETE: 'Conviva.AdComplete',
            AD_END: 'Conviva.AdEnd',
            AD_IMPRESSION_END: 'Conviva.AdImpressionEnd',
            AD_SKIPPED: 'Conviva.AdSkipped',
            AD_ERROR: 'Conviva.AdError',
            AD_PROGRESS: 'Conviva.AdProgress',
            AD_CLOSE: 'Conviva.AdClose',
            CONTENT_PAUSED: 'Conviva.PauseContent',
            CONTENT_RESUMED: 'Conviva.ResumeContent',
            POD_START: 'Conviva.PodStart',
            POD_END: 'Conviva.PodEnd',
          }),
          (a.SystemFactory = function(a, b) {
            function c(a, b) {
              if (!(a instanceof m))
                throw new Error('systemInterface parameter should be an instance of SystemInterface.');
              (this._systemInterface = a),
                (this._timeInterface = this._systemInterface._timeInterface),
                (this._timerInterface = this._systemInterface._timerInterface),
                (this._httpInterface = this._systemInterface._httpInterface),
                (this._storageInterface = this._systemInterface._storageInterface),
                (this._metadataInterface = this._systemInterface._metadataInterface),
                (this._loggingInterface = this._systemInterface._loggingInterface),
                b instanceof g ? (this._settings = b.clone()) : (this._settings = new g());
            }
            var d = this;
            c.apply(this, arguments),
              (this.configure = function(a, b) {
                (this._packageName = a), (this._clientSettings = b);
              }),
              (this.release = function() {
                this._systemInterface.release(),
                  (this._systemInterface = null),
                  (this._packageName = null),
                  (this._settings = null),
                  (this._logBuffer = null);
              });
            var e = {
              build: function() {
                return new I(d._loggingInterface, d._timeInterface, d.getSettings(), d._logBuffer, d._packageName);
              },
            };
            (this.buildLogger = function() {
              return e.build();
            }),
              (this.buildSessionFactory = function(a, b, c) {
                return new w(a, b, c, this);
              }),
              (this.buildPing = function() {
                return new E(this.buildLogger(), this.buildHttpClient(), this._clientSettings);
              }),
              (this.buildCallbackWithTimeout = function() {
                return new x(this.buildTimer());
              }),
              (this.buildCallbackWithTimeoutNoPing = function() {
                var a = null,
                  b = new A(this.buildLogger(), a, this.getSettings()),
                  c = new M(this.buildLogger(), this._timerInterface, b);
                return new x(c);
              }),
              (this.buildHttpClient = function() {
                return new H(
                  this.buildLogger(),
                  this._httpInterface,
                  this.buildCallbackWithTimeoutNoPing(),
                  this.getSettings(),
                );
              }),
              (this.buildExceptionCatcher = function() {
                return new A(this.buildLogger(), this.buildPing(), this.getSettings());
              }),
              (this.buildTime = function() {
                return new L(this._timeInterface, this.buildLogger());
              }),
              (this.buildTimer = function() {
                return new M(this.buildLogger(), this._timerInterface, this.buildExceptionCatcher());
              }),
              (this.buildStorage = function() {
                return new J(
                  this.buildLogger(),
                  this._storageInterface,
                  this.buildCallbackWithTimeout(),
                  this.getSettings(),
                );
              }),
              (this.buildConfig = function() {
                return new y(this.buildLogger(), this.buildStorage(), this.buildJsonInterface());
              }),
              (this.buildSystemMetadata = function() {
                return new K(this.buildLogger(), this._metadataInterface, this.buildExceptionCatcher());
              }),
              (this.buildCwsProtocol = function() {
                return new r();
              }),
              (this.buildGatewayControl = function(a) {
                return new B(a, this.buildLogger(), this.buildHttpClient(), this.buildJsonInterface());
              }),
              (this.buildCwsSession = function(a, b, c) {
                var d = this.buildGatewayControl(b);
                return new u(
                  this.buildEventQueue(),
                  a,
                  b,
                  this.buildLogger(),
                  this.buildExceptionCatcher(),
                  this.buildTimer(),
                  d,
                  this.buildCwsProtocol(),
                  this.buildTime(),
                  this.getLogBuffer(),
                  c,
                );
              }),
              (this.buildSession = function(a, b, c, d, e, f) {
                var g = this.buildExceptionCatcher(),
                  h = this.buildLogger(),
                  i = b.clone(),
                  j = this.buildCwsSession(a, i, c);
                return new v(d, e, f, c, this.buildSystemMetadata(), j, g, h);
              }),
              (this.buildEventQueue = function() {
                return new z();
              }),
              (this.buildJsonInterface = function() {
                return new s();
              }),
              (this.getLogBuffer = function() {
                return this._logBuffer;
              }),
              (this.getSettings = function() {
                return this._settings;
              }),
              (this._logBuffer = new D());
          })),
          g = (a.SystemSettings = function() {
            function a() {}
            (this._logLevel = g.defaultProductionLogLevel),
              C.defGet(this, 'logLevel', function() {
                return this._logLevel;
              }),
              C.defSet(this, 'logLevel', function(a) {
                if ('number' == typeof a) {
                  var b = C.NumberToUnsignedInt(a);
                  b === a && b >= g.LogLevel.DEBUG && b <= g.LogLevel.ERROR && (this._logLevel = b);
                }
              }),
              (this._allowUncaughtExceptions = g.defaultProductionAllowUncaughtExceptions),
              C.defGet(this, 'allowUncaughtExceptions', function() {
                return this._allowUncaughtExceptions;
              }),
              C.defSet(this, 'allowUncaughtExceptions', function(a) {
                C.isBoolean(a) && (this._allowUncaughtExceptions = a);
              }),
              (this._storageTimeout = g.defaultStorageTimeout),
              C.defGet(this, 'storageTimeout', function() {
                return this._storageTimeout;
              }),
              C.defSet(this, 'storageTimeout', function(a) {
                if ('number' == typeof a) {
                  var b = C.NumberToUnsignedInt(a);
                  b === a && (this._storageTimeout = b);
                }
              }),
              (this._httpTimeout = g.defaultHttpTimeout),
              C.defGet(this, 'httpTimeout', function() {
                return this._httpTimeout;
              }),
              C.defSet(this, 'httpTimeout', function(a) {
                if ('number' == typeof a) {
                  var b = C.NumberToUnsignedInt(a);
                  b === a && (this._httpTimeout = b);
                }
              }),
              a.apply(this, arguments),
              (this.equals = function(a) {
                return (
                  this.logLevel === a.logLevel &&
                  this.allowUncaughtExceptions === a.allowUncaughtExceptions &&
                  this.storageTimeout === a.storageTimeout &&
                  this.httpTimeout === a.httpTimeout
                );
              }),
              (this.clone = function() {
                var a = new g();
                return (
                  (a.logLevel = this.logLevel),
                  (a.allowUncaughtExceptions = this.allowUncaughtExceptions),
                  (a.storageTimeout = this.storageTimeout),
                  (a.httpTimeout = this.httpTimeout),
                  a
                );
              });
          });
        (g.LogLevel = { DEBUG: 0, INFO: 1, WARNING: 2, ERROR: 3, NONE: 4 }),
          (g.defaultDevelopmentLogLevel = g.LogLevel.DEBUG),
          (g.defaultProductionLogLevel = g.LogLevel.ERROR),
          (g.defaultDevelopmentAllowUncaughtExceptions = !0),
          (g.defaultProductionAllowUncaughtExceptions = !1),
          (g.defaultStorageTimeout = 10),
          (g.defaultHttpTimeout = 10);
        var h = (a.PlayerStateManager = function(c) {
          function d(a) {
            (e._systemFactory = a),
              (e._logger = e._systemFactory.buildLogger()),
              e._logger.setModuleName('PlayerStateManager'),
              (e._exceptionCatcher = e._systemFactory.buildExceptionCatcher());
          }
          var e = this;
          (e._monitorNotifier = null),
            (e._bitrateKbps = -2),
            (e._playerState = h.PlayerState.UNKNOWN),
            (e._currentMetadata = {}),
            (e._renderedFrameRate = -2),
            (e._encodedFrameRate = -2),
            (e._duration = -2),
            (e._playerVersion = null),
            (e._playerType = null),
            (e._streamUrl = null),
            (e._moduleName = null),
            (e._moduleVersion = null),
            (e._width = -1),
            (e._height = -1),
            (e._connectionType = null),
            (e._linkEncryption = null),
            (e._lastError = null),
            (e._pendingErrors = []),
            (e._released = !1),
            (this.release = function() {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.release', function() {
                  null != e._monitorNotifier && e._monitorNotifier.onRelease(),
                    e.removeMonitoringNotifier(),
                    (e._systemFactory = null),
                    (e._logger = null),
                    (e._exceptionCatcher = null),
                    (e._released = !0);
                });
            }),
            (this.setPlayheadTime = function(a) {}),
            (this.setBufferLength = function(a) {}),
            (this.setRenderedFrameRate = function(a) {}),
            (this.getEncodedFrameRate = function() {
              return e._encodedFrameRate;
            }),
            (this.setEncodedFrameRate = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setEncodedFrameRate', function() {
                  var b = G.sanitizeSpecialIntegerValue(a);
                  b >= -1 &&
                    ((e._encodedFrameRate = b),
                    null != e._monitorNotifier && e._monitorNotifier.onEncodedFrameRateChange(e._encodedFrameRate));
                });
            }),
            (this.getDuration = function() {
              return e._duration;
            }),
            (this.setClientMeasureInterface = function(b) {
              C.validateInterface(b, new a.ClientMeasureInterface(), 'ClientMeasureInterface'),
                (this._playerInterface = b);
            }),
            (this.getPHT = function() {
              return this._playerInterface && 'function' == typeof this._playerInterface.getPHT
                ? this._playerInterface.getPHT()
                : -1;
            }),
            (this.getBufferLength = function() {
              return this._playerInterface && 'function' == typeof this._playerInterface.getBufferLength
                ? this._playerInterface.getBufferLength()
                : -1;
            }),
            (this.getSignalStrength = function() {
              return this._playerInterface && 'function' == typeof this._playerInterface.getSignalStrength
                ? this._playerInterface.getSignalStrength()
                : h.DEFAULT_SIGNAL_STRENGTH;
            }),
            (this.getRenderedFrameRate = function() {
              return this._playerInterface && 'function' == typeof this._playerInterface.getRenderedFrameRate
                ? this._playerInterface.getRenderedFrameRate()
                : h.DEFAULT_RENDERED_FRAME_RATE;
            }),
            (this.setDuration = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setDuration', function() {
                  var b = G.sanitizeSpecialIntegerValue(a);
                  b >= -1 &&
                    ((e._duration = b),
                    null != e._monitorNotifier && e._monitorNotifier.onContentLengthChange(e._duration));
                });
            }),
            (this.getStreamUrl = function() {
              return e._streamUrl;
            }),
            (this.setStreamUrl = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setStreamUrl', function() {
                  null != a &&
                    ((e._streamUrl = a),
                    null != e._monitorNotifier && e._monitorNotifier.onStreamUrlChange(e._streamUrl));
                });
            }),
            (this.getModuleName = function() {
              return e._moduleName;
            }),
            (this.getModuleVersion = function() {
              return e._moduleVersion;
            }),
            (this.setModuleNameAndVersion = function(a, b) {
              (e._moduleName = a), (e._moduleVersion = b);
            }),
            (this.getPlayerType = function() {
              return e._playerType;
            }),
            (this.setPlayerType = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setPlayerType', function() {
                  (e._playerType = a),
                    null != e._monitorNotifier && e._monitorNotifier.onPlayerTypeChange(e._playerType);
                });
            }),
            (this.getPlayerVersion = function() {
              return e._playerVersion;
            }),
            (this.setPlayerVersion = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setPlayerVersion', function() {
                  (e._playerVersion = a),
                    null != e._monitorNotifier && e._monitorNotifier.onPlayerVersionChange(e._playerVersion);
                });
            }),
            (this.setMonitoringNotifier = function(a, b) {
              return e._released
                ? void 0
                : null != e._monitorNotifier
                ? !1
                : ((e._monitorNotifier = a), e._logger.setSessionId(b), !0);
            }),
            (this.removeMonitoringNotifier = function() {
              e._released || ((e._monitorNotifier = null), e._logger.setSessionId(null));
            }),
            (this.pushCurrentState = function() {
              e.setPlayerState(e.getPlayerState()),
                e.setBitrateKbps(e.getBitrateKbps()),
                e.setDuration(e.getDuration()),
                e.setEncodedFrameRate(e.getEncodedFrameRate()),
                e.setStreamUrl(e.getStreamUrl()),
                e.setPlayerType(e.getPlayerType()),
                e.setPlayerVersion(e.getPlayerVersion());
              for (var a = 0; a < e._pendingErrors.length; a++) {
                var b = e._pendingErrors[a];
                e.setError(b);
              }
              e._pendingErrors = [];
            }),
            (this.getPlayerState = function() {
              return e._playerState;
            }),
            (this.setPlayerState = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setPlayerState', function() {
                  h.isValidPlayerState(a)
                    ? ((e._playerState = a),
                      null != e._monitorNotifier && e._monitorNotifier.onPlayerStateChange(e._playerState))
                    : e._logger.error('PlayerStateManager.SetPlayerState(): invalid state: ' + a);
                });
            }),
            (this.getBitrateKbps = function() {
              return e._bitrateKbps;
            }),
            (this.setBitrateKbps = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setBitrateKbps', function() {
                  var b = G.sanitizeSpecialIntegerValue(a);
                  b >= -1 &&
                    ((e._bitrateKbps = b),
                    null != e._monitorNotifier && e._monitorNotifier.onBitrateChange(e._bitrateKbps));
                });
            }),
            (this.setPlayerSeekStart = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setPlayerSeekStart()', function() {
                  null != e._monitorNotifier && e._monitorNotifier.onSeekEvent(h.SEEK_ACTIONS_TYPE.SEEK_START, a);
                });
            }),
            (this.setPlayerSeekEnd = function() {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setPlayerSeekEnd()', function() {
                  null != e._monitorNotifier && e._monitorNotifier.onSeekEvent(h.SEEK_ACTIONS_TYPE.SEEK_END, -1);
                });
            }),
            (this.setUserSeekButtonUp = function() {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setUserSeekButtonUp()', function() {
                  null != e._monitorNotifier && e._monitorNotifier.onSeekEvent(h.SEEK_ACTIONS_TYPE.BUTTON_UP, -1);
                });
            }),
            (this.setUserSeekButtonDown = function() {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setUserSeekButtonDown()', function() {
                  null != e._monitorNotifier && e._monitorNotifier.onSeekEvent(h.SEEK_ACTIONS_TYPE.BUTTON_DOWN, -1);
                });
            }),
            (this.setVideoResolutionWidth = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setVideoResolutionWidth()', function() {
                  var b = G.sanitizeSpecialIntegerValue(a);
                  b > 0 && (e._width = b),
                    null != e._monitorNotifier && e._monitorNotifier.onStreamResolutionWidthChange(e._width);
                });
            }),
            (this.setVideoResolutionHeight = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setVideoResolutionHeight()', function() {
                  var b = G.sanitizeSpecialIntegerValue(a);
                  b > 0 && (e._height = b),
                    null != e._monitorNotifier && e._monitorNotifier.onStreamResolutionHeightChange(e._height);
                });
            }),
            (this.setConnectionType = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setConnectionType()', function() {
                  (e._connectionType = a),
                    null != e._monitorNotifier && e._monitorNotifier.onConnectionTypeChange(e._connectionType);
                });
            }),
            (this.setLinkEncryption = function(a) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.setLinkEncryption()', function() {
                  (e._linkEncryption = a),
                    null != e._monitorNotifier && e._monitorNotifier.onLinkEncryptionChange(e._linkEncryption);
                });
            }),
            (this.setSignalStrength = function(a) {}),
            (this.setError = function(a) {
              if (((e._lastError = a), null != e._monitorNotifier)) {
                var b = a.errorCode,
                  c = a.severity;
                e._monitorNotifier.onError(b, c);
              } else e._pendingErrors.push(a);
            }),
            (this.sendError = function(a, c) {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.sendError', function() {
                  var d = new b.StreamerError(a, c);
                  e.setError(d);
                });
            }),
            (this.reset = function() {
              e._released ||
                e._exceptionCatcher.runProtected('PlayerStateManager.reset', function() {
                  (e._bitrateKbps = -2),
                    (e._playerState = h.PlayerState.UNKNOWN),
                    (e._currentMetadata = {}),
                    (e._renderedFrameRate = -1),
                    (e._encodedFrameRate = -1),
                    (e._duration = -1),
                    (e._playerVersion = null),
                    (e._playerType = null),
                    (e._streamUrl = null),
                    (e._lastError = null),
                    (e._pendingErrors = []);
                });
            }),
            (this.getError = function() {
              return e._lastError;
            }),
            d.apply(e, arguments),
            (h.DEFAULT_SIGNAL_STRENGTH = 1e3),
            (h.DEFAULT_RENDERED_FRAME_RATE = -1);
        });
        (h.PlayerState = {
          STOPPED: 'STOPPED',
          PLAYING: 'PLAYING',
          BUFFERING: 'BUFFERING',
          PAUSED: 'PAUSED',
          UNKNOWN: 'UNKNOWN',
          NOT_MONITORED: 'NOT_MONITORED',
        }),
          (h.isValidPlayerState = function(a) {
            return a === h.PlayerState.STOPPED ||
              a === h.PlayerState.PLAYING ||
              a === h.PlayerState.BUFFERING ||
              a === h.PlayerState.PAUSED ||
              a === h.PlayerState.UNKNOWN ||
              a === h.PlayerState.NOT_MONITORED
              ? !0
              : !1;
          }),
          (h.SEEK_ACTIONS_TYPE = { SEEK_START: 'pss', SEEK_END: 'pse', BUTTON_UP: 'bu', BUTTON_DOWN: 'bd' });
        var i = ((a.ClientMeasureInterface = function() {
            (this.getPHT = function() {}),
              (this.getBufferLength = function() {}),
              (this.getSignalStrength = function() {}),
              (this.getRenderedFrameRate = function() {});
          }),
          (a.HttpInterface = function() {
            (this.makeRequest = function(a, b, c, d, e, f) {}), (this.release = function() {});
          })),
          j = (a.LoggingInterface = function() {
            (this.consoleLog = function(a, b) {}), (this.release = function() {});
          }),
          k = (a.MetadataInterface = function() {
            (this.getBrowserName = function() {}),
              (this.getBrowserVersion = function() {}),
              (this.getDeviceBrand = function() {}),
              (this.getDeviceManufacturer = function() {}),
              (this.getDeviceModel = function() {}),
              (this.getDeviceType = function() {}),
              (this.getDeviceVersion = function() {}),
              (this.getFrameworkName = function() {}),
              (this.getFrameworkVersion = function() {}),
              (this.getOperatingSystemName = function() {}),
              (this.getOperatingSystemVersion = function() {}),
              (this.release = function() {});
          }),
          l = (a.StorageInterface = function() {
            (this.saveData = function(a, b, c, d) {}),
              (this.loadData = function(a, b, c) {}),
              (this.release = function() {});
          }),
          m = (a.SystemInterface = function(a, b, c, d, e, f) {
            function g(a, b, c, d, e, f) {
              C.validateInterface(a, new n(), 'TimeInterface'),
                C.validateInterface(b, new o(), 'TimerInterface'),
                C.validateInterface(c, new i(), 'HttpInterface'),
                C.validateInterface(d, new l(), 'StorageInterface'),
                C.validateInterface(e, new k(), 'MetadataInterface'),
                C.validateInterface(f, new j(), 'LoggingInterface'),
                (this._timeInterface = a),
                (this._timerInterface = b),
                (this._httpInterface = c),
                (this._storageInterface = d),
                (this._metadataInterface = e),
                (this._loggingInterface = f);
            }
            g.apply(this, arguments),
              (this.release = function() {
                this._timeInterface.release(),
                  (this._timeInterface = null),
                  this._timerInterface.release(),
                  (this._timerInterface = null),
                  this._httpInterface.release(),
                  (this._httpInterface = null),
                  this._storageInterface.release(),
                  (this._storageInterface = null),
                  this._metadataInterface.release(),
                  (this._metadataInterface = null),
                  this._loggingInterface.release(),
                  (this._loggingInterface = null);
              });
          }),
          n = (a.TimeInterface = function() {
            (this.getEpochTimeMs = function() {}), (this.release = function() {});
          }),
          o = (a.TimerInterface = function() {
            (this.createTimer = function(a, b, c) {}), (this.release = function() {});
          }),
          p = (b.JSON2 = {});
        !(function() {
          function a(a) {
            return 10 > a ? '0' + a : a;
          }
          function b(a) {
            return (
              (d.lastIndex = 0),
              d.test(a)
                ? '"' +
                  a.replace(d, function(a) {
                    var b = g[a];
                    return 'string' == typeof b ? b : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                  }) +
                  '"'
                : '"' + a + '"'
            );
          }
          function c(a, d) {
            var g,
              i,
              j,
              k,
              l,
              m = e,
              n = d[a];
            switch (
              (n && 'object' == typeof n && 'function' == typeof n.toJSON && (n = n.toJSON(a)),
              'function' == typeof h && (n = h.call(d, a, n)),
              typeof n)
            ) {
              case 'string':
                return b(n);
              case 'number':
                return isFinite(n) ? String(n) : 'null';
              case 'boolean':
              case 'null':
                return String(n);
              case 'object':
                if (!n) return 'null';
                if (((e += f), (l = []), Object.prototype.toString.apply(n) === Object.prototype.toString.apply([]))) {
                  for (k = n.length, g = 0; k > g; g += 1) l[g] = c(g, n) || 'null';
                  return (
                    (j =
                      0 === l.length
                        ? '[]'
                        : e
                        ? '[\n' + e + l.join(',\n' + e) + '\n' + m + ']'
                        : '[' + l.join(',') + ']'),
                    (e = m),
                    j
                  );
                }
                if (h && 'object' == typeof h)
                  for (k = h.length, g = 0; k > g; g += 1)
                    'string' == typeof h[g] && ((i = h[g]), (j = c(i, n)), j && l.push(b(i) + (e ? ': ' : ':') + j));
                else
                  for (i in n)
                    Object.prototype.hasOwnProperty.call(n, i) &&
                      ((j = c(i, n)), j && l.push(b(i) + (e ? ': ' : ':') + j));
                return (
                  (j =
                    0 === l.length
                      ? '{}'
                      : e
                      ? '{\n' + e + l.join(',\n' + e) + '\n' + m + '}'
                      : '{' + l.join(',') + '}'),
                  (e = m),
                  j
                );
            }
          }
          'function' != typeof Date.prototype.toJSON &&
            ((Date.prototype.toJSON = function() {
              return isFinite(this.valueOf())
                ? this.getUTCFullYear() +
                    '-' +
                    a(this.getUTCMonth() + 1) +
                    '-' +
                    a(this.getUTCDate()) +
                    'T' +
                    a(this.getUTCHours()) +
                    ':' +
                    a(this.getUTCMinutes()) +
                    ':' +
                    a(this.getUTCSeconds()) +
                    'Z'
                : null;
            }),
            (String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
              return this.valueOf();
            }));
          var d, e, f, g, h;
          'function' != typeof p.stringify &&
            ((d = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g),
            (g = { '\b': '\\b', '	': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }),
            (p.stringify = function(a, b, d) {
              var g;
              if (((e = ''), (f = ''), 'number' == typeof d)) for (g = 0; d > g; g += 1) f += ' ';
              else 'string' == typeof d && (f = d);
              if (((h = b), b && 'function' != typeof b && ('object' != typeof b || 'number' != typeof b.length)))
                throw new Error('JSON2.stringify');
              return c('', { '': a });
            }));
        })();
        var q = (b.JsonParse = (function() {
            var a,
              b,
              c,
              d,
              e = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '	' },
              f = function(b) {
                throw { name: 'SyntaxError', message: b, at: a, text: c };
              },
              g = function(d) {
                return d && d !== b && f("Expected '" + d + "' instead of '" + b + "'"), (b = c.charAt(a)), (a += 1), b;
              },
              h = function() {
                var a,
                  c = '';
                for ('-' === b && ((c = '-'), g('-')); b >= '0' && '9' >= b; ) (c += b), g();
                if ('.' === b) for (c += '.'; g() && b >= '0' && '9' >= b; ) c += b;
                if ('e' === b || 'E' === b)
                  for (c += b, g(), ('-' === b || '+' === b) && ((c += b), g()); b >= '0' && '9' >= b; ) (c += b), g();
                return (a = +c), isNaN(a) ? void f('Bad number') : a;
              },
              i = function() {
                var a,
                  c,
                  d,
                  h = '';
                if ('"' === b)
                  for (; g(); ) {
                    if ('"' === b) return g(), h;
                    if ('\\' === b)
                      if ((g(), 'u' === b)) {
                        for (d = 0, c = 0; 4 > c && ((a = parseInt(g(), 16)), isFinite(a)); c += 1) d = 16 * d + a;
                        h += String.fromCharCode(d);
                      } else {
                        if ('string' != typeof e[b]) break;
                        h += e[b];
                      }
                    else h += b;
                  }
                f('Bad string');
              },
              j = function() {
                for (; b && ' ' >= b; ) g();
              },
              k = function() {
                switch (b) {
                  case 't':
                    return g('t'), g('r'), g('u'), g('e'), !0;
                  case 'f':
                    return g('f'), g('a'), g('l'), g('s'), g('e'), !1;
                  case 'n':
                    return g('n'), g('u'), g('l'), g('l'), null;
                }
                f("Unexpected '" + b + "'");
              },
              l = function() {
                var a = [];
                if ('[' === b) {
                  if ((g('['), j(), ']' === b)) return g(']'), a;
                  for (; b; ) {
                    if ((a.push(d()), j(), ']' === b)) return g(']'), a;
                    g(','), j();
                  }
                }
                f('Bad array');
              },
              m = function() {
                var a,
                  c = {};
                if ('{' === b) {
                  if ((g('{'), j(), '}' === b)) return g('}'), c;
                  for (; b; ) {
                    if (
                      ((a = i()),
                      j(),
                      g(':'),
                      Object.hasOwnProperty.call(c, a) && f('Duplicate key "' + a + '"'),
                      (c[a] = d()),
                      j(),
                      '}' === b)
                    )
                      return g('}'), c;
                    g(','), j();
                  }
                }
                f('Bad object');
              };
            return (
              (d = function() {
                switch ((j(), b)) {
                  case '{':
                    return m();
                  case '[':
                    return l();
                  case '"':
                    return i();
                  case '-':
                    return h();
                  default:
                    return b >= '0' && '9' >= b ? h() : k();
                }
              }),
              function(e, g) {
                var h;
                return (
                  (c = e),
                  (a = 0),
                  (b = ' '),
                  (h = d()),
                  j(),
                  b && f('Syntax error'),
                  'function' == typeof g
                    ? (function i(a, b) {
                        var c,
                          d,
                          e = a[b];
                        if (e && 'object' == typeof e)
                          for (c in e)
                            Object.hasOwnProperty.call(e, c) &&
                              ((d = i(e, c)), void 0 !== d ? (e[c] = d) : delete e[c]);
                        return g.call(a, b, e);
                      })({ '': h }, '')
                    : h
                );
              }
            );
          })()),
          r = (b.CwsProtocol = function() {
            (this.generateEvent = function(a, b, c, d) {
              return (d.seq = a), (d.st = b), (d.t = c), d;
            }),
              (this.generateSessionEndEvent = function(a, b) {
                var c = r.EVENT_TYPE_SESSION_END,
                  d = {};
                return this.generateEvent(a, b, c, d);
              });
          });
        (r.version = '2.4'),
          (r.gatewayPath = '/0/wsg'),
          (r.DEFAULT_CLIENT_ID = '0'),
          (r.DEFAULT_MAX_HEARTBEAT_INFOS = 0),
          (r.DEFAULT_PLAYHEAD_TIME = -1),
          (r.DEFAULT_BUFFER_LENGTH = -1),
          (r.DEFAULT_SIGNAL_STRENGTH = 1e3),
          (r.SDK_METADATA_SCHEMA = 'sdk.js.1'),
          (r.EVENT_TYPE_STATE_CHANGE = 'CwsStateChangeEvent'),
          (r.EVENT_TYPE_ERROR = 'CwsErrorEvent'),
          (r.EVENT_TYPE_SESSION_END = 'CwsSessionEndEvent'),
          (r.EVENT_TYPE_CUSTOM = 'CwsCustomEvent'),
          (r.EVENT_TYPE_SEEK = 'CwsSeekEvent'),
          (r.EVENT_TYPE_DATA_SAMPLE = 'CwsDataSamplesEvent'),
          (r.RESPONSE_STATUS_NO_ERRORS = 'ok'),
          (r.RESPONSE_KEY_STATUS = 'err'),
          (r.RESPONSE_KEY_CLIENT_ID = 'clid'),
          (r.RESPONSE_KEY_CONFIG = 'cfg'),
          (r.RESPONSE_KEY_EVENTS = 'evs'),
          (r.RESPONSE_CONFIG_KEY_MAX_HEARTBEAT_INFOS = 'maxhbinfos'),
          (r.RESPONSE_CONFIG_KEY_SEND_LOGS = 'slg'),
          (r.RESPONSE_CONFIG_KEY_HEARTBEAT_INTERVAL = 'hbi'),
          (r.RESPONSE_CONFIG_KEY_GATEWAY_URL = 'gw'),
          (r.MESSAGE_TYPE_SESSION_HEARTBEAT = 'CwsSessionHb'),
          (r.REQUEST_KEY_MESSAGE_TYPE = 't'),
          (r.REQUEST_KEY_SESSION_TIME = 'st'),
          (r.REQUEST_KEY_SESSION_START_TIME = 'sst'),
          (r.REQUEST_KEY_IS_LIVE = 'lv'),
          (r.REQUEST_KEY_SEQUENCE_NUMBER = 'seq'),
          (r.REQUEST_KEY_CUSTOMER_KEY = 'cid'),
          (r.REQUEST_KEY_CLIENT_ID = 'clid'),
          (r.REQUEST_KEY_CLIENT_VERSION = 'clv'),
          (r.REQUEST_KEY_PROTOCOL_VERSION = 'pver'),
          (r.REQUEST_KEY_INSTANCE_ID = 'iid'),
          (r.REQUEST_KEY_SESSION_ID = 'sid'),
          (r.REQUEST_KEY_VIEWER_ID = 'vid'),
          (r.REQUEST_KEY_ASSET_NAME = 'an'),
          (r.REQUEST_KEY_PLAYER_NAME = 'pn'),
          (r.REQUEST_KEY_TAGS = 'tags'),
          (r.REQUEST_KEY_SESSION_FLAGS = 'sf'),
          (r.REQUEST_KEY_EVENTS = 'evs'),
          (r.REQUEST_KEY_LOGS = 'lg'),
          (r.REQUEST_KEY_HEARTBEAT_INFOS = 'hbinfos'),
          (r.REQUEST_KEY_IS_SDK_CLIENT = 'sdk'),
          (r.REQUEST_KEY_PAUSE_JOIN = 'pj'),
          (r.REQUEST_KEY_PLAYER_STATE = 'ps'),
          (r.REQUEST_KEY_BITRATE = 'br'),
          (r.REQUEST_KEY_CONTENT_LENGTH = 'cl'),
          (r.REQUEST_KEY_ENCODED_FRAME_RATE = 'efps'),
          (r.REQUEST_KEY_AVERAGE_FRAME_RATE = 'afps'),
          (r.REQUEST_KEY_RFPS_TOTAL = 'rfpstot'),
          (r.REQUEST_KEY_RFPS_COUNT = 'rfpscnt'),
          (r.REQUEST_KEY_RESOURCE = 'rs'),
          (r.REQUEST_KEY_PLAYHEAD_TIME = 'pht'),
          (r.REQUEST_KEY_BUFFER_LENGTH = 'bl'),
          (r.REQUEST_KEY_STREAM_URL = 'url'),
          (r.REQUEST_KEY_CAPABILITIES = 'caps'),
          (r.REQUEST_KEY_PLATFORM_METADATA = 'pm'),
          (r.REQUEST_KEY_VIDEO_WIDTH = 'w'),
          (r.REQUEST_KEY_VIDEO_HEIGHT = 'h'),
          (r.REQUEST_KEY_CONNECTION_TYPE = 'ct'),
          (r.REQUEST_KEY_LINK_ENCRYPTION = 'le'),
          (r.REQUEST_KEY_SIGNAL_STRENGTH = 'ss'),
          (r.REQUEST_KEY_STREAM_METADATA_CHANGE = 'strmetadata'),
          (r.REQUEST_PLATFORM_METADATA_KEY_SCHEMA = 'sch'),
          (r.REQUEST_PLATFORM_METADATA_KEY_BROWSER_NAME = 'br'),
          (r.REQUEST_PLATFORM_METADATA_KEY_BROWSER_VERSION = 'brv'),
          (r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_BRAND = 'dvb'),
          (r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_MANUFACTURER = 'dvma'),
          (r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_MODEL = 'dvm'),
          (r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_TYPE = 'dvt'),
          (r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_VERSION = 'dvv'),
          (r.REQUEST_PLATFORM_METADATA_KEY_FRAMEWORK_NAME = 'fw'),
          (r.REQUEST_PLATFORM_METADATA_KEY_FRAMEWORK_VERSION = 'fwv'),
          (r.REQUEST_PLATFORM_METADATA_KEY_CLIENT_CONFIGURATION = 'cc'),
          (r.REQUEST_PLATFORM_METADATA_KEY_MODULE_NAME = 'mn'),
          (r.REQUEST_PLATFORM_METADATA_KEY_MODULE_VERSION = 'mv'),
          (r.REQUEST_PLATFORM_METADATA_KEY_OPERATING_SYSTEM_NAME = 'pt'),
          (r.REQUEST_PLATFORM_METADATA_KEY_OPERATING_SYSTEM_VERSION = 'ptv'),
          (r.REQUEST_KEY_PROTOCOL_CAPP = 'caps'),
          (r.REQUEST_EVENT_KEY_TYPE = 't'),
          (r.REQUEST_EVENT_KEY_SEQUENCE_NUMBER = 'seq'),
          (r.REQUEST_EVENT_KEY_SESSION_TIME = 'st'),
          (r.REQUEST_EVENT_KEY_SEEK_ACT_TYPE = 'act'),
          (r.REQUEST_EVENT_KEY_SEEK_TO_POS = 'skto'),
          (r.REQUEST_ERROR_EVENT_KEY_MESSAGE = 'err'),
          (r.REQUEST_ERROR_EVENT_KEY_FATAL = 'ft'),
          (r.REQUEST_STATE_CHANGE_EVENT_KEY_NEW = 'new'),
          (r.REQUEST_STATE_CHANGE_EVENT_KEY_OLD = 'old'),
          (r.REQUEST_CUSTOM_EVENT_KEY_NAME = 'name'),
          (r.REQUEST_CUSTOM_EVENT_KEY_ATTRIBUTES = 'attr'),
          (r.REQUEST_HEARTBEAT_INFO_KEY_SEQUENCE_NUMBER = 'seq'),
          (r.REQUEST_HEARTBEAT_INFO_KEY_STATUS = 'err'),
          (r.REQUEST_HEARTBEAT_INFO_KEY_ROUNDTRIP_TIME = 'rtt'),
          (r.REQUEST_KEY_IS_AD_SESSION = 'ad'),
          (r.convertPlayerState = function(a) {
            switch (a) {
              case h.PlayerState.STOPPED:
                return r.eStopped;
              case h.PlayerState.PLAYING:
                return r.ePlaying;
              case h.PlayerState.BUFFERING:
                return r.eBuffering;
              case h.PlayerState.PAUSED:
                return r.ePaused;
              case h.PlayerState.NOT_MONITORED:
                return r.eNotMonitored;
              default:
                return r.eUnknown;
            }
          }),
          (r.eStopped = 1),
          (r.ePlaying = 3),
          (r.eBuffering = 6),
          (r.ePaused = 12),
          (r.eNotMonitored = 98),
          (r.eUnknown = 100),
          (r.SessionFlags = { GLOBAL: 0, VIDEO: 1, QUALITY_METRICS: 2, BITRATE_METRICS: 4 }),
          (r.Capabilities = { INSIGHTS: 0 });
        var s = ((b.JSONInterface = function() {
            (this.encode = function(a) {}), (this.decode = function(a) {});
          }),
          (b.LibJSONInterface = function() {
            (this.encode = function(a) {
              var b = null;
              try {
                b = p.stringify(a);
              } catch (c) {}
              return b;
            }),
              (this.decode = function(a) {
                var b = null;
                try {
                  b = q(a);
                } catch (c) {}
                return C.isObject(b) || (b = null), b;
              });
          })),
          t = (b.CwsHeartbeat = function() {
            function a() {}
            (this._data = {}),
              a.apply(this, arguments),
              (this.get = function() {
                return this._data;
              }),
              (this.setField = function(a, b) {
                this._data[a] = b;
              }),
              (this.setInnerField = function(a, b, c) {
                this._data[a] || (this._data[a] = {}), (this._data[a][b] = c);
              }),
              (this.setMessageType = function(a) {
                this.setField(r.REQUEST_KEY_MESSAGE_TYPE, a);
              }),
              (this.setSessionTime = function(a) {
                this.setField(r.REQUEST_KEY_SESSION_TIME, a);
              }),
              (this.setSessionStartTime = function(a) {
                this.setField(r.REQUEST_KEY_SESSION_START_TIME, a);
              }),
              (this.setIsLive = function(a) {
                this.setField(r.REQUEST_KEY_IS_LIVE, a);
              }),
              (this.setSequenceNumber = function(a) {
                this.setField(r.REQUEST_KEY_SEQUENCE_NUMBER, a);
              }),
              (this.setCustomerKey = function(a) {
                this.setField(r.REQUEST_KEY_CUSTOMER_KEY, a);
              }),
              (this.setClientId = function(a) {
                this.setField(r.REQUEST_KEY_CLIENT_ID, a);
              }),
              (this.setClientVersion = function(a) {
                this.setField(r.REQUEST_KEY_CLIENT_VERSION, a);
              }),
              (this.setProtocolVersion = function(a) {
                this.setField(r.REQUEST_KEY_PROTOCOL_VERSION, a);
              }),
              (this.setCapfield = function(a) {
                this.setField(r.REQUEST_KEY_PROTOCOL_CAPP, a);
              }),
              (this.setSessionId = function(a) {
                this.setField(r.REQUEST_KEY_SESSION_ID, a);
              }),
              (this.setInstanceId = function(a) {
                this.setField(r.REQUEST_KEY_INSTANCE_ID, a);
              }),
              (this.setViewerId = function(a) {
                this.setField(r.REQUEST_KEY_VIEWER_ID, a);
              }),
              (this.setAssetName = function(a) {
                this.setField(r.REQUEST_KEY_ASSET_NAME, a);
              }),
              (this.setPlayerName = function(a) {
                this.setField(r.REQUEST_KEY_PLAYER_NAME, a);
              }),
              (this.setTags = function(a) {
                this.setField(r.REQUEST_KEY_TAGS, a);
              }),
              (this.setSessionFlags = function(a) {
                this.setField(r.REQUEST_KEY_SESSION_FLAGS, a);
              }),
              (this.setCapabilities = function(a) {
                this.setField(r.REQUEST_KEY_CAPABILITIES, a);
              }),
              (this.setEvents = function(a) {
                this.setField(r.REQUEST_KEY_EVENTS, a);
              }),
              (this.setIsSdkClient = function(a) {
                this.setField(r.REQUEST_KEY_IS_SDK_CLIENT, a);
              }),
              (this.setLogs = function(a) {
                this.setField(r.REQUEST_KEY_LOGS, a);
              }),
              (this.setHeartbeatInfos = function(a) {
                this.setField(r.REQUEST_KEY_HEARTBEAT_INFOS, a);
              }),
              (this.setPlayerState = function(a) {
                this.setField(r.REQUEST_KEY_PLAYER_STATE, a);
              }),
              (this.setPauseJoin = function(a) {
                this.setField(r.REQUEST_KEY_PAUSE_JOIN, a);
              }),
              (this.setContentLength = function(a) {
                this.setField(r.REQUEST_KEY_CONTENT_LENGTH, a);
              }),
              (this.setBitrate = function(a) {
                this.setField(r.REQUEST_KEY_BITRATE, a);
              }),
              (this.setResource = function(a) {
                this.setField(r.REQUEST_KEY_RESOURCE, a);
              }),
              (this.setEncodedFrameRate = function(a) {
                this.setField(r.REQUEST_KEY_ENCODED_FRAME_RATE, a);
              }),
              (this.setAverageFrameRate = function(a) {
                this.setField(r.REQUEST_KEY_AVERAGE_FRAME_RATE, a);
              }),
              (this.setRfpsObservationCount = function(a) {
                this.setField(r.REQUEST_KEY_RFPS_COUNT, a);
              }),
              (this.setRfpsTotal = function(a) {
                this.setField(r.REQUEST_KEY_RFPS_TOTAL, a);
              }),
              (this.setPlatformMetadataSchema = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_SCHEMA, a);
              }),
              (this.setBrowserName = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_BROWSER_NAME, a);
              }),
              (this.setBrowserVersion = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_BROWSER_VERSION, a);
              }),
              (this.setDeviceBrand = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_BRAND, a);
              }),
              (this.setDeviceManufacturer = function(a) {
                this.setInnerField(
                  r.REQUEST_KEY_PLATFORM_METADATA,
                  r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_MANUFACTURER,
                  a,
                );
              }),
              (this.setDeviceModel = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_MODEL, a);
              }),
              (this.setDeviceType = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_TYPE, a);
              }),
              (this.setDeviceVersion = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_DEVICE_VERSION, a);
              }),
              (this.setFrameworkName = function(a) {
                this.setInnerField(r.REQUEST_KEY_PLATFORM_METADATA, r.REQUEST_PLATFORM_METADATA_KEY_FRAMEWORK_NAME, a),
                  this.setField(r.REQUEST_PLATFORM_METADATA_KEY_FRAMEWORK_NAME, a);
              }),
              (this.setFrameworkVersion = function(a) {
                this.setInnerField(
                  r.REQUEST_KEY_PLATFORM_METADATA,
                  r.REQUEST_PLATFORM_METADATA_KEY_FRAMEWORK_VERSION,
                  a,
                ),
                  this.setField(r.REQUEST_PLATFORM_METADATA_KEY_FRAMEWORK_VERSION, a);
              }),
              (this.setOperatingSystemName = function(a) {
                this.setInnerField(
                  r.REQUEST_KEY_PLATFORM_METADATA,
                  r.REQUEST_PLATFORM_METADATA_KEY_OPERATING_SYSTEM_NAME,
                  a,
                ),
                  this.setField(r.REQUEST_PLATFORM_METADATA_KEY_OPERATING_SYSTEM_NAME, a);
              }),
              (this.setOperatingSystemVersion = function(a) {
                this.setInnerField(
                  r.REQUEST_KEY_PLATFORM_METADATA,
                  r.REQUEST_PLATFORM_METADATA_KEY_OPERATING_SYSTEM_VERSION,
                  a,
                ),
                  this.setField(r.REQUEST_PLATFORM_METADATA_KEY_OPERATING_SYSTEM_VERSION, a);
              }),
              (this.setPlayheadTime = function(a) {
                this.setField(r.REQUEST_KEY_PLAYHEAD_TIME, a);
              }),
              (this.setBufferLength = function(a) {
                this.setField(r.REQUEST_KEY_BUFFER_LENGTH, a);
              }),
              (this.setStreamUrl = function(a) {
                this.setField(r.REQUEST_KEY_STREAM_URL, a);
              }),
              (this.setStreamWidth = function(a) {
                this.setField(r.REQUEST_KEY_VIDEO_WIDTH, a);
              }),
              (this.setStreamHeight = function(a) {
                this.setField(r.REQUEST_KEY_VIDEO_HEIGHT, a);
              }),
              (this.setConnectionType = function(a) {
                this.setField(r.REQUEST_KEY_CONNECTION_TYPE, a);
              }),
              (this.setLinkEncryption = function(a) {
                this.setField(r.REQUEST_KEY_LINK_ENCRYPTION, a);
              }),
              (this.setIsAdSession = function() {
                this.setField(r.REQUEST_KEY_IS_AD_SESSION, !0);
              }),
              (this.setSignalStrength = function(a) {
                this.setField(r.REQUEST_KEY_SIGNAL_STRENGTH, a);
              }),
              (this.setModuleName = function(a) {
                this.setInnerField(
                  r.REQUEST_PLATFORM_METADATA_KEY_CLIENT_CONFIGURATION,
                  r.REQUEST_PLATFORM_METADATA_KEY_MODULE_NAME,
                  a,
                );
              }),
              (this.setModuleVersion = function(a) {
                this.setInnerField(
                  r.REQUEST_PLATFORM_METADATA_KEY_CLIENT_CONFIGURATION,
                  r.REQUEST_PLATFORM_METADATA_KEY_MODULE_VERSION,
                  a,
                );
              });
          }),
          u = (b.CwsSession = function(a, b, d, e, f, g, i, j, k, l, m) {
            function n(a, b, c, d, e, f, g, h, i, j, k) {
              (this._eventQueue = a),
                (this._client = b),
                (this._clientSettings = c),
                (this._logger = d),
                this._logger.setModuleName('CwsSession'),
                (this._exceptionCatcher = e),
                (this._timer = f),
                (this._gatewayControl = g),
                (this._cwsProtocol = h),
                (this._time = i),
                (this._logBuffer = j),
                (this._clientConfig = k);
            }
            var o = this;
            (o._heartbeatTimerCancel = null),
              (o._startTimeMs = 0),
              (o._heartbeatSequenceNumber = 0),
              (o._sessionFlags = r.SessionFlags.GLOBAL),
              (o._capabilities = r.Capabilities.INSIGHTS),
              (o._heartbeatInfos = []),
              (o._lastRequestSentMs = -1),
              (o._bitrateKbps = -2),
              (o._resource = null),
              (o._playerState = h.PlayerState.NOT_MONITORED),
              (o._encodedFrameRate = -1),
              (o._contentLengthSec = -1),
              (o._streamUrl = null),
              (o._width = -1),
              (o._height = -1),
              (o._playerStateManager = null),
              (o._assetName = null),
              (o._viewerId = null),
              (o._playerName = null),
              (o._isLive = null),
              (o._tags = {}),
              (o._browserName = null),
              (o._browserVersion = null),
              (o._deviceBrand = null),
              (o._deviceManufacturer = null),
              (o._deviceModel = null),
              (o._deviceType = null),
              (o._deviceVersion = null),
              (o._frameworkName = null),
              (o._frameworkVersion = null),
              (o._operatingSystemName = null),
              (o._operatingSystemVersion = null),
              (o._moduleName = null),
              (o._moduleVersion = null),
              (o._connectionType = null),
              (o._linkEncryption = null),
              (o._pauseJoin = !1),
              (o._hasJoined = !1),
              (o._cleanedUp = !1),
              (o._willEndSoon = !1),
              (o._rfpsTimerCancel = null),
              (o._rfpsTimerInterval = 1e3),
              (o._playingFpsObservationCount = 0),
              (o._playingFpsTotal = 0),
              n.apply(this, arguments),
              (this.cleanup = function() {
                (this._clientConfig = null),
                  (this._logBuffer = null),
                  (this._systemSettings = null),
                  (this._time = null),
                  (this._cwsProtocol = null),
                  (this._gatewayControl = null),
                  (this._timer = null),
                  (this._exceptionCatcher = null),
                  (this._logger = null),
                  (this._clientSettings = null),
                  (this._client = null),
                  this._eventQueue.flush(),
                  (this._eventQueue = null),
                  (this._cleanedUp = !0);
              }),
              (this.start = function(a) {
                (this._session = a),
                  (this._global = this._session._global),
                  this._logger.setSessionId(this._session._id),
                  (this._startTimeMs = this._time.current()),
                  (this.isVideoSession() || this.isAdSession()) &&
                    (this._sessionFlags += u.DEFAULT_VIDEO_SESSION_FLAGS);
              }),
              (this.willEndSoon = function() {
                this._willEndSoon = !0;
              }),
              (this.initialize = function() {
                this._logger.debug('initialize()');
              }),
              (this.end = function() {
                (this.isVideoSession() || this.isAdSession()) &&
                  (this._logger.debug('end(): schedule the last hb before session cleanup' + o.sessionTypeTag()),
                  this.enqueueSessionEndEvent()),
                  this.cancelHeartbeatTimer(),
                  this.sendHeartbeat();
              }),
              (this.startSendingHeartbeats = function() {
                this._willEndSoon || (this.sendHeartbeat(), this.resetHeartbeatTimer());
              }),
              (this.setBrowserName = function(a) {
                o._logger.debug('setBrowserName(): ' + a);
                var b = o._browserName;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change browserName from ' + b + ' to ' + a), (o._browserName = a));
              }),
              (this.setBrowserVersion = function(a) {
                o._logger.debug('setBrowserVersion(): ' + a);
                var b = o._browserVersion;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change browserVersion from ' + b + ' to ' + a), (o._browserVersion = a));
              }),
              (this.setDeviceBrand = function(a) {
                o._logger.debug('setDeviceBrand(): ' + a);
                var b = o._deviceBrand;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change deviceBrand from ' + b + ' to ' + a), (o._deviceBrand = a));
              }),
              (this.setDeviceManufacturer = function(a) {
                o._logger.debug('setDeviceManufacturer(): ' + a);
                var b = o._deviceManufacturer;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change deviceManufacturer from ' + b + ' to ' + a), (o._deviceManufacturer = a));
              }),
              (this.setDeviceModel = function(a) {
                o._logger.debug('setDeviceModel(): ' + a);
                var b = o._deviceModel;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change deviceModel from ' + b + ' to ' + a), (o._deviceModel = a));
              }),
              (this.setDeviceType = function(a) {
                o._logger.debug('setDeviceBrand(): ' + a);
                var b = o._deviceType;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change deviceType from ' + b + ' to ' + a), (o._deviceType = a));
              }),
              (this.setDeviceVersion = function(a) {
                o._logger.debug('setDeviceVersion(): ' + a);
                var b = o._deviceVersion;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change deviceVersion from ' + b + ' to ' + a), (o._deviceVersion = a));
              }),
              (this.setOperatingSystemName = function(a) {
                o._logger.debug('setOperatingSystemName(): ' + a);
                var b = o._operatingSystemName;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change operatingSystemName from ' + b + ' to ' + a), (o._operatingSystemName = a));
              }),
              (this.setOperatingSystemVersion = function(a) {
                o._logger.debug('setOperatingSystemVersion(): ' + a);
                var b = o._operatingSystemVersion;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change operatingSystemVersion from ' + b + ' to ' + a),
                  (o._operatingSystemVersion = a));
              }),
              (this.getFrameworkName = function() {
                return o._frameworkName;
              }),
              (this.setFrameworkName = function(a) {
                o._logger.debug('setFrameworkName(): ' + a);
                var b = o._frameworkName;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change frameworkName from ' + b + ' to ' + a), (o._frameworkName = a));
              }),
              (this.getFrameworkVersion = function() {
                return o._frameworkVersion;
              }),
              (this.setFrameworkVersion = function(a) {
                o._logger.debug('setFrameworkVersion(): ' + a);
                var b = o._frameworkVersion;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change frameworkVersion from ' + b + ' to ' + a), (o._frameworkVersion = a));
              }),
              (this.setStreamUrl = function(a) {
                o._logger.debug('setStreamUrl(): ' + a);
                var b = o._streamUrl;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change stream url from ' + b + ' to ' + a), (o._streamUrl = a));
              }),
              (this.setBitrateKbps = function(a) {
                o._logger.debug('setBitrateKbps(): ' + a);
                var b = o._bitrateKbps;
                b !== a &&
                  a > 0 &&
                  (o._logger.info('Change bitrate from ' + b + ' to ' + a),
                  o.enqueueBitrateChangeEvent(b, a),
                  (o._bitrateKbps = a));
              }),
              (this.setResource = function(a) {
                o._logger.debug('setResource(): ' + a);
                var b = o._resource;
                b !== a && null != a && (o._logger.info('Change resource from ' + b + ' to ' + a), (o._resource = a));
              }),
              (this.setAssetName = function(a) {
                o._logger.debug('setAssetName(): ' + a),
                  o._assetName !== a &&
                    null != a &&
                    (o._logger.info('Change assetName from ' + o._assetName + ' to ' + a), (o._assetName = a));
              }),
              (this.setIsLive = function(a) {
                o._logger.debug('setIsLive(): ' + a);
                var b = o._isLive;
                b !== a && null != a && (o._logger.info('Change isLive from ' + b + ' to ' + a), (o._isLive = a));
              }),
              (this.setViewerId = function(a) {
                o._logger.debug('setViewerId(): ' + a);
                var b = o._viewerId;
                b !== a && null != a && (o._logger.info('Change viewerId from ' + b + ' to ' + a), (o._viewerId = a));
              }),
              (this.setPlayerName = function(a) {
                o._logger.debug('setPlayerName(): ' + a);
                var b = o._playerName;
                b !== a &&
                  null != a &&
                  (o._logger.info('Change playerName from ' + b + ' to ' + a), (o._playerName = a));
              }),
              (this.setTags = function(a) {
                o._logger.debug('setTags()');
                var b = o._tags;
                C.ObjectShallowEquals(b, a) ||
                  null == a ||
                  (o._logger.info('Change tags from ' + C.ObjectToString(b) + ' to ' + C.ObjectToString(a)),
                  (o._tags = a));
              }),
              (this.setEncodedFrameRate = function(a) {
                o._logger.debug('setEncodedFrameRate(): ' + a), (o._encodedFrameRate = a);
              }),
              (this.setContentLength = function(a) {
                o._logger.debug('setContentLength(): ' + a), (o._contentLengthSec = a);
              }),
              (this.setPlayerState = function(a) {
                if (
                  (o._logger.debug('setPlayerState(): ' + a),
                  o._hasJoined || a != h.PlayerState.PLAYING || (o.togglePauseJoin(!1), (o._hasJoined = !0)),
                  o._playerState !== a)
                ) {
                  var b = o._playerState;
                  o._logger.info('setPlayerState(): changing player state from ' + b + ' to ' + a),
                    o.enqueuePlayerStateChangeEvent(b, a),
                    (o._playerState = a);
                }
              }),
              (this.setStreamResolutionWidth = function(a) {
                o._logger.debug('setStreamResolutionWidth(): ' + a);
                var b = o._width;
                b !== a &&
                  a > 0 &&
                  (o._logger.debug('Change stream resolution width from ' + b + ' to ' + a),
                  o.enqueueResolutionWidthChangeEvent(b, a),
                  (o._width = a));
              }),
              (this.setStreamResolutionHeight = function(a) {
                o._logger.debug('setStreamResolutionHeight(): ' + a);
                var b = o._height;
                b !== a &&
                  a > 0 &&
                  (o._logger.debug('Change stream resolution height from ' + b + ' to ' + a),
                  o.enqueueResolutionHeightChangeEvent(b, a),
                  (o._height = a));
              }),
              (this.setConnectionType = function(a) {
                o._logger.debug('setConnectionType(): ' + a);
                var b = o._connectionType;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change network connection type from ' + b + ' to ' + a),
                  o.enqueueConnectionTypeChangeEvent(b, a),
                  (o._connectionType = a));
              }),
              (this.setLinkEncryption = function(a) {
                o._logger.debug('setLinkEncryption(): ' + a);
                var b = o._linkEncryption;
                b !== a &&
                  null != a &&
                  (o._logger.debug('Change network link encryption from ' + b + ' to ' + a),
                  o.enqueueLinkEncryptionChangeEvent(b, a),
                  (o._linkEncryption = a));
              }),
              (this.togglePauseJoin = function(a) {
                if ((o._logger.debug('togglePauseJoin()'), o._pauseJoin === a))
                  return void o._logger.debug('togglePauseJoin(): same value, ignoring');
                var b = o._pauseJoin,
                  c = !o._pauseJoin;
                o.enqueuePauseJoinChangeEvent(b, c), (o._pauseJoin = !o._pauseJoin);
              }),
              (this.sendError = function(a, b) {
                o.enqueueErrorEvent(a, b);
              }),
              (this.enqueueEvent = function(a, b) {
                if (
                  ((b[r.REQUEST_EVENT_KEY_TYPE] = a),
                  (b[r.REQUEST_EVENT_KEY_SESSION_TIME] = this.getSessionTime()),
                  (b[r.REQUEST_EVENT_KEY_SEQUENCE_NUMBER] = this._eventQueue.getNumber()),
                  this._playerStateManager)
                ) {
                  var c = G.Integer(this._playerStateManager.getPHT(), 0, null, -1),
                    d = G.Integer(this._playerStateManager.getBufferLength(), 0, null, -1);
                  c >= 0 && (b[r.REQUEST_KEY_PLAYHEAD_TIME] = c), d > 0 && (b[r.REQUEST_KEY_BUFFER_LENGTH] = d);
                }
                this._eventQueue.enqueue(b);
              }),
              (this.setPlayerStateManager = function(a) {
                (o._playerStateManager = a), null != o._playerStateManager ? o.startRfpsTimer() : o.cancelRfpsTimer();
              }),
              (this.enqueueSessionEndEvent = function() {
                var a = this.getSessionTime(),
                  b = this.getNextEventNumber(),
                  c = this._cwsProtocol.generateSessionEndEvent(b, a);
                this._eventQueue.enqueue(c);
              }),
              (this.enqueueTagsChangeEvent = function(a, b) {
                var c = null;
                C.dictCount(a) > 0 && ((c = {}), (c[r.REQUEST_KEY_TAGS] = a));
                var d = {};
                (d[r.REQUEST_KEY_TAGS] = b), this.declareStateChange(d, c);
              }),
              (this.enqueueAssetNameChangeEvent = function(a, b) {
                var c = {};
                (c[r.REQUEST_KEY_ASSET_NAME] = b), this.declareStateChange(c, null);
              }),
              (this.enqueueErrorEvent = function(a, b) {
                var c = {};
                (c[r.REQUEST_ERROR_EVENT_KEY_MESSAGE] = a),
                  (c[r.REQUEST_ERROR_EVENT_KEY_FATAL] = b),
                  this.enqueueEvent(r.EVENT_TYPE_ERROR, c);
              }),
              (this.enqueueBitrateChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                a > 0 && (d[r.REQUEST_KEY_BITRATE] = a), (c[r.REQUEST_KEY_BITRATE] = b), this.declareStateChange(c, d);
              }),
              (this.enqueueSeekEvent = function(a, b) {
                var c = {};
                (c[r.REQUEST_EVENT_KEY_SEEK_ACT_TYPE] = a),
                  b >= 0 && (c[r.REQUEST_EVENT_KEY_SEEK_TO_POS] = b),
                  this.enqueueEvent(r.EVENT_TYPE_SEEK, c);
              }),
              (this.enqueueResourceChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                null !== a && (d[r.REQUEST_KEY_RESOURCE] = a),
                  (c[r.REQUEST_KEY_RESOURCE] = b),
                  this.declareStateChange(c, d);
              }),
              (this.enqueueStreamUrlChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                null !== a && (d[r.REQUEST_KEY_STREAM_URL] = a),
                  (c[r.REQUEST_KEY_STREAM_URL] = b),
                  this.declareStateChange(c, d);
              }),
              (this.enqueueResolutionWidthChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                -1 !== a && (d[r.REQUEST_KEY_VIDEO_WIDTH] = a),
                  (c[r.REQUEST_KEY_VIDEO_WIDTH] = b),
                  this.declareStateChange(c, d);
              }),
              (this.enqueueResolutionHeightChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                -1 !== a && (d[r.REQUEST_KEY_VIDEO_HEIGHT] = a),
                  (c[r.REQUEST_KEY_VIDEO_HEIGHT] = b),
                  this.declareStateChange(c, d);
              }),
              (this.enqueueConnectionTypeChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                null !== a && (d[r.REQUEST_KEY_CONNECTION_TYPE] = a),
                  (c[r.REQUEST_KEY_CONNECTION_TYPE] = b),
                  this.declareStateChange(c, d);
              }),
              (this.enqueueLinkEncryptionChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                null !== a && (d[r.REQUEST_KEY_LINK_ENCRYPTION] = a),
                  (c[r.REQUEST_KEY_LINK_ENCRYPTION] = b),
                  this.declareStateChange(c, d);
              }),
              (this.enqueuePauseJoinChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                (d[r.REQUEST_KEY_PAUSE_JOIN] = a), (c[r.REQUEST_KEY_PAUSE_JOIN] = b), this.declareStateChange(c, d);
              }),
              (this.enqueuePlayerStateChangeEvent = function(a, b) {
                var c = {},
                  d = {};
                (c[r.REQUEST_KEY_PLAYER_STATE] = r.convertPlayerState(b)),
                  (d[r.REQUEST_KEY_PLAYER_STATE] = r.convertPlayerState(a)),
                  this.declareStateChange(c, d);
              }),
              (this.enqueueDataSamplesEvent = function() {
                var a = {};
                this.enqueueEvent(r.EVENT_TYPE_DATA_SAMPLE, a);
              }),
              (this.declareStateChange = function(a, b) {
                var c = {};
                (c[r.REQUEST_STATE_CHANGE_EVENT_KEY_NEW] = a),
                  null != b && C.dictCount(b) > 0 && (c[r.REQUEST_STATE_CHANGE_EVENT_KEY_OLD] = b),
                  this.enqueueEvent(r.EVENT_TYPE_STATE_CHANGE, c);
              }),
              (this.enqueueCustomEvent = function(a, b) {
                var c = {};
                (c[r.REQUEST_CUSTOM_EVENT_KEY_NAME] = a),
                  (c[r.REQUEST_CUSTOM_EVENT_KEY_ATTRIBUTES] = b),
                  this.enqueueEvent(r.EVENT_TYPE_CUSTOM, c);
              }),
              (this.cancelHeartbeatTimer = function() {
                null != o._heartbeatTimerCancel && (o._heartbeatTimerCancel(), (o._heartbeatTimerCancel = null));
              }),
              (this.resetHeartbeatTimer = function() {
                o.cancelHeartbeatTimer();
                var a = 1e3 * o._clientSettings.heartbeatInterval;
                o._heartbeatTimerCancel = o._timer.create(o.sendHeartbeat, a, 'Session.sendHeartbeat');
              }),
              (this.cancelRfpsTimer = function() {
                null != o._rfpsTimerCancel && (o._rfpsTimerCancel(), (o._rfpsTimerCancel = null));
              }),
              (this.startRfpsTimer = function() {
                o.cancelRfpsTimer(),
                  (o._rfpsTimerCancel = o._timer.create(o.countRfps, o._rfpsTimerInterval, 'Session.startRfpsTimer'));
              }),
              (this.createHeartbeatInfo = function() {
                var a = {};
                (a.err = 'pending'),
                  (a.seq = o._heartbeatSequenceNumber - 1),
                  (a.sentAt = o.getSessionTime()),
                  (a.rtt = -1),
                  o._heartbeatInfos.push(a);
              }),
              (this.updateHeartbeatInfoOnFailure = function(a, b) {
                for (var c = 0; c < o._heartbeatInfos.length; c++) {
                  var d = o._heartbeatInfos[c],
                    e = d.seq;
                  e === a && ((d.rtt = o.getSessionTime() - d.sentAt), (d.err = b));
                }
              }),
              (this.updateHeartbeatInfoOnSuccess = function(a) {
                for (var b = 0; b < o._heartbeatInfos.length; b++) {
                  var c = o._heartbeatInfos[b],
                    d = c.seq;
                  d === a && ((c.rtt = o.getSessionTime() - c.sentAt), (c.err = 'ok'));
                }
              }),
              (this.removeOutdatedHeartbeatInfos = function() {
                for (
                  var a, b, c = o._clientConfig.get(y.CONFIG_KEY_MAX_HEARTBEAT_INFOS), d = [], e = 0;
                  e < o._heartbeatInfos.length;
                  e++
                )
                  (b = o._heartbeatInfos[e]), (a = b.seq), a < o._heartbeatSequenceNumber - c && d.push(e);
                for (var f = [], g = 0; g < o._heartbeatInfos.length; g++)
                  (b = o._heartbeatInfos[g]), (a = b.seq), d.indexOf(g) < 0 && f.push(o._heartbeatInfos[g]);
                o._heartbeatInfos = f;
              }),
              (this.compileHeartbeatInfos = function() {
                o.removeOutdatedHeartbeatInfos();
                for (var a = [], b = 0; b < o._heartbeatInfos.length; b++) {
                  var c = o._heartbeatInfos[b],
                    d = {};
                  (d[r.REQUEST_HEARTBEAT_INFO_KEY_SEQUENCE_NUMBER] = c.seq),
                    (d[r.REQUEST_HEARTBEAT_INFO_KEY_ROUNDTRIP_TIME] = c.rtt),
                    (d[r.REQUEST_HEARTBEAT_INFO_KEY_STATUS] = c.err),
                    a.push(d);
                }
                return a;
              }),
              (this.makeHeartbeat = function() {
                var a = o._eventQueue.flush();
                if (o.isGlobalSession() && 0 === a.length) return null;
                var b = new t();
                if (
                  (b.setMessageType(r.MESSAGE_TYPE_SESSION_HEARTBEAT),
                  b.setCustomerKey(o._clientSettings.customerKey),
                  b.setClientId(o._clientConfig.get(y.CONFIG_KEY_CLIENT_ID)),
                  b.setSessionId(o._session._id),
                  b.setSequenceNumber(o._heartbeatSequenceNumber),
                  b.setProtocolVersion(r.version),
                  b.setClientVersion(c.version),
                  b.setInstanceId(o._client.getId()),
                  b.setCapfield(0),
                  null != o._connectionType && b.setConnectionType(o._connectionType),
                  null != o._linkEncryption && b.setLinkEncryption(o._linkEncryption),
                  b.setPlatformMetadataSchema(r.SDK_METADATA_SCHEMA),
                  null != o._browserName && b.setBrowserName(o._browserName),
                  null != o._browserVersion && b.setBrowserVersion(o._browserVersion),
                  null != o._deviceBrand && b.setDeviceBrand(o._deviceBrand),
                  null != o._deviceManufacturer && b.setDeviceManufacturer(o._deviceManufacturer),
                  null != o._deviceModel && b.setDeviceModel(o._deviceModel),
                  null != o._deviceType && b.setDeviceType(o._deviceType),
                  null != o._deviceVersion && b.setDeviceVersion(o._deviceVersion),
                  null != o._frameworkName && b.setFrameworkName(o._frameworkName),
                  null != o._frameworkVersion && b.setFrameworkVersion(o._frameworkVersion),
                  null != o._operatingSystemName && b.setOperatingSystemName(o._operatingSystemName),
                  null != o._operatingSystemVersion && b.setOperatingSystemVersion(o._operatingSystemVersion),
                  null != o._playerStateManager &&
                    ((o._moduleName = o._playerStateManager.getModuleName()),
                    null != o._moduleName && b.setModuleName(o._moduleName)),
                  null != o._playerStateManager &&
                    ((o._moduleVersion = o._playerStateManager.getModuleVersion()),
                    null != o._moduleVersion && b.setModuleVersion(o._moduleVersion)),
                  null != o._viewerId && b.setViewerId(o._viewerId),
                  C.dictCount(o._tags) > 0 && b.setTags(o._tags),
                  o.isVideoSession() || o.isAdSession())
                ) {
                  o.isAdSession() && b.setIsAdSession(),
                    null != o._assetName && b.setAssetName(o._assetName),
                    b.setSessionFlags(o._sessionFlags);
                  var d = r.convertPlayerState(o._playerState);
                  b.setPlayerState(d),
                    b.setPauseJoin(o._pauseJoin),
                    null != o._playerName && b.setPlayerName(o._playerName),
                    null != o._isLive && b.setIsLive(o._isLive),
                    o._contentLengthSec > 0 && b.setContentLength(o._contentLengthSec),
                    o._bitrateKbps > 0 && b.setBitrate(o._bitrateKbps),
                    null !== o._resource && b.setResource(o._resource),
                    o._encodedFrameRate > 0 && b.setEncodedFrameRate(o._encodedFrameRate);
                  var e, f, g;
                  null != o._playerStateManager &&
                    ((e = G.Integer(o._playerStateManager.getPHT(), 0, null, -1)),
                    (f = G.Integer(o._playerStateManager.getBufferLength(), 0, null, -1)),
                    (g = o._playerStateManager.getSignalStrength())),
                    e >= 0 && b.setPlayheadTime(e),
                    f > 0 && b.setBufferLength(f);
                  var h = o.updateAverageFrameRate();
                  h > 0 && b.setAverageFrameRate(h),
                    o._playingFpsTotal > 0 && b.setRfpsTotal(G.Integer(o._playingFpsTotal, 0, null, -1)),
                    o._playingFpsObservationCount > 0 &&
                      b.setRfpsObservationCount(G.Integer(o._playingFpsObservationCount, 0, null, -1)),
                    0 >= g && b.setSignalStrength(g),
                    null != o._streamUrl && b.setStreamUrl(o._streamUrl),
                    o._width > 0 && b.setStreamWidth(o._width),
                    o._height > 0 && b.setStreamHeight(o._height);
                } else b.setSessionFlags(r.SessionFlags.GLOBAL);
                if (
                  (a.length > 0 && b.setEvents(a),
                  b.setCapabilities(o._capabilities),
                  b.setIsSdkClient(!0),
                  o._clientConfig.get(y.CONFIG_KEY_SEND_LOGS) && b.setLogs(o._logBuffer.flush()),
                  o._clientConfig.get(y.CONFIG_KEY_MAX_HEARTBEAT_INFOS) > 0)
                ) {
                  var i = o.compileHeartbeatInfos();
                  i.length > 0 && b.setHeartbeatInfos(i);
                }
                return (
                  b.setSessionStartTime(o._startTimeMs),
                  b.setSessionTime(o.getSessionTime()),
                  o._heartbeatSequenceNumber++,
                  b.get()
                );
              }),
              (this.sendHeartbeat = function() {
                if (!o._cleanedUp) {
                  var a = o.makeHeartbeat();
                  null != a && o.postHeartbeat(a);
                }
              }),
              (this.countRfps = function() {
                if (o._playerState === h.PlayerState.PLAYING) {
                  var a = o._playerStateManager.getRenderedFrameRate();
                  a >= 0 && ((o._playingFpsTotal += a), o._playingFpsObservationCount++);
                }
              }),
              (this.updateAverageFrameRate = function() {
                if (o._playerState === h.PlayerState.PLAYING) {
                  var a = o._playerStateManager.getRenderedFrameRate();
                  if (a >= 0) {
                    (o._playingFpsTotal += a), o._playingFpsObservationCount++;
                    var b = C.Int32.Cast((1 * o._playingFpsTotal) / o._playingFpsObservationCount);
                    return b;
                  }
                  return -1;
                }
                return -1;
              }),
              (this.postHeartbeat = function(a) {
                o.createHeartbeatInfo();
                var b = o._heartbeatSequenceNumber - 1;
                o._logger.info('postHeartbeat(): Send HB[' + b + ']' + o.sessionTypeTag());
                var c = function(a, c) {
                  o.onHeartbeatResponse(a, c, b);
                };
                o._gatewayControl.send(a, c);
              }),
              (this.onHeartbeatResponse = function(a, b, c) {
                o._cleanedUp ||
                  o._exceptionCatcher.runProtected('onHeartbeatResponse', function() {
                    if (a) {
                      var d = b;
                      if (null != d) {
                        o._logger.debug('onHeartbeatResponse(): received valid response for HB[' + c + ']'),
                          o.updateHeartbeatInfoOnSuccess(c);
                        var e = d[r.RESPONSE_KEY_CLIENT_ID];
                        null != e &&
                          e != o._clientConfig.get(y.CONFIG_KEY_CLIENT_ID) &&
                          (o._logger.debug('onHeartbeatResponse(): setting the client id to ' + e + ' (from gateway)'),
                          o._clientConfig.set(y.CONFIG_KEY_CLIENT_ID, e),
                          o._clientConfig.save());
                        var f = d[r.RESPONSE_KEY_STATUS];
                        null != f &&
                          f != r.RESPONSE_STATUS_NO_ERRORS &&
                          o._logger.error('onHeartbeatResponse(): error from gateway: ' + f);
                        var g = d[r.RESPONSE_KEY_CONFIG];
                        if ('object' == typeof g) {
                          var h = g[r.RESPONSE_CONFIG_KEY_MAX_HEARTBEAT_INFOS];
                          null != h &&
                            o._clientConfig.get(y.CONFIG_KEY_MAX_HEARTBEAT_INFOS) !== h &&
                            (o._logger.debug(
                              'onHeartbeatResponse(): setting Maximum Heartbeat Infos to ' + h + ' (from gateway)',
                            ),
                            o._clientConfig.set(y.CONFIG_KEY_MAX_HEARTBEAT_INFOS, h));
                          var i = g[r.RESPONSE_CONFIG_KEY_SEND_LOGS],
                            j = null != i ? C.AsBoolean(i) : !1;
                          j !== o._clientConfig.get(y.CONFIG_KEY_SEND_LOGS) &&
                            (o._logger.debug(
                              'onHeartbeatResponse(): turning ' + (j ? 'on' : 'off') + ' sending of logs',
                            ),
                            o._clientConfig.set(y.CONFIG_KEY_SEND_LOGS, j));
                          var k = g[r.RESPONSE_CONFIG_KEY_HEARTBEAT_INTERVAL];
                          if (null != k) {
                            var l = C.Int32.Cast(k),
                              m = l;
                            m != o._clientSettings.heartbeatInterval &&
                              (o._logger.debug('onHeartbeatResponse(): received hbIntervalMs from gateway: ' + m),
                              (o._clientSettings.heartbeatInterval = m),
                              null != o._heartbeatTimerCancel && o.resetHeartbeatTimer());
                          }
                          var n = g[r.RESPONSE_CONFIG_KEY_GATEWAY_URL];
                          null != n &&
                            n != o._clientSettings.gatewayUrl &&
                            (o._logger.debug('onHeartbeatResponse(): received gatewayUrl from gateway: ' + n),
                            (o._clientSettings.gatewayUrl = n));
                        }
                      } else o._logger.warning('onHeartbeatResponse(): decoded heartbeat response is null.');
                    } else {
                      var p = b;
                      C.isValidString(p)
                        ? C.stringStartsWith(p, 'HTTP timeout')
                          ? o._logger.warning('onHeartbeatResponse(): ' + p)
                          : o._logger.error('onHeartbeatResponse(): failed to send heartbeat: ' + p)
                        : ((p = v.DEFAULT_HEARTBEAT_ERROR_MESSAGE), o._logger.error('onHeartbeatResponse(): ' + p)),
                        o.updateHeartbeatInfoOnFailure(c, p);
                    }
                  });
              }),
              (this.getSessionTime = function() {
                var a = C.Int32.Cast(o._time.current() - o._startTimeMs);
                return a;
              }),
              (this.getNextEventNumber = function() {
                return this._eventQueue.getNumber();
              }),
              (this.sessionTypeTag = function() {
                return this.isGlobalSession() ? ' (global session)' : '';
              }),
              (this.isGlobalSession = function() {
                return this._global == u.SESSION_TYPE.GLOBAL;
              }),
              (this.isVideoSession = function() {
                return this._global == u.SESSION_TYPE.VIDEO;
              }),
              (this.isAdSession = function() {
                return this._global == u.SESSION_TYPE.AD;
              });
          });
        (u.DEFAULT_VIDEO_SESSION_FLAGS =
          r.SessionFlags.VIDEO + r.SessionFlags.QUALITY_METRICS + r.SessionFlags.BITRATE_METRICS),
          (u.SESSION_TYPE = { VIDEO: 'Video', GLOBAL: 'Global', AD: 'Ad' });
        var v = ((b.IMonitor = function() {
          (this.onPlayerStateChange = function(a) {}),
            (this.onBitrateChange = function(a) {}),
            (this.onSeekEvent = function(a, b) {}),
            (this.onEncodedFrameRateChange = function(a) {}),
            (this.onRenderedFrameRateChange = function(a) {}),
            (this.onContentLengthChange = function(a) {}),
            (this.onPlayheadTimeChange = function(a) {}),
            (this.onStreamUrlChange = function(a) {}),
            (this.onBufferLengthChange = function(a) {}),
            (this.onPlayerTypeChange = function(a) {}),
            (this.onPlayerVersionChange = function(a) {}),
            (this.onStreamResolutionWidthChange = function(a) {}),
            (this.onStreamResolutionHeightChange = function(a) {}),
            (this.onConnectionTypeChange = function(a) {}),
            (this.onLinkEncryptionChange = function(a) {}),
            (this.onSignalStrengthChange = function(a) {}),
            (this.onError = function(a, b) {}),
            (this.onRelease = function() {});
        }),
        (b.Session = function() {
          function b(a, b, c, d, e, f, g, h) {
            (this._id = a),
              (this._global = b),
              (this._contentMetadata = c),
              (this._clientConfig = d),
              (this._systemMetadata = e),
              (this._cwsSession = f),
              (this._exceptionCatcher = g),
              (this._logger = h),
              this._logger.setModuleName('Session'),
              this._logger.setSessionId(C.ToString(this._id));
          }
          var c = this;
          (c._contentMetadata = null),
            (c._playerStateManager = null),
            (c._id = 0),
            (c._global = u.SESSION_TYPE.VIDEO),
            (c._cleaningUp = !1),
            (c._cleanedUp = !1),
            (c._adPlaying = !1),
            (c._adStream = null),
            (c._adPlayer = null),
            (c._adPosition = null),
            (c._ignorePlayerState = !1),
            (c._pooledPlayerState = h.PlayerState.NOT_MONITORED),
            (c._ignoreBitrateAndResource = !1),
            (c._ignorePlayheadTimeandBufferLength = !1),
            (c._ignoreEncodedFrameRateAndDuration = !1),
            (c._ignoreError = !1),
            b.apply(c, arguments),
            (this.start = function() {
              if (
                (c.isVideoSession() || c.isAdSession()
                  ? c._logger.info('start(): assetName=' + c._contentMetadata.assetName)
                  : c._logger.info('start()' + c.sessionTypeTag()),
                c._cwsSession.start(this),
                c._clientConfig.isReady())
              )
                c.initiateSession();
              else {
                var a = function() {
                  c.initiateSession();
                };
                c._clientConfig.register(a);
              }
            }),
            (this.cleanup = function() {
              if (
                (c._logger.info('cleanup()' + c.sessionTypeTag()),
                (c._cleaningUp = !0),
                c._cwsSession.willEndSoon(),
                c._clientConfig.isReady())
              )
                c.endCwsSessionAndCleanupAll();
              else {
                var a = function() {
                  c.endCwsSessionAndCleanupAll();
                };
                c._clientConfig.register(a);
              }
            }),
            (this.cleanupAll = function() {
              c._logger.debug('cleanupAll()' + c.sessionTypeTag()),
                (c.isVideoSession() || c.isAdSession()) && null != c._playerStateManager && c.detachPlayer(),
                (c._contentMetadata = null),
                c._logger.setSessionId(null),
                (c._logger = null),
                (c._exceptionCatcher = null),
                (c._client = null),
                (c._clientConfig = null),
                (c._systemMetadata = null),
                c._cwsSession.cleanup(),
                (c._cwsSession = null),
                (c._cleanedUp = !0);
            }),
            (this.endCwsSessionAndCleanupAll = function() {
              c._cwsSession.end(), c.cleanupAll();
            }),
            (this.initiateSession = function() {
              c._cwsSession.initialize(),
                c.setStatesFromSystemMetadata(),
                (c.isVideoSession() || c.isAdSession()) &&
                  (c.setStatesFromContentMetadata(), c.enqueueEventForContentMetadata()),
                c._cwsSession.startSendingHeartbeats();
            }),
            (this.enqueueEventForContentMetadata = function() {
              var b = {};
              if (
                (null != c._contentMetadata.assetName
                  ? (b[r.REQUEST_KEY_ASSET_NAME] = c._contentMetadata.assetName)
                  : c._logger.warning('enqueueEventForContentMetadata(): assetName was not set.'),
                null != c._contentMetadata.applicationName
                  ? ('undefined' == typeof b[r.REQUEST_KEY_STREAM_METADATA_CHANGE] &&
                      (b[r.REQUEST_KEY_STREAM_METADATA_CHANGE] = {}),
                    (b[r.REQUEST_KEY_STREAM_METADATA_CHANGE][r.REQUEST_KEY_PLAYER_NAME] =
                      c._contentMetadata.applicationName))
                  : c._logger.warning('enqueueEventForContentMetadata(): applicationName was not set.'),
                null != c._contentMetadata.streamUrl
                  ? (b[r.REQUEST_KEY_STREAM_URL] = c._contentMetadata.streamUrl)
                  : c._logger.warning('enqueueEventForContentMetadata(): streamUrl was not set.'),
                null != c._contentMetadata.viewerId
                  ? ('undefined' == typeof b[r.REQUEST_KEY_STREAM_METADATA_CHANGE] &&
                      (b[r.REQUEST_KEY_STREAM_METADATA_CHANGE] = {}),
                    (b[r.REQUEST_KEY_STREAM_METADATA_CHANGE][r.REQUEST_KEY_VIEWER_ID] = c._contentMetadata.viewerId))
                  : c._logger.warning('enqueueEventForContentMetadata(): viewerId was not set.'),
                null != c._contentMetadata.defaultResource
                  ? (b[r.REQUEST_KEY_RESOURCE] = c._contentMetadata.defaultResource)
                  : c._logger.warning('enqueueEventForContentMetadata(): defaultResource was not set.'),
                c._contentMetadata.duration > -1
                  ? (b[r.REQUEST_KEY_CONTENT_LENGTH] = c._contentMetadata.duration)
                  : c._logger.warning('enqueueEventForContentMetadata(): duration was not set.'),
                c._contentMetadata.encodedFrameRate > -1
                  ? (b[r.REQUEST_KEY_ENCODED_FRAME_RATE] = c._contentMetadata.encodedFrameRate)
                  : c._logger.warning('enqueueEventForContentMetadata(): encodedFrameRate was not set.'),
                c._contentMetadata.streamType != e.StreamType.UNKNOWN
                  ? c._contentMetadata.streamType == a.ContentMetadata.StreamType.LIVE
                    ? (b[r.REQUEST_KEY_IS_LIVE] = !0)
                    : (b[r.REQUEST_KEY_IS_LIVE] = !1)
                  : c._logger.warning('enqueueEventForContentMetadata(): streamType was not set.'),
                C.dictCount(c._contentMetadata.custom) > 0)
              ) {
                b[r.REQUEST_KEY_TAGS] = {};
                for (var d in c._contentMetadata.custom) b[r.REQUEST_KEY_TAGS][d] = c._contentMetadata.custom[d];
              } else c._logger.warning('enqueueEventForContentMetadata(): custom tags were not set.');
              C.dictCount(b) > 0 && c._cwsSession.declareStateChange(b, null);
            }),
            (this.setStatesFromSystemMetadata = function() {
              c._logger.debug('setStatesFromSystemMetadata()');
              var a = c._systemMetadata.get(),
                b = a[K.BROWSER_NAME];
              null != b && c._cwsSession.setBrowserName(b);
              var d = a[K.BROWSER_VERSION];
              null != d && c._cwsSession.setBrowserVersion(d);
              var e = a[K.DEVICE_BRAND];
              null != e && c._cwsSession.setDeviceBrand(e);
              var f = a[K.DEVICE_MANUFACTURER];
              null != f && c._cwsSession.setDeviceManufacturer(f);
              var g = a[K.DEVICE_MODEL];
              null != g && c._cwsSession.setDeviceModel(g);
              var h = a[K.DEVICE_TYPE];
              null != h && c._cwsSession.setDeviceType(h);
              var i = a[K.DEVICE_VERSION];
              null != i && c._cwsSession.setDeviceVersion(i);
              var j = a[K.FRAMEWORK_NAME];
              null != j && c._cwsSession.setFrameworkName(j);
              var k = a[K.FRAMEWORK_VERSION];
              null != k && c._cwsSession.setFrameworkVersion(k);
              var l = a[K.OPERATING_SYSTEM_NAME];
              null != l && c._cwsSession.setOperatingSystemName(l);
              var m = a[K.OPERATING_SYSTEM_VERSION];
              null != m && c._cwsSession.setOperatingSystemVersion(m);
            }),
            (this.setStatesFromContentMetadata = function() {
              if (
                (c._logger.debug('setStatesFromContentMetadata()'),
                null != c._contentMetadata.defaultResource &&
                  c._cwsSession.setResource(c._contentMetadata.defaultResource),
                null != c._contentMetadata.streamUrl && c._cwsSession.setStreamUrl(c._contentMetadata.streamUrl),
                c._contentMetadata.duration > 0 && c._cwsSession.setContentLength(c._contentMetadata.duration),
                c._contentMetadata.encodedFrameRate > 0 &&
                  c._cwsSession.setEncodedFrameRate(c._contentMetadata.encodedFrameRate),
                c._contentMetadata.streamType !== e.StreamType.UNKNOWN)
              ) {
                var a = c._contentMetadata.streamType === e.StreamType.LIVE;
                c._cwsSession.setIsLive(a);
              }
              null != c._contentMetadata.assetName && c._cwsSession.setAssetName(c._contentMetadata.assetName),
                null != c._contentMetadata.viewerId && c._cwsSession.setViewerId(c._contentMetadata.viewerId),
                null != c._contentMetadata.applicationName &&
                  c._cwsSession.setPlayerName(c._contentMetadata.applicationName),
                C.dictCount(c._contentMetadata.custom) > 0 && c._cwsSession.setTags(c._contentMetadata.custom);
            }),
            (this.onPlayerStateChange = function(a) {
              return (
                c._logger.debug('onPlayerStateChange(): ' + a),
                c._cwsSession._playerState != a
                  ? (c._cwsSession._playerState == h.PlayerState.NOT_MONITORED &&
                      a != h.PlayerState.NOT_MONITORED &&
                      (c._pooledPlayerState = a),
                    c._ignorePlayerState
                      ? void c._logger.debug(
                          'onPlayerStateChange(): ' +
                            a +
                            ' (pooled, ' +
                            (c._adPlaying ? 'ad playing' : 'preloading') +
                            ')',
                        )
                      : void c._cwsSession.setPlayerState(a))
                  : void 0
              );
            }),
            (this.onBitrateChange = function(a) {
              return (
                c._logger.debug('onBitrateChange(): ' + a),
                c._ignoreBitrateAndResource
                  ? void c._logger.info('onBitrateChange(): ignored')
                  : void c._cwsSession.setBitrateKbps(a)
              );
            }),
            (this.onSeekEvent = function(a, b) {
              null == b ||
                C.isInteger(b) ||
                (c._logger.error('onSeekEvent(): Ignored non-integer seekToPosition data: ' + b), (b = -1)),
                c._cwsSession.enqueueSeekEvent(a, b);
            }),
            (this.onEncodedFrameRateChange = function(a) {
              c._logger.debug('onEncodedFrameRateChange(): ' + a),
                c._contentMetadata.encodedFrameRate > 0 ||
                  (a > 0
                    ? c._ignoreEncodedFrameRateAndDuration
                      ? c._logger.info('onEncodedFrameRateChange(): Ignored encoded frame rate data: ' + a + ' (ads)')
                      : (c._cwsSession.setEncodedFrameRate(a),
                        c._logger.info('onEncodedFrameRateChange(): Received encoded frame rate data: ' + a))
                    : c._logger.warning('onEncodedFrameRateChange(): Ignored invalid encoded frame rate data: ' + a));
            }),
            (this.onContentLengthChange = function(a) {
              c._logger.debug('onContentLengthChange(): ' + a),
                c._contentMetadata.duration > 0 ||
                  (a > 0
                    ? c._ignoreEncodedFrameRateAndDuration
                      ? c._logger.info('setContentLength(): Ignored content length data: ' + a + ' (ads)')
                      : (c._cwsSession.setContentLength(a),
                        c._logger.info('setContentLength(): Received content length data: ' + a))
                    : c._logger.warning('setContentLength(): Ignored invalid content length data: ' + a));
            }),
            (this.onStreamUrlChange = function(a) {
              c._logger.debug('onStreamUrlChange(): ' + a),
                null == c._contentMetadata.streamUrl && c._cwsSession.setStreamUrl(a);
            }),
            (this.onStreamResolutionWidthChange = function(a) {
              c._logger.debug('onStreamResolutionWidthChange(): ' + a), c._cwsSession.setStreamResolutionWidth(a);
            }),
            (this.onStreamResolutionHeightChange = function(a) {
              c._logger.debug('onStreamResolutionHeightChange(): ' + a), c._cwsSession.setStreamResolutionHeight(a);
            }),
            (this.onConnectionTypeChange = function(a) {
              c._logger.debug('onConnectionTypeChange(): ' + a), c._cwsSession.setConnectionType(a);
            }),
            (this.onLinkEncryptionChange = function(a) {
              c._logger.debug('onLinkEncryptionChange(): ' + a), c._cwsSession.setLinkEncryption(a);
            }),
            (this.onPlayerTypeChange = function(a) {
              c._logger.debug('onPlayerTypeChange(): ' + a),
                null == c._cwsSession.getFrameworkName() && c._cwsSession.setFrameworkName(a);
            }),
            (this.onPlayerVersionChange = function(a) {
              c._logger.debug('onPlayerVersionChange(): ' + a),
                null == c._cwsSession.getFrameworkVersion() && c._cwsSession.setFrameworkVersion(a);
            }),
            (this.onError = function(a, b) {
              c._logger.debug('onError(): ' + a + ' (' + b + ')'), c.reportError(a, b);
            }),
            (this.onRelease = function() {
              c._logger.debug('onRelease()'), c.detachPlayer();
            }),
            (this.adStart = function(b, d, e) {
              return (
                c._logger.debug('adStart(): adStream=' + b + ' adPlayer=' + d + ' adPosition=' + e),
                c._adPlaying
                  ? void c._logger.warning('adStart(): multiple adStart calls, ignoring')
                  : ((c._adPlaying = !0),
                    (c._adStream = b),
                    (c._adPlayer = d),
                    (c._adPosition = e),
                    c._cwsSession._hasJoined || c._cwsSession.togglePauseJoin(!0),
                    void (c._adStream == a.Client.AdStream.CONTENT || c._adPlayer == a.Client.AdPlayer.SEPARATE
                      ? (c._cwsSession._playerState !== h.PlayerState.NOT_MONITORED &&
                          (c._pooledPlayerState = c._cwsSession._playerState),
                        c._cwsSession.setPlayerState(h.PlayerState.NOT_MONITORED),
                        (c._ignorePlayerState = !0))
                      : c._adStream == a.Client.AdStream.SEPARATE &&
                        c._adPlayer == a.Client.AdPlayer.CONTENT &&
                        (c._cwsSession._playerState !== h.PlayerState.NOT_MONITORED &&
                          (c._pooledPlayerState = c._cwsSession._playerState),
                        c._cwsSession.setPlayerState(h.PlayerState.NOT_MONITORED),
                        (c._ignorePlayerState = !0),
                        (c._ignoreBitrateAndResource = !0),
                        (c._ignoreEncodedFrameRateAndDuration = !0),
                        (c._ignorePlayheadTimeandBufferLength = !0),
                        (c._ignoreError = !0))))
              );
            }),
            (this.adEnd = function() {
              return (
                c._logger.debug('adEnd()'),
                c._adPlaying
                  ? (c._cwsSession._hasJoined || c._cwsSession.togglePauseJoin(!1),
                    c._adStream == a.Client.AdStream.CONTENT || c._adPlayer == a.Client.AdPlayer.SEPARATE
                      ? c._preloading ||
                        ((c._ignorePlayerState = !1), c._cwsSession.setPlayerState(c._pooledPlayerState))
                      : c._adStream == a.Client.AdStream.SEPARATE &&
                        c._adPlayer == a.Client.AdPlayer.CONTENT &&
                        ((c._ignoreBitrateAndResource = !1),
                        (c._ignoreEncodedFrameRateAndDuration = !1),
                        (c._ignorePlayheadTimeandBufferLength = !1),
                        (c._ignoreError = !1),
                        c._preloading ||
                          ((c._ignorePlayerState = !1), c._cwsSession.setPlayerState(c._pooledPlayerState))),
                    (c._adPlaying = !1),
                    void (c._adStream = c._adPlayer = c._adPosition = null))
                  : void c._logger.debug('adEnd(): called before adStart, ignoring')
              );
            }),
            (this.detachPlayer = function() {
              c._logger.debug('detachPlayer()'),
                null !== c._playerStateManager &&
                  (c._exceptionCatcher.runProtected('Session.detachPlayer', function() {
                    c._playerStateManager.removeMonitoringNotifier();
                  }),
                  (c._playerStateManager = null),
                  c._cwsSession.setPlayerStateManager(null),
                  c._cwsSession.setPlayerState(h.PlayerState.NOT_MONITORED));
            }),
            (this.attachPlayer = function(a) {
              return (
                c._logger.debug('attachPlayer()'),
                null != c._playerStateManager
                  ? void c._logger.error('attachPlayer(): detach current PlayerStateManager first')
                  : void c._exceptionCatcher.runProtected('Session.attachPlayer()', function() {
                      a.setMonitoringNotifier(c, c._id)
                        ? (a.pushCurrentState(),
                          (c._playerStateManager = a),
                          c._cwsSession.setPlayerStateManager(c._playerStateManager))
                        : c._logger.error(
                            'attachPlayer(): instance of PlayerStateManager is already attached to a session',
                          );
                    })
              );
            }),
            (this.getPlayerStateManager = function() {
              return c._logger.debug('getPlayerStateManager()'), c._playerStateManager;
            }),
            (this.contentPreload = function() {
              return (
                c._logger.debug('contentPreload()'),
                c._preloading
                  ? void c._logger.debug('contentPreload(): called twice, ignoring')
                  : ((c._preloading = !0), void (c._ignorePlayerState = !0))
              );
            }),
            (this.contentStart = function() {
              return (
                c._logger.debug('contentStart()'),
                c._preloading
                  ? ((c._preloading = !1),
                    void (
                      c._adPlaying || ((c._ignorePlayerState = !1), c._cwsSession.setPlayerState(c._pooledPlayerState))
                    ))
                  : void c._logger.warning('contentStart(): called without contentPreload, ignoring')
              );
            }),
            (this.reportError = function(b, d) {
              if ((c._logger.info('reportError(): ' + b), !C.isValidString(b)))
                return void c._logger.error('reportError(): invalid error message string: ' + b);
              if (d !== a.Client.ErrorSeverity.FATAL && d !== a.Client.ErrorSeverity.WARNING)
                return void c._logger.error('reportError(): invalid error severity: ' + d);
              if (c._ignoreError) return void c._logger.debug('reportError(): ignored');
              var e = d === a.Client.ErrorSeverity.FATAL;
              c._cwsSession.sendError(b, e);
            }),
            (this.updateContentMetadata = function(a) {
              c._logger.debug('updateContentMetadata(): enter'),
                c._exceptionCatcher.runProtected('Session.updateContentMetadata', function() {
                  c.mergeContentMetadata(a), c.setStatesFromContentMetadata();
                });
            }),
            (this.sendCustomEvent = function(a, b) {
              c._logger.info('sendEvent(): eventName=' + a + c.sessionTypeTag()),
                c._cwsSession.enqueueCustomEvent(a, b);
            }),
            (this.mergeContentMetadata = function(b) {
              var d = {},
                f = {};
              if (
                (C.isValidString(b.assetName) &&
                  (c._contentMetadata.assetName != b.assetName
                    ? (null != c._contentMetadata.assetName &&
                        (d[r.REQUEST_KEY_ASSET_NAME] = c._contentMetadata.assetName),
                      (f[r.REQUEST_KEY_ASSET_NAME] = b.assetName),
                      (c._contentMetadata.assetName = b.assetName))
                    : c._logger.warning('mergeContentMetadata(): assetName was not changed.')),
                C.isValidString(b.applicationName) &&
                  (c._contentMetadata.applicationName != b.applicationName
                    ? (null != c._contentMetadata.applicationName &&
                        ('undefined' == typeof d[r.REQUEST_KEY_STREAM_METADATA_CHANGE] &&
                          (d[r.REQUEST_KEY_STREAM_METADATA_CHANGE] = {}),
                        (d[r.REQUEST_KEY_STREAM_METADATA_CHANGE][r.REQUEST_KEY_PLAYER_NAME] =
                          c._contentMetadata.applicationName)),
                      'undefined' == typeof f[r.REQUEST_KEY_STREAM_METADATA_CHANGE] &&
                        (f[r.REQUEST_KEY_STREAM_METADATA_CHANGE] = {}),
                      (f[r.REQUEST_KEY_STREAM_METADATA_CHANGE][r.REQUEST_KEY_PLAYER_NAME] = b.applicationName),
                      (c._contentMetadata.applicationName = b.applicationName))
                    : c._logger.warning('mergeContentMetadata(): applicationName was not changed.')),
                C.isValidString(b.streamUrl) &&
                  (c._contentMetadata.streamUrl != b.streamUrl
                    ? (null != c._contentMetadata.streamUrl &&
                        (d[r.REQUEST_KEY_STREAM_URL] = c._contentMetadata.streamUrl),
                      (f[r.REQUEST_KEY_STREAM_URL] = b.streamUrl),
                      (c._contentMetadata.streamUrl = b.streamUrl))
                    : c._logger.warning('mergeContentMetadata(): streamUrl was not changed.')),
                C.isValidString(b.viewerId) &&
                  (c._contentMetadata.viewerId != b.viewerId
                    ? (null != c._contentMetadata.viewerId &&
                        ('undefined' == typeof d[r.REQUEST_KEY_STREAM_METADATA_CHANGE] &&
                          (d[r.REQUEST_KEY_STREAM_METADATA_CHANGE] = {}),
                        (d[r.REQUEST_KEY_STREAM_METADATA_CHANGE][r.REQUEST_KEY_VIEWER_ID] =
                          c._contentMetadata.viewerId)),
                      'undefined' == typeof f[r.REQUEST_KEY_STREAM_METADATA_CHANGE] &&
                        (f[r.REQUEST_KEY_STREAM_METADATA_CHANGE] = {}),
                      (f[r.REQUEST_KEY_STREAM_METADATA_CHANGE][r.REQUEST_KEY_VIEWER_ID] = b.viewerId),
                      (c._contentMetadata.viewerId = b.viewerId))
                    : c._logger.warning('mergeContentMetadata(): viewerId was not changed.')),
                C.isValidString(b.defaultResource) &&
                  (c._contentMetadata.defaultResource != b.defaultResource
                    ? (null != c._contentMetadata.defaultResource &&
                        (d[r.REQUEST_KEY_RESOURCE] = c._contentMetadata.defaultResource),
                      (f[r.REQUEST_KEY_RESOURCE] = b.defaultResource),
                      (c._contentMetadata.defaultResource = b.defaultResource))
                    : c._logger.warning('mergeContentMetadata(): defaultResource was not changed.')),
                C.isInteger(b.duration) &&
                  b.duration > 0 &&
                  (c._contentMetadata.duration != b.duration
                    ? (c._cwsSession._contentLengthSec > 0 &&
                        (d[r.REQUEST_KEY_CONTENT_LENGTH] = c._cwsSession._contentLengthSec),
                      (f[r.REQUEST_KEY_CONTENT_LENGTH] = b.duration),
                      (c._contentMetadata.duration = b.duration))
                    : c._logger.warning('mergeContentMetadata(): duration was not changed.')),
                C.isInteger(b.encodedFrameRate) &&
                  b.encodedFrameRate > 0 &&
                  (c._contentMetadata.encodedFrameRate != b.encodedFrameRate
                    ? (c._contentMetadata.encodedFrameRate > -1 &&
                        (d[r.REQUEST_KEY_ENCODED_FRAME_RATE] = c._contentMetadata.encodedFrameRate),
                      (f[r.REQUEST_KEY_ENCODED_FRAME_RATE] = b.encodedFrameRate),
                      (c._contentMetadata.encodedFrameRate = b.encodedFrameRate))
                    : c._logger.warning('mergeContentMetadata(): encodedFrameRate was not changed.')),
                b.streamType != e.StreamType.UNKNOWN &&
                  (c._contentMetadata.streamType != b.streamType
                    ? (c._contentMetadata.streamType != e.StreamType.UNKNOWN &&
                        (c._contentMetadata.streamType == a.ContentMetadata.StreamType.LIVE
                          ? (d[r.REQUEST_KEY_IS_LIVE] = !0)
                          : (d[r.REQUEST_KEY_IS_LIVE] = !1)),
                      b.streamType == a.ContentMetadata.StreamType.LIVE
                        ? (f[r.REQUEST_KEY_IS_LIVE] = !0)
                        : (f[r.REQUEST_KEY_IS_LIVE] = !1),
                      (c._contentMetadata.streamType = b.streamType))
                    : c._logger.warning('mergeContentMetadata(): streamType was not changed.')),
                C.dictCount(b.custom) > 0)
              ) {
                var g = {},
                  h = {};
                for (var i in b.custom) {
                  var j = c._contentMetadata.custom[i];
                  j != b.custom[i]
                    ? ((g[i] = b.custom[i]),
                      c._contentMetadata.custom[i] && (h[i] = c._contentMetadata.custom[i]),
                      (c._contentMetadata.custom[i] = b.custom[i]))
                    : c._logger.info('mergeContentMetadata(): custom.' + i + ' was not changed.');
                }
                C.dictCount(g) > 0
                  ? (C.dictCount(h) > 0 && (d[r.REQUEST_KEY_TAGS] = h), (f[r.REQUEST_KEY_TAGS] = g))
                  : c._logger.warning('mergeContentMetadata(): custom was not changed.');
              }
              C.dictCount(f) > 0 && c._cwsSession.declareStateChange(f, d);
            }),
            (this.isGlobalSession = function() {
              return c._global == u.SESSION_TYPE.GLOBAL;
            }),
            (this.isVideoSession = function() {
              return c._global == u.SESSION_TYPE.VIDEO;
            }),
            (this.isAdSession = function() {
              return c._global == u.SESSION_TYPE.AD;
            }),
            (this.sessionTypeTag = function() {
              return c.isGlobalSession() ? ' (global session)' : '';
            });
        }));
        v.DEFAULT_HEARTBEAT_ERROR_MESSAGE = 'received no response (or a bad response) to heartbeat POST request';
        var w = (b.SessionFactory = function() {
            function a(a, c, d, e) {
              (b._client = a),
                (b._clientSettings = c),
                (b._clientConfig = d),
                (b._systemFactory = e),
                (b._logger = b._systemFactory.buildLogger()),
                b._logger.setModuleName('SessionFactory'),
                (b._nextSessionKey = 0),
                (b._sessionsByKey = {});
            }
            var b = this;
            (b._logger = null),
              (b._logBuffer = null),
              (b._nextSessionKey = 0),
              (b._sessionsByKey = null),
              a.apply(b, arguments),
              (this.cleanup = function() {
                (b._logger = null), (b._logBuffer = null);
                for (var a in b._sessionsByKey) {
                  var c = b._sessionsByKey[a];
                  c.cleanup();
                }
                (b._sessionsByKey = null), (b._nextSessionKey = 0);
              }),
              (this.newSessionKey = function() {
                var a = b._nextSessionKey;
                return b._nextSessionKey++, a;
              }),
              (this.makeVideoSession = function(a, c) {
                return null == a && (a = new e()), b.makeSession(a, c);
              }),
              (this.makeGlobalSession = function(a) {
                return b.makeSession(a, u.SESSION_TYPE.GLOBAL);
              }),
              (this.generateSessionId = function() {
                return F.integer32();
              }),
              (this.makeSession = function(a, c) {
                var d = a.clone(),
                  e = b.generateSessionId(),
                  f = b._systemFactory.buildSession(b._client, b._clientSettings, b._clientConfig, e, c, d),
                  g = b.newSessionKey();
                return b.addSession(g, f), f.start(), g;
              }),
              (this.getSession = function(a) {
                var c = b._sessionsByKey[a];
                return (
                  null == c && b._logger.error('Client: invalid sessionKey. Did you cleanup that session previously?'),
                  c
                );
              }),
              (this.getVideoSession = function(a) {
                var c = this.getSession(a);
                return (
                  null != c &&
                    (c.isVideoSession() ||
                      c.isAdSession() ||
                      (b._logger.error('Client: invalid sessionKey. Did you cleanup that session previously?'),
                      (c = null))),
                  c
                );
              }),
              (this.addSession = function(a, c) {
                b._sessionsByKey[a] = c;
              }),
              (this.removeSession = function(a) {
                delete b._sessionsByKey[a];
              }),
              (this.cleanupSession = function(a) {
                var c = b.getSession(a);
                b.removeSession(a), c.cleanup();
              });
          }),
          x = (b.CallbackWithTimeout = function(a) {
            (this._timer = a),
              (this.getWrapperCallback = function(a, b, c) {
                var d = !1,
                  e = function() {
                    d || ((d = !0), a(!1, c + ' (' + b + ' ms)'));
                  };
                this._timer.createOnce(e, b, 'CallbackWithTimeout.wrap');
                var f = function(b, c) {
                  d || ((d = !0), a(b, c));
                };
                return f;
              });
          }),
          y = (b.Config = function(a, b, c) {
            var d = this;
            (this._logger = a),
              this._logger.setModuleName('Config'),
              (this._storage = b),
              (this._jsonInterface = c),
              (this._defaultConfig = {
                clientId: r.DEFAULT_CLIENT_ID,
                sendLogs: !1,
                maxHbInfos: r.DEFAULT_MAX_HEARTBEAT_INFOS,
              }),
              (this._config = C.ObjectShallowCopy(this._defaultConfig)),
              (this._loaded = !1),
              (this._loadedEmpty = !1),
              (this._waitingConsumers = []),
              (this.isReady = function() {
                return this._loaded;
              }),
              (this.load = function() {
                var a = function(a, b) {
                  a
                    ? (d._parse(b),
                      d._logger.debug(
                        'load(): configuration successfully loaded from local storage' +
                          (d._loadedEmpty ? ' (was empty)' : '') +
                          '.',
                      ))
                    : d._logger.error('load(): error loading configuration from local storage: ' + b),
                    (d._loaded = !0),
                    d._notify();
                };
                this._storage.load(y.STORAGE_KEY, a);
              }),
              (this._parse = function(a) {
                var b = this._jsonInterface.decode(a);
                if (null == b) return void (this._loadedEmpty = !0);
                var c = b[y.CONFIG_STORAGE_KEY_CLIENT_ID];
                null != c &&
                  c != r.DEFAULT_CLIENT_ID &&
                  '' != c &&
                  'null' != c &&
                  ((this._config[y.CONFIG_KEY_CLIENT_ID] = c),
                  this._logger.debug('parse(): loaded clientId=' + c + ' (from local storage)'));
              }),
              (this._marshall = function() {
                var a = {};
                return (
                  (a[y.CONFIG_STORAGE_KEY_CLIENT_ID] = this._config.clientId),
                  this._logger.debug('_marshall(): saving clientId=' + this._config.clientId + ' (to local storage)'),
                  this._jsonInterface.encode(a)
                );
              }),
              (this.save = function() {
                var a = function(a, b) {
                  a
                    ? d._logger.debug('save(): configuration successfully saved to local storage.')
                    : d._logger.error('save(): error saving configuration to local storage: ' + b);
                };
                this._storage.save(y.STORAGE_KEY, this._marshall(), a);
              }),
              (this.register = function(a) {
                return this.isReady() ? void a() : void this._waitingConsumers.push(a);
              }),
              (this.get = function(a) {
                return this._loaded ? this._config[a] : null;
              }),
              (this.set = function(a, b) {
                this._loaded && (this._config[a] = b);
              }),
              (this._notify = function() {
                for (var a; null != (a = this._waitingConsumers.shift()); ) a();
              });
          });
        (y.STORAGE_KEY = 'sdkConfig'),
          (y.CONFIG_STORAGE_KEY_CLIENT_ID = 'clId'),
          (y.CONFIG_KEY_CLIENT_ID = 'clientId'),
          (y.CONFIG_KEY_SEND_LOGS = 'sendLogs'),
          (y.CONFIG_KEY_MAX_HEARTBEAT_INFOS = 'maxHbInfos');
        var z = (b.EventQueue = function() {
            (this._events = []),
              (this._nextEventNumber = 0),
              (this.enqueue = function(a) {
                this._events.push(a);
              }),
              (this.getNumber = function() {
                var a = this._nextEventNumber;
                return this._nextEventNumber++, a;
              }),
              (this.flush = function() {
                var a = this._events;
                return (this._events = []), a;
              });
          }),
          A = (b.ExceptionCatcher = function(a, b, c) {
            (this._logger = a),
              this._logger.setModuleName('ExceptionCatcher'),
              (this._ping = b),
              (this._systemSettings = c),
              (this.runProtected = function(a, b, c) {
                try {
                  b();
                } catch (d) {
                  if (null != c) c(d);
                  else {
                    if (this._systemSettings.allowUncaughtExceptions) throw d;
                    this.onUncaughtException(a, d);
                  }
                }
              }),
              (this.onUncaughtException = function(a, b) {
                var c = 'Uncaught exception: ' + a + ': ' + b.toString();
                if (null != this._ping)
                  try {
                    this._ping.send(c);
                  } catch (d) {
                    this._logger.error('Caught exception while sending ping: ' + d.toString());
                  }
                this._logger.error(c);
              });
          }),
          B = (b.GatewayControl = function(a, b, c, d) {
            var e = this;
            (this._clientSettings = a),
              (this._logger = b),
              this._logger.setModuleName('GatewayControl'),
              (this._httpClient = c),
              (this._jsonInterface = d),
              (this.send = function(a, b) {
                var c = this._jsonInterface.encode(a),
                  d = this._clientSettings.gatewayUrl + r.gatewayPath,
                  f = function(a, c) {
                    if (a) {
                      var d = e._jsonInterface.decode(c);
                      b(a, d);
                    } else {
                      var f = c;
                      b(a, f);
                    }
                  };
                this._httpClient.request('POST', d, c, 'application/json', f);
              });
          }),
          C = (b.Lang = {});
        (C.isMeaningfulString = function(a) {
          return C.isValidString(a) && null != a && 'undefined' != a && 'null' != a;
        }),
          (C.sanitizeStringToStringObject = function(a) {
            var b = {};
            for (var c in a)
              if (C.isMeaningfulString(c)) {
                var d = a[c];
                C.isMeaningfulString(d) && (b[c] = d);
              }
            return b;
          }),
          (C.validateInterface = function(a, b, c) {
            if (null == a) throw new Error('Expected ' + c + ' implementation is null.');
            for (var d in b)
              if ('function' != typeof a[d]) throw new Error('Expected method ' + d + ' in ' + c + ' implementation.');
          }),
          (C.dictCount = function(a) {
            var b,
              c = 0;
            for (b in a) a.hasOwnProperty(b) && c++;
            return c;
          }),
          (C.ToString = function(a) {
            return '' + a;
          }),
          (C.NumberToInt = function(a) {
            return Math.floor(a);
          }),
          (C.NumberToUnsignedInt = function(a) {
            return Math.abs(C.NumberToInt(a));
          }),
          (C.AsBoolean = function(a) {
            return Boolean(a);
          }),
          (C.isValidString = function(a) {
            return 'string' == typeof a && '' !== a;
          }),
          (C.stringStartsWith = function(a, b) {
            return 'string' != typeof a || 'string' != typeof b
              ? !1
              : 'function' == typeof a.indexOf
              ? 0 === a.indexOf(b)
              : !1;
          }),
          (C.isBoolean = function(a) {
            return 'boolean' == typeof a;
          }),
          (C.UrlEncodeString = function(a) {
            return escape(a);
          }),
          (C.isObject = function(a) {
            return 'object' == typeof a;
          }),
          (C.ObjectToString = function(a) {
            var b = '';
            for (var c in a) {
              var d = a[c],
                e = d;
              b += c + '=' + e;
            }
            return 'Object{' + b + '}';
          }),
          (C.ObjectShallowCopyOmitNull = function(a) {
            var b = C.ObjectShallowCopy(a);
            for (var c in b) null == b[c] && delete b[c];
            return b;
          }),
          (C.ObjectShallowCopy = function(a) {
            var b = {};
            for (var c in a) b[c] = a[c];
            return b;
          }),
          (C.ObjectShallowEquals = function(a, b) {
            if (typeof a != typeof b) return !1;
            if (a instanceof Object && b instanceof Object) {
              if (C.dictCount(a) !== C.dictCount(b)) return !1;
              var c = !0;
              for (var d in a) if (((c = a[d] === b[d]), !c)) return !1;
              return !0;
            }
            return a === b;
          }),
          (C.isInteger = function(a) {
            if ('number' != typeof a) return !1;
            var b = Math.round(a);
            return b === a;
          }),
          (C.isArray = function(a) {
            return '[object Array]' === Object.prototype.toString.call(a);
          }),
          (C.ArrayEquals = function(a, b) {
            if (a === b) return !0;
            if (null == a || null == b) return !1;
            if (a.length != b.length) return !1;
            for (var c = 0; c < a.length; ++c)
              if (C.isArray(a[c]) && C.isArray(b[c])) {
                if (!C.ArrayEquals(a[c], b[c])) return !1;
              } else if (a[c] !== b[c]) return !1;
            return !0;
          }),
          (C.isObjectDefinePropertyPresent = function() {
            return (
              'undefined' != typeof Object.defineProperty &&
              (function() {
                try {
                  return Object.defineProperty({}, 'x', {}), !0;
                } catch (a) {
                  return !1;
                }
              })()
            );
          }),
          (C.defGet = function(a, b, c) {
            if (C.isObjectDefinePropertyPresent())
              Object.defineProperty(a, b, { configurable: !0, enumerable: !0, get: c });
            else {
              if ('undefined' == typeof a.__defineGetter__)
                throw new Error('JavaScript runtime must support either Object.defineProperty or __defineGetter__');
              a.__defineGetter__(b, c);
            }
          }),
          (C.defSet = function(a, b, c) {
            if (C.isObjectDefinePropertyPresent())
              Object.defineProperty(a, b, {
                configurable: !0,
                set: c,
              });
            else {
              if ('undefined' == typeof a.__defineSetter__)
                throw new Error('JavaScript runtime must support either Object.defineProperty or __defineSetter__');
              a.__defineSetter__(b, c);
            }
          }),
          (function() {
            var a = {};
            (a.two32 = 4294967296),
              (a.MaxValue = a.two32 - 1),
              (a.MinValue = 0),
              (C.UInt32 = a),
              (C.UInt32.Cast = function(b) {
                var c = parseInt(b, 10);
                return c > a.MaxValue ? (c %= a.two32) : c < a.MinValue && ((c = -c % a.two32), (c = a.two32 - c)), c;
              }),
              (C.UInt32.InRange = function(b) {
                var c = parseInt(b, 10);
                return c <= a.MaxValue && c >= a.MinValue;
              });
            var b = {};
            (b.MaxValue = 2147483647),
              (b.MinValue = -2147483648),
              (C.Int32 = b),
              (C.Int32.Cast = function(a) {
                var c = parseInt(a, 10);
                return (
                  c > b.MaxValue ? (c %= b.MaxValue) : c < b.MinValue && ((c = -c % b.MaxValue), (c = b.MaxValue - c)),
                  c
                );
              }),
              (C.Int32.InRange = function(a) {
                var c = parseInt(a, 10);
                return c <= b.MaxValue && c >= b.MinValue;
              });
          })();
        var D = (b.LogBuffer = function() {
            var a = 32;
            (this._buffer = []),
              (this.add = function(b) {
                this._buffer.length >= a && this._buffer.shift(), this._buffer.push(b);
              }),
              (this.flush = function() {
                var a = this._buffer;
                return (this._buffer = []), a;
              });
          }),
          E = (b.Ping = function(a, b, d) {
            (this._isSendingPing = !1),
              (this._cachedBasePingUrl = null),
              (this._logger = a),
              this._logger.setModuleName('Ping'),
              (this._httpClient = b),
              (this._clientSettings = d),
              (this.send = function(a) {
                if (!this._isSendingPing) {
                  this._isSendingPing = !0;
                  var b = this.getBasePingUrl() + '&d=' + C.UrlEncodeString(a.toString());
                  this._logger.error('send(): ' + b),
                    this._httpClient.request('GET', b, null, null, null),
                    (this._isSendingPing = !1);
                }
              }),
              (this.getBasePingUrl = function() {
                if (!this._cachedBasePingUrl) {
                  var a = E.SERVICE_URL + '?comp=' + E.COMPONENT_NAME + '&clv=' + c.version;
                  if (
                    (this._clientSettings && (a += '&cid=' + this._clientSettings.customerKey),
                    (a += '&sch=' + r.SDK_METADATA_SCHEMA),
                    !this._clientSettings)
                  )
                    return a;
                  this._cachedBasePingUrl = a;
                }
                return this._cachedBasePingUrl;
              });
          });
        (E.COMPONENT_NAME = 'sdkjs'), (E.SERVICE_URL = 'https://pings.conviva.com/ping.ping');
        var F = (b.Random = {});
        (F.maxUInt32 = 4294967295),
          (F.maxInt32 = 2147483647),
          (F.minInt32 = -2147483648),
          (F.integer32 = function() {
            return Math.floor(Math.random() * F.maxUInt32) + F.minInt32;
          }),
          (F.uinteger32 = function() {
            return Math.floor(Math.random() * F.maxUInt32);
          });
        var G = (b.Sanitize = {});
        (G.Integer = function(a, b, c, d) {
          if (isNaN(a)) return d;
          if ('number' != typeof a) return d;
          if (a == d) return d;
          var e = C.NumberToInt(a);
          return G.EnforceBoundaries(e, b, c);
        }),
          (G.EnforceBoundaries = function(a, b, c) {
            return null != c && a > c ? (a = c) : null != b && b > a && (a = b), a;
          }),
          (G.sanitizeSpecialIntegerValue = function(a) {
            return -1 == a || -2 == a ? a : (a = G.Integer(a, 0, null, -1));
          });
        var H = ((b.StreamerError = function() {
            function a(a, c) {
              (b.errorCode = a), (b.severity = c);
            }
            var b = this;
            (b.errorCode = null), (b.severity = c.ErrorSeverity.FATAL), a.apply(b, arguments);
          }),
          (b.HttpClient = function(a, b, c, d) {
            (this._logger = a),
              this._logger.setModuleName('HttpClient'),
              (this._httpInterface = b),
              (this._callbackWithTimeout = c),
              (this._systemSettings = d),
              (this.request = function(a, b, c, d, e) {
                var f = 1e3 * this._systemSettings.httpTimeout,
                  g = this._callbackWithTimeout.getWrapperCallback(e, f, 'HTTP timeout');
                this._logger.debug('request(): calling HttpInterface.makeRequest'),
                  this._httpInterface.makeRequest(a, b, c, d, f, g);
              });
          })),
          I = (b.Logger = function(a, b, c, d, e) {
            (this._loggingInterface = a),
              (this._timeInterface = b),
              (this._settings = c),
              (this._logBuffer = d),
              (this._packageName = e),
              (this.debug = function(a) {
                this.log(a, g.LogLevel.DEBUG);
              }),
              (this.info = function(a) {
                this.log(a, g.LogLevel.INFO);
              }),
              (this.warning = function(a) {
                this.log(a, g.LogLevel.WARNING);
              }),
              (this.error = function(a) {
                this.log(a, g.LogLevel.ERROR);
              }),
              (this.log = function(a, b) {
                var c = this.formatMessage(a, b);
                this._logBuffer.add(c), this._settings.logLevel <= b && this._loggingInterface.consoleLog(c, b);
              }),
              (this.prependModuleName = function(a) {
                var b = a;
                return (b = '[' + this._moduleName + '] ' + b);
              }),
              (this.prependPackageName = function(a) {
                var b = a;
                return (b = '[' + this._packageName + '] ' + b);
              }),
              (this.prependConvivaNamespace = function(a) {
                var b = a;
                return (b = '[Conviva] ' + b);
              }),
              (this.prependTime = function(a) {
                var b = this._timeInterface.getEpochTimeMs(),
                  c = (b / 1e3).toFixed(3).toString();
                return '[' + c + '] ' + a;
              }),
              (this.prependLogLevel = function(a, b) {
                var c = I.getLogLevelString(b),
                  d = a;
                return (d = '[' + c + '] ' + d);
              }),
              (this.prependSessionId = function(a) {
                var b = a;
                return null != this._sessionId && (b = 'sid=' + this._sessionId + ' ' + b), b;
              }),
              (this.setSessionId = function(a) {
                this._sessionId = a;
              }),
              (this.setModuleName = function(a) {
                this._moduleName = a;
              }),
              (this.formatMessage = function(a, b) {
                return this.prependConvivaNamespace(
                  this.prependTime(
                    this.prependLogLevel(this.prependPackageName(this.prependModuleName(this.prependSessionId(a))), b),
                  ),
                );
              });
          });
        I.getLogLevelString = function(a) {
          var b;
          switch (a) {
            case g.LogLevel.ERROR:
              b = 'ERROR';
              break;
            case g.LogLevel.WARNING:
              b = 'WARNING';
              break;
            case g.LogLevel.INFO:
              b = 'INFO';
              break;
            case g.LogLevel.DEBUG:
              b = 'DEBUG';
          }
          return b;
        };
        var J = (b.Storage = function(a, b, c, d) {
          (this._logger = a),
            this._logger.setModuleName('Storage'),
            (this._storageInterface = b),
            (this._callbackWithTimeout = c),
            (this._systemSettings = d),
            (this.load = function(a, b) {
              var c = this._callbackWithTimeout.getWrapperCallback(
                b,
                1e3 * this._systemSettings.storageTimeout,
                'storage load timeout',
              );
              this._logger.debug('load(): calling StorageInterface.loadData'),
                this._storageInterface.loadData(J.STORAGE_SPACE, a, c);
            }),
            (this.save = function(a, b, c) {
              var d = this._callbackWithTimeout.getWrapperCallback(
                c,
                1e3 * this._systemSettings.storageTimeout,
                'storage save timeout',
              );
              this._logger.debug('save(): calling StorageInterface.saveData'),
                this._storageInterface.saveData(J.STORAGE_SPACE, a, b, d);
            });
        });
        J.STORAGE_SPACE = 'Conviva';
        var K = (b.SystemMetadata = function(a, b, d) {
          (this._logger = a),
            this._logger.setModuleName('SystemMetadata'),
            (this._metadataInterface = b),
            (this._exceptionCatcher = d),
            (this._cachedMetadata = null),
            (this.get = function() {
              return this._cachedMetadata || this.retrieve(), this._cachedMetadata;
            }),
            (this.retrieve = function() {
              function a(a, b) {
                d._exceptionCatcher.runProtected('Session.getSystemMetadataSchema(): ' + a, function() {
                  var c = b[a];
                  b[a] = c.call(d._metadataInterface);
                });
              }
              var b = {};
              (b[K.BROWSER_NAME] = this._metadataInterface.getBrowserName),
                (b[K.BROWSER_VERSION] = this._metadataInterface.getBrowserVersion),
                (b[K.DEVICE_BRAND] = this._metadataInterface.getDeviceBrand),
                (b[K.DEVICE_MANUFACTURER] = this._metadataInterface.getDeviceManufacturer),
                (b[K.DEVICE_MODEL] = this._metadataInterface.getDeviceModel),
                (b[K.DEVICE_TYPE] = this._metadataInterface.getDeviceType),
                (b[K.DEVICE_VERSION] = this._metadataInterface.getDeviceVersion),
                (b[K.FRAMEWORK_NAME] = this._metadataInterface.getFrameworkName),
                (b[K.FRAMEWORK_VERSION] = this._metadataInterface.getFrameworkVersion),
                (b[K.OPERATING_SYSTEM_NAME] = this._metadataInterface.getOperatingSystemName),
                (b[K.OPERATING_SYSTEM_VERSION] = this._metadataInterface.getOperatingSystemVersion);
              var d = this;
              this._logger.debug('retrieve(): calling MetadataInterface methods');
              for (var e in b) a(e, b), C.isValidString(b[e]) || delete b[e];
              b[K.DEVICE_TYPE] !== c.DeviceType.DESKTOP &&
                b[K.DEVICE_TYPE] !== c.DeviceType.CONSOLE &&
                b[K.DEVICE_TYPE] !== c.DeviceType.SETTOP &&
                b[K.DEVICE_TYPE] !== c.DeviceType.MOBILE &&
                b[K.DEVICE_TYPE] !== c.DeviceType.TABLET &&
                b[K.DEVICE_TYPE] !== c.DeviceType.SMARTTV &&
                delete b[K.DEVICE_TYPE],
                (this._cachedMetadata = C.ObjectShallowCopyOmitNull(b));
            });
        });
        (K.BROWSER_NAME = 'browserName'),
          (K.BROWSER_VERSION = 'browserVersion'),
          (K.DEVICE_BRAND = 'deviceBrand'),
          (K.DEVICE_MANUFACTURER = 'deviceManufacturer'),
          (K.DEVICE_MODEL = 'deviceModel'),
          (K.DEVICE_TYPE = 'deviceType'),
          (K.DEVICE_VERSION = 'deviceVersion'),
          (K.FRAMEWORK_NAME = 'frameworkName'),
          (K.FRAMEWORK_VERSION = 'frameworkVersion'),
          (K.OPERATING_SYSTEM_NAME = 'operatingSystemName'),
          (K.OPERATING_SYSTEM_VERSION = 'operatingSystemVersion');
        var L = (b.Time = function(a, b) {
            (this._timeInterface = a),
              (this._logger = b),
              this._logger.setModuleName('Time'),
              (this.current = function() {
                var a = this._timeInterface.getEpochTimeMs();
                return (
                  C.isInteger(a) ||
                    this._logger.error(
                      'current(): TimeInterface.getEpochTimeMs() did not return an integer (' + a + ')',
                    ),
                  a
                );
              });
          }),
          M = (b.Timer = function(a, b, c) {
            var d = this;
            (this._logger = a),
              this._logger.setModuleName('Timer'),
              (this._timerInterface = b),
              (this._exceptionCatcher = c),
              (this.create = function(a, b, c) {
                var e = function() {
                    d._exceptionCatcher.runProtected(c, function() {
                      a();
                    });
                  },
                  f = this.createTimer(e, b, c);
                return f;
              }),
              (this.createOnce = function(a, b, c) {
                var e = { cancel: null },
                  f = function() {
                    d._exceptionCatcher.runProtected(c, function() {
                      e && 'function' == typeof e.cancel && (e.cancel(), (e.cancel = null), (e = null)), a();
                    });
                  },
                  g = this.createTimer(f, b, c);
                return (e.cancel = g), g;
              }),
              (this.createTimer = function(a, b, c) {
                return (
                  this._logger.debug('createTimer(): calling TimerInterface.create'),
                  this._timerInterface.createTimer(a, b, c)
                );
              });
          });
      })();
    })(),
    a
  );
});
