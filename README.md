Did The [NBA team] win last night?
==================================

A simple, responsive and awesome web app that answers the question: "Did [NBA team] win last night?" with videos and stories.  Since it's completely static it can easily be uploaded to S3, Google Drive, Dropbox or wherever, so fork today for your favorite team! When you're all setup, add your team to the below list with a pull request.

Teams So Far
============

[Cleveland Cavaliers](http://www.didthecavswinlastnight.net) ([davewalk](https://github.com/davewalk))

Installation
============

Installation isn't too hard, but we'll have to edit a few files.  

`app/main.js`
------------

You'll have to edit the properties in the `team` object at the beginning of this file.  It's pretty self-explanatory with `city`, `name`, and `nickname` (which is used for the `h1` in `index.html`). To fetch the Youtube videos for the website, the app queries the users in the `youtubeUsers` array on your team's `name`.  
The blog `link` is made by creating a JSON output via the [YQL Console](http://developer.yahoo.com/yql/console).  Scroll down to the bottom of "DATA TABLES" for "atom", "feed" or "xml," whatever works.The app should be able to parse standard RSS and ATOM. For the NBA.com and Yahoo! feeds you can just substitute your team's three-letter abbreviation and name, respectively.  And that should be it!  
  

