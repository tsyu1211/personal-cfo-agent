export function categorizeTransaction(description: string): string {
  const text = (description || "").toUpperCase();

  const rules: [string, string[]][] = [
    ["Food", ["STARBUCKS", "WHOLE FOODS", "RESTAURANT", "CAFE", "GROCERY", "DINER", "PIZZA"]],
    ["Transportation", ["UBER", "LYFT", "MBTA", "GAS", "SHELL", "EXXON", "PARKING", "METRO"]],
    ["Shopping", ["AMAZON", "TARGET", "WALMART", "COSTCO", "BEST BUY", "IKEA"]],
    ["Housing", ["RENT", "APARTMENT", "MORTGAGE", "LANDLORD", "PROPERTY"]],
    ["Entertainment", ["NETFLIX", "SPOTIFY", "AMC", "HULU", "DISNEY", "STEAM", "CINEMA"]],
    ["Healthcare", ["CVS", "WALGREENS", "HOSPITAL", "PHARMACY", "DOCTOR", "DENTAL", "CLINIC"]],
    ["Travel", ["AIRLINE", "HOTEL", "AIRBNB", "DELTA", "UNITED", "MARRIOTT", "EXPEDIA"]],
    ["Investment", ["ROBINHOOD", "FIDELITY", "SCHWAB", "VANGUARD", "ETRADE", "BROKERAGE"]],
  ];

  for (const [category, keywords] of rules) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) return category;
    }
  }

  return "Other";
}
