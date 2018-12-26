
// 坐标
class Crood {
    x: number
    y: number
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    setCrood(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Crood(this.x, this.y);
    }
}
// stars
class Star {
    size: number;
    speed: number;
    x: number;
    y: number;
    constructor(options: { x: number; y: number }) {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.1;
        this.x = options.x;
        this.y = options.y;
    }
    reset(cvs) {
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.1;
        this.x = cvs.width;
        this.y = Math.random() * cvs.height;
    }
    Star(ctx) {
        this.x -= this.speed;
        if (this.x < 0) {
            this.reset(ctx);
        } else {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
    update(cvs, ctx) {
        this.x -= this.speed;
        if (this.x < 0) {
            this.reset(cvs);
        } else {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}
// 流星-v1
class ShootingStar {
    position: Crood
    final: Crood
    size: number
    speed: number
    dur: number
    pass: number
    prevPos: Crood
    curPos: Crood
    onDistory: Function | null
    constructor(pos = new Crood, final = new Crood, size = 3, speed = 200, onDistory: Function | null) {
        this.position = pos; // 初始位置
        this.final = final; // 最终位置
        this.size = size; // 大小
        this.speed = speed; // 速度：像素/s

        // 飞行总时间
        this.dur = Math.sqrt(Math.pow(this.final.x - this.position.x, 2) + Math.pow(this.final.y - this.position.y, 2)) * 1000 / this.speed;

        this.pass = 0; // 已过去的时间
        this.prevPos = this.position.copy(); // 上一帧位置
        this.curPos = this.position.copy(); // 当前位置
        this.onDistory = onDistory;
    }
    draw(ctx, delta) {
        this.pass += delta;
        this.pass = Math.min(this.pass, this.dur);

        let percent = this.pass / this.dur;

        this.curPos.setCrood(
            this.position.x + (this.final.x - this.position.x) * percent,
            this.position.y + (this.final.y - this.position.y) * percent
        );

        // canvas
        ctx.strokeStyle = '#fff';
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.curPos.x, this.curPos.y);
        ctx.lineTo(this.prevPos.x, this.prevPos.y);
        ctx.stroke();

        this.prevPos.setCrood(this.curPos.x, this.curPos.y);
        if (this.pass === this.dur) {
            this.distory();
        }
    }
    distory() {
        this.onDistory && this.onDistory();
    }
}

//流星-v2
class ShootingStarV2 {
    x: number;
    y: number;
    len: number;
    speed: number;
    size: number;
    waitTime: number;
    active: boolean;
    constructor(cas) {
        this.x = Math.random() * cas.width;
        this.y = 0;
        this.len = Math.random() * 80 + 10;
        this.speed = Math.random() * 15 + 6;
        this.size = Math.random() * 1 + 0.1;
        // this is used so the shooting stars arent constant
        this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
        this.active = false;
    }
    reset(cas) {
        this.x = Math.random() * cas.width;
        this.y = 0;
        this.len = Math.random() * 50 + 10;
        this.speed = Math.random() * 10 + 6;
        this.size = Math.random() * 1 + 0.1;
        // this is used so the shooting stars arent constant
        this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
        this.active = false;
    }
    update(cas, ctx) {
        if (this.active) {
            this.x -= this.speed;
            this.y += this.speed;
            if (this.x < 0 || this.y >= cas.height) {
                this.reset(cas);
            } else {
                ctx.lineCap = "round";
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.len, this.y - this.len);
                ctx.stroke();
            }
        } else {
            if (this.waitTime < new Date().getTime()) {
                this.active = true;
            }
        }
    }
}

let MeteorCount = 4;
// 流星雨
export class MeteorShower {
    cvs: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    tercvs: HTMLCanvasElement
    terctx: CanvasRenderingContext2D
    stars: Array<Star>
    shootingStars: Array<ShootingStar>
    animeObj: Array<any>
    meteorCount: number
    T: number
    isStop: boolean
    playing: boolean
    isclearBg: boolean
    constructor(cvs, tercvs, shootingStarsCount) {
        this.cvs = document.getElementById(
            cvs
        ) as HTMLCanvasElement;
        this.ctx = this.cvs.getContext("2d")! ,
            this.tercvs = document.getElementById(
                tercvs
            ) as HTMLCanvasElement
        this.terctx = this.tercvs.getContext("2d")!
        this.stars = []
        this.shootingStars = []
        this.animeObj = []
        this.T = 0
        this.isStop = false
        this.playing = false
        this.meteorCount = shootingStarsCount
        this.isclearBg = false
        this.init()
    }
    init() {
        let width = window.innerWidth,
            height = window.innerHeight;
        height = height < 400 ? 400 : height;
        this.cvs.width = this.tercvs.width = width;
        this.cvs.height = this.tercvs.height = height;
    }
    createStarV2() {
        let vm = this
        // init the stars
        for (var i = 0; i < vm.cvs.height; i++) {
            vm.animeObj.push(
                new Star({
                    x: Math.random() * vm.cvs.width,
                    y: Math.random() * vm.cvs.height
                })
            );
        }

        // Add shooting stars that just cycle.
        for (var i = 0; i < vm.meteorCount; i++) {
            vm.animeObj.push(new ShootingStarV2(vm.cvs));
            vm.animeObj.push(new ShootingStarV2(vm.cvs));
        }
    }
    // 生成随机位置的流星
    createStar() {
        let angle = Math.PI / 3;
        let distance = Math.random() * 800;
        let init = new Crood((Math.random() * 1.2 * this.cvs.width - 50), Math.random() * 300 | 0);
        let final = new Crood(init.x + distance * Math.cos(angle), init.y + distance * Math.sin(angle));
        let size = Math.random() * 2;
        let speed = Math.random() * 400 + 100;
        let star = new ShootingStar(
            init, final, size, speed,
            () => {
                this.remove(star)
            }
        );
        return star;
    }
    remove(star) {
        this.shootingStars = this.shootingStars.filter((s) => {
            return s !== star
        });
    }

    update(delta) {
        if (!this.isStop && this.shootingStars.length < 40) {
            this.shootingStars.push(this.createStar());
        }
        this.shootingStars.forEach((star) => {
            star.draw(this.ctx, delta);
        });
    }

    tick() {
        if (this.playing) return;
        this.playing = true;
        this.isStop = false;

        let now = (new Date()).getTime();
        let last = now;
        let delta;

        let _tick = () => {
            if (this.isStop && this.shootingStars.length === 0) {
                cancelAnimationFrame(this.T);
                this.playing = false;
                return;
            }

            delta = now - last;
            delta = delta > 500 ? 30 : (delta < 16 ? 16 : delta);
            last = now;
            // console.log(delta);

            this.T = requestAnimationFrame(_tick);

            this.ctx.save();
            this.ctx.globalCompositeOperation = "destination-in";
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)'; // 每一帧用 “半透明” 的背景色清除画布
            this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
            this.ctx.restore();
            this.update(delta);
        }
        _tick();
    }
    animate() {
        let vm = this
        let len = vm.animeObj.length
        //background
        //vm.ctx.fillStyle = "rgba(0,0,0,0)";
        //vm.ctx.fillRect(0, 0, vm.cvs.width, vm.cvs.height);
        vm.ctx.clearRect(0, 0, vm.cvs.width, vm.cvs.height);
        vm.ctx.fillStyle = "#ffffff";
        vm.ctx.strokeStyle = "#ffffff";
        while (len--) {
            vm.animeObj[len].update(vm.cvs, vm.ctx);
        }
        requestAnimationFrame(vm.animate.bind(vm))
    }
    //绘制背景
    drawBg(terCas, terCtx) {
        let vm = this
        // Some random points
        let points: number[] = []
        let displacement = 130
        let width: number = terCas.width
        let height: number = terCas.height
        let power = Math.pow(2, Math.ceil(Math.log(width) / Math.log(2)));

        // set the start height and end height for the terrain
        points[0] = height - (Math.random() * height) / 2.25 - displacement;
        points[power] = height - (Math.random() * height) / 2.25 - displacement;

        // create the rest of the points
        for (var i = 1; i < power; i *= 2) {
            for (var j = power / i / 2; j < power; j += power / i) {
                points[j] =
                    (points[j - power / i / 2] + points[j + power / i / 2]) / 2 +
                    Math.floor(Math.random() * -displacement + displacement);
            }
            displacement *= 0.6;
        }

        // draw the terrain
        terCtx.beginPath();

        for (var i = 0; i <= width; i++) {
            if (i === 0) {
                terCtx!.moveTo(0, points[0]);
            } else if (points[i] !== undefined) {
                terCtx!.lineTo(i, points[i]);
            }
        }

        terCtx.lineTo(width, terCas.height);
        terCtx.lineTo(0, terCas.height);
        terCtx.lineTo(0, points[0]);
        terCtx.fill();
    }
    clearBg() {
        this.isclearBg = true
    }
    // 开始
    start() {
        //this.tick();
        if (!this.isclearBg) {
            this.drawBg(this.tercvs, this.terctx)
        }
        this.createStarV2()
        this.animate()
    }

    // 暂停
    stop() {
        this.isStop = true;
    }
}
