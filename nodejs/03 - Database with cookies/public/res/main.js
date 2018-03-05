var website = new WebsiteObject();

/**
 * Creates global object for the website
 *
 * {Constructor}
 */
function WebsiteObject() {
    
    var xthis = this,  			 
        current_logged_user_and_ava = [], 
        database = [],			// Objects with received from server database		
        dbLength,				
        $user_login,			
		$user_pass,				
		$header_greetings_container,
    	$header_login_container,
    	$header_greetings_container_text,
    	$header_greetings_avatar,
    	$all_pages,				// All divs with hidden class. For hash navigation.
    	$user_list_in_main,		
    	$new_user,				
        $new_pass,				
        $new_link_to_avatar,	
        $loading_animation_container;	// (AJAX)

	/**
	 * The very first initializations
	 */
	this.initialization = function() {
	    $(function() { 				
			$loading_animation_container = $("#loading_message_outerdiv");
			$user_login = $("input[name = 'uname']");			
			$user_pass = $("input[name = 'psw']");				
			$header_greetings_container = $('#header_greetings');					
        	$header_login_container = $("#header_login");						
        	$header_greetings_container_text = $("p","#header_greetings");	
        	$header_greetings_avatar = $("img", "#greetings_image_c");	
        	$all_pages = $(".navigation_hash_page");					
        	$user_list_in_main = $("#user_list");					
        	$new_user = $("input[name='newuname']");			
            $new_pass = $("input[name='newpsw']");				
            $new_link_to_avatar = $("input[name='avatarURL']");		
			
			xthis.addEventHandlers();	//catching #
			xthis.render();				//render #
			xthis.AJAXloading();
	    });
	};

	/**
	* Routes between menu (li) pages
	* @param {} event
	*/
	this.route = function(event) {
		var $li = $(event.target),
			page = $li.attr('page'),
			url = window.location.href,
			cleanUrl = url.split('#')[0];

		window.location.href = cleanUrl + '#' + page;
		xthis.render();
	};
	
	/**
	* Displays appropriate # pages
	*/
	this.render = function() {
		var url = window.location.href,
			page = url.split('#')[1],
		
		page = page || 1; //if page doesn't exist it becomes 1st page
		$all_pages.hide();
		$('#page' + page).show();

		// If user is logged in and userlist is requested
		if (page == 3) {
			xthis.generate_userlist_form();
		}
	};
	
	/**
     * Reads Users and Avatarts from database, and displays all of them in form inside of #main. Tiles or list.
     * @param   --
     * @returns --
     */
    this.generate_userlist_form = function() {                                               
        var $userlist,
        	p_ajax

        if (current_logged_user_and_ava.length == 0) {
        	$userlist = $("#user_list").
							        	css({"text-align":"center", "font-size":"20px"}).
							        	text("Please log in to access user list.");
        	return;
        }

        p_ajax = $.ajax({
				url: '/all',
				method: 'get' 
			});
        
        $user_list_in_main.empty();  //clears area from previous list

        p_ajax.done(function(data) {
			if (data) {
				database = data;
				dbLength = database.length;
				xthis.display_userlist();
			} else {
				alert ("No data"); //shouldn't receive that message as database on server is not empty
			}
		});
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
        $header_greetings_container_text.text("Welcome, " + current_logged_user_and_ava[0] + "!"); 
        $header_greetings_avatar.attr({src: current_logged_user_and_ava[1], height: 82});   //changes image source and set height to 82px (width adjusts automatically by browser)
    };

    /**
     * Switches between Login and Greetings forms
     * @param   {string} LG 	- what type of form should be displayed: login or greetings. 
     */
    this.switch_to_form_LG = function(LG) {
        switch (LG) {
            case "login":
                $header_greetings_container.hide();
                $header_login_container.show();
                break;
            case "greetings":
                $header_login_container.hide();
                $header_greetings_container.show();
                break;
        }
    };

    /**
     * Logges out by deleting data from current_logged_user_and_ava array, + switches to login form
     */
    this.logout = function() { 																
        current_logged_user_and_ava = [];
        xthis.switch_to_form_LG("login");
        $user_login.val("");
        $user_pass.val("");
        xthis.delete_cookie(); 													 
    };

    /**
     * Saves/appends data to cookies
     * 
     * @param {string} usr 	User name.
     * @param {string} hsh 	Hash.
     */
    this.save_cookie = function(usr, hsh) {     
    	document.cookie = "user=" + usr;
    	document.cookie = "hash=" + hsh;
    }

    /**
     * Deletes user and hash from cookies
     * 
     */
    this.delete_cookie = function() {     
    	document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    	document.cookie = "hash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
	
    /**
     * Displays user's tiles with names and avatars
     */
    this.display_userlist = function() {                                                    
	    var $outerdiv,                  //variable for creating new outer div for tiles or list 
	        $div,                       //variable for creating new divs in a cycle
	        $uname_div,                 //new <div> elemets for user's names
	        $uname,                     //new <p> elemets with user's names
	        $uavadiv,                   //new <div> containers for <img> elements (user avatars)
	        $uava,                      //new <img> elements with user's pictures
	        $h2;                        //new <h2> element with headline

	    if (dbLength != 0) {                                                                   //if database exists and not empty
	        $h2 = $("<h2>").text('List of all users in database').appendTo($user_list_in_main);
	        $outerdiv = $("<div>", {"id": "outer_div_for_user_list"}).appendTo($user_list_in_main);//a wrapper for future tiles or list of users
	        for (i = 0; i < dbLength; i++) {                                                   //"i" variable was declared earlier, in other function, so can be used
	            $div = $("<div>", {"class": "user_tiles_divs"}).appendTo($outerdiv);        //creates new divs in outerdiv area (main container for users inside a form)
	            $uavadiv = $("<div>", {"class": "img_containers_inside_user_tiles_divs"}).appendTo($div); //creates img containers
	            $uava = $("<img>").attr("src", database[i].avatar).appendTo($uavadiv);      //inserts avatars inside image containers
	            $uname = $("<p>").text(database[i].name).appendTo($div);           			//inserts user names
	    	}
	    } else {                                                                            //database is empty
	        alert("Sorry, database is empty");
	    }
    };

	/**
	 * Checks username & password in the server's database
	 */
	this.login = function () {
		var p_ajax,
			parsed_data,
			user = $user_login.val(),
			pass = $user_pass.val();
			
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
				current_logged_user_and_ava.push(data.data.name, data.data.ava); //string format
				xthis.change_greetings_data();
                xthis.switch_to_form_LG("greetings");
                xthis.save_cookie(data.data.name, data.hash); 
			} else {
				alert ("Incorrect username or password");
			}
		});
	};

    /**
     * Sends new username and new password to server for registration check
     */
    this.register = function() { 	
        var name_value = $new_user.val(), 	//gets values from input elements
            psw_value = $new_pass.val(),
            alink_value = $new_link_to_avatar.val(),
            p_ajax; 

        if (!(name_value) || (!(psw_value)) || (!(alink_value))) { 							
            alert("Please, fill all the fields. Username, Password, and Avatar can't be empty.");
            return;
        }
        if (psw_value.length < 6) { 														
            alert("Password should be at least 6 symbols");
            return; 
        }
        p_ajax = $.ajax({
				url: '/register',
				data: {name: name_value, password: psw_value, avatar: alink_value},
				method: 'get' 
			});
        p_ajax.done(function(data) {
        	if (data.status == "ok") { //there's no such user in database
        		current_logged_user_and_ava = [];
        		current_logged_user_and_ava.push(name_value, alink_value);
        		console.log(data);
        		xthis.save_cookie(data.name, data.hash);
        		xthis.change_greetings_data();
        		xthis.switch_to_form_LG("greetings");
        	} else {
        		alert ("This username is already registered");
        	}
        });
    };

    /**
	 * AJAX loading requests
	 */
	this.AJAXloading = function() {
		$(document).ajaxStart(function () {
	    	$loading_animation_container.show();
	  	})
	  	$(document).ajaxStop(function () {
	    	$loading_animation_container.hide();
	  	});
	};

	this.initialization();
};