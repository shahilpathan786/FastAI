
from dotenv import load_dotenv
import os
from urllib.parse import urlparse, parse_qs

from youtube_transcript_api import YouTubeTranscriptApi
from langchain_mistralai import MistralAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_groq import ChatGroq

# -------------------------
# 1. Load API Key
# -------------------------
load_dotenv()


# -------------------------
# 2. Extract Video ID
# -------------------------
def get_video_id(url):
    return parse_qs(urlparse(url).query)["v"][0]


# -------------------------
# 3. Get Transcript
# -------------------------
def get_transcript(video_id):
    api = YouTubeTranscriptApi()
    transcript = api.fetch(video_id)

    text = ""
    for t in transcript:
        text += f"[{t.start:.2f}s] {t.text}\n"

    return text


# -------------------------
# 4. Create RAG Pipeline
# -------------------------


def create_rag_pipeline(text):

    # Split text
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    chunks = splitter.split_text(text)

    # Embeddings
    embeddings = MistralAIEmbeddings(
        model="mistral-embed"
    )

    # Vector DB
    vectorstore = FAISS.from_texts(chunks, embeddings)

    # Retriever
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # LLM
    llm = ChatGroq(
       model="llama-3.1-8b-instant",
        temperature=0.3
    )

    # Prompt
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are an expert note generator.

Context:
{context}

Question:
{question}

Give output in this format:
- Summary
- Key Points
- Important Insights
- (Optional) Timestamps if available
"""
    )

    # ✅ FIXED CHAIN
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain
    

# -------------------------
# 5. Run Full Pipeline
# -------------------------
def main():
    url = input("Enter YouTube URL: ")

    print("\n🔄 Extracting video ID...")
    video_id = get_video_id(url)

    print("📥 Fetching transcript...")
    text = get_transcript(video_id)

    print("🧠 Creating RAG pipeline...")
    qa_chain = create_rag_pipeline(text)

    print("\n✍️ Generating Notes...\n")
    query = "Generate detailed notes from this video"

    response = qa_chain.invoke(query)

    print("📌 OUTPUT:\n")
    print(response)

