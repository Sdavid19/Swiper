# Döntéstámogató mobilaklalmazás

## Technológiák

### Backend

* NestJS
* Docker
* PostgreSQL

### Frontend

* React Native
* Expo
* TypeScript

---

## Telepítés

### 1. API kulcs beszerzése

Az alkalmazás a Movie of the Night API-t használja.

API dokumentáció:

https://www.movieofthenight.com/about/api

A kapott API kulcsot a backend `.env` fájljában kell megadni:

```env
RAPID_API_KEY=<API_KULCS>
```

---

### 2. Backend indítása

A backend Docker Compose segítségével futtatható.

```bash
docker compose up -d
```
---

### 3. Frontend konfigurálása

A frontend projekt gyökérkönyvtárában hozz létre egy `.env` fájlt:

```env
EXPO_PUBLIC_API_URL=http://<IP-cím>:3000
```

Az `<IP-cím>` helyére annak a gépnek az IP-címe kerüljön, amelyen a backend fut.

---

### 4. Függőségek telepítése

```bash
npm install
```

---

### 5. API kliens generálása

```bash
npm run generate:api
```

---

### 6. Frontend indítása

```bash
npx expo start
```

Az alkalmazás futtatható:

* Expo Go alkalmazásból
* Android illetve IOS készülékeken

---

## Funkciók

* Kérdésbankok létrehozása
* Kérdésbankok generálása filmes/sorozatos témákban
* Szavazások indítása
* Szavazatok rögzítése
* Eredmények összesítése
* Statisztikák készítése
* Android és iOS támogatás

---

## Projekt struktúra

```text
project/
├── backend/
│   ├── src/
│   ├── docker-compose.yml
│   └── .env
│
└── frontend/
    ├── src/
    ├── .env
    └── package.json
```
