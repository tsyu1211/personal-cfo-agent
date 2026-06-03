"""Rule-based transaction categorization from description text."""


def categorize_transaction(description: str) -> str:
    """Return a spending category based on keywords in the description."""
    text = (description or "").upper()

    rules = [
        ("Food", ["STARBUCKS", "WHOLE FOODS", "RESTAURANT", "CAFE", "GROCERY", "DINER", "PIZZA"]),
        ("Transportation", ["UBER", "LYFT", "MBTA", "GAS", "SHELL", "EXXON", "PARKING", "METRO"]),
        ("Shopping", ["AMAZON", "TARGET", "WALMART", "COSTCO", "BEST BUY", "IKEA"]),
        ("Housing", ["RENT", "APARTMENT", "MORTGAGE", "LANDLORD", "PROPERTY"]),
        ("Entertainment", ["NETFLIX", "SPOTIFY", "AMC", "HULU", "DISNEY", "STEAM", "CINEMA"]),
        ("Healthcare", ["CVS", "WALGREENS", "HOSPITAL", "PHARMACY", "DOCTOR", "DENTAL", "CLINIC"]),
        ("Travel", ["AIRLINE", "HOTEL", "AIRBNB", "DELTA", "UNITED", "MARRIOTT", "EXPEDIA"]),
        ("Investment", ["ROBINHOOD", "FIDELITY", "SCHWAB", "VANGUARD", "ETRADE", "BROKERAGE"]),
    ]

    for category, keywords in rules:
        for keyword in keywords:
            if keyword in text:
                return category

    return "Other"
