# 세종대 주변 음식점

## 1. [rawData.json](##rawData.json)

- "서울시 일반음식점 인허가 정보" 서울시에 등록된 음식점(5월 11일 기준)
- 519,600개
- https://data.seoul.go.kr/dataList/OA-16094/S/1/datasetView.do

## 2. coordinates.json

- "세종대 주변"의 음식점 검색 기준 좌표
- 151개

## 3. [restaurants.json](##restaurants.json)

- **RestaurantCollector.jsx**
- Google Maps의 Nearby Search API를 사용, coordinates.json의 좌표 기준 반경 50m 이내의 모든 "restaurant"로 등록된 장소를 식별
- 672개

## 4. [availableData.json](##availableData.json)

- **RestaurantFiltering.jsx**
- [rawData.json](##rawData.json)에서 영업상태가 "영업"이고, 주소가 "서울특별시 광진구"인 음식점들만 필터링
- 4,287개

## 5. restaurantsIdentified.json

- **RestaurantFiltering.jsx**
- [restaurants.json](##restaurants.json)의 "name" 과 [availableData.json](##availableData.json)의 "bplcnm"(사업장명)을 비교하여

  "name", "bplcnm"이 일치(포함)하는 음식점을 필터링 후

  위생업태명(e.g. 한식, 일식, ...)을
  [restaurants.json](##restaurants.json)에 "majorTag"로 추가

- ```json
    e.g.

    ### restaurants.json
    {
    "id": "ChIJwVFs2sSkfDURnyTGSSXzdro",
    "name": "세종원",
    "location": {
      "lat": 37.5480781,
      "lng": 127.07150339999998
    },
    "rating": 4.3,
    "address": "서울특별시 광진구 군자동 361-32",
    "majorTag": "중국식"
    },

    ### availableData.json
    {
    "lastmodts": "2025-04-15 13:57:58",
    "dtlstatenm": "영업",
    "totepnum": null,
    "wmeipcnt": null,
    "bplcnm": "앨리스핫도그",
  	...
    "trdstatenm": "영업/정상",
    "sitewhladdr": "서울특별시 광진구 군자동 360-20 광진 동양파라곤 1단지",
    "uptaenm": "한식",
    },

  ```

- 332개

## 6. restaurantsDeleted.json

- deletedRestaurant.html
- [restaurants.json](##restaurants.json) 에서 제외된 음식점
- 340개
