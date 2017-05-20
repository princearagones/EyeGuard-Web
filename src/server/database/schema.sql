/*Tables

Company (CompanyID, name, code)
Admin(AdminID, username, password, name, email,CompanyID)
Contact_Admin(contactNumber, AdminID)
User(UserID, username, password, isVerified, schedule, email, CompanyID)
Report(ReportID, Type, Location, Remarks, UserID)
Location(LocationID, Time, Latitude, Longhitude, UserID)
Attendance(TimeIn, TimeOut, Date, UserID)
*/

CREATE DATABASE IF NOT EXISTS EyeGuard;
USE EyeGuard;
CREATE TABLE Company(
	ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	Name varchar(255) NOT NULL,
	Code varchar(10) NOT NULL
);

CREATE TABLE Admin(
	ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	LastName varchar(255) NOT NULL,
	FirstName varchar(255) NOT NULL,
	Username varchar(20) NOT NULL,
	Password varchar(20) NOT NULL,
	Email varchar(50) NOT NULL,
	CompanyID int NOT NULL,
	IsSuperAdmin BOOLEAN DEFAULT FALSE,
	CONSTRAINT CompanyID_FK FOREIGN KEY (CompanyID) REFERENCES Company(ID)
);

CREATE TABLE User(
	ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	LastName varchar(255) NOT NULL,
	FirstName varchar(255) NOT NULL,
	Username varchar(20) NOT NULL,
	Password varchar(20) NOT NULL,
	Email varchar(50) NOT NULL,
	IsVerified BOOLEAN DEFAULT FALSE,
	CompanyID int NOT NULL,
	CONSTRAINT User_CompanyID_FK FOREIGN KEY (CompanyID) REFERENCES Company(ID)
);

CREATE TABLE Schedule(
	Sun varchar(255) DEFAULT NULL,
	Mon varchar(255) DEFAULT NULL,
	Tue varchar(255) DEFAULT NULL,
	Wed varchar(255) DEFAULT NULL,
	Thu varchar(255) DEFAULT NULL,
	Fri varchar(255) DEFAULT NULL,
	Sat varchar(255) DEFAULT NULL,
	UserID int NOT NULL,
	CONSTRAINT Schedule_UserID_FK FOREIGN KEY (UserID) REFERENCES User(ID)
);


CREATE TABLE Location(
	ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	Time TIMESTAMP,
	Latitude double,
	Longhitude double,
	UserID int NOT NULL,
	isReport BOOLEAN DEFAULT false,
	CONSTRAINT Location_UserID_FK FOREIGN KEY (UserID) REFERENCES User(ID)
);

CREATE TABLE Report(
	ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	Type varchar(255),
	Remarks varchar(255),
	LocationName varchar(255),
	LocationID int,
	DateSubmitted TIMESTAMP,
	isRead BOOLEAN DEFAULT false,
	UserID int NOT NULL,
	CONSTRAINT Report_UserID_FK FOREIGN KEY (UserID) REFERENCES User(ID)
);

CREATE TABLE Attendance(
	TimeIn TIME,
	TimeOut TIME,
	UserID int NOT NULL,
	CONSTRAINT Attendance_UserID_FK FOREIGN KEY (UserID) REFERENCES User(ID)
);