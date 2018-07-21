/**
 * i18n middleware
 * Include after static
 * @type {{configure: module.exports.init, init: module.exports.init, url: module.exports.url}}
 */

module.exports = {
  /**
   * Configure i18n-node and keep settings in locals
   * @param app
   * @param i18n
   */
  configure: function (app, i18n) {

    let config = {

      // setup some locales - other locales default to en silently
      locales: ['en', 'es', 'ru'],

      // fall back from Dutch to German
      // fallbacks: { 'nl': 'de' },

      // you may alter a site wide default locale
      defaultLocale: 'en',

      // sets a custom cookie name to parse locale settings from - defaults to NULL
      // cookie: 'yourcookiename',

      // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
      // queryParameter: 'lang',

      // where to store json files - defaults to './locales' relative to modules directory
      directory: __dirname + '/../locales',

      // controll mode on directory creation - defaults to NULL which defaults to umask of process user. Setting has no effect on win.
      // directoryPermissions: '755',

      // watch for changes in json files to reload locale on updates - defaults to false
      // autoReload: true,

      // whether to write new locale information to disk - defaults to true
      // updateFiles: false,

      // sync locale information across all files - defaults to false
      // syncFiles: false,

      // what to use as the indentation unit - defaults to "\t"
      // indent: "\t",

      // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
      // extension: '.js',

      // setting prefix of json files name - default to none '' (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
      // prefix: 'webapp-',

      // enable object notation
      objectNotation: true,

      // setting of log level DEBUG - default to require('debug')('i18n:debug')
      logDebugFn: function (msg) {
        console.log('i18n debug:', msg);
      },

      // setting of log level WARN - default to require('debug')('i18n:warn')
      logWarnFn: function (msg) {
        console.log('i18n warn', msg);
      },

      // setting of log level ERROR - default to require('debug')('i18n:error')
      logErrorFn: function (msg) {
        console.log('i18n error', msg);
      },

      // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
      register: global,

      // hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
      // note that this will *not* overwrite existing properties with the same name
      //api: {
      //    '__': 't',  //now req.__ becomes req.t
      //    '__n': 'tn' //and req.__n can be called as req.tn
      //},

      //  Downcase locale when passed on queryParam; e.g. lang=en-US becomes
      // en-us.  When set to false, the queryParam value will be used as passed;
      // e.g. lang=en-US remains en-US.
      preserveLegacyCase: true
    };

    app.locals.i18n = config;
    i18n.configure(config);
    app.use(i18n.init);
    app.set('currentLang', i18n.getLocale());
    app.set('currentLangData', i18n.getCatalog(i18n.getLocale()));
  },

  /**
   * Set language from url
   * @param req
   * @param res
   * @param next
   */
  init: function (req, res, next) {
    var rxLocale = /^\/(\w\w)/i;
    if (rxLocale.test(req.url)) {
      var locale = rxLocale.exec(req.url)[1];
      if (req.app.locals.i18n.locales.indexOf(locale) >= 0)
        req.setLocale(locale);
    }
    //else // no need to set the already default
    // @todo check from cookie
    next();
  },

  /**
   * Return an array of urls with each locale for use with routes
   * @param app
   * @param url
   * @returns {Array}
   */
  url: function (app, url) {
    var locales = app.locals.i18n.locales;
    var urls = [];
    for (var i = 0; i < locales.length; i++)
      urls[i] = '/' + locales[i] + url;
    urls[i] = url;
    return urls;
  }
};