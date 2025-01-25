// API URL
const apiURL = "http://localhost:3000/transactions";

// DOM Elements
const loadTransactionsBtn = document.querySelector("#load-transactions");
const searchBoxContainer = document.querySelector(".search-box");
const transactionContent = document.querySelector(".transactions");
const tableBody = document.querySelector(".table-body");

// Class for API handler
class APIHandler {
  constructor(apiURL) {
    this.api = apiURL;
  }
  fetchData(params = "") {
    console.log("Fetching data from:", `${this.api}${params}`);
    return axios
      .get(`${this.api}${params}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log("Error while fetching data:", err);
      });
  }
}

// Class to render transaction data in a table
class TableRenderer {
  constructor(apiHandler) {
    this.tableBody = tableBody;
    this.apiHandler = apiHandler;
  }

  renderUI(data) {
    let result = "";
    data.forEach((item) => {
      console.log("Transaction item:", item); // Check each item's structure
      result += `<tr>
                    <td>${item.id}</td>
                    <td>${item.type}</td>
                    <td>${item.price}</td>
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
}

// Main class
class TransactionsApp {
  constructor(apiURL) {
    this.apiHandler = new APIHandler(apiURL);
    this.tableRenderer = new TableRenderer(this.apiHandler);
    loadTransactionsBtn.addEventListener("click", () => this.setApp());
  }

  setApp() {
    this.apiHandler
      .fetchData()
      .then((data) => {
        loadTransactionsBtn.classList.add("hidden");
        searchBoxContainer.classList.remove("hidden");
        transactionContent.classList.remove("hidden");

        // Display in DOM
        this.tableRenderer.renderUI(data);
      })
      .catch((err) => console.log("Error:", err));
  }
}

// Initialize
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM Loaded");

// });

new TransactionsApp(apiURL);
