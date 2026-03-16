# Phase 1: Planning (Orchestration)
**Task:** Create a supplementary lesson documentation (`aula-04-1.mdx`) in the `living-docs` repository containing all DTOs and corresponding SQL dummy data insertion scripts.

## Background Context
The students need an intermediate reference document that links the Kotlin `@Serializable` Models (`Models.kt`) to their actual database records. This will serve as a seeding guide (populating the database with fake data) using raw SQL `INSERT` statements matching the KMP backend structure.

## Proposed Structure (`living-docs/docs/ldm/aula-04-1.mdx`)
1. **Header & Context:** Informing that this is a supplementary guide exclusively inside the living-docs.
2. **Core Domain Mapping (Data Classes + SQL Inserts):**
   - **User:** `User` DTO + `INSERT INTO users (...)`
   - **Course:** `Course` DTO + `INSERT INTO courses (...)`
   - **Lesson:** `Lesson` DTO + `INSERT INTO lessons (...)`
   - **Question:** `Question` DTO + `INSERT INTO questions (...)`
   - **LessonProgress:** `LessonProgress` DTO + `INSERT INTO lesson_progress (...)`
   - **QuestionAttempt:** `QuestionAttempt` DTO + `INSERT INTO question_attempts (...)`
3. **Payload Models:**
   - Mentioning payload-only DTOs (`LoginRequest`, `RegisterRequest`, `AuthResponse`) that don't have direct SQL insertion scripts because they are DTOs for the Ktor/Supabase Auth API.

## Phase 2: Orchestration Agents
1. **backend-specialist**: Extract all distinct Kotlin DTO representations currently present in `Models.kt`.
2. **database-architect**: Construct standard PostgreSQL `INSERT INTO` statements generating logical, coherent fictititous data for a learning app (e.g., John Doe user, Kotlin course, Variables lesson).
3. **documentation-writer**: Format the layout using accurate Markdown, headers, and specific code blocks for `.kt` and `.sql`.
