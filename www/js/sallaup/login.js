parseInitialize();

function checkCookie(){

	var currentUser = Parse.User.current();
	if(currentUser){
		window.location = ('pages/main.html');
	}
}

checkCookie();

$("button#submit").click( function() {
    document.getElementById("loginButton").innerHTML= LOADING_ICON;
  if( $("#username").val() == "" || $("#password").val() == "" ){
      document.getElementById("card").style.display = "block";
      document.getElementById("loginButton").innerHTML= LOGIN_STRING;
    $("div#loginmsg").html('<font color="red">' + FILL_EVERY_INPUT_STRING);
  }
	else{

		Parse.User.logIn($("#username").val(), $("#password").val(), {
		  success: function(user) {
		    window.location = ('pages/main.html');
		  },
		  error: function(user, error) {
              document.getElementById("card").style.display = "block";
              document.getElementById("loginButton").innerHTML= LOGIN_STRING;
		    $("div#loginmsg").html('<font color="red">' + LOGIN_ERROR_STRING);
		  }
		});
	}

 
	$("#loginform").submit( function() {
	   return false;	
	});
 
});


