function AutocompleteComponent(inputId, debug, commandChar) {
    this.inputId = inputId;
    this.commands = {};
    this.debug = debug || false;
    this.commandChar = commandChar || '/';
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
                    response(data);
                } else {
                    var command = that.commands[commandAlias];

                    if (command && command.handler) {
                        command.handler(commandAlias, commandArgs, function (arr, updateSuggestionsOnSelect) {
                            var data = $.ui.autocomplete.filter(arr, term);

                            that.commands[commandAlias].updateSuggestionsOnSelect = updateSuggestionsOnSelect;
                            response(data);
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