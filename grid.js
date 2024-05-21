import {canvas} from "./app.js";
import Invader from "./invader.js";

export default class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 6,
            y: 0
        }

        this.invaders = []

        const cols = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = cols * 30

        for (let i=0; i<cols; i++){
            for(let j=0; j<rows; j++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: i * 30,
                            y: j * 30
                        }
                    })
                )
            }
        }
        console.log(this.invaders)
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0
        //bounce cand ajunge la marginea ecranului + vine mai aproape de player
        if(this.position.x + this.width >= canvas.width ||
            this.position.x <= 0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30

        }
    }
}