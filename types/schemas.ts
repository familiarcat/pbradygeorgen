import { z } from 'zod';

/**
 * Zod Schemas for the PDF-Next.js Project
 * 
 * "Kneel before Zod!" - General Zod, Superman II
 * 
 * These schemas enforce strict validation of our data structures,
 * ensuring Hesse-like precision throughout the application.
 */

// ===== API Request/Response Schemas =====

/**
 * Schema for format-content API request
 */
export const FormatContentRequestSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  format: z.enum(['markdown', 'text'], {
    errorMap: () => ({ message: "Format must be either 'markdown' or 'text'" })
  })
});

export type FormatContentRequest = z.infer<typeof FormatContentRequestSchema>;

/**
 * Schema for format-content API response
 */
export const FormatContentResponseSchema = z.object({
  success: z.boolean(),
  contentType: z.string().optional(),
  formattedContent: z.string().optional(),
  error: z.string().optional()
}).refine(data => {
  // Either success is true and formattedContent exists, or success is false and error exists
  return (data.success && data.formattedContent !== undefined) || 
         (!data.success && data.error !== undefined);
}, {
  message: "Response must include formattedContent when successful or error when unsuccessful"
});

export type FormatContentResponse = z.infer<typeof FormatContentResponseSchema>;

// ===== Content Type Schemas =====

/**
 * Valid content types that can be detected
 */
export const ContentTypeSchema = z.enum([
  'resume', 'cv', 'cover_letter', 'article', 
  'blog_post', 'brochure', 'advertisement', 
  'report', 'academic_paper', 'other'
]);

export type ContentType = z.infer<typeof ContentTypeSchema>;

/**
 * Result type with Zod validation
 */
export const ResultSchema = <T extends z.ZodType>(schema: T) => 
  z.object({
    success: z.boolean(),
    data: schema.optional(),
    error: z.string().optional()
  }).refine(result => {
    // Either success is true and data exists, or success is false and error exists
    return (result.success && result.data !== undefined) || 
           (!result.success && result.error !== undefined);
  }, {
    message: "Result must include data when successful or error when unsuccessful"
  });

// ===== Content Structure Schemas =====

/**
 * Schema for contact information
 */
export const ContactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional()
});

/**
 * Schema for subsections (e.g., job entries in a resume)
 */
export const SubsectionSchema = z.object({
  title: z.string(),
  details: z.string().optional(),
  items: z.array(z.string()).optional()
});

/**
 * Schema for main sections of a document
 */
export const SectionSchema = z.object({
  title: z.string(),
  content: z.union([z.string(), z.array(z.string())]).optional(),
  subsections: z.array(SubsectionSchema).optional()
});

/**
 * Schema for resume structure
 */
export const ResumeStructureSchema = z.object({
  name: z.string(),
  contactInfo: ContactInfoSchema.optional(),
  sections: z.array(SectionSchema)
});

export type ResumeStructure = z.infer<typeof ResumeStructureSchema>;

/**
 * Schema for generic document structure
 */
export const DocumentStructureSchema = z.object({
  title: z.string().optional(),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.union([z.string(), z.array(z.string())]).optional(),
    subsections: z.array(z.object({
      heading: z.string(),
      content: z.union([z.string(), z.array(z.string())]).optional(),
      items: z.array(z.string()).optional()
    })).optional()
  }))
});

export type DocumentStructure = z.infer<typeof DocumentStructureSchema>;

/**
 * Union type for all possible structured content
 */
export const StructuredContentSchema = z.union([
  ResumeStructureSchema,
  DocumentStructureSchema
]);

export type StructuredContent = z.infer<typeof StructuredContentSchema>;
