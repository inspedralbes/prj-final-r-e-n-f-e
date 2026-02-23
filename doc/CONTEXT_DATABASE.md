# Estructura de la Base de Datos (estado real según migraciones)
## Tablas

### `usuaris`

| Columna         | Tipo                       | Notas                  |
| --------------- | -------------------------- | ---------------------- |
| id              | bigint PK                  | autoincrement          |
| nom             | string                     |                        |
| cognom          | string                     | nullable               |
| rol             | enum(Admin, Profe, Alumne) | default: Alumne        |
| email           | string                     | unique                 |
| email_pares     | string                     | nullable               |
| password        | string                     | nullable               |
| token           | string                     | nullable               |
| nfc_id          | string                     | nullable               |
| id_curs         | FK → cursos                | nullable, nullOnDelete |
| horari_guardies | string                     | nullable               |

---

### `periodes`

| Columna         | Tipo      | Notas         |
| --------------- | --------- | ------------- |
| id              | bigint PK | autoincrement |
| trimestre_1_ini | date      | nullable      |
| trimestre_1_fi  | date      | nullable      |
| trimestre_2_ini | date      | nullable      |
| trimestre_2_fi  | date      | nullable      |
| trimestre_3_ini | date      | nullable      |
| trimestre_3_fi  | date      | nullable      |

---

### `assignatures`

| Columna  | Tipo      | Notas          |
| -------- | --------- | -------------- |
| id       | bigint PK | autoincrement  |
| nom      | string    |                |
| projecte | boolean   | default: false |
| interval | string    | nullable       |
| excepcio | boolean   | default: false |

---

### `cursos`

| Columna    | Tipo          | Notas                  |
| ---------- | ------------- | ---------------------- |
| id         | bigint PK     | autoincrement          |
| tipus      | enum(GM, GS)  |                        |
| nom        | string        |                        |
| id_tutor   | FK → usuaris  | nullable, nullOnDelete |
| id_periode | FK → periodes | nullable, nullOnDelete |

---

### `classes`

| Columna  | Tipo         | Notas                  |
| -------- | ------------ | ---------------------- |
| id       | bigint PK    | autoincrement          |
| id_curs  | FK → cursos  | cascadeOnDelete        |
| nom      | string       |                        |
| id_tutor | FK → usuaris | nullable, nullOnDelete |
| id_aula  | FK → aules   | nullable, nullOnDelete |

---

### `aules`

| Columna | Tipo      | Notas         |
| ------- | --------- | ------------- |
| id      | bigint PK | autoincrement |
| nom     | string    |               |

---

### `imparteix`

| Columna        | Tipo              | Notas           |
| -------------- | ----------------- | --------------- |
| id             | bigint PK         | autoincrement   |
| id_profe       | FK → usuaris      | cascadeOnDelete |
| id_assignatura | FK → assignatures | cascadeOnDelete |
| titular        | boolean           | default: false  |

---

### `inscrits`

| Columna        | Tipo              | Notas           |
| -------------- | ----------------- | --------------- |
| id             | bigint PK         | autoincrement   |
| id_alumne      | FK → usuaris      | cascadeOnDelete |
| id_assignatura | FK → assignatures | cascadeOnDelete |

---

### `assistencies`

| Columna        | Tipo                          | Notas           |
| -------------- | ----------------------------- | --------------- |
| id             | bigint PK                     | autoincrement   |
| id_assignatura | FK → assignatures             | cascadeOnDelete |
| codi_hora      | string                        | nullable        |
| data           | date                          |                 |
| estat          | enum(Assistit, Falta, Retard) | nullable        |
| id_profe       | FK → usuaris                  | nullable        |

---

### `justificants`

| Columna            | Tipo              | Notas           |
| ------------------ | ----------------- | --------------- |
| id                 | bigint PK         | autoincrement   |
| id_alum            | FK → usuaris      | cascadeOnDelete |
| id_assistencia_ini | FK → assistencies | nullable        |
| id_assistencia_fi  | FK → assistencies | nullable        |
| comentari          | text              | nullable        |
| document           | string            | nullable        |
| acceptada          | boolean           | default: false  |

---

### `horaris`

| Columna   | Tipo              | Notas                  |
| --------- | ----------------- | ---------------------- |
| id        | bigint PK         | autoincrement          |
| codi_hora | string            | nullable               |
| id_assig  | FK → assignatures | cascadeOnDelete        |
| id_classe | FK → classes      | cascadeOnDelete        |
| id_aula   | FK → aules        | nullable, nullOnDelete |

---

### `sensors`

| Columna | Tipo       | Notas                  |
| ------- | ---------- | ---------------------- |
| id      | bigint PK  | autoincrement          |
| mac     | string     | nullable               |
| id_aula | FK → aules | nullable, nullOnDelete |

---
