# Sistema de Gestio d'Assistencia Escolar
## Manual d'Usuari

---

## Taula de Continguts

1. [Introduccio](#1-introduccio)
2. [Acces a l'Aplicacio](#2-acces-a-laplicacio)
3. [Manual del Professor](#3-manual-del-professor)
4. [Manual de l'Alumne](#4-manual-de-lalumne)
5. [Manual de l'Administrador](#5-manual-de-ladministrador)
6. [Preguntes Frequents](#6-preguntes-frequents)

---

## 1. Introduccio

El Sistema de Gestio d'Assistencia Escolar es una aplicacio web per al centre educatiu INS Pedralbes. Permet gestionar l'assistencia dels alumnes de manera digital, en temps real i des de qualsevol dispositiu amb connexio a internet.

L'aplicacio diferencia tres tipus d'usuaris, cadascun amb les seves propies pantalles i funcionalitats:

```
+-------------------+------------------------------------------------+
| Tipus d'usuari    | Que pot fer                                    |
+-------------------+------------------------------------------------+
| Professor         | Passar llista, veure horaris, gestionar la     |
|                   | seva classe, revisar justificants (si es tutor)|
+-------------------+------------------------------------------------+
| Alumne            | Veure el seu horari, consultar les seves       |
|                   | faltes per assignatura, enviar justificants    |
+-------------------+------------------------------------------------+
| Administrador     | Gestionar usuaris, classes, assignatures,      |
|                   | aules i periodes del curs                      |
+-------------------+------------------------------------------------+
```

**URL de l'aplicacio:** https://tenfe.cat

---

## 2. Acces a l'Aplicacio

### 2.1 Pantalla de Login

En accedir a l'aplicacio, es mostra la pantalla d'inici de sessio. Hi ha dues opcions:

```
+-------------------------------------------------------+
|                                                       |
|         Sistema de Gestio d'Assistencia               |
|                                                       |
|   +-------------------------------------------+      |
|   |     Accedeix amb el compte de Google       |      |
|   |           (boto blau de Google)            |      |
|   +-------------------------------------------+      |
|                                                       |
|   - - - - - o inicia sessio per email - - - - -       |
|                                                       |
|   [ Camp d'email                          ]           |
|   [ Boto: Accedir                         ]           |
|                                                       |
+-------------------------------------------------------+
```

### 2.2 Login amb Google (recomanat)

1. Fes clic al boto de Google.
2. El navegador t'obrira una finestra de Google per seleccionar el compte.
3. **Important**: Has d'usar el teu compte institucional `@inspedralbes.cat`. Si uses un compte personal, l'acces sera denegat.
4. Despres de triar el compte, seras redirigit automaticament a la teva zona.

### 2.3 Login Temporal per Email(Només accesible per el devMode)

Aquesta opcio es per a situacions on Google no esta disponible o per a proves:
1. Escriu el teu email institucional al camp corresponent.
2. Fes clic a "Accedir".
3. No es necessari cap contrasenya. El sistema verifica que l'email existeixi a la base de dades.

### 2.4 Primera vegada (Alumnes)

Si ets alumne i entres per primera vegada, l'aplicacio et demanara que completis el teu perfil amb la teva **data de naixement**. Aixo es obligatori per poder accedir a totes les funcionalitats. Omple el camp i fes clic a "Guardar".

### 2.5 Tancar Sessio

Per tancar la sessio de forma segura, fes clic al boto "Tancar Sessio" (o icona de sortida) disponible al menu lateral de l'aplicacio.

---

## 3. Manual del Professor

### 3.1 Pantalla Principal (Dashboard)

Despres d'iniciar sessio, els professors arriben al seu tauler principal. Mostra:

- El nom i foto del professor
- La **sessio en curs**: si es hora de classe, es mostra l'assignatura, la classe i l'aula actual
- Acces rapid a les funcionalitats principals

### 3.2 Passar Llista d'Assistencia

Aquesta es la funcionalitat mes important per al professor. Segueix aquests passos:

**Pas 1: Accedir a "Llista de Classe"**
Fes clic a l'opcio "Llista de Classe" al menu lateral.

**Pas 2: Seleccionar la sessio**
L'aplicacio suggereix automaticament la sessio actual (basant-se en l'hora i el dia). Si necessites passar llista d'una altra sessio, selecciona-la de la llista desplegable.

**Pas 3: Seleccionar la setmana**
El sistema carrega per defecte la setmana actual. Pots navegar a setmanes anteriors per modificar o revisar registres passats.

**Pas 4: Registrar l'assistencia**
Per a cada alumne de la classe, tens tres opcions:

```
+-------------------------------------------+
|  Alumne: Pere Garcia Mas                  |
|                                           |
|  [ Assistit ] [ Falta ] [ Retard ]        |
+-------------------------------------------+
```

- **Assistit**: L'alumne es present a classe.
- **Falta**: L'alumne no ha assistit.
- **Retard**: L'alumne ha arribat tard.

Fes clic al boto corresponent per cada alumne. El registre es guarda automaticament i en temps real (els alumnes veuen l'actualitzacio al moment).

**Nota:** Si un justificant es aprovat per un alumne que tenia una falta, l'estat canviara automaticament a "Justificada" sense necessitat d'intervencio manual.

### 3.3 Les Meves Assignatures

A "Les Meves Assignatures" pots veure totes les assignatures que imparteixes i el resum de faltes de cada alumne.

Per a cada assignatura es mostra:
- La llista d'alumnes inscrits
- El nombre total de faltes per alumne
- Un ranking d'alumnes per nombre de faltes (de mes a menys)

### 3.4 Resum de Faltes

A "Resum de Faltes" es mostra una vista global de totes les faltes dels alumnes de les teves assignatures, ordenades de major a menor nombre de faltes. Util per identificar rapidament els casos que requereixen atencio.

### 3.5 Horari de la Classe (Editor d'Horari)

Accessible des de "Horari de la Classe". Permet configurar l'horari setmanal del grup:

1. La taula mostra les files com a dies (dilluns a divendres) i les columnes com a hores.
2. Fes clic a una casella per editar aquella franja horaria.
3. Per a cada franja pots configurar:
   - Assignatura
   - Aula
   - Professor responsable
   - Alumnes assignats a aquella franja (per a desdoblaments)
4. Desa els canvis amb el boto corresponent.

Els canvis es propagen en temps real a tots els alumnes afectats.

### 3.6 Gestio d'Inscrits

A "Gestio d'Inscrits" pots veure quins alumnes estan assignats a la teva classe i les seves inscripcions a les assignatures.

### 3.7 Gestio de Justificants (nomes tutors)

Si ets tutor d'una classe, tens acces a la seccio "Justificants" on pots revisar els justificants que han presentat els alumnes de la teva classe.

Per a cada justificant pots veure:
- Nom de l'alumne
- Periode justificat (data inici i fi)
- Comentari de l'alumne
- Document adjunt (si n'hi ha), que es pot visualitzar directament
- Estat actual: Pendent, Acceptada o Rebutjada

**Per acceptar o rebutjar un justificant:**
1. Visualitza el document adjunt si escau.
2. Fes clic a "Acceptar" o "Rebutjar".
3. Si l'acceptes, el sistema actualitza automaticament totes les faltes del periode a "Justificada".

### 3.8 Carta de Faltes (generacio de document)

Des del resum de faltes, si un alumne supera un determinat nombre d'hores de falta (30, 60 o 90 hores), pots generar una carta de faltes oficial en PDF:

1. Selecciona l'alumne.
2. Indica el nombre de faltes (30, 60 o 90).
3. El sistema generara automaticament una carta personalitzada amb les dades de l'alumne, el tutor i la direccio del centre.
4. El document es descarrega automaticament en format PDF.

---

## 4. Manual de l'Alumne

### 4.1 Pantalla Principal (Dashboard)

El dashboard de l'alumne mostra:
- El nom i foto de l'alumne
- La **classe en curs**: l'assignatura actual, l'aula i l'hora d'inici i fi
- Acces al menu principal

La informacio de la classe en curs s'actualitza automaticament en temps real.

### 4.2 El Meu Horari

A "El Meu Horari" pots consultar el teu horari setmanal complet.

La taula mostra:
- Files: Hores del dia (de la 1a hora a la darrera)
- Columnes: Dies de la setmana (dilluns a divendres)
- Cada casella indica l'assignatura que tens en aquella franja

```
+---------+----------+----------+----------+----------+----------+
|  Hora   | Dilluns  | Dimarts  | Dimecres | Dijous   | Divendres|
+---------+----------+----------+----------+----------+----------+
| 08:00   | DWEC     | M07      | DWEC     | M07      |          |
+---------+----------+----------+----------+----------+----------+
| 09:00   | M07      | DWEC     | M07      | DWEC     | DAW2     |
+---------+----------+----------+----------+----------+----------+
| 10:00   |          | DAW2     |          | DAW2     | DWEC     |
+---------+----------+----------+----------+----------+----------+
...
```

### 4.3 Les Meves Faltes

A "Les Meves Faltes" pots veure un resum de la teva assistencia per a cada assignatura.

Per a cada assignatura es mostra:
- Nombre de faltes no justificades
- Nombre de retards
- Nombre de faltes justificades
- **Percentatge de faltes** sobre el total d'hores del trimestre

```
+----------------------------------------------------------+
|  Total (totes les assignatures)                          |
|  Faltes: 3 | Retards: 1 | Justificades: 2 | 5.2%        |
+----------------------------------------------------------+
|  DWEC                                                    |
|  Faltes: 1 | Retards: 0 | Justificades: 1 | 3.1%        |
+----------------------------------------------------------+
|  M07                                                     |
|  Faltes: 2 | Retards: 1 | Justificades: 1 | 6.7%        |
+----------------------------------------------------------+
```

Les dades corresponen al trimestre actiu en el moment de la consulta.

### 4.4 Presentar un Justificant

Si has faltat per un motiu justificat (metge, malaltia, etc.), pots presentar un justificant des de "Les Meves Faltes" o "Justificants".

**Passos per presentar un justificant:**

1. Accedeix a la seccio "Justificants".
2. Fes clic a "Nou Justificant" o el boto equivalent.
3. Omple el formulari:

```
+---------------------------------------------------+
|  Data d'inici de l'absencia:  [ 2026-03-10 ]     |
|  Data de fi de l'absencia:    [ 2026-03-11 ]     |
|  Comentari (optional):        [ Visita metge ]   |
|  Document adjunt (optional):  [ Triar fitxer ]   |
|                                                   |
|  [ Enviar Justificant ]                           |
+---------------------------------------------------+
```

4. Fes clic a "Enviar".

El justificant quedara en estat "Pendent" fins que el teu tutor el revisi. Quan sigui revisat, canviara a "Acceptada" o "Rebutjada". Si s'accepta, les teves faltes del periode es marcaran automaticament com a "Justificades".

**Consells:**
- Pots adjuntar un document (justificant medic, notificacio oficial, etc.).
- Si no tens document, pots posar nomes el comentari.
- Comprova les dates correctament: han de coincidir amb els dies que vas faltar.

### 4.5 Veure l'Estat dels Justificants

A la seccio "Justificants" es mostra el llistat de tots els justificants que has presentat, amb l'estat de cadascun:

- **Pendent**: El tutor encara no l'ha revisat.
- **Acceptada**: El justificant ha estat aprovat. Les teves faltes del periode s'han marcat com a justificades.
- **Rebutjada**: El tutor no ha acceptat el justificant. Les faltes es mantenen.

---

## 5. Manual de l'Administrador

### 5.1 Pantalla Principal (Dashboard d'Admin)

El dashboard de l'administrador dona acces a totes les seccions de gestio del centre. Es el panel de control global del sistema.

### 5.2 Gestio d'Usuaris

A "Usuaris" pots veure, editar i gestionar tots els usuaris del sistema.

**Funcionalitats disponibles:**
- Veure el llistat complet d'usuaris (professors, alumnes, admins)
- Filtrar per rol
- Editar les dades d'un usuari (nom, cognom, rol, classe assignada)
- Assignar un alumne a una classe

### 5.3 Gestio de Classes

A "Classes" pots gestionar els grups-classe del centre.

**Funcionalitats:**
- Crear una nova classe (nom, tutor, curs)
- Editar una classe existent
- Veure els alumnes d'una classe
- Assignar o treure alumnes d'una classe
- Assignar el tutor de la classe

### 5.4 Gestio d'Assignatures

A "Assignatures" pots gestionar totes les assignatures del centre.

**Funcionalitats:**
- Crear assignatura amb nom, hores per trimestre i configuracio de projecte
- Editar assignatures
- Eliminar assignatures
- Indicar si una assignatura te exempcio (no substituible per Projecte)

**Camp "assignatura de projecte":** Quan una assignatura es configura com a projecte d'una classe, les hores de la franja es comptabilitzen amb el projecte en lloc de l'assignatura original (per a cicles amb modul de projecte).

### 5.5 Gestio de Periodes (Trimestres)

A "Periodes" configures les dates del curs academic.

**Funcionalitats:**
- Crear un periode amb nom (ex: "Curs 2025-2026")
- Definir les dates d'inici i fi de cada trimestre:
  - Primer trimestre
  - Segon trimestre
  - Tercer trimestre
- Marcar un periode com a **Actiu** (el sistema usa el periode actiu per calcular el trimestre actual i les estadistiques de faltes)

```
+----------------------------------------------+
|  Periode: Curs 2025-2026   [ Actiu ]          |
|                                               |
|  1r Trimestre: 15/09/2025 - 19/12/2025       |
|  2n Trimestre: 08/01/2026 - 27/03/2026       |
|  3r Trimestre: 13/04/2026 - 20/06/2026       |
+----------------------------------------------+
```

**Nota important:** El periode actiu afecta directament:
- Quines faltes veu l'alumne a "Les Meves Faltes"
- El calcul del percentatge de faltes per trimestre

### 5.6 Generacio Massiva d'Assistencies

Des de la zona d'administracio (o via API directa), es pot generar el registre d'assistencia per a tots els alumnes de tots els grups per a un rang de dates. Aixo es util a l'inici de cada setmana o periode per crear els registres que els professors despres modificaran.

El sistema crea automaticament un registre "Assistit" per a cada alumne i cada sessio que li correspon. Els professors posteriorment canvien a "Falta" o "Retard" els que escaigui.

---

## 6. Preguntes Frequents

**No puc accedir amb el meu compte de Google.**
Assegura't d'usar el compte `@inspedralbes.cat`. Els comptes personals (@gmail.com o altres dominis) no estan autoritzats.

**Soc alumne i no puc passar de la pantalla de "Completa el teu Perfil".**
L'aplicacio et demana la teva data de naixement obligatoriament. Omple el camp i desa. Despres podras accedir al teu tauler.

**Les faltes que veig son del trimestre correcte?**
L'aplicacio mostra les faltes del trimestre que l'administrador hagi marcat com a "actiu". Si creus que les dates son incorrectes, contacta amb l'administrador del sistema.

**Vaig enviar un justificant pero encara apareix com a "Pendent".**
El justificant l'ha de revisar el teu tutor. No hi ha un temps garantit de resposta; depenent del tutor, pot trigar uns dies.

**Com sap l'aplicacio quina es la meva classe actual?**
El sistema calcula la franja horaria actual basant-se en l'hora del servidor i el teu horari configurat. Les franges son fixes (hora 1 = 08:00, hora 2 = 09:00, etc.).

**Puc accedir des del mobil?**
Si. L'aplicacio esta dissenyada per ser responsive i funciona correctament en navegadors de dispositius movils (Chrome, Safari, Firefox).

**No puc veure el document adjunt d'un justificant.**
El document s'ha de carregar des del servidor. Si el document no es visualitza, pot ser que el format no sigui compatible o que hi hagi un problema amb el fitxer original. Contacta amb l'alumne per que el torni a enviar en format PDF o imatge.

**Com es genera una carta de faltes?**
Nomes el professor tutor pot generar cartes de faltes. A la seccio de resum de faltes, selecciona l'alumne i tria el nombre d'hores (30, 60 o 90). La carta es generara automaticament en PDF amb les dades del centre, el tutor i l'alumne.

---

*Per a suport tecnic o incidencies, contacta amb l'equip de desenvolupament.*
