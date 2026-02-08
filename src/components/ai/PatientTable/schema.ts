import { z } from "zod";

export const PatientTableSchema = z.object({
    memoryKey: z
        .string()
        .describe("REQUIRED. The exact 'memory_key' string returned by the 'get_patient_clinical_data' tool. Example: 'patients_123456'. Do NOT invent a key."),

    viewType: z
        .enum(["critical", "stable", "all"])
        .default("all")
        .describe("Filter view: 'critical' (>=0.7), 'stable' (<0.3), 'all'"),

    sortBy: z
        .enum(["risk_score", "name", "department", "age", "admission_date"])
        .default("risk_score")
        .describe("Column to sort by"),

    sortOrder: z.enum(["asc", "desc"]).default("desc").describe("Sort direction"),

    caption: z
        .string()
        .optional()
        .describe("Caption displayed above the table"),

    highlightColumn: z
        .string()
        .optional()
        .describe("Column to visually highlight"),

    pageSize: z
        .number()
        .default(50)
        .describe("Number of rows per page for virtualization"),
});

export type PatientTableProps = z.infer<typeof PatientTableSchema>;
