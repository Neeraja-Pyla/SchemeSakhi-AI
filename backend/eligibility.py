
def check_pm_kisan_eligibility(data):

    checks = []
    excluded = False
    needs_review = False

    def add_check(condition, status, reason):
        nonlocal excluded, needs_review

        checks.append({
            "condition": condition,
            "status": status,
            "reason": reason
        })

        if status == "not_met":
            excluded = True
        elif status == "unknown":
            needs_review = True

    # 1. Agricultural land
    if data["land"] == "yes":
        add_check(
            "Agricultural land",
            "met",
            "You reported that your farmer family owns cultivable agricultural land."
        )
    elif data["land"] == "no":
        add_check(
            "Agricultural land",
            "not_met",
            "The scheme requires a landholding farmer family."
        )
    else:
        add_check(
            "Agricultural land",
            "unknown",
            "Land ownership needs verification."
        )

    # 2. Institutional landholding
    if data["institutional"] == "yes":
        add_check(
            "Institutional landholding",
            "not_met",
            "Institutional landholders are excluded."
        )
    elif data["institutional"] == "no":
        add_check("Institutional landholding", "met",
                  "No institutional landholding reported.")
    else:
        add_check("Institutional landholding", "unknown",
                  "Institutional landholding needs verification.")

    # 3. Constitutional posts and specified public representatives
    if data["publicOffice"] == "yes":
        add_check(
            "Specified public office",
            "not_met",
            "Specified constitutional post holders and public representatives are excluded."
        )
    elif data["publicOffice"] == "no":
        add_check("Specified public office", "met",
                  "No specified public office reported.")
    else:
        add_check("Specified public office", "unknown",
                  "Public office status needs verification.")

    # 4. Government employment
    employee = data["governmentEmployee"]

    if employee == "regular":
        add_check(
            "Government employment",
            "not_met",
            "Specified serving or retired government employees are excluded."
        )
    elif employee == "mts":
        add_check(
            "Government employment",
            "met",
            "MTS / Class IV / Group D employees are exempt from this exclusion."
        )
    elif employee == "no":
        add_check(
            "Government employment",
            "met",
            "No specified government employment reported."
        )
    else:
        add_check(
            "Government employment",
            "unknown",
            "Government employment category needs verification."
        )

    # 5. Income tax
    if data["incomeTax"] == "yes":
        add_check(
            "Income tax",
            "not_met",
            "Persons who paid income tax in the last assessment year are excluded."
        )
    elif data["incomeTax"] == "no":
        add_check("Income tax", "met",
                  "No income tax payment reported for the last assessment year.")
    else:
        add_check("Income tax", "unknown",
                  "Income tax status needs verification.")

    # 6. Pension
    if data["pension"] == "yes":
        add_check(
            "Government pension",
            "not_met",
            "A specified retired government employee receives a pension of ₹10,000 or more per month."
        )
    elif data["pension"] == "no":
        add_check("Government pension", "met",
                  "No applicable pension exclusion reported.")
    else:
        add_check("Government pension", "unknown",
                  "Pension category and amount need verification.")

    # 7. Practising registered professionals
    if data["professional"] == "yes":
        add_check(
            "Registered professional",
            "not_met",
            "Specified practising registered professionals are excluded."
        )
    elif data["professional"] == "no":
        add_check("Registered professional", "met",
                  "No specified practising professional reported.")
    else:
        add_check("Registered professional", "unknown",
                  "Professional status needs verification.")

    # Final result
    if excluded:
        result = "not_likely_eligible"
        summary = "One or more exclusion conditions were reported."

    elif needs_review:
        result = "needs_verification"
        summary = "Some answers need verification before assessing eligibility."

    else:
        result = "potentially_eligible"
        summary = "Your answers meet the basic conditions checked. Official verification is still required."

    return {
        "scheme": "PM-KISAN Samman Nidhi",
        "result": result,
        "summary": summary,
        "checks": checks,
        "official_source": "https://pmkisan.gov.in/",
        "disclaimer": "This is an informational pre-check, not an official eligibility decision."
    }
