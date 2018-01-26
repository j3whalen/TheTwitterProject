const chart = document.getElementById("myChart");
const first = document.getElementById("first").innerHTML;
const second = document.getElementById("second").innerHTML;

const x1 = parseFloat(document.getElementsByClassName("result1")[0].innerHTML);
const x2 = parseFloat(document.getElementsByClassName("result1")[1].innerHTML);
const x3 = parseFloat(document.getElementsByClassName("result1")[2].innerHTML);
const x4 = parseFloat(document.getElementsByClassName("result1")[3].innerHTML);
const x5 = parseFloat(document.getElementsByClassName("result1")[4].innerHTML);
const x6 = parseFloat(document.getElementsByClassName("result1")[5].innerHTML);
const x7 = parseFloat(document.getElementsByClassName("result1")[6].innerHTML);

const gx1 = parseFloat(document.getElementsByClassName("gresults1")[0].innerHTML);
const gx2 = parseFloat(document.getElementsByClassName("gresults1")[1].innerHTML);
const gx3 = parseFloat(document.getElementsByClassName("gresults1")[2].innerHTML);
const gx4 = parseFloat(document.getElementsByClassName("gresults1")[3].innerHTML);
const gx5 = parseFloat(document.getElementsByClassName("gresults1")[4].innerHTML);
const gx6 = parseFloat(document.getElementsByClassName("gresults1")[5].innerHTML);
const gx7 = parseFloat(document.getElementsByClassName("gresults1")[6].innerHTML);

const y1 = parseFloat(document.getElementsByClassName("result2")[0].innerHTML);
const y2 = parseFloat(document.getElementsByClassName("result2")[1].innerHTML);
const y3 = parseFloat(document.getElementsByClassName("result2")[2].innerHTML);
const y4 = parseFloat(document.getElementsByClassName("result2")[3].innerHTML);
const y5 = parseFloat(document.getElementsByClassName("result2")[4].innerHTML);
const y6 = parseFloat(document.getElementsByClassName("result2")[5].innerHTML);
const y7 = parseFloat(document.getElementsByClassName("result2")[6].innerHTML);

const gy1 = parseFloat(document.getElementsByClassName("gresults2")[0].innerHTML);
const gy2 = parseFloat(document.getElementsByClassName("gresults2")[1].innerHTML);
const gy3 = parseFloat(document.getElementsByClassName("gresults2")[2].innerHTML);
const gy4 = parseFloat(document.getElementsByClassName("gresults2")[3].innerHTML);
const gy5 = parseFloat(document.getElementsByClassName("gresults2")[4].innerHTML);
const gy6 = parseFloat(document.getElementsByClassName("gresults2")[5].innerHTML);
const gy7 = parseFloat(document.getElementsByClassName("gresults2")[6].innerHTML);

const z1 = (document.getElementsByClassName("dates")[0].innerHTML);
const z2 = (document.getElementsByClassName("dates")[1].innerHTML);
const z3 = (document.getElementsByClassName("dates")[2].innerHTML);
const z4 = (document.getElementsByClassName("dates")[3].innerHTML);
const z5 = (document.getElementsByClassName("dates")[4].innerHTML);
const z6 = (document.getElementsByClassName("dates")[5].innerHTML);
const z7 = (document.getElementsByClassName("dates")[6].innerHTML);

let linegraph = new Chart(chart, {
    type: 'line',
    data: {
        labels: [z7, z6, z5, z4, z3, z2, z1],
        datasets: [{
            label: first,
            easing:'linear',
            lineTension: 0,
            fill: false,
            data: [x7, x6, x5, x4, x3, x2, x1],
            backgroundColor: [
                '#DA0505'
            ],
            borderColor: [
                '#DA0505'
            ],
            borderWidth: 1
        },
        {
            label: first.concat(" For Google API"),
            easing:'linear',
            lineTension: 0,
            fill: false,
            data: [gx7, gx6, gx5, gx4, gx3, gx2, gx1],
            backgroundColor: [
                '#DA0500'
            ],
            borderColor: [
                '#DA0500'
            ],
            borderWidth: 1
        },
        {
            label: second,
            lineTension: 0,
            fill: false,
            data: [y7, y6, y5, y4, y3, y2, y1],
            backgroundColor: [
               '#0505DA'
            ],
            borderColor: [
                '#0505DA'
            ],
            borderWidth: 1
        },
        {
            label: second.concat(" For Google API"),
            lineTension: 0,
            fill: false,
            data: [gy7, gy6, gy5, gy4, gy3, gy2, gy1],
            backgroundColor: [
               '#0005DA'
            ],
            borderColor: [
                '#0005DA'
            ],
            borderWidth: 1
        }
    ]
    },
    options:{
        responsive: true,

    }
});