const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const app = express();
const port = 3000;

const HTML = `<html class="" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head><title>

</title>
    <!--[if lt IE 8 ]><script type="text/javascript" src="../Scripts/jquery-1.4.1.min.js"></script><![endif]-->
    <!--[if (gt IE 9)|!(IE)]><!-->
        <script src="../Scripts/jquery-2.1.1.min.js" type="text/javascript"></script>
        <script src="../Scripts/jquery-ui.min-1.11.1.js" type="text/javascript"></script>
    <!--<![endif]-->
    <link href="../Scripts/jqPlugins/chosen/chosen.min.css" rel="stylesheet" type="text/css">
    <script src="../Scripts/chosen.jquery.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {
            $('#iframeheight').val(Math.max($('html').height(), 400));
            var oldIE;
            if ($('html').is('.ie6, .ie7, .ie8')) {
                oldIE = true;
            }

            if (oldIE) {
                $('.show').addClass('hidden');
            } else {
                $('select:not(.hidden)').chosen({
                    no_results_text: "Translated No results matched",
                    placeholder_text_single: "Выберите элемент"
                });
                $('#ShowTT').addClass('hidden');
                $('.show').click(function () {
                    $('#ShowTT').click();
                });
                $('.chosen-default span').html('Нет данных для выборки');
                $('div.chosen-search input').keyup(function () {
                    var parent = $(this).parent().parent().parent().attr('id');
                    console.log(parent);
                    var spanVal = $('#' + parent + ' ul.chosen-results li.no-results span').html();
                    $('ul.chosen-results li.no-results').html('По запросу "<span>' + spanVal + '</span>" ничего не найдено.');
                });
            }
        });
    </script>
    <link href="../Styles/mobile-promotion.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="../Scripts/mobile-promotion.js"></script>
    <style type="text/css">
        #ddlWeek_chosen, #ddlCourse_chosen { width:100px !important; }
        #ddlFac_chosen div.chosen-search { width:98%; }
        #lMessage { width:100%; }
        #TT { border-collapse:collapse; width:100%; margin-top:20px; }
    </style>
    <link href="../Styles/styles.css" rel="stylesheet" type="text/css"><link href="../Styles/StudySchedule.css" rel="stylesheet" type="text/css">
    <style>
        .cell-empty,.cell-time,.cell-subgroup,.cell-discipline,.cell-staff,.cell-auditory
        {
            padding-left:4px;
            border-left:1px solid Gray;
        }
        .topic
        {
            display: inherit;
            border-top: 1px solid gray;
        }
    </style>
</head>
<body>
    <div style="position:relative;">
        <h2>Расписание занятий для студента</h2>
    </div><br>
    <form method="post" action="./umu.aspx" id="form1">
<div class="aspNetHidden">
<input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value="">
<input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value="">
<input type="hidden" name="__LASTFOCUS" id="__LASTFOCUS" value="">
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="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">
</div>

<script type="text/javascript">
//<![CDATA[
var theForm = document.forms['form1'];
if (!theForm) {
    theForm = document.form1;
}
function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }
}
//]]>
</script>


<div class="aspNetHidden">

        <input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="4C55420B">
        <input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="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">
</div>
    <div class="filter">
        <div class="sType">


        </div>
        <div class="faculty">

            <select name="ddlFac" onchange="javascript:setTimeout('__doPostBack(\'ddlFac\',\'\')', 0)" id="ddlFac" style="display: none;">
        <option selected="selected" value="2">Факультет мониторинга окружающей среды
                                                                                                                             </option>
        <option value="3">Факультет повышения квалификации и переподготовки
                                                                                                         </option>
        <option value="4">Факультет экологической медицины
                                                                                                         </option>

</select><div class="chosen-container chosen-container-single" style="width: 372px;" title="" id="ddlFac_chosen"><a class="chosen-single" tabindex="-1"><span>Факультет мониторинга окружающей среды</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>

        </div>
        <div class="department">

            <select name="ddlDep" onchange="javascript:setTimeout('__doPostBack(\'ddlDep\',\'\')', 0)" id="ddlDep" style="display: none;">
        <option selected="selected" value="2">дневная форма                                                                                       </option>
        <option value="3">заочная форма                                                                                       </option>

</select><div class="chosen-container chosen-container-single" style="width: 126px;" title="" id="ddlDep_chosen"><a class="chosen-single" tabindex="-1"><span>дневная форма</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>

        </div>
        <div class="course">

            <select name="ddlCourse" onchange="javascript:setTimeout('__doPostBack(\'ddlCourse\',\'\')', 0)" id="ddlCourse" style="display: none;">
        <option selected="selected" value="1">1 курс</option>
        <option value="2">2 курс</option>
        <option value="3">3 курс</option>
        <option value="4">4 курс</option>
        <option value="5">5 курс</option>

</select><div class="chosen-container chosen-container-single" style="width: 66px;" title="" id="ddlCourse_chosen"><a class="chosen-single" tabindex="-1"><span>1 курс</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>

        </div>
        <div class="groupLB">

            <select name="ddlGroup" onchange="javascript:setTimeout('__doPostBack(\'ddlGroup\',\'\')', 0)" id="ddlGroup" style="display: none;">
        <option selected="selected" value="156">А01ИСТ1                                 </option>
        <option value="155">А01ИСТ2                                 </option>
        <option value="159">А01МЕФ1                                 </option>
        <option value="157">А01ПОД1                                 </option>
        <option value="158">А01ЭТЭ1                                 </option>
        <option value="160">А01ЯРБ1</option>

</select><div class="chosen-container chosen-container-single" style="width: 90px;" title="" id="ddlGroup_chosen"><a class="chosen-single" tabindex="-1"><span>А01ИСТ1</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>

        </div>
        <div class="week">

            <select name="ddlWeek" onchange="javascript:setTimeout('__doPostBack(\'ddlWeek\',\'\')', 0)" id="ddlWeek" style="display: none;">
        <option value="05.07.2021 0:00:00">05.07.2021</option>
        <option value="28.06.2021 0:00:00">28.06.2021</option>
        <option value="21.06.2021 0:00:00">21.06.2021</option>
        <option selected="selected" value="14.06.2021 0:00:00" class="current-week-option">14.06.2021</option>
        <option value="07.06.2021 0:00:00">07.06.2021</option>
        <option value="31.05.2021 0:00:00">31.05.2021</option>
        <option value="24.05.2021 0:00:00">24.05.2021</option>
        <option value="17.05.2021 0:00:00">17.05.2021</option>
        <option value="10.05.2021 0:00:00">10.05.2021</option>
        <option value="03.05.2021 0:00:00">03.05.2021</option>
        <option value="26.04.2021 0:00:00">26.04.2021</option>
        <option value="19.04.2021 0:00:00">19.04.2021</option>
        <option value="12.04.2021 0:00:00">12.04.2021</option>
        <option value="05.04.2021 0:00:00">05.04.2021</option>
        <option value="29.03.2021 0:00:00">29.03.2021</option>
        <option value="22.03.2021 0:00:00">22.03.2021</option>
        <option value="15.03.2021 0:00:00">15.03.2021</option>
        <option value="08.03.2021 0:00:00">08.03.2021</option>
        <option value="01.03.2021 0:00:00">01.03.2021</option>
        <option value="22.02.2021 0:00:00">22.02.2021</option>
        <option value="15.02.2021 0:00:00">15.02.2021</option>
        <option value="08.02.2021 0:00:00">08.02.2021</option>
        <option value="01.02.2021 0:00:00">01.02.2021</option>
        <option value="25.01.2021 0:00:00">25.01.2021</option>
        <option value="18.01.2021 0:00:00">18.01.2021</option>
        <option value="11.01.2021 0:00:00">11.01.2021</option>
        <option value="04.01.2021 0:00:00">04.01.2021</option>
        <option value="28.12.2020 0:00:00">28.12.2020</option>
        <option value="21.12.2020 0:00:00">21.12.2020</option>
        <option value="14.12.2020 0:00:00">14.12.2020</option>
        <option value="07.12.2020 0:00:00">07.12.2020</option>
        <option value="30.11.2020 0:00:00">30.11.2020</option>
        <option value="23.11.2020 0:00:00">23.11.2020</option>
        <option value="16.11.2020 0:00:00">16.11.2020</option>
        <option value="09.11.2020 0:00:00">09.11.2020</option>
        <option value="02.11.2020 0:00:00">02.11.2020</option>
        <option value="26.10.2020 0:00:00">26.10.2020</option>
        <option value="19.10.2020 0:00:00">19.10.2020</option>
        <option value="12.10.2020 0:00:00">12.10.2020</option>
        <option value="05.10.2020 0:00:00">05.10.2020</option>
        <option value="28.09.2020 0:00:00">28.09.2020</option>
        <option value="21.09.2020 0:00:00">21.09.2020</option>
        <option value="14.09.2020 0:00:00">14.09.2020</option>
        <option value="07.09.2020 0:00:00">07.09.2020</option>
        <option value="31.08.2020 0:00:00">31.08.2020</option>
        <option value="29.06.2020 0:00:00">29.06.2020</option>
        <option value="22.06.2020 0:00:00">22.06.2020</option>
        <option value="15.06.2020 0:00:00">15.06.2020</option>
        <option value="08.06.2020 0:00:00">08.06.2020</option>
        <option value="01.06.2020 0:00:00">01.06.2020</option>
        <option value="25.05.2020 0:00:00">25.05.2020</option>
        <option value="18.05.2020 0:00:00">18.05.2020</option>
        <option value="11.05.2020 0:00:00">11.05.2020</option>
        <option value="04.05.2020 0:00:00">04.05.2020</option>
        <option value="27.04.2020 0:00:00">27.04.2020</option>
        <option value="20.04.2020 0:00:00">20.04.2020</option>
        <option value="13.04.2020 0:00:00">13.04.2020</option>
        <option value="06.04.2020 0:00:00">06.04.2020</option>
        <option value="30.03.2020 0:00:00">30.03.2020</option>
        <option value="23.03.2020 0:00:00">23.03.2020</option>
        <option value="16.03.2020 0:00:00">16.03.2020</option>
        <option value="09.03.2020 0:00:00">09.03.2020</option>
        <option value="02.03.2020 0:00:00">02.03.2020</option>
        <option value="24.02.2020 0:00:00">24.02.2020</option>
        <option value="17.02.2020 0:00:00">17.02.2020</option>
        <option value="10.02.2020 0:00:00">10.02.2020</option>
        <option value="03.02.2020 0:00:00">03.02.2020</option>
        <option value="27.01.2020 0:00:00">27.01.2020</option>
        <option value="20.01.2020 0:00:00">20.01.2020</option>
        <option value="13.01.2020 0:00:00">13.01.2020</option>
        <option value="06.01.2020 0:00:00">06.01.2020</option>
        <option value="30.12.2019 0:00:00">30.12.2019</option>
        <option value="23.12.2019 0:00:00">23.12.2019</option>
        <option value="16.12.2019 0:00:00">16.12.2019</option>
        <option value="09.12.2019 0:00:00">09.12.2019</option>
        <option value="02.12.2019 0:00:00">02.12.2019</option>
        <option value="25.11.2019 0:00:00">25.11.2019</option>
        <option value="18.11.2019 0:00:00">18.11.2019</option>
        <option value="11.11.2019 0:00:00">11.11.2019</option>
        <option value="04.11.2019 0:00:00">04.11.2019</option>
        <option value="28.10.2019 0:00:00">28.10.2019</option>
        <option value="21.10.2019 0:00:00">21.10.2019</option>
        <option value="14.10.2019 0:00:00">14.10.2019</option>
        <option value="07.10.2019 0:00:00">07.10.2019</option>
        <option value="30.09.2019 0:00:00">30.09.2019</option>
        <option value="23.09.2019 0:00:00">23.09.2019</option>
        <option value="16.09.2019 0:00:00">16.09.2019</option>
        <option value="09.09.2019 0:00:00">09.09.2019</option>
        <option value="02.09.2019 0:00:00">02.09.2019</option>
        <option value="15.07.2019 0:00:00">15.07.2019</option>
        <option value="08.07.2019 0:00:00">08.07.2019</option>
        <option value="01.07.2019 0:00:00">01.07.2019</option>
        <option value="24.06.2019 0:00:00">24.06.2019</option>
        <option value="17.06.2019 0:00:00">17.06.2019</option>
        <option value="10.06.2019 0:00:00">10.06.2019</option>
        <option value="03.06.2019 0:00:00">03.06.2019</option>
        <option value="27.05.2019 0:00:00">27.05.2019</option>
        <option value="20.05.2019 0:00:00">20.05.2019</option>
        <option value="13.05.2019 0:00:00">13.05.2019</option>
        <option value="06.05.2019 0:00:00">06.05.2019</option>
        <option value="29.04.2019 0:00:00">29.04.2019</option>
        <option value="22.04.2019 0:00:00">22.04.2019</option>
        <option value="15.04.2019 0:00:00">15.04.2019</option>
        <option value="08.04.2019 0:00:00">08.04.2019</option>
        <option value="01.04.2019 0:00:00">01.04.2019</option>
        <option value="25.03.2019 0:00:00">25.03.2019</option>
        <option value="18.03.2019 0:00:00">18.03.2019</option>
        <option value="11.03.2019 0:00:00">11.03.2019</option>
        <option value="04.03.2019 0:00:00">04.03.2019</option>
        <option value="25.02.2019 0:00:00">25.02.2019</option>
        <option value="18.02.2019 0:00:00">18.02.2019</option>
        <option value="11.02.2019 0:00:00">11.02.2019</option>
        <option value="04.02.2019 0:00:00">04.02.2019</option>
        <option value="28.01.2019 0:00:00">28.01.2019</option>
        <option value="21.01.2019 0:00:00">21.01.2019</option>
        <option value="14.01.2019 0:00:00">14.01.2019</option>
        <option value="07.01.2019 0:00:00">07.01.2019</option>
        <option value="31.12.2018 0:00:00">31.12.2018</option>
        <option value="24.12.2018 0:00:00">24.12.2018</option>
        <option value="17.12.2018 0:00:00">17.12.2018</option>
        <option value="10.12.2018 0:00:00">10.12.2018</option>
        <option value="03.12.2018 0:00:00">03.12.2018</option>
        <option value="26.11.2018 0:00:00">26.11.2018</option>
        <option value="19.11.2018 0:00:00">19.11.2018</option>
        <option value="12.11.2018 0:00:00">12.11.2018</option>
        <option value="05.11.2018 0:00:00">05.11.2018</option>
        <option value="29.10.2018 0:00:00">29.10.2018</option>
        <option value="22.10.2018 0:00:00">22.10.2018</option>
        <option value="15.10.2018 0:00:00">15.10.2018</option>
        <option value="08.10.2018 0:00:00">08.10.2018</option>
        <option value="01.10.2018 0:00:00">01.10.2018</option>
        <option value="24.09.2018 0:00:00">24.09.2018</option>
        <option value="17.09.2018 0:00:00">17.09.2018</option>
        <option value="09.07.2018 0:00:00">09.07.2018</option>
        <option value="02.07.2018 0:00:00">02.07.2018</option>
        <option value="25.06.2018 0:00:00">25.06.2018</option>
        <option value="18.06.2018 0:00:00">18.06.2018</option>
        <option value="11.06.2018 0:00:00">11.06.2018</option>
        <option value="04.06.2018 0:00:00">04.06.2018</option>
        <option value="28.05.2018 0:00:00">28.05.2018</option>
        <option value="21.05.2018 0:00:00">21.05.2018</option>
        <option value="14.05.2018 0:00:00">14.05.2018</option>
        <option value="07.05.2018 0:00:00">07.05.2018</option>
        <option value="30.04.2018 0:00:00">30.04.2018</option>
        <option value="23.04.2018 0:00:00">23.04.2018</option>
        <option value="16.04.2018 0:00:00">16.04.2018</option>
        <option value="09.04.2018 0:00:00">09.04.2018</option>
        <option value="02.04.2018 0:00:00">02.04.2018</option>
        <option value="26.03.2018 0:00:00">26.03.2018</option>
        <option value="19.03.2018 0:00:00">19.03.2018</option>
        <option value="12.03.2018 0:00:00">12.03.2018</option>
        <option value="05.03.2018 0:00:00">05.03.2018</option>
        <option value="26.02.2018 0:00:00">26.02.2018</option>
        <option value="19.02.2018 0:00:00">19.02.2018</option>
        <option value="12.02.2018 0:00:00">12.02.2018</option>
        <option value="05.02.2018 0:00:00">05.02.2018</option>
        <option value="29.01.2018 0:00:00">29.01.2018</option>
        <option value="22.01.2018 0:00:00">22.01.2018</option>
        <option value="15.01.2018 0:00:00">15.01.2018</option>
        <option value="08.01.2018 0:00:00">08.01.2018</option>
        <option value="01.01.2018 0:00:00">01.01.2018</option>
        <option value="25.12.2017 0:00:00">25.12.2017</option>
        <option value="18.12.2017 0:00:00">18.12.2017</option>
        <option value="11.12.2017 0:00:00">11.12.2017</option>
        <option value="04.12.2017 0:00:00">04.12.2017</option>
        <option value="27.11.2017 0:00:00">27.11.2017</option>
        <option value="20.11.2017 0:00:00">20.11.2017</option>
        <option value="13.11.2017 0:00:00">13.11.2017</option>
        <option value="06.11.2017 0:00:00">06.11.2017</option>
        <option value="30.10.2017 0:00:00">30.10.2017</option>
        <option value="23.10.2017 0:00:00">23.10.2017</option>
        <option value="16.10.2017 0:00:00">16.10.2017</option>
        <option value="09.10.2017 0:00:00">09.10.2017</option>
        <option value="02.10.2017 0:00:00">02.10.2017</option>
        <option value="18.09.2017 0:00:00">18.09.2017</option>
        <option value="11.09.2017 0:00:00">11.09.2017</option>
        <option value="04.09.2017 0:00:00">04.09.2017</option>
        <option value="28.08.2017 0:00:00">28.08.2017</option>
        <option value="20.02.2017 0:00:00">20.02.2017</option>

</select><div class="chosen-container chosen-container-single" style="width: 95px;" title="" id="ddlWeek_chosen"><a class="chosen-single" tabindex="-1"><span>14.06.2021</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>

        </div>
        <div class="action_1">
            <input type="submit" name="ShowTT" value="Показать" id="ShowTT" class="hidden">
            <div class="show chosen-container chosen-container-single"><a class="chosen-single button">Показать</a></div>
        </div>
    </div>
    <a id="HyperLink1" href="PrintPage.aspx?arg0=156&amp;arg1=2&amp;arg2=2&amp;arg3=1&amp;arg4=1&amp;date=14.06.2021 0:00:00" target="_blank">Печать</a>
    <br>
            <span id="lMessage"></span>
    <table id="TT">
        <caption>
                Расписание занятий на неделю с 14.06.2021<br>Факультет мониторинга окружающей среды, дневная форма
                         обучения, 1 курс, группа А01ИСТ1
        </caption><tbody><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-header">
                <td class="cell-header cell-date">Дата</td><td class="cell-header cell-time">Время</td><td class="cell-header cell-subgroup">Подгруппа</td><td class="cell-header cell-discipline">Дисциплина</td><td class="cell-header cell-staff">Преподаватель</td><td class="cell-header cell-auditory">Аудитория</td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-spanned">
                <td class="cell-date" rowspan="1"><span class="day">Понедельник</span> <span class="date">14.06.2021</span></td><td class="cell-time">16:25-17:45</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">конс. Математический анализ<span class="topic"></span></td><td class="cell-staff">ст.пр. Коледа Денис Владимирович</td><td class="cell-auditory">ауд. 209, К3</td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-spanned">
                <td class="cell-date" rowspan="3"><span class="day">Вторник</span> <span class="date">15.06.2021</span></td><td class="cell-time">08:30-09:50</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">экзамен Математический анализ<span class="topic"></span></td><td class="cell-staff">ст.пр. Коледа Денис Владимирович</td><td class="cell-auditory">ауд. 209, К3</td>
        </tr><tr class="row">
                <td class="cell-time">10:05-11:25</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">экзамен Математический анализ<br><span class="topic"></span></td><td class="cell-staff">ст.пр. Коледа Денис Владимирович</td><td class="cell-auditory">ауд. 209, К3</td>
        </tr><tr class="row">
                <td class="cell-time">11:35-12:55</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">экзамен Математический анализ<br><span class="topic"></span></td><td class="cell-staff">ст.пр. Коледа Денис Владимирович</td><td class="cell-auditory">ауд. 209, К3</td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-empty">
                <td class="cell-date"><span class="day">Среда</span> <span class="date">16.06.2021</span></td><td class="cell-empty" colspan="5"></td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-empty">
                <td class="cell-date"><span class="day">Четверг</span> <span class="date">17.06.2021</span></td><td class="cell-empty" colspan="5"></td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-spanned">
                <td class="cell-date" rowspan="1"><span class="day">Пятница</span> <span class="date">18.06.2021</span></td><td class="cell-time">14:55-16:15</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">конс. Химия. Органическая химия<span class="topic"></span></td><td class="cell-staff">проф. Квасюк Евгений Иванович</td><td class="cell-auditory">ауд. 303, К3</td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-spanned">
                <td class="cell-date today-date" rowspan="3"><span class="day">Суббота</span> <span class="date">19.06.2021</span></td><td class="cell-time">08:30-09:50</td><td 
class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">экзамен Химия. Органическая химия<span class="topic"></span></td><td class="cell-staff">проф. Квасюк Евгений Иванович</td><td class="cell-auditory">ауд. 303, К3</td>
        </tr><tr class="row">
                <td class="cell-time time-now">10:05-11:25</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">экзамен Химия. Органическая химия<br><span class="topic"></span></td><td class="cell-staff">проф. Квасюк Евгений Иванович</td><td class="cell-auditory">ауд. 303, К3</td>
        </tr><tr class="row">
                <td class="cell-time time-next">11:35-12:55</td><td class="cell-subgroup"></td><td class="cell-discipline bold" colspan="1">экзамен Химия. Органическая химия<br><span class="topic"></span></td><td class="cell-staff">проф. Квасюк Евгений Иванович</td><td class="cell-auditory">ауд. 303, К3</td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr><tr class="row row-empty">
                <td class="cell-date"><span class="day">Воскресенье</span> <span class="date">20.06.2021</span></td><td class="cell-empty" colspan="5"></td>
        </tr><tr class="row row-separator">
                <td colspan="6"></td>
        </tr>
</tbody></table>
    <input name="iframeheight" id="iframeheight" type="hidden" value="400">
    <p class="help-msg">

    </p>
    </form>
    <table id="Table1">

</table>




</body></html>`;

