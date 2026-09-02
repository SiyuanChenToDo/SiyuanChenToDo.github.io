/* ============================================================
   dossier.js — 「案卷」多层详情面板系统
   DOSSIERS 数据对象：板上卡片与生活切片的所有展开内容。
   结构：{ title, subtitle, body(HTML), children: [{ id, title, body }] }
   层级最多 3 层：卡片(L0) → 面板概述(L1) → 要点深入(L2)
   ============================================================ */

export const DOSSIERS = {
  /* ---------------- 关于我 ---------------- */
  'card-about': {
    title: '关于我',
    subtitle: '人物档案 · PROFILE',
    body: `
      <p>陈思远，一个把生活当案子办的观察者。习惯在随身本子上记录线索：
      一束光的角度、一段对话的弦外之音、一双跑鞋的磨损程度。</p>
      <ul>
        <li>现居：武汉 ⇄ 上海，行踪随项目与季节移动</li>
        <li>日常装备：相机、跑鞋、降噪耳机、一杯去冰美式</li>
        <li>兴趣清单：摄影 / 跑步 / 旅行 / 阅读 / 音乐（详见「生活切片」）</li>
      </ul>
      <div class="dossier-img-grid two">
        <img class="zoomable" src="assets/photos/me-1.jpg" alt="与小狗合影" loading="lazy">
        <img class="zoomable" src="assets/photos/me-2.jpg" alt="民族服饰写真" loading="lazy">
      </div>
      <p class="fig-cap">证物 · 左：遭遇一只无法拒绝的小狗；右：一次民族服饰体验</p>
    `,
  },

  /* ---------------- FIG-MAC ---------------- */
  'card-figmac': {
    title: 'FIG-MAC',
    subtitle: 'NLPCC Oral (CCF-C) · 共同一作第一 · 自动化科学猜想生成',
    body: `
      <p><strong>案情：</strong>自动化科学猜想生成（ASHG）想让机器像科学家一样提问，
      但现场有三处悬而未决的难点：</p>
      <ul>
        <li>细粒度知识表示不足——传统文献图谱只到「论文」粒度，看不到灵感如何跨论文流动</li>
        <li>知识演化不可追溯——生成的猜想说不清「从哪来、往哪去」</li>
        <li>缺少角色协作与落地闭环——单一模型既当选手又当裁判</li>
      </ul>
      <p><strong>侦破手段：</strong>FIG-MAC 框架——细粒度灵感图谱（FIG）刻画灵感来源，
      混合推理生成可溯源的猜想路径，七角色多智能体世界模型完成协作闭环。</p>
      <p><strong>战果：</strong>灵感源多样性 <strong>+26.9%</strong>，猜想新颖度 <strong>+31.8%</strong>。</p>
      <div class="rq-block">
        <p class="rq-title">研究问题 · RESEARCH QUESTIONS</p>
        <ol>
          <li><strong>R1</strong> 粗粒度文献表征为何限制大模型生成跨领域创新科学假设？如何构建细粒度知识结构，追踪知识演化路径？</li>
          <li><strong>R2</strong> 单 LLM 缺少科研分工式推理——多智能体协作能否同时提升假设的新颖性、严谨性与可验证性？</li>
          <li><strong>R3</strong> 图推理 + 稠密检索的混合推理，是否比单一检索 / 图方法生成更多跨域创新猜想？</li>
        </ol>
      </div>
      <img class="dossier-fig" src="assets/figmac-framework.jpg" alt="FIG-MAC 框架图" loading="lazy">
      <p class="fig-cap">Fig.2 · FIG-MAC 框架总览：细粒度灵感图谱 → 本体引导混合推理 → 多智能体协作</p>
      <img class="dossier-fig" src="assets/figmac-pipeline.jpg" alt="ASHG 流程图" loading="lazy">
      <p class="fig-cap">Fig.1 · 自动化科学猜想生成（ASHG）流程：文献综述 → 猜想生成 → 实验验证 → 评估迭代</p>
    `,
    children: [
      {
        id: 'fig',
        title: '细粒度灵感图谱 FIG',
        body: `
          <p>从约 <strong>2 万篇文献</strong>中抽取
          <strong>Paper – ResearchQuestion – Solution</strong> 三级语义单元，
          把「哪篇论文的哪个方法启发了哪个问题」编码进图谱结构。</p>
          <p>图谱由此能显式刻画跨论文的启发关系——灵感不再是黑箱，
          而是图上一条可以被追踪的边。</p>
        `,
      },
      {
        id: 'hybrid',
        title: '骨架-血肉混合推理',
        body: `
          <p>双轨融合的猜想生成：</p>
          <ul>
            <li><strong>骨架：</strong>RGCN 动态链路预测，在灵感图谱上推断潜在的跨域连边，
            搭起猜想的逻辑骨架</li>
            <li><strong>血肉：</strong>向量检索做语义增强，为骨架填充具体、可读的研究内容</li>
          </ul>
          <p>输出的是一条<strong>可溯源的猜想演化路径</strong>：
          每一步灵感来自哪篇文献、哪个语义单元，都有据可查。</p>
        `,
      },
      {
        id: 'mac',
        title: '七角色多智能体世界模型',
        body: `
          <p>七类专业角色智能体协同工作——从提出假设、互相质疑到实验设计，
          构成「<strong>生成 — 筛选 — 验证</strong>」的完整闭环。</p>
          <p>多智能体不是简单投票，而是让每个角色带着各自的评价标准进入讨论，
          把「这个猜想靠谱吗」拆成七个维度的交叉质询。</p>
        `,
      },
    ],
  },

  /* ---------------- 油菜基因大模型 ---------------- */
  'card-rapeseed': {
    title: '油菜基因大模型',
    subtitle: '湖北省大创结题优秀 · EMNLP Findings (CCF-B) · 转投 ACL 2027 · 第一负责人',
    body: `
      <p><strong>案情：</strong>油菜功能基因研究散落在上万篇文献里，
      育种专家想知道「这个基因可能影响哪个性状」，但人工梳理如大海捞针。</p>
      <p><strong>侦破手段：</strong>用 BERT 从文献中抽取生物实体关系建知识图谱，
      再以零训练的启发式推理在图上做机制级推断，
      最后交给对抗迭代的多智能体闭环互相攻击、修正、收敛。</p>
      <p><strong>状态：</strong>省大创结题优秀，论文转投 ACL 2027。</p>
      <div class="rq-block">
        <p class="rq-title">研究问题 · RESEARCH QUESTIONS</p>
        <ol>
          <li><strong>R1</strong> 油菜基因组碎片化、异质的知识如何统一结构化，支撑基因-性状机理推理？</li>
          <li><strong>R2</strong> 标注稀缺的作物领域，能否无需监督训练、仅靠领域生物学先验做知识图谱路径推理？</li>
          <li><strong>R3</strong> 对抗式多智能体迭代评审，能否生成具备机理解释、可实验验证的作物功能基因假设？</li>
        </ol>
      </div>
      <img class="dossier-fig" src="assets/bnhypo-framework.jpg" alt="BnHypo 框架图" loading="lazy">
      <p class="fig-cap">框架总览 · BnKG 建图 → 零训练机制推理 → 对抗式假设生成</p>
      <img class="dossier-fig" src="assets/bnhypo-concept.jpg" alt="BnHypo 概念图" loading="lazy">
      <p class="fig-cap">概念图 · 从碎片化生物证据到可检验的科学假设</p>
    `,
    children: [
      {
        id: 'kg',
        title: 'BERT 生物知识图谱',
        body: `
          <p>基于 BERT 的实体关系抽取管线，从约 <strong>3 万篇文献</strong>中
          挖掘基因、性状、通路、代谢物等实体及其关系，
          构建面向油菜的功能基因知识图谱。</p>
        `,
      },
      {
        id: 'mr',
        title: 'Mechanism Reasoner',
        body: `
          <p>三类机制级推理模式：</p>
          <ul>
            <li><strong>功能相似性</strong>——功能相近的基因可能参与相似表型</li>
            <li><strong>通路共成员</strong>——同一条通路上的成员往往共进退</li>
            <li><strong>代谢调控</strong>——沿代谢调控关系顺藤摸瓜</li>
          </ul>
          <p>把「猜基因」升级为「按机制推理」。</p>
        `,
      },
      {
        id: 'zero',
        title: '零训练启发式推理框架',
        body: `
          <p>不训练任何新模型：把图谱结构特征与预训练模型的语义表示
          组合成启发式打分规则，直接在图上完成候选基因排序。
          好处是<strong>即插即用、全程可解释</strong>，每一步分数都能对应到具体机制。</p>
        `,
      },
      {
        id: 'adv',
        title: '对抗迭代多智能体闭环',
        body: `
          <p>推理链路：<strong>竞争 → 攻击 → 修正 → 收敛</strong>。</p>
          <ul>
            <li>双生成器提出互斥假设，逼彼此亮出证据</li>
            <li>五级证据审计，逐条核查推理依据</li>
            <li>去中心化自 RAG，各智能体按需自取文献证据</li>
          </ul>
          <p>像一场有纪律的庭审：假设必须活着穿过交叉质询才算数。</p>
        `,
      },
    ],
  },

  /* ---------------- MemeScope ---------------- */
  'card-memescope': {
    title: 'MemeScope',
    subtitle: 'EMNLP Main (CCF-B) · 第一负责人 · 表情包语用推理',
    body: `
      <p><strong>案情：</strong>表情包的灵魂不在画面，而在「言外之意」。
      多模态大模型真的懂反讽、夸张、自嘲吗？还是只是背下了答案？</p>
      <p><strong>侦破手段：</strong>先建一个带细粒度语用标注的探针数据集，
      再冻结模型逐层探测其内部表示，最后用隐藏态修补做因果定位。</p>
      <p><strong>意外收获：</strong>发现「<strong>语用漂移</strong>」现象——
      模型深层的语用判断会悄悄偏离字面事实，像证人改了口供。</p>
      <div class="rq-block">
        <p class="rq-title">研究问题 · RESEARCH QUESTIONS</p>
        <ol>
          <li><strong>R1</strong> LVLM 能否真正理解反讽、双关这类隐语用机制，还是仅依赖表层图文关联？</li>
          <li><strong>R2</strong> 三层认知（视觉定位 → 跨模态对齐 → 语用推理）分别出现在哪些 Transformer 层？</li>
          <li><strong>R3</strong> 语用推理表征是否因果影响输出？是否存在语用漂移？</li>
          <li><strong>R4</strong> 模型是否过度依赖文本线索、弱化图像约束，从而导致推理偏差？</li>
        </ol>
      </div>
      <img class="dossier-fig" src="assets/memescope-framework.jpg" alt="MemeScope 框架图" loading="lazy">
      <p class="fig-cap">Fig.2 · 逐层探测（相关性）+ 隐藏态修补（因果性）双管线</p>
      <img class="dossier-fig" src="assets/memescope-case.jpg" alt="语用漂移案例" loading="lazy">
      <p class="fig-cap">Fig.1 · 语用漂移实案：「CATTERFLY」双关在网络深层被指数级稀释</p>
    `,
    children: [
      {
        id: 'data',
        title: '语用探针数据集',
        body: `
          <ul>
            <li><strong>1781 条</strong>样本，覆盖 <strong>8 类语用机制</strong>（反讽、夸张、自嘲等）</li>
            <li>三段式标注流程，保证标注一致性</li>
            <li>每条配「事实 / 反事实」双文本，专门用来戳穿模型是否真的理解言外之意</li>
          </ul>
        `,
      },
      {
        id: 'probe',
        title: '逐层探测',
        body: `
          <p>冻结 LVLM 不动摇它一分一毫，在每一层的隐藏态上训练<strong>线性探针</strong>，
          解码出模型的「三层认知」：画面识别 → 情感唤起 → 语用判断。
          由此看清语用信息在网络深处是如何逐层成型的。</p>
        `,
      },
      {
        id: 'patch',
        title: '隐藏态修补',
        body: `
          <p>把事实样本与反事实样本的隐藏态互换（activation patching），
          用 <strong>TE / IE / 归一化因果比</strong>三组指标定量回答：
          哪一层、哪些神经元对语用判断起因果作用——从「相关」追到「因果」。</p>
        `,
      },
    ],
  },

  /* ---------------- 其他研究 ---------------- */
  'card-other': {
    title: '其他研究',
    subtitle: '两条支线案情',
    body: `
      <p>主线之外的两条支线：一条教机器读懂漫画的「言下之意」，
      一条让四足机器人在变电站里自己巡逻。点开下面的线索标签查看详情。</p>
    `,
    children: [
      {
        id: 'comic',
        title: '漫画阅读理解',
        body: `
          <p>多格漫画的深层语义理解：需要同时读懂画面、对白与格间留白。</p>
          <ul>
            <li>提出 <strong>MSCE / SCPM / PCL</strong> 等模块与多任务联合学习框架</li>
            <li>深层语义理解准确率 <strong>33.26% → 51.72%</strong></li>
            <li>论文 NLPCC 在投</li>
          </ul>
        `,
      },
      {
        id: 'robot',
        title: '四足机器人巡检',
        body: `
          <p>面向电力巡检场景的四足机器人系统：</p>
          <ul>
            <li>ROS 三层闭环架构：感知 → 决策 → 控制</li>
            <li>VLM + LiDAR + RealSense 多模态感知，FSM 管理任务流</li>
            <li>LIPM + IMU 步态控制，兼顾稳定与越障</li>
            <li>睿抗机器人开发者大赛 <strong>全国一等奖</strong></li>
          </ul>
          <img class="dossier-fig" src="assets/robot-dog.jpg" alt="四足机器人现场调试" loading="lazy">
          <p class="fig-cap">现场证物 · 机器人在测试场地调试时的照片</p>
        `,
      },
    ],
  },

  /* ---------------- 实习 ---------------- */
  'card-internship': {
    title: '上海人工智能金融学院',
    subtitle: '科研实习生 · 2026.6 – 2026.9',
    body: `
      <p><strong>案情：</strong>大模型智能体能否像研究者一样「自我进化」？
      带着这个问题加入上海人工智能金融学院做科研实习。</p>
      <p><strong>两条线索：</strong>一条钻研图结构上的自进化与 Agentic RL；
      另一条与 NTU 课题组合作，给智能体的「创造力」立 benchmark。</p>
    `,
    children: [
      {
        id: 'graphrl',
        title: '图上自进化与 Agentic RL',
        body: `
          <p>图上自进化（Self-improvement）+ 强化学习：
          探索 Agent 在图推理任务中的<strong>自主优化与迭代提升</strong>——
          把交互经验沉淀进图结构，再由 RL 信号驱动策略持续演化，
          让智能体越用越聪明，而不是每次都从零开始。</p>
        `,
      },
      {
        id: 'ntu',
        title: 'Agent 创造力 Benchmark',
        body: `
          <p>在 NTU 课题组资助下担任 Lead，研究「智能体的创造力」这个玄学问题：</p>
          <ul>
            <li><strong>Harness 能力构建：</strong>搭建可复现的创造力评测脚手架</li>
            <li><strong>自进化机制：</strong>探索智能体在评测中自我提升的路径</li>
            <li><strong>技能获取 → 创造力：</strong>量化技能积累对创造力提升的影响</li>
          </ul>
          <p>成果预计投稿 <strong>ICLR 2027</strong>。</p>
        `,
      },
    ],
  },

  /* ---------------- 荣誉 ---------------- */
  'card-honors': {
    title: '主要荣誉',
    subtitle: '已结案的表彰记录',
    body: `
      <p><strong>卷宗总览：</strong>国家级荣誉 <strong>7 项</strong> · 省级 <strong>8 项</strong> · 校院级 <strong>20 余项</strong>。
      以下摘录几页关键笔录：</p>
      <ul>
        <li><strong>国家奖学金</strong>（Top 1%）</li>
        <li>睿抗机器人开发者大赛（RAICOM）全国总决赛 <strong>一等奖</strong>（四足机器人巡检系统）</li>
        <li>中国机器人及人工智能大赛 省一等奖</li>
        <li>中国高校智能机器人创意大赛 全国三等奖</li>
        <li>美国大学生数学建模竞赛 <strong>国际二等奖</strong>（Honorable Mention）</li>
        <li>全国大学生数学建模竞赛 省二等奖 · APMCM 亚太数模 三等奖</li>
        <li>CCPC / 蓝桥杯等程序设计竞赛若干</li>
        <li>中国国际大学生创新大赛 校赛铜奖</li>
      </ul>
      <img class="dossier-fig" src="assets/raicom-medal.jpg" alt="睿抗机器人大赛全国一等奖奖牌" loading="lazy">
      <p class="fig-cap">证物 · 2025 睿抗机器人开发者大赛全国总决赛一等奖奖牌</p>
    `,
  },

  /* ---------------- 联络线人 ---------------- */
  'card-contact': {
    title: '联络线人',
    subtitle: '递情报的暗线',
    body: `
      <p>最可靠的联络方式：</p>
      <ul>
        <li>邮箱：<a href="mailto:2637427015@qq.com">2637427015@qq.com</a></li>
      </ul>
    `,
  },

  /* ---------------- 足迹地图：城市案卷 ---------------- */
  // 与 js/data/travel.js 的 CITIES 一一对应（id 规则：travel-<城市id>）。
  // 描述是占位文案，用户自行改写；照片占位框待补充实拍图。
  'travel-changchun': {
    title: '长春',
    subtitle: '足迹 · 目击点 01（航线起点）',
    body: `
      <p>航线最北端的目击点。零下二十度的天气里，当事人仍坚持出门活动，
      动机成谜——疑似对雪有超出常理的热情。</p>
      <div class="dossier-img-grid">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
    `,
  },
  'travel-zhengzhou': {
    title: '郑州',
    subtitle: '足迹 · 目击点 02',
    body: `
      <p>中转站记录：一碗胡辣汤，停留四小时，然后继续南下。
      高效的过路人，可疑的从容。</p>
      <div class="dossier-img-grid">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
    `,
  },
  'travel-wuhan': {
    title: '武汉',
    subtitle: '足迹 · 目击点 03（主要活动据点）',
    body: `
      <p>此人的主要活动据点。江边的夜跑路线已被反复测绘，
      热干面摊位的出勤率高得不像话。</p>
      <div class="dossier-img-grid">
        <img class="zoomable" src="assets/photos/wuhan-1.jpg" alt="武汉光谷步行街夜景" loading="lazy">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
      <p class="fig-cap">证物 · 光谷步行街的夜，堂吉诃德雕像与酒吧街风车</p>
    `,
  },
  'travel-changsha': {
    title: '长沙',
    subtitle: '足迹 · 目击点 04',
    body: `
      <p>夜市目击记录：当事人对口味虾与茶颜悦色表现出强烈执着，
      凌晨一点的解放西仍有其身影。</p>
      <div class="dossier-img-grid">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
    `,
  },
  'travel-dali': {
    title: '大理',
    subtitle: '足迹 · 目击点 05',
    body: `
      <p>洱海边的风比 debug 更能清空缓存。当事人在此停留时间远超计划，
      苍山下拍到大量「看起来一样但其实不一样」的云。</p>
      <div class="dossier-img-grid">
        <img class="zoomable" src="assets/photos/dali-1.jpg" alt="大理洱海与双廊古镇" loading="lazy">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
      <p class="fig-cap">证物 · 洱海东岸眺望双廊，苍山云带触手可及</p>
    `,
  },
  'travel-lijiang': {
    title: '丽江',
    subtitle: '足迹 · 目击点 06',
    body: `
      <p>古城巷子是天然的监控盲区。当事人带着相机消失了一整个下午，
      回来时存储卡少了 4GB。</p>
      <div class="dossier-img-grid">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
    `,
  },
  'travel-hangzhou': {
    title: '杭州',
    subtitle: '足迹 · 目击点 07',
    body: `
      <p>西湖边的长椅上发现当事人遗留的笔记本，
      上面写着半页看不懂的公式和一句「先吃饭」。</p>
      <div class="dossier-img-grid">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
    `,
  },
  'travel-shanghai': {
    title: '上海',
    subtitle: '足迹 · 目击点 08（第二据点）',
    body: `
      <p>第二据点。咖啡因摄入量在此达到峰值，
      滨江步道的夜景快门次数位居全案之首。</p>
      <div class="dossier-img-grid">
        <img class="zoomable" src="assets/photos/shanghai-1.jpg" alt="上海历史建筑街景" loading="lazy">
        <img class="zoomable" src="assets/photos/shanghai-2.jpg" alt="东方明珠晚霞" loading="lazy">
        <img class="zoomable" src="assets/photos/shanghai-3.jpg" alt="和平饭店夜景" loading="lazy">
      </div>
      <p class="fig-cap">证物 · 街角老公寓 / 东方明珠的晚霞 / 和平饭店的夜</p>
    `,
  },
  'travel-shenzhen': {
    title: '深圳',
    subtitle: '足迹 · 目击点 09（航线终点）',
    body: `
      <p>航线最南端。他声称「来看看海和创业公司」，
      但在人才公园对着无人机表演拍了四十分钟。</p>
      <div class="dossier-img-grid">
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
        <div class="dossier-img-ph small">照片待补充</div>
      </div>
    `,
  },

  /* ---------------- 生活切片 ---------------- */
  'life-camera': {
    title: '线索 · 镜头后面',
    subtitle: '摄影',
    body: `
      <p>当事人声称「光比人诚实」。相机快门数异常偏高，底片去向不明。
      以下是从存储卡里恢复的部分证物（点击可放大细查）：</p>
      <div class="dossier-img-grid">
        <img class="zoomable" src="assets/photos/cam-01.jpg" alt="夜樱" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-02.jpg" alt="蓝调时刻的拱桥" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-03.jpg" alt="江景黄昏" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-04.jpg" alt="城市夜景与斜拉桥" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-05.jpg" alt="江上月光" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-06.jpg" alt="滨江步道" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-07.jpg" alt="樱花树下的许愿牌" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-08.jpg" alt="恩施土司城南门" loading="lazy">
        <img class="zoomable" src="assets/photos/cam-09.jpg" alt="花市" loading="lazy">
      </div>
      <p class="fig-cap">证物 · 夜樱 / 江与桥 / 花与愿望 / 一座土司城</p>
    `,
  },
  'life-run': {
    title: '线索 · 跑鞋磨损记录',
    subtitle: '运动 / 跑步',
    body: `
      <div class="dossier-img-ph">👟<br>照片待补充</div>
      <p>鞋底磨损均匀，步频稳定。据线人报：此人常在深夜出门跑步，
      疑似借配速整理白天想不通的问题。</p>
    `,
  },
  'life-books': {
    title: '线索 · 床头书堆',
    subtitle: '阅读',
    body: `
      <div class="dossier-img-ph">📚<br>照片待补充</div>
      <p>书堆呈不稳定结构，最上面一本停在第 47 页，书签是一张咖啡小票。
      书目横跨科幻、科普与侦探小说——口味可疑地杂。</p>
    `,
  },
  'life-music': {
    title: '线索 · 耳机分你一半',
    subtitle: '音乐',
    body: `
      <div class="dossier-img-ph">🎧<br>照片待补充</div>
      <p>歌单分析：后摇与 citypop 各占一半。规律明显——写东西时听后摇，
      发呆时听另一半。</p>
    `,
  },
};

