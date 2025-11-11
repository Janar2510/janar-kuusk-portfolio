// Simple Test - Basic Canvas Animation
console.log('Test script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, creating test canvas...');
    
    // Create a simple test canvas
    const testCanvas = document.createElement('canvas');
    testCanvas.style.position = 'fixed';
    testCanvas.style.top = '0';
    testCanvas.style.left = '0';
    testCanvas.style.width = '100vw';
    testCanvas.style.height = '100vh';
    testCanvas.style.zIndex = '9999';
    testCanvas.style.background = 'rgba(255, 0, 0, 0.1)';
    testCanvas.style.border = '3px solid red';
    testCanvas.width = window.innerWidth;
    testCanvas.height = window.innerHeight;
    
    document.body.appendChild(testCanvas);
    
    const ctx = testCanvas.getContext('2d');
    
    // Draw a simple animation
    let x = 0;
    let y = 0;
    let dx = 2;
    let dy = 2;
    
    function animate() {
        ctx.clearRect(0, 0, testCanvas.width, testCanvas.height);
        
        // Draw a moving circle
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        x += dx;
        y += dy;
        
        if (x > testCanvas.width || x < 0) dx *= -1;
        if (y > testCanvas.height || y < 0) dy *= -1;
        
        requestAnimationFrame(animate);
    }
    
    animate();
    console.log('Test animation started!');
});
