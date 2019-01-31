import { pageText } from "@/types";
let animationName = ['fadeInDownBig', 'flipInY', 'bounceInRight', 'bounceInDown', 'zoomInDown', 'zoomInRight', 'zoomInUp', 'rotateIn', 'jackInTheBox']
const bounceInDown = 'bounceInDown'
const fadeInDown = 'fadeInDown'
const slideInLeft = 'slideInLeft'
const slideInRight = 'slideInRight'
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
export const swiperPageData = {
  p0: {
    text: [
      new pageText("2018年<span class='fs-18'> 1月 1日</span>", "fs-36 lh-50", slideInLeft, false),
      new pageText("你踏上了新的征途 !", "fs-24 lh-33", slideInRight, false)
    ],
    anime: lottieAnime0
  },
  p1: {
    text: [
      new pageText("因为工作", 'fs-24 lh-33', p1AnimeCss, false),
      new pageText("您辗转<span class='cor-yel'> {{Mile}} 公里</span>", 'fs-24 lh-50', p1AnimeCss, false),
      new pageText("游荡在地图中", 'fs-16 lh-22', p1AnimeCss, false),
    ],
    textSp: [
      new pageText("您固守一座城", 'fs-24 lh-33', p1AnimeCss, false),
      new pageText("即便总是奔波在两点一线", 'fs-24 lh-50', p1AnimeCss, false),
      new pageText("却是一步步靠近我们的理想", 'fs-24 lh-33', p1AnimeCss, false),
    ],
    anime: lottieAnime1
  },
  p2: {
    text: [
      new pageText("升级刷怪，您勇往直前！", 'fs-24', p2AnimeCss, false),
      new pageText(`拿下了<spna class='cor-yel'> {{Change}} </spna>次变更`, 'fs-16 lh-30 mg-t-35', p2AnimeCss, false),
      new pageText(`打败了<span class='cor-yel'> {{Question}} </span>个问题`, 'fs-24 lh-50', p2AnimeCss, false),
      new pageText(`完成了<span class='cor-yel'> {{Request}} </span>个请求任务`, 'fs-18 lh-30', p2AnimeCss, false),
      new pageText(`上线了<span class='cor-yel'> {{Release}} </span>个发布`, 'fs-24 lh-50', p2AnimeCss, false),
    ],
    textSp: [
      new pageText("您带领的团队累计：", 'fs-24', p2AnimeCss, false),
      new pageText(`拿下了<spna class='cor-yel'> {{Change}} </spna>次变更`, 'fs-16 lh-30 mg-t-35', p2AnimeCss, false),
      new pageText(`打败了<span class='cor-yel'> {{Question}} </span>个问题`, 'fs-24 lh-50', p2AnimeCss, false),
      new pageText(`完成了<span class='cor-yel'> {{Request}} </span>个请求任务`, 'fs-18 lh-30', p2AnimeCss, false),
      new pageText(`上线了<span class='cor-yel'> {{Release}} </span>个发布`, 'fs-24 lh-50', p2AnimeCss, false),
    ],
    anime: lottieAnime2
  },
  p3: {
    text: [
      new pageText("任务之外", 'fs-24 lh-33', p3AnimeCss, false),
      new pageText("你每天额外付出<span class='cor-yel'> {{OverTime}}小时</span>", 'fs-24 lh-50', p3AnimeCss, false),
      new pageText("<span>探索支线任务</span>", 'fs-16 lh-22', p3AnimeCss, false),
    ],
    anime: lottieAnime3
  },
  p4: {
    text: [
      new pageText("您的努力", 'fs-24 lh-33', p4AnimeCss, false),
      new pageText("团长都看在 眼里", 'fs-24 lh-50', p4AnimeCss, false),
      new pageText(`<span>工作认真负责<br/>再搭配上创新的思维模式就更佳了</span>`, 'p4-gradient-text fs-18 lh-26 mg-t-20', p4AnimeCss, false),
    ],
    anime: lottieAnime4
  },
  p5: {
    text: [
      new pageText(`11月11日，`, 'fs-24 lh-50', p5AnimeCss, false),
      new pageText("队友们共同解锁成就！", 'fs-20 lh-50', p5AnimeCss, false),
      new pageText(`第一次，交易量突破<span class='cor-yel'> 10000TPS </span>`, 'fs-20 lh-50', p5AnimeCss, false),
      new pageText(`第一次，全部承接网联渠道`, 'fs-20 lh-50', p5AnimeCss, false),
      new pageText(`第一次，全部信用卡流量经过x86代授权系统`, 'fs-20 mg-t-15', p5AnimeCss, false),
    ],
    anime: lottieAnime5
  },
  p6: {
    text: [
      new pageText(`在开启新篇章前`, 'fs-24 lh-50', p6AnimeCss, false),
      new pageText("<span class='cor-yel'>先做一次罗姆人的占卜吧</span>", 'fs-24 lh-50', p6AnimeCss, false),
    ],
    textSp: [
      new pageText(`你的星座是`, 'fs-24 lh-50', p6AnimeCss, false),
      new pageText("<span class='cor-yel'>双子座</span>", 'fs-24 lh-50', p6AnimeCss, false),
    ],
    ConstellationText: [],
    anime: lottieAnime6
  },
  p7: {
    text: [
      new pageText("2019", 'fs-36 lh-50', p7AnimeCss, false),
      new pageText("新世界的大门已经打开", 'fs-18 lh-22', p7AnimeCss, false),
      new pageText("<span class='cor-yel'>战斗吧！</span>", 'fs-24 lh-33 mg-t-35', p7AnimeCss, false),
      new pageText("为了艾泽拉斯 !", 'fs-24 lh-36', p7AnimeCss, false),
    ],
    anime: lottieAnime7
  }
}
export const ConstellationText = {
  c1: [
    new pageText(`再次出发，寻找自我；展望未来，积极蜕变；情感迷茫，有心无力；财源可期，支出颇大；健康稳固，情绪波动；运势理想，自我增值`, 'fs-20 lh-36', p6AnimeCss, false)
  ]
}

export const localUsData = {
  Change: 12,
  CityCount: 11,
  Department: "运行调度室",
  Evaluate: "工作认真负责，再搭配上创新的思维模式就更佳了！",
  IsLeader: 0,
  Mile: 12345,
  Name: "白静杰|99|66",
  OverTime: 60,
  Pride: "移事通改版上线",
  Question: 55,
  Release: 33,
  Request: 34
};
