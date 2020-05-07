

typeorm-express-rest-scaffold
=============================
Created Thursday 07 May 2020

What is this
------------

typeorm-express-rest-scaffold is a library to quickly build a REST service from your TypeORM model by generating a handler function that can do find or create on a model.

For example to GET a user, instead of writing an express handler and writing code to find a user and handle errors you would call ServiceBuilder, pass it your model name and let it know what parameters to expect:

	  app.get('/:id', ServiceBuilder.findOne(User, ["id"]) ) // Route to find one user, accepting id as a parameter
	  
The service builder returns a function that finds a matching user and returns it, or fails with a 404 and it can be registered using app.get.

How to use
----------

The first thing to do is setup a TypeORM project. Assuming you already have TypeORM instaleed, you will want to create a directory for the project and then run "typeorm init":

	$ mkdir typeormtest
	$ typeorm init


Next install express

	$ npm install --save express


Pull in typeorm-express-rest-scaffold as well:

	$ npm install --save https://github.com/alterlife/typeorm-express-rest-scaffold.git


Finally update the index.ts file to initialize your express application and add routes to find users.


	import "reflect-metadata";
	import {createConnection} from "typeorm";
	import {User} from "./entity/User";
	import { ServiceBuilder } from 'typeorm-express-rest-scaffold'
	
	createConnection().then(async connection => {
	
	  
	  const express = require('express')
	  const app = express()
	  const port = 3000
	
	  app.get('/:id', ServiceBuilder.findOne(User, ["id"]) ) // Route to find one user, accepting id as a parameter
	  app.get('/:firstname', ServiceBuilder.findAll(User, ["firstName"]) ) // Route to all users given a first name.
	
	  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
	
	}).catch(error => console.log(error));
	


And now you have a REST service that can find Users.


How does it work
----------------

Each of the functions under ServiceBuilder is a function that returns a handler function that can be registered with app.get in Express. For example:

	    static findOne(Model: typeof BaseEntity, params:string[]=["id"]) // findone accepts the model and a list of parameters that the route handler can take. 
	                : (request:Request, response:Response) => Promise<void> {
	
	        return async (request:Request, response:Response) => { // We extract the parameters that we are interested in
	            const searchParams = {
	                ... filterKeys(request.params, params),
	                ... filterKeys(request.query, params)
	            }
	
	            try { // Try to find a matching row
	                response.send(await Model.findOneOrFail(searchParams)) // and return it if a match exists.
	            } catch(e) {
	                response.send(404) // or return a 404 if one does not.
	            }
	            response.end()
	        }
	    }
	


It's a quick way to get a rest endpoint that directly matches a model without writing much code.
