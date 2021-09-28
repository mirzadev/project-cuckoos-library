var bookSearchBtn = $("#bookSearchBtn");

var titleSearch = $("#titleSearch");
var authorSearch = $("#authorSearch");
var genreSearch = $("#genreSearch");

var newBooks = $("#newBooks");
/* 
    https://www.googleapis.com/books/v1/volumes?q=${titleValue}+inauthor:$    {authorValue}&key=AIzaSyCcXM9xp7ZReVIVy-jlgcN7S1C2U6gmlH4
 */

bookSearchBtn.click(getSearch);

$("#titleSearch").keydown((event) => {
  if (event.which == 13) {
    getSearch();
  }
});

$("#authorSearch").keydown((event) => {
  if (event.which == 13) {
    getSearch();
  }
});

$("#genreSearch").keydown((event) => {
  if (event.which == 13) {
    getSearch();
  }
});

async function getSearch() {
  newBooks.empty();

  var titleValue = titleSearch.val().trim().replace(/\s/g, "");
  var authorValue = authorSearch.val().trim().replace(/\s/g, "+");
  var genreValue = genreSearch.val().trim().replace(/\s/g, "+");

  var apiURL = "https://www.googleapis.com/books/v1/volumes?q=";
  var apiKey = "&key=AIzaSyCcXM9xp7ZReVIVy-jlgcN7S1C2U6gmlH4";

  if (titleValue != "") {
    apiURL += titleValue;
  }
  if (authorValue != "") {
    apiURL += `+inauthor:${authorValue}`;
  }
  if (genreValue != "") {
    apiURL += `+subject:${genreValue}`;
  }
  apiURL.concat(apiKey);

  const response = await fetch(`${apiURL}`);
  const data = await response.json();

  var topTen = data.items;

  topTen.forEach((item) => {
    if (item.volumeInfo.imageLinks != undefined) {
      var newCard = $('<div class="card">');

      var cardImage = $(`<div class="card-image">`);
      var cardFigure = $(`<figure class="image is-128by128">`);
      var newImg = $(`<img class="imgs" src="${item.volumeInfo.imageLinks.thumbnail}">`);
      cardFigure.append(newImg);
      cardImage.append(cardFigure);
      newCard.append(cardImage);

      var newContent = $(`<div class="media-content">`);
      if (item.volumeInfo.authors) {
        var newTitle = $(`<p class="title is-4">`);
        newTitle.text(`Title: ${item.volumeInfo.title}`);
        newContent.append(newTitle);

        var newSubTitle = $(`<p class="subtitle is-6">`);
        newSubTitle.text(`Author: ${item.volumeInfo.authors[0]}`);
        newContent.append(newSubTitle);

        newCard.append(newContent);

        var newFooter = $('<footer class="card-footer">');
        var saveBtn = $(` <a class="card-footer-item has-text-weight-bold saveBtn">Save</a>`);
        newFooter.append(saveBtn);
        newCard.append(newFooter);

        newBooks.append(newCard);
      }
    }
  });
}

var genreGifs = ["Theater", "Reading", "Colors", "Daydreaming", "Vacation"];

const questions = [
  {
    text: "What kind of movies do you like the most?",
    answers: [
      "A. Something with tons of gore, and that'll make me have nightmares.",
      "Something that I'll need to think about or solve. May or may not have plot twists.",
      "Something heartwarming, where love is the focus.",
      "Something set in the future or another planet with futuristic technology.",
      "Something about a real person or an event that may or may not be a documentary.",
      "Something with a lot of action! I dislike the boring crap...",
    ],
    genre: ["Horror", "Mystery", "Romance", "SciFi", "Nonfiction", "Action"],
  },
  {
    text: "What's your favorite part about reading a book?",
    answers: [
      "I love when books make my heart beat faster.",
      "I love when a book keeps me guessing.",
      "I love when a book tugs on my heartstrings.",
      "I love when a book makes me envision the future.",
      "I love when a book informs me on real events & people.",
      "I love when a book gives me a good thrill/adventurous feeling.",
    ],
    genre: ["Horror", "Mystery", "Romance", "SciFi", "Nonfiction", "Action"],
  },
  {
    text: "Which of these colors do you prefer?",
    answers: ["Black", "Blue", "Purple", "Green", "Brown", "Red"],
    genre: ["Horror", "Mystery", "Romance", "SciFi", "Nonfiction", "Action"],
  },
  {
    text: "What do you usually daydream about?",
    answers: [
      "My daydreams are nightmares",
      "Solving crimes",
      "Love & romantic scenes",
      "The future/outer space",
      "Meeting famous historical figures",
      "Going on adventures and kicking butt",
    ],
    genre: ["Horror", "Mystery", "Romance", "SciFi", "Nonfiction", "Action"],
  },
  {
    text: "Which of the following sounds like a great getaway?",
    answers: [
      "A secluded cabin in the woods.",
      "A lavish hotel in a city shrouded in mystery.",
      "A resort, preferably with a lover",
      "Another planet.",
      "Ruins in another country",
      "Any fast-paced inner city like New York",
    ],
    genre: ["Horror", "Mystery", "Romance", "SciFi", "Nonfiction", "Action"],
  },
];

