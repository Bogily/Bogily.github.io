document.addEventListener('mousemove', function(e) {
    const parallaxElements = document.querySelectorAll('.navbar, .main-content');
    const x = (e.clientX / window.innerWidth - 0.5) * 0;
    const y = (e.clientY / window.innerHeight - 0.5) * 0;

    parallaxElements.forEach(element => {
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
});