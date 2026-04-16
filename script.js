// Local API setup
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


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

  return `
💰 Income: ${income}
💸 Expenses: ${expense}
🟢 Savings: ${savings}
📊 Top Spending: ${topCategory}
${savings < 0 ? "⚠️ You are overspending!" : "✅ You are saving well"}
  `;
}

// Transaction History
function renderTransactions(transactions) {
  const list = document.getElementById("transactionList");
  
  list.innerHTML = ""; // Clear old list

  if (!transactions || transactions.length === 0) {
    list.innerHTML = "<li>No transactions yet</li>";
    return;
  }

  transactions.forEach(t => {
    const li = document.createElement("li");

    li.classList.add("transaction-item", t.type);
    const date = new Date(t.date).toLocaleDateString();
    
    li.innerHTML = `
  <span>${t.category} (${t.type}) - ${date}</span>
  <span> KES ${t.amount}</span>
`;

    list.appendChild(li);
  });
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