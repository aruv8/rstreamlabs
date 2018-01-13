//Global variables
var shouldregister=false, //global flag if I should register
 	database;
	database = [{correct_uname: "aru", correct_psw: "aaaaaa"},
						{correct_uname: "vka", correct_psw: "vvvvvv"},
						{correct_uname: "den", correct_psw: "dddddd"}];
//_____________________________________________________________________

//checking username and password
function check_login() {
var user = $("input[name='uname']"),
	pass = $("input[name='psw']"),
	msg = "Incorrect Username or Password",
	name_value = user.val(),
	psw_value = pass.val();
	
	for (var i = 0; i < database.length; i++){
		// check if emtpy data
		if ((name_value == "")||(psw_value == "")){
			alert ("Please, fill all the fields. Username or Password can't be empty.");
			return; //like a break
		}
		else if ((name_value==database[i].correct_uname) && (psw_value==database[i].correct_psw)){
		 	//it's gonna happen 3 times! terrible!
		 	msg = "Correct!";
		}
	}
	alert(msg);
}
//_____________________________________________________________________

//changing from login to registration form-
function switch2registration() {
	$("#LoginContainer").hide();
	$("#RegistrationContainer").show();
}
//_____________________________________________________________________

//changing from registration to login form-->
function switch2login() {
	$("#RegistrationContainer").hide();
	$("#LoginContainer").show();
}
//_____________________________________________________________________

//registering username and password-->
function register() {
var user = $("input[name='newuname']"),
	pass = $("input[name='newpsw']"),
	name_value = user.val(),
	psw_value = pass.val();
	
	// check if emtpy data
	if ((name_value == "")||(psw_value == "")){
		alert ("Please, fill all the fields. Username or Password can't be empty.");
		shouldregister = false;
		return; //like a break
	}
	
	// check if password is 6+ symbols
	else if (psw_value.length < 6){
		alert("Password should be at least 6 symbols");
		shouldregister = false;
		return;
	}
	
	// checking username with current database
	else{
		for (var i = 0; i < database.length; i++){
			if (name_value==database[i].correct_uname){
			 	alert ("You already registered!");
			 	shouldregister = false;
			 	return;
			}
			//it's gonna happen 3 times! terrible!
			else{
				shouldregister = true;
			}
		} 	
	}
	// adding user and pass in database
	if (shouldregister==true){
		alert("I'm adding you to database!");
		database.push({correct_uname:name_value, correct_psw:psw_value});
		shouldregister = false;
	}
}
//_____________________________________________________________________