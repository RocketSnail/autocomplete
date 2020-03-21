var autocompleteComponent =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function AutocompleteComponent(inputId, debug, maxSuggestions, commandChar) {
    this.inputId = inputId;
    this.commands = {};
    this.debug = debug || false;
    this.commandChar = commandChar || '/';
    this.maxSuggestions = maxSuggestions || 10;
}

/**
 * Autocomplete suggestions for the chat input.
 */
AutocompleteComponent.prototype.enable = function () {
    var that = this;
    var source = [];

    $('#' + this.inputId).on('keydown', function (event) {
        if ($(this).autocomplete('instance').menu.active) {
            if (event.keyCode === $.ui.keyCode.TAB) {
                event.preventDefault(); // Stay on field if TAB is pressed.

                var terms = this.value.split(' ');
                var commandAlias = terms[0].substr(1);
                var command = that.commands[commandAlias];

                if (command && command.updateSuggestionsOnSelect || !command) {
                    that.updateSuggestionsMenu();
                }
            }
        }
    }).on('input', function (event) {
        if (!$(this).val()) {
            $('#inputMessage').autocomplete('close');
            return false;
        }
    }).autocomplete({
        minLength: 0,
        autoFocus: true,
        position: {my: 'left bottom', at: 'left top', collision: 'flip'},

        source: function (request, response) {
            if (request.term.charAt(0) === that.commandChar) {
                var commandArgs = request.term.split(' ');
                var isCommandAlias = commandArgs.length < 2 && commandArgs[0].charAt(0) === that.commandChar;
                var commandAlias = commandArgs[0].substr(1);
                var term = isCommandAlias ? request.term.split(' ').pop().substr(1) : request.term.split(' ').pop();

                source = [];
                commandArgs.shift();

                if (commandArgs.length < 1) {
                    for (var command in that.commands) {
                        source.push(command);
                    }

                    var data = $.ui.autocomplete.filter(source, term);
                    response(data.slice(0, that.maxSuggestions));
                } else {
                    var command = that.commands[commandAlias];

                    if (command && command.handler) {
                        command.handler(commandAlias, commandArgs, function (arr, updateSuggestionsOnSelect) {
                            var data = $.ui.autocomplete.filter(arr, term);

                            that.commands[commandAlias].updateSuggestionsOnSelect = updateSuggestionsOnSelect;
                            response(data.slice(0, that.maxSuggestions));
                        });
                    }
                }
            }
        },

        focus: function () {
            return false;
        },

        select: function (event, ui) {
            var terms = this.value.split(' ');
            var isCommandAlias = terms.length < 2 && terms[0].charAt(0) === that.commandChar;
            var commandAlias = terms[0].substr(1);
            var command = that.commands[commandAlias];

            // Remove current input and add selected.
            terms.pop();
            terms.push((isCommandAlias ? that.commandChar : '') + ui.item.value);
            terms.push('');

            this.value = terms.join(' ');

            if (command && command.updateSuggestionsOnSelect  || !command) {
                that.updateSuggestionsMenu();
            }

            return false;
        }
    });

    this.debugLog('✅ [Autocomplete Module] Successfully enabled.', this);
};

/**
 * Workaround to update the suggestions menu.
 */
AutocompleteComponent.prototype.updateSuggestionsMenu = function () {
    var e = jQuery.Event('keydown');
    e.which = 40;
    $('#' + this.inputId).trigger('focus').attr('value', ' ').trigger(e);
};

/**
 * Adds a command to suggest.
 * @param alias - Command alias.
 * @param handler - Function that handles command suggestion.
 */
AutocompleteComponent.prototype.addCommand = function (alias, handler) {
    this.commands[alias] = {alias: alias, handler: handler, updateSuggestionsOnSelect: true};
    this.debugLog('➕ Added the command "' + alias + '" to autocomplete.', this);
};

/**
 * Debug Logger.
 * @param message
 * @param that
 */
AutocompleteComponent.prototype.debugLog = function (message, that) {
    that = that || this;

    if (that.debug) {
        console.log(message);
    }
};

module.exports = {
    AutocompleteComponent: AutocompleteComponent
};

/***/ })
/******/ ]);