import React from 'react';
import useSWR from 'swr';
import { MAP_KEY } from '@/hooks/useMap';
import { STORE_KEY } from '@/hooks/useStores';
import useCurrentStore, { CURRENT_STORE_KEY } from '@/hooks/useCurrentStore';
import type { ImageIcon, NaverMap } from '@/types/map';
import type { Store } from '@/types/store';
import Marker from './Marker';

const Markers = () => {
  // 지금까지 저장해놓은 전역상태
  const { data: map } = useSWR<NaverMap>(MAP_KEY);
  const { data: stores } = useSWR<Store[]>(STORE_KEY);

  const { data: currentStore } = useSWR<Store>(CURRENT_STORE_KEY);
  const { setCurrentStore, clearCurrentStore } = useCurrentStore();

  if (!map || !stores) return null;
  return (
    <>
      {stores.map((store) => {
        return (
          <Marker
            map={map} // 마커를 그릴 대상 map
            coordinates={store.coordinates} // 마커를 그릴 위경도
            icon={generateStoreMarkerIcon(store.season, false)}
            onClick={() => {
              setCurrentStore(store); // 방금 누른 매장 지정
            }}
            key={store.nid}
          />
        );
      })}
      {currentStore && (
        <Marker
          map={map}
          coordinates={currentStore.coordinates}
          icon={generateStoreMarkerIcon(currentStore.season, true)} // 몇번째인지 넘겨줌
          onClick={clearCurrentStore}
          key={currentStore.nid}
        />
      )}
    </>
  );
};
export default Markers;

/* 현재 Markers.png는 너비가 54px이고, 높이가 64px인 하나의 아이콘이 총 13개 붙어있음 */
const MARKER_HEIGHT = 64;
const MARKER_WIDTH = 54;
const NUMBER_OF_MARKER = 13;
const SCALE = 2 / 3;

/* 아이콘은 너무 크기에 2/3크기로 지도에 표시하고 싶음 */
const SCALED_MARKER_WIDTH = MARKER_WIDTH * SCALE;
const SCALED_MARKER_HEIGHT = MARKER_HEIGHT * SCALE;

/** https://navermaps.github.io/maps.js.ncp/docs/tutorial-8-marker-retina-sprite.example.html */
/**
 *
 * @param markerIndex 몇 번째 아이콘 사용할 것인지
 * @param isSelected 선택한 아이콘인지
 * 각각의 매장마다 적절한 아이콘을 얻는 함수,
 * 스프라이트 이미지에서 적절한 이미지를 하나 뽑아 아이콘 사용,
 * 네이버 지도의 마커를 스트라이프 이미지를 사용해 뽑아낼 때 필요한 props들
 */
export function generateStoreMarkerIcon(
  markerIndex: number,
  isSelected: boolean,
): ImageIcon {
  return {
    url: isSelected ? 'images/markers-selected.png' : 'images/markers.png',
    size: new naver.maps.Size(SCALED_MARKER_WIDTH, SCALED_MARKER_HEIGHT),
    origin: new naver.maps.Point(SCALED_MARKER_WIDTH * markerIndex, 0), // 스프라이트에서 몇번째 아이콘을 사용할 것인지에 대한 옵션
    scaledSize: new naver.maps.Size( // 원본 이미지를 scale할 때 사용 -> 현재 원본 이미지는 우리가 원하는 2/3크기가 아니기에 스프라이트 이미지의 전체 크기를 정해줌
      SCALED_MARKER_WIDTH * NUMBER_OF_MARKER,
      SCALED_MARKER_HEIGHT,
    ),
  };
}
