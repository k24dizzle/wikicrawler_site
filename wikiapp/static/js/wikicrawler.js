var game;

function links_callback(data) {
    links = data;
    for (var i = 0; i < links.length; i++) {
        links[i] = unescape(links[i]);
    }
}

var WikiGame = function WikiGame(start, goal) {
    this.start = start;
    this.goal = goal;
    this.path = [];
    this.win = false;
    this.visitPage(start);
    this.links = [];
};

WikiGame.prototype.visitPage = function(name) {
    this.path.push(name)
    if (name === this.goal) {
        this.win = true;        
        this.onWin();
    } else {
        this.current = name;
        $.getJSON('/api/get_ten/' + name, {}, this.processPage());
    }
};


WikiGame.prototype.processPage = function() {
    return (function(data) {
        var links = data;
        for (var i = 0; i < links.length; i++) {
            links[i] = unescape(links[i]);
        }
        var ten_links = this.gatherTen(links);
        this.links = ten_links;
        this.render_list();
    }).bind(this)
};

WikiGame.prototype.gatherTen = function(links) {
    var results = [];
    var paths = Math.min(10, links.length);
    while(results.length < paths){
        var rand = Math.floor(Math.random() * (links.length));
        var chosen_link = links[rand]
        results.push(chosen_link);
        // removing this link
        links.splice(rand, 1)
    }
    if (links.indexOf(this.goal) !== -1) {
        if (results.indexOf(this.goal) === -1) {
            rand = Math.floor(Math.random() * (results.length));
            results[rand] = this.goal;
        }
    }
    return results;
};

WikiGame.prototype.render_list = function() {
    $("#results").empty()
    $("#current").html('Current: ' + game.current);
    for (var i = 0; i < game.links.length; i++) {
        var newEl = $('<div class="choice"><a href="#">' + i + ": " + game.links[i] + "</a></div>");
        newEl.click(get_click_func(game.links[i]));
        $("#results").append(newEl);
    }
};

WikiGame.prototype.onWin = function() {
    $("#game_results").show();
    if (game.path.length > 0) {
        $('#path').append('START: ' + this.path[0]);
    }
    for (var i = 1; i < game.path.length; i++) {
        var newElement = $('<div id="path">' + i + ": " + this.path[i] + '</div>');
        $('#path').append(newElement);
    }
    $("#game").hide();
}

function get_click_func(name) {
    return function(e) {
        $("#results").empty()
        game.visitPage(name);
        e.preventDefault();
    }
}


var difficulties = {
    Easy: ['Rome', 'World War II', 'Adolf Hitler'],
    Medium: ['Barack Obama', 'Fiji'],
    Hard: ['Andrei Toader'],
};

$(document).ready(function() {
    $("#test").click(function(){
        $("#current").html('Current: ' + game.current);
    
        console.log('WE MADE IT');
        var choice = $("#choice").val();
        game.visitPage(game.links[choice]);
    });
    $("#submit").click(function(e){
        
        e.preventDefault();
        var startPage = $('#starting-page').val();
        var diff = $('#difficulty-select').val();
        var goals = difficulties[diff];
        var goal = goals[Math.floor(Math.random() * goals.length)]; 
        console.log(goal);
        $('#goal').html('Goal: ' + goal);
        game = new WikiGame(startPage, goal);
        $('#game').show();
        $('#start').hide();


    });
    $("#play_again").click(function() {
        $('#start').show();
        $('#game_results').hide();
        $('#path').empty();


    });
});
