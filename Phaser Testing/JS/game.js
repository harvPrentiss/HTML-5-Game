var SPEED = 200;
var GRAVITY = 900;
var JET = 450;

var state = {
	init: function(){
	},
	preload: function(){
		// prelaod any game assets
		this.load.image('wall', 'assets/wall.png');
		this.load.image('background', 'assets/background-texture.png');
		this.load.spritesheet('player', 'assets/player.png', 48,48);
	},
	create: function(){

		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = GRAVITY;

		this.background = this.add.tileSprite(0,0, this.world.width, this.world.height, 'background');

		this.player = this.add.sprite(0,0, 'player');
		this.player.animations.add('fly', [0,1,2], 10, true);
		this.physics.arcade.enableBody(this.player);
		this.player.body.collideWorldBounds = true;

		this.scoreText = this.add.text(this.world.centerX, this.world.height/5, "", {size:"32px", fill:'#FFF', align:'center'});
		this.scoreText.anchor.setTo(0.5, 0.5);

		this.input.onDown.add(this.jet, this);
		this.reset();
	},
	update: function(){
		if(this.gameStarted){
			if(this.player.body.velocity.y > -20){
	            this.player.frame = 3;
	        }
	        else{
	            this.player.animations.play("fly");
	        }

	        if(!this.gameOver){
		        if(this.player.body.bottom >= this.world.bounds.bottom){
		            this.setGameOver();
		        }
		    }
		}
		else{
			this.player.y = this.world.centerY + (8 * Math.cos(this.time.now/200));
		}
	},
	reset: function(){
		this.gameStarted = false;
		this.gameOver = false;
		this.score = 0;
		this.player.body.allowGravity = false;
		this.player.reset(this.world.width / 4, this.world.centerY);
		this.player.animations.play('fly');

		this.background.autoScroll(-SPEED * .80, 0);

		this.scoreText.setText("Touch To\nStart Game");
	},
	start: function(){
		this.player.body.allowGravity = true;
		this.scoreText.setText("Score\n"+this.score);
		this.gameStarted = true;
	},
	setGameOver: function(){
	    this.gameOver = true;
	    this.scoreText.setText("FINAL SCORE\n"+ this.score+"\n\nTOUCH TO\nTRY AGAIN");
		this.background.autoScroll(0, 0);
		this.timeOver = this.time.now;
	},
	jet: function(){
		if(!this.gameStarted){
			this.start();
		}
		if(!this.gameOver){
			this.player.body.velocity.y = -JET;
		}
		else if(this.time.now > this.timeOver + 400){
		    this.reset();
		}
	}
}

var game = new Phaser.Game(
	800, 600,
	Phaser.AUTO,
	'game',
	state
);