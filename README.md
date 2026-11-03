
Readme · MD
# GoodNeighbor
 
**Good starts with good neighbors.**
 
GoodNeighbor is a community action platform where neighbors can create, join and track local social service events such as winter clothes distribution, cleanups, tree plantations, food sharing and free health camps.
 
## Live Site
 
**https://good-neighbor-client.vercel.app**
 
## Repositories
 
| Part | Link |
|------|------|
| Client (Next.js) | https://github.com/codewithjakaria/YOUR-CLIENT-REPO |
| Server (Express) | https://github.com/codewithjakaria/YOUR-SERVER-REPO |
| Live API | https://goodneighbor-server.onrender.com |
 
## Key Features
 
- **Secure authentication:** register and log in with email and password, or continue with Google. Passwords must contain an uppercase letter, a lowercase letter and the required minimum length, and every success or error is shown with a toast message.
- **Create events:** any logged-in user can publish an event with a title, description, event type, thumbnail image URL, location and date. Past dates are rejected, and the creator's email is stored with the event.
- **Upcoming events only:** the Upcoming Events page and the home page show only future events, each with its thumbnail, title, location, type, date and a View Event button.
- **Join an event:** the event details page is public, but joining requires a login. Every join is saved in the database together with the event and user data.
- **Manage your own events:** users can update or delete only the events they created, and review everything they have joined, sorted by event date.
- **Protected routes and API:** Create Event, Manage Events and Joined Events are private pages. The server verifies a JWT on every protected API request, and a logged-in user stays logged in after reloading any private page.
- **Light and dark theme:** a theme toggle switches the whole site between light and dark mode.
- **Fully responsive design:** the layout works on mobile, tablet and desktop with equal-sized cards and consistent spacing.
## Pages
 
| Page | Access |
|------|--------|
| Home (banner, features, recent upcoming events, gallery, newsletter) | Public |
| Upcoming Events | Public |
| Event Details | Public (login required to join) |
| Login and Register | Public |
| Create Event | Private |
| Manage Events | Private |
| Joined Events | Private |
 
## Tech Stack
 
**Client:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, react-hot-toast, lucide-react
 
**Server:** Express.js, MongoDB, BetterAuth (MongoDB adapter), JWT verification with `jose`
 
**Hosting:** Vercel (client) and Render (server)
 
## Run Locally
 
```bash
git clone https://github.com/codewithjakaria/YOUR-CLIENT-REPO.git
cd YOUR-CLIENT-REPO
npm install
```
 
Create a `.env.local` file in the project root:
 
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
 
Start the development server:
 
```bash
npm run dev
```
 
Open http://localhost:3000 in your browser. The Express server must be running on port 5000.
 
## Environment Variables
 
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express server |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this client |
 
Secrets such as database credentials and Google keys live only in the server repository and are never committed.
 
## Author
 
Built by **Jakaria** as part of a Programming Hero assignment on a social development events platform.
