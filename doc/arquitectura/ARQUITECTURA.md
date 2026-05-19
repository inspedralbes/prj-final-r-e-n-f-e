# Sistema de Gestio d'Assistencia Escolar
## Documentacio Tecnica: Arquitectura del Sistema

---

## Taula de Continguts

1. [Descripcio General](#1-descripcio-general)
2. [Diagrama d'Arquitectura](#2-diagrama-darquitectura)
3. [Serveis i Tecnologies](#3-serveis-i-tecnologies)
4. [Infraestructura Docker](#4-infraestructura-docker)
5. [Com Posar en Marxa el Projecte](#5-com-posar-en-marxa-el-projecte)

---

## 1. Descripcio General

L'aplicació es un sistema web per gestionar l'assistencia en un centre de formacio professional. Segueix una arquitectura de **tres capes** separades fisicament en contenidors Docker independents:

- **Capa de presentacio**: Aplicacio Angular (SPA) que s'executa al navegador.
- **Capa de negoci**: API REST construida amb Laravel (PHP), que centralitza tota la logica i l'autenticacio.
- **Capa de dades**: Base de dades relacional PostgreSQL.

A mes, hi ha un servei auxiliar Node.js que actua de pont entre l'API Laravel i els clients, oferint comunicacio en temps real via **WebSockets** (Socket.IO) i conversio de documents Word a PDF.

---

## 2. Diagrama d'Arquitectura

```
                          INTERNET / NAVEGADOR
                                  |
                    HTTPS / port 4200 (dev) / 443 (prod)
                                  |
                         +-----------------+
                         |   pfg1-nginx    |
                         |  Reverse Proxy  |
                         +--------+--------+
                                  |
             +--------------------+--------------------+
             |  /api/*                                 |  /*
             v                                         v
    +------------------+                   +--------------------+
    | pfg1-back        |                   | pfg1-front         |
    | Laravel API REST |                   | Angular SPA        |
    | PHP-FPM :9000    |                   | Node.js :4200      |
    +--------+---------+                   +--------------------+
             |
             |  Llegeix/Escriu
             v
    +------------------+
    | pfg1-postgres    |
    | PostgreSQL 16    |
    | Port 5432        |
    +------------------+

             |  POST /api/broadcast (events)
             v
    +------------------+      WebSocket      +-------------------+
    | pfg1-back-node   | ==================> | Navegador client  |
    | Node.js :3000    |                     | (Angular + Socket)|
    | Socket.IO + PDF  |                     +-------------------+
    +------------------+

    +------------------+
    | pfg1-worker      |
    | Queue Worker     |
    | (emails)         |
    +------------------+
```

### Flux de temps real per a una actualitzacio d'assistencia

```
1. Professor clica "Falta" al navegador
2. Angular fa PUT /api/v1/assistencies/{id}
3. Laravel guarda el canvi a PostgreSQL
4. Laravel fa POST http://pfg1-back-node:3000/api/broadcast
         { "event": "assistencia_updated", "data": {...} }
5. Node.js fa io.emit("assistencia_updated", data)
6. Tots els clients connectats reben l'event
7. El component Angular actualitza la vista automaticament
```

---

## 3. Serveis i Tecnologies

### Frontend (pfg1-front)

| Tecnologia | Us |
|---|---|
| Angular 19+ | Framework SPA |
| TypeScript | Llenguatge |
| Angular Signals | Gestio d'estat reactiu |
| HttpClient | Crides a l'API REST |
| Socket.IO Client | Recepcio d'events en temps real |
| Angular Router + Guards | Navegacio i control d'acces per rol |
| CSS vanilla | Disseny "Light Glassify Premium" |
| Cypress | Tests end-to-end |

### Backend (pfg1-back)

| Tecnologia | Us |
|---|---|
| Laravel (PHP 8.x) | Framework API REST |
| Laravel Sanctum | Autenticacio via tokens Bearer |
| Laravel Socialite | Login amb Google OAuth 2.0 |
| Eloquent ORM | Capes d'acces a dades |
| Laravel Queue | Cua per a l'enviament d'emails |
| PHPWord | Generacio de cartes en format Word |
| PostgreSQL (via PDO) | Motor de base de dades |

Totes les rutes de l'API tenen el prefix `/api/v1/`.

### Servei Node.js (pfg1-back-node)

Dues responsabilitats:

1. **Servidor WebSocket**: Manté connexions persistents amb els navegadors. Rep events des de Laravel via HTTP POST i els redistribueix a tots els clients connectats.
2. **Conversor de documents**: Rep fitxers DOCX en base64 des de Laravel, els converteix a PDF usant LibreOffice, i retorna el PDF al client.

### Base de dades (pfg1-postgres)

PostgreSQL 16. Gestionada a traves de migracions de Laravel (33 migracions en total). Per a l'entorn de dev, pgAdmin es accessible al port 8080.

---

## 4. Infraestructura Docker

### Fitxers Compose per entorn

| Fitxer | Us |
|---|---|
| `compose.DEV.yml` | Desenvolupament local (volums muntats, hot-reload) |
| `compose.PROD.yml` | Produccio (images optimitzades, Nginx complet) |
| `compose.TEST.yml` | Entorn Cypress per a tests E2E |

### Serveis a compose.DEV.yml

```
pfg1-front      : Angular app (node:24, port 4200)
pfg1-back       : Laravel API (PHP-FPM, port 9000)
pfg1-nginx      : Proxy invers per a l'API (port 8000)
pfg1-back-node  : Node.js WebSocket + PDF (port 3000)
pfg1-worker     : Laravel Queue Worker (emails async)
pfg1-postgres   : Base de dades (port 5432)
pfg1-pgadmin    : Eina d'admin de BD (port 8080)
```

Tots els serveis es comuniquen per la xarxa Docker interna `general`. Els noms de contenidor actuen com a hostnames (ex: Laravel accedeix a Node.js via `http://pfg1-back-node:3000`).

---

## 5. Com Posar en Marxa el Projecte

### Prerequisits

- Docker Desktop instal·lat i en funcionament
- Git

### Pas 1: Clonar el repositori

```bash
git clone https://github.com/inspedralbes/prj-final-r-e-n-f-e.git
cd prj-final-r-e-n-f-e
```

### Pas 2: Configurar variables d'entorn

Cada servei te els seus fitxers `.env.DEV`. El Docker Compose els copia automaticament a l'arrencar.

Variables clau a configurar a `back/laravel-api/.env.DEV`:

```
DB_CONNECTION=pgsql
DB_HOST=pfg1-postgres
DB_DATABASE=prf-renfe
DB_USERNAME=postgres
DB_PASSWORD=root

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

NODE_URL=http://pfg1-back-node:3000
NODE_PRINCIPAL_API_URL=http://pfg1-back-node:3000
```

Variable clau a `front/.env.DEV`:

```
API_URL=http://localhost:8000/api/v1
SOCKET_URL=http://localhost:3000
```

### Pas 3: Arrancar els contenidors

```bash
docker compose -f compose.DEV.yml up --build
```

La primera vegada la construccio tarda uns minuts.

### Pas 4: Migrar la base de dades

```bash
# Migracio normal
docker compose -f compose.DEV.yml exec pfg1-back php artisan migrate

# Reset complet amb dades de prova
docker compose -f compose.DEV.yml exec pfg1-back php artisan migrate:fresh --seed
```

### Pas 5: Verificar que tot funciona

| Servei | URL a provar |
|---|---|
| Frontend Angular | http://localhost:4200 |
| API Laravel | http://localhost:8000/api/v1/health |
| pgAdmin | http://localhost:8080 |
| Node.js | http://localhost:3000 |

La resposta de `/health` hauria de ser `{"status":"ok"}`.

### Parar el sistema

```bash
# Parar sense eliminar dades
docker compose -f compose.DEV.yml down

# Parar i eliminar volums (reset de BD)
docker compose -f compose.DEV.yml down -v
```

---

*Consulta [BACKEND.md](BACKEND.md) per a la referencia completa de l'API i els models de dades.*
*Consulta [FRONTEND.md](FRONTEND.md) per a l'estructura de components Angular.*
