const express = require("express");
const dotenv = require("dotenv");

const { users } = require("./data/users.json"); //this way we can import other function and other json file from some other place

//Database connection
const DbConnection = require("./databaseConnection");

//Importing routes
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

dotenv.config();

const app = express();

DbConnection();

const PORT = 8081;

app.use(express.json());

app.get('/',(req, res) => {
    res.status(200).json({
        message : "Server is up and running"
    });

});

app.use('/users', usersRouter);
app.use('/books', booksRouter);


app.get('*',(req, res) => {
    res.status(404).json({
        message : "This route does not exist"
    });
})
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});