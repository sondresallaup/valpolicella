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
            if(results.length == 0){
                var game = new Game();
    
                game.set('user1', getCurrentUser());
                game.set('user2', opponent);
                game.set('isUser1sTurn',true);
                game.set('currentRound', 0);

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

function openGame(opponent){
    localStorage.setItem('opponent',opponent);
    window.location = ('game.html');    
}


function startGame(){
    var Game = Parse.Object.extend("Game");
    
    var gameQuery = new Parse.Query(Game);
    gameQuery.equalTo('user1', getCurrentUser());
    gameQuery.equalTo('user2', localStorage.getItem('opponent'));
    
    gameQuery.first({
        success: function(game){
            //check if a word is created
            if(game.get("word") == null){
                document.getElementById('yourWordDiv').style.display = "block";
            }
        }
    });
}

//FORMS
$("button#yourWordSubmit").click( function() {
    document.getElementById("yourWordButton").innerHTML= LOADING_ICON;
  if( $("#yourWord").val() == ""){
      document.getElementById("yourWordCard").style.display = "block";
      document.getElementById("yourWordButton").innerHTML= YOUR_WORD_BUTTON_STRING;
    $("div#yourWordmsg").html('<font color="red">' + YOUR_WORD_FILL_INPUT);
  }
	else{ //lagrer ordet til spill
        var Game = Parse.Object.extend("Game");
    
        var gameQuery = new Parse.Query(Game);
        gameQuery.equalTo('user1', getCurrentUser());
        gameQuery.equalTo('user2', localStorage.getItem('opponent'));

        gameQuery.first({
            success: function(game){
                game.save(null, {
                    success: function(game) {
                        game.set('word',$("#yourWord").val());
                        game.set('isUser1sTurn',false);
                        game.set('currentRound',1);
                        game.save();
                        document.getElementById('yourWordDiv').style.display = "none";
                        $("div#gameBoard").html('<font color="red">' + YOUR_WORD_SUCCESSFULL);
                    }
                });
            }
        });
		
	}

 
	$("#yourWordForm").submit( function() {
	   return false;	
	});
 
});