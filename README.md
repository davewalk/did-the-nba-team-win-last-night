Did The [NBA team] win last night?
==================================

This is a simple, responsive (looks good in smartphone browsers) and awesome web app that answers the question: "Did [NBA team] win last night?" with videos and stories. Instead of referencing various websites to find out what happened, go to one for highlights, recaps and opinions.  
  
Since it's completely static it can easily be uploaded to S3, Google Drive, Dropbox or wherever, so fork today for your favorite team! When you're all setup, add your team to the below list with a pull request. [Read more about the app](http://www.davewalk.net/post/38067603479).

![Did The Cavs Win Last Night? screenshot on a smartphone](http://www.didthecavswinlastnight.net/screenshot.png)

Teams So Far
============

[Cleveland Cavaliers](http://www.didthecavswinlastnight.net) ([davewalk](https://github.com/davewalk))  

[Philadelphia 76ers](http://www.didthesixerswinlastnight.com) ([davewalk](https://github.com/davewalk))  

Installation
============

Installation isn't too hard, but we'll have to edit a few files.  

Team Schedule
-------------

The app grabs the schedule of the team from a JSON file that you provide.  This JSON file is created by a Python script that parses a .csv file.  Most NBA teams provide their schedule at the [NBA's website](http://www.nba.com).  Click on "Teams" and your team, then "Schedule."  Most teams include a .csv file to download, but some do not.  I was originally going to generate the JSON file for each team, but it got too tedious because they often use different formats and __you have to convert start times to  Eastern Standard Time__.  So once you have grabbed your team's csv schedule, modify it into this format:  
  
`10/30/2012,7:00 PM,Quicken Loan Arena,Washington`  
  
Then you'll run the `app/schedules/csv2json.py` script to generate the necessary JSON.  Don't worry, you don't actually need to know much Python, but I'm just going to go ahead and assume that your computer has it.  
  
Put your modified csv file into `app/schedules` and navigate to it. Modify in the `app/schedules/csv2json.py` file:  
  
  * `TEAM_CITY` to your city's name
  * `ARENA_NAME` to your team's arena's name exactly as it is in the third column of the csv file
  * You also may have to edit the `'L.A.Clippers'` and `'L.A.Lakers'` strings to match what is in your csv file for the fourth column. It varies by team.  
    
Then run from the command line:  
  
`python csv2json.py [filename].csv [filename].json`  
  
You should now have a JSON file now that you can reference in the `team` object of `app/main.js` (see below)

`app/index.html`
----------------

There's a few simple changes you'll have to make here:

* `<title>` to match your version
* `<meta name="description">` to match your version
* Your UA code in the Google Analytics code if you're going to be using it.
* The hex color of `context-strokeStyle` to change the color of the basketball at the top

`app/main.js`
------------

You'll have to edit the properties in the `team` object at the beginning of this file.  It's pretty self-explanatory with `city`, `name`, and `nickname` (which is used for the `h1` in `index.html`). To fetch the Youtube videos for the website, the app queries the users in the `youtubeUsers` array on your team's `name`.  
  
The `url` should point to the JSON schedule file that you created above.    

The blog `link` is made by creating a JSON output of the blog/website's story feed via the [YQL Console](http://developer.yahoo.com/yql/console).  Scroll down to the bottom of "DATA TABLES" for "atom", "feed" or "xml," whatever works.The app should be able to parse standard RSS and ATOM. For the NBA.com and Yahoo! feeds you can just substitute your team's three-letter abbreviation and name, respectively.  And that should be it!  

`app/main.scss`
---------------

You'll probably want to change the colors to match your team.  This is easy to do with Sass, which you can download at [its website](http://sass-lang.com) if you don't have it already.  Edit the `$primary` and `$secondary` variables in `main.scss` to the colors that you want.  `$primary` is the color for the header and score content and `$secondary` is used for the links.  When you're done, recompile to `main.css` and you're done!  

Images
------

Although the image on the page is a Canvas element, I've included a `favicon.ico` and four versions of `apple-touch-icon` to account for different mobile devices.  You should be able to edit these how you'd like as they are PNG files.

And that's it!  Package up everything as it is in `dist` and deploy!

Additional Notes
================

* The scores for this app come from making a request to [@SimpleNBAScores twitter feed](http://twitter.com/SimpleNBAScores) (props to them).  Unfortunately to do this client-side I had to use the depreciated version 1.0 of the Twitter API which will probably be removed at some point.  This is the only way I've found of getting sports scores client-side and for free.  You'd think that something so ubiquitous as scores would be easier to obtain but supposedly they want you to pay for it.  But, there are free server-side ways of doing it, so if the Twitter API fails in the future I will work on an API endpoint that all versions of this application would be able to use.  If anyone knows of a way to get sports scores and info for free, please let me know, not just for this project but for others I have in mind.
* I have to admit that this app was inspired by [Is there a Giants game today?](isthereagiantsgametoday.com)
* Shoutouts to: [HTML5 Boilerplate](http://html5boilerplate.com), [Yeoman](http://yeoman.io) and [Date.js](http://www.datejs.com)
* I hope that folks will find this useful enough to maintain a version for their team.  Please send feedback to me [on Twitter](http://twitter.com/ddw17) and all pull requests are welcome!
