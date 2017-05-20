## EyeGuard
This is a Special Problem project by Prince Aragones on ICS, UPLB

## Installation
-pull this repo
-type "sudo npm install"

## Setup
-Install mysql
-fix information on src/server/database/mysql.js
-use schema at src/server/database/schema.sql
-use dummy data on src/server/database/DummyData.sql

## How to run
-set up your database user and pass on lib/mysql.js and create a database
-then on terminal type "node index.js" on this directory
-go to your favorite web browser, preferably Chrome or Firefox. and go to localhost:3000

## Features
-Create User
	-type of users
	1. Security - Have basic information
		Username, Password (verified on front-end), Name, company, Duty time, e-mail, isAdmin = false.
	1. Admin - can verify security users if they are on the same company/department
		isAdmin = true.

-Log In, Log Out, Sessions
-View Profiles, Admin can view security profiles and reports. Security can only view itself
-Receive Reports from security
-View Reports on table form
	-report have read or unread.
-Receive Locations from security
-Visualize locations of security on a map 
	-using google map api

