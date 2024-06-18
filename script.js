document.addEventListener("DOMContentLoaded", function() {
    const player1 = document.querySelector('.player.player1');
    const player2 = document.querySelector('.player.player2');
    const projectilesContainer = document.querySelector('.projectiles');

    const playerWidth = player1.offsetWidth;
    const playerHeight = player1.offsetHeight;
    const gameWidth = document.querySelector('.game-container').offsetWidth;
    const gameHeight = document.querySelector('.game-container').offsetHeight;
    const playerStartingHealth = 100;
    
    var player1object = { height: 50, width: 50, health: 100, blocking: false };
    var player2object = { height: 50, width: 50, health: 100, blocking: false };
    let player2LastKnownLeft = null;
    let player2LastKnownTop = null;

    let player1Movement = { left: false, right: false, up: false, down: false };
    let player2Movement = { left: false, right: false, up: false, down: false };

    var gameState = '0';

    const times = [];
    
    var fps;

    function refreshLoop() {
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;

            document.getElementById('fpsCounter').textContent = 'FPS: ' + fps;

            refreshLoop();
        });
    }

    refreshLoop();

    
    setTimeout(showOverlay, 0);
    function showOverlay() {
        document.getElementById('overlay').style.display = 'flex'; 
    }

    function changeHealthColor(player, color) {
        document.getElementById(player).style.color = color;
    }
    
    function changeHealthBarColor(player, color) {
        document.getElementById(player).style.backgroundColor = color;
    }


    document.getElementById('restartButton').addEventListener('click', function() {
        window.location.reload();
    });
    function showGameOver(txtGameState) {
        document.getElementById('gameState').textContent = txtGameState;
    }
    function movePlayer1() {
        if(player1object.health <= 0 && !player1.classList.contains('dead-player1')){
            player1.classList.add('dead-player1');
        }

        if (player1.offsetLeft > gameWidth/2 - 50 && player1object.health > 0)
        {
            player1.style.left = player1.offsetLeft - 5 + 'px';
        }

        if (player1Movement.left && player1.offsetLeft > 0 && !player1object.blocking && player1object.health > 0) {
            player1.style.left = player1.offsetLeft - 5 + 'px';
        }
        if (player1Movement.right && player1.offsetLeft + playerWidth < gameWidth && !player1object.blocking && player1object.health > 0) {
            player1.style.left = player1.offsetLeft + 5 + 'px';
        }
        if (player1Movement.up && player1.offsetTop > 0 && !player1object.blocking && player1object.health > 0) {
            player1.style.top = player1.offsetTop - 5 + 'px';
        }
        if (player1Movement.down && player1.offsetTop + playerHeight < gameHeight && !player1object.blocking && player1object.health > 0) {
            player1.style.top = player1.offsetTop + 5 + 'px';
        }

        document.getElementById('player1Health').textContent = player1object.health;
    }
    function movePlayer2() {
        if(player2object.health <= 0 && !player2.classList.contains('dead-player2')){
            player2.classList.add('dead-player2');
        }
        
        if(player2.offsetLeft < gameWidth/2 && player2object.health > 0)
        {
            player2.style.left = player2.offsetLeft + 5 + 'px';
        }

        if (player2Movement.left && player2.offsetLeft > 0 && !player2object.blocking && player2object.health > 0) {
            player2.style.left = player2.offsetLeft - 5 + 'px';
        }
        if (player2Movement.right && player2.offsetLeft + playerWidth < gameWidth && !player2object.blocking && player2object.health > 0) {
            player2.style.left = player2.offsetLeft + 5 + 'px';
        }
        if (player2Movement.up && player2.offsetTop > 0 && !player2object.blocking && player2object.health > 0) {
            player2.style.top = player2.offsetTop - 5 + 'px';
        }
        if (player2Movement.down && player2.offsetTop + playerHeight < gameHeight && !player2object.blocking && player2object.health > 0) {
            player2.style.top = player2.offsetTop + 5 + 'px';
        }

        document.getElementById('player2Health').textContent = player2object.health;
    }
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

    function updatePlayerHealth(player, health) {
        if (player === player1) {
            player1object.health = health;
            const healthPercentage = (health / playerStartingHealth) * 100;
            document.getElementById('player1Health').textContent = health;
            document.getElementById('player1HealthBarFill').style.width = healthPercentage + '%';
            
            if (health <= 30) {
                changeHealthBarColor("player1HealthBarFill", "red");
                changeHealthColor("player1Health", "red");
            }
            if (health <= 0) {
                player1object.health = 0;
                showGameOver("Player 2 Wins!");

                player1.classList.add('dead-player1');
                player1.classList.remove('block-player1');
            }
        } else if (player === player2) {
            player2object.health = health;
            const healthPercentage = (health / playerStartingHealth) * 100;
            document.getElementById('player2Health').textContent = health;
            document.getElementById('player2HealthBarFill').style.width = healthPercentage + '%';

            if (health <= 30) {
                changeHealthBarColor("player2HealthBarFill", "red");
                changeHealthColor("player2Health", "red");
            }

            if (health <= 0) {
                player2object.health = 0;
                showGameOver("Player 1 Wins!");

                player2.classList.add('dead-player2');
                player2.classList.remove('block-player2');
            } else {
                player2.classList.remove('dead-player2');
            }
        }
    }


    function shootProjectilePlayer1() {
        if (!player1.classList.contains('block-player1')) {
            const projectile = document.createElement('div');
            projectile.classList.add('projectile');
            projectile.style.left = player1.offsetLeft + playerWidth / 2 + 'px';
            projectile.style.top = player1.offsetTop + playerHeight / 2 + 'px';
            projectilesContainer.appendChild(projectile);

            const projectileInterval = setInterval(() => {
                projectile.style.left = parseInt(projectile.style.left || 0) + 5 + 'px';

                if (player2object.health > 0 && !player2.classList.contains('block-player2') && checkCollision(projectile, player2)) {
                    clearInterval(projectileInterval);
                    projectilesContainer.removeChild(projectile);
                    updatePlayerHealth(player2, player2object.health - 10); 
                }

                if (parseInt(projectile.style.top) < -10) {
                    clearInterval(projectileInterval);
                    projectilesContainer.removeChild(projectile);
                }
            }, 16);

            setTimeout(() => {
                clearInterval(projectileInterval);
                projectilesContainer.removeChild(projectile);
            }, 5000);
        }
    }

    function shootProjectilePlayer2() {
        if (!player2.classList.contains('block-player2')) {
            const projectile = document.createElement('div');
            projectile.style.backgroundColor = '#00ff00';
            projectile.classList.add('projectile');
            projectile.style.left = player2.offsetLeft + playerWidth / 2 + 'px';
            projectile.style.top = player2.offsetTop + playerHeight / 2 + 'px';
            projectilesContainer.appendChild(projectile);

            const projectileInterval = setInterval(() => {
                projectile.style.left = parseInt(projectile.style.left || 0) - 5 + 'px';

                if (player1object.health > 0 && !player1.classList.contains('block-player1') && checkCollision(projectile, player1)) {
                    clearInterval(projectileInterval);
                    projectilesContainer.removeChild(projectile);
                    updatePlayerHealth(player1, player1object.health - 10); 
                }

                if (parseInt(projectile.style.top) > gameHeight) {
                    clearInterval(projectileInterval);
                    projectilesContainer.removeChild(projectile);
                }
            }, 16);

            setTimeout(() => {
                clearInterval(projectileInterval);
                projectilesContainer.removeChild(projectile);
            }, 10000);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (player1object.health > 0) {
            switch (event.key) {
                case 'a':
                    if (!player1.classList.contains('block-player1')) {
                        player1Movement.left = true;
                    }
                    break;
                case 'd':
                    if (!player1.classList.contains('block-player1')) {
                        player1Movement.right = true;
                    }
                    break;
                case 'w':
                    if (!player1.classList.contains('block-player1')) {
                        player1Movement.up = true;
                    }
                    break;
                case 's':
                    if (!player1.classList.contains('block-player1')) {
                        player1Movement.down = true;
                    }
                    break;
                case ' ':
                    if (!player1.classList.contains('block-player1')) {
                        shootProjectilePlayer1();
                    }
                    break;
                case 'f':
                    player1.classList.toggle('block-player1');
                    player1object.blocking = !player1object.blocking;
                    break;
                default:
                    break;
            }
        }

        if (player2object.health > 0) {
            switch (event.key) {
                case 'ArrowLeft':
                    if (!player2.classList.contains('block-player2')) {
                        player2Movement.left = true;
                    }
                    break;
                case 'ArrowRight':
                    if (!player2.classList.contains('block-player2')) {
                        player2Movement.right = true;
                    }
                    break;
                case 'ArrowUp':
                    if (!player2.classList.contains('block-player2')) {
                        player2Movement.up = true;
                    }
                    break;
                case 'ArrowDown':
                    if (!player2.classList.contains('block-player2')) {
                        player2Movement.down = true;
                    }
                    break;
                case 'o':
                    if (!player2.classList.contains('block-player2')) {
                        shootProjectilePlayer2();
                    }
                    break;
                case 'p':
                    player2.classList.toggle('block-player2');
                    player2object.blocking = !player2object.blocking;
                    break;
                default:
                    break;
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (player1object.health > 0) {
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
                default:
                    break;
            }
        }

        if (player2object.health > 0) {
            switch (event.key) {
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
                default:
                    break;
            }
        }
    });

    setInterval(movePlayer1, 16);
    setInterval(movePlayer2, 16);
});
