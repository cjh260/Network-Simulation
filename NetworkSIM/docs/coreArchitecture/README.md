# Core Architecture

## Vision Statement

We will be constructing a Simulation Framework (SF) that will provide us with the ability to simulate peer-to-peer networks of mobile devices (client-server is another possibility). Within the framework we can create a number of virtual WiFi or GSM networks. The simulated mobile devices (realized as browser tabs) will be able to join and leave any of these networks. All devices on a particular network will be able to directly communicate with each other. Connection between distinct virtual networks is not guaranteed. Application developers for mobile devices will be able to register their (HTML5) applications with the Framework. SF will provide us with the option of deploying these applications to the mobile devices. We are particularly interested in applications that utilize Replicated Data Types (RDTs), which will be provided by libraries created outside the Framework. The Framework will allow us to test, benchmark and pragmatically evaluate the RDTs. Automatic execution of test scripts is another desired functionality.

(Vision Statement provided by the client)

## Iteration 2

The major tasks assigned to us by the client this iteration are: 

    - Refactor our existing code into the provided Eclipse project
    - Create a visual representation of the simulation that allows users to add, remove, etc. network and devices
    - Implement logging of simulation activity
    
The majority of our time was spent refactoring our code to fit into the new Eclipse project provided by the client. We essentially restarted the project both on the front-end and back-end. On the front-end, a new web design was created and implemented to look more professional. On the back-end, we had to fit our previous code into the provided project in order to comply with the clients request. One thing to note here is that we kept our previous project name "SolidMonkey". This was done simply to give our project some personality. 

Towards the end of the iteration we were provided with a simply increment RDT that increases a devices local count. Because our code is designed to work with provided RDTs, this was relatively simple to get up and running. Administrators can import RDTs into the simulation.

Our implementation allows for applications to be dynamically added (while the server is running a folder containing the application can be added into the apps directory and then imported) to the simulation by administrators. Once a application is imported, any device can use this application.

We started implementing a visual representation of the simulation using Interact.js. This allows for some basic functionality, but doesn't look the prettiest and doesn't do everything it is supposed to yet. This is mainly due to the steep learning curve associated with using Interact.js. No group members have previous experience with this library.

Presently, most actions performed on the simulation are logged and displayed on the login page. 

## Iteration 3 

The major tasks assigned to us by the client this iteration are:

	- Refactor entire project to use persistent storage. The client specified that we shall use mongoDB to achieve this. 
	- Continue to work on tasks assigned in iteration 2.

In iteration 2 we attempted to use Interact.js to develop our visual representation of the simulation. However, we decided that it was easier to implement the visualization of the simulation using HTML canvas. This meant discarding our Interact.js code and coding everything using canvas. The visual representation is now capable of displaying networks, devices, network connections, and what network devices are in (or not in a network at all). A user can make changes to the simulation by using the buttons on the page and clicking and dragging devices around the page. When a device is dragged into a network, the device is added to the network. When a network is clicked, it can be connected to other networks by dragging the generated line to another network. 

In the back end a major refactor was needed to make our existing code work with mongoDB. Previously, all storage was in memory of the server. (i.e. networks and devices were stored in a dictionary). Now everything that needs to be persistent has been redesigned to make database calls instead.

View states was started in both the front end and back end. The intent was that a user could view what the simulation looked like at a previous time.

User sign up has been completed. A user can request a device token by giving their email address. An email will get sent to the user and then that user may log in to the simulation using that token. The user is then in control of that device. Users can only log in with device tokens that have been assigned to a user.

Note: We were not sure how to use the provided database so we used our own instead. (kaimbe.com) We plan to use the provided mongoDB server for the final product. It will only involve changing a single URL. If access is required to the database, use the hostname kaimbe.com . It uses the default mongoDB port.

## Iteration 4

The major tasks assigned to us by the client this iteration are:

    - Continue to work on tasks assigned in iteration 3.
    
A complete redesign of the front end was performed to make it more visually appealing to users. The new design was based on client feedback. In addition to an updated look and feel, a major change was made in the way data gets sent from client to server and sent back from server to client. Before we were purely using hojan.js variables and page reloads to achieve updated information after a post. Now posts are made with the XMLHttpRequest object. A request is made, the server processes the request, sends back any updated information and then the client uses that updated information to update changes on the screen, all without reloading the current page. The old "Network View" page has been moved to both the admin and user pages. Admins can modify more things than regular users. 

View states was successfully completed on both the front end and back end. A user can now view a visual representation of what the simulation looked like at a specified time.

The way users sign up and log in was changed from previous iterations. Now users sign up by providing a username and password. This creates a user account which they can log in with. Now pages are restricted so that no one can access the admin and user pages without first being authenticated. Only designated admins may access the admin pages. The current way to make an admin account is to click the "Create Admin" button on the index page. Obviously it would not be done this way for a production environment. *You can then log in as an admin with the username "admin" and password "admin".*

To achieve authentication we decided to use the npm module "passport.js". We also decided to use sessions with passport. Sessions are stored in the database server side. A session is invalidated when a user logs out.

There was a lot of change in the back end server code, mostly to properly deal with asynchronous database queries. This involved creating more callbacks and rearranging some of the functions to make requests in the proper order. The intent was to ensure that if the server got a post request, it would not send back a response to the client until all the database queries, etc. were finished executing. When a large number of networks are created on the admin page, for example, there is a time lag before the dropdown and canvas re populates. The idea was that we would display feedback when the process is loading (a progress bar or something).

Administrators can now upload apps and RDTs into the simulation. Both must be a zip file of the app/RDT directory being imported. The server will unzip the app/RDT, put it in the appropriate directory and make it available for use in the simulation. See the apps/rdts directories for more information on their format. Regular users select which app they would like to use, admins select which RDT they would like the simulation to use. There can only be one RDT in use per simulation.

Regular users can "pair up" or "be assigned" a device by clicking the appropriate button on the user page. Once they are assigned a device they can then control that device.

There were numerous bugs fixed with the user and admin to try and prevent as many errors as possible.

The provided "counterApp"/"incRDT" is not fully functional as it is more or less just a proof of concept.