app.get("/", (req, res) => {
  res.send({ message: "Hello world!" });
});

function getOptionsFromSelect(cheerio, selector) {
  return cheerio(selector)[0]
    .children.filter((elem) => elem.name === "option")
    .map((elem) => ({
      id: elem.attribs.value,
      value: elem.children[0].data.trim(),
    }));
}

function setObjectProperties(elem, className) {
  return elem.children
    .find((el) => el.attribs?.class.includes(className))
    ?.children[0]?.data.trim();
}

async function selectValueFromDropdown(page, selector, value) {
  await page.select(selector, value);
  await page.waitForNavigation();
}

const FACULTY_SELECTOR = "#ddlFac";
const DEPARTMENT_SELECTOR = "#ddlDep";
const COURSE_SELECTOR = "#ddlCourse";
const GROUP_SELECTOR = "#ddlGroup";
const DATE_SELECTOR = "#ddlWeek";

/**
 * URL params
 * @param {faculty}
 * @param {department}
 * @param {course}
 * @param {group}
 */
app.get("/metainfo", async (req, res) => {
  const { faculty, department, course, group } = req.query;
  console.log(faculty, department, course, group);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://rsp.iseu.by/Raspisanie/TimeTable/umu.aspx");

  if (faculty) {
    // TODO: sequence?
    await page.select(FACULTY_SELECTOR, faculty);
    await page.waitForNavigation();
  }

  const html = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(html);

  const faculties = getOptionsFromSelect($, FACULTY_SELECTOR);
  const departments = getOptionsFromSelect($, DEPARTMENT_SELECTOR);
  const courses = getOptionsFromSelect($, COURSE_SELECTOR);
  const groups = getOptionsFromSelect($, GROUP_SELECTOR);
  const dates = getOptionsFromSelect($, DATE_SELECTOR);
  // await page.screenshot({ path: 'example.png' });

  await browser.close();

  res.send({ faculties, departments, groups, dates, courses });
});

