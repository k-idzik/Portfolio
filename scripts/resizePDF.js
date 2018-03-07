//Combines resizeNav and current PDF resizing since window.onresize can't bind multiple functions
const resize = () => {
    //Resize PDF
    if (window.innerWidth <= 1020) {
        var pdfColumn = document.querySelector('#pdfColumn');
        var pdfEmbed = document.querySelector('#pdfEmbed');

        pdfColumn.style.width = `${(window.innerWidth - 100)}px`;
        pdfEmbed.style.width = `${(window.innerWidth - 100)}px`;

        //This jank https://stackoverflow.com/questions/10912925/reloading-an-html-element-with-a-javascript-function
        pdfEmbed.setAttribute('src', pdfEmbed.getAttribute('src'));
    }

    //Resize nav
    if (window.innerWidth <= 805) {
        var navStyle = document.querySelector('#navigation');
        const paddingAmount = `${(window.innerWidth - (navStyle.children[0].clientWidth + navStyle.children[1].clientWidth + navStyle.children[2].clientWidth + navStyle.children[3].clientWidth)) / 2}px`; //Maybe actually calcuate this the right way

        navStyle.style.paddingLeft = paddingAmount; //And actually apply it to the correct side
    }
    else {
        document.querySelector('#navigation').style.paddingLeft = '0px'; //Sizing back to normal CSS
    }
};

//Can't call multiple functions at the same time
window.onload = () => resize();
window.onresize = () => resize();