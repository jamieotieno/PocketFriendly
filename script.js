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