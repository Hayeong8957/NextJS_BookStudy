import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Map from './Map';
import Markers from './Markers';
import useMap, { INITIAL_CENTER, INITIAL_ZOOM } from '../../hooks/useMap';
import useCurrentStore from '../../hooks/useCurrentStore';
import type { NaverMap } from '../../types/map';
import type { Coordinates } from '../../types/store';

const MapSection = () => {
  /** url query 로부터 initial zoom, center 값 설정 */
  const router = useRouter();
  /**
   * router.asPath === '/?zoom={}&lat={}&lng={}'
   * https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams
   */

  // router의 asPath값을 이용 => 화면을 새로고침했을 때, 뒤에 있는 query값을 나타냄
  // http://localhost:3000/?zoom=10&lat=37.5262411&lng=126.99289439 => /?zoom=10&lat=37.5262411&lng=126.99289439
  const query = useMemo(() => new URLSearchParams(router.asPath.slice(1)), []); // eslint-disable-line react-hooks/exhaustive-deps
  /**
   * url query parameter에 'zoom'이 있다면, 그 zoom값을 initialZoom으로 사용하고,
   * url query parametedr에 없다면, 기존의 INITIAL_ZOOM값을 그대로 사용한다.
   */
  const initialZoom = useMemo(
    () => (query.get('zoom') ? Number(query.get('zoom')) : INITIAL_ZOOM),
    [query],
  );

  /**
   * url query parameter에 lat, lng이 있다면, 그 값을 initialCenter로 사용하고,
   * 없다면 INITIAL_CENTER값을 그대로 사용한다.
   */
  const initialCenter = useMemo<Coordinates>(
    () =>
      query.get('lat') && query.get('lng')
        ? [Number(query.get('lat')), Number(query.get('lng'))]
        : INITIAL_CENTER,
    [query],
  );

  /** onLoadMap */
  const { initializeMap } = useMap();
  const { clearCurrentStore } = useCurrentStore();
  const onLoadMap = (map: NaverMap) => {
    initializeMap(map); // map을 전역상태로 관리
    naver.maps.Event.addListener(map, 'click', clearCurrentStore);
  };

  return (
    <>
      {/* onLoad -> 스크립트가 처음 불러올 때 한 번 실행 */}
      <Map
        onLoad={onLoadMap}
        initialZoom={initialZoom}
        initialCenter={initialCenter}
      />
      <Markers />
    </>
  );
};
export default MapSection;
