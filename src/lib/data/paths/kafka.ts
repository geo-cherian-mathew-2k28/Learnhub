import { LearningPath } from "../types";

export const KAFKA_PATH: LearningPath = {
    id: "path_kafka",
    slug: "kafka",
    title: "Apache Kafka",
    description: "Master real-time event streaming and distributed architecture.",
    icon: "Zap",
    color: "#FF7E29",
    modules: [
        {
            id: "m0",
            title: "Foundation: The Messenger",
            units: [
                {
                    id: "u_intro_0",
                    title: "What is Apache Kafka?",
                    description: "Master the core role of Kafka as the world's most powerful event streaming platform.",
                    type: "concept",
                    duration: "3 min",
                    xpPoints: 50,
                    isLocked: false,
                    isCompleted: false,
                    conceptInfo: {
                        title: "The Digital Nervous System",
                        description: "Kafka acts as a central hub where data travels from 'Producers' (apps that talk) to 'Consumers' (apps that listen). It is distributed, meaning it runs on many computers at once for ultimate safety.",
                        points: [
                            "Producers: Send data (events) into Kafka.",
                            "Consumers: Read data from Kafka in real-time.",
                            "Persistence: Kafka stores data safely on disk so nothing is lost.",
                            "Scalability: It can handle trillions of events per day."
                        ]
                    }
                },
                {
                    id: "u_intro_1",
                    title: "Architecture Deep Dive",
                    description: "Visualize how Kafka connects complex ecosystems like Uber and Netflix.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/watch?v=JAlUHi7pTyE",
                    duration: "8 min",
                    xpPoints: 100,
                    isLocked: true,
                    isCompleted: false,
                    conceptInfo: {
                        title: "Real-World Impact",
                        description: "When an event occurs (like a car moving in Uber), Kafka broadcasts this message to the map, the billing system, and the safety monitor simultaneously.",
                        points: [
                            "Decoupling: Apps don't need to know each other; they only know Kafka.",
                            "Real-time: Data moves in milliseconds.",
                            "History: You can 'replay' old events at any time.",
                            "Fault Tolerance: If one server dies, another takes over instantly."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_ka_1",
                            question: "What is the primary role of Kafka in a system?",
                            options: ["To edit photos", "To act as a central hub for data streams", "To browse the internet", "A simple storage folder"],
                            correctAnswer: 1,
                            explanation: "Kafka is a 'Digital Nervous System'—it moves data between different parts of a large application instantly."
                        },
                        {
                            id: "q_ka_2",
                            question: "What do we call the apps that SEND data into Kafka?",
                            options: ["Receivers", "Watchers", "Producers", "Broadcasters"],
                            correctAnswer: 2,
                            explanation: "Producers 'produce' data and push it into Kafka topics."
                        },
                        {
                            id: "q_ka_3",
                            question: "What happens if a Kafka server goes down?",
                            options: ["All data is lost", "The internet stops", "Other servers keep the data safe (Replication)", "You have to restart the app"],
                            correctAnswer: 2,
                            explanation: "Kafka is 'Distributed' and 'Fault-Tolerant', meaning it keeps copies of data across multiple servers."
                        },
                        {
                            id: "q_ka_4",
                            question: "Which of these is NOT a Kafka feature?",
                            options: ["Scaling to millions of events", "Storing data on disk", "High-speed real-time delivery", "Making coffee"],
                            correctAnswer: 3,
                            explanation: "Kafka focuses on data streaming, storage, and scalability. It's powerful, but it doesn't make coffee!"
                        },
                        {
                            id: "q_ka_5",
                            question: "Why do companies like Netflix use Kafka?",
                            options: ["To watch movies", "To suggest shows in real-time based on your clicks", "To host their website", "As a simple email server"],
                            correctAnswer: 1,
                            explanation: "Netflix uses Kafka to process billions of 'click events' to update your recommendations instantly."
                        }
                    ]
                }
            ]
        },
        {
            id: "m1",
            title: "Core Mechanics: Topics & Partitions",
            units: [
                {
                    id: "u1",
                    title: "Topics: Logical Categories",
                    description: "Learn how data is organized and subdivided for massive scale.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/watch?v=fK2M3D_2_Y0",
                    duration: "10 min",
                    xpPoints: 150,
                    isLocked: true,
                    isCompleted: false,
                    conceptInfo: {
                        title: "The Organized Stream",
                        description: "A 'Topic' is a category name. Inside topics, data is split into 'Partitions'. This allows many computers to work on one topic together.",
                        points: [
                            "Topics: Labeled streams of data (e.g., 'orders').",
                            "Partitions: Sub-divisions for parallel processing.",
                            "Offsets: A unique ID for every message in a partition.",
                            "Consumer Groups: Teams of apps reading from partitions."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_arc_1",
                            question: "What is a Topic in Kafka?",
                            options: ["A unique password", "A category or feed name", "A broken cable", "A computer monitor"],
                            correctAnswer: 1,
                            explanation: "Think of a Topic as a folder or category name for specific types of data (like 'GPS_Locations')."
                        },
                        {
                            id: "q_arc_2",
                            question: "Why do we use Partitions?",
                            options: ["To make the code harder", "To allow multiple apps to read data at the same time", "To delete old data", "To change the color of the UI"],
                            correctAnswer: 1,
                            explanation: "Partitions allow Kafka to scale by letting multiple servers handle pieces of a single topic."
                        },
                        {
                            id: "q_arc_3",
                            question: "What is an 'Offset'?",
                            options: ["A mistake in the data", "The distance between servers", "A sequential ID for messages in a partition", "A type of coffee"],
                            correctAnswer: 2,
                            explanation: "An offset is a number that tells a Consumer exactly where it stopped reading in the stream."
                        }
                    ]
                }
            ]
        }
    ]
};
