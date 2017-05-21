INSERT INTO Company (Name, Code) VALUES ("UPLB", "asd123");

INSERT INTO Admin (LastName, FirstName, Username, Password, Email, CompanyID, IsSuperAdmin) VALUES ("Aragones", "Prince Karlo", "prince", "prince", "prince@gmail.com", 1, true);

INSERT INTO User (LastName, FirstName, Username, Password, Email, CompanyID) VALUES ("Aragones", "Queen Abigail", "queen", "queen", "queen@gmail.com", 1);
INSERT INTO User (LastName, FirstName, Username, Password, Email, CompanyID) VALUES ("Tomagos", "Angeli Mae", "angeli", "angeli", "angeli@gmail.com", 1);
INSERT INTO User (LastName, FirstName, Username, Password, Email, CompanyID) VALUES ("Esguerra", "Cacai", "cacai", "cacai", "cacai@gmail.com", 1);

INSERT INTO Location (UserID, Latitude, Longhitude, Time) VALUES (1,14.167325,121.243250, NOW());
INSERT INTO Location (UserID, Latitude, Longhitude, Time) VALUES (1,14.167248,121.243301, NOW());
INSERT INTO Location (UserID, Latitude, Longhitude, Time) VALUES (1,14.167019,121.243333, NOW());

INSERT INTO Location (UserID, Latitude, Longhitude, Time, isReport) VALUES(1,14.167325,121.243450, NOW(), true);
INSERT INTO Report (Type, Remarks, LocationName, LocationID, DateSubmitted, UserID) Values ("Facility", "Broken windows", "Right Side of Admin Building", 4, NOW(), 1);