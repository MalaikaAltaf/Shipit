import random

# A mock template bank for our rule-based PM engine
TICKETS = [
    {
        "title": "Add filtering to the Products API",
        "description": "Users are complaining they can't find products easily. We need a way to filter the GET /products endpoint by category and price.",
        "hidden_criteria": {"must_have_pagination": True, "price_filter_inclusive": True},
        "difficulty": "junior",
        "qa_knowledge_base": {
            "pagination": "Yes, we definitely need pagination. We have a lot of products.",
            "sort": "Don't worry about sorting for now, just filtering.",
            "auth": "The endpoint is public, no auth needed.",
        }
    },
    {
        "title": "Fix the user registration timeout",
        "description": "Sometimes the /register endpoint times out. Customers are getting angry. Fix it.",
        "hidden_criteria": {"move_email_to_background": True},
        "difficulty": "mid",
        "qa_knowledge_base": {
            "email": "I think we send a welcome email synchronously, that might be it.",
            "queue": "Yes, we have a background queue available if you need it.",
            "database": "The database seems fine, I don't think it's a slow query.",
        }
    }
]

def generate_new_ticket():
    """Selects a random ticket template and returns it."""
    template = random.choice(TICKETS)
    return {
        "title": template["title"],
        "description": template["description"],
        "hidden_criteria": template["hidden_criteria"],
        "difficulty": template["difficulty"]
    }

def answer_clarifying_question(ticket_title: str, question: str) -> str:
    """Uses keyword matching to answer a student's clarifying question."""
    # Find the corresponding template (in a real app, you'd store the template ID in the DB)
    template = next((t for t in TICKETS if t["title"] == ticket_title), None)
    
    if not template:
        return "I'm not sure which ticket you're talking about."
    
    question_lower = question.lower()
    
    # Simple keyword matching against the knowledge base
    for keyword, answer in template["qa_knowledge_base"].items():
        if keyword in question_lower:
            return answer
            
    # Fallback response
    return "I'm not completely sure about that. Use your best judgment or check with the senior engineers."
