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
* Websocket

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

### Menü
 ![Image Alt](https://raw.githubusercontent.com/Sdavid19/Swiper/refs/heads/master/frontend/Menu.png)

### Bank szerkesztő
![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Bank_Editor.png?raw=true)

### Szoba
![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Room.png?raw=true)

### Szavazás
![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Vote.png?raw=true)

### Statisztika
![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Stats.png?raw=true)

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
