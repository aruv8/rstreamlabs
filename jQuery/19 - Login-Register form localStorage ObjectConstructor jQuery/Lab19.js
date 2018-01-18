/**
 * Creates global object where all the global variables are stored
 * @param   --
 * @returns --
 */
function GlobalObject(){  //Object constructor
	this.database = [];   //global database (array of objects in the future), currently is an empty array
	this.shouldregister = false; //global flag if I should register
	this.lastlogin = -1;  //who was logged-in during the last time, currently defined as -1 which means "there was no login". Actually, exactly number here doesn't matter as the main idea here is to define a number variable;
}
var website = new GlobalObject(); //creating a new global object with global variables

/**
 * Differentiates the code which should be loaded after the whole document loaded
 * @param   --
 * @returns --
 */
website.init = function() {
	var xthis = this; //trick to use a special (this) in the code which should be executed after the whole document loaded
	/**
	 * Checks if database with logins & passwords exists in localStorage, if empty, + reading last login information if any
	 * @param   --
	 * @returns --
	 */
	$(function() { //here is the code which runs only after the whole document loaded
		if(!(localStorage.lab19_database)){   //if such localStorage doesn't exist
			localStorage.lab19_database="[]"; //creating empty "array" (string format) in localStorage
			localStorage.lab19_lastlogin="";  //creating empty string in localstore for the last login; database array's index [i] is stored if not empty. Here, the base is empry or doesn't exist, so I have to create empty localstore lastlogin
		}
		else{ //localstorage's database exists but could be empty
			if (localStorage.lab19_database!="[]"){ //if localstore isn't empty (at least one login+password)
				xthis.database=JSON.parse(localStorage.lab19_database); //getting logins+passwords from localstore to global variable ||this.database
			}	
			if(localStorage.lab19_lastlogin){ //there was no successfull log in before, or user didn't wish to remember it
				xthis.lastlogin = JSON.parse(localStorage.lab19_lastlogin); //saving the database array's index [i] (in number format) to the global variable
				switch_to_form_LRG(0,0,1); //switching to greetings form
				$("#header_greetings_and_logout > p").text("Welcome, " + xthis.database[xthis.lastlogin].correct_uname);//changing text in the greetings form
			}
		}
	});
}

/**
 * Switches between Login, Registration, and Greetings forms
 * @param   {boolean} login 		- if should display the login form
 * @param   {boolean} registration 	- if should display the registration form
 * @param   {boolean} greetings 	- if should display the greetings form
 * @returns --
 */
function switch_to_form_LRG(login, registration, greetings){
	if(login){
		$("#header_registration").hide();
		$('#header_greetings_and_logout').hide();
		$("#header_login").show();
		return; //ejecting from the function
	}
	if(registration){
		$("#header_registration").show();
		$("#header_login").hide();
		$('#header_greetings_and_logout').hide();
		return;
	}
	if(greetings){
		$("#header_registration").hide();
		$("#header_login").hide();
		$('#header_greetings_and_logout').show();
		return;
	}
}

/**
 * Logges out by "reseting" particular global object parameters, + switches to login form
 * @param   --
 * @returns --
 */
website.logout = function(){ //called from the logout button
	this.lastlogin = -1; //emptying global variable
	localStorage.lab19_lastlogin = ""; //emptying localstorage last login information
	switch_to_form_LRG(1,0,0); //going back to login 
}

/**
 * Checks username and password and alerts result message + stores last login username and password
 * @param   --
 * @returns --
 */
website.check_login = function() { //called by Login button
var user = $("input[name='uname']"), //binding variable to specific input element
	pass = $("input[name='psw']"),   //binding variable to specific input element
	rememberme = $("#checkbox_lastlogin"),//binding variable to specific checkbox (if should remember last login), On and Off values
	msg = "Incorrect Username or Password", //default message
	name_value = user.val(),		 //getting data from specific input element
	psw_value = pass.val();			 //getting data from specific input element

	if ((name_value == "")||(psw_value == "")){ //check for empty fields
		alert ("Please, fill all the fields. Username or Password can't be empty.");
		return; //ejecting from the function
	}
	if (this.database){ //if database is not empty
		for (var i = 0; i < this.database.length; i++){ // looking for username and password from inputs in our database (global variable)
			if ((name_value==this.database[i].correct_uname) && (psw_value==this.database[i].correct_psw)){ //if username and password correct (match a database)
			 	this.lastlogin = i; //saving an array's index [i] (a number) for the information who was logged in
			 	if((rememberme.is(':checked')==true)){//if user wished to be remembered
					localStorage.lab19_lastlogin=JSON.stringify(this.lastlogin); //saving the index from the previous line into the localstore
			 	}
			 	$("#header_greetings_and_logout > p").text("Welcome, " + this.database[this.lastlogin].correct_uname);//changing text in the Greetings form
			 	switch_to_form_LRG(0,0,1); //switching to greetings form
			 	msg="Correct!";
			 	break; //getting out of the cycle
			}
		}
		if(msg!="Correct!"){//username or/and password doesn't match a database
				alert(msg); //alerting default Incorrect message
				return; //getting out of the function
		}
	}
}

/**
 * Registers new username and new password, + saves them to localStorage
 * @param   --
 * @returns --
 */
