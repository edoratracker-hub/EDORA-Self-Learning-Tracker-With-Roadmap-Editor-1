import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const careerResponses: Record<string, string> = {
    interview: `**Preparing for Interviews: A Complete Guide**

Here's what top professionals do to crush interviews:

**1. Research the Company**
- Study their mission, products, recent news, and culture
- Know their competitors and market position
- Understand the role requirements deeply

**2. Prepare Your Stories (STAR Method)**
- **S**ituation: Set the context
- **T**ask: Describe your responsibility  
- **A**ction: Explain what you did specifically
- **R**esult: Share the measurable outcome

**3. Practice Common Questions**
- "Tell me about yourself" (60-second elevator pitch)
- "Why do you want this role?"
- Behavioral questions (conflict, leadership, failure)
- Technical questions for your domain

**4. Day-of Tips**
- Arrive/join 5-10 minutes early
- Bring enthusiasm and genuine curiosity
- Ask thoughtful questions about the team and role
- Send a thank-you note within 24 hours

Would you like help preparing answers for specific question types?`,

    resume: `**Building a Standout Resume with AI Assistance**

Here's how AI tools can elevate your resume:

**AI-Powered Resume Tools**
- Use ChatGPT/Gemini to tailor your resume to each job description
- Prompt: *"Rewrite my bullet points to match these job requirements: [paste job description]"*

**Key Resume Principles**
- **Quantify everything**: "Increased sales by 34%" beats "improved sales"
- **ATS optimization**: Include keywords from the job description
- **One page** (unless 10+ years of experience)
- **Active voice**: "Led," "Built," "Designed" not "Responsible for"

**Sections to Include**
1. Contact info + LinkedIn URL
2. Professional summary (2-3 tailored lines)
3. Work experience (reverse chronological)
4. Skills (match job description keywords)
5. Education
6. Optional: Projects, Certifications

**Common Mistakes to Avoid**
- Generic objectives instead of tailored summaries
- Listing duties instead of achievements
- Missing contact information
- Spelling/grammar errors

Want me to help you craft specific bullet points or sections?`,

    career: `**Navigating Your Career Path: Strategic Insights**

Building a meaningful career is a marathon, not a sprint. Here's your roadmap:

**Short-Term (0-2 Years)**
- Master the fundamentals of your current role
- Build relationships with mentors and peers
- Develop a reputation for reliability and quality work
- Start documenting your achievements

**Medium-Term (2-5 Years)**
- Specialize in a high-demand niche
- Take on leadership opportunities (even small ones)
- Build your personal brand online (LinkedIn, writing, speaking)
- Expand your professional network intentionally

**Long-Term (5+ Years)**
- Consider whether you want depth (expert) or breadth (generalist/leader)
- Develop cross-functional business acumen
- Begin mentoring others — it accelerates your own growth

**Career Pivot Tips**
- Identify transferable skills
- Take online courses to bridge skill gaps
- Do side projects in your target field
- Network with people already in the role you want

What specific aspect of your career journey can I help you think through?`,

    roadmap: `**Creating Your Personal Career Roadmap**

A career roadmap turns vague ambitions into concrete action steps:

**Step 1: Define Your Destination**
- Where do you want to be in 3 years? 5 years?
- What kind of work energizes you?
- What lifestyle do you want your career to support?

**Step 2: Assess Your Starting Point**
- Current skills inventory
- Gaps between where you are and where you want to be
- Strengths to leverage

**Step 3: Identify Milestones**
- Quarter-by-quarter goals
- Skills to acquire each month
- Projects to complete for your portfolio

**Step 4: Build Your Learning Plan**
- Online courses (Coursera, edX, Udemy)
- Books and podcasts in your field
- Communities and events to join
- Mentors to seek out

**Step 5: Regular Review**
- Monthly progress check-ins with yourself
- Quarterly roadmap adjustments
- Annual full career review

What's your target role or industry? I can help you create a more specific roadmap!`,
};

function getSmartResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("interview")) return careerResponses.interview;
    if (lower.includes("resume") || lower.includes("cv")) return careerResponses.resume;
    if (lower.includes("roadmap") || lower.includes("plan") || lower.includes("path")) return careerResponses.roadmap;
    if (lower.includes("career") || lower.includes("job") || lower.includes("work")) return careerResponses.career;

    if (lower.includes("skill") || lower.includes("learn")) {
        return `**Building High-Value Skills in Today's Market**

The skills that matter most in 2025:

**Technical Skills (High Demand)**
- AI/ML fundamentals — even non-technical roles benefit from this
- Data literacy — reading and interpreting data dashboards
- Cloud platforms (AWS, GCP, Azure) — basic familiarity is valuable
- Automation tools (Zapier, Make, Python scripts)

**Soft Skills (Often Underrated)**
- Clear written communication (especially remote-first world)
- Critical thinking & problem decomposition
- Stakeholder management and influence
- Adaptability and learning agility

**How to Build Skills Efficiently**
- Learn in public — share notes, tutorials, or projects online
- Apply immediately — start a project with each new skill
- Teach what you learn — it deepens retention by 2-3x
- Time-box learning sprints (2-week focused blocks work best)

What specific skill are you looking to develop? I can give you a personalized learning plan!`;
    }

    if (lower.includes("network") || lower.includes("connect") || lower.includes("linkedin")) {
        return `**Mastering Professional Networking**

Networking doesn't have to feel awkward. Here's a genuine approach:

**The Golden Rule: Give Before You Ask**
- Share useful content and insights
- Comment thoughtfully on others' posts
- Make introductions between people who should know each other
- Celebrate others' wins publicly

**LinkedIn Best Practices**
- Post 2-3 times per week (insights, lessons learned, projects)
- Engage with 5-10 posts daily in your target industry
- Send personalized connection requests (never the default message)
- Use LinkedIn's "Open to Work" feature strategically

**Real-World Networking**
- Attend industry meetups and conferences
- Join professional associations in your field
- Volunteer for events — you meet the organizers (the most connected people)
- Follow up within 24 hours after meeting someone

**Outreach Message Template:**
> "Hi [Name], I came across your work on [specific thing] and found it really insightful. I'm working on [related thing] and would love to hear about your experience with [specific topic]. Would a 15-minute chat work for you?"

What industry or network are you trying to build?`;
    }

    if (lower.includes("salary") || lower.includes("negotiate") || lower.includes("offer") || lower.includes("pay")) {
        return `**Salary Negotiation: Getting What You're Worth**

Most people leave 10-20% on the table by not negotiating. Here's how to do it confidently:

**Before the Negotiation**
- Research market rates: Glassdoor, Levels.fyi, LinkedIn Salary, PayScale
- Know your total compensation value (base + bonus + equity + benefits)
- Determine your BATNA (Best Alternative To Negotiated Agreement)

**The Negotiation Conversation**
1. **Never give the first number** if you can avoid it
2. **Anchor high but reasonably**: "Based on my research and experience, I'm targeting [$X], though I'm open to discussing the full package"
3. **Express enthusiasm** while negotiating — you want them, just want fair comp
4. **Negotiate the whole package**: base, bonus, equity, remote flexibility, PTO

**If They Can't Move on Salary**
- Performance review timeline (6 months instead of 12)
- Signing bonus
- Extra PTO days
- Remote work flexibility
- Learning and development budget

**Scripts That Work:**
- "I'm excited about this opportunity. Is there flexibility in the base? Market data suggests [$X] for this role."
- "Can we revisit comp after 90 days if I exceed expectations?"

Want help preparing for a specific negotiation scenario?`;
    }

    return `**Great question! Here's what I know about that:**

As your AI career assistant, I'm here to help you navigate your professional journey. Here are some areas I can help with:

🎯 **Career Planning** — Building roadmaps and setting goals
📝 **Resume & LinkedIn** — Crafting compelling applications  
🤝 **Interview Prep** — Practicing and strategizing
💡 **Skill Development** — Identifying and building the right skills
🌐 **Networking** — Building meaningful professional connections
💰 **Salary Negotiation** — Advocating for your worth
🔄 **Career Transitions** — Making successful pivots

For your specific question about: *"${message}"*

I'd suggest breaking this down into:
1. **What outcome do you want?** (Be specific)
2. **What's blocking you?** (Identify the constraint)
3. **What resources do you have?** (Skills, network, time)

Feel free to be more specific and I'll give you a detailed, personalized response! What's your most pressing career challenge right now?`;
}

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // If Gemini API key is available, use it
        if (GEMINI_API_KEY) {
            const systemPrompt = `You are Edora AI, a helpful and knowledgeable career assistant for professionals and students. 
You specialize in: career planning, interview preparation, resume writing, skill development, networking strategies, salary negotiation, and professional growth.
You are encouraging, specific, and practical. You provide actionable advice with examples.
Format your responses with markdown (bold, bullet points, headers) to make them easy to read.
Keep responses focused and helpful. If asked about non-career topics, gently redirect to career-related advice.`;

            const contents = [
                ...(history || []).map((msg: any) => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }],
                })),
                {
                    role: "user",
                    parts: [{ text: message }],
                },
            ];

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: systemPrompt }] },
                        contents,
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1024,
                        },
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const aiResponse =
                    data.candidates?.[0]?.content?.parts?.[0]?.text ||
                    getSmartResponse(message);
                return NextResponse.json({ response: aiResponse });
            }
        }

        // Fallback to smart templated responses
        const smartResponse = getSmartResponse(message);
        return NextResponse.json({ response: smartResponse });
    } catch (error) {
        console.error("AI route error:", error);
        return NextResponse.json(
            { error: "Failed to get AI response" },
            { status: 500 }
        );
    }
}
