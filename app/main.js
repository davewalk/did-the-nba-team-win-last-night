var DidTheyWin = (function($) {

    // $VARIABLES
    var team = { 
        city: 'Cleveland',
        name: 'Cavaliers',
        nickname: 'Cavs',
        url: 'Cavs.json',
        youtubeUsers : ['NEWNBACIRCLE', 'NBA'],
        blogs: [{ name : 'Cavs: The Blog',
                  url  : 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D\'http%3A%2F%2Fwww.cavstheblog.com%2F%3Ffeed%3Drss2\'&format=json'
                 },
                { name : 'Yahoo! RSS Feed',
                  url : 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D\'http%3A%2F%2Fsports.yahoo.com%2Fnba%2Fteams%2F' + 'cle' + '%2Frss.xml\'&format=json'                    
                },
                { name : 'Cleveland Plain Dealer',
                  url  : 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20atom%20where%20url%3D\'http%3A%2F%2Fimpact.cleveland.com%2Fcavs%2Fatom.xml\'&format=json'
                },
                { name : 'NBA.com Feed',
                  url  : 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D\'http%3A%2F%2Fwww.nba.com%2Fcavaliers%2Frss.xml\'&format=json'
                }]
    }; 

    var today = Date.today();

    var yesterday = Date.today().add({days: -1});
    
    var yesterdaysGame = null;
    var nextGame = null;

    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var toDateObject = function(d) {
        var date = d.date;
        var time = d.time;
        var min = time.split(':')[1];

        var day, hour;

        if (parseInt(time.split(':')[0]) === 12) {
            hour = 12;
        } else {
            hour = parseInt(time.split(':')[0]) + 12;
        }

        if (date.split('/')[1] === '08' || date.split('/')[1] === '09') {
            day = parseInt(date.split('/')[1], 10);
        } else {
            day = parseInt(date.split('/'));
        }
        
        var gameDate = Date.today().set({
            year: parseInt(date.split('/')[2]),
            month: parseInt(date.split('/')[0]) -1,
            day: day,
            hour: hour,
            minute: parseInt(min)
        });

        return gameDate;
    };   

    // $PRINTERS
    // Print the title immediately
    $('#title').append(Mustache.to_html($('#title-template').html(), team));

    var printStories = function(story) {
        var template = $('#story-template').html();
        var html = Mustache.to_html(template,story);
        $('#news').append(html);
    };

    printVideos = function() {
        var template = $('#video-template').html();

        $.each(team.youtubeUsers, function(index, user) {
            $.ajax({
                url: 'https://gdata.youtube.com/feeds/api/videos?author=' + user + '&q=' + team.name + '&alt=json&orderby=published&time=today',
                dataType: 'json',
                success: function(data) {
                    var videos = data.feed.entry;
                    $.each(videos, function(index, video) {
                        var id = video.id.$t.split('/').reverse()[0];
                        var video = { id : id };
                        var html = Mustache.to_html(template, video);
                        $('#videos').append(html);
                    
                    });
                }       
            });
        });
    }

    var printBlogPosts = function() {
        $.each(team.blogs, function(index, blog) {
            $.ajax({
                url: blog.url,
                dataType: 'json',
                success: function(resp) {
                    var results = resp.query.results.item;
                    if (!results) {
                        results = resp.query.results.entry;
                    }
                    for(i=0; i < results.length; i++) {
                        var pubDate = new Date(results[i].pubDate);

                        if (!pubDate.getDate()) {
                            pub = results[i].published;
                            pubDate = new Date(pub.replace('T', ' ').split('+')[0]); 
                        }

                        var link = results[i].link;
                        if (typeof(link) != 'string') {
                            link = results[i].link.href;
                            if (link == null) {
                                link = results[i].link[0].href;
                            }
                        }

                        var time = yesterdaysGame.time;
                        var date = yesterdaysGame.date;
                        var min = time.split(':')[1];
                        var gameDate = Date.today().set({
                                            year: parseInt(date.split('/')[2]),
                                            month: parseInt(date.split('/')[0]) -1,
                                            day: parseInt(date.split('/')[1]),
                                            hour: parseInt(time.split(':')[0]) + 12,
                                            minute: parseInt(min)
                        });

                        if (pubDate.compareTo(gameDate) === 1) {
                            var story = { title : results[i].title,
                                          link : link
                                        };
                            printStories(story);
                        }
                    }
                }
                
            });
        });
    };

    var printContent = function(game) {
        printVideos();
        printBlogPosts();
    };

    var wasGameYesterday = function(d) {
        var gameDate = toDateObject(d);
        gameDate = gameDate.clearTime();

        if (gameDate.compareTo(yesterday) === 0) {
            return true;
        }
    };

    var printScore = function(yesterdaysGame, nextGame) {
        $.ajax({
            url: 'https://api.twitter.com/1/statuses/user_timeline/simplenbascores.json',
            dataType: 'jsonp',
            success: function(data) {
                $.each(data, function(i, tweet) {
                    var tweetText = tweet.text;

                    var winningScore, losingScore;

                    var teamRe = '(' + team.name + ')';
                    var opponentRe = '(' + yesterdaysGame.opponent_name + ')';
                    var teamWonRe = '(' + team.name + ' won)';
                    var scoreRe = /[0-9]{2,3}(?![ers])/g;
                    var re = new RegExp(teamRe);
                    if (re.test(tweet.text)) {
                        var re = new RegExp(opponentRe);
                        if (re.test(tweetText)) {
                            winningScore = tweetText.match(scoreRe)[0];
                            losingScore = tweetText.match(scoreRe)[1];
                            var re = new RegExp(teamWonRe);
                            if (re.test(tweetText)) {
                                var results = { opponentName : yesterdaysGame.opponent_name,
                                                opponentCity : yesterdaysGame.opponent_city,
                                                winningScore : winningScore,
                                                losingScore : losingScore }
                                var template = $('#win-template').html();
                                var html = Mustache.to_html(template, results);
                                $('#results').html(html);
                            } else {
                                var results = { opponentName : yesterdaysGame.opponent_name,
                                                opponentCity : yesterdaysGame.opponent_city,
                                                winningScore : winningScore,
                                                losingScore : losingScore };
                                var template = $('#lost-template').html();
                                var html = Mustache.to_html(template, results);
                                $('#results').html(html);
                            }                        
                        }
                    }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                var template = $('#score-error-template');
                var html = Mustache.to_html(template);
                $('#results').html(html);
            }   
        });
    };  

    var printNextGame = function(game) {
        var template = $('#next-game-template').html();
        var html = Mustache.to_html(template, game);
        $('#next-game').html(html);
    };

    var printNoGame = function() {
        var template = $('#no-game-template').html();
        var html = Mustache.to_html(template);
        $('#results').html(html);
    };

    var getNextGame = function() {
        $.getJSON(team.url, function(schedule) {
            $.each(schedule.games, function(i, game) {
                var gameDate = toDateObject(game);
                gameDate = gameDate.clearTime();
                if (gameDate.compareTo(today) === 0) {
                    game.date = 'tonight';
                    nextGame = game;
                    printNextGame(nextGame);
                    return false;
                } else if (gameDate.compareTo(today) === 1) {
                    date = toDateObject(game);
                    game.date = week[date.getDay()];
                    nextGame = game;
                    printNextGame(nextGame)
                    return false;
                };              
            });
        });
    };
 
    $.getJSON(team.url, function(schedule) {
            $.each(schedule.games, function(i, game) {

               if (wasGameYesterday(game)) {
                   yesterdaysGame = game;
                   nextGame = schedule.games[i+1];
                }
            });

        if (yesterdaysGame) {
            printScore(yesterdaysGame, nextGame);
            getNextGame();
            printContent();
        } else {
            printNoGame()
            getNextGame();
        }
        
    });

})(jQuery);

