/**
 * Creates global object for the login-registration-greetings part
 * @param   --
 * @returns --
 */
function GlobalObject() { //Object constructor
    //Global variables
    var xthis = this,  			 //xthis can be declared once, in the very top of ObjectConstructor, and used through all of the code INSIDE functions in ObjectConstructor.
        database = []; 			 //global database (array of objects in the future). (this.database = []; grants potential access to the database which is against security.
    this.shouldregister = false; //global flag if I should register new user.
    this.lastlogin = -1; 		 //who was logged-in during the last time. -1 means there was no login as it can be a zero (0 index in array).

    /**
     * Separates the code which should be loaded after the whole document loaded
     * @param   --
     * @returns --
     */
    this.init = function() {
        $(function() { 				//same as $(document).ready(function()
            xthis.database_check(); //put here the code which should run only after the whole document loaded
        });
    };

    /**
     * Saves the data from the global variables inside global Object to the localStorage, and converts the data to string if it's not one
     * @param   {string} 	- where exactly to save the data
     * @param   {any type} 	- what data exactly to save
     * @returns --
     */
    this.saveLS = function(where_to_save, what_to_save) {
        var converted_to_text = "";

        if (typeof what_to_save == "string") {
            converted_to_text = what_to_save;
        } else {
            converted_to_text = JSON.stringify(what_to_save);
        }

        switch (where_to_save) {
            case "lab19_database":
                localStorage.lab19_database = converted_to_text;
                break;
            case "lab19_lastlogin":
                localStorage.lab19_lastlogin = converted_to_text;
                break;
        }
    };

    /**
     * Loads the data from the localStorage to global variables inside the global Object
     * @param   {where_to_load_from} 	- where exactly the data should be loaded from 
     * @returns --
     */
    this.loadLS = function(where_to_load_from) {
        switch (where_to_load_from) {
            case "lab19_database":
                if (localStorage.lab19_database) {		//if database exists and not empty
                	database = JSON.parse(localStorage.lab19_database);
                };
                break;
            case "lab19_lastlogin":
                var v = localStorage.lab19_lastlogin;
                if ((v !== undefined) && (v !== "")) {	//if data exists and not empty. Can be a zero, so can't use --if(v){...}--
                    xthis.lastlogin = v;
                };
                break;
        }
    };

    /**
     * Changes greetings according to user from database
     * @param   --
     * @returns --
     */
    this.change_greetings_data = function() {      
        $("#header_greetings_and_logout > p").text("Welcome, " + database[xthis.lastlogin].correct_uname); //changing text in the greetings form
        $("#greetings_image_in_header > img").attr({src: database[xthis.lastlogin].avatar, height: 85});   //changes image source and set height to 85px (width adjusts automatically by browser)
    }
    
    /**
     * Checks if database and lastlogin info exist in global variables, and saves it into localStorage
     * @param   --
     * @returns --
     */
    this.database_check = function() { 				//called after whole document loaded
        xthis.loadLS("lab19_database");				//reads database from localStorage
        xthis.loadLS("lab19_lastlogin");			//reads info (index of array) about last login
        
        if (database.length == 0) { 				//if localStorage.lab19_database doesn't exist
            xthis.saveLS("lab19_database", "[]"); 	//creates an empty "array" in string format in localStorage
            xthis.saveLS("lab19_lastlogin", ""); 	//creates an empty string in localstore for the last login; database array's index [i] is stored if not empty. Here, the base is empty or doesn't exist, so I have to create empty localstore lastlogin
        } 
        else { 										//database exists in localStorage
            if (xthis.lastlogin > -1) { 			//if there's an information about last login (exists and not empty). Warning!!! Can't use -if(localStorage.lab19_lastlogin)- because there could be a zero!
                xthis.switch_to_form_LRGU("greetings"); 
                xthis.change_greetings_data();            //personalizes greetings
                return;
            }
        }
        xthis.switch_to_form_LRGU("login");
    };

    /**
     * Switches between Login, Registration, and Greetings forms
     * @param   {string} LRGU 	- what type of form should be displayed: login, registration, greetings, users list. 
     * @returns --
     */
    this.switch_to_form_LRGU = function(LRGU) {
        switch (LRGU) {
            case "login":
                $("#registration_form").hide();
                $('#header_greetings_and_logout').hide();
                $("#header_login_form").show();
                break;
            case "registration":
                $("#registration_form").show();
                $("#header_login_form").hide();
                $('#header_greetings_and_logout').hide();
                $('#user_list').hide();
                break;
            case "greetings":
                $("#registration_form").hide();
                $("#header_login_form").hide();
                $('#header_greetings_and_logout').show();
                break;
            case "login + users":
                $("#registration_form").hide();
                $("#header_login_form").show();
                $('#header_greetings_and_logout').hide();
                $('#user_list').show();
                break;
            case "greetings + users":
                $("#registration_form").hide();
                $("#header_login_form").hide();
                $('#header_greetings_and_logout').show();
                $('#user_list').show();
                break;
        }
    };

    /**
     * Logges out by "reseting" particular global object parameters, + switches to login form
     * @param   --
     * @returns --
     */
    this.logout = function() { 																//called by logout button
        xthis.lastlogin = -1; 																//reset login info in global variable
        xthis.saveLS("lab19_lastlogin", ""); 												//reset login info in localStorage 
        xthis.switch_to_form_LRGU("login"); 													 
    };

    /**
     * Checks username and password and alerts result message + stores last login username and password
     * @param   --
     * @returns --
     */
    this.check_login = function() { 														//called by Login button
        var user = $("input[name='uname']"), 												//binds variable to input element
            pass = $("input[name='psw']"), 					
            rememberme = $("#rememberme_ckeckbox_in_header"), 								//binds variable to checkbox (remember last login), On and Off values
            msg = "Incorrect Username or Password", 										//default message
            name_value = user.val(), 														//gets value of input element
            psw_value = pass.val(); 						

        if ((name_value == "") || (psw_value == "")) { 										//checks for empty fields
            alert("Please, fill all the fields. Username or Password can't be empty.");
            return; 																		//ejects from the function
        }
        if (database) { 																	//if database is not empty
            for (var i = 0; i < database.length; i++) { 									// seeks username and password from inputs in database (global variable)
                if ((name_value == database[i].correct_uname) && (psw_value == database[i].correct_psw)) { //if username and password are correct (matches with a database)
                    xthis.lastlogin = i; 													//saves an array's index [i] (a number) - the information who was logged in
                    if ((rememberme.is(':checked') == true)) { 								//if user wished to be remembered (if checkbox checked)
                        xthis.saveLS("lab19_lastlogin", xthis.lastlogin);					//writes the index (who was logged in) into the localstore
                    }
                    
                    xthis.change_greetings_data();                                                //personalizes greetings
                    xthis.switch_to_form_LRGU("greetings"); 
                    msg = "Correct!";
                    break; 																	//ejects from the cycle
                }
            }
            if (msg != "Correct!") { 														//username or/and password doesn't match a database
                alert(msg); 																//alerting default Incorrect message
                return; 																	//ejects from the function
            }
        }
    };

    /**
     * Registers new username and new password + saves them to localStorage
     * @param   --
     * @returns --
     */
    this.register = function() { 															//called from the Register button
        var user = $("input[name='newuname']"), 											//binds variable to input element
            pass = $("input[name='newpsw']"), 												
            alink = $("input[name='avatarURL']"),
            name_value = user.val(), 														//gets value from input element
            psw_value = pass.val(),
            alink_value = alink.val(); 

        if (!(name_value) || (!(psw_value)) || (!(alink_value))) { 							//checks if input fields are empty
            alert("Please, fill all the fields. Username, Password, and Avatar can't be empty.");
            return;
        }
        if (psw_value.length < 6) { 														//checks if password is 6+ symbols
            alert("Password should be at least 6 symbols");
            return; 
        }
        if (database.length != 0) { 														//database isn't empty
            for (var i = 0; i < database.length; i++) { 									//seeks entered username+pass in the database (global array)
                if (name_value == database[i].correct_uname) {								//if user exists
                    alert("You already registered!");
                    return;
                } else {
                    xthis.shouldregister = true; 											//the only condition when everything is ok, and user can be registered
                    break;
                }
            }
        } else { 																			//database exists but empty ...(database.length == 0){... 	
            xthis.shouldregister = true; 													//changes registration flag to be able to register in the empty database
        }
        
        if (xthis.shouldregister == true) { 												//if registration flag allows to register
            alert("I'm adding you to database!");
            database.push({ correct_uname: name_value, correct_psw: psw_value, avatar: alink_value }); 			//adds new user, pass, and avatar into the local array of objects (database)
            xthis.saveLS("lab19_database", database);										//adds new user+pass into localStorage
            xthis.shouldregister = false;													//changes back registration flag after user+pass were registered
            xthis.switch_to_form_LRGU("login");
        }
    };

    /**
     * Reads Users and Avatarts from database, and displays all of them in form inside of #main
     * @param   --
     * @returns --
     */
    this.display_users_form = function() {                                                  //called by Users menu button
        var dblen = database.length,
            displayarea = $("#user_list"),                                                  //binds variable to form
            logform = $("#header_login_form"),
            greetform = $("#header_greetings_and_logout");

        if (greetform.is(":visible")) {                                                     //have to display greetings and users. ---checks for display:[none|block], ignores visible:[true|false]
            xthis.switch_to_form_LRGU("greetings + users");                                                            
        } else {                                                                            //login is visible
            xthis.switch_to_form_LRGU("login + users");
        }

        if (dbl != 0) {                                                                     //if database exists and not empty
            for (var i = 0; i < dblen; i++) {

            }
        }
    }                                                        

    this.init(); 																			//calls the init function at the very end of the js code
} //END of the GlobalObject()

var website = new GlobalObject(); 															//creates a new global object