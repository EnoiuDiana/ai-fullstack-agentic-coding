# Assertions for Architecture Reference Skill

## Eval 1: Backend Structure

1. **Mentions three-layer architecture** - Response explains controller → service → repository layers
2. **Lists cross-cutting concerns** - Mentions dto/mapper, security, exception, config packages
3. **Describes key patterns** - References Strategy pattern for order processing and/or Repository pattern
4. **Provides file paths** - Includes specific directory paths like onlineshopapi/src/main/java/msg/onlineshopapi/

## Eval 2: Authentication Flow

1. **Explains full JWT flow** - Covers login → token generation → storage → interceptor → validation
2. **Names specific classes** - Mentions AuthController, AuthService, JwtService, JwtAuthFilter, AuthTokenInterceptor
3. **Describes JWT structure** - Mentions token contains sub, role, iat, exp claims
4. **Covers frontend and backend** - Explains both sides of the authentication flow

## Eval 3: Add New Role

1. **Provides step-by-step checklist** - Lists the 5 steps from architecture doc
2. **Mentions backend enum** - References UserRole enum in backend Java code
3. **Mentions frontend enum** - References UserRole enum in frontend TypeScript
4. **Includes @PreAuthorize** - Mentions annotation for backend endpoint protection
5. **Includes guard configuration** - Mentions rolesGuard with data: { roles: [...] }

## Eval 4: Data Model

1. **Explains entity relationships** - Covers User → Order → OrderDetail chain
2. **Mentions composite key** - Notes OrderDetail uses (order_id, product_id) composite key
3. **Describes cascade behavior** - Mentions cascade delete from Order to OrderDetail
4. **Notes price snapshot** - Explains OrderDetail captures product_price at order time
5. **Mentions embedded address** - Notes Address is embedded in Order entity

## Eval 5: Add Wishlist Feature

1. **Backend steps listed** - Provides the 6-step backend process (entity, repository, service, DTOs, controller, migration)
2. **Frontend steps listed** - Provides the 4-step frontend process (feature module, routes, import, navigation constant)
3. **Steps are actionable** - Each step is specific enough to act on
4. **Mentions Flyway migration** - Includes database migration as a required step

## Eval 6: JWT Rationale

1. **States stateless benefit** - Mentions JWT enables stateless authentication
2. **States scaling benefit** - Mentions horizontal scaling capability
3. **States SPA compatibility** - Mentions it works well with single-page application architecture
4. **No session storage needed** - Notes eliminates need for server-side session storage

## Eval 7: Routing Guards

1. **Explains guard chain** - Describes canActivate: [authGuard, rolesGuard] pattern
2. **Explains authGuard** - Describes it checks JWT presence
3. **Explains rolesGuard** - Describes it checks user.role vs route.data.roles
4. **Mentions guestGuard** - Notes it blocks authenticated users from login/register
5. **Shows route configuration** - Includes example with data: { roles: [...] }

## Eval 8: Mock Mode

1. **Explains environment switching** - Describes environment.mock.ts sets apiUrl to 'http://mock-api'
2. **Mentions mockApiInterceptor** - Names the interceptor that catches mock requests
3. **Describes handler routing** - Explains requests route to feature-specific handlers
4. **Provides start command** - Includes npm run start:mock command
5. **Mentions mock data location** - References core/mocks/data/ directory

---

## Grading Criteria

For each assertion:

- **PASS**: The response clearly addresses this point with accurate information from ARCHITECTURE.md
- **PARTIAL**: The response mentions it but lacks detail or accuracy
- **FAIL**: The response doesn't address this point or provides incorrect information

The skill should aim for 100% pass rate since it has direct access to the complete architecture documentation.
