

# SolidMonkey

Welcome to CS 4770 (Winter 2015) Team 5's project, code name SolidMonkey. The goal of this web application is to simulate a peer to peer network in which users may add/modify a replicated data type.

## Team Members

Matthew Newell

Jordan Porter

Nathan Frenette

Myles Hann

Christopher Healey

Joshua Rodgers

## Developing

This project was created in eclipse and therefore this project directory may be imported as an eclipse project. The server uses Express.js, which is a Node.js web application framework. There are many modules available for this setup. An important module to note is hjs (Hogan.js) This is the view engine that is used for the project.

## Usage

The project directory should include a node_modules directory, which is the home of all the required modules for this project. 

However, to generate this directory: cd into the project directory, then run "npm install". There should be a package.json file included with the project, which is what npm will use to figure out dependencies. npm must be installed to run this command. The will generate the node_modules directory.

If all the required modules are in the node_modules directory, you can now start the server by executing "npm start" after you cd into the project directory. Again, npm (and Node.js) must be installed.

## External Documentation

All external documentation is located in the docs directory.

## Version Control

We are using git for version control. A repository was provided by the client, but it has proved to be unreliable when the group needs to access it the most. This is beyond our control, so we decided to use our own server during development. The repository on our server is a clone of the provided one, so this allows us to push/pull changes upstream/downstream. 

A visual representation:

    garfield.cs.mun.ca
           *
           *
           *
       kaimbe.com
    *     *        *
    *     *        *
    *     *        *
    matt  chris    etc.
    
This increases reliability (the server we are using has proven itself to be extremely reliable) and creates more redundancy (we essentially create a backup server). 

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))
Nodeclipse is free open-source project that grows with your contributions.