/* ============================================================
   面板控制器
   ============================================================ */

let stack = [];        // 当前路径：[dossierId, childId, ...]
let backdropEl = null;

function resolveNode(path) {
  let node = DOSSIERS[path[0]];
  for (let i = 1; i < path.length; i++) {
    node = node && node.children
      ? node.children.find((c) => c.id === path[i])
      : null;
  }
  return node || null;
}

function crumbLabels(path) {
  const labels = ['线索板'];
  let node = DOSSIERS[path[0]];
  if (!node) return labels;
  labels.push(node.title);
  for (let i = 1; i < path.length; i++) {
    node = node.children && node.children.find((c) => c.id === path[i]);
    if (!node) break;
    labels.push(node.title);
  }
  return labels;
}

function render() {
  const node = resolveNode(stack);
  if (!node) { closeDossier(); return; }

  const panel = document.getElementById('dossier-panel');
  const crumbs = crumbLabels(stack);

  panel.querySelector('.dossier-crumbs').innerHTML =
    crumbs.map((c) => `<span>${c}</span>`).join('<i>›</i>');
  panel.querySelector('.dossier-title').textContent = node.title;
  panel.querySelector('.dossier-subtitle').textContent = node.subtitle || '';
  panel.querySelector('.dossier-body').innerHTML = node.body || '';

  // 返回按钮：仅第 2 层及以下显示
  panel.querySelector('.dossier-back').style.display =
    stack.length > 1 ? '' : 'none';

  // 子要点 chips
  const chipsBox = panel.querySelector('.dossier-chips');
  chipsBox.innerHTML = '';
  if (node.children && node.children.length) {
    const hint = document.createElement('p');
    hint.className = 'chips-hint';
    hint.textContent = '深入线索：';
    chipsBox.appendChild(hint);
    for (const child of node.children) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = child.title;
      chip.addEventListener('click', () => {
        stack.push(child.id);
        swapContent();
      });
      chipsBox.appendChild(chip);
    }
  }

  // 回到面板顶部
  panel.scrollTop = 0;
}

