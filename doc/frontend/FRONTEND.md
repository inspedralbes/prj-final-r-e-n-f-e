# Sistema de Gestio d'Assistencia Escolar
## Documentacio Tecnica: Frontend Angular

---

## Taula de Continguts

1. [Estructura de Fitxers](#1-estructura-de-fitxers)
2. [Arquitectura SPA i Rutes](#2-arquitectura-spa-i-rutes)
3. [Sistema d'Autenticacio al Frontend](#3-sistema-dautenticacio-al-frontend)
4. [Features per Rol](#4-features-per-rol)
5. [Serveis Globals](#5-serveis-globals)
6. [Models TypeScript](#6-models-typescript)
7. [Disseny i Estils](#7-disseny-i-estils)

---

## 1. Estructura de Fitxers

```
front/src/app/
|-- app.ts               (component arrel, punt d'entrada)
|-- app.html             (template arrel: <router-outlet>)
|-- app.routes.ts        (definicio de totes les rutes)
|-- app.config.ts        (configuracio global: HttpClient, Router, Socket)
|
|-- services/            (serveis injectables a nivell d'app)
|   |-- auth.service.ts  (estat d'autenticacio, login/logout)
|   |-- socket.service.ts (connexio WebSocket amb Socket.IO)
|
|-- guards/              (proteccio de rutes)
|   |-- auth.guard.ts    (verifica que l'usuari esta autenticat)
|   |-- role.guard.ts    (verifica que l'usuari te el rol adequat)
|
|-- shared/              (elements reutilitzables per tota l'app)
|   |-- components/
|   |   |-- sidebar/          (sidebar professors i alumnes)
|   |   |-- sidebaradmin/     (sidebar administracio)
|   |-- models/               (interfaces TypeScript)
|   |-- services/             (SidebarService, etc.)
|   |-- utils/                (funcions auxiliars)
|
|-- features/            (funcionalitats per rol, cada una es una pagina)
    |-- login/
    |   |-- login.component.ts/html/css         (pantalla d'inici de sessio)
    |   |-- auth-callback.component.ts          (receptor del callback OAuth)
    |
    |-- completar-perfil/
    |   |-- completar-perfil.component.ts       (data de naixement alumnes)
    |
    |-- perfil/
    |   |-- perfil.component.ts                 (visualitzacio de perfil)
    |
    |-- alumnes/                                (zona alumnes)
    |   |-- alumnes.component.ts/html/css       (dashboard alumne)
    |   |-- horaris/                            (horari setmanal)
    |   |-- justificants/                       (presentar i veure justificants)
    |
    |-- professors/                             (zona professors)
    |   |-- professors.component.ts/html/css    (dashboard professor)
    |   |-- llista-classe/                      (passar llista d'assistencia)
    |   |-- llista-assignatures/                (assignatures del professor)
    |   |-- llista-faltes/                      (resum de faltes per alumne)
    |   |-- gestio-classe/                      (inscrits, alumnes de la classe)
    |   |-- horari-alumnes/                     (editar horari de la classe)
    |   |-- justificants/                       (gestio justificants del tutor)
    |
    |-- administracio/                          (zona administradors)
        |-- administracio.component.ts          (dashboard admin)
        |-- admin-assignatures/
        |-- admin-classes/
        |-- admin-usuaris/
        |-- admin-periodes/
```

---

## 2. Arquitectura SPA i Rutes

L'aplicacio es una **Single Page Application**. El component arrel (`app.html`) nomes conte un `<router-outlet>` que actua de contenidor. Angular carrega el component correcte sense recarregar la pagina.

### Definicio de rutes (`app.routes.ts`)

```typescript
export const routes: Routes = [
  // --- Rutes publiques ---
  { path: '', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'completar-perfil', component: CompletarPerfilComponent,
    canActivate: [authGuard] },
  { path: 'profile', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: PerfilComponent, canActivate: [authGuard] },

  // --- Rutes d'alumnes ---
  { path: 'alumnes', component: AlumnesComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['alumne'] } },
  { path: 'alumnes/horaris', component: Horaris,
    canActivate: [authGuard, roleGuard], data: { roles: ['alumne'] } },
  { path: 'alumnes/justificants', component: JustificantsComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['alumne'] } },

  // --- Rutes de professors ---
  { path: 'professors', component: ProfessorsComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['profe'] } },
  { path: 'llista-classe', component: LlistaClasseComponent, ... },
  { path: 'llista-assignatures', ... },
  { path: 'llista-faltes', ... },
  { path: 'gestio-inscrits', ... },
  { path: 'horari-alumnes', ... },
  { path: 'gestio-justificants', component: JustificantsComponents },

  // --- Rutes d'administradors ---
  { path: 'administracio', component: AdministracioComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['admin'] } },
  { path: 'admin-assignatures', ... },
  { path: 'admin-classes', ... },
  { path: 'admin-usuaris', ... },
  { path: 'admin-periodes', ... },

  // Ruta per defecte: redirigeix a login
  { path: '**', redirectTo: '' }
];
```

### Guards de ruta

**`authGuard`**: Comprova que existeixi un token a `localStorage`. Si no existeix, redirigeix a `/` (login).

**`roleGuard`**: Llegeix el camp `rol` de l'usuari desat a `localStorage` i el compara amb l'array `data.roles` de la ruta. Si el rol no coincideix, redirigeix a la ruta principal del rol corresponent.

```typescript
// Exemple de us: nomes 'profe' pot accedir
{ path: 'llista-classe', canActivate: [authGuard, roleGuard],
  data: { roles: ['profe'] } }
```

---

## 3. Sistema d'Autenticacio al Frontend

El servei `AuthService` centralitza tot l'estat d'autenticacio usant **Angular Signals**.

### Estat reactiu (Signals)

```typescript
// auth.service.ts
private isAuthenticatedSignal = signal(false);
private userDataSignal = signal<GoogleUser | null>(null);

// Exposats com a computeds (llegibles externament)
public isAuthenticated = computed(() => this.isAuthenticatedSignal());
public userData = computed(() => this.userDataSignal());
```

### Flux de login amb Google

```
1. Usuari fa clic a "Accedir amb Google"
2. AuthService.loginWithGoogle() -> POST /auth/google/redirect
3. Backend retorna redirect_url de Google
4. window.location.href = redirect_url (redirigeix a Google)
5. Google redirigeix a /auth/callback?code=...
6. AuthCallbackComponent llegeix el parametre 'code' de la URL
7. AuthService.handleGoogleCallback(code) -> POST /auth/google/callback
8. Backend valida i retorna { user, token }
9. Es desa user a localStorage['user'] i token a localStorage['token']
10. Signals s'actualitzen
11. Router.navigate() redirigeix segun el rol:
    - 'Profe' -> /professors
    - 'Alumne' -> /alumnes (o /completar-perfil si no te data naix.)
    - 'Admin' -> /administracio
```

### Flux de logout

```typescript
logout() {
  // 1. Crida al backend per revocar el token
  this.http.post('/auth/logout', {}).subscribe();
  // 2. Neteja de localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // 3. Reset de signals
  this.userDataSignal.set(null);
  this.isAuthenticatedSignal.set(false);
  // 4. Redirigir al login
  this.router.navigate(['/']);
}
```

### Acces a les dades de l'usuari en qualsevol component

```typescript
// Injectar el servei
constructor(private authService: AuthService) {}

// Llegir dades
const user = this.authService.usuarioInfo;   // { id, nom, email, rol }
const token = this.authService.token;         // string del token
const isAuth = this.authService.isAuthenticated();  // boolean
```

---

## 4. Features per Rol

### Login (`features/login/`)

Dos components:
- **`LoginComponent`**: Pantalla principal amb boto de Google i formulari de login temporal (email).
- **`AuthCallbackComponent`**: Pagina invisible que captura el parametre `code` de la URL retornada per Google i crida a `handleGoogleCallback`.

### Alumne (`features/alumnes/`)

**`AlumnesComponent`** (dashboard):
Mostra la classe actual de l'alumne en temps real. Escolta l'event `horari_updated` del socket per actualitzar la informacio sense recarregar.

**`Horaris`** (alumnes/horaris):
Taula setmanal amb l'horari de l'alumne. Les dades es carreguen des de `GET /horaris/usuari/{id}`.

**`JustificantsComponent`** (alumnes/justificants):
Formulari per presentar un justificant d'absencia (dates, comentari, fitxer adjunt) i llistat dels justificants enviats amb el seu estat.

### Professor (`features/professors/`)

**`ProfessorsComponent`** (dashboard):
Vista principal del professor. Mostra la sessio actual i un acces rapid a les seves funcionalitats.

**`LlistaClasseComponent`** (llista-classe):
Funcionalitat central. Permet al professor seleccionar una sessio i registrar l'assistencia alumne per alumne (Assistit/Falta/Retard). Escolta events de socket per sincronitzar si hi ha mes d'un professor registrant simultaneament.

**`LlistaAssignaturesComponent`** (llista-assignatures):
Mostra les assignatures que imparteix el professor. Permet veure el ranking de faltes de cada assignatura.

**`LlistaFaltesComponent`** (llista-faltes):
Resum de faltes per alumne de totes les assignatures del professor.

**`GestioInscritsComponent`** (gestio-inscrits):
Permet al professor/admin veure i modificar els alumnes inscrits a la seva classe.

**`HorariAlumnesComponent`** (horari-alumnes):
Editor d'horari setmanal de la classe. Permet configurar cada franja horaria (assignatura, aula, professor, alumnes).

**`JustificantsComponents`** (gestio-justificants):
Vista per al tutor. Mostra els justificants pendents dels alumnes de la seva classe i permet acceptar-los o rebutjar-los.

### Administracio (`features/administracio/`)

**`AdministracioComponent`** (dashboard):
Acces rapid a totes les seccions d'administracio.

**`AdminAssignaturesComponent`**: CRUD d'assignatures.

**`AdminClassesComponent`**: CRUD de classes amb gestio de tutor i alumnes assignats.

**`AdminUsuarisComponent`**: Llistat i gestio d'usuaris del sistema.

**`AdminPeriodesComponent`**: Gestio dels trimestres (dates d'inici i fi de cada trimestre).

---

## 5. Serveis Globals

### `AuthService` (`services/auth.service.ts`)

Ja documentat a la seccio 3. Es el servei mes important del frontend.

### `SocketService` (`services/socket.service.ts`)

Encapsula la connexio a Socket.IO.

```typescript
@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = io(environment.socketUrl);

  // Subscriure's a un event
  on(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data) => observer.next(data));
    });
  }

  // Emetre un event (no usat habitualment; els events es llancen des del backend)
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
```

**Exemple d'us en un component:**
```typescript
// En ngOnInit()
this.socketService.on('assistencia_updated').subscribe(data => {
  // Actualitzar el llistat d'assistencies
  this.carregarAssistencies();
});
```

### `SidebarService` (`shared/services/sidebar.service.ts`)

Gestiona l'estat del sidebar (obert/tancat) i el flag de si el professor es tutor. Permet que components germans es comuniquin sense que el pare hagi d'intermediar.

---

## 6. Models TypeScript

Ubicats a `shared/models/`. Defineixen la forma de les dades que l'API retorna.

### `usuaris.model.ts`
```typescript
export interface Usuari {
  id: number;
  nom: string;
  cognom: string;
  email: string;
  rol: string;           // 'Alumne' | 'Profe' | 'Admin'
  photo?: string;
  id_classe?: number;
  data_naixement?: string;
}
```

### `horaris.model.ts`
```typescript
export interface Horari {
  id: number;
  codi_hora: string;     // ex: "L1", "M3"
  id_assig: number;
  id_classe: number;
  id_aula: number;
  id_professor: number;
  assignatura?: Assignatura;
  classe?: Classe;
  aula?: Aula;
  professor?: Usuari;
}
```

### `assistencies.model.ts`
```typescript
export interface Assistencia {
  id: number;
  id_inscripcio: number;
  data: string;
  estat: 'Assistit' | 'Falta' | 'Retard' | 'Justificada';
  id_profe?: number;
}
```

### `justificants.model.ts`
```typescript
export interface Justificant {
  id: number;
  id_alum: number;
  data_inici: string;
  data_fi: string;
  comentari?: string;
  document?: string;
  estat: 'Pendent' | 'Acceptada' | 'Rebutjada';
}
```

---

## 7. Disseny i Estils

El projecte usa un sistema de disseny propi anomenat **Glassify**, basat en glassmorphism sobre fons de gradient clar. El nom apareix al primer comentari del fitxer `styles.css`.

### Caracteristiques visuals

- **Fons**: Gradient de blau-lila a lila-rosa (`#e0e7ff` -> `#f3e8ff`) amb orbs de color radials
- **Targetes**: Efecte glassmorphism (`backdrop-filter: blur(25px) saturate(200%)`, fons semitransparent blanc)
- **Tipografia**: Google Fonts (Outfit, pesos 300-800)
- **Colors principals**: Violeta (`#6366f1`), Lila (`#a78bfa`), Rosa (`#f472b6`)
- **Ombres**: Suaus amb to de color, no negres pures
- **Animacions**: `pageEnter` (fade + slide en carregar), `spin-morph` (spinner), `shake` (errors)

### Sidebar

Dos components de sidebar reutilitzables:
- `SidebarComponent` (professors i alumnes): navbar flotant tipus pill amb to violeta. Variant `.tema-alumne` per als alumnes (to blau).
- `SidebaradminComponent` (administradors): navbar pill amb to blanc/neutre, botons amb text expandible en hover.

### Variables CSS globals (`styles.css`)

```css
:root {
    --bg-main: #f0f4ff;
    --bg-gradient: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
    --primary-color: #6366f1;
    --primary-light: #818cf8;
    --secondary-color: #a78bfa;
    --accent-color: #f472b6;

    --glass-bg: rgba(255, 255, 255, 0.4);
    --glass-border: rgba(255, 255, 255, 0.7);
    --glass-blur: blur(25px) saturate(200%);
    --glass-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.15);
    --glass-reflection: inset 0 1px 1px rgba(255, 255, 255, 0.8);

    --text-main: #1e293b;
    --text-muted: #64748b;

    --radius-l: 32px;
    --radius-m: 20px;
}
```

### Classe utilitaria `.glass-panel`

Aplicable a qualsevol element per donar-li l'efecte de targeta de vidre:

```css
.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow), var(--glass-reflection);
    border-radius: var(--radius-m);
}
```

---

*Per a la referencia de l'API i els models de dades, consulta [BACKEND.md](../backend/BACKEND.md).*
*Per a l'arquitectura general i Docker, consulta [ARQUITECTURA.md](../arquitectura/ARQUITECTURA.md).*
