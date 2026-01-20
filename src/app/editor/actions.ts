'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import { sendScriptReadyEmail } from '@/lib/email'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// Use the model the user explicitly set in their last edit
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

interface SingleContent {
    visual: string
    audio: string
}

interface CalendarEntry {
    day: number
    title: string
    content: {
        visual: string
        audio: string
    }
}


export async function generateScript(formData: {
    platform: string
    topic: string
    tone: string
    length: string
    language: string
    framework: string
    targetAudience?: string
}) {
    const { platform, topic, tone, length, language, framework, targetAudience = "General Audience" } = formData

    const frameworkInstructions = framework !== 'None'
        ? `Use the ${framework} marketing framework. `
        : ''

    const languageStyle = language !== 'English'
        ? `Use 100% ${language}, but keep it MODERN and CONVERSATIONAL. Avoid formal, textbook, or archaic words. Naturally blend in English technical terms (like "marketing" or "sales") if they are common in modern speech. IMPORTANT: You MUST use the NATIVE ${language} SCRIPT (characters) for the entire script.`
        : 'Use natural, human conversational English.'

    const prompt = `
ROLE & OBJECTIVE:
You are a real human Content Creator and Social Media Strategist with 10+ years of experience.
Your job is to write scripts that sound like NATURAL SPOKEN LANGUAGE — the way creators actually talk on camera.

INPUT CONTEXT:
Topic: ${topic}
Platform: ${platform}
Tone: ${tone}
Target Length: ${length}
Language: ${language}
Target Audience: ${targetAudience}
Style Rule: ${languageStyle}
Framework: ${frameworkInstructions}

CRITICAL LANGUAGE RULES (NON-NEGOTIABLE):
1. WRITE FOR SPEAKING, NOT READING.
   - Short sentences.
   - Natural pauses.
   - Everyday phrasing.
   - Easy to say out loud in one take.

2. THINK IN THE LANGUAGE — DO NOT TRANSLATE.
   - If language is Tamil, Hindi, Telugu, etc:
     → Use conversational Hinglish / Tanglish.
     → Mix English naturally for modern words.
     → Example: Use “growth”, “content”, “mindset”, “marketing”.
     → DO NOT use pure, literary, textbook words.

3. SOUND LIKE A REAL CREATOR.
   - Slight imperfections are OK.
   - Friendly, confident, human tone.
   - No robotic phrasing.
   - No motivational-poster language.

4. NO META TEXT.
   - Do NOT use labels like “Hook”, “Intro”, “Conclusion”.
   - Do NOT explain what you are doing.
   - Just write the script as a person would speak.

PLATFORM BEHAVIOR:
- If platform is Instagram Reels / YouTube Shorts:
  → Fast-paced, under 60s spoken.
  → Strong opening line.
  → 3–4 quick value points.
  → Simple CTA at the end.

- If platform is LinkedIn:
  → Professional but personal.
  → Short paragraphs.
  → Conversational business tone.
  → End with a thought-provoking question.

- If platform is YouTube (long):
  → Smooth intro.
  → Clear explanations.
  → Feels like teaching a friend.
  → Natural subscribe CTA at the end.

OUTPUT FORMAT (VERY IMPORTANT):
Return ONLY valid JSON. No markdown. No backticks.

{
  "title": "A catchy, natural title in ${language}",
  "content": {
    "visual": "One continuous visual description for the entire video.",
    "audio": "ONE continuous, natural, conversational voice-over script from start to end, written exactly how a human would speak on camera."
  }
}

FINAL CHECK BEFORE RESPONDING:
- Can this be read aloud smoothly without editing?
- Does it sound like a real creator?
- Does the language feel local and modern?
If yes, return the JSON.
`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        const cleanJson = jsonMatch ? jsonMatch[0] : text

        try {
            const data = JSON.parse(cleanJson)
            return {
                title: data.title || topic,
                content: data.content || { visual: '', audio: text }
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Raw text:', text)
            return {
                title: topic,
                content: { visual: "Error: AI failed to return JSON", audio: text }
            }
        }
    } catch (error) {
        console.error('Error generating script with Gemini:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to generate script with AI')
    }
}

