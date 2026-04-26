let clickCount = 0;
let clickTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo h1');

    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;

            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 2000);
            }

            if (clickCount === 5) {
                clearTimeout(clickTimer);
                clickCount = 0;
                window.location.href = 'pages/admin.html';
            }
        });
    }
});
