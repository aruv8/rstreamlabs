/**
 * Creates global object for the website
 */
function GlobalObject() { 		//Object constructor
    
    var xthis = this,  			 
        name_and_ava = [], 		//global array of logged-in username and avatar link for greetings form
        database = [],			//global array of objects with received from server database		
        dblen,					//database length
        $log_user,				//user login
		$log_pass,				//user_password
		$h_greet,				//header greetings div
    	$h_login,				//header login div
    	$h_greetings_text,		//all "p" inside header greetings div
    	$h_gretings_ava,		//avatar image in container in header greetings div
    	$allPages,				//all divs with hidden class
    	$displayarea,			//div for user list in main
    	$new_user,				//new user name in registration input
        $new_pass,				//new password in registration input
        $new_avalink,			//new avatar in registration input
        $loading;				//loading indicator (div)

	/**
	 * Catches AJAX loading (response from server)
	 */
	this.AJAXloading = function() {
		$(document).ajaxStart(function () {
	    	$loading.show();
	  	})
	  	$(document).ajaxStop(function () {
	    	$loading.hide();
	  	});
	};

	/**
	 * The very first initializations
	 */
	this.initialization = function() {
	    $(function() { 				//same as $(document).ready(function()
			$loading = $("#loading_message_outerdiv");
			$log_user = $("input[name = 'uname']");			
			$log_pass = $("input[name = 'psw']");				
			$h_greet = $('#header_greetings');					
        	$h_login = $("#header_login");						
        	$h_greetings_text = $("p","#header_greetings");	
        	$h_gretings_ava = $("img", "#greetings_image_c");	
        	$allPages = $('.website-page');					
        	$displayarea = $("#user_list");					
        	$new_user = $("input[name='newuname']");			
            $new_pass = $("input[name='newpsw']");				
            $new_avalink = $("input[name='avatarURL']");		
			
			xthis.addEventHandlers();	//catching #
			xthis.render();				//render #
			xthis.AJAXloading();
	    });
	};

	/**
	* Routes between menu (li) pages
	* Param {} event
	*/
	this.route = function(event) {
		var $li = $(event.target),
			page = $li.attr('page'),
			url = window.location.href,
			cleanUrl = url.split('#')[0];

		window.location.href = cleanUrl + '#' + page;
		
		if (page == 3) { 								//Page 3 = user list
			xthis.generate_userlist_form();
		}
		xthis.render();
	};
	
	/**
	* Displays appropriate # pages
	*/
	this.render = function() {
		var url = window.location.href,
			page = url.split('#')[1],
		
		page = page || 1; //if page doesn't exist it becomes 1st page
		$allPages.hide();
		$('#page' + page).show();
	};
	
	/**
	* Detects clicks on menu
	*/
	this.addEventHandlers = function() {
		$('li','#mainmenu').on("click", xthis.route);
	};
		
	/**
     * Changes greetings according to user from database
     */
    this.change_greetings_data = function() {      
        $h_greetings_text.text("Welcome, " + name_and_ava[0] + "!"); 
        $h_gretings_ava.attr({src: name_and_ava[1], height: 82});   //changes image source and set height to 82px (width adjusts automatically by browser)
    };

    /**
     * Switches between Login and Greetings forms
     * @param   {string} LG 	- what type of form should be displayed: login or greetings. 
     */
    this.switch_to_form_LG = function(LG) {
        switch (LG) {
            case "login":
                $h_greet.hide();
                $h_login.show();
                break;
            case "greetings":
                $h_login.hide();
                $h_greet.show();
                break;
        }
    };

    /**
     * Logges out by deleting data from name_and_ava array, + switches to login form
     */
    this.logout = function() { 																
        name_and_ava = [];
        xthis.switch_to_form_LG("login");
        $log_user.val("");
        $log_pass.val(""); 													 
    };

	/**
	 * Checks username & password in the server's database
	 */
	this.login = function () {
		var p_ajax,
			parsed_data,
			user = $log_user.val(),
			pass = $log_pass.val();
			
		if (user && pass) {
			p_ajax = $.ajax({
				url: '/login',
				data: {name: user, password: pass},
				method: 'get' 
			});
		} else {
			alert("Empty field detected");
			return;
		}
		
		p_ajax.done(function(data) {
			if (data.status == "ok") {
				name_and_ava.push(data.data.name, data.data.ava); //string format
				xthis.change_greetings_data();
                xthis.switch_to_form_LG("greetings"); 
			} else {
				alert ("Incorrect username or password");
			}
		});
	};

	/**
     * Reads Users and Avatarts from database, and displays all of them in form inside of #main. Tiles or list.
     * @param   --
     * @returns --
     */
    this.generate_userlist_form = function() {                                               
        if (name_and_ava.length == 0) {
        	alert("You must be logged in to access this function");
        	return;
        }

        var p2_ajax;

        p2_ajax = $.ajax({
				url: '/all',
				method: 'get' 
			});
        
        $displayarea.empty();  //clears area from previous list

        p2_ajax.done(function(data2) {
			if (data2) {
				database = data2;
				dblen = database.length;
				xthis.display_userlist();
			} else {
				alert ("No data"); //shouldn't receive that message as database on server is not empty
			}
		});
    };

    /**
     * Displays user's tiles with names and avatars
     */
    this.display_userlist = function() {                                                    
	    var $outerdiv,                  //variable for creating new outer div for tiles or list 
	        $div,                       //variable for creating new divs in a cycle
	        $uname_div,                 //new <div> elemets for user's names
	        $uname,                     //new <p> elemets with user's names
	        $uavadiv,                   //new <div> containers for <img> elements (user avatars)
	        /*$uava_text_div,*/             //new <div> containers for user avatar links (text) 
	        $uava,                      //new <img> elements with user's pictures
	        /*$uavatext,*/                  //links for avatars (text)
	        $h2;                        //new <h2> element with headline
	        //$span;						//new spans for user name backgrounds

	    if (dblen != 0) {                                                                   //if database exists and not empty
	        $h2 = $("<h2>").text('List of all users in database').appendTo($displayarea);
	        $outerdiv = $("<div>", {"id": "outer_div_for_user_list"}).appendTo($displayarea);//a wrapper for future tiles or list of users
	        for (i = 0; i < dblen; i++) {                                                   //"i" variable was declared earlier, in other function, so can be used
	            $div = $("<div>", {"class": "user_tiles_divs"}).appendTo($outerdiv);        //creates new divs in outerdiv area (main container for users inside a form)
	            $uavadiv = $("<div>", {"class": "img_containers_inside_user_tiles_divs"}).appendTo($div); //creates img containers
	            $uava = $("<img>").attr("src", database[i].avatar).appendTo($uavadiv);      //inserts avatars inside image containers
	            //$uname_div = $("<div>", {"class": "user_name_divs"}).appendTo($div);
	            //$span = $("<span>").appendTo($uname_div);									
	            $uname = $("<p>").text(database[i].name).appendTo($div);           			//inserts user names
	    	}
	    } else {                                                                            //database is empty
	        $h2 = $("<h2>").text('Sorry, database is empty...').appendTo($displayarea);
	    }
    };

    /**
     * Sends new username and new password to server for registration check
     */
    this.register = function() { 	//called from the Register button
        var name_value = $new_user.val(), 												//gets values from input elements
            psw_value = $new_pass.val(),
            alink_value = $new_avalink.val(),
            p3_ajax; 

        if (!(name_value) || (!(psw_value)) || (!(alink_value))) { 							
            alert("Please, fill all the fields. Username, Password, and Avatar can't be empty.");
            return;
        }
        if (psw_value.length < 6) { 														
            alert("Password should be at least 6 symbols");
            return; 
        }
        p3_ajax = $.ajax({
				url: '/register',
				data: {name: name_value, password: psw_value, avatar: alink_value},
				method: 'get' 
			});
        p3_ajax.done(function(data) {
        	if (data.status == "ok") { //there's no such user in database
        		alert ("You've been successfully registered");
        		name_and_ava.push(name_value, alink_value);
        		xthis.change_greetings_data();
        		xthis.switch_to_form_LG("greetings");
        	} else {
        		alert ("This username is already registered");
        	}
        });
    };


	this.initialization();
}

var website = new GlobalObject();
