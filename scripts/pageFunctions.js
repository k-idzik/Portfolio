"use strict"; //Don't mess up

window.onload = function () //On window load
{
    $(".hidden").fadeIn(800); //Fade in the page

    $("#dropdownParent").hover( //When hovering over the dropdown parent
        function () //Function for sliding down
        {
            $(".dropdownChild").slideDown("fast"); //Slide down the menu
        },
        function() //Function for sliding up
        {
            $(".dropdownChild").slideUp("fast"); //Slide up the menu
        }
    );
}