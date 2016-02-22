Guitarix Preset Browser
--------------------------

This code gets the guitarix preset list from Musical Artifacts and shows them on an stylized and less cluttered interface.

## Development

The simple project structure is:

* `index.html`: static html elements
* `css/`: css styles
* `js/guitarix.js`: On page load gets the presets in json format and constructs them as html nodes that are pushed in the page. 
* `img`: Images

To run a server locally I've included a `lighttpd` config file in `server.conf`. When running locally the browsers cross-origin protection might block you from download the JSON file from the server so I've included a `presets.json` file which can be downloaded instead to show you some placeholder presets. Uncomment [this line](https://github.com/lfzawacki/musical-artifacts-api-examples/blob/master/guitarix-presets/js/guitarix.js#L2).

The project depends on JQuery and Bootstrap icons, they're included from a CDN source in the HTML head.

## TODO LIST

 * JS sorting
 * Pagination
 * Tooltips on different buttons
 * Text only description
 * Better design (better images)
 * Less padding, aim to show more presets on the initial guitarix window
