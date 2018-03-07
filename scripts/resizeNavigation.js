const resizeNav = () => {
    if (window.innerWidth <= 805) {
        var navStyle = document.querySelector('#navigation');
        const paddingAmount = `${(window.innerWidth - (navStyle.children[0].clientWidth + navStyle.children[1].clientWidth + navStyle.children[2].clientWidth + navStyle.children[3].clientWidth)) / 2}px`; //Maybe actually calcuate this the right way

        navStyle.style.paddingLeft = paddingAmount; //And actually apply it to the correct side
    }
    else {
        document.querySelector('#navigation').style.paddingLeft = '0px'; //Sizing back to normal CSS
    }
};

window.onload = () => resizeNav();
window.onresize = () => resizeNav();