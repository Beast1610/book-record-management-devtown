const express = require("express");
const{ books } = require('../data/books.json');
const{ users }= require('../data/users.json');
const { getAllBooks, getSingleBookById, getAllIssuedBooks, addNewBook, updateBookById, getSingleBookByName } = require("../controllers/book-controller");


const router = express.Router();



/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */

router.get('/', getAllBooks);

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * Parameters: id
 */

router.get('/:id', getSingleBookById);


router.get('/getbook/name/:name', getSingleBookByName);

/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: none
 */

router.get('/issued/by-user', getAllIssuedBooks);

/**
 * Route: /books/issued/by-user
 * Method: POST
 * Description: Create new book
 * Access: Public
 * Parameters: none
 * Data: author, name, genre, price, publisher, id 
 */

router.post('/', addNewBook);

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update a book
 * Access: Public
 * Parameters: id
 * Data: author, name, genre, price, publisher, id 
 */

router.put('/:id', updateBookById);

/**
 * Route: /books/issued/with-fine
 * Method: GET
 * Description: Get issued books with fine
 * Access: Public
 * Parameters: none
 */

 router.get("/issued/with-fine", (req, res) => {
    const usersWithIssuedBooksWithFine = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooksWithFine = [];

    usersWithIssuedBooksWithFine.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;


        const getDateInDays = (data = "") => {
            let date;
            if (data === "") {
                date = new Date();
            } else {
                date = new Date(data);
            }
            let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 is for milliseconds
            return days;
        };

        let returnDate = getDateInDays(each.returnDate);

        let currentDate = getDateInDays();

        if (returnDate < currentDate) {
            issuedBooksWithFine.push(book);
        }
    });

    if (issuedBooksWithFine.length === 0) {
        return res.status(404).json({
            Success: false,
            Message: "No books which have fine",
        });
    }

    return res.status(200).json({
        Success: true,
        Message: "Issued Books List which have fine",
        Data: issuedBooksWithFine,
    })
});

//default export
module.exports = router;