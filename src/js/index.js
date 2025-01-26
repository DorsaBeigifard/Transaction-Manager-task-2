const apiURL = "http://localhost:3000/transactions";

const loadTransactionsBtn = document.querySelector("#load-transactions");
const searchBoxContainer = document.querySelector(".search-box");
const transactionContent = document.querySelector(".transactions");
const tableBody = document.querySelector(".table-body");
const searchInput = document.querySelector(".searchbox");
const thBtns = [...document.querySelectorAll("th")];

// to handle both search and sort at the same time
let currentSearchParam = "";
let currentSortParam = "";

class APIHandler {
  //A class for giving api and parameters
  static fetchData(apiURL, params = "") {
    console.log("Fetching data from:", `${apiURL}${params}`);
    return axios
      .get(`${apiURL}${params}`)
      .then((res) => res.data || [])
      .catch((err) => {
        console.log("Error while fetching data:", err);
        return [];
      });
  }
}

class TableRenderer {
  // a class that manages UI, sort and search.
  constructor() {
    this.tableBody = tableBody;
  }

  renderUI(data) {
    // Adds to DOM
    let result = "";
    data.forEach((item) => {
      const formattedPrice = new Intl.NumberFormat().format(item.price);
      let type = "";
      // for managing the colors
      if (item.type === "افزایش اعتبار") {
        type = "deposit";
      } else if (item.type === "برداشت از حساب") {
        type = "withdrawal";
      } else {
        type = "";
      }

      result += `<tr>
                  <td>${item.id}</td>
                  <td class="${type}">${item.type}</td>
                  <td>${formattedPrice}</td>
                  <td>${item.refId}</td>
                  <td>${new Date(item.date).toLocaleDateString("fa-IR")} ساعت 
                      ${new Date(item.date).toLocaleTimeString("fa-IR")}</td>
                </tr>`;
    });
    this.tableBody.innerHTML = result;
  }

  searchInData(e) {
    const query = e.target.value.trim();
    // Do we have any search query or not
    currentSearchParam = query ? `&refId_like=${query}` : "";

    const combinedParams = `${currentSortParam}${currentSearchParam}`;
    APIHandler.fetchData(apiURL, combinedParams)
      .then((data) => {
        this.renderUI(data);
      })
      .catch((err) => console.log("Error:", err));
  }

  sortData(th) {
    const column = th.dataset.column;
    const order = th.dataset.order;

    //toggle direction
    th.dataset.order = order === "asc" ? "desc" : "asc";
    const newOrder = th.dataset.order;

    currentSortParam = `?_sort=${column}&_order=${newOrder}`;
    const combinedParams = `${currentSortParam}${currentSearchParam}`;

    APIHandler.fetchData(apiURL, combinedParams)
      .then((data) => {
        this.renderUI(data);

        // update sorting icon
        thBtns.forEach((btn) => {
          const icon = btn.querySelector("i");
          if (btn === th) {
            icon.classList.toggle("fa-chevron-up", newOrder === "asc");
            icon.classList.toggle("fa-chevron-down", newOrder === "desc");
          } else {
            icon.classList.remove("fa-chevron-up", "fa-chevron-down");
          }
        });
      })
      .catch((err) => console.log(err));
  }
}

class TransactionsApp {
  constructor(apiURL) {
    this.tableRenderer = new TableRenderer();

    loadTransactionsBtn.addEventListener("click", () => this.setApp());
  }

  setApp() {
    APIHandler.fetchData(apiURL)
      .then((data) => {
        loadTransactionsBtn.classList.add("hidden");
        searchBoxContainer.classList.remove("hidden");
        transactionContent.classList.remove("hidden");
        this.tableRenderer.renderUI(data);
      })
      .catch((err) => console.log("Error:", err));

    searchInput.addEventListener("input", (e) => {
      this.tableRenderer.searchInData(e);
    });

    thBtns.forEach((th) => {
      th.addEventListener("click", () => {
        this.tableRenderer.sortData(th);
      });
    });
  }
}

// init
document.addEventListener("DOMContentLoaded", () => {
  new TransactionsApp(apiURL);
});