website.register = function(){ //called from the Register button
var user = $("input[name='newuname']"), //binding variable to specific input element
	pass = $("input[name='newpsw']"),   //binding variable to specific input element
	name_value = user.val(), 			//getting data from specific input element
	psw_value = pass.val();				//getting data from specific input element
	
	if (!(name_value)||(!(psw_value))){ //checking if emtpy data in input fields
		alert ("Please, fill all the fields. Username or Password can't be empty.");
		return; //ejecting from the function
	}
	if (psw_value.length < 6){ // check if password is 6+ symbols
		alert("Password should be at least 6 symbols");
		return; //ejecting from the function
	}
	if (this.database){ //database isn't empty
		for (var i = 0; i < this.database.length; i++){// matching and comparing entered username+pass with current database (global array)
			if (name_value==this.database[i].correct_uname){
			 	alert ("You already registered!");
			 	return; //ejecting from the function
			}
			else{
				this.shouldregister = true; //the only condition for non-empty database when everything is ok, and we can register
				break; //ejecting from "for" cycle
			}
		} 
	}
	if (this.database!=[]){ //database exists but empty
		this.shouldregister = true; //still have to register in the emptu database
	}		
	if (this.shouldregister==true){ // adding new user and new pass in database (both, global variable and localstorage)
		alert("I'm adding you to database!");
		this.database.push({correct_uname:name_value, correct_psw:psw_value}); //adding new user+pass into array of objects
		localStorage.lab19_database=JSON.stringify(this.database); //writing data from the array of objects into localstore (string format only)
		this.shouldregister = false;
		switch_to_form_LRG(1,0,0);//switching to login form
	}
}

website.init(); //calling the init function at the very end of the js code
























/*function initial_check_and_lastlogin_read(){ //called at the end of the js code, see down below
	if(!(localStorage.lab19_database)){   //if such localStorage doesn't exist
		localStorage.lab19_database="[]"; //creating empty "array" (string format) in localStorage
		localStorage.lab19_lastlogin="";  //creating empty string in localstore for the last login; database array's index [i] is stored if not empty. Here, the base is empry or doesn't exist, so I have to create empty localstore lastlogin
	}
	else{ //localstorage's database exists but could be empty
		if (localStorage.lab19_database!="[]"){ //if localstore isn't empty (at least one login+password)
			website.database=JSON.parse(localStorage.lab19_database); //getting logins+passwords from localstore to global variable ||this.database
		}	
		if(localStorage.lab19_lastlogin){ //there was no successfull log in before, or user didn't wish to remember it
				website.lastlogin = JSON.parse(localStorage.lab19_lastlogin); //saving the database array's index [i] (in number format) to the global variable
				switch_to_form_LRG(0,0,1); //switching to greetings form
				$("#header_greetings_and_logout > p").text("Welcome, " + website.database[website.lastlogin].correct_uname);//changing text in the greetings form
				alert("I should be switched to the greetings form. Error, if you can't see it.");
		}
	}
}*/


//------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------
/*$(function() { // same as:   $(document).ready(function() {     Everything inside runs only after content is loaded.
	if(!(localStorage.lab19_database)){ //if such localstorage doesn't exist
		localStorage.lab19_database="[]"; //creating empty "array" (string format) in localstore
		localStorage.lab19_lastlogin="";   //creating empty string in localstore for the last login; database array's index [i] is stored if not empty. Here, the base is empry or doesn't exist, so I have to create empty localstore lastlogin
	}
	else{ //localstorage's database exists but could be empty
		if (localStorage.lab19_database!="[]"){ //if localstore isn't empty (at least one login+password)
			database=JSON.parse(localStorage.lab19_database); //getting logins+passwords from localstore to global variable ||this.database
		}	
		if(localStorage.lab19_lastlogin){ //there was no successfull log in before, or user didn't wish to remember it
				lastlogin = JSON.parse(localStorage.lab19_lastlogin); //saving the database array's index [i] (in number format) to the global variable
				switch_to_form(0,0,1); //switching to greetings form
				$("#header_greetings_and_logout > p").text("Welcome, " + database[lastlogin].correct_uname);//changing text in the first paragraph of the Header
		}
	}
});*/



/*//should get rid of these
var shouldregister=false, //global flag if I should register
 	database=[], //global database (array of objects), currently empty
 	lastlogin=-1;//who was logged-in during the last time, currently defined as -1 which means "there was no login". Actually, exactly number here doesn't matter as the main idea here is to define a number variable;*/


/*website.init = function() { //
	//this.database;
	var xthis = this;
	console.log('this 1', this);
	$(function() { //here is the code which runs only after the whole document loaded
		//xthis.database.push(); //
		console.log('this 2', this);//returning *document which is for the demonstration and incorrect
		console.log('xthis', xthis);
	});
};*/

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+  Database   													  +
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	








// website.reg = function() {
// 	//
// 	// ............
// 	this.saveLS();
// };

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+  Forms      													  +
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//------------------------------
//Switching to registration form
//------------------------------
/*function switch2registration() {
	$("#header_login").hide();
	$('#header_greetings_and_logout').hide();
	$("#header_registration").show();
}

//-----------------------
//Switching to login form
//-----------------------
function switch2login() {
	$("#header_registration").hide();
	$('#header_greetings_and_logout').hide();
	$("#header_login").show();
}

//---------------------------
//Switching to greetings form
//---------------------------
function switch2greetings() {
	$("#header_registration").hide();
	$("#header_login").hide();
	$('#header_greetings_and_logout').show();
}*/



/*website.init(); *///should be at the end to play a specific role if (this) are called inside the global object's functions