# Employees Module — Agent Guide

> Living guidance for AI agents and developers working on `src/modules/employees`.
> Companion architecture overview (Portuguese): [`docs/project-structure.md`](../../../docs/project-structure.md).

## Purpose of this document

This file captures the **current contract** of the employees hexagon after **Part 1** (Create Employee end-to-end). Use it to:

- Extend the module without breaking hexagonal boundaries
- Place new types, ports, and files in the correct layer
- Preserve existing naming, dependency, and testing conventions

### When to update this document

**Do not** treat this as a changelog. Trivial refactors, typo fixes, and test-only tweaks do **not** need an entry here.

**Do update** this document when any of the following change:

| Change type | Examples |
|-------------|----------|
| Architecture / layering | New folder, dependency direction change, wiring pattern |
| Public HTTP surface | New route, method, path, or response shape |
| Domain invariants | Role rules, activation policy, email uniqueness rules |
| Ports / DTOs | New inbound/outbound port, DTO fields, return contracts |
| Persistence mapping | Schema fields, mapper rules, repository responsibilities |
| Open decisions | Resolved TODOs, new known limitations |
| Conventions | Naming, test placement, shared-vs-module ownership |

After a meaningful change, update the relevant section(s) in place. Keep history out of this file unless a decision needs an explicit “why we chose X” note.

---

## Module status (Part 1 — complete)

### Delivered

| Capability | Status | Entry point |
|------------|--------|-------------|
| Create employee | Done | `POST /employee` |
| Email uniqueness policy | Done | `EmployeePoliciesService.ensureEmailIsAvailable` |
| Password confirmation | Done | `CreateEmployeeUsecase` |
| Password hashing | Done | `EncrypterPort` → `BcryptAdapter` (injected from `app.ts`) |
| Mongo persistence | Done | `EmployeeMongooseRepository` |
| Module HTTP ownership | Done | `infrastructure/inbound/http/employee.routes.ts` |
| Composition root wiring | Done | `employees.module.ts` + `app.ts` |

### Not in Part 1 (future work)

- List / get / update / deactivate / reactivate employee use cases
- Auth / authorization (who may create employees)
- Phone validation (see TODO in `CreateEmployeeUsecase`)
- Explicit reactivation flow for inactive employees with the same email
- Cross-module events / integration beyond this hexagon

---

## Architecture principles

Hexagonal (Ports & Adapters). Dependency rule:

```text
presentation / infrastructure  →  application  →  domain
domain ↛ application, presentation, infrastructure
```

Hard rules:

1. **Domain is pure** — no Express, Mongoose, bcrypt, env, or Nest-style DI.
2. **Domain does not import `application`.**
3. Controllers in `presentation` are **framework-agnostic** (no Express imports).
4. Express lives only in `infrastructure/inbound/http` (+ shared `adaptRoute`).
5. Wiring belongs in `employees.module.ts`; `app.ts` / `main.ts` only compose the app.
6. Other modules must **not** import this module’s internal `domain`. Cross-module communication goes through ports/events (when introduced).
7. Shared VOs (`Name`, `Email`, `Password`, `Nif`, `UniqueEntityId`) live in `@shared/domain`.

---

## Directory map

```text
src/modules/employees/
├── AGENT.md                          # this file
├── employees.module.ts               # composition / DI for the hexagon
│
├── domain/                           # business rules (pure)
│   ├── entities/
│   │   ├── Employee.ts
│   │   └── employee.spec.ts
│   ├── models/
│   │   ├── employee.model.ts         # Role, toCreate, isRole
│   │   └── employee.model.spec.ts
│   ├── ports/
│   │   └── find-employee-by-email.port.ts
│   ├── errors/
│   │   └── employee.errors.ts
│   └── services/
│       ├── employee-policies.service.ts
│       └── employee-policies.service.spec.ts
│
├── application/                      # use cases + driving/driven ports + DTOs
│   ├── dtos/
│   │   ├── create-employee.dto.ts
│   │   └── create-employee.dto.spec.ts
│   ├── ports/
│   │   ├── inbound/
│   │   │   └── create-employee.port.ts
│   │   └── outbound/
│   │       └── create-employee-repository.port.ts
│   └── usecases/
│       ├── create-employee.usecase.ts
│       └── create-employee.usecase.spec.ts
│
├── presentation/                     # HTTP controllers (no Express)
│   └── controllers/
│       ├── create-employee.controller.ts
│       └── create-employee.controller.spec.ts
│
└── infrastructure/
    ├── inbound/http/
    │   └── employee.routes.ts        # Express Router for this module
    └── outbound/persistence/
        ├── employee.schema.ts
        ├── employee.mapper.ts
        ├── employee-mongoose.repository.ts
        └── employee-mongoose.repository.spec.ts
```

