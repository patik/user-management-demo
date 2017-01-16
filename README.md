# User Management Demo

**[View a live demo](https://patik.github.io/user-management-demo)**

## How to run

1. Clone this repo
1. `npm install`
1. Run `npm start`
1. Launch [http://localhost:3000](http://localhost:3000/)

Command|Description
--- | ---
*npm start*|Start application with hot reloading enabled at [http://localhost:3000](http://localhost:3000/)
*npm test*|Run tests
*npm run build*|Minified production build with offline capabilities (the [live demo](https://patik.github.io/user-management-demo) was built with this)

## Features

- Add and remove users
- Add and remove groups (removal only when empty)
- Add and remove users to/from groups
- Detail page for each user and group
- Works offline and remembers data between sessions
    + It's recommended that you use Incognito or Private Mode so you can just close and re-open the window to clear local storage
- Responsive
- Unit tests
- ES6
- Simple client-side validation

### API

The following methods are callable on `window.DataStore` or any instance of `Storage`:

- `getUser(String userId)`
    + Returns a user object, or a default/empty object if no ID is provided
- `addUser(Object user)`
- `getUserList()`
    + Returns an array of user objects
- `getUsersByGroup(groupId)`
    + Returns an array of user objects
- `addUserToGroup(String userId, String groupId)`
- `removeUserFromGroup(String userId, String groupId)`
- `deleteUser(String userId)`
    + Will also remove the user from all groups to which they belonged
- `getGroup()`
    + Returns a group object, or a default/empty object if no ID is provided
- `addGroup(Object group)`
- `getGroupList()`
    + Returns an array of group objects
- `getGroupsByUser(String userId)`
    + Returns an array of group objects that the given user belongs to
- `deleteGroup(String groupId)`

## Technologies used

The project was cloned from [this starter project](https://github.com/paulhoughton/react-pwa) so that all the necessary scaffolding would be in place:

- React
- React Router
- [Jest](https://facebook.github.io/jest/)
- Webpack, with [`offline-plugin`](https://www.npmjs.com/package/offline-plugin)
- Babel
- [Material Design](https://github.com/react-mdl/react-mdl)

## To Do

*AKA what I would've done with more time*

- Accessibility improvements (screen reader testing, more thorough keyboard support, color contrast testing)
- More tests, especially snapshot tests for each React component
- Search
- Replace Material Design with custom styles
    + At minimum, remove any unused components and styles
- More thorough and consistent navigation
- Validation within the `Storage` module (e.g. enforce rules, such as only being able to delete empty groups)
- Share the data store directly between components rather than using a global
- Consolidate code
    + There are a lot of redundancies and repeated lines of code, especially between comparable user & group components. The code base could likely be cut by 30-40%.
- Make user and group details editable in-place
- Update the views when the API is used externally
- Add URL API endpoints
- Code linting
- Proper URLs with `window.pushState()` instead of hashes
- Replace `Array.forEach` and `Array.some` with `while` loops for better performance
