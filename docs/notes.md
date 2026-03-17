# CS 260 Notes

[My startup - Drinkly](https://simon.cs260.click)

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

Reminder: When I’m done with this class or terminate the EC2 instance, go to EC2 → Elastic IPs and release the Elastic IP to avoid being charged.


## HTML Deliverable

I enjoyed getting to build out the static HTML structure and see how a multi-page app comes together with just HTML. 

I learned about semantic elements like header, nav, main, and footer to make the code more accessible and organized. Using placeholders for future technologies like WebSocket notifications and database tables helped me think about how the app will work dynamically later. 

 I hadn't used SVG much before, and it was cool to see how it scales for things like the virtual tree that I need to draw out and put in there soon. 
 
 Tables for data and forms for login felt straightforward, but ensuring consistent navigation across pages showed me the value of reusable components (which React will fix). 

## CSS Deliverable

I spent a good amount of time making Drinkly look like a real app. Here's what I learned:

**Bootstrap** is a CSS framework that gives you pre-built classes for buttons, tables, progress bars, grids, and more. You add class names like `table table-hover` or `progress-bar` and it instantly looks polished. It saves a ton of time on common UI patterns.

**Flexbox** is great for 1-dimensional layout (rows or columns). I used it for the header (logo left, nav right), the login button row, and the footer. Setting `display: flex` with `justify-content: space-between` on the header was especially useful.

**CSS Grid** is better for 2-dimensional layouts. I used it for the dashboard (two columns: progress/tree + notifications) and the features grid on the about page. `grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))` is a great pattern for responsive card layouts — it automatically wraps to fewer columns on smaller screens.

**CSS Custom Properties** (`--blue-dark: #1565C0;`) make it easy to keep colors consistent across the whole stylesheet. Change it in one place and it updates everywhere.

**Pseudo-selectors** I used:
- `:hover` — nav links and buttons change on hover
- `:focus` — input fields show a blue ring when clicked
- `:active` — buttons shift down slightly when clicked
- `:nth-child(even)` — alternating table row colors
- `::before` — adds a 💧 emoji before each feature list item without changing the HTML

**Google Fonts** — I imported the Nunito font using `@import url(...)` at the top of my CSS file. It gives the app a friendly, rounded look that fits the water theme.

**`@media` queries** let you apply different CSS at different screen widths. I added breakpoints at 768px (tablet) and 480px (phone) to collapse the 2-column dashboard grid to 1 column and stack the header vertically.

Key rule: always set `box-sizing: border-box` on `*` so padding doesn't cause elements to overflow their containers.

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
```

## HTML Deliverable

It was interesting to build out the static HTML structure for Drinkly and see how a multi-page app comes together with just HTML. I learned about semantic elements like header, nav, main, and footer to make the code more accessible and organized. Using placeholders for future technologies like WebSocket notifications and database tables helped me think about how the app will work dynamically later. I hadn't used SVG much before, and it was cool to see how it scales for things like the virtual tree. Tables for data and forms for login felt straightforward, but ensuring consistent navigation across pages showed me the value of reusable components (which React will fix). Overall, it gave me a solid foundation for the visual and structural parts of the app. --> -->
