---
name: architecture-reference
description: Comprehensive architecture reference for this fullstack e-commerce application. Use this skill whenever the user asks about project structure, architecture, design patterns, technology stack, data models, authentication flow, API endpoints, frontend organization, routing, state management, security model, deployment, testing strategy, or how to extend/modify the application. Trigger on keywords like "architecture", "structure", "how does [feature] work", "data model", "backend", "frontend", "authentication", "JWT", "guards", "routing", "API", "database", "deployment", "add new feature", "add new role", "order strategy", "testing", "build", or any question about technical implementation details.
---

# Architecture Reference

This skill provides expert knowledge about the fullstack e-commerce application architecture. Use it to answer questions about technical implementation, design decisions, and extension points.

## When to Use

Trigger this skill for:

- General architecture questions ("explain the architecture", "how is the system structured")
- Specific technical questions ("how does authentication work", "what's the data model", "where are routes defined")
- Implementation guidance ("how do I add a new feature", "how do I add a new user role")
- Technology stack questions ("what backend framework", "why PostgreSQL", "what frontend library")
- Debugging and troubleshooting ("where is JWT validated", "how does mock mode work")

## How to Use

1. **Always read the reference first**: Load `references/ARCHITECTURE.md` into context at the start
2. **Answer naturally**: Use the loaded architecture knowledge to answer the user's question directly
3. **Be specific**: Cite file paths, class names, and line ranges when relevant
4. **Provide context**: Explain not just what, but why architectural decisions were made
5. **Suggest next steps**: If the user is implementing something, guide them through the process

## Reference Loading

**Load immediately when skill triggers:**

```
Read references/ARCHITECTURE.md
```

This contains the complete architectural documentation including:

- Stack details (Spring Boot 4.0.3, Angular 21, PostgreSQL 18)
- Data model with entity relationships
- Backend architecture (controller → service → repository layers)
- Frontend architecture (clib, core, features modules)
- Security model (JWT flow, guards, role-based access)
- API structure and endpoints
- Routing and state management
- Build and deployment procedures
- Extension points and how-to guides

## Response Pattern

When answering questions:

1. **Understand the question scope**: Is it asking about backend, frontend, database, security, or full-stack?
2. **Extract relevant architecture details**: Pull the specific information from ARCHITECTURE.md
3. **Answer directly**: Provide the information in a clear, actionable format
4. **Include examples**: Show code snippets or patterns from the architecture doc when helpful
5. **Point to files**: Reference actual file paths where the implementation lives
6. **Explain trade-offs**: If architectural decisions involve trade-offs, mention them

## Example Interactions

**User asks**: "How does authentication work in this app?"

**Response approach**:

- Explain the JWT-based auth flow (login → token generation → storage → interceptor)
- Mention specific files: `AuthController.java`, `JwtService.java`, `AuthTokenInterceptor.ts`
- Show the JWT structure (sub, role, iat, exp)
- Explain how frontend guards protect routes
- Note where tokens are stored (localStorage)

**User asks**: "I want to add a new user role, what do I need to change?"

**Response approach**:

- Reference the "Adding New User Roles" section
- Provide the 5-step checklist from the architecture doc
- Show example code for `@PreAuthorize` and `rolesGuard`
- Explain where enums are defined (backend and frontend)

**User asks**: "What's the backend structure?"

**Response approach**:

- Show the layer structure: controller → service → repository
- Explain cross-cutting concerns (dto/mapper, security, exception, config)
- Describe key patterns (Strategy pattern for orders, Repository pattern, Global exception handling)
- Mention specific directories under `onlineshopapi/src/main/java/msg/onlineshopapi/`

## Key Architectural Concepts to Emphasize

### Backend

- **Three-layer architecture**: Separation of concerns (controller, service, repository)
- **Strategy pattern**: Order processing strategies (SINGLE_LOCATION vs MOST_ABUNDANT)
- **Security**: JWT-based stateless authentication with Spring Security
- **Data access**: Spring Data JPA with repositories
- **Migrations**: Flyway for version-controlled schema changes

### Frontend

- **Feature-based organization**: Lazy-loaded modules (auth, cart, orders, products)
- **Standalone components**: No NgModules
- **Route guards**: authGuard, rolesGuard, guestGuard for authorization
- **State management**: Angular signals for reactivity
- **Mock mode**: MSW interceptor for development without backend

### Security Model

- **JWT flow**: Login → token generation → localStorage → interceptor → backend validation
- **Role-based access**: CUSTOMER vs ADMIN roles at both backend (@PreAuthorize) and frontend (guards)
- **CORS**: Configurable via environment variable

### Extension Points

- Adding new features: Follow the 6-step backend process or 4-step frontend process
- Adding new roles: Update enums, add guards, use @PreAuthorize
- Changing order strategy: Implement OrderStrategy interface and register in config

## Important File Locations

Reference these paths when answering questions:

**Backend:**

- Main application: `onlineshopapi/src/main/java/msg/onlineshopapi/`
- Configuration: `onlineshopapi/src/main/resources/application.yml`
- Migrations: `onlineshopapi/src/main/resources/db/migration/`
- Tests: `onlineshopapi/src/test/java/msg/onlineshopapi/`

**Frontend:**

- Application root: `onlineshopui/src/app/`
- Shared components: `onlineshopui/src/app/clib/`
- Core utilities: `onlineshopui/src/app/core/`
- Features: `onlineshopui/src/app/features/`
- Environments: `onlineshopui/src/environments/`

**Database:**

- Docker setup: `docker/development/docker-compose.yml`

## Handling Different Question Types

### "How does X work?" questions

1. Load the relevant section from ARCHITECTURE.md
2. Explain the flow or mechanism step-by-step
3. Show code examples if helpful
4. Mention related files or components

### "Where is X defined?" questions

1. Identify the layer (backend/frontend/database)
2. Provide the specific file path
3. Explain the surrounding context
4. Note any dependencies or related files

### "How do I implement X?" questions

1. Check if there's an extension point guide in ARCHITECTURE.md
2. Provide step-by-step instructions
3. Reference existing examples in the codebase
4. Warn about common pitfalls or considerations

### "Why was X chosen?" questions

1. Look for the technology decision in the "Technology Decisions" section
2. Explain the reasoning and trade-offs
3. Note any alternatives that were considered
4. Mention how it fits into the overall architecture

## Tone and Style

- **Be authoritative**: You have complete knowledge of the architecture
- **Be concise**: Get to the answer quickly, then provide details
- **Be specific**: Use actual class names, file paths, and code patterns
- **Be helpful**: Anticipate follow-up questions and address them preemptively
- **Be accurate**: Everything you say should be grounded in the ARCHITECTURE.md reference

## Notes

- The architecture documentation is comprehensive and should answer most questions
- If the user's question goes beyond what's documented, acknowledge the gap
- For implementation questions, guide the user through the actual files they need to modify
- Always maintain consistency with the documented architecture