// 层级切换时的轻微淡入
function swapContent() {
  const panel = document.getElementById('dossier-panel');
  panel.classList.remove('layer-in');
  void panel.offsetWidth; // 触发 reflow 重启动画
  render();
  panel.classList.add('layer-in');
}

function buildDom() {
  backdropEl = document.createElement('div');
  backdropEl.id = 'dossier-backdrop';
  backdropEl.innerHTML = `
    <div id="dossier-panel" role="dialog" aria-modal="true">
      <span class="dossier-stamp" aria-hidden="true">案卷</span>
      <nav class="dossier-crumbs" aria-label="面包屑"></nav>
      <button class="dossier-close" type="button" aria-label="关闭">×</button>
      <button class="dossier-back" type="button">← 返回上一级</button>
      <h2 class="dossier-title"></h2>
      <p class="dossier-subtitle"></p>
      <div class="dossier-body"></div>
      <div class="dossier-chips"></div>
    </div>`;
  document.body.appendChild(backdropEl);

  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) closeDossier();
  });
  backdropEl.querySelector('.dossier-close').addEventListener('click', closeDossier);
  backdropEl.querySelector('.dossier-back').addEventListener('click', () => {
    if (stack.length > 1) {
      stack.pop();
      swapContent();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    // 先关大图，再关案卷
    if (lightboxEl && lightboxEl.classList.contains('open')) { closeLightbox(); return; }
    if (backdropEl.classList.contains('open')) closeDossier();
  });
}

