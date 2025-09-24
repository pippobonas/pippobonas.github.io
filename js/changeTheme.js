
function lerpColor(a, b, t) {
    return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function hexToRgbArray(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
}

function animateGradient(from, to, duration = 2000) {
    const start = performance.now();
    function step(now) {
        let t = Math.min(1, (now - start) / duration);
        const color = lerpColor(from, to, t);
        const textColor = lerpColor(to, from, t);
        document.documentElement.style.setProperty('--theme-choice', `rgba(${color[0]},${color[1]},${color[2]},1)`);
        document.documentElement.style.setProperty('--text-choice', `rgba(${textColor[0]},${textColor[1]},${textColor[2]},1)`);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const darkColor = hexToRgbArray('#252525');
const lightColor = hexToRgbArray('#dddddd');

let theme = document.documentElement.getAttribute("data-theme");
document.getElementById("themeToggle").addEventListener("click", function() {
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    let colorStart = theme === "dark" ? lightColor : darkColor;
    let colorEnd = theme === "dark" ? darkColor : lightColor;
    animateGradient(colorStart, colorEnd, 3000);

    document.getElementById("themeToggle").textContent = theme === "dark" ? "bedtime" : "light_mode";
});

