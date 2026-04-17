// Local API setup
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budgetLimit = Number(localStorage.getItem("budgetLimit")) || 0;

// Add Transaction
async function addTransaction(type, amount, category) {
  if (!amount || !category) {
    alert("⚠️ Please enter amount and category");
    return;
  }

  const newTransaction = {
    type,
    amount,
    category,
    date: new Date().toISOString()
  
  };
  
  // Alert immediately when budget is exceeded
  if (budgetLimit && transactions.filter(t => t.type === "expense")
  .reduce((sum, t) => sum + t.amount, 0) > budgetLimit) {
  alert("🚨 Budget limit exceeded!");
}

  transactions.push(newTransaction);

  // Save to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  console.log("Saved:", newTransaction);

  alert("✅ Transaction added!");
}


// Get Transactions
async function getTransactions() {
  return transactions;
}

  

// Link UI to function
async function save() {
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  await addTransaction(type, Number(amount), category);

  // Clear inputs after saving
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";

  // Refresh UI
  loadDashboard();
}

// Set Spending limit
function setLimit() {
  const input = document.getElementById("budgetLimit").value;

  if (!input) {
    alert("⚠️ Please enter desired budget limit amount");
    return;
  }

  budgetLimit = Number(input);

  localStorage.setItem("budgetLimit", budgetLimit);

  alert("✅ Limit successfully set!");

  document.getElementById("budgetLimit").value = "";

  loadDashboard();
}



// Smart Insights
function generateInsights(transactions) {
  if (!transactions || transactions.length === 0) {
    return "No data yet";
  }

  let income = 0;
  let expense = 0;
  let categories = {};

  transactions.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;

      // Track category totals
      categories[t.category] =
        (categories[t.category] || 0) + t.amount;
    }
  });

  const savings = income - expense;

  // Find highest spending category
  let topCategory = Object.keys(categories).length
    ? Object.keys(categories).reduce((a, b) =>
        categories[a] > categories[b] ? a : b
      )
    : "None";

      // Limit Check
  let limitWarning = "";
  if (budgetLimit && expense > budgetLimit) {
    limitWarning = "🚨 You have exceeded your budget limit!";
  }

  return `
📉 Budget Limit: KES ${budgetLimit || "Not set"}
⁉️ Limit Warning: ${limitWarning || "✅ Limit Not Exceeded"}
💰 Income: KES ${income}
💸 Expenses: KES ${expense}
🟢 Savings: KES ${savings}
📊 Top Spending: ${topCategory}
${savings < 0 ? "⚠️ You are overspending!" : "✅ You are saving well"}
  `;
}

// Transaction History
function renderTransactions(transactions) {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  if (!transactions || transactions.length === 0) {
    list.innerHTML = "<li>No transactions yet</li>";
    return;
  }

  transactions.forEach((t, index) => {
    const li = document.createElement("li");

    li.classList.add("transaction-item", t.type);

    const date = new Date(t.date).toLocaleDateString();

    li.innerHTML = `
      <span>
        ${t.category} (${t.type}) - ${date}
        <strong>KES ${t.amount}</strong>
      </span>

      <div>
        <button onclick="editTransaction(${index})">✏️</button>
        <button onclick="deleteTransaction(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}
// Delete Function
function deleteTransaction(index) {
  if (!confirm("Delete this transaction?")) return;

  transactions.splice(index, 1);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  loadDashboard();
}

// Edit Function
function editTransaction(index) {
  const t = transactions[index];

  const newAmount = prompt("Edit amount:", t.amount);
  const newCategory = prompt("Edit category:", t.category);
  const newType = prompt("Edit type (income/expense):", t.type);

  if (!newAmount || !newCategory || !newType) return;

  transactions[index] = {
    ...t,
    amount: Number(newAmount),
    category: newCategory,
    type: newType
  };

  localStorage.setItem("transactions", JSON.stringify(transactions));

  loadDashboard();
}

// Search Function
function searchTransactions() {
  const query = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const filtered = transactions.filter(t =>
    t.category.toLowerCase().includes(query) ||
    t.type.toLowerCase().includes(query)
  );

  renderTransactions(filtered);
}

// Chart Funtionality
let expenseChart;

function renderChart(transactions) {
  const categories = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      categories[t.category] =
        (categories[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  const ctx = document.getElementById("expenseChart");

  if (!ctx) return;

  // Destroy old chart before creating new one
  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data
        }
      ]
    }
  });
}



// Load dashboard

async function loadDashboard() {
  const transactions = await getTransactions();

  // Insights
  document.getElementById("summary").innerText =
    generateInsights(transactions);

  // Chart
  renderChart(transactions);

  //Transaction List
  renderTransactions(transactions);
}
// Load

loadDashboard();