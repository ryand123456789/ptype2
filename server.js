var express = require('express');
var app = express();
var serv = require('http').Server(app);
var mongoose = require('mongoose');
var Account = require("./models/account")
//connects to mongodb our database
var dbURI = 'mongodb+srv://rdabek52:force52@userdata.ezv7c.mongodb.net/';
mongoose.connect(dbURI)
    .then((result) => console.log('connected to db')) //should put serv.listen in here too
    .catch((err) => console.log(err));

app.get('/', function(req, res) { 
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

//mongoose


serv.listen(2000);
console.log("server strted");

var socket_index = 0; //goes from zero to up, depending on the amount of players

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    socket.on('signIn', async function(data){
        const isValid = await checkUserCredentials(data.username, data.password);
        
        if (isValid) {
            const userData = await loadData(data.username); // wait for user data before proceeding
    
            if (userData) {
                socket.emit('user-data', userData); // send data first
                socket.emit('signInResponse', { success: true }); // THEN tell client sign-in was successful
                console.log("emitted userData:", userData);
            } else {
                socket.emit('signInResponse', { success: false });
                console.log("User data failed to load");
            }
        } else {
            socket.emit('signInResponse', { success: false });
            console.log("Invalid credentials");
        }
    });    
    socket.on('signUp', async function(data){
        var felix = validAccountCreation(data);
        console.log(felix + " this is the felix");
        if(await felix === true)
        {
            await socket.emit('signUpResponse',{success: true})
        }
        else{
            await socket.emit('signUpResponse',{success: false})
        }
    })
})


async function getAllUsernames() {
    try {
      // Find all users, but only get the username field
      const users = await Account.find({}, 'username').lean();
      // Extract just the usernames into an array
      const usernames = users.map(user => user.username);
      console.log(Array.isArray(usernames) + " from getusers" );
      return usernames;
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  }


var availableUsername = async function(user){
    var usernames = await getAllUsernames();
    console.log(usernames);
    console.log(Array.isArray(usernames) + " from availusers");
    var use = user.toLowerCase();
    
    if (usernames.includes(use)){ 
        console.log("User exists");
        return false;
    }
    else
    {return true;}
}
async function checkUserCredentials(enteredUsername, enteredPassword) {
    try {
        // Find user by username
        const user = await Account.findOne({ username: enteredUsername });

        // Check if user exists
        if (!user) {
            console.log("User not found");
            return false;  // User doesn't exist
        }

        // Compare the entered password with the stored password
        if (enteredPassword === user.password) {
            console.log("Password is correct");
            return true;  // Password matches
        } else {
            console.log("Incorrect password");
            return false;  // Password does not match
        }
    } catch (error) {
        console.error("Error checking credentials:", error);
        return false;
    }
}
var validAccountCreation = async function(data){
    if(data.password === data.passwordConfirm)
    {
        if(await availableUsername(data.username))
        {
            //app.get('/add-account', (req, res) => { //adds new account
                var account = new Account({
                    username: (data.username).toLowerCase(),
                    password: data.password,
                    health: 100,
                    damage: 20,
                    speed: 2,
                    levels_unlocked: 1, 
                    current_skin: "blue",
                    playerId: Math.random(),
                    itemIDs: [1, 2, 3, 101],
                    currency: 10,
                    color_scheme:"black"
                })
                account.save();/*
                .then((result) => {
                    res.send(result)
                })
                .catch((err) => {
                    console.log(err);
                });*/
         //)
         return true;
        }
    }
    return false;
}
async function loadData(username) {
    try {
        const user = await Account.findOne({ username: username });  // Query by username
        if (user) {
            console.log('User found:', user);
            return user;
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error finding user:', error);
    }
    return false;
}