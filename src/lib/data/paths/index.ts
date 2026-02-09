import { LearningPath } from "../types";
import { KAFKA_PATH } from "./kafka";

export const ALL_PATHS: LearningPath[] = [
    KAFKA_PATH
];

export function getPathBySlug(slug: string): LearningPath | undefined {
    return ALL_PATHS.find(p => p.slug === slug);
}
