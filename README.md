# YouTube Summarizer Feature - Implementation Summary

## INSTALLATION
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### Frontend Components

1. **New Page: YouTube Summarizer** (`/youtube`)
   - Users can paste YouTube links
   - Get instant video summaries
   - Extract key points/notes from the video
   - Requires user login
   - Beautiful UI with gradient styling
   - Real-time loading state

2. **Navbar Update**
   - Added "YouTube Summary" link in the navigation menu
   - Users can easily access the feature from any page

### Backend API

1. **New Endpoint: `/youtube-summary/` (POST)**
   - Accepts YouTube URLs
   - Extracts video transcript
   - Generates comprehensive summaries using LLM
   - Extracts 5-7 key points/takeaways
   - Error handling for invalid URLs and transcript issues

### Dependencies Added

Updated `requirement.txt` with:
- `youtube-transcript-api` - For fetching video transcripts
- `langchain_groq` - For LLM integration
- `python-dotenv` - For environment variables

## How to Use

1. **Start the Backend**
   ```bash
   cd backend
   pip install -r requirement.txt
   python chatbot2.py
   ```

2. **Access the Feature**
   - Go to the home page
   - Log in with your name
   - Click "YouTube Summary" in the navbar
   - Paste a YouTube link
   - Click "Analyze Video"
   - Get instant summary and key points

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`

## Features

✅ Video transcript extraction
✅ AI-powered summarization (using Groq LLM)
✅ Key point extraction
✅ User authentication
✅ Beautiful, modern UI
✅ Error handling
✅ Loading states
✅ Responsive design
