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
    var Game = Parse.Object.extend("Game");   
    var query = new Parse.Query(Game);
    query.equalTo('user1', getCurrentUser());
    query.equalTo('isUser1sTurn', true);
    query.find({
        success: function(games){
            var returnStr = '';
            for(var i = 0; i < games.length; i++){
                var game = games[i];
                returnStr += game.get("user2")+"<br>";
            } 
            document.getElementById("yourTurn").innerHTML = returnStr;
    }
    });
}

function printGameListWaitingTurn(){
    var Game = Parse.Object.extend("Game");   
    var query = new Parse.Query(Game);
    query.equalTo('user1', getCurrentUser());
    query.equalTo('isUser1sTurn', false);
    query.find({
        success: function(games){
            var returnStr = '';
            for(var i = 0; i < games.length; i++){
                var game = games[i];
                returnStr += game.get("user2")+"<br>";
            } 
            document.getElementById("waitingTurn").innerHTML = returnStr;
    }
    });
}