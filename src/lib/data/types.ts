export type ContentType = "video" | "quiz" | "article" | "concept";

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface ConceptCard {
    title: string;
    description: string;
    imageUrl?: string;
    points: string[];
}

export interface LearningUnit {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    contentUrl?: string;
    duration: string;
    xpPoints: number;
    isLocked: boolean;
    isCompleted: boolean;
    quizQuestions?: QuizQuestion[];
    conceptInfo?: ConceptCard;
}

export interface Module {
    id: string;
    title: string;
    units: LearningUnit[];
}

export interface LearningPath {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    modules: Module[];
}
