class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('dandy', './assets/placeHolder_dandelion.png');
        this.load.image('seed', './assets/placeHolder_seed.png');
        this.load.image('water', './assets/placeHolder_water.png');
        this.load.image('ground', './assets/placeHolder_ground.png');
        this.load.image('wind', './assets/placeHolder_clickWind.png');
    }

    create () {

        // mouse stuff
        this.input.mouse.capture = true;
        this.input.setDefaultCursor('url(./assets/placeHolder_windMouse.png), pointer');

        

        this.gameOver = false; // to tell if game is over or not
        this.seedDroppped = false;
        this.windPlaced = false;

        this.terrainRange = 0; // number that will be checked 

        this.distanceTraveled = 0; //distance

        // player stats
        this.seedsDropped = 0;
        this.playerHealth = 10;
        this.score = 0;

        this.dropCoolDown = 0;//the duration on when dropping a seed can be used again
        this.windCoolDown = 0;//the duration on when wind can be used again
        this.windDuration = 0;//how long the wind will stay active on screen. This is different from cooldown. This must be less than CoolDown

        // defining keys
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // creating dandelion sprite
        // parameters: x pos, y pos, texture, frame
        this.player = this.physics.add.sprite(config.width/3, config.height/2, 'dandy',0);
        this.player.setGravityY(0); // gravity strength. 5 is good
        this.player.setBounce(0.5, 0.5);
        this.player.setVelocity(0,0);
  

        // terrain types
        this.ground = this.physics.add.sprite(320,720, 'ground',0);
        this.water = this.physics.add.sprite(960,720, 'water',0);
        
       
        this.add.text(20,20, "Play scene");
        this.playerScore = this.add.text(150, 20, this.score);
        this.add.text(300,20, "Distance");
        this.distanceText = this.add.text(440, 20, this.distanceTraveled);
        
    }

    update() {
        
        if (this.playerHealth == 0) {
            this.gameOver = true;
        }

        if (this.gameOver != true) {
            console.log(this.windDuration);

            //while the cool down is not reset to 0, keep removing the value
            if (this.dropCoolDown > 0) {
                this.dropCoolDown -= 1;
            }//end if

            //how logn the wind will be on screen
            if(this.windPlaced = true && this.windDuration > 0) {
                this.windDuration -= 1;
                this.windPlaced = true;
            }
            else if(this.windPlaced=true && this.windDuration <= 0) {
                this.windPlaced = false;
                // this.wind.destroy();
                this.wind.destroy();//we gotta remove the sprite from existing on screen
            }

            //cooldown the wind
            if (this.windCoolDown > 0) {
                this.windCoolDown -= 1;
            }
            // else if(this.windCoolDown <=0) {
            //     this.windPlaced = false;
            // }

            // calculating distance and displaying it
            this.distanceTraveled += 0.01;
            this.distanceText.text = this.distanceTraveled.toFixed(2);

            // when player presses space a seed drops
            //added cooldown for whenever pressed it's set to a value
            if (Phaser.Input.Keyboard.JustDown(keySpace) && this.dropCoolDown <= 0) {
                this.seed = this.physics.add.sprite(this.player.x, this.player.y, 'seed', 0); 
                this.seedDroppped = true;
                this.seed.setGravityY(135);
                this.dropCoolDown = 300;
                // console.log(this.dropCoolDown);
            }

            //Planting the seed
            // still needs more tweaking
            if (this.seedDroppped && this.seed.y >= 700) {
                this.seedDroppped = false;
                this.score += 100;
                this.playerHealth -= 1;
                this.playerScore.text = this.score;
                this.seed.destroy();
            }

            //wind
            if (this.input.activePointer.isDown && this.windCoolDown <= 0 && this.windPlaced==false) {
                
                this.wind = this.physics.add.sprite(this.input.activePointer.position.x+18, this.input.activePointer.position.y+18, 'wind', 0); // wind was offset a bit so now it is place correctly
                //this.wind.setCircle(15);
                this.windCoolDown = 200;
                this.windDuration = 100
                this.windPlaced = true;

                // nvm this does not work </3
               
            }
            if(this.windDuration > 0) {
                this.physics.add.overlap(this.wind, this.player, this.collisionDandelion(this.player));
            }

        }


    }

    // still needs work
    collisionDandelion(player) {
        player.body.velocity.x = -20;
        player.body.velocity.y = -30;
    }



}