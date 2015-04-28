/*
  Author: Umberto Babini.
  Scope: This class provide the creation of a singleton object that manage data retrieving for multiple instances of DOM elements
*/
// Init the singleton
/* Public interface to subscribe to the data retrivement
*  @param {object}
*  {
*   'elements': {Array of DOM elements} ID of the object that is subscribing [Mandatory],
*   'url': {String} URL for data retrieval [Mandatory],
*   'pollingTime': null {Number} ms value for polling this URL,
*   'callbackName': {string} Callback name function that is used on the on the jsonp file
*  }
*/

var MnvDRS = (function () {
  // Instance stores a reference to the Singleton
  var _mnvdrs, mandatoryFieldsList, subscribersList = {}, id = 'MnvDRSI', tmpScript, pollingTimeMin = 10000;

  // Required file for subscription
  mandatoryFieldsList = {
    'elements': 'array',
    'url': 'string'
  };

  function init() {
    var subscribe, pollingList = {};

    subscribe = function(subscriberConfig){
      var mandatoryFields;
      if(typeof subscriberConfig !== 'object' ){
        this.log('Configuration object is required');
      }
      mandatoryFields = checkMandatoryFields(mandatoryFieldsList);
      // Check mandatory fields
      if(mandatoryFields===true){
        addSubscribers(subscriberConfig);
      } else {
        // Log error message
        this.log(mandatoryFields);
      }
    };

    // Add subscriber element to the list
    function addSubscribers(subscriberConfig){
      // Subscribers list use url like properties
      var sub = subscriberConfig, elements, url = subscriberConfig.url, pollingTime;
      // Already existing url
      if(subscribersList.hasOwnProperty(url)){
        elements = subscribersList[url].elements.concat(subscriberConfig.elements);
        // Use the shortest value asked for
        pollingTime = (Math.round(subscriberConfig.pollingTime) === subscriberConfig.pollingTime) ? Math.min(subscriberConfig.pollingTime, subscribersList[url].pollingTime) : null;
      } else {
        // New subscription
        elements = subscriberConfig.elements
        pollingTime = (Math.round(subscriberConfig.pollingTime) === subscriberConfig.pollingTime) ? subscriberConfig.pollingTime : null;
      }
      if(pollingTime<pollingTimeMin){
        log('Polling time is too short, min value is ' + pollingTimeMin);
        return false;
      }
      subscribersList[url] = {
        "elements": elements,
        "pollingTime": pollingTime,
        "callbackName": subscriberConfig.callbackName,
        "url": url
      };
      // Overwrite the callback
      subscribersList[url].callback = function(data){
        for (var i = subscribersList[url].elements.length - 1; i >= 0; i--) {
          // Be sure that the element is present on the page
          if(document.hasOwnProperty('contains')){
            // Out of IE
            if(document.contains(subscribersList[url].elements[i])){
              // Trigger dataProvide event on tags
              _mnvdrs.trigger.call(subscribersList[url].elements[i], 'dataProvide', data);
            } else {
              _mnvdrs.log('Element ' + subscribersList[url].elements[i].id + ' doesn\'t exist');
            }
          } else {
            // You are on IE
            _mnvdrs.trigger.call(subscribersList[url].elements[i], 'dataProvide', data);
          }
        };
      }
      log('Registered new elements for url ' + url);
    }
    // Start requests for each url
    function start(){
      log('Start request')
      // Run an jsonp request for each url
      for (var url in subscribersList) {
        requestData(subscribersList[url]);
        if(subscribersList[url].pollingTime !== null){
          startPolling(subscribersList[url]);
        }
      };
    }

    function requestData(subscriber){
      log('Requestiong data for ' + subscriber.url);
      jsonp(subscriber.url, subscriber.callbackName, subscriber.callback);
    }

    function stopPolling(subscriber){
    }

    function startPolling(subscriber){
      log('Start polling for ' + subscriber.url + ' every ' + subscriber.pollingTime + ' ms');
      pollingList[subscriber.url] = setInterval(function(){
        log('Polling for ' + subscriber.url );
        requestData(subscriber);
      },
      subscriber.pollingTime);
    }

    // Check if every  mandatory config propeties is in the expected type
    function checkMandatoryFields(list){
      for (var i = list.length - 1; i >= 0; i--) {
        if(typeof list[i][0] !== list[i][1]){
          return 'Properties ' + list[i][0] + ' is expected to be ' + list[i][1];
        }
      };
      return true;
    }

    // Inehrit function from Basic
    // TODO Change this part with prototype
    var basic = new MNVBasic();
    this.log = basic.log;
    // Disable logs.
    this.logEnabled = true;
    this.ready = basic.ready;
    this.jsonp = basic.jsonp;
    this.trigger = basic.trigger;
    // Public methods
    return {
      subscribe: subscribe,
      start: start,
      id: id,
      log: log,
      logEnabled: logEnabled,
      ready: ready,
      trigger: trigger
    };
  };

  return {
    // Get the Singleton _mnvdrs if one exists
    // or create one if it doesn't
    getInstance: function () {
      if ( !_mnvdrs ) {
        _mnvdrs = init();
        _mnvdrs.log('New instance of MnvDRS required');
      } else {
        _mnvdrs.log('New instance of MnvDRS required, but one still exist, no init triggered');
      }
      return _mnvdrs;
    }
  };

})();

var MnvDRSI = MnvDRS.getInstance();
// Document ready
MnvDRSI.ready(function(){
  MnvDRSI.start();
});