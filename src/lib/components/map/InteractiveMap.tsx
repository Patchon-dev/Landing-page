import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { getCountryAtPosition, getMapCountry } from './countries';

const fallback: L.LatLngTuple = [38.7223, -9.1393];

/** One marker per map; country detection never overwrites a user's selection. */
export default function InteractiveMap() {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState({ key: 'mapLoading', place: '' });
  const [coordinates, setCoordinates] = useState<L.LatLngTuple>(fallback);

  useEffect(() => {
    if (!container.current) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let disposed = false;
    let selected = false;
    let selectionController: AbortController | undefined;
    const map = L.map(container.current).setView(fallback, 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    const icon = L.divIcon({
      className: 'map-custom-marker',
      html: '<span class="map-pin"><span></span></span>',
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      popupAnchor: [0, -42],
    });
    const marker = L.marker(fallback, { icon, title: t('mapMarker'), alt: t('mapMarker') }).addTo(map);
    const popup = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = t('mapCoordinates');
    const values = document.createElement('div');
    popup.append(heading, values);
    marker.bindPopup(popup);

    function move(position: L.LatLngTuple, open = false) {
      marker.setLatLng(position);
      values.textContent = `${t('mapLatitude')}: ${position[0].toFixed(6)}° · ${t('mapLongitude')}: ${position[1].toFixed(6)}°`;
      setCoordinates(position);
      if (open) marker.openPopup();
    }
    move(fallback);
    map.on('click', (event: L.LeafletMouseEvent) => {
      selected = true;
      const point = event.latlng.wrap();
      move([point.lat, point.lng], true);
      void updateSelectedCountry(point.lat, point.lng);
    });
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container.current);

    async function updateSelectedCountry(lat: number, lng: number) {
      selectionController?.abort();
      const request = new AbortController();
      selectionController = request;
      const requestTimeout = window.setTimeout(() => request.abort(), 12000);
      setStatus({ key: 'mapSelectionLoading', place: '' });
      try {
        const country = await getCountryAtPosition(lat, lng, request.signal);
        if (disposed || selectionController !== request) return;
        setStatus(country
          ? { key: country.capital ? 'mapLocated' : 'mapCountryOnly', place: country.capital ? `${country.capital}, ${country.name}` : country.name }
          : { key: 'mapSelectionUnknown', place: '' });
      } catch {
        if (!disposed && selectionController === request) setStatus({ key: 'mapSelectionError', place: '' });
      } finally {
        window.clearTimeout(requestTimeout);
      }
    }

    async function locateCapital() {
      try {
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        if (!response.ok) throw new Error('Country lookup failed');
        const location = await response.json();
        const country = getMapCountry(location.country_code);
        if (location.error || !country?.capital) {
          throw new Error('Country unavailable');
        }
        const query = new URLSearchParams({ q: `${country.capital}, ${country.name}`, countrycode: country.code.toLowerCase(), limit: '1' });
        const result = await fetch(`https://photon.komoot.io/api/?${query}`, { signal: controller.signal });
        if (!result.ok) throw new Error('Capital lookup failed');
        const data = await result.json();
        const feature = data.features?.[0];
        const [lng, lat] = feature?.geometry?.coordinates ?? [];
        if (feature?.geometry?.type !== 'Point' || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
          throw new Error('Capital coordinates unavailable');
        }
        if (disposed || selected) return;
        setStatus({ key: 'mapLocated', place: `${country.capital}, ${country.name}` });
        move([lat, lng]);
        map.setView([lat, lng], 6);
      } catch {
        if (!disposed && !selected) setStatus({ key: 'mapFallback', place: '' });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void locateCapital();
    return () => {
      disposed = true;
      controller.abort();
      selectionController?.abort();
      window.clearTimeout(timeout);
      observer.disconnect();
      map.remove();
    };
  }, [t]);

  return (
    <div>
      <div ref={container} className="interactive-map" role="region" aria-label={t('mapInteractive')} />
      <div className="flex flex-wrap justify-between gap-3 border-t border-site-border bg-site-panel p-4 text-xs">
        <p role="status" className="text-site-muted">{t(status.key, { place: status.place })}</p>
        <output aria-live="polite" className="font-mono text-site-accent">
          {coordinates[0].toFixed(6)}°, {coordinates[1].toFixed(6)}°
        </output>
      </div>
    </div>
  );
}