/* ---------- Lightbox：案卷内照片点击放大 ---------- */
let lightboxEl = null;

function openLightbox(src, alt) {
  if (!lightboxEl) {
    lightboxEl = document.createElement('div');
    lightboxEl.id = 'lightbox';
    lightboxEl.setAttribute('role', 'dialog');
    lightboxEl.setAttribute('aria-label', '照片放大查看');
    lightboxEl.innerHTML =
      '<img alt=""><span class="lightbox-hint">点击任意处或按 ESC 关闭</span>';
    lightboxEl.addEventListener('click', closeLightbox);
    document.body.appendChild(lightboxEl);
  }
  const img = lightboxEl.querySelector('img');
  img.src = src;
  img.alt = alt || '';
  lightboxEl.classList.add('open');
}

function closeLightbox() {
  if (lightboxEl) lightboxEl.classList.remove('open');
}

// 案卷内带 .zoomable 的照片均可点击放大
document.addEventListener('click', (e) => {
  const img = e.target.closest('#dossier-panel img.zoomable');
  if (img) openLightbox(img.src, img.alt);
});

/** 打开案卷。path 形如 "card-figmac" 或 "card-figmac/fig" */
export function openDossier(path) {
  if (!backdropEl) buildDom();
  const parts = String(path).split('/').filter(Boolean);
  if (!DOSSIERS[parts[0]]) return;
  stack = parts;
  render();
  backdropEl.classList.add('open');
  document.body.classList.add('no-scroll');
}

export function closeDossier() {
  if (!backdropEl) return;
  backdropEl.classList.remove('open');
  document.body.classList.remove('no-scroll');
  stack = [];
}

/* 调试参数：?dossier=card-figmac 或 ?dossier=card-figmac/fig 加载后自动打开 */
window.addEventListener('load', () => {
  const d = new URLSearchParams(location.search).get('dossier');
  if (d) openDossier(d);
});
