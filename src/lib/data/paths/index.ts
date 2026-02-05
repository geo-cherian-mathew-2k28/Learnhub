import { LearningPath } from "../types";
import { KAFKA_PATH } from "./kafka";

export const ALL_PATHS: LearningPath[] = [
    KAFKA_PATH,
    // Future paths can be registered here
    {
        id: "path_backend",
        slug: "backend",
        title: "Backend Mastery",
        description: "Scale from Zero to Millions with professional system design.",
        icon: "Database",
        color: "#7C4DFF",
        modules: []
    }
];

export function getPathBySlug(slug: string): LearningPath | undefined {
    return ALL_PATHS.find(p => p.slug === slug);
}
