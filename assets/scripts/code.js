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
            buildCodeBlocks(category, filter, folderName);
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
        //Reset active class
        sideMenuresetActive();

        $(this).addClass('active');

        var folderName =  $(this).attr('folder-name');
        var filter = $('.navbar-nav').find('.active').attr('filter');
        var category = $('.menu-content').find('.menu-item.active > a').text();

        if(filter !== 'ss'){
            buildCodeBlocks(category, filter, folderName);
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
    function buildCodeBlocks(category, filter,folderName){
        console.log('buildcodeblocks');
        console.log(jsonData);
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
        var path = 'code/' + folderName + fileType +'';

        if(filter == 'js')
        {
            //JS FILES --> use httprequest because jquery get or ajax calls executes the javascript in the file
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        var scriptContent = httpRequest.responseText;
                        console.log(scriptContent);
                        $('.main-content').prepend('<div class="code-block-wrapper">' + scriptContent + '</div>');
                    }
                }
                markupCode();
            };
            httpRequest.open('GET', path);
            httpRequest.send();
        }
        else{
           $.get('code/' + folderName + fileType +'', function (data) {
                var code = $('<div />').text(data).html();
                $('.main-content').prepend('<div class="code-block-wrapper">' + code + '</div>');
               markupCode();
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
            console.log(category);
            var categoryCode = '<div class="col-12 pt-5"> <h1 class="code-title d-none">'+ category + '</h1></div><hr/> <div class="row" id="'+ category + '"></div>';
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


                //No image
                var imgPath = "";
                //Set image path if not undefined
                if (typeof jsonData[key][k]['screenshot'] !== 'undefined'){
                    //Screenshot count
                    var count = Object.keys(jsonData[key][k]['screenshot']).length;
                    if(count == 1) {
                        var screenshot = jsonData[key][k]['screenshot'];
                    }
                    else{
                        var screenshot = jsonData[key][k]['screenshot'][0];
                    }
                    var imgPath = encodeURI('code/' + category + '/' + moduleName + '/screenshot/' + screenshot + '');
                }

                var moduleCode = '<div class="spinner"></div><div id="near" class="point"></div><div id="far" class="point"></div><div id="immediate" class="point"></div><div id="unknown" class="point"></div><div class="spins spin1">  <div class="label">immediate</div></div><div class="spins spin2">  </div><div class="spins spin3"></div><div align="center"></div>';
                $('#' + category).append(moduleCode);
            }

        }
    }

    init();
});