Related outside the module:

| Path | Role |
|------|------|
| `src/app.ts` | Injects `connection` + `BcryptAdapter`, mounts `/employee` |
| `src/shared/**` | Entity base, VOs, EncrypterPort, BaseController, adaptRoute |
| `src/client/employee.http` | Manual REST Client requests |
| `docs/project-structure.md` | Repo-wide hexagonal structure (PT) |

---

## Layer responsibilities

| Layer | Owns | May depend on |
|-------|------|----------------|
| `domain` | Entity, model concepts, domain errors, domain services, domain ports | `@shared/domain` only |
| `application` | Use cases, inbound/outbound ports, use-case DTOs | `domain` + `@shared` |
| `presentation` | Controllers (validate required fields, map to HTTP) | `application` + `@shared/presentation` |
| `infrastructure/inbound` | Express routes | `presentation` + shared HTTP adapters |
| `infrastructure/outbound` | Mongoose schema, mapper, repository | `application` + `domain` + frameworks |
| `employees.module.ts` | Instantiates adapters and binds ports | all module layers + shared adapters |

### Where to put types

| Kind | Location | Example |
|------|----------|---------|
| Use-case input/output DTO | `application/dtos/` | `CreateEmployeeDto`, `CreateEmployeeResultDto` |
| Domain concept / persistence snapshot | `domain/models/` | `EmployeeModel.Role`, `EmployeeModel.toCreate` |
| Port used by a domain service | `domain/ports/` | `FindEmployeeByEmailPort` |
| Driving (inbound) port | `application/ports/inbound/` | `CreateEmployeePort` |
| Driven (outbound) port | `application/ports/outbound/` | `CreateEmployeeRepositoryPort` |

---

## Naming conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Entity | `PascalCase.ts` | `Employee.ts` |
| Port | `kebab-case.port.ts` | `create-employee.port.ts` |
| DTO | `kebab-case.dto.ts` | `create-employee.dto.ts` |
| Use case | `kebab-case.usecase.ts` | `create-employee.usecase.ts` |
| Controller | `kebab-case.controller.ts` | `create-employee.controller.ts` |
| Routes | `kebab-case.routes.ts` | `employee.routes.ts` |
| Repository | `kebab-case.repository.ts` | `employee-mongoose.repository.ts` |
| Schema / mapper | `kebab-case.schema.ts` / `.mapper.ts` | `employee.schema.ts` |
| Spec | co-located `*.spec.ts` | `create-employee.usecase.spec.ts` |
| Module factory | `*.module.ts` + `makeXModule` | `makeEmployeesModule` |

Path aliases (must be used instead of deep relative imports across packages):

| Alias | Resolves to |
|-------|-------------|
| `@modules/*` | `./src/modules/*` |
| `@shared/*` | `./src/shared/*` |
| `@configs/*` / `@config/*` | `./src/configs/*` |

---

## Domain model

### `Employee` entity

Factory methods:

- `Employee.create(CreateEmployeeProps)` — new employee; validates role; builds VOs; defaults `isActive=true`, `createdAt=now`, `deactivateAt=null`.
- `Employee.reconstitute(ReconstituteEmployeeProps)` — rebuild from persistence (already-validated VOs + id).

Behavior already on the entity (for future use cases):

- `activate()` / `deactivate()`
- `changePassword`, `changeRole`, `changeName`, `changeEmail`, `assignNif`

Snapshot for persistence / outbound ports comes from `employee.toJSON()` and is typed as `EmployeeModel.toCreate`.

### `EmployeeModel`

```ts
enum Role { ADMIN, MANAGER, EMPLOYEE }
type toCreate = ReturnType<Employee['toJSON']>
function isRole(value: unknown): value is Role
```

### Domain errors (`employee.errors.ts`)

