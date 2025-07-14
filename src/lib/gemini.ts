import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBvuJgef6dcZrcnsOVRn1pgy-_wSgDahQM');

export const generateIcebreakerQuestions = async (user1Profile: any, user2Profile: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate 3 fun icebreaker questions for two students who are about to meet for a skill-sharing session. 
    
    Student 1: ${user1Profile.name}, Department: ${user1Profile.department}, Skills to teach: ${user1Profile.skillsToTeach?.join(', ')}, Skills to learn: ${user1Profile.skillsToLearn?.join(', ')}
    
    Student 2: ${user2Profile.name}, Department: ${user2Profile.department}, Skills to teach: ${user2Profile.skillsToTeach?.join(', ')}, Skills to learn: ${user2Profile.skillsToLearn?.join(', ')}
    
    Make the questions engaging, relevant to their backgrounds, and designed to help them feel comfortable with each other. Return only the 3 questions as a JSON array.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      // Fallback if JSON parsing fails
      return [
        "What's the most interesting project you've worked on recently?",
        "If you could learn any skill instantly, what would it be and why?",
        "What's your favorite way to unwind after a long day of studying?"
      ];
    }
  } catch (error) {
    console.error('Error generating icebreaker questions:', error);
    return [
      "What's the most interesting project you've worked on recently?",
      "If you could learn any skill instantly, what would it be and why?",
      "What's your favorite way to unwind after a long day of studying?"
    ];
  }
};

export const generateHint = async (taskType: string, taskDescription: string, studentCode: string, errorMessage?: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let prompt = `Generate a helpful hint for a student working on a ${taskType} task. 
    
    Task: ${taskDescription}
    Student's code: ${studentCode}`;
    
    if (errorMessage) {
      prompt += `\nError message: ${errorMessage}`;
    }
    
    prompt += `\n\nProvide a specific, actionable hint that will help the student understand what they might be missing or doing wrong. Keep it encouraging and educational.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating hint:', error);
    return "Try reviewing the requirements and checking for common mistakes like syntax errors or logic issues.";
  }
}; 

export const geminiChat = async (message: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a helpful AI assistant for students and teachers. Answer the following user query as clearly and helpfully as possible.\n\nUser: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini chat:', error);
    return "Sorry, I couldn't process your request right now.";
  }
}; 