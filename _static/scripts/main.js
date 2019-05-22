function apsc(e) {
    return Array.prototype.slice.call(e)
}

window.addEventListener("load", function () {
    apsc(document.getElementsByClassName('type')).forEach((t, i) => {
        t.addEventListener('click', function () {
            apsc(document.getElementsByClassName('type')).forEach((x) => {
                x.setAttribute('id', '')
            });
            apsc(document.getElementsByClassName('itemsContainer')).forEach((x) => {
                x.style.display = 'none'
            });
            t.setAttribute('id', 'selected');
            document.getElementsByClassName('itemsContainer')[i].style.display =
                'block';
        });
    })
});