import tempfile
import subprocess
import os

def run_static_analysis(code_text: str) -> dict:
    """Runs ruff, bandit, and radon on the provided Python code."""
    feedback = []
    score = 100

    # Write code to a temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp:
        temp.write(code_text)
        temp_path = temp.name

    try:
        # Run ruff (style/naming)
        ruff_result = subprocess.run(
            ["ruff", "check", temp_path, "--output-format=json"],
            capture_output=True, text=True
        )
        if ruff_result.returncode != 0:
            import json
            try:
                ruff_issues = json.loads(ruff_result.stdout)
                for issue in ruff_issues:
                    score -= 5
                    feedback.append({
                        "category": "Code Quality (Ruff)",
                        "issue": issue.get("message"),
                        "line": issue.get("location", {}).get("row")
                    })
            except json.JSONDecodeError:
                pass

        # Run bandit (security)
        bandit_result = subprocess.run(
            ["bandit", "-f", "json", temp_path],
            capture_output=True, text=True
        )
        if bandit_result.returncode != 0:
            import json
            try:
                bandit_issues = json.loads(bandit_result.stdout).get("results", [])
                for issue in bandit_issues:
                    score -= 10
                    feedback.append({
                        "category": "Security (Bandit)",
                        "issue": issue.get("issue_text"),
                        "line": issue.get("line_number")
                    })
            except json.JSONDecodeError:
                pass

        # Run radon (complexity) - MI index
        radon_result = subprocess.run(
            ["radon", "mi", "-s", temp_path],
            capture_output=True, text=True
        )
        if radon_result.returncode == 0:
            # Output format: filename - MI
            output = radon_result.stdout.strip()
            if output:
                try:
                    mi_score_str = output.split()[-1]
                    mi_score = float(mi_score_str.strip("()"))
                    if mi_score < 50:
                        score -= 10
                        feedback.append({
                            "category": "Maintainability (Radon)",
                            "issue": f"Maintainability Index is low: {mi_score}. Consider refactoring."
                        })
                except ValueError:
                    pass

    finally:
        # Clean up temporary file
        os.remove(temp_path)

    return {
        "score": max(0, score),
        "details": feedback
    }
