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
copyusername();
parseurl();

