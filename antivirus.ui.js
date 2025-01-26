(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function () {
    return {
        templateUrl: 'views/directives/header.html',
        scope: {
            title: "@",
            subtitle: "@",
            iconsrc: "@",
            infoClickCallback: "&",
            upgradeClickCallback: "&",
            loginClickCallback: "&",
            profileClickCallback: "&",
            backEnabled: "@",
            accountEnabled: "@",
            upgradeEnabled: "&",
            showUserVoice: "@",
            userVoiceMessage: "@",
            userVoiceClick: "&",
            buttonEventName: "@",
            userLoggedInNoNameText: "@",
            anonymousUserText: "@",
            upgradeButtonText: "@",
            dashboardRequestSource: "@",
            loginTooltipView: "@"
        },
        controller: ['$scope', '$window', 'MessageBroker', 'MixpanelEventTracker', 'Tools', 'Logger',
            function ($scope, $window, MessageBroker, MixpanelEventTracker, Tools, Logger) {
                
            var makeWindowMovable = function () {
                $("#header").on('mousedown', function (event) {
                    if ("Execute" in $window.external) {
                        $window.external.Execute("aoe://Move");
                    }
                    else if ("Execute" in $window.iexternal) {
                        $window.iexternal.Execute("aoe://Move");
                    }
                    $scope.$emit("headerMoved", event);
                }).on('mousedown', 'a', function (event) {
                    event.stopPropagation();
                }).on('mousedown', 'button', function (event) {
                    event.stopPropagation();
                });
            };

            angular.element(document).ready(function () {
                makeWindowMovable();
            });

            $window.onbeforeunload = function(event) {
                Tools.TriggerGuiUnloading();
                return undefined;
            };

            $scope.headerButtonClick = function (command, url) {
                MixpanelEventTracker.TrackEvent($scope.buttonEventName, { Command: command, Category: 'Header' });
                $window.open(url);
            };

            $scope.headerButtonInfoClick = function () {
                $scope.infoClickCallback();
            };

            $scope.backButtonClick = function() {
                var request = {
                    path: '/executions',
                    verb: 'POST',
                    host: 'launcherui.' + Tools.GetUserSid()
                };

                var payload = {
                    data: {
                        type: 'executions',
                        attributes: [{
                            type: 'embedded',
                            value: {
                                path: '%home%'
                            }
                        }]
                    }
                };

                MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                    if (statusCode && statusCode >= 300) {
                        Logger.Warn("Received error response for /executions with status code " + statusCode + " and errors: " + errors);
                        return;
                    }
                }, payload);
            };

            if($scope.accountEnabled === null)
            {
                $scope.accountEnabled=true
            }
        }]
    };
};

},{}],2:[function(require,module,exports){
module.exports = function() {
    return {
        templateUrl: 'views/directives/headerProfile.html',
        scope: {
            buttonEventName: "@",
            userLoggedInNoNameText: "@",
            anonymousUserText: "@",
            dashboardRequestSource: "@",
            loginClickCallback: "&",
            profileClickCallback: "&",
            loginTooltipView: "@"
        },
        controller: [
            '$scope', '$window', 'MixpanelEventTracker', 'profile',
            function ($scope, $window, MixpanelEventTracker, profile) {
                $scope.loginUrl = "aoe://openDashboardUrl?section=login";
                $scope.dashboardUrl = "aoe://openDashboardUrl?section=dashboard";
                if ($scope.dashboardRequestSource) {
                    $scope.loginUrl += "&source=" + $scope.dashboardRequestSource;
                    $scope.dashboardUrl += "&source=" + $scope.dashboardRequestSource;
                }

                $scope.profile = profile;
                $scope.profileButtonClick = function() {
                    MixpanelEventTracker.TrackEvent($scope.buttonEventName, { Command: 'Show Profile', Category: 'Profile' });  
                    $window.open($scope.dashboardUrl);

                    if ($scope.profileClickCallback && typeof($scope.profileClickCallback) === 'function') {
                        $scope.profileClickCallback();
                    }
                };

                $scope.loginButtonClick = function () {
                    MixpanelEventTracker.TrackEvent($scope.buttonEventName, { Command: 'Login', Category: 'Profile' });
                    $window.open($scope.loginUrl);

                    if ($scope.loginClickCallback && typeof($scope.loginClickCallback) === 'function') {
                        $scope.loginClickCallback();
                    }
                };

                $scope.IsRegisteredWithName = function(profile) {
                    if(profile.loggedin && profile.name) {
                        return true;
                    }
                    return false;
                };

                $scope.IsRegisteredWithoutName = function(profile) {
                    if(profile.loggedin && !profile.name) {
                        return true;
                    }
                    return false;
                };
            }
        ]
    };
};
},{}],3:[function(require,module,exports){
module.exports = function () {
	return {
		templateUrl: 'views/directives/headerUpgrade.html',
		scope: {
			upgradeButtonText: "@",
			upgradeClickCallback: "&"
		},
		controller: ['$scope', function ($scope) {
			$scope.headerButtonUpgradeClick = function () {
				$scope.upgradeClickCallback();
			};
		}]
	};
};
},{}],4:[function(require,module,exports){
var hasSVG = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect);
var templateURL = 'views/directives/icon.html';
var isIE = (navigator.userAgent.indexOf('MSIE') != -1);
if (!hasSVG) {
	templateURL = 'views/directives/icon-ie8.html';
	(function() {
		$('body').addClass('no-svg ie8');	
	});
}
module.exports = function (module) {

	angular.forEach([
		{ ngAttrName: 'ngXlinkHref', attrName: 'xlink:href' },
		{ ngAttrName: 'ngWidth', attrName: 'width' },
		{ ngAttrName: 'ngHeight', attrName: 'height' }
	], function (pair) {

		var ngAttrName = pair.ngAttrName;
		var attrName = pair.attrName;

		module.directive(ngAttrName, function () {

			return {

				priority: 99,

				link: function (scope, element, attrs) {

					attrs.$observe(ngAttrName, function (value) {

						if (!value) return;

						attrs.$set(attrName, value);
						if (isIE) element.prop(attrName, value);
					});
				}
			};
		});
	});


	module.directive('icon', function() {
		return {
			templateUrl: templateURL,
			transclude: true,
			replace: true,
			scope: {
				name: '=',
				width: '=',
				height: '='
			},
			controller: ['$scope', function($scope){
				if (hasSVG) {
					$scope.icon = '#' + $scope.name;
				} else {

				}
			}],
			link: function ($scope, element, attributes) {
				$scope.$watch('name', function (value) {
					$scope.icon = '#' + $scope.name;
				});
			}
	  };
	});
};
},{}],5:[function(require,module,exports){
module.exports = function() {
    return {
        link: function(scope, element, attrs){
            element.bind('click',function(){
                window.setTimeout( function() { document.querySelector('#' + attrs.setFocus).focus(); }, 1 );
            });
        }
    };
};
},{}],6:[function(require,module,exports){
function ep(endpoint) {
    if (typeof endpoint === 'string') {
        endpoint = {
            host: 'launcher',
            path: endpoint,
            verb: 'GET'
        };
    } else if (typeof endpoint === 'object') {
        endpoint.host = endpoint.host || 'launcher';
        endpoint.verb = endpoint.verb || 'GET';
    }

    endpoint.requestFilter = endpoint.requestFilter || '';
    endpoint.subscribeFilter = endpoint.subscribeFilter || '';

    return endpoint;
}

module.exports = {
    profiles: function() {
        return ep({
            path: '/profiles'
        });
    }
};
},{}],7:[function(require,module,exports){
var LauncherFramework = angular.module('LauncherFramework', []);

require('tools')(LauncherFramework);
require('ieinformation')(LauncherFramework);
require('mixpaneleventtracker')(LauncherFramework);
require('logger')(LauncherFramework);

require('services/modelconverter')(LauncherFramework);
require('services/messagebroker')(LauncherFramework);
require('directives/icon')(LauncherFramework);

LauncherFramework.factory('profile', require('services/profile')());

LauncherFramework.directive('header', require('directives/header'));
LauncherFramework.directive('headerProfile', require('directives/headerProfile'));
LauncherFramework.directive('headerUpgrade', require('directives/headerUpgrade'));

LauncherFramework.directive('setFocus', require('directives/setFocus'));

module.exports = LauncherFramework;
},{"directives/header":1,"directives/headerProfile":2,"directives/headerUpgrade":3,"directives/icon":4,"directives/setFocus":5,"ieinformation":9,"logger":10,"mixpaneleventtracker":12,"services/messagebroker":17,"services/modelconverter":18,"services/profile":19,"tools":21}],8:[function(require,module,exports){
module.exports = {
    FRAMEWORK: 'LauncherFramework',
    MESSAGE_BROKER: 'MessageBroker',
    MODEL_CONVERTER: 'ModelConverter',
    MODEL_LIST_CONVERTER: 'ModelListConverter'
};
},{}],9:[function(require,module,exports){
module.exports = function (module) {
    module.factory('IeInformation', ['Tools', function (Tools) {
            var ieInformation = {
                ieRenderingVersion: undefined,

                GetIeRenderingEngineVersion: function() {
                    if (!this.ieRenderingVersion) {
                        this.ieRenderingVersion = Tools.GetVersionOfIeRenderingEngine();
                    }

                    return this.ieRenderingVersion;
                },

                GetIEVersion: function () {
                    return Math.floor(this.GetIeRenderingEngineVersion() / 1000);
                },

                IsIE10OrHigher: function() {
                    return this.GetIeRenderingEngineVersion() >= 10000;
                }
            };

            return ieInformation;
        }
    ]);
};
},{}],10:[function(require,module,exports){
module.exports = function (module) {
    module.factory('Logger', ['Tools', function (Tools) {
          var logger = {
                Info: function (message) {
                    Tools.LogMessage("info", message);
                },

                Debug: function (message) {
                    Tools.LogMessage("debug", message);
                },

                Error: function (message) {
                    Tools.LogMessage("error", message);
                },

                Fatal: function (message) {
                    Tools.LogMessage("fatal", message);
                },

                Warn: function (message) {
                    Tools.LogMessage("warn", message);
                },

                Trace: function (message) {
                    Tools.LogMessage("trace", message);
                }
            };

            return logger;
        }
    ]);
};
},{}],11:[function(require,module,exports){
if (typeof console === 'undefined') {
	console = {
		log: function () {
			// into the oblivion
		}
	};
}

require('shims');
require('framework');
},{"framework":7,"shims":20}],12:[function(require,module,exports){
module.exports = function (module) {
    module.factory('MixpanelEventTracker', ['Tools',
        function(Tools) {
            var commonPropertiesCallback = null;
            var mixpanelEventTracker = {				
				setCommonPropertiesCallback: function (callback) {
					commonPropertiesCallback = callback;
                },				
                TrackEvent: function (eventName, dictionary) {
					if(commonPropertiesCallback)
					{
                        if(!dictionary) {
                            dictionary = {};
                        }
                        
                        commonPropertiesCallback(dictionary);
					}
					
                    if (dictionary) {
                        Tools.SendMixpanelEvent(eventName, JSON.stringify(dictionary));
                    } else {
                        Tools.SendMixpanelEvent(eventName, "");
                    }
                }
            };

            return mixpanelEventTracker;
        }
    ]);
};
},{}],13:[function(require,module,exports){
// bind polyfill
if (!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
        var fn = this, args = Array.prototype.slice.call(arguments, 1);
        return function(){
            return fn.apply(context, Array.prototype.concat.apply(args, arguments));
        };
    };
}

var extend = function(child, parent) {
    for (var key in parent) {
        if (hasProp.call(parent, key)) {
            child[key] = parent[key];
        }
    }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var fargs = function (args) {
    return Array.prototype.slice.call(args);
};

var isdef = function (v) {
    return typeof v !== "undefined" && v !== null;
};

var hasProp = {}.hasOwnProperty;

var Collection = require('./model/collection');

var allModels = {};

var Model = {
    define: function(name, definition, parent) {
        /*
		 * In case the name is not provided, we define an anonymous class.
		 */
        if (!_.isString(name)) {
            parent = definition;
            definition = name;
            name = _.uniqueId('Class');
        }
        var Class = (function() {
            /*
			 * We define a constructor no matter what. If a constructor is provided
			 * in the definition, we make sure this.super is available.
			 * We also initialize collections in the definition, things like 
			 * relationship: [Type], where Type must be a class created using this method.
			 */
            var __ctr = function () {
                if (!isdef(this.classReference)) {
                    /*
                     * Lowercase 'class' is a reserved name in IE8 , that's why this field is called classReference
                     */
                    this.classReference = Class;
                }
                if (_.isFunction(definition.constructor)) {
                    var c = definition.constructor.bind(this);
                    // this.super = function a() {
                    // 	Class.__super__.constructor.apply(this, fargs(arguments));
                    // }.bind(this);
                    for (var j = 0; j < attributes.length; j++) {
                        var attribute = attributes[j];
                        if (!isdef(this[attribute.name])) {
                            this[attribute.name] = attribute.value.name;
                        }
                    }
                    for (var i = 0; i < collections.length; i++) {
                        var col = collections[i];
                        // col.type is class defined using this very method
                        this[col.name] = new col.type.List();
                        // collection will use the assigned __type to make sure only
                        // items of that kind will be added to the collection
                        this[col.name].__type = col.type;
                        // we too set the name of the collection instance, like 'devices'
                        this[col.name].__name = col.name;
                    }
                    c.apply(this, fargs(arguments));
                    //delete this.super;
                }
            };

            /*
			 * The class function must be created with name provided. 
			 * Not 100% sure about it, but here you have it. 
			 */
            __ctr = __ctr; // To avoid unused warning in jshint
            eval('var Class = function ' + name.replace(/-/g, '_') + ' (){ ' +
                '__ctr.bind(this).apply(this, fargs(arguments)); ' +
                '}');

            // Is this really necessary?
            // It seems not!
            // delete this.__ctr;

            /**
			 * We actually extend the parent class, if provided.
			 */
            if (isdef(parent)) {
                extend(Class, parent);
                Class.__extends = parent;
            }

            var filters = {};
            var collections = [];
            var attributes = [];

            _.map(definition, function(value, key) {
                if (key === "constructor") {
                    // Constructor is treated separately
                    return;
                } else if (_.isFunction(value)) {
                    // This is a function that goes into the class's prototype
                    // We wrap it into a function so we can provide a super, just in case.
                    Class.prototype[key] = function () {
                        // Create the super function and bind it to this instance of the class.
                        // this.super = function () {
                        // 	// Called only if an actual super function exists. 
                        // 	if (_.isFunction(Class.__super__[key])) {
                        // 		return Class.__super__[key].apply(this, fargs(arguments));
                        // 	}
                        // }.bind(this);
                        // Call the actual class method
                        var r = value.bind(this).apply(this, fargs(arguments));
                        // Get rid of the super for now. 
                        // delete this.super;
                        return r;
                    };
                } else if (_.isArray(value) && value.length == 1) {
                    // This is a relationship property
                    // Something like Users.devices = [Device]
                    var type = value[0];
                    collections.push({name: key, type: type});
                } else {
                    attributes.push({name: key, value: value});
                }

                // FilterBy methods are used in collections of instances of this class
                // Like user.devices.filterByName("name")
                if (key.indexOf("filterBy") === 0 && _.isFunction(value)) {
                    filters[key] = value;
                }
            });

            // We don't generate filter methods for classes that extend Collection
            if (parent !== Collection) {
                var listDefinition = {};
                _.map(filters, function (filterFunction, filterName) {
                    listDefinition[filterName] = function() {
                        var args = fargs(arguments);
                        console.log('calling filter with name: ' + filterName);
                        return _.filter(this, function(item) {
                            return filterFunction.apply(item, args);
                        });
                    };
                });
                // We generate a special class for collections of intances of this type
                Class.List = Model.define(name + 'List', listDefinition, Collection);
            }
            Class.__name = name;

            // Checks if given type is the same or an ancestor of this Class
            Class.isA = function (type) {
                var parent = Class;
                while (isdef(parent)) {
                    if (parent === type) {
                        return true;
                    }
                    parent = parent.__extends;
                }
                return false;
            };

            Class.getType = function() {
                return Class.__name;
            };

            return Class;

        })();

        allModels[name] = Class;

        return Class;
    },
    get: function(name) {
        return allModels[name];
    }
};

module.exports = Model;
},{"./model/collection":14}],14:[function(require,module,exports){
var extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
var hasProp = {}.hasOwnProperty;

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		// http://stackoverflow.com/questions/9370157/what-is-this-line-doing-arr-length-0
		// Make sure len is always an integer, basically
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += len;
		}

		for (; from < len; from++) {
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}

var isdef = function (v) {
	return typeof v !== "undefined" && v !== null;
};

module.exports = (function(superClass) {
	extend(Collection, superClass);

	function Collection() {
		Collection.__super__.constructor.apply(this, arguments);
	}

	Collection.prototype.push = function() {
		var args = Array.prototype.slice.call(arguments);
		if (isdef(this.__type) && isdef(this.__type.__name)) {
			for (var i = 0; i < args.length; i++) {
				var arg = args[i];
				if (!isdef(arg.classReference) || arg.classReference.__name !== this.__type.__name) {
					throw new Error('This ' + this.__name + ' collection only accepts items of type ' + this.__type.__name);
				}
			}
		}
		return Collection.__super__.push.apply(this, arguments);
	};

	Collection.prototype.add = function () {
		return this.push.apply(this, arguments);
	};

	Collection.prototype.remove = function (item) {
		var index = this.indexOf(item);
		if (index > -1) {
			this.splice(index, 1);
			return true;
		}
		return false;
	};
})(Array);
},{}],15:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('profiles', {
    constructor: function(data) {
        this.id = data.id;
        this.name = '';
        this.surname = '';
        this.confirmationDialog = false;
        this.email = '';

        if (!data.attributes){
            return;
        }
        this.confirmationDialog = data.attributes.confirmation_dialog;
        this.email = data.attributes.email;
        this.loggedin = this.email ? true : false;

        if(data.attributes.first_name) {
            this.name = !data.attributes.first_name.trim() ? '' : data.attributes.first_name;
        }

        if (data.attributes.last_name) {
            this.surname = !data.attributes.last_name.trim() ? '' : data.attributes.last_name;
        }
    },

    hasFullname: function() {
        return this.name || this.surname;
    },

    fullname: function() {
        return this.name + ' ' + this.surname;
    }
});
},{"model":13}],16:[function(require,module,exports){
var _external = "external";

window.workinginie8 = false;

if('SubscribeForResource' in window[_external]) {
	workinginie8 = true;
	window.iexternal = window.external;
}
else
{
	var callbacks = [];
	var requestCallbacks = [];
	var requestsNotification = {};
	var requestsResponse = {};

	_external = "iexternal";

	window[_external] = {
		commands: [],
		getRequestsResponse: function(){
			return requestsResponse;
		},
		// Stub methods for 'request'
		SendMessage: function(request) {
			var message = JSON.parse(request);
			var host = message.host;
			var id = message.id;
			var verb = message.verb;
			var path = message.path;
			console.log('Sending request to ' + host + path);

            if (id) {
                requestsResponse[id] = message;
            } else {
                requestsNotification[host + path] = message;
            }
		},
		RegisterSendMessageCallback: function(callback) {
			requestCallbacks.push(callback);
		},

		// Stub methods for 'on'/'subscribe'
		SubscribeForResource: function(host, path) {
		    console.log('Add subscription for ' + host + path);
			this.commands.push(path);
		},
		RemoveSubscription: function (host, path) {
		    console.log('Remove subscription for ' + host + path);
		    if (this.commands && this.commands[path]) {
		        delete this.commmands[path];
		    }
		},
		RegisterSubscriptionCallback: function(callback) {
			callbacks.push(callback);
		},
		mimicReceive: function (data) {
			var message = JSON.stringify(data);
			var i, callback;

		    var request;
		    if (data.sender && data.path) {
		        request = requestsNotification[data.sender + data.path];
		    }
		    else {
		        request = requestsResponse[data.id];
		    }

		    if (typeof request === 'object') {
				data.id = request.id;
				for (i = 0; i < requestCallbacks.length; i++) {
					callback = requestCallbacks[i];
					callback(JSON.stringify(data));
				}

				if (data.sender && data.path) {
				    delete requestsNotification[data.sender + data.path];
				}
				else {
				    delete requestsResponse[data.id];
				}
			} else {
				for (i = 0; i < callbacks.length; i++) {
					callback = callbacks[i];
					callback(message);
				}
			}
			message = JSON.parse(message);
			if (!localStorage.getItem(message.path)) {
				localStorage.setItem(message.path, JSON.stringify(message.payload, null, '\t'));
			}
		},
		HandleError: function(msg, file, line, col, error) {
			console.log(msg, file, line, col, error);
		}
	};
	workinginie8 = false;
}

var ExternalMessageBus = (function(){
	var requestCallbacks = {};

	var commandCallbacks = {};

	function ExternalMessageBus() {

	}

	ExternalMessageBus.prototype.EMBEDDED = workinginie8;

	ExternalMessageBus.prototype.request = function (endpoint, data, callback, headers) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
	    var path = endpoint.path + (endpoint.requestFilter || '');
	    var id = __uid();
		var request = {
		    id: id,
			acp: "1.0",
			host: endpoint.host,
			path: path,
			verb: endpoint.verb,
			payload: data,
			headers: headers
		};
		requestCallbacks[request.id] = callback;
		window[_external].SendMessage(JSON.stringify(request));

	    return id;
	};

    window[_external].RegisterSendMessageCallback(function(json) {
        var response = JSON.parse(json);
        var callback = requestCallbacks[response.id];
        if (typeof callback === "function") {
            callback(response);
            delete requestCallbacks[response.id];
        }
    });

	ExternalMessageBus.prototype.subscribe = function (endpoint, callback) {
		var host = endpoint.host;
		var path = endpoint.path + (endpoint.subscribeFilter || '');

		commandCallbacks[host] = commandCallbacks[host] || {};
		commandCallbacks[host][path] = commandCallbacks[host][path] || [];
		commandCallbacks[host][path].push(callback);

		window[_external].SubscribeForResource(host, path);
	};

	ExternalMessageBus.prototype.removeSubscription = function (endpoint) {
	    var host = endpoint.host;
	    var path = endpoint.path + (endpoint.subscribeFilter || '');

	    if (commandCallbacks[host] && commandCallbacks[host][path] && commandCallbacks[host][path].length > 0) {
	        commandCallbacks[host][path].shift();
	    }

	    var callbacks = commandCallbacks[host][path] || [];
	    if (callbacks.length < 1) {
            window[_external].RemoveSubscription(host, path);
        }
	};

	window[_external].RegisterSubscriptionCallback(function(json) {
		var message = JSON.parse(json);
		// Just in case no callback was registered for this host.
		commandCallbacks[message.sender] = commandCallbacks[message.sender] || {};
		// Just in case no callback was registered for this 'path'
		var callbacks = commandCallbacks[message.sender][message.path] || [];
		for (var i = 0; i < callbacks.length; i++) {
			var callback = callbacks[i];
			if (typeof callback === "function") {
				// All messages should have a payload with a data attribute set
				// Data can be either an object or an array. It's up to the callback to know that
			    var parameterData = {};

			    if (message.payload.data) {
			        parameterData = message.payload.data;
			    }

			    callback(parameterData, message.verb);
			}
		}
	});

	var __uid = function () {
		var id = '';
		for (var i = 0; i < 10; i++) {
			id += Math.round(Math.random() * 10) + '';
		}
		return id;
	};

	return ExternalMessageBus;

})();

module.exports = new ExternalMessageBus();



if (workinginie8) {	
	// hook to provide ability to read local files without restrictions 
	window.XMLHttpRequest = function () {

		// this http request object does not have cross origin restrictions
		// and can work with local files
		this.xhr = new ActiveXObject("MSXML2.XMLHTTP.6.0"); 
		this.onload = null;
		this.onerror = null;
		this.onabort = null;
		this.onreadystatechange = null;
		this.readyState = null;
		this.responseBody = null;
		this.responseStream = null;
		this.responseText = null;
		this.responseXML = null;
		this.status = null;
		this.statusText = null;

		var obj = this;

		this.propogateProperty = function () {
			this.responseBody = this.xhr.responseBody;
			this.responseStream = this.xhr.responseStream;
			this.responseText = this.xhr.responseText;
			this.responseXML = this.xhr.thisresponseXML;
			this.status = this.xhr.status;
			this.statusText = this.xhr.statusText;
		};


		this.xhr.onreadystatechange = function () {

			obj.readyState = obj.xhr.readyState;
			if (obj.xhr.readyState == 4) {
				obj.propogateProperty();
			}

			// use status == 200 to know if the request was successfully
			if (obj.xhr.readyState === 4 &&
				(obj.xhr.status === 200 ||
				 obj.xhr.status === 201 ||
				 obj.xhr.status === 202 ||
				 obj.xhr.status === 0)) { // since files are local -> status = 0 , no webserver here
				if (obj.onload) {
					obj.onload();
				}
			}

			// If request fail show progress bar in red
			if (obj.xhr.readyState === 4 &&
				(obj.xhr.status === 404 ||
				 obj.xhr.status === 400 ||
				 obj.xhr.status === 403)) {
				if (obj.onerror) {
					obj.onerror();
				}
			}

			if (obj.xhr.readyState === 0) {
				if (obj.onabort) {
					obj.onabort();
				}
			}

			if (obj.onreadystatechange) {
				obj.onreadystatechange();
			}
		};


		this.open = function (bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword) {
			return this.xhr.open(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword);
		};

		this.send = function (varBody) {
			return this.xhr.send(varBody);
		};

		this.setRequestHeader = function (bstrHeader, bstrValue) {
			return this.xhr.setRequestHeader(bstrHeader, bstrValue);
		};

		this.getAllResponseHeaders = function () {
			return this.xhr.getAllResponseHeaders();
		};
	};
}
},{}],17:[function(require,module,exports){
var MessageBus = require('services/external');
var Exposed = require('frameworkexposed');

module.exports = function(module) {
    module.factory(Exposed.MESSAGE_BROKER, ['$timeout', 'Tools', Exposed.MODEL_LIST_CONVERTER, Exposed.MODEL_CONVERTER, 
        function ($timeout, tools, modelListConverter, modelConverter) {
            var messageBroker = {
                EMBEDDED: MessageBus.EMBEDDED,

                subscribeConvert: function(endpoint, converter, callback) {
                    MessageBus.subscribe(endpoint, function(data, verb) {
                        data = converter.convert(data);
                        $timeout(function() {
                            callback(data, verb);
                        }, 0);
                    });
                },

                subscribe: function(endpoint, callback) {
                    messageBroker.subscribeConvert(endpoint, modelConverter, callback);
                },

                requestConvert: function (endpoint, converter, callback, payload, headers) {
                    return MessageBus.request(endpoint, payload, function (response) {
                        var parameterData = {};
                        var parameterErrors = {};
                        if (response && response.payload) {
                            if (response.payload.data) {
                                parameterData = response.payload.data;
                            }
                            if (response.payload.errors) {
                                parameterErrors = response.payload.errors;
                            }
                        }

                        parameterData = converter.convert(parameterData);
                        $timeout(function () {
                            callback(parameterData, response.status_code, parameterErrors);
                        }, 0);
                    }, headers);
                },

                request: function (endpoint, callback, payload, headers) {
                    return MessageBus.request(endpoint, payload, function (response) {
                        $timeout(function () {
                            callback(response);
                        }, 0);
                    }, headers);
                },

                requestList: function (endpoint, callback, payload, headers) {
                    return messageBroker.requestConvert(endpoint, modelListConverter, callback, payload, headers);
                },
                
                requestSingle: function (endpoint, callback, payload, headers) {
                    return messageBroker.requestConvert(endpoint, modelConverter, callback, payload, headers);
                },

                removeSubscription: function(endpoint) {
                    MessageBus.removeSubscription(endpoint);
                },

                getHostName: function() {
                    return tools.GetMessageBrokerHostName();
                }
            };
            return messageBroker;
        }
    ]);
};
},{"frameworkexposed":8,"services/external":16}],18:[function(require,module,exports){
var Exposed = require('frameworkexposed');
var Model = require('model');

module.exports = function (module) {
    module.factory(Exposed.MODEL_CONVERTER, function () {
        var modelConverter = {
            convert: function (data) {
                if (data && data.type) {

                    var model = Model.get(data.type);
                    if (model) {
                        return new model(data);
                    }
                    return data;
                }
                return null;
            }
        };
        return modelConverter;
    });
    module.factory(Exposed.MODEL_LIST_CONVERTER, function () {
        var modelListConverter = {
            convert: function (data) {
                if (data && data[0]) {
                    var modelList = [];

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].attributes) {
                            var model = Model.get(data[i].type);
                            if (model) {
                                modelList.push(new model(data[i]));
                            }
                        }
                    }

                    if (modelList.length) {
                        return modelList;
                    }
                    return data;
                }
                return null;
            }
        };
        return modelListConverter;
    });
};
},{"frameworkexposed":8,"model":13}],19:[function(require,module,exports){
var Profile = require('model/profiles');
var Framework = require('frameworkexposed');
var EP = require('framework-endpoints');

module.exports = function() {
    return [
        '$rootScope', Framework.MESSAGE_BROKER, 'Logger',
        function($rootScope, MessageBroker, Logger) {
            var profile = new Profile({});

            var profilesEndpoint = EP.profiles();

            var updateProfile = function(newProfile) {
                for (var key in newProfile) {
                    if (newProfile.hasOwnProperty(key)) {
                        profile[key] = newProfile[key];
                    }
                }

                $rootScope.$apply();
            };

            MessageBroker.subscribe(profilesEndpoint, function(profile) {
                updateProfile(profile);
            });

            MessageBroker.requestList(profilesEndpoint, function(profile, statusCode, errors) {
                if (statusCode && statusCode >= 300) {
                    Logger.Warn("Received error response for " + profilesEndpoint.path + " with status code " + statusCode + " and errors: " + errors);
                    return;
                }

                if (profile && profile instanceof Array && profile[0]) {
                    updateProfile(profile[0]);
                }
            });

            return profile;
        }
    ];
};
},{"framework-endpoints":6,"frameworkexposed":8,"model/profiles":15}],20:[function(require,module,exports){
// bind polyfill
if (!Function.prototype.bind) {
  Function.prototype.bind = function(context) {
     var fn = this, args = Array.prototype.slice.call(arguments, 1);
     return function(){
        return fn.apply(context, Array.prototype.concat.apply(args, arguments));
     };
  };
}

// forEach shim
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

if (!Array.prototype.every) {
  Array.prototype.every = function(callbackfn, thisArg) {
    'use strict';
    var T, k;

    if (this === null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the this 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method
    //    of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== 'function') {
      throw new TypeError();
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method
        //    of O with argument Pk.
        kValue = O[k];

        // ii. Let testResult be the result of calling the Call internal method
        //     of callbackfn with T as the this value and argument list 
        //     containing kValue, k, and O.
        var testResult = callbackfn.call(T, kValue, k, O);

        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    'use strict';
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    'use strict';
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {

    var k;
    if (this === null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);
    var len = o.length >>> 0;

    if (len === 0) {
      return -1;
    }

    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    if (n >= len) {
      return -1;
    }

    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if (Function.prototype.bind && typeof console == "object" && typeof console.log == "object") {
    var logFns = ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"];

    logFns.forEach(function (method, i) {
        console[method] = Function.prototype.call.bind(console[method], console);
    });
}

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  };
}
},{}],21:[function(require,module,exports){
module.exports = function (module) {
    module.factory('Tools', ['$window', function ($window) {
        var tools = {
            GetUserSid: function () {
                if ("GetUserSid" in $window.external) {
                    return $window.external.GetUserSid();
                }
                else if ("GetUserSid" in $window.iexternal) {
                    return $window.iexternal.GetUserSid();
                }
                return null;
            },

            GetLanguageName: function () {
                if ("GetLanguageName" in $window.external) {
                    return $window.external.GetLanguageName();
                }
                else if ("GetLanguageName" in $window.iexternal) {
                    return $window.iexternal.GetLanguageName();
                }
                return "en_US";
            },

            SendMixpanelEvent: function (eventName, propertyJson) {
                if ("SendMixpanelEvent" in $window.external) {
                    return $window.external.SendMixpanelEvent(eventName, propertyJson);
                }
                else if ("SendMixpanelEvent" in $window.iexternal) {
                    return $window.iexternal.SendMixpanelEvent(eventName, propertyJson);
                }

                return false;
            },

            LogMessage: function (logLevel, message) {
                if ("Log" in $window.external) {
                    $window.external.Log(logLevel, message);
                }
                else if ("Log" in $window.iexternal) {
                    $window.iexternal.Log(logLevel, message);
                }
            },

            GetProductName: function () {
                if ("GetProductName" in $window.external) {
                    return $window.external.GetProductName();
                }
                else if ("GetProductName" in $window.iexternal) {
                    return $window.iexternal.GetProductName();
                }
                return "Avira";
            },

            GetDeviceId: function () {
                if ("GetDeviceId" in $window.external) {
                    return $window.external.GetDeviceId();
                }
                else if ("GetDeviceId" in $window.iexternal) {
                    return $window.iexternal.GetDeviceId();
                }
                return "";
            },

            RegisterOnGuiOpenedCallback: function (callback) {
                if ("RegisterOnGuiOpenedCallback" in $window.external) {
                    $window.external.RegisterOnGuiOpenedCallback(callback);
                }
                else if ("RegisterOnGuiOpenedCallback" in $window.iexternal) {
                    $window.iexternal.RegisterOnGuiOpenedCallback(callback);
                }
            },

            RegisterOnGuiClosedCallback: function (callback) {
                if ("RegisterOnGuiClosedCallback" in $window.external) {
                    $window.external.RegisterOnGuiClosedCallback(callback);
                }
                else if ("RegisterOnGuiClosedCallback" in $window.iexternal) {
                    $window.iexternal.RegisterOnGuiClosedCallback(callback);
                }
            },

            TriggerGuiLoadFinished: function () {
                if ("OnGuiLoadFinished" in $window.external) {
                    $window.external.OnGuiLoadFinished();
                }
                else if ("OnGuiLoadFinished" in $window.iexternal) {
                    $window.iexternal.OnGuiLoadFinished();
                }
            },

            TriggerGuiLoading: function () {
                if ("OnGuiLoading" in $window.external) {
                    $window.external.OnGuiLoading();
                }
                else if ("OnGuiLoading" in $window.iexternal) {
                    $window.iexternal.OnGuiLoading();
                }
            },

            TriggerGuiUnloading: function () {
                if ("OnGuiUnloading" in $window.external) {
                    $window.external.OnGuiUnloading();
                }
                else if ("OnGuiUnloading" in $window.iexternal) {
                    $window.iexternal.OnGuiUnloading();
                }
            },

            GetVersionOfIeRenderingEngine: function () {
                if ("GetVersionOfIeRenderingEngine" in $window.external) {
                    return $window.external.GetVersionOfIeRenderingEngine();
                }
                else if ("GetVersionOfIeRenderingEngine" in $window.iexternal) {
                    return $window.iexternal.GetVersionOfIeRenderingEngine();
                }

                return null;
            },
            GetThisComputer: function () {
                if ("GetThisComputer" in $window.external) {
                    return $window.external.GetThisComputer();
                }
                else if ("GetThisComputer" in $window.iexternal) {
                    return $window.iexternal.GetThisComputer();
                }

                return null;
            },
            GetSubFolders: function (path) {
                if ("GetSubFolders" in $window.external) {
                    return $window.external.GetSubFolders(path);
                }
                else if ("GetSubFolders" in $window.iexternal) {
                    return $window.iexternal.GetSubFolders(path);
                }

                return null;
            },
            GetMessageBrokerHostName: function() {
                if ("GetMessageBrokerHostName" in $window.external) {
                    return $window.external.GetMessageBrokerHostName();
                }
                else if ("GetMessageBrokerHostName" in $window.iexternal) {
                    return $window.iexternal.GetMessageBrokerHostName();
                }

                return null;
            },
            SendAppEvents: function (name, eventType, service, experiments, parameters) {
                var appEvents = {
                    event_type: eventType,
                    name: name,
                    service: service,
                    experiment: experiments,
                    parameters: parameters
                };
                
                if ("SendAppEvents" in $window.external) {
                    $window.external.SendAppEvents(JSON.stringify(appEvents));
                }
                else if ("SendAppEvents" in $window.iexternal) {
                    $window.iexternal.SendAppEvents(JSON.stringify(appEvents));
                }
            },
            SendAppEventsWithToken: function (name, eventType, service, experiments, parameters, token) {
                var appEvents = {
                    event_type: eventType,
                    name: name,
                    service: service,
                    experiment: experiments,
                    parameters: parameters
                };
                
                if ("SendAppEventsWithToken" in $window.external) {
                    $window.external.SendAppEvents(JSON.stringify(appEvents), token);
                }
                else if ("SendAppEventsWithToken" in $window.iexternal) {
                    $window.iexternal.SendAppEvents(JSON.stringify(appEvents), token);
                }
            },
            GetLauncherVersion: function() {
                if ("GetLauncherVersion" in $window.external) {
                    return $window.external.GetLauncherVersion();
                }
                else if ("GetLauncherVersion" in $window.iexternal) {
                    return $window.iexternal.GetLauncherVersion();
                }

                return null;
            }
        };
        return tools;
    }]);
};
},{}],22:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var controller = function ($scope, $window, LoggingService, MixPanelService, EventTrackingNamesService) {

        var url = "aoe://openDashboardUrl?section=upgrade&bundleId=ispm0&windowPosition=onTopOfMainWindow&windowid=scard&source=product&x-a-medium=avbanner";
        $scope.openAdvertisement = openAdvertisement;

        function openAdvertisement() {
            $window.open(url);
            trackAdvertisemenUnlockButtonClicked();
            LoggingService.Debug("AOS-advertisement-controller::openAdvertisement()");
        }

        function trackAdvertisemenUnlockButtonClicked() {
            MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, {
                Category: 'Advertisement',
                Command: 'Unlock',
                Url: url
            });
        }
    };
    controller.$inject = ["$scope", "$window", "LoggingService", "MixPanelService", "EventTrackingNamesService"];

    return app.controller(name, controller);
};
},{}],23:[function(require,module,exports){
module.exports = function (name, app) {
    /**@ngInject*/
    var controller = function ($scope, $document, $timeout, LoggingService, ActivityService, translator, MenuBarService, IeInformationService) {
        $scope.message = "Activity View";

        $scope.isSelectMenuShown = false;
        $scope.isFilterByMenuShown = false;

        $scope.isSelectDropDownClicked = isSelectDropDownClicked;
        $scope.filterByDropDownClicked = filterByDropDownClicked;
        $scope.ActivityService = ActivityService;
        $scope.dates = $scope.ActivityService.getDates();
        $scope.activityMenuEntries = $scope.ActivityService.getActivityMenu();
        $scope.severityMenuEntries = $scope.ActivityService.getSeverityMenu();
        $scope.activityMenuEntriesShown = $scope.ActivityService.getActivityMenuShown();
        $scope.severityMenuEntriesShown = $scope.ActivityService.getSeverityMenuShown();
        $scope.firstEndpoint = $scope.ActivityService.getFirstEndpoint();
        $scope.lastEndpoint = $scope.ActivityService.getLastEndpoint();
        $scope.currentEndpoint = $scope.ActivityService.getCurrentEndpoint();
        $scope.loadNextText = loadNextText;
        $scope.loadPreviousText = loadPreviousText;
        $scope.isLastPage = checkIsLastPage();
        $scope.isFirstPage = checkIsFirstPage();
        $scope.getActivityLoader = getActivityLoader;
        $scope.isLoading = ActivityService.isLoading();
        $scope.hasActivitiyElements = $scope.ActivityService.hasActivitiyElements();
        $scope.areAllFiltersActive = $scope.ActivityService.areAllFiltersActive();
        $scope.resetFilters = $scope.ActivityService.resetFilters;
        $scope.getSlideDownStyleSelected = getSlideDownStyleSelected;
        $scope.getSlideDownStyleFilter = getSlideDownStyleFilter;
        $scope.getIsSelectIcon = getIsSelectIcon;
        $scope.getIsFilterByIcon = getIsFilterByIcon;
        $scope.severityFilterChanged = severityFilterChanged;
        $scope.activityFilterChanged = activityFilterChanged;
        
        MenuBarService.setCurrentView('activity');

        $scope.config = {
            axis: 'y' // enable 2 axis scrollbars by default 
        };

        $scope.$on('activitiesListChanged', function () {
            $scope.dates = $scope.ActivityService.getDates();
            $scope.hasActivitiyElements = $scope.ActivityService.hasActivitiyElements();
            $scope.areAllFiltersActive = $scope.ActivityService.areAllFiltersActive();
            $scope.activityMenuEntriesShown = $scope.ActivityService.getActivityMenuShown();
            $scope.severityMenuEntriesShown = $scope.ActivityService.getSeverityMenuShown();
            $scope.firstEndpoint = $scope.ActivityService.getFirstEndpoint();
            $scope.lastEndpoint = $scope.ActivityService.getLastEndpoint();
            $scope.currentEndpoint = $scope.ActivityService.getCurrentEndpoint();
            $scope.isLastPage = checkIsLastPage();
            $scope.isFirstPage = checkIsFirstPage();
        });

        function getIsSelectIcon() {
            if ($scope.isSelectMenuShown) {
                return "icon_antivirus activity-menu-listbox-icon-selected";
            }

            return "icon_antivirus activity-menu-listbox-icon-notselected";
        }

        function getIsFilterByIcon() {
            if ($scope.isFilterByMenuShown) {
                return "icon_antivirus activity-menu-listbox-icon-selected";
            }

            return "icon_antivirus activity-menu-listbox-icon-notselected";
        }

        function getSlideDownStyleSelected() {
            return "slide-down activity-box-slider offset-one";
        }

        function severityFilterChanged(item) {
            item.isFilterActive = !item.isFilterActive;
            $scope.ActivityService.setSeverityFilter(item, item.isFilterActive);
        }

        function activityFilterChanged(item) {
            item.isFilterActive = !item.isFilterActive;
            $scope.ActivityService.setActivityFilter(item, item.isFilterActive);
        } 

        function getSlideDownStyleFilter() {
            return "slide-down activity-box-slider offset-two";
        }
        
        $scope.ActivityService = ActivityService;

        $scope.$on('loaderStatusChanged', function () {
            $scope.isLoading = $scope.ActivityService.isLoading();
        });

        function isSelectDropDownClicked() {
            $scope.isFilterByMenuShown = false;
            $scope.isSelectMenuShown = !$scope.isSelectMenuShown;
        }

        function filterByDropDownClicked() {
            $scope.isFilterByMenuShown = !$scope.isFilterByMenuShown;
            $scope.isSelectMenuShown = false;
        }

        function checkIsLastPage() {
            return $scope.currentEndpoint.path === $scope.lastEndpoint.path;
        }
        function checkIsFirstPage() {
            return $scope.currentEndpoint.path === $scope.firstEndpoint.path;
        }

        function loadPreviousText() {
            return translator.getString("activityController.button.loadPreviousItems", null, { count: $scope.ActivityService.getPageSize() });
        }
        function loadNextText() {
            return translator.getString("activityController.button.loadNextItems", null, { count: $scope.ActivityService.getPageSize() });
        }

        $scope.$on('aviraSecureClickEvent',
            function (e, event) {
                var closest = $(event.srcElement).closest('div');
                var closestTarget = $(event.target).closest('div');

                if (closest && closest.length > 0) {
                    if (((!IeInformationService.GetIEVersion() || IeInformationService.IsIE10OrHigher()) &&
                        !isMenuBarElement(event.target.classList) &&
                        !isMenuBarElement(closest[0].classList)) ||
                        (!isMenuBarElementIe9(event.target.className) &&
                            !isMenuBarElementIe9(closest[0].className))) {
                        closeDropDownMenu();
                    }
                }

                if (closestTarget && closestTarget.length > 0) {
                    if (((!IeInformationService.GetIEVersion() || IeInformationService.IsIE10OrHigher()) &&
                        !isMenuBarElement(event.target.classList) &&
                        !isMenuBarElement(closestTarget[0].classList)) ||
                        (!isMenuBarElementIe9(event.target.className) &&
                            !isMenuBarElementIe9(closestTarget[0].className))) {
                        closeDropDownMenu();
                    }
                }
            });

        function isMenuBarElement(list) {
            if (!list || !list.length) {
                return false;
            }

            var length = list.length;
            for (var i = 0; i < length; i++) {
                if (list[i].indexOf('checkbox') !== -1 ||
                    list[i].indexOf('activity-menu-listbox') !== -1 ||
                    list[i].indexOf('activity-menu-checkbox') !== -1 ||
                    list[i].indexOf('activity-filter-container') !== -1 ||
                    list[i].indexOf('activity-vertical') !== -1) {
                    return true;
                }
            }
            return false;
        }

        function isMenuBarElementIe9(list) {

            if (!list) {
                return false;
            }

            if (list.indexOf('checkbox') !== -1 ||
                list.indexOf('activity-menu-listbox') !== -1 ||
                list.indexOf('activity-menu-checkbox') !== -1 ||
                list.indexOf('activity-filter-container') !== -1 ||
                list.indexOf('activity-vertical') !== -1) {
                return true;
            }
            return false;
        }

        function getActivityLoader() {
            return { 'activity-loader': $scope.ActivityService.isLoading() };
        }

        function closeDropDownMenu() {
            $timeout(function () {
                $scope.isSelectMenuShown = false;
                $scope.isFilterByMenuShown = false;
            });
        }
    };
    controller.$inject = ["$scope", "$document", "$timeout", "LoggingService", "ActivityService", "translator", "MenuBarService", "IeInformationService"];

    return app.controller(name, controller);
};
},{}],24:[function(require,module,exports){
module.exports = function(name, app) {

    /**@ngInject*/
    var animation = function ($velocity, $q, LoggingService) {
        return {
            beforeAddClass: function (element, classname, done) {
                if (classname == 'ng-hide') {
                    slideUp(element).then(function (value) {
                        done();
                    });
                } else {
                    done();
                }
            },
            removeClass: function (element, classname, done) {
                if (classname == 'ng-hide') {
                    slideDown(element).then(function (value) {
                        done();
                    });
                } else {
                    done();
                }
            },
            enter: function () {
            },
            leave: function () {
            },
            move: function () {
            }
        };

        function slideUp(element) {
            var deferred = $q.defer();
            $velocity(element, 'transition.slideUpOut',
                {opacity: 0.5, duration: 300, stagger: 200, easing:'linear', top: '25%', complete: deferred.resolve("slideUp")});
            return deferred.promise;
        }

        function slideDown(element) {
            var deferred = $q.defer();
            $velocity(element, 'transition.slideDownIn',
                {opacity: 0.5, duration: 500, stagger: 200, easing:'linear', top: '-50%', complete: deferred.resolve("slideDown")});
            return deferred.promise;
        }
    };
    animation.$inject = ["$velocity", "$q", "LoggingService"];

    return app.animation(name, animation);

};


},{}],25:[function(require,module,exports){
module.exports = function(name, app) {

    /**@ngInject*/
    var animation = function ($rootScope, $velocity, $q, LoggingService) {
        return {
            beforeAddClass: function (element, classname, done) {
                if (classname === 'ng-hide') {
                    slideIn(element).then(function (value) {
                        done();
                    });
                } else {
                    done();
                }
            },
            removeClass: function (element, classname, done) {
                if (classname === 'ng-hide') {
                    slideOut(element).then(function (value) {                 
                        done();
                    }).then(function (value) {
                        $rootScope.$broadcast("slideInAnimationFinished");
                    });
                } else {
                    done();
                }
            },
            enter: function () {
            },
            leave: function () {
            },
            move: function () {
            }
        };

        function slideIn(element) {
            var deferred = $q.defer();
            $velocity(element, 'transition.slideLeftBigOut',
                {opacity: 0.5, duration: 300, stagger: 200, easing:'linear', top: '25%', complete: deferred.resolve("slideIn")});
            return deferred.promise;
        }

        function slideOut(element) {
            var deferred = $q.defer();
            $velocity(element, 'transition.slideLeftBigIn',
                {opacity: 0.7, duration: 500, stagger: 200, easing:'linear', top: '-25%', complete: deferred.resolve("slideOut")});
            return deferred.promise;
        }
    };
    animation.$inject = ["$rootScope", "$velocity", "$q", "LoggingService"];

    return app.animation(name, animation);

};


},{}],26:[function(require,module,exports){


module.exports = function (name, app) {

    /**@ngInject*/
    var antivirus = function ($scope, $document, AntivirusLanguages, MixPanelService, EndpointService, WebsiteLinksService, Tools, MessageBroker, EventTrackingNamesService, translator, LoggingService, IeInformationService, AppStatusService, CommonService) {

        var language = Tools.GetLanguageName();

        if (MessageBroker.EMBEDDED) {
            window.document.body.className += ' embedded';
        } else {
            window.document.body.className += ' notembedded';
            if (language === "no_loc") {
                language = "en_US";
            }
            else {
                // do not remove this is to show in debug build what localization has still to do before release
                translator.debug = true;
            }
        }

        translator.initialize(language, AntivirusLanguages);

        $scope.CommonService = CommonService;

        switch (language) {
            case "de_DE":
                moment.locale('de');
                break;
            case "en_US":
                moment.locale('en');
                break;
            case "es_ES":
                moment.locale('es');
                break;
            case "fr_FR":
                moment.locale('fr');
                break;
            case "id_ID":
                moment.locale('id');
                break;
            case "it_IT":
                moment.locale('it');
                break;
            case "ja_JP":
                moment.locale('ja');
                break;
            case "nl_NL":
                moment.locale('nl');
                break;
            case "pl_PL":
                moment.locale('pl');
                break;
            case "pt_BR":
                moment.locale('pt-br');
                break;
            case "ru_RU":
                moment.locale('ru');
                break;
            case "tr_TR":
                moment.locale('tr');
                break;
            case "zh_CN":
                moment.locale('zh-cn');
                break;
            case "zh_TW":
                moment.locale('zh-tw');
                break;
            default:
                moment.locale('en');
                break;
        }
        $scope.AppStatusService = AppStatusService;
        $scope.isPaid = $scope.AppStatusService.isPaidProduct;
        $scope.isUpgradeButtonEnabled = isUpgradeButtonEnabled;

        function isUpgradeButtonEnabled()
        {
            return $scope.isPaid() === false || $scope.AppStatusService.needToRenewLicense();
        }

        $scope.productName = $scope.CommonService.getProductName($scope.AppStatusService.about.product_id);
        $scope.brandName = $scope.CommonService.getBrandName();
        $scope.isPaidProduct = $scope.isPaid();

        if (IeInformationService.GetIEVersion()) {
            window.document.body.className += ' ie' + IeInformationService.GetIEVersion();
        }

        $scope.$on('appStatusChanged', function (event, data) {
            if (data.attributes.source) {
                // somebody changed the app-statuses message and add a value called source
                LoggingService.Warn('Antivirus UI is in fallback mode because received following source: ' + data.attributes.source + ' for section: ' + data.attributes.section);
                MixPanelService.TrackEvent(EventTrackingNamesService.AppStatusSource,{
                        Source: data.attributes.source,
                        Section: data.attributes.section
                });
            }

            if (data.attributes.section === 'about') {
                $scope.productName = $scope.CommonService.getProductName($scope.AppStatusService.about.product_id);
                $scope.isPaidProduct = $scope.isPaid();
            }
        });
        
    };
    antivirus.$inject = ["$scope", "$document", "AntivirusLanguages", "MixPanelService", "EndpointService", "WebsiteLinksService", "Tools", "MessageBroker", "EventTrackingNamesService", "translator", "LoggingService", "IeInformationService", "AppStatusService", "CommonService"];

    return app.controller(name, antivirus);
};

},{}],27:[function(require,module,exports){
module.exports = function (name, app) {
    
        /**@ngInject*/
        var controller = function (
            $scope,
            $window,
            MixPanelService,
            AppStatusService,
            ConfigurationService,
            LoggingService,
            EventTrackingNamesService,
            WebsiteLinksService,
            $timeout) {

            $scope.ConfigurationService = ConfigurationService;
            $scope.dismiss_feedback_higlighting = false;
            $scope.feedbackButtonClick = feedbackButtonClick;
            $scope.feedbackDismissButtonClick = feedbackDismissButtonClick;

            
            function feedbackButtonClick() {
                $timeout(function () {
                    var resource_id = "feedback";
                    var product_id = AppStatusService.about.product_id;
                    var product_language = AppStatusService.about.language;
                    var product_version = AppStatusService.about.version;
                    var platform_version = AppStatusService.about.platform_version;
                    var platform_type = AppStatusService.about.platform_type;
                    var device_id = AppStatusService.about.device_id;

                    MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, {
                        Command: 'Feedback', 
                        Category: 'Feedback'
                    });
        
                    if ($scope.ConfigurationService.getSurvey().highlight_feedback) {
                        resource_id = "feedbackTimeTriggeredSurvey";
                        $scope.dismiss_feedback_higlighting = true;
                    }
        
                    $scope.ConfigurationService.sendFeedbackClicked();
                    
                    $window.open(WebsiteLinksService.getFeedbackLink(
                        resource_id,
                        product_id,
                        product_language,
                        product_version,
                        platform_version,
                        platform_type,
                        device_id));
                });
            }
    
            function feedbackDismissButtonClick() {
                $timeout(function () {
                    MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, {
                        Command: 'Dismiss', 
                        Category: 'Feedback'
                    });
                    $scope.ConfigurationService.sendFeedbackClicked();
                    $scope.dismiss_feedback_higlighting = true;
                });
            }
    
            $scope.$on("hightlightFeedbackReceived", function(event, data)
            {
                if ($scope.ConfigurationService.getSurvey().highlight_feedback === true) {
                    MixPanelService.TrackEvent(EventTrackingNamesService.FeedbackHighlighted, {});
                }
            });
        };
        controller.$inject = ["$scope", "$window", "MixPanelService", "AppStatusService", "ConfigurationService", "LoggingService", "EventTrackingNamesService", "WebsiteLinksService", "$timeout"];
    
        return app.controller(name, controller);
    };
},{}],28:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./antivirus-controller')('AntivirusController', app);

require('./animation-slidein-controller')('.slide-in', app);
require('./animation-slidedown-controller')('.slide-down', app);

require('./status-controller')('StatusController', app);
require('./quarantine-controller')('QuarantineController', app);
require('./activity-controller')('ActivityController', app);
require('./feedback-controller')('FeedbackController', app);
require('./settings-controller')('SettingsController', app);
require('./AOS-advertisement-controller')('AosAdvertisementController', app);

require('./quarantine');
},{"./AOS-advertisement-controller":22,"./activity-controller":23,"./animation-slidedown-controller":24,"./animation-slidein-controller":25,"./antivirus-controller":26,"./feedback-controller":27,"./quarantine":30,"./quarantine-controller":29,"./settings-controller":34,"./status-controller":35}],29:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var controller = function (
        $rootScope,
        $scope,
        $timeout,
        $filter,
        $window,
        WebsiteLinksService,
        LoggingService,
        translator,
        AppStatusService,
        QuarantineService,
        MenuBarService) {
        MenuBarService.setCurrentView('quarantine');
        $scope.config = {
            axis: 'y', // enable 2 axis scrollbars by default 
            callbacks: {
            }
        };
        $scope.QuarantineService = QuarantineService;
        $scope.menu = {
            isRescan: false,
            isRestore: false,
            isDelete: false
        };

        $scope.message = "Quarantine View";
        $scope.triggerAction = triggerAction;
        $scope.sortBy = sortBy;
        $scope.getThreat = getThreat;
        $scope.getDate = getDate;
        $scope.getThreadName = getThreadName;
        $scope.getFilesInQuarantineText = getFilesInQuarantineText;
        $scope.hasVirusDefinitionEntry = hasVirusDefinitionEntry;
        $scope.getMoreInformationText = getMoreInformationText;
        $scope.openVirusDefinitionDatabase = openVirusDefinitionDatabase;
        $scope.isSelectAllClicked = false;
        $scope.getSourceFilepathShort = getSourceFilepathShort;
        $scope.getSourceFilepath = getSourceFilepath;
        $scope.isLoading = $scope.QuarantineService.isLoading();
        $scope.items = $scope.QuarantineService.getQuarantineItems();
        areActionsAvailable();
        $scope.getItemRowStyle = getItemRowStyle;
        $scope.$on('quarantineListChanged', function () {
            $scope.items = $scope.QuarantineService.getQuarantineItems();
            areActionsAvailable();
        });

        $scope.sortByPropertyName = $scope.QuarantineService.getSortByProperyName();
        $scope.sortIsAscending = $scope.QuarantineService.getSortIsAscending();

        $scope.$on('quarantineSortByProperyNameChanged', function () {
            $scope.sortByPropertyName = $scope.QuarantineService.getSortByProperyName();
            $scope.sortIsAscending = $scope.QuarantineService.getSortIsAscending();
        });


        $scope.$on('$destroy', function () {
            $timeout(function () { $scope.updateScrollbar('destroy', 0); });
        });
        
        $scope.$on('quarantineItemsLoaderStatusChanged', function () {
            $scope.isLoading = $scope.QuarantineService.isLoading();
        });

        function getSourceFilepath(item) {
            var sourcePath = item.source_filepath;
            if (sourcePath &&
                (sourcePath.indexOf('\\\\?\\') === 0 || sourcePath.indexOf('\\\\.\\') === 0)) {
                sourcePath = sourcePath.slice(4, sourcePath.length);
            }

            return sourcePath;
        }

        function getSourceFilepathShort(item) {
            var sourcePath = getSourceFilepath(item);

            if (sourcePath && sourcePath.length > 32) {
                return sourcePath.slice(0, 10) + '...' +
                    sourcePath.slice(sourcePath.length - 22, sourcePath.length);
            }
            else {
                return sourcePath;
            }
        }

        function getMoreInformationText(item) {
            return translator.getString("quarantineController.text.getMoreInformation",
                null,
                { infection_name: item.infection_name });
        }

        $scope.$on('quarantineSelectAllChanged', function () {
            areActionsAvailable();
        });

        $scope.$on('quarantineSelectItemChanged', function () {
            areActionsAvailable();
        });

        function areActionsAvailable() {
            $scope.menu.isRescan = $scope.QuarantineService.areActionsAvailable();
            $scope.menu.isRestore = $scope.QuarantineService.areActionsAvailable();
            $scope.menu.isDelete = $scope.QuarantineService.areActionsAvailable();
        }

        function openVirusDefinitionDatabase(item) {
            var link = WebsiteLinksService.getVirusLink(item.infection_name);
            $window.open(link);
        }

        function getItemRowStyle(item) {
            var isSelected = QuarantineService.isSelectedItem(item.id);
            return { 'row-selected': isSelected };
        }
         
        function triggerAction(key) {
            var params = $scope.QuarantineService.getActionData(key);

            if (key === 'isRestore') {
                $scope.QuarantineService.showQuarantineQuestionOverlay(params);
            }
            else if (key === 'isRescan') {
                $scope.QuarantineService.rescanItems(params);
            }
            else if (key === 'isDelete') {
                $scope.QuarantineService.showQuarantineQuestionOverlay(params);
            }
        }

        function getDate(item) {
            if (item && item.date) {
                var localTime = moment(item.date).local();
                return localTime.format(translator.getString("dateWithTime", "time-format"));
            }
            return "";
        }

        function getThreat(item) {
            if (item.type === 'URL') {
                if (item.restored) {
                    return { icon: "icon_menu-restored", text: translator.getString("quarantineController.text.restoredUrl") };
                }

                if (item.clean) {
                    return { icon: "icon_menu-cleaned", text: translator.getString("quarantineController.text.cleanUrl") };
                }

                return { icon: "icon_menu-infected", text: translator.getString("quarantineController.text.infectedUrl") };
            }
            else if (item.type === 'MAIL') {
                if (item.restored) {
                    return { icon: "icon_menu-restored", text: translator.getString("quarantineController.text.restoredMail") };
                }

                if (item.clean) {
                    return { icon: "icon_menu-cleaned", text: translator.getString("quarantineController.text.cleanMail") };
                }

                return { icon: "icon_menu-infected", text: translator.getString("quarantineController.text.infectedMail") };
            }

            // item.type === 'FILE'
            if (item.restored) {
                return { icon: "icon_menu-restored", text: translator.getString("quarantineController.text.restoredFile") };
            }

            if (item.clean) {
                return { icon: "icon_menu-cleaned", text: translator.getString("quarantineController.text.cleanFile") };
            }

            if (item.infection_name === "" ||
                item.infection_name === "Suspicious file" ||
                item.infection_name === "SUSPICIOUS_FILE") {
                return { icon: "icon_menu-suspicious", text: translator.getString("quarantineController.text.suspiciousFile") };
            }

            return { icon: "icon_menu-infected", text: translator.getString("quarantineController.text.infectedFile") };

        }


        function sortBy(sortByPropertyName) {
            $timeout(function () {
                $scope.QuarantineService.changeOrderClicked(sortByPropertyName);
            });
        }

        function getFilesInQuarantineText() {
            var quarantine = QuarantineService.getTotalItemCount();

            if (quarantine > 0) {
                return translator.getPlural(
                    quarantine, "quarantineController.text.countOfFilesInQuarantine",
                    null, { quarantine: quarantine });
            } else {
                return translator.getString("quarantineController.text.quarantineIsEmpty");
            }
        }

        function getThreadName(item) {
            if (item.restored) {
                return translator.getString("quarantineController.text.threadNameRestored");
            }
            else if (item.clean) {
                return translator.getString("quarantineController.text.threadNameClean");
            }
            else if (item.infection_name === "" ||
                item.infection_name === "Suspicious file" ||
                item.infection_name === "SUSPICIOUS_FILE") {
                return translator.getString("quarantineController.text.suspiciousFile");
            }

            return item.infection_name;
        }

        function hasVirusDefinitionEntry(item) {
            if (item.restored ||
                item.clean ||
                !item ||
                !item.infection_name ||
                item.infection_name.length <= 0 ||
                item.infection_name === "Suspicious file" ||
                item.infection_name === "SUSPICIOUS_FILE") {
                return false;
            }

            return true;
        }

    };
    controller.$inject = ["$rootScope", "$scope", "$timeout", "$filter", "$window", "WebsiteLinksService", "LoggingService", "translator", "AppStatusService", "QuarantineService", "MenuBarService"];

    return app.controller(name, controller);
};
},{}],30:[function(require,module,exports){
var app = angular.module('AntivirusApp');
require('./quarantine-checkbox-controller')('QuarantineCheckboxController', app);
require('./quarantine-selectall-checkbox-controller')('QuarantineSelectAllCheckboxController', app);
require('./quarantine-whitelist-checkbox-controller')('QuarantineWhitelistCheckboxController', app);

},{"./quarantine-checkbox-controller":31,"./quarantine-selectall-checkbox-controller":32,"./quarantine-whitelist-checkbox-controller":33}],31:[function(require,module,exports){
module.exports = function (name, app) {
    /**@ngInject*/
    controller.$inject = ["$rootScope", "$scope", "LoggingService", "IeInformationService", "QuarantineService"];
    function controller($rootScope, $scope, LoggingService, IeInformationService, QuarantineService) {
        $scope.getCheckboxStyle = getCheckboxStyle;
        $scope.getIDText = getIDText;
        $scope.selectItem = selectItem;
        $scope.getIsSelected = getIsSelected;
        $scope.getCheckboxIconStyle = getCheckboxIconStyle;
        
        function selectItem() {
            QuarantineService.selectClicked($scope.item.id, !getIsSelected());
        }
        
        function getIsSelected() {
            return QuarantineService.isSelectedItem($scope.item.id);
        }

        function getCheckboxStyle() {
            var isSelected = getIsSelected();
            if (isSelected) {
                if (IeInformationService.IsIE() === false) {
                    return "quarantine-checkboxBox-checked-noIE";
                }

                return "quarantine-checkboxBox-checked";
            }

            if (IeInformationService.IsIE() === false) {
                return "quarantine-checkboxBox-noIE";
            }
            return "quarantine-checkboxBox";
        }

        function getCheckboxIconStyle() {
            if (IeInformationService.IsIE() === false) {
                return "quarantine-checkboxBoxIcon-noIE";
            }

            return "quarantine-checkboxBoxIcon";
        }

        function getIDText() {
            if ($scope.item && $scope.item.id) {
                return "quarantine-item-checkbox-" + $scope.item.id;
            }

            return '-';
        }
    }
    
    return app.controller(name, controller);
};
},{}],32:[function(require,module,exports){
module.exports = function (name, app) {
    /**@ngInject*/
    controller.$inject = ["$scope", "LoggingService", "$timeout", "QuarantineService"];
    function controller($scope, LoggingService, $timeout, QuarantineService) {
        $scope.getCheckboxStyle = getCheckboxStyle;
        $scope.selectAll = selectAll;
        $scope.QuarantineService = QuarantineService;
        
        function selectAll() {
            $timeout(function () {
                QuarantineService.selectAllClicked();
            });
        }

        $scope.$on('quarantineSelectAllChanged', function () {
            $scope.selected = QuarantineService.getIsSelectAllShown();
        });
        
        function getCheckboxStyle() {
            if ($scope.selected) {
                return "quarantine-selectall-checkboxBox-checked";
            }

            return "quarantine-selectall-checkboxBox";
        }

        $scope.selected = QuarantineService.getIsSelectAllShown();
    }
    
    return app.controller(name, controller);
};
},{}],33:[function(require,module,exports){
module.exports = function (name, app) {
    /**@ngInject*/
    controller.$inject = ["$rootScope", "$scope"];
    function controller($rootScope, $scope) {
        $scope.getCheckboxStyle = getCheckboxStyle;
        $scope.onClick = onClick;

        function onClick() {
            $scope.selected = !$scope.selected;
        }

        function getCheckboxStyle() {
            if ($scope.selected) {
                return "quarantine-whitelist-checkboxBox-checked";
            }

            return "quarantine-whitelist-checkboxBox";
        }
    }
    
    return app.controller(name, controller);
};
},{}],34:[function(require,module,exports){
module.exports = function (name, app) {
	
    /**@ngInject*/
    var controller = function ($scope, MixPanelService, OpenProcessService, EventTrackingNamesService) {
        
        $scope.settingsButtonClick = function () {
            MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, {
                Command: "Settings",
                Category: 'Settings'
            });
            
            OpenProcessService.openConfigCenter($scope.arguments ? $scope.arguments : "");
        };

        $scope.getClass = function () {
            if ($scope.location === "menubar") {
                return "settings__menubar";
            }
            else if ($scope.location === "modulesPage") {
                return "settings__modulesPage";
            }

            return "";
        };
    };
    controller.$inject = ["$scope", "MixPanelService", "OpenProcessService", "EventTrackingNamesService"];

    return app.controller(name, controller);
};
},{}],35:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var status = function (
        $http,
        $sce,
        $scope,
        LoggingService,
        EventTrackingNamesService,
        MixPanelService,
        translator,
        AppStatusService,
        CommonService,
        MenuBarService,
        SchedulerJobService,
        ConfigurationService) {

        $scope.ConfigurationService = ConfigurationService;
        $scope.CommonService = CommonService;
        $scope.MenuBarService = MenuBarService;
        $scope.moduleEntriesFiltered = [];

        $scope.maximumNumbersOfModules = 4;

        $scope.AppStatusService = AppStatusService;
        $scope.message = "Status View";
        $scope.isPaidProduct = $scope.AppStatusService.isPaidProduct;
        $scope.modulesCallback = modulesCallback;
        $scope.lastScanText = lastScanText;
        $scope.startQuickScan = SchedulerJobService.startQuickScan;
        $scope.MenuBarService.setCurrentView('status');
        $scope.trackAdvertisementLoadingFailedEvent = trackAdvertisementLoadingFailedEvent;
        $scope.trackStatisticsLoadingFailedEvent = trackStatisticsLoadingFailedEvent;
        $scope.getStatusOfModule = getStatusOfModule;
        
        function getStatusOfModule(module) {            
            if (module.isNotInstalledCallback) {
                if (module.isNotInstalledCallback()) {
                    return "not_installed";
                }
            }

            if (module.isDisabledCallback) {
                if (module.isDisabledCallback()) {
                    return "disabled";
                }
            }

            if (module.isEnabledCallback) {
                return module.isEnabledCallback() ? "enabled" : "snoozed";
            }
            
            return "disabled";
        }

        function getModuleEntriesFiltered() {
            var moduleEntriesFiltered = [];
            var max;
            if ($scope.moduleEntries.length <= $scope.maximumNumbersOfModules) {
                max = $scope.moduleEntries.length;
            } else {
                max = $scope.maximumNumbersOfModules;
            }

            for (var i = 0; i < max; i++) {
                moduleEntriesFiltered.push($scope.moduleEntries[i]);
            }

            return moduleEntriesFiltered;
        }

        function ReloadModuleEntries() {
            $scope.moduleEntries = getModuleEntries();
            $scope.moduleEntriesFiltered = getModuleEntriesFiltered();
        }

        function getModuleEntries() {
            var menubar = $scope.MenuBarService.getMenu();

            if (!menubar) {
                return null;
            }

            for (var i = 0; i < menubar.length; i++) {
                var moduleEntries = [];
                if (menubar[i].key === "modules") {
                    for (var i1 = 0; i1 < menubar[i].subMenu.length; i1++) {
                        if (!menubar[i].subMenu[i1].isFeatureAvailableCallback || menubar[i].subMenu[i1].isFeatureAvailableCallback() === false) {
                            continue;
                        }

                        moduleEntries.push(menubar[i].subMenu[i1]);
                    }

                    return moduleEntries;
                }
            }

            return null;
        }

        function numberOfAdditionalModules() {
            if (!$scope.moduleEntries) {
                return 0;
            }

            var menubarModulesElements = $scope.moduleEntries.length;
            return menubarModulesElements - $scope.moduleEntriesFiltered.length;
        }

        function lastScanText() {         
            var neverPerformedText = translator.getString("statusController.text.scanNeverPerformed");

            if (!$scope.AppStatusService.last_scan.date||
                $scope.AppStatusService.last_scan.date === "") {
                return neverPerformedText;
            }

            var utcLastScan = moment($scope.AppStatusService.last_scan.date);
            if (utcLastScan.isValid() === false) {
                return neverPerformedText;
            }

            var localLastScan = moment(utcLastScan).local();

            if (localLastScan.isValid() === false || localLastScan.year() <= 1970) {
                return neverPerformedText;
            }

            var daysDiff = dateDiffInDays(utcLastScan, moment().utc());
            
            if (daysDiff > 0) {
                return translator.getPlural(daysDiff, "statusController.text.lastScan",
                    null, { days: daysDiff });
            }
            else {
                var hours = localLastScan.hours();
                var minutes = localLastScan.minutes();

                if (hours < 10) {
                    hours = "0" + hours;
                }

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }

                return translator.getString("statusController.text.lastScanToday", null,
                    { time:  hours + ":" + minutes });
            }
        }

        function dateDiffInDays(a, b) {
            var _S_PER_DAY = 60 * 60 * 24;
            var unix1 = moment(a).utc().unix();
            var unix2 = moment(b).utc().unix();
            
            var diff = Math.floor((unix2 - unix1) / _S_PER_DAY);
            
            if (diff === 0 && a.day() !== b.day()) {
                diff++;
            }

            return diff;
        }

        function trackAdvertisementLoadingFailedEvent(response) {
            MixPanelService.TrackEvent(EventTrackingNamesService.LoadAdvertisementFailed, {
                StatusCode: response.status,
                StatusText: response.statusText
            });
        }

        function trackStatisticsLoadingFailedEvent(response) {
            MixPanelService.TrackEvent(EventTrackingNamesService.LoadStatisticsFailed, {
                StatusCode: response.status,
                StatusText: response.statusText
            });
        }
                
        function modulesCallback(module) {
            MenuBarService.openMenu("modules", module);
        }

        $scope.$on('appStatusChanged', function(event, data) {
            if (data.attributes.section === 'about') {
                ReloadModuleEntries();
            }
        });

        ReloadModuleEntries();
    };
    status.$inject = ["$http", "$sce", "$scope", "LoggingService", "EventTrackingNamesService", "MixPanelService", "translator", "AppStatusService", "CommonService", "MenuBarService", "SchedulerJobService", "ConfigurationService"];

    return app.controller(name, status);
};
},{}],36:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {

        return {
            templateUrl: 'views/directives/AOS-advertisement.html',
            scope: {
            },
            controller: 'AosAdvertisementController'
        };
    };

    return app.directive(name, directive);
};
},{}],37:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/activity/activity-checkbox.html',
            scope: {
                item: '=item',
                showIcon: '=showIcon',
                iconStyle: '@iconStyle',
                idPrefix: '@idPrefix'
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope) {
        $scope.getCheckboxStyle = getCheckboxStyle;
        $scope.moveText = moveText;
        $scope.getIDText = getIDText;

        function getCheckboxStyle() {
            if ($scope.item && ($scope.item.isFilterActive || $scope.item.isSelected))
            {
                return "activity-checkboxBox-checked";
            }
            else if ($scope.item === true)
            {
                return "activity-checkboxBox-checked";
            }

            return "activity-checkboxBox";
        }

        function moveText() {
            if ($scope.showIcon) {
                return "activity-checkboxLabelWithIcon";
            }

            return "";
        }

        function getIDText()
        {
            if ($scope.item && $scope.item.name)
            {
                return $scope.idPrefix + $scope.item.name;
            }

            return '-';
        }
    }


    return app.directive(name, directive);
}
;
},{}],38:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope", "ActivityService", "CommonService", "translator"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/activity/activity-entry.html',
            scope: {
                activity: "=activity"
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, ActivityService, CommonService, translator) {

        $scope.ActivityService = ActivityService;
        $scope.getAnimationStyle = getAnimationStyle;
        $scope.getMessage = getMessage;
        $scope.toggleMessage = toggleMessage;
        $scope.getSeverityName = getSeverityName;
        $scope.getModuleName = getModuleName;
        $scope.isUpdateSuccessMessage = isUpdateSuccessMessage;
        $scope.showMessage = showMessage;
        $scope.getRightInfo = getRightInfo;
        $scope.isMessage = false;
        
        function isUpdateSuccessMessage() {
            if ($scope.activity.module_id === 3) {
                if ($scope.activity.message_id === 263 || $scope.activity.message_id === 264) {
                    return true;
                }
            }
            return false;
        }

        function getRightInfo() {
            var localTime = moment($scope.activity.date).local();
            return localTime.format(translator.getString("dateWithTime", "time-format"));
        }

        function toggleMessage() {
            $scope.isMessage = !$scope.isMessage;
        }

        function getSeverityName() {
            return $scope.ActivityService.getSeverityName($scope.activity.type_id);
        }

        function getModuleName() {
            return $scope.ActivityService.getModuleName($scope.activity.module_id);
        }

        function showMessage() {
            return $scope.isMessage;
        }
        
        function getMessage() {
            if ($scope.isMessage === true) {
                var message = $scope.activity.message || translator.getString("activityEntry.text.notMoreInformationAvailable");
                return message.replace(/\.\r\n/g, ". ").replace(/:\r\n/g, ": ").replace(/'\r\n/g, "' ").replace(/"\r\n/g, "' ").replace(/\r\n/g, ", ");
            }
        }

        function getAnimationStyle() {
            return 'slide-down';
        }        
    }

    return app.directive(name, directive);
};
},{}],39:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope", "translator", "CommonService"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/activity/activity-header.html',
            scope: {
                date: '@date'
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, translator, CommonService) {        
        var today = moment().local().format("YYYY-MM-DD");
        var yesterday = moment().local().subtract(1, 'days').format("YYYY-MM-DD");
        if ($scope.date === today) {
            $scope.dateFormatted = translator.getString("activityHeader.button.today");
        }
        else if ($scope.date === yesterday) {
            $scope.dateFormatted = translator.getString("activityHeader.button.yesterday");
        }
        else {
            $scope.dateFormatted = moment($scope.date, moment.ISO_8601).local().format(translator.getString("dateWithoutTime", "time-format"));
        }
    }

    return app.directive(name, directive);
};
},{}],40:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/activity/activity-list-button.html',
            scope: {
                text: '@text',
                callback:'&'
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller() {
    }

    return app.directive(name, directive);
}
;
},{}],41:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope", "$timeout", "ActivityService"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/activity/activity-list.html',
            scope: {
                date: '@date',
                dates: '=dates'
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, $timeout, ActivityService) {
        $scope.switchOpenState = switchOpenState;
        $scope.ActivityService = ActivityService;
        $scope.activities = $scope.ActivityService.getActivities($scope.date);
        
        var today = moment().local().format("YYYY-MM-DD");
        var yesterday = moment().local().subtract(1, 'days').format("YYYY-MM-DD");

        $scope.isOpened = false;
        if ($scope.date === today || $scope.date === yesterday) {
            $scope.isOpened = true;
        }

        $scope.isClosed = ($scope.isOpened) ? false : true;

        $scope.$on('activitiesListChanged',
            function () {
                $scope.activities = $scope.ActivityService.getActivities($scope.date);
            });

        function switchOpenState() {
            $scope.isClosed = !$scope.isClosed;
        }
    }

    return app.directive(name, directive);
}
;
},{}],42:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/activity/activity-update-success.html',
            scope: {
                productVersion: "@productVersion",
                vdfVersion: "@vdfVersion"
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller() {
    }

    return app.directive(name, directive);
};
},{}],43:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./activity-entry')('activityEntry', app);
require('./activity-header')('activityHeader', app);
require('./activity-list')('activityList', app);
require('./activity-update-success')('activityUpdateSuccess', app);
require('./activity-list-button')('activityListButton', app);
require('./activity-checkbox')('activityCheckbox', app);


},{"./activity-checkbox":37,"./activity-entry":38,"./activity-header":39,"./activity-list":41,"./activity-list-button":40,"./activity-update-success":42}],44:[function(require,module,exports){
module.exports = function (name, app) {

    var directive = function () {
        controller.$inject = ["$rootScope", "$scope", "$timeout", "$window", "$document", "translator", "AppStatusService", "LoggingService", "WebsiteLinksService", "OESettingsService", "EventTrackingNamesService", "MixPanelService", "Tools", "appRoutes"];
        return {
            templateUrl: 'views/directives/app-container.html',
            scope: {},
            controller: controller
        }; 

        /**@ngInject*/
        function controller($rootScope, $scope, $timeout, $window, $document, translator, AppStatusService, LoggingService, WebsiteLinksService, OESettingsService, EventTrackingNamesService, MixPanelService, Tools, appRoutes) {
            // empty
            $scope.upgradeClickCallback = upgradeClickCallback;
            $scope.openInfo = openInfo;
            $scope.showInfoMenu = false;
            $scope.closeInfoMenu = closeInfoMenu;
            $scope.MixPanelService = MixPanelService;
            $scope.isAntivirusDefaultView = false;
            $scope.isSpotlightUser = false;
            $scope.getUserLoggedInNoNameText = getUserLoggedInNoNameText;
            $scope.upgradeButtonText = upgradeButtonText;
            $scope.getAnonymousUserText = getAnonymousUserText;

            OESettingsService.isAntivirusDefaultView(function (isDefaultView) {
                if(isDefaultView === true){
                    Tools.RegisterOnGuiClosedCallback(function () {
                         appRoutes.gotoDefaultRoute();
                         $window.location.reload(true);
					          });
                }

                $scope.isAntivirusDefaultView = isDefaultView;
            });


            $rootScope.$on('appStatusChanged', function (event, data) {
                if (data.attributes.section === 'app_state') {
                    LoggingService.Debug("App-statuses changed stop waiting for event");
                    $scope.isSpotlightUser = data.attributes.custom_value.is_spotlight_user;
                }
            });

            $scope.antivirusButtonEvent = EventTrackingNamesService.ButtonClick;

            $document.on('click', clickHandler);

            $document.on('mousedown', mouseDown);
            $scope.mouseUpEvent = {};
            $scope.moveDownEvent = {};

            function getUserLoggedInNoNameText() {
                return translator.getString("header.registeredUserNoName", "header");
            }
            function getAnonymousUserText() {
                return translator.getString("header.register", "header");
            }
            function upgradeButtonText() {
                if (AppStatusService.needToRenewLicense()) {
                    var string = AppStatusService.isServerOS() ? "header.server.renew" : "header.pro.renew";
                    return translator.getString(string, "header");
                }

                if (AppStatusService.isServerOS()) {
                    return translator.getString("header.server.upgrade", "header");
                }
                return translator.getString("header.pro.upgrade", "header");
            }

            function mouseDown(event) {
                $scope.moveDownEvent = event;
            }
            
            function clickHandler(event) {
                try {
                    if (event.type === "click") {
                        $scope.mouseUpEvent = event;
                        $scope.moveDownEvent = null;
                        if ($scope.moveDownEvent &&
                            $scope.moveDownEvent.clientX &&
                            $scope.mouseUpEvent &&
                            $scope.mouseUpEvent.clientX) {
                            if ($scope.moveDownEvent.clientX + 3 < $scope.mouseUpEvent.clientX ||
                                $scope.moveDownEvent.clientX - 3 > $scope.mouseUpEvent.clientX) {
                                event.stopPropagation();
                                return;
                            }
                        }

                        if ($scope.moveDownEvent &&
                            $scope.moveDownEvent.clientY &&
                            $scope.mouseUpEvent &&
                            $scope.mouseUpEvent.clientY) {
                            if ($scope.moveDownEvent.clientY + 3 < $scope.mouseUpEvent.clientY ||
                                $scope.moveDownEvent.clientY - 3 > $scope.mouseUpEvent.clientY) {
                                event.stopPropagation();
                                return;
                            }
                        }
                    }

                    if ($scope.showInfoMenu) {

                        var closestTarget = $(event.target).closest('div');
                        if (closestTarget && closestTarget.length > 0) {
                            if (closestTarget[0].id.indexOf('info-menu') === -1 &&
                                closestTarget[0].className.indexOf('header__controls__info') === -1) {
                                $scope.closeInfoMenu();
                            }
                        }
                    }

                    $scope.$broadcast("aviraSecureClickEvent", event);
                } catch (e) {
                    LoggingService.Error("Exception: " + e);
                    throw e;
                } 
            }

            $scope.$on('headerMoved', function (value, event) {
                clickHandler(event);
            });

            $scope.$on('headerClicked', function (value, event) {
                clickHandler(event);
            });

            
            function closeInfoMenu() {
                $timeout(function () {
                    $scope.showInfoMenu = false;
                });
            }

            function openInfo() {
                MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, { Command: 'Info', Category: 'Header' });
                $scope.showInfoMenu = !$scope.showInfoMenu;
            }

            function upgradeClickCallback() {
                var url = '';
                var category = '';

                if (AppStatusService.needToRenewLicense()) {
                    url = WebsiteLinksService.getRenew();
                    category = 'Renew';
                }
                else {
                    url = WebsiteLinksService.getUpgrade();
                    category = 'Upgrade';
                }

                MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, { Command: 'Header', Category: category, Url: url });

                $window.open(url);
            }
        }
    };

    return app.directive(name, directive);
};
},{}],45:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function (LoggingService) {
        return {
            restrict: 'A',
            scope: {
                linkId:'@linkId',
                textCallback: '=textCallback',
                clickCallback: '&clickCallback'
            },
            link: function ($scope, $element) {

                var origElement = $element.html();

                $scope.$watch('textCallback', function () {
 
                    $element.empty();
                    $element.append(origElement);
                    $element.append($scope.textCallback);
                    
                    var hrefElement = $element.find('a');
                    
                    if (hrefElement === null) {
                        LoggingService.Error("Can't find <a> element in provided expression!");
                        return;
                    }

                    hrefElement.attr('id', $scope.linkId);

                    hrefElement.bind('click', function (e) {
                        $scope.clickCallback();
                        e.preventDefault();
                    });
                });
            }
        };
    };

    return app.directive(name, directive);
};
},{}],46:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/feedback.html',
            scope: {
                marker: "@"
            },
            controller: 'FeedbackController'
        };
    };

    return app.directive(name, directive);
};
},{}],47:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./app-container')('appContainer', app);
require('./feedback')('feedback', app);
require('./settings')('settings', app);
require('./statusbar')('statusbar', app);
require('./radial-progress')('radialProgress', app);
//require('./default-advertisement')('defaultAdvertisement', app);
require('./AOS-advertisement')('aosAdvertisement', app);
require('./loading-progress')('loadingProgress', app);
require('./info-menu')('infoMenu', app);
require('./ext-link')('extLink', app);
require('./placeholder-legacy')('placeholderLegacy', app);

require('./validation');
require('./menubar');
require('./modules');
require('./activity');
require('./quarantine');
require('./scan');
require('./overlay');

},{"./AOS-advertisement":36,"./activity":43,"./app-container":44,"./ext-link":45,"./feedback":46,"./info-menu":48,"./loading-progress":49,"./menubar":51,"./modules":56,"./overlay":63,"./placeholder-legacy":66,"./quarantine":67,"./radial-progress":76,"./scan":80,"./settings":99,"./statusbar":100,"./validation":101}],48:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$document", "$window", "CommonService", "translator", "LoggingService", "AppStatusService", "WebsiteLinksService", "AboutModalOverlayService", "OpenProcessService"];
    var directive = function () {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/info-menu.html',
            scope: {},
            controller: controller,
            link: link
        };
    };

    /**@ngInject*/
    function controller(
        $scope,
        $document,
        $window,
        CommonService,
        translator,
        LoggingService,
        AppStatusService,
        WebsiteLinksService,
        AboutModalOverlayService,
        OpenProcessService) {
        $scope.helpMenuClicked = helpMenuClicked;
        $scope.aboutMenuClicked = aboutMenuClicked;
        $scope.getAboutText = getAboutText;
        $scope.licenseManagementClicked = licenseManagementClicked;
        $scope.CommonService = CommonService;
        $scope.genericProductName = $scope.CommonService.getGenericProductName();
        $scope.brandName = $scope.CommonService.getBrandName();
        $scope.AppStatusService = AppStatusService;
        $scope.product_id = $scope.AppStatusService.about.product_id;
        $scope.license_type = $scope.AppStatusService.about.license_type;
        $scope.factBuyArgs = "/BUY /TRIGGER=SECURITYCENTER_LICENSEMANAGEMENT";
        $scope.factRenewArgs = "/RENEW /TRIGGER=SECURITYCENTER_LICENSEMANAGEMENT";
        function helpMenuClicked() {
            $window.open(WebsiteLinksService.getSupport());
        }

        function aboutMenuClicked() {
            AboutModalOverlayService.show();
        }

        function licenseManagementClicked() {
            var isB2BLicense = AppStatusService.isB2bLicense();
            if (false === isB2BLicense) {
                executeAboutLicenseConnect();
            }
            else {
                executeAboutLicenseB2B();
            }
        }

        function executeAboutLicenseB2B() {
            var args = "";
            if (AppStatusService.needToRenewLicense()) {
                args = $scope.factRenewArgs;
            } else {
                if ($scope.product_id === 150 || $scope.product_id === 210) {
                    if ($scope.license_type === "eval" || $scope.license_type === "invalid") {
                        args = $scope.factBuyArgs;
                    }
                    else {
                        args = $scope.factRenewArgs;
                    }
                }
                else {
                    args = $scope.factBuyArgs;
                }
            }

            OpenProcessService.run("%INSTALLDIR%\\fact.exe", args);
        }

        function executeAboutLicenseConnect() {
            $window.open('aoe://openDashboardUrl?section=dashboard&lightbox=/dashboard/subscriptions/tabs/otc&source=antivirus');
        }


        function getAboutText() {
            return translator.getString("infoMenu.text.about", null,
                { brandName: $scope.brandName, genericProductName: $scope.genericProductName });
        }


        $scope.$on('appStatusChanged', function (event, data) {
            if (data.attributes.section === 'about') {
                $scope.genericProductName = $scope.CommonService.getGenericProductName();
                $scope.brandName = $scope.CommonService.getBrandName();
                $scope.product_id = $scope.AppStatusService.about.product_id;
                $scope.license_type = $scope.AppStatusService.about.license_type;
            }
        });
    }

    /**@ngInject*/
    function link() {
        // empty
    }

    return app.directive(name, directive);
};
},{}],49:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope"];
    var directive = function () {

        return {
            // transclude: true,
            templateUrl: 'views/directives/loading-progress.html',
            scope: {
                onComplete: '&onComplete',
                color: '@color',
                top: '@top',
                left: '@left'
            },
            controller: controller,
            link: spinCircle
        };
    };

    /**@ngInject*/
    function controller($scope) {
        if (!$scope.color) {
            $scope.color = "#98A3A8";
        }

        if (!$scope.top) {
            $scope.top = '50%';
        }

        if (!$scope.left) {
            $scope.left = '50%';
        }
        var step = 0;
        $scope.animationComplete = animationComplete;
        function animationComplete() {
            $scope.onComplete({ step: ++step });
        }
    }

    function spinCircle(scope, element) {
        var opts = {
            lines: 17, // The number of lines to draw
            length: 0, // The length of each line
            width: 12, // The line thickness
            radius: 20, // The radius of the inner circle
            scale: 0.50, // Scales overall size of the spinner
            corners: 0.6, // Corner roundness (0..1)
            color: scope.color, // #rgb or #rrggbb or array of colors
            opacity: 0, // Opacity of the lines
            rotate: 69, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            speed: 1, // Rounds per second
            trail: 57, // Afterglow percentage
            fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
            zIndex: 20, // The z-index (defaults to 2000000000)
            className: 'spinner', // The CSS class to assign to the spinner
            top: scope.top, // Top position relative to parent
            left: scope.left, // Left position relative to parent
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            position: 'absolute' // Element positioning
        }; 

        var spinner = new window.Spinner(opts).spin();
        $(element).append(spinner.el);
    }

    return app.directive(name, directive);
};
},{}],50:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var directive = function ($compile) {

        /**@ngInject*/
        link.$inject = ["scope", "element"];
        function controller() {
        }

        /**@ngInject*/
        function link(scope, element) {

            compile(scope, element);

            function compile(scope, element) {
                var template = '<div class="{{animationStyle}}" ' +
                    '{{directive}} entry="subMenuEntry" ' +
                    'ng-show="subMenuEntry.isSubMenuOpened && subMenuEntry.key == \'{{key}}\'"> ' +
                    '</div>';

                template = template.replace('{{animationStyle}}', scope.animationStyle)
                    .replace(/{{directive}}/g, scope.directive)
                    .replace(/{{key}}/g, scope.key);
                element.replaceWith($compile(template)(scope));
            }

        }

        return {
            transclude: true,
            restrict: 'AE',
            scope: {
                key: '=key',
                directive: '=directive',
                subMenuEntry: '=subMenuEntry',
                animationStyle: '@animationStyle'

            },
            controller: controller,
            link: link
        };
    };
    directive.$inject = ["$compile"];

    return app.directive(name, directive);
};
},{}],51:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./menu-entry')('menuEntry', app);
require('./menubar')('menubar', app);
require('./submenu-entry-module')('submenuEntryModule', app);
require('./submenu-entry-scan')('submenuEntryScan', app);
require('./create-submenu-entry')('createSubmenuEntry', app);

},{"./create-submenu-entry":50,"./menu-entry":52,"./menubar":53,"./submenu-entry-module":54,"./submenu-entry-scan":55}],52:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "MenuBarService", "appRoutes", "MixPanelService", "EventTrackingNamesService"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/menubar/menu-entry.html',
            scope: {
                entry: '=entry'
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, MenuBarService, appRoutes, MixPanelService, EventTrackingNamesService)
    {
        var categoryName = "Menubar Click";
        $scope.navigate = navigate;
        $scope.MenuBarService = MenuBarService;
        $scope.isCurrentView = isCurrentView;

        function navigate() {
            MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick,
                { Category: categoryName, Command: $scope.entry.key });

            if ($scope.entry.subMenu.length === 0) {
                $scope.MenuBarService.setCurrentView($scope.entry.key);
                $scope.MenuBarService.closeAllMenus();
                appRoutes.gotoRoute($scope.entry.key);
            }
            else {
                $scope.MenuBarService.openMenu($scope.entry.key);
            }
        }

        function isCurrentView() {
            var isViewOpened = $scope.MenuBarService.isViewOpened($scope.entry.key);
            return { 'menubar__tab--selected': isViewOpened || $scope.MenuBarService.isMenuOpened($scope.entry.key) };
        }
    }

    return app.directive(name, directive);
};
},{}],53:[function(require,module,exports){
module.exports = function (name, app) {

    var directive = function () {
        controller.$inject = ["$scope", "$timeout", "$document", "MixPanelService", "AppStatusService", "appRoutes", "LoggingService", "CommonService", "MenuBarService"];
        return {
            templateUrl: 'views/directives/menubar/menubar.html',
            scope: {
            },
            controller: controller
        };

        /**@ngInject*/
        function controller($scope, $timeout, $document, MixPanelService, AppStatusService, appRoutes, LoggingService, CommonService, MenuBarService) {

            $scope.MenuBarService = MenuBarService;
            $scope.guardState = AppStatusService.modules.guard;
            $scope.menuEntries = $scope.MenuBarService.getMenu();
            $scope.isModuleAvailable = isModuleAvailable;

            $scope.getAnimationStyleSubMenuLevel2 = getAnimationStyleSubMenuLevel2;
            $scope.getAnimationStyleSubMenuLevel1 = getAnimationStyleSubMenuLevel1;
            
            $scope.$on('aviraSecureClickEvent',
                function (e, event) {
                    var closest = $(event.srcElement).closest('div');
                    var closestTarget = $(event.target).closest('div');

                    if (closest && closest.length > 0) {
                        if (closest[0].id.indexOf('menubar') === -1
                            && closest[0].id.indexOf('treeview') === -1
                            && closest[0].className.indexOf('mCSB_') === -1
                            && closest[0].className.indexOf('ui-timepicker-wrapper') === -1
                            && closest[0].className.indexOf('header') === -1) {
                            closeSubMenu();
                        }
                    }

                    if (closestTarget && closestTarget.length > 0) {
                        if (closestTarget[0].id.indexOf('menubar') === -1
                            && closestTarget[0].id.indexOf('treeview') === -1
                            && closestTarget[0].className.indexOf('mCSB_') === -1
                            && closestTarget[0].className.indexOf('ui-timepicker-wrapper') === -1
                            && closestTarget[0].className.indexOf('header') === -1) {
                            closeSubMenu();
                        }
                    }
                });

            function closeSubMenu() {
                $timeout(function () {
                    $scope.MenuBarService.closeAllMenus();
                });
            }   
            
            function getAnimationStyleSubMenuLevel1() {
                return 'subMenuLevel1 slide-in';
            }

            function isModuleAvailable(entry) {
                if (!entry.isFeatureAvailableCallback || entry.isFeatureAvailableCallback() === false) {
                    return false;
                }

                return true;
            }
            function getAnimationStyleSubMenuLevel2() {
                return 'subMenuLevel2 slide-in';
            }
        }

    };



    return app.directive(name, directive);
};


},{}],54:[function(require,module,exports){
module.exports = function (name, app) {


    var directive = function () {
        controller.$inject = ["$scope", "$window", "LoggingService", "CommonService", "EventTrackingNamesService", "AppStatusService", "MixPanelService", "appRoutes", "MenuBarService", "IeInformationService"];
        return {
            templateUrl: 'views/directives/menubar/submenu-entry-module.html',
            scope: {
                entry: '=entry',
                parent: '@parent'
            },
            controller: controller
        };

        /**@ngInject*/
        function controller($scope, $window, LoggingService, CommonService, EventTrackingNamesService, AppStatusService, MixPanelService, appRoutes, MenuBarService, IeInformationService) {
            var categoryName = "Submenu Listing Click";
            $scope.navigate = navigate;
            $scope.MenuBarService = MenuBarService;
            $scope.AppStatusService = AppStatusService;
            $scope.isCurrentSubMenu = isCurrentSubMenu;
            $scope.isCurrentSubMenuShown = isCurrentSubMenuShown;
            $scope.showPaidTag = shouldShowPaidTag();
            $scope.paidTag = CommonService.getPaidTag(AppStatusService.isServerOS());
            $scope.getPaidTagTextClass = getPaidTagTextClass;
            $scope.$on('appStatusChanged', function(event, data) {
                if (data.attributes.section === 'about' || data.attributes.section === 'modules') {
                    $scope.showPaidTag = shouldShowPaidTag();
                    $scope.paidTag = CommonService.getPaidTag(AppStatusService.isServerOS());
                }
            });

            if (!IeInformationService.GetIEVersion() || IeInformationService.IsIE10OrHigher()) {
                $scope.nextIcon = "icon_antivirus-back";
            } else {
                $scope.nextIcon = "icon_next_ie8";
            }

            function shouldShowPaidTag() {
                if (!$scope.entry.isFeatureAvailableCallback && $scope.entry.isFeatureAvailableCallback() === false) {
                    return false;
                }

                return $scope.entry.isPaidFeature &&
                    AppStatusService.isPaidProduct() === false &&
                    $scope.entry.isNotInstalledCallback && $scope.entry.isNotInstalledCallback();
            }

            function navigate() {
                MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick,
                    { Category: categoryName, Command: $scope.entry.key });

                $scope.MenuBarService.openMenu($scope.parent, $scope.entry.key);
            }

            function isCurrentSubMenuShown() {
                return $scope.MenuBarService.isSubMenuOpened($scope.parent, $scope.entry.key);
            }

            function isCurrentSubMenu() {
                var isViewOpened = isCurrentSubMenuShown();
                return { 'menubar-sub-menu-entry-listing__tab--selected': isViewOpened };
            }

            function getPaidTagTextClass() {
                if (shouldShowPaidTag()) {
                    return 'menubar-sub-menu-entry-listing__tab-text pro';
                }
                return 'menubar-sub-menu-entry-listing__tab-text';
            }

        }

    };

    return app.directive(name, directive);
};
},{}],55:[function(require,module,exports){
module.exports = function (name, app) {

    var directive = function () {
        controller.$inject = ["$scope", "$window", "MixPanelService", "EventTrackingNamesService", "AppStatusService", "appRoutes", "MenuBarService"];
        return {
            templateUrl: 'views/directives/menubar/submenu-entry-scan.html',
            scope: {
                entry: '=entry',
                parent: '@parent'
            },
            controller: controller
        };

        /**@ngInject*/
        function controller($scope, $window, MixPanelService, EventTrackingNamesService, AppStatusService, appRoutes, MenuBarService) {
            var categoryName = "Submenu Symbol Click";
            $scope.navigate = navigate;
            $scope.MenuBarService = MenuBarService;
            $scope.isCurrentSubMenu = isCurrentSubMenu;

            $scope.isPaidProduct = AppStatusService.isPaidProduct;

            function navigate() {
                MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick,
                    { Category: categoryName, Command: $scope.entry.key });

                $scope.MenuBarService.openMenu($scope.parent, $scope.entry.key);
            }

            function isCurrentSubMenu() {
                var isViewOpened = $scope.MenuBarService.isSubMenuOpened($scope.parent, $scope.entry.key);
                return {'menubar-sub-menu-entry-symbol__tab--selected': isViewOpened};
            }
        }
    };

    return app.directive(name, directive);
};
},{}],56:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./switch-toggler')('switchToggler', app);
require('./modules-subpage')('modulesSubpage', app);
require('./info-box')('infoBox', app);
require('./module-state-button')('moduleStateButton', app);

},{"./info-box":57,"./module-state-button":58,"./modules-subpage":59,"./switch-toggler":60}],57:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "$document", "$window"];
    var directive = function () {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/modules/info-box.html',
            scope: {
                text: '@text',
                title: '@title',
                link: '@link',
                linktext: '@linktext',
                key: '@key'
            },
            controller: controller,
            link: link
        };
    };

    /**@ngInject*/
    function controller($scope, $timeout, $document, $window) {
        $scope.hide = hide;
        $scope.toggle = toggle;
        $scope.getQuestionCircleStyle = getQuestionCircleStyle;
        $scope.showToolTip = false;
        $scope.onAction = onAction;
        
        function getQuestionCircleStyle() {
            return $scope.showToolTip ? 'question-circle-active' : 'question-circle-inactive';
        }

        $scope.$on('aviraSecureClickEvent',
            function (e, event) {
                var closest = $(event.srcElement).closest('div');
                var closestTarget = $(event.target).closest('div');

                if ($scope.showToolTip && closest && closest.length > 0) {
                    if (closestTarget[0].id.indexOf('menubar-module') === -1
                        || closestTarget[0].id.indexOf($scope.key) === -1
                        || closest[0].id.indexOf('menubar-module') === -1
                        || closest[0].id.indexOf($scope.key) === -1) {

                        if (closestTarget[0].id.indexOf("menubar-sub-menu-modules-" + $scope.key) === -1 &&
                            closest[0].id.indexOf("menubar-sub-menu-modules-" + $scope.key) === -1 &&
                            closestTarget[0].id.indexOf("menubar-sub-menu-modules-menu") === -1 &&
                            closest[0].id.indexOf("menubar-sub-menu-modules-menu") === -1 &&
                            closest[0].id !== "menubar") {
                            changeShow(false);
                        }
                    }
                }
            });

        function onAction() {
            $window.open($scope.link);
            hide();
        }

        function changeShow(value) {
            $timeout(function () {
                $scope.showToolTip = value;
            });
        }

        function toggle() {
            changeShow(!$scope.showToolTip);
        }

        function hide() {
            changeShow(false);
        }
    }

    /**@ngInject*/
    function link() {
        // empty
    }

    return app.directive(name, directive);
};
},{}],58:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {

        /**@ngInject*/
        controller.$inject = ["$scope", "$window", "LoggingService", "CommonService", "EventTrackingNamesService", "MixPanelService", "translator", "AppStatusService"];
        function controller($scope, $window, LoggingService, CommonService, EventTrackingNamesService, MixPanelService, translator, AppStatusService) {
            $scope.buttonState = "module-state-indicator__off";
            $scope.onText = translator.getString("moduleStateButton.text.on");
            $scope.offText = translator.getString("moduleStateButton.text.off");
            $scope.OnClick = function () {
                MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick,
                    { Command: $scope.command, Category: $scope.category });

                $scope.callback();
            };

            $scope.getText = function () {
                if ($scope.text) {
                    return $scope.text;
                }

                return $scope.getNameCallback();
            };

            $scope.paidText = CommonService.getPaidTag(AppStatusService.isServerOS());

            $scope.$on('appStatusChanged', function (event, data) {
                if (data.attributes.section === 'about' || data.attributes.section === 'modules') {
                    $scope.paidText = CommonService.getPaidTag(AppStatusService.isServerOS());
                    $scope.setButtonState();
                }
            });

            $scope.AppStatusService = AppStatusService;
            $scope.setButtonState = setButtonState;
            $scope.isPaidProduct = AppStatusService.isPaidProduct;

            $scope.$watch('status', function () {
                $scope.setButtonState();
            });
            

            function setButtonState() {
                if ($scope.status === "enabled") {
                    $scope.buttonText = $scope.onText;
                    $scope.buttonState = "module-state-indicator__on";
                } else if ($scope.status === "not_installed") {
                    if ($scope.isPaidFeature === true && !$scope.isPaidProduct()) {
                        $scope.buttonState = "module-state-indicator__paid";
                        $scope.buttonText = $scope.paidText;
                    } else {
                        $scope.buttonState = "module-state-indicator__notinstalled";
                        $scope.buttonText = $scope.offText;
                    }
                } else {
                    $scope.buttonState = "module-state-indicator__off";
                    $scope.buttonText = $scope.offText;
                }
            }

            $scope.setButtonState();
        }
        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: 'views/directives/modules/module-state-button.html',
            scope: {
                status: '@status',
                isPaidFeature: '=isPaidFeature',
                key: '@key',
                text: '@text',
                buttonIcon: '@buttonicon',
                getNameCallback: '&getNameCallback',
                callback: '&callback',
                hasState: '=hasstate',
                command: '@commandname',
                category: '@category'
            },
            controller: controller
        };
    };

    return app.directive(name, directive);
};
},{}],59:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "$sce", "$window", "MenuBarService", "translator", "CommonService", "WebsiteLinksService", "EventTrackingNamesService", "LoggingService", "AppStatusService", "MixPanelService", "ServiceStatusService", "ConfigurationService", "OpenProcessService", "WindowsServicesService", "AntivirusEndpoints"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/modules/modules-subpage.html',
            scope: {
                entry: '=entry'
            },
            controller: controller,
            link: link
        };
    };

    /**@ngInject*/
    function controller(
        $scope,
        $timeout,
        $sce,
        $window,
        MenuBarService,
        translator,
        CommonService,
        WebsiteLinksService,
        EventTrackingNamesService,
        LoggingService,
        AppStatusService,
        MixPanelService,
        ServiceStatusService,
        ConfigurationService,
        OpenProcessService,
        WindowsServicesService,
        AntivirusEndpoints) {
        $scope.MenuBarService = MenuBarService;
        $scope.AppStatusService = AppStatusService;
        $scope.ServiceStatusService = ServiceStatusService;
        $scope.isProtection = false;
        $scope.isChecked = false;
        $scope.isNotInstalled = isNotInstalled;
        $scope.isNotProtected = isNotProtected;
        $scope.getOnOffText = getOnOffText;
        $scope.getIcon = getIcon;
        $scope.getLeftColSpacing = getLeftColSpacing;
        $scope.onChange = onChange;
        $scope.SetProtection = SetProtection;
        $scope.getToolTipHeadline = getToolTipHeadline;
        $scope.getToolTipText = getToolTipText;
        $scope.getToolTipLinkText = getToolTipLinkText;
        $scope.getToolTipLink = getToolTipLink;
        $scope.isPaidProduct = AppStatusService.isPaidProduct;
        $scope.showAdvertisement = showAdvertisement;
        $scope.openAdvertisement = openAdvertisement;
        $scope.isDisabled = isDisabled;
        $scope.openSettings = openSettings;
        $scope.jackSecondColor = jackSecondColor;
        var nextExecution = null;
        var executionIsProcessing = false;
        var setStatusInProgress = false;
        var refreshAppStateAfterStatusProgress = false;
        getPaidTag();

        function jackSecondColor() {
            if ($scope.isNotInstalled() === true || $scope.isDisabled() === true) {
                return '#7e93a7';
            }

            return '#D90B0B';
        }

        function getPaidTag() {
            $scope.availableInVersionTag = CommonService.getPaidTag(AppStatusService.isServerOS());
            var paidTag = '<span id="menubar-module__advertisement_paid_big_' + $scope.entry.key + '" class="menubar-module__advertisement_paid_big">' + $scope.availableInVersionTag + '</span>';

            var featureIsAvailableInVersionText = translator.getString("modulesSubPage.text.paidFeature", null, { paidTag: paidTag });
            $scope.featureIsAvailableInVersion = '<span class="snoozeText">' + featureIsAvailableInVersionText + '</span>';
        }


        if ($scope.entry.refreshOnEvent !== null) {
            $scope.$on($scope.entry.refreshOnEvent, function (event, data) {
                checkStatusAfterEvent();
            });
        }

        function checkStatusAfterEvent() {
            if (setStatusInProgress == false) {
                SetProtection($scope.entry.isEnabledCallback());
            }
            else {
                refreshAppStateAfterStatusProgress = true;
            }
        }

        $scope.$on('appStatusChanged', function (event, data) {
            if (data.attributes.section === 'modules') {
                checkStatusAfterEvent();
            }
            else if (data.attributes.section === 'about') {
                getPaidTag();
            }
        });

        $scope.$on('changeServiceStatusFailed', function () {
            ChangeStatus();
        });

        function ChangeStatus() {
            SetProtection($scope.entry.isEnabledCallback());
        }

        function openAdvertisement() {
            var url;
            var category;

            if (AppStatusService.needToRenewLicense()) {
                url = WebsiteLinksService.getRenew();
                category = 'Renew';
            }
            else {
                url = WebsiteLinksService.getUpgrade();
                category = 'Upgrade';
            }

            MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick,
                {
                    Command: $scope.entry.key,
                    Category: category,
                    Url: url
                });

            $window.open(url);
        }

        function showAdvertisement() {
            return $scope.entry.isPaidFeature && $scope.isPaidProduct() === false && $scope.isNotInstalled();
        }

        function isNotInstalled() {
            if ($scope.entry.isNotInstalledCallback !== null) {
                return $scope.entry.isNotInstalledCallback();
            }
            else {
                return false;
            }
        }

        function isDisabled() {
            if ($scope.entry.isDisabledCallback !== null) {
                return $scope.entry.isDisabledCallback();
            }
            else {
                return false;
            }
        }

        function openSettings() {
            if (!isDisabled()) {
                return;
            }

            MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, {
                Command: "Settings",
                Category: 'Settings'
            });

            OpenProcessService.openConfigCenter($scope.entry.settingsArguments);
        }

        function isNotProtected() {
            return !$scope.isProtection && !isNotInstalled() && !isDisabled();
        }

        function SetProtection(value) {
            $timeout(function () {
                setStatusInProgress = false;

                if(refreshAppStateAfterStatusProgress)
                {
                    value = $scope.entry.isEnabledCallback();

                    refreshAppStateAfterStatusProgress = false;
                }

                $scope.isProtection = value;
                $scope.isChecked = value;
                $scope.entry.isProtected = value;
                $scope.entry.isInstalled = isNotInstalled() === false;
                $scope.entry.isDisabled = isDisabled();
                executionIsProcessing = false;
            });
        }

        function getIcon(value) {
            if (isNotInstalled()) {
                return $scope.entry.iconNotInstalled;
            }
            else if (isDisabled()) {
                return $scope.entry.iconNotInstalled;
            }
            else if ($scope.entry.hasToggler) {
                if (value) {
                    return $scope.entry.iconEnabled;
                } else {
                    return $scope.entry.iconSnoozed;
                }
            }
            else {
                return $scope.entry.iconEnabled;
            }
        }

        function executeRequest(value) {
            if (executionIsProcessing) {
                return;
            }

            if (nextExecution !== null) {
                $timeout.cancel(nextExecution);
                nextExecution = null;
            }

            nextExecution = $timeout(function () {
                nextExecution = null;
                if ($scope.isProtection !== value) {
                    WindowsServicesService.startService(
                        "antivirservice",
                        value,
                        onChangeCheckPasswordProtection,
                        AntivirusEndpoints.getServiceStatus("antivirus"));
                }
            }, 1500);
        }

        function onChange(value) {
            if (isNotInstalled() || isDisabled() || setStatusInProgress) {
                return;
            }

            executeRequest(value);
        }

        function onChangeCheckPasswordProtection(value, result) {
            if (!result) {
                var oldValue = !value;

                $timeout(function () {
                    SetProtection(oldValue);
                });
                return;
            }

            if ($scope.entry.passwordFeatureName.length > 0 && ($scope.entry.askForPasswordOnEnable === true || value === false)) {
                ConfigurationService.CheckPasswordProtection(
                    $scope.entry.passwordFeatureName,
                    value,
                    onChangeWithoutPwd);
            }
            else {
                onChangeWithoutPwd(value, true);
            }
        }

        function onChangeWithoutPwd(value, result) {
            if (!result) {
                var oldValue = !value;

                $timeout(function () {
                    SetProtection(oldValue);
                });
                return;
            }

            if ($scope.entry.windowsServiceName !== "antivirservice") {
                var endpoint = null;
                switch ($scope.entry.serviceName) {
                    case "firewall":
                        endpoint = AntivirusEndpoints.getFirewallServiceStatus();
                        break;
                    case "guard":
                        endpoint = AntivirusEndpoints.getServiceStatus("antivirus");
                        break;
                    case "webguard":
                        endpoint = AntivirusEndpoints.getServiceStatus("antivirus_webguard");
                        break;
                    case "mailguard":
                        endpoint = AntivirusEndpoints.getServiceStatus("antivirus_mailguard");
                        break;
                    default:
                        LoggingService.Error("Unknown service: " + service);
                        return;
                }

                WindowsServicesService.startService(
                    $scope.entry.windowsServiceName,
                    value,
                    applyServiceStartusChange,
                    endpoint);
            }
            else {
                applyServiceStartusChange(value, result);
            }
        }


        function applyServiceStartusChange(value, result) {
            if (!result) {
                var oldValue = !value;

                $timeout(function () {
                    SetProtection(oldValue);
                });
                return;
            }

            SetProtection(value);

            var state;

            $scope.entry.changeStateCallback(value);
        }

        function getOnOffText() {
            return $scope.isProtection ? translator.getString("moduleStateButton.text.on") :
                translator.getString("modulesSubPage.text.off");
        }


        function getToolTipHeadline() {
            return $scope.entry.toolTipHeading;
        }

        function getToolTipText() {
            return $scope.entry.toolTipText;
        }

        function getToolTipLinkText() {
            return $scope.entry.toolTipLinkText;
        }

        function getToolTipLink() {
            return $scope.entry.toolTipLink;
        }

        function getLeftColSpacing() {
            var isDoubleLine = false;
            if ($scope.entry.togglerLabel) {
                isDoubleLine = $scope.entry.togglerLabel.length >= 21;
            }

            return { 'double-line': isDoubleLine, 'single-line': !isDoubleLine };
        }

    }

    /**@ngInject*/
    function link() {
        // empty
    }

    return app.directive(name, directive);
};
},{}],60:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var directive = function ($compile) {

        /**@ngInject*/
        controller.$inject = ["$scope"];
        link.$inject = ["scope", "element"];
        function controller($scope) {
            $scope.timer = {};
            $scope.$watch('isChecked', function () {
                $scope.setChecked($scope.switcher, $scope.isChecked);
            });

            $scope.$watch('isEnabled', function () {
                $scope.setEnabled($scope.isEnabled);
            });
            
            $scope.$watch('jackSecondColor', function () {
                $scope.setJackSecondColor($scope.jackSecondColor);
            });
        }

        /**@ngInject*/
        function link(scope, element) {
            scope.setChecked = setChecked;
            scope.setEnabled = setEnabled;
            scope.setJackSecondColor = setJackSecondColor;

            compile(scope, element);

            var elems = $('.js-switch.' + scope.marker);
            scope.switcher = createSwitcher(elems[elems.length - 1], scope.isChecked);

            setEnabled(scope.isEnabled);

            function createSwitcher(elem, initial) {
                var switcher = new Switchery(elem, {
                    jackColor: '#43BA49', jackSecondaryColor: '#D90B0B', color: 'white'
                });

                elem.onchange = function () {
                    scope.isChecked = elem.checked;
                    scope.onChange({value: scope.isChecked});
                };

                $(element).on('click', function (event) {
                    if(!scope.isEnabled) {
                        event.stopPropagation();
                        return;
                    }
                });

                setSwitcher(switcher, initial);
                return switcher;
            }

            function setChecked(switcher, value) {
                setSwitcher(switcher, value);
            }

            function setEnabled(value) {
                return value ? scope.switcher.enable() : scope.switcher.disable();
            }

            function setJackSecondColor(jackSecondColor) {
                scope.switcher.options.jackSecondaryColor = jackSecondColor;
                scope.switcher.jack.style.backgroundColor = jackSecondColor;
            }

            function setSwitcher(switcher, value) {
                if((value && !switcher.isChecked()) || (!value && switcher.isChecked())) {
                    switcher.setPosition(true);
                    switcher.handleOnchange(true);
                }
            }

            function compile(scope, element) {
                var template = '<input type="checkbox" id="{{id}}" class="js-switch {{marker}}" {{checked}}/>';
                element.html(template.replace('{{marker}}', scope.marker)
                    .replace('{{id}}', "menubar-module-switcher-container-" + scope.marker)
                    .replace('{{checked}}', scope.isChecked ? 'checked' : ''));

                $compile(element.contents())(scope);
            }

        }

        return {
            transclude: true,
            restrict: 'AE',
            scope: {
                isEnabled: '=isEnabled',
                isChecked: '=isChecked',
                jackSecondColor: '=jackSecondColor',
                onChange: '&onChange',
                marker: '@marker'
            },
            controller: controller,
            link: link
        };
    };
    directive.$inject = ["$compile"];

    Switchery.prototype.colorize = function () {
        this.switcher.style.backgroundColor = this.options.color;
        this.switcher.style.borderColor = '#c0c0c0';
        this.jack.style.backgroundColor = this.options.jackColor;
    };

    Switchery.prototype.setSpeed = function () {
        // empty
    };

    return app.directive(name, directive);
};
},{}],61:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var directive = function () {

        /**@ngInject*/
        controller.$inject = ["$scope", "$window", "translator", "Tools", "MessageBroker", "LoggingService", "CommonService", "AppStatusService", "OverlayService"];
        link.$inject = ["scope", "element"];
        function controller(
            $scope,
            $window,
            translator,
            Tools,
            MessageBroker,
            LoggingService,
            CommonService,
            AppStatusService,
            OverlayService) {
            $scope.isAlreadyShown = false;
            $scope.getProductName = getProductName;
            $scope.AppStatusService = AppStatusService;
            $scope.onClose = onClose;
            $scope.CommonService = CommonService;
            
            $scope.getExpirationDate = getExpirationDate;
            $scope.getLicenseText = getLicenseText;
            $scope.product_id = $scope.AppStatusService.about.product_id;
            $scope.companyName = translator.getString("aboutModalOverlay.text.companyName");

            OverlayService.makeOverlayMoveable();

            $scope.open3rdPartyLicenses = open3rdPartyLicenses;

            function open3rdPartyLicenses() {
                var request = {
                    path: '\/executions',
                    verb: 'POST',
                    host: 'launcherui.' + Tools.GetUserSid()
                };

                var payload = {
                    data: {
                        type: 'executions',
                        attributes: [{
                            serviceidentifier: "antivirus",
                            type: 'executable',
                            value: {
                                path: AppStatusService.about.install_dir + '\\htmlui\\3rdPartyLicenses.html',
                                arguments: "",
                                skipSignatureCheck: 1
                            }
                        }]
                    }
                };

                MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                    if (statusCode && statusCode >= 300) {
                        LoggingService.Warn("Received error response for executions with status code " + statusCode + " and errors: " + errors);
                        return;
                    }
                }, payload);

                return;
            }

            $scope.$on('showAboutOverlay', function () {
                if ($scope.isAlreadyShown === true)
                {
                    return;
                }

                $scope.isAlreadyShown = true;
                $scope.show();
            });

            $scope.$on('hideErrorOverlay', function () {
                $scope.hide();
                $scope.isAlreadyShown = false;
            });
        
            function onClose() {
                $scope.hide();
                $scope.isAlreadyShown = false;
            };

            function getProductName() {
                return CommonService.getCompleteProductName($scope.product_id);
            }

            function getExpirationDate() {
                return AppStatusService.about.license_expiration_date.format(translator.getString("dateWithoutTime", "time-format"));
            }

            function getLicenseText() {
                return translator.getString("aboutModalOverlay.text.copyRight", null,
                    { companyName: $scope.companyName });
            }

            $scope.$on('appStatusChanged', function (event, data) {
                if (data.attributes.section === 'about') {
                    $scope.product_id = $scope.AppStatusService.about.product_id;
                }
            });
        }

        /**@ngInject*/
        function link(scope, element) {

            scope.hide = hide;
            scope.show = show;
            hide();

            $(element).on('click', function(event) {
                event.stopPropagation();
            });

            function hide() {
                $(element).hide();
            }

            function show() {
                scope.isAlreadyShown = true;
                $(element).show();
            }
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: './views/directives/overlay/about-modal-overlay.html',
            scope: {},
            controller: controller,
            link: link
        };
    };

    return app.directive(name, directive);
};
},{}],62:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var directive = function () {

        /**@ngInject*/
        controller.$inject = ["$scope", "$window", "MixPanelService", "WebsiteLinksService", "EventTrackingNamesService", "OverlayService"];
        link.$inject = ["scope", "element"];
        function controller($scope, $window, MixPanelService, WebsiteLinksService, EventTrackingNamesService, OverlayService) {
            $scope.isAlreadyShown = false;

            OverlayService.makeOverlayMoveable();

            $scope.$on('showErrorOverlay', function (event, data) {
                if ($scope.isAlreadyShown === true)
                {
                    return;
                }

                $scope.code = data.code;
                $scope.message = data.message;
                $scope.messageNonLoc = data.messageNonLoc;
                $scope.icon = data.icon;
                $scope.header = data.header;
                $scope.actionText = data.actionText;
                $scope.headerNonLoc = data.headerNonLoc;
                $scope.actionTextNonLoc = data.actionTextNonLoc;
                $scope.actionUrl = data.actionUrl;
                $scope.additionalMixpanelProperties = data.additionalMixpanelProperties;
                $scope.isAlreadyShown = true;
                $scope.show();

                var properties = {
                    StatusCode: $scope.code,
                    Message: $scope.messageNonLoc,
                    ActionText: $scope.actionTextNonLoc,
                    ActionUrl: $scope.actionUrl
                }

                if (data.additionalMixpanelProperties) {
                    for (var key in data.additionalMixpanelProperties) {
                        if (data.additionalMixpanelProperties.hasOwnProperty(key)) {
                            if (!properties[key]) {
                                properties[key] = data.additionalMixpanelProperties[key];
                            }
                        }
                    }
                }

                MixPanelService.TrackEvent(EventTrackingNamesService.InternalError,
                    properties);
            });

            $scope.$on('hideErrorOverlay', function () {
                $scope.hide();
                $scope.isAlreadyShown = false;
            });

            $scope.onClose = function () {
                $scope.hide();
                $scope.isAlreadyShown = false;
            };

            $scope.onRetry = function () {
                $scope.hide();
                $scope.isAlreadyShown = false;
            };

            $scope.onAction = function () {
                $window.open($scope.actionUrl || WebsiteLinksService.getHomepage());
            };

            $scope.getOverlayIcon = function() {
                return $scope.icon;
            };

            $scope.getActionText = function () {
                return $scope.actionText;
            };
        }

        /**@ngInject*/
        function link(scope, element) {

            scope.hide = hide;
            scope.show = show;
            hide();

            $(element).on('click', function(event) {
                event.stopPropagation();
            });

            function hide() {
                $(element).hide();
            }

            function show() {
                scope.isAlreadyShown = true;
                $(element).show();
            }
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: './views/directives/overlay/error-modal-overlay.html',
            scope: {},
            controller: controller,
            link: link
        };
    };

    return app.directive(name, directive);
};
},{}],63:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./error-modal-overlay')('errorModalOverlay', app);
require('./update-modal-overlay')('updateModalOverlay', app);
require('./about-modal-overlay')('aboutModalOverlay', app);
require('./password-modal-overlay')('passwordModalOverlay', app);
},{"./about-modal-overlay":61,"./error-modal-overlay":62,"./password-modal-overlay":64,"./update-modal-overlay":65}],64:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var directive = function ($document, $timeout, translator, MixPanelService, ConfigurationService, IeInformationService) {

        /**@ngInject*/
        controller.$inject = ["$scope", "$document", "$timeout", "EventTrackingNamesService", "ConfigurationService", "OverlayService", "LoggingService"];
        link.$inject = ["scope", "element"];
        function controller($scope, $document, $timeout, EventTrackingNamesService, ConfigurationService, OverlayService, LoggingService) {
            $scope.IeInformationService = IeInformationService;

            $scope.passwordText = "";
            $scope.passwordTextIe9 = "";
            $scope.passwordInputFocused = false;

            $scope.reinit = reinit;
            $scope.updateCursorPos = updateCursorPos;
            $scope.getInputPasswordCtrl = getInputPasswordCtrl;
            $scope.getInputPasswordCtrlIe9 = getInputPasswordCtrlIe9;
            
            $scope.getInputPasswordMountCtrl = getInputPasswordMountCtrl;
            $scope.setFocusOnPasswordInput = setFocusOnPasswordInput;
            $scope.getPasswordIcon = getPasswordIcon;
            $scope.getOverlayIcon = getOverlayIcon;
            $scope.passwordIconClick = passwordIconClick;
            $scope.getInputStyle = getInputStyle;
            $scope.getPlaceholderText = getPlaceholderText;
            $scope.onChange = onChange;
            $scope.onLogin = onLogin;
            $scope.closeButtonClick = closeButtonClick;
            $scope.getLoginButtonStyle = getLoginButtonStyle;
            
            changePasswordShown(false);
            $scope.isIe9 = IeInformationService.isIE9();
            function changePasswordShown(shouldShow) {
                if ($scope.isIe9) {
                    return;
                }

                $scope.passwordShown = shouldShow;
                $scope.inputType = $scope.passwordShown == false ? 'password' : 'text';
            }

            var lastPassIsWrong = false;
            var loginButton = $document[0].getElementById('login_button');
            OverlayService.makeOverlayMoveable();
            
            $scope.$on('showPasswordOverlay', function () {
                $scope.show();
            });
            
            function getOverlayIcon() {
                if (lastPassIsWrong) {
                    return "wrong";
                }

                return "ok";
            };

            function getPasswordIcon () {

                var eyeIconMightBeEnabled;
                if ($scope.isIe9) {
                    eyeIconMightBeEnabled = getInputPasswordCtrlIe9().val();
                }
                else {
                    eyeIconMightBeEnabled = $scope.passwordText.length > 0;
                }

                if (eyeIconMightBeEnabled) {
                    return $scope.passwordShown ? "hide" : "show_enabled";
                }

                return $scope.passwordShown ? "hide" : "show";
            };

            function passwordIconClick () {
                changePasswordShown(!$scope.passwordShown);

                updateCursorPos();
            }

            function getInputStyle() {
                var style = "password-modal-overlay_password_mount ";

                if (lastPassIsWrong) {
                    style += "password-modal-overlay_password_mount_wrong_focused";
                }
                else {
                    style += "password-modal-overlay_password_mount_ok_focused";
                }

                return style;
            }

            function getLoginButtonStyle() {
                var style = "password-modal-overlay_login_button";

                if (loginButton.disabled)
                {
                    style += " password-modal-overlay_login_button_disabled";
                }
                else
                {
                    style += " password-modal-overlay_login_button_enabled";
                }

                return style;
            }

            function getPlaceholderText() {
                return translator.getString("passwordModalOverlay.text.placeholder");
            }

            function onChange() {
                if ($scope.isIe9) {
                    loginButtonShouldBeEnabled = getInputPasswordCtrlIe9().val();
                }
                else {
                    loginButtonShouldBeEnabled = $scope.passwordText.length > 0;
                }

                loginButton.disabled = !loginButtonShouldBeEnabled;

                lastPassIsWrong = false;
                $scope.lastPassIsWrong = lastPassIsWrong;

                updateBindings();
            }

            function onLogin() {
                if (loginButton.disabled === true) {
                    return;
                }
                loginButton.disabled = true;
                checkPassword();
            }

            function onCheckPassword(result){
                if (!result) {
                    lastPassIsWrong = true;
                    loginButton.disabled = true;
                    $scope.setFocusOnPasswordInput();
          
                    MixPanelService.TrackEvent(
                        EventTrackingNamesService.UIWrongPassword,
                        {
                            message: "Wrong password was entered" 
                        });
                    updateCursorPos();
                    $scope.lastPassIsWrong = lastPassIsWrong;
                    updateBindings();
                }
                else {
                    $scope.hide();
                    doAction();
                }
            }

            function closeButtonClick() {
                $scope.hide();
                cancelAction();
            }

            function getInputPasswordCtrl() {
                return $('#password_input');
            }


            function getInputPasswordCtrlIe9() {
                return $('#password_input_ie9');
            }

            function getInputPasswordMountCtrl() {
                return $('#password_mount');
            }

            function updateBindings() {
                $timeout(function () { }, 0);
            }

            function setFocusOnPasswordInput() {
                if ($scope.isIe9) {
                    if ($scope.passwordInputFocused) {
                        return;
                    }
                }

                var element = $scope.isIe9 ? getInputPasswordCtrlIe9() : getInputPasswordCtrl();
                element.focus();

                if ($scope.isIe9) {
                    $scope.passwordInputFocused = true;
                    updateCursorPos();
                }

                return;
            }

            function updateCursorPos() {
                $timeout(function () {

                    var element = $scope.isIe9 ? getInputPasswordCtrlIe9()[0] : getInputPasswordCtrl()[0];

                    if (element.createTextRange) {
                        var range = element.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', element.value.length);
                        range.moveStart('character', element.value.length);
                        range.select();
                    }
                });
            }

            function reinit() {
                changePasswordShown(false);
                lastPassIsWrong = false;
                loginButton.disabled = true;

                $scope.passwordText = "";
                $scope.passwordTextIe9 = "";
                $scope.lastPassIsWrong = lastPassIsWrong;

                $scope.setFocusOnPasswordInput();
                updateCursorPos();
                $scope.$broadcast("valueReset", {});
            }

            function checkPassword(){

                var password;
                if ($scope.isIe9) {
                    password = getInputPasswordCtrlIe9().val();
                }
                else {
                    password =$scope.passwordText;
                }

                ConfigurationService.checkPassword(password, onCheckPassword);
            }

            function doAction() {
                ConfigurationService.PasswordResult(true);
                $scope.reinit();
            }

            function cancelAction() {
                ConfigurationService.PasswordResult(false);
                $scope.reinit();
            }
        }

        /**@ngInject*/
        function link(scope, element) {
            scope.hide = hide;
            scope.show = show;

            function hide() {
                $(element).hide();
                scope.reinit();
            }

            $(element).on('click', function (event) {

                if (event.preventDefault) {
                    event.preventDefault();
                }

                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            });

            function show() {
                $(element).show();

                scope.reinit();
            }
                 
            if (scope.isIe9) {
                $(element).on('keyup', function (event) {
                    if (event.keyCode !== 13) {
                        scope.setFocusOnPasswordInput();
                        scope.onChange();
                        return;
                    }
                });
            }

            $(element).on('keypress', function (event) {
                if (event.keyCode === 27) {
                    scope.closeButtonClick();
                }

                if (!scope.isIe9) {
                    if (event.keyCode !== 13) {
                        scope.setFocusOnPasswordInput();
                        return;
                    }
                }
                
                if (event.keyCode === 13) {
                    scope.onLogin();

                    if (event.preventDefault) {
                        event.preventDefault();
                    }

                    if (event.stopPropagation) {
                        event.stopPropagation();
                    }
                }
            });

            if (scope.isIe9) {
                var inputPasswordElementPlain = $('#password_input_plain');

                if (inputPasswordElementPlain) {
                    inputPasswordElementPlain.on('focusout', function () {
                        scope.passwordInputFocused = false;
                    });
                }

                var inputPasswordElementEnc = $('#password_input_enc');

                if (inputPasswordElementEnc) {
                    inputPasswordElementEnc.on('focusout', function () {
                        scope.passwordInputFocused = false;
                    });
                }
            }

            var inpPassMountCtrl = scope.getInputPasswordMountCtrl();

            inpPassMountCtrl.on('focus', function () {
                var inpPassCtrl = scope.isIe9 ? scope.getInputPasswordCtrlIe9() : scope.getInputPasswordCtrl();
                inpPassCtrl.focus();
            });

            inpPassMountCtrl.on('click', function () {
                var inpPassCtrl = scope.isIe9 ? scope.getInputPasswordCtrlIe9() : scope.getInputPasswordCtrl();
                inpPassCtrl.focus();
            });

            hide();
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: './views/directives/overlay/password-modal-overlay.html',
            scope: {},
            controller: controller,
            link: link
        };
    };
    directive.$inject = ["$document", "$timeout", "translator", "MixPanelService", "ConfigurationService", "IeInformationService"];

    return app.directive(name, directive);
};
},{}],65:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    var directive = function () {

        /**@ngInject*/
        controller.$inject = ["$scope", "$timeout", "$window", "MixPanelService", "WebsiteLinksService", "EventTrackingNamesService", "LoggingService", "UpdaterService", "translator", "AppStatusService", "CommonService", "FixNowService", "OESettingsService", "OverlayService"];
        link.$inject = ["scope", "element"];
        function controller(
            $scope,
            $timeout,
            $window,
            MixPanelService,
            WebsiteLinksService,
            EventTrackingNamesService,
            LoggingService,
            UpdaterService,
            translator,
            AppStatusService,
            CommonService,
            FixNowService,
            OESettingsService,
            OverlayService) {
            $scope.isAlreadyShown = false;
            $scope.FixNowService = FixNowService;
            $scope.AppStatusService = AppStatusService;
            $scope.CommonService = CommonService;
            $scope.UpdaterService = UpdaterService;
            $scope.showToRedirectToLauncher = false;
            $scope.showReloadUI = false;
            $scope.switchInProgress = false;
            $scope.waitForSignatureCheckResult = false;
            $scope.updateProgressInPercent = 0;
            $scope.productName = $scope.CommonService.getProductName($scope.AppStatusService.about.product_id);
            $scope.brandName = $scope.CommonService.getBrandName();
            $scope.isUpdateRunning = false;
            var updateSuccessful = false;
            var lastIcon = 'updateui-success';
            OverlayService.makeOverlayMoveable();
            
            $scope.getOverlayIcon = function () {
                if (!$scope.switchInProgress) {
                    if ($scope.isUpdateRunning || $scope.waitForSignatureCheckResult || updateSuccessful) {
                        lastIcon = 'updateui-success';
                    }
                    else if ($scope.showToRedirectToLauncher) {
                        lastIcon = 'updateui-error';
                    }
                    else if ($scope.waitForSignatureCheckResult == false &&
                        $scope.isUpdateRunning === false &&
                        $scope.showToRedirectToLauncher === false &&
                        $scope.isAlreadyShown) {
                        lastIcon = 'updateui-error';
                    }
                    else {
                        lastIcon = '';
                    }
                }
                return lastIcon;
            };


            $scope.$on('appStatusChanged', function (event, data) {
                if (data.attributes.section === 'about') {
                    $scope.productName = $scope.CommonService.getProductName($scope.AppStatusService.about.product_id);
                }
            });

            $scope.getMessage = function () {
                refreshIsUpdating();
                if ($scope.isUpdateRunning || $scope.waitForSignatureCheckResult) {
                    var progressInPercentTmp = $scope.UpdaterService.progress();
                    if (progressInPercentTmp >= $scope.updateProgressInPercent && progressInPercentTmp !== false && progressInPercentTmp <= 100) {
                        $scope.updateProgressInPercent = progressInPercentTmp;
                    }

                    return translator.getString('updateModalOverlay.text.progress', null,
                        {
                            progress: $scope.updateProgressInPercent
                        });
                }

                return "";
            };

            $scope.getButtonText = function () {
                return translator.getString('updateModalOverlay.button.close');
            };

            $scope.getTitle = function () {
                if ($scope.isUpdateRunning || $scope.waitForSignatureCheckResult) {
                    return translator.getString('updateModalOverlay.text.headingUpdating', null,
                        {
                            brandName: $scope.brandName,
                            productName: $scope.productName
                        });
                }
                else if ($scope.showToRedirectToLauncher || ($scope.isUpdateRunning === false && $scope.waitForSignatureCheckResult == false && $scope.showToRedirectToLauncher === false && $scope.isAlreadyShown)) {
                    return translator.getString('updateModalOverlay.text.headingFailing', null,
                        {
                            brandName: $scope.brandName,
                            productName: $scope.productName
                        });
                }

                return "";
            };

            $scope.onAction = function () {
                OESettingsService.isAntivirusDefaultView(function (isDefaultView) {
                    if (isDefaultView) {
                        window.open(WebsiteLinksService.getCloseLauncher());
                    }
                    else {
                        CommonService.redirectToLauncher();
                    }
                });
            }

            $scope.$on('appStatusChanged', function () {
                refreshIsUpdating();
            });

            $scope.$on('fixNowDataChanged', function () {
                refreshIsUpdating();
            });

            function refreshIsUpdating() {
                $scope.isUpdateRunning = $scope.AppStatusService.isUpdateRunning() ||
                    ($scope.AppStatusService.isFixNowRunning() && $scope.FixNowService.isUpdating());
            }

            $scope.$on('showUpdateOverlay', function () {
                if ($scope.isAlreadyShown === true) {
                    return;
                }
                updateSuccessful = false;
                $scope.updateProgressInPercent = 0;
                $scope.isAlreadyShown = true;
                $scope.show();

                MixPanelService.TrackEvent(EventTrackingNamesService.UpdateUIStart,
                    {
                        StartTime: moment().utc().format("YYYY-MM-DDTHH:mm:ss")
                    });
            });

            $scope.$on('switchToReloadUI', function () {
                $timeout(function () {
                    $scope.switchInProgress = true;
                    updateSuccessful = true;
                    $scope.showToRedirectToLauncher = false;
                    $scope.waitForSignatureCheckResult = false;

                    MixPanelService.TrackEvent(EventTrackingNamesService.UpdateUIEnd,
                        {
                            Result: "Success",
                            EndTime: moment().utc().format("YYYY-MM-DDTHH:mm:ss")
                        });

                    $window.location.reload(true);
                    $scope.switchInProgress = false;
                });
            });

            $scope.$on('startWaitForSignatureCheckResult', function () {
                $scope.waitForSignatureCheckResult = true;
            });

            $scope.$on('switchToRedirectToLauncherOverlay',
                function () {
                    $timeout(function () {
                        $scope.switchInProgress = true;
                        updateSuccessful = false;
                        $scope.showToRedirectToLauncher = true;
                        $scope.waitForSignatureCheckResult = false;

                        MixPanelService.TrackEvent(EventTrackingNamesService.UpdateUIEnd,
                            {
                                Result: "Signature Check Failed",
                                EndTime: moment().utc().format("YYYY-MM-DDTHH:mm:ss")
                            });
                        $scope.switchInProgress = false;
                    });
                });
            refreshIsUpdating();
        }

        /**@ngInject*/
        function link(scope, element) {

            scope.show = show;
            $(element).hide();

            $(element).on('click', function (event) {
                event.stopPropagation();
            });

            function show() {
                scope.showToRedirectToLauncher = false;
                scope.isAlreadyShown = true;
                $(element).show();
            }
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: './views/directives/overlay/update-modal-overlay.html',
            scope: {},
            controller: controller,
            link: link
        };
    };

    return app.directive(name, directive);
};
},{}],66:[function(require,module,exports){
module.exports = function (name, app) {

    var directive = function (IeInformationService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                placeholderLegacy: '@'
            },
            link: function (scope, elm, attrs, ctrl) {
                if (IeInformationService.isIE9()) {
                    var placeholderLabel = angular.element(elm.parent()
                            .append('<span>' + scope.placeholderLegacy + '</span>')
                            .find('span')[0])
                        .addClass(attrs.placeholderLegacyClass);

                    var placeholderBindClick = function() {
                        placeholderLabel.bind('click',
                            function() {
                                elm[0].focus();
                            });
                    };

                    placeholderBindClick();

                    //	removes the label overlay when a value is typed
                    var elemPlaceHandlePlaceholder = function () {
                        if (elm.val() !== '') {
                            placeholderLabel.remove();
                        } else {
                            elm.parent().append(placeholderLabel);
                            placeholderBindClick();
                        }
                    };

                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        elemPlaceHandlePlaceholder();
                    });

                    scope.$on('valueChanged', function () {
                        elemPlaceHandlePlaceholder();
                    });

                    scope.$on('valueReset', function () {
                        elm.parent().append(placeholderLabel);
                        placeholderBindClick();
                    });
                    
                    elm.bind('keyup keydown', function () {
                        elemPlaceHandlePlaceholder();
                    });
                }
            }
        };
    };
    
    return app.directive(name, directive);
};
},{}],67:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./quarantine-checkbox')('quarantineCheckbox', app);
require('./quarantine-selectall-checkbox')('quarantineSelectallCheckbox', app);
require('./quarantine-pagination')('quarantinePagination', app);
require('./quarantine-whitelist-checkbox')('quarantineWhitelistCheckbox', app);
require('./quarantine-question-dialog')('quarantineQuestionDialog', app);
require('./quarantine-result-dialog')('quarantineResultDialog', app);
require('./quarantine-progress-dialog')('quarantineProgressDialog', app);
require('./quarantine-repeat-end')('quarantineRepeatEnd', app);
},{"./quarantine-checkbox":68,"./quarantine-pagination":69,"./quarantine-progress-dialog":70,"./quarantine-question-dialog":71,"./quarantine-repeat-end":72,"./quarantine-result-dialog":73,"./quarantine-selectall-checkbox":74,"./quarantine-whitelist-checkbox":75}],68:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/quarantine/quarantine-checkbox.html',
            scope: {
                item: '=item'
            },
            controller: 'QuarantineCheckboxController'
        };
    };
    
    return app.directive(name, directive);
};
},{}],69:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {

        /**@ngInject*/
        controller.$inject = ["$scope", "$timeout", "QuarantineService", "translator"];
        function controller($scope, $timeout, QuarantineService, translator) {
            $scope.pages = [];
            $scope.QuarantineService = QuarantineService;
            $scope.showButton = showButton;
            $scope.getButtonStyle = getButtonStyle;
            $scope.showPlaceholder = showPlaceholder;
            $scope.pagesReceived = false;
            $scope.getItemTitle = getItemTitle;

            function quarantineListChanged() {
                $scope.lastPage = QuarantineService.getLastPage();
                $scope.firstPage = QuarantineService.getFirstPage();
                $scope.currentPage = QuarantineService.getCurrentPage();

                $scope.pagesReceived = true;
                calculatePagination();
            }

            $scope.$on('quarantineListChanged', function () {
                quarantineListChanged();
            });

            function getItemTitle(page) {
                if (page === "previous") {
                    return translator.getString("quarantine.pagination.previousPage", "hover-title");
                }
                else if (page === "next") {
                    return translator.getString("quarantine.pagination.nextPage", "hover-title");
                }
                else if (page === "first") {
                    return translator.getString("quarantine.pagination.firstPage", "hover-title");
                }
                else if (page === "last") {
                    return translator.getString("quarantine.pagination.lastPage", "hover-title");
                }
                else {
                    return translator.getString("quarantine.pagination.page", "hover-title", { pageNumber: page });
                }
            }

            function calculatePagination() {
                $scope.pages = [];
                var i = 0;
                do {
                    i = nextButtonToShow(i);
                    if (i === -1) {
                        break;
                    }

                    $scope.pages.push(i);
                }
                while (i !== -1)
            }
            
            function getButtonStyle(page) {
                if (page === $scope.currentPage) {
                    return "quarantine_pagination_item_selected";
                }

                return "quarantine_pagination_item_unselected";
            }

            function showPlaceholder(name) {
                if (name === "first") {
                    if ($scope.currentPage === $scope.firstPage ||
                        $scope.currentPage === $scope.firstPage + 1 ||
                        $scope.currentPage === $scope.firstPage + 2) {
                        return false;
                    }
                    else if ($scope.lastPage === $scope.firstPage
                        || $scope.lastPage === $scope.firstPage + 1
                        || $scope.lastPage === $scope.firstPage + 2
                        || $scope.lastPage === $scope.firstPage + 3) {
                    }
                }
                else if (name === "last") {
                    if ($scope.currentPage === $scope.lastPage
                        || $scope.currentPage === $scope.lastPage - 1
                        || $scope.currentPage === $scope.lastPage - 2) {
                        return false;
                    }
                    else if ($scope.firstPage === $scope.lastPage
                        || $scope.firstPage === $scope.lastPage - 1
                        || $scope.firstPage === $scope.lastPage - 2
                        || $scope.firstPage === $scope.lastPage - 3) {
                        return false;
                    }
                }
                return true;
            }

            function nextButtonToShow(page) {
                if (page === $scope.lastPage || $scope.firstPage === $scope.lastPage) {
                    return -1;
                }

                if (page < ($scope.currentPage - 2) && (($scope.currentPage - 2) > $scope.firstPage) && $scope.currentPage === $scope.lastPage) {
                    return $scope.currentPage - 2;
                }
                else if (page < ($scope.currentPage - 1) && (($scope.currentPage - 1) > $scope.firstPage)) {
                    return $scope.currentPage - 1;
                }
                else if (page < $scope.currentPage && ($scope.currentPage !== $scope.firstPage) && ($scope.currentPage !== $scope.lastPage)){
                    return $scope.currentPage;
                }
                else if (page < ($scope.currentPage + 1) && (($scope.currentPage + 1) < $scope.lastPage)) {
                    return $scope.currentPage + 1;
                }
                else if (page < ($scope.currentPage + 2) && (($scope.currentPage + 2) < $scope.lastPage) && $scope.currentPage === $scope.firstPage) {
                    return $scope.currentPage + 2;
                }

                return -1;
            }

            function showButton(page, buttonName) {
                if (buttonName === 'next' || buttonName === 'previous') {
                    if (($scope.currentPage === $scope.firstPage && page === $scope.firstPage) ||
                        ($scope.currentPage === $scope.lastPage && page === $scope.lastPage)) {
                        return false;
                    }

                    return true;
                }

                if ($scope.lastPage === $scope.firstPage && buttonName === 'last') {
                    return false;
                }

                return true;
            }
            quarantineListChanged();
        }

        return {
            templateUrl: 'views/directives/quarantine/quarantine-pagination.html',
            scope: {},
            controller: controller
        };
    };


    return app.directive(name, directive);
};
},{}],70:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
       
        /**@ngInject*/
        controller.$inject = ["$scope", "LoggingService", "MessageBroker", "QuarantineService", "translator"];
        link.$inject = ["scope", "element"];
        function controller($scope, LoggingService, MessageBroker, QuarantineService, translator) {
            $scope.QuarantineService = QuarantineService;
            $scope.key = QuarantineService.getOperation();
            $scope.getDialogIcon = function () {
                if ($scope.key === 'isRestore')
                {
                    return 'symbol/gif/quarantine-restore-animation.gif';
                }
                else if ($scope.key === 'isRescan') {
                    return 'symbol/gif/quarantine-rescan-animation.gif';
                }

                return 'symbol/gif/quarantine-delete-animation.gif';
            }

            $scope.getDialogClass = function () {
                if ($scope.key === 'isRestore') {
                    return 'image_restore';
                }
                else if ($scope.key === 'isRescan') {
                    return 'image_rescan'; 
                }

                return 'image_delete';
            }

            $scope.getDialogText = function () {
                if ($scope.key === 'isRestore') {
                    return translator.getString("quarantineProgressDialog.text.restoreFiles");
                }
                else if ($scope.key === 'isRescan') {
                    return translator.getString("quarantineProgressDialog.text.rescanFiles");
                }

                return translator.getString("quarantineProgressDialog.text.deleteFiles");
            }

            $scope.$on('showQuarantineProgressOverlay', function (event, key) {
                $scope.key = key;
                $scope.show();
            });

            $scope.$on('hideQuarantineProgressOverlay', function () {
                $scope.hide();
            });
        }

        /**@ngInject*/
        function link(scope, element) {
            scope.hide = hide;
            scope.show = show;

            if (scope.QuarantineService.getProgressOverlayVisibility() === false) {
                hide();
            }
            else {
                show();
            }

            function hide() {
                $(element).hide();
            }

            function show() {
                $(element).show();
            }
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: 'views/directives/quarantine/quarantine-progress-dialog.html',
            scope: {},
            controller: controller,
            link: link
        };
    };


    return app.directive(name, directive);
};
},{}],71:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
       
        /**@ngInject*/
        controller.$inject = ["$scope", "LoggingService", "MessageBroker", "QuarantineService", "translator"];
        link.$inject = ["scope", "element"];
        function controller(
            $scope,
            LoggingService,
            MessageBroker,
            QuarantineService,
            translator) {
            $scope.QuarantineService = QuarantineService;
            $scope.isAlreadyShown = false;
            $scope.multiple = false;
            $scope.onAccept = onAccept;
            $scope.onDecline = onDecline;
            $scope.getQuestionDescriptionText = getQuestionDescriptionText;
            $scope.getQuestionText = getQuestionText;
            $scope.getButtonText = getButtonText;
            $scope.isRestore = isRestore;
            $scope.addToExclusionList = false;
            $scope.params = {};
            $scope.$on('showQuarantineQuestionOverlay', function (event, params) {
                if ($scope.isAlreadyShown === true) {
                    return;
                }

                $scope.params = params;
                $scope.show();
            });

            function onAccept() {

                if (isRestore())
                {
                    QuarantineService.restoreItems($scope.params, $scope.addToExclusionList);
                }
                else
                {
                    QuarantineService.deleteItems($scope.params);
                }

                $scope.hide();
                $scope.addToExclusionList = false;
                $scope.isAlreadyShown = false;
            };

            function onDecline() {
                $scope.hide();
                $scope.addToExclusionList = false;
                $scope.isAlreadyShown = false;
            };
            
            function getQuestionDescriptionText() {
                if (isRestore())
                {
                    return translator.getPlural(
                        $scope.params.selectionCount, "quarantineQuestionDialog.text.restoreDescription", null, { numberOfItems: $scope.params.selectionCount });
                }

                return translator.getPlural(
                    $scope.params.selectionCount, "quarantineQuestionDialog.text.deleteDescription", null, { numberOfItems: $scope.params.selectionCount });
            }

            function getQuestionText() {
                if (isRestore())
                {
                    return translator.getPlural(
                        $scope.params.selectionCount, "quarantineQuestionDialog.text.restore");
                }

                return translator.getPlural(
                    $scope.params.selectionCount, "quarantineQuestionDialog.text.delete");
            }

            function getButtonText() {
                if (isRestore()) {
                    return translator.getString('quarantineQuestionDialog.button.restore');
                }

                return translator.getString('quarantineQuestionDialog.button.delete');
            }

            function isRestore() {
                if ($scope.params.key === 'isRestore') {
                    return true;
                }

                return false;
            }
        }

        /**@ngInject*/
        function link(scope, element) {

            scope.hide = hide;
            scope.show = show;
            hide();

            function hide() {
                $(element).hide();
            }

            function show() {
                $(element).show();
                document.getElementById("quarantine-question-dialog-decline").focus();
            }
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: 'views/directives/quarantine/quarantine-question-dialog.html',
            scope: {},
            controller: controller,
            link: link
        };
    };


    return app.directive(name, directive);
};
},{}],72:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function ($timeout, QuarantineService) {
        return {
            restrict: "A",
            link: function (scope) {
                if (scope.$last) {
                    $timeout(function () {
                        QuarantineService.stopCounter();
                    });
                }
            }
        };
    };
    
    return app.directive(name, directive);
};
},{}],73:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {

        /**@ngInject*/
        controller.$inject = ["$scope", "$document", "$sce", "LoggingService", "MessageBroker", "QuarantineService", "Tools", "AntivirusEndpoints", "translator"];
        link.$inject = ["scope", "element"];
        function controller($scope, $document, $sce, LoggingService, MessageBroker, QuarantineService, Tools, AntivirusEndpoints, translator) {

            $scope.QuarantineService = QuarantineService;
            $scope.onDismiss = onDismiss;
            $scope.onRestore = onRestore;
            
            $scope.filesWereRestoredToTheOriginalLocationMessage = filesWereRestoredToTheOriginalLocationMessage;
            $scope.filesWereRestoredToTheDefaultLocationMessage = filesWereRestoredToTheDefaultLocationMessage;
            $scope.filesCouldNotBeRestoredMessage = filesCouldNotBeRestoredMessage;
            $scope.filesCouldNotBeAddedToWLMessage = filesCouldNotBeAddedToWLMessage;

            $scope.getNumberOfFilesRestoredToTheOriginalLocation = getNumberOfFilesRestoredToTheOriginalLocation;
            $scope.getNumberOfFilesRestoredToTheDefaultLocation = getNumberOfFilesRestoredToTheDefaultLocation;
            $scope.getNumberOfCouldNotBeRestoredFiles = getNumberOfCouldNotBeRestoredFiles;
            $scope.getNumberOfCouldNotBeAddedToWLFiles = getNumberOfCouldNotBeAddedToWLFiles;
            $scope.getNumberOfFilesDeleted = getNumberOfFilesDeleted;
            $scope.getNumberOfFilesCouldNotBeDeleted = getNumberOfFilesCouldNotBeDeleted;
            $scope.getFilesDeletedMessage = getFilesDeletedMessage;
            $scope.getFilesCouldNotBeDeletedMessage = getFilesCouldNotBeDeletedMessage;
            $scope.isRestore = isRestore;
            $scope.isRescan = isRescan;
            $scope.isDelete = isDelete;
            $scope.getMainIcon = getMainIcon;
            $scope.getNumberOfRescannedObjects = getNumberOfRescannedObjects;
            $scope.getCleanBeforeRescan = getCleanBeforeRescan;
            $scope.getCleanAfterRescan = getCleanAfterRescan;
            $scope.getSuspiciousBeforeRescan = getSuspiciousBeforeRescan;
            $scope.getSuspiciousAfterRescan = getSuspiciousAfterRescan;
            $scope.getDetectedBeforeRescan = getDetectedBeforeRescan;
            $scope.getDetectedAfterRescan = getDetectedAfterRescan;

            $scope.getFilesRescannedResultMessage = getFilesRescannedResultMessage;
            $scope.getFilesRescannedAndUnsafeMessage = getFilesRescannedAndUnsafeMessage;

            $scope.onDefaultLocationClick = onDefaultLocationClick;
            $scope.onWLClick = onWLClick;

            $scope.$on('showQuarantineResultOverlay', function () {
                $scope.show();
            });

            function onDismiss() {
                $scope.QuarantineService.hideResultOverlay();
                $scope.hide();
            };

            function onRestore() {
                $scope.QuarantineService.hideResultOverlay();
                $scope.hide();
                var cleanFilesList = $scope.QuarantineService.getCleanFilesAfterRescan();
                var list = [];
                for (var id in cleanFilesList) {
                    if (cleanFilesList.hasOwnProperty(id)) {
                        list.push({id: cleanFilesList[id]});
                    }
                }

                $scope.QuarantineService.showQuarantineQuestionOverlay({
                    selectionCount: cleanFilesList.length,
                    key: 'isRestore',
                    list: list,
                    type: "quarantine_restore_select"
                });
            };
            
            function filesWereRestoredToTheOriginalLocationMessage() {
                var files = getNumberOfFilesRestoredToTheOriginalLocation();

                var message = translator.getPlural(
                    files, "quarantineResultDialog.text.restoredToOriginalLocation",
                    null,
                    { countFiles: files });

                return message;
            }

            function filesWereRestoredToTheDefaultLocationMessage() {
                var files = getNumberOfFilesRestoredToTheDefaultLocation();

                var defaultLocation = translator.getString("quarantineResultDialog.text.defaultLocation");

                //var defaultLocationLink = "<a id='quarantine-result-dialog-open-default-location' class=\"link\">" + defaultLocation + "</a>";
                var defaultLocationLink = "<a href='javascript::void(0)'>" + defaultLocation + "</a>";

                var message = translator.getPlural(
                    files, "quarantineResultDialog.text.restoredToDefaultLocation",
                    null,
                    { defaultLocationLink: defaultLocationLink, countFiles: files });

                //return $sce.trustAsHtml(message);
                //return "<span>" + message + "</span>";
                return message;
            }

            function filesCouldNotBeRestoredMessage() {
                var files = getNumberOfCouldNotBeRestoredFiles();

                var message = translator.getPlural(
                    files, "quarantineResultDialog.text.restoredFailed",
                    null,
                    { countFiles: files });

                return message;
            }

            function filesCouldNotBeAddedToWLMessage() {
                var files = getNumberOfCouldNotBeAddedToWLFiles();

                var whitelistLoc = translator.getString("quarantineResultDialog.text.whitelist");

                //var whitelistLink = "<a id='quarantine-result-dialog-open-whitelist-location' class=\"link\">" + whitelistLoc + "</a>";
                var whitelistLink = "<a href='javascript::void(0)'>" + whitelistLoc + "</a>";

                var message = translator.getPlural(
                    files, "quarantineResultDialog.text.addToWhitelistFailed",
                    null,
                    { whitelistLink: whitelistLink, countFiles: files });
                
                //return $sce.trustAsHtml(message);
                return message;
            }

            function getFilesDeletedMessage() {
                var files = getNumberOfFilesDeleted();

                var message = translator.getPlural(
                    files, "quarantineResultDialog.text.deleteSuccess",
                    null,
                    { countFiles: files });

                return message;
            }

            function getFilesRescannedResultMessage() {

                var numberOfUnsafeFiles = getSuspiciousAfterRescan() + getDetectedAfterRescan();
                var files;
                var message;
                if (numberOfUnsafeFiles === getNumberOfRescannedObjects())
                {
                    files = getNumberOfRescannedObjects();

                    message = translator.getPlural(
                        files, "quarantineResultDialog.text.rescanUnsafe",
                        null,
                        { countFiles: files });

                    return message;
                }

                files = getCleanAfterRescan();

                message = translator.getPlural(
                    files, "quarantineResultDialog.text.rescanClean",
                    null,
                    { countFiles: files });

                return message;
            }

            function getFilesRescannedAndUnsafeMessage() {

                var numberOfUnsafeFiles = getSuspiciousAfterRescan() + getDetectedAfterRescan();
                var message = translator.getPlural(
                    numberOfUnsafeFiles, "quarantineResultDialog.text.rescanUnsafe",
                    null,
                    { countFiles: numberOfUnsafeFiles });

                return message;
            }

            function getFilesCouldNotBeDeletedMessage() {
                var files = getNumberOfFilesCouldNotBeDeleted();

                var message = translator.getPlural(
                    files, "quarantineResultDialog.text.deleteFailed",
                    null,
                    { countFiles: files });

                return message;
            }

            function getNumberOfFilesRestoredToTheOriginalLocation() {
                return $scope.QuarantineService.getFilesRestoredToOriginalLocation();
            }

            function getNumberOfFilesRestoredToTheDefaultLocation() {
                return $scope.QuarantineService.getFilesRestoredToDefaultLocation();
            }

            function getNumberOfCouldNotBeRestoredFiles() {
                return $scope.QuarantineService.getNumberOfCouldNotBeRestoredFiles();
            }

            function getNumberOfCouldNotBeAddedToWLFiles() {
                return $scope.QuarantineService.getNumberOfCouldNotBeAddedToWLFiles();
            }

            function isRestore() {
                return $scope.QuarantineService.getOperation() === 'isRestore';
            }

            function isDelete() {
                return $scope.QuarantineService.getOperation() === 'isDelete';
            }

            function isRescan() {
                return $scope.QuarantineService.getOperation() === 'isRescan';
            }

            function getNumberOfFilesDeleted() {
                return $scope.QuarantineService.getNumberOfFilesDeleted();
            }

            function getNumberOfFilesCouldNotBeDeleted() {
                return $scope.QuarantineService.getNumberOfFilesCouldNotBeDeleted();
            }
            
            function getNumberOfRescannedObjects() {
                return $scope.QuarantineService.getNumberOfRescannedObjects();
            }
            function getCleanBeforeRescan() {
                return $scope.QuarantineService.getCleanBeforeRescan();
            }
            function getCleanAfterRescan(){
                return $scope.QuarantineService.getCleanAfterRescan();
            }
            function getSuspiciousBeforeRescan(){
                return $scope.QuarantineService.getSuspiciousBeforeRescan();
            }
            function getSuspiciousAfterRescan() {
                return $scope.QuarantineService.getSuspiciousAfterRescan();
            }
            function getDetectedBeforeRescan() {
                return $scope.QuarantineService.getDetectedBeforeRescan();
            }
            function getDetectedAfterRescan() {
                return $scope.QuarantineService.getDetectedAfterRescan();
            } 

            function onDefaultLocationClick(){
                return $scope.QuarantineService.openDefaultLocation();
            }

            function onWLClick() {
                return $scope.QuarantineService.openWhitelistLocation();
            }

            function getMainIcon() {
                var statusCode = $scope.QuarantineService.getStatusCode();

                if (isRescan())
                {
                    var infectedFiles = getDetectedAfterRescan() + getSuspiciousAfterRescan();

                    if (getNumberOfRescannedObjects() === getCleanAfterRescan())
                    {
                        return "successfully_restored";
                    }
                    else if (infectedFiles === getNumberOfRescannedObjects())
                    {
                        return "failed_to_restore";
                    }
                    
                    return "partially_restored";
                }


                if (statusCode === 200) {
                    return "successfully_restored";
                }

                if (statusCode === 900) {
                        return "partially_restored";
                }

                return "failed_to_restore";
            }
        }

        /**@ngInject*/
        function link(scope, element) {

            scope.hide = hide;
            scope.show = show;

            if (scope.QuarantineService.getResultOverlayVisibility() === false) {
                hide();
            }
            else {
                show();
            }

            function hide() {
                $(element).hide();
            }

            function show() {
                $(element).show();
            }
        }

        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: 'views/directives/quarantine/quarantine-result-dialog.html',
            scope: {},
            controller: controller,
            link: link
        };
    };


    return app.directive(name, directive);
};
},{}],74:[function(require,module,exports){
module.exports = function (name, app) {


    /**@ngInject*/
    link.$inject = ["scope", "element"];
    function link(scope, element) {
    }

    var directive = function () {
        return {
            transclude: true,
            restrict: 'AE',
            templateUrl: 'views/directives/quarantine/quarantine-selectall-checkbox.html',
            scope: {
                items: '=items',
                selected: '=selected'
            },
            link: link,
            controller: 'QuarantineSelectAllCheckboxController'
        };
    };

    return app.directive(name, directive);
}
;
},{}],75:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/quarantine/quarantine-whitelist-checkbox.html',
            scope: {
                selected: '=selected'
            },
            controller: 'QuarantineWhitelistCheckboxController'
        };
    };

    return app.directive(name, directive);
}
;
},{}],76:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope", "$element", "UpdaterService", "LoggingService", "IeInformationService", "AppStatusService", "FixNowService"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/radial-progress.html',
            scope: {
                size: "="
            },
            controller: controller,
            link: circleProgress
        };
    };

    var progress = 0;

    /**@ngInject*/
    function controller($scope, $element, UpdaterService, LoggingService, IeInformationService, AppStatusService, FixNowService) {
        $scope.UpdaterService = UpdaterService;
        $scope.LoggingService = LoggingService;
        $scope.AppStatusService = AppStatusService;
        $scope.FixNowService = FixNowService;
        $scope.isIE8 = IeInformationService.GetIEVersion() < 9;
    }

    function circleProgress($scope, element) {
        if ($scope.isIE8 === false) {
            $(element).circleProgress({
                startAngle: -Math.PI / 2,
                size: $scope.size,
                value: 0,
                animation: false,
                thickness: 4,
                fill: { color: '#28a80e' }
            });

            $scope.$on('updaterStatusChanged',
                function () {
                    ChangeStatusAction();
                });

            $scope.$on('fixNowDataChanged',
                function () {
                    ChangeStatusAction();
                });

            ChangeStatusAction();
        }
        var appStatusWatcher = null;

        function resetProgress() {
            progress = 0;
            $(element).circleProgress('value', 0);
        }

        function ChangeStatusAction() {
            var isGreyState = $scope.AppStatusService.isGreyState();

            if (isGreyState) {
                if (appStatusWatcher == null) {
                    appStatusWatcher = $scope.$on('appStatusChanged',
                        function () {
                            if ($scope.AppStatusService.isGreyState() === false) {
                                appStatusWatcher();
                                appStatusWatcher = null;
                                resetProgress();
                            }
                        });
                }
                if ($scope.AppStatusService.isUpdateRunning()) {
                    progress = $scope.UpdaterService.progress();
                }
                else if ($scope.AppStatusService.isFixNowRunning()) {
                    progress = $scope.FixNowService.progress();
                } else {
                    $scope.LoggingService.Warning("Unknown grey state");
                }

                if (progress === 0) {
                    $(element).circleProgress('value', 0);
                } else {
                    $(element).circleProgress('value', progress / 100);
                }
            }
            else {
                resetProgress();
            }
        }
    }

    return app.directive(name, directive);
};

},{}],77:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope"];
    var directive = function () {

        return {
            // transclude: true,
            templateUrl: 'views/directives/scan/circle-progress.html',
            scope: {
                onComplete: '&onComplete'
            },
            controller: controller,
            link: link
        };
    };

    /**@ngInject*/
    function controller($scope) {

        var step = 0;
        $scope.animationComplete = animationComplete;
        function animationComplete() {
            $scope.onComplete({step: ++step});
        }
    }

    function link(scope, element, attr, controller) {

        var dashes = 7;
        var counter = $('.circle-progress .counter');
        $(element).circleProgress({
            dashesAmount: dashes,
            dashSize: Math.PI / 400,
            size: 220,
            value: 1/dashes,
            fill: { color: '#9ACD32'}

        }).on('circle-animation-progress', function(event, progress, step) {
            counter.text((step * 100).toFixed() + '%');

        }).on('circle-animation-end', function(){
            scope.animationComplete();
        });

        initDashes();
        enableCircleDashes();

        setTimeout(function() { $(element).circleProgress('value', 1/7*2); }, 2000);
        setTimeout(function() { $(element).circleProgress('value', 1/7*3); }, 4000);
        setTimeout(function() { $(element).circleProgress('value', 1/7*4); }, 6000);
        setTimeout(function() { $(element).circleProgress('value', 1/7*5); }, 8000);
        setTimeout(function() { $(element).circleProgress('value', 1/7*6); }, 10000);
        setTimeout(function() { $(element).circleProgress('value', 1/7*7); }, 12000);
    }

    function initDashes() {
        $.circleProgress.defaults.arcCoef = 1; // range: 0..1
        $.circleProgress.defaults.startAngle =   -Math.PI / 4 * 2 ;
        $.circleProgress.defaults.dashesAmount = 7;
        $.circleProgress.defaults.dashSize = 0.03; // in radians
    }

    function enableCircleDashes() {
        $.circleProgress.defaults.drawArc = function(v) {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                c = this.arcCoef,
                a = this.startAngle + (1 - c) * Math.PI;

            v = Math.max(0, Math.min(1, v));

            ctx.save();
            ctx.beginPath();

            if (!this.reverse) {
                ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI * v);
            } else {
                ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI, a + 2 * c * (1 - v) * Math.PI, a);
            }

            ctx.lineWidth = t;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = this.arcFill;
            ctx.stroke();
            ctx.restore();

            this.addDashes();
        };

        $.circleProgress.defaults.addDashes = function() {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                d = this.dashSize,
                c = this.arcCoef,
                a = this.startAngle + (1 - c) * Math.PI ,
                n = this.dashesAmount;

            c = c * 2;

            ctx.save();
            ctx.lineWidth = t;
            ctx.strokeStyle = '#fff';

            for (var i = 0; i < n; i++) {
                ctx.beginPath();
                var s = a + 2 * c * (1 - (i + 0.5) / n) * Math.PI;
                ctx.arc(r, r, r - t / 2, s - d / 2, s + d / 2);
                ctx.stroke();
            }

            ctx.restore();
        };

        $.circleProgress.defaults.drawEmptyArc = function(v) {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                c = this.arcCoef,
                a = this.startAngle + (1 - c) * Math.PI;


            v = Math.max(0, Math.min(1, v));
            if (v < 1) {
                ctx.save();
                ctx.beginPath();

                if (v <= 0) {
                    ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI);
                } else {
                    if (!this.reverse) {
                        ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI * v, a + 2 * c * Math.PI);
                    } else {
                        ctx.arc(r, r, r - t / 2, a, a + 2 * c * (1 - v) * Math.PI);
                    }
                }

                ctx.lineWidth = t;
                ctx.lineCap = this.lineCap;
                ctx.strokeStyle = this.emptyFill;
                ctx.stroke();
                ctx.restore();
            }
        };

    }

    return app.directive(name, directive);
};
},{}],78:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "LoggingService", "ScanProfilesService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/custom-scan.html',
            scope: {},
            controller: controller
        };
    };
    /**@ngInject*/
    function controller($scope, LoggingService, ScanProfilesService) {
        $scope.isCreateProfile = false;
        $scope.ScanProfilesService = ScanProfilesService;

        $scope.$on('deleteScanProfile', function (event, data) {
            $scope.ScanProfilesService.deleteProfile(data.scanProfileWrapper);
        });

        $scope.$on('editScanProfile', function (event, data) {
            $scope.isCreateProfile = true;
            $scope.$broadcast("updateConfigureProfilePage", data);
        });

        $scope.$on('editScanProfileCanceled', function (event, data) {
            $scope.isCreateProfile = false;
        });

        $scope.$on('editScanProfileFinished', function (event, data) {
            if (data.newOne) {
                $scope.ScanProfilesService.createProfile(data.scanProfileWrapper);
            }
            else {
                $scope.ScanProfilesService.changeProfile(data.scanProfileWrapper);
            }
            
            $scope.isCreateProfile = false;
        });
    }

    return app.directive(name, directive);
};
},{}],79:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "SchedulerJobService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/full-scan.html',
            scope: {},
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, SchedulerJobService) {
        $scope.startFullScan = SchedulerJobService.startFullScan;
    }

    return app.directive(name, directive);
};
},{}],80:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./profile');
require('./scheduler');
require('./scan-entry-drop-down')('scanEntryDropDown', app);
require('./circle-progress')('circleProgress', app);
require('./full-scan')('fullScan', app);
require('./quick-scan')('quickScan', app);
require('./custom-scan')('customScan', app);
require('./scheduled-scan')('scheduledScan', app);
},{"./circle-progress":77,"./custom-scan":78,"./full-scan":79,"./profile":89,"./quick-scan":90,"./scan-entry-drop-down":91,"./scheduled-scan":92,"./scheduler":93}],81:[function(require,module,exports){
var ScanProfileModelWrapper = require('../../../model/ScanProfileModelWrapper');

module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "LoggingService", "translator", "EventTrackingNamesService", "CommonService", "MixPanelService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/profile/custom-scan-configure-profile.html',
            scope: {},
            controller: controller
        };
    };    
    /**@ngInject*/
    function controller($scope, $timeout, LoggingService, translator, EventTrackingNamesService, CommonService, MixPanelService) {
        $scope.LoggingService = LoggingService;
        $scope.CommonService = CommonService;
        $scope.scanProfileWrapper = {};
        $scope.isModeCreate = true;
        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validatePath = validatePath;
        $scope.getTitleText = getTitleText;
        $scope.isProfileNameValid = true;
        $scope.getTreeviewStyle = getTreeviewStyle;
        $scope.arePathsValid = true;
        $scope.getErrorTreeviewText = getErrorTreeviewText;
        $scope.showElement = false;
        $scope.getButtonText = getButtonText;
        $scope.getProfileNamePlaceHolder = getProfileNamePlaceHolder;
        $scope.getProfileNameEmptyFieldError = getProfileNameEmptyFieldError;
        $scope.getProfileNameTooLongError = getProfileNameTooLongError;
        $scope.getProfileNameTooShortError = getProfileNameTooShortError;
        $scope.getProfileNameInvalidError = getProfileNameInvalidError;
        
        $scope.config = {
            autoHideScrollbar: true,
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 200,
            scrollInertia: 0
        };

        $scope.$on('treeviewUpdateScrollbar', function (event, data) {

        });

        $scope.$on('pathChanged', function (event, data) {
            $scope.validatePath();
        });
        
        $scope.$on('updateConfigureProfilePage', function (event, data) {
            $timeout(function () { $scope.updateScrollbar('scrollTo', 0); });
            $scope.isProfileNameValid = true;
            $scope.arePathsValid = true;
            $scope.showElement = true;
            if (data.newOne) {
                $scope.isModeCreate = true;
                $scope.scanProfileWrapper = new ScanProfileModelWrapper();
                $scope.scanProfileWrapper.id = $scope.CommonService.generateUuid();
                $timeout(function () { $scope.$broadcast("valueChanged", {}); });
            }
            else {
                $scope.isModeCreate = false;
                $scope.scanProfileWrapper = JSON.parse(JSON.stringify(data.scanProfileWrapper));
                $timeout(function () { $scope.$broadcast("valueChanged", {}); });
            }

            $timeout(function () {
                $scope.fileSystem = $scope.CommonService.getThisComputer();
                $timeout(function () { $scope.updateScrollbar('scrollTo', 0); });
                if ($scope.fileSystem === null) {

                    var msg = "Could not get my computer structure from Connect Client";
                    LoggingService.Error(msg);

                    MixPanelService.TrackEvent(EventTrackingNamesService.ConnectDataError,
                        {
                            Message: msg
                        });

                    $scope.$broadcast("reset");
                    $scope.$emit("editScanProfileCanceled", { newOne: $scope.isModeCreate, scanProfileWrapper: $scope.scanProfileWrapper });
                    $scope.showElement = false;
                }
            });
        });
        
        function getProfileNamePlaceHolder() {
            return translator.getString("customScanConfigureProfile.text.placeholderProfileName");
        }

        function getProfileNameEmptyFieldError() {
            return translator.getString("customScanConfigureProfile.text.profileNameErrorEmptyField");
        }

        function getProfileNameTooLongError() {
            return translator.getString("customScanConfigureProfile.text.profileNameErrorTooLong");
        }

        function getProfileNameTooShortError() {
            return translator.getString("customScanConfigureProfile.text.profileNameErrorTooShort");
        }

        function getProfileNameInvalidError() {
            return translator.getString("customScanConfigureProfile.text.profileNameErrorInvalid");
        }

        function getTreeviewStyle() {

            var style = "menubar-customscan__content-container-configure-profile";
            if (!$scope.arePathsValid) {
                style += " menubar-customscan__content-container-configure-profile-invalid";
            }

            return style;
        }
        
        function getErrorTreeviewText() {
            if (!$scope.arePathsValid) {
                return translator.getString("customScanConfigureProfile.text.errorNoFolderSelected");
            }
        }

        function getTitleText() {
            if ($scope.isModeCreate) {
                return translator.getString("customScanConfigureProfile.text.headingCreate");
            }
            else {
                return translator.getString("customScanConfigureProfile.text.headingEdit");
            }
        }

        function cancel() {
            $scope.$broadcast("reset");
            $scope.$emit("editScanProfileCanceled", { newOne: $scope.isModeCreate, scanProfileWrapper: $scope.scanProfileWrapper });
            $scope.showElement = false;
            $scope.scanProfileWrapper = new ScanProfileModelWrapper();
            $scope.scanProfileWrapper.id = $scope.CommonService.generateUuid();
        }

        function submit() {
            validatePath();

            $scope.$broadcast("validate");
            $timeout(function () {
                if (isValid()) {
                    $scope.$broadcast("save");
                    $scope.$emit("editScanProfileFinished",
                        { newOne: $scope.isModeCreate, scanProfileWrapper: $scope.scanProfileWrapper });
                    $scope.showElement = false;
                }
            });
        }

        function getButtonText() {
            if ($scope.isModeCreate) {
                return translator.getString("customScanConfigureProfile.button.create");
            }

            return translator.getString("customScanConfigureProfile.button.save");
        }

        function validatePath() {
            if ($scope.scanProfileWrapper.scanProfile &&
                $scope.scanProfileWrapper.scanProfile.search &&
                $scope.scanProfileWrapper.scanProfile.search &&
                $scope.scanProfileWrapper.scanProfile.search.path &&
                $scope.scanProfileWrapper.scanProfile.search.path.length) {
                $scope.arePathsValid = true;
                return;
            }

            $scope.arePathsValid = false;
            return;
        }

        function isValid() {
            return $scope.isProfileNameValid && $scope.arePathsValid;
        }
    }
    return app.directive(name, directive);
};
},{"../../../model/ScanProfileModelWrapper":117}],82:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "LoggingService", "translator", "ScanProfilesService", "SchedulerJobService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/profile/custom-scan-profile-entry.html',
            scope: {
                scanProfileWrapper: '='
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, LoggingService, translator, ScanProfilesService, SchedulerJobService) {
        $scope.openDropDown = openDropDown;
        $scope.getProfileIconStyle = getProfileIconStyle;
        $scope.getDropdownScanButton = getDropdownScanButton;
        $scope.ScanProfilesService = ScanProfilesService;
        $scope.getStartScanText = getStartScanText;
        $scope.getOptionText = getOptionText;
        $scope.startScan = startScan;
        $scope.dropDownAvailable = dropDownAvailable;
        $scope.SchedulerJobService = SchedulerJobService;
        $scope.showDropDown = false;
        $scope.dropDownStyle = "up";
        $scope.editFunc = editFunc;
        $scope.deleteFunc = deleteFunc;
        
        function dropDownAvailable() {
            return $scope.ScanProfilesService.isProfileChangeable($scope.scanProfileWrapper) || 
                $scope.ScanProfilesService.isProfileDeleteable($scope.scanProfileWrapper);
        }

        function getDropdownScanButton() {
            if ($scope.showDropDown) {
                return "dropdownScanButton-active";
            }

            return "dropdownScanButton";
        }

        function editFunc() {
            $scope.$emit("editScanProfile", { newOne: false, scanProfileWrapper: $scope.scanProfileWrapper });
        }

        function deleteFunc() {
            $scope.$emit("deleteScanProfile", { scanProfileWrapper: $scope.scanProfileWrapper });
        }

        function getProfileIconStyle() {
            if ($scope.ScanProfilesService.isUserProfile($scope.scanProfileWrapper)) {
                return "profile-icon-style-user";
            }

            return "profile-icon-style-default";
        }

        function getStartScanText() {
            return translator.getString("customScanProfileEntry.text.startText", null, { profile: $scope.scanProfileWrapper.localizedName });
        }

        function startScan() {
            $scope.SchedulerJobService.startScanWithProfile($scope.scanProfileWrapper.scanProfile.profile_path, $scope.scanProfileWrapper.scanProfile.profile_name);
        }
        
        function getOptionText() {
            return translator.getString("customScanProfileEntry.text.optionText");
        }

        function openDropDown() {
            var elementScrollArea = document.getElementById('menubar-custom-scan-content-container');
            var rectScrollArea = elementScrollArea.getBoundingClientRect();
            var elementDropDown = document.getElementById('menubar-custom-scan-profile-' + $scope.scanProfileWrapper.scanProfile.profile_path + '-drop-down-button');
            var rect = elementDropDown.getBoundingClientRect();
            if (rect.top - 90 < rectScrollArea.top) {
                $scope.dropDownStyle = "down";
            }
            else {
                $scope.dropDownStyle = "up";
            }

            $scope.showDropDown = true;
        }
    }

    return app.directive(name, directive);
};
},{}],83:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "LoggingService", "ScanProfilesService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/profile/custom-scan-select-profile.html',
            scope: {},
            controller: controller
        };
    };
    /**@ngInject*/
    function controller($scope, $timeout, LoggingService, ScanProfilesService) {
        $scope.ScanProfilesService = ScanProfilesService;
        $scope.LoggingService = LoggingService;
        $scope.createNewProfile = createNewProfile;
        $scope.shouldProfileBeShown = shouldProfileBeShown;
        $scope.scanProfilesList = $scope.ScanProfilesService.getSortedScanProfiles();

        $scope.config = {
            axis: 'y' // enable 2 axis scrollbars by default 
        };

        function createNewProfile() {
            $scope.$emit("editScanProfile", { newOne: true, scanProfileWrapper: null });
        }

        function shouldProfileBeShown(scanProfileWrapper) {
            var fileName = scanProfileWrapper.scanProfile.profile_filename;
            if (fileName.indexOf("quicksysscan.avp") === 0 ||
                fileName.indexOf("sysscan.avp") === 0) {
                return false;
            }
            if (scanProfileWrapper.scanProfile.configuration.delete_config === 1) {
                return false;
            }   

            return true;
        };

        $scope.$on('profilesChanged', function () {
            $scope.scanProfilesList = $scope.ScanProfilesService.getSortedScanProfiles();
        });
    }

    return app.directive(name, directive);
};
},{}],84:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./treeview')('treeview', app);
require('./treeview-entry')('treeviewEntry', app);
require('./treeview-entry-collection')('treeviewEntryCollection', app);
require('./treeview-entry-checkbox')('treeviewEntryCheckbox', app);

},{"./treeview":88,"./treeview-entry":87,"./treeview-entry-checkbox":85,"./treeview-entry-collection":86}],85:[function(require,module,exports){
module.exports = function (name, app) {

    var directive = function () {
        return {
            transclude: true,
            restrict: 'AE',
            scope: {
                scanProfileWrapper: "=",
                path: "=",
                isRoot: "=",
                subFileSystem: "=",
                fileSystem: "="
            },
            link: link,
            templateUrl: 'views/directives/scan/profile/filesystem/treeview-entry-checkbox.html',
            controller: controller
        };
    };
    function link(scope, element) {
        element.bind('click', function (e) {
            if (e.stopNextHandler === true) {
                return;
            }
        });
    }

    function controller($rootScope, $scope, CommonService, LoggingService, EventTrackingNamesService, MixPanelService) {
        $scope.getCheckboxStyle = getCheckboxStyle;
        $scope.CommonService = CommonService;
        $scope.changeSelectionState = changeSelectionState;

        function cleanUpProfileList() {
            if ($scope.isRoot === true &&
                $scope.scanProfileWrapper &&
                $scope.scanProfileWrapper.scanProfile &&
                $scope.scanProfileWrapper.scanProfile.search &&
                $scope.scanProfileWrapper.scanProfile.search.path &&
                $scope.scanProfileWrapper.scanProfile.search.path.length > 0) {
                var correctedList = [];
                for (var i4 = 0; i4 < $scope.scanProfileWrapper.scanProfile.search.path.length; i4++) {
                    var pathArrElemNormalized4 = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i4]);
                    var entryFound1 = $scope.subFileSystem.Children.length === 0;
                    for (var i3 = 0; i3 < $scope.subFileSystem.Children.length; i3++) {
                        var pathArrElemNormalized3 = normalizePath($scope.subFileSystem.Children[i3].Path);

                        if (pathArrElemNormalized4.indexOf(pathArrElemNormalized3) === 0) {
                            entryFound1 = true;
                        }
                    }

                    if (entryFound1 === true) {
                        correctedList.push($scope.scanProfileWrapper.scanProfile.search.path[i4]);
                    }
                }

                removeAll();
                for (var i5 = 0; i5 < correctedList.length; i5++) {
                    $scope.scanProfileWrapper.scanProfile.search.path.push(correctedList[i5]);
                }
            }
        }

        function normalizePath(path) {
            if (!path) {
                return path;
            }
            if (path.charAt(path.length - 1) !== '\\') {
                path += "\\";
            }

            return path;
        }

        function getCheckboxStyle() {
            var type = getSelectionType();
            switch (type) {
            case "itemSelected":
                return "treeview-checkboxBox-checked";
            case "subItemSelected":
                return "treeview-checkboxBox-partial-checked";
            default:
                return "treeview-checkboxBox";
            }
        }

        function addItem(path) {
            if (!$scope.scanProfileWrapper.scanProfile.search.path) {
                $scope.scanProfileWrapper.scanProfile.search.path = [];
            }
            $scope.scanProfileWrapper.scanProfile.search.path.push(path);
        }

        function removeSubItems(path) {
            var correctedList = [];
            for (var i1 = 0; i1 < $scope.scanProfileWrapper.scanProfile.search.path.length; i1++) {
                var pathNormalized = normalizePath(path);
                var pathArrElemNormalized = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i1]);

                if (pathArrElemNormalized !== pathNormalized && pathArrElemNormalized.indexOf(pathNormalized) !== 0) {
                    correctedList.push($scope.scanProfileWrapper.scanProfile.search.path[i1]);
                }
            }

            removeAll();
            for (var i5 = 0; i5 < correctedList.length; i5++) {
                $scope.scanProfileWrapper.scanProfile.search.path.push(correctedList[i5]);
            }
        }

        function removeItem(path) {
            var correctedList = [];
            for (var i1 = 0; i1 < $scope.scanProfileWrapper.scanProfile.search.path.length; i1++) {
                var pathNormalized = normalizePath(path);
                var pathArrElemNormalized = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i1]);

                if (pathArrElemNormalized !== pathNormalized) {
                    correctedList.push($scope.scanProfileWrapper.scanProfile.search.path[i1]);
                }
            }

            removeAll();
            for (var i5 = 0; i5 < correctedList.length; i5++) {
                $scope.scanProfileWrapper.scanProfile.search.path.push(correctedList[i5]);
            }
        }

        function isItemDirectlySelected() {
            for (var i1 = 0; i1 < $scope.scanProfileWrapper.scanProfile.search.path.length; i1++) {
                var pathNormalized = normalizePath($scope.path);
                var pathArrElemNormalized = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i1]);

                if (pathArrElemNormalized === pathNormalized) {
                    return true;
                }
            }

            return false;
        }

        function getListedElement(path) {
            var pathNormalized = normalizePath(path);
            for (var i1 = 0; i1 < $scope.scanProfileWrapper.scanProfile.search.path.length; i1++) {
                var pathArrElemNormalized = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i1]);

                if (pathNormalized.indexOf(pathArrElemNormalized) === 0) {
                    return $scope.scanProfileWrapper.scanProfile.search.path[i1];
                }
            }

            return $scope.scanProfileWrapper.scanProfile.search.path;
        }

        function searchListedElement(listedElementNormalized, current) {
            var currentPathNormalized = normalizePath(current.Path);
            if (listedElementNormalized === currentPathNormalized) {
                return current;
            }

            var children = current.Children;
            if (children.length === 0) {
                children = loadChildrenWhenNotDoneYet(current);
            }

            for (var i1 = 0; i1 < children.length; i1++) {
                var childrenNormalized = normalizePath(children[i1].Path);
                if (listedElementNormalized.indexOf(childrenNormalized) !== 0) {
                    continue;
                }

                var result = searchListedElement(listedElementNormalized, children[i1]);
                if (result !== null) {
                    return result;
                }
            }

            return null;
        }

        function loadChildrenWhenNotDoneYet(currentFolder) {
            if ($scope.isRoot && currentFolder.Children.length === 0) {
                return $scope.CommonService.getThisComputer()[0].Children;
            }

            if (currentFolder.Children.length === 0) {
                var children = $scope.CommonService.getFolders(currentFolder.Path);

                if (children === null || children.length === 0) {
                    var msg = "Could not get children of " + currentFolder.Path + " from Connect Client in checkbox function";
                    LoggingService.Error(msg);

                    MixPanelService.TrackEvent(EventTrackingNamesService.ConnectDataError,
                        {
                            Message: "Could not get children from Connect Client"
                        });
                }

                return children;
            }

            return currentFolder.Children;
        }

        function addAllOtherElementsInFolder(currentFolder) {
            var normalizedScopePath = normalizePath($scope.path);

            var children = loadChildrenWhenNotDoneYet(currentFolder);
            for (var i1 = 0; i1 < children.length; i1++) {

                var currentNormalized = normalizePath(children[i1].Path);
                if (normalizedScopePath === currentNormalized) {
                    continue;
                }
                else if (normalizedScopePath.indexOf(currentNormalized) === 0) {
                    addAllOtherElementsInFolder(children[i1]);
                } else {
                    addItem(children[i1].Path);
                }
            }
        }

        function isDrive(current) {
            var currentNormalized = normalizePath(current);
            if (currentNormalized.length > 3 ||
                (currentNormalized.length === 3 && currentNormalized.charAt(1) !== ':') ||
                currentNormalized.length < 3) {
                return false;
            }

            return true;
        }

        function removeAll() {
            $scope.scanProfileWrapper.scanProfile.search.path = [];
        }

        function addAllDrives() {
            var drives = getAllDrives();
            for (var i = 0; i < drives.length; i++) {
                addItem(drives[i].Path);
            }
        }

        function getAllDrives() {
            var drives = [];
            for (var i = 0; i < $scope.fileSystem.length; i++) {
                // iterate over My Computer
                var myComputer = $scope.fileSystem[i];
                for (var i1 = 0; i1 < myComputer.Children.length; i1++) {
                    if (isDrive(myComputer.Children[i1].Path) === false) {
                        // skip all non drives here
                        continue;
                    }

                    drives.push(myComputer.Children[i1]);
                }
            }

            return drives;
        }

        function getDrive(path) {
            var pathNormalized = normalizePath(path);
            var drives = getAllDrives();

            for (var i1 = 0; i1 < drives.length; i1++) {

                var current = normalizePath(drives[i1].Path);

                if (isDrive(current) === false) {
                    // skip all non drives here
                    continue;
                }

                if (pathNormalized.indexOf(current) !== 0) {
                    // skip all drives which listed element is not listed 
                    continue;
                }

                return drives[i1];
            }
            return null;
        }

        function areAllChildrensInList(folder, drivesOnly) {

            var children = loadChildrenWhenNotDoneYet(folder);
            for (var i = 0; i < children.length; i++) {
                if (drivesOnly && isDrive(children[i].Path) === false) {
                    continue;
                }

                var pathNormalizedChild = normalizePath(children[i].Path);

                var found = false;

                if (!$scope.scanProfileWrapper.scanProfile.search.path) {
                    $scope.scanProfileWrapper.scanProfile.search.path = [];
                }

                for (var i1 = 0; i1 < $scope.scanProfileWrapper.scanProfile.search.path.length; i1++) {
                    var pathArrElemNormalized = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i1]);

                    if (pathNormalizedChild === pathArrElemNormalized) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }

            return true;
        }

        function toggleEntryToParent(parent) {
            if (areAllChildrensInList(parent, false) === false) {
                return false;
            }

            removeSubItems(parent.Path);
            addItem(parent.Path);
            return true;
        }

        function reorganizeFolder(folder, path) {

            var isCurrentFolder = false;
            var pathNormalized = normalizePath(path);

            var children = loadChildrenWhenNotDoneYet(folder);
            for (var i = 0; i < children.length; i++) {

                var pathNormalizedChild = normalizePath(children[i].Path);

                if (pathNormalizedChild === pathNormalized) {
                    isCurrentFolder = true;
                    break;
                }
                else if (pathNormalized.indexOf(pathNormalizedChild) === 0) {
                    if (reorganizeFolder(children[i], path)) {
                        return toggleEntryToParent(children[i]);
                    }
                }
            }

            if (isCurrentFolder) {
                return true;
            }

            return false;
        }

        function reorganizeList(path) {
            var drive = getDrive(path);

            if (drive == null) {
                return;
            }

            if (reorganizeFolder(drive, path)) {
                toggleEntryToParent(drive);
            }
        }

        function removeItemWhichIsPartOfAnotherSelectedFolder() {
            var listedElement = getListedElement($scope.path);
            var listedElementNormalized = normalizePath(listedElement);
            var drive = getDrive(listedElement);

            if (drive == null) {
                return;
            }

            var listedElementInFileSystem = searchListedElement(listedElementNormalized, drive);
            removeItem(listedElementInFileSystem.Path);
            addAllOtherElementsInFolder(listedElementInFileSystem);
            return;
        }

        function changeSelectionState($event) {
            $event.stopPropagation();
            $event.preventDefault();
            $event.stopNextHandler = true;
            var type = getSelectionType();
            switch (type) {
            case "itemSelected":
                if ($scope.isRoot) {
                    removeAll();
                    break;
                }
                var wasItemDirectlySelected = isItemDirectlySelected();

                if (wasItemDirectlySelected) {
                    removeItem($scope.path);
                } else {
                    removeItemWhichIsPartOfAnotherSelectedFolder();
                }
                break;
            case "subItemSelected":
                if ($scope.isRoot) {
                    removeAll();
                    addAllDrives();
                    $scope.$emit("pathChanged");
                    return;
                }

                removeSubItems($scope.path);
                addItem($scope.path);
                break;
            default:
                if ($scope.isRoot) {
                    removeAll();
                    addAllDrives();
                    $scope.$emit("pathChanged");
                    return;
                }

                addItem($scope.path);
                reorganizeList($scope.path);
                break;
            }

            $scope.$emit("pathChanged");
        }


        function getSelectionType() {
            var pathNormalized = $scope.path;
            if (pathNormalized) {
                pathNormalized = normalizePath(pathNormalized);
            }
            
            if ($scope.isRoot === true) {
                cleanUpProfileList();

                if (areAllChildrensInList($scope.subFileSystem, true) === false) {
                    if ($scope.scanProfileWrapper &&
                        $scope.scanProfileWrapper.scanProfile &&
                        $scope.scanProfileWrapper.scanProfile.search &&
                        $scope.scanProfileWrapper.scanProfile.search.path &&
                        $scope.scanProfileWrapper.scanProfile.search.path.length > 0) {
                        return "subItemSelected";
                    }
                    
                    return "noItemSelected";
                }

                return "itemSelected";
            } else {

                if ($scope.path &&
                    $scope.scanProfileWrapper &&
                    $scope.scanProfileWrapper.scanProfile &&
                    $scope.scanProfileWrapper.scanProfile.search &&
                    $scope.scanProfileWrapper.scanProfile.search.path &&
                    $scope.scanProfileWrapper.scanProfile.search.path.length > 0) {
                    var wasSubPathFound = false;

                    for (var i = 0; i < $scope.scanProfileWrapper.scanProfile.search.path.length; i++) {
                        var pathArrElemNormalized = normalizePath($scope.scanProfileWrapper.scanProfile.search.path[i]);
                        if (pathArrElemNormalized === pathNormalized) {
                            return "itemSelected";
                        }

                        if (pathNormalized.indexOf(pathArrElemNormalized) === 0) {
                            return "itemSelected";
                        }

                        if (pathArrElemNormalized.indexOf(pathNormalized) === 0) {
                            wasSubPathFound = true;
                        }
                    }

                    if (wasSubPathFound) {
                        return "subItemSelected";
                    }
                }
            }
            
            return "noItemSelected";
        }
    }

    return app.directive(name, directive);
};
},{}],86:[function(require,module,exports){
module.exports = function (name, app) {

    var directive = function () {
        return {
            restrict: "AE",
            template: 
             "<div class='treeview-entry-ul'>"
           + "    <div treeview-entry ng-repeat='children in subFileSystem' id='menubar-treeview-entry-ul-{{getPath()}}-entry' is-root='isRoot' sub-file-system='children' file-system='fileSystem' scan-profile-wrapper='scanProfileWrapper'></div>"
           + "</div>",
            replace: true,
            scope: {
                subFileSystem: "=",
                isRoot: "=",
                scanProfileWrapper: "=",
                fileSystem: "="
            },
            controller: controller
        };
    };
    function controller() {
    }

    return app.directive(name, directive);
};
},{}],87:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "CommonService", "EventTrackingNamesService", "LoggingService", "MixPanelService"];
    var directive = function ($compile) {
        return {
            restrict: "AE",
            template: 
              '<div class="treeview-entry-li" id="treeview-entry-li-{{getPath()}}">'
            + '    <div treeview-entry-checkbox id="menubar-treeview-entry-li-{{getPath()}}-checkbox" file-system="fileSystem" class="treeview-entry-checkbox" scan-profile-wrapper="scanProfileWrapper" path="subFileSystem.Path" is-root="isRoot" sub-file-system="subFileSystem" title="{{ subFileSystem.Name }}"></div>'
            + '    <i ng-class="getOpenButtonStyle()" ng-click="changeCollapseState()" title="{{ subFileSystem.Name }}"></i>'
            + '    <i ng-class="getIcon()" ng-click="changeCollapseState()" title="{{ subFileSystem.Name }}"></i>'
            + '    <p class="treeview-entry-text" ng-click="changeCollapseState()" title="{{ subFileSystem.Name }}">{{ subFileSystem.Name }}</p>'
            + '</div>',
            link: function (scope, element) {
                function addElements() {
                    if (scope.subFileSystem && scope.subFileSystem.Children && scope.subFileSystem.Children.length > 0) {
                        $compile("<div treeview-entry-collection id='menubar-treeview-entry-{{getPath()}}-children' file-system='fileSystem' scan-profile-wrapper='scanProfileWrapper' sub-file-system='subFileSystem.Children' is-root='false'></div>")(scope, function (cloned) {
                            element.append(cloned);
                        });
                    }
                }

                scope.$watch("subFileSystem.Children.length", function () {
                    if (scope.subFileSystem && scope.subFileSystem.Children && scope.subFileSystem.Children.length > 0) {
                        addElements();
                    } else {
                        var lightBoxEl = document.getElementById("menubar-treeview-entry-" + scope.getPath() + "-children"),
                            ngLightBoxEl = window.angular.element(lightBoxEl);
                        ngLightBoxEl.remove();
                    }
                });
            },
            replace: true,
            scope: {
                subFileSystem: "=",
                isRoot: "=",
                scanProfileWrapper: "=",
                fileSystem: "="
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, $timeout, CommonService, EventTrackingNamesService, LoggingService, MixPanelService) {
        $scope.getPath = getPath;
        $scope.CommonService = CommonService;
        $scope.changeCollapseState = changeCollapseState;
        $scope.getIcon = getIcon;
        $scope.changePathState = changePathState;
        $scope.getOpenButtonStyle = getOpenButtonStyle;
        function getPath() {
            if ($scope.subFileSystem) {
                if ($scope.isRoot === false) {
                    return $scope.subFileSystem.Path;
                }

                return $scope.subFileSystem.Name;
            }
            return "";
        }

        function getOpenButtonStyle() {

            if ($scope.subFileSystem.Children.length > 0) {
                return "treeview-entry-open-state-icon-down";
            }

            if ($scope.subFileSystem.HasSubFolders) {
                return "treeview-entry-open-state-icon-right";
            }


            return "";
        }

        function getIcon() {
            return "treeview-entry-icon treeview-folder-icon-" + $scope.subFileSystem.Type;
        }

        function clearArray(array) {
            while (array.length) {
                array.pop();
            }
        }

        function changePathState() {

            $scope.$emit("treeviewUpdateScrollbar");
        }

        function changeCollapseState() {
            $timeout(function () {
                if ($scope.subFileSystem.HasSubFolders === false) {
                    return;
                }

                if ($scope.isRoot === false) {
                    if ($scope.subFileSystem.Children.length === 0) {
                        var children = $scope.CommonService.getFolders($scope.subFileSystem.Path);
                        
                        if (children && children.length !== 0) {
                            for (var i1 = 0; i1 < children.length; i1++) {
                                $scope.subFileSystem.Children.push(children[i1]);
                            }
                        } else {
                            var msg = "Could not get children of " + $scope.subFileSystem.Path + " from Connect Client";
                            LoggingService.Error(msg);
                            
                            MixPanelService.TrackEvent(EventTrackingNamesService.ConnectDataError,
                                {
                                    Message: "Could not get children from Connect Client"
                                });
                        }

                        if ($scope.subFileSystem.Children !== null) {
                            $scope.$emit("treeviewUpdateScrollbar");
                            return;
                        }
                    }

                    clearArray($scope.subFileSystem.Children);
                    return;
                } else {
                    if ($scope.subFileSystem.Children.length === 0 && $scope.savedChildren.length !== 0) {
                        $scope.subFileSystem.Children = $scope.savedChildren;
                        $scope.$emit("treeviewUpdateScrollbar");
                        return;
                    }

                    $scope.savedChildren = JSON.parse(JSON.stringify($scope.subFileSystem.Children));
                    clearArray($scope.subFileSystem.Children);
                    $scope.$emit("treeviewUpdateScrollbar");
                    return;
                }
            });
        }
    }

    return app.directive(name, directive);
};
},{}],88:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "LoggingService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/profile/filesystem/treeview.html',
            scope: {
                subFileSystem: "=",
                scanProfileWrapper: "=",
                fileSystem: "="
            },
            controller: controller
        };
    };
    /**@ngInject*/
    function controller($scope, LoggingService) {
        $scope.LoggingService = LoggingService; 
        $scope.hasElements = hasElements;

        function hasElements() {
            return $scope.subFileSystem != null;
        }
    }

    return app.directive(name, directive);
};
},{}],89:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./custom-scan-profile-entry')('customScanProfileEntry', app);

require('./custom-scan-select-profile')('customScanSelectProfile', app);
require('./custom-scan-configure-profile')('customScanConfigureProfile', app);

require('./filesystem');
},{"./custom-scan-configure-profile":81,"./custom-scan-profile-entry":82,"./custom-scan-select-profile":83,"./filesystem":84}],90:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope", "SchedulerJobService"];
    var directive = function () {

        return {
            templateUrl: 'views/directives/scan/quick-scan.html',
            scope: {
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, SchedulerJobService) {
        $scope.startQuickScan = SchedulerJobService.startQuickScan;
    }


    return app.directive(name, directive);
};
},{}],91:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "$document", "LoggingService", "ScanProfilesService", "CommonService"];
    var directive = function () {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/scan/scan-entry-drop-down.html',
            scope: {
                showDropDown: "=",
                dropDownStyle: "=",
                identifier: "@",
                isChangeable: "=",
                isDeleteable: "=",
                buttonId: "@",
                editCallback: '&',
                deleteCallback: '&'
            },
            controller: controller,
            link: link
        };
    };

    /**@ngInject*/
    function controller($scope, $timeout, $document, LoggingService, ScanProfilesService, CommonService) {
        $scope.editMenuClicked = editMenuClicked;
        $scope.deleteMenuClicked = deleteMenuClicked;
        $scope.getMenuStyle = getMenuStyle;
        $scope.closeInfoMenu = closeInfoMenu;
        $scope.mouseOver = mouseOver;
        $scope.ScanProfilesService = ScanProfilesService;
        $scope.getEntryStyle = getEntryStyle;
        $scope.hovered =
        {
            "Edit": false,
            "Delete": false
            };


        $scope.$watch('identifier',
            function () {
                $scope.identifierNormalized = CommonService.normalizeIdentifier($scope.identifier);
            });

        $scope.$on('aviraSecureClickEvent',
            function (e, event) {
                if ($scope.showDropDown) {
                    var closestTarget = $(event.target).closest('div');

                    if (closestTarget && closestTarget.length > 0) {
                        if ((closestTarget[0].id.indexOf('menubar-scan-' + $scope.identifierNormalized + '-drop-down') === -1
                            && closestTarget[0].id.indexOf('menubar-scan-' + $scope.identifier + '-drop-down') === -1)
                            && closestTarget[0].id.indexOf($scope.buttonId) === -1) {
                            $scope.closeInfoMenu();
                        }
                    }
                }
            });

        function closeInfoMenu() {
            $timeout(function () {
                $scope.showDropDown = false;
            });
        }
        
        function mouseOver(hovered, value) {
            if (isButtonActive(hovered)) {
                $scope.hovered[hovered] = value;
            } else {
                $scope.hovered[hovered] = false;
            }
        }

        function isButtonActive(type) {
            if (type === 'Edit') {
                return $scope.isChangeable;
            }
            else if (type === 'Delete') {
                return $scope.isDeleteable;
            }

            return false;
        }

        function getEntryStyle(type) {
            if (isButtonActive(type)) {
                return "scan-drop-down-menu-entry";
            }

            return "scan-drop-down-menu-entry-inactive";
        }

        function getMenuStyle() {
            switch ($scope.dropDownStyle) {
                case "down":
                    {
                        if ($scope.hovered["Edit"] === true) {
                            return "scan-drop-down-menu-down scan-drop-down-menu-hovercolor clearfix";
                        }

                        return "scan-drop-down-menu-down clearfix";
                    }
                case "up": {
                    if ($scope.hovered["Delete"] === true) {
                        return "scan-drop-down-menu-up scan-drop-down-menu-hovercolor clearfix";
                    }

                    return "scan-drop-down-menu-up clearfix";
                }
                default: {
                    LoggingService.Error("Unknown style: " + $scope.dropDownStyle);
                }
            }
        }

        function editMenuClicked() {
            if (isButtonActive("Edit")) {
                $scope.closeInfoMenu();
                $scope.editCallback();
            }
        }

        function deleteMenuClicked() {
            if (isButtonActive("Delete")) {
                $scope.closeInfoMenu();
                $scope.deleteCallback();
            }
        }
    }

    /**@ngInject*/
    function link() {
        // empty
    }

    return app.directive(name, directive);
};
},{}],92:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "LoggingService", "SchedulerJobService", "ConfigurationService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/scheduled-scan.html',
            scope: {},
            controller: controller
        };
    };
    /**@ngInject*/
    function controller($scope, LoggingService, SchedulerJobService, ConfigurationService) {
        $scope.isCreateScan = false;
        $scope.SchedulerJobService = SchedulerJobService;

        $scope.$on('deleteScheduledScan', function (event, data) {
            ConfigurationService.CheckPasswordProtection("create_job", data, onDeleteScheduledScanJob);
        });

        $scope.$on('editScheduledScan', function (event, data) {
            $scope.isCreateScan = true;
            $scope.$broadcast("updateConfigureScanPage", data);
        });

        $scope.$on('editScheduledScanCanceled', function (event, data) {
            $scope.isCreateScan = false;
        });

        $scope.$on('editScheduledScanFinished', function (event, data) {
            if (data.newOne) {
                $scope.SchedulerJobService.createJob(data.schedulerJobWrapper);
            }
            else {
                $scope.SchedulerJobService.changeJob(data.schedulerJobWrapper);
            }

            $scope.isCreateScan = false;
        });

        function onDeleteScheduledScanJob(value, result) {
            if (!result) {
                return;
            }

            $scope.SchedulerJobService.deleteJob(value.schedulerJobWrapper);
        }
    }

    return app.directive(name, directive);
};
},{}],93:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./scheduled-scan-select-week-days')('scheduledScanSelectWeekDays', app);
require('./scheduled-scan-select-week-day')('scheduledScanSelectWeekDay', app);
require('./scheduled-scan-entry')('scheduledScanEntry', app);
require('./scheduled-scan-select-scan')('scheduledScanSelectScan', app);
require('./scheduled-scan-configure-scan')('scheduledScanConfigureScan', app);
},{"./scheduled-scan-configure-scan":94,"./scheduled-scan-entry":95,"./scheduled-scan-select-scan":96,"./scheduled-scan-select-week-day":97,"./scheduled-scan-select-week-days":98}],94:[function(require,module,exports){
var SchedulerJobWrapper = require('../../../model/SchedulerJobModelWrapper');

module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "CommonService", "IeInformationService", "translator", "ScanProfilesService", "LoggingService", "ConfigurationService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/scheduler/scheduled-scan-configure-scan.html',
            scope: {
            },
            controller: controller
        };
    };    

    /**@ngInject*/
    function controller($scope, $timeout, CommonService, IeInformationService, translator, ScanProfilesService, LoggingService, ConfigurationService) {
        $scope.CommonService = CommonService; 
        
        $scope.isJobRunning = isJobRunning;
        $scope.showElement = false;
        $scope.isModeCreate = false;
        $scope.getSaveButtonTitle = getSaveButtonTitle; 
        $scope.schedulerJobWrapper = null;
        $scope.getButtonText = getButtonText;
        $scope.getTitleText = getTitleText;
        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.getInvalidTimeText = getInvalidTimeText;
        $scope.getSelectModePlaceHolder = getSelectModePlaceHolder;
        $scope.getSelectModeEmptyFieldError = getSelectModeEmptyFieldError;
        $scope.getSelectProfilePlaceHolder = getSelectProfilePlaceHolder;
        $scope.getSelectProfileEmptyFieldError = getSelectProfileEmptyFieldError;
        $scope.getScanDescriptionPlaceHolder = getScanDescriptionPlaceHolder;
        $scope.getScanDescriptionEmptyFieldError = getScanDescriptionEmptyFieldError;
        $scope.getScanDescriptionTooLongError = getScanDescriptionTooLongError;
        $scope.getScanDescriptionTooShortError = getScanDescriptionTooShortError;
        $scope.getScanDescriptionInvalidError = getScanDescriptionInvalidError;
        $scope.getScanNamePlaceHolder = getScanNamePlaceHolder;
        $scope.getScanNameEmptyFieldError = getScanNameEmptyFieldError;
        $scope.getScanNameTooLongError = getScanNameTooLongError;
        $scope.getScanNameTooShortError = getScanNameTooShortError;
        $scope.getScanNameInvalidError = getScanNameInvalidError;
        

        var dailyText = translator.getString("scheduledScanConfigureScan.text.intervalDropDownEntryDaily");
        $scope.weeklyText = translator.getString("scheduledScanConfigureScan.text.intervalDropDownEntryWeekly");
        $scope.scanProfileList = [];
        $scope.modeList = [
            {
                text: dailyText,
                name: "daily"
            },
            {
                text: $scope.weeklyText,
                name: "weekly"
            }
        ];
        $scope.ScanProfilesService = ScanProfilesService;

        $scope.$on('updateConfigureScanPage', function (event, data) {
            ConfigurationService.CheckPasswordProtection("create_job", data, onChangeScheduledScanJob);
        });

        function onChangeScheduledScanJob(value, result) {
            if (!result) {
                cancel();
                return;
            }

            apply(value);
        }

        function getInvalidTimeText () {
            return translator.getString("scheduledScanConfigureScan.text.errorInvalidTime");
        }

        function getSelectModePlaceHolder() {
            return translator.getString("scheduledScanConfigureScan.text.placeholderSelectMode");
        }

        function getSelectModeEmptyFieldError() {
            return translator.getString("scheduledScanConfigureScan.text.selectModeErrorEmptyField");
        }

        function getSelectProfilePlaceHolder() {
            return translator.getString("scheduledScanConfigureScan.text.placeholderSelectProfile");
        }

        function getSelectProfileEmptyFieldError() {
            return translator.getString("scheduledScanConfigureScan.text.selectProfileErrorEmptyField");
        }

        function getScanDescriptionPlaceHolder() {
            return translator.getString("scheduledScanConfigureScan.text.placeholderScanDescription");
        }

        function getScanDescriptionEmptyFieldError() {
            return translator.getString("scheduledScanConfigureScan.text.scanDescriptionErrorEmptyField");
        }

        function getScanDescriptionTooLongError() {
            return translator.getString("scheduledScanConfigureScan.text.scanDescriptionErrorTooLong");
        }

        function getScanDescriptionTooShortError() {
            return translator.getString("scheduledScanConfigureScan.text.scanDescriptionErrorTooShort");
        }

        function getScanDescriptionInvalidError() {
            return translator.getString("scheduledScanConfigureScan.text.scanDescriptionErrorInvalid");
        }

        function getScanNamePlaceHolder() {
            return translator.getString("scheduledScanConfigureScan.text.placeholderScanName");
        }

        function getScanNameEmptyFieldError() {
            return translator.getString("scheduledScanConfigureScan.text.scanNameErrorEmptyField");
        }

        function getScanNameTooLongError() {
            return translator.getString("scheduledScanConfigureScan.text.scanNameErrorTooLong");
        }

        function getScanNameTooShortError() {
            return translator.getString("scheduledScanConfigureScan.text.scanNameErrorTooShort");
        }

        function getScanNameInvalidError() {
            return translator.getString("scheduledScanConfigureScan.text.scanNameErrorInvalid");
        }

        function isJobRunning() {
            if ($scope.isModeCreate || $scope.schedulerJobWrapper === null) {
                return false;
            }

            return $scope.schedulerJobWrapper.isChangeable === false ||
                $scope.schedulerJobWrapper.isDeleteable === false;
        }

        
        function getSaveButtonTitle() {
            if (isJobRunning()) {
                return translator.getString("scheduledScanConfigureScan.text.saveTirleErrorJobRunning");
            }

            return "";
        }

        function getProfileText(profile) {
            if ($scope.scanProfileList) {
                for (var i = 0; i < $scope.scanProfileList.length; i++) {
                    if ($scope.scanProfileList[i].name === profile) {
                        return $scope.scanProfileList[i].text;
                    }
                }
            }

            LoggingService.Error("Invalid profile: " + profile);
            return "";
        }

        function getProfile(profileText) {
            if ($scope.scanProfileList) {
                for (var i = 0; i < $scope.scanProfileList.length; i++) {
                    if ($scope.scanProfileList[i].text === profileText) {
                        return $scope.scanProfileList[i].name;
                    }
                }
            }

            LoggingService.Error("Invalid profile text: " + profileText);
            return "";
        }

        function getModeText(mode) {
            if (mode.toLowerCase() === "daily") {
                return dailyText;
            }
            else if (mode.toLowerCase() === "weekly") {
                return $scope.weeklyText;
            }

            LoggingService.Error("Invalid mode: " + mode);
            return "";
        }

        function getMode(modeText) {
            if (modeText === dailyText) {
                return "daily";
            }
            else if (modeText === $scope.weeklyText) {
                return "weekly";
            }

            LoggingService.Error("Invalid mode text: " + modeText);
            return "";
        }

        function apply(data) {
            $scope.isJobNameValid = true;
            $scope.isStartTimeValid = true;
            $scope.isProfileSelected = true;
            $scope.isModeSelected = true;
            $scope.isDescriptionValid = true;
            $scope.isWeekDaysValid = true;
            $scope.showElement = true;
            $scope.isStartMissedJobsSelected = false;
            $scope.selectStartMissedJobsItem = selectStartMissedJobsItem;
            $scope.getStartMissedJobsCheckboxStyle = getStartMissedJobsCheckboxStyle;
            $scope.getStartMissedJobsCheckboxIconStyle = getStartMissedJobsCheckboxIconStyle;

            if (data.newOne) {
                $scope.showBackgroundTextName = true;
                $scope.showBackgroundTextStartTime = true;
                $scope.showBackgroundTextDescription = true;
                $scope.showBackgroundTextProfile = true;
                $scope.showBackgroundTextMode = true;
                $scope.isStartMissedJobsSelected = false;
                $scope.isModeCreate = true;
                $scope.schedulerJobWrapper = new SchedulerJobWrapper();
                $scope.schedulerJobWrapper.id = $scope.CommonService.generateUuid();
                $scope.schedulerJobWrapper.schedulerJob.visible = true;
                $scope.schedulerJobWrapper.schedulerJob.job_state = "stopped";
                $scope.schedulerJobWrapper.schedulerJob.delete_job = false;
                $scope.schedulerJobWrapper.schedulerJob.enabled = true;
                $scope.schedulerJobWrapper.schedulerJob.job_type = "scan";
                $scope.modeText = "";
                $scope.profileText = "";
                $scope.startTimeText = "";
                $timeout(function () { $scope.$broadcast("valueChanged", {}); });
            }
            else {
                $scope.isModeCreate = false;
                $scope.schedulerJobWrapper = JSON.parse(JSON.stringify(data.schedulerJobWrapper));
                $scope.showBackgroundTextStartTime = !$scope.schedulerJobWrapper.schedulerJob.start_time ||
                    $scope.schedulerJobWrapper.schedulerJob.start_time.length === 0;
                $scope.showBackgroundTextName = !$scope.schedulerJobWrapper.schedulerJob.name ||
                    $scope.schedulerJobWrapper.schedulerJob.name.length === 0;
                $scope.showBackgroundTextDescription = !$scope.schedulerJobWrapper.schedulerJob.description ||
                    $scope.schedulerJobWrapper.schedulerJob.description.length === 0;
                $scope.showBackgroundTextProfile = !$scope.schedulerJobWrapper.schedulerJob.profile ||
                    $scope.schedulerJobWrapper.schedulerJob.profile.length === 0;
                $scope.showBackgroundTextMode = !$scope.schedulerJobWrapper.schedulerJob.mode ||
                    $scope.schedulerJobWrapper.schedulerJob.mode.length === 0;

                $scope.nameText = $scope.schedulerJobWrapper.schedulerJob.name;
                $scope.descriptionText = $scope.schedulerJobWrapper.schedulerJob.description;

                $scope.modeText = getModeText($scope.schedulerJobWrapper.schedulerJob.mode);
                $scope.profileText = getProfileText($scope.schedulerJobWrapper.schedulerJob.profile);
                $scope.startTimeText = $scope.schedulerJobWrapper.schedulerJob.start_time;
                $scope.isStartMissedJobsSelected = $scope.schedulerJobWrapper.schedulerJob.start_missed_job;
                $timeout(function () { $scope.$broadcast("valueChanged", {}); });
            }
        }

        function reset() {
            $scope.nameText = "";
            $scope.descriptionText = "";
            $scope.modeText = "";
            $scope.profileText = "";
            $scope.startTimeText = ""; 
            $scope.showBackgroundTextName = true;
            $scope.showBackgroundTextStartTime = true;
            $scope.showBackgroundTextDescription = true;
            $scope.showBackgroundTextProfile = true;
            $scope.showBackgroundTextMode = true;
            $scope.isStartMissedJobsSelected = false;
            $scope.isJobNameValid = true;
            $scope.isStartTimeValid = true;
            $scope.isProfileSelected = true;
            $scope.isModeSelected = true;

            $scope.isDescriptionValid = true;
            $scope.isWeekDaysValid = true;
            $scope.$broadcast("valueReset", {});
        }

        function cancel() {
            reset(); 
            $scope.$broadcast("reset");
            $scope.$emit("editScheduledScanCanceled", { newOne: $scope.isModeCreate, schedulerJobWrapper: $scope.schedulerJobWrapper });
            $scope.showElement = false;
            $scope.schedulerJobWrapper = new SchedulerJobWrapper();
            $scope.schedulerJobWrapper.id = $scope.CommonService.generateUuid();
        }
        
        function submit() {

            $scope.$broadcast("validate");
            $timeout(function () {
                if (isValid()) {
                    $scope.schedulerJobWrapper.schedulerJob.name = $scope.nameText;
                    $scope.schedulerJobWrapper.schedulerJob.description = $scope.descriptionText;
                    $scope.schedulerJobWrapper.schedulerJob.mode = getMode($scope.modeText);
                    $scope.schedulerJobWrapper.schedulerJob.profile = getProfile($scope.profileText);
                                        
                    var localStartTime = moment($scope.startTimeText, moment.ISO_8601);
                    var startTimeUtc = moment(localStartTime).utc();
                     
                    $scope.schedulerJobWrapper.schedulerJob.start_time =
                        startTimeUtc.format("1970-01-01THH:mm:ss");
                    $scope.schedulerJobWrapper.schedulerJob.start_missed_job = $scope.isStartMissedJobsSelected;

                    $scope.$broadcast("reset");
                    $scope.$emit("editScheduledScanFinished",
                        { newOne: $scope.isModeCreate, schedulerJobWrapper: $scope.schedulerJobWrapper });
                    reset();
                    $scope.showElement = false;
                }
            });
        }
        function shouldProfileBeShown(scanProfileWrapper) {
            if (scanProfileWrapper.scanProfile.delete_config === 1) {
                return false;
            }

            return true;
        };
        $scope.$on('profilesChanged', function () {
            getProfileList();
        });

        function getProfileList() {
            var scanProfilesList = $scope.ScanProfilesService.getSortedScanProfiles();
            $scope.scanProfileList = [];
            for (var i = 0; i < scanProfilesList.length; i++) {
                if (shouldProfileBeShown(scanProfilesList[i])) {
                    $scope.scanProfileList.push(
                        {
                            text: scanProfilesList[i].localizedName,
                            name: scanProfilesList[i].scanProfile.profile_path
                        });
                }
            }
        }

        function getTitleText() {
            if ($scope.isModeCreate) {
                return translator.getString("scheduledScanConfigureScan.text.headingCreate");
            }
            else {
                return translator.getString("scheduledScanConfigureScan.text.headingEdit");
            }
        }

        function isValid() {
            return $scope.isJobNameValid &&
                $scope.isDescriptionValid &&
                $scope.isProfileSelected &&
                $scope.isModeSelected &&
                ($scope.weeklyText !== $scope.modeText || $scope.isWeekDaysValid )&&
                $scope.isStartTimeValid;
        }

        function getButtonText() {
            if ($scope.isModeCreate) {
                return translator.getString("scheduledScanConfigureScan.button.create");
            }
            
            return translator.getString("scheduledScanConfigureScan.button.save");
        }

        function selectStartMissedJobsItem() {
            $scope.isStartMissedJobsSelected = !$scope.isStartMissedJobsSelected;
        }

        function getStartMissedJobsCheckboxStyle() {

            if ($scope.isStartMissedJobsSelected) {
                if (IeInformationService.IsIE() === false) {
                    return "start-missed-jobs-checkboxBox-checked-noIE";
                }

                return "start-missed-jobs-checkboxBox-checked";
            }

            if (IeInformationService.IsIE() === false) {
                return "start-missed-jobs-checkboxBox-noIE";
            }
            return "start-missed-jobs-checkboxBox";
        }

        function getStartMissedJobsCheckboxIconStyle() {
            if (IeInformationService.IsIE() === false) {
                return "start-missed-jobs-checkboxBoxIcon-noIE";
            }

            return "start-missed-jobs-checkboxBoxIcon";
        }

        reset();
        getProfileList();
    }
    return app.directive(name, directive);
};
},{"../../../model/SchedulerJobModelWrapper":121}],95:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "LoggingService", "translator", "SchedulerJobService", "CommonService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/scheduler/scheduled-scan-entry.html',
            scope: {
                schedulerJobWrapper: '='
            },
            controller: controller
        };
    };

    /**@ngInject*/
    function controller($scope, LoggingService, translator, SchedulerJobService, CommonService) {
        $scope.openDropDown = openDropDown;
        $scope.getDropdownScanButton = getDropdownScanButton;
        $scope.getOptionText = getOptionText;
        $scope.dropDownAvailable = dropDownAvailable;
        $scope.SchedulerJobService = SchedulerJobService;
        $scope.showDropDown = false;
        $scope.dropDownStyle = "up";
        $scope.editFunc = editFunc;
        $scope.deleteFunc = deleteFunc;
        $scope.isJobChangeable = isJobChangeable;
        $scope.isJobDeleteable = isJobDeleteable;
        $scope.getIntervalText = getIntervalText;
        $scope.getLastExecutionTimeText = getLastExecutionTimeText;
        
        function isJobDeleteable() {
            return $scope.schedulerJobWrapper.isDeleteable;
        }

        function isJobChangeable() {
            if ($scope.schedulerJobWrapper.isChangeable) {
                if ($scope.schedulerJobWrapper.schedulerJob.mode.toLowerCase() === "interval" ||
                    $scope.schedulerJobWrapper.schedulerJob.mode.toLowerCase() === "login") {
                    return false;
                }

                return true;
            }

            return false;
        }

        function getLastExecutionTimeText() {
            var neverPerformedText = translator.getString("scheduledScanEntry.text.scanNeverPerformed");
            if (!$scope.schedulerJobWrapper.schedulerJob.last_start_time ||
                $scope.schedulerJobWrapper.schedulerJob.last_start_time === "") {
                return neverPerformedText;
            }
            
            var utcLastStartTime = moment.utc($scope.schedulerJobWrapper.schedulerJob.last_start_time, moment.ISO_8601);

            if (utcLastStartTime.isValid() === false) {
                return neverPerformedText;
            }

            var localLastStartTime = moment(utcLastStartTime).local();
            if (localLastStartTime.isValid() === false || localLastStartTime.year() <= 1970) {
                return neverPerformedText;
            }

            var currentYear = moment().local().year();
            var lastScanDate;
            if (localLastStartTime.year() < currentYear) {
                lastScanDate =
                    localLastStartTime.format(translator.getString("dateWithWeekdayWithoutTimeWithYear", "time-format"));
            } else {
                lastScanDate =
                    localLastStartTime.format(translator.getString("dateWithWeekdayWithoutTimeWithoutYear", "time-format"));
            }
            return translator.getString("scheduledScanEntry.text.lastScan", null, { lastScanDate: lastScanDate });
        }

        function getIntervalText() {
            var utcStartTime = moment.utc($scope.schedulerJobWrapper.schedulerJob.start_time, moment.ISO_8601);
            var localStartTime = moment(utcStartTime).local();
            
            var time = localStartTime.format(translator.getString("time", "time-format"));

            if ($scope.schedulerJobWrapper.schedulerJob.mode.toLowerCase() === "daily") {
                return translator.getString("scheduledScanEntry.text.startDaily", null, 
                    {
                        time: time
                    });
            }
            else if($scope.schedulerJobWrapper.schedulerJob.mode.toLowerCase() === "login") {
                return translator.getString("scheduledScanEntry.text.startAfterLogin");
            }
            else if ($scope.schedulerJobWrapper.schedulerJob.mode.toLowerCase() === "interval") {
                var interval = $scope.schedulerJobWrapper.schedulerJob.interval;

                var daysNumber = Math.floor(interval / 24 / 60);
                interval = interval - (daysNumber * 24 * 60);

                var hours = Math.floor(interval / 60);
                interval = interval - (hours * 60);

                var minutes = interval;

                var daysStr = translator.getPlural(
                    daysNumber, "scheduledScanEntry.text.intervalContentDays", null, { days: daysNumber });

                var hoursStr = translator.getPlural(
                    hours, "scheduledScanEntry.text.intervalContentHours", null, { hours: hours });

                var minutesStr = translator.getPlural(
                    minutes, "scheduledScanEntry.text.intervalContentMinutes", null, { minutes: minutes });

                if (daysNumber > 0 && hours > 0 && minutes > 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalDaysHoursMinutes", null, 
                        {
                            daysStr: daysStr,
                            hoursStr: hoursStr,
                            minutesStr: minutesStr
                        });
                }
                else if (daysNumber > 0 && hours > 0 && minutes === 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalDaysHours", null, 
                        {
                            daysStr: daysStr,
                            hoursStr: hoursStr
                        });
                }
                else if (daysNumber > 0 && hours === 0 && minutes > 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalDaysMinutes", null, 
                        {
                            daysStr: daysStr,
                            minutesStr: minutesStr
                        });
                }
                else if (daysNumber > 0 && hours === 0 && minutes === 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalDays", null, 
                        {
                            daysStr: daysStr
                        });
                }
                else if (daysNumber === 0 && hours > 0 && minutes > 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalHoursMinutes", null, 
                        {
                            hoursStr: hoursStr,
                            minutesStr: minutesStr
                        });
                }
                else if (daysNumber === 0 && hours > 0 && minutes === 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalHours", null, 
                        {
                            hoursStr: hoursStr
                        });
                }
                else if (daysNumber === 0 && hours === 0 && minutes > 0) {
                    return translator.getString("scheduledScanEntry.text.startIntervalMinutes", null, 
                        {
                            minutesStr: minutesStr
                        });
                }
            }
            else if ($scope.schedulerJobWrapper.schedulerJob.mode.toLowerCase() === "weekly") {
                var days = "";
                var daysFull = "";
                var daysOfWeek = $scope.schedulerJobWrapper.schedulerJob.days_of_week;
                var sorter = {
                    "sunday": 0,
                    "monday": 1,
                    "tuesday": 2,
                    "wednesday": 3,
                    "thursday": 4,
                    "friday": 5,
                    "saturday": 6
                }

                daysOfWeek = daysOfWeek.sort(function(a, b) {
                    var day1 = a.toLowerCase();
                    var day2 = b.toLowerCase();
                    return sorter[day1] > sorter[day2];
                });

                for (var i1 = 0; i1 < daysOfWeek.length; i1++) {
                    if (i1 !== 0) {
                        days += "/";
                        daysFull += "/";
                    }

                    switch (daysOfWeek[i1].toLowerCase()) {
                        case "sunday":
                            daysFull += translator.getString("weekday.sunday.long", "weekdays");
                            days += translator.getString("weekday.sunday.short", "weekdays");
                            break;
                        case "monday":
                            daysFull += translator.getString("weekday.monday.long", "weekdays");
                            days += translator.getString("weekday.monday.short", "weekdays");
                            break;
                        case "tuesday":
                            daysFull += translator.getString("weekday.tuesday.long", "weekdays");
                            days += translator.getString("weekday.tuesday.short", "weekdays");
                            break;
                        case "wednesday":
                            daysFull += translator.getString("weekday.wednesday.long", "weekdays");
                            days += translator.getString("weekday.wednesday.short", "weekdays");
                            break;
                        case "thursday":
                            daysFull += translator.getString("weekday.thursday.long", "weekdays");
                            days += translator.getString("weekday.thursday.short", "weekdays");
                            break;
                        case "friday":
                            daysFull += translator.getString("weekday.friday.long", "weekdays");
                            days += translator.getString("weekday.friday.short", "weekdays");
                            break;
                        case "saturday":
                            daysFull += translator.getString("weekday.saturday.long", "weekdays");
                            days += translator.getString("weekday.saturday.short", "weekdays");
                            break;
                    }
                }

                return translator.getString("scheduledScanEntry.text.startWeekly", null, 
                    {
                        days: days,
                        time: time
                    });
            }

            return "";
        }

        function dropDownAvailable() {
            return isJobChangeable() || 
                isJobDeleteable();
        }

        function getDropdownScanButton() {
            if ($scope.showDropDown) {
                return "scheduledScanDropdownScanButton dropdownScanButton-active";
            }

            return "scheduledScanDropdownScanButton dropdownScanButton";
        }

        function editFunc() {
            $scope.$emit("editScheduledScan", { newOne: false, schedulerJobWrapper: $scope.schedulerJobWrapper });
        }

        function deleteFunc() {
            $scope.$emit("deleteScheduledScan", { schedulerJobWrapper: $scope.schedulerJobWrapper });
        }
                
        function getOptionText() {
            return translator.getString("scheduledScanEntry.text.optionText");
        }

        function openDropDown() {
            var elementScrollArea = document.getElementById('menubar-scheduled-scan-content-container');
            var rectScrollArea = elementScrollArea.getBoundingClientRect();
            var elementDropDown = document.getElementById('menubar-scheduled-scan-' + $scope.schedulerJobWrapper.schedulerJob.job_filepath + '-drop-down-button');
            var rect = elementDropDown.getBoundingClientRect();
            if (rect.top - 90 < rectScrollArea.top) {
                $scope.dropDownStyle = "down";
            }
            else {
                $scope.dropDownStyle = "up";
            }

            $scope.showDropDown = true;
        }
    }

    return app.directive(name, directive);
};
},{}],96:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "$timeout", "LoggingService", "SchedulerJobService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/scheduler/scheduled-scan-select-scan.html',
            scope: {},
            controller: controller
        };
    };
    /**@ngInject*/
    function controller($scope, $timeout, LoggingService, SchedulerJobService) {
        $scope.SchedulerJobService = SchedulerJobService;
        $scope.LoggingService = LoggingService;
        $scope.createNewSchedulerJob = createNewSchedulerJob;
        $scope.getSortedList = getSortedList;
        $scope.schedulerJobList = $scope.SchedulerJobService.getJobs();
        $scope.getSortedList();
        $scope.shouldJobBeShown = shouldJobBeShown;
        $scope.schedulerJobListSorted = [];

        $scope.config = {
            axis: 'y' // enable 2 axis scrollbars by default 
        };

        function createNewSchedulerJob() {
            $scope.$emit("editScheduledScan", { newOne: true, schedulerJobModelWrapper: null });
        }
        
        function shouldJobBeShown(schedulerJobModelWrapper) {
            if (schedulerJobModelWrapper.schedulerJob.visible === false ||
                schedulerJobModelWrapper.schedulerJob.delete_job === true ||
                schedulerJobModelWrapper.schedulerJob.enabled === false ||
                schedulerJobModelWrapper.schedulerJob.job_type.toLowerCase() !== "scan" || 
                (schedulerJobModelWrapper.schedulerJob.mode.toLowerCase() !== "weekly"
                && schedulerJobModelWrapper.schedulerJob.mode.toLowerCase() !== "daily"
                && schedulerJobModelWrapper.schedulerJob.mode.toLowerCase() !== "interval"
                && schedulerJobModelWrapper.schedulerJob.mode.toLowerCase() !== "login")) {
                return false;
            }


            return true;
        };

        function getSortedList()
        {
             var list = $scope.schedulerJobList.sort(
                 function (a, b) {
                     if (!a.localizedName)
                     {
                         return -1;
                     }
                    return a.localizedName.localeCompare(b.localizedName);
                });
            $scope.schedulerJobListSorted = list;
        }
        $scope.$on('schedulerJobsChanged', function () {
            $scope.schedulerJobList = $scope.SchedulerJobService.getJobs();
            $scope.getSortedList();
        });
    }

    return app.directive(name, directive);
};
},{}],97:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "CommonService"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/scheduler/scheduled-scan-select-week-day.html',
            scope: {
                identifier: "@",
                text: "@", 
                isSelected: "="
            },
            controller: controller
        };
    };    

    /**@ngInject*/
    function controller($scope, CommonService) {
        $scope.changeSelection = changeSelection;
        $scope.getStyle = getStyle;

        $scope.$watch('identifier',
            function () {
                $scope.identifierNormalized = CommonService.normalizeIdentifier($scope.identifier);
            });

        function changeSelection() {
            $scope.isSelected = !$scope.isSelected;
        }

        function getStyle() {
            if ($scope.isSelected) {
                return "menubar-scheduledscan__configure-scan-select-week-day-dot-selected";
            }

            return "menubar-scheduledscan__configure-scan-select-week-day-dot";
        }
    }
    return app.directive(name, directive);
};
},{}],98:[function(require,module,exports){
module.exports = function (name, app) {

    controller.$inject = ["$scope", "translator"];
    var directive = function () {
        return {
            restrict: "A",
            templateUrl: 'views/directives/scan/scheduler/scheduled-scan-select-week-days.html',
            scope: {
                list: "=",
                isValid : "="
            },
            controller: controller
        };
    };    

    /**@ngInject*/
    function controller($scope, translator) {
        $scope.isMondaySelected = false;
        $scope.isTuesdaySelected = false;
        $scope.isWednesdaySelected = false;
        $scope.isThursdaySelected = false;
        $scope.isFridaySelected = false;
        $scope.isSaturdaySelected = false;
        $scope.isSundaySelected = false;
        $scope.getStyle = getStyle;
        $scope.validate = validate;
        $scope.getWeekdayText = getWeekdayText;

        function getWeekdayText(weekday) {
            switch (weekday.toLowerCase()) {
                case "sunday":
                    return translator.getString("weekday.sunday.short", "weekdays");
                case "monday":
                    return translator.getString("weekday.monday.short", "weekdays");
                case "tuesday":
                    return translator.getString("weekday.tuesday.short", "weekdays");
                case "wednesday":
                    return translator.getString("weekday.wednesday.short", "weekdays");
                case "thursday":
                    return translator.getString("weekday.thursday.short", "weekdays");
                case "friday":
                    return translator.getString("weekday.friday.short", "weekdays");
                case "saturday":
                    return translator.getString("weekday.saturday.short", "weekdays");
                default:
                    LoggingService.Error("Unknown weekday: " + weekday);
            }
        }
        
        $scope.$watch('list',
            function () {
                if ($scope.list){
                    $scope.isMondaySelected = false;
                    $scope.isTuesdaySelected = false;
                    $scope.isWednesdaySelected = false;
                    $scope.isThursdaySelected = false;
                    $scope.isFridaySelected = false;
                    $scope.isSaturdaySelected = false;
                    $scope.isSundaySelected = false;

                    for (var i1 = 0; i1 < $scope.list.length; i1++) {
                        switch ($scope.list[i1].toLowerCase()) {
                        case "sunday":
                            $scope.isSundaySelected = true;
                            break;
                        case "monday":
                            $scope.isMondaySelected = true;
                            break;
                        case "tuesday":
                            $scope.isTuesdaySelected = true;
                            break;
                        case "wednesday":
                            $scope.isWednesdaySelected = true;
                            break;
                        case "thursday":
                            $scope.isThursdaySelected = true;
                            break;
                        case "friday":
                            $scope.isFridaySelected = true;
                            break;
                        case "saturday":
                            $scope.isSaturdaySelected = true;
                            break;
                        }
                    }
                }
            });
        $scope.$watch('isSundaySelected',
            function () {
                validate();
            });

        $scope.$watch('isMondaySelected',
            function () {
                validate();
            });

        $scope.$watch('isTuesdaySelected',
            function () {
                validate();
            });

        $scope.$watch('isWednesdaySelected',
            function () {
                validate();
            });

        $scope.$watch('isThursdaySelected',
            function () {
                validate();
            });

        $scope.$watch('isFridaySelected',
            function () {
                validate();
            });

        $scope.$watch('isSaturdaySelected',
            function () {
                validate();
            });

        function validate() {
            $scope.isValid =
                $scope.isMondaySelected ||
                $scope.isTuesdaySelected ||
                $scope.isWednesdaySelected ||
                $scope.isThursdaySelected ||
                $scope.isFridaySelected ||
                $scope.isSaturdaySelected ||
                $scope.isSundaySelected;
            $scope.list = [];
            if ($scope.isSundaySelected) {
                $scope.list.push("sunday");
            }
            if ($scope.isMondaySelected) {
                $scope.list.push("monday");
            }
            if ($scope.isTuesdaySelected) {
                $scope.list.push("tuesday");
            }
            if ($scope.isWednesdaySelected) {
                $scope.list.push("wednesday");
            }
            if ($scope.isThursdaySelected) {
                $scope.list.push("thursday");
            }
            if ($scope.isFridaySelected) {
                $scope.list.push("friday");
            }
            if ($scope.isSaturdaySelected) {
                $scope.list.push("saturday");
            }
        }

        $scope.$on('validate', function (event, data) {
            $scope.validate();
        });

        function getStyle() {
            if ($scope.isValid) {
                return "menubar-scheduledscan__configure-scan-select-week-days-container";
            }

            return "menubar-scheduledscan__configure-scan-select-week-days-alert-container";
        }
    }
    return app.directive(name, directive);
};
},{}],99:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/settings.html',
            scope: {
                location: "@",
                arguments: "@",
                marker: "@"
			},
            controller: 'SettingsController'
        };
    };

    return app.directive(name, directive);
};
},{}],100:[function(require,module,exports){
module.exports = function (name, app) {
    controller.$inject = ["$scope", "$rootScope", "$window", "$timeout", "MixPanelService", "WebsiteLinksService", "EventTrackingNamesService", "translator", "AppStatusService", "AppStatusTranslatorService", "LoggingService", "MessageBroker", "UpdaterService", "IeInformationService", "SchedulerJobService", "FixNowService"];
    var directive = function () {
        return {
            templateUrl: 'views/directives/statusbar.html',
            scope: {},
            controller: controller
        };
    };

    /**@ngInject*/
    function controller(
        $scope,
        $rootScope,
        $window,
        $timeout,
        MixPanelService,
        WebsiteLinksService,
        EventTrackingNamesService,
        translator,
        AppStatusService,
        AppStatusTranslatorService,
        LoggingService,
        MessageBroker,
        UpdaterService,
        IeInformationService,
        SchedulerJobService,
        FixNowService) {
        $scope.isInfiniteProgressShown = false;
        $scope.AppStatusService = AppStatusService;
        $scope.AppStatusTranslatorService = AppStatusTranslatorService;
        $scope.statusLinkAction = "";
        $scope.actionRequired = "";
        $scope.actionText = actionText;
        $scope.fixNowText = "";
        $scope.statusText = statusText;
        $scope.statusbarIcon = statusbarIcon;
        $scope.statusbarColor = statusbarColor;
        $scope.SchedulerJobService = SchedulerJobService;
        $scope.UpdaterService = UpdaterService;
        $scope.FixNowService = FixNowService;
        $scope.fixButtonClicked = fixButtonClicked;
        $scope.isGreyState = $scope.AppStatusService.isGreyState();
        $scope.isIE8 = IeInformationService.isIE8();
        $scope.startUpdateClicked = startUpdateClicked;
        $scope.renewLicenseClicked = renewLicenseClicked;
        var currentJob = null;
        var addItemRunning = false;

        function checkJobAddedASecondAgoLogic(newJob, alreadyAddedJob) {
            if (alreadyAddedJob.jobType === newJob.jobType &&
                moment(alreadyAddedJob.timestampUtc).add(1, 'seconds').unix() > newJob.timestampUtc.unix()) {
                return true;
            }

            return false;
        }

        function checkJobAddedASecondAgo(item) {
            if (currentJob !== null && checkJobAddedASecondAgoLogic(item, currentJob)) {
                return true;
            }

            return false;
        }

        function executeRequest(jobType, callback) {
            var nowUtc = moment().utc();
            var item = {
                callback: callback,
                jobType: jobType,
                timestampUtc: nowUtc
            };

            if (checkJobAddedASecondAgo(item) === true) {
                currentJob = item;
                addItemRunning = false;
                return;
            }

            currentJob = item;
            callback();
            addItemRunning = false;
        }

        function determinateInfiniteProgress()
        {
            if ($scope.AppStatusService.isLicenseExchangeRunning()) {
                $scope.isInfiniteProgressShown = true;
            } else if ($scope.AppStatusService.isFixNowRunning()) {
                $scope.isInfiniteProgressShown = $scope.FixNowService.isRebootPending();
            } else {
                $scope.isInfiniteProgressShown = false;
            }
        }
        $scope.$on('appStatusChanged', function () {
            $scope.isGreyState = $scope.AppStatusService.isGreyState();

            $timeout(function () {
                determinateInfiniteProgress();
            });
        });

        $scope.$on('fixNowDataChanged', function () {
            $timeout(function () {
                determinateInfiniteProgress();
            });
        });

        function actionText() {
            if ($scope.isGreyState || $scope.AppStatusService.isGreyState()) {
                if ($scope.AppStatusService.isUpdateRunning()) {
                    return translator.getString("statusbar.text.actionTextUpdateProgress", null, { progress: $scope.UpdaterService.progress() });
                }
                else if ($scope.AppStatusService.isLicenseExchangeRunning()) {
                    return translator.getString("statusbar.text.actionTextLicenseExchange");
                }
                else if ($scope.AppStatusService.isFixNowRunning()) {

                    if ($scope.FixNowService.isRebootPending()) {
                        return translator.getString("statusbar.text.actionTextRestartPending");
                    }

                    return translator.getString("statusbar.text.actionTextFixNowProgress", null, { progress: $scope.FixNowService.progress() });
                }
            }

            if ($scope.AppStatusService.isGreenState()) {
                return "";
            }
	    
            if ($scope.AppStatusService.isYellowState()) {
                if ($scope.AppStatusService.isLicenseRenewalSuggested()) {
                    return translator.getString("statusbar.text.actionTextRenewNow");
                }
            }

            return $scope.AppStatusTranslatorService.translate($scope.AppStatusService.app_state.last_event_id,
                $scope.AppStatusService.app_state.action_id,
                $scope.AppStatusService.app_state.action_required_count);
        }

        function statusText() {
            if ($scope.isGreyState || $scope.AppStatusService.isGreyState()) {
                if ($scope.AppStatusService.isUpdateRunning()) {
                    return translator.getString("statusbar.text.statusTextUpdating");
                }
                else if ($scope.AppStatusService.isLicenseExchangeRunning()) {
                    return translator.getString("statusbar.text.statusTextRefreshLicense");
                }
                else if ($scope.AppStatusService.isFixNowRunning()) {
                    if ($scope.FixNowService.isRebootPending()) {
                        return translator.getString("statusbar.text.statusTextRestartPending");
                    }

                    return translator.getString("statusbar.text.statusTextFixNow");
                }
            }

            if ($scope.AppStatusService.isGreenState()) {
                return translator.getString("statusbar.text.statusTextComputerIsSafe");
            }
	    
            if ($scope.AppStatusService.isYellowState()) {
                if ($scope.AppStatusService.isLicenseRenewalSuggested()) {
                    return translator.getString("statusbar.text.statusTextLicenseExpiresSoon");
                }
            }

            return translator.getString("statusbar.text.statusTextComputerIsNotSafe");
        }

        function statusbarColor() {
            if ($scope.isGreyState ||
                $scope.AppStatusService.isGreyState()) {
                return "statusbar__grey";
            }

            if ($scope.AppStatusService.isGreenState()) {
                return "statusbar__green";
            }
            
	    if ($scope.AppStatusService.isYellowState()) {
                return "statusbar__orange";
            }

            return "statusbar__red";
        }

        function statusbarIcon() {
            if ($scope.AppStatusService.isGreenState()) {
                return "icon_antivirus-status_ok";
            }

            return "icon_antivirus-attention";
        }

        function fixButtonClicked() {
            if (addItemRunning) {
                $timeout(fixButtonClicked, 10);
                return;
            }

            addItemRunning = true;

            executeRequest("fixNow", executeFixNow);
        }

        function startUpdateClicked() {
            if (addItemRunning) {
                $timeout(startUpdateClicked, 10);
                return;
            }

            addItemRunning = true;
            executeRequest("startUpdate", executeStartUpdate);
        }

        function executeStartUpdate() {
            $scope.SchedulerJobService.startUpdate(function (status_code) {
                if (status_code !== 200) {
                    LoggingService.Error("Trigger update failed with status code: " + status_code);
                    return;
                }
            });
        }

        function executeFixNow() {
            $scope.FixNowService.triggerActions();
        }

        function renewLicenseClicked() {
            if (addItemRunning) {
                $timeout(renewLicenseClicked, 10);
                return;
            }

            addItemRunning = true;

            executeRequest("renewLicense", executeRenewLicense);
        }

        function executeRenewLicense() {
            var url = WebsiteLinksService.getRenew();

            MixPanelService.TrackEvent(EventTrackingNamesService.ButtonClick, { Command: 'Statusbar', Category: 'Renew', Url: url });

            $window.open(url);
        }
    }

    return app.directive(name, directive);
};
},{}],101:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./validation-text-box')('validationTextBox', app);
require('./validation-time-box')('validationTimeBox', app);
require('./validation-drop-down-list')('validationDropDownList', app);
require('./validation-drop-down-list-entry')('validationDropDownListEntry', app);


},{"./validation-drop-down-list":103,"./validation-drop-down-list-entry":102,"./validation-text-box":104,"./validation-time-box":105}],102:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/validation/validation-drop-down-list-entry.html',
            scope: {
                identifier: "@",
                entry: "="
            },
            controller: controller
        };
    };

    function controller($scope, CommonService) {
        $scope.$watch('identifier',
            function () {
                $scope.identifierNormalized = CommonService.normalizeIdentifier($scope.identifier);
            });
    }

    return app.directive(name, directive);
};
},{}],103:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/validation/validation-drop-down-list.html',
            scope: {
                backgroundText: "@",
                identifier: "@",
                isValid: "=",
                required: "=",
                trim: "=",
                text: "=",
                errorEmptyField: "@",
                list: "=",
                selected: "="
            },
            controller: controller
        };
    };

    function controller($scope, $timeout, IeInformationService, CommonService) {
        $scope.IeInformationService = IeInformationService;
        $scope.getTextBoxStyle = getTextBoxStyle;
        $scope.getErrorText = getErrorText;
        $scope.validate = validate;
        $scope.showDropDown = false;
        $scope.openMenu = openMenu;
        $scope.select = select;
        $scope.getMenuStyle = getMenuStyle;
        $scope.mouseOver = mouseOver;
        $scope.getIsMenuOpenedIcon = getIsMenuOpenedIcon; 
        $scope.hovered =
            {
            };

        $scope.config = {
            autoHideScrollbar: true,
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 0,
            axis: 'y'
        };

        $scope.$watch('identifier',
            function () {
                $scope.identifierNormalized = CommonService.normalizeIdentifier($scope.identifier);
            });
        $scope.$on('validate', function (event, data) {
            validate();
        });
        function getErrorText() {  
            if ($scope.form.inputTextBox.$error.required) {
                return $scope.errorEmptyField;
            }

            if (!$scope.form.inputTextBox.$valid) {
                return $scope.errorInvalid;
            }

            return "";
        }


        $scope.$on('reset', function (event, data) {
            $scope.$broadcast("valueReset", {});
        });

        $scope.$on('aviraSecureClickEvent',
            function (e, event) {
                var closest = $(event.srcElement).closest('div');
                var closestTarget = $(event.target).closest('div');
                
                if (closest && closest.length > 0) {
                    if ((closest[0].id.indexOf('menubar-validation-drop-down-list-' + $scope.identifierNormalized) === -1
                        && closest[0].id.indexOf('menubar-validation-drop-down-list-' + $scope.identifier) === -1)
                        && closest[0].className.indexOf('mCSB_') === -1) {
                        closeMenu();
                    }
                }

                if (closestTarget && closestTarget.length > 0) {
                    if ((closestTarget[0].id.indexOf('menubar-validation-drop-down-list-' + $scope.identifierNormalized) === -1
                        && closestTarget[0].id.indexOf('menubar-validation-drop-down-list-' + $scope.identifier) === -1)
                        && closestTarget[0].className.indexOf('mCSB_') === -1) {
                        closeMenu();
                    }
                }
            });

        function validate() {
            if ($scope.form.inputTextBox.$valid === true
                && $scope.form.$valid
                && !$scope.form.inputTextBox.$error.required) {
                $scope.isValid = true;
                $scope.$broadcast("valueChanged", {});
                return;
            }

            $scope.$broadcast("valueChanged", {});
            $scope.isValid = false;
            return;
        }

        function getTextBoxStyle() {

            if ($scope.isValid) {
                return "validation-text-box-valid";
            }
            return "validation-text-box-invalid";
        }

        function closeMenu() {
            openMenu(false);
        }

        function openMenu(value) {
            $timeout(function() {
                 $scope.showDropDown = value;
            });
        }

        function mouseOver(hovered, value) {
            $scope.hovered[hovered] = value;
        }

        function getMenuStyle() {
            if ($scope.list && $scope.list.length > 0 && $scope.hovered[$scope.list[0].name] === true) {
                return "validation-drop-down-menu-down validation-drop-down-menu-hovercolor clearfix";
            }

            return "validation-drop-down-menu-down clearfix";
        }

        function select(entry)
        {
            $scope.selected = entry.name;
            $scope.text = entry.text;
            $timeout(function () {
                validate();
            });

            openMenu(!$scope.showDropDown);
        }

        function getIsMenuOpenedIcon() {
            if ($scope.showDropDown) {
                return "icon_antivirus validation-drop-down-list-icon-selected";
            }

            return "icon_antivirus validation-drop-down-list-icon-notselected";
        }
    }

    return app.directive(name, directive);
};
},{}],104:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/validation/validation-text-box.html',
            scope: {
                backgroundText: "@",
                identifier: "@",
                isValid: "=",
                text: "=",
                required: "=",
                trim: "=",
                errorEmptyField: "@",
                errorTooLong: "@",
                errorTooShort: "@",
                errorInvalid: "@",
                minLength: "=",
                maxLength: "="
            },
            controller: controller
        };
    };

    function controller($scope, IeInformationService, CommonService) {
        $scope.IeInformationService = IeInformationService;
        $scope.getTextBoxStyle = getTextBoxStyle;
        $scope.getErrorText = getErrorText;
        $scope.validate = validate;

        $scope.timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        $scope.$watch('text',
            function () {
                if (!$scope.textTmp || $scope.textTmp.length === 0) {
                    $scope.textTmp = $scope.text;
                }
            });

        $scope.$watch('identifier',
            function () {
                $scope.identifierNormalized = CommonService.normalizeIdentifier($scope.identifier);
            });

        $scope.$on('validate', function (event, data) {
            validate();
        });

        $scope.$on('reset', function (event, data) {
            reset();
        });

        function reset() {
            $scope.textTmp = "";
            $scope.$broadcast("valueReset", {});
        }
        function getErrorText() {  
            if ($scope.required && $scope.form.inputTextBox.$error.required) {
                return $scope.errorEmptyField;
            }

            var ie9CompMode = IeInformationService.isIE9();
            
            var textTmpValue = ie9CompMode ? $('#' + $scope.identifierNormalized).val() : $scope.textTmp;
            var textTmpLength = 0;
            if (textTmpValue) {
                textTmpLength = textTmpValue.length;
            }

            if ($scope.maxLength && (textTmpValue && textTmpLength > $scope.maxLength)) {
                return $scope.errorTooLong;
            }

            if ($scope.minLength && (!textTmpValue || textTmpLength < $scope.minLength - 1)) {
                return $scope.errorTooShort;
            }

            if ($scope.required && !$scope.form.inputTextBox.$valid) {
                return $scope.errorInvalid;
            }

            return "";
        }
        
        function validate() {
            var ie9CompMode = IeInformationService.isIE9();

            if (ie9CompMode) {
                if (!$scope.identifierNormalized) {
                    return;
                }

                var tmp = $('#' + $scope.identifierNormalized);
                if (!tmp) {
                    return;
                }
            }

            var textTmpValue = ie9CompMode ? $('#' + $scope.identifierNormalized).val() : ($scope.textTmp ? $scope.textTmp : "");
            var textTmpLength = 0;
            if (textTmpValue)
            {                
                textTmpLength = textTmpValue.length;
            }

            if (($scope.required && !$scope.form.inputTextBox.$valid) === false
                && ($scope.required && !$scope.form.$valid) === false
                && (!$scope.minLength || (textTmpValue && textTmpLength >= $scope.minLength))
                && (!$scope.maxLength || (!textTmpValue || textTmpLength <= $scope.maxLength))
                && ($scope.required && $scope.form.inputTextBox.$error.required) === false) {

                if (textTmpValue) {
                    $scope.text = textTmpValue;
                } else {
                    $scope.text = "";
                }

                $scope.isValid = true;
                return;
            }

            $scope.isValid = false;
            return;
        }

        function getTextBoxStyle() {

            if ($scope.isValid) {
                return "validation-text-box-valid";
            }
            return "validation-text-box-invalid";
        }

        reset();
    }

    return app.directive(name, directive);
};
},{}],105:[function(require,module,exports){
module.exports = function (name, app) {
    var directive = function () {
        return {
            templateUrl: 'views/directives/validation/validation-time-box.html',
            scope: {
                backgroundText: "@",
                identifier: "@",
                isValid: "=",
                text: "=",
                required: "=",
                trim: "=",
                errorEmptyField: "@",
                errorInvalid: "@"
            },
            controller: controller
        };
    };

    function controller($scope, IeInformationService, CommonService) {
        $scope.IeInformationService = IeInformationService;
        $scope.getTextBoxStyle = getTextBoxStyle;
        $scope.getErrorText = getErrorText;
        $scope.validate = validate;
        $('.menubar-validation-text-inputTextBoxValue').timepicker({ 'timeFormat': 'H:i' });

        $scope.timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        $scope.$watch('text',
            function () {
                if (!$scope.textTmp || $scope.textTmp.length === 0) {
                    if ($scope.text && $scope.text.length > 0) {
                        var utcTime = moment.utc($scope.text, moment.ISO_8601);
                        var localTime = moment(utcTime).local();

                        $scope.textTmp = localTime.format("HH:mm");
                    } else {
                        $scope.textTmp = "";
                    }
                }
            });
        $scope.$watch('identifier',
            function () {
                $scope.identifierNormalized = CommonService.normalizeIdentifier($scope.identifier);
            });
        $scope.$on('validate', function (event, data) {
            validate(true);
        });

        $scope.$on('reset', function (event, data) {
            reset();
        });

        function reset() {
            if ($('.menubar-validation-text-inputTextBoxValue') &&
                $('.menubar-validation-text-inputTextBoxValue').length > 0 &&
                $('.menubar-validation-text-inputTextBoxValue')[0] &&
                $('.menubar-validation-text-inputTextBoxValue')[0].value) {
                $('.menubar-validation-text-inputTextBoxValue')[0].value = null;
            }
            $scope.textTmp = "";
            $scope.$broadcast("valueReset", {});
        }
        function getErrorText() {
            if ($scope.required && $scope.form.inputTextBox.$error.required) {
                return $scope.errorEmptyField;
            }

            if ($scope.required && !$scope.form.inputTextBox.$valid) {
                return $scope.errorInvalid;
            }

            if (!$('.menubar-validation-text-inputTextBoxValue') ||
                $('.menubar-validation-text-inputTextBoxValue').length === 0 ||
                !$('.menubar-validation-text-inputTextBoxValue')[0] ||
                !$('.menubar-validation-text-inputTextBoxValue')[0].value ||
                $('.menubar-validation-text-inputTextBoxValue')[0].value.length === 0) {
                return $scope.errorInvalid;
            }

            if ($scope.timeRegex.test($('.menubar-validation-text-inputTextBoxValue')[0].value) === false) {
                return $scope.errorInvalid;
            }

            return "";
        }
        
        function validate(gotoRed) {
            if (($scope.required && !$scope.form.inputTextBox.$valid) === false
                && ($scope.required && !$scope.form.$valid) === false
                && ($scope.required && $scope.form.inputTextBox.$error.required) === false) {
                if ($scope.timeRegex.test($('.menubar-validation-text-inputTextBoxValue')[0].value) === false) {
                    if (gotoRed) {
                        $scope.isValid = false;
                    }
                    return;
                }

                $scope.text = "1970-01-01T" + $('.menubar-validation-text-inputTextBoxValue')[0].value + ":00";
                $scope.isValid = true;
                $scope.$broadcast("valueChanged", {});
                return;
            }

            if (gotoRed) {
                $scope.isValid = false;
            }

            $scope.$broadcast("valueChanged", {});
            return;
        }

        function getTextBoxStyle() {

            if ($scope.isValid) {
                return "validation-text-box-valid";
            }
            return "validation-text-box-invalid";
        }

        reset();
    }

    return app.directive(name, directive);
};
},{}],106:[function(require,module,exports){
module.exports = function (name, app) {

    function filter() {
        return function(menu, key) {

            return _.filter(menu,
                function(entry) {

                    return key ? (entry.key === key) && isSubMenu(entry) : isSubMenu();

                    function isSubMenu(menu) {
                        return entry.subMenu && entry.subMenu.length > 0;
                    }
                });
        };
    }

    return app.filter(name, filter);
};
},{}],107:[function(require,module,exports){

var app = angular.module('AntivirusApp');

require('./has-submenu-filter')('hasSubMenu', app);

},{"./has-submenu-filter":106}],108:[function(require,module,exports){
Framework = require('frameworkexposed');

angular.module('AntivirusApp', ['LauncherFramework', 'AntivirusLocalization', 'ngRoute', 'ngAnimate', 'ngSanitize', 'ngScrollbars', 'angular-biginteger', 'aviratranslator']);

var app = angular.module('AntivirusApp');

app.config(["ScrollBarsProvider", function (ScrollBarsProvider) {
    ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed 
            enable: false // enable scrolling buttons by default 
        },
        theme: 'avira-theme',
        axis: 'yx' // enable 2 axis scrollbars by default 
    };
}]);

require('./providers');
require('./services');
require('./controllers');
require('./directives');
require('./filters');
},{"./controllers":28,"./directives":47,"./filters":107,"./providers":126,"./services":140,"frameworkexposed":8}],109:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('ActivitiesModel', {
    Set: function (data) {
        this.service_name = data.service_name;
        this.event_id = data.event_id;
        this.language = data.language;
        this.date = moment.utc(data.date, moment.ISO_8601);
        this.module_id = data.module_id;
        this.module = data.module;
        this.type = data.type;
        this.type_id = data.type_id;
        this.title = data.title;
        this.message_id = data.message_id;
        this.message = data.message;
        this.parameters = data.parameters;
    },
    constructor: function () {
        this.service_name = "";
        this.id = 0;
        this.event_id = 0;
        this.language = "";
        this.date = moment.utc();
        this.module_id = 0;
        this.module = "";
        this.type = 0;
        this.type_id = 0;
        this.title = "";
        this.message_id = 0;
        this.message = "";
        this.parameters = [];
    },
});
},{"model":13}],110:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('AboutModel', {
    Set: function (data) {
        this.version = data.version;
        this.product_name = data.product_name;
        this.license_expiration_date = moment.utc(data.license_expiration_date, moment.ISO_8601);
        this.license_type = data.license_type;
        this.vdf_date = moment.utc(data.vdf_date, moment.ISO_8601);
        this.product_id = data.product_id;
        this.is_server_os = data.is_server_os;
        this.license_serial = data.license_serial;
        this.license_owner = data.license_owner;
        this.last_update = moment.utc(data.last_update, moment.ISO_8601);
        this.install_dir = data.install_dir;
        this.engine_version = data.engine_version;
        this.vdf_version = data.vdf_version;
        this.platform_type = data.platform_type;
        this.device_id = data.device_id;
        this.language = data.language;
        this.platform_version = data.platform_version;
        this.subscription = data.subscription;
    },
    GoToRedState: function () {
    },
    constructor: function () {
        this.version = "0.0.0.0";
        this.product_name = "Antivirus";
        this.license_expiration_date = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.license_type = "invalid";
        this.vdf_date = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.product_id = "208";
        this.is_server_os = false;
        this.license_serial = "0000000000-NOTVA-0000000";
        this.license_owner = "anonymous";
        this.last_update = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.install_dir = "";
        this.engine_version = "";
        this.vdf_version = "";
        this.platform_type = "";
        this.device_id = "";
        this.language = "";
        this.platform_version = "";
        this.subscription = false;
    }
});
},{"model":13}],111:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('AppStateModel', {
    Set: function (data) {
        this.status = data.status;
        this.display_text = data.display_text;
        this.systray_state = data.systray_state;
        this.action_id = data.action_id;
        this.action_required_count = data.action_required_count;
        this.last_event_id = data.last_event_id;
        this.last_event_date = moment.utc(data.last_event_date, moment.ISO_8601);
        this.time_out = moment.utc(data.time_out, moment.ISO_8601);
        this.license_renew = data.license_renew;
        this.is_b2b_license = data.is_b2b_license;
        this.is_spotlight_user = data.is_spotlight_user;
    },
    GoToRedState: function () {
        this.status = "action_required";
        this.display_text = "";
        this.systray_state = "not_ok";
        this.action_id = 0;
        this.action_required_count = 0;
        this.last_event_id = -1;
        this.last_event_date = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.time_out = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.license_renew = false;
        this.is_b2b_license = false;
        this.is_spotlight_user = false;
    },
    constructor: function () {
        this.status = "ok";
        this.display_text = "";
        this.systray_state = "ok";
        this.action_id = 0;
        this.action_required_count = 0;
        this.last_event_id = 0;
        this.last_event_date = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.time_out = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.license_renew = false;
        this.is_b2b_license = false;
        this.is_spotlight_user = false;
    },
});
},{"model":13}],112:[function(require,module,exports){
var Model = require('model');
var LastScanResultModel = require('model/AppStatuses/LastScanResultModel');

module.exports = Model.define('LastScanModel', {
    Set: function (data) {
        this.date = moment.utc(data.date, moment.ISO_8601);
        this.result = new LastScanResultModel(data.result);
    },
    GoToRedState: function () {
    },
    constructor: function () {
        this.date = moment.utc("0000-00-00T00:00:00", moment.ISO_8601);
        this.result = new LastScanResultModel();
    },
});
},{"model":13,"model/AppStatuses/LastScanResultModel":113}],113:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('LastScanResultModel', {
    Set: function (data) {
        this.number_files = data.number_files;
        this.number_directories = data.number_directories;
        this.number_malware = data.number_malware;
        this.number_warnings = data.number_warnings;
    },
    constructor: function () {
        this.number_files = 0;
        this.number_directories = 0;
        this.number_malware = 0;
        this.number_warnings = 0;
    },
});
},{"model":13}],114:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('ModulesModel', {
    Set: function (data) {
        this.guard = data.guard;
        this.mailguard = data.mailguard;
        this.webguard = data.webguard;
        this.firewall = data.firewall;
        this.update = data.update;
        this.license = data.license;
        this.extended_ransomware_protection = data.extended_ransomware_protection;
    },
    GoToRedState: function () {
        this.guard = "disabled";
        this.mailguard = "unknown";
        this.webguard = "unknown";
        this.firewall = "unknown";
        this.extended_ransomware_protection = "disabled";
        this.update = "not_ok";
        this.license = "not_ok";
    },
    constructor: function () {
        this.guard = "enabled";
        this.mailguard = "enabled";
        this.webguard = "enabled";
        this.firewall = "enabled";
        this.extended_ransomware_protection = "enabled";
        this.update = "ok";
        this.license = "ok";
    },
});
},{"model":13}],115:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('FixNowModel', {
    Set: function (message) {
        this.progress = message.attributes.progress;
        this.current_action = message.attributes.current_action;
    },
    constructor: function () {
        this.progress = 0;
        this.current_action = "enable_guard";
    }
});

},{"model":13}],116:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('QuarantineModel', {
    Set: function (data, id) {
        this.infection_name = data.infection_name;
        this.source_filepath = data.source_filepath;
        this.quarantine_filepath = data.quarantine_filepath;
        this.date = moment.utc(data.date, moment.ISO_8601);
        this.type = data.type;
        this.restored = data.restored;
        this.clean = data.clean;
        this.operation = data.operation;
        this.id = id;
    },
    constructor: function () {
        this.infection_name = "";
        this.source_filepath = "";
        this.quarantine_filepath = "";
        this.date = moment().utc();
        this.type = "";
        this.restored = false;
        this.clean = false;
        this.operation = "";
        this.id = 0;
    },
});
},{"model":13}],117:[function(require,module,exports){
var Model = require('model');

var ScanProfileModel = require('model/ScanProfile/ScanProfileModel');

module.exports = Model.define('ScanProfileModelWrapper', {
    
    Set: function (data, localizedObj, id) {
        this.id = id;
        this.localizedName = localizedObj.name;
        this.localizedDescription = localizedObj.description;
        this.scanProfile.Set(data);
    },
    constructor: function () {
        this.id = "";
        this.localizedName = "";
        this.localizedDescription = "";
        this.scanProfile = new ScanProfileModel();
    },
});
},{"model":13,"model/ScanProfile/ScanProfileModel":119}],118:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('ScanProfileConfigurationModel', {

    Set: function (data) {
        if (!data) {
            return;
        }

        if (data.delete_config) {
            this.delete_config = data.delete_config;
        }
    },
    constructor: function () {
        this.delete_config = 0;
    }
});
},{"model":13}],119:[function(require,module,exports){
var Model = require('model');

var ScanProfileConfigurationModel = require('model/ScanProfile/ScanProfileConfigurationModel');
var ScanProfileSearchModel = require('model/ScanProfile/ScanProfileSearchModel');

module.exports = Model.define('ScanProfileModel', {

    Set: function (data) {
        if (!data) {
            return;
        }

        if (data.profile_name) {
            this.profile_name = data.profile_name;
        }

        if (data.profile_description) {
            this.profile_description = data.profile_description;
        }

        if (data.profile_type) {
            this.profile_type = data.profile_type;
        }

        if (data.profile_filename) {
            this.profile_filename = data.profile_filename;
        }

        if (data.profile_path) {
            this.profile_path = data.profile_path;
        }
        
        this.configuration.Set(data.configuration);
        this.search.Set(data.search);
    },
    constructor: function () {
        this.profile_name = "";
        this.profile_description = "";
        this.profile_filename = "";
        this.profile_path = "";
        this.profile_type = 0;

        this.configuration = new ScanProfileConfigurationModel();
        this.search = new ScanProfileSearchModel();
    }
});
},{"model":13,"model/ScanProfile/ScanProfileConfigurationModel":118,"model/ScanProfile/ScanProfileSearchModel":120}],120:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('ScanProfileSearchModel', {

    Set: function (data) {
        if (!data) {
            return;
        }
        
        if (data.path) {
            this.path = data.path;
        }
    },
    constructor: function () {
        this.path = [];
    }
});
},{"model":13}],121:[function(require,module,exports){
var Model = require('model');

var SchedulerJobModel = require('model/SchedulerJob/SchedulerJobModel');

module.exports = Model.define('SchedulerJobModelWrapper', {
    
    Set: function (data, localizedObj, id) {
        this.id = id;
        this.localizedName = localizedObj.name;
        this.localizedDescription = localizedObj.description;
        this.isChangeable = localizedObj.isChangeable;
        this.isDeleteable = localizedObj.isDeleteable;
        this.schedulerJob.Set(data); 
    },
    constructor: function () {
        this.id = "";
        this.localizedName = "";
        this.localizedDescription = "";
        this.isChangeable = false;
        this.isDeleteable = false;
        this.schedulerJob = new SchedulerJobModel();
    },
});
},{"model":13,"model/SchedulerJob/SchedulerJobModel":122}],122:[function(require,module,exports){
var Model = require('model');

module.exports = Model.define('SchedulerJobModel', {

    Set: function (data) {
        if (!data) {
            return;
        }
        
        if (data.job_filepath) {
            this.job_filepath = data.job_filepath;
        }

        if (data.name) {
            this.name = data.name;
        }

        if (data.description) {
            this.description = data.description;
        }

        if (data.job_type) {
            this.job_type = data.job_type;
        }

        if (data.job_state) {
            this.job_state = data.job_state;
        }

        if (data.mode) {
            this.mode = data.mode;
        }

        if (data.visible) {
            this.visible = data.visible;
        }

        if (data.enabled) {
            this.enabled = data.enabled;
        }

        if (data.delete_job) {
            this.delete_job = data.delete_job;
        }

        if (data.days_of_week) {
            this.days_of_week = data.days_of_week;
        }

        if (data.last_start_time) {
            this.last_start_time = data.last_start_time;
        }

        if (data.start_time) {
            this.start_time = data.start_time;
        }

        if (data.start_missed_job) {
            this.start_missed_job = data.start_missed_job;
        }

        if (data.profile) {
            this.profile = data.profile;
        }

        if (data.interval) {
            this.interval = data.interval;
        }
        
    },
    constructor: function () {
        this.job_filepath = "";

        this.name = "";
        this.description = "";
        this.job_type = "";
        this.job_state = "";
        this.mode = "";
        this.interval = 0;
        this.profile = "";
        this.start_time = "";
        this.last_start_time = "";
        this.days_of_week = [];
        this.enabled = false;
        this.visible = false;
        this.delete_job = false;
        this.start_missed_job = false;
    }
});
},{"model":13}],123:[function(require,module,exports){

module.exports = function (app) {

    /**@ngInject*/
    app.config(['$routeProvider', 'appRoutesProvider',
        function ($routeProvider, appRoutesProvider) {
            var statusState = appRoutesProvider.createRoute('status');
            var quarantineState = appRoutesProvider.createRoute('quarantine');
            var activityState = appRoutesProvider.createRoute('activity');

            $routeProvider.when(statusState.path, statusState.route);
            $routeProvider.when(quarantineState.path, quarantineState.route);
            $routeProvider.when(activityState.path, activityState.route);

            $routeProvider.otherwise({ redirectTo: statusState.path });
        }]);
};
},{}],124:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    appRoutesProvider.$inject = ["$windowProvider"];
    function appRoutesProvider($windowProvider) {
        var appRoutes = require('./app-routes')
        var routes =appRoutes.routes;
        var $window = $windowProvider.$get();
        var defaultRoute = appRoutes.defaultRoute;

        this.setRoutes = function (routes) {
            this.routes = routes;
        };

        this.createRoute = function (name) {
            return {
                path: routes[name].url,
                route: {
                    templateUrl: routes[name].templateUrl,
                    controller: routes[name].controller
                }
            };
        };

        this.$get = ['$injector', function ($injector) {
                var gotoRouteFunc = function(route) {
                    var locationBefore = jQuery.extend({}, $window.location);
                    var $rootScope = $injector.get('$rootScope');
                    $window.location.assign('#' + routes[route].url);
                    var locationAfter = jQuery.extend({}, $window.location);
                    $rootScope.$emit("antivirusUIActiveLocationChanged",
                        { before: locationBefore, after: locationAfter });
                };
                return {
                    getRoutes: function() {
                        return routes;
                    },

                    gotoDefaultRoute: function() {
                        gotoRouteFunc(defaultRoute)
                    },

                    gotoRoute: gotoRouteFunc,

                    getRoute: function(name) {
                        return {
                            path: routes[name].url,
                            route: {
                                templateUrl: routes[name].templateUrl,
                                controller: routes[name].controller
                            }
                        };
                    }
                };
            }
        ];
    }


    return app.provider(name, appRoutesProvider);
};

},{"./app-routes":125}],125:[function(require,module,exports){
module.exports = {routes: createRoutes(), defaultRoute: getDefaultRoute()};

function getDefaultRoute() {
    return "status";
}

function createRoutes() {
    return {
        status: {
            name: "status",
            url: "/status",
            templateUrl: 'views/content/status-view.html',
            controller: 'StatusController'
        },
        quarantine: {
            name: "quarantine",
            url: "/quarantine",
            templateUrl: 'views/content/quarantine-view.html',
            controller: 'QuarantineController'
        },
        activity: {
            name: "activity",
            url: "/activity",
            templateUrl: 'views/content/activity-view.html',
            controller: 'ActivityController'
        }
    };
}


},{}],126:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./app-routes-provider')('appRoutes', app);
require('./app-routes-config')(app);


},{"./app-routes-config":123,"./app-routes-provider":124}],127:[function(require,module,exports){
var ActivitiesModel = require('../model/ActivitiesModel');

module.exports = function (name, app) {

    /**@ngInject*/
    ActivityService.$inject = ["$rootScope", "$filter", "$timeout", "MessageBroker", "LoggingService", "ErrorModalOverlayService", "translator", "CommonService", "AntivirusEndpoints"];
    function ActivityService($rootScope, $filter, $timeout, MessageBroker, LoggingService, ErrorModalOverlayService, translator, CommonService, AntivirusEndpoints) {

        function createActivityLoader() {
            var isLoading = true;
            return {
                enable: function (value) {
                    isLoading = value;
                },
                isLoading: function () {
                    return isLoading;
                }
            };
        }

        var supportedModules =
        [
            {
                module_id: 1,
                name: "realtime-protection",
                text: translator.getString("real-time-protection", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                module_id: 2,
                name: "mail-protection",
                text: translator.getString("mail-protection", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                module_id: 3,
                name: "updater",
                text: translator.getString("updater", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                module_id: 4,
                name: "system-scanner",
                text: translator.getString("ondemand-scanner", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                module_id: 5,
                name: "scheduler",
                text: translator.getString("scheduler", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                module_id: 6,
                name: "firewall",
                text: translator.getString("firewall", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                module_id: 7,
                name: "web-protection",
                text: translator.getString("web-protection", "modules"),
                shouldBeShown: false,
                isFilterActive: true
            }
        ];

        var supportedSeverities =
        [
            {
                type_id: 1,
                name: "info",
                text: translator.getString("information", "severity"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                type_id: 2,
                name: "warning",
                text: translator.getString("warning", "severity"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                type_id: 3,
                name: "error",
                text: translator.getString("error", "severity"),
                shouldBeShown: false,
                isFilterActive: true
            },
            {
                type_id: 4,
                name: "detection",
                text: translator.getString("detection", "severity"),
                shouldBeShown: false,
                isFilterActive: true
            }
        ];

        var endpoint = AntivirusEndpoints.activities();

        var currentEndpoint;
        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === endpoint.host && params.path === endpoint.path) {
                var endPointTmp = currentEndpoint;
                if (!endPointTmp) {
                    endPointTmp = GetEndpoint();
                }

                sendRequest(endPointTmp);
            }
        });
        
        function createModules() {


            return {
                setActivityFilter: function (item, isFilterActive) {
                    for (var i = 0; i < supportedModules.length; i++) {
                        if (supportedModules[i].module_id === item.module_id) {
                            supportedModules[i].isFilterActive = isFilterActive;
                        }
                    }

                    sendFirstRequest();
                },
                setSeverityFilter: function (item, isFilterActive) {
                    for (var i = 0; i < supportedSeverities.length; i++) {
                        if (supportedSeverities[i].type_id === item.type_id) {
                            supportedSeverities[i].isFilterActive = isFilterActive;
                        }
                    }

                    sendFirstRequest();
                },
                getActivityMenu: function () {
                    var legends = [];
                    for (var i = 0; i < supportedModules.length; i++) {
                        legends.push(supportedModules[i]);
                    }
                    return legends;
                },
                getActivityMenuShown: function () {
                    var legends = [];
                    for (var i = 0; i < supportedModules.length; i++) {
                        if (supportedModules[i].shouldBeShown) {
                            legends.push(supportedModules[i]);
                        }
                    }

                    return legends;
                },
                getSeverityMenu: function () {
                    var legends = [];
                    for (var i = 0; i < supportedSeverities.length; i++) {
                        legends.push(supportedSeverities[i]);
                    }

                    return legends;
                },
                getSeverityMenuShown: function () {
                    var legends = [];
                    for (var i = 0; i < supportedSeverities.length; i++) {
                        if (supportedSeverities[i].shouldBeShown) {
                            legends.push(supportedSeverities[i]);
                        }
                    }
                    return legends;
                }
            };
        }

        var currentRequest = null;
        var maximumObjectsPerPage = 100;
        var activities = [];
        var modules = createModules();
        var loader = createActivityLoader();
        var filterModuleId = "&filter[module_id]=";
        var filterTypeId = "&filter[type_id]=";

        var hasLoadedDataOnce = false;
        var nextEndpoint;
        var previousEndpoint;
        var lastEndpoint;
        var firstEndpoint;
        var initialEndpoint;
        function initializeEndpoint() {
            initialEndpoint = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });

            nextEndpoint = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            previousEndpoint = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            lastEndpoint = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            firstEndpoint = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            currentEndpoint = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
        }

        initializeEndpoint();

        function ChangePage(response) {
            var errors = {};

            if (!response || !response.payload) {
                ErrorModalOverlayService.genericError(
                    500,
                    translator.getString("activityService.text.errorApplyFilterFailed", "error-overlay"),
                    'Could not apply activity filter.',
                    {});
                enableLoader(false);
                return;
            }

            if (response.payload.errors) {
                errors = response.payload.errors;
            }

            if (!checkForValidResponse(previousEndpoint, response.status_code, errors)) {
                ErrorModalOverlayService.genericError(
                    response.status_code,
                    translator.getString("activityService.text.errorApplyFilterFailed", "error-overlay"),
                    'Could not apply activity filter.',
                    {});
                enableLoader(false);
                return;
            }

            if (!response.payload.links) {
                initializeEndpoint();
            }
            else {
                if (!response.payload.links.prev) {
                    previousEndpoint = GetEndpoint().endpoint;
                }
                else {
                    previousEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.prev
                    });
                }

                if (!response.payload.links.next) {
                    nextEndpoint = GetEndpoint().endpoint;
                }
                else {
                    nextEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.next
                    });
                }

                if (!response.payload.links.last) {
                    lastEndpoint = GetEndpoint().endpoint;
                } else {
                    lastEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.last
                    });
                }

                if (!response.payload.links.first) {
                    firstEndpoint = GetEndpoint().endpoint;
                } else {
                    firstEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.first
                    });
                }

                if (!response.payload.links.self) {
                    currentEndpoint = GetEndpoint().endpoint;
                } else {
                    currentEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.self
                    });
                }
            }

            hasLoadedDataOnce = true;
            activities = [];

            if (response.payload.data) {
                for (var i0 = 0; i0 < response.payload.data.length; i0++) {
                    for (var i = 0; i < supportedSeverities.length; i++) {
                        if (supportedSeverities[i].type_id === response.payload.data[i0].attributes.type_id) {
                            supportedSeverities[i].shouldBeShown = true;
                        }
                    }
                    for (var i1 = 0; i1 < supportedModules.length; i1++) {
                        if (supportedModules[i1].module_id === response.payload.data[i0].attributes.module_id) {
                            supportedModules[i1].shouldBeShown = true;
                        }
                    }

                    var activity = new ActivitiesModel();
                    activity.Set(response.payload.data[i0].attributes);
                    activities[response.payload.data[i0].id] = activity;
                }

                activities.sort(function (a, b) {
                    return b.date - a.date;
                });
            }
            
            $rootScope.$broadcast("activitiesListChanged", response.payload.data);

            enableLoader(false);
        }

        function GetEndpoint() {
            var supportedSeveritiesSelected = 0;
            var supportedModulesSelected = 0;

            var endpointBase = AntivirusEndpoints.endpoint({
                path: '/activities?page[number]=1&page[size]=' + maximumObjectsPerPage
            });

            endpointBase.path += filterTypeId;
            for (var i = 0; i < supportedSeverities.length; i++) {
                if (supportedSeverities[i].isFilterActive) {
                    if (supportedSeveritiesSelected > 0) {
                        endpointBase.path += ",";
                    }

                    endpointBase.path += supportedSeverities[i].type_id;
                    supportedSeveritiesSelected++;
                }
            }

            if (supportedSeveritiesSelected > 0) {
                endpointBase.path += filterModuleId;

                for (var i1 = 0; i1 < supportedModules.length; i1++) {
                    if (supportedModules[i1].isFilterActive) {
                        if (supportedModulesSelected > 0) {
                            endpointBase.path += ",";
                        }

                        endpointBase.path += supportedModules[i1].module_id;
                        supportedModulesSelected++;
                    }
                }
            }
            var sendRequest = (supportedModulesSelected > 0 && supportedSeveritiesSelected > 0);
            return {
                endpoint: endpointBase,
                shouldSendRequest: sendRequest
            };
        }

        function sendFirstRequest() {
            var endpoint = GetEndpoint();

            if (endpoint.shouldSendRequest) {
                sendRequest(endpoint.endpoint);
            }
            else {
                activities = [];
                currentRequest = null;
                enableLoader(false);
                $rootScope.$broadcast("activitiesListChanged", []);
            }
        }

        function sendRequest(endpoint) {

            var timer = $timeout(function () {
                ChangePage(null);
            }, 60000);

            enableLoader(true);

            var id = MessageBroker.request(endpoint,
                function (response) {
                    $timeout.cancel(timer);
                    if (!currentRequest || currentRequest.id !== response.id) {
                        return;
                    }

                    currentRequest.callback(response);
                });

            currentRequest =
            {
                id: id,
                callback: ChangePage
            };
        }
        function areAllFiltersActive() {
            if (!hasLoadedDataOnce) {
                return true;
            }

            var allFilterActive = true;
            for (var i = 0; i < supportedModules.length; i++) {
                if (supportedModules[i].isFilterActive === false) {
                    allFilterActive = false;
                    break;
                }
            }

            if (allFilterActive) {
                for (var i1 = 0; i1 < supportedSeverities.length; i1++) {
                    if (supportedSeverities[i1].isFilterActive === false) {
                        allFilterActive = false;
                        break;
                    }
                }
            }

            return allFilterActive;
        }

        var currentJob = null;
        var addItemRunning = false;

        function checkJobAddedASecondAgoLogic(newJob, alreadyAddedJob) {
            if (alreadyAddedJob.jobType === newJob.jobType &&
                moment(alreadyAddedJob.timestampUtc).add(1, 'seconds').unix() > newJob.timestampUtc.unix()) {
                return true;
            }

            return false;
        }

        function checkJobAddedASecondAgo(item) {
            if (currentJob !== null && checkJobAddedASecondAgoLogic(item, currentJob)) {
                return true;
            }

            return false;
        }

        function executeRequest(jobType, callback) {
            var nowUtc = moment().utc();
            var item = {
                callback: callback,
                jobType: jobType,
                timestampUtc: nowUtc
            };

            if (checkJobAddedASecondAgo(item) === true) {
                addItemRunning = false;
                return;
            }

            addItemRunning = false;
            currentJob = item;
            callback();
        }

        function loadPrevious() {

            if (!previousEndpoint) {
                return;
            }

            sendRequest(previousEndpoint);
        }

        function loadPreviousClicked() {
            if (addItemRunning) {
                $timeout(loadPreviousClicked(), 10);
            }

            addItemRunning = true;
            executeRequest("loadPrevious", loadPrevious);
        }

        function loadNextClicked() {
            if (addItemRunning) {
                $timeout(loadNextClicked(), 10);
            }

            addItemRunning = true;
            executeRequest("loadNext", loadNext);
        }

        function loadNext() {
            if (!nextEndpoint) {
                return;
            }

            sendRequest(nextEndpoint);
        }
        
        MessageBroker.subscribe(endpoint, function (value) {
            if (value) {
                if (currentEndpoint.path.indexOf(firstEndpoint.path) !== 0) {
                    return;
                }
                
                for (var i = 0; i < supportedModules.length; i++) {
                    if (supportedModules[i].module_id === value.attributes.module_id) {
                        if (!supportedModules[i] ||
                            supportedModules[i].isFilterActive === false) {
                            return;
                        }

                        supportedModules[i].shouldBeShown = true;
                        break;
                    }
                }

                for (var i1 = 0; i1 < supportedSeverities.length; i1++) {
                    if (supportedSeverities[i1].type_id === value.attributes.type_id) {
                        if (!supportedSeverities[i1] ||
                            supportedSeverities[i1].isFilterActive === false) {
                            return;
                        }

                        supportedSeverities[i1].shouldBeShown = true;
                        break;
                    }
                }
                
                var activity = new ActivitiesModel();
                activity.Set(value.attributes);
                
                activities[value.id] = activity;
                activities.sort(function (a, b) {
                    return b.date - a.date;
                });
                
                $rootScope.$broadcast("activitiesListChanged", value);
            }
        });

        sendFirstRequest();

        function getFirstEndpoint() {
            return firstEndpoint;
        }

        function getLastEndpoint() {
            return lastEndpoint;
        }

        function getCurrentEndpoint() {
            return currentEndpoint;
        }

        function checkForValidResponse(endpoint, statusCode, errors) {
            if (statusCode && statusCode >= 300) {
                LoggingService.Warn("Received error response for endpoint " + endpoint.host + " path :" + endpoint.path + " with status code " + statusCode + " and errors: code: " + errors.code + " title: " + errors.title + " detail: " + errors.detail + " status: " + errors.status);
                return false;
            }
            return true;
        }
            	
        function resetFilters() {
            for (var i = 0; i < supportedModules.length; i++) {
                supportedModules[i].isFilterActive = true;
            }

            for (var i1 = 0; i1 < supportedSeverities.length; i1++) {
                supportedSeverities[i1].isFilterActive = true;
            }

            sendFirstRequest();
        }
                
        function getTimelineFromDate(date) {
            var timeline = [];
            
            var activitiesFromDateTmp = activities.filter(function (value) {
                if (date === moment(value.date).local().format("YYYY-MM-DD")) {
                    return true;
                }
                return false;
            });

            for (var id in activitiesFromDateTmp) {
                if (activitiesFromDateTmp.hasOwnProperty(id)) {
                    timeline.push(activitiesFromDateTmp[id]);
                }
            }
            return timeline;
        }
        
        function getActivities(date) {
            return getTimelineFromDate(date);
        }
        
        function enableLoader(value) {
            loader.enable(value);
            $rootScope.$broadcast("loaderStatusChanged", value);
        }

        function getDates() {
            var dates = activities.map(function (item) {
                return moment(item.date).local().format("YYYY-MM-DD");
            });
            
            dates = dates.filter(function (item, pos) {
                if (dates.indexOf(item) === pos) {
                    return true;
                }
                return false;
            });

            return dates;
        }
                
        return {
            loadNextClicked: loadNextClicked,
            loadPreviousClicked: loadPreviousClicked,
            getActivities: getActivities,
            getDates: getDates,
            getActivityMenu: modules.getActivityMenu,
            getActivityMenuShown: modules.getActivityMenuShown,
            setActivityFilter: function (id, value) {
                modules.setActivityFilter(id, value);
                $rootScope.$broadcast("activitiesFilterChanged", id);
            },
            getSeverityMenu: modules.getSeverityMenu,
            getSeverityMenuShown: modules.getSeverityMenuShown,
            setSeverityFilter: function (id, value) {
                modules.setSeverityFilter(id, value);
                $rootScope.$broadcast("severityFilterChanged", id);
            },
            getFirstEndpoint: getFirstEndpoint,
            getLastEndpoint: getLastEndpoint,
            getCurrentEndpoint: getCurrentEndpoint,
            enableLoader: enableLoader,
            isLoading: loader.isLoading,
            getModuleName: function (module_id) {
                for (var i = 0; i < supportedModules.length; i++) {
                    if (module_id === supportedModules[i].module_id) {
                        return supportedModules[i].name;
                    }
                }

                return "";
            },
            getSeverityName: function (type_id) {
                for (var i = 0; i < supportedSeverities.length; i++) {
                    if (type_id === supportedSeverities[i].type_id) {
                        return supportedSeverities[i].name;
                    }
                }

                return "";
            },
            hasActivitiyElements: function () {
                if (!hasLoadedDataOnce) {
                    return true;
                }

                return activities.length !== 0;
            },
            areAllFiltersActive: areAllFiltersActive,
            getPageSize: function () {
                return maximumObjectsPerPage;
            },
            resetFilters: resetFilters
        };
    }

    return app.factory(name, ActivityService);
};
},{"../model/ActivitiesModel":109}],128:[function(require,module,exports){
var AppStateModel = require('../model/AppStatuses/AppStateModel');
var AboutModel = require('../model/AppStatuses/AboutModel');
var ModulesModel = require('../model/AppStatuses/ModulesModel');
var LastScanModel = require('../model/AppStatuses/LastScanModel');

module.exports = function (name, app) {

    /**@ngInject*/
    AppStatusService.$inject = ["$rootScope", "$timeout", "$window", "MessageBroker", "LoggingService", "ErrorModalOverlayService", "Tools", "translator", "AntivirusEndpoints", "ConfigurationService", "CommonService", "UpdateModalOverlayService", "OESettingsService"];
    function AppStatusService($rootScope,
                              $timeout,
                              $window,
                              MessageBroker,
                              LoggingService,
                              ErrorModalOverlayService,
                              Tools,
                              translator,
                              AntivirusEndpoints,
                              ConfigurationService,
                              CommonService,
                              UpdateModalOverlayService,
                              OESettingsService ) {
        var app_state = new AppStateModel();
        var about = new AboutModel();
        var modules = new ModulesModel();
        var last_scan = new LastScanModel();
        var timeoutGrayState = null;
        var getDataTimer = null;


        var endpointAppStatuses = AntivirusEndpoints.appStatus();

        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === endpointAppStatuses.host && params.path === endpointAppStatuses.path) {
                if (app_state.time_out === null ||
                   !app_state.time_out.isValid() ||
                    app_state.time_out.year() < 1970) {

                    requestAppStatusUpdate();
                }
            }
        });
        
        function removeGrayStateTimeoutTimer() {
            if (timeoutGrayState !== null) {
                $timeout.cancel(timeoutGrayState);
                timeoutGrayState = null;
            }
        }

        function setupGrayStateTimeoutTimer() {
            var timeout = app_state.time_out.valueOf() - moment().utc().valueOf();

            if (timeout > 0) {
                // remove previous set timer
                removeGrayStateTimeoutTimer();

                timeoutGrayState = $timeout(function () {
                    checkOverallStateAfterTimeout();
                }, timeout);
            }
        }

        function requestAppStatusUpdate() {
            setDataTimeout(60000);

            MessageBroker.requestList(endpointAppStatuses, function (newStatus, statusCode, errors) {
                if (!checkForValidResponse(endpointAppStatuses, statusCode, errors)) {
                    return;
                }

                if (getDataTimer !== null) {
                    $timeout.cancel(getDataTimer);
                    getDataTimer = null;
                }

                updateAppStatuses(newStatus);

                Tools.TriggerGuiLoadFinished();
            });
        }

        function checkOverallStateAfterTimeout() {
            removeGrayStateTimeoutTimer();
            requestAppStatusUpdate();
        }

        function checkForValidResponse(endpoint, statusCode, errors) {
            if (statusCode && statusCode >= 300) {
                return false;
            }
            return true;
        }

        function getUpdateVersion() {
            var parts = about.version.split('.');

            if (parts.length < 4) {
                return false;
            }

            return parts[2];
        }
        function setDataTimeout(timeout) {
            if (getDataTimer !== null) {
                $timeout.cancel(getDataTimer);
                getDataTimer = null;
            }

            getDataTimer = $timeout(function() {
                    getDataTimer = null;
                    app_state.GoToRedState();
                    about.GoToRedState();
                    modules.GoToRedState();
                    last_scan.GoToRedState();

                    LoggingService.Error("Haven't got any app status " + (timeout / 1000) + " seconds after the ui started");

                    if (UpdateModalOverlayService.isUIUpdateRunning() === false) {
                        ErrorModalOverlayService.genericError(
                            500,
                            translator.getString("appStatusService.text.noAppStatusReceived", "error-overlay"),
                            "Application status was not received.",
                            {});
                    }
                    $rootScope.$broadcast("appStatusChangedError");

                    var data =
                    {
                        attributes: {
                            section: "about"
                        }
                    };

                    $rootScope.$broadcast("appStatusChanged", data);
                    data =
                    {
                        attributes: {
                            section: "app_state"
                        }
                    };

                    $rootScope.$broadcast("appStatusChanged", data);
                    data =
                    {
                        attributes: {
                            section: "last_scan"
                        }
                    };

                    $rootScope.$broadcast("appStatusChanged", data);
                    data =
                    {
                        attributes: {
                            section: "modules"
                        }
                    };
                    
                    $rootScope.$broadcast("appStatusChanged", data);
                    Tools.TriggerGuiLoadFinished();
                },
                timeout);
        }

        var updateAppStatus = function (newStatus) {
            if (newStatus && newStatus.attributes) {
                if (newStatus.attributes.section === 'app_state' && newStatus.attributes.custom_value) {
                    app_state.Set(newStatus.attributes.custom_value);

                    if (app_state.time_out !== null &&
                        app_state.time_out.isValid() &&
                        app_state.time_out.year() >= 1970) {
                        setupGrayStateTimeoutTimer();
                    }
                }
                else if (newStatus.attributes.section === 'about' && newStatus.attributes.custom_value) {
                    about.Set(newStatus.attributes.custom_value);
                }
                else if (newStatus.attributes.section === 'modules' && newStatus.attributes.custom_value) {
                    modules.Set(newStatus.attributes.custom_value);
                }
                else if (newStatus.attributes.section === 'last_scan' && newStatus.attributes.custom_value) {
                    last_scan.Set(newStatus.attributes.custom_value);
                }

                $rootScope.$broadcast("appStatusChanged", newStatus);
            }
        };

        function isUpdateRunning() {
            return app_state.status === "updating";
        }

        function isLicenseExchangeRunning() {
            return app_state.status === "license_exchange";
        }
        function isFixNowRunning() {
            return app_state.status === "fix_now";
        }

        function isGreyState() {
            return isUpdateRunning() || isFixNowRunning() || isLicenseExchangeRunning();
        }

        function isGreenState() {
            return app_state.status === "ok";
        }

        function isRedState() {
            return !isGreyState() && !isGreenState() && !isYellowState();
        }

        function updateAppStatuses (newStatuses) {
            for (var i = 0; i < newStatuses.length; i++) {
                updateAppStatus(newStatuses[i]);
            }
        }

        MessageBroker.subscribe(endpointAppStatuses, function (newStatus) {

            if (getDataTimer !== null) {
                $timeout.cancel(getDataTimer);
                getDataTimer = null;
            }

            updateAppStatus(newStatus);
        });

        setDataTimeout(30000);
        MessageBroker.requestList(endpointAppStatuses, function (newStatus, statusCode, errors) {
            if (!checkForValidResponse(endpointAppStatuses, statusCode, errors)) {
                return;
            }

            if (getDataTimer !== null) {
                $timeout.cancel(getDataTimer);
                getDataTimer = null;
            }

            updateAppStatuses(newStatus);
            Tools.TriggerGuiLoadFinished();
            ConfigurationService.CheckPasswordProtection("open_mainui", "", onPasswordResult);
        });

        function onPasswordResult(value, result)
        {
            if (!result)
            {
                OESettingsService.isAntivirusDefaultView(function (isDefaultView) {
                    if (isDefaultView) {
                        $window.open('aoe://close');
                    }
                    else {
                        CommonService.redirectToLauncher();
                    }

                });
             }
        }

        function isLicenseRenewalSuggested() {
            return app_state.status === "suggest_license_renew";
        }

        function isYellowState() {
            return isLicenseRenewalSuggested();
        }

        return {
            isPaidProduct : function () {
                switch (about.product_id) {
                    case 57:
                        return false;
                    case 210:
                        return true;
                    case 150:
                        return true;
                    default:
                        return false;
                }
            },

            isServerOS : function () {
                return about.is_server_os;
            },
            removeGrayStateTimeoutTimer: function () {
                return removeGrayStateTimeoutTimer();
            },
            isGreenState: isGreenState,
            isRedState: isRedState,
            isGreyState: isGreyState,
            isUpdateRunning: isUpdateRunning,
            isLicenseExchangeRunning: isLicenseExchangeRunning,
            isFixNowRunning: isFixNowRunning,
            needToRenewLicense : function(){
                return app_state.license_renew;
            },
            isB2bLicense: function () {
                return app_state.is_b2b_license;
            },
            isSpotlightUser: function () {
                return app_state.is_spotlight_user;
            },
            app_state: app_state,
            about: about,
            getUpdateVersion: getUpdateVersion,
            modules: modules,
            last_scan: last_scan,
            isYellowState: isYellowState,
            isLicenseRenewalSuggested: isLicenseRenewalSuggested
        };
    }

    return app.factory(name, AppStatusService);
};

},{"../model/AppStatuses/AboutModel":110,"../model/AppStatuses/AppStateModel":111,"../model/AppStatuses/LastScanModel":112,"../model/AppStatuses/ModulesModel":114}],129:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    AppStatusTranslatorService.$inject = ["$rootScope", "translator", "LoggingService"];
    function AppStatusTranslatorService(
        $rootScope,
        translator,
        LoggingService) {  
        function getServiceName(actionId) {
            switch (actionId) {
                case 2:
                case 6:
                case 10:
                case 33:
                    return translator.getString("real-time-protection", "modules");
                case 3:
                case 7:
                case 11:
                case 34:
                    return translator.getString("web-protection", "modules");
                case 4:
                case 8:
                case 12:
                case 35:
                    return translator.getString("mail-protection", "modules");
                case 5:
                case 9:
                case 13:
                    return translator.getString("firewall", "modules");
            }
        }
        function translate(eventId, actionId, actionRequiredCount) {
            switch (actionId) {
                case 0:
                    return translator.getString("appStatusTranslator.text.secure", "app-status-translator");
                case 1:
                    return translator.getString("appStatusTranslator.text.upToDate", "app-status-translator");
                case 2:
                case 3:
                case 4:
                case 5:
                    return translator.getString("appStatusTranslator.text.serviceDisabled",
                        "app-status-translator",
                        {
                            service: getServiceName(actionId)
                        });
                case 6:
                case 7:
                case 8:
                case 9:
                    return translator.getString("appStatusTranslator.text.serviceStopped", "app-status-translator", { service: getServiceName(actionId) });
                case 10:
                case 11:
                case 12:
                case 13:
                    return translator.getString("appStatusTranslator.text.serviceUnknownError", "app-status-translator", { service: getServiceName(actionId) });
                case 33:
                case 34:
                case 35:
                    return translator.getString("appStatusTranslator.text.serviceSnoozed", "app-status-translator", { service: getServiceName(actionId) });
                case 14:
                    return translator.getString("appStatusTranslator.text.licenseExpired", "app-status-translator");
                case 15:
                    return translator.getString("appStatusTranslator.text.multipleServiceError", "app-status-translator",{ count: actionRequiredCount });
                case 16:
                    return translator.getString("appStatusTranslator.text.restartRequired", "app-status-translator");
                case 17:
                    return translator.getString("appStatusTranslator.text.updateAvailable", "app-status-translator");
                case 21:
                    return translator.getString("appStatusTranslator.text.unexpectedErrorOccurred", "app-status-translator");

                default:
                    var msg = "AVUI: AppStatusTranslator: Unknown event: " + actionId;
                    LoggingService.Error(msg);
                    return translator.getString("appStatusTranslator.text.unknownEventId", "app-status-translator");
            }
        }

        return {
            translate: translate
        };
    }

    return app.factory(name, AppStatusTranslatorService);
};
},{}],130:[function(require,module,exports){
module.exports = function (name, app) {
    
    /**@ngInject*/
    CommonService.$inject = ["$rootScope", "$filter", "MessageBroker", "$window", "LoggingService", "translator", "Tools"];
    function CommonService($rootScope, $filter, MessageBroker, $window, LoggingService, translator, Tools) {
        function getThisComputer() {
            var contentTmp = Tools.GetThisComputer();
            if (contentTmp === null || contentTmp.length === 0) {
                return null;
            }

            var content = JSON.parse(contentTmp);
            var folders = [];
            folders.push(content);
            for (var i1 = 0; i1 < folders.length; i1++) {
                if (!folders[i1].Children) {
                    folders[i1].Children = [];
                }

                for (var i2 = 0; i2 < folders[i1].Children.length; i2++) {
                    if (!folders[i1].Children[i2].Children) {
                        folders[i1].Children[i2].Children = [];
                    }
                }
            }

            return folders;
        }
        function getPaidTag(isServer)
        {
            return isServer ? translator.getString("commonService.text.serverPaidTag") : translator.getString("commonService.text.workstationPaidTag");
        }

        function getFolders(path)
        {
            var folders = JSON.parse(Tools.GetSubFolders(path));

            for (var i1 = 0; i1 < folders.length; i1++) {
                if (!folders[i1].Children) {
                    folders[i1].Children = [];
                }
            }

            return folders;
        }

        function getCompleteProductName(productId) {
            return translator.getString("commonService.text.completeProductName", null, { brandName: getBrandName(), productName: getProductName(productId) });
        }

        function getProductName(productId) {
            switch (productId) {
                case 57:
                    return translator.getString("commonService.text.productNameFree");
                case 210:
                    return translator.getString("commonService.text.productNameServer");
                case 150:
                    return translator.getString("commonService.text.productNamePro");
                default:
                    return translator.getString("commonService.text.genericProductName");
            }
        }

        function getGenericProductName() {
            return translator.getString("commonService.text.genericProductName");
        }

        function getBrandName() {
            return translator.getString("commonService.text.brandName");
        }

        function generateUuid() { // Public Domain/MIT
            var d = moment().utc().unix();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }

        function replaceAll(string, search, replacement) {
            return string.split(search).join(replacement);
        }

        function normalizeIdentifier(text) {
            var tmp = replaceAll(text, '.', '-');
            tmp = replaceAll(tmp, '\\', '-');
            tmp = replaceAll(tmp, '//', '-');
            tmp = replaceAll(tmp, ':', '_');
            return tmp;
        }

        function redirectToLauncher() {
            var request = {
                path: '/executions',
                verb: 'POST',
                host: 'launcherui.' + Tools.GetUserSid()
            };

            var payload = {
                data: {
                    type: 'executions',
                    attributes: [{
                        type: 'embedded',
                        value: {
                            path: '%home%'
                        }
                    }]
                }
            };

            MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                if (statusCode && statusCode >= 300) {
                    LoggingService.Warn("Received error response for executions with status code " + statusCode + " and errors: " + errors);
                    return;
                }
            }, payload);
        }

        return {
            getCompleteProductName: getCompleteProductName,
            getProductName: getProductName,
            getBrandName: getBrandName,
            normalizeIdentifier: normalizeIdentifier,
            replaceAll: replaceAll,
            generateUuid: generateUuid,
            getPaidTag: getPaidTag,
            redirectToLauncher: redirectToLauncher,
            getThisComputer: getThisComputer,
            getFolders: getFolders,
            getGenericProductName: getGenericProductName
        };
    }

    return app.factory(name, CommonService);
};
},{}],131:[function(require,module,exports){
module.exports = function (name, app) {
    
    /**@ngInject*/
    ConfigurationService.$inject = ["$rootScope", "MessageBroker", "LoggingService", "CommonService", "OESettingsService", "AntivirusEndpoints", "bigInt"];
    function ConfigurationService($rootScope,
                                  MessageBroker,
                                  LoggingService,
                                  CommonService,
                                  OESettingsService,
                                  AntivirusEndpoints,
                                  bigInt) {

        var callbackFunc = null;
        var callbackParams = null;
        var rsaAlpha = bigInt("0");
        var rsaGolf = bigInt("0");
        var locPassword = "";
        var locOnCheckPassword = null;
        var checkPasswordWasStarted;
        var getPublikKeyFailed = false;
        var configurationEndpoint = AntivirusEndpoints.configuration();
        var configurationEndpointPut = AntivirusEndpoints.configurationPut();
        var wasHighlightFeedbackAlreadyLoaded = false;
        var survey = {
            highlight_feedback: false,
        }      

        function getSurvey() {
            return survey;
        }

        loadConfiguration();

        function loadConfiguration() {
            if (wasHighlightFeedbackAlreadyLoaded === false) {
                OESettingsService.isAntivirusDefaultView(function(response) {
                    if (response !== true) {
                        // Load survey
                        MessageBroker.request(configurationEndpoint,
                            function(response) {
                                survey.highlight_feedback = response.payload.data.attributes.highlight_feedback
                                wasHighlightFeedbackAlreadyLoaded = true;
                                $rootScope.$broadcast("hightlightFeedbackReceived", survey);
                            },
                            {
                                data:
                                {
                                    id: CommonService.generateUuid(),
                                    type: "survey"
                                }
                            });
                    }
                });
            }
        }

        function sendFeedbackClicked() {
            var payload = {
                data:
                {
                    id: CommonService.generateUuid(),
                    type: "survey",
                    attributes: {
                        feedback_clicked: true
                    }
                }
            };

            MessageBroker.request(configurationEndpointPut, function (response) {
            }, payload);
        }

        function CheckPasswordProtection(component, params, getResult) {
            checkPasswordWasStarted = false;
            rsaAlpha = bigInt("0");
            rsaGolf = bigInt("0");
            locPassword = "";

            var request = AntivirusEndpoints.configuration();
            var payload = {
                data:
                {
                    id: CommonService.generateUuid(),
                    type: "passwordprotection",
                    attributes: {
                        pwd_protected: component
                    }
                }
            };
            callbackFunc = getResult;
            callbackParams = params;
            MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                var result = true;
                if (statusCode && statusCode >= 300) {
                    LoggingService.Warn("Received error response for executions with status code " + statusCode + " and errors: " + errors);
                    result = false;
                    getResult(params);
                }
                else {
                    var isProtected = (data.attributes.is_pwd_protected === 'true') || (data.attributes.is_pwd_protected === true);
                    if (isProtected) {
                        if (data.attributes.exponent) {
                            rsaAlpha = bigInt(data.attributes.exponent);
                            rsaGolf = bigInt(data.attributes.module);
                        }
                        else {
                            GetPublicKey(component);
                        }
                    }
                    if (isProtected) {
                        locPassword = "";
                        locOnCheckPassword = null;
                        $rootScope.$broadcast("showPasswordOverlay");
                    }
                    else {
                        getResult(params, true);
                    }
                }
                return;
            }, payload);
            return;
        };

        function GetPublicKey() {
            getPublikKeyFailed = false;
            rsaAlpha = bigInt("0");
            rsaGolf = bigInt("0");

            var request = AntivirusEndpoints.configuration();
            var payload = {
                data:
                {
                    id: CommonService.generateUuid(),
                    type: "publickey",
                    attributes: {
                        key: "public_key"
                    }
                }
            };
            MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                var result = true;
                if (statusCode && statusCode >= 300) {
                    LoggingService.Warn("Received error response for executions public key " + statusCode + " and errors: " + errors);
                    result = false;
                    getPublikKeyFailed = true;
                    if (locOnCheckPassword != null) {
                        locOnCheckPassword(false);
                    }
                }
                else {
                    if (data.attributes.exponent) {
                        rsaAlpha = bigInt(data.attributes.exponent);
                        rsaGolf = bigInt(data.attributes.module);
                    }
                    else {
                        callbackFunc(callbackParams);
                        return;
                    }
                }
                if ((locPassword !== "") && (locOnCheckPassword != null)) {
                    CheckPassword(locPassword, locOnCheckPassword);
                }
                locOnCheckPassword = null;
                locPassword = "";
                return;
            }, payload);

        };
        
        function RsaEncrypt(Data, PublicExp, publicModulee) {
            var dataStr = "1";
            for (var idx = 0; idx < Data.length; idx++) {
                var char = Data.charCodeAt(idx);
                var longNumb = "000" + char;
                dataStr = dataStr + longNumb.substr(longNumb.length - 3);
            }
            var buff = bigInt(dataStr);

            var encryptBuffer = buff.modPow(PublicExp, publicModulee);
            return encryptBuffer;
        };

        // UTF-8 encode
        function encode_utf8(s) {
            return unescape(encodeURIComponent(s));
        };
        
        function checkForValidResponse(endpoint, statusCode, errors) {
            if (statusCode && statusCode >= 300) {
                return false;
            }
            return true;
        };
        
        function changeConfigurationFileEntry(section, key, value) {
            var request = AntivirusEndpoints.configurationPut();

            var payload = {
                data:
                    {
                        id: CommonService.generateUuid(),
                        type: "configuration-file-entry",
                        attributes: {
                            section: section,
                            key: key,
                            value: value
                        }
                    }
            };

            MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                var result = true;
                if (statusCode === 403) {
                    LoggingService.Warn("Change configuration section: " + section + "; key: " + key + " to " +
                        value + "  is not performed because you have not the needed rights");

                    $rootScope.$broadcast("configurationFileEntryChanged");
                }
                else if (!checkForValidResponse(configurationEndpoint, statusCode, errors)) {
                    LoggingService.Error("Received error response for executions public key " + statusCode + " and errors: " + errors);
                }
            }, payload);
        }
        function EncryptPassword(password) {
            var encryptPassword = "";
            var blockLen = rsaGolf.toString().length;
            blockLen = (blockLen - blockLen % 3) / 3;
            if (blockLen > 1) {
                blockLen -= 1;
            }
            var offset = 0;
            var restLen = password.length;
            while (offset < password.length) {
                if (blockLen > restLen) {
                    blockLen = restLen;
                }
                var block = password.substr(offset, blockLen);
                var encrypted = RsaEncrypt(block, rsaAlpha, rsaGolf).toString();
                encryptPassword += (encrypted.length + 100) + encrypted;
                offset += blockLen;
                restLen -= blockLen;
            }
            return encryptPassword
        };

        function CheckPassword(password, onCheckePassword) {
            checkPasswordWasStarted = true;
            if ((rsaAlpha.toString() === "0") || (rsaGolf.toString() === "0")) {
                locOnCheckPassword = onCheckePassword;
                locPassword = password;
                if (getPublikKeyFailed) {
                    GetPublicKey();
                }
                return;
            }

            var passwordUTF8 = encode_utf8(password);
            var encryptedPassword = EncryptPassword(passwordUTF8);
            var request = AntivirusEndpoints.configuration();
            var payload = {
                data:
                {
                    id: CommonService.generateUuid(),
                    type: "passwordverification",
                    attributes: {
                        encrypted_pwd: encryptedPassword
                    }
                }
            };
            MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                var result = false;
                if (statusCode && statusCode >= 300) {
                    LoggingService.Warn("Received error response for executions with status code " + statusCode + " and errors: " + errors);
                    onCheckePassword(false);
                }
                else {
                    result = ((data.attributes.is_pwd_correct === 'true') || (data.attributes.is_pwd_correct === true));
                    onCheckePassword(result);
                }
                return;
            }, payload);
            return;
        };

        return {
            changeConfigurationFileEntry: changeConfigurationFileEntry,
            getSurvey: getSurvey,
            sendFeedbackClicked: sendFeedbackClicked,
            CheckPasswordProtection: function (component, params, getResult)
            { CheckPasswordProtection(component, params, getResult); },

            checkPassword: function (password, onCheckePassword) {
                return CheckPassword(password, onCheckePassword);
            },

            PasswordResult: function (result) {
                if (callbackFunc) {
                    callbackFunc(callbackParams, result);
                }
            }
        }
    }
    
    return app.factory(name, ConfigurationService);
}
},{}],132:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    EndpointService.$inject = ["$rootScope", "MessageBroker", "LoggingService", "LauncherEndpoints"];
    function EndpointService($rootScope, MessageBroker, LoggingService, LauncherEndpoints) {
        var endpoint = LauncherEndpoints.resources();
        
        var availableResources = [];

        MessageBroker.subscribe(endpoint, function (resource, verb) {
            if (verb === "POST") {
                availableResources[resource.id] = {
                    id: resource.id,
                    host: resource.attributes.host,
                    path: resource.attributes.path
                };

                $rootScope.$broadcast("endpointResourceAdded",
                    {
                        id: availableResources[resource.id].id,
                        host: availableResources[resource.id].host,
                        path: availableResources[resource.id].path
                    });
            }
            else if (verb === "DELETE") {
                if (availableResources[resource.id]) {

                    $rootScope.$broadcast("endpointResourceDelete",
                        {
                            id: availableResources[resource.id].id,
                            host: availableResources[resource.id].host,
                            path: availableResources[resource.id].path
                        });
                    delete availableResources[resource.id];
                }
            }
        });

        MessageBroker.requestList(endpoint, function (resourceTable, statusCode, errors) {
            if (statusCode && statusCode >= 300) {
                LoggingService.Warn("Received error response for endpoint " + endpoint.host + " path :" + endpoint.path + " with status code " + statusCode + " and errors: code: " + errors.code + " title: " + errors.title + " detail: " + errors.detail + " status: " + errors.status);
                return;
            }

            if (resourceTable) {
                availableResources = [];
                for (var i = 0; i < resourceTable.length; i++) {
                    availableResources[resourceTable[i].id] = {
                        id: resourceTable[i].id,
                        host: resourceTable[i].attributes.host,
                        path: resourceTable[i].attributes.path
                    };
                    $rootScope.$broadcast("endpointResourceAdded",
                        {
                            id: availableResources[resourceTable[i].id].id,
                            host: availableResources[resourceTable[i].id].host,
                            path: availableResources[resourceTable[i].id].path
                        });
                }
            }
        });

        return {
            doesResourceExist: function(resourceToSearch) {
                for (var resource in availableResources) {
                    if (availableResources.hasOwnProperty(resource)) {
                        if (availableResources[resource].host.toLowerCase() === resourceToSearch.host.toLowerCase() &&
                            availableResources[resource].path.toLowerCase() === resourceToSearch.path.toLowerCase()) {
                            return true;
                        }
                    }
                }

                return false;
            }
        }
    }

    return app.factory(name, EndpointService);
};
},{}],133:[function(require,module,exports){
module.exports = function () {

    /**@ngInject*/
    function AntivirusEndpoints() {

        function ep(endpoint) {
            if (endpoint == null) {
                throw new TypeError("endpoints has to be defined");
            }

            if (typeof endpoint === 'string') {
                endpoint = {
                    host: 'antivirus',
                    path: endpoint,
                    verb: 'GET'
                };
            } else if (typeof endpoint === 'object') {
                endpoint.host = endpoint.host || 'antivirus';
                endpoint.verb = endpoint.verb || 'GET';
            }

            endpoint.requestFilter = endpoint.requestFilter || '';
            endpoint.subscribeFilter = endpoint.subscribeFilter || '';

            return endpoint;
        }

        return {

            endpoint: function (endPointDefine) {
                return ep(endPointDefine);
            },
            appStatus: function () {
                return ep({
                    path: '/app-statuses'
                });
            },
            putServiceStatus: function (broker) {
                return ep({
                    path: '/service-status',
                    host: broker,
                    verb: 'PUT'
                });
            },
            putFirewallServiceStatus: function () {
                return ep({
                    path: '/firewall-service-status',
                    verb: 'PUT'
                });
            },
            getUserInterfaces: function () {
                return ep({
                    path: '/user-interfaces',
                    verb: 'GET'
                });
            },
            getServiceStatus: function (broker) {
                return ep({
                    path: '/service-status',
                    host: broker
                });
            },
            getFirewallServiceStatus: function () {
                return ep({
                    path: '/firewall-service-status'
                });
            },
            scanProfilesPut: function () {
                return ep({
                    path: '/scan-profiles',
                    verb: 'PUT'
                });
            },
            scanProfilesPost: function () {
                return ep({
                    path: '/scan-profiles',
                    verb: 'POST'
                });
            },
            scanProfilesDelete: function () {
                return ep({
                    path: '/scan-profiles',
                    verb: 'DELETE'
                });
            },
            scanProfilesGet: function () {
                return ep({
                    path: '/scan-profiles'
                });
            },
            resources: function () {
                return ep({
                    path: '/resources'
                });
            },
            quarantineGet: function () {
                return ep({
                    path: '/quarantine'
                });
            },
            quarantinePut: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/quarantine',
                    verb: 'PUT'
                };
                return endpointRet;
            },
            quarantinePost: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/quarantine',
                    verb: 'POST'
                };
                return endpointRet;
            },
            quarantineDelete: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/quarantine',
                    verb: 'DELETE'
                };
                return endpointRet;
            },
            activities: function () {
                return ep({
                    path: '/activities'
                });
            },
            schedulerjobsPut: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/scheduler-jobs',
                    verb: 'PUT'
                };
                return endpointRet;
            },
            schedulerjobsGet: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/scheduler-jobs',
                    verb: 'GET'
                };
                return endpointRet;
            },
            schedulerjobsPost: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/scheduler-jobs',
                    verb: 'POST'
                };
                return endpointRet;
            },
            schedulerjobsDelete: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/scheduler-jobs',
                    verb: 'DELETE'
                };
                return endpointRet;
            },
            statusactions: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/status-actions',
                    verb: 'PUT'
                };
                return endpointRet;
            },
            openProcess: function () {
                var endpointRet = {
                    path: '/open-process',
                    host: 'antivirus',
                    verb: 'POST'
                };
                return endpointRet;
            },
            configuration: function () {
                var endpointRet = {
                    path: '/configuration',
                    host: 'antivirus',
                    verb: 'GET'
                };
                return endpointRet;
            },
            configurationPut: function () {
                var endpointRet = {
                    path: '/configuration',
                    host: 'antivirus',
                    verb: 'PUT'
                };
                return endpointRet;
            },
            fixNowActionsPut: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/fixnow-actions',
                    verb: 'PUT'
                };
                return endpointRet;
            },
            fixNowActionsGet: function () {
                var endpointRet = {
                    host: 'antivirus',
                    path: '/fixnow-actions',
                    verb: 'GET'
                };
                return endpointRet;
            },
        };
    }

    return AntivirusEndpoints;
};

},{}],134:[function(require,module,exports){
var app = angular.module('AntivirusApp');

app.factory('LauncherEndpoints', require('./launcher-endpoints')());
app.factory('AntivirusEndpoints', require('./antivirus-endpoints')());
app.factory('UpdaterEndpoints', require('./updater-endpoints')());
},{"./antivirus-endpoints":133,"./launcher-endpoints":135,"./updater-endpoints":136}],135:[function(require,module,exports){
module.exports = function () {

    /**@ngInject*/
    LauncherEndpoints.$inject = ["Tools"];
    function LauncherEndpoints(Tools) {
        
        function ep(endpoint) {
            if (endpoint == null) {
                throw new TypeError("endpoints has to be defined");
            }

            if (typeof endpoint === 'string') {
                endpoint = {
                    host: 'launcher',
                    path: endpoint,
                    verb: 'GET'
                };
            } else if (typeof endpoint === 'object') {
                endpoint.host = endpoint.host || 'launcher';
                endpoint.verb = endpoint.verb || 'GET';
            }

            endpoint.requestFilter = endpoint.requestFilter || '';
            endpoint.subscribeFilter = endpoint.subscribeFilter || '';

            return endpoint;
        }

        return {
            // Four various ways of specifying a path. Default host is 'launcher' and verb is 'GET'
            deployments: function () {
                return ep({
                    path: '/deployments',
                    subscribeFilter: '?filter[usersid]=' + Tools.GetUserSid(),
                    verb: 'POST'
                });
            },
            windowsServicesGet: function (serviceName) {
                return ep({
                    path: '/windows-services/' + serviceName,
                    verb: 'GET'
                });
            },
            windowsServicesPut: function (serviceName) {
                return ep({
                    path: '/windows-services/'+serviceName,
                    verb: 'PUT'
                });
            },
            endpoints: function () {
                return ep({
                    path: '/endpoints',
                    verb: 'GET'
                });
            },
            apps: function () {
                return ep({
                    path: '/apps',
                    requestFilter: '?filter[usersid]=' + Tools.GetUserSid(),
                    subscribeFilter: '?filter[usersid]=' + Tools.GetUserSid()
                });
            },
            upgradeableapps: function () {
                return ep({
                    path: '/apps',
                    requestFilter: '?filter[usersid]=' + Tools.GetUserSid() + '&filter[upgradeable]=true&filter[state]!=inactive',
                    subscribeFilter: '?filter[usersid]=' + Tools.GetUserSid() + '&filter[upgradeable]=true&filter[state]!=inactive'
                });
            },
            devicestates: function () {
                return ep({
                    path: '/device-states'
                });
            },
            profiles: function () {
                return ep({
                    path: '/profiles'
                });
            },
            devices: function () {
                return ep({
                    path: '/devices'
                });
            },
            tabs: function () {
                return ep({
                    path: '/ui-tabs',
                    requestFilter: '?filter[usersid]=' + Tools.GetUserSid(),
                    subscribeFilter: '?filter[usersid]=' + Tools.GetUserSid()
                });
            },
            views: function () {
                return ep({
                    path: '/views',
                    verb: 'POST'
                });
            },
            restarts: function () {
                return ep({
                    host: 'launcherui.' + GetUserSid(),
                    path: '/restarts',
                    verb: 'POST'
                });
            },
            resources: function () {
                return ep({
                    path: '/resources'
                });
            },
            quickactions: function () {
                return ep({
                    path: '/quickactions'
                });
            },
            licenses: function () {
                return ep({
                    path: '/licenses',
                    requestFilter: '?filter[usersid]=' + Tools.GetUserSid() + '&filter[days_left]<31',
                    subscribeFilter: '?filter[usersid]=' + Tools.GetUserSid()
                });
            },
            AppStatusService: function () {
                return ep({
                    path: '/app-statuses'
                });
            },
            activities: function () {
                return ep({
                    path: '/activities'
                });
            },
            appInstances: function () {
                return ep({
                    path: '/app-instances'
                });
            },
            feedbacks: function () {
                return ep({
                    path: '/feedbacks'
                });
            },
            oesettings: function (data_id) {
                return ep({
                    path: '/oesettings' + data_id
                });
            }
        };
    }

    return LauncherEndpoints;
};
},{}],136:[function(require,module,exports){
module.exports = function () {

    /**@ngInject*/
    function UpdaterEndpoints() {

        function ep(host, path) {
            var endpoint = {
                host: host,
                path: path,
                verb: 'GET'
            };

            endpoint.requestFilter = endpoint.requestFilter || '';
            endpoint.subscribeFilter = endpoint.subscribeFilter || '';

            return endpoint;
        }

        return {
            updaterStatus: function (host) {
                return ep(host, '/updater-status');
            }
        };
    }

    return UpdaterEndpoints;
};
},{}],137:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    function EventTrackingNamesService() {
        return {
            ButtonClick: 'Antivirus UI Button Click',
            LoadAdvertisementFailed: 'Antivirus UI Load Advertisement Failed',
            LoadStatisticsFailed: 'Antivirus UI Load Statistics Failed',
            InternalError: 'Antivirus UI Internal Error',
            UpdateUIStart: 'Antivirus UI Update Start',
            UpdateUIEnd: 'Antivirus UI Update End',
            AppStatusSource: 'Antivirus UI AppStatus Source',
            UIWrongPassword: 'Antivirus UI Wrong Password',
            ConnectDataError: 'Antivirus UI Connect Client Data Error',
            FeedbackHighlighted: 'Antivirus UI Feedback Highlighted',
            MixpanelPropertiesNotReceived: 'Antivirus UI Mixpanel Properties Not Received'
        };
    }

    return app.factory(name, EventTrackingNamesService);
};
},{}],138:[function(require,module,exports){
var FixNowModel = require('../model/FixNowModel');

module.exports = function (name, app) {

    /**@ngInject*/
    FixNowService.$inject = ["$rootScope", "MessageBroker", "LoggingService", "AppStatusService", "ErrorModalOverlayService", "translator", "CommonService", "AntivirusEndpoints", "WindowsServicesService"];
    function FixNowService(
        $rootScope,
        MessageBroker,
        LoggingService,
        AppStatusService,
        ErrorModalOverlayService,
        translator,
        CommonService,
        AntivirusEndpoints,
        WindowsServicesService) {
        var fixNowRunning = false;
        var endpointGet = AntivirusEndpoints.fixNowActionsGet();
        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === endpointGet.host && params.path === endpointGet.path) {
                getFixNow();
            }
        });
        
        function sendFixNowActionsRequest(value, result) {
            if (!result) {
                fixNowRunning = false;
                ErrorModalOverlayService.genericError(
                    500,
                    translator.getString("fixNowService.text.errorCallingFixNow", "error-overlay"),
                    'Error calling fix now action, because AntivirService cannot not started.',
                    {});
                return;
            }

            MessageBroker.request(AntivirusEndpoints.fixNowActionsPut(),
                function (response) {
                    fixNowRunning = false;
                    if (response.status_code && response.status_code >= 300) {
                        ErrorModalOverlayService.genericError(
                            500,
                            translator.getString("fixNowService.text.errorCallingFixNow", "error-overlay"),
                            'Error calling fix now action.',
                            {});
                        return;
                    }
                },
                {
                    data:
                    {
                        id: CommonService.generateUuid(),
                        type: "fixnow-actions"
                    }
                });
        }

        function triggerActions() {
            if (fixNowRunning === true) {
                return;
            }

            fixNowRunning = true;

            WindowsServicesService.startService("antivirservice", true, sendFixNowActionsRequest, endpointGet);
        }

        var fixNowData = new FixNowModel();

        MessageBroker.subscribe(AntivirusEndpoints.fixNowActionsPut(), function (value, verb) {
            if (verb === "PUT") {
                fixNowData.Set(value);
                $rootScope.$broadcast("fixNowDataChanged", fixNowData);
            }

        });

        getFixNow();

        function getFixNow() {
            if (AppStatusService.isFixNowRunning()) {
                MessageBroker.request(endpointGet,
                    function (response) {
                        if (response.status_code && response.status_code === 409) {
                            return;
                        }

                        if (response.status_code && response.status_code >= 300) {
                            return;
                        }

                        if (response.payload && response.payload.data) {
                            fixNowData.Set(response.payload.data);
                            $rootScope.$broadcast("fixNowDataChanged", fixNowData);
                        }
                    });
            }
        }

        return {
            progress: function () {
                return fixNowData.progress;
            },
            isUpdating: function () {
                return fixNowData.current_action === "updating";
            },
            isRebootPending: function () {
                return fixNowData.current_action === "ask_for_reboot";
            },
            triggerActions: triggerActions
        };
    }


    return app.factory(name, FixNowService);
};

},{"../model/FixNowModel":115}],139:[function(require,module,exports){
module.exports = function(name, app) {

    function IeInformationService() {
        var IEVersion = getIEVersion();
        var isIE10 = isIE10OrHigher();

        function getIEVersion() {
            var undef;
            var v = 3;
            var div = document.createElement('div');
            var all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );
            return v > 4 ? v : undef;
        }

        function isIE10OrHigher() {
            var browserInfo = navigator.userAgent;
            if (browserInfo.indexOf('MSIE 10') > 0) {
                return true;
            }

            if (browserInfo.indexOf('MSIE') === -1) {
                if (browserInfo.indexOf('Trident/') > 0 || browserInfo.indexOf('Edge/') > 0) {
                    return true;
                }
            }
            return false;
        }

        function isIEBrowser() {
            var browserInfo = navigator.userAgent;
            if (browserInfo.indexOf('MSIE') > 0) {
                return true;
            }

            if (browserInfo.indexOf('MSIE') === -1) {
                if (browserInfo.indexOf('Trident/') > 0 || browserInfo.indexOf('Edge/') > 0) {
                    return true;
                }
            }
            return false;
        }

        return {
            GetIEVersion: function () {
                return IEVersion;
            },

            IsIE: function () {
                return isIEBrowser();
            },

            IsIE10OrHigher: function () {
                return isIE10;
            },
            isIE8: function () {
                return IEVersion < 9;
            },
            isIE9: function() {
                return IEVersion < 10;
            }
        };
    }
    return app.factory(name, IeInformationService);
};
},{}],140:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./logging-service')('LoggingService', app);

app.factory('$exceptionHandler', ['$log', 'LoggingService', function ($log, LoggingService) {
    return function myExceptionHandler(exception, cause) {
        LoggingService.Error("Unexpected exception: Message: " + exception.message + " Cause: " + cause + " Stack: " + exception.stack);
        $log.error(exception, cause);
    };
}]);

require('./endpoints');
require('./velocity-factory')('$velocity', app);
require('./event-tracking-names-service')('EventTrackingNamesService', app);
require('./website-links-service')('WebsiteLinksService', app);
require('./ie-information-service')('IeInformationService', app);
require('./mixpanel-service')('MixPanelService', app);
require('./app-status-service')('AppStatusService', app);
require('./app-status-translator-service')('AppStatusTranslatorService', app); 
require('./updater-service')('UpdaterService', app);
require('./menu-bar-service')('MenuBarService', app);
require('./quarantine-service')('QuarantineService', app);
require('./activity-service')('ActivityService', app);
require('./common-service')('CommonService', app);
require('./configuration-service')('ConfigurationService', app);
require('./scan-profiles-service')('ScanProfilesService', app);
require('./scheduler-job-service')('SchedulerJobService', app);
require('./open-process-service')('OpenProcessService', app);
require('./oesettings-service')('OESettingsService', app);
require('./service-status-service')('ServiceStatusService', app);
require('./windows-services-service')('WindowsServicesService', app);
require('./fix-now-service')('FixNowService', app);
require('./endpoint-service')('EndpointService', app);
require('./overlay');
},{"./activity-service":127,"./app-status-service":128,"./app-status-translator-service":129,"./common-service":130,"./configuration-service":131,"./endpoint-service":132,"./endpoints":134,"./event-tracking-names-service":137,"./fix-now-service":138,"./ie-information-service":139,"./logging-service":141,"./menu-bar-service":142,"./mixpanel-service":143,"./oesettings-service":144,"./open-process-service":145,"./overlay":148,"./quarantine-service":151,"./scan-profiles-service":152,"./scheduler-job-service":153,"./service-status-service":154,"./updater-service":155,"./velocity-factory":156,"./website-links-service":157,"./windows-services-service":158}],141:[function(require,module,exports){
module.exports = function(name, app) {

    /**@ngInject*/
    LoggingService.$inject = ["Tools"];
    function LoggingService(Tools) {
        return {
            Info: function(message) {
                Tools.LogMessage("Info", "AVUI: " + message);
            },

            Debug: function(message) {
                Tools.LogMessage("Debug", "AVUI: " + message);
            },

            Error: function(message) {
                Tools.LogMessage("Error", "AVUI: " + message);
            },

            Fatal: function(message) {
                Tools.LogMessage("Fatal", "AVUI: " + message);
            },

            Warn: function(message) {
                Tools.LogMessage("Warn", "AVUI: " + message);
            },

            Trace: function(message) {
                Tools.LogMessage("Trace", "AVUI: " + message);
            }
        };
    }

    return app.factory(name, LoggingService);
};
},{}],142:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    MenuBarService.$inject = ["$rootScope", "LoggingService", "translator", "$timeout", "AppStatusService", "WebsiteLinksService", "ConfigurationService", "ServiceStatusService"];
    function MenuBarService(
        $rootScope,
        LoggingService,
        translator,
        $timeout,
        AppStatusService,
        WebsiteLinksService,
        ConfigurationService,
        ServiceStatusService) {
        var currentView = '';
        
        function checkAppStatusServiceEnabled(serviceName) {
            return AppStatusService.modules[serviceName] === 'enabled';
        }
        function changeServiceStatus(serviceName, value) {
            var state;
            if (value === false) {
                state = "snoozed";
            }
            else {
                state = "enabled";
            }

            ServiceStatusService.changeServiceState(serviceName, state);
        }

        function getAdvertisementButtonText(entry) {
            if (AppStatusService.needToRenewLicense()) {
                var string = AppStatusService.isServerOS() ? "modules.subMenuEntryPage.server.renew" : "modules.subMenuEntryPage.pro.renew";
                return translator.getString(string, "menubar");
            }

            if (AppStatusService.isServerOS()) {
                return translator.getString("modules.subMenuEntryPage.server.upgrade", "menubar");
            }

            return translator.getString("modules.subMenuEntryPage.pro.upgrade", "menubar");
        }

        function getInstallationTooltipText(entryToInstall) {
            return translator.getString("modulesSubPage.text.notInstalledModuleHelpText", null, { moduleName: entryToInstall })
        }

        function getConfigurationTooltipText(page, section, configuration) {
            return translator.getString("modulesSubPage.text.notEnabledConfigurationHelpText", null, { page: page, section: section, configuration: configuration })
        }

        var modulePageRealTime = {
            isFeatureAvailableCallback: function () {
                return true;
            },
            isProtected: true,
            isInstalled: true,
            key: "real-time-protection",
            icon: "icon_antivirus-realtime_protection",
            getNameCallback: function () {
                return translator.getString("real-time-protection", "modules");
            },
            isPaidFeature: false,
            isSubMenuOpened: false,
            directive: "modules-subpage",
            iconNotInstalled: "",
            iconEnabled: "menubar-module-realtime-protection__enabled",
            iconSnoozed: "menubar-module-realtime-protection__snoozed",
            getHeadingTextCallback: function () {
                return translator.getString("modules.subMenuEntryPage.realTimeProtection.heading", "menubar");
            },
            togglerLabel: translator.getString("real-time-protection", "modules"),
            settingsArguments: "/STARTPAGE=33",
            serviceName: 'guard',
            toolTipLink: WebsiteLinksService.getSupport(),
            toolTipHeading: translator.getString("modulesSubPage.text.notInstalledModuleHelpHeading"),
            toolTipText: getInstallationTooltipText(translator.getString("real-time-protection", "modules")),
            toolTipLinkText: translator.getString("modulesSubPage.text.notInstalledModuleHelpLinkText"),
            hasSetting: true,
            passwordFeatureName: "snooze_guard",
            windowsServiceName: 'antivirservice',
            isEnabledCallback: function () {
                return checkAppStatusServiceEnabled("guard");
            },
            changeStateCallback: function (value) {
                changeServiceStatus('guard', value);
            },
            isDisabledCallback: function () {
                return false;
            },
            isNotInstalledCallback: function () {
                return false;
            },
            hasState: true,
            installModuleText: translator.getString("modulesSubPage.text.installModule", null, { module: translator.getString("real-time-protection", "modules") }),
            moduleNotInstalledText: translator.getString("modulesSubPage.text.moduleNotInstalled"),
            askForPasswordOnEnable: false,
            hasToggler: true
        }

        var modulePageFirewall = {
            isFeatureAvailableCallback: function () {
                return true;
            },
            isProtected: true,
            isInstalled: true,
            key: "firewall",
            icon: "icon_antivirus-firewall",
            getNameCallback: function () {
                return translator.getString("firewall", "modules");
            },
            isPaidFeature: false,
            isSubMenuOpened: false,
            directive: "modules-subpage",
            iconNotInstalled: "menubar-module-firewall-protection__not-installed",
            iconEnabled: "menubar-module-firewall-protection__enabled",
            iconSnoozed: "menubar-module-firewall-protection__snoozed",
            getHeadingTextCallback: function () {
                return translator.getString("modules.subMenuEntryPage.firewall.heading", "menubar");
            },
            togglerLabel: translator.getString("firewall", "modules"),
            settingsArguments: "/STARTPAGE=100",
            serviceName: 'firewall',
            toolTipLink: WebsiteLinksService.getKBSupport(),
            toolTipHeading: translator.getString("modulesSubPage.text.notInstalledModuleHelpHeading"),
            toolTipText: getInstallationTooltipText(translator.getString("firewall", "modules")),
            toolTipLinkText: translator.getString("modulesSubPage.text.notInstalledModuleHelpLinkText"),
            hasSetting: true,
            passwordFeatureName: "",
            windowsServiceName: 'MpsSvc',
            isEnabledCallback: function () {
                return checkAppStatusServiceEnabled("firewall");
            },
            changeStateCallback: function (value) {
                changeServiceStatus('firewall', value);
            },
            isDisabledCallback: function () {
                return false;
            },
            isNotInstalledCallback: function () {
                return AppStatusService.modules["firewall"] === 'not_installed' ? true : false;
            },
            hasState: true,
            installModuleText: translator.getString("modulesSubPage.text.installModule", null, { module: translator.getString("firewall", "modules") }),
            moduleNotInstalledText: translator.getString("modulesSubPage.text.moduleNotInstalled"),
            askForPasswordOnEnable: false,
            hasToggler: true
        }

        var modulePageWebProtection = {
            isFeatureAvailableCallback: function () {
                return true;
            },
            isProtected: true,
            isInstalled: false,
            key: "web-protection",
            icon: "icon_antivirus-web_protection",
            getNameCallback: function () {
                return translator.getString("web-protection", "modules");
            },
            isPaidFeature: true,
            isSubMenuOpened: false,
            directive: "modules-subpage",
            iconNotInstalled: "menubar-module-web-protection__not-installed",
            iconEnabled: "menubar-module-web-protection__enabled",
            iconSnoozed: "menubar-module-web-protection__snoozed",
            getHeadingTextCallback: function () {
                return translator.getString("modules.subMenuEntryPage.webProtection.heading", "menubar");
            },
            togglerLabel: translator.getString("web-protection", "modules"),
            settingsArguments: "/STARTPAGE=43",
            serviceName: 'webguard',
            toolTipLink: WebsiteLinksService.getSupport(),
            toolTipHeading: translator.getString("modulesSubPage.text.notInstalledModuleHelpHeading"),
            toolTipText: getInstallationTooltipText(translator.getString("web-protection", "modules")),
            toolTipLinkText: translator.getString("modulesSubPage.text.notInstalledModuleHelpLinkText"),
            hasSetting: true,
            passwordFeatureName: "snooze_webguard",
            windowsServiceName: 'antivirwebservice',
            isEnabledCallback: function () {
                return checkAppStatusServiceEnabled("webguard");
            },
            changeStateCallback: function (value) {
                changeServiceStatus('webguard', value);
            },
            isDisabledCallback: function () {
                return false;
            },
            isNotInstalledCallback: function () {
                return AppStatusService.modules["webguard"] === 'not_installed' ? true : false;
            },
            hasState: true,
            installModuleText: translator.getString("modulesSubPage.text.installModule", null, { module: translator.getString("web-protection", "modules") }),
            moduleNotInstalledText: translator.getString("modulesSubPage.text.moduleNotInstalled"),
            askForPasswordOnEnable: false,
            hasToggler: true
        }

        var modulePageMailProtection = {
            isFeatureAvailableCallback: function () {
                if (AppStatusService.isServerOS()) {
                    return false;
                }

                return true;
            },
            isProtected: true,
            isInstalled: false,
            key: "mail-protection",
            icon: "icon_antivirus-mail_protection",
            getNameCallback: function () {
                return translator.getString("mail-protection", "modules");
            },
            isPaidFeature: true,
            isSubMenuOpened: false,
            directive: "modules-subpage",
            iconNotInstalled: "menubar-module-mail-protection__not-installed",
            iconEnabled: "menubar-module-mail-protection__enabled",
            iconSnoozed: "menubar-module-mail-protection__snoozed",
            getHeadingTextCallback: function () {
                return translator.getString("modules.subMenuEntryPage.mailProtection.heading", "menubar");
            },
            togglerLabel: translator.getString("mail-protection", "modules"),
            settingsArguments: "/STARTPAGE=34",
            serviceName: 'mailguard',
            toolTipLink: WebsiteLinksService.getSupport(),
            toolTipHeading: translator.getString("modulesSubPage.text.notInstalledModuleHelpHeading"),
            toolTipText: getInstallationTooltipText(translator.getString("mail-protection", "modules")),
            toolTipLinkText: translator.getString("modulesSubPage.text.notInstalledModuleHelpLinkText"),
            hasSetting: true,
            passwordFeatureName: "snooze_mailguard",
            windowsServiceName: 'antivirmailservice',
            isEnabledCallback: function () {
                return checkAppStatusServiceEnabled("mailguard");
            },
            changeStateCallback: function (value) {
                changeServiceStatus('mailguard', value);
            },
            isDisabledCallback: function () {
                return AppStatusService.modules['mailguard'] === 'disabled';
            },
            isNotInstalledCallback: function () {
                return AppStatusService.modules["mailguard"] === 'not_installed' ? true : false;
            },
            hasState: true,
            installModuleText: translator.getString("modulesSubPage.text.installModule", null, { module: translator.getString("mail-protection", "modules") }),
            moduleNotInstalledText: translator.getString("modulesSubPage.text.moduleNotInstalled"),
            askForPasswordOnEnable: false,
            hasToggler: true
        }

        var modulePageCloudProtection = {
            isFeatureAvailableCallback: function () {
                return true;
            },
            isProtected: true,
            isInstalled: false,
            key: "cloud-protection",
            icon: "icon_antivirus-cloud_protection",
            getNameCallback: function () {
                if (AppStatusService.isPaidProduct()) {
                    return translator.getString("cloud-protection-plus", "modules");
                }
                else {
                    return translator.getString("cloud-protection", "modules");
                }
            },
            isPaidFeature: true,
            isSubMenuOpened: false,
            directive: "modules-subpage",
            iconNotInstalled: "menubar-module-cloud-protection__free",
            iconEnabled: "menubar-module-cloud-protection__paid",
            iconSnoozed: "",
            getHeadingTextCallback: function () {
                if (AppStatusService.isPaidProduct()) {
                    return translator.getString("modules.subMenuEntryPage.cloudProtectionPlus.heading", "menubar");
                }
                else {
                    return translator.getString("modules.subMenuEntryPage.cloudProtection.heading", "menubar");
                }
            },
            togglerLabel: "",
            settingsArguments: "/STARTPAGE=74",
            serviceName: '',
            toolTipLink: "",
            toolTipHeading: "",
            toolTipText: "",
            toolTipLinkText: "",
            hasSetting: false,
            passwordFeatureName: "",
            windowsServiceName: '',
            isEnabledCallback: function () {
                return AppStatusService.isPaidProduct();
            },
            changeStateCallback: function (value) {
            },
            isDisabledCallback: function () {
                return false;
            },
            isNotInstalledCallback: function () {
                return !AppStatusService.isPaidProduct();
            },
            hasState: true,
            installModuleText: "",
            moduleNotInstalledText: "",
            askForPasswordOnEnable: false,
            hasToggler: false
        }

        var modulePageRansomWare = {
            isFeatureAvailableCallback: function () {
                return true;
            },
            isProtected: true,
            isInstalled: true,
            key: "ransomware-protection",
            icon: "icon_antivirus-ransomware_protection",
            getNameCallback: function () {
                return translator.getString("ransomware-protection", "modules");
            },
            isPaidFeature: true,
            isSubMenuOpened: false,
            directive: "modules-subpage",
            iconNotInstalled: "menubar-module-ransomware-protection__not-installed",
            iconEnabled: "menubar-module-ransomware-protection__enabled",
            iconSnoozed: "menubar-module-ransomware-protection__snoozed",
            getHeadingTextCallback: function () {
                return translator.getString("modules.subMenuEntryPage.ransomwareProtection.heading", "menubar");
            },
            togglerLabel: translator.getString("ransomware-protection", "modules"),
            settingsArguments: "/STARTPAGE=74",
            serviceName: 'guard',
            toolTipLink: WebsiteLinksService.getSupport(),
            toolTipHeading: translator.getString("modulesSubPage.text.notEnabledModuleHelpHeading"),
            toolTipText: getConfigurationTooltipText(
                translator.getString("configuration.tab.general"),
                translator.getString("configuration.tab_general.section.advanced_protection"),
                translator.getString("configuration.tab_general.advanced_protection_value.sensor_detection")),
            toolTipLinkText: translator.getString("modulesSubPage.text.notInstalledModuleHelpLinkText"),
            hasSetting: false,
            passwordFeatureName: "open_config",
            windowsServiceName: 'antivirservice',
            isEnabledCallback: function () {
                return checkAppStatusServiceEnabled("extended_ransomware_protection");
            },
            changeStateCallback: function (value) {
                if (value === false) {
                    state = "0";
                }
                else {
                    state = "1";
                }

                ConfigurationService.changeConfigurationFileEntry(
                    "GUARD", "OnRansomwareDetections", state);
            },
            isDisabledCallback: function () {
                return AppStatusService.modules["extended_ransomware_protection"] === 'disabled' ? true : false;
            },
            isNotInstalledCallback: function () {

                var state = (AppStatusService.isPaidProduct() === true) ? 'disabled' : 'not_installed';

                return AppStatusService.modules["extended_ransomware_protection"] === state ? true : false;
            },
            refreshOnEvent: 'configurationFileEntryChanged',
            hasState: true,
            installModuleText: translator.getString("modulesSubPage.text.enableModule", null, { module: translator.getString("ransomware-protection", "modules") }),
            moduleNotInstalledText: translator.getString("modulesSubPage.text.moduleNotEnabled"),
            askForPasswordOnEnable: true,
            hasToggler: true
        }
                
        function getModuleSubMenu() {
            return [
                modulePageRealTime,
                modulePageRansomWare,
                modulePageWebProtection,
                modulePageMailProtection,
                modulePageFirewall,
                modulePageCloudProtection
            ];
        }
        
        var menu = [
            {
                key: "status",
                icon: "icon_antivirus-status",
                text: translator.getString("status.menuEntry", "menubar"),
                subMenu: []
            },
            {
                key: "scan",
                icon: "icon_antivirus-scan",
                text: translator.getString("scan.menuEntry", "menubar"),
                isSubMenuOpened: false,
                isSubMenuIconStyled: true,
                subMenu: [
                    {
                        key: "full-scan",
                        icon: "icon_antivirus-fullscan",
                        text: translator.getString("scan.subMenuEntry.fullScan", "menubar"),
                        description: translator.getString("scan.subMenuEntryDescription.fullScan", "menubar"),
                        isSubMenuOpened: false,
                        directive: "full-scan"
                    },
                    {
                        key: "quick-scan",
                        icon: "icon_antivirus-quickscan",
                        text: translator.getString("scan.subMenuEntry.quickScan", "menubar"),
                        description: translator.getString("scan.subMenuEntryDescription.quickScan", "menubar"),
                        isSubMenuOpened: false,
                        directive: "quick-scan"
                    },
                    {
                        key: "custom-scan",
                        icon: "icon_antivirus-customscan",
                        text: translator.getString("scan.subMenuEntry.customScan", "menubar"),
                        description: translator.getString("scan.subMenuEntryDescription.customScan", "menubar"),
                        isSubMenuOpened: false,
                        directive: "custom-scan"
                    },
                    {
                        key: "scheduled-scan",
                        icon: "icon_antivirus-scheduled",
                        text: translator.getString("scan.subMenuEntry.scheduledScan", "menubar"),
                        description: translator.getString("scan.subMenuEntryDescription.scheduledScan", "menubar"),
                        isSubMenuOpened: false,
                        directive: "scheduled-scan"
                    }
                ]
            },
            {
                key: "modules",
                icon: "icon_antivirus-modules",
                text: translator.getString("modules.menuEntry", "menubar"),
                isSubMenuOpened: false,
                isSubMenuIconStyled: false,
                isProtected: true,
                subMenu: getModuleSubMenu()
            },
            {
                key: "quarantine",
                icon: "icon_antivirus-quarantine",
                text: translator.getString("quarantine.menuEntry", "menubar"),
                subMenu: []
            },
            {
                key: "activity",
                icon: "icon_antivirus-activity",
                text: translator.getString("activity.menuEntry", "menubar"),
                subMenu: []
            }
        ];

        function filterMenu(key) {
            return _.filter(menu, function (entry) { // creates new array
                return entry.key === key;
            });
        }

        function findMenu(menu, key) {
            return _.find(menu, function(entry){ // returns original array
                return entry.key === key;
            });
        }

        $rootScope.$on('appStatusChanged', function(event, data) {
            var modules = findMenu(menu, 'modules');

            if (data.attributes.section === 'about') {
                modules.subMenu = getModuleSubMenu();
            }

            $timeout(function () {
                isModulesProtected(modules);
            }, 200);
        });


        function isModulesProtected(modules) {
            modules.isProtected = _.reduce(modules.subMenu, function (result, value) {
                if (value.isInstalled === true)
                {
                    if (value.isDisabled === true) {
                        return result;
                    }

                    return value.isProtected && result;
                }
                else
                {
                    return result;
                }
            }, true);
        }

        function openMenu(view, subMenu) {
            for (var i = 0; i < menu.length; i++) {
                if (view === menu[i].key) {
                    menu[i].isSubMenuOpened = true;
                    if (subMenu) {
                        for (var i3 = 0; i3 < menu[i].subMenu.length; i3++) {
                            menu[i].subMenu[i3].isSubMenuOpened = subMenu === menu[i].subMenu[i3].key;
                        }
                    } else {
                        for (var i2 = 0; i2 < menu[i].subMenu.length; i2++) {
                            menu[i].subMenu[i2].isSubMenuOpened = false;
                        }
                    }
                } else {
                    menu[i].isSubMenuOpened = false;
                    for (var i1 = 0; i1 < menu[i].subMenu.length; i1++) {
                        menu[i].subMenu[i1].isSubMenuOpened = false;
                    }
                }
            }
        }

        function isMenuOpened(subMenu) {
            for (var i = 0; i < menu.length; i++) {
                if (subMenu === menu[i].key) {
                    return menu[i].isSubMenuOpened;
                }
            }

            return false;
        }

        function isSubMenuOpened(parent, subMenu) {
            for (var i = 0; i < menu.length; i++) {
                if (parent === menu[i].key) {
                    for (var i1 = 0; i1 < menu[i].subMenu.length; i1++) {
                        if (subMenu === menu[i].subMenu[i1].key) {
                            return menu[i].subMenu[i1].isSubMenuOpened;
                        }
                    }
                }
            }

            return false;
        }

        function isAnyMenuOpened() {
            for (var i = 0; i < menu.length; i++) {
                if (menu[i].isSubMenuOpened) {
                    return true;
                }
            }

            return false;
        }

        function setCurrentView(view) {
            currentView = view;
        }

        function isViewOpened(view) {
            return currentView === view && isAnyMenuOpened() === false;
        }

        function closeAllMenus() {
            for (var i = 0; i < menu.length; i++) {
                menu[i].isSubMenuOpened = false;
                for (var i1 = 0; i1 < menu[i].subMenu.length; i1++) {
                    menu[i].subMenu[i1].isSubMenuOpened = false;
                }
            }
        }

        function getMenu() {
            return menu;
        }

        return {
            openMenu: openMenu,
            isSubMenuOpened: isSubMenuOpened,
            isMenuOpened: isMenuOpened,
            setCurrentView: setCurrentView,
            isViewOpened: isViewOpened,
            closeAllMenus: closeAllMenus,
            filterMenu: filterMenu,
            findMenu: findMenu,
            getMenu: getMenu,
            getAdvertisementButtonText: getAdvertisementButtonText
        };
    }

    return app.factory(name, MenuBarService);
};
},{}],143:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    MixPanelService.$inject = ["$rootScope", "$timeout", "AppStatusService", "Tools", "MixpanelEventTracker", "EndpointService", "AntivirusEndpoints", "LoggingService", "EventTrackingNamesService"];
    function MixPanelService(
        $rootScope,
        $timeout,
        AppStatusService,
        Tools,
        MixpanelEventTracker,
        EndpointService,
        AntivirusEndpoints,
        LoggingService,
        EventTrackingNamesService) {
        var waitForAppState;
        var mixPanelQueue = [];
        var startTimer = $timeout(function () {
                startTimer = null;

                LoggingService.Error("Mixpanel default properties not received after 30 seconds");
                refreshCommonProperties();
                MixpanelEventTracker.TrackEvent(EventTrackingNamesService.MixpanelPropertiesNotReceived, {});
                if (mixPanelQueue.length > 0) {
                    sendEventAsync();
                }
            },
            30000);

        var endpointAppStatuses = AntivirusEndpoints.appStatus();
        var appStateReceived = false;

        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === endpointAppStatuses.host && params.path === endpointAppStatuses.path) {
                LoggingService.Debug("Mixpanel default properties are added because app-statuses resource was addedd");

                waitForAppState = $rootScope.$on('appStatusChanged', function (event, data) {
                    if (data.attributes.section === 'about') {
                        LoggingService.Debug("App-statuses changed stop waiting for event");
                        waitForAppState();
                        refreshCommonProperties();
                    }
                });

                refreshCommonProperties();
            }
        });
        $rootScope.$on('endpointResourceDelete', function (event, params) {
            if (params.host === endpointAppStatuses.host && params.path === endpointAppStatuses.path) {
                LoggingService.Debug("Mixpanel default properties are deleted because app-statuses resource was deleted");
                appStateReceived = false;
            }
        });

        waitForAppState = $rootScope.$on('appStatusChanged', function (event, data) {
            if (data.attributes.section === 'about') {
                LoggingService.Debug("App-statuses changed stop waiting for event");
                waitForAppState();
                refreshCommonProperties();
            }
        });

        if (EndpointService.doesResourceExist(endpointAppStatuses)) {
            LoggingService.Debug("Mixpanel default properties because app-statuses resource exists no wait needed");
            refreshCommonProperties();
        }

        function refreshCommonProperties() {
            if (!AppStatusService.about === null) {
                LoggingService.Debug("About section not set");
                if (waitForAppState) {
                    LoggingService.Debug("Mixpanel default properties can't be set because app-statuses not yet received");
                    return;
                } else {
                    LoggingService.Error("About section not set");
                }
            }

            if (waitForAppState) {
                waitForAppState();
            }

            MixpanelEventTracker.setCommonPropertiesCallback(getCommonProperties);
            LoggingService.Debug("Mixpanel default properties set");
            appStateReceived = true;


            if (startTimer != null) {
                $timeout.cancel(startTimer);
                startTimer = null;
                LoggingService.Debug("Mixpanel default properties timer canceled");

                if (mixPanelQueue.length > 0) {
                    sendEventAsync();
                }
            }
        }

        function getCommonProperties(properties) {
            properties["Antivirus Version"] = AppStatusService.about.version;
            properties["Antivirus Product ID"] = AppStatusService.about.product_id;
            properties["Antivirus Language"] = AppStatusService.about.language;

            // These values can't be send from the UI but are common antivirus properties so we filled them with pseudo data
            properties["Antivirus Version Source"] = "HTMLUI";
            properties["Is Parent Process Avira Signed"] = "HTMLUI";
            properties["Antivirus License Mode"] = "HTMLUI";
            properties["Is Process Avira Signed"] = "HTMLUI";
            properties["Parent Process Path"] = "HTMLUI";
            properties["Process Path"] = "HTMLUI";
            properties["Process Command Line"] = "HTMLUI";
            properties["Process Integrity Level"] = "HTMLUI";
            properties["Process ID"] = "HTMLUI";
            properties["Is Universal C Runtime Installed"] = "HTMLUI";
            properties["Os time"] = "1989-11-09T00:00:00";
        }

        var currentJob;
        function sendEventAsync() {
            if (appStateReceived === false) {
                return;
            }

            currentJob = mixPanelQueue.pop();

            MixpanelEventTracker.TrackEvent(currentJob.eventName, currentJob.dictionary);

            if (mixPanelQueue.length > 0) {
                sendEventAsync();
            }
        }

        function TrackEvent(eventName, dictionary) {
            if (appStateReceived === false) {
                mixPanelQueue.push(
                    {
                        eventName: eventName,
                        dictionary: dictionary
                    });

                sendEventAsync();
                return;
            }

            MixpanelEventTracker.TrackEvent(eventName, dictionary);
        }
        return {
            TrackEvent: TrackEvent
        };
    }

    return app.factory(name, MixPanelService);
};
},{}],144:[function(require,module,exports){
module.exports = function(name, app) {

    /**@ngInject*/
    OESettingsService.$inject = ["MessageBroker", "LauncherEndpoints", "LoggingService"];
    function OESettingsService(MessageBroker, LauncherEndpoints, LoggingService) {
        
        function getSetting(data_id, callback) {
           MessageBroker.request(LauncherEndpoints.oesettings(data_id),
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Can't identify if launcher is default view. Status code: " + response.status_code);
                        callback(null);
                        return;
                    }
                    if (response.payload && response.payload.data && response.payload.data.attributes && response.payload.data.attributes.value) {
                        if(data_id === "/DefaultView") {
                            callback(response.payload.data.attributes.value);
                        }
                    }
                });
        }

        function isAntivirusDefaultView(callback)
        {
            getSetting("/DefaultView", function(value)
                {
                    if(!value)
                    {
                        callback(false);
                    }

                    callback(value === "antivirus");
                });
        }

        return {
            isAntivirusDefaultView: isAntivirusDefaultView
        };
    }

    return app.factory(name, OESettingsService);
};
},{}],145:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    OpenProcessService.$inject = ["$rootScope", "$timeout", "MessageBroker", "Tools", "LoggingService", "ErrorModalOverlayService", "translator", "CommonService", "AntivirusEndpoints"];
    function OpenProcessService(
        $rootScope,
        $timeout,
        MessageBroker,
        Tools,
        LoggingService,
        ErrorModalOverlayService,
        translator,
        CommonService,
        AntivirusEndpoints) {

        var openProcessEndpoint = AntivirusEndpoints.openProcess();
        var sendRequestQueque = [];
        var currentJob = null; 

        function checkJobAddedASecondAgoLogic(newJob, alreadyAddedJob) {
            if (alreadyAddedJob.processName === newJob.processName &&
                alreadyAddedJob.payload.data.attributes.usersid === newJob.payload.data.attributes.usersid &&
                alreadyAddedJob.payload.data.attributes.path === newJob.payload.data.attributes.path &&
                alreadyAddedJob.payload.data.attributes.arguments === newJob.payload.data.attributes.arguments &&
                moment(alreadyAddedJob.timestampUtc).add(1, 'seconds').unix() > newJob.timestampUtc.unix()) {
                return true;
            }

            return false;
        }
        function checkJobAddedASecondAgo(item) {
            if (currentJob !== null && checkJobAddedASecondAgoLogic(item, currentJob)) {
                return true;
            }

            for (var i = 0; i < sendRequestQueque.length; i++) {
                if (checkJobAddedASecondAgoLogic(item, sendRequestQueque[i])) {
                    return true;
                }
            }

            return false;
        }
        
        function openControlCenter(arg) {
            var payload = {
                data: {
                    type: 'open-process',
                    attributes: {
                        usersid: Tools.GetUserSid(),
                        path: "%INSTALLDIR%\\avcenter.exe",
                        arguments: arg
                    }
                }
            };

            executeRequest(
                payload,
                translator.getString("openProcessService.text.controlCenter", "error-overlay"));
        }
        
        function openConfigCenter(arg) {
            var payload = {
                data: {
                    type: 'open-process',
                    attributes: {
                        usersid: Tools.GetUserSid(),
                        path: "%INSTALLDIR%\\avconfig.exe",
                        arguments: arg
                    }
                }
            };

            executeRequest(
                payload,
                translator.getString("openProcessService.text.configCenter", "error-overlay"));
        }    

        function run(path, arg) {
            var payload = {
                data: {
                    type: 'open-process',
                    attributes: {
                        usersid: Tools.GetUserSid(),
                        path: path,
                        arguments: arg
                    }
                }
            };

            executeRequest(
                payload,
                path);
        }    

        function executeRequest(payload, processName)
        {
            var nowUtc = moment().utc();
            var item = {
                payload: payload,
                processName: processName,
                timestampUtc: nowUtc
            };

            if (checkJobAddedASecondAgo(item) === true) {
                return;
            }
            
            sendRequestQueque.push(item);
            sendOpenProcessRequest();
        }

        var startTimer = null;
        function sendOpenProcessRequest() {
            if (startTimer === null) {
                startTimer = $timeout(function () {
                    startTimer = null;
                    ErrorModalOverlayService.genericError(
                        503,
                        translator.getString("openProcessService.text.couldNotStartProcess","error-overlay", { processName: currentJob.processName }),
                        "Could not open process",
                        { ProcessName: currentJob.processName });

                    if (sendRequestQueque.length > 0) {
                        sendOpenProcessRequest();
                    }
                }, 10000);

                currentJob = sendRequestQueque.pop();
                
                MessageBroker.request(openProcessEndpoint,
                    function (response) {
                        $timeout.cancel(startTimer);
                        startTimer = null;

                        if (response.status_code !== 200) {     
                            ErrorModalOverlayService.genericError(
                                response.status_code,
                                translator.getString("openProcessService.text.couldNotStartProcess", "error-overlay", { processName: currentJob.processName }),
                                "Could not open process",
                                { ProcessName: currentJob.processName }
                            );
                        }

                        if (sendRequestQueque.length > 0) {
                            sendOpenProcessRequest();
                        }
                    },
                    currentJob.payload);
            }
        }

        return {
            run: run,
            openControlCenter: openControlCenter,
            openConfigCenter: openConfigCenter
        };
    }

    return app.factory(name, OpenProcessService);
};
},{}],146:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    service.$inject = ["$rootScope"];
    function service($rootScope) {

        function show() {
            $rootScope.$broadcast('showAboutOverlay');
        }

        return {
            show: show
        };
    }

    return app.factory(name, service);
};
},{}],147:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    service.$inject = ["$rootScope", "translator", "WebsiteLinksService"];
    function service($rootScope, translator, WebsiteLinksService) {

        function updateError(code, message, messageNonLoc, additionalMixpanelProperties) {
            $rootScope.$broadcast("showErrorOverlay", encode(
                code,
                message,
                messageNonLoc,
                'update-error',
                translator.getString("errorModalOverlayService.text.updateError", "error-overlay"),
                translator.getString("errorModalOverlayService.button.viewSolution", "error-overlay"),
                'Avira Antivirus failed to update',
                'View Solution',
                WebsiteLinksService.getSupport(),
                additionalMixpanelProperties));
        }

        function genericError(code, message, messageNonLoc, additionalMixpanelProperties) {
            $rootScope.$broadcast("showErrorOverlay", encode(
                code,
                message,
                messageNonLoc,
                'generic-error',
                translator.getString("errorModalOverlayService.text.genericError", "error-overlay"),
                translator.getString("errorModalOverlayService.button.contactSupport", "error-overlay"),
                'Avira Antivirus encountered an error',
                'Contact Support',
                WebsiteLinksService.getSupport(),
                additionalMixpanelProperties));
        }

        function systemError(code, message, messageNonLoc, additionalMixpanelProperties) {
            $rootScope.$broadcast("showErrorOverlay", encode(
                code,
                message,
                messageNonLoc,
                'system-error',
                translator.getString("errorModalOverlayService.text.systemError", "error-overlay"),
                translator.getString("errorModalOverlayService.button.contactSupport", "error-overlay"),
                'Avira Antivirus fatal system error',
                'Contact Support',
                WebsiteLinksService.getSupport(),
                additionalMixpanelProperties)
            );
        }

        function cancel() {
            $rootScope.$broadcast('hideErrorOverlay');
        }

        function encode(
            code,
            message,
            messageNonLoc,
            icon,
            header,
            actionText,
            headerNonLoc,
            actionTextNonLoc,
            actionUrl,
            additionalMixpanelProperties) {
            return {
                code: code,
                message: message,
                messageNonLoc: messageNonLoc,
                icon: icon,
                header: header,
                actionText: actionText,
                headerNonLoc: headerNonLoc,
                actionTextNonLoc: actionTextNonLoc,
                actionUrl: actionUrl,
                additionalMixpanelProperties: additionalMixpanelProperties
            };
        }

        return {
            genericError: genericError,
            updateError: updateError,
            systemError: systemError,
            cancel: cancel
        };
    }

    return app.factory(name, service);
};
},{}],148:[function(require,module,exports){
var app = angular.module('AntivirusApp');

require('./error-modal-overlay-service')('ErrorModalOverlayService', app);
require('./update-modal-overlay-service')('UpdateModalOverlayService', app);
require('./about-modal-overlay-service')('AboutModalOverlayService', app);
require('./overlay-service')('OverlayService', app);
},{"./about-modal-overlay-service":146,"./error-modal-overlay-service":147,"./overlay-service":149,"./update-modal-overlay-service":150}],149:[function(require,module,exports){
module.exports = function(name, app) {

    /**@ngInject*/
    service.$inject = ["$rootScope", "$window"];
	function service($rootScope, $window) {
        function makeOverlayMoveable() {
            var makeWindowMovable = function() {
                $(".overlay").on('mousedown',
                    function(event) {
                        if ("Execute" in $window.external) {
                            $window.external.Execute("aoe://Move");
                        } else if ("Execute" in $window.iexternal) {
                            $window.iexternal.Execute("aoe://Move");
                        }
                        $rootScope.$emit("headerMoved", event);
                    });
            };

            angular.element(document).ready(function() {
                makeWindowMovable();
            });
        };

        return {
            makeOverlayMoveable: makeOverlayMoveable
        }
    };

    return app.factory(name, service);
}
},{}],150:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    service.$inject = ["$rootScope", "LoggingService"];
    function service($rootScope, LoggingService) {
        var isRunning = false;
        function startUIUpdate() {
            isRunning = true;
            $rootScope.$broadcast('showUpdateOverlay');
        }

        function finishUIUpdate(is_ui_locked) {
            if (isRunning) {
                isRunning = false;

                if (is_ui_locked === true) { // success
                    $rootScope.$broadcast('switchToReloadUI');
                } else { // we estimate a failed signature check or unlocked files
                    $rootScope.$broadcast('switchToRedirectToLauncherOverlay');
                }
            }
        }

        function startWaitForSignatureCheckResult() {
            if (isRunning) {
                $rootScope.$broadcast('startWaitForSignatureCheckResult');
            }
        }

        function isUIUpdateRunning() {
            return isRunning;
        }

        return {
            startUIUpdate: startUIUpdate,
            startWaitForSignatureCheckResult: startWaitForSignatureCheckResult,
            finishUIUpdate: finishUIUpdate,
            isUIUpdateRunning: isUIUpdateRunning
        };
    }

    return app.factory(name, service);
};
},{}],151:[function(require,module,exports){
var QuarantineModel = require('../model/QuarantineModel');
module.exports = function (name, app) {

    /**@ngInject*/
    QuarantineService.$inject = ["$document", "$rootScope", "$timeout", "Tools", "OpenProcessService", "MessageBroker", "LoggingService", "translator", "ErrorModalOverlayService", "AntivirusEndpoints", "ConfigurationService", "CommonService"];
    function QuarantineService(
        $document,
        $rootScope,
        $timeout,
        Tools,
        OpenProcessService,
        MessageBroker,
        LoggingService,
        translator,
        ErrorModalOverlayService,
        AntivirusEndpoints,
        ConfigurationService,
        CommonService) {
        var endpoint = AntivirusEndpoints.quarantineGet();
        var defaultLocationPath = '';
        var maximumObjectsPerPage = 100;
        var hasLoadedDataOnce = false;
        var currentRequest = null;
        var operation = '';
        var maxPageNumber;
        var startLoadTime;
        var stopLoadTime;
        var loadingTime;
        var isAscending = false;
        var sortByPropertyName = "date";

        var currentSort = "date";
        var currentSortIsAscending = false;

        var progressDialogVisible = false;
        var resultDialogVisible = false;
        var restoredToOriginalLocation = 0;
        var restoredToDefaultLocation = 0;
        var couldNotBeRestored = 0;
        var couldNotBeAddedToTheWL = 0;
        var filesDeleted = 0;
        var couldNotBeDeleted = 0;
        var statusCode = 500;

        var addItemRunning = false;
        var numberOfRescannedObjects = 0;
        var cleanBeforeRescan = 0;
        var cleanAfterRescan = 0;
        var suspiciousBeforeRescan = 0;
        var totalItemCount = 0;
        var suspiciousAfterRescan = 0;
        var detectedBeforeRescan = 0;
        var detectedAfterRescan = 0;
        var cleanFilesAfterRescan = [];
        var quarantineItems = [];
        var quarantineItemsOrdered = [];

        var currentEndpoint;
        var nextEndpoint;
        var previousEndpoint;
        var lastEndpoint;
        var firstEndpoint;
        var initialEndpoint;
        var includeItemsList = [];
        var currentPage = 0;
        var firstPage = 0;
        var lastPage = 0;
        var previousPage = 0;
        var nextPage = 0;
        var excludeItemsList = [];
        var selectAll = false;
        var selectAllShown = false;

        function createQuarantineLoader() {
            var isLoading = true;
            return {
                enable: function (value) {
                    isLoading = value;
                },
                isLoading: function () {
                    return isLoading;
                }
            };
        }

        function isSelectedItem(key) {

            var item;
            if (selectAll) {
                item = excludeItemsList[key];
                if (item === undefined) {
                    return true;
                }

                return !item;
            } else {
                item = includeItemsList[key];
                if (item === undefined) {
                    return false;
                }

                return true;
            }
        }

        function getMapItemsCount(list) {
            var count = 0;
            for (var id in list) {
                if (list.hasOwnProperty(id)) {
                    if (list[id]) {
                        count++;
                    }
                }
            }
            return count;
        }

        function areActionsAvailable() {
            if (selectAll) {
                var count = getMapItemsCount(excludeItemsList);
                return count !== totalItemCount;
            }

            return getMapItemsCount(includeItemsList) > 0;
        }

        function getSelectedItems() {
            if (selectAll) {
                return getMapItemsCount(excludeItemsList);
            }

            return getMapItemsCount(includeItemsList);
        }

        function getIsSelectAllShown() {
            return selectAllShown;
        }

        function getIsSelectAll() {
            return selectAll;
        }

        function selectClicked(key, select) {
            var list = null;
            var checkForSelect = false;
            if (selectAll) {
                list = excludeItemsList;
                checkForSelect = false;
            } else {
                list = includeItemsList;
                checkForSelect = true;
            }

            if (select === checkForSelect) {
                list[key] = quarantineItems[key];
            } else {
                delete list[key];
            }

            if (selectAll) {
                var count = getMapItemsCount(excludeItemsList);
                selectAllShown = count === 0;

                $rootScope.$broadcast("quarantineSelectAllChanged", null);
            }

            $rootScope.$broadcast("quarantineSelectItemChanged", null);
        }

        function getSelectionCountForAction() {
            if (selectAll) {
                return totalItemCount - getSelectedItems();
            }

            return getSelectedItems();
        }

        function selectAllClicked() {
            includeItemsList = [];
            excludeItemsList = [];
            if (selectAll && selectAllShown) {
                selectAll = false;
            }
            else if (!selectAll && !selectAllShown) {
                selectAll = true;
            }
            else if (!selectAll && selectAllShown) {
                selectAll = false;
            }

            selectAllShown = !selectAllShown;

            $rootScope.$broadcast("quarantineSelectAllChanged", null);
            $rootScope.$broadcast("quarantineSelectItemChanged", null);
        }

        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === endpoint.host && params.path === endpoint.path) {
                enableQuarantineLoader(true);
                sendRequest(currentEndpoint);
            }
        });

        var startCounter = function () {
            startLoadTime = moment().utc();

            LoggingService.Debug("[Loading QUA] Start loading quarantine");
        };

        var stopCounter = function () {
            stopLoadTime = moment().utc();
            loadingTime = Math.abs(stopLoadTime.valueOf() - startLoadTime.valueOf());

            enableQuarantineLoader(false);
            LoggingService.Debug("[Loading QUA] Finished of loading quarantine. Loading took: " + loadingTime + " ms");
        };

        var checkForValidResponse = function (endpoint, statusCode, errors) {
            if (statusCode && statusCode !== 200) {
                LoggingService.Warn("Received error response for endpoint " + endpoint.host + " path :" + endpoint.path + " with status code " + statusCode + " and errors: code: " + errors.code + " title: " + errors.title + " detail: " + errors.detail + " status: " + errors.status);
                return false;
            }
            return true;
        };

        function openDefaultLocation() {
            var request = {
                path: '\/executions',
                verb: 'POST',
                host: 'launcherui.' + Tools.GetUserSid()
            };

            var payload = {
                data: {
                    type: 'executions',
                    attributes: [{
                        serviceidentifier: "antivirus",
                        type: 'executable',
                        value: {
                            path: '%WINDIR%\\explorer.exe',
                            arguments: defaultLocationPath,
                            skipSignatureCheck: 1
                        }
                    }]
                }
            };

            MessageBroker.requestSingle(request, function (data, statusCode, errors) {
                if (statusCode && statusCode >= 300) {
                    LoggingService.Warn("Received error response for executions with status code " + statusCode + " and errors: " + errors);
                    return;
                }
            }, payload);

            return;
        };

        function openWhitelistLocation() {
            OpenProcessService.openConfEigCenter("/STARTPAGE=11");
        };

        var createQuarantineList = function (newList) {


            quarantineItems = [];
            quarantineItemsOrdered = [];
            if (newList) {
                for (var i = 0; i < newList.length; i++) {
                    var model = new QuarantineModel();
                    if (newList[i].type !== "quarantine-item") {
                        LoggingService.Error("Unexpected data type for quarantine-item: " +
                            newList[i].type);
                    } else {
                        model.Set(newList[i].attributes, newList[i].id);
                        quarantineItems[newList[i].id] = model;
                        quarantineItemsOrdered.push(model);
                    }
                }

                enableQuarantineLoader(false);
                $rootScope.$broadcast("quarantineListChanged", null);
            }
            else {
                enableQuarantineLoader(false);
                $rootScope.$broadcast("quarantineListChanged", null);
            }
        };

        var loader = createQuarantineLoader();

        function enableQuarantineLoader(value) {
            loader.enable(value);
            $rootScope.$broadcast("quarantineItemsLoaderStatusChanged", value);
        }

        function deleteItems(data) {
            var params = {
                data: data
            };

            ConfigurationService.CheckPasswordProtection("qua_delete", params, deleteItemsAfterPasswordRequest);
        }

        function deleteItemsAfterPasswordRequest(params, result) {
            if (result === false) {
                return;
            }

            var deleteQuarantine = AntivirusEndpoints.quarantineDelete();

            var payload = generateDeletePayload(params.data);
            operation = 'isDelete';

            showQuarantineProgressOverlayDialog('isDelete');
            resetSelection();

            MessageBroker.request(
                deleteQuarantine,
                function (response) {
                    hideQuarantineProgressOverlayDialog();

                    statusCode = response.status_code;

                    if (response.status_code !== 200 && response.status_code !== 900 && response.status_code !== 950) {
                        LoggingService.Error("Delete quarantine item failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("quarantineService.text.errorDeleteItemFailed", "error-overlay"),
                            'Deleting of quarantine item failed.',
                            {});
                    }
                    else {
                        sendRequest(currentEndpoint);
                        showQuarantineDeleteResultOverlayDialog(response);
                    }
                },
                payload);
        }

        function restoreItems(data, addToExclusionList) {
            var params = {
                addToExclusion: addToExclusionList,
                data: data
            };

            ConfigurationService.CheckPasswordProtection("qua_restore", params, restoreItemsAfterPasswordRequest);
        }

        function restoreItemsAfterPasswordRequest(params, result) {
            if (result === false) {
                LoggingService.Debug("Restore operation canceled because password is incorrect.");
                return;
            }

            var restoreQuarantine = AntivirusEndpoints.quarantinePut();

            var payload = generateRestorePayload(params.data, params.addToExclusion);
            operation = 'isRestore';
            showQuarantineProgressOverlayDialog('isRestore');
            resetSelection();

            MessageBroker.request(
                restoreQuarantine,
                function (response) {
                    hideQuarantineProgressOverlayDialog();

                    statusCode = response.status_code;

                    if (response.status_code !== 200 && response.status_code !== 900 && response.status_code !== 950) {
                        LoggingService.Error("Restore quarantine item failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("quarantineService.text.errorRestoreItemFailed", "error-overlay"),
                            'Restoring of quarantine item failed.',
                            {});
                    }
                    else {
                        sendRequest(currentEndpoint);
                        showQuarantineRestoreResultOverlayDialog(response);
                    }
                },
                payload);
        }
        function rescanItems(data) {
            var params = {
                data: data
            };

            ConfigurationService.CheckPasswordProtection("qua_rescan", params, rescanItemsAfterPasswordRequest);
        }

        function resetSelection() {
            includeItemsList = [];
            excludeItemsList = [];
            selectAll = false;
            selectAllShown = false;
            $rootScope.$broadcast("quarantineSelectItemChanged", null);
            $rootScope.$broadcast("quarantineSelectAllChanged", null);
        }

        function generateRestorePayload(params, addToExclusionList) {
            var data =
            {
                id: CommonService.generateUuid(),
                type: params.type,
                attributes: {
                    add_to_exclusionlist: addToExclusionList
                }
            }

            var restore_list = [];
            for (var id in params.list) {
                if (params.list.hasOwnProperty(id)) {
                    restore_list.push(params.list[id].id);
                }
            }

            if (selectAll) {
                data.attributes['quarantine_item_exclude'] = restore_list;
            } else {
                data.attributes['quarantine_item_include'] = restore_list;
            }

            return { data: data };
        }

        function getActionData(key) {
            var type = "";
            var list;
            if (selectAll) {
                list = excludeItemsList;
            } else {
                list = includeItemsList;
            }

            if (key === 'isRestore') {
                if (selectAll) {
                    type = "quarantine_restore_select_all";
                } else {
                    type = "quarantine_restore_select";
                }
            }
            else if (key === 'isRescan') {
                if (selectAll) {
                    type = "quarantine_rescan_select_all";
                } else {
                    type = "quarantine_rescan_select";
                }
            }
            else if (key === 'isDelete') {
                if (selectAll) {
                    type = "quarantine_delete_select_all";
                } else {
                    type = "quarantine_delete_select";
                }
            }

            return {
                selectionCount: getSelectionCountForAction(),
                key: key,
                list: list,
                type: type
            }
        }
        function generateRescanPayload(params) {
            var data =
            {
                id: CommonService.generateUuid(),
                type: params.type,
                attributes: {
                }
            }

            var restore_list = [];
            for (var idRescan in params.list) {
                if (params.list.hasOwnProperty(idRescan)) {
                    restore_list.push(params.list[idRescan].id);
                }
            }

            if (selectAll) {
                data.attributes['quarantine_item_exclude'] = restore_list;
            } else {
                data.attributes['quarantine_item_include'] = restore_list;
            }

            return { data: data };
        }


        function generateDeletePayload(params) {

            var data =
            {
                id: CommonService.generateUuid(),
                type: params.type,
                attributes: {
                }
            }

            var restore_list = [];
            for (var id in params.list) {
                if (params.list.hasOwnProperty(id)) {
                    restore_list.push(params.list[id].id);
                }
            }

            if (selectAll) {
                data.attributes['quarantine_item_exclude'] = restore_list;
            } else {
                data.attributes['quarantine_item_include'] = restore_list;
            }


            return { data: data };
        }

        function rescanItemsAfterPasswordRequest(params, result) {
            if (result === false) {
                LoggingService.Debug("Rescan operation canceled because password is incorrect.");
                return;
            }

            var rescanQuarantine = AntivirusEndpoints.quarantinePost();
            var payload = generateRescanPayload(params.data);
            operation = 'isRescan';

            showQuarantineProgressOverlayDialog('isRescan');

            resetSelection();

            MessageBroker.request(
                rescanQuarantine,
                function (response) {
                    hideQuarantineProgressOverlayDialog();

                    statusCode = response.status_code;

                    if (response.status_code !== 200 && response.status_code !== 900 && response.status_code !== 950) {
                        LoggingService.Error("Rescan quarantine item failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("quarantineService.text.errorRescanItemFailed", "error-overlay"),
                            'Rescan of quarantine item failed.',
                            {});
                    }
                    else {
                        sendRequest(currentEndpoint);
                        showQuarantineRescanResultOverlayDialog(response);
                    }
                },
                payload);
        }

        var refreshTimer = null;
        function refreshNotification() {
            sendRequest(currentEndpoint);
        }

        MessageBroker.subscribe(endpoint, function () {
            if (refreshTimer) {
                $timeout.cancel(refreshTimer);
                refreshTimer = null;
            }

            refreshTimer = $timeout(refreshNotification, 2000);
        });

        startCounter();

        sendFirstRequest();

        function GetEndpoint() {
            var endpointBase = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });

            return {
                endpoint: endpointBase
            };
        }

        function initializeEndpoint() {
            maxPageNumber = 0;
            initialEndpoint = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });

            nextEndpoint = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            previousEndpoint = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            lastEndpoint = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            firstEndpoint = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
            currentEndpoint = AntivirusEndpoints.endpoint({
                path: '/quarantine?page[number]=1&page[size]=' + maximumObjectsPerPage
            });
        }

        initializeEndpoint();

        var currentJob = null;

        function checkJobAddedASecondAgoLogic(newJob, alreadyAddedJob) {
            if (alreadyAddedJob.jobType === newJob.jobType &&
                alreadyAddedJob.pageNumber === newJob.pageNumber &&
                alreadyAddedJob.sortByPropertyName === newJob.sortByPropertyName &&
                alreadyAddedJob.isAscending === newJob.isAscending &&
                moment(alreadyAddedJob.timestampUtc).add(1, 'seconds').unix() > newJob.timestampUtc.unix()) {
                return true;
            }

            return false;
        }

        function checkJobAddedASecondAgo(item) {
            if (currentJob !== null && checkJobAddedASecondAgoLogic(item, currentJob)) {
                return true;
            }

            return false;
        }

        function executeRequest(jobType, callback, pageNumber, sortByPropertyNameTmp, isAscending) {
            if (!pageNumber) {
                pageNumber = -1;
            }
            if (!sortByPropertyNameTmp) {
                sortByPropertyNameTmp = currentSort;
            }
            if (isAscending === null) {
                isAscending = currentSortIsAscending;
            }
            var nowUtc = moment().utc();
            var item = {
                callback: callback,
                jobType: jobType,
                timestampUtc: nowUtc,
                pageNumber: pageNumber,
                sortByPropertyName: sortByPropertyNameTmp,
                isAscending: isAscending
            };

            if (checkJobAddedASecondAgo(item) === true) {
                addItemRunning = false;
                return;
            }

            addItemRunning = false;
            currentJob = item;
            callback();
        }

        function getFirstEndpoint() {
            return firstEndpoint;
        }

        function getLastEndpoint() {
            return lastEndpoint;
        }

        function getCurrentEndpoint() {
            return currentEndpoint;
        }


        function loadPrevious() {

            if (!previousEndpoint) {
                return;
            }

            enableQuarantineLoader(true);
            sendRequest(previousEndpoint);
        }

        function loadPreviousClicked() {
            if (previousPage === currentPage) {
                return;
            }

            if (addItemRunning) {
                $timeout(loadPreviousClicked(), 10);
            }

            addItemRunning = true;
            executeRequest("loadPrevious", loadPrevious, null, null, null);
        }

        function loadNextClicked() {
            if (nextPage === currentPage) {
                return;
            }

            if (addItemRunning) {
                $timeout(loadNextClicked(), 10);
            }

            addItemRunning = true;
            executeRequest("loadNext", loadNext, null, null, null);
        }

        function loadNext() {
            if (!nextEndpoint) {
                return;
            }

            enableQuarantineLoader(true);
            sendRequest(nextEndpoint);
        }

        function loadFirstClicked() {
            if (firstPage === currentPage) {
                return;
            }

            if (addItemRunning) {
                $timeout(loadFirstClicked(), 10);
            }

            addItemRunning = true;
            executeRequest("loadFirst", loadFirst, null, null, null);
        }

        function loadFirst() {
            if (!nextEndpoint) {
                return;
            }

            enableQuarantineLoader(true);
            sendRequest(firstEndpoint);
        }

        function loadLastClicked() {
            if (lastPage === currentPage) {
                return;
            }

            if (addItemRunning) {
                $timeout(loadLastClicked(), 10);
            }

            addItemRunning = true;
            executeRequest("loadLast", loadLast, null, null, null);
        }

        function loadLast() {
            if (!nextEndpoint) {
                return;
            }

            enableQuarantineLoader(true);
            sendRequest(lastEndpoint);
        }

        function getSorting() {
            var otherSortOrders;
            if (currentSort === "date") {
                otherSortOrders = ",infection_name,source_filepath";
            }
            else if (currentSort === "infection_name") {
                otherSortOrders = ",-date,source_filepath";
            }
            else if (currentSort === "source_filepath") {
                otherSortOrders = ",-date,infection_name";
            } else {
                console.error("Unkown sort order: " + currentSort + "use default: date,infection_name,source_filepath");
                currentSort = "date";
                currentSortIsAscending = false;
                otherSortOrders = ",infection_name,source_filepath";
            }

            return "sort=" + (currentSortIsAscending ? "" : "-") + currentSort
                + otherSortOrders;
        }

        function removeSorting(endpoint) {
            var sort = getSorting();

            var path = endpoint.path;

            var sortIdentifier = '&' + sort;
            var sortIndex = path.indexOf(sortIdentifier);
            if (sortIndex >= 0) {
                path = path.replace(sortIdentifier, "");
            }

            sortIdentifier = '?' + sort + "&";
            sortIndex = path.indexOf(sortIdentifier);
            if (sortIndex >= 0) {
                path = path.replace(sortIdentifier, "?");
            } 

            sortIdentifier = '?' + sort;
            sortIndex = path.indexOf(sortIdentifier);

            if (sortIndex >= 0) {
                path = path.replace(sortIdentifier, "");
            }

            endpoint.path = path;
            return endpoint;
        }

        function extractPageNumber(endpoint) {
            var path = endpoint.path;

            var nextIdentifierQua = '&';
            var pageIdentifier = 'page[number]=';
            var pageIdentifierIndex = path.indexOf(pageIdentifier);

            if (pageIdentifierIndex !== -1 && pageIdentifierIndex !== -1) {
                var pageIndexStart = pageIdentifierIndex + pageIdentifier.length;
                var pageIndexEnd = path.indexOf(nextIdentifierQua, pageIndexStart);
                if (!pageIndexEnd || pageIndexEnd < 0) {
                    pageIndexEnd = path.length;
                }

                var pageNumber = parseInt(path.substr(pageIndexStart, pageIndexEnd - pageIndexStart));
                return pageNumber;
            }

            LoggingService.Error("Can't extract page number: " + endpoint.path);
            return -1;
        }

        function loadPageClicked(pageNumber) {
            if (pageNumber === currentPage) {
                return;
            }

            if (addItemRunning) {
                $timeout(loadPageClicked(pageNumber), 10);
            }

            addItemRunning = true;
            executeRequest("loadPage", loadPage, pageNumber, null, null);
        }

        function loadPage() {

            var endpoint = AntivirusEndpoints.endpoint('/quarantine?page[number]=' + currentJob.pageNumber + '&page[size]=' + maximumObjectsPerPage);
            if (maxPageNumber == null || currentJob.pageNumber > maxPageNumber) {
                LoggingService.Error("Try to open quarantine page: " + currentJob.pageNumber + " but quarantine has only " + maxPageNumber + " pages");
                return;
            }

            enableQuarantineLoader(true);
            sendRequest(endpoint);
        }

        function changeOrderClicked(sortByPropertyNameTmp) {
            if (sortByPropertyNameTmp === "date") {
                isAscending = (sortByPropertyName === sortByPropertyNameTmp) ? !isAscending : false;
            } else {
                isAscending = (sortByPropertyName === sortByPropertyNameTmp) ? !isAscending : true;
            }
            sortByPropertyName = sortByPropertyNameTmp;

            if (addItemRunning) {
                $timeout(changeOrderClicked(sortByPropertyName, isAscending), 10);
            }

            addItemRunning = true;
            executeRequest("changeOrder", changeOrder, null, sortByPropertyName, isAscending);

            $rootScope.$broadcast("quarantineSortByProperyNameChanged", null);
        }

        function changeOrder() {
            currentSort = currentJob.sortByPropertyName;
            currentSortIsAscending = currentJob.isAscending;

            enableQuarantineLoader(true);
            sendRequest(currentEndpoint);
        }

        function ChangePage(response) {
            var errors = {};

            if (!response || !response.payload) {
                ErrorModalOverlayService.genericError(
                    500,
                    translator.getString("quarantineService.text.errorCannotChangePage", "error-overlay"),
                    'Could not change quarantine page.',
                    {});
                enableQuarantineLoader(false);
                return;
            }

            if (response.payload.errors) {
                errors = response.payload.errors;
            }

            if (!checkForValidResponse(previousEndpoint, response.status_code, errors)) {
                ErrorModalOverlayService.genericError(
                    response.status_code,
                    translator.getString("quarantineService.text.errorCannotChangePage", "error-overlay"),
                    'Could not change quarantine page.',
                    {});
                enableQuarantineLoader(false);
                return;
            }

            if (!response.payload.links) {
                initializeEndpoint();
            }
            else {
                if (!response.payload.meta || !response.payload.meta['total-pages']) {
                    maxPageNumber = 0;
                }
                else {
                    maxPageNumber = response.payload.meta['total-pages'];
                }

                if (!response.payload.meta || !response.payload.meta['total-items']) {
                    totalItemCount = 0;
                }
                else {
                    totalItemCount = response.payload.meta['total-items'];
                }

                if (!response.payload.links.prev) {
                    previousEndpoint = GetEndpoint().endpoint;
                }
                else {
                    previousEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.prev
                    });
                }
                previousEndpoint = removeSorting(previousEndpoint);
                var pageNumberTmp = extractPageNumber(previousEndpoint);
                if (pageNumberTmp !== -1) {
                    previousPage = pageNumberTmp;
                    LoggingService.Debug("Previous page: " + previousPage);
                }

                if (!response.payload.links.next) {
                    nextEndpoint = GetEndpoint().endpoint;
                }
                else {
                    nextEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.next
                    });
                }
                nextEndpoint = removeSorting(nextEndpoint);
                pageNumberTmp = extractPageNumber(nextEndpoint);
                if (pageNumberTmp !== -1) {
                    nextPage = pageNumberTmp;
                    LoggingService.Debug("Next page: " + nextPage);
                }

                if (!response.payload.links.last) {
                    lastEndpoint = GetEndpoint().endpoint;
                } else {
                    lastEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.last
                    });
                }
                lastEndpoint = removeSorting(lastEndpoint);
                pageNumberTmp = extractPageNumber(lastEndpoint);
                if (pageNumberTmp !== -1) {
                    lastPage = pageNumberTmp;
                    LoggingService.Debug("Last page: " + lastPage);
                }

                if (!response.payload.links.first) {
                    firstEndpoint = GetEndpoint().endpoint;
                } else {
                    firstEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.first
                    });
                }

                firstEndpoint = removeSorting(firstEndpoint);
                pageNumberTmp = extractPageNumber(firstEndpoint);
                if (pageNumberTmp !== -1) {
                    firstPage = pageNumberTmp;
                    LoggingService.Debug("First page: " + firstPage);
                }

                if (!response.payload.links.self) {
                    currentEndpoint = GetEndpoint().endpoint;
                } else {
                    currentEndpoint = AntivirusEndpoints.endpoint({
                        path: response.payload.links.self
                    });
                }

                currentEndpoint = removeSorting(currentEndpoint);
                pageNumberTmp = extractPageNumber(currentEndpoint);
                if (pageNumberTmp !== -1) {
                    currentPage = pageNumberTmp;
                    LoggingService.Debug("Current page: " + currentPage);
                }
            }

            hasLoadedDataOnce = true;
            quarantineItems = [];
            quarantineItemsOrdered = [];

            if (response.payload.data) {
                createQuarantineList(response.payload.data);
            } else {
                enableQuarantineLoader(false);
                $rootScope.$broadcast("quarantineListChanged", null);
            }
        }


        function sendFirstRequest() {
            var endpoint = GetEndpoint();

            enableQuarantineLoader(true);
            sendRequest(endpoint.endpoint);
        }


        function getThreatName(infection_name) {
            var isClean = false;
            var isRestored = false;
            var isSuspicious = false;

            if (infection_name === 'CLEAN') {
                isClean = true;
            }
            else if (infection_name === 'RESTORED') {
                isRestored = true;
            }
            else if (infection_name === "" ||
                infection_name === "Suspicious file" ||
                infection_name === "SUSPICIOUS_FILE") {
                isSuspicious = true;
            } else {
                LoggingService.Error("Unknown infection_name: " + infection_name);
                return null;
            }

            if (isRestored) {
                return translator.getString("quarantineController.text.threadNameRestored");
            }
            else if (isClean) {
                return translator.getString("quarantineController.text.threadNameClean");
            }
            else if (isSuspicious) {
                return translator.getString("quarantineController.text.suspiciousFile");
            }

            return null;
        }

        var i = 0;
        function sendRequest(endpoint) {
            if (refreshTimer) {
                $timeout.cancel(refreshTimer);
                refreshTimer = null;
            }

            var timer = $timeout(function () {
                ChangePage(null);
            }, 60000);

            var endpointTmp = JSON.parse(JSON.stringify(endpoint));

            if (endpointTmp.path.indexOf('?') >= 0) {
                endpointTmp.path = endpointTmp.path + '&' + getSorting();
            } else {
                endpointTmp.path = endpointTmp.path + '?' + getSorting();
            }

            var id = MessageBroker.request(endpointTmp,
                function (response) {
                    $timeout.cancel(timer);
                    if (!currentRequest || currentRequest.id !== response.id) {
                        return;
                    }
                    
                    currentRequest.callback(response);
                },
            {
                data:
                {
                    id: CommonService.generateUuid(),
                    type: "quarantine_infection_translations",
                    attributes:
                    {
                        clean: getThreatName('CLEAN'),
                        restored: getThreatName('RESTORED'),
                        suspicious: getThreatName('SUSPICIOUS_FILE')
                    }
                }
            });

            currentRequest =
            {
                id: id,
                callback: ChangePage
            };
        }

        function getQuarantineItems() {
            return quarantineItemsOrdered;
        }

        function showQuarantineQuestionOverlayDialog(key) {
            $rootScope.$broadcast('showQuarantineQuestionOverlay', key);
        }

        function showQuarantineRestoreResultOverlayDialog(response) {
            if (response.payload.data.type !== "quarantine_restore_result") {
                LoggingService.Error("Unexpected result data type for restore: " + response.payload.data.type);
                resultDialogVisible = false;
                return;
            }
            restoredToOriginalLocation = response.payload.data.attributes.restored_to_source;
            restoredToDefaultLocation = response.payload.data.attributes.restored_to_default;
            couldNotBeRestored = response.payload.data.attributes.failed_to_restore;
            couldNotBeAddedToTheWL = response.payload.data.attributes.failed_to_whitelist;
            defaultLocationPath = response.payload.data.attributes.default_location_path;

            resultDialogVisible = true;
            $rootScope.$broadcast('showQuarantineResultOverlay');
        }

        function showQuarantineDeleteResultOverlayDialog(response) {
            if (response.payload.data.type !== "quarantine_delete_result") {
                LoggingService.Error("Unexpected result data type for delete: " + response.payload.data.type);
                resultDialogVisible = false;
                return;
            }

            filesDeleted = response.payload.data.attributes.deleted;
            couldNotBeDeleted = response.payload.data.attributes.failed_to_delete;

            resultDialogVisible = true;
            $rootScope.$broadcast('showQuarantineResultOverlay');
        }

        function showQuarantineRescanResultOverlayDialog(response) {
            if (response.payload.data.type !== "quarantine_rescan_result") {
                LoggingService.Error("Unexpected result data type for rescan: " + response.payload.data.type);
                resultDialogVisible = false;
                return;
            }

            numberOfRescannedObjects = response.payload.data.attributes.number_of_rescanned_objects;
            cleanBeforeRescan = response.payload.data.attributes.clean_before;
            cleanAfterRescan = response.payload.data.attributes.clean_after;
            suspiciousBeforeRescan = response.payload.data.attributes.suspicious_before;
            suspiciousAfterRescan = response.payload.data.attributes.suspicious_after;
            detectedBeforeRescan = response.payload.data.attributes.detected_before;
            detectedAfterRescan = response.payload.data.attributes.detected_after;
            cleanFilesAfterRescan = response.payload.data.attributes.clean_files_after_rescan;

            resultDialogVisible = true;
            $rootScope.$broadcast('showQuarantineResultOverlay');
        }


        function showQuarantineProgressOverlayDialog(key) {
            progressDialogVisible = true;
            $rootScope.$broadcast('showQuarantineProgressOverlay', key);
        }

        function hideQuarantineProgressOverlayDialog() {
            progressDialogVisible = false;
            $rootScope.$broadcast('hideQuarantineProgressOverlay');
        }

        return {
            getQuarantineItems: getQuarantineItems,
            showQuarantineQuestionOverlay: showQuarantineQuestionOverlayDialog,
            hideResultOverlay: function () {
                $rootScope.$broadcast('QuarantineUnselectAll');
                resultDialogVisible = false;
            },
            getResultOverlayVisibility: function () {
                return resultDialogVisible;
            },
            getProgressOverlayVisibility: function () {
                return progressDialogVisible;
            },
            getFilesRestoredToOriginalLocation: function () {
                return restoredToOriginalLocation;
            },
            getFilesRestoredToDefaultLocation: function () {
                return restoredToDefaultLocation;
            },
            getNumberOfCouldNotBeRestoredFiles: function () {
                return couldNotBeRestored;
            },
            getNumberOfCouldNotBeAddedToWLFiles: function () {
                return couldNotBeAddedToTheWL;
            },
            getNumberOfFilesDeleted: function () {
                return filesDeleted;
            },
            getNumberOfFilesCouldNotBeDeleted: function () {
                return couldNotBeDeleted;
            },
            getActionData: getActionData,
            getOperation: function () {
                return operation;
            },
            getStatusCode: function () {
                return statusCode;
            },
            getNumberOfRescannedObjects: function () {
                return numberOfRescannedObjects;
            },
            getCurrentPage: function () {
                return currentPage;
            },
            getFirstPage: function () {
                return firstPage;
            },
            getLastPage: function () {
                return lastPage;
            },
            getCleanBeforeRescan: function () {
                return cleanBeforeRescan;
            },
            getCleanAfterRescan: function () {
                return cleanAfterRescan;
            },
            getSuspiciousBeforeRescan: function () {
                return suspiciousBeforeRescan;
            },
            getSuspiciousAfterRescan: function () {
                return suspiciousAfterRescan;
            },
            getDetectedBeforeRescan: function () {
                return detectedBeforeRescan;
            },
            getDetectedAfterRescan: function () {
                return detectedAfterRescan;
            },
            getCleanFilesAfterRescan: function () {
                return cleanFilesAfterRescan;
            },
            isLoading: loader.isLoading,
            getFirstEndpoint: getFirstEndpoint,
            getLastEndpoint: getLastEndpoint,
            getCurrentEndpoint: getCurrentEndpoint,
            restoreItems: restoreItems,
            rescanItems: rescanItems,
            deleteItems: deleteItems,
            openDefaultLocation: openDefaultLocation,
            openWhitelistLocation: openWhitelistLocation,
            stopCounter: stopCounter,
            startCounter: startCounter,
            loadNextClicked: loadNextClicked,
            loadPreviousClicked: loadPreviousClicked,
            loadFirstClicked: loadFirstClicked,
            loadLastClicked: loadLastClicked,
            loadPageClicked: loadPageClicked,
            changeOrderClicked: changeOrderClicked,
            isSelectedItem: isSelectedItem,
            getIsSelectAllShown: getIsSelectAllShown,
            getIsSelectAll: getIsSelectAll,
            selectClicked: selectClicked,
            selectAllClicked: selectAllClicked,
            getSelectionCountForAction: getSelectionCountForAction,
            getTotalItemCount: function () {
                return totalItemCount;
            },
            areActionsAvailable: areActionsAvailable,
            getSortByProperyName: function () {
                return sortByPropertyName;
            },
            getSortIsAscending: function () {
                return isAscending;
            }
        };
    }

    return app.factory(name, QuarantineService);
};
},{"../model/QuarantineModel":116}],152:[function(require,module,exports){
var ScanProfileModelWrapper = require('../model/ScanProfileModelWrapper');

module.exports = function (name, app) {

    /**@ngInject*/
    ScanProfilesService.$inject = ["$rootScope", "$timeout", "MessageBroker", "LoggingService", "translator", "AntivirusEndpoints", "ErrorModalOverlayService"];
    function ScanProfilesService($rootScope, $timeout, MessageBroker, LoggingService, translator, AntivirusEndpoints, ErrorModalOverlayService) {     
        var profiles = [];

        var endpoint = AntivirusEndpoints.scanProfilesGet();
        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === endpoint.host && params.path === endpoint.path) {
                getScanProfiles();
            }
        });
        
        function translateProfileName(data) {
            switch (data.profile_filename) {
                case "rootkit.avp":
                    return {
                        name: translator.getString("scanProfileDefine.rootkitScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.rootkitScan.description", "scan-profiles-defines")
                    }
                case "rmdiscs.avp":
                    return {
                        name: translator.getString("scanProfileDefine.removableDiscScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.removableDiscScan.description", "scan-profiles-defines")
                    }
                case "alldrives.avp":
                    return {
                        name: translator.getString("scanProfileDefine.localDrivesScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.localDrivesScan.description", "scan-profiles-defines")
                    }
                case "alldiscs.avp":
                    return {
                        name: translator.getString("scanProfileDefine.localHardDiscsScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.localHardDiscsScan.description", "scan-profiles-defines")
                    }
                case "process.avp":
                    return {
                        name: translator.getString("scanProfileDefine.activeProcessScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.activeProcessScan.description", "scan-profiles-defines")
                    }
                case "mydocs.avp":
                    return {
                        name: translator.getString("scanProfileDefine.myDocumentsScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.myDocumentsScan.description", "scan-profiles-defines")
                    }
                case "sysdir.avp":
                    return {
                        name: translator.getString("scanProfileDefine.systemScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.systemScan.description", "scan-profiles-defines")
                    }
                case "quicksysscan.avp":
                    return {
                        name: translator.getString("scanProfileDefine.quickScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.quickScan.description", "scan-profiles-defines")
                    }
                case "folder.avp":
                    return {
                        name: translator.getString("scanProfileDefine.customScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.customScan.description", "scan-profiles-defines")
                    }
                case "sysscan.avp":
                    return {
                        name: translator.getString("scanProfileDefine.fullScan.name", "scan-profiles-defines"),
                        description: translator.getString("scanProfileDefine.fullScan.description", "scan-profiles-defines")
                    }
                default:
                    var scannedFolders = "";
                    if (data && data.search && data.search.path) {
                        for (var i = 0; i < data.search.path.length; i++) {
                            scannedFolders += "\n" + data.search.path[i];
                        }
                    }

                    return {
                        name: data.profile_name,
                        description: translator.getString("scanProfileDefine.userGeneratedScan.name", "scan-profiles-defines", { scannedFolders: scannedFolders })
                    }
            }
        }

        function createProfile(scanProfileWrapper) {
            var createProfileEndpoint = AntivirusEndpoints.scanProfilesPost();
            var data =
                {
                    id: scanProfileWrapper.id,
                    type: "scan-profile",
                    attributes: scanProfileWrapper.scanProfile
                }

            MessageBroker.request(
                createProfileEndpoint,
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Create profile failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("scanProfilesService.text.createProfileFailed", "error-overlay"),
                            'Create profile failed.',
                            {});
                    }
                },
                { data: data });
        }

        function deleteProfile(scanProfileWrapper) {
            var deleteProfileEndpoint = AntivirusEndpoints.scanProfilesDelete();
            var data =
                {
                    id: scanProfileWrapper.id,
                    type: "scan-profile"
                }

            MessageBroker.request(
                deleteProfileEndpoint,
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Delete profile failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("scanProfilesService.text.deleteProfileFailed", "error-overlay"),
                            'Delete profile failed.',
                            {});
                    }
                },
                { data: data });
        }

        function changeProfile(scanProfileWrapper) {
            var changeProfileEndpoint = AntivirusEndpoints.scanProfilesPut();
            var data =
                {
                    id: scanProfileWrapper.id,
                    type: "scan-profile",
                    attributes: scanProfileWrapper.scanProfile
                }

            MessageBroker.request(
                changeProfileEndpoint,
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Change profile failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("scanProfilesService.text.changeProfileFailed", "error-overlay"),
                            'Change profile failed.',
                            {});
                    }
                },
                { data: data });
        }

        function addProfileToList(value, id) {                    
            var scanProfileWrapper = new ScanProfileModelWrapper();
            scanProfileWrapper.Set(value, translateProfileName(value), id);
            
            profiles.push(scanProfileWrapper);
        }

        function deleteItemFromList(id) {
            var list = [];
            for (var i4 = 0; i4 < profiles.length; i4++) {
                if (profiles[i4].id !== id) {
                    list.push(profiles[i4]);
                }
            }

            profiles = list;
        }

        MessageBroker.subscribe(endpoint, function (value, verb) {

            if (verb === "POST") {
                if (value) {
                    addProfileToList(value.attributes, value.id);
                }
            }
            else if (verb === "PUT") {
                if (value) {
                    deleteItemFromList(value.id);
                    addProfileToList(value.attributes, value.id);
                }
            }
            else if (verb === "DELETE") {
                if (value) {
                    deleteItemFromList(value.id);
                }
            }
            
            $rootScope.$broadcast("profilesChanged", value);
        });

        getScanProfiles();

        function getScanProfiles() {
            MessageBroker.requestList(endpoint,
                function(responseData, statusCode, errors) {
                    if (!checkForValidResponse(endpoint, statusCode, errors)) {
                        return;
                    }

                    profiles = [];
                    for (var i = 0; i < responseData.length; i++) {
                        if (responseData[i] && responseData[i].attributes) {
                            addProfileToList(responseData[i].attributes, responseData[i].id);
                        }
                    }

                    $rootScope.$broadcast("profilesChanged", responseData);
                });
        }

        function checkForValidResponse(endpoint, statusCode, errors) {
            if (statusCode && statusCode >= 300) {
                LoggingService.Warn("Received error response for endpoint " + endpoint.host + " path :" + endpoint.path + " with status code " + statusCode + " and errors: code: " + errors.code + " title: " + errors.title + " detail: " + errors.detail + " status: " + errors.status);
                return false;
            }
            return true;
        }
        
        function isUserProfile(scanProfileWrapper) {
            if (scanProfileWrapper &&
                scanProfileWrapper.scanProfile &&
                (scanProfileWrapper.scanProfile.profile_type === 0 ||
                    scanProfileWrapper.scanProfile.profile_type === 17)) {
                return true;
            }

            return false;
        }

        function isProfileChangeable(scanProfileWrapper) {
            if (scanProfileWrapper &&
                scanProfileWrapper.scanProfile &&
                (isUserProfile(scanProfileWrapper) || scanProfileWrapper.scanProfile.profile_type === 1)) {
                return true;
            }

            return false;
        }

        function isProfileDeleteable(scanProfileWrapper) {
            return isUserProfile(scanProfileWrapper);
        }

        function getSortedScanProfiles() {
            return profiles.sort(
                function (a, b) {
                    if (a.scanProfile && b.scanProfile) {
                        if (a.scanProfile.profile_type !== b.scanProfile.profile_type) {
                            if (a.scanProfile.profile_type === 0) {
                                return -1;
                            }
                            if (b.scanProfile.profile_type === 0) {
                                return 1;
                            }
                        }
                    }

                    if (a.localizedName < b.localizedName) return -1;
                    if (a.localizedName > b.localizedName) return 1;
                    return 0;
                });
        }

        return {
            isUserProfile: isUserProfile,
            isProfileDeleteable: isProfileDeleteable,
            createProfile: createProfile,
            changeProfile: changeProfile,
            deleteProfile: deleteProfile,
            getSortedScanProfiles: getSortedScanProfiles,
            isProfileChangeable: isProfileChangeable,
            getProfiles: function () {
                return profiles;
            }
        };
    }

    return app.factory(name, ScanProfilesService);
};
},{"../model/ScanProfileModelWrapper":117}],153:[function(require,module,exports){
var SchedulerJobModelWrapper = require('../model/SchedulerJobModelWrapper');

module.exports = function (name, app) {

    /**@ngInject*/
    SchedulerJobService.$inject = ["$rootScope", "$timeout", "MessageBroker", "LoggingService", "ErrorModalOverlayService", "translator", "CommonService", "AntivirusEndpoints"];
    function SchedulerJobService($rootScope, $timeout, MessageBroker, LoggingService, ErrorModalOverlayService, translator, CommonService, AntivirusEndpoints) {
        
        var sendRequestQueque = [];
        var currentJob = null;        
        var jobs = [];

        function isNotRunningJob(data) {
            return data.job_state.toLowerCase() === "stopped";
        }

        var getJobEndpoint = AntivirusEndpoints.schedulerjobsGet();
        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (params.host === getJobEndpoint.host && params.path === getJobEndpoint.path) {
                getSchedulerJobs();
            }
        });


        function translateJobName(data) {
            var pos = data.job_filepath.lastIndexOf('\\') + 1;
            var filename = data.job_filepath.substr(pos, data.job_filepath.length - pos);
            
            switch (filename) {
                
                case "updjob.avj":
                    return {
                        name: translator.getString("schedulerJobDefine.automaticUpdate.name", "scheduler-job-defines"),
                        description: translator.getString("schedulerJobDefine.automaticUpdate.description", "scheduler-job-defines"),
                        isChangeable: false,
                        isDeleteable: false
                    }
                case "startupd.avj":
                    return {
                        name: translator.getString("schedulerJobDefine.immidiateUpdate.name", "scheduler-job-defines"),
                        description: translator.getString("schedulerJobDefine.immidiateUpdate.description", "scheduler-job-defines"),
                        isChangeable: false,
                        isDeleteable: false
                    }
                case "scanjob.avj":
                    return {
                        name: translator.getString("schedulerJobDefine.quickScan.name", "scheduler-job-defines"),
                        description: translator.getString("schedulerJobDefine.quickScan.description", "scheduler-job-defines"),
                        isChangeable: false,
                        isDeleteable: true
                    }
                case "produpd.avj":
                    return {
                        name: translator.getString("schedulerJobDefine.productUpdate.name", "scheduler-job-defines"),
                        description: translator.getString("schedulerJobDefine.productUpdate.description", "scheduler-job-defines"),
                        isChangeable: false,
                        isDeleteable: false
                    }
                default:
                    return {
                        name: data.name,
                        description: data.description,
                        isChangeable: isNotRunningJob(data),
                        isDeleteable: isNotRunningJob(data)
                    }
            }
        }

        function createJob(schedulerJobModelWrapper) {
            var createJobEndpoint = AntivirusEndpoints.schedulerjobsPost();
            var data =
                {
                    id: schedulerJobModelWrapper.id,
                    type: "scheduler-job",
                    attributes: schedulerJobModelWrapper.schedulerJob
                }

            MessageBroker.request(
                createJobEndpoint,
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Create scheduler job failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("schedulerJobService.text.createJobFailed", "error-overlay"),
                            'Create scheduler job failed.',
                            {});
                    }
                },
                { data: data });
        }

        function deleteJob(schedulerJobModelWrapper) {
            var deleteJobEndpoint = AntivirusEndpoints.schedulerjobsDelete();
            var data =
                {
                    id: schedulerJobModelWrapper.id,
                    type: "scheduler-job"
                }

            MessageBroker.request(
                deleteJobEndpoint,
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Delete scheduler job failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("schedulerJobService.text.deleteJobFailed", "error-overlay"),
                            'Delete scheduler job failed.',
                            {});
                    }
                },
                { data: data });
        }

        function addJobToList(value, id) {

            var schedulerJobModelWrapper = new SchedulerJobModelWrapper();
            schedulerJobModelWrapper.Set(value, translateJobName(value), id);
            
            jobs.push(schedulerJobModelWrapper);
        }

        function deleteItemFromList(id) {
            var list = [];
            for (var i4 = 0; i4 < jobs.length; i4++) {
                if (jobs[i4].id !== id) {
                    list.push(jobs[i4]);
                }
            }

            jobs = list;
        }

        MessageBroker.subscribe(getJobEndpoint, function (value, verb) {

            if (verb === "POST") {
                if (value) {
                    addJobToList(value.attributes, value.id);
                }
            }
            else if (verb === "PUT") {
                if (value) {
                    deleteItemFromList(value.id);
                    addJobToList(value.attributes, value.id);
                }
            }
            else if (verb === "DELETE") {
                if (value) {
                    deleteItemFromList(value.id);
                }
            }
            
            $rootScope.$broadcast("schedulerJobsChanged", value);
        });

        function getSchedulerJobs() {
            MessageBroker.requestList(getJobEndpoint,
                function(responseData, statusCode, errors) {
                    if (!checkForValidResponse(getJobEndpoint, statusCode, errors)) {
                        return;
                    }

                    jobs = [];
                    for (var i = 0; i < responseData.length; i++) {
                        if (responseData[i] && responseData[i].attributes) {
                            addJobToList(responseData[i].attributes, responseData[i].id);
                        }
                    }

                    $rootScope.$broadcast("schedulerJobsChanged", responseData);
                });
        }

        getSchedulerJobs();

        function checkForValidResponse(endpoint, statusCode, errors) {
            if (statusCode && statusCode >= 300) {
                LoggingService.Warn("Received error response for endpoint " + endpoint.host + " path :" + endpoint.path + " with status code " + statusCode + " and errors: code: " + errors.code + " title: " + errors.title + " detail: " + errors.detail + " status: " + errors.status);
                return false;
            }
            return true;
        }

        function changeJob(schedulerJobModelWrapper) {
            var changeJobEndpoint = AntivirusEndpoints.schedulerjobsPut();
            var data =
                {
                    id: schedulerJobModelWrapper.id,
                    type: "scheduler-job",
                    attributes: schedulerJobModelWrapper.schedulerJob
                }

            MessageBroker.request(
                changeJobEndpoint,
                function (response) {
                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Change scheduler job failed: " + response.status_code);
                        ErrorModalOverlayService.genericError(
                            response.status_code,
                            translator.getString("schedulerJobService.text.changeJobFailed", "error-overlay"),
                            'Change scheduler job failed.',
                            {});
                    }
                },
                { data: data });
        }

        function checkJobAddedASecondAgoLogic(newJob, alreadyAddedJob) {
            if (alreadyAddedJob.jobName === newJob.jobName &&
                alreadyAddedJob.payload.data.attributes.action === newJob.payload.data.attributes.action &&
                alreadyAddedJob.payload.data.attributes.user_triggered === newJob.payload.data.attributes.user_triggered &&
                moment(alreadyAddedJob.timestamp).utc().add(1, 'seconds').unix() > moment(newJob.timestamp).utc().unix()) {
                if (alreadyAddedJob.payload.data.attributes.action === 1) {
                    if (alreadyAddedJob.payload.data.attributes.profile === newJob.payload.data.attributes.profile) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }

            return false;
        }
        function checkJobAddedASecondAgo(item) {
            if (currentJob !== null && checkJobAddedASecondAgoLogic(item, currentJob))
            {
                return true;
            }
            
            for (var i = 0; i < sendRequestQueque.length; i++) {
                if (checkJobAddedASecondAgoLogic(item, sendRequestQueque[i])) {
                    return true;
                }
            }

            return false;
        }

        function start(payload, jobName, callback)
        {
            var now = moment().utc();
            var item = {
                payload: payload,
                jobName: jobName,
                callback: callback,
                timestamp: now
            };

            if (checkJobAddedASecondAgo(item) === true)
            {
                return;
            }

            sendRequestQueque.push(item);
            startSchedulerJob();
        }

        var startTimer = null;

        function startScan(profile, jobName, callback) {
            var payload =
                {
                    data:
                    {
                        id: CommonService.generateUuid(),
                        type: "run-scheduler-job",
                        attributes: {
                            action: 1,
                            profile: profile,
                            user_triggered: true
                        }
                    }
                };

            start(payload, jobName, callback);
        }

        function startUpdate(jobName, callback) {
            var payload =
                {
                    data:
                    {
                        id: CommonService.generateUuid(),
                        type: "run-scheduler-job",
                        attributes: {
                            action: 0,
                            user_triggered: true
                        }
                    }
                };

            start(payload, jobName, callback);
        }
         
        function startSchedulerJob() {
            if (startTimer === null) {
                startTimer = $timeout(function () {
                    startTimer = null;
                    ErrorModalOverlayService.genericError(
                        503,
                        translator.getString('schedulerJobService.text.startJobFailed', "error-overlay", { jobName: currentJob.jobName }),
                            'Could not start Job',
                            { JobName: currentJob.jobName });

                    if (currentJob.callback) {
                        currentJob.callback(503);
                    }

                    if (sendRequestQueque.length > 0) {
                        startSchedulerJob();
                    }
                }, 10000);

                currentJob = sendRequestQueque.pop();

                var runJobEndpoint = AntivirusEndpoints.schedulerjobsPost();
                MessageBroker.request(runJobEndpoint,
                    function (response) {
                        $timeout.cancel(startTimer);
                        startTimer = null;

                        if (response.status_code === 200) {
                            if (currentJob.callback) {
                                currentJob.callback(response.status_code);
                            }
                        }
                        else {
                            ErrorModalOverlayService.genericError(
                                response.status_code,
                                translator.getString('schedulerJobService.text.startJobFailed', "error-overlay", { jobName: currentJob.jobName }),
                                    'Could not start Job',
                                    { JobName: currentJob.jobName });
                            if (currentJob.callback) {
                                currentJob.callback(response.status_code);
                            }
                        }

                        if (sendRequestQueque.length > 0) {
                            startSchedulerJob();
                        }
                    },
                    currentJob.payload);
            }
        }

        return {
            createJob: createJob,
            changeJob: changeJob,
            deleteJob: deleteJob,
            startQuickScan: function (callback) {
                startScan("quick", translator.getString("schedulerJobService.text.jobNameQuickScan", "error-overlay"), callback);
            },
            startFullScan: function (callback) {
                startScan("full", translator.getString("schedulerJobService.text.jobNameFullScan", "error-overlay"), callback);
            },
            startUpdate: function (callback) {
                startUpdate(translator.getString("schedulerJobService.text.jobNameUpdate", "error-overlay"), callback);
            },
            startScanWithProfile: function (profilePath, profileName, callback) {
                startScan(profilePath, profileName, callback);
            },
            getJobs: function () {
                return jobs;
            }
        };
    }

    return app.factory(name, SchedulerJobService);
};
},{"../model/SchedulerJobModelWrapper":121}],154:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    ServiceStatusService.$inject = ["$rootScope", "MessageBroker", "LoggingService", "ErrorModalOverlayService", "translator", "CommonService", "AntivirusEndpoints"];
    function ServiceStatusService($rootScope, MessageBroker, LoggingService, ErrorModalOverlayService, translator, CommonService, AntivirusEndpoints) {        
        function SendChangeRequest(endpoint, type, service, state) {
            MessageBroker.request(endpoint,
                function (response) {
                    if (response.status_code === 200) {
                        return;
                    } else if (response.status_code === 403) {
                        LoggingService.Warn("Change " + type + " for service " +
                            service + " to " +
                            state +
                            "  has is not performed because you have not the needed rights");
                    } else {
                        ErrorModalOverlayService
                            .genericError(response.status_code,
                            translator
                                .getString('serviceStatusService.text.couldNotChangeServiceState', "error-overlay",
                                { service: service, state: state, type: type }),
                                'Could not change service state.',
                                { service: service, state: state, type: type }
                            );
                    }

                    $rootScope.$broadcast("changeServiceStatusFailed");
                },
                {
                    data:
                    {
                        id: CommonService.generateUuid(),
                        type: type,
                        attributes:
                        {
                            state: state
                        }
                    }
                });
        }

        function changeFirewallServiceState(service, state) {
            var putServiceStatusEndpoint = AntivirusEndpoints.putFirewallServiceStatus();
            var type = "firewall-service-state";
            
            SendChangeRequest(putServiceStatusEndpoint, type, service, state);
        }

        function changeRealServicesServiceState(service, state) {
            var broker;
            switch (service) {
            case "guard":
                broker = "antivirus";
                break;
            case "webguard":
                broker = "antivirus_webguard";
                break;
            case "mailguard":
                broker = "antivirus_mailguard";
                break;
            default:
                LoggingService.Error("Unknown service: " + service);
                return;
            }

            var putServiceStatusEndpoint = AntivirusEndpoints.putServiceStatus(broker);
            var type = "service-state";

            SendChangeRequest(putServiceStatusEndpoint, type, service, state);
        }

        function changeServiceState(service, state) {
            if (service === "firewall") {
                changeFirewallServiceState(service, state);
            } else {
                changeRealServicesServiceState(service, state);
            }
        }

        return {
            changeServiceState: changeServiceState
        };
    }

    return app.factory(name, ServiceStatusService);
};
},{}],155:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    UpdaterService.$inject = ["$rootScope", "$timeout", "MessageBroker", "LoggingService", "UpdateModalOverlayService", "UpdaterEndpoints", "AppStatusService", "AntivirusEndpoints", "FixNowService"];
    function UpdaterService(
        $rootScope,
        $timeout,
        MessageBroker,
        LoggingService,
        UpdateModalOverlayService,
        UpdaterEndpoints,
        AppStatusService,
        AntivirusEndpoints,
        FixNowService) {
        var updateTimeout = 10 * 60 * 1000;
        var isUpdaterRunning = false;
        var updaterHostFixedName = "antivirus_update.exe";

        var subscribedUpdater;
        var subscribedUpdaterArray = [];
        var timeoutCompleteUpdate = null;
        var lastAppStateStatus = "";
        var lastUpdaterProgress = 0;
        var lastFixNowActionIsUpdating = false;
        var currentFixNowActionIsUpdating = false;
        var currentAppStateStatus = "";

        function checkAppStatusChanged(error) {
            currentAppStateStatus = AppStatusService.app_state.status;

            if (currentAppStateStatus === "fix_now") {
                currentFixNowActionIsUpdating = FixNowService.isUpdating();
            }

            if ((lastAppStateStatus === "fix_now" || lastAppStateStatus === "updating")
                && currentAppStateStatus !== "fix_now"
                && currentAppStateStatus !== "updating") {
                if (error) {
                    LoggingService.Error("App status error");
                }
                
                markUpdateAsFinished();
            }

            if (currentAppStateStatus === "fix_now" && !currentFixNowActionIsUpdating && lastFixNowActionIsUpdating) {
                if (error) {
                    LoggingService.Error("App status error");
                }

                markUpdateAsFinished();
            }

            if (currentAppStateStatus === "fix_now") {
                lastFixNowActionIsUpdating = currentAppStateStatus;
            }

            lastAppStateStatus = currentAppStateStatus;
        }

        $rootScope.$on('appStatusChanged', function () {
            checkAppStatusChanged(false);
        });

        $rootScope.$on('appStatusChangedError', function () {
            checkAppStatusChanged(true);
        });

        function IsUpdaterResource(host, path) {
            var pos = host.indexOf(updaterHostFixedName);
            if (pos !== 0) {
                return false;
            }

            var endpointUpdaterStatus = UpdaterEndpoints.updaterStatus(host);

            if (path === endpointUpdaterStatus.path) {
                return true;
            }

            return false;
        }

        $rootScope.$on('endpointResourceAdded', function (event, params) {
            if (IsUpdaterResource(params.host, params.path)) {
                subscribeForUpdaterResource(params.host, params.path);
            }
        });

        $rootScope.$on('endpointResourceDelete', function (event, params) {
            if (IsUpdaterResource(params.host, params.path)) {
                unsubscribeFromUpdaterResource(params.host, params.path);
            }
        });

        function markUpdateAsFinished() {
            isUpdaterRunning = false;
            $rootScope.$broadcast("updaterStatusChanged");
            removeTimeoutCompleteUpdate();
            var endpointUserInterfaces = AntivirusEndpoints.getUserInterfaces();
            var signatureCheckTimeout = 1 * 60 * 1000;

            var timeoutSignatureCheck = $timeout(function () {
                LoggingService.Error("Signature check is not done in " + (signatureCheckTimeout / 1000) + " seconds");
                UpdateModalOverlayService.finishUIUpdate(false);
            }, signatureCheckTimeout);

            UpdateModalOverlayService.startWaitForSignatureCheckResult();

            MessageBroker.request(
                endpointUserInterfaces,
                function (response) {
                    if (timeoutSignatureCheck !== null) {
                        $timeout.cancel(timeoutSignatureCheck);
                        timeoutSignatureCheck = null;
                    }

                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Get user interfaces ends with: " + response.status_code);
                        UpdateModalOverlayService.finishUIUpdate(false);
                    }
                    else if (response.payload && response.payload.data && response.payload.data.attributes) {
                        if (response.payload.data.attributes.is_html_ui_locked) {
                            LoggingService.Debug("UI is locked after update");
                            UpdateModalOverlayService.finishUIUpdate(true);
                            return;
                        }
                        else {
                            LoggingService.Error("UI is not locked after update");
                            UpdateModalOverlayService.finishUIUpdate(false);
                        }
                    }
                    else {
                        LoggingService.Error("UI is not locked after update");
                        UpdateModalOverlayService.finishUIUpdate(false);
                    }
                    
                    $rootScope.$broadcast("updaterStatusChanged");
                    unsubscribeAllFromUpdaterResource();

                    return;
                });
        }

        function removeTimeoutCompleteUpdate(){
            if (timeoutCompleteUpdate !== null) {
                $timeout.cancel(timeoutCompleteUpdate);
                timeoutCompleteUpdate = null;
            }
        }

        function onUpdaterStatusChanged(updaterStatus) {

            // Prevent possible multiple update finish events handling to eliminate statusbar blinking
            if (!isUpdaterRunning) {
                return;
            }

            var updater = subscribedUpdaterArray[subscribedUpdaterArray.length - 1];

            if (updater) {
                updater.data.isUIUpdating = updaterStatus.attributes.is_ui_updating;
                updater.data.uiUpdateResult = updaterStatus.attributes.ui_update_result;
                updater.data.progress = updaterStatus.attributes.progress;
                if (updater.data.isUIUpdating && UpdateModalOverlayService.isUIUpdateRunning() === false) {
                    UpdateModalOverlayService.startUIUpdate();
                }
            }

            $rootScope.$broadcast("updaterStatusChanged");
        }

        function unsubscribeFromUpdaterResource(host, path) {

            var index = -1;
            for (var i = 0; i < subscribedUpdaterArray.length; ++i) {
                if (host == subscribedUpdaterArray[i].updater.host,
                    path == subscribedUpdaterArray[i].updater.path)
                {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                subscribedUpdaterArray.splice(index, 1);
                MessageBroker.removeSubscription(
                    {
                        host: host,
                        path: path
                    });
            }
        }

        function unsubscribeAllFromUpdaterResource() {
            for (var i = 0; i < subscribedUpdaterArray.length; ++i) {

                MessageBroker.removeSubscription(
                    {
                        host: subscribedUpdaterArray[i].updater.host,
                        path: subscribedUpdaterArray[i].updater.path
                    });
            }

            subscribedUpdaterArray = [];
        }

        function subscribeForUpdaterResource(/*id,*/ host, path) {
            var pos = host.indexOf(updaterHostFixedName);

            var endpointUpdaterStatus = UpdaterEndpoints.updaterStatus(host);

            if (pos === 0 && path === endpointUpdaterStatus.path) {

                // Check if we already subscribed for received updater resource
                for (var i = 0; i < subscribedUpdaterArray.length; ++i) {
                    var updater = subscribedUpdaterArray[i];

                    if (updater.updater.host === host) {
                        return;
                    }
                }

                // delete previously set timer!
                removeTimeoutCompleteUpdate();
                timeoutCompleteUpdate = $timeout(function () {
                    LoggingService.Error("Update 10 minutes timeout elapsed");
                    markUpdateAsFinished();
                }, updateTimeout);

                isUpdaterRunning = true;

                MessageBroker.subscribe(endpointUpdaterStatus, function (updaterNotification) {
                    onUpdaterStatusChanged(updaterNotification);
                });

                MessageBroker.request(endpointUpdaterStatus, function (updaterStatus) {
                    if (updaterStatus.status_code === 200) {
                        subscribedUpdater = {
                            updater: {
                                //id: id,
                                path: endpointUpdaterStatus.path,
                                host: endpointUpdaterStatus.host
                            },
                            data: {
                                isUIUpdating: updaterStatus.payload.data.attributes.is_ui_updating,
                                uiUpdateResult: updaterStatus.payload.data.attributes.ui_update_result,
                                progress: updaterStatus.payload.data.attributes.progress,
                                needSelfUpdate: updaterStatus.payload.data.attributes.need_self_update,
                                isSelfUpdate: updaterStatus.payload.data.attributes.update_type === 1
                            }
                        }

                        subscribedUpdaterArray.push(subscribedUpdater);
                    }

                    $rootScope.$broadcast("updaterStatusChanged");
                });
            }
        }

        return {
            progress: function () {
                var updater = subscribedUpdaterArray[subscribedUpdaterArray.length - 1];
                if (updater) {
                    lastUpdaterProgress = updater.data.progress;
                    return updater.data.progress;
                }

                return lastUpdaterProgress;
            },
            needSelfUpdate: function () {
                var updater = subscribedUpdaterArray[subscribedUpdaterArray.length - 1];
                if (updater) {
                    return updater.data.needSelfUpdate;
                }

                return false;
            },
            isSelfUpdate: function () {
                var updater = subscribedUpdaterArray[subscribedUpdaterArray.length - 1];
                if (updater) {
                    return updater.data.isSelfUpdate;
                }

                return false;
            }
        };

    }

    return app.factory(name, UpdaterService);
};
},{}],156:[function(require,module,exports){
module.exports = function (name, app) {
    return app.factory(name, function(){
        return window.Velocity || (window.jQuery && jQuery.Velocity);
    });
};
},{}],157:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    WebsiteLinksService.$inject = ["translator", "Tools"];
    function WebsiteLinksService(translator, Tools) {
        return {
            getUpgrade: function() {
                return 'aoe://openDashboardUrl?section=upgrade&service=antivirus&windowPosition=onTopOfMainWindow&windowid=scard'
            },
            getRenew: function() {
                return 'aoe://openDashboardUrl?section=renew&service=antivirus&windowPosition=onTopOfMainWindow&windowid=scard'
            },
            getCloseLauncher: function() {
                return 'aoe://close';
            },
            getHomepage: function() {
                return "http://www.avira.com";
            },
            getSupport: function () {
                return translator.getString("support", "websites");
            },
            getDownloadAndroid: function () {
                return translator.getString("downloadAndroid", "websites");
            },
            getDownloadIos: function () {
                return translator.getString("downloadIOS", "websites");
            },
            getFeedbackLink: function(
                resource_id,
                product_id,
                product_language,
                product_version,
                platform_version,
                platform_type,
                device_id) {

                return translator
                    .getString(resource_id,
                    "websites",
                    {
                        device_id: device_id,
                        product_id: product_id,
                        platform_type: platform_type,
                        product_language: product_language,
                        product_version: product_version,
                        platform_version: platform_version,
                        ui_language: Tools.GetLanguageName()
                    });
            },         
            getVirusLink: function(infection_name) {
                return translator.getString("detailsAboutInfection",
                    "websites",
                    { infection_name: infection_name });
            },
            getKBSupport: function() {
                return translator
                    .getString("knowledgeBase.installModule",
                    "websites");
            }
        };
    }

    return app.factory(name, WebsiteLinksService);
};
},{}],158:[function(require,module,exports){
module.exports = function (name, app) {

    /**@ngInject*/
    WindowsServicesService.$inject = ["$rootScope", "$timeout", "MessageBroker", "LoggingService", "CommonService", "LauncherEndpoints", "EndpointService"];
    function WindowsServicesService(
        $rootScope,
        $timeout,
        MessageBroker,
        LoggingService,
        CommonService,
        LauncherEndpoints,
        EndpointService) {

        var serviceTimeout = [];
        serviceTimeout["antivirservice"] = {
            setServiceStateTimeout: 60000,
            getServiceStateTimeout: 5000
        };
        serviceTimeout["MpsSvc"] = {
            setServiceStateTimeout: 60000,
            getServiceStateTimeout: 5000
        };
        serviceTimeout["antivirwebservice"] = {
            setServiceStateTimeout: 30000,
            getServiceStateTimeout: 5000
        };
        serviceTimeout["antivirmailservice"] = {
            setServiceStateTimeout: 30000,
            getServiceStateTimeout: 5000
        };

        function triggerServiceStart(serviceName, value, callback, endpoint) {
            var responseValidated = true;
            var startTimer = $timeout(function () {
                startTimer = null;
                responseValidated = false;

                LoggingService.Error("Response for post windows-services status not received before timeout expired");

                callback(value, false);
            }, serviceTimeout[serviceName].setServiceStateTimeout);

            var request = LauncherEndpoints.windowsServicesPut(serviceName);
            var payload = {
                data:
                {
                    id: CommonService.generateUuid(),
                    type: "windows-services/" + serviceName,
                    attributes: {
                        service_name: serviceName,
                        status: "Running"
                    }
                }
            };

            var waitForResource = null;
            var timerWaitForResource = null;
            var resourceReached = false;
            waitForResource = $rootScope.$on('endpointResourceAdded', function (event, params) {
                if (params.host === endpoint.host && params.path === endpoint.path) {
                    resourceReached = true;
                    if (timerWaitForResource) {
                        $timeout.cancel(timerWaitForResource);
                        timerWaitForResource = null;
                    }

                    waitForResource();
                    callback(value, true);
                }
            });

            var startTime = moment().utc().unix();
            MessageBroker.request(request,
                function (response) {
                    $timeout.cancel(startTimer);
                    startTimer = null;

                    if (!responseValidated) {
                        waitForResource();
                        LoggingService.Error(
                            "Response for post windows-services status received after timeout expired");
                        callback(value, false);
                        return;
                    }

                    if (response.status_code && response.status_code >= 300) {
                        waitForResource();
                        LoggingService.Error("Received error response for set service: " +
                            serviceName +
                            " host: " +
                            request.host +
                            " path :" +
                            request.path +
                            " with status code " +
                            response.status_code);
                        callback(value, false);
                        return;
                    }

                    if (response.payload) {
                        if (response.payload.data) {
                            if (response.payload.data.attributes) {
                                if (response.payload.data.attributes.service_name === serviceName) {
                                    if (response.payload.data.attributes.status !== "Running") {
                                        waitForResource();
                                        LoggingService.Error("Can't start service. Service: " +
                                            serviceName +
                                            ". State: " +
                                            response.payload.data.attributes.status);
                                        callback(value, false);
                                        return;
                                    }

                                    if (resourceReached === false) {

                                        var endTime = moment().utc().unix();
                                        var timeElapsed = endTime - startTime;
                                        var waitTime = serviceTimeout[serviceName].setServiceStateTimeout - (timeElapsed * 1000);
                                        
                                        timerWaitForResource = $timeout(function () {
                                            waitForResource();
                                            if (resourceReached === false) {
                                                LoggingService.Error(
                                                    "Resource not available after " + waitTime + " seconds. Resource host: " +
                                                    endpoint.host +
                                                    " Resource path: " +
                                                    endpoint.path);
                                                waitForResource();
                                                callback(value, false);
                                            }
                                        },
                                            waitTime);
                                    }
                                    return;
                                } else {
                                    LoggingService.Error("Got response of start service for wrong service. Expected: " +
                                        serviceName +
                                        " Actual: " +
                                        response.payload.data.attributes.service_name);
                                }
                            } else {
                                LoggingService.Error(
                                    "Missing attributes section in windows-services resource post response");
                            }
                        } else {
                            LoggingService.Error("Missing data section in windows-services resource post response");
                        }
                    } else {
                        LoggingService.Error("Missing payload section in windows-services resource post response");
                    }

                    waitForResource();
                    callback(value, false);
                }, payload);
        }


        function startService(serviceName, value, callback, endpoint) {
            if (EndpointService.doesResourceExist(endpoint) === true) {
                callback(value, true);
                return;
            }

            var responseValidated = true;
            var startTimer = $timeout(function () {
                startTimer = null;
                responseValidated = false;

                LoggingService.Error(
                    "Response for get windows-services status not received before timeout expired");

                callback(value, false);
            },
                serviceTimeout[serviceName].getServiceStateTimeout);

            var request = LauncherEndpoints.windowsServicesGet(serviceName);
            var payload = {};

            MessageBroker.request(request,
                function (response) {
                    $timeout.cancel(startTimer);
                    startTimer = null;

                    if (!responseValidated) {
                        LoggingService.Error("Response for get windows-services status received after timeout expired");
                        return;
                    }

                    if (response.status_code && response.status_code >= 300) {
                        LoggingService.Error("Received error response for get service: " +
                            serviceName +
                            " host: " +
                            request.host +
                            " path :" +
                            request.path +
                            " with status code " +
                            response.status_code);

                        callback(value, false);
                        return;
                    }

                    if (response.payload) {
                        if (response.payload.data) {
                            if (response.payload.data.attributes) {
                                if (response.payload.data.attributes.service_name === serviceName) {
                                    if (response.payload.data.attributes.status === "Stopped") {
                                        triggerServiceStart(serviceName, value, callback, endpoint);
                                        return;
                                    } else if (response.payload.data.attributes.status !== "Running") {
                                        LoggingService.Error(
                                            "Can't start service because service state is not 'Stopped' and not 'Running'. State: " +
                                            response.payload.data.attributes.status);
                                        callback(value, false);
                                        return;
                                    }

                                    callback(value, true);
                                    return;
                                } else {
                                    LoggingService.Error("Got status of wrong service. Expected: " +
                                        serviceName +
                                        " Actual: " +
                                        response.payload.data.attributes.service_name);
                                }
                            } else {
                                LoggingService.Error("Missing attributes section in windows-services resource get response");
                            }
                        } else {
                            LoggingService.Error("Missing data section in windows-services resource get response");
                        }
                    } else {
                        LoggingService.Error("Missing payload section in windows-services resource get response");
                    }

                    callback(value, false);
                },
                payload);
        }

        return {
            startService: startService
        };
    }

    return app.factory(name, WindowsServicesService);
};
},{}]},{},[11,108]);

<!-- AVCS4F3A4200C37O030000000503000002AB010000000000000000000000000303000000650300000200P000000000000000075DFA1E5C38A309CAA61470F7239B6347FE89898751A8895D947FA59CC997251020F00E3FF4E15353243084698B497658F8C7A911D339B66C2181D07151A07529CAE0A66D32D6B6BA67EE10A784BA205CF2E3A47CC7063D3280B0F424AC6010364ACDD7CBA6AE439A3F98559713C119E5E3ADF6A92133FC083A8770E1332BEB8A6A2E4018AB60C0F7840307E5718A1AFFB442EFF37A5FF656F34B4DD5E5DA33F1CED4CA1EA5D5D796625888EBF4FA0AD20676C36855196AF24610F09A3E5040F9BA6CB1525EA8B9BA9EEF6F4E50DC35B9D66CBC3079A9CBA1AD6A0C4AF1C0D4D6B180B52BFE7B0EBA302EFEC764AFDD38C2B2BE3A624C3CAB471CA496ABF9A4700000000000000000000000000000292030000000403T62F3AB0132FAVCSE -->