const wordFrequencies = [
    { word: "disaster", count: 50 },
    { word: "flood", count: 45 },
    { word: "earthquake", count: 40 },
    { word: "fire", count: 35 },
    { word: "storm", count: 30 },
    { word: "hurricane", count: 25 },
    { word: "tsunami", count: 20 },
    { word: "tornado", count: 18 },
    { word: "landslide", count: 15 },
    { word: "drought", count: 12 },
    { word: "volcano", count: 10 },
    { word: "cyclone", count: 8 }
];
document.addEventListener("DOMContentLoaded", function () {
    createBarChart();
    createSankeyDiagram();
    createBarChart2('barChart1', 'wordSlider1', 'sliderValue1');
    createBarChart3('barChart3','wordSlider3','sliderValue3')
    createWordCloud(wordFrequencies, "wordCloudContainer");
    createDisasterPieChart();
});

window.addEventListener("resize", () => {
    d3.select("#wordCloudContainer").select("svg").remove();
    createWordCloud(wordFrequencies, "wordCloudContainer");
});
function createBarChart(){
    const ctx = document.getElementById('barChart').getContext('2d');

const allCategories = {
    labels: ['Other', 'Accidents', 'Fires & Explosions', 'Other Disasters', 'Weather Disasters', 'Terrorism & Attacks', 'Earthquakes & Tsunamis', 'Medical & Health Emergencies', 'Military & War'],
    data: [6667, 148, 144, 144, 143, 130, 102, 40, 34]
};

const excludeOther = {
    labels: ['Accidents', 'Fires & Explosions', 'Other Disasters', 'Weather Disasters', 'Terrorism & Attacks', 'Earthquakes & Tsunamis', 'Medical & Health Emergencies', 'Military & War'],
    data: [148, 144, 144, 143, 130, 102, 40, 34]
};

let barChart; // Store the chart instance

function updateChart(selectedOption) {
    const selectedData = selectedOption === "exclude" ? excludeOther : allCategories;

    if (barChart) {
        barChart.destroy(); // Destroy the previous chart
    }

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: selectedData.labels,
            datasets: [{
                label: 'Number of Disasters',
                data: selectedData.data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize with "All categories" selected
updateChart("all");

// Add event listener to radio buttons
document.querySelectorAll('input[name="disaster"]').forEach(radio => {
    radio.addEventListener("change", function () {
        updateChart(this.value === "flood" ? "exclude" : "all");
    });
});
}

function createSankeyDiagram() {
    const width = 700, height = 400;

    const svg = d3.select("#sankey")
        .attr("width", width)
        .attr("height", height);

    const sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(15)
        .size([width, height]);

    const graph = {
        nodes: [
            { name: "Total Values" },    // 0
            { name: "Null" },            // 1
            { name: "Not Null" },        // 2
            { name: "Legitimate" },      // 3
            { name: "Non-Legitimate" }   // 4
        ],
        links: [
            { source: 0, target: 1, value: 2533 },  // Null values
            { source: 0, target: 2, value: 5080 },  // Not Null
            { source: 2, target: 3, value: 4031 },  // Legitimate Locations
            { source: 2, target: 4, value: 1049 }   // Non-Legitimate
        ]
    };

    graph.nodes.forEach((d, i) => d.index = i);
    sankey(graph);

    svg.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .style("stroke-width", d => Math.max(1, d.width)) 
        .style("stroke", "#007BFF")
        .style("fill", "none")
        .style("opacity", 0.7);

    const node = svg.append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    node.append("rect")
        .attr("height", d => d.y1 - d.y0)
        .attr("width", sankey.nodeWidth())
        .style("fill", (d, i) => d3.schemeCategory10[i])
        .style("stroke", "#000");

    node.append("text")
        .attr("x", 25)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(d => d.name);
}


function createBarChart2(chartId, sliderId, valueId) {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    const wordSlider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(valueId);

    if (!ctx || !wordSlider || !sliderValue) {
        console.error("Element(s) not found:", chartId, sliderId, valueId);
        return;
    }

    // Sample word frequency data (replace with real data)
    const wordFrequencies = [
        { word: "t", count: 5199 },
        { word: "co", count: 4740 },
        { word: "http", count: 4309 },
        { word: "the", count: 3277 },
        { word: "a", count: 2200 },
        { word: "in", count: 1986 },
        { word: "to", count: 1949 },
        { word: "of", count: 1830 },
        { word: "i", count: 1778 },
        { word: "and", count: 1426 },
        { word: "is", count: 950 },
        { word: "s", count: 910 },
        { word: "you", count: 902 },
        { word: "for", count: 894 },
        { word: "on", count: 860 },
        { word: "it", count: 779 },
        { word: "my", count: 680 },
        { word: "that", count: 623 },
        { word: "with", count: 572 },
        { word: "at", count: 542 },
        { word: "by", count: 527 },
        { word: "this", count: 480 },
        { word: "from", count: 422 },
        { word: "https", count: 411 },
        { word: "be", count: 408 },
        { word: "are", count: 404 },
        { word: "was", count: 386 },
        { word: "have", count: 386 },
        { word: "like", count: 348 },
        { word: "û_", count: 348 }
    ];
    

    let barChart;

    function updateChart(wordCount) {
        sliderValue.textContent = wordCount;

        const selectedWords = wordFrequencies.slice(0, wordCount);
        const labels = selectedWords.map(item => item.word);
        const data = selectedWords.map(item => item.count);

        if (barChart) {
            barChart.destroy();
        }

        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Word Frequency',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Initialize chart
    updateChart(parseInt(wordSlider.value));

    // Update chart on slider change
    wordSlider.addEventListener('input', function () {
        updateChart(parseInt(this.value));
    });
}

function createWordCloud(words, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear previous content

    const width = container.offsetWidth; // Get full width of container
    const height = window.innerHeight * 0.6; // Adjust height dynamically

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words.map(d => ({ text: d.word, size: d.count * 2 }))) // Scale font size
        .padding(5)
        .rotate(() => (Math.random() > 0.5 ? 0 : 90))
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        svg.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text);
    }
}


function createDisasterPieChart() {
    const ctx = document.getElementById('disasterPieChart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Disaster', 'Non-Disaster'],
            datasets: [{
                data: [57, 43], // 57% Disaster, 43% Non-Disaster
                backgroundColor: ['#FF4C4C', '#4CAF50'], // Red for disaster, Green for non-disaster
                borderColor: ['#fff', '#fff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function createBarChart3(chartId, sliderId, valueId) {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    const wordSlider = document.getElementById(sliderId);
    const sliderValue = document.getElementById(valueId);

    if (!ctx || !wordSlider || !sliderValue) {
        console.error("Element(s) not found:", chartId, sliderId, valueId);
        return;
    }

    const wordFrequencies = [
        { word: "disaster", count: 153 },
        { word: "police", count: 140 },
        { word: "body", count: 124 },
        { word: "burning", count: 120 },
        { word: "crash", count: 119 },
        { word: "california", count: 117 },
        { word: "suicide", count: 116 },
        { word: "world", count: 103 },
        { word: "bomb", count: 103 },
        { word: "fires", count: 101 },
        { word: "nuclear", count: 101 },
        { word: "attack", count: 99 },
        { word: "dead", count: 96 },
        { word: "killed", count: 96 },
        { word: "train", count: 93 },
        { word: "car", count: 90 },
        { word: "war", count: 90 },
        { word: "families", count: 88 },
        { word: "life", count: 87 },
        { word: "accident", count: 87 },
        { word: "hiroshima", count: 87 },
        { word: "last", count: 83 },
        { word: "u", count: 82 },
        { word: "could", count: 81 },
        { word: "want", count: 80 },
        { word: "na", count: 79 },
        { word: "years", count: 79 },
        { word: "home", count: 77 },
        { word: "way", count: 77 },
        { word: "make", count: 76 }
    ];

    let barChart;

    function updateChart(wordCount) {
        sliderValue.textContent = wordCount;

        const selectedWords = wordFrequencies.slice(0, wordCount);
        const labels = selectedWords.map(item => item.word);
        const data = selectedWords.map(item => item.count);

        if (barChart) {
            barChart.destroy();
        }

        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Word Frequency',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateChart(parseInt(wordSlider.value));

    wordSlider.addEventListener('input', function () {
        updateChart(parseInt(this.value));
    });
}
