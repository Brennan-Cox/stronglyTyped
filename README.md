## stronglyTyped

## Authors

Brennan Cox
Evan Billingsley
Kevin Kirkham
Kevin Wood

## Project Scope

A web-based typing application with the goal of increasing general typing accuracy and speed with a focus on typing syntax.  The application will have three major modes/tabs.  Standard Typing Test, Tutorials/Drills, and Syntax Typing Challenges.  The user will initially come to a log-in screen, and must create an account, or log in with a valid username and password to proceed to the main application. 

## Sprint Development Plan

Sprint 1: Access and Wireframe
* Ability to create an account and log in
* Ensure password is hashed client side before being transmitted for security
* Ensure no SQL injection vulnerabilities with account functionality
* Create wireframe of website to test above functionality
Sprint 2: Main Functionality
* Ability to complete a standard typing test
* Ability to view tutorials and complete a drill
* Ability to complete a syntax challenge and unlock new challenges
Sprint 3: Content, Presentation, Testing
* Add the rest of the tutorials and drills
* Add game modes to the standard typing test
* Add the rest of the syntax challenge difficulty levels and/or programming language options
* Clean up the UI and make things look nice
* More thoroughly test the functionality of the application

## Tech Stack

* PostgreSQL is used for the datbase
* Next.js with TypeScript and TailwindCSS is used for the front-end and other application functionality.

## Deployment

**Local deployment**

Next.js must be installed, execute the following command from the project's root directory:
```npm run dev
```
Then, in any web browser, navigate to localhost:3000 to view the page.

**Remote Deployment via Vercel**

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License
No License

