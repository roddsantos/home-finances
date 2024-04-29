# home-finances
Home finances management

This is a personal project
This project have as objective create an web application for managing bills, credit card using and bank account saving (it doesn't require any sensitive data)

This project is made in Javascript, using the AngularJS framework
After cloning, you need to edit the file environment.ts (src/environments), with the following info:

```bash
export const environment = {
    production: false,
    backend_url: <backend url>,
};
```

And the environment.prod.ts with the following:
```bash
export const environment = {
    production: true,
    backend_url: <backend url>,
};
```

After this step do the next in the terminal (in the project root): 
```bash
$ npm install
```

And finally, you can run the application:
```bash
$ npm start
```
