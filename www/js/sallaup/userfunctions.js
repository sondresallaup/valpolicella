parseInitialize();

checkIfLoggedIn();

function checkIfLoggedIn(){
	var currentUser = Parse.User.current();
	if(!currentUser){
		window.location = ('../index.html');
	}
}

function getCurrentUser(){
    var currentUser = Parse.User.current();
    return currentUser.getUsername();
}

function startGameWithUser(usernameStr, scope){
    var userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo('username',usernameStr);
    userQuery.first({
        success: function(user){
            if(user != null){
                createGame(user.getUsername());
            }
            else{
                 scope.showAlert();   
            }
        },
        error: function(error){
            $scope.showAlert();   
        }
    });
}

function printGameListYourTurn(){
    var yourTurnreturnStr = '';
    var Game = Parse.Object.extend("Game");   
    var queryUser1 = new Parse.Query(Game);
    queryUser1.equalTo('user1', getCurrentUser());
    queryUser1.equalTo('isUser1sTurn', true);
    queryUser1.find({
        success: function(games){
            for(var i = 0; i < games.length; i++){
                var game = games[i];
                var usernameStr = "'" + game.get("user2") + "'";
                var isUser1Str = "'" + 'true' + "'";
                var isCurrentUserStr = "'" + 'true' + "'";
                yourTurnreturnStr += '<a href="#" onclick="openGame(' + usernameStr + ', '+ isUser1Str  +', ' + isCurrentUserStr +');">';
                yourTurnreturnStr += game.get("user2")+"</a><br>";
            } 
                document.getElementById("yourTurn").innerHTML = yourTurnreturnStr;
    }
    });
    var queryUser2 = new Parse.Query(Game);
    queryUser2.equalTo('user2', getCurrentUser());
    queryUser2.equalTo('isUser1sTurn', false);
    queryUser2.find({
        success: function(games){
            for(var i = 0; i < games.length; i++){
                var game = games[i];
                var usernameStr = "'" + game.get("user1") + "'";                
                var isUser1Str = "'" + 'false' + "'";
                var isCurrentUserStr = "'" + 'true' + "'";
                yourTurnreturnStr += '<a href="#" onclick="openGame(' + usernameStr + ', '+ isUser1Str  +', ' + isCurrentUserStr +');">';
                yourTurnreturnStr += game.get("user1")+"</a><br>";
            }
            if(yourTurnreturnStr == '')
                document.getElementById("yourTurn").innerHTML = NO_GAMES_STRING;
            else
                document.getElementById("yourTurn").innerHTML = yourTurnreturnStr;
    }
    });
}

function printGameListWaitingTurn(){
    var waitingTurnreturnStr = '';
    var Game = Parse.Object.extend("Game");   
    var queryUser1 = new Parse.Query(Game);
    queryUser1.equalTo('user1', getCurrentUser());
    queryUser1.equalTo('isUser1sTurn', false);
    queryUser1.find({
        success: function(games){
            for(var i = 0; i < games.length; i++){
                var game = games[i];
                var usernameStr = "'" + game.get("user2") + "'";
                var isUser1Str = "'" + 'true' + "'";
                var isCurrentUserStr = "'" + 'false' + "'";
                waitingTurnreturnStr += '<a href="#" onclick="openGame(' + usernameStr + ', '+ isUser1Str  +', ' + isCurrentUserStr +');">';
                waitingTurnreturnStr += game.get("user2")+"</a><br>";
            }
            document.getElementById("waitingTurn").innerHTML = waitingTurnreturnStr;
    }
    });
    var queryUser2 = new Parse.Query(Game);
    queryUser2.equalTo('user2', getCurrentUser());
    queryUser2.equalTo('isUser1sTurn', true);
    queryUser2.find({
        success: function(games){
            for(var i = 0; i < games.length; i++){
                var game = games[i];
                var usernameStr = "'" + game.get("user1") + "'";                
                var isUser1Str = "'" + 'false' + "'";
                var isCurrentUserStr = "'" + 'false' + "'";
                waitingTurnreturnStr += '<a href="#" onclick="openGame(' + usernameStr + ', '+ isUser1Str  +', ' + isCurrentUserStr +');">';
                waitingTurnreturnStr += game.get("user1")+"</a><br>";
            } 
            if(waitingTurnreturnStr == '')
                document.getElementById("waitingTurn").innerHTML = NO_GAMES_STRING;
            else
                document.getElementById("waitingTurn").innerHTML = waitingTurnreturnStr;
    }
    });
}