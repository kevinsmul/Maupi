$(document).ready(function() {
    //Global vars
    var filter = "ss";
    var folderName = $('.menu-list').find('.active').attr('folder-name');
    var faIcon = "fa-code";

    function init(){
        //Init highlight js ( style code blocks )
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
            hljs.lineNumbersBlock(block);
        });

        //Run overview function on page load
        moduleOverview();
    }

    //Filter menu
    $('.filterbar').find('.nav-item').click(function(){
        var password = $(this).data('pass');
        var category = $('.menu-content').find('.menu-item.active > a').text();

        $('.nav-item').each(function(){
           $(this).removeClass('active');
        });
        $('.menu-overview').removeClass('active');

        $(this).addClass('active');

        var dataTarget = $('.menu-item.active').attr('data-target');
        var folderName = $(dataTarget).find('.active').attr('folder-name');
        var filter = $('.navbar-nav').find('.active').attr('filter');

        if(filter !== 'ss') {
            buildCodeBlocks(category, filter, folderName, password);
        }
        else{
            buildPreview(category, folderName);
        }
    });

    //Sidemenu First level
    $('.menu-content').find('.menu-item').click(function ()
    {
        $('.menu-content').find('.menu-item').each(function(){
           $(this).removeClass('active');
        });
        $('.sub-menu').collapse('hide');
        $(this).addClass('active');
    });

    //SideMenu Second level
    $('.menu-content').find('.sub-menu > li').click(function(){
        var password = $(this).attr('data-pass');
        //Reset active class
        sideMenuresetActive();

        $(this).addClass('active');

        var folderName =  $(this).attr('folder-name');
        var filter = $('.navbar-nav').find('.active').attr('filter');
        var category = $('.menu-content').find('.menu-item.active > a').text();

        if(filter !== 'ss'){
            buildCodeBlocks(category, filter, folderName, password);
        }
        else{
            buildPreview(category, folderName);
        }
    });

    //Trigger module overview btn
    $('.menu-overview').click(function(){
        moduleOverview();
        sideMenuresetActive();
    });

    function sideMenuresetActive(){
        $('.menu-content').find('.sub-menu > li').each(function(){
            $(this).removeClass('active');
        });


        $('.menu-overview').removeClass('active');
    }
    function buildCodeBlocks(category, filter,folderName, password){

        if (password.length > 0) {
            unlocking();
            return false;                   /*                                                          eyyyy rakker hiero*/
        }

        var data = jsonData[category][folderName];

        switch(filter) {
            case 'txt':
                var fileDataArr = data.txt;
                faIcon = "fa-cog";
                break;
        }
            if(typeof(fileDataArr) == 'undefined'){
            clearContent();
                $('.main-content').prepend('<p> No ' + filter + ' files found for this module</p>');
            }
            else {
                var filecount = fileDataArr.length;

                for (var i = 0; i < filecount; i++) {
                    var file = fileDataArr[i];
                    var randomString = 'rndm-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    //**TEMPLATES**
                    readModuleCode(category + '/' + folderName, '/' + filter + '/' + file + '', '' + file + '', 'xml htmlbars', randomString, filter);
                }
            }
    }

    

    function clearContent(){
        $('.main-content').empty();
    }


    function readModuleCode(folderName, fileType, title, markuplg, randomString, filter)
    {
        clearContent();
        $('.filters').show();
        var folderName = folderName;
        var fileType = fileType;
        var filter = filter;
        var path = 'manuscript/' + folderName + fileType +'';

        if(filter == 'js')
        {
            //JS FILES --> use httprequest because jquery get or ajax calls executes the javascript in the file
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        var scriptContent = httpRequest.responseText;
                        $('.main-content').prepend('<div class="code-block-wrapper">' + scriptContent + '</div>');
                    }
                }
            };
            httpRequest.open('GET', path);
            httpRequest.send();
        }
        else{
           $.get('manuscript/' + folderName + fileType +'', function (data) {
                var code = $('<div />').text(data).html();
                $('.main-content').prepend('<div class="code-block-wrapper">' + code + '</div>');
           });
        }

    }

    function moduleOverview(){
        clearContent();

        //Disable filter buttons for overview
        $('.filters').hide();
        for(var key in jsonData)
        {
            var category = key;
            var categoryCode = '<div class="col-12 pt-4"> <h1 class="code-title d-none">'+ category + '</h1></div><hr/> <div class="row" id="'+ category + '"></div>';
            $('.main-content').append(categoryCode);

            var moduleLength = Object.keys(jsonData[key]).length;

            for(var k in jsonData[key])
            {   var moduleName = k;
                var colClass = "col-3";
                if(moduleLength < 4 && moduleLength > 1 ){
                    var colSize = (12 / moduleLength);
                    colClass = "col-" + colSize;
                }
                if(moduleLength == 1){
                    colClass = "col-6";
                }

                var moduleCode = '<div class="spinner"></div><div id="near" class="point"></div><div id="far" class="point"></div><div id="immediate" class="point"></div><div id="unknown" class="point"></div> <div id="extra1" class="point"></div> <div id="extra2" class="point"></div> <div id="extra3" class="point"></div> <div id="extra4" class="point"></div> <div id="extra5" class="point"></div> <div id="extra6" class="point"></div> <div id="extra7" class="point"></div> <div id="extra8" class="point"></div> <div id="extra9" class="point"></div> <div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                $('#' + category).append(moduleCode);
            }

        }
    }

    // movement for the submenu
    $(document).on('keyup', function(event){
        var seleted = $('.seleted');
        //down arrow
        if(event.keyCode == 40){
            var index = seleted.index();
            if(index==6){
                return;
            }
            seleted.removeClass('seleted').next().addClass('seleted');
        }
        //up arrow
        if(event.keyCode == 38){
            var index = seleted.index();
            if(index==0){
                return;
            }
            seleted.removeClass('seleted').prev().addClass('seleted');
        }
        //enter
        if(event.keyCode == 13){
            seleted.click();
            seleted.children().children().click();
        }
    });

    function unlocking(){
        $(document).on('keyup', function(e){

            var slotnumber = 1;
            //trigger it
            if(e.keyCode == 70){
                console.log(slotnumber);

            }
            //adds one to it
            if(e.keyCode == 83){
                var kerel = slotnumber+1;
                console.log(kerel);
                return kerel;
            }
        });
    };
    
    init();
});

