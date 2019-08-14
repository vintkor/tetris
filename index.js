function copy(o) {
    // Deep copy
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

class Figure {
    constructor() {
        this.map = []
        this.canvas = document.getElementById('figure')
        this.ctx = this.canvas.getContext('2d')
    }

    clear() {
        this.ctx.clearRect(0, 0, 220, 407)
    }

    draw(gameInitials) {
        this.clear()
        for (let row = 0; row < this.map.length; row++) {
            const el = this.map[row]
            for (let col = 0; col < el.length; col++) {
                if (el[col]) {
                    this.ctx.fillRect(col * 11 + gameInitials[0], row * 11 + gameInitials[1], 10, 10)
                }
            }
        }
    }

    rotate() {
        const reverceMatrix = copy(this.map).reverse()
        const newFigure = []

        for (let col = 0; col < reverceMatrix[0].length; col++) {

            const temp = []
            for (let row = 0; row < reverceMatrix.length; row++) {
                temp.push(reverceMatrix[row][col])
            }
            newFigure.push(temp)

        }

        this.map = newFigure;
    }
}

class BFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.map = [
            [1, 1],
            [1, 1],
        ]
    }
}

class IFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.map = [
            [1],
            [1],
            [1],
            [1],
        ]
    }
}

class LFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.map = [
            [1, 0],
            [1, 0],
            [1, 1],
        ]
    }
}

class TFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.map = [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
        ]
    }
}

class ZFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.map = [
            [1, 1, 0],
            [0, 1, 1],
        ]
    }
}

class longZFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.map = [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ]
    }
}

class Game {
    constructor() {
        this.figures = [
            // new BFigure(),
            // new IFigure(),
            // new LFigure(),
            new TFigure(),
            // new ZFigure(),
            // new longZFigure(),
        ]
        this.gameMap = []
        this.generateGameMap()
        this.keyCodes = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Space", "Enter"]
        this.canvas = document.getElementById('game')
        this.ctx = this.canvas.getContext('2d')
        this.eventListener()
        this.loop = null
        this.pause = false
        this.isGameOver = false
        this.speed = 1.5
        this.size = 11
        this.figure = null
        this.initial = [this.size * 9, this.size * 0]
        this.choiseRandomFigure()
    }

    generateGameMap() {
        for (let i = 0; i < 40; i++) {
            const row = []
            for (let j = 0; j < 20; j++) {
                row.push(0)
            }
            this.gameMap.push(row)
        }
    }

    choiseRandomFigure() {
        this.figure = this.figures[Math.floor(Math.random() * this.figures.length)]
    }

    move(eventCode) {
        if (eventCode == 'ArrowLeft') {
            if (!(this.initial[0] - this.size < 0)) this.initial[0] -= this.size
        } else if (eventCode == 'ArrowRight') {
            const math = this.initial[0] + this.size * this.figure.map[0].length
            if (math < 220) this.initial[0] += this.size
        }
        this.figure.draw(this.initial)
    }

    fall() {
        this.initial[1] += this.size
    }

    clear() {
        this.ctx.clearRect(0, 0, 220, 407)
    }

    drawGameField() {
        this.ctx.fillStyle = "rgb(50,50,50)"
        for (let row = 0; row < this.gameMap.length; row++) {
            for (let col = 0; col < this.gameMap.length; col++) {
                if (this.gameMap[col][row]) {
                    this.ctx.fillRect(row * 11, col * 11, 10, 10)
                }
            }
        }
    }

    run() {
        if (!this.isGameOver) {
            this.loop = setInterval(() => {
                this.figure.draw(this.initial)
                this.drawGameField()
                this.fall()
            }, 1000 / this.speed);
        }
    }

    pauseSwitcher() {
        this.pause = !this.pause
        if (this.pause) clearInterval(this.loop)
        else this.run()
    }

    keyboardHandle(self, event) {
        const eventCode = event.code
        if (self.keyCodes.includes(eventCode)) {
            if (eventCode == 'Enter') {
                self.pauseSwitcher()
            } else if (eventCode == 'Space') {
                this.figure.rotate()
                this.figure.draw(this.initial)
            }
            else {
                self.move(eventCode)
            }
        }
    }

    eventListener() {
        let self = this
        document.addEventListener('keydown', event => this.keyboardHandle(self, event), false)
    }
}

new Game().run()