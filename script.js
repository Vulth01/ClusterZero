document.addEventListener("DOMContentLoaded", function() {
    const player1 = document.querySelector('.player.player1');
    const player2 = document.querySelector('.player.player2');
    const projectilesContainer = document.querySelector('.projectiles');

    const playerWidth = player1.offsetWidth;
    const playerHeight = player1.offsetHeight;
    const gameWidth = document.querySelector('.game-container').offsetWidth;
    const gameHeight = document.querySelector('.game-container').offsetHeight;
    const playerStartingHealth = 100;
    
    var player1object = [ {height: 50, width: 50, health: 100} ];
    var player2object = [ {height: 50, width: 50, health: 100} ];

    let player1Movement = { left: false, right: false, up: false, down: false };
    let player2Movement = { left: false, right: false, up: false, down: false };

    // PLAYER 1 MOVEMENT
    function movePlayer1() {

        if(player1object.health <= 0){
            player2.classList.add('dead-player1');
        }

        if(player1.offsetLeft > gameWidth/2 - 50)                                            //Restrict to right side of screen
        {
            player1.style.left = player1.offsetLeft - 5 + 'px';
        }

        if (player1Movement.left && player1.offsetLeft > 0) {
            player1.style.left = player1.offsetLeft - 5 + 'px';
        }
        if (player1Movement.right && player1.offsetLeft + playerWidth < gameWidth) {
            player1.style.left = player1.offsetLeft + 5 + 'px';
        }
        if (player1Movement.up && player1.offsetTop > 0) {
            player1.style.top = player1.offsetTop - 5 + 'px';
        }
        if (player1Movement.down && player1.offsetTop + playerHeight < gameHeight) {
            player1.style.top = player1.offsetTop + 5 + 'px';
        }
    }

    // PLAYER 2 MOVEMENT
    function movePlayer2() {
        
        if(player1object.health <= 0){
            player2.classList.add('dead-player2');
        }
        
        if(player2.offsetLeft < gameWidth/2)                                            //Restrict to right side of screen
        {
            player2.style.left = player2.offsetLeft + 5 + 'px';
        }

        if (player2Movement.left && player2.offsetLeft > 0) {
            player2.style.left = player2.offsetLeft - 5 + 'px';
        }
        if (player2Movement.right && player2.offsetLeft + playerWidth < gameWidth) {
            player2.style.left = player2.offsetLeft + 5 + 'px';
        }
        if (player2Movement.up && player2.offsetTop > 0) {
            player2.style.top = player2.offsetTop - 5 + 'px';
        }
        if (player2Movement.down && player2.offsetTop + playerHeight < gameHeight) {
            player2.style.top = player2.offsetTop + 5 + 'px';
        }
    }

    // Check collision between projectile and player
    function checkCollision(projectile, player) {
        const projectileRect = projectile.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        return (
            projectileRect.left < playerRect.right &&
            projectileRect.right > playerRect.left &&
            projectileRect.top < playerRect.bottom &&
            projectileRect.bottom > playerRect.top
        );
    }

    // Update player health
    function updatePlayerHealth(player, health) {
        
        // Update player1 object
        if (player === player1) {
            player1object[0].health = health;
            
        }
        
        // Update player2 object
        else if (player === player2) {
            player2object[0].health = health;
        }

        player.classList.add("check-player2");
        setTimeout(() => { player.classList.remove("check-player2"); }, 2000); 

        // Check if player is dead
        if (health <= 0) {
            player.classList.add('dead-player');
        }
    }

    // PLAYER 1 PROJECTILE
    function shootProjectilePlayer1() {
        const projectile = document.createElement('div');
        projectile.classList.add('projectile');
        projectile.style.left = player1.offsetLeft + playerWidth / 2 + 'px';
        projectile.style.top = player1.offsetTop + playerHeight / 2 + 'px';
        projectilesContainer.appendChild(projectile);

        const projectileInterval = setInterval(() => {
            projectile.style.left = parseInt(projectile.style.left || 0) + 5 + 'px';
        
            // Check collision with player 2
            if (checkCollision(projectile, player2)) {
                clearInterval(projectileInterval);
                projectilesContainer.removeChild(projectile);
                updatePlayerHealth(player2, player2object[0].health - 10); // Decrease player 2 health
            }
        
            if (parseInt(projectile.style.top) < -10) {
                clearInterval(projectileInterval);
                projectilesContainer.removeChild(projectile);
            }
        }, 16);
    }

    // PLAYER 2 PROJECTILE
    function shootProjectilePlayer2() {
        const projectile = document.createElement('div');
        projectile.style.backgroundColor = '#00ff00';
        projectile.classList.add('projectile');
        projectile.style.left = player2.offsetLeft + playerWidth / 2 + 'px';
        projectile.style.top = player2.offsetTop + playerHeight / 2 + 'px';
        projectilesContainer.appendChild(projectile);

        const projectileInterval = setInterval(() => {
            projectile.style.left = parseInt(projectile.style.left || 0) - 5 + 'px';
        
            // Check collision with player 1
            if (checkCollision(projectile, player1)) {
                clearInterval(projectileInterval);
                projectilesContainer.removeChild(projectile);
                updatePlayerHealth(player1, player1object[0].health - 10); // Decrease player 1 health
            }
        
            if (parseInt(projectile.style.top) > gameHeight) {
                clearInterval(projectileInterval);
                projectilesContainer.removeChild(projectile);
            }
        }, 16);
    }


    // PLAYER MOVEMENT EVENT LISTENERS
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'a':
                player1Movement.left = true;
                break;
            case 'd':
                player1Movement.right = true;
                break;
            case 'w':
                player1Movement.up = true;
                break;
            case 's':
                player1Movement.down = true;
                break;
            case 'ArrowLeft':
                player2Movement.left = true;
                break;
            case 'ArrowRight':
                player2Movement.right = true;
                break;
            case 'ArrowUp':
                player2Movement.up = true;
                break;
            case 'ArrowDown':
                player2Movement.down = true;
                break;
            case ' ':
                shootProjectilePlayer1();
                break;
            case '/':
                shootProjectilePlayer2();
                break;
            case 'x':                                      //NUMPAD0 - NOT WORKING
                player2.classList.add('block-player2');
                break;
            default:
                break;
        }
    });

    document.addEventListener('keyup', function(event) {
        switch (event.key) {
            case 'a':
                player1Movement.left = false;
                break;
            case 'd':
                player1Movement.right = false;
                break;
            case 'w':
                player1Movement.up = false;
                break;
            case 's':
                player1Movement.down = false;
                break;
            case 'ArrowLeft':
                player2Movement.left = false;
                break;
            case 'ArrowRight':
                player2Movement.right = false;
                break;
            case 'ArrowUp':
                player2Movement.up = false;
                break;
            case 'ArrowDown':
                player2Movement.down = false;
                break;
            case 'x':
                player2.classList.remove('block-player2');
                break;
            default:
                break;
        }
    });

    // Game loop
    setInterval(movePlayer1, 16);
    setInterval(movePlayer2, 16);
});
