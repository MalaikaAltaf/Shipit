def audit_openapi_spec(spec: dict) -> dict:
    """
    A rule-based checklist to evaluate the submitted OpenAPI spec JSON.
    Returns a score and categorized feedback.
    """
    score = 100
    feedback = []

    # Rule 1: Must have info block and version
    info = spec.get("info", {})
    if not info.get("version"):
        score -= 15
        feedback.append({"category": "API Maturity", "issue": "Missing API version in the 'info' block."})

    # Rule 2: Paths must exist
    paths = spec.get("paths", {})
    if not paths:
        score -= 20
        feedback.append({"category": "Completeness", "issue": "No paths defined in the OpenAPI spec."})

    # Rule 3: Check for explicit 4xx error responses
    has_error_responses = False
    for path, methods in paths.items():
        for method, details in methods.items():
            responses = details.get("responses", {})
            if any(str(code).startswith("4") for code in responses.keys()):
                has_error_responses = True
                break

    if not has_error_responses:
        score -= 20
        feedback.append({"category": "Error Handling", "issue": "No explicit 4xx client error responses defined for any endpoint."})

    # Rule 4: GET methods shouldn't have request bodies
    for path, methods in paths.items():
        if "get" in methods:
            if "requestBody" in methods["get"]:
                score -= 15
                feedback.append({"category": "REST Conventions", "issue": f"GET endpoint {path} shouldn't have a requestBody."})

    return {
        "score": max(0, score),
        "details": feedback
    }
