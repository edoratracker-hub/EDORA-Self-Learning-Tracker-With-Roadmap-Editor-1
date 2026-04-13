import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    role: z.enum(["student", "recruiter", "mentor", "pro-mentor"], {
        required_error: "Please select a role",
    }),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

export type SignInValues = z.infer<typeof signInSchema>

export const jobOpportunitySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
    company: z.string().optional(),
    description: z.string().min(20, "Description must be at least 20 characters"),
    responsibilities: z.string().optional(),
    benefits: z.string().optional(),

    requiredSkills: z.string().optional(),
    niceToHaveSkills: z.string().optional(),

    experienceMin: z.number().min(0).optional(),
    experienceMax: z.number().min(0).optional(),
    educationRequired: z.string().optional(),

    salaryMin: z.number().min(0).optional(),
    salaryMax: z.number().min(0).optional(),
    currency: z.enum(["INR", "USD", "EUR", "GBP", "CAD"]).default("INR"),
    salaryType: z.enum(["yearly", "monthly", "hourly"]).optional(),

    jobType: z.enum(["full-time", "part-time", "contract", "internship", "freelance"]).default("full-time"),
    workMode: z.enum(["remote", "hybrid", "on-site"]).default("hybrid"),

    location: z.string().optional(),
    country: z.string().optional(),

    applicationDeadline: z.date().optional(),
    status: z.enum(["draft", "open", "closed"]).default("draft"),
}).refine(data => {
    if (data.salaryMin && data.salaryMax) {
        return data.salaryMin <= data.salaryMax;
    }
    return true;
}, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["salaryMin"],
}).refine(data => {
    if (data.experienceMin && data.experienceMax) {
        return data.experienceMin <= data.experienceMax;
    }
    return true;
}, {
    message: "Minimum experience cannot be greater than maximum experience",
    path: ["experienceMin"],
});

export type JobOpportunityFormData = z.infer<typeof jobOpportunitySchema>;

export const recruiterOrganizationSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
    companyLogo: z.string().optional(),
    location: z.string().min(2, "Location must be at least 2 characters"),
})

export type RecruiterOrganizationValues = z.infer<typeof recruiterOrganizationSchema>