| Error | When |
|-------|------|
| `InvalidEmployeeRoleError` | Role not in `EmployeeModel.Role` |
| `PasswordNotMatchError` | `password !== passwordConfirmation` |
| `EmployeeAlreadyExistsError` | Email found and employee is active |
| `EmployeeInactiveError` | Email found but employee is inactive |
| `EmployeeAlreadyActiveError` | `activate()` on already-active employee |
| `EmployeeAlreadyInactiveError` | `deactivate()` on already-inactive employee |
| `EmployeeNotFoundError` | Reserved for future lookups |

All extend `@shared/domain/errors/domain.error`.

### `EmployeePoliciesService`

Current policy: `ensureEmailIsAvailable(email)`

| Lookup result | Outcome |
|---------------|---------|
| Not found | OK — email available |
| Found + active | `EmployeeAlreadyExistsError` |
| Found + inactive | `EmployeeInactiveError` (reactivation is an open product decision; do not silently create a duplicate) |

Depends on domain port `FindEmployeeByEmailPort` (not on Mongoose).

---

## Application: Create Employee

### Ports

```ts
// inbound
interface CreateEmployeePort {
  execute(params: CreateEmployeeDto): Promise<CreateEmployeeResultDto>;
}

// outbound
interface CreateEmployeeRepositoryPort {
  create(employee: EmployeeModel.toCreate): Promise<CreateEmployeeResultDto>;
}
```

### DTOs

```ts
interface CreateEmployeeDto {
  name: string;
  email: string;
  role: EmployeeModel.Role;
  nif?: number | null;
  password: string;
  passwordConfirmation: string;
}

interface CreateEmployeeResultDto {
  id: string;
}
```

### Use case flow (`CreateEmployeeUsecase`)

1. Reject if `password !== passwordConfirmation` → `PasswordNotMatchError`
2. `Employee.create(...)` then `.toJSON()` (VO validation happens here)
3. `employeePoliciesService.ensureEmailIsAvailable(email)`
4. Encrypt password via `EncrypterPort`
5. Persist via `CreateEmployeeRepositoryPort.create`
6. Return `{ id }`

**Known TODO in code:** phone validation before create (should be injected as a dependency when introduced).

---

## Presentation & HTTP

### Controller

`CreateEmployeeController` extends `BaseController`:

- Required fields: `name`, `email`, `password`, `passwordConfirmation`
- Missing field → `400` + `MissingParamError`
- Success → `201` + `{ id }` via `created(...)`
- Unexpected errors → `serverError(...)`

`role` / `nif` are passed through when present; domain validates role.

### Routes

```ts
// employee.routes.ts
router.post('/', adaptRoute(createEmployeeController));
```

Mounted in `app.ts` as:

```text
POST /employee
```

Manual request sample: `src/client/employee.http`.

### Request → response sequence

```text
Client
  → employee.routes + adaptRoute
  → CreateEmployeeController.handle
  → CreateEmployeePort.execute
  → CreateEmployeeUsecase
      → Employee.create
      → EmployeePoliciesService.ensureEmailIsAvailable
          → FindEmployeeByEmailPort (repo)
      → EncrypterPort.encrypt
      → CreateEmployeeRepositoryPort.create
  → 201 { data: { id } }
```

---

## Persistence

### Schema highlights

- Unique index on `email`
- `role` enum: `ADMIN | MANAGER | EMPLOYEE`
- Fields: `name`, `email`, `role`, `password`, `nif`, `isActive`, `createdAt`, `deactivateAt`

### Repository

`EmployeeMongooseRepository` implements:

- `CreateEmployeeRepositoryPort` → `create`
- `FindEmployeeByEmailPort` → `findByEmail` (lean + mapper)

### Mapper rules

- Document `_id` ↔ string `id`
- `nif`: number in Mongo ↔ string (or null) in `EmployeeModel.toCreate`
- Defaults for missing `isActive` / dates when reading lean documents

When adding fields: update **schema → mapper → entity props / create props → DTOs** in that order of concern, and keep domain free of Mongoose types.

---

## Wiring (`employees.module.ts`)

Factory: `makeEmployeesModule({ connection, encrypter })`.

Composition order today:

