import { LearningPath } from "../types";

export const KAFKA_PATH: LearningPath = {
    id: "path_kafka",
    slug: "kafka",
    title: "Apache Kafka Mastery",
    description: "Master real-time event streaming and distributed architecture from zero to production hero.",
    icon: "Zap",
    color: "#FF7E29",
    modules: [
        {
            id: "m1",
            title: "Phase 1: The Big Picture",
            units: [
                {
                    id: "u_fs_100",
                    title: "Kafka in 100 Seconds",
                    description: "A lightning-fast introduction to why Kafka is the heart of modern data pipelines.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/embed/uvb00oaa3k8",
                    duration: "2 min",
                    xpPoints: 50,
                    isLocked: false,
                    isCompleted: false,
                    conceptInfo: {
                        title: "The Nervous System of Apps",
                        description: "Kafka is a distributed event streaming platform. Instead of apps talking directly to each other (and making a mess), they send events to Kafka, and others listen.",
                        points: [
                            "Decoupling: Producers and Consumers don't need to know each other.",
                            "Scalability: Handles trillions of events across thousands of servers.",
                            "Durability: Data is stored safely on disk like a database.",
                            "Speed: Low latency for real-time reactions."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_fs_1",
                            question: "What is Kafka's primary role in a tech stack?",
                            options: [
                                "A simple web server for HTML",
                                "A distributed event streaming platform",
                                "A styling framework for CSS",
                                "A version control system"
                            ],
                            correctAnswer: 1,
                            explanation: "Kafka acts as a central hub for streaming data between different parts of a system."
                        },
                        {
                            id: "q_fs_2",
                            question: "In Kafka, what do we call the 'apps that talk'?",
                            options: ["Listeners", "Consumers", "Producers", "Brokers"],
                            correctAnswer: 2,
                            explanation: "Producers are the applications that write or publish events to Kafka."
                        }
                    ]
                }
            ]
        },
        {
            id: "m2",
            title: "Phase 2: Core Foundations",
            units: [
                {
                    id: "u_nana_beg",
                    title: "Beginner Fundamentals",
                    description: "Learn Topics, Partitions, and the internal mechanics that make Kafka tick.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/embed/QkdkLdMBuL0",
                    duration: "20 min",
                    xpPoints: 150,
                    isLocked: true,
                    isCompleted: false,
                    conceptInfo: {
                        title: "The Architecture of Scale",
                        description: "Kafka organizes data into 'Topics'. To handle massive load, topics are split into 'Partitions' which are spread across multiple 'Brokers' (servers).",
                        points: [
                            "Topics: Logical categories (like folders) for messages.",
                            "Partitions: Physical chunks of a topic for parallelism.",
                            "Brokers: The servers that run Kafka and store data.",
                            "Consumer Groups: Multiple consumers working together to read data."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_nana_1",
                            question: "A 'Topic' in Kafka is best described as:",
                            options: [
                                "A specific user ID",
                                "A logical stream of records",
                                "A physical server name",
                                "A type of database index"
                            ],
                            correctAnswer: 1,
                            explanation: "Topics are the categories where messages are published, representing a stream of data."
                        },
                        {
                            id: "q_nana_2",
                            question: "Why do we use 'Partitions' in Kafka?",
                            options: [
                                "To encrypt data",
                                "To delete old messages",
                                "To enable parallel processing and scalability",
                                "To slow down the data flow"
                            ],
                            correctAnswer: 2,
                            explanation: "Partitions allow a topic to be broken down and processed by multiple consumers simultaneously."
                        }
                    ]
                },
                {
                    id: "u_bbg_fun",
                    title: "Kafka Fundamentals Animated",
                    description: "Visualize how Kafka handles data under the hood with high-quality animations.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/embed/-RDyEFvnTXI",
                    duration: "10 min",
                    xpPoints: 100,
                    isLocked: true,
                    isCompleted: false,
                    conceptInfo: {
                        title: "The Commit Log Secret",
                        description: "Under the hood, Kafka is just a giant, append-only commit log. This simplicity is why it is so fast and reliable.",
                        points: [
                            "Sequential I/O: Writing to the end of a file is extremely fast.",
                            "Zero-Copy: Kafka sends data directly from disk to network without CPU overhead.",
                            "Offsets: Every message has a unique ID to track what has been read.",
                            "Replication: Copies of data are kept on different servers for safety."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_bbg_1",
                            question: "What makes Kafka faster than traditional message brokers?",
                            options: [
                                "It doesn't use disk storage",
                                "It uses sequential I/O and zero-copy technology",
                                "It only works with small pieces of data",
                                "It requires manual data entry"
                            ],
                            correctAnswer: 1,
                            explanation: "Kafka leverages operating system features like page cache and zero-copy to move data efficiently."
                        }
                    ]
                }
            ]
        },
        {
            id: "m3",
            title: "Phase 3: Technical Deep Dive",
            units: [
                {
                    id: "u_kk_cr",
                    title: "Intermediate Crash Course",
                    description: "Bridge the gap between theory and implementation with this technical setup guide.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/embed/cNFAP9OnJjo",
                    duration: "60 min",
                    xpPoints: 300,
                    isLocked: true,
                    isCompleted: false,
                    conceptInfo: {
                        title: "Brokers, Zookeeper & Kraft",
                        description: "Learn how Kafka manages its own cluster. Traditionally it used Zookeeper, but modern Kafka (KRaft) handles metadata internally.",
                        points: [
                            "Cluster Management: How nodes talk to each other.",
                            "Retention Policy: Deciding how long to keep data.",
                            "Acknowledgement (ACKs): Ensuring data is safe before moving on.",
                            "Throughput vs Latency: Tuning Kafka for your specific needs."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_kk_1",
                            question: "What is the role of KRaft in modern Kafka?",
                            options: [
                                "A new way to write Kafka producers",
                                "A protocol to replace Zookeeper for metadata management",
                                "A tool for visualizing data",
                                "A security encryption standard"
                            ],
                            correctAnswer: 1,
                            explanation: "KRaft allows Kafka to run without an external Zookeeper cluster, simplifying architecture."
                        }
                    ]
                }
            ]
        },
        {
            id: "m4",
            title: "Phase 4: Practical Mastery",
            units: [
                {
                    id: "u_nana_adv",
                    title: "Hands-On Project Demo",
                    description: "Build a real-world, scalable system using Kafka and a production-grade tech stack.",
                    type: "video",
                    contentUrl: "https://www.youtube.com/embed/B7CwU_tNYIE",
                    duration: "45 min",
                    xpPoints: 500,
                    isLocked: true,
                    isCompleted: false,
                    conceptInfo: {
                        title: "Production Engineering",
                        description: "In the real world, Kafka is integrated with databases, microservices, and monitoring tools to build resilient systems.",
                        points: [
                            "Microservices: Decoupling services using Kafka events.",
                            "Error Handling: Retries and Dead Letter Topics.",
                            "Monitoring: Tracking lag and throughput in production.",
                            "Ecosystem: Using tools like Kafka Connect and Schema Registry."
                        ]
                    },
                    quizQuestions: [
                        {
                            id: "q_na_adv_1",
                            question: "What is a 'Dead Letter Topic' used for?",
                            options: [
                                "Storing emails that couldn't be sent",
                                "Handling messages that fail processing after multiple retries",
                                "Backroom storage for old data",
                                "Speeding up the main topic"
                            ],
                            correctAnswer: 1,
                            explanation: "Dead Letter Topics are utilized to isolate problematic messages so they don't block the rest of the pipeline."
                        }
                    ]
                }
            ]
        }
    ]
};
