import { pageText } from "@/types";
let animationName = ['fadeInDownBig', 'flipInY', 'bounceInRight', 'bounceInDown', 'zoomInDown', 'zoomInRight', 'zoomInUp', 'rotateIn', 'jackInTheBox']
const bounceInDown = 'bounceInDown'
const zoomIn = 'zoomIn'
const slideInLeft = 'slideInLeft'
const slideInRight = 'slideInRight'
const slideInUp = 'slideInUp'
const p1AnimeCss = animationName[Math.floor(Math.random() * animationName.length)]
const p2AnimeCss = animationName[Math.floor(Math.random() * animationName.length)]
const p3AnimeCss = animationName[Math.floor(Math.random() * animationName.length)]
const p4AnimeCss = animationName[Math.floor(Math.random() * animationName.length)]
const p5AnimeCss = animationName[Math.floor(Math.random() * animationName.length)]
const p6AnimeCss = animationName[Math.floor(Math.random() * animationName.length)]
const p7AnimeCss = bounceInDown

let lottieAnime0 = {
  isInit: false,
  animeData: [
    {
      selector: "#animeEarth",
      animationData: require("@/static/json/shouye.json")
    }
  ]
};
let lottieAnime1 = {
  isInit: false,
  animeData: [
    {
      selector: "#animeRoute",
      //path: "/json/licheng.json"
      animationData: require("@/static/json/licheng.json")
    }
  ]
};
let lottieAnime2 = {
  isInit: false,
  animeData: [
    {
      selector: "#workout",
      //path: "/json/licheng.json"
      animationData: require("@/static/json/tongji.json")
    }
  ]
};
let lottieAnime3 = {
  isInit: false,
  animeData: [
    {
      selector: "#overTime",
      animationData: require("@/static/json/jiaban.json")
    }
  ]
};
let lottieAnime4 = {
  isInit: false,
  animeData: [
    {
      selector: "#wishes",
      animationData: require("@/static/json/jiyu.json")
    }
  ]
};
let lottieAnime5 = {
  isInit: false,
  animeData: [
    {
      selector: "#doubleeleven",
      animationData: require("@/static/json/zuji.json")
    }
  ]
};
let lottieAnime6 = {
  isInit: false,
  animeData: [
    {
      selector: "#Constellation",
      animationData: require("@/static/json/zhanbu.json")
    }
  ]
}
let lottieAnime7 = {
  isInit: false,
  animeData: [
    {
      selector: "#newYear",
      animationData: require("@/static/json/zhandou.json")
    }
  ]
};
export let cAnimeOption = {
  isInit: false,
  animeData: [
    {
      selector: "#constellationPicAnime",
      path: "/json/c1/c1.json",
    }
  ]
}
let cAnime0 = "/json/c0/data.json";
let cAnime1 = "/json/c1/data.json";
let cAnime2 = "/json/c2/data.json";
let cAnime3 = "/json/c3/data.json";
let cAnime4 = "/json/c4/data.json";
let cAnime5 = "/json/c5/data.json";
let cAnime6 = "/json/c6/data.json";
let cAnime7 = "/json/c7/data.json";
let cAnime8 = "/json/c8/data.json";
let cAnime9 = "/json/c9/data.json";
let cAnime10 = "/json/c10/data.json";
let cAnime11 = "/json/c11/data.json";
export const swiperPageData = {
  p0: {
    text: [
      new pageText("2018年<span class='fs-18'> 1月 1日</span>", "fs-36 lh-50 d400", slideInLeft, false),
      new pageText("您踏上了新的征途 !", "fs-24 lh-33 d600", slideInRight, false)
    ],
    anime: lottieAnime0
  },
  p1: {
    text: [
      new pageText("因为工作", 'fs-24 lh-33 d400', zoomIn, false),
      new pageText("您辗转<span class='cor-yel'> {{Mile}} 公里</span>", 'fs-24 lh-50 d400', zoomIn, false),
      new pageText("游荡在地图中", 'fs-16 lh-22 d800', slideInUp, false),
    ],
    textSp: [
      new pageText("您固守一座城", 'fs-24 lh-33 d400', zoomIn, false),
      new pageText("即便总是奔波在两点一线", 'fs-24 lh-50 d400', zoomIn, false),
      new pageText("却是一步步靠近我们的理想", 'fs-24 lh-33 d800', slideInUp, false),
    ],
    anime: lottieAnime1
  },
  p2: {
    text: [
      new pageText("升级刷怪，您勇往直前！", 'fs-24 d400', zoomIn, false),
      new pageText(`拿下了<spna class='cor-yel'> {{Change}} </spna>次变更`, 'fs-16 lh-30 d400 mg-t-35', slideInRight, false),
      new pageText(`打败了<span class='cor-yel'> {{Question}} </span>个问题`, 'fs-22 lh-50 d600', slideInLeft, false),
      new pageText(`完成了<span class='cor-yel'> {{Request}} </span>个请求任务`, 'fs-18 lh-30 d800', slideInRight, false),
      new pageText(`上线了<span class='cor-yel'> {{Release}} </span>个发布`, 'fs-22 lh-50 d1000', slideInLeft, false),
    ],
    textSp: [
      new pageText("您带领的团队累计：", 'fs-24 d400', zoomIn, false),
      new pageText(`拿下了<spna class='cor-yel'> {{Change}} </spna>次变更`, 'fs-16 lh-30 d400 mg-t-35', slideInRight, false),
      new pageText(`打败了<span class='cor-yel'> {{Question}} </span>个问题`, 'fs-22 lh-50 d600', slideInLeft, false),
      new pageText(`完成了<span class='cor-yel'> {{Request}} </span>个请求任务`, 'fs-18 lh-30 d800', slideInRight, false),
      new pageText(`上线了<span class='cor-yel'> {{Release}} </span>个发布`, 'fs-22 lh-50 d1000', slideInLeft, false),
    ],
    textSp2: [
      new pageText("升级刷怪，您勇往直前！", 'fs-24 d400', zoomIn, false),
      new pageText(`{{withoutChange}}`, 'fs-18 lh-30 pd-h-20 d400 mg-t-35', slideInRight, false),
    ],
    anime: lottieAnime2
  },
  p3: {
    text: [
      new pageText("任务之外", 'fs-24 lh-33 d400', zoomIn, false),
      new pageText("您每月额外付出<span class='cor-yel'> {{OverTime}}小时</span>", 'fs-24 lh-50 d600', slideInRight, false),
      new pageText("<span>探索支线任务</span>", 'fs-16 lh-22 d800', slideInUp, false),
    ],
    textSp: [
      new pageText("任务之外", 'fs-24 lh-33 d400', zoomIn, false),
      new pageText("您的团队每月人均额外付出<span class='cor-yel'> {{OverTime}}小时</span>", 'fs-24 lh-36 mg-v-10 d600', slideInRight, false),
      new pageText("<span>探索支线任务</span>", 'fs-16 lh-22 d800', slideInUp, false),
    ],
    textSp2: [
      new pageText("勤奋是您生命的密码", 'fs-24 lh-33 d400', zoomIn, false),
      new pageText("能译出您一部壮丽的史诗", 'fs-24 lh-28 mg-v-10 d600', slideInRight, false),
    ],
    anime: lottieAnime3
  },
  p4: {
    text: [
      new pageText("您的努力", 'fs-24 lh-33 d400', zoomIn, false),
      new pageText("团长都看在眼里", 'fs-24 lh-50 d400', zoomIn, false),
      new pageText(`<span>{{Evaluate}}</span>`, 'gradient-text fs-18 lh-26 mg-t-20 d600', slideInUp, false),
    ],
    textSp: [
      new pageText(`<p>2018年，我们不仅“活着”，我们的可用性还达到了历史最好水平；</p>
      <p>2018年，我们持续修炼“天人合一”，工具和流程智能融合提升明显；</p>
      <p>2018年，我们坚持“数字化一切”，数字化从监控走向各类运营指标，形成了数据平台；</p>
      <p>2018年，我们瞄准“三年万台服务器”，创历史地一年建设四个机房、部署5000+服务器；</p>
      <p>2018年，我们围绕“四大框架”，理清思路，实现各项工作有序落地；</p>
      <p>2018年，星星之火已成燎原之势；</p>
      <p>2019年，我们开始换道，驶向全新未来；</p>
      `, 'fs-14 lh-22 d600', slideInUp, false),
    ],
    anime: lottieAnime4
  },
  p5: {
    text: [
      new pageText(`11月11日，`, 'fs-24 mg-b-5 lh-33 d400', zoomIn, false),
      new pageText("队友们共同解锁成就！", 'fs-18 lh-33 d400', slideInRight, false),
      new pageText(`第一次，交易量突破<span class='cor-yel'> 10000TPS </span>`, 'fs-18 lh-33 d600', slideInLeft, false),
      new pageText(`第一次，全部承接网联渠道`, 'fs-18 lh-33 d800', slideInRight, false),
      new pageText(`第一次，全部信用卡流量经过x86代授权系统`, 'fs-18 pd-r-36 mg-t-5 d1000', slideInLeft, false),
    ],
    anime: lottieAnime5
  },
  p6: {
    text: [
      new pageText(`在开启新篇章前`, 'fs-24 lh-50', '', false),
      new pageText("<span class='cor-yel'>先做一次罗姆人的占卜吧</span>", 'fs-24 lh-50', '', false),
    ],
    textSp: [
      new pageText(`您的星座是`, 'fs-24 lh-50', '', false),
      new pageText("<span class='cor-yel'>{{Sign}}</span>", 'fs-24 lh-50', '', false),
    ],
    textSp2: [
      new pageText(`您的幸运星座是`, 'fs-24 lh-50', '', false),
      new pageText("<span class='cor-yel'>{{Sign}}</span>", 'fs-24 lh-50', '', false),
    ],
    ConstellationText: [],
    anime: lottieAnime6,
  },
  p7: {
    text: [
      new pageText("2019", 'fs-36 lh-50 d400', zoomIn, false),
      new pageText("新世界的大门已经打开", 'fs-18 lh-22 d400', zoomIn, false),
      new pageText("<span class='cor-yel'>战斗吧！</span>", 'fs-24 lh-33 mg-t-35 d600', slideInRight, false),
      new pageText("让我们在新的道路上奔跑 !", 'fs-24 lh-36 d600', slideInLeft, false),
    ],
    anime: lottieAnime7
  }
}
export const ConstellationText = {
  signs: ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'],
  c0: {
    cAnime: cAnime0,
    text: [
      new pageText(`再次出发，寻找自我；展望未来，积极蜕变；情感迷茫，有心无力；财源可期，支出颇大；健康稳固，情绪波动；运势理想，自我增值`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [71,
      84,
      86,
      90,
      78
    ]
  },
  c1: {
    cAnime: cAnime1,
    text: [
      new pageText(`有苦有乐，逐步成熟；蓄势待发，维护人气；感情平淡，有得有失；把握机会，抑制消费；规律生活，注重安全；发挥自如，吸纳经验`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      77,
      71,
      80,
      92,
      77
    ]
  },
  c2: {
    cAnime: cAnime2,
    text: [
      new pageText(`有所顿悟，运势抬头；旗开得胜，贵人运佳；暧昧有余，真心为重；控制风险，稳健求财；养护身体，平稳心态；获得灵感，平稳进步`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      86,
      81,
      80,
      88,
      85
    ]
  },
  c3: {
    cAnime: cAnime3,
    text: [
      new pageText(`喜忧参半，抓住机遇；拓展领域，细致为佳；把握时机，提升信任；财源滚滚，量入为出；养护身体，安全第一；技巧提升，压力疏解`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      84,
      85,
      78,
      82,
      86
    ]
  },
  c4: {
    cAnime: cAnime4,
    text: [
      new pageText(`运势起伏，境界开拓；整体顺遂，助力添运；诱惑增多，坚守信念；有得有失，关键心态；注重保养，心情调节；专注自我，不断向上`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      78,
      89,
      86,
      85,
      82
    ]
  },
  c5: {
    cAnime: cAnime5,
    text: [
      new pageText(`交际受阻，运势动荡；面临机会，调整步调；缘分向好，变数出现；逆势前进，吉星照拂；大致无碍，保养细节；状态低迷，有待提高`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      89,
      85,
      77,
      84,
      78
    ]
  },
  c6: {
    cAnime: cAnime6,
    text: [
      new pageText(`遭遇瓶颈，释放潜能；潜力挖掘，重振旗鼓；逐渐回暖，幸福重生；注重积累，理性投资；大体良好，调节情绪；运势积极，努力求胜`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      72,
      85,
      78,
      83,
      79
    ]
  },
  c7: {
    cAnime: cAnime7,
    text: [
      new pageText(`运势上扬，厚积薄发；修炼自我，迎接机会；患得患失，缺乏自信；谨慎细致，平和为主；大体平稳，健身为要；时缓时急，认识清晰`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      82,
      74,
      72,
      86,
      84
    ]
  },
  c8: {
    cAnime: cAnime8,
    text: [
      new pageText(`认识自我，心灵获益；渴求突破，经营人脉；拓展交际，感情蜕变；渐走渐强，保守行事；维护保养，提升素质；取长补短，收获满满`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      70,
      84,
      85,
      75,
      72
    ]
  },
  c9: {
    cAnime: cAnime9,
    text: [
      new pageText(`迎接挑战，驾驭生活；重任在肩，付诸实践；感情平顺，尊重内心；偶有起伏，谨慎行动；疏导情绪，预防旧疾；制定目标，坚持努力`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      85,
      79,
      88,
      83,
      84
    ]
  },
  c10: {
    cAnime: cAnime10,
    text: [
      new pageText(`贵人运好，运势上扬；挑战目标，积极作为；感情稳定，开花结果；改变观念，多元理财；保持运动，调节身心；提高效率，强调专心`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      84,
      85,
      71,
      76,
      77
    ]
  },
  c11: {
    cAnime: cAnime11,
    text: [
      new pageText(`情绪宣泄，能量加持；开拓版图，逐步胜任；感情进阶，把握幸福；依靠正财，合理支配；小心防范，就医及时；心态波动，负担加重`, 'fs-20 lh-36', p6AnimeCss, false)
    ],
    signNum: [
      87,
      80,
      72,
      86,
      85
    ]
  },
}

export const localUsData = {
  Change: 12,
  CityCount: 11,
  Department: "运行调度室",
  Evaluate: "工作认真负责，再搭配上创新的思维模式就更佳了！",
  IsLeader: 0,
  Mile: 12345,
  Name: "Visitor|99|66",
  OverTime: 60,
  Pride: "移事通改版上线",
  Question: 55,
  Release: 33,
  Request: 34
};

export const rppURL = process.env.NODE_ENV !== 'production' ? "http://localhost:8084/web/pages/drawcom.html?packetId=4727bd1d-33eb-41db-84c2-8c407a26f6fa" : "/web/pages/drawcom.html?packetId=4727bd1d-33eb-41db-84c2-8c407a26f6fa";
