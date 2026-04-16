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