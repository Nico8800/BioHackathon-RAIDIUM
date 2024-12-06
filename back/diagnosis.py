from langchain import hub
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain_community.tools.semanticscholar.tool import SemanticScholarQueryRun
from langdetect import detect
from openai import OpenAI

# Function to detect language
def detect_language(text):
    return detect(text)

# Function to translate text using OpenAI
def translate_text(text, target_language):
    # Initialize clients
    openai_client = OpenAI()
    prompt = f"Translate the following text to {target_language}:\n\n{text}"
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return response.choices[0].message.content

def search_for_diagnostics(symptoms, characteristics):
    if len(characteristics) == 0:
        characteristics = "No special patient's characteristics are given"
    instructions = """You are an expert researcher combine with a doctor."""
    base_prompt = hub.pull("langchain-ai/openai-functions-template")
    prompt = base_prompt.partial(instructions=instructions)
    llm = ChatOpenAI(model_name="gpt-4o",temperature=0)
    tools = [SemanticScholarQueryRun()]
    agent = create_openai_functions_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=False,)
    output= agent_executor.invoke(
    {
        "input": f"Consider a patient with the following symptoms: {symptoms} and medical caracteristics: {characteristics}."
        "Consider 100 medicine research papers related to the patient's symptoms and medical caracteristics."
        "Among them show a list of the 10 most relevant research papers"
        "Make the article summary really short"
        "Rank the research articles from most relevant to least relevant."
        "Based on the research articles and your knowledge propose a list of at least 5 possible diagnoses. Explain the medical reasonning behind each diagnosis you make and cite the research paper if there is one." 
        "Structure like this: insert the name of the diagnosis: (e.g. heart attack:), Citation: and Reasoning: (Bold in every case). Rank them from most likely to least likely. Do this under the title ### Diagnostic proposal."
        "Using research articles and your knowledge give proposition of other possibles symptoms and give advice about the medical exams to take. Do this under the title ### Medical suggestion."
        "Structure like this: Possible Additional Symptoms: and Medical Exams: (Bold in every case). Rank them from most likely to least likely."
        "Insure two newline characters in a row after each titles."
        "Make sure that only what's should be bold is in bold."
        "to work on. Break down the task into subtasks for search. Use the search tool."
    }
)
    return output['output']

# Function to extract and clean sections
def extract_sections(text):
    # Split the text into the three sections: Related Research Papers, Diagnostic Proposal, and Medical Suggestion
    parts = text.split("### Medical suggestion")
    diagnostic_parts = parts[0].split("### Diagnostic proposal")
    diagnostic_proposal = diagnostic_parts[1].strip() if len(diagnostic_parts) > 1 else ""  # After Diagnostic Proposal
    medical_suggestion = parts[1].strip() if len(parts) > 1 else ""  # After Medical Suggestion

    return diagnostic_proposal, medical_suggestion