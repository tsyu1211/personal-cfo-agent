"""Financial calculations for the Personal CFO dashboard."""


def calculate_monthly_expenses(df) -> float:
    """Sum spending amounts (positive numbers) for expenses only."""
    if df is None or df.empty or "Amount" not in df.columns:
        return 0.0
    expenses = df[df["Amount"] < 0].copy()
    return float(expenses["Amount"].abs().sum())


def calculate_net_worth(cash, investment, retirement, debt) -> float:
    """Net worth = assets minus debt."""
    return float(cash) + float(investment) + float(retirement) - float(debt)


def calculate_cash_goal_progress(monthly_cash_flow, annual_cash_goal, current_month) -> float:
    """
    Progress toward annual cash goal based on YTD cumulative cash flow.
    Assumes monthly_cash_flow is the current month's flow; we scale by month for a simple YTD estimate.
    """
    if annual_cash_goal <= 0:
        return 0.0
    month = max(1, min(12, int(current_month)))
    ytd_cash_flow = float(monthly_cash_flow) * month
    return (ytd_cash_flow / float(annual_cash_goal)) * 100.0


def calculate_networth_goal_progress(current_networth, annual_networth_goal) -> float:
    """Progress as percent of annual net worth goal."""
    if annual_networth_goal <= 0:
        return 0.0
    return (float(current_networth) / float(annual_networth_goal)) * 100.0


def get_goal_status(progress_percent: float, tolerance_percent: float) -> str:
    """
    Green: progress >= 100 - tolerance
    Yellow: progress >= 90 - tolerance
    Red: below that
    """
    green_threshold = 100.0 - tolerance_percent
    yellow_threshold = 90.0 - tolerance_percent

    if progress_percent >= green_threshold:
        return "Green"
    if progress_percent >= yellow_threshold:
        return "Yellow"
    return "Red"
