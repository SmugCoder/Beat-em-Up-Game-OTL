class GameScene extends Phaser.Scene {

  playerOriginalWidth = 0;
  playerOriginalHeight = 0;  
  enemyCopies = [];

  constructor() {
    super({ key: 'GameScene' });
    //global deklarieren
    this.cursors = null; 
    this.attackKey = null;
    this.player = null;

    this.enemy = null;
    this.wand = null;
    this.playerHP = 100;
    this.enemyHP = 100;
    this.playerHPBar = null;
    this.enemyHPBar = null;
    this.isAttacking = false;
    this.canFollow = true;
    this.enemyAttackIsHappening = false;
  }

  preload() {
    // Asset laden
    //player 
    //idle
    this.load.spritesheet('idleplayer', 'assets/3 Cyborg/Cyborg_idle.png',{
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });

    //run
    this.load.spritesheet('runplayer', 'assets/3 Cyborg/Cyborg_run.png', {
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });

    //attack 1
    this.load.spritesheet('attackplayer', 'assets/3 Cyborg/Cyborg_attack1.png', {
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });

    //hurt
    this.load.spritesheet('hurtplayer', 'assets/3 Cyborg/Cyborg_hurt.png',{
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });   
    
    //dead
    this.load.spritesheet('deadplayer', 'assets/3 Cyborg/Cyborg_death.png',{
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    }); 

    //enemy
    //idle
    this.load.spritesheet('idleenemy', 'assets/2 Punk/Punk_idle.png',{
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });

    //run
    this.load.spritesheet('runenemy', 'assets/2 Punk/Punk_run.png', {
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });

    //attack 1
    this.load.spritesheet('attackenemy', 'assets/2 Punk/Punk_attack1.png', {
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });

    //hurt
    this.load.spritesheet('hurtenemy', 'assets/2 Punk/Punk_hurt.png',{
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });   
    
    //dead
    this.load.spritesheet('deadenemy', 'assets/2 Punk/Punk_death.png',{
      frameWidth: 48, // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    }); 

    // HP bar 
    this.load.image('hpbar', 'assets/HPBars/hpbar.png');
  }


  create() {
    // Initializieren
    
    //player erstellen
    this.player = this.physics.add.sprite(100, 100, 'idleplayer');
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(18, 36);
    this.player.body.setOffset(5, 12);
    this.playerOriginalWidth = 18;
    this.playerOriginalHeight = 36;
    
    //animation player
    //idle 
    this.anims.create({
      key: 'playerIdle',
      frames: this.anims.generateFrameNumbers('idleplayer', { start: 0, end: 3 }),
      frameRate: 6, // framerate der animation
      repeat: -1, // -1 um es unendlich lang zu wiederholen 
    });

    //run
    this.anims.create({
      key: 'playerRun',
      frames: this.anims.generateFrameNumbers('runplayer', { start: 0, end: 5 }),
      frameRate: 9, // framerate der animation
      repeat: -1, // -1 um es unendlich lang zu wiederholen 
    });
    
    //attack
    this.anims.create({
      key: 'playerAttack',
      frames: this.anims.generateFrameNumbers('attackplayer', { start: 0, end: 5 }),
      frameRate: 18,
      repeat: 0,
    });

    //hurt 
    this.anims.create({
      key: 'playerHurt',
      frames: this.anims.generateFrameNumbers('hurtplayer', { start: 0, end: 1 }),
      frameRate: 6, // framerate der animation
      repeat: 0, // -1 um es unendlich lang zu wiederholen 
    });    

    //dead 
    this.anims.create({
      key: 'playerDead',
      frames: this.anims.generateFrameNumbers('deadplayer', { start: 0, end: 5 }),
      frameRate: 9, // framerate der animation
      repeat: 0, // -1 um es unendlich lang zu wiederholen 
    });

    //physic fuer den player
    this.physics.add.existing(this.player);

    // Spielt die idle animation des players ab
    this.player.anims.play('playerIdle', true);

    //enemy erstellen
    const createEnemy = (x, y) => {
      const enemy = this.physics.add.sprite(x, y, 'idleenemy');
      // Additional configuration and logic for the enemy sprite
      enemy.body.setSize(18, 36);
      enemy.body.setOffset(5, 12);
      return enemy;
    };

    // Create enemy copies
    this.enemy = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
      const enemyCopy = createEnemy(Phaser.Math.Between(200, 600), Phaser.Math.Between(100, 400));
      enemyCopies.push(enemyCopy);
    }

    //animation enemy
    //idle 
    this.anims.create({
      key: 'enemyIdle',
      frames: this.anims.generateFrameNumbers('idleenemy', { start: 0, end: 3 }),
      frameRate: 6, // framerate der animation
      repeat: -1, // -1 um es unendlich lang zu wiederholen 
    });

    //run
    this.anims.create({
      key: 'enemyRun',
      frames: this.anims.generateFrameNumbers('runenemy', { start: 0, end: 5 }),
      frameRate: 9, // framerate der animation
      repeat: -1, // -1 um es unendlich lang zu wiederholen 
    });
    
    //attack
    this.anims.create({
      key: 'enemyAttack',
      frames: this.anims.generateFrameNumbers('attackenemy', { start: 0, end: 5 }),
      frameRate: 18,
      repeat: 0,
    });

    //hurt 
    this.anims.create({
      key: 'enemyHurt',
      frames: this.anims.generateFrameNumbers('hurtenemy', { start: 0, end: 1 }),
      frameRate: 6, // framerate der animation
      repeat: 0, // -1 um es unendlich lang zu wiederholen 
    });    

    //dead 
    this.anims.create({
      key: 'enemyDead',
      frames: this.anims.generateFrameNumbers('deadenemy', { start: 0, end: 5 }),
      frameRate: 9, // framerate der animation
      repeat: 0, // -1 um es unendlich lang zu wiederholen 
    });

    // Spielt die idle animation des gegners ab
    this.enemy.getChildren().forEach(enemy => {
      enemy.play('enemyIdle');
    });
    this.enemy.getChildren().forEach(enemy => {
      enemy.setCollideWorldBounds(true);
    });


    //HP bars setup 
    const hpBarWidth = 100;
    const hpBarHeight = 10;

    // spieler HP bar
    this.playerHPBar = this.add.graphics();
    this.playerHPBar.fillStyle(0xff0000);
    this.playerHPBar.fillRect(100, 20, hpBarWidth, hpBarHeight);

    // gegner HP bar
    this.enemyHPBar = this.add.graphics();
    this.enemyHPBar.fillStyle(0xff0000);
    this.enemyHPBar.fillRect(400, 20, hpBarWidth, hpBarHeight);

    // Collider zwischen Player und Enemy hinzufügen
    this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this);


    //Wandgruppe erstellen
    this.wand = this.physics.add.staticGroup();

    /*eine einziege wand erstellen
    const wand = this.wand.create(0, 0, 'wand');
    wandgroesse setzten
    wand.setSize(1600, 64);*/

    //world border
    const { width, height } = this.physics.world.bounds;

    // Top
    this.wand.create(width * 0.5, 0, 'wand').setDisplaySize(width, 16).refreshBody();
  
    // Bot
    this.wand.create(width * 0.5, height, 'wand').setDisplaySize(width, 16).refreshBody();
  
    // Links
    this.wand.create(0, height * 0.5, 'wand').setDisplaySize(16, height).refreshBody();
  
    // Rechts
    this.wand.create(width, height * 0.5, 'wand').setDisplaySize(16, height).refreshBody();
  
    
    // Collider zwischen Player und Wand hinzufügen
    this.physics.add.collider(this.player, this.wand);

    // Input des players
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown',this.handleKeyDown, this);
  }
  


  handleKeyDown(event) {
    if (event.code === 'KeyJ'&& !this.isAttacking){
      console.log("Angriff");
      this.attack();
    }
  }

  attack() {
      const attackWidth = 36;
      this.isAttacking = true;
      this.player.anims.stop();

      if (this.player.scaleX === 1) { // Player looks right
        this.player.body.setSize(attackWidth);
        this.player.body.setOffset(5, 12);
      } else { // Player looks left
        this.player.body.setSize(attackWidth);
        this.player.body.setOffset(attackWidth + 5, 12);
      }

      this.player.anims.play('playerAttack');
      this.player.on('animationcomplete', this.handleAttackComplete, this);
  }

  handleAttackComplete(animation, frame) {
    console.log("Attack complete");
    this.isAttacking = false;
    const damage = 10; // Set the damage value
    
    // Check if the player's hitbox overlaps with the enemy's hitbox
    if (this.physics.overlap(this.player, this.enemy)) {
      this.enemy.anims.stop(); // Stop any previous animations
      this.enemy.anims.play('enemyHurt'); // Play the hurt animation
    
      this.enemyHP -= damage; // Reduce enemy's HP by the damage value
    
      if (this.enemyHP < 0) {
        this.enemyHP = 0; // Make sure the HP value doesn't go below 0
      }
      this.updateEnemyHPBar(); // Update the enemy's HP bar
    
      // If HP is 0 or less, then the enemy is defeated
      if (this.enemyHP <= 0) {
        this.enemyDefeated();
      } else {
        // If the enemy is still alive, play the idle animation after a short delay
        this.time.delayedCall(300, () => {
          this.enemy.anims.stop();
          this.enemy.anims.play('enemyIdle');
        });
      }
    }
    if(this.player.scaleX === 1){
    this.player.body.setSize(this.playerOriginalWidth, this.playerOriginalHeight);
    this.player.body.setOffset(5, 12);
    } else {
      this.player.body.setSize(this.playerOriginalWidth, this.playerOriginalHeight);
      this.player.body.setOffset(21, 12);  
    }
    
    // Remove the event listener
    this.player.off('animationcomplete', this.handleAttackComplete, this);
  }

  enemyDefeated() {
    console.log("Enemy defeated");
    
    // Stop any previous animations and play the dead animation
    this.enemy.anims.stop();
    this.enemy.anims.play('enemyDead');
    this.time.delayedCall(750, () => {
    // Remove the enemy from the scene
    this.enemy.destroy();
    this.enemyHPBar.clear(); // Clear the enemy's HP bar
    });
  }

  // Create the enemy's HP bar
  createEnemyHPBar() {
    const hpBarWidth = 100;
    const hpBarHeight = 10;
    const x = 400; // X-coordinate of the HP bar
    const y = 20; // Y-coordinate of the HP bar

    this.enemyHPBar = this.add.graphics();
    this.enemyHPBar.fillStyle(0xff0000);
    this.enemyHPBar.fillRect(x, y, hpBarWidth, hpBarHeight);
  }

  // Update the enemy's HP bar
  updateEnemyHPBar() {
    const hpBarWidth = 100;
    const hpBarHeight = 10;
    const x = 400; // X-coordinate of the HP bar
    const y = 20; // Y-coordinate of the HP bar
    const remainingPercent = this.enemyHP / 100; // Calculate the remaining HP percentage
    const remainingWidth = hpBarWidth * remainingPercent;

    this.enemyHPBar.clear();
    this.enemyHPBar.fillStyle(0xff0000);

    if (remainingPercent > 0) {
      this.enemyHPBar.fillRect(x, y, remainingWidth, hpBarHeight);
    }
  }

  updateHealthBars() {
    const playerMaxHP = 100; // Set the maximum HP for the player
    const remainingPercent = this.playerHP / playerMaxHP; // Calculate the remaining HP percentage
    const remainingWidth = this.playerHPBar.width * remainingPercent;
  
    this.playerHPBar.clear();
    this.playerHPBar.fillStyle(0xff0000);
  
    if (remainingPercent > 0) {
      this.playerHPBar.fillRect(this.playerHPBar.x, this.playerHPBar.y, remainingWidth, this.playerHPBar.height);
    }
  }
  
  updateHPBar(bar, currentValue, maxValue) {
    const remainingPercent = currentValue / maxValue; // Calculate the remaining HP percentage
    const remainingWidth = bar.width * remainingPercent;
  
    bar.clear();
    bar.fillStyle(0xff0000);
  
    if (remainingPercent > 0) {
      bar.fillRect(bar.x, bar.y, remainingWidth, bar.height);
    }
  }

  enemyAttack() {
    if (this.attackEnemyIsHappening) {
      return;
    }
    const attackWidth = 36;
    this.canFollow = false;
    this.attackEnemyIsHappening = true;
  
    console.log("Gegner schlagen dich");
  
    // Stop the enemy's movement
    this.enemy.setVelocity(0, 0);
    // Play the attack animation for the enemy
    this.enemy.anims.play('enemyAttack', true);
    if (this.enemy.scaleX === 1) { // Enemy looks right
      this.enemy.body.setSize(attackWidth);
      this.enemy.body.setOffset(5, 12);
    } else { // Enemy looks left
      this.enemy.body.setSize(attackWidth);
      this.enemy.body.setOffset(attackWidth + 5, 12);
    }
    setTimeout(() => {
      // Start the running animation for the enemy
      this.enemy.anims.play('enemyIdle', true);
    }, 300);
    setTimeout(() => {
      // Resume following the player
      this.canFollow = true;
      this.attackEnemyIsHappening = false;
  
      // Start the running animation for the enemy
      this.enemy.anims.play('enemyRun', true);
      if(this.enemy.scaleX === 1){
        this.enemy.body.setSize(this.playerOriginalWidth, this.playerOriginalHeight);
        this.enemy.body.setOffset(5, 12);
        } else {
          this.enemy.body.setSize(this.playerOriginalWidth, this.playerOriginalHeight);
          this.enemy.body.setOffset(21, 12);  
        }
    }, 700);
  }
  
  enemyCaughtUp(){
    var distance = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
    return distance < 45;
  }

  enemyFollows(enemy) {
    if (this.canFollow) {
      const speed = 100;
      const enemyPosition = new Phaser.Math.Vector2(enemy.x, enemy.y);
      const playerPosition = new Phaser.Math.Vector2(this.player.x, this.player.y);
      const direction = playerPosition.subtract(enemyPosition).normalize();
  
      enemy.body.setVelocity(direction.x * speed, direction.y * speed);
      enemy.anims.play('enemyRun', true);
  
      if (direction.x > 0) {
        enemy.flipX = false; // Face right
        enemy.body.setOffset(5, 12);
      } else {
        enemy.flipX = true; // Face left
        enemy.body.setOffset(24, 12);
      }
    }
  }
  
  update() {
    
    for (let i = 0; i < enemyCopies.length; i++) {
      this.enemyFollows(enemyCopies[i]);
    }
    // Movement logic for player
    if (this.cursors.left.isDown && !this.isAttacking) {
      this.player.x -= 3.5;
      this.player.body.setOffset(24, 12);
      this.player.setScale(-1, 1);
      this.player.anims.play('playerRun', true);
    } else if (this.cursors.right.isDown && !this.isAttacking) {
      this.player.x += 3.5;
      this.player.body.setOffset(5, 12);
      this.player.setScale(1, 1);
      this.player.anims.play('playerRun', true);
    } else if (this.cursors.up.isDown && !this.isAttacking) {
      this.player.y -= 2.5;
      this.player.anims.play('playerRun', true);
    } else if (this.cursors.down.isDown && !this.isAttacking) {
      this.player.y += 2.5;
      this.player.anims.play('playerRun', true);
    } else if(!this.isAttacking) {
      this.player.setVelocity(0); // Set velocity to 0 in both X and Y directions
      this.player.anims.play('playerIdle', true);
    }
  }
}

//konfigurationen furs spiel
const config = {
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true //debug modus
    },
  },
};
//Phaser game instance
const game = new Phaser.Game(config);
//start der GameScene
game.scene.start('GameScene');