// app.get("/temp", async (req, res) => {
//   const $ = cheerio.load(HTML);
//   const table = $("#TT");

//   console.log(
//     table[0].children[2].children
//       .filter((elem) => elem.name === "tr")
//       .filter(
//         (elem) =>
//           elem.attribs.class === "row" ||
//           elem.attribs.class === "row row-spanned"
//       )
//       .map((elem) => ({
//         date: new Date(), // селатать не работает ата нужно из опреелого запоминать
//         time: elem.children[1].attribs?.class.includes("cell-time")
//           ? elem.children[1].children[0].data
//           : undefined,
//         subgroup: elem.children[2].attribs?.class.includes("cell-subgroup")
//           ? elem.children[2].data
//           : undefined,
//         discipline: elem.children[3].attribs?.class.includes(
//           "cell-discipline bold"
//         )
//           ? elem.children[3].children[0].data
//           : undefined,
//         teacher: elem.children[4].attribs?.class.includes("cell-staff")
//           ? elem.children[4].children[0].data
//           : undefined,
//         room: elem.children[5].attribs?.class.includes("cell-auditory")
//           ? elem.children[5].children[0].data
//           : undefined,
//       }))
//   );

//   res.send({ 123: "HE wrd" });
// });

/**
 * URL params (al of them are required)
 * @param {faculty}
 * @param {department}
 * @param {course}
 * @param {group}
 * @param {date}
 */
app.get("/schedule", async (req, res) => {
  const { faculty, department, course, group, date } = req.query;
  console.log(faculty, department, course, group, date);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://rsp.iseu.by/Raspisanie/TimeTable/umu.aspx");

  await selectValueFromDropdown(page, FACULTY_SELECTOR, faculty);
  await selectValueFromDropdown(page, COURSE_SELECTOR, course);
  await selectValueFromDropdown(page, DEPARTMENT_SELECTOR, department);
  await selectValueFromDropdown(page, GROUP_SELECTOR, group);
  await selectValueFromDropdown(page, DATE_SELECTOR, date);
  await page.click('[class="chosen-single button"]');

  // TODO: find a way how to not use hardcoded const (how to detect, whether page was reloaded?)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // await page.waitForNavigation();

  const html = await page.evaluate(() => document.querySelector("*").outerHTML);
  const $ = cheerio.load(html);
  const table = $("#TT");
  let day;

  const schedule = table[0].children[2].children
    .filter(
      (elem) =>
        elem.name === "tr" &&
        (elem.attribs.class === "row" ||
          elem.attribs.class === "row row-spanned")
    )
    .map((elem) => ({
      date: (day =
        elem.attribs.class === "row row-spanned"
          ? elem.children
              .find((el) => el.attribs?.class.includes("cell-date"))
              ?.children[0]?.children[0]?.data.trim()
          : day),

      time: setObjectProperties(elem, "cell-time"),

      subgroup: setObjectProperties(elem, "cell-subgroup"),

      discipline: setObjectProperties(elem, "cell-discipline"),

      teacher: setObjectProperties(elem, "cell-staff"),

      room: setObjectProperties(elem, "cell-auditory"),
    }));

  res.send(schedule);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
