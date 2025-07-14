import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBvuJgef6dcZrcnsOVRn1pgy-_wSgDahQM');

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a helpful AI assistant for students and teachers. Answer the following user query as clearly and helpfully as possible.\n\nUser: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get AI response.' }, { status: 500 });
  }
} 