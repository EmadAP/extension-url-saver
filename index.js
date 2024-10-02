let myURL = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const urlsFromLocalStorage = JSON.parse(localStorage.getItem("myURL"));
const tabBtn = document.getElementById("tab-btn");

if (urlsFromLocalStorage) {
  myURL = urlsFromLocalStorage;
  render(myURL);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    const title = tabs[0].title;

    myURL.push({ url: url, title: title });
    localStorage.setItem("myURL", JSON.stringify(myURL));
    render(myURL);
  });
});

function render(urls) {
  ulEl.innerHTML = "";
  for (let i = 0; i < urls.length; i++) {
    const li = document.createElement("li");

    const title = urls[i].title ? urls[i].title : "No title found";
    const url = urls[i].url;

    const titleEl = document.createElement("p");
    titleEl.textContent = title;
    titleEl.className = "title";

    const linkContainer = document.createElement("div");
    linkContainer.className = "link-container";

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.textContent = url;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("dblclick", function () {
      deleteLead(i);
    });

    linkContainer.appendChild(a);
    linkContainer.appendChild(deleteBtn);

    li.appendChild(titleEl);
    li.appendChild(linkContainer);

    ulEl.appendChild(li);
  }
}

function deleteLead(index) {
  myURL.splice(index, 1);
  localStorage.setItem("myURL", JSON.stringify(myURL));
  render(myURL);
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myURL = [];
  render(myURL);
});

inputBtn.addEventListener("click", function () {
  const url = inputEl.value;
  fetchTitle(url).then((title) => {
    myURL.push({ url: url, title: title });
    inputEl.value = "";
    localStorage.setItem("myURL", JSON.stringify(myURL));
    render(myURL);
  });
});

async function fetchTitle(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const title = text.match(/<title>(.*?)<\/title>/i)[1];
    return title;
  } catch (error) {
    console.log("Error fetching title:", error);
    return "No title found";
  }
}
