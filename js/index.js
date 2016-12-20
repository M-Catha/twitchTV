// Initial set of users (global)
var users = ["ESL_SC2", "MedryBW", "freecodecamp"];

// TwitchTV API Call
function getTwitch() {
	
	// Remove previous elements
	$(".userBlockOn").remove();
	$(".userBlockOff").remove();

	// Iterate over user array to get individual stream
	users.forEach(function(user) {
		
		$.ajax({
			method: "GET",
			url:"https://wind-bow.gomix.me/twitch-api/streams/" + user,
			dataType:"jsonp",
			success: function(json) {
				
				// Check if user is streaming
				var isOnline = json.stream;

				if (isOnline === null) {  // If not streaming, pull channel data
					$.ajax({
						method: "GET",
						url: "https://wind-bow.gomix.me/twitch-api/channels/" + user,
						dataType:"jsonp",
						success: function(json) {
							
							var error = json.error;
							var errorMessage = json.message;

							if (error) {  // If error message is returned, display error
								errorHandler("invalid_user", errorMessage);
								users.pop();
							} else {  // If error message is undefined, continue on
								
								// Get relevant data
								var dataObj = {
									blockStatus: "userBlockOff",
									imageStatus: "userImageOff",
									displayName: json.display_name,
									logo: json.logo,
									twitchURL: json.url,
									currentViewers: "",
									totalViews: "",
									followers: "",
									status: "OFFLINE"
								}

								// Pass object to buildString function
								var data = buildString(dataObj);

								$(data).appendTo(".userTable").effect("slide", 500);
							}
						},
						error: function(textStatus, errorThrown) {
							var errMessage = textStatus + ": " + errorThrown;
							errorHandler("no_JSON", errMessage);
						}
					}); // End second API call

				} else { // If currently online, pull data from stream call
						
					// Get relevant data
					var dataObj = {
						blockStatus: "userBlockOn",
						imageStatus: "userImageOn",
						displayName: json.stream.channel.display_name,
						logo: json.stream.channel.logo,
						twitchURL: json.stream.channel.url,
						currentViewers: json.stream.viewers,
						totalViews: json.stream.channel.views,
						followers: json.stream.channel.followers,
						status: json.stream.channel.status
					}

					// Pass object to buildString function
					var data = buildString(dataObj);

					$(data).appendTo(".userTable").effect("slide", 500);
				}
			},
			error: function(textStatus, errorThrown) {
				var errMessage = textStatus + ": " + errorThrown;
				errorHandler("no_JSON", errMessage);
			}
		}); // End first API call
	$("#userInput").val("");
	});	// End forEach
};

// Show/hide functions
function showAll() {
	$(".userBlockOff").effect("slide", 500);  // Show online
	$(".userBlockOn").effect("slide", 500);	  // Show offline
	$(".errorMessage").hide("fast");		  // Hide errors
}

function showOnline() {
	$(".userBlockOff").effect("drop", 500); // Hide offline
	$(".userBlockOn").effect("slide", 500); // Show online
	$(".errorMessage").hide("fast");  		// Hide errors
}

function showOffline() {
	$(".userBlockOff").effect("slide", 500); // Show offline
	$(".userBlockOn").effect("drop", 500);   // Hide online
	$(".errorMessage").hide("fast"); 	     // Hide errors
}

// Event Listeners
$(document).ready(getTwitch);
$("#showAll").on("click", showAll);
$("#showOnline").on("click", showOnline);
$("#showOffline").on("click", showOffline);
$("#findBtn").on("click", checkInput);

// Apply function to document and delegate to deleteBlock after it is created
$(document).on("click", ".deleteBlock", function() {
	
	// Grab display name from next div (userInfo) and convert to lowercase
	var entryName = $(this).next().text().toLowerCase();
	deleteEntry(entryName);

	// Hide div then remove it from DOM
	$(this).parent().effect("drop", 500, function() {
		$(this).remove();
	});

});

// Handles "enter" press on input
$("#userInput").keypress(function(event) {
	if(event.keyCode === 13) {
		$("#findBtn").trigger("click");
	}
});

// Build data string for append function
function buildString(dataObj) {

	if (dataObj.logo === null) {
		dataObj.logo = "http://i.imgur.com/4kXLLVB.png";
	}
	
	var dataString = "<div class='" + dataObj.blockStatus + "'>" + 
						"<div class='deleteBlock'>" +
							"<i class='fa fa-window-close-o fa-2x'></i>" +
						"</div>" +
						"<div class='userInfo'>" + 
							"<a target='_blank' href='" + dataObj.twitchURL + "'>" + dataObj.displayName + "</a>" +  
							"<img class='" + dataObj.imageStatus + "' src='" + dataObj.logo + "'/>" +
						"</div>" +
						"<div class='userDetails'>" +
							"<div class='ui horizontal divider header'>" +
								"<i class='fa fa-bar-chart fa-2x'></i>" +
								"<span class='statText'> Stats</span>" +
							"</div>" +
							"<div class='statsDiv'>" +
								"<div class='currentViewers'><span class='caption'>Current Viewers: </span> " + dataObj.currentViewers + "</div>" +
								"<div class='totalViews'><span class='caption'>Total Views: </span>" + dataObj.totalViews + "</div>" +
								"<div class='followers'><span class='caption'>Current Followers: </span>" + dataObj.followers + "</div>" +
								"<div class='status'><span class='caption'>Current Stream: </span><a target='_blank' href='" + dataObj.twitchURL +  "'>" +
								dataObj.status + "</a></div>" +
							"</div>" +
						"</div>" +
					"</div>";

	return dataString;
}

// Convert users to lowercase (for matchine)
function usersToLowerCase() {

	// Grab global array users
	var formatUsers = users;
	
	// Convert array to lower case for matching
	for (var i = 0, len = formatUsers.length; i < len; i++) {
		formatUsers[i] = formatUsers[i].toLowerCase();
	}

	return formatUsers;
}

// Error check on input
function checkInput() {

	$(".errorMessage").hide("fast");
	var input = $("#userInput").val();
	var lowerCaseInput = input.toLowerCase();
	
	var lowerCaseUsers = usersToLowerCase();
	var indexInArray = lowerCaseUsers.indexOf(lowerCaseInput);

	// Check input for blanks or same entry
	if (input === "") {
		errorHandler("no_user", "");
	} else if (indexInArray !== -1) {
		errorHandler("same_user", input);
	} else {
		users.push(input);
	}

	getTwitch();
}

// Delete entries from array
function deleteEntry(entry) {

	var lowerCaseUsers = usersToLowerCase();

	var indexInArray = lowerCaseUsers.indexOf(entry);

	if (indexInArray !== -1) {
		users.splice(indexInArray,1);
	}
}

// Error handler 
function errorHandler(err, err_text) {

	$(".errorMessage").show("fast");
	var message = "";

	if (err === "same_user") {
		message = err_text + " has already been added to the list!";
		$(".errorText").text(message);
	} else if (err === "no_user") {
		message = "You didn't submit a user!";
		$(".errorText").text(message);
	} else if (err === "invalid_user") {
		message = "Not a valid user!";
		$(".errorText").text(message);
	 } else if (err === "no_JSON") {
		$(".errorText").text(err_text);
	}
}