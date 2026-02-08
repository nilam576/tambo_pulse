import { z } from "zod";

export const TreatmentSimulatorSchema = z.object({
    cohortMemoryKey: z
        .string()
        .describe("Memory key of the patient cohort being simulated"),

    initialStaffing: z
        .number()
        .min(0.5)
        .max(1.5)
        .default(1.0)
        .describe("Initial staffing level (1.0 = 100% baseline)"),

    initialBeds: z
        .number()
        .min(0)
        .max(1)
        .default(0.8)
        .describe("Initial bed availability (0.8 = 80% available)"),

    title: z
        .string()
        .default("Resource Allocation Simulator")
        .describe("Title for the simulator card"),

    showProjections: z
        .boolean()
        .default(true)
        .describe("Whether to show projected impact metrics"),
});

export type TreatmentSimulatorProps = z.infer<typeof TreatmentSimulatorSchema>;
