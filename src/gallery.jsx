import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { Download, X, ChevronLeft, ChevronRight, Images, LoaderCircle } from 'lucide-react';
import { photos } from './photos';

const BASE = 'https://pub-eb440d2765f74a2a863d11572a036375.r2.dev';
const thumbUrl = (name) => `${BASE}/thumbs/${encodeURIComponent(name)}`;
const originalUrl = (name) => `${BASE}/originales/${encodeURIComponent(name)}`;

export default function Gallery() {
  const [selected, setSelected] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');

  const close = () => setSelected(-1);
  const move = (delta) => setSelected(i => (i + delta + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (selected < 0) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = selected >= 0 ? 'hidden' : '';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selected]);

  async function downloadAll() {
    setBusy(true);
    setProgress('Preparando archivo…');
    try {
      const zip = new JSZip();
      const folder = zip.folder('Rodri-2026');
      for (let i = 0; i < photos.length; i++) {
        setProgress(`Descargando ${i + 1} de ${photos.length}…`);
        const response = await fetch(originalUrl(photos[i].original));
        if (!response.ok) throw new Error(`No se pudo descargar ${photos[i].original}`);
        folder.file(photos[i].original, await response.blob());
      }
      setProgress('Armando ZIP…');
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'Rodri-2026-fotos.zip'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`No se pudo preparar la descarga completa. Revisá la configuración CORS de R2. Detalle: ${err.message}`);
    } finally { setBusy(false); setProgress(''); }
  }

  return <main className="page">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><Images size={19}/></span><span>rodri<span className="brand-light">.2026</span></span></a>
      <span className="top-count">{photos.length} fotografías</span>
    </header>
    <section className="intro">
      <div className="eyebrow">GALERÍA DE RECUERDOS</div>
      <h1>Un día para<br/><em>recordar.</em></h1>
      <p>Todas las fotos, en un solo lugar.</p>
      <button className="download-all" onClick={downloadAll} disabled={busy}>
        {busy ? <LoaderCircle className="spin" size={17}/> : <Download size={17}/>}
        {busy ? progress : 'Descargar todas'}
      </button>
    </section>
    <section className="gallery" aria-label="Galería de fotografías">
      {photos.map((photo, i) => <button className="photo" key={photo.original} onClick={() => setSelected(i)} aria-label={`Abrir foto ${i + 1}`}>
        <img src={thumbUrl(photo.thumb)} alt={`Fotografía ${i + 1}`} loading={i < 12 ? 'eager' : 'lazy'} />
        <span className="photo-number">{String(i + 1).padStart(2, '0')}</span>
      </button>)}
    </section>
    <footer>RODRI 2026 <span>·</span> {photos.length} MOMENTOS</footer>
    {selected >= 0 && <div className="viewer" onClick={close}>
      <button className="viewer-close" onClick={close} aria-label="Cerrar"><X/></button>
      <button className="viewer-arrow left" onClick={e => {e.stopPropagation(); move(-1)}} aria-label="Anterior"><ChevronLeft/></button>
      <div className="viewer-content" onClick={e => e.stopPropagation()}>
        <img src={originalUrl(photos[selected].original)} alt={photos[selected].original}/>
        <div className="viewer-bottom">
          <span>{String(selected + 1).padStart(2, '0')} / {photos.length}</span>
          <a href={originalUrl(photos[selected].original)} download={photos[selected].original}><Download size={16}/> Descargar original</a>
        </div>
      </div>
      <button className="viewer-arrow right" onClick={e => {e.stopPropagation(); move(1)}} aria-label="Siguiente"><ChevronRight/></button>
    </div>}
  </main>;
}
