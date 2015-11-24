## Neighborhood Map project

The Neighborhood Map web app fetures my favorite attractions in Melbourne Ausralia.
To open, download the repo to your machine, and open the index.html in your browser.

You will see a map of Melbourne Australia with markers on some of the great attractions. along with a responsive list with the names of each attraction.

When you click on a marker or on a list item, the marker of the corresponding attraction will bounse, and a pop-up window will show near the marker, with the title, a short description from wikipedia, along with a link to the full wikipedia article.

There is also a search feture. When you type a query it will show only the locations that the title match the query. If nothing matches it will show a messge that nothing was found.

The app is responsive and on mobile devies the list will initially be off the canvas. An arrow will be displayed, when you click on the arrow it will show the list. To see the map again you can click on the arrow or one of the attraactions on the list.

All data downloaded from thid party APIs are downloaded asynchronously and will not stop the app, if it fails to download the data it will show a clean error message.

This app uses bootstrap and knockoutjs frameworks. it also makes use of google maps and wikipedia APIs.
