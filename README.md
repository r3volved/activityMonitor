# activityMonitor

Discord user-activity monitor

Bot will monitor the server that it's on and track the activity of all users as their activity changes.


## Usage

1. Add your token to the settings.json

2. From the command prompt, navigate to your project folder

3. From the command prompt, run `npm install`

4. Start the bot with `node app`


## Suggestions

Use of pm2 or forever is highly recommended to keep bot alive on communication errors


## Report

The bot saves all recent activity to a log.json (every 30 minutes) 

In discord, you can also run command `!!` to report activity and force-save the log

The command also allows the use of a time and time-unit modifier

Example:
`!!1d` - activity for past 1 day
`!!12h` - activity for past 12 hours