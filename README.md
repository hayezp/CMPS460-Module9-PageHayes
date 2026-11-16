# Module 9 - NFL Teams and Players App

## What I Made

For this assignment, I made an NFL app where people can look through different teams and find the information they're looking for without having to search through a whole bunch of things. I wanted someone to be able to pick their favorite teams, see some of their players, and have everything in one place that is easy to use.

## What You Can Do in the App

- Look through 10 NFL teams and see their city and conference.
- Pick a team to see two players, their positions, and jersey numbers.
- Search for a team by typing its name or city.
- See a message if the team you're looking for isn't found.
- Add or remove teams from your favorites.
- Close the app and come back without losing your saved teams.

## How to Open the App

1. Make sure Node.js and an Android emulator are installed.
2. Open the `NFLTeamsApp` folder in VS Code.
3. Open the terminal and type:

   ```bash
   npm install
   ```

4. When that finishes, type:

   ```bash
   npx expo start --localhost
   ```

5. Press `a` in the terminal to open the app in the Android emulator.

## How I Added the Teams and Players

I used a local JSON file called `data/teams.json` to hold all of the information for the teams and players. I decided to go this route and use this instead of an API because I wanted people to still be able to look through all of the teams even if they didn't have internet service. The information is already saved in the app, but it won't update automatically like it would with an API.

## Screenshots

### NFL Team List

![NFL Team List](screenshots/Team%20List.png)

### Players for a Team

![Player Details](screenshots/player%20details.png)

### Saved Teams and Search

![Favorites and Search](screenshots/Favorites%20search.png)

## What I Learned From Making This App

For this assignment, I wanted to make an NFL app where someone could open it and quickly find what they were looking for. I added a list of teams, a search bar, player information, and a place where people can save their favorite teams.

I used state to keep track of what someone was typing into the search bar, which team they picked, and which teams they saved. This way, the app knows what information to show depending on what someone is doing.

I used a local JSON file for the team and player information instead of an API. I thought this would work well because the information is already in the app, so someone can still look through the teams even if they don't have internet service.

I also used AsyncStorage to remember which teams someone picked as their favorites. This way, they wouldn't have to go through and pick them all over again every time they opened the app. I tested this by closing and reopening the app to make sure everything was still saved.

If I wanted to use a live API, I would need to use `fetch()` to get updated information. I would also add loading and error messages so people would know if something wasn't working correctly. Overall, I wanted the app to be simple, easy to use, and still work without internet service.

## Help I Used

I did use AI (ChatGpt) when I was having trouble getting the app to open in my Android emulator. At first, it kept showing an error multiple times instead of opening the new NFL app. I did try and restart Expo and changed the connection settings before I used help but it was still giving me an error, so I went to AI help to finally help me to get it working with the localhost connection. I did test everything in the emulator to make sure it worked.