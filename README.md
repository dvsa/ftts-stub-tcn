# TCN API stub service

Stub API mirroring TCN API for testing purposes

## Endpoints

### slots
```
GET testCentres/{testCentreId}/slots?testTypes=..&dateFrom=..&dateTo=..
```

`testCentreId`: any random id*

`testTypes`: any valid url encoded json string of test types e.g. `%5B%22CAR%22%5D` (\`["CAR"]\`)

`dateFrom`: any valid date in ISO format e.g. `2020-06-23`

`dateFrom`: any valid date in ISO format e.g. `2020-06-25`

*Use the following test centre ids to trigger mock error responses:
- `123456-401`: unauthorised error
- `123456-404`: test centre not found error
- `123456-500`: generic internal server error
- `123456-503`: service unavailable


There is very basic validation implemented, so e.g. an invalid date will trigger a 400 Bad Request error.

Date ranges spanning more than 6 months will also be rejected.

### slotsBulk
```
GET testCentres/{testCentreId}/slotsBulk?testTypes=..&dateFrom=..&dateTo=..
```

For the purposes of the stub, performs the same as the `slots` endpoint.

### reservations
```
POST reservations 
```
In the body an array of objects containing the following attributes are required:

`testCentreId` - string id between 10 and 72 characters

`testTypes` - array of strings. Array must contain at least 1 item

`startDateTime` - ISO formatted date

`quantity` - integer which has to be greater than or equal to 1

`locktime` - integer which has to be greater than to equal to 1

Providing invalid data will result in a bad request error (400)

Use the following test centre ids to trigger mock error responses:
- `123456-401`: unauthorised error (401)
- `123456-403`: forbidden error (403)
- `123456-404`: not found (404)
- `123457-404`: not found - but only when confirming bookings (404)
- `123458-404`: not found - used to simulate confirming multiple slots where there is a missing slot in TCN response
- `123459-404`: not found - missing slot in TCN confirm response and a 404 when retrieving the booking
- `123456-429`: too many requests (429)
- `123456-500`: internal server error (500)
- `123456-503`: service unavailable (503)

Providing a startDateTime of 11:00 will result in a ReservationConflictError (409)

Providing a startDateTime of 13:00 will result in a 200 with 2 reservations being returned

### bookings
```
POST bookings 
```
In the body an array of objects contatining the following attributes are required:

`bookingReferenceId` - string id between 10 and 72 characters

`reservationId` - string id between 10 and 72 characters

`notes` -  string between 0 and 4096 characters

`behaviouralMarkers` -  string between 0 and 4096 characters

Providing invalid data will result in a bad request error (400)

Use the following reservation ids to trigger mock error responses:
- `123456-401`: unauthorised error (401)
- `123456-403`: forbidden error (403)
- `123456-404`: reservation no longer available (404)
- `123456-500`: internal server error (400)
- `123456-503`: service unavailable (503)

## Config

Tweak the parameters of the generated slot data via the config.

Random slot times will be generated between the configured `dayStartHour` and `dayEndHour` (in server timezone).

Additionally the `skipDays` parameter denotes set days of the week for which 0 slots will always be returned, while `fullDays` denotes set days of the week for which a full day of slots will always be returned.

For every other day a random number of slots will be generated.

## Run locally

Since this function app just houses http trigger functions, can easily run it locally:
```
npm run build
npm run start
```

You'll need `azure-functions-core-tools` installed globally.

Watch for changes:
```
npm run watch
```

### Debug

Debug locally via the VSCode 'Attach to Node Functions' launcher.

