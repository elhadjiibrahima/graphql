import { ProjetGraph } from "./graphs.js";
import { ratioGraph } from "./graphs.js";
import { userLogin } from "./index.js";

export function student(token) {
    
    fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
        method: 'Post', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
          {

            user {
              id
              login
              lastName 
              firstName
              email
              auditRatio
              
            }
              xpTotal: transaction_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: 56}}) {
            aggregate {
                sum {
                    amount
                }
            }
            }
         xps:transaction(where: {type: {_eq: "xp"}, path: {_like: "/dakar/div-01/%"}}, order_by: {amount: desc}, limit: 10)
          {
            path
            amount
            createdAt
          }
          audits: transaction(
            order_by: {createdAt: desc}
            where: {type: {_regex: "up|down"}}
            
          ) {
            type
            amount
            path
            createdAt
          }
          myLevel:transaction(where: {type: {_eq: "level"}, path: {_ilike: "/dakar/div-01%"}}
          order_by: {amount:desc}
          limit: 1){
            amount
          }
          myAudits:user {
            totalUp
            totalDown
          }
          
        }
        
        
          `
        })
      })
      .then(res => res.json())
      .then(data => {
        // data contains results of query
        console.log(data)
        const userData = data.data.user[0];
        const totalXP = Math.round(data.data.xpTotal.aggregate.sum.amount/1000);
        let myDatas = {
            userInfos: userData,
            xpTotal: totalXP,
            level: data.data.myLevel[0].amount,
            xps: data.data.xps,
            audits: data.data.myAudits
        }
        console.log(myDatas)
        constHTMLElements(myDatas, token)
      });
}   

export function constHTMLElements(data, cred) {
    if (cred === null) {
        userLogin()
    }
    const xpArr = data.xps.map(ele => [ele.path.split('/')[3], ele.amount]);
    const auditDone =  data.audits[0].totalUp/(data.audits[0].totalUp+data.audits[0].totalDown)
    const auditReceived =  data.audits[0].totalDown/(data.audits[0].totalUp+data.audits[0].totalDown)

    xpArr[0].push("#b87333")
    xpArr[1].push("#00FF00")
    xpArr[2].push("gold")
    xpArr[3].push("color: #00FFFF")
    xpArr[4].push("#FF00FF")
    xpArr[5].push("#ba4a00")
    xpArr[6].push("#8e44ad")
    xpArr[7].push("green")
    xpArr[8].push("red")
    xpArr[9].push("black")
    console.log('xpssss: ', xpArr)
    const main = document.createElement('div');
    main.classList.add('content');
    const userInfosElement = document.createElement('section');
    const firstGraphElement = document.createElement('section');
    const secondGraphElement = document.createElement('section');
    main.style.width ='100%';
    main.style.height ='100%';
    userInfosElement.style.width ='100%';
    userInfosElement.style.height ='30%';
    userInfosElement.style.display ='flex';
    userInfosElement.innerHTML = ` <button id="exit" style="width:10vh; height: 5vh; position: absolute; background: #f24444; border-radius: 10px; color: white; font-weight: bold;">Log out</button>
                                `;
    const infos = document.createElement('section');
    infos.innerHTML = `<span>Login:  ${data.userInfos.login} </span>
                        <span>FirstName:  ${data.userInfos.firstName} </span>
                        <span>LastName:  ${data.userInfos.lastName} </span>
                        <span>Email: ${data.userInfos.email} </span>
                        `
    const xpAmountElement = document.createElement('section');
    const skillsElement = document.createElement('section');
    infos.style.width ='15%';
    infos.style.height ='100%';
    infos.style.marginLeft ='auto';
    infos.style.display ='flex';
    infos.style.flexDirection ='column';
    xpAmountElement.style.width ='35%';
    xpAmountElement.style.height ='100%';
    skillsElement.style.width ='35%';
    skillsElement.style.height ='100%';
    xpAmountElement.innerHTML = `
                                <h1>TOTAL XP</h1>
                                <h1>${data.xpTotal}</h1>
    `
    xpAmountElement.style.display = 'flex';
    xpAmountElement.style.flexDirection = 'column';
    xpAmountElement.style.alignItems = 'center';
    xpAmountElement.style.fontSize = 'x-large';
    xpAmountElement.style.color = 'antiquewhite';
    xpAmountElement.style.borderRadius = '55%';

    skillsElement.innerHTML = `
                                <h1>YOUR CURRENT LEVEL</h1>
                                <h1>${data.level}</h1>
    `
    skillsElement.style.display = 'flex';
    skillsElement.style.flexDirection = 'column';
    skillsElement.style.alignItems = 'center';
    skillsElement.style.fontSize = 'x-large';
    skillsElement.style.color = 'antiquewhite';
    skillsElement.style.borderRadius = '55%';
    userInfosElement.appendChild(infos);
    userInfosElement.appendChild(xpAmountElement);
    userInfosElement.appendChild(skillsElement);

    firstGraphElement.style.width ='45%';
    firstGraphElement.style.height ='35%';
    secondGraphElement.style.width ='45%';
    secondGraphElement.style.height ='35%';
    firstGraphElement.classList.add('barGraphContent');
    firstGraphElement.innerHTML = `
    <script type="text/javascript">
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Project", "XP", { role: "style" }],
            ${xpArr[0]},
            ${xpArr[1]},
            ${xpArr[2]},
            ${xpArr[3]},
            ${xpArr[4]},
            ${xpArr[5]},
            ${xpArr[6]},
            ${xpArr[7]},
            ${xpArr[8]},
            ${xpArr[9]}
            
        ]);

        var options = {
            title: "Your last ten projects with the most XP",
            width: 900,
            height: 400,
            bar: { groupWidth: "55%" },
            legend: { position: "none" },
        };
      var chart = new google.visualization.BarChart(document.getElementById("projet_names"));
      chart.draw(view, options);
  }
  </script>
<div id="projet_names""></div>
    `
    secondGraphElement.innerHTML = `
      <script type="text/javascript">
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Done',  ${auditDone}],
            ['Received',    ${auditReceived}]
          ]);
  
          var options = {
            title: 'Your audits ratios',
            pieHole: 0.1,
          };
  
          var chart = new google.visualization.PieChart(document.getElementById('ratioGraphs'));
          chart.draw(data, options);
        }
      </script>
      <div id="ratioGraphs" style="width: 550px; height: 440px;"></div>
    `
    main.appendChild(userInfosElement);
    main.appendChild(firstGraphElement);
    main.appendChild(secondGraphElement);
    const logForm = document.querySelector('.login-box');
    document.body.removeChild(logForm);
    document.body.appendChild(main);
    document.body.style.background = 'black';
    ProjetGraph(xpArr)
    ratioGraph(auditDone, auditReceived)
    const butExit = document.getElementById('exit');
    butExit.addEventListener('click', ()=>{
        localStorage.removeItem('userJwt');
        document.body.removeChild(main)
        userLogin()
    })
}
