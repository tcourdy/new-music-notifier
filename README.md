This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This app was styled using [React-MD](https://react-md.mlaursen.com/ )

Using the Spotify API, twilio, and a mysql backend this projects aims to allow users to register and sign up for sms text notifications for new albums released by artists they choose to follow.

Feel free to learn from or add to this project.

In order to get the server to successfully run you will need to create a `creds.json` file with the following syntax:

```
{
  "spotify_client_id": "",
  "spotify_client_secret": "",
  "twilio_account_sid": "",
  "twilio_auth_token": "",
  "twilio_number": "",
  "mysql_user": "",
  "mysql_pass": ""
}
```


To start the server from the main repository folder:
`> cd server`
`> yarn install`
`> yarn start`

To start react from the main repository folder:
`> yarn install`
`> yarn start`
