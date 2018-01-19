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

const y1 = parseFloat(document.getElementsByClassName("result2")[0].innerHTML);
const y2 = parseFloat(document.getElementsByClassName("result2")[1].innerHTML);
const y3 = parseFloat(document.getElementsByClassName("result2")[2].innerHTML);
const y4 = parseFloat(document.getElementsByClassName("result2")[3].innerHTML);
const y5 = parseFloat(document.getElementsByClassName("result2")[4].innerHTML);
const y6 = parseFloat(document.getElementsByClassName("result2")[5].innerHTML);
const y7 = parseFloat(document.getElementsByClassName("result2")[6].innerHTML);

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
        labels: [z1, z2, z3, z4, z5, z6, z7],
        datasets: [{
            label: first,
            fill: false,
            data: [x1, x2, x3, x4, x5, x6, x7],
            backgroundColor: [
                '#DA0505'
            ],
            borderColor: [
                '#DA0505'
            ],
            borderWidth: 1
        },
        {
            label: second,
            fill: false,
            data: [y1, y2, y3, y4, y5, y6, y7],
            backgroundColor: [
               '#0505DA'
            ],
            borderColor: [
                '#0505DA'
            ],
            borderWidth: 1
        }]
    }
});