var questionNumber = 0;
var startBtn = $("#startBtn");

var scores = { Horror: 0, Mystery: 0, Romance: 0, SciFi: 0, Nonfiction: 0, Action: 0 };

//Create a div in index.html with class questionsContainer, thats where the question text will reside

function nextQuestion() {
  var questionsContainer = $("#question");
  if (!questions[questionNumber]) {
    questionsContainer.html("");
    return endQuiz();
  }

  questionsContainer.text("");

  questionsContainer.text(questions[questionNumber].text);

  //Loop that displays answer buttons
  var topics = $("#topics");

  for (let i = 0; i < questions.length; i++) {
    var answerButton = $(
      `<button class="${questions[questionNumber].genre[i]} button is-rounded is-size-6 is-medium">`
    );

    answerButton.text(`${questions[questionNumber].answers[i]}`);

    topics.append(answerButton);

    //Move to next question upon answer clicknNumber++
    answerButton.on("click", function (event) {
      var genre = event.target.classList[0];
      scores[genre]++;
      topics.html("");

      questionNumber++;
      nextQuestion();
      nextGif();
    });
  }
}

function endQuiz() {
  var highScore = -1;
  var genreMatch = "";

  for (key in scores) {
    if (scores[key] > highScore) {
      highScore = scores[key];
      genreMatch = key;
    }
  }

  var questionsBox = $("#question");
  questionsBox.attr("style", "display:flex; gap:2rem;flex-flow:column wrap;");
  questionsBox.html(
    `Your Favorite Genre is: <button id="finalBtn" class="button is-rounded is-medium">${genreMatch}</button>`
  );
  questionsBox.append(
    `<button class="button is-rounded is-small"><a style="text-decoration:none;" href="./">Take the Quiz Again</a></button>`
  );

  async function getBooks() {
    var apiKey = "&key=AIzaSyCcXM9xp7ZReVIVy-jlgcN7S1C2U6gmlH4";
    var genreBooks = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${genreMatch}${apiKey}`);
    var objectify = await genreBooks.json();

    var newDiv = $("#gif-placeholder");
    newDiv.html(" ");
    newDiv.attr("style", "display:flex; flex-flow:column wrap; gap:2rem; overflow-x:scroll; overflow-y:scroll;");

    var topTen = objectify.items;

    topTen.forEach((item) => {
      if (item.volumeInfo.imageLinks != undefined) {
        var newCard = $('<div class="card" style="width:10rem">');

        var cardImage = $(`<div class="card-image">`);
        var cardFigure = $(`<figure class="image is-128by128">`);
        var newImg = $(`<img class="imgs" src="${item.volumeInfo.imageLinks.thumbnail}">`);
        cardFigure.append(newImg);
        cardImage.append(cardFigure);
        newCard.append(cardImage);

        var newContent = $(`<div class="media-content">`);

        var newTitle = $(`<p class="title is-4">`);
        newTitle.text(`Title: ${item.volumeInfo.title}`);
        newContent.append(newTitle);


        var newSubTitle = $(`<p class="subtitle is-6">`);
        newSubTitle.text(`Author: ${item.volumeInfo.authors[0]}`);
        newContent.append(newSubTitle);


        newCard.append(newContent);

        var newFooter = $('<footer class="card-footer">');
        var saveBtn = $(` <a class="card-footer-item has-text-weight-bold saveBtn">Save</a>`);
        newFooter.append(saveBtn);
        newCard.append(newFooter);


        newDiv.append(newCard);

      }
    });
  }

  $(document).on("click", "#finalBtn", () => {
    getBooks();
  });
}

var gifBox = $("#topicGif");

var gifIndex = 0;
async function nextGif() {
  const getGif = await fetch(
    `https://api.giphy.com/v1/gifs/search?q=${genreGifs[gifIndex]}&api_key=7q56uzHnKHnzF8yVCo24CIsbKGGE2klH`
  );

  const gifData = await getGif.json();

  var randomGif = Math.round(Math.random() * gifData.data.length);

  var gifURL = gifData.data[randomGif].images.original.url;
  gifBox.attr("src", gifURL);

  gifIndex++;
  if (gifIndex === genreGifs.length) {
    gifIndex = 0;
  }
}

startBtn.click((event) => {
  nextQuestion();
  nextGif();
  event.target.parentElement.remove();
});

var srcArray = [];

$(document).on("click", ".saveBtn", (event) => {
  var saveButton = event.target;
  var footer = saveButton.parentElement;
  var card = footer.parentElement;
  srcArray.push(card.outerHTML);
  localStorage.setItem("savedBooks", JSON.stringify(srcArray));
});