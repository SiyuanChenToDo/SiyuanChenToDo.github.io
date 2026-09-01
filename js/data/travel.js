/* ============================================================
   travel.js — 旅行线索地图数据
   ------------------------------------------------------------
   怎么改：
   · 加城市：在 CITIES 里加一条 { id, name, lng, lat }（经纬度十进制），
     并在 js/dossier.js 的 DOSSIERS 里加同名 'travel-<id>' 案卷条目。
   · 改航线：ROUTE 是城市 id 按顺序排列的数组，虚线会按顺序依次连接。
   ============================================================ */

export const CITIES = [
  { id: 'dali',      name: '大理', lng: 100.23, lat: 25.59 },
  { id: 'lijiang',   name: '丽江', lng: 100.23, lat: 26.88 },
  { id: 'changsha',  name: '长沙', lng: 112.94, lat: 28.23 },
  { id: 'wuhan',     name: '武汉', lng: 114.30, lat: 30.59 },
  { id: 'changchun', name: '长春', lng: 125.32, lat: 43.90 },
  { id: 'zhengzhou', name: '郑州', lng: 113.62, lat: 34.75 },
  { id: 'shanghai',  name: '上海', lng: 121.47, lat: 31.23 },
  { id: 'hangzhou',  name: '杭州', lng: 120.15, lat: 30.28 },
  { id: 'shenzhen',  name: '深圳', lng: 114.06, lat: 22.54 },
];

/* 航线顺序（城市 id）：长春→郑州→武汉→长沙→大理→丽江→杭州→上海→深圳 */
export const ROUTE = [
  'changchun', 'zhengzhou', 'wuhan', 'changsha',
  'dali', 'lijiang', 'hangzhou', 'shanghai', 'shenzhen',
];
