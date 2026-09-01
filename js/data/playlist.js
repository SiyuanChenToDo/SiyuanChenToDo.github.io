/* ============================================================
   playlist.js — 深夜电台歌单
   ------------------------------------------------------------
   怎么加歌：
   1. 把 mp3 丢进 assets/music/，文件名约定：歌名-歌手.mp3
      例如 assets/music/成都-赵雷.mp3
   2. 在下面加一条 { title, artist, src, note }。
   · src 留空字符串 '' 或文件不存在时，该曲目自动置灰显示「音频待补充」
     并在自动连播时被跳过。
   · note 是可选的侦探笔记式一句话，显示在曲目下方。
   ============================================================ */

export const PLAYLIST = [
  { title: '成都',             artist: '赵雷',   src: 'assets/music/成都-赵雷.mp3',             note: '深夜监听记录 001：单曲循环次数异常。' },
  { title: '南方姑娘',         artist: '赵雷',   src: 'assets/music/南方姑娘-赵雷.mp3',         note: '他听到前奏时会停下手里的事。' },
  { title: '画',               artist: '赵雷',   src: 'assets/music/画-赵雷.mp3',               note: '' },
  { title: '理想',             artist: '赵雷',   src: 'assets/music/理想-赵雷.mp3',             note: '' },
  { title: '鼓楼',             artist: '赵雷',   src: 'assets/music/鼓楼-赵雷.mp3',             note: '' },
  { title: '我记得',           artist: '赵雷',   src: 'assets/music/我记得-赵雷.mp3',           note: '' },
  { title: '吉姆餐厅',         artist: '赵雷',   src: 'assets/music/吉姆餐厅-赵雷.mp3',         note: '' },
  { title: '少年锦时',         artist: '赵雷',   src: 'assets/music/少年锦时-赵雷.mp3',         note: '' },
  { title: '三十岁的女人',     artist: '赵雷',   src: 'assets/music/三十岁的女人-赵雷.mp3',     note: '' },
  { title: '阿刁',             artist: '赵雷',   src: 'assets/music/阿刁-赵雷.mp3',             note: '' },
  /* —— 其他热门（占位，src 留空，丢入 mp3 后填上路径即可）—— */
  { title: '晴天',             artist: '周杰伦', src: '', note: '' },
  { title: '富士山下',         artist: '陈奕迅', src: '', note: '' },
  { title: '杀死那个石家庄人', artist: '万能青年旅店', src: '', note: '' },
];
