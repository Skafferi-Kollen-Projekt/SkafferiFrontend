# Skafferi Kollen – Frontend

Detta repository innehåller **frontend** för projektet **Skafferi Kollen**.  
Frontend är byggd med **React + TypeScript (Vite)** och körs **lokalt**.

Frontend ansvarar för:
- användargränssnitt
- formulär (registrering, inloggning, profil)
- visning och hantering av skafferi‑varor
- kommunikation med backend via REST‑API

---

## 🎨 Teknikstack

- React
- TypeScript
- Vite
- Fetch API
- CSS (responsiv design)

---

## 🚀 Köra frontend lokalt

### 1️⃣ Installera dependencies

```bash
npm install
___________________________________
2️⃣ Starta frontend:
npm run dev

Frontend körs på:
http://localhost:5173
___________________________________
⚠️ Backend krävs
För att frontend ska fungera måste backend köras lokalt samtidigt.
Backend körs på:
http://localhost:4000
Frontend kommunicerar endast med backend‑API och aldrig direkt med databasen.
___________________________________
🔗 Backend
Backend finns i ett separat repository:
➡️ skafferi-backend
___________________________________
✅ Funktionalitet

✔ Visa data från backend
✔ Skapa nya objekt via formulär
✔ Uppdatera befintliga objekt
✔ Radera objekt
✔ Dynamiska UI‑uppdateringar utan sidladdning


✅ Status

✔ Frontend fungerar lokalt
✔ Full CRUD‑funktionalitet via backend
✔ Klar för demonstration
___________________________________



