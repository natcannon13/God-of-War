# God of War

A Discord bot for organizing and planning Root games in your server.

###### 

#### First Time Setup:

Add the bot to your server. Make sure the bot has the following permissions:

* Embed Links
* Send Messages
* Send Messages in Threads
* Use External Emojis
* Use Slash Commands
* View Channels



The bot will need to be configured before it can be used. A server administrator does so with

###### ```/config [outputchannel] [modrole] [videochannel]```

This configures the bot to recognize the moderator role, as well as (coming soon) the channels where it outputs game scheduling results, and posts videos.

The configuration can be changed later via the same command, and can be viewed by administrators using

###### ```/viewconfig```

#### Bot Features

##### Scheduling Commands

###### ```/schedule [timestamp] [player1] [player2] [player3] [player4] [player5 (optional)]```

* Adds a game to the schedule between the specified players at the specified time.
* Only usable by moderators and participants (i.e. only moderators may schedule games for another group).
* Assigns an ID to the game. If the game is scheduled within a thread, this will be the title of the thread. Otherwise, it will be a random six-character sequence.
* Checks for duplicates to make sure the same game is not already scheduled, and makes sure that only one game is scheduled per thread.

###### ```/lookup [id]```

* Displays information about the specified match. ID, time, players.

###### ```/myschedule```

* Displays all upcoming matches in which the user is participating.



##### Schedule Modification Commands

###### ```/reschedule [id] [timestamp]```

* Reschedules the specified game to the new timestamp specified.
* Only usable by moderators and participants.

###### ```/cancel [id]```

* Removes the specified game from the schedule.
* Only usable by moderators and participants.

###### ```/substitute [id] [oldplayer] [newplayer]```

* Replaces a player in the specified game with another player.
* Only usable by moderators.



##### Reminders:

One hour before a game, the bot will automatically remind the players of their game. It sends a message pinging them in the channel or thread where the game was scheduled. It also generates a draft and seat order to be used for Advanced Setup.



##### Other Features:

###### ```/draft [playercount]```

* Generates a faction draft for an Advanced Setup game.
* playercount may be either 4 or 5.

