$(function() {
    setupSlideEvents();

    buildProductList();

    setUpOverlayEvents();


});

function setupSlideEvents(){
    // http://seiyria.github.io/bootstrap-slider/
    $("#priceSlider").slider({
        id: "priceSlider",
        min: 449,
        max: 3999,
        range: true,
        value: [449, 3999],
        formatter: function(value) {
            return 'From $' + value[0] +' to $' + value[1];
        },
        tooltip: 'hide',
        handle: 'square'
    });
    $("#priceSlider").on("slide", function(slideEvt) {
        $("#priceFrom").text(slideEvt.value[0]);
        $("#priceTo").text(slideEvt.value[1]);
    });


    $("#capacitySlider").slider({
        id: "capacitySlider",
        min: 5,
        max: 10,
        range: true,
        value: [5, 10],
        formatter: function(value) {
            return '' + value[0] +'kg to ' + value[1] +'kg';
        },
        tooltip: 'hide',
        handle: 'square'
    });
    $("#capacitySlider").on("slide", function(slideEvt) {
        $("#capacityFrom").text(slideEvt.value[0]);
        $("#capacityTo").text(slideEvt.value[1]);
    });

    $("#energySlider").slider({
        tooltip: 'hide',
        min: 1,
        max: 5,
        value: 1,
        handle: 'square'
    });
    $("#energySlider").on("slide", function(slideEvt) {
        $("#energyFrom").text(slideEvt.value);
    });

    $("#rpmSlider").slider({
        tooltip: 'hide',
        min: 600,
        max: 1800,
        value: 1800,
        handle: 'square'
    });
    $("#rpmSlider").on("slide", function(slideEvt) {
        $("#rpmFrom").text(slideEvt.value);
    });

    $("#energyUsedSlider").slider({
        tooltip: 'hide',
        min: 100,
        max: 400,
        value: 400,
        handle: 'square'
    });
    $("#energyUsedSlider").on("slide", function(slideEvt) {
        $("#energyUsedFrom").text(slideEvt.value);
    });

    $("#waterSlider").slider({
        tooltip: 'hide',
        min: 30,
        max: 100,
        value: 100,
        handle: 'square'
    });
    $("#waterSlider").on("slide", function(slideEvt) {
        $("#waterFrom").text(slideEvt.value);
    });
}

