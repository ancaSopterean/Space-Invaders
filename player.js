
import {canvas,c} from "./app.js"

export default class Player{
    constructor() {
        this.rotation = 0
        this.opacity = 1

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();
        image.src = './images/spaceship.png'
        image.onload = () => {
            const scale = .15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
            this.loaded = true
        }


    }


    draw() {
        if (!this.loaded) return;

        c.save() //takes a snapshot of the player so that when I rotate it won't rotate the whole canvas
        c.globalAlpha = this.opacity
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )

        c.rotate(this.rotation)

        c.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        )

        c.drawImage(this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        c.restore()
    }

    update(){
        if(this.loaded) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

