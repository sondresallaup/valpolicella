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
                        localStorage.setItem('isCurrentUser', 'true');
                        localStorage.setItem('isUser1', 'true');
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

function openGame(opponent, isUser1, isCurrentUser){
    localStorage.setItem('opponent',opponent);
    localStorage.setItem('isUser1',isUser1);
    localStorage.setItem('isCurrentUser', isCurrentUser);
    window.location = ('game.html');    
}


function startGame(){
    var Game = Parse.Object.extend("Game");
    
    var gameQuery = new Parse.Query(Game);
    
    if(localStorage.getItem('isCurrentUser') == "false"){
        document.getElementById('currentWord').innerHTML = WAITING_FOR_OPPONENT;
    }
    
    else {
    if(localStorage.getItem('isUser1') == "true"){
        gameQuery.equalTo('user1', getCurrentUser());
        gameQuery.equalTo('user2', localStorage.getItem('opponent'));
    }
    else if(localStorage.getItem('isUser1') == "false"){
        gameQuery.equalTo('user2', getCurrentUser());
        gameQuery.equalTo('user1', localStorage.getItem('opponent'));
    }
        gameQuery.first({
            success: function(game){
                //check if a word is created
                if((game.get("word") == null) && (localStorage.getItem('isUser1') == "true")){
                    document.getElementById('yourWordDiv').style.display = "block";
                }
                else{
                    if(localStorage.getItem('isUser1') == "true"){
                        document.getElementById('currentWord').innerHTML = '<b><i>' + YOUR_WORD_IS + game.get("word") + '</i></b>';
                        //svare ja/nei
                        document.getElementById('answerDiv').style.visibility = "visible";
                        var Question = Parse.Object.extend("Question");
                        var questionQuery = new Parse.Query(Question);
                        questionQuery.equalTo('game', game.id);
                        questionQuery.descending('questionNr');
                        questionQuery.first({
                            success: function(question){
                                document.getElementById('questionFromUser').innerHTML = question.get("question");
                                localStorage.setItem('gameId', game.id);
                            }
                        });
                    }
                    else{
                          document.getElementById('currentWord').innerHTML = '<b><i>' + YOUR_WORD_IS_IN + YOUR_WORD_KINGDOM[game.get("kingdom")] + ', ' + YOUR_WORD_CONCRETENESS[game.get("concreteness")] + NUMBER_WORDS_STRING + (game.get('numberWords')+1) + WORDS_STRING + '</i></b>'; 
                    }
                    
                    
                }
            }
        });

    }
    if((localStorage.getItem('isCurrentUser') == "true") && (localStorage.getItem('isUser1') == "false")){
        document.getElementById('askQuestion').placeholder = PLACEHOLDER_EXAMPLE_QUESTIONS[Math.floor((Math.random() * PLACEHOLDER_EXAMPLE_QUESTIONS.length))];
        document.getElementById('askQuestionDiv').style.display = "block";
    }
    else if((localStorage.getItem('isCurrentUser') == "false") && (localStorage.getItem('isUser1') == "false")){
        document.getElementById('currentWord').innerHTML = WAITING_FOR_OPPONENT;
    }
    
}

//FORMS
        // your word
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
                        //selects
                        game.set('kingdom',document.getElementById('kingdom').selectedIndex);
                        game.set('concreteness',document.getElementById('concreteness').selectedIndex);
                        game.set('numberWords',document.getElementById('numberWords').selectedIndex);
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

        // ask question
$("button#askQuestionSubmit").click( function() {
    document.getElementById("askQuestionButton").innerHTML= LOADING_ICON;
  if( $("#askQuestion").val() == ""){
      document.getElementById("askQuestionCard").style.display = "block";
      document.getElementById("askQuestionButton").innerHTML= ASK_QUESTION_BUTTON_STRING;
    $("div#askQuestionmsg").html('<font color="red">' + ASK_QUESTION_FILL_INPUT);
  }
	else{ //lagrer ordet til spill
        var Game = Parse.Object.extend("Game");
    
        var gameQuery = new Parse.Query(Game);
        gameQuery.equalTo('user2', getCurrentUser());
        gameQuery.equalTo('user1', localStorage.getItem('opponent'));

        gameQuery.first({
            success: function(game){
                var Question = Parse.Object.extend("Question");
                var question = new Question();
                question.set('game', game.id);
                question.set('questionNr', game.get('currentRound'));
                question.set('question', $("#askQuestion").val());
                question.save();
                
                game.save(null, {
                    success: function(updatedGame){
                        updatedGame.set('isUser1sTurn', true);
                        updatedGame.save();
                        document.getElementById('askQuestionDiv').style.display = "none";
                        $("div#gameBoard").html('<font color="red">' + ASK_QUESTION_SUCCESSFULL);
                    }
                });
            }
        });
		
	}

 
	$("#askQuestionForm").submit( function() {
	   return false;	
	});
 
});

function answer(yesOrNo){
    var answer;
    if(yesOrNo == "true")
        answer = true;
    else
        answer = false;
    var Question = Parse.Object.extend("Question");
    questionQuery = new Parse.Query(Question);
    
    questionQuery.equalTo('game',localStorage.getItem('gameId'));
    questionQuery.descending('questionNr');
    questionQuery.first({
        success: function(question){
            question.save(null, {
                success: function(question){
                    question.set('answer',answer);
                    question.save();
                    increaseRoundNr(localStorage.getItem('gameId'));
                    document.getElementById('answerDiv').style.visibility = "hidden";
                    $("div#gameBoard").html('<font color="red">' + ANSWER_SUCCESSFULL);
                }
            });
            
        },
        error: function(error){
            alert(error.description);   
        }
    });
}

function increaseRoundNr(gameId){
    var Game = Parse.Object.extend('Game');
    var gameQuery = new Parse.Query(Game);
    gameQuery.equalTo('objectId',gameId);
    gameQuery.first({
        success: function(game){
            game.save(null, {
                success: function(updatedGame){
                    updatedGame.set('currentRound', game.get('currentRound') +1);
                    updatedGame.set('isUser1sTurn', false);
                    updatedGame.save();
             }
            });   
        }
    });
}

function printAnswerLog(){
    var user1, user2;
    if(localStorage.getItem('isUser1') == "true"){
        user1 = getCurrentUser();
        user2 = localStorage.getItem('opponent');
    }
    else{
        user1 = localStorage.getItem('opponent');
        user2 = getCurrentUser();
    }
    var Game = Parse.Object.extend('Game');
    var gameQuery = new Parse.Query(Game);
    gameQuery.equalTo('user1',user1);
    gameQuery.equalTo('user2',user2);
    gameQuery.first({
        success: function(game){
            var Question = Parse.Object.extend('Question');
            var questionQuery = new Parse.Query(Question);
            var answerlogStr = '';
            questionQuery.equalTo('game',game.id);
            questionQuery.descending('questionNr');
            questionQuery.find({
                success: function(questions){
                    for(var i = 0; i < questions.length; i++){
                         answerlogStr += questions[i].get('questionNr')+ '. ' + questions[i].get('question') + ': ' + questions[i].get('answer')+'<br>';  
                    }
                    $("div#answerlog").html(answerlogStr);
                }
            });
        }
        
    });
}