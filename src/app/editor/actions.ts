'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// Use the model the user explicitly set in their last edit
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

interface ScriptRow {
    visual: string
    audio: string
}

interface CalendarEntry {
    day: number
    title: string
    script: ScriptRow[]
}


export async function generateScript(formData: {
    platform: string
    topic: string
    tone: string
    length: string
    language: string
    framework: string
}) {
    const { platform, topic, tone, length, language, framework } = formData

    const frameworkInstructions = framework !== 'None'
        ? `Use the ${framework} marketing framework. `
        : ''

    const prompt = `You are a professional social media script writer. Generate a script for ${platform} in ${language}.
${frameworkInstructions}Topic: ${topic}
Tone: ${tone}
Desired Length: ${length}

FORMAT RULES:
1. Return ONLY a valid JSON object. 
2. No markdown, no "json" backticks, no explanatory text.
3. The content must be a 2-column script: "Visual" (what to see) and "Audio" (what to hear/say).
4. Break the script into short, logical rows. If the topic is long, split it into many rows.
5. Do NOT return paragraphs. Every idea must belong to a row.
6. Target the script length to be approximately ${length}.

JSON SCHEMA:
{
  "title": "Catchy Script Title (in ${language})",
  "script": [
    {
      "visual": "Description of the visual scene (written in ${language})",
      "audio": "The voiceover or spoken dialogue (written in ${language})"
    }
  ]
}

CRITICAL: 
- Every single word in the "title", "visual", and "audio" fields MUST be in ${language}.
- Use the native script for ${language} (e.g., Devanagari for Hindi).
- Do NOT use English for visual descriptions if ${language} is NOT English.
- Return ONLY the JSON object.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        // Remove potential markdown code blocks if the AI ignored the "no backticks" rule
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        const cleanJson = jsonMatch ? jsonMatch[0] : text

        try {
            const data = JSON.parse(cleanJson)
            return {
                title: data.title || topic,
                content: data.script || []
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'Raw text:', text)
            // Fallback for non-JSON responses (safety net)
            return {
                title: topic,
                content: [{ visual: "Error: AI failed to return JSON", audio: text }]
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
}) {
    const { platform, topic, tone, length, language, framework, days } = formData

    const frameworkInstructions = framework !== 'None'
        ? `Use the ${framework} marketing framework for EACH day's content. `
        : ''

    const prompt = `You are a professional social media content strategist and writer. 
Generate a ${days}-day content calendar for ${platform} in ${language}.
${frameworkInstructions}Overall Topic: ${topic}
Tone: ${tone}
Desired Length per post: ${length}

Each day should have a unique focus related to the overall topic.

FORMAT RULES:
1. Return ONLY a valid JSON array of objects.
2. No markdown, no "json" backticks, no explanatory text.
3. Each object must represent one day.

JSON SCHEMA:
[
  {
    "day": 1,
    "title": "Daily Topic Title (in ${language})",
    "script": [
      {
        "visual": "Description of the visual scene (written in ${language})",
        "audio": "The voiceover or spoken dialogue (written in ${language})"
      }
    ]
  },
  ... (up to day ${days})
]

CRITICAL: 
- Every single word in the "title", "visual", and "audio" fields MUST be in ${language}.
- Use the native script for ${language}.
- Return ONLY the JSON array.`

    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        const jsonMatch = text.match(/\[[\s\S]*\]/)
        const cleanJson = jsonMatch ? jsonMatch[0] : text

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
    content: ScriptRow[] | CalendarEntry[]
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

    if (id) {
        const { error } = await supabase
            .from('scripts')
            .update(saveData)
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw new Error(error.message)
    } else {
        const { error } = await supabase.from('scripts').insert({
            user_id: user.id,
            ...saveData,
        })

        if (error) throw new Error(error.message)
    }

    return { success: true }
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
