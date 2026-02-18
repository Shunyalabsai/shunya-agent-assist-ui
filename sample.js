const incomingCallData = {
    "id": "call-1234567890",
    "customer_name": "John Doe",
    "customer_id": "CUST-1234567890",
    "customer_phone": "+1 (555) 123-4567",
    "customer_dob": "1990-01-01",
    "is_repeat_caller": false,
    "support_type": "Premium Support", // Possible - Premium Support, Standard Support, Enterprise Support
    "queue_name": "Billing" // Possible - Billing, Support, Sales, etc.
};

const liveAnalysis = {
    "live_analysis": {
        "intent": {
            "intent_name": "Product Information",
            "confidence": "95.0" // percentage
        },
        "sentiment": {
            "customer": {
                "value": "85.0", // percentage
                "type": "positive" // Possible - positive, negative, neutral
            },
            "agent": {
                "value": "90.0", // percentage
                "type": "positive" // Possible - positive, negative, neutral
            }
        },
        "compliance": {
            "status": "non-compliant", // Possible - compliant, non-compliant, monitoring
            "issues": [
                "Missed required disclosure: Call recording",
                "Did not verify customer identity with partial DOB"
            ]
        }
    }
};



const recommendations = {
    "recommendations": [
        {
            "id": "1",
            "title": "Offer Late Fee Waiver",
            "description": "Customer eligible for one-time waiver of $15.00",
            "priority": "high"
        },
        {
            "id": "2",
            "title": "Check Usage Details",
            "description": "Review data usage for the billing period",
            "priority": "medium"
        },
        {
            "id": "3",
            "title": "Upsell Opportunity",
            "description": "Customer eligible for one-time waiver of $15.00",
            "priority": "medium"
        }
    ]
};


const sopSteps = {
    "sop_steps": [
        {
            "id": "1",
            "title": "Greet & authenticate",
            "description": "Welcome customer and verify identity",
            "status": "completed" // Possible - completed, current, pending
        },
        {
            "id": "2",
            "title": "Analyze Bill",
            "description": "Review current and previous billing statements",
            "status": "current" // Possible - completed, current, pending
        },
        {
            "id": "3",
            "title": "Propose Adjustment",
            "description": "Calculate and offer credit if applicable",
            "status": "pending" // Possible - completed, current, pending
        },
        {
            "id": "4",
            "title": "Closing",
            "description": "Summarize resolution and end call",
            "status": "pending" // Possible - completed, current, pending
        }
    ]
};

const upsellOpportunity = {
    "upsell_opportunity": {
        "id": "1",
        "title": "Upsell Opportunity",
        "description": "Customer eligible for one-time waiver of $15.00",
        "priority": "medium" // Possible - high, medium, low
    }
};

const suggestedActions = {
    "suggested_actions": [
        {
            "id": "1",
            "title": "Suggested Action",
            "description": "Customer eligible for one-time waiver of $15.00",
            "priority": "medium" // Possible - high, medium, low
        }
    ]
};

const postCallData = {
    "post_call_data": {
        "id": "1",
        "title": "Post Call Data",
        "description": "Customer eligible for one-time waiver of $15.00",
        "priority": "medium" // Possible - high, medium, low
    }
};