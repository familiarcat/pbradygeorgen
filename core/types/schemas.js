"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredContentSchema = exports.DocumentStructureSchema = exports.ResumeStructureSchema = exports.SectionSchema = exports.SubsectionSchema = exports.ContactInfoSchema = exports.ResultSchema = exports.ContentTypeSchema = exports.FormatContentResponseSchema = exports.FormatContentRequestSchema = void 0;
const zod_1 = require("zod");
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
exports.FormatContentRequestSchema = zod_1.z.object({
    filePath: zod_1.z.string().min(1, "File path is required"),
    format: zod_1.z.enum(['markdown', 'text'], {
        errorMap: () => ({ message: "Format must be either 'markdown' or 'text'" })
    })
});
/**
 * Schema for format-content API response
 */
exports.FormatContentResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    contentType: zod_1.z.string().optional(),
    formattedContent: zod_1.z.string().optional(),
    error: zod_1.z.string().optional()
}).refine(data => {
    // Either success is true and formattedContent exists, or success is false and error exists
    return (data.success && data.formattedContent !== undefined) ||
        (!data.success && data.error !== undefined);
}, {
    message: "Response must include formattedContent when successful or error when unsuccessful"
});
// ===== Content Type Schemas =====
/**
 * Valid content types that can be detected
 */
exports.ContentTypeSchema = zod_1.z.enum([
    'resume', 'cv', 'cover_letter', 'article',
    'blog_post', 'brochure', 'advertisement',
    'report', 'academic_paper', 'other'
]);
/**
 * Result type with Zod validation
 */
const ResultSchema = (schema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    data: schema.optional(),
    error: zod_1.z.string().optional()
}).refine(result => {
    // Either success is true and data exists, or success is false and error exists
    return (result.success && result.data !== undefined) ||
        (!result.success && result.error !== undefined);
}, {
    message: "Result must include data when successful or error when unsuccessful"
});
exports.ResultSchema = ResultSchema;
// ===== Content Structure Schemas =====
/**
 * Schema for contact information
 */
exports.ContactInfoSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    location: zod_1.z.string().optional()
});
/**
 * Schema for subsections (e.g., job entries in a resume)
 */
exports.SubsectionSchema = zod_1.z.object({
    title: zod_1.z.string(),
    details: zod_1.z.string().optional(),
    items: zod_1.z.array(zod_1.z.string()).optional()
});
/**
 * Schema for main sections of a document
 */
exports.SectionSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    subsections: zod_1.z.array(exports.SubsectionSchema).optional()
});
/**
 * Schema for resume structure
 */
exports.ResumeStructureSchema = zod_1.z.object({
    name: zod_1.z.string(),
    contactInfo: exports.ContactInfoSchema.optional(),
    sections: zod_1.z.array(exports.SectionSchema)
});
/**
 * Schema for generic document structure
 */
exports.DocumentStructureSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    sections: zod_1.z.array(zod_1.z.object({
        heading: zod_1.z.string(),
        content: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
        subsections: zod_1.z.array(zod_1.z.object({
            heading: zod_1.z.string(),
            content: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
            items: zod_1.z.array(zod_1.z.string()).optional()
        })).optional()
    }))
});
/**
 * Union type for all possible structured content
 */
exports.StructuredContentSchema = zod_1.z.union([
    exports.ResumeStructureSchema,
    exports.DocumentStructureSchema
]);
//# sourceMappingURL=schemas.js.map