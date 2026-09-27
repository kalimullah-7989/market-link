import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function createCustomPin(isActive, activeFarmers = 10) {
  const bgColor = isActive ? '#F65005' : '#3CB815';
  return L.divIcon({
    className: 'market-custom-marker',
    html: `
      <div style="
        position: relative;
        background: ${bgColor};
        color: #ffffff;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 2px solid #ffffff;
        cursor: pointer;
        transition: transform 0.25s ease, background 0.25s ease;
      ">
        <i class="fa fa-store" style="transform: rotate(45deg); font-size: 14px;"></i>
        <span style="
          position: absolute;
          top: -4px;
          right: -4px;
          background: #111827;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          border-radius: 10px;
          padding: 1px 4px;
          transform: rotate(45deg);
          border: 1px solid #ffffff;
        ">${activeFarmers}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
}

export default function MarketsMap({ 
  markets = [], 
  selectedMarketId, 
  onSelectMarket,
  focusCenter,
  focusZoom = 12 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersRef = useRef({});

  // 1. Initialize Leaflet Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter = focusCenter || (markets[0]?.coordinates 
      ? [markets[0].coordinates.lat, markets[0].coordinates.lng] 
      : [31.5204, 74.3587]); // Default Lahore

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: focusZoom || 12,
      scrollWheelZoom: true,
      zoomControl: true
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Layer group for managing dynamic markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Trigger invalidateSize to prevent partial/grey tiles
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 350);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle Focus Center / City Change
  useEffect(() => {
    if (!mapInstanceRef.current || !focusCenter) return;
    mapInstanceRef.current.flyTo(
      [focusCenter.lat, focusCenter.lng],
      focusZoom || 12,
      { duration: 1.2 }
    );
  }, [focusCenter, focusZoom]);

  // 3. Render / Update Markers dynamically when markets array changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    // Clear existing markers
    markersGroup.clearLayers();
    markersRef.current = {};

    if (!markets || markets.length === 0) return;

    const bounds = L.latLngBounds();

    markets.forEach((market) => {
      if (!market.coordinates || typeof market.coordinates.lat !== 'number') return;

      const isSelected = String(market.id) === String(selectedMarketId);
      const marker = L.marker([market.coordinates.lat, market.coordinates.lng], {
        icon: createCustomPin(isSelected, market.activeFarmers || 12)
      });

      const popupContent = `
        <div style="font-family: inherit; min-width: 220px; max-width: 280px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 12px;">
              ${market.city || 'Market'} • ${market.country || 'Pakistan'}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #15803d;">
              <i class="fa fa-tractor"></i> ${market.activeFarmers || 10} Stalls
            </span>
          </div>
          <h6 style="margin: 0 0 5px; font-weight: 800; color: #111827; font-size: 14px; line-height: 1.3;">
            ${market.name}
          </h6>
          <p style="margin: 0 0 6px; font-size: 12px; color: #4b5563; line-height: 1.35;">
            <i class="fa fa-map-marker-alt" style="color: #16a34a; margin-right: 4px;"></i> ${market.location}
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; margin-bottom: 8px; font-size: 11px;">
            <div style="color: #16a34a; font-weight: 600; margin-bottom: 2px;">
              <i class="fa fa-clock" style="margin-right: 4px;"></i> ${market.timings || '08:00 AM - 02:00 PM'}
            </div>
            <div style="color: #64748b;">
              <strong>Days:</strong> ${(market.operatingDays || []).join(', ') || 'Weekend'}
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <a 
              href="https://www.google.com/maps?q=${market.coordinates.lat},${market.coordinates.lng}" 
              target="_blank" 
              rel="noreferrer"
              style="flex: 1; text-align: center; font-size: 11px; background-color: #3CB815; color: #ffffff; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-weight: 600;"
            >
              <i class="fa fa-directions"></i> Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectMarket) {
          onSelectMarket(market.id);
        }
      });

      markersGroup.addLayer(marker);
      markersRef.current[market.id] = marker;
      bounds.extend([market.coordinates.lat, market.coordinates.lng]);
    });

    // Auto-fit if user hasn't explicitly focused on a city
    if (!focusCenter && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    setTimeout(() => map.invalidateSize(), 200);
  }, [markets]);

  // 4. Highlight and Pan to selected market
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedMarketId) return;

    const targetMarket = markets.find((m) => String(m.id) === String(selectedMarketId));
    if (!targetMarket || !targetMarket.coordinates) return;

    // Update pins styling
    markets.forEach((m) => {
      const marker = markersRef.current[m.id];
      if (marker) {
        marker.setIcon(createCustomPin(String(m.id) === String(selectedMarketId), m.activeFarmers));
      }
    });

    // Smoothly fly to target
    mapInstanceRef.current.flyTo(
      [targetMarket.coordinates.lat, targetMarket.coordinates.lng],
      15,
      { duration: 1.0 }
    );

    // Open popup
    const activeMarker = markersRef.current[selectedMarketId];
    if (activeMarker) {
      activeMarker.openPopup();
    }
  }, [selectedMarketId, markets]);

  return (
    <div 
      className="position-relative overflow-hidden rounded-3 shadow border"
      style={{ width: '100%', height: '540px', minHeight: '440px', background: '#f1f5f9' }}
      dir="ltr"
    >
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        dir="ltr"
      />
      {/* Legend Badge */}
      <div 
        className="position-absolute bottom-0 start-0 m-3 px-3 py-2 bg-white rounded-3 shadow-sm border"
        style={{ zIndex: 1000, fontSize: '11px', pointerEvents: 'none' }}
      >
        <span className="fw-bold text-dark me-2">
          <i className="fa fa-map-marked-alt text-success me-1"></i> OpenStreetMap Live Bazaars:
        </span>
        <span className="badge bg-success me-1">{markets.length} Active Bazaars</span>
      </div>
    </div>
  );
}
