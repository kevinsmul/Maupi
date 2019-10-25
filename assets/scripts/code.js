$(document).ready(function() {
    //Global vars
    var filter = "ss";
    var folderName = $('.menu-list').find('.active').attr('folder-name');
    var faIcon = "fa-code";
    var useLockNavs = false;

    //sets the dots on the map
    if(dotmap == undefined){
        var dotmap = Math.floor(Math.random() * 4);
    }

    //sounds to play
    var test = new Audio();
    test.src = "assets/audio/test.mp3";
    basemovement(); 
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
            checkiflocked(category, filter, folderName, password);
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
            checkiflocked(category, filter, folderName, password);
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
    function checkiflocked(category, filter,folderName, password,codetry){

        if (password.length > 0) {
            useLockNavs = true;
            var codetry = $("#count1").text() + $("#count2").text() + $("#count3").text() + $("#count4").text();
            if (codetry == password) {
                useLockNavs = false;
                buildCodeBlocks(category, filter, folderName, password);
            }
            else{
                useLockNavs = true;
                unlocking(password, codetry);
                return false;
            }
        }

        else{
            buildCodeBlocks(category, filter, folderName, password);
        }

    }
    function buildCodeBlocks(category, filter,folderName, password){

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
                if (dotmap == 0) {
                    var moduleCode = '<div class="spinner"></div><div id="near" class="point"></div><div id="far" class="point"></div><div id="immediate" class="point"></div><div id="unknown" class="point"></div> <div id="extra1" class="point"></div> <div id="extra2" class="point"></div> <div id="extra3" class="point"></div> <div id="extra4" class="point"></div> <div id="extra5" class="point"></div> <div id="extra6" class="point"></div> <div id="extra7" class="point"></div> <div id="extra8" class="point"></div> <div id="extra9" class="point"></div> <div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                    $('#' + category).append(moduleCode);
                } else if(dotmap == 1) {
                    var moduleCode = '<div class="spinner"></div><div id="near" class="point"></div><div id="far" class="point"></div><div id="immediate" class="point"></div><div id="unknown" class="point"></div> <div id="extra10" class="point"></div> <div id="extra11" class="point"></div> <div id="extra12" class="point"></div> <div id="extra13" class="point"></div> <div id="extra14" class="point"></div> <div id="extra15" class="point"></div> <div id="extra16" class="point"></div> <div id="extra17" class="point"></div> <div id="extra18" class="point"></div> <div id="extra19" class="point"></div> <div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                    $('#' + category).append(moduleCode);
                }  else if(dotmap == 2) {
                    var moduleCode = '<div class="spinner"></div><div id="near" class="point"></div><div id="far" class="point"></div><div id="immediate" class="point"></div><div id="unknown" class="point"></div> <div id="extra20" class="point"> </div><div id="extra21" class="point"></div> <div id="extra22" class="point"></div> <div id="extra23" class="point"></div> <div id="extra24" class="point"></div> <div id="extra25" class="point"></div> <div id="extra26" class="point"></div> <div id="extra27" class="point"></div><div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                    $('#' + category).append(moduleCode);
                } else if(dotmap == 3) {
                    var moduleCode = '<div class="spinner"></div><div id="extra10" class="point"></div> <div id="extra11" class="point"></div> <div id="extra12" class="point"></div> <div id="extra13" class="point"></div> <div id="extra14" class="point"></div> <div id="extra15" class="point"></div> <div id="extra16" class="point"></div> <div id="extra20" class="point"> </div><div id="extra21" class="point"></div> <div id="extra22" class="point"></div> <div id="extra23" class="point"></div>  <div id="extra24" class="point"></div> <div id="extra25" class="point"></div> <div id="extra26" class="point"></div> <div id="extra27" class="point"></div><div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                    $('#' + category).append(moduleCode);
                } else{
                    var moduleCode = '<div class="spinner"></div><div id="near" class="point"></div><div id="far" class="point"></div><div id="immediate" class="point"></div><div id="unknown" class="point"></div> <div id="extra1" class="point"></div> <div id="extra2" class="point"></div> <div id="extra3" class="point"></div> <div id="extra4" class="point"></div> <div id="extra5" class="point"></div> <div id="extra6" class="point"></div> <div id="extra7" class="point"></div> <div id="extra8" class="point"></div> <div id="extra9" class="point"></div> <div id="extra10" class="point"></div> <div id="extra12" class="point"></div> <div id="extra13" class="point"></div> <div id="extra14" class="point"></div> <div id="extra15" class="point"></div> <div id="extra16" class="point"></div> <div id="extra17" class="point"></div> <div id="extra18" class="point"></div> <div id="extra19" class="point"></div> <div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                    $('#' + category).append(moduleCode);
                }
            }
        }
    }

    function basemovement(){
        // movement for the submenu
        $(document).on('keyup', function(event){
            if (useLockNavs) {
                return false;
            }

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
    };  


    function unlocking(password, codetry){

        $(document).on('keyup', function(event){
            if (!useLockNavs) {
                return false;
            }

            let slotnumber = 1;
            let hiddenVal = $("#hiddenVal");
            let counter = parseInt(hiddenVal.val());
            let theCount = $(".theCount");

            if(event.keyCode == 40){
                if (counter > 0) {
                    counter--;
                    console.log("min een");
                    hiddenVal.val(counter);
                    theCount.text(counter);
                };
            };

            if(event.keyCode == 38){
                if (counter < 9) {
                    counter++;
                    console.log("plus een");
                    hiddenVal.val(counter);
                    theCount.text(counter);
                };
            };

            if(event.keyCode == 13){

                let index = theCount.index();
                if(index == 6){
                    theCount.removeClass('theCount').prev().prev().prev().addClass('theCount');
                    //copy numbers and stop this
                    let codetry = $("#count1").text() + $("#count2").text() + $("#count3").text() + $("#count4").text();
                    if (password === codetry) {
                        useLockNavs = false;
                        $( ".lock" ).toggleClass('unlocked');
                        $('.seleted').children().children().click();
                        //test.play(); to play sounds when he delivers them
                        buildCodeBlocks(codetry);
                    }
                    else{
                        useLockNavs = false;
                        console.log("stop");
                        window.location.reload();
                    }
                }
                theCount.removeClass('theCount').next().addClass('theCount');
            };
        });
    };
    
    
    init();
});
