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

export async function generateScript(formData: {
    platform: string
    topic: string
    tone: string
    length: string
}) {
    const { platform, topic, tone, length } = formData

    const prompt = `You are a professional social media script writer. Generate a script for ${platform} in a structured JSON format.
Topic: ${topic}
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
  "title": "Catchy Script Title",
  "script": [
    {
      "visual": "Description of the visual scene",
      "audio": "The voiceover or spoken dialogue"
    }
  ]
}

CRITICAL: Return ONLY the JSON object. No extra text.`

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

export async function saveScript(data: {
    id?: string
    title: string
    content: ScriptRow[]
    platform: string
    topic: string
    tone: string
    length: string
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
