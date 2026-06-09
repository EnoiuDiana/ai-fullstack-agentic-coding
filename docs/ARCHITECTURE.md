# Architecture

A three-tier e-commerce application enabling product catalog management, shopping cart, and order processing with role-based access control.

## Stack

**Backend:** Spring Boot 4.0.3 with Java 21  
**Frontend:** Angular 21 with Tailwind CSS 4  
**Database:** PostgreSQL 18  
**Authentication:** JWT with Spring Security

## Data Model

### Core Entities

```
User (id, username, password, role)
  └─> Order (id, user_id, address, created_at)
       └─> OrderDetail (order_id, product_id, quantity, product_price)

Product (id, name, description, price, image_url, weight, category_id)
  └─> Stock (product_id, location_id, quantity)

Location (id, name, address)

ProductCategory (id, name, description)
```

**Relationships:**

- User → Order: One-to-many
- Order → OrderDetail: One-to-many with cascade delete
- Product → Stock: One-to-many (tracks inventory per location)
- Product → ProductCategory: Many-to-one
- OrderDetail → Product: Many-to-one (snapshot price at order time)

**Composite Keys:**

- OrderDetail: `(order_id, product_id)`
- Stock: `(product_id, location_id)`

**Embedded:**

- Address (street, city, county, country) embedded in Order

## Backend Architecture

### Layer Structure

```
controller/       → REST endpoints (DTOs in/out)
    ↓
service/          → Business logic, transaction boundaries
    ↓
repository/       → Spring Data JPA (database access)
```

**Cross-cutting:**

- `dto/mapper/`: Entity ↔ DTO conversion
- `security/`: JWT generation/validation, Spring Security config
- `exception/`: Global exception handler with @ControllerAdvice
- `config/`: OpenAPI (Swagger), CORS

### Key Patterns

**Strategy Pattern for Order Processing:**

```java
interface OrderStrategy {
    List<Stock> findStocks(Set<OrderDetail> orderDetails);
}

// Implementations:
SingleLocationStrategy    // All items from one location
MostAbundantStrategy      // Split across locations by availability
```

Strategy selected via `ORDER_STRATEGY` environment variable (`SINGLE_LOCATION` | `MOST_ABUNDANT`).

**Security Flow:**

1. User logs in → `AuthController.login()`
2. `AuthService` validates credentials, generates JWT via `JwtService`
3. JWT contains `sub` (username) and `role` claims
4. Protected endpoints secured with `@PreAuthorize("hasRole('ROLE')")`
5. `JwtAuthFilter` intercepts requests, validates token, sets SecurityContext

**Repository Pattern:**

All repositories extend `JpaRepository<Entity, ID>`. Custom queries use `@Query` or derived method names.

Example:

```java
interface StockRepository extends JpaRepository<Stock, StockId> {
    List<Stock> findByIdLocationId(UUID locationId);
}
```

**Exception Handling:**

`GlobalExceptionHandler` catches:

- `ResourceNotFoundException` → 404
- `DuplicateResourceException` → 409
- `OrderNotProcessableException` → 400
- `MethodArgumentNotValidException` → 400 (validation errors)

### API Structure

Base URL: `http://localhost:3000/api`

**Public Endpoints:**

- `POST /auth/register` - User registration
- `POST /auth/login` - JWT authentication
- `GET /products` - Product catalog
- `GET /products/{id}` - Product details
- `GET /product-categories` - Categories list

**Customer Endpoints (require JWT):**

- `POST /orders` - Create order
- `GET /orders` - User's orders
- `GET /orders/{id}` - Order details

**Admin Endpoints (require ADMIN role):**

- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Database Migrations

Flyway manages schema:

- `src/main/resources/db/migration/V1__create_tables.sql` - Schema creation
- `src/main/resources/db/migration/local/` - Local seed data (profile-specific)

Migrations run automatically on startup.

## Frontend Architecture

### Module Organization

```
clib/                    → Shared component library
  ├─ components/         → Reusable UI (navbar, modal, card, icon, etc.)
  ├─ layouts/            → Layout shells (root-layout)
  └─ services/           → Shared services (theme)

core/                    → App-wide utilities
  ├─ config/             → Constants (navigation, icons, validation)
  ├─ mocks/              → MSW handlers for mock mode
  ├─ providers/          → DI providers (environment, validation messages)
  ├─ services/           → Core services (notifications)
  └─ types/              → Shared types, DTOs, enums

features/                → Lazy-loaded feature modules
  ├─ auth/               → Login, register, guards, interceptors
  ├─ cart/               → Shopping cart (localStorage-backed)
  ├─ orders/             → Order history and details
  └─ products/           → Catalog, CRUD (admin only)
```

