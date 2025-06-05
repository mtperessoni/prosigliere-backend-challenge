# Post and Comment API

This project is a simple API designed to manage posts and comments. It provides four main endpoints:

- **Create Post** — Create a new post.
- **Add Comment** — Add a comment to a specific post.
- **Get All Posts** — Retrieve a list of all posts (with caching).
- **Get Post By ID** — Retrieve a specific post by its ID (with caching).

## 🛠️ Tech Stack

- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL
- **Cache:** Redis
- **Testing:** Jest
- **Containerization:** Docker & Docker Compose

## 🚀 Running Locally with Docker

Make sure you have **Docker** and **Docker Compose** installed.

1. Clone this repository:

```bash
git clone https://github.com/mtperessoni/prosigliere-backend-challenge.git
cd prosigliere-backend-challenge
```

2. Run the project with Docker:

```bash
docker-compose up --build
```

3. The API will be available at:

```
http://localhost:3000
```

## 📜 API Endpoints

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| POST   | `/posts`              | Create a new post             |
| POST   | `/posts/:id/comments` | Add a comment to a post       |
| GET    | `/posts`              | Get all posts (with cache)    |
| GET    | `/posts/:id`          | Get a post by ID (with cache) |

## 🧪 API Testing

In the `insomnia` folder, you'll find an `api.yaml` file containing a collection of pre-configured requests for testing all API endpoints. You can import this file into Insomnia to quickly test the API functionality.

## ⚙️ Caching

- Caching is applied to:
  - **Get All Posts**
  - **Get Post By ID**

This improves read performance and reduces the load on the database for frequently requested data.

## 🏗️ Areas for Improvement

### 1. **Optimizing Count Operations**

- **Problem:** Counting the number of posts or comments (`SELECT COUNT(*)`) on large tables can become a performance bottleneck, even with caching.
- **Improvement:** Introduce a dedicated table to store the counts of:
  - Total posts
  - Total comments per post
- **Trade-offs:**
  - ✅ Pros: Reduces expensive aggregate queries; improves performance at scale.
  - ❌ Cons: Adds complexity to maintain data consistency, requiring updates on insert/delete operations.

### 2. **Asynchronous Post Creation**

- **Improvement:** Move the post creation process to a message queue (e.g., RabbitMQ, AWS SQS, Kafka).
- **Benefits:**
  - Non-blocking request handling.
  - Improved scalability under high load.
  - Decouples write operations from the API response time.
- **Trade-offs:**
  - Adds complexity in error handling, retries, and monitoring.
  - Potential delay between request and the actual availability of the post.

### 3. **Cache Invalidation for Comments**

- **Current Limitation:** The current strategy invalidates the entire cache whenever a new post or comment is added.
- **Improvement:** Implement fine-grained cache invalidation:

  - When a new post is created:
    - Invalidate the cache related to paginated post listings (e.g., /posts?page=1), since the pagination order could change.
  - When a new comment is added:
    - Invalidate the cache for:
      - The post listing (if it includes comment counts or metadata affected by the comment).
      - The specific post detail (/posts/:id), since the post's comment count or latest comment may change.

## 🧪 Running Tests

Run unit tests with:

```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License.
