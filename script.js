// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to current navigation item
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle search button click
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Create and show search modal
            const modal = document.createElement('div');
            modal.className = 'search-modal';
            modal.innerHTML = `
                <div class="search-modal-content">
                    <input type="text" placeholder="Search for items...">
                    <button class="close-modal">&times;</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Focus on input
            const modalInput = modal.querySelector('input');
            modalInput.focus();
            
            // Close modal when clicking close button
            const closeButton = modal.querySelector('.close-modal');
            closeButton.addEventListener('click', function() {
                modal.remove();
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    }

    // Handle signup form submission
    const signupForm = document.querySelector('.auth-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const studentId = document.getElementById('student-id').value;
            const terms = document.getElementById('terms').checked;

            // Validate UNC email
            if (!email.endsWith('@unc.edu')) {
                showAlert('Please use your UNC email address', 'error');
                return;
            }

            // Validate password match
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }

            // Validate password strength
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters long', 'error');
                return;
            }

            // Validate terms acceptance
            if (!terms) {
                showAlert('Please accept the Terms of Service and Privacy Policy', 'error');
                return;
            }

            // Validate student ID format (9 digits)
            if (!/^\d{9}$/.test(studentId)) {
                showAlert('Please enter a valid 9-digit UNC Student ID', 'error');
                return;
            }

            // Show success message
            showAlert('Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Handle login form submission
    const loginForm = document.querySelector('.auth-form');
    if (loginForm && !document.getElementById('name')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validate UNC email
            if (!email.endsWith('@unc.edu')) {
                showAlert('Please use your UNC email address', 'error');
                return;
            }

            // Show success message
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
});

// Alert message function
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert-message ${type}`;
    alert.textContent = message;

    // Add alert to the page
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(alert, authContainer.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Game implementation
const canvas = document.getElementById('gameCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('finalScore');
    const gameOverElement = document.getElementById('gameOver');

    // Game objects
    const rameses = {
        x: 50,
        y: canvas.height - 50,
        width: 40,
        height: 40,
        jumping: false,
        jumpForce: 0,
        gravity: 0.4,
        maxJumpForce: -18
    };

    const obstacles = [];
    let score = 0;
    let gameSpeed = 3;
    let gameRunning = false;
    let animationId;

    // Game functions
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            score = 0;
            obstacles.length = 0;
            gameSpeed = 3;
            updateScore();
            gameOverElement.style.display = 'none';
            animate();
        }
    }

    function restartGame() {
        gameOverElement.style.display = 'none';
        startGame();
    }

    function updateScore() {
        scoreElement.textContent = score;
        finalScoreElement.textContent = score;
    }

    function createObstacle() {
        if (Math.random() < 0.01) {
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 30,
                width: 15,
                height: 25
            });
        }
    }

    function updateObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                updateScore();
                if (score % 10 === 0) {
                    gameSpeed += 0.25;
                }
            }
        }
    }

    function checkCollision() {
        for (const obstacle of obstacles) {
            if (
                rameses.x < obstacle.x + obstacle.width &&
                rameses.x + rameses.width > obstacle.x &&
                rameses.y < obstacle.y + obstacle.height &&
                rameses.y + rameses.height > obstacle.y
            ) {
                gameOver();
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        gameOverElement.style.display = 'block';
    }

    function jump() {
        if (!rameses.jumping) {
            rameses.jumping = true;
            rameses.jumpForce = rameses.maxJumpForce;
        }
    }

    function updateRameses() {
        if (rameses.jumping) {
            rameses.y += rameses.jumpForce;
            rameses.jumpForce += rameses.gravity;

            if (rameses.y > canvas.height - 50) {
                rameses.y = canvas.height - 50;
                rameses.jumping = false;
            }
        }
    }

    function drawRameses() {
        // Draw Rameses body
        ctx.fillStyle = '#4B9CD3';
        ctx.fillRect(rameses.x, rameses.y, rameses.width, rameses.height);
        
        // Draw Rameses head
        ctx.beginPath();
        ctx.arc(rameses.x + rameses.width/2, rameses.y - 10, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#4B9CD3';
        ctx.fill();
        
        // Draw Rameses horns
        ctx.beginPath();
        ctx.moveTo(rameses.x + rameses.width/2 - 10, rameses.y - 20);
        ctx.lineTo(rameses.x + rameses.width/2 - 5, rameses.y - 30);
        ctx.lineTo(rameses.x + rameses.width/2, rameses.y - 20);
        ctx.fillStyle = '#4B9CD3';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(rameses.x + rameses.width/2, rameses.y - 20);
        ctx.lineTo(rameses.x + rameses.width/2 + 5, rameses.y - 30);
        ctx.lineTo(rameses.x + rameses.width/2 + 10, rameses.y - 20);
        ctx.fillStyle = '#4B9CD3';
        ctx.fill();
        
        // Draw Rameses face
        ctx.beginPath();
        ctx.arc(rameses.x + rameses.width/2 - 5, rameses.y - 15, 3, 0, Math.PI * 2);
        ctx.arc(rameses.x + rameses.width/2 + 5, rameses.y - 15, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    function drawObstacle(obstacle) {
        // Draw obstacle (Duke Blue Devil)
        ctx.fillStyle = '#001A57'; // Duke blue
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Draw devil horns
        ctx.beginPath();
        ctx.moveTo(obstacle.x + 5, obstacle.y);
        ctx.lineTo(obstacle.x, obstacle.y - 10);
        ctx.lineTo(obstacle.x + 10, obstacle.y);
        ctx.fillStyle = '#001A57';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width - 5, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y - 10);
        ctx.lineTo(obstacle.x + obstacle.width - 10, obstacle.y);
        ctx.fillStyle = '#001A57';
        ctx.fill();
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        ctx.fillStyle = '#4B9CD3';
        ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

        // Draw Rameses
        drawRameses();

        // Draw obstacles
        for (const obstacle of obstacles) {
            drawObstacle(obstacle);
        }
    }

    function animate() {
        if (gameRunning) {
            updateRameses();
            createObstacle();
            updateObstacles();
            checkCollision();
            draw();
            animationId = requestAnimationFrame(animate);
        }
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.code === 'ArrowUp') && gameRunning) {
            jump();
        }
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', () => {
        if (gameRunning) {
            jump();
        }
    });
} 