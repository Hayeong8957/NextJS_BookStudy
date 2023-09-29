import { useEffect } from 'react';
import type { Marker } from '@/types/map';

const Marker = ({ map, coordinates, icon, onClick }: Marker): null => {
  useEffect(() => {
    let marker: naver.maps.Marker | null = null;

    // 마운트시 맵이 있다면, naver.maps의 Marker class를 이용하여 새로운 마커 인스턴스를 생성
    if (map) {
      /** https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html */
      marker = new naver.maps.Marker({
        map: map, // 대상 지도
        position: new naver.maps.LatLng(...coordinates), // 마커 표시할 위치
        icon,
      });
    }

    if (onClick) {
      // onClick함수가 있을 경우
      naver.maps.Event.addListener(marker, 'click', onClick);
      // naver에 addListener API를 활용하여 마커를 클릭했을 때 prop으로 전달한 onClick함수가 실행
    }

    return () => {
      marker?.setMap(null);
    };
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default Marker;
