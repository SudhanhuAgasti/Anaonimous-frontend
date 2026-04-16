export const DEMO_USERS = [
  { id: "1", name: "Alex Morgan", email: "admin@demo.com", role: "admin", createdAt: "2025-01-15" },
  { id: "2", name: "Jamie Chen", email: "user@demo.com", role: "user", createdAt: "2025-02-20" },
  { id: "3", name: "Sam Rivera", email: "sam@demo.com", role: "user", createdAt: "2025-03-10" },
  { id: "4", name: "Taylor Kim", email: "taylor@demo.com", role: "user", createdAt: "2025-03-22" },
  { id: "5", name: "Jordan Lee", email: "jordan@demo.com", role: "user", createdAt: "2025-04-01" },
];
export const DEMO_POSTS = [
  {
    id: "p1",
    title: "Building Scalable Microservices with Go",
    content:
      "In this article, I explore the patterns and best practices for building scalable microservices using Go. We'll cover service discovery, load balancing, circuit breakers, and distributed tracing. The key insight is that Go's concurrency model makes it exceptionally well-suited for building high-throughput services that can handle thousands of concurrent connections with minimal memory overhead.",
    authorId: "2",
    authorName: "Jamie Chen",
    status: "approved",
    likes: 24,
    dislikes: 2,
    createdAt: "2025-04-01",
    tags: ["Go", "Microservices", "Backend"],
  },
  {
    id: "p2",
    title: "The Future of WebAssembly in Frontend Development",
    content:
      "WebAssembly is revolutionizing how we think about frontend performance. This post dives into real-world use cases where WASM provides significant performance improvements over traditional JavaScript, including image processing, cryptography, and complex data transformations. I'll show benchmarks and practical examples of integrating WASM modules into React applications.",
    authorId: "3",
    authorName: "Sam Rivera",
    status: "reviewed",
    likes: 18,
    dislikes: 1,
    createdAt: "2025-04-03",
    tags: ["WebAssembly", "Frontend", "Performance"],
  },
  {
    id: "p3",
    title: "Designing Accessible UI Components from Scratch",
    content:
      "Accessibility isn't an afterthought—it's a fundamental design principle. In this comprehensive guide, I walk through building a complete set of accessible UI components including modals, dropdowns, tabs, and accordions. Each component follows WAI-ARIA patterns and is tested with screen readers across multiple platforms.",
    authorId: "4",
    authorName: "Taylor Kim",
    status: "approved",
    likes: 31,
    dislikes: 0,
    createdAt: "2025-04-05",
    tags: ["Accessibility", "UI/UX", "React"],
  },
  {
    id: "p4",
    title: "Zero-Downtime Database Migrations at Scale",
    content:
      "Database migrations are one of the riskiest operations in production systems. This post shares battle-tested strategies for performing zero-downtime migrations on PostgreSQL databases handling millions of transactions per day. Topics include online schema changes, dual-write patterns, and automated rollback procedures.",
    authorId: "2",
    authorName: "Jamie Chen",
    status: "pending",
    likes: 8,
    dislikes: 3,
    createdAt: "2025-04-08",
    tags: ["Database", "PostgreSQL", "DevOps"],
  },
  {
    id: "p5",
    title: "Machine Learning in the Browser with TensorFlow.js",
    content:
      "Running ML models directly in the browser opens up incredible possibilities for privacy-preserving AI applications. This tutorial covers converting Python models to TensorFlow.js, optimizing inference performance, and building interactive demos that run entirely client-side without sending data to a server.",
    authorId: "5",
    authorName: "Jordan Lee",
    status: "approved",
    likes: 42,
    dislikes: 1,
    createdAt: "2025-04-10",
    tags: ["Machine Learning", "TensorFlow", "JavaScript"],
  },
  {
    id: "p6",
    title: "Event-Driven Architecture with Apache Kafka",
    content:
      "Event-driven architecture enables loose coupling and real-time data processing. This deep-dive covers designing event schemas, handling exactly-once semantics, implementing saga patterns for distributed transactions, and monitoring Kafka clusters in production environments.",
    authorId: "3",
    authorName: "Sam Rivera",
    status: "rejected",
    likes: 5,
    dislikes: 7,
    createdAt: "2025-04-12",
    tags: ["Kafka", "Architecture", "Distributed Systems"],
  },
];
export const DEMO_REVIEWS = [
  {
    id: "r1",
    postId: "p1",
    reviewerName: "Anonymous",
    rating: 4,
    content:
      "Well-structured article with practical examples. The section on circuit breakers could use more depth.",
    createdAt: "2025-04-02",
  },
  {
    id: "r2",
    postId: "p1",
    reviewerName: "Anonymous",
    rating: 5,
    content:
      "Excellent coverage of Go concurrency patterns. This is exactly what I needed for my project.",
    createdAt: "2025-04-02",
  },
  {
    id: "r3",
    postId: "p2",
    reviewerName: "Anonymous",
    rating: 4,
    content:
      "Good benchmarks, but would love to see comparisons with newer approaches like WebGPU.",
    createdAt: "2025-04-04",
  },
  {
    id: "r4",
    postId: "p3",
    reviewerName: "Anonymous",
    rating: 5,
    content:
      "Best accessibility guide I've read. The screen reader testing methodology is particularly valuable.",
    createdAt: "2025-04-06",
  },
  {
    id: "r5",
    postId: "p5",
    reviewerName: "Anonymous",
    rating: 3,
    content: "Interesting concept but the performance optimizations section feels incomplete.",
    createdAt: "2025-04-11",
  },
];
export const DEMO_COMMENTS = [
  {
    id: "c1",
    postId: "p1",
    authorName: "Sam Rivera",
    content: "Great article! I've been using similar patterns at work.",
    createdAt: "2025-04-02",
  },
  {
    id: "c2",
    postId: "p1",
    authorName: "Taylor Kim",
    content: "The distributed tracing section was very helpful. What tools do you recommend?",
    createdAt: "2025-04-03",
  },
  {
    id: "c3",
    postId: "p3",
    authorName: "Jamie Chen",
    content: "This should be required reading for every frontend developer.",
    createdAt: "2025-04-06",
  },
  {
    id: "c4",
    postId: "p5",
    authorName: "Sam Rivera",
    content: "I tried running the examples and the performance is surprisingly good!",
    createdAt: "2025-04-11",
  },
  {
    id: "c5",
    postId: "p5",
    authorName: "Taylor Kim",
    content: "Would love a follow-up on using WebGL for pre/post processing.",
    createdAt: "2025-04-12",
  },
  {
    id: "c6",
    postId: "p2",
    authorName: "Jordan Lee",
    content: "WASM is definitely the future. Nice benchmarks!",
    createdAt: "2025-04-04",
  },
];
