const config = {
    type: Phaser.AUTO,
    parent: 'game-canvas',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true, // keeps pixel art sharp
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 1500 },
            debug: false 
        }
    },
    scene: { preload: preload, create: create }
};

const game = new Phaser.Game(config);

let player;
let platforms;

function preload() {
    this.load.image('idle1', 'assets/idle/idling1.png');
    this.load.image('idle2', 'assets/idle/idling2.png');
    this.load.image('idle3', 'assets/idle/idling3.png');
    this.load.image('idle4', 'assets/idle/idling4.png');
    
    // 1. Make sure the ground image is actually loaded here!
    this.load.image('ground', 'assets/platform.png'); 

    // 2. Load the background
    this.load.image('bg_image', 'assets/background/bg.png'); 
}

function create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // --- ⬇️ ADD BACKGROUND FIRST ⬇️ ---
    // We add it at the center (w/2, h/2)
    let bg = this.add.image(w / 2, h / 2, 'bg_image');
    
    // Make it cover the whole screen
    bg.setDisplaySize(w, h);

    // CRITICAL: This keeps the background pinned to the camera 
    // so it doesn't "slide away" when the camera follows the player.
    bg.setScrollFactor(0); 
    // --- ⬆️ BACKGROUND ADDED ⬆️ ---

    this.cameras.main.setBackgroundColor('#050a0f');

    // 2. Platforms
    platforms = this.physics.add.staticGroup();
    let ground = platforms.create(w / 2, h - 30, 'ground');
    ground.setDisplaySize(w * 10, 60).refreshBody();
    ground.setTint(0x00ff41);

    // 3. Player
    player = this.physics.add.sprite(w * 0.15, h - 300, 'idle1');
    player.setScale(0.5); 
    player.setFlipX(true); 
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // 4. Animation
    this.anims.create({
        key: 'idle',
        frames: [{key:'idle1'},{key:'idle2'},{key:'idle3'},{key:'idle4'}],
        frameRate: 2,
        repeat: -1
    });
    player.play('idle');

    // 5. Camera (Keep player on left)
    this.cameras.main.removeBounds();
    this.cameras.main.setZoom(2.2);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    this.cameras.main.setFollowOffset(300, 0); 
}

// Function to handle the menu button clicks
function handleNav(section) {
    // Hide the UI buttons
    const ui = document.getElementById('ui-layer');
    if(ui) ui.classList.add('hidden');
    
    // Smooth cinematic zoom out first
    this.cameras.main.zoomTo(1.0, 1500, 'Power2');

    // Stop following so the camera stays centered on the menu while player leaves
    this.cameras.main.stopFollow();

    // Small delay so the user sees the zoom out start
    this.time.delayedCall(500, () => {
        // --- ⬇️ UPDATE FLIP FOR WALKING ⬇️ ---
        // If he was flipped to look left, we un-flip him so he walks forward
        player.setFlipX(false); 
        // --- ⬆️ UPDATE FLIP FOR WALKING ⬆️ ---

        player.setCollideWorldBounds(false); 
        player.setVelocityX(800); 

        // Redirect or perform action after exit animation
        setTimeout(() => {
            console.log("Navigating to: " + section);
            // location.href = section + ".html"; // Future link
            location.reload(); 
        }, 1500);
    });
}