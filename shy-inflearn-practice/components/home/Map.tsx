import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Coordinates } from '@/types/store';
import { NaverMap } from '@/types/map';
import { INITIAL_CENTER, INITIAL_ZOOM } from '@/hooks/useMap';
import styles from '@/styles/map.module.scss';

type Props = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
};

const Map = ({
  mapId = 'map',
  initialCenter = INITIAL_CENTER,
  initialZoom = INITIAL_ZOOM,
  onLoad,
}: Props) => {
  const mapRef = useRef<NaverMap | null>(null);

  const initializeMap = () => {
    /**
     * 지도의 중심, 지도의 줌, 어떤 컨트롤이 필요한지
     */
    const mapOptions = {
      center: new window.naver.maps.LatLng(...initialCenter),
      zoom: initialZoom,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };

    /** https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html */
    const map = new window.naver.maps.Map(mapId, mapOptions);
    // 네이버 Map instance 생성

    mapRef.current = map;

    // 만약 prop으로 onLoad함수가 주어질 때, load가 완료됐다고 부모컴포넌트에 알림
    if (onLoad) {
      onLoad(map);
    }
  };

  useEffect(() => {
    // Map컴포넌트가 unmount됐을 때 해당 map instance를 모두 파괴
    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  return (
    <>
      <Script
        strategy='afterInteractive'
        type='text/javascript'
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
        onReady={initializeMap}
      />
      {/* mapid를 공유하는 div 태그에 네이버 지도 ui가 삽입됨 */}
      <div id={mapId} className={styles.map} />
    </>
  );
};

export default Map;
