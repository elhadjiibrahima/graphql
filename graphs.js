export function ProjetGraph(userXps) {
    google.charts.load("current", { packages: ["corechart"] });

    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Project", "XP", { role: "style" }],
            userXps[0],
            userXps[1],
            userXps[2],
            userXps[3],
            userXps[4],
            userXps[5],
            userXps[6],
            userXps[7],
            userXps[8],
            userXps[9]
        ]);

        var options = {
            title: "Your last ten projects with the most XP",
            width: 900,
            height: 400,
            bar: { groupWidth: "55%" },
            legend: { position: "none" },
        };

        var chart = new google.visualization.BarChart(document.getElementById("projet_names"));

        chart.draw(data, options);
    }

    const chartElement = document.createElement('div');

    chartElement.id = "projet_names";

    chartElement.style.width = '900px';

    chartElement.style.height = '300px';
}

export function ratioGraph(auditDone, auditReceived) {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Done', auditDone],
            ['Received', auditReceived]
        ]);

        var options = {
            title: 'Your audit ratio is: ' + (auditDone/auditReceived).toFixed(1),
            pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('ratioGraphs'));
        chart.draw(data, options);
    }
}

