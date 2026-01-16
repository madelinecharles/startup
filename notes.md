# CS 260 Notes

[My startup - Drinkly](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## Deliverable 1 Notes

It was interesting to see how a web app works together and to look at all the different services required. It's cool how Node.js lets javascript run on a server instead of the backend, and how Route 53 (AWS DNS) translates the domain name (e.g. myapp.com) into the IP address of the server. 

I hadn't used Git in the terminal very much, and I enjoyed leearning that it was available. I now understand a clearer difference between Git and GitHub:
- Git is the tool on your computer that tracks versions of your project
- GitHub is a website that stores a copy of your Git project online so you can back it up, share it, and collaborate.

## Startup Specification Deliverable

### Elevator pitch

Drinkly is a gamified water intake tracker that turns hydration into a daily streak game. Users log water with a single tap and watch their virtual tree grow with rain animations as they progress toward personalized hydration goals, earn fruit rewards for consistency, unlock new tree species, and compete with friends on a realtime leaderboard.

### Design

![Mock](docs/dashboard-mock.png)

Here is a sequence diagram that shows how users interact with the backend when logging water and updating the leaderboard.

```mermaid
sequenceDiagram
    actor User
    actor Friend
    User->>Server: Log water intake
    Server->>Database: Store water log
    Server-->>User: Updated progress & rewards
    Server-->>Friend: Leaderboard update (WebSocket)
  ```

### Key features

- Secure user registration, login, and logout
- Personalized daily hydration goals
- One-tap water intake logging
- Animated tree growth and rain effects
- Streak tracking and fruit rewards
- Unlockable tree types based on consistency
- Friends system and weekly leaderboard
- Realtime updates using WebSockets
- Persistent storage of user and activity data
- Ability for admin to manage hydration facts

### Technologies

I am going to use the required technologies in the following ways:

- **HTML** – Uses correct HTML structure for application pages including login, profile setup, dashboard, fruit basket, leaderboard, settings, and admin views.
- **CSS** – Application styling that looks good on different screen sizes, uses good whitespace, color choice, contrast, and includes animations for tree growth and rain effects.
- **React** – Provides login, water logging, progress display, leaderboard viewing, and routing using React components and React Router.
- **Service** – Backend service with endpoints for:
- register
- login
- logout
- logging water intake
- retrieving daily intake totals
- retrieving leaderboard data
- managing fruit rewards and tree unlocks
- **DB/Login** – Stores users, authentication credentials, water logs, streaks, fruit inventory, and unlocked trees in a database. Users must be authenticated to log water.
- **WebSocket** – As users log water or complete daily goals, leaderboard updates and friend activity are broadcast to all other users in realtime.
- **Third-party API** – When a user reaches their daily hydration goal, the backend retrieves a motivational quote from the ZenQuotes public API and displays it as a reward.


<!-- ## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
``` -->
