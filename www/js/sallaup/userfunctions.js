parseInitialize();

function checkIfLoggedIn(){
	var currentUser = Parse.User.current();
	if(!currentUser){
		window.location = ('../index.html');
	}
}

function getCurrentUser(){
    var currentUser = Parse.User.current();
    return currentUser;
}

checkIfLoggedIn();