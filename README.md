# autocomplete
Autocomplete for Box Critters and other worlds

My goal is to create an autocomplete simular to Minecraft's commands. When a user enters the "/" in the chat bar a list of available commands appears. As the user types the list narrows. This system requires a couple unique features. One is watching a list of objects in the world. For example: If the user enters "/mute" a list of active nicknames appears. This list is a reference to world.room.players

## Using the Component
You can copy the `/dist/autocomplete-cpnt.js` file to your project folder and load it to your website. An full example is in the `/test` folder.
```js
// Create the component. Debugging is set to true. 10 max suggestions.
var autocomplete = new autocompleteComponent.AutocompleteComponent('inputMessage', true, 10);

// You must enable the component.
autocomplete.enable();

/**
 * Add your commands.
 */
autocomplete.addCommand('beep');
autocomplete.addCommand('join', function(alias, args, response) {
    var rooms = ['tavern', 'christmas', 'snowman_village', 'crash_site', 'forest'];

    if (args.length === 1) {
        // Respond to autocomplete with a list of rooms.
        response(rooms, false);
    }
});
```

## Modifying & Building
To edit the component, use the file `/src/autocomplete-cpnt.js`. Once you are done, run the command `npm run build` to build the component with Webpack to the `/dist` folder.
