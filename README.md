# Sistema de Gestió d'Assistència Escolar

> **⚠️ MVP — Projecte en desenvolupament, no finalitzat.**

## Integrants

- _[Alba Sánchez Romero]_
- _[Pol Molina Muñoz]_
- _[Climent Fernández Andújar]_
- _[Tony Martin Marin]_

## Descripció

Aplicació web per a la gestió d'assistència d'un centre educatiu de formació professional. Permet als professors registrar i consultar les faltes d'assistència dels alumnes per assignatura, als alumnes consultar els seus horaris i faltes, i als administradors gestionar usuaris, classes, assignatures i aules. Integra un sensor NFC per al registre automàtic de l'assistència.

**Stack tecnològic:**

- **Backend:** Laravel (PHP) + PostgreSQL, autenticació via Laravel Sanctum i Google OAuth2.0
- **Frontend:** Angular
- **Infraestructura:** Docker Compose, Nginx, serveis Node.js per a la ingestió de dades del sensor NFC

## Gestor de tasques

- _[[URL Taiga / Jira / Trello](https://tree.taiga.io/project/patitoderubber-projectefinaldaw2/timeline)]_

## Prototip gràfic

- [_\[URL Penpot / Figma / Moqups\]_](https://www.figma.com/design/1tDHPOZ8fH2iV4O4OHdJwS/WireFrame-PF?node-id=0-1&t=n5dUg4WtrQTBLlnI-1)

## URL de producció

- [_\[URL Producció\]_](https://renfe.daw.inspedralbes.cat)

---

## Funcionalitats implementades (MVP)

### Autenticació

- Login amb Google OAuth (Socialite)
- Login temporal per email (tokens Sanctum)
- Guards de ruta per rol (Admin, Professor, Alumne)

### Gestió d'usuaris

- Assignació de classe als alumnes

### Gestió acadèmica

- Inscripció d'alumnes a assignatures (`inscrits`)
- Assignació de professors a assignatures (`imparteix`), amb rol de titular
- Gestió de **períodes** (trimestres: dates d'inici i fi)

### Horaris

- Creació i consulta d'horaris per usuari (professors i alumnes)
- Actualització granular de franges horàries

### Control d'assistència

- Registre d'assistència per alumne i assignatura amb estats: **Assistit**, **Falta**, **Retard**
- Generació massiva d'assistències per a una classe/assignatura
- Consulta d'assistència per alumne i per assignatura

### Justificants

- CRUD de justificants d'assistència

### Vistes del frontend (Angular)

| Rol               | Vistes disponibles                                                                      |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Login**         | Pantalla d'inici de sessió (Google i temporal)                                          |
| **Professor**     | Llista de classe, gestió de classe, llista d'assignatures, gestió d'assistència, horari |
| **Alumne**        | Horari personal, consulta de faltes                                                     |

---

## Estat del projecte

El projecte es troba en fase **MVP (Minimum Viable Product)**. Les funcionalitats principals del backend estan implementades (API REST completa), però el projecte **no està finalitzat**.
