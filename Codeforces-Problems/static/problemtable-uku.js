document.getElementById("submitUsername").onclick = function() {
	var username = document.getElementById("username")
	changeBackColorDefault("td")
	usernameProcess(username.value)
};
        function flipTagshowhide(boolvisible){
            var elements = document.getElementsByClassName("problem-tag");
            if (boolvisible){
                for(i=0;i<elements.length;i++){
                    elements[i].style.visibility="visible"
                }
            }else {
                for(i=0;i<elements.length;i++){
                    elements[i].style.visibility="hidden"
                }
            }
        }

function changeBackColorDefault(classname){
  var elements = document.getElementsByTagName(classname);
  for(i=0;i<elements.length;i++){
    elements[i].style.backgroundColor = "transparent"; // default color
  }
}      

function changeBackColorAC(classname){
  var elements = document.getElementsByClassName(classname);
  for(i=0;i<elements.length;i++){
    elements[i].style.backgroundColor = "#D5EAD8"; // accept color
  }
}
function changeBackColorWA(classname){
  var elements = document.getElementsByClassName(classname);
  for(i=0;i<elements.length;i++){
    elements[i].style.backgroundColor = "#F2DEDE"; // wrong answer color
  }
}
function abledTags(classname){ // tag戻す
  var elements = document.getElementsByClassName(classname);
  for(i=0;i<elements.length;i++){
    elements[i].style.visibility="visible"
  }
}
function disabledTags(classname){ // tag消す
  var elements = document.getElementsByClassName(classname);
  for(i=0;i<elements.length;i++){
    elements[i].style.visibility="hidden"
  }
}
function usernameProcess(username){
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function()
	{
	    if( this.readyState == 4 && this.status == 200 )
	    {
	        if( this.response )
	        {
	            var usersub = (this.response["result"]);
				
				var ProblemState = {}
				for(var i = 0 ; i < usersub.length ; i++){
					var ProblemId = usersub[i]["problem"]["contestId"] + usersub[i]["problem"]["index"]
					var Verdict = usersub[i]["verdict"]
					if (Verdict === "OK"){
						ProblemState[ProblemId] = "AC"
	                }else {
						if ((ProblemId in ProblemState)&&(ProblemState[ProblemId]==="AC"))continue;
						// TODO: add other State
						//ProblemState[ProblemId] = "??"
						ProblemState[ProblemId] = "WA"
						
				
	                }
	            }
				
				var ProblemStateCnt = Object.keys(ProblemState).length

				// 取ってこれたので色を🐸
				for (var problemId in ProblemState){	
					if (ProblemState[problemId]==="AC"){
						changeBackColorAC(problemId)
	                }else {
	                	changeBackColorWA(problemId)
					}
				}
	        }
	    }
	}

	xmlHttpRequest.open( 'GET', 'https://codeforces.com/api/user.status?handle='+username, true );
	xmlHttpRequest.responseType = 'json';
	xmlHttpRequest.send( null );
}

function parseurl(){
	var parser = new URL(location.href);
	var username = parser.searchParams.get("user");
	if (username !== "" && username !== null){
		changeBackColorDefault("td");
		usernameProcess(username);
	}
}
function copyusername(){
	var parser = new URL(location.href);
	var username = parser.searchParams.get("user");
	if (username !== "" && username !== null){
		document.getElementById("username").value = username;
	}
}


// TABLE
var options = {
  valueNames: [ 'problem-name', 'point', 'solvecount', 'tags' ]
};
var tablelist = new List('ptable', options);

function filtertable(minpoint,maxpoint,minsolved,maxsolved){
      tablelist.filter(
        function(item){
          var point_n = parseInt( item.values().point, 10) || 0;
          var solved_n = parseInt( item.values().solvecount, 10);
          
          if (
              (
               ( isNaN( minpoint ) && isNaN( maxpoint ) ) ||
               ( isNaN( minpoint ) && point_n <= maxpoint ) ||
               ( minpoint <= point_n   && isNaN( maxpoint ) ) ||
               ( minpoint <= point_n   && point_n <= maxpoint )
              ) && (
               ( isNaN( minsolved ) && isNaN( maxsolved ) ) ||
               ( isNaN( minsolved ) && solved_n <= maxsolved ) ||
               ( minsolved <= solved_n   && isNaN( maxsolved ) ) ||
               ( minsolved <= solved_n   && solved_n <= maxsolved )
              )
             )
          {
            return true;
          }else{
            return false;
          }
        }
      );
      console.log("!!");
}


var headers = document.querySelectorAll('th.sort');
for (var i = 0; i < headers.length; i++) {
  headers[i].addEventListener('click', function (){
    for (var j = 0; j < headers.length; j++) {
      var classList = headers[j].classList;
      classList.remove('mdl-data-table__header--sorted-ascending');
      classList.remove('mdl-data-table__header--sorted-descending');
      if (classList.contains('asc')) {
        classList.add('mdl-data-table__header--sorted-ascending');
      } else if (classList.contains('desc')) {
        classList.add('mdl-data-table__header--sorted-descending');
      }
    }
  });
}

// ダメダメ
headers[2].click();
headers[2].click();

// CODE IS HERE
function parseurl_uku(){
	var parser = new URL(location.href);
	var username = parser.searchParams.get("user");
	var minpoint = parser.searchParams.get("mindifficulty");
	var maxpoint = parser.searchParams.get("maxdifficulty");
	var minsolved = parser.searchParams.get("minsolved");
	var maxsolved = parser.searchParams.get("maxsolved");
	if (username !== "" && username !== null){
		changeBackColorDefault("td");
		usernameProcess(username);
	}
	filtertable(minpoint,maxpoint,minsolved,maxsolved);
	
}
function copyusername_uku(){
	var parser = new URL(location.href);
	var username = parser.searchParams.get("user");
	if (username !== "" && username !== null){
		document.getElementById("username").value = username;
	}
	var minpoint = parser.searchParams.get("mindifficulty");
	if (minpoint !== "" && minpoint !== null){
		document.getElementById("mindiff").value = minpoint;
	}
	var maxpoint = parser.searchParams.get("maxdifficulty");
	if (maxpoint !== "" && maxpoint !== null){
		document.getElementById("maxdiff").value = maxpoint;
	}
	var minsolved = parser.searchParams.get("minsolved");
	if (minsolved !== "" && minsolved !== null){
		document.getElementById("minsolve").value = minsolved;
	}
	var maxsolved = parser.searchParams.get("maxsolved");
	if (maxsolved !== "" && maxsolved !== null){
		document.getElementById("maxsolve").value = maxsolved;
	}
	
}


copyusername_uku();
parseurl_uku();