export async function generateCalendar(formData: {
    platform: string
    topic: string
    tone: string
    length: string
    language: string
    framework: string
    days: number
    targetAudience?: string
}) {
    const { platform, topic, tone, length, language, framework, days, targetAudience = "General Audience" } = formData

    const frameworkInstructions = framework !== 'None'
        ? `Use the ${framework} marketing framework for EACH day's content. `
        : ''

    const languageStyle = language !== 'English'
        ? `Use 100% ${language}, but keep it MODERN and CONVERSATIONAL. Avoid formal/textbook words. Use native ${language} characters only.`
        : 'Use professional yet conversational English.'

    const prompt = `
ROLE & OBJECTIVE:
You are a master social media strategist. Create a ${days}-day content calendar for ${platform}.
Your goal is high-converting, viral content that sounds 100% human.

INPUT CONTEXT:
Overall Topic: ${topic}
Tone: ${tone}
Target Length: ${length}
Language: ${language}
Target Audience: ${targetAudience}
Style Rule: ${languageStyle}
Framework: ${frameworkInstructions}

CRITICAL RULES:
1. WRITE FOR SPEAKING: Use short sentences and natural phrasing.
2. THINK NATIVELY: If ${language} is Tamil/Hindi/Telugu, use Hinglish/Tanglish.
3. NO META: No headers like "Hook" or "Body". Just the content.
4. CONTINUOUS FLOW: Each day's script must be one single, uninterrupted block.

JSON SCHEMA:
[
  {
    "day": 1,
    "title": "A catchy title (in target style)",
    "content": {
      "visual": "A continuous cinematic visual cue.",
      "audio": "The complete flowing spoken script for this day."
    }
  }
]

IMPORTANT: Return ONLY valid JSON array. No markdown.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        const jsonMatch = text.match(/\[[\s\S]*\]/)
        const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim()

        try {
            const data = JSON.parse(cleanJson)
            return data as CalendarEntry[]
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Raw text:', text)
            throw new Error('AI failed to return a valid content calendar.')
        }
    } catch (error) {
        console.error('Error generating calendar with Gemini:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to generate calendar with AI')
    }
}

export async function saveScript(data: {
    id?: string
    title: string
    content: SingleContent | CalendarEntry[]
    platform: string
    topic: string
    tone: string
    length: string
    language: string
    framework: string
    calendarDays?: number
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { id, ...saveData } = data

    console.log('Attempting to save script:', { id, ...saveData })

    if (id) {
        const { error, data: updatedData } = await supabase
            .from('scripts')
            .update(saveData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Update Script Error:', error)
            throw new Error(error.message)
        }
        return { success: true, data: updatedData }
    } else {
        const { error, data: insertedData } = await supabase.from('scripts').insert({
            user_id: user.id,
            ...saveData,
        }).select().single()

        if (error) {
            console.error('Insert Script Error:', error)
            throw new Error(error.message)
        }
        console.log('Successfully inserted script:', insertedData)

        // Send script ready email (non-blocking)
        sendScriptReadyEmail(user.email!, data.title, data.content).catch(err => console.error('Failed to send script email async:', err))

        return { success: true, data: insertedData }
    }
}

export async function fetchScript(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw new Error(error.message)
    }

    // Ensure user owns the script
    if (data.user_id !== user.id) {
        throw new Error('Access denied')
    }

    // Handle JSON parsing for content if it's stored as a string or needs normalization
    if (typeof data.content === 'string') {
        try {
            data.content = JSON.parse(data.content)
        } catch {
            // Fallback for legacy text scripts
            data.content = [{ visual: "Legacy Content", audio: data.content }]
        }
    } else if (!data.content) {
        data.content = []
    }

    return data
}

export async function deleteScript(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error(error.message)
    }

    return { success: true }
}
