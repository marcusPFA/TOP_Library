const bookShelf = document.querySelector("table tbody");
const dialog = document.querySelector("dialog");
const createBookButton = document.querySelector(".createBookButton");
const bookForm = document.querySelector("form");
const submitButton = document.querySelector("button[type='submit']");
const removeButton = bookForm.querySelector("div:last-child button:last-child");
let dialogOpenMethod;
let selectedBookID;

createBookButton.addEventListener("click", () => {

    dialogOpenMethod = "create";
    
    removeButton.disabled = true;
    removeButton.hidden = true;
    submitButton.textContent = "Add to shelf";
    
    dialog.showModal();
    
    dialog.querySelector("h2").textContent = "New book";

    let currentInput = 0;
    const formFields = bookForm.querySelectorAll("input");
    formFields.forEach((input) => {
        input.value = "";
        currentInput += 1;
    })

})

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formAnswers = Object.fromEntries(new FormData(bookForm));

        let bookRow;
        let bookTitle;
        let bookAuthor;
        let bookPages;
        let bookProgressCell;
        let bookProgressBar;
        let bookProgressNumber;
        let bookID;

    if (dialogOpenMethod === "create") {
        bookRow = bookShelf.appendChild(document.createElement("tr"));
        bookTitle = bookRow.appendChild(document.createElement("td"));
        bookAuthor = bookRow.appendChild(document.createElement("td"));
        bookPages = bookRow.appendChild(document.createElement("td"));
        bookProgressCell = bookRow.appendChild(document.createElement("td"));
        bookProgressBar = bookProgressCell.appendChild(document.createElement("progress"));
        bookProgressNumber = bookProgressCell.appendChild(document.createElement("p"));
        bookID = bookRow.appendChild(document.createElement("td"));

        bookID.textContent = crypto.randomUUID();    
        bookRow.id = bookID.textContent;
    }
    else {
        bookRow = document.getElementById(selectedBookID);
        bookTitle = bookRow.querySelector("td:first-child");
        bookAuthor = bookRow.querySelector("td:nth-child(2)");
        bookPages = bookRow.querySelector("td:nth-child(3)");
        bookProgressBar = bookRow.querySelector("td:nth-child(4) progress");
        bookProgressNumber = bookRow.querySelector("td:nth-child(4) p")
        bookID = bookRow.querySelector("td:nth-child(5)");

    }  

    if (Number(formAnswers.bookProgress) > Number(formAnswers.bookPages)) formAnswers.bookProgress = formAnswers.bookPages;

    bookTitle.textContent = formAnswers.bookTitle;
    bookAuthor.textContent = formAnswers.bookAuthor;
    bookPages.textContent = formAnswers.bookPages;
    bookProgressBar.max = formAnswers.bookPages; 
    bookProgressBar.value = formAnswers.bookProgress;
    bookProgressNumber.textContent = `${formAnswers.bookProgress} / ${formAnswers.bookPages}`;

    bookRow.addEventListener("click", () => {

        selectedBookID = bookID.textContent;

        dialogOpenMethod = "edit";

        removeButton.disabled = false;
        removeButton.hidden = false;
        submitButton.textContent = "Modify book";
        
        dialog.showModal();

        dialog.querySelector("h2").textContent = "Edit book";

        let currentInput = 0;
        const formFields = bookForm.querySelectorAll("input");
        formFields.forEach((input) => {
            input.value = formAnswers[Object.keys(formAnswers)[currentInput]];
            currentInput += 1;
        })
    })

    
    
    dialog.close()
})

removeButton.addEventListener("click", removeBook);

function removeBook () {
    document.getElementById(selectedBookID).remove();
    dialog.close();
}