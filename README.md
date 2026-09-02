# 陈思远个人主页 · 侦探线索板（v3）

纯静态单页：毛玻璃导航 + Hero + 侦探线索板 + 生活切片 + 页脚。
核心玩法是**「案卷」多层详情面板**：板上的卡片只是 teaser，点击后逐层深入。
Three.js 氛围背景，无构建步骤，直接部署 GitHub Pages。

## 目录结构

```
homepage/
├── index.html      # 单页：导航 / Hero / 线索板（8 张卡）/ 生活切片 / 页脚
├── css/
│   └── style.css   # 全部样式：木板纹理、卡片、图钉、案卷面板、响应式
├── js/
│   ├── main.js     # 红线绘制、卡片拖拽/旋转/置顶、点击判定、debug 参数
│   ├── dossier.js  # 【数据核心】DOSSIERS 文案对象 + 案卷面板控制器
│   ├── map.js      # 旅行线索地图（SVG 渲染 + 城市图钉 + 航线虚线）
│   ├── bgm.js      # WebAudio 生成式背景音乐（无音频文件，默认关、点击开）
│   ├── bg3d.js     # Three.js 尘埃/雾/深处红线（importmap CDN，失败静默降级）
│   └── data/
│       ├── china-geo.json  # 中国省级 GeoJSON（DataV 下载的本地副本，568KB）
│       └── travel.js       # 城市列表 + 航线顺序（增删城市/改路线改这里）
├── assets/
│   └── photos/                # 生活/旅行照片（PIL 压缩：最长边 ≤1400px, jpg q80）
│   │   ├── shanghai-1~3.jpg   #   → travel-shanghai 案卷（街景/东方明珠/和平饭店）
│   │   ├── wuhan-1.jpg        #   → travel-wuhan 案卷（光谷夜景）
│   │   ├── dali-1.jpg         #   → travel-dali 案卷（洱海双廊）
│   │   ├── me-1.jpg, me-2.jpg #   → card-about 案卷（本人生活照）
│   │   └── cam-01~09.jpg      #   → life-camera 摄影案卷（cam-01 兼作拍立得封面）
│   └── photo.jpg              # 档案卡照片
│   └── figmac-framework.jpg   # FIG-MAC Fig.2 框架图（面板 L1 + 板卡缩略图）
│   └── figmac-pipeline.jpg    # FIG-MAC Fig.1 ASHG 流程图（面板 L1）
│   └── memescope-framework.jpg# MemeScope Fig.2 框架图（面板 L1 + 板卡缩略图）
│   └── memescope-case.jpg     # MemeScope Fig.1 语用漂移案例（面板 L1）
│   └── bnhypo-framework.jpg   # BnHypo 三段式框架图（面板 L1 + 板卡缩略图）
│   └── bnhypo-concept.jpg     # BnHypo 概念图（面板 L1）
│   └── raicom-medal.jpg       # 睿抗金奖牌现场照（荣誉案卷）
│   └── robot-dog.jpg          # 四足机器人现场照（其他研究 L2 + 板卡缩略图）
└── README.md
```

Three.js 通过 importmap 从 CDN 引入（`three@0.160.0`，unpkg，已 pin 版本），无需 npm。

## 照片管理（assets/photos/）

- 所有照片经 PIL 压缩（最长边 ≤1400px、JPEG q80、单张 ≤350KB），均带 `loading="lazy"`
- **换/加照片**：把压缩后的 jpg 放进 `assets/photos/`，然后改 `js/dossier.js`
  对应条目里的 `<img class="zoomable" src="assets/photos/xxx.jpg">` 即可；
  城市案卷在 `travel-<id>` 条目，摄影集在 `life-camera` 条目，本人照在 `card-about` 条目
- 案卷里所有 `img.zoomable` 照片支持**点击放大**（lightbox 全屏查看，
  点击任意处或 ESC 关闭；ESC 优先关大图再关案卷）
- 拍立得封面：`index.html` 里把 `.polaroid-img` 占位 div 换成
  `<img class="polaroid-photo" src="...">`（目前仅摄影拍立得用了真实照片）

## 案卷面板：层级设计

- **L0**：板上的卡片（标题 + 2-3 条要点）
- **L1**：单击卡片打开面板——概述 + 红色「案卷」印戳 + 面包屑 `线索板 › FIG-MAC`；
  背景变暗模糊；ESC / 点击 backdrop / 右上角 × 关闭；缩放淡入动画
- **L2**：面板底部的「深入线索」chip，点击切换到该要点的深入介绍，
  面包屑变为 `线索板 › FIG-MAC › 细粒度灵感图谱`，出现「返回上一级」
- 点击与拖拽的区分：指针位移 < 5px 才算点击
- 生活切片的拍立得也接入同一系统（L1 = 爱好介绍 + 大图占位）

