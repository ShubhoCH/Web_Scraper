# How to use:
- Clone the repository
- Open terminal inside the working directory
- Type the following commands inside the terminal:
    #### Download all the required packages: 
        npm i 
    #### This will install all the required dependencies automaticall(Just make sure not to delete package.json)
- Make sure you have MongoDB Installed
- Don't delete the images folder as all the Images will be Downloaded Here

# Dependencies:
- Cherio
- mongoose
- express
- multer
- node-image-downloader
- request
- request-promise

# How to Run:
    node app.js

# How to Check the Obtained Result:
- The Entire Array of Elements will be Printed in the Terminal.
- All the data Will be saved into a MongoDB database: "webData".
    ##### To check, open another Console and type the following command:
        mongo
    ##### It will trigger the mongo Shell, then:
        >show dbs
        >use webData
        >show collections
    ##### Three Collectio will apper go to the dataarticles collection:
        > db.dataarticles.find().pretty()
    ##### This will show you all Title, Content & Links of each and every articles of the 3 section.
- To populate the Database again make sure to delete the Current database and then once again run the project. 
    ##### To Delete the database, first go inside the database in the mongo shell then:
        > dp.dropDatabase()
- You can Find all the Images in the folder called "images" inside the project.
- The naming will be like: "Img_Section<Current section No.>_<Current Image Number>".
