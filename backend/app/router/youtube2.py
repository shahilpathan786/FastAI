from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi import APIRouter
from app.dependencies import authenicate_user
from fastapi.middleware.cors import CORSMiddleware
from .youtube import get_video_id, get_transcript, create_rag_pipeline
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/youtube-summary", dependencies=[Depends(authenicate_user)])


class VideoRequest(BaseModel):
    youtube_url: str


def parse_summary_response(response_text):
    """Parse the LLM response to extract summary and key points"""
    lines = response_text.strip().split('\n')
    summary = ""
    key_points = []
    current_section = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if 'summary' in line.lower():
            current_section = 'summary'
        elif 'key point' in line.lower():
            current_section = 'key_points'
        elif 'insight' in line.lower():
            current_section = 'insights'
        elif line.startswith('-') or line.startswith(''):
            content = line.lstrip('-').strip()
            if current_section == 'summary':
                summary += content + " "
            elif current_section == 'key_points':
                key_points.append(content)
        elif current_section == 'summary' and not line.startswith('#'):
            summary += line + " "

    return {
        'summary': summary.strip() or "Summary not available",
        'key_points': key_points[:7] if key_points else []
    }


@router.post("/")
async def generate_youtube_summary(request: VideoRequest):
    try:
        video_id = get_video_id(request.youtube_url)
        text = get_transcript(video_id)
        qa_chain = create_rag_pipeline(text)

        query = "Generate a comprehensive summary and extract 5-7 key points from this video transcript. Format your response with clear 'Summary:' and 'Key Points:' sections."
        response = qa_chain.invoke(query)

        parsed = parse_summary_response(response)

        return {
            "status": "success",
            "summary": parsed['summary'],
            "key_points": parsed['key_points'],
            "message": "Summary generated successfully"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "summary": "",
            "key_points": []
        }
