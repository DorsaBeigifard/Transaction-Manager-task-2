// API URL
const apiURL = "http://localhost:3000/transactions";

// DOM Elements
const loadTransactionsBtn = document.querySelector("#load-transactions");
const searchBoxContainer = document.querySelector(".search-box");
const transactionContent = document.querySelector(".transactions");
const tableBody = document.querySelector(".table-body");
const searchInput = document.querySelector(".searchbox");

const thBtns = [...document.querySelectorAll("th")];

// Static class for API handler and fetching data
class APIHandler {
  static fetchData(apiURL, params = "") {
    console.log("Fetching data from:", `${apiURL}${params}`);
    return axios
      .get(`${apiURL}${params}`)
      .then((res) => {
        if (res.data) {
          return res.data;
        } else {
          throw new Error("No data received");
        }
      })
      .catch((err) => {
        console.log("Error while fetching data:", err);
        return []; // Return an empty array if there's an error
      });
  }
}

// Class to render transaction data in a table, DOM
class TableRenderer {
  constructor() {
    this.tableBody = tableBody;
  }

  renderUI(data) {
    let result = "";
    data.forEach((item) => {
      const formattedPrice = new Intl.NumberFormat().format(item.price);

      let type = "";

      if (item.type === "افزایش اعتبار") {
        type = "deposit";
      } else if (item.type === "برداشت از حساب") {
        type = "withdrawal";
      }
      result += `<tr>
                  <td>${item.id}</td>
                  <td class="${type}">${item.type}</td>
                  <td>${formattedPrice}</td>  <!-- Use formatted price -->
                  <td>${item.refId}</td>
                  <td>${new Date(item.date).toLocaleDateString(
                    "fa-IR"
                  )} ساعت ${new Date(item.date).toLocaleTimeString(
        "fa-IR"
      )}</td>
                </tr>`;
    });
    this.tableBody.innerHTML = result;
  }

  searchInData(e) {
    const query = e.target.value.trim();
    const param = `?refId_like=${query}`;
    APIHandler.fetchData(apiURL, param)
      .then((data) => {
        this.renderUI(data);
      })
      .catch((err) => console.log("Error:", err));
  }

  sortData() {
    thBtns.forEach((th) => {
      let column = th.dataset.column;
      let order = th.dataset.order;

      // toggle order
      if (order === "desc") {
        order = "asc";
      } else {
        order = "desc";
      }
      th.dataset.order = order;

      // which column are we sorting?
      let sortField;
      if (column === "price") {
        sortField = "price";
      } else if (column === "date") {
        sortField = "date";
      }

      if (!sortField) return; // do nothing

      const param = `?_sort=${sortField}&_order=${order}`;
      APIHandler.fetchData(apiURL, param)
        .then((data) => {
          this.renderUI(data);
        })
        .catch((err) => console.log("Error:", err));
    });
  }
}

// Main class
class TransactionsApp {
  constructor(apiURL) {
    this.tableRenderer = new TableRenderer();
    loadTransactionsBtn.addEventListener("click", () => {
      this.setApp();
    });
  }

  setApp() {
    APIHandler.fetchData(apiURL)
      .then((data) => {
        loadTransactionsBtn.classList.add("hidden");
        searchBoxContainer.classList.remove("hidden");
        transactionContent.classList.remove("hidden");

        // Display in DOM
        this.tableRenderer.renderUI(data);
      })
      .catch((err) => console.log("Error:", err));
    const searchInput = document.querySelector(".searchbox");
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
      this.tableRenderer.searchInData(e);
    });

    thBtns.forEach((th) => {
      th.addEventListener("click", () => {
        const column = th.dataset.column;
        const order = th.dataset.order;

        // Call sortData with the column and current order
        this.tableRenderer.sortData();
      });
    });
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new TransactionsApp(apiURL);
});
