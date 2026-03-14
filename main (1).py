import json
from ast import List

from dotenv import load_dotenv
from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langchain_deepseek import ChatDeepSeek

load_dotenv()

# ─────────────────────────────────────────────
# 1. Define Tools
# ─────────────────────────────────────────────


@tool
def get_weather(city: str) -> str:
    """Get the current weather for a given city."""
    # Mock weather data (replace with real API if needed)
    weather_data = {
        "delhi": "35°C, Sunny and humid",
        "mumbai": "30°C, Partly cloudy",
        "bangalore": "25°C, Mild and pleasant",
        "london": "12°C, Rainy",
        "new york": "18°C, Windy",
    }
    return weather_data.get(city.lower(), f"Weather data not available for {city}")


@tool
def calculate(expression: str) -> str:
    """Evaluate a basic math expression like '2 + 2' or '10 * 5'."""
    try:
        result = eval(expression, {"__builtins__": {}})
        return f"Result: {result}"
    except Exception as e:
        return f"Error evaluating expression: {e}"


@tool
def translate_to_hinglish(text: str) -> str:
    """Translate English text to Hinglish (Hindi + English mix)."""
    # This is a mock — in production you'd call an actual translation service
    return f"[Hinglish translation of: '{text}'] — Yaar, '{text}' ko Hinglish mein bolein toh: 'yeh bohot achha hai!'"


# ─────────────────────────────────────────────
# 2. Setup Model with Tools
# ─────────────────────────────────────────────

tools = [get_weather, calculate, translate_to_hinglish]
tool_map = {t.name: t for t in tools}

model = ChatDeepSeek(model="deepseek-chat")
model_with_tools = model.bind_tools(tools)

# ─────────────────────────────────────────────
# 3. Agentic Loop
# ─────────────────────────────────────────────


def run_agent(user_input: str):
    print(f"\n{'='*60}")
    print(f"  USER: {user_input}")
    print(f"{'='*60}")

    messages: list[BaseMessage] = [HumanMessage(content=user_input)]

    while True:
        response = model_with_tools.invoke(messages)
        messages.append(response)

        # If model wants to call tools
        if response.tool_calls:
            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call["args"]
                tool_id = tool_call["id"]

                print(f"\n  🔧 Tool Called : {tool_name}")
                print(f"  📥 Arguments  : {json.dumps(tool_args, indent=4)}")

                # Execute the tool
                result = tool_map[tool_name].invoke(tool_args)
                print(f"  📤 Result     : {result}")

                messages.append(ToolMessage(content=str(result), tool_call_id=tool_id))
        else:
            # Final answer
            print(f"\n  🤖 ASSISTANT: {response.content}")
            break

    return response.content


# ─────────────────────────────────────────────
# 4. Run Demo Queries
# ─────────────────────────────────────────────

if __name__ == "__main__":
    print("\n" + "🚀 LangChain + DeepSeek Tool Demo".center(60))
    print("=" * 60)

    # Demo 1: Weather
    run_agent("What is the weather like in Delhi right now?")

    # Demo 2: Calculator
    run_agent("Can you calculate 144 divided by 12 for me?")

    # Demo 3: Translation (matching the original code style)
    run_agent(
        "Translate this to Hinglish: "
        "Hi, my name is Mohd Anas, I'm a full stack web developer, what can I do for you!"
    )

    # Demo 4: Multi-tool (chained reasoning)
    run_agent("What's the weather in Mumbai? Also, what is 25 multiplied by 4?")
