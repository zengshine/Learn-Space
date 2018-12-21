
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
    update(ctx) {
        this.x -= this.speed;
        if (this.x < 0) {
            this.reset(ctx);
        } else {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}
// 流星
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


// 流星雨
export class MeteorShower {
    cvs: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    stars: Array<Star>
    shootingStars: Array<ShootingStar>
    T: number
    isStop: boolean
    playing: boolean
    constructor(cvs, ctx) {
        this.cvs = cvs
        this.ctx = ctx
        this.stars = []
        this.shootingStars = []
        this.T = 0
        this.isStop = false
        this.playing = false
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
    //绘制背景
    drawBg(terCas, terCtx) {
        // Some random points
        let points: number[] = []
        let displacement = 140
        let width: number = terCas.width
        let height: number = terCas.height
        let power = Math.pow(2, Math.ceil(Math.log(width) / Math.log(2)));

        // set the start height and end height for the terrain
        points[0] = height - (Math.random() * height) / 2 - displacement;
        points[power] = height - (Math.random() * height) / 2 - displacement;

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
    // 开始
    start() {
        this.tick();
    }

    // 暂停
    stop() {
        this.isStop = true;
    }
}
