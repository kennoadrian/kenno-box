const 
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),

    TIME_LIMIT = 10,
    EXTRA_TIME_PER_HIT = 1

let 
    sprite, scorer, timer, start, gameOver, animation, stopper;

const 
    setSize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    },

    init = () => {
        gameOver = false
        stopper = false
        start = performance.now()
        setSize()
        clearScreen()
    
        timer = new Timer(TIME_LIMIT * 1000)
        scorer = new Score()
        sprite = new Sprite(100)

        animation = requestAnimationFrame(animate)
    },

    handleClick =  e => {
        if(gameOver && stopper) {
            clearScreen()
            cancelAnimationFrame(animation)
            init()
        } else {
            sprite.click(e)
        }
    }, 

    animate = (time) => {
        let delta = time - start
            
        clearScreen()

        scorer.draw()
        timer.update(delta)
        sprite.draw()

        if(gameOver) gameOverScreen()
        else requestAnimationFrame(animate)
    },

    clearScreen = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    },

    gameOverScreen = () => {
        clearScreen()
        
        ctx.fillStyle = '#2f2f2f'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#fcfcfc'
        ctx.fillText("Game Over", canvas.width / 2, canvas.height * 0.45)

        ctx.font = '600 48px Arial'
        ctx.fillText("Score:  " + scorer.value, canvas.width/2, canvas.height * 0.6)

        setTimeout(() => {
            ctx.font = '100 1rem Arial'
            ctx.fillText("click anywhere to continue", canvas.width / 2, canvas.height * 0.9)

            stopper = true
        }, 1000)
    }

class Score {
    constructor() {
        this.value = 0
    }

    draw() {
        ctx.font = '800 64px Arial'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#F0DBAF'
        ctx.fillText(this.value, canvas.width / 2,  100)
    }
}

class Timer {
    constructor(duration) {
        this.duration = duration
        this.currentTime = canvas.width
        this.extraTime = 0
    }

    update(delta) {
        delta /= this.duration
        this.remainingTime = 1 - delta
        this.currentTime = (this.remainingTime + this.extraTime) * canvas.width

        if(this.currentTime <= 0) gameOver = true

        this.draw()
    }

    draw() {
        ctx.fillStyle = '#e60707'
        ctx.fillRect(0, 0, this.currentTime, 10)
    }

    addTime() {
        this.extraTime += 0.05 * EXTRA_TIME_PER_HIT
    }
}

class Sprite {
    constructor(r) {
        this.r = r
        this.x = (canvas.width / 2) - (r / 2)
        this.y = canvas.height * 0.7
    }

    update() {
        this.r -= this.r > 20 ? 3 : 0
        this.draw()
    }

    setNewCoord() {
        this.x = Math.floor(Math.random() * (canvas.width - this.r))
        this.y = Math.floor(Math.random() * (canvas.height - this.r))
    }

    draw() {
        if(gameOver) return
        ctx.fillStyle = '#e2cd0a'
        ctx.fillRect(this.x, this.y,  this.r, this.r)
    }

    click(e) {
        if(!this.inBound(e)) return
        
        scorer.value++
        timer.addTime()
        this.setNewCoord()
        this.update()
    }

    inBound(e) {
        return  e.clientX > this.x && 
                e.clientY > this.y &&
                e.clientX < this.x + this.r && 
                e.clientY < this.y + this.r
    }
}

addEventListener('DOMContentLoaded', init)
addEventListener('resize',  setSize)
addEventListener('click', handleClick)
