# EventEase Platform

This is a basic event management project where users can create, update, delete, and view event details. Interested users can join events. Event details are stored in a MongoDB database, and the event creator will receive real-time notifications when users join the event. Users will also receive real-time updates when the event details are modified or when the event reaches its maximum candidate limit.

## Hosting

- The event front-end is available at [https://event.begelled.com](https://event.begelled.com)
- The backend is available at [https://event-api.begelled.com](https://event-api.begelled.com)

Both are hosted on AWS EC2.

## Technologies Used

- **Backend**: Node.js (v.22.10.0) with **Express**
- **Database**: **MongoDB**
- **Frontend**: **Next.js** (SSR - Server-Side Rendering)
- **Real-time Notifications**: **Socket.io**

## How to Run

    Clone the repository:git clone https://github.com/golamrabbani3587/event-ease.git

### Front-end

    1. cd front-end
    2. Yarn
    3. yarn dev ( for dev run )
    4. yarn build
    5. yarn start ( for production run )

### Backend

    1. cd backend
    2. npm i
    3. node server
    4. localhost:5001

### Backend Task:

    User Authentication: I have created two api for register and login. Its route is authRoutes and controller is authController.

    Event Management: I have builded api for create, get, update and delete Event. The code available in eventRoutes and eventControllers.

    Attendee Registration:  The attendee event joined and also in the event route but another controller called attendeeController. Users cannot join events if they reach max attendees number.

    Real time updates: I have used socket.io and its connection related configuration can be found in utils/socket.js file and send notification processes written in attendeeController.


    *I have shared the postman collection.

### Front-End Task

    Authentication: Logics written in login and registration page.

    Event Dashboard: For all created events are in the home page and own created event list( update and delete are possible here ) is in /dashboard page.

    Realtime time Notification: Logics written in dashboard page and notification can be view when user in dashboard page.
