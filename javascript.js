const bookShelf = document.querySelector("table tbody");
const dialog = document.querySelector("dialog");
const createBookButton = document.querySelector(".createBookButton");
const bookForm = document.querySelector("form");
const submitButton = document.querySelector("button[type='submit']");
const removeBookButton = bookForm.querySelector("div:last-child button:last-child");
let dialogOpenMethod;
let selectedBook;
let books = [];

createBookButton.addEventListener("click", () => {
    
    dialogOpenMethod = "create";

    removeBookButton.disabled = true;
    removeBookButton.hidden = true;
    submitButton.textContent = "Add to shelf";
    dialog.querySelector("h2").textContent = "New book";
    
    bookForm.reset();
    dialog.showModal();

});

removeBookButton.addEventListener("click", () => { 
    removeBook();
    dialog.close();
});

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (dialogOpenMethod === "create") {
    books.push(new Book(bookForm));
    }
    else {
        selectedBook.modifyInfo(bookForm);
    }

    dialog.close();
    console.log(books);
    populateBookshelf(books);
   
})

function Book (inputForm) {

    let bookInfo = Object.fromEntries(new FormData(inputForm));
    if (Number(bookInfo.bookPages <= 0) || isNaN(bookInfo.bookPages)) bookInfo.bookPages = 1;
    if (isNaN(bookInfo.bookProgress) || bookInfo.bookProgress == "") bookInfo.bookProgress = 0;
    if (Number(bookInfo.bookProgress) > Number(bookInfo.bookPages)) bookInfo.bookProgress = bookInfo.bookPages;

    this.title = bookInfo.bookTitle;
    this.author = bookInfo.bookAuthor;
    this.pages = bookInfo.bookPages;
    this.progress = bookInfo.bookProgress;
    this.id = crypto.randomUUID();
    this.displayed = false;

    this.modifyInfo = function (inputForm) {

        bookInfo = Object.fromEntries(new FormData(inputForm));
        if (Number(bookInfo.bookPages <= 0) || isNaN(bookInfo.bookPages)) bookInfo.bookPages = 1;
        if (isNaN(bookInfo.bookProgress) || bookInfo.bookProgress == "") bookInfo.bookProgress = 0;
        if (Number(bookInfo.bookProgress) > Number(bookInfo.bookPages)) bookInfo.bookProgress = bookInfo.bookPages;

        this.title = bookInfo.bookTitle;
        this.author = bookInfo.bookAuthor;
        this.pages = bookInfo.bookPages;
        this.progress = bookInfo.bookProgress;
    };

}

function populateBookshelf (books) {
    books.forEach((book) => {
        if (!book.displayed) {
            bookRow = bookShelf.appendChild(document.createElement("tr"));
            bookTitle = bookRow.appendChild(document.createElement("td"));
            bookAuthor = bookRow.appendChild(document.createElement("td"));
            bookPages = bookRow.appendChild(document.createElement("td"));
            bookProgressCell = bookRow.appendChild(document.createElement("td")); // Progress bar cell
            bookProgressDiv = bookProgressCell.appendChild(document.createElement("div"));
            bookProgressBar = bookProgressDiv.appendChild(document.createElement("progress"));
            bookProgressNumber = bookProgressDiv.appendChild(document.createElement("p"));
            bookID = bookRow.appendChild(document.createElement("td"));
            book.displayed = true;

            bookRow.id = book.id;

            bookRow.addEventListener("click", () => {
                selectedBook = book; 
                openModifyModal(book);
            });
        }
        else {
            bookRow = document.getElementById(book.id);
            bookTitle = bookRow.querySelector("td:first-child");
            bookAuthor = bookRow.querySelector("td:nth-child(2)");
            bookPages = bookRow.querySelector("td:nth-child(3)");
            bookProgressBar = bookRow.querySelector("td:nth-child(4) div progress");
            bookProgressNumber = bookRow.querySelector("td:nth-child(4) div p")
            bookID = bookRow.querySelector("td:nth-child(5)");
            }
        
        bookTitle.textContent = book.title;
        bookAuthor.textContent = book.author;
        bookPages.textContent = book.pages;
        bookProgressBar.value = book.progress;
        bookProgressBar.max = book.pages;
        bookProgressNumber.textContent = `${book.progress} / ${book.pages}`;
        bookID.textContent = book.id;
    });

}

function openModifyModal(book) {

        dialogOpenMethod = "edit";

        removeBookButton.disabled = false;
        removeBookButton.hidden = false;
        submitButton.textContent = "Modify book";
        dialog.querySelector("h2").textContent = "Edit book";

        let currentInput = 0;
        const formFields = bookForm.querySelectorAll("input");
        formFields.forEach((input) => {
            input.value = book[Object.keys(book)[currentInput]];
            currentInput += 1;
    });
        
        dialog.showModal(); 
};

function removeBook () {
    document.getElementById(selectedBook.id).remove();
    books = books.filter((book) => {
        console.log(book !== selectedBook);
        return book !== selectedBook;
    })
    console.log(books);
}