import { z } from "zod";

export const RiskHeatmapSchema = z.object({
    memoryKey: z
        .string()
        .describe("Memory key containing patient data to visualize"),

    groupBy: z
        .enum(["department", "diagnosis", "age_bracket"])
        .default("department")
        .describe("How to group patients for the heatmap"),

    title: z
        .string()
        .default("Risk Distribution")
        .describe("Title for the visualization"),

    showLegend: z
        .boolean()
        .default(true)
        .describe("Whether to show the color legend"),
});

export type RiskHeatmapProps = z.infer<typeof RiskHeatmapSchema>;
