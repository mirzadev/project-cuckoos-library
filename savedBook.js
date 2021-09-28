var booksArray = JSON.parse(localStorage.getItem("savedBooks"));

var booksBox = $("#booksBox");
booksArray.forEach((book) => {
  var newBook = $(`${book}`);
  var newCard = $('<div class="card">');

  newCard.append(newBook);

  booksBox.append(newCard);
});

$(document).ready(() => {
  var grabFooter = $(".card-footer");
  var deletThis = $('<button style="padding:0.7rem;margin:1rem;" class="delete is-small"></button>');
  // grabFooter.attr("style", "display:flex; align-items:center;");
  grabFooter.append(deletThis);

  $(document).on("click", ".delete", (event) => {
    var footer = event.target.parentElement;
    var card = footer.parentElement;

    for (book of booksArray) {
      if (
        card.outerHTML ===
        `${book.slice(
          0,
          -15
        )}<button style="padding:0.7rem;margin:1rem;" class="delete is-small"></button></footer></div>`
      ) {
        booksArray.splice(book, 1);
      }
    }

    localStorage.setItem("savedBooks", JSON.stringify(booksArray));
    card.remove();
  });
  $(document).on("click", "#clear-btn", () => {
    booksArray = [];
    localStorage.setItem("savedBooks", JSON.stringify(booksArray));
    booksBox.html("");
  });
});
