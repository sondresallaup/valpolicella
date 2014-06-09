parseInitialize();

$("button#submit").click( function() {
    document.getElementById("okButton").innerHTML= LOADING_ICON;
  if( $("#username").val() == "" || $("#password").val() == "" || $("#repeatPassword").val() == "" || $("#name").val() == "" || $("#zip_number").val() == "" || $("#adress").val() == "" ){
      document.getElementById("okButton").innerHTML= REGISTER_STRING;
    $("div#registermsg").html('<font color="red">' + FILL_EVERY_INPUT_STRING);}

	else{

		if($("#password").val() == $("#repeatPassword").val()){
			if($("#password").val() > 5){

			var user = new Parse.User();
			user.set("username", $("#username").val());
			user.set("password", $("#password").val());
			  
			user.signUp(null, {
			  success: function(user) {
			    window.location = ('/pages/main.html');
			  },
			  error: function(user, error) {
			    // TODO: feilmelding basert på error.code
                  document.getElementById("okButton").innerHTML= REGISTER_STRING;
			    $("div#registermsg").html("Error: " + error.code + " " + error.message);
			  }
			});
                
            }
            else{
        document.getElementById("okButton").innerHTML= REGISTER_STRING;
		$("div#registermsg").html('<font color="red">' + PASSWORD_TO_SHORT_STRING);
	}

	}
	else{
        document.getElementById("okButton").innerHTML= REGISTER_STRING;
		$("div#registermsg").html('<font color="red">' + PASSWORDS_NOT_MATCH_STRING);
	}


	}

 
	$("#registerform").submit( function() {
	   return false;	
	});
 
});