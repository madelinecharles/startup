# CS 260 Notes

[My startup - Drinkly](https://startup.drink-ly.com)

## Startup Specification

It was interesting to see how a web app works together and to look at all the different services required. It's cool how Node.js lets javascript run on a server instead of the backend, and how Route 53 (AWS DNS) translates the domain name (e.g. myapp.com) into the IP address of the server.

I hadn't used Git in the terminal very much, and I enjoyed leearning that it was available. I now understand a clearer difference between Git and GitHub:

- Git is the tool on your computer that tracks versions of your project
- GitHub is a website that stores a copy of your Git project online so you can back it up, share it, and collaborate.

## AWS

Elastic IP: 107.23.217.77

SSH command:
ssh -i "$env:USERPROFILE\.ssh\cs260-key.pem" ubuntu@107.23.217.77

My instance is t3 micro which I think will definitely be enough for my app.

Reminder: When Iâ€™m done with this class or terminate the EC2 instance, go to EC2 â†’ Elastic IPs and release the Elastic IP to avoid being charged.

## HTML Deliverable

I enjoyed getting to build out the static HTML structure and see how a multi-page app comes together with just HTML.

I learned about semantic elements like header, nav, main, and footer to make the code more accessible and organized. Using placeholders for future technologies like WebSocket notifications and database tables helped me think about how the app will work dynamically later.

I hadn't used SVG much before, and it was cool to see how it scales for things like the virtual tree that I need to draw out and put in there soon.

Tables for data and forms for login felt straightforward, but ensuring consistent navigation across pages showed me the value of reusable components (which React will fix).

## CSS Deliverable

I spent a good amount of time making Drinkly look like a real app. Here's what I learned:

**Bootstrap** is a CSS framework that gives you pre-built classes for buttons, tables, progress bars, grids, and more. You add class names like `table table-hover` or `progress-bar` and it instantly looks polished. It saves a ton of time on common UI patterns.

**Flexbox** is great for 1-dimensional layout (rows or columns). I used it for the header (logo left, nav right), the login button row, and the footer. Setting `display: flex` with `justify-content: space-between` on the header was especially useful.

**CSS Grid** is better for 2-dimensional layouts. I used it for the dashboard (two columns: progress/tree + notifications) and the features grid on the about page. `grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))` is a great pattern for responsive card layouts â€” it automatically wraps to fewer columns on smaller screens.

**CSS Custom Properties** (`--blue-dark: #1565C0;`) make it easy to keep colors consistent across the whole stylesheet. Change it in one place and it updates everywhere.

**Pseudo-selectors** I used:

- `:hover` â€” nav links and buttons change on hover
- `:focus` â€” input fields show a blue ring when clicked
- `:active` â€” buttons shift down slightly when clicked
- `:nth-child(even)` â€” alternating table row colors
- `::before` â€” adds a ðŸ’§ emoji before each feature list item without changing the HTML

**Google Fonts** â€” I imported the Nunito font using `@import url(...)` at the top of my CSS file. It gives the app a friendly, rounded look that fits the water theme.

**`@media` queries** let you apply different CSS at different screen widths. I added breakpoints at 768px (tablet) and 480px (phone) to collapse the 2-column dashboard grid to 1 column and stack the header vertically.

Key rule: always set `box-sizing: border-box` on `*` so padding doesn't cause elements to overflow their containers.

When I moved to React I had to stub out a few things from the CSS version that need real backend data â€” will add them back later:
- Tree stage images on the dashboard (need to show only the current stage based on DB data)
- Dashboard stats like streak, weekly total, rank (need a service endpoint)
- Leaderboard rows (need DB data, will use `.map()` to render)
- Realtime notifications (need WebSockets)
- ZenQuotes inspirational quote on the about page (need a third-party API call)

## Simon CSS (quick notes)

I cloned the Simon CSS repo, ran it with Live Server, and played with the CSS to see changes in the browser. I used the `deployFiles.sh` script to push it to my server so it shows at my simon subdomain.

## React Part 1: Routing

Converting Drinkly from a multi-page HTML/CSS app to a React SPA was a significant restructuring. The biggest shift was replacing the four separate HTML files with a single index.html entry point that loads everything through React.

Setting up Vite was straightforward â€” just npm install and updating the scripts in package.json. The harder part was reorganizing the file structure: moving assets into public/, splitting each page into its own src/ subfolder with a .jsx and .css file, and understanding that the header and footer now live once in app.jsx instead of being repeated on every page.

React Router replaced all the `<a href="page.html">` links with `<NavLink to="/route">` components. The BrowserRouter wraps the whole app, and Routes/Route definitions tell React which component to display for each URL â€” no page reloads needed.

Key things I learned:

- `className` replaces `class` in JSX since `class` is a reserved JavaScript keyword
- The `index.html` at the root is just a shell with `<div id="root">` â€” React injects all the content via JavaScript
- Component props like `userName` and `onLogin` are declared now but will be wired up with actual logic in React Part 2

## React Part 2: Reactivity (quick notes)

This time I focused on making the app actually work with state. I used useState for values like intake/streak and useEffect to read/write localStorage on load. For anything that needs a backend later, I mocked it so the UI still feels real.

<!--

## CSS (Simon example notes)

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
  <text
    x="50%"
    y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-size="72"
    font-family="Arial"
    fill="white"
  >
    C
  </text>
</svg>
```

## React Part 1: Routing

Converting Drinkly from a multi-page HTML/CSS app to a React SPA was a significant restructuring. The biggest shift was replacing the four separate HTML files with a single index.html entry point that loads everything through React.

Setting up Vite was straightforward â€” just npm install and updating the scripts in package.json. The harder part was reorganizing the file structure: moving assets into public/, splitting each page into its own src/ subfolder with a .jsx and .css file, and understanding that the header and footer now live once in app.jsx instead of being repeated on every page.

React Router replaced all the `<a href="page.html">` links with `<NavLink to="/route">` components. The BrowserRouter wraps the whole app, and Routes/Route definitions tell React which component to display for each URL â€” no page reloads needed.

Key things I learned:

- `className` replaces `class` in JSX since `class` is a reserved JavaScript keyword
- The `index.html` at the root is just a shell with `<div id="root">` â€” React injects all the content via JavaScript
- Component props like `userName` and `onLogin` are declared now but will be wired up with actual logic in React Part 2

## React Part 2: Reactivity

This deliverable made Drinkly fully interactive. The biggest shift was thinking in React state instead of directly manipulating the DOM.

**What I implemented:**

- **Login with localStorage**: Used `useState` and `localStorage` to persist the user's name across page refreshes. A new user login clears the previous user's intake and streak data.
- **Dashboard interactivity**: The hydration progress bar, streak badge, and virtual tree all update reactively as the user clicks `+ Log Water Intake`. Used `useState` for `intake`, `streak`, and `weeklyTotal`, and `useEffect` to load saved data on mount.
- **Virtual tree progression**: The tree image shown changes based on both hydration percentage (25/50/75/100%) and streak day. At 100% it cycles through 8 different tree types (Tree with Leaves â†’ Apple â†’ Orange â†’ Watermelon â†’ Peach â†’ Pineapple â†’ Grapes â†’ Tree of Life), unlocking a special message on day 7.
- **Leaderboard from localStorage**: Used `useEffect` to load the shared `players` list, filter out anyone inactive for 2+ days, sort by weekly total, and render rows â€” same pattern as Simon's Scores page.
- **Mocked WebSocket with setInterval**: Created `drinkNotifier.js` with a `setInterval` that simulates peer users logging water every 5 seconds. The Leaderboard listens via `addHandler`/`removeHandler` and displays a live activity feed. This will be replaced with real WebSocket messages later.
- **Mocked ZenQuotes API**: The About page uses `useEffect` to pick a random quote from a hard-coded array that matches the real ZenQuotes API format `{ q, a }`.
- **Route guarding**: Dashboard and Leaderboard nav links are hidden when not logged in, matching Simon React's pattern.

Key things I learned:
- `useEffect` with `[]` runs once on mount â€” perfect for loading localStorage data
- State updates are asynchronous so you need to compute new values before calling both `setState` and `localStorage.setItem`
- `useEffect` cleanup functions (returning a function) are important for removing event handlers when a component unmounts

