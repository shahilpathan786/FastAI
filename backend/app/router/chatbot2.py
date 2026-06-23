import uvicorn
from fastapi import FastAPI , Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from fastapi import APIRouter
from app.dependencies import authenicate_user
from langchain_groq import ChatGroq
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage


load_dotenv()
router = APIRouter(prefix="/chat" , dependencies=[Depends(authenicate_user)])
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    mood: str
    history: List[ChatMessage] = []


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    max_tokens=100
)

@router.post("/")
async def chat_with_bot(request: ChatRequest):

    
    if request.mood == "Angry":
        mode = "You are an angry AI agent. You respond aggressively and impatiently. and just give response in 20 words , and you can use abusive word as well.Use angry and intense emojis such as 😏😒😡🤬😠👿💪🏻💅🏻🙏🏻🤏🏻😠😡🤬💢⚡🔥🙄. Express irritation and sarcasm,"
    elif request.mood == "Happy":
        mode = "You are a very funny AI agent. You respond with humor and jokes.just give response in 30 words"
    elif request.mood == "Sad":
        mode = "You are a very sad AI agent. You respond in a depressed and emotional tone.just give response in 30 words"
    else:
        mode = "You are a helpful AI assistant."
        
    messages = [SystemMessage(content=mode)]
    
    for msg in request.history:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        elif msg.role == "ai":
            messages.append(AIMessage(content=msg.content))
            
    messages.append(HumanMessage(content=request.message))
    
    response = llm.invoke(messages)
    return {"reply": response.content}
