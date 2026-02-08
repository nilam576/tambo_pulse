import dynamic from "next/dynamic";
import { PatientTableSchema } from "./PatientTable/schema";
import { TreatmentSimulatorSchema } from "./TreatmentSimulator/schema";
import { RiskHeatmapSchema } from "./RiskHeatmap/schema";

export const generativeComponents = [
    {
        name: "PatientTable",
        description: "Virtualized table for patient data. Requires a 'memoryKey' from 'get_patient_clinical_data'.",
        component: dynamic(() => import("./PatientTable"), { ssr: false }),
        propsSchema: PatientTableSchema,
    },
    {
        name: "TreatmentSimulator",
        description: "Resource optimizer. MANDATORY: Reuse the 'memory_key' from the previous tool output in this thread. Do NOT ask the user for it. Show this immediately when user asks for simulation or 'what if'.",
        component: dynamic(() => import("./TreatmentSimulator"), { ssr: false }),
        propsSchema: TreatmentSimulatorSchema,
    },
    {
        name: "RiskHeatmap",
        description: "Visual analytics for risk scores. Requires a 'memoryKey' from 'get_department_summary'.",
        component: dynamic(() => import("./RiskHeatmap"), { ssr: false }),
        propsSchema: RiskHeatmapSchema,
    },
];

export { PatientTable } from "./PatientTable";
export { TreatmentSimulator } from "./TreatmentSimulator";
export { RiskHeatmap } from "./RiskHeatmap";
