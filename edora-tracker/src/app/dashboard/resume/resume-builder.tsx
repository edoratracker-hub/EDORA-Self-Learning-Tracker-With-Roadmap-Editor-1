import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { generateResumeContent } from '@/app/actions/ai-actions'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { authClient } from '@/app/lib/auth-client'

export type ResumeData = {
  name: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;

  headers: {
    about: string;
    skills: string;
    experience: string;
    education: string;
    projects: string;
    certifications: string;
    languages: string;
    interests: string;
  };

  about: string;
  skills: { label: string; value: string }[];
  experience: { title: string; date: string; points: string }[];
  education: { degree: string; date: string; school: string; location: string }[];
  projects: { title: string; tech: string; link: string; points: string }[];
  certifications: string[];
  languages: string[];
  interests: string[];
};

const defaultData: ResumeData = {
  name: "",
  location: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  portfolio: "",

  headers: {
    about: "About",
    skills: "Technical Skills",
    experience: "Experience",
    education: "Education",
    projects: "Key Projects",
    certifications: "Certifications & Activities",
    languages: "Languages",
    interests: "Interests"
  },

  about: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: []
}

export const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(defaultData)
  const [activeTab, setActiveTab] = useState("form")
  const { data: session } = authClient.useSession()

  const [generatingStates, setGeneratingStates] = useState<Record<string, boolean>>({})

  // Auto-populate from session if available
  useEffect(() => {
    if (session?.user) {
      setData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])
  
  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const updateHeader = (key: string, value: string) => {
    setData(prev => ({ ...prev, headers: { ...prev.headers, [key]: value } }))
  }

  const handleGenerateAi = async (fieldPath: string, prompt: string, updateFn: (generatedText: string) => void) => {
    if (!prompt.trim()) {
      toast.error("Please enter some keywords first before generating!");
      return;
    }
    
    setGeneratingStates(prev => ({ ...prev, [fieldPath]: true }));
    try {
      const res = await generateResumeContent(`Convert these raw thoughts/keywords into a polished, professional resume section: ${prompt}`);
      if (res.success && res.text) {
        updateFn(res.text);
        toast.success("AI Generation complete!");
      } else {
        toast.error(res.error || "Failed to generate content.");
      }
    } catch (e) {
      toast.error("An error occurred during generation.");
    } finally {
      setGeneratingStates(prev => ({ ...prev, [fieldPath]: false }));
    }
  }

  const handlePrint = () => {
    setActiveTab("preview")
    
    setTimeout(() => {
      // Create a hidden iframe
      const iframe = document.createElement('iframe')
      iframe.style.position = 'absolute'
      iframe.style.width = '0px'
      iframe.style.height = '0px'
      iframe.style.border = 'none'
      document.body.appendChild(iframe)
      
      const iframeDoc = iframe.contentWindow?.document
      if (!iframeDoc) return
      
      // Inject styles and resume content into iframe
      iframeDoc.write('<html><head><title>Resume</title>')
      
      // Copy all styles from the main window so tailwind works flawlessly
      const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
      styles.forEach(s => {
        iframeDoc.write(s.outerHTML)
      })
      
      iframeDoc.write('<style>@page { margin: 0; } body { margin: 1cm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }</style>')
      iframeDoc.write('</head><body class="bg-white text-black">')
      iframeDoc.write(document.getElementById('resume-preview')?.outerHTML || '')
      iframeDoc.write('</body></html>')
      iframeDoc.close()

      // Wait for stylesheets to load in the iframe before printing
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)
      }, 800)
    }, 200)
  }

  return (
    <div className="w-full h-full flex flex-col pt-2">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resume Builder</h2>
          <p className="text-muted-foreground text-sm mt-1">Fill out the form below to generate your resume.</p>
        </div>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Generate & Download PDF
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 print:hidden">
          <TabsTrigger value="form">Edit Details (Form)</TabsTrigger>
          <TabsTrigger value="preview">Preview Resume</TabsTrigger>
        </TabsList>

        {/* ----------------- FORM TAB ----------------- */}
        <TabsContent value="form" className="space-y-6 pb-20 print:hidden">
          
          {/* PERSONAL INFO */}
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={data.name} onChange={(e) => updateData('name', e.target.value)} /></div>
              <div className="space-y-2"><Label>Location</Label><Input value={data.location} onChange={(e) => updateData('location', e.target.value)} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={data.email} onChange={(e) => updateData('email', e.target.value)} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={data.phone} onChange={(e) => updateData('phone', e.target.value)} /></div>
              <div className="space-y-2"><Label>GitHub Link</Label><Input value={data.github} onChange={(e) => updateData('github', e.target.value)} /></div>
              <div className="space-y-2"><Label>LinkedIn Link</Label><Input value={data.linkedin} onChange={(e) => updateData('linkedin', e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Portfolio Link</Label><Input value={data.portfolio} onChange={(e) => updateData('portfolio', e.target.value)} /></div>
            </CardContent>
          </Card>

          {/* SUMMARY */}
          <Card>
            <CardHeader className="flex flex-col gap-2 items-start">
              <div className="flex w-full items-center justify-between">
                <CardTitle>Professional Summary</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap font-normal text-muted-foreground">Section Header:</Label>
                  <Input className="h-8 w-40" value={data.headers.about} onChange={(e) => updateHeader('about', e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea rows={4} value={data.about} onChange={(e) => updateData('about', e.target.value)} placeholder="Write your professional summary or enter keywords for AI..." />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  disabled={generatingStates['about']}
                  onClick={() => handleGenerateAi('about', data.about, (text) => updateData('about', text))}
                  className="gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400"
                >
                  {generatingStates['about'] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate with AI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TECHNICAL SKILLS */}
          <Card>
            <CardHeader className="flex flex-col gap-2 items-start">
              <div className="flex w-full items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap font-normal text-muted-foreground hidden sm:block">Header:</Label>
                  <Input className="h-8 w-40" value={data.headers.skills} onChange={(e) => updateHeader('skills', e.target.value)} />
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => updateData('skills', [...data.skills, { label: '', value: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Skill Category
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input placeholder="Category (e.g. Languages)" value={skill.label} className="w-1/3" onChange={(e) => {
                    const newSkills = [...data.skills]; newSkills[index].label = e.target.value; updateData('skills', newSkills)
                  }} />
                  <Input placeholder="Values (e.g. Python, Java)" value={skill.value} className="flex-1" onChange={(e) => {
                    const newSkills = [...data.skills]; newSkills[index].value = e.target.value; updateData('skills', newSkills)
                  }} />
                  <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-700 shrink-0" onClick={() => {
                    updateData('skills', data.skills.filter((_, i) => i !== index))
                  }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* EXPERIENCE */}
          <Card>
            <CardHeader className="flex flex-col gap-2 items-start">
              <div className="flex w-full items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap font-normal text-muted-foreground hidden sm:block">Header:</Label>
                  <Input className="h-8 w-40" value={data.headers.experience} onChange={(e) => updateHeader('experience', e.target.value)} />
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => updateData('experience', [...data.experience, { title: '', date: '', points: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border p-4 rounded-lg relative space-y-3 bg-muted/20">
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => updateData('experience', data.experience.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4" /></Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                    <div className="space-y-2"><Label>Job Title / Company</Label><Input value={exp.title} onChange={(e) => { const n = [...data.experience]; n[index].title = e.target.value; updateData('experience', n) }} /></div>
                    <div className="space-y-2"><Label>Duration</Label><Input value={exp.date} onChange={(e) => { const n = [...data.experience]; n[index].date = e.target.value; updateData('experience', n) }} /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Description / Points (One per line)</Label>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        disabled={generatingStates[`exp_${index}`]}
                        onClick={() => handleGenerateAi(
                          `exp_${index}`, 
                          `Write a professional experience description using bullet points based on these keywords: ${exp.points}`, 
                          (text) => { const n = [...data.experience]; n[index].points = text; updateData('experience', n) }
                        )}
                        className="h-7 text-xs gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        {generatingStates[`exp_${index}`] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Generate with AI
                      </Button>
                    </div>
                    <Textarea rows={4} placeholder="Enter keywords or draft points..." value={exp.points} onChange={(e) => { const n = [...data.experience]; n[index].points = e.target.value; updateData('experience', n) }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* EDUCATION */}
          <Card>
            <CardHeader className="flex flex-col gap-2 items-start">
              <div className="flex w-full items-center justify-between">
                <CardTitle>Education</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap font-normal text-muted-foreground hidden sm:block">Header:</Label>
                  <Input className="h-8 w-40" value={data.headers.education} onChange={(e) => updateHeader('education', e.target.value)} />
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => updateData('education', [...data.education, { degree: '', date: '', school: '', location: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="border p-4 rounded-lg relative space-y-3 bg-muted/20">
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => updateData('education', data.education.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4" /></Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                    <div className="space-y-2"><Label>Degree / Certificate</Label><Input value={edu.degree} onChange={(e) => { const n = [...data.education]; n[index].degree = e.target.value; updateData('education', n) }} /></div>
                    <div className="space-y-2"><Label>Institution</Label><Input value={edu.school} onChange={(e) => { const n = [...data.education]; n[index].school = e.target.value; updateData('education', n) }} /></div>
                    <div className="space-y-2"><Label>Duration</Label><Input value={edu.date} onChange={(e) => { const n = [...data.education]; n[index].date = e.target.value; updateData('education', n) }} /></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* PROJECTS */}
          <Card>
            <CardHeader className="flex flex-col gap-2 items-start">
              <div className="flex w-full items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap font-normal text-muted-foreground hidden sm:block">Header:</Label>
                  <Input className="h-8 w-40" value={data.headers.projects} onChange={(e) => updateHeader('projects', e.target.value)} />
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => updateData('projects', [...data.projects, { title: '', tech: '', link: '', points: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.projects.map((proj, index) => (
                <div key={index} className="border p-4 rounded-lg relative space-y-3 bg-muted/20">
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => updateData('projects', data.projects.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4" /></Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                    <div className="space-y-2"><Label>Project Title</Label><Input value={proj.title} onChange={(e) => { const n = [...data.projects]; n[index].title = e.target.value; updateData('projects', n) }} /></div>
                    <div className="space-y-2"><Label>Technologies Used</Label><Input value={proj.tech} onChange={(e) => { const n = [...data.projects]; n[index].tech = e.target.value; updateData('projects', n) }} /></div>
                    <div className="space-y-2"><Label>Repository/Link</Label><Input value={proj.link} onChange={(e) => { const n = [...data.projects]; n[index].link = e.target.value; updateData('projects', n) }} /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Description / Points (One per line)</Label>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        disabled={generatingStates[`proj_${index}`]}
                        onClick={() => handleGenerateAi(
                          `proj_${index}`, 
                          `Write a professional project description using bullet points based on these keywords: ${proj.points} for a project titled ${proj.title || 'untitled'} using ${proj.tech || 'general tech'}`, 
                          (text) => { const n = [...data.projects]; n[index].points = text; updateData('projects', n) }
                        )}
                        className="h-7 text-xs gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        {generatingStates[`proj_${index}`] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Generate with AI
                      </Button>
                    </div>
                    <Textarea rows={3} placeholder="Enter keywords or draft points..." value={proj.points} onChange={(e) => { const n = [...data.projects]; n[index].points = e.target.value; updateData('projects', n) }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CERTIFICATIONS / LANGUAGES / INTERESTS MULTI-COLUMN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* CERTIFICATIONS */}
            <Card className="flex flex-col">
              <CardHeader className="flex flex-col gap-2 items-start pb-4">
                <div className="flex w-full items-center justify-between">
                  <CardTitle>Certifications</CardTitle>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Label className="whitespace-nowrap font-normal text-muted-foreground text-xs">Section Header:</Label>
                  <Input className="h-7 text-xs w-[180px]" value={data.headers.certifications} onChange={(e) => updateHeader('certifications', e.target.value)} />
                </div>
                <Button size="sm" variant="outline" className="mt-2 w-full h-8" onClick={() => updateData('certifications', [...data.certifications, ""])}>
                  <Plus className="w-4 h-4 mr-1" /> Add Certification
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-y-auto">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input value={cert} className="flex-1" onChange={(e) => {
                      const newCerts = [...data.certifications]; newCerts[index] = e.target.value; updateData('certifications', newCerts)
                    }} />
                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-700 shrink-0" onClick={() => {
                      updateData('certifications', data.certifications.filter((_, i) => i !== index))
                    }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              {/* LANGUAGES */}
              <Card className="flex-1">
                <CardHeader className="flex flex-col gap-2 items-start pb-4">
                  <div className="flex w-full items-center justify-between">
                    <CardTitle>Languages</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="whitespace-nowrap font-normal text-muted-foreground text-xs hidden sm:block">Header:</Label>
                      <Input className="h-7 text-xs w-[120px]" value={data.headers.languages} onChange={(e) => updateHeader('languages', e.target.value)} />
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 w-full h-8" onClick={() => updateData('languages', [...data.languages, ""])}>
                    <Plus className="w-4 h-4 mr-1" /> Add Language
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex gap-1 items-center bg-muted/30 p-1 rounded-md">
                      <Input value={lang} className="h-8 shadow-none border-none bg-transparent" onChange={(e) => {
                        const newLangs = [...data.languages]; newLangs[index] = e.target.value; updateData('languages', newLangs)
                      }} />
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => {
                        updateData('languages', data.languages.filter((_, i) => i !== index))
                      }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* INTERESTS */}
              <Card className="flex-1">
                <CardHeader className="flex flex-col gap-2 items-start pb-4">
                  <div className="flex w-full items-center justify-between">
                    <CardTitle>Interests</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="whitespace-nowrap font-normal text-muted-foreground text-xs hidden sm:block">Header:</Label>
                      <Input className="h-7 text-xs w-[120px]" value={data.headers.interests} onChange={(e) => updateHeader('interests', e.target.value)} />
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 w-full h-8" onClick={() => updateData('interests', [...data.interests, ""])}>
                    <Plus className="w-4 h-4 mr-1" /> Add Interest
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {data.interests.map((interest, index) => (
                    <div key={index} className="flex gap-1 items-center bg-muted/30 p-1 rounded-md">
                      <Input value={interest} className="h-8 shadow-none border-none bg-transparent" onChange={(e) => {
                        const newInts = [...data.interests]; newInts[index] = e.target.value; updateData('interests', newInts)
                      }} />
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => {
                        updateData('interests', data.interests.filter((_, i) => i !== index))
                      }}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
          </div>
        </TabsContent>

        {/* ----------------- PREVIEW TAB ----------------- */}
        <TabsContent value="preview" className="flex justify-center bg-muted/20 p-4 sm:p-8 rounded-xl border">
          <div className="w-full max-w-[850px] bg-white shadow-md border border-neutral-200 p-10 sm:p-14 text-black font-sans shrink-0 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full" id="resume-preview">
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold uppercase tracking-widest mb-2 text-black">{data.name}</h1>
              <div className="text-sm flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-gray-800">
                {data.location && <span>{data.location}</span>}
                {data.location && data.email && <span className="text-gray-400">|</span>}
                {data.email && <a href={`mailto:${data.email}`} className="text-blue-700">{data.email}</a>}
                {data.email && data.phone && <span className="text-gray-400">|</span>}
                {data.phone && <span>{data.phone}</span>}
              </div>
              <div className="text-sm flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-gray-800 mt-1">
                {data.github && <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} className="text-blue-700" target="_blank" rel="noreferrer">{data.github.replace('https://', '')}</a>}
                {data.github && data.linkedin && <span className="text-gray-400">|</span>}
                {data.linkedin && <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} className="text-blue-700" target="_blank" rel="noreferrer">{data.linkedin.replace('https://', '')}</a>}
                {data.linkedin && data.portfolio && <span className="text-gray-400">|</span>}
                {data.portfolio && <a href={data.portfolio.startsWith('http') ? data.portfolio : `https://${data.portfolio}`} className="text-blue-700" target="_blank" rel="noreferrer">{data.portfolio.replace('https://', '')}</a>}
              </div>
            </div>

            {data.about && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.about || "About"}</h2>
                <div className="text-sm leading-relaxed text-left text-gray-900 whitespace-pre-wrap">{data.about}</div>
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.skills || "Technical Skills"}</h2>
                <div className="text-sm flex flex-col gap-1 text-gray-900">
                  {data.skills.map((s, i) => (
                    s.label || s.value ? <p key={i}><span className="font-bold text-black">{s.label}:</span> {s.value}</p> : null
                  ))}
                </div>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.experience || "Experience"}</h2>
                {data.experience.map((exp, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-bold text-black">{exp.title}</h3>
                      <span className="text-sm font-medium text-gray-800">{exp.date}</span>
                    </div>
                    {exp.points && (
                      <ul className="list-disc list-outside ml-5 text-sm space-y-1 text-gray-900">
                        {exp.points.split('\n').filter(p => p.trim()).map((p, idx) => <li key={idx}>{p.trim()}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {data.education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.education || "Education"}</h2>
                {data.education.map((edu, i) => (
                  <div key={i} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[15px] font-bold text-black">{edu.degree}</h3>
                      <span className="text-sm font-medium text-gray-800">{edu.date}</span>
                    </div>
                    {edu.school && <p className="text-sm text-gray-700 mt-0.5">{edu.school}</p>}
                  </div>
                ))}
              </div>
            )}

            {data.projects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.projects || "Key Projects"}</h2>
                {data.projects.map((proj, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <h3 className="text-sm text-neutral-800 flex flex-wrap gap-1 items-baseline">
                      <span className="font-bold text-black text-[15px]">{proj.title}</span> 
                      {proj.tech && <><span>|</span> <span>{proj.tech}</span></>}
                    </h3>
                    {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} className="text-sm text-blue-700 block mb-1 mt-0.5">{proj.link.replace('https://', '')}</a>}
                    {proj.points && (
                      <ul className="list-disc list-outside ml-5 text-sm space-y-1 text-gray-900">
                        {proj.points.split('\n').filter(p => p.trim()).map((p, idx) => <li key={idx}>{p.trim()}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {data.certifications.length > 0 && (
              <div className="mb-5">
                <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.certifications || "Certifications & Activities"}</h2>
                <ul className="list-disc list-outside ml-5 text-sm space-y-1 text-gray-900">
                  {data.certifications.map((p, idx) => p.trim() ? <li key={idx}>{p.trim()}</li> : null)}
                </ul>
              </div>
            )}

            {(data.languages.length > 0 || data.interests.length > 0) && (
              <div className="flex flex-col sm:flex-row gap-8">
                {data.languages.length > 0 && (
                  <div className="flex-1">
                    <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.languages || "Languages"}</h2>
                    <p className="text-sm text-gray-900 mt-1">{data.languages.filter(l => l.trim()).join(", ")}</p>
                  </div>
                )}
                {data.interests.length > 0 && (
                  <div className="flex-1">
                    <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-3 pb-1 text-black">{data.headers.interests || "Interests"}</h2>
                    <p className="text-sm text-gray-900 mt-1">{data.interests.filter(i => i.trim()).join(", ")}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
