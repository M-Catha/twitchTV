# twitchTV

A simple app using the [TwitchTV API](https://github.com/justintv/Twitch-API/blob/master/v3_resources/streams.md#get-streamschannel) that displays stats about a TwitchTV user.

The following users are displayed by default:

* MedryBW
* ESL_SC2
* freecodecamp

When the user is currently online, you can see:

* Current viewers
* Total viewers
* Current followers
* Link to current stream

If the user is offline, only OFFLINE will be displayed.  

The users can be sorted (All, Online, Offline) using the buttons at the top.  A new user can be added via the text input, and a user can be removed from the stack using the red X at the top right of each user panel.

Some error handling has been implemented to check for:
* Users already added to the list
* Users who don't exist
* Blank entries.

Live demo seen here:

[Code Pen](http://s.codepen.io/MCatha/debug/pNYPOP/)
