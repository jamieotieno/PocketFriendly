const apiUrl = "https://personal-finance.apidog.io/";

// Getting The Transactions
async function getTransactions() {
  try {
    const response = await fetch(`${apiUrl}/transactions`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
  }
}

// Adding Income and Expenses
async function addTransaction(type, amount, category) {
  try {
    const response = await fetch(`${apiUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        amount,
        category,
        date: new Date().toISOString()
      })
    });

    const data = await response.json();
    console.log("Saved:", data);
  } catch (error) {
    console.error("Error saving transaction:", error.message);
  }
}

// Link the UI to the API
function save() {
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  addTransaction(type, Number(amount), category);
}

// Smart Insights
function generateInsights(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  let categories = {};

  transactions.forEach(t => {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;

      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  const savings = totalIncome - totalExpense;

  let topCategory = Object.keys(categories).reduce((a, b) =>
    categories[a] > categories[b] ? a : b
  , "");
if (totalExpense > 10000) {
  alert("You are overspending!");
} 
  return `
    Total Income: ${totalIncome}
    Total Expenses: ${totalExpense}
    Savings: ${savings}
    Top Spending Category: ${topCategory}
  `;

}

//Displaying the insights
async function loadDashboard() {
  const transactions = await getTransactions();

  const insights = generateInsights(transactions);

  document.getElementById("summary").innerText = insights;
}

loadDashboard();