# Rodri 2026 · Galería

Galería estática lista para Vercel. Los 146 originales están relacionados con las miniaturas por el orden del archivo `src/photos.js`.

## Publicar en Vercel
1. Subí este proyecto a un repositorio GitHub.
2. En Vercel: **Add New → Project**, importá el repositorio.
3. Framework: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

## Estructura esperada en Cloudflare R2
El endpoint público configurado en `src/gallery.jsx` es:
`https://pub-eb440d2765f74a2a863d11572a036375.r2.dev`

Objetos:
- `thumbs/foto-1.webp` hasta `thumbs/foto-146.webp`
- `originales/` con los 146 nombres exactos listados en `src/photos.js`

## CORS para la descarga ZIP
Para que el botón “Descargar todas” funcione, configurá CORS del bucket permitiendo el origen de tu sitio Vercel (por ejemplo `https://TU-PROYECTO.vercel.app`) y los métodos `GET`, `HEAD`, con header `*`. Las imágenes pueden visualizarse sin esto; la descarga ZIP necesita CORS.

No requiere credenciales ni claves secretas en el frontend.
