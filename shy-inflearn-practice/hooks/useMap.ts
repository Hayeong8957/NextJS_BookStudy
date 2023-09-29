import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import type { Coordinates } from '../types/store';
import type { NaverMap } from '../types/map';

export const INITIAL_CENTER: Coordinates = [37.5262411, 126.99289439];
export const INITIAL_ZOOM = 10;

export const MAP_KEY = '/map';

const useMap = () => {
  const { data: map } = useSWR(MAP_KEY);

  const initializeMap = useCallback((map: NaverMap) => {
    mutate(MAP_KEY, map);
  }, []);

  /**
   * initial center와 initial zoom으로 변경하는 함수,
   * morph라는 map의 api를 사용 => 부드럽게 화면 전환
   */
  const resetMapOptions = useCallback(() => {
    /** https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html#morph__anchor */
    map.morph(new naver.maps.LatLng(...INITIAL_CENTER), INITIAL_ZOOM);
  }, [map]);

  /**
   * 네이버 지도 객체인 getCenter, getZoom 이용해서 현재 지도 중심좌표와 Zoom level을 리턴
   */
  const getMapOptions = useCallback(() => {
    const mapCenter = map.getCenter();
    const center: Coordinates = [mapCenter.lat(), mapCenter.lng()];
    const zoom = map.getZoom();

    return { center, zoom };
  }, [map]);

  return {
    initializeMap,
    resetMapOptions,
    getMapOptions,
  };
};
export default useMap;
