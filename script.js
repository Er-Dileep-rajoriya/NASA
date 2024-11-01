const search_form = document.getElementById("search-form");
const search_input = document.getElementById("search-input");
const api_key = "8PopIXUOu6qKs7irdAvVGiKAe2swiD96XaIhKJdb";
const searchesArr = [];

// get the image of current date
function getCurrentImageOfTheDay() {
  const date = new Date().toISOString().substring(0, 10);
  console.log(date);
  //   const response = await fetch(
  //     `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${api_key}`
  //   );
  //   const data = await response.json();

  fetchByDateAndShowImage(date);

  // fetch the data from the local storage
  addSearchToHistory();

  //   console.log("getCurrentImageOfTheDay : ", data);
}

// set the date in the local storage in the array formate
function saveSearch(date) {
  searchesArr.push(date);
  localStorage.setItem("searches", JSON.stringify(searchesArr));
}

async function fetchByDateAndShowImage(date, isFromHistory) {
  const today = new Date().toISOString().substring(0, 10);

  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${api_key}`
  );
  const data = await response.json();

  // show the image in the image data container (current-image-container)
  const currentImageContainer = document.getElementById(
    "current-image-container"
  );
  const url = data.hdurl;
  const title = data.title;
  const desc = data.explanation;

  if (data == today) {
    currentImageContainer.innerHTML = `
    <h2>NASA Picture of the Day.</h2>
    <img src="${url}" alt="${title}" height="300" />
    <p class="title">${title}</p>
    <p class="desc">${desc}</p>`;
  } else {
    currentImageContainer.innerHTML = `
    <h2>Picture On ${date}</h2>
    <img src="${url}" alt="${title}" />
    <p class="title">${title}</p>
    <p class="desc">${desc}</p>`;
  }

  if (isFromHistory) {
    console.log("Not saved in history and local storage");
    return;
  }

  // show in the search history list (ul list)
  addSearchToHistory(date);

  console.log("getImageOfTheDay : ", data);
}

// show in the search history list (ul list)
function addSearchToHistory() {
  const search_history = document.getElementById("search-history");

  search_history.innerHTML = "";
  // we have to fetch the date from the local storage searchArr
  let localStorageData = JSON.parse(localStorage.getItem("searches")) || [];

  console.log("localStorageData : ", localStorageData);
  localStorageData.map((date) => {
    const listItem = document.createElement("li");
    listItem.innerText = date;
    listItem.style.color = "blue";
    listItem.style.cursor = "pointer";

    search_history.appendChild(listItem);
    // search when date is clicked
    listItem.addEventListener("click", () =>
      fetchByDateAndShowImage(date, true)
    );
  });
}

// get the image by date (from the form)
async function getImageOfTheDay(e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  const date = formData.get("date");

  if (!date) {
    alert("Please select a date.");
    return;
  }

  // fetch the image from the form date and show image in container
  fetchByDateAndShowImage(date, false);

  // set the date in the local storage in the array formate
  saveSearch(date);

  e.target.reset();
}

// step 1-> get the data from the nasa api in initial render
document.addEventListener("DOMContentLoaded", getCurrentImageOfTheDay);

// step 2 -> get the image of the day (date from the form)
search_form.addEventListener("submit", getImageOfTheDay);
