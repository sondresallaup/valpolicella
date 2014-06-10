function getCurrentOpponent(){
    return (localStorage.getItem('opponent'));
}

function createGame(opponent){
    var Game = Parse.Object.extend("Game");
    
    //check if game already exists
    var isGameExistingQuery = new Parse.Query(Game);
    isGameExistingQuery.equalTo('user1', getCurrentUser());
    isGameExistingQuery.equalTo('user2', opponent);
    isGameExistingQuery.find({
        success: function(results){
            if(results.length < 1){
                var game = new Game();
    
                game.set('user1', getCurrentUser());
                game.set('user2', opponent);
                game.set('isUser1sTurn',true);

                game.save({
                    success: function(game){
                        localStorage.setItem('opponent',game.get("user2"));
                        window.location = ('game.html');
                    },
                    error: function(error){
                        alert(error.description);   
                    }
                });
                        }
        }
    });
}

function isUser1sTurn(){
    
}