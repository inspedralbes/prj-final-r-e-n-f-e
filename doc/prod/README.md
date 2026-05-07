# Producció

## Desplegament a Producció

El desplegament a producció del projecte està automatitzat mitjançant **GitHub Actions** i la infraestructura es gestiona amb **Docker Compose**.

### Automatització amb GitHub Actions

El workflow de GitHub Actions es troba a `.github/workflows/deploy` i s'activa automàticament quan es fa un `push` a la branca `prod`. El procés és el següent:

1. **Connexió al servidor:**  
   El workflow utilitza SSH per connectar-se al servidor de producció fent servir les credencials emmagatzemades com a secrets de GitHub.

2. **Actualització del codi:**
   - Accedeix al directori del projecte al servidor (Si no troba el directori, el workflow el clona automàticament).
   - Fa `git pull` per obtenir l'última versió del codi.

3. **Configuració d'arxius d'entorn:**
   - Copia els arxius `.env.PROD` a `.env` per cada servei necessari (backend, frontend).
   - Afegeix variables d'entorn sensibles (usuari i contrasenya de Postgres, etc.) a partir dels secrets de GitHub.

4. **Configuració inicial (abans de validar certificats):**
   - El sistema copia l'arxiu `nginx-init.conf` com a configuració bàsica per l'nginx (el que s'utilitza per a la validació de certbot).

5. **Arrencada de Docker:**
   - Executa `docker compose -f compose.PROD.yml up -d --build` per construir i aixecar tots els serveis definits.

6. **Validació de certificats SSL:**
   - Un cop els serveis estan en marxa, el workflow executa `certbot` per obtenir i configurar els certificats SSL per al domini de producció.

| Si el certficat SSL es vàlid                           |                                   Si no hi ha un certificat SSL valid                                    |
| :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------: |
| Copia l'arxiu `nginx-init.conf` i reinicia els dockers | El sistema donarà per finalitzat el build, al pròxim build tornarà a comprovar si existeix el certificat |

### Orquestració amb Docker Compose

El fitxer `compose.PROD.yml` defineix tota la infraestructura de producció. Cada servei del projecte (frontend, backend, bases de dades, etc.) s'executa en un contenidor independent.

#### Serveis Principals

- **pfg1-nginx:** Servei de Nginx que actua com a proxy invers per al frontend i backend.
- **pfg1-laravel-api:** Backend de Laravel.
- **pfg1-worker:** Servei de cues per a Laravel.
- **pfg1-principal-node:** Backend de Node.js.
- **pfg1-postgres:** Base de dades PostgreSQL.
- **pfg1-pgadmin:** Interfície de gestió de Postgres, port 8080.
- **certbot:** Servei per a la gestió de certificats SSL.
- **portainer:** Gestor de contenidors Docker, port 9443.

#### Volums

S'utilitzen volums Docker per persistir les dades de Postgres i Portainer.

#### Variables d'entorn

Els serveis utilitzen l'arxiu `.env.PROD.DOCKER` per carregar les variables d'entorn necessàries (usuaris, contrasenyes, URIs, etc.).

---

### Procés resumit de desplegament

1. **Push a la branca de producció** (`prod`).
2. **GitHub Actions** executa el workflow de desplegament.
3. **El servidor de producció** rep el codi actualitzat, configura els arxius `.env` i aixeca els serveis amb Docker Compose.
4. **Els serveis** queden disponibles als ports configurats i amb les dades persistides.

> **Nota:**  
> Per modificar el desplegament, cal editar el workflow de GitHub Actions o el fitxer `compose.PROD.yml` segons les necessitats del projecte.

> **Nota 2:**
> Si en el procés de desplegament es produeix un error, és recomanable revisar l'estat dels contenidors amb `portainer` o `docker ps` i els logs amb `docker logs <container_id>` per identificar el problema. També es pot accedir a la GUI de RabbitMQ per verificar l'estat de les cues i missatges.

<br>

# Manual d'Instal·lació en una Màquina Nova

Aquest manual explica com desplegar el projecte **prj-final-front-back-tr-final-g6** en una màquina nova, des de zero.

---

## 1. Requisits previs

Abans de començar, assegura't que la màquina compleix els següents requisits:

- **Sistema operatiu:** Ubuntu 20.04/22.04 (o similar)
- **Accés root** o permisos sudo
- **Git**
- **Docker** i **Docker Compose**
- **Accés a internet**

---

## 2. Clonar el repositori

```bash
cd /ruta/on/vols/instal-lar
git clone https://github.com/inspedralbes/prj-final-r-e-n-f-e
cd prj-final-r-e-n-f-e
```

---

## 3. Configuració d'arxius d'entorn

Copia els arxius d'entorn de producció als seus llocs corresponents:

```bash
cp ./back/laravel-api/.env.PROD ./back/laravel-api/.env

cp ./back/principal-node/.env.PROD ./back/principal-node/.env

cp ./front/.env.PROD ./front/.env

env
```

Edita els arxius `.env` per afegir les variables d'entorn reals (usuaris, contrasenyes, URIs, etc.) segons la teva configuració.

---

## 5. Configuració inicial de Nginx

Si es la primera vegada que inicies el sistema (o no tens els certificats SSL), copia l'arxiu `nginx-init.conf` com a configuració bàsica per Nginx:

```bash
cp nginx-init.conf nginx.conf
```

Si ja tens un certificat valid, pots copiar la configuracio de nginx directament.

```bash
cp nginx-prod.conf nginx.conf
```

## 4. Arrencada dels serveis amb Docker Compose

```bash
docker compose -f compose.PROD.yml up -d --build
```

Aquesta comanda construirà i aixecarà tots els serveis definits a `compose.PROD.yml`.

---

## 5. Verificació

Comprova que tots els contenidors estan funcionant:

```bash
docker ps
```

> [!NOTE]  
> Si tens la configuració inicial per generar els SSL, el projecte no estara aixecat. Fes la comprobacio dels certficats amb certbot
>
> ```bash
> docker compose -f compose.PROD.yml logs certbot
> ```
>
> Si el certificat es valid, pots copiar la configuracio de nginx i reiniciar els dockers.
>
> ```bash
> cp nginx-prod.conf nginx.conf
> docker compose -f compose.PROD.yml up -d --build
> ```

---

## 6. Actualització del projecte

Per actualitzar el projecte a una nova versió:

```bash
git pull
docker compose -f compose.PROD.yml up -d --build
```

---

## 7. Notes addicionals

- Si algun contenidor falla, consulta els logs amb:
  ```bash
  docker logs <nom_o_id_del_contenidor>
  ```
- Pots gestionar els contenidors gràficament amb Portainer (`http://localhost:9443`).

---

## 8. Desplegament automàtic (opcional)

Si vols automatitzar el desplegament, configura els secrets i el workflow de GitHub Actions (`.github/workflows/deploy.yaml`) segons la teva infraestructura.

---

**Fi del manual**
