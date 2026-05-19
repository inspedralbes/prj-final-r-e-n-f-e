# Sistema de Gestio d'Assistencia Escolar
## Documentacio Tecnica: Backend (API Laravel)

---

## Taula de Continguts

1. [Estructura de Fitxers](#1-estructura-de-fitxers)
2. [Models de Dades](#2-models-de-dades)
3. [Relacions entre Models](#3-relacions-entre-models)
4. [Controllers i Endpoints de l'API](#4-controllers-i-endpoints-de-lapi)
5. [Autenticacio i Autoritzacio](#5-autenticacio-i-autoritzacio)
6. [Servei Node.js Auxiliar](#6-servei-nodejs-auxiliar)

---

## 1. Estructura de Fitxers

```
back/laravel-api/
|-- app/
|   |-- Http/
|   |   |-- Controllers/
|   |   |   |-- AuthController.php          (login Google i temporal, logout)
|   |   |   |-- UsuariController.php        (CRUD usuaris, perfil)
|   |   |   |-- ClasseController.php        (CRUD classes, gestio alumnes)
|   |   |   |-- AssignaturaController.php   (CRUD assignatures)
|   |   |   |-- AulaController.php          (CRUD aules)
|   |   |   |-- HorariController.php        (horaris, franja actual, context)
|   |   |   |-- ImparteixController.php     (professor-assignatura)
|   |   |   |-- InscritController.php       (alumne-assignatura-horari)
|   |   |   |-- AssistenciaController.php   (registre i consulta assistencia)
|   |   |   |-- JustificantController.php   (CRUD justificants)
|   |   |   |-- CartaFaltesController.php   (generacio PDF carta de faltes)
|   |   |   |-- PeriodeController.php       (CRUD trimestres)
|   |   |   |-- CursController.php          (llistat de cursos)
|   |   |-- Middleware/
|   |       |-- EnsureCors.php              (capceleres CORS)
|   |-- Models/
|   |   |-- Usuari.php       |-- Assignatura.php  |-- Assistencia.php
|   |   |-- Classe.php       |-- Horari.php        |-- Inscrit.php
|   |   |-- Aula.php         |-- Imparteix.php     |-- Justificant.php
|   |   |-- Periode.php      |-- Curs.php          |-- Sensor.php
|   |-- Policies/
|       |-- UsuariPolicy.php  (verifica perfil complet per accedir a recursos)
|-- database/
|   |-- migrations/   (33 migracions cronologiques)
|   |-- seeders/
|   |-- factories/
|-- routes/
|   |-- api.php       (totes les rutes REST, prefix /api/v1/)
|   |-- web.php       (ruta callback OAuth)
|-- templates-word/   (plantilles .docx per a cartes de faltes)
```

---

## 2. Models de Dades

### Usuari

Taula: `usuaris`. Estén `Authenticatable` de Laravel per compatibilitat amb Sanctum.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| nom | string | Nom de pila |
| cognom | string | Cognoms |
| email | string unique | Adreca de correu |
| email_pares | string | Email dels pares (alumnes menors) |
| rol | string | 'Alumne', 'Profe' o 'Admin' |
| google_id | string | ID de Google OAuth |
| nfc_id | string | ID del sensor NFC (opcional) |
| id_classe | FK | Classe a la que pertany (alumnes) |
| photo | string | Ruta de la foto de perfil |
| data_naixement | date | Data de naixement (obligatoria per alumnes) |
| password | string hashed | Contrasenya (no usada en produccio) |

**Relacions:**
- `belongsTo` Classe (via `id_classe`)
- `hasMany` Inscrit (via `id_alumne`) - assignatures on esta inscrit
- `hasMany` Imparteix (via `id_profe`) - assignatures que imparteix
- `hasMany` Justificant (via `id_alum`)
- `hasMany` Classe (via `id_tutor`) - classes de les que es tutor

**Metode especial:** `isProfileCompleted()` retorna `false` si l'usuari es alumne i no te data de naixement. S'usa per a redirigir a la pantalla de completar perfil.

---

### Assignatura

Taula: `assignatures`.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| nom | string | Nom de l'assignatura |
| id_classe_projecte | FK nullable | Si es una assignatura "Projecte", apunta a la classe |
| interval | integer | Durada de cada sessio en minuts |
| exempcio | boolean | Si es true, no es pot substituir per Projecte |
| hores_1r_trimestre | integer | Hores al primer trimestre |
| hores_2n_trimestre | integer | Hores al segon trimestre |
| hores_3r_trimestre | integer | Hores al tercer trimestre |

**Metode especial:** `esSubstituible()` retorna `true` si `exempcio` es false. Utilitzat al motor de generacio d'assistencies per determinar si una assignatura pot ser reemplazada per la d'un projecte.

---

### Classe

Taula: `classes`.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| nom | string | Nom del grup (ex: "DAW2A") |
| id_tutor | FK | Professor tutor de la classe |
| id_curs | FK | Curs al que pertany |
| id_aula | FK | Aula habitual |

---

### Horari

Taula: `horaris`. Representa una **franja horaria** concreta d'una classe.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| codi_hora | string | Codificacio dia+franja (ex: "L1", "M3", "X5") |
| id_assig | FK | Assignatura que s'imparteix |
| id_classe | FK | Classe a la que correspon |
| id_aula | FK | Aula on es fa la classe |
| id_professor | FK | Professor que imparteix |

**Sistema de codificacio `codi_hora`:**
La primera lletra indica el dia (L=dilluns, M=dimarts, X=dimecres, J=dijous, V=divendres).
El numero indica la franja (1 a 12, corresponent als horaris de 8h a 21:30h).
Exemple: "X3" = dimecres, tercera hora (10:00-11:00).

---

### Inscrit

Taula: `inscrits`. Taula pivot que connecta un alumne, una assignatura i una franja horaria concreta.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| id_alumne | FK | L'alumne inscrit |
| id_assignatura | FK | L'assignatura |
| id_horari | FK | La franja horaria especifica |

Aquesta granularitat permet que un alumne estigui inscrit a una franja especifica dins d'una assignatura (util per a desdoblaments o grups reduïts).

---

### Assistencia

Taula: `assistencies`. Registre d'un alumne per a un dia concret.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| id_inscripcio | FK | La inscripcio de l'alumne (Inscrit) |
| data | date | Data del registre |
| estat | enum | 'Assistit', 'Falta', 'Retard', 'Justificada' |
| id_profe | FK nullable | Professor que va registrar l'assistencia |

---

### Justificant

Taula: `justificants`. Documentacio que justifica una absencia.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| id_alum | FK | L'alumne que presenta el justificant |
| data_inici | date | Inici del periode justificat |
| data_fi | date | Fi del periode justificat |
| comentari | text | Explicacio textual |
| document | string | Ruta al fitxer adjunt |
| estat | enum | 'Pendent', 'Acceptada', 'Rebutjada' |

Quan un tutor accepta un justificant, el sistema actualitza automaticament totes les assistencies d'estat 'Falta' del periode a 'Justificada'.

---

### Periode

Taula: `periodes`. Defineix les dates dels tres trimestres del curs.

| Camp | Tipus | Descripcio |
|---|---|---|
| id | bigint PK | Identificador |
| nom | string | Nom del periode (ex: "Curs 2025-26") |
| actiu | boolean | Si es el periode actiu actual |
| trimestre_1_ini / _fi | date | Dates del primer trimestre |
| trimestre_2_ini / _fi | date | Dates del segon trimestre |
| trimestre_3_ini / _fi | date | Dates del tercer trimestre |

---

### Imparteix

Taula: `imparteix`. Relacio entre professor i assignatura.

| Camp | Tipus |
|---|---|
| id | bigint PK |
| id_profe | FK (usuaris) |
| id_assignatura | FK (assignatures) |
| titular | boolean |

---

## 3. Relacions entre Models

```
Usuari (Alumne) ----< Inscrit >---- Assignatura
                          |              |
                       Horari        Imparteix <--- Usuari (Profe)
                          |
                      Assistencia
                          ^
                          |
Usuari (Alumne) ----< Justificant (justifica Assistencies del periode)

Usuari (Profe) ----> Classe <---- Usuari (Alumne, via id_classe)
                         |
                       Curs
```

El flux central de l'aplicacio es:

1. L'admin crea Cursos, Classes, Assignatures i Aules.
2. L'admin/profe defineix Horaris (franges horàries per classe).
3. L'admin/profe inscriu alumnes a les franges (crea registres Inscrit).
4. El professor genera o registra Assistencies per a les Inscripcions.
5. L'alumne pot presentar Justificants per a les seves faltes.
6. El tutor accepta o rebutja els Justificants.

---

## 4. Controllers i Endpoints de l'API

### Base URL

```
Totes les rutes: /api/v1/
Endpoint de salut: GET /api/v1/health  ->  {"status": "ok"}
```

### Autenticacio (sense token necessari)

| Metode | Ruta | Accio |
|---|---|---|
| POST | `/auth/google/redirect` | Retorna la URL de Google per fer el login |
| POST | `/auth/google/callback` | Rep el codi de Google, crea o autentica l'usuari, retorna token Sanctum |
| POST | `/auth/login-temporal` | Login per email (per proves, sense Google) |
| POST | `/auth/logout` | Revoca el token actual (requereix token) |
| PATCH | `/fullfill-user-profile` | Completa el perfil de l'alumne (data naix.) |

**Resposta tipus del callback de Google:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "nom": "Pere Garcia",
      "email": "a25pergar@inspedralbes.cat",
      "rol": "Alumne",
      "isProfileComplited": false
    },
    "token": "1|aBcDeFgH..."
  },
  "message": "Autenticacio correcta"
}
```

### Usuaris

| Metode | Ruta | Accio |
|---|---|---|
| GET | `/usuaris` | Llista tots els usuaris |
| GET | `/usuaris/{id}` | Detall d'un usuari |
| POST | `/usuaris` | Crear usuari |
| PUT | `/usuaris/{id}` | Actualitzar usuari |
| DELETE | `/usuaris/{id}` | Eliminar usuari |
| GET | `/usuaris/rol/{rol}` | Filtrar per rol ('Alumne', 'Profe', 'Admin') |
| GET | `/perfil/{id}` | Perfil propi (menys camps) |
| GET | `/usuaris/{id}/classe-actual` | Retorna la classe/assignatura actual de l'usuari |

### Classes

| Metode | Ruta | Accio |
|---|---|---|
| GET | `/classes` | Llista classes |
| POST | `/classes` | Crear classe |
| PUT | `/classes/{id}` | Actualitzar classe |
| DELETE | `/classes/{id}` | Eliminar classe |
| GET | `/classes/tutor/{idTutor}` | Classe d'un tutor concret |
| GET | `/classes/{id}/alumnes` | Alumnes d'una classe |
| POST | `/classes/assignarAlumnes` | Assignar alumnes a una classe |
| POST | `/classes/treureAlumne` | Treure un alumne d'una classe |

### Horaris

| Metode | Ruta | Accio |
|---|---|---|
| GET | `/horaris` | Llista horaris |
| POST | `/horaris` | Crear horari |
| PUT | `/horaris/{id}` | Actualitzar horari |
| DELETE | `/horaris/{id}` | Eliminar horari |
| POST | `/horaris/granular` | Desa la configuracio completa d'una franja (assignatura, aula, professor i alumnes) |
| GET | `/classes/{id}/horaris` | Horaris d'una classe |
| GET | `/horaris/professor/{id}` | Sessions d'un professor |
| GET | `/horaris/professor/{id}/context` | Context per a passar llista (sessio recomanada) |
| GET | `/horaris/usuari/{id}` | Horari setmanal d'un usuari (alumne o profe) |

### Assistencies

| Metode | Ruta | Accio |
|---|---|---|
| GET | `/assistencies` | Llista totes les assistencies |
| POST | `/assistencies` | Crear registre d'assistencia |
| PUT | `/assistencies/{id}` | Actualitzar estat |
| DELETE | `/assistencies/{id}` | Eliminar registre |
| GET | `/assistencies/alumne/{id}` | Resum de faltes per assignatura d'un alumne |
| POST | `/assistencies/generar` | Genera assistencies massives per un periode |
| GET | `/assistencia/assignatura/{id}` | Assistencies d'una assignatura |
| GET | `/horaris/{id}/assistencia-setmanal` | Assistencies d'un horari per setmana |
| GET | `/assistencies/ranking-profe` | Ranking de faltes dels alumnes del professor |
| GET | `/assistencies/classe/{id}/ranking` | Ranking de faltes d'una classe |

### Justificants

| Metode | Ruta | Accio |
|---|---|---|
| GET | `/justificants` | Llista tots |
| POST | `/justificants` | Crear justificant (amb fitxer adjunt) |
| PUT | `/justificants/{id}` | Actualitzar |
| DELETE | `/justificants/{id}` | Eliminar |
| GET | `/justificants/alumne/{id}` | Justificants d'un alumne |
| GET | `/justificants/tutoria/pendents` | Justificants pendents de la classe del tutor |
| POST | `/justificants/acceptar/{id}` | Acceptar o rebutjar un justificant |

### Altres recursos (CRUD estandard)

| Recurs | Ruta base |
|---|---|
| Assignatures | `/assignatures` |
| Aules | `/aules` |
| Periodes | `/periodes` |
| Imparteix | `/imparteix` |
| Inscrits | `/inscrits` |
| Cursos | `/cursos` (nomes GET) |

**Accion addicional de Periodes:**
```
POST /periodes/{id}/actiu  ->  Marca un periode com l'actiu actual
```

**Generacio de carta de faltes:**
```
POST /carta-faltes/generar
Body: { "id_alumne": 42, "faltes": 30 }   (faltes: 30, 60 o 90)
Resposta: fitxer PDF per descarregar
```

---

## 5. Autenticacio i Autoritzacio

### Fluxos d'autenticacio

**Login amb Google (produccio):**
```
1. Frontend fa POST /auth/google/redirect
2. Backend retorna la URL de Google
3. El navegador redirigeix a Google
4. Google redirigeix al frontend amb un codi (?code=...)
5. Frontend fa POST /auth/google/callback amb el codi
6. Backend valida el codi amb Google (Socialite)
7. Comprova que el domini sigui @inspedralbes.cat
8. Crea o actualitza l'usuari a la BD
9. Retorna un token Sanctum + dades de l'usuari
10. Frontend desa el token a localStorage
```

**Login temporal (desenvolupament):**
```
1. POST /auth/login-temporal  { "email": "..." }
2. Backend busca l'usuari per email (sense contrasenya)
3. Retorna token + dades (igual que Google)
```

**Assignacio de rols automatica (Google):**
- Emails que comencen per `a` seguit de dos digits (`a23...`) -> `Alumne`
- La resta d'emails del domini -> `Profe`
- Excepcions hardcoded (per a administradors) -> `Admin`

### Autoritzacio

Totes les rutes del grup protegit requereixen:
1. **Token Sanctum valid**: capcelera `Authorization: Bearer {token}`
2. **Perfil complet** (`UsuariPolicy`): si l'usuari es alumne i no te data de naixement, l'API retorna 403 fins que completi el perfil.

### Autenticacio al frontend

El token es desa a `localStorage['token']` i s'inclou automaticament a totes les peticions via un interceptor HTTP d'Angular.

---

## 6. Servei Node.js Auxiliar i WebSockets

Fitxer principal: `back/principal-node/index.js`

Aquest servei te dues responsabilitats independents que comparteixen el mateix proces Node.js:

1. **Servidor de WebSockets** (Socket.IO): permet que el backend Laravel emeti notificacions en temps real a tots els navegadors connectats.
2. **Conversor de documents** (LibreOffice): rep fitxers Word des de Laravel, els converteix a PDF i els retorna.

---

### Que son els WebSockets i per que s'usen aqui

HTTP es un protocol de **peticio-resposta**: el client demana, el servidor respon i la connexio es tanca. Aixo vol dir que el servidor **no pot notificar al client** si hi ha un canvi sense que el client ho pregunti primer.

Un **WebSocket** es una connexio permanent i bidireccional entre el client (navegador) i el servidor. Un cop establerta, qualsevol de les dues parts pot enviar un missatge en qualsevol moment sense esperar una peticio.

En aquest projecte s'utilitzen WebSockets per garantir que quan un professor modifica l'assistencia d'un alumne, **tots els altres navegadors que tinguin la mateixa pagina oberta la veuen actualitzada immediatament**, sense haver de recarregar.

---

### Arquitectura del sistema en temps real

El sistema segueix un patro **hub-and-spoke** on el servei Node.js actua de concentrador:

```
  Professor (navegador A)
         |
         |  1. PUT /api/v1/assistencies/{id}   (HTTP REST normal)
         v
    pfg1-back (Laravel)
         |
         |  2. Guarda a PostgreSQL
         |  3. POST http://pfg1-back-node:3000/api/broadcast
         |     { "event": "assistencia_updated", "data": { id, estat, ... } }
         v
    pfg1-back-node (Node.js + Socket.IO)
         |
         |  4. io.emit("assistencia_updated", data)
         |     (envia a TOTS els clients connectats)
         |
         +----------+-----------+
         |          |           |
         v          v           v
  Alumne A      Alumne B    Profe B
  (navegador)  (navegador)  (navegador)
         |          |           |
         v          v           v
  Vista actualitzada sense recarregar la pagina
```

**Per que no fa directament el socket Laravel?**
PHP-FPM (el servidor de Laravel) crea un proces nou per a cada peticio HTTP i el mata quan acaba. No pot mantenir connexions persistents. El servei Node.js, en canvi, es un servidor d'events dissenyat exactament per a aixo: mantenir milers de connexions obertes de manera eficient.

---

### Endpoints HTTP del servei Node.js

**POST `/api/broadcast`**

Utilitzat internament per Laravel per propagar un event a tots els clients WebSocket. No es accessible des de l'exterior (nomes dins de la xarxa Docker `general`).

```
Body (JSON):
{
  "event": "assistencia_updated",
  "data": {
    "id": 42,
    "estat": "Falta",
    "id_inscripcio": 17,
    "data": "2026-05-20"
  }
}

Resposta:
{ "success": true, "message": "Esdeveniment assistencia_updated emes" }
```

Events possibles que emet Laravel:

| Event | Quan s'emet | Dades que porta |
|---|---|---|
| `assistencia_updated` | Crear, actualitzar o eliminar una assistencia | Objecte Assistencia |
| `horari_updated` | Crear, actualitzar o eliminar un horari | Objecte Horari |

**POST `/api/convert/word-to-pdf`**

Utilitzat per `CartaFaltesController` per convertir la carta de faltes generada (DOCX) a PDF.

```
Body (JSON):
{
  "fileBase64": "<contingut del .docx codificat en base64>",
  "fileName": "carta_faltes_42_1716159600.docx"
}

Resposta:
  Fitxer PDF binari
  Content-Type: application/pdf
  Content-Disposition: attachment; filename=carta_faltes_42_1716159600.pdf
```

Internament, el servei desa el DOCX com a fitxer temporal, executa LibreOffice en mode headless per convertir-lo, llegeix el PDF resultant i l'envia com a resposta binaria.

---

### Codi del servidor WebSocket (index.js)

```javascript
import { Server } from "socket.io";
import express from "express";

const app = express();
const httpServer = createServer(app);

// Inicialitzar Socket.IO amb control de CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:4200",
      "https://tenfe.cat",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Gestio de connexions dels clients
io.on("connection", (socket) => {
  console.log(`Nou client connectat: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client desconnectat: ${socket.id}`);
  });
});

// Endpoint que rep els events de Laravel i els redistribueix
app.post("/api/broadcast", (req, res) => {
  const { event, data } = req.body;
  io.emit(event, data);  // Emet a TOTS els clients connectats
  res.json({ success: true });
});
```

---

### Codi del client WebSocket al frontend (Angular)

El servei `SocketService` encapsula la connexio i exposa Observables d'Angular:

```typescript
// front/src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    // Es connecta al servei Node.js en arrancar l'aplicacio
    this.socket = io(environment.socketUrl);
  }

  // Retorna un Observable que emet cada cop que arriba l'event
  on<T>(event: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }
}
```

**Us en un component:** per exemple, el component de passar llista escolta `assistencia_updated` per actualitzar la taula quan un altre professor modifica una assistencia al mateix temps:

```typescript
// Dins d'un component Angular
constructor(private socketService: SocketService) {}

ngOnInit() {
  // Quan arribi l'event, recarregar les dades
  this.socketService.on<any>('assistencia_updated').subscribe(data => {
    this.carregarAssistencies();
  });

  // Quan canvii l'horari, recarregar l'horari
  this.socketService.on<any>('horari_updated').subscribe(data => {
    this.carregarHorari();
  });
}
```

---

### Configuracio CORS del WebSocket

Socket.IO te la seva propia configuracio de CORS independent de Laravel. Nomes accepta connexions dels orígens autoritzats:

```
Orígens permesos:
  - http://localhost:4200   (desenvolupament local)
  - https://tenfe.cat       (produccio)
```

Si el frontend s'executa des d'un altre origen, el navegador bloquejarà la connexió WebSocket.

---

*Per a l'estructura del frontend Angular, consulta [../frontend/FRONTEND.md](../frontend/FRONTEND.md).*
*Per a l'arquitectura general i Docker, consulta [../arquitectura/ARQUITECTURA.md](../arquitectura/ARQUITECTURA.md).*
