
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
    land = data.get("land", "unsure")

    if land == "yes":
        add_check(
            "Agricultural land",
            "met",
            "You reported that your farmer family owns cultivable agricultural land. Official land records must still be verified."
        )
    elif land == "no":
        add_check(
            "Agricultural land",
            "not_met",
            "You reported that your farmer family does not own cultivable agricultural land."
        )
    else:
        add_check(
            "Agricultural land",
            "unknown",
            "Land ownership needs verification."
        )

    # 2. Institutional landholding
    institutional = data.get("institutional", "unsure")

    if institutional == "yes":
        add_check(
            "Institutional landholding",
            "not_met",
            "Institutional landholders are excluded under PM-KISAN."
        )
    elif institutional == "no":
        add_check(
            "Institutional landholding",
            "met",
            "You reported no institutional landholding."
        )
    else:
        add_check(
            "Institutional landholding",
            "unknown",
            "Institutional landholding needs verification."
        )

    # 3. Specified public office
    public_office = data.get("publicOffice", "unsure")

    if public_office == "yes":
        add_check(
            "Specified public office",
            "not_met",
            "You reported a family member in a specified constitutional post or elected public representative category. Verify the exact category against official rules."
        )
    elif public_office == "no":
        add_check(
            "Specified public office",
            "met",
            "You reported no specified public office held by a family member."
        )
    else:
        add_check(
            "Specified public office",
            "unknown",
            "Public office status needs verification."
        )

    # 4. Government employment
    employee = data.get("governmentEmployee", "unsure")

    if employee == "regular":
        add_check(
            "Government employment",
            "not_met",
            "You reported regular government employment. Specified serving or retired government employees are excluded. Verify the exact employment category."
        )
    elif employee == "mts":
        add_check(
            "Government employment",
            "met",
            "MTS / Class IV / Group D employees are exempt from this specified employment exclusion."
        )
    elif employee == "no":
        add_check(
            "Government employment",
            "met",
            "You reported no specified government employment."
        )
    else:
        add_check(
            "Government employment",
            "unknown",
            "Government employment category needs verification."
        )

    # 5. Income tax
    income_tax = data.get("incomeTax", "unsure")

    if income_tax == "yes":
        add_check(
            "Income tax",
            "not_met",
            "You reported income tax payment in the last assessment year. This is an exclusion condition under PM-KISAN."
        )
    elif income_tax == "no":
        add_check(
            "Income tax",
            "met",
            "You reported no income tax payment in the last assessment year."
        )
    else:
        add_check(
            "Income tax",
            "unknown",
            "Income tax status needs verification."
        )

    # 6. Government pension
    pension = data.get("pension", "unsure")

    if pension == "yes" and employee == "mts":
        add_check(
            "Government pension",
            "met",
            "The MTS / Class IV / Group D category is exempt from the specified pension exclusion. Official service and pension records still need verification."
        )
    elif pension == "yes":
        add_check(
            "Government pension",
            "not_met",
            "You reported a monthly government pension of ₹10,000 or more. This may fall under the exclusion for specified retired government employees."
        )
    elif pension == "no":
        add_check(
            "Government pension",
            "met",
            "You reported no government pension of ₹10,000 or more per month."
        )
    else:
        add_check(
            "Government pension",
            "unknown",
            "Pension amount and former employment category need verification."
        )

    # 7. Practising registered professionals
    professional = data.get("professional", "unsure")

    if professional == "yes":
        add_check(
            "Registered professional",
            "not_met",
            "You reported an actively practising registered professional in the family. Specified practising professionals are excluded."
        )
    elif professional == "no":
        add_check(
            "Registered professional",
            "met",
            "You reported no specified actively practising registered professional."
        )
    else:
        add_check(
            "Registered professional",
            "unknown",
            "Professional registration and practising status need verification."
        )

    # 8. NRI status
    nri = data.get("nri", "unsure")

    if nri == "yes":
        add_check(
            "NRI status",
            "not_met",
            "NRI farmer families are excluded from benefits for new beneficiaries under PM-KISAN."
        )
    elif nri == "no":
        add_check(
            "NRI status",
            "met",
            "You reported that the farmer family is not an NRI family."
        )
    else:
        add_check(
            "NRI status",
            "unknown",
            "NRI status needs verification under the applicable Income Tax Act provisions."
        )

    # Final assessment
    if excluded:
        result = "not_likely_eligible"
        summary = (
            "One or more answers indicate a possible exclusion condition. "
            "Review the reasons and verify them with official authorities."
        )
    elif needs_review:
        result = "needs_verification"
        summary = (
            "Some answers are uncertain. Verify the relevant records "
            "before relying on this preliminary assessment."
        )
    else:
        result = "potentially_eligible"
        summary = (
            "Your answers meet the basic conditions checked by this tool. "
            "Other scheme requirements and government verification still apply."
        )

    return {
        "scheme": "PM-KISAN Samman Nidhi",
        "result": result,
        "summary": summary,
        "checks": checks,
        "official_source": "https://pmkisan.gov.in/",
        "disclaimer": (
            "This is an informational pre-check, not an official eligibility "
            "decision. It does not verify government databases, land records, "
            "or every scheme condition. Final eligibility is determined by "
            "the competent government authorities."
        )
    }
