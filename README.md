# Döntéstámogató mobilaklalmazás

## Technológiák

### Backend

* NestJS
* Docker
* PostgreSQL
* Prisma

### Frontend

* React Native
* Expo
* TypeScript
* Redux
* Websocket

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
Kérdésbank generálás sorozatok és filmek alapján a felső menüpontban, ezek külső API forrásból érkeznek. Az alsó menüpontban a felhasználó által legtöbbet használt kérdésbankkal szavazás indítható. Szavazés indítása a Play gomb megnyomásával egy külön képernyőről indítható.

 ![Image Alt](https://raw.githubusercontent.com/Sdavid19/Swiper/refs/heads/master/frontend/Menu.png)

### Bank listázó és szerkesztő
Kérdésbankok létrehozása és szekresztése ezeken az oldalakon lehetségesek. A kérdésbankok címmel és kategóriával rendelkező kérdésgyűjtemények, amelyekkel szavazások indítható.

![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Bank_Editor.png?raw=true)

### Szoba
Ide tudnak becsaktlakozni a felhasználók. Egy felhasználó egy kérdésbankkal szavazást indíthat és itt csatlakozhatbak be mások a megfelelő 6 számjegyű kódot megadva.

![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Room.png?raw=true)

### Szavazás
Szavazás itt történik, a felhasználók jobbra/balra húzással szavazhatnak. Minden résztvevőt meg kell várni míg végez.

![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Vote.png?raw=true)

### Statisztika
A szavazás végeztével itt tekinthetők meg a statisztikák. Oszlop diagram szemlélteti a kérdésekre adott igen szavazatokat csökkenő sorrendben. Az oszlopokra nyomva jelennek meg a részletesebb statisztikák például az igenek/nemek aránya.

![Image Alt](https://github.com/Sdavid19/Swiper/blob/master/frontend/Stats.png?raw=true)

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
