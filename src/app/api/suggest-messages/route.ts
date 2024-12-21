import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { NextResponse } from "next/server";



const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY as string);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
})



export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Make sure they are unique everytime asked to create."

        const result = await model.generateContent(prompt)
        console.log(result.response.text());
        
        return Response.json({
            messages: result.response.text()
        },
    {
        status:200
    })
    }
    catch (error) {
        if (error instanceof GoogleGenerativeAIFetchError) {
            const { status, statusText } = error
            return NextResponse.json({ data: statusText }, { status })
        } else {
            console.error("AI Error", error)
            throw error;
        }
    }
}