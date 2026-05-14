# Documentació de Tests (Full-Stack)

Aquest document detalla la infraestructura, configuració i bones pràctiques per als tests automatitzats tant del front-end (Angular) com del back-end (Laravel).

---

## 1. Filosofia de Testing

L'objectiu principal és assegurar la integritat de les rutes crítiques de l'aplicació i la lògica de negoci. Prioritzem:

- **Feature Tests** al back-end per validar l'API.
- **E2E Tests** al front-end per validar els fluxos d'usuari complets.

---

## 2. Back-end (Laravel)

Utilitzem **PHPUnit** com a runner de tests i **Mockery** per a simulacions.

### Tipus de Tests

- **Unit:** Tests de lògica aïllada (models, helpers). No toquen la base de dades.
- **Feature:** Tests d'integració que criden a l'API, validen middlewares, autenticació i persisteixen dades en memòria.

### Comandes

Executa els tests des de la carpeta `back/laravel-api`:

```bash
# Executar tots els tests
php artisan test
```

### Factories i Autenticació

- **Factories:** S'utilitzen per generar dades realistes. Exemple: `Student::factory()->create()`.
- **Autenticació:** Com que l'API està protegida amb Sanctum, utilitzem `Sanctum::actingAs($user)` per simular un usuari loguejat sense haver de passar pel flux d'OAuth en cada test.

---

## 3. Front-end (Angular)

### E2E Tests (Cypress)

**Cypress** s'utilitza per simular el comportament de l'usuari real al navegador. Prova la interacció entre el front i el back.

- Ubicació: `front/cypress/e2e/`

### Comandes

Executa des de la carpeta `front`:

```bash
# Executar E2E tests en mode "headless"
npm run test:e2e
```

---

## 4. CI/CD (GitHub Actions)

Cada vegada que es fa un Pull Request a les branques `dev` o `pre-prod`, s'executa automàticament el workflow `.github/workflows/tests.yml`.
Aquest workflow:

1. Aixeca els serveis amb `docker compose -f compose.TEST.yml`.
2. Executa els tests de Laravel.
3. Executa els tests de Cypress.
4. Falla si qualsevol test no passa, impedint el merge.
