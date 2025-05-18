# Jegyértékesítő Portál

Egy full-stack jegyértékesítő portál alkalmazás, amely a MEAN stack (MongoDB, Express.js, Angular, Node.js) technológiákra épül, TypeScript használatával.

## Funkciók

- Felhasználói autentikáció és jogosultságkezelés
- Eseménykezelés szervezők számára
- Jegyvásárlási rendszer
- Szerepkör alapú hozzáférés-vezérlés (Admin, Felhasználók, Vendégek)
- Események böngészése és szűrése
- Jegyfoglalás és vásárlás
- Irányítópult eseményszervezők számára

## Projekt Struktúra

```
ticket-portal/
├── frontend/           # Angular alkalmazás
├── backend/            # Node.js/Express alkalmazás
└── README.md
```

## Előfeltételek

- Node.js (v14 vagy újabb)
- Angular CLI
- MongoDB
- npm vagy yarn

## Telepítés

1. Klónozza a repository-t
2. Függőségek telepítése:
   ```bash
   # Backend függőségek telepítése
   cd backend
   npm install

   # Frontend függőségek telepítése
   cd ../frontend
   npm install
   ```

3. Környezeti változók konfigurálása:
   - Hozzon létre `.env` fájlt a backend könyvtárban
   - Állítsa be a MongoDB kapcsolati stringet
   - Konfigurálja a JWT titkosítási kulcsot

4. Alkalmazások indítása:
   ```bash
   # Backend szerver indítása
   cd backend
   npm run dev

   # Frontend alkalmazás indítása
   cd frontend
   ng serve
   ```

## API Dokumentáció

A backend RESTful API-kat biztosít a következőkhöz:
- Felhasználói autentikáció
- Eseménykezelés
- Jegyműveletek
- Felhasználókezelés

## Licenc

MIT