**改文案只需要改 `js/dossier.js` 里的 `DOSSIERS` 对象**：

```js
'card-figmac': {
  title: 'FIG-MAC',
  subtitle: 'NLPCC Oral (CCF-C) · ...',
  body: `<p>支持简单 HTML：p / ul / li / strong / a / code</p>`,
  children: [
    { id: 'fig', title: '细粒度灵感图谱 FIG', body: `...` },  // L2
  ],
}
```

新增卡片：HTML 里加 `<article class="card" id="card-xxx">`，
`DOSSIERS` 里加同名条目即可。拍立得用 `data-dossier="life-xxx"` 关联。

## 交互一览

- 卡片拖拽（红线实时跟随、图钉晃动动画、木板边界钳制）
- 卡片底部旋转手柄：按住拖动旋转，Shift 吸附 15°
- 点击置顶（z-index）、hover 摆正放大 + 相连红线高亮
- 红线锚在图钉上，随拖拽/旋转正确跟随，二次贝塞尔下垂
- 拍立得 hover 飘动动画
- 导航滚动加深、平滑锚点
- 移动端（<768px）：卡片纵向流式，隐藏红线/旋转手柄，点按照常开面板（面板全屏）

## 生活切片：足迹地图模块

### 足迹地图 · CLUE MAP

- SVG 渲染中国地图（本地 `js/data/china-geo.json`，无运行时外部请求），
  等距圆柱投影 + 0.85 纬度修正，暗色旧地图风格
- 9 个城市红色图钉（复用板卡图钉视觉），点击打开该城市案卷
  （`DOSSIERS` 里的 `travel-<id>` 条目，各含 3 个照片占位框）
- 红色虚线航线按顺序连接，带流动动画（stroke-dashoffset）
- **改城市/航线**：编辑 `js/data/travel.js`——`CITIES` 数组加
  `{ id, name, lng, lat }`，`ROUTE` 数组调整连接顺序；城市文案在
  `js/dossier.js` 里加 `travel-<id>` 条目

## 背景音乐（WebAudio 生成式）

- `js/bgm.js`：纯 WebAudio 合成的循环 lo-fi/ambient 氛围音乐，**不依赖任何音频文件**
  - 和弦垫音：3 个正弦振荡器（Am–F–C–G 进行，频率缓动滑音）+ 低通滤波慢扫 + delay 模拟空间感
  - 旋律：A 小调五声音阶随机漫步，偶发单音 + 长衰减，带 delay 尾音
  - 底噪：循环滤波噪声模拟很轻的雨声
- 浏览器自动播放策略：**默认关闭**，点击右下角「♪ 背景音乐」浮动按钮才创建/恢复
  AudioContext（在点击手势内调用 `resume`）；再点停止（淡出后挂起上下文）
- 播放中按钮反馈：迷你黑胶图标旋转 + 红色脉动光圈
- AudioContext 不可用时按钮静默不出现，不影响其他模块

## 调试参数（URL query）

| 参数 | 作用 |
|---|---|
| `?dossier=card-figmac` | 加载后自动打开该卡片的 L1 面板 |
| `?dossier=card-figmac/fig` | 自动深入到 L2 |
| `?dossier=travel-dali` | 自动打开城市案卷 |
| `?jump=board` / `?jump=life` | 无动画直达锚点 |
| `?flat=1` | 压扁 Hero 区高度（截图调试用） |

## 本地预览

```bash
cd homepage
python -m http.server 8000
# 打开 http://localhost:8000
```

> 必须走 HTTP（不能直接双击 html），否则浏览器因 CORS 拦截 ES module。

## 部署到 GitHub Pages

目标仓库 `SiyuanChenToDo/siyuanchentodo.github.io`，Pages 发布 `main` 分支根目录：

```bash
cd homepage
git init
git add .
git commit -m "Homepage: clue board with dossier panels"
git branch -M main
git remote add origin git@github.com:SiyuanChenToDo/siyuanchentodo.github.io.git
git push -u origin main
```

约 1 分钟后访问 <https://siyuanchentodo.github.io>。后续更新：`git add -A && git commit -m "update" && git push`。

## 待用户补充

- [ ] 简历 PDF：Hero 按钮现为 `#` 占位（可放 `assets/resume.pdf` 后改链接）
- [ ] 运动/阅读/音乐 3 张拍立得仍是占位（无合适素材），替换方式见「照片管理」
- [ ] 城市案卷空缺位：大理/武汉各剩 2 个占位框，长春/郑州/长沙/丽江/杭州/深圳仍为纯占位
- [ ] 各爱好案卷（`js/dossier.js` 中 `life-*` 条目）的大图与正文
- [ ] 「联络线人」案卷里可补充社交链接
- [ ] 荣誉案卷如需补充奖项
