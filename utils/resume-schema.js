/**
 * Resume Schema
 * 
 * This module defines the Zod schema for resume data.
 * It's used for validating the structure of resume data extracted from PDFs.
 * 
 * Philosophical Framework:
 * - Salinger: Simplifying the interface to focus on content
 * - Hesse: Balancing structure (schema) with flexibility (content)
 * - Derrida: Deconstructing the resume into structured data
 * - Dante: Guiding the validation through different stages
 */

const { z } = require('zod');

/**
 * Resume Schema
 * 
 * Defines the structure of resume data using Zod.
 */
const ResumeSchema = z.object({
  // Basic information
  name: z.string().min(1, "Name is required"),
  
  // Summary
  summary: z.string().min(1, "Summary is required"),
  
  // Skills
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  
  // Experience
  experience: z.array(
    z.object({
      title: z.string().min(1, "Job title is required"),
      company: z.string().min(1, "Company name is required"),
      period: z.string().min(1, "Employment period is required"),
      responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is required")
    })
  ).min(1, "At least one experience entry is required"),
  
  // Education
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      period: z.string().min(1, "Education period is required")
    })
  ).min(1, "At least one education entry is required"),
  
  // Contact information
  contact: z.object({
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
    location: z.string().optional()
  })
});

/**
 * Cover Letter Schema
 * 
 * Defines the structure of cover letter data using Zod.
 */
const CoverLetterSchema = z.object({
  // Basic information
  name: z.string().min(1, "Name is required"),
  
  // Company information
  company: z.string().optional(),
  position: z.string().optional(),
  
  // Content sections
  introduction: z.string().min(1, "Introduction is required"),
  body: z.array(z.string().min(1)).min(1, "At least one body paragraph is required"),
  conclusion: z.string().min(1, "Conclusion is required"),
  
  // Highlights
  highlights: z.array(z.string()).optional(),
  
  // Contact information
  contact: z.object({
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional()
  }).optional()
});

module.exports = {
  ResumeSchema,
  CoverLetterSchema
};