### Routing Architecture

**Guard Chain:**

```
Route
  ├─ canActivate: [authGuard]      → Checks JWT presence
  └─ canActivate: [rolesGuard]     → Checks user.role vs route.data.roles
```

**Guest Routes:**

- `guestGuard` blocks authenticated users from login/register

**Route Configuration:**

```typescript
{
  path: 'products/create',
  component: ProductCreatePageComponent,
  canActivate: [authGuard, rolesGuard],
  data: { roles: [UserRole.Admin] }
}
```

Routes defined in `app.routes.ts` with feature-specific sub-routes imported from `<feature>/<feature>.routes.ts`.

### State Management

**Signals for Reactivity:**

Services use Angular signals for reactive state:

```typescript
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  public cartItems$ = this.cartItems.asReadonly();

  addToCart(product: ProductResponseDto, quantity: number) {
    this.cartItems.update((items) => [...items, { product, quantity }]);
  }
}
```

**LocalStorage Persistence:**

Cart items persisted to `localStorage` with JSON serialization. Rehydrated on service initialization.

### Authentication Flow

1. User submits login form
2. `AuthService.login()` POSTs to `/api/auth/login`
3. Backend returns `{ token, user }`
4. Token stored in `localStorage`
5. `AuthTokenInterceptor` adds `Authorization: Bearer {token}` to all requests
6. `AuthService.isAuthenticated$` signal tracks login state
7. `hasRole` directive conditionally renders UI based on user role

### Mock Mode

**Environment-based API:**

```typescript
// environment.development.ts
export const environment = {
  apiUrl: "http://localhost:3000/api", // Real backend
};

// environment.mock.ts
export const environment = {
  apiUrl: "http://mock-api", // Triggers MSW
};
```

**MSW Interceptor:**

When `apiUrl` is `http://mock-api`:

1. `mockApiInterceptor` intercepts HTTP requests
2. Routes to feature-specific handlers (`auth-handler.mock.ts`, etc.)
3. Returns mock data from `core/mocks/data/`

**Start mock mode:**

```bash
npm run start:mock
```

### Styling Architecture

**Tailwind CSS 4:**

Utility-first CSS via Tailwind classes. Custom theme configured in `tailwind.config.js`.

**Dark Mode:**

Theme toggled via `ThemeService` with `@media (prefers-color-scheme)` support.

## Security Model

### Backend Security

**JWT Structure:**

```json
{
  "sub": "username",
  "role": "CUSTOMER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

Token expiration: Configured in `JwtProperties` (default 1 hour).

**Password Storage:**

BCrypt hashing with Spring Security's `PasswordEncoder`.

**CORS Configuration:**

Origins controlled via `CORS_ALLOWED_ORIGINS` environment variable (comma-separated).

**Method Security:**

```java
@PreAuthorize("hasRole('ADMIN')")
public ProductResponseDto createProduct(ProductRequestDto dto) { ... }
```

### Frontend Security

**Token Management:**

JWT stored in `localStorage.getItem('authToken')`. Cleared on logout or 401 response.

**Route Protection:**

Guards prevent unauthorized access:

- `authGuard`: Redirects to login if not authenticated
- `rolesGuard`: Redirects to catalog if insufficient role
- `guestGuard`: Redirects to catalog if already authenticated

**XSS Protection:**

Angular's built-in sanitization for user input. `[innerHTML]` avoided.

## Build & Deployment

### Backend

**Build:**

```bash
mvn clean install
# Produces: target/onlineshopapi-*.jar
```

**Run:**

```bash
java -jar target/onlineshopapi-*.jar \
  --spring.profiles.active=production \
  --DB_HOST=... \
  --JWT_SECRET=...
```

**Environment Variables:**

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
- `JWT_SECRET`
- `ORDER_STRATEGY` (optional, default `SINGLE_LOCATION`)

### Frontend

**Build:**

```bash
npm run build
# Produces: dist/onlineshopui/browser/
```

**Production Configuration:**

Set `API_URL` environment variable at build time. Angular file replacements swap `environment.ts` based on configuration.

**Serve:**

Static files from `dist/` via nginx, Apache, or CDN.

## Development Workflow

### Local Setup

1. Start database:

   ```bash
   cd docker/development && docker-compose up -d
   ```

2. Start backend:

   ```bash
   cd onlineshopapi && mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

3. Start frontend:
   ```bash
   cd onlineshopui && npm start
   ```

Application available at `http://localhost:4200/`.

### Testing Strategy

**Backend:**

- Unit tests: `src/test/java/msg/onlineshopapi/unit/`
- Integration tests: `src/test/java/msg/onlineshopapi/integration/`
- Controller tests: `@WebMvcTest` with MockMvc

**Frontend:**

- Component tests: `*.spec.ts` with Jasmine/Karma
- Service tests: Mock HttpClient responses
- Guard tests: Mock Router and AuthService

Run tests:

```bash
# Backend
mvn test

# Frontend
npm test
```

### Code Quality

**Backend:**

- Lombok annotations reduce boilerplate (`@Getter`, `@Setter`, `@Builder`)
- Checkstyle enforced via Maven plugin (optional)

**Frontend:**

- Prettier for formatting: `npm run format`
- ESLint for linting: `npm run lint`
- TypeScript strict mode enabled

## Extension Points

### Adding New Features

**Backend:**

1. Create entity in `model/`
2. Add repository in `repository/`
3. Implement service in `service/`
4. Add DTOs in `dto/` with mapper
5. Create controller in `controller/`
6. Add Flyway migration in `db/migration/`

**Frontend:**

1. Create feature module in `features/<feature>/`
2. Add routes in `<feature>/<feature>.routes.ts`
3. Import routes in `app.routes.ts`
4. Add navigation constant in `core/config/constants/navigation.constants.ts`

### Adding New User Roles

1. Add role to `UserRole` enum (backend)
2. Update `UserRole` enum (frontend)
3. Add `@PreAuthorize` to protected endpoints
4. Add `rolesGuard` with `data: { roles: [...] }` to routes
5. Use `*hasRole` directive to conditionally render UI

### Changing Order Strategy

Implement `OrderStrategy` interface:

```java
public class CustomStrategy implements OrderStrategy {
    @Override
    public List<Stock> findStocks(Set<OrderDetail> orderDetails) {
        // Custom logic
    }
}
```

Register in `OrderStrategyConfig`:

```java
@Bean
public OrderStrategy orderStrategy(
    @Value("${order.strategy}") String strategy,
    SingleLocationStrategy single,
    MostAbundantStrategy abundant,
    CustomStrategy custom
) {
    return switch (strategy) {
        case "CUSTOM" -> custom;
        // ...
    };
}
```

Set `ORDER_STRATEGY=CUSTOM` environment variable.

## Performance Considerations

**Database:**

- Indexes on foreign keys (user_id, product_id, location_id)
- Composite keys for junction tables
- Lazy loading for collections (`@OneToMany` defaults to LAZY)

**Frontend:**

- Lazy-loaded routes reduce initial bundle size
- OnPush change detection for performance-critical components (not yet implemented)
- RxJS operators (`take(1)`, `shareReplay`) prevent memory leaks

**Caching:**

- Static assets cached via HTTP headers
- Product catalog could benefit from backend caching (Redis, not implemented)

## Known Limitations

- No pagination for product catalog (full list loaded)
- Cart state lost on browser refresh (localStorage only)
- No real-time stock updates (potential overselling)
- Single JWT expiration (no refresh tokens)
- No soft delete for products (hard delete only)
- Mock mode lacks complete API coverage (admin endpoints partial)

## Technology Decisions

**Why Spring Boot?**

- Mature ecosystem for REST APIs
- Built-in security with Spring Security
- Excellent JPA integration
- Strong community support

**Why Angular?**

- Opinionated structure scales for large apps
- Built-in dependency injection
- Strong TypeScript integration
- Signals provide reactive state without external libraries

**Why PostgreSQL?**

- ACID compliance for transactional data
- JSON support for future flexibility
- Widely supported in cloud platforms

**Why JWT?**

- Stateless authentication scales horizontally
- No server-side session storage
- Works well with SPA architecture

**Why Flyway?**

- Version-controlled schema migrations
- Automatic execution on startup
- Supports environment-specific migrations