1. `connection.model('Employee', EmployeeSchema)`
2. `EmployeeMongooseRepository`
3. `EmployeePoliciesService(repository)`
4. `CreateEmployeeUsecase(policies, encrypter, repository)`
5. `CreateEmployeeController(createEmployee)`
6. `makeEmployeeRoutes({ createEmployeeController })`

Returns `{ createEmployeeController, createEmployee, router }`.

**Rule for agents:** when adding a use case, wire it in this file; do not construct repositories inside controllers or use cases.

---

## Testing conventions

- Unit specs are **co-located** (`*.spec.ts` next to production file).
- Prefer mocking ports at use-case / controller boundaries.
- Repository specs may use Mongo memory helpers from `@configs/database/mongoose`.
- Coverage config excludes bootstrap, module wiring, HTTP routes/adapters, schemas, and configs — do not “fix coverage” by moving logic into those excluded files.

Suggested checklist for a new use case:

1. Domain changes (entity/model/errors/policies) + specs
2. DTO + inbound/outbound ports
3. Use case + spec
4. Controller + spec
5. Route registration
6. Repository method(s) + mapper/schema if needed + spec
7. Wire in `employees.module.ts`
8. Update `src/client/employee.http` if HTTP surface changed
9. Update **this** `AGENT.md` if architecture/contracts changed

---

## How to add a new use case (playbook)

Example: `DeactivateEmployee`.

1. **Domain** — ensure entity behavior exists (`deactivate()` already does); add policy/errors if needed.
2. **Application DTO** — `application/dtos/deactivate-employee.dto.ts`.
3. **Ports** — inbound `DeactivateEmployeePort`; outbound port(s) as needed (e.g. find by id + save).
4. **Use case** — `application/usecases/deactivate-employee.usecase.ts` implementing the inbound port.
5. **Presentation** — controller under `presentation/controllers/`.
6. **Infrastructure inbound** — register route in `employee.routes.ts` (extend `EmployeeRoutesDependencies`).
7. **Infrastructure outbound** — extend repository/mapper/schema only if persistence API is insufficient.
8. **Module** — construct and inject in `makeEmployeesModule`.
9. **Docs** — update this AGENT.md sections: status table, ports, HTTP surface.

Never shortcut by calling the repository from the controller.

---

## Do / Don’t

| Do | Don’t |
|----|-------|
| Depend inward toward `domain` | Import Express/Mongoose inside domain or use cases |
| Inject ports via constructor | Instantiate bcrypt/mongoose inside use cases |
| Put use-case I/O in `application/dtos` | Put HTTP DTOs inside `domain/models` |
| Put `Role` / snapshots in `domain/models` | Duplicate role enums in schema without aligning domain |
| Co-locate `*.spec.ts` | Create a parallel `__tests__` tree for this module |
| Use `@modules` / `@shared` aliases | Deep `../../../` imports across packages |
| Keep controllers framework-free | Import `express` in `presentation/` |
| Update AGENT.md on contract changes | Log every commit or cosmetic rename here |

---

## Open decisions / known limitations

1. **Inactive email collision** — creating a new employee with the same email as an inactive one is blocked (`EmployeeInactiveError`). Reactivation vs. new account needs product/domain confirmation.
2. **Phone validation** — TODO in `CreateEmployeeUsecase`; plan to inject as a dependency.
3. **Authorization** — Part 1 has no auth middleware on `POST /employee`.
4. **NIF in HTTP create** — supported on DTO/entity; controller currently does not forward `nif` from the request (gap to close if NIF is required at API boundary).
5. **Error HTTP mapping** — controller maps most failures through `serverError`; finer-grained domain → HTTP status mapping may be introduced later without moving that logic into domain.

---

## Quick reference: Part 1 file ownership

| Concern | Owner file |
|---------|------------|
| Business creation rules | `domain/entities/Employee.ts` |
| Role / snapshot types | `domain/models/employee.model.ts` |
| Email availability | `domain/services/employee-policies.service.ts` |
| Orchestration | `application/usecases/create-employee.usecase.ts` |
| HTTP validation / status | `presentation/controllers/create-employee.controller.ts` |
| Route | `infrastructure/inbound/http/employee.routes.ts` |
| Mongo I/O | `infrastructure/outbound/persistence/employee-mongoose.repository.ts` |
| DI | `employees.module.ts` |
| App mount | `src/app.ts` → `app.use('/employee', employees.router)` |
