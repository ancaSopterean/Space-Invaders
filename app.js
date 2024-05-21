
export const scoreEl = document.getElementById('scoreEl');
export const canvas = document.querySelector('canvas');
export const c= canvas.getContext('2d');

import Player from "./player.js";
import Projectile, {Particle} from "./projectiles.js";
import Grid from "./grid.js";

canvas.width = 1024;
canvas.height = 576;


const player = new Player();
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

const keys ={
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)

let game = {
    over: false,
    active: true
}

let score = 0


//creates star particles for the brackground
for(let i=0; i<100; i++){
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.5
        },
        radius: Math.random() * 2,
        color: 'white'
    }))
}




function createParticles({object,color,fades}){
    //create explosion
    for(let i=0; i<15; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            fades: fades
        }))
    }
}



function animate(){
    if(!game.active) return
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)

    player.update()


    particles.forEach((particle,i) =>{

        //recycling bg particles instead of creating new ones
        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

            if(particle.opacity <= 0){
                setTimeout(() =>{
                    particles.splice(i,1)
                },0)

            }
            else{
                particle.update()
            }
    }
    )

    invaderProjectiles.forEach((invaderProjectile, index) => {

        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            },0)
        } else invaderProjectile.update()

        //projectile hits player
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y
        && invaderProjectile.position.x + invaderProjectile.width >= player.position.x
        && invaderProjectile.position.x <= player.position.x + player.width){

            console.log("you lost")
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                //make player disappear
                player.opacity = 0
                game.over = true
            },0)

            setTimeout(() => {
                game.active = false
                alert("game over\nscore: "+score)
                location.reload()
            },2000)


            createParticles({
                object: player,
                color: 'white',
                fades: true
            })
        }

    })

    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1)
            },0)
        } else{
            projectile.update()
        }
    })

    grids.forEach((grid,gridIndex) => {
        grid.update()

        //spawning enemy projectiles
        if (frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)]
                .shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader,i) => {
            invader.update({velocity: grid.velocity})

            //projectile shoot enemy
            projectiles.forEach((projectile,j) => {
                //collision detection
                if(projectile.position.y - projectile.radius <=
                invader.position.y + invader.height &&
                projectile.position.x + projectile.radius >=
                invader.position.x && projectile.position.x - projectile.radius
                    <= invader.position.x + invader.width && projectile.position.y +
                projectile.radius >= invader.position.y){






                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) =>  invader2 === invader
                        )

                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )

                        //remove invader and projectiles
                        if(invaderFound && projectileFound){
                            score += 100
                            scoreEl.innerHTML = score

                            createParticles({
                                object: invader,
                                fades: true
                            })

                            grid.invaders.splice(i,1)
                            projectiles.splice(j,1)

                            if(grid.invaders.length > 0){
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]
                                grid.width = lastInvader.position.x - firstInvader.position.x
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }

                    }, 0)
                }
            })
        })
    })


    //rotating animation to player
    if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -8
        player.rotation = -.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 8
        player.rotation = .15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    //spawning enemies
    if(frames %  randomInterval === 0){
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }

    frames++
}

animate()


//handling key presses
addEventListener('keydown', ({key}) => {
    if(game.over) return
    switch (key){
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y + player.height / 4
                    }, velocity: {
                        x: 0,
                        y: -10
                    }
                })
            )
            console.log(projectiles)
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key){
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            break
    }
})