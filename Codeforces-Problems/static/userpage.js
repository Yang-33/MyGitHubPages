var api_url = "https://codeforces.com/api/";
var handle = "";

var verdicts = {};
var langs = {};
var tags = {};
var levels = {};
var problems = {};
var totalSub = 0;
var heatmap = {};
var heatmapData = {};
var years = 0;
var datesarray = []; // streak

var req1, req2;

var titleTextStyle = {
    fontSize: 18,
    color: '#393939',
    bold: false
};

google.charts.load('current', { 'packages': ['corechart', 'calendar'] });

function exec(handle) {

    // When the handle form is submitted, this function is called...
    {

        resetData();  // When a new submission is made, clear all the previous data and graphs

        if (!handle) {
            err_message("handleDiv", "Enter a name");
            $("#mainSpinner").removeClass("is-active");
            return; // No handle is provided, we can't do anything.
        }


        // getting all the submissions of a user
        req1 = $.get(api_url + "user.status", { "handle": handle }, function (data, status) {

            $(".sharethis").removeClass("hidden");

            if (data.result.length < 1) {
                err_message("handleDiv", "No submissions");
                return;
            }

            // parsing all the submission and saving useful data. Don't remember why from the back
            for (var i = data.result.length - 1; i >= 0; i--) {
                var sub = data.result[i];
                var problemId = sub.problem.contestId + '-' + sub.problem.index;
                if (problems[problemId] === undefined) {  // first submission of a problem
                    problems[problemId] = {
                        attempts: 1,
                        solved: 0,  // We also want to save how many submission got AC, a better name would have been number_of_ac
                    };
                } else {
                    //we want to show how many time a problem was attempted by a user before getting first AC
                    if (problems[problemId].solved === 0) problems[problemId].attempts++;
                }

                if (verdicts[sub.verdict] === undefined) verdicts[sub.verdict] = 1;
                else verdicts[sub.verdict]++;

                if (langs[sub.programmingLanguage] === undefined) langs[sub.programmingLanguage] = 1;
                else langs[sub.programmingLanguage]++;

                if (sub.verdict == 'OK') {
                    // This is probably no entirely correct. because for multiple ac tag count will increase every time
                    sub.problem.tags.forEach(function (t) {
                        if (tags[t] === undefined) tags[t] = 1;
                        else tags[t]++;
                    });

                    if (levels[sub.problem.index[0]] === undefined) levels[sub.problem.index[0]] = 1;
                    else levels[sub.problem.index[0]]++;

                    problems[problemId].solved++;
                }

                //updating the heatmap
                var date = new Date(sub.creationTimeSeconds * 1000);  // submission date
                datesarray.push(date);
                date.setHours(0, 0, 0, 0);
                if (heatmap[date.valueOf()] === undefined) heatmap[date.valueOf()] = 1;
                else heatmap[date.valueOf()]++;
                totalSub = data.result.length;

                // how many years are there between first and last submission
                years = new Date(data.result[0].creationTimeSeconds * 1000).getYear() - new Date(data.result[data.result.length - 1].creationTimeSeconds * 1000).getYear();
                years = Math.abs(years) + 1;
            }


            // finally draw the charts if google charts is already loaded,
            // if not set load callback to draw the charts
            if (typeof google.visualization === 'undefined') {
                google.charts.setOnLoadCallback(drawCharts);
            } else {
                drawCharts();
            }
        }).fail(function (xhr, status) {
            //console.log(xhr.status);
            if (status != 'abort') err_message("handleDiv", "Couldn't find user");
        })
            .always(function () {
                $("#mainSpinner").removeClass("is-active");
                //$(".share-div").removeClass("hidden");
            });


        // With this request we get all the rating changes of the user
        req2 = $.get(api_url + "user.rating", { 'handle': handle }, function (data, status) {
            if (data.result.length < 1) {
                err_message("handleDiv", "No contests");
                return;
            }
            var best = 1e10;
            var worst = -1e10;
            var maxUp = 0;
            var maxDown = 0;
            var bestCon = "";
            var worstCon = "";
            var maxUpCon = "";
            var maxDownCon = "";
            var tot = data.result.length;

            data.result.forEach(function (con) {  // con is a contest
                if (con.rank < best) {
                    best = con.rank;
                    bestCon = con.contestId;
                }
                if (con.rank > worst) {
                    worst = con.rank;
                    worstCon = con.contestId;
                }
                var ch = con.newRating - con.oldRating;
                if (ch > maxUp) {
                    maxUp = ch;
                    maxUpCon = con.contestId;
                }
                if (ch < maxDown) {
                    maxDown = ch;
                    maxDownCon = con.contestId;
                }
            });

            // Showing the rating change data in proper places
            /*
            var con_url = "https://codeforces.com/contest/";
            $("#contests").removeClass("hidden");
            $('.handle-text').html(handle);
            $("#contestCount").html(tot);
            $("#best").html(best + "<a href=\"" + con_url + bestCon + "\" target=\"_blank\"> (" + bestCon + ") </a>");
            $("#worst").html(worst + "<a href=\"" + con_url + worstCon + "\" target=\"_blank\"> (" + worstCon + ") </a>");
            $("#maxUp").html(maxUp + "<a href=\"" + con_url + maxUpCon + "\" target=\"_blank\"> (" + maxUpCon + ") </a>");
            $("#maxDown").html(maxDown?maxDown + "<a href=\"" + con_url + maxDownCon + "\" target=\"_blank\"> (" + maxDownCon + ") </a>":'---');
            */
        });
        console.log("exec end.")
    };


    // this is to update the heatmap when the form is submitted, contributed
    $("#heatmapCon input").keypress(function (e) {
        var value = $(this).val();
        //Enter pressed
        if (e.which == 13 && value >= 0 && value <= 999) {
            var heatmapOptions = {
                height: years * 140 + 30,
                width: Math.max($('#heatmapCon').width(), 900),
                fontName: 'Roboto',
                titleTextStyle: titleTextStyle,
                colorAxis: {
                    minValue: 0,
                    maxValue: value,
                    colors: ['#ffffff', '#239a3b']
                },
                calendar: {
                    cellSize: 15,
                }
            };
            heatmap.draw(heatmapData, heatmapOptions);
        }
    });



};

function drawCharts() {
    var parser = new URL(location.href);
    var handle = parser.searchParams.get("user");
    $('#heatmapCon').removeClass('hidden');
    $('#heatMapHandle').html(handle);
    var heatmapTable = [];
    for (var d in heatmap) {
        heatmapTable.push([new Date(parseInt(d)), heatmap[d]]);
    }
    heatmapData = new google.visualization.DataTable();
    heatmapData.addColumn({ type: 'date', id: 'Date' });
    heatmapData.addColumn({ type: 'number', id: 'Submissions' });
    heatmapData.addRows(heatmapTable);

    heatmap = new google.visualization.Calendar(document.getElementById('heatmapDiv'));
    var heatmapOptions = {
        height: years * 140 + 30,
        width: Math.max($('#heatmapCon').width(), 900),
        fontName: 'Roboto',
        titleTextStyle: titleTextStyle,
        colorAxis: {
            minValue: 0,
            colors: ['#ffffff', '#239a3b']
        },
        calendar: {
            cellSize: 15,
        }
    };
    heatmap.draw(heatmapData, heatmapOptions);

    //parse all the solved problems and extract some numbers about the solved problems
    var tried = 0;
    var solved = 0;
    var maxAttempt = 0;
    var maxAttemptProblem = "";
    var maxAc = "";
    var maxAcProblem = "";
    var unsolved = [];
    var solvedWithOneSub = 0;
    for (var p in problems) {
        tried++;
        if (problems[p].solved > 0) solved++;
        if (problems[p].solved === 0) unsolved.push(p);

        if (problems[p].attempts > maxAttempt) {
            maxAttempt = problems[p].attempts;
            maxAttemptProblem = p;
        }
        if (problems[p].solved > maxAc) {
            maxAc = problems[p].solved;
            maxAcProblem = p;
        }

        if (problems[p].solved == problems[p].attempts) solvedWithOneSub++;
    }
    /*
    $('#numbers').removeClass('hidden');
    $('.handle-text').html(handle);
    $("#tried").html(tried);
    $("#solved").html(solved);
    $("#maxAttempt").html(maxAttempt + "<a href=\"" + get_url(maxAttemptProblem) + "\" target=\"blank\" > (" + maxAttemptProblem + ") </a>");
    if (maxAc > 1) $("#maxAc").html(maxAc + "<a href=\"" + get_url(maxAcProblem) + "\" target=\"blank\" > (" + maxAcProblem + ") </a>");
    else $("#maxAc").html(solved?1:0);
    $("#averageAttempt").html((totalSub / solved).toFixed(2));
    $("#solvedWithOneSub").html(solvedWithOneSub+" ("+(solved?(solvedWithOneSub/solved*100).toFixed(2):0)+"%)");
  */
    $('#unsolvedCon').removeClass('hidden');
    unsolved.forEach(function (p) {
        var url = get_url(p);
        $("#unsolvedList").append("<div><a href=\"" + url + "\" target=\"_blank\" class=\"lnk\">" + p + "</a></div>");
    });

}

// reset all data
function resetData() {
    // if the requests were already made, abort them
    if (req1) req1.abort();
    if (req2) req2.abort();
    verdicts = {};
    langs = {};
    tags = {};
    levels = {};
    problems = {};
    totalSub = 0;
    heatmap = {};
    $("#mainSpinner").addClass("is-active");
    $(".to-clear").empty();
    $(".to-hide").addClass("hidden");

}


// receives the problem id like 650-A
// splits the contest id and problem index and returns the problem url
function get_url(p) {
    var con = p.split('-')[0];
    var index = p.split('-')[1];

    var url = "";
    if (con.length < 4) url = "https://codeforces.com/contest/" + con + "/problem/" + index;
    else url = "https://codeforces.com/problemset/gymProblem/" + con + "/" + index; // TODO: research gym url

    return url;
}

//Copied from stackoverflow :D gets url paramenter by name
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// shows am error message in the input form
// Needs the div name of the input widget
function err_message(div, msg) {
    $("#" + div + "Err").html(msg);
    $("#" + div).addClass("is-invalid");
}

sortDates = dates => {
    return dates
        .sort(function (a, b) {
            return (
                moment(moment(b).startOf("day")).format("X") -
                moment(moment(a).startOf("day")).format("X")
            );
        })
        .reverse();
};


function TimeFormatter(num) {
    let date = moment(num);
    return date.format("Y-MM-DD");
}

function calc_streaks(handle) {
    datesarray = sortDates(datesarray);
    let longestStreak = 0;
    let currentStreak = 0;
    let lastAcceptedDate = "None";

    if (datesarray.length > 0) {
        currentStreak = 1;
        longestStreak = 1;
        lastAcceptedDate = TimeFormatter(
            datesarray[0].getTime()
        );
    }
    for (i = 0; i < datesarray.length; i++) {
        second = datesarray[i].getTime() / 1000;
        if (i > 0) {
            let yesterday = TimeFormatter(
                (second - 24 * 3600) * 1000
            );
            if (lastAcceptedDate === yesterday) {
                currentStreak += 1;
            } else if (lastAcceptedDate < yesterday) {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
        lastAcceptedDate = TimeFormatter(second * 1000);
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    let yesterday = TimeFormatter(
        new Date().getTime() - 24 * 3600 * 1000
    );
    if (lastAcceptedDate < yesterday) {
        currentStreak = 0;
    }

    console.log(longestStreak);
    console.log(currentStreak);
    console.log("username:", handle);
    datesarray = [];
    // 
    $("#streak").removeClass("hidden");
    $('.handle-text').html(handle);
    $("#maxStreak").html(longestStreak + " days");
    $("#nowStreak").html(currentStreak + " days");
}

function parseurl() {
    var parser = new URL(location.href);
    var username = parser.searchParams.get("user");
    if (username !== "" && username !== null) {

        $.when(
            console.log("UKUCHAN1"),
            exec(username),
            console.log("UKUCHAN2")
        ).done(function () {
            console.log("UKUCHAN3");
            calc_streaks(username);
            console.log("UKUCHAN4");
        });
    }
}
function copyusername() {
    var parser = new URL(location.href);
    var username = parser.searchParams.get("user");
    if (username !== "" && username !== null) {
        document.getElementById("username").value = username;
    }
}

//var promise = Promise.resolve();
//promise
//    .then(exec(username))
//    .then(calc_streaks)

$.when(
    copyusername()
).done(function () {
    parseurl();
});