function buildProductList(isFilter) {

    switch (currentSort) {
        case 'CHOICE Buys':
            products.sort(sort_by('choiceScore', true, parseInt));
            $('.surfacedSort').hide();
            break;
        case 'Member score':
            products.sort(sort_by('memberScore', true, parseInt));
            $('.surfacedSort').hide();
            break;
        default:
            products.sort(sort_by('gentlenessScore', true, parseInt));
            $('.surfacedSort').show();
            //$('.surfacedSort').hide();
            //$( ".surfacedSort" ).effect("highlight", { color: "white" }, 1000);
            break;
    }

    function sort_by(field, reverse, primer){

        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    $('.card').remove();
    var cardTemplate = $('.cardTemplate').html();
    for(var count = 0;  count < products.length ;count++) {
        var newCard = $('.cardTemplate').clone()
            .removeClass('cardTemplate')
            .removeClass('hide')
            .addClass('card')
            .attr('id',products[count].id).
            appendTo('.products');

        //select card, populate attrs
        $(newCard).find('.title').html(products[count].title);
        if (products[count].badges.length != 0) {
            if (products[count].badges.indexOf("bestBuy") > -1){
                $(newCard).find('.title').after('<span class="bestBuy">BEST<br/>BUY</span>');
            }
        }
        $(newCard).find('.surfacedSort').html(products[count].surfacedSort);
        $(newCard).find('.productLink').attr('href',products[count].productLink);
        $(newCard).find('.detailsLink').attr('onclick','window.location="'+products[count].productLink+'"');
        $(newCard).find('.productImg').css('background-image','url("'+products[count].productImg+'")');
        $(newCard).find('.price').html(products[count].price);
        $(newCard).find('.goodPoints').empty();
        if (products[count].goodPoints.length != 0) {
            for (var gp = 0; gp < products[count].goodPoints.length; gp++){
                $(newCard).find('.goodPoints').append('<li>'+products[count].goodPoints[gp]+'</li>')
            }
        }
        $(newCard).find('.badPoints').empty();
        if (products[count].badPoints.length != 0) {
            for (var bp = 0; bp < products[count].badPoints.length; bp++){
                $(newCard).find('.badPoints').append('<li>'+products[count].badPoints[bp]+'</li>')
            }

        }
        $(newCard).find('.memberScore').html(products[count].memberScore);
        $(newCard).find('.choiceScore').html(products[count].choiceScore);

        //filter
        if (isFilter && currentCheckedFilters.length > 0){
            $(newCard).hide();
            if (containsAny(products[count].attributes, currentCheckedFilters)) {
                $(newCard).show();
            }
        }
        //sort field
        $(newCard).find('.surfacedSort').html(currentSort+' '+products[count].gentlenessScore+'%');
    }

    $('[data-toggle="tooltip"]').tooltip();
    $('.glyphicon-question-sign').click(function(){
        window.location = 'how-we-test.html';
    });
    $('.card').hover(
        function(){ $(this).addClass('hovering') },
        function(){ $(this).removeClass('hovering') }
    )
}

function containsAny(source,target)
{
    var result = source.filter(function(item){ return target.indexOf(item) > -1});
    return (result.length > 0);
}

function setUpOverlayEvents(){
    $('.criteria-filter a').click(function(){ajaxOverlay(this, 'anchor')});
    $("#priceSlider").on('slideStop', function(){ajaxOverlay()});
    $("#capacitySlider").on('slideStop', function(){ajaxOverlay()});
    $("#energySlider").on('slideStop', function(){ajaxOverlay()});
    $("#rpmSlider").on('slideStop', function(){ajaxOverlay()});
    $("#energyUsedSlider").on('slideStop', function(){ajaxOverlay()});
    $("#waterSlider").on('slideStop', function(){ajaxOverlay()});
    $(".criteria-filter input[type='checkbox']").change(function() {
        ajaxOverlay(this, 'checkbox');
    });
    $('.sorts li a').click(function(){
        currentSort = $(this).html();
        $('.sortBtn').html(currentSort);
        ajaxOverlay();
    });
}

var currentSort = "CHOICE Buys";
var currentCheckedFilters = [];

function ajaxOverlay(that, type) {
    if (type && type == 'anchor'){
        //alert('here');
        if ($(that).hasClass('selected')){
            $(that).removeClass('selected');
        } else {
            $(that).addClass('selected');
        }
    }

    if (type && type == 'checkbox') {
        // if checked, add. otherwise remove
        var id = $(that).attr('id');
        if ($('#'+id).is(':checked')) {
            currentCheckedFilters.push(id);
        } else {
            //currentCheckedFilters.pop(id);
            remove(currentCheckedFilters, id);
        }
        function remove(arr, item) {
            for(var i = arr.length; i--;) {
                if(arr[i] === item) {
                    arr.splice(i, 1);
                }
            }
        }

        //array for mapping

        //build pils


    }
    $('html, body').animate({
        scrollTop: $(".container-fluid").offset().top
    }, 500);
    $('.overlay').fadeIn(400, function(){
        setTimeout(function(){
            buildPils();
            $('.overlay').fadeOut(200, function(){
                buildProductList(true);

            });
        }, 1000);
    });

}

function buildPils() {
    var mapping = {
        gentle: "Gentle or delicates program",
        Lint: "Lint filter",
        Auto: "Auto sensing water level",
        Delay: "Delay time"
    };


    $('.pils').empty();
    //$('.pils').hide();
    for (var pil = 0; pil < currentCheckedFilters.length; pil++){
        $('.pils').append('<span class="badge" style="display:none">× only with ' + mapping[currentCheckedFilters[pil]] + '</span>');
    }
    $( ".badge" ).effect("highlight", { color: "white" }, 1000);


    //$('.pils').fadeTo('fast',1).fadeTo('fast',0.3).fadeTo('fast',0.7);
}

/*
TODO
----
 - add card CTA
 - restyle tooltip (El)
 - compare flash in

 */
