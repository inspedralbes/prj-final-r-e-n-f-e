# Sistema de Gestio d'Assistencia Escolar



## Integrants

- Alba Sanchez Romero
- Climent Fernandez Andujar
- Tony Martin Marin

## Descripcio

Aplicacio web per a la gestio d'assistencia d'un centre educatiu de formacio professional. Permet als professors registrar i consultar les faltes d'assistencia dels alumnes per assignatura, als alumnes consultar els seus horaris i faltes, i als administradors gestionar usuaris, classes, assignatures i aules. Integra comunicacio en temps real via WebSockets i generacio de cartes de faltes en PDF.

**Stack tecnologic:**

- **Backend:** Laravel (PHP) + PostgreSQL, autenticacio via Laravel Sanctum i Google OAuth2.0
- **Frontend:** Angular (SPA amb Signals)
- **Infraestructura:** Docker Compose, Nginx, Node.js (WebSocket + conversor PDF)

---

## Documentacio

La documentacio completa es troba a la carpeta [`/doc`](doc/).

| Document | Contingut |
|---|---|
| [doc/arquitectura/ARQUITECTURA.md](doc/arquitectura/ARQUITECTURA.md) | Visio general del sistema, diagrama de serveis, Docker i posada en marxa |
| [doc/backend/BACKEND.md](doc/backend/BACKEND.md) | Models de dades, relacions i referencia completa de l'API REST |
| [doc/frontend/FRONTEND.md](doc/frontend/FRONTEND.md) | Estructura Angular, rutes, components i serveis |
| [doc/MANUAL_USUARI.md](doc/MANUAL_USUARI.md) | Guia d'us per a professors, alumnes i administradors |

---

## Posada en Marxa Rapida

Prerequisit: Docker Desktop instal·lat.

```bash
# 1. Clonar el repositori
git clone https://github.com/inspedralbes/prj-final-r-e-n-f-e.git
cd prj-final-r-e-n-f-e

# 2. Arrancar els contenidors
docker compose -f compose.DEV.yml up --build

# 3. Migrar la base de dades (en un altre terminal)
docker compose -f compose.DEV.yml exec pfg1-back php artisan migrate
```

Despres: http://localhost:4200 (Frontend) | http://localhost:8000/api/v1/health (API)

Per als detalls complets, consulta [doc/arquitectura/ARQUITECTURA.md](doc/arquitectura/ARQUITECTURA.md).

---

## Enllacos del Projecte

- **Produccio:** https://tenfe.cat
- **Gestor de tasques:** https://tree.taiga.io/project/patitoderubber-projectefinaldaw2/timeline
- **Prototip grafic:** https://www.figma.com/design/1tDHPOZ8fH2iV4O4OHdJwS/WireFrame-PF

---

## Funcionalitats Implementades

### Autenticacio
- Login amb Google OAuth (Socialite) restringit al domini @inspedralbes.cat
- Login per email (tokens Sanctum)
- Guards de ruta per rol (Admin, Professor, Alumne)

### Gestio Academica
- CRUD de classes, assignatures, aules, cursos i periodes
- Inscripcio d'alumnes a assignatures per franja horaria (granularitat de sessio)
- Assignacio de professors a assignatures

### Horaris
- Creacio i consulta d'horaris per usuari (professors i alumnes)
- Editor granular de franges horaries amb gestio d'alumnes per franja

### Control d'Assistencia
- Registre d'assistencia per alumne i assignatura amb estats: Assistit, Falta, Retard, Justificada
- Generacio massiva d'assistencies per a un periode
- Consulta de faltes per alumne amb percentatge per trimestre
- Rankings de faltes per professor i per classe
- Actualitzacio en temps real via WebSockets (Socket.IO)

### Justificants
- CRUD de justificants amb adjunt de document
- Revisio i acceptacio/rebuig per part del tutor
- Actualitzacio automatica de les assistencies al acceptar un justificant

### Documents
- Generacio de carta de faltes en PDF (30, 60 o 90 hores) a partir de plantilles Word

---

## Documentacio de Tests

Per a mes detalls sobre la infraestructura de tests i com executar-los, consulta [doc/testing/](doc/testing/).

## Estat del Projecte
El projecte es troba en fase **MVP (Minimum Viable Product)**. Les funcionalitats principals del backend estan implementades (API REST completa), pero el projecte **no esta finalitzat**.
