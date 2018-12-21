// 坐标
class Crood {
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

// 流星
class ShootingStar {
    constructor(pos = new Crood, final = new Crood, size = 3, speed = 200, onDistory = null) {
        this.position = pos; // 初始位置
        this.final = final; // 最终位置
        this.size = size; // 大小
        this.speed = speed; // 速度：像素/s

        // 飞行总时间
        this.dur = Math.sqrt(Math.pow(this.final.x - this.position.x, 2) + Math.pow(this.final.y - this.position.y, 2)) * 1000 / this.speed;

        this.pass = 0; // 已过去的时间
        this.prev = this.position.copy(); // 上一帧位置
        this.now = this.position.copy(); // 当前位置
        this.onDistory = onDistory;
    }
    draw(ctx, delta) {
        this.pass += delta;
        this.pass = Math.min(this.pass, this.dur);

        let percent = this.pass / this.dur;

        this.now.setCrood(
            this.position.x + (this.final.x - this.position.x) * percent,
            this.position.y + (this.final.y - this.position.y) * percent
        );

        // canvas
        ctx.strokeStyle = '#fff';
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.now.x, this.now.y);
        ctx.lineTo(this.prev.x, this.prev.y);
        ctx.stroke();

        this.prev.setCrood(this.now.x, this.now.y);
        if (this.pass === this.dur) {
            this.distory();
        }
    }
    distory() {
        this.onDistory && this.onDistory();
    }
}


// 流星雨
class MeteorShower {
    constructor(cvs, ctx) {
        this.cvs = cvs;
        this.ctx = ctx;
        this.shootingStars = [];
        this.T;
        this.stop = false;
        this.playing = false;
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
        if (!this.stop && this.shootingStars.length < 40) {
            this.shootingStars.push(this.createStar());
        }
        this.shootingStars.forEach((star) => {
            star.draw(this.ctx, delta);
        });
    }

    tick() {
        if (this.playing) return;
        this.playing = true;
        this.stop = false;

        let now = (new Date()).getTime();
        let last = now;
        let delta;

        let _tick = () => {
            if (this.stop && this.shootingStars.length === 0) {
                cancelAnimationFrame(this.T);
                this.playing = false;
                return;
            }

            delta = now - last;
            delta = delta > 500 ? 30 : (delta < 16 ? 16 : delta);
            last = now;
            // console.log(delta);

            this.T = requestAnimationFrame(_tick);

            //ctx.save();
            // ctx.globalCompositeOperation = "destination-in";
            // ctx.fillStyle = 'rgba(0,0,0,0.8)'; // 每一帧用 “半透明” 的背景色清除画布
            // ctx.fillRect(0, 0, cvs.width, cvs.height);
            //ctx.restore();
            this.update(delta);
        }
        _tick();
    }
    drawBackground() {

    }
    // 开始
    start() {
        this.tick();
    }

    // 暂停
    stop() {
        this.stop = true;
    }
}

let cvs = document.querySelector('canvas');
let ctx = cvs.getContext('2d');
let meteorShower = new MeteorShower(cvs, ctx);
meteorShower.start();