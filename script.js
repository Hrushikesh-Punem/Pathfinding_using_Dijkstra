// Global variables
const graph = [
    [0, 7, 0, 9, 0, 0, 14],
    [7, 0, 10, 15, 0, 0, 0],
    [0, 10, 0, 11, 0, 2, 0],
    [9, 15, 11, 0, 6, 0, 0],
    [0, 0, 0, 6, 0, 9, 0],
    [0, 0, 2, 0, 9, 0, 0],
    [14, 0, 0, 0, 0, 0, 0]
];

const vertexRadius = 20;
const selectedColor = '#5cb85c';
const pathColor = '#d9534f';

let selectedSource = null;
let selectedDestination = null;

// Initialize dropdown menus and draw initial graph
populateDropdowns();
drawGraph();



// Function to draw the graph on canvas
function drawGraph() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    const n = graph.length;
    const angleStep = (2 * Math.PI) / n;

    // Calculate vertex positions on a circle
    const vertexPositions = [];
    for (let i = 0; i < n; i++) {
        const x = 400 + 200 * Math.cos(i * angleStep);
        const y = 300 + 200 * Math.sin(i * angleStep);
        vertexPositions.push({ x, y });
    }

    // Draw edges
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            if (graph[i][j] !== 0) {
                ctx.strokeStyle = (selectedSource === i && selectedDestination === j) || (selectedSource === j && selectedDestination === i) ? pathColor : '#ccc';
                ctx.beginPath();
                ctx.moveTo(vertexPositions[i].x, vertexPositions[i].y);
                ctx.lineTo(vertexPositions[j].x, vertexPositions[j].y);
                ctx.stroke();

                ctx.fillStyle = '#000';
                ctx.font = 'bold 16px Arial';
                ctx.fillText(graph[i][j].toString(), (vertexPositions[i].x + vertexPositions[j].x) / 2, (vertexPositions[i].y + vertexPositions[j].y) / 2);
            }
        }
    }

    // Draw vertices
    for (let i = 0; i < n; i++) {
        ctx.fillStyle = selectedSource === i ? selectedColor : '#007bff';
        ctx.beginPath();
        ctx.arc(vertexPositions[i].x, vertexPositions[i].y, vertexRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`V${i}`, vertexPositions[i].x - 10, vertexPositions[i].y + 6);
    }

    // Highlight shortest path if selected
    if (selectedSource !== null && selectedDestination !== null) {
        const shortestPath = dijkstra(graph, selectedSource, selectedDestination);

        ctx.strokeStyle = pathColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(vertexPositions[shortestPath[0]].x, vertexPositions[shortestPath[0]].y);
        for (let i = 1; i < shortestPath.length; i++) {
            ctx.lineTo(vertexPositions[shortestPath[i]].x, vertexPositions[shortestPath[i]].y);
        }
        ctx.stroke();
    }
}

// Function to populate dropdowns with vertex options
function populateDropdowns() {
    const sourceSelect = document.getElementById('sourceSelect');
    const destinationSelect = document.getElementById('destinationSelect');

    sourceSelect.innerHTML = '';
    destinationSelect.innerHTML = '';

    for (let i = 0; i < graph.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `V${i}`;
        sourceSelect.appendChild(option.cloneNode(true));
        destinationSelect.appendChild(option);
    }

    if (selectedSource !== null) {
        sourceSelect.value = selectedSource;
    }
    if (selectedDestination !== null) {
        destinationSelect.value = selectedDestination;
    }
}

// Event listener for source and destination dropdowns
document.getElementById('sourceSelect').addEventListener('change', function(event) {
    selectedSource = parseInt(event.target.value);
    drawGraph();
});

document.getElementById('destinationSelect').addEventListener('change', function(event) {
    selectedDestination = parseInt(event.target.value);
    drawGraph();
});



// Dijkstra's algorithm implementation
function dijkstra(graph, source, destination) {
    const n = graph.length;
    const distances = Array(n).fill(Number.POSITIVE_INFINITY);
    const visited = Array(n).fill(false);
    const parent = Array(n).fill(-1);
    distances[source] = 0;

    for (let i = 0; i < n - 1; i++) {
        const u = minDistance(distances, visited);
        visited[u] = true;

        for (let v = 0; v < n; v++) {
            if (!visited[v] && graph[u][v] !== 0 && distances[u] !== Number.POSITIVE_INFINITY && distances[u] + graph[u][v] < distances[v]) {
                distances[v] = distances[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }

    return getPath(destination, parent);
}

function minDistance(distances, visited) {
    let min = Number.POSITIVE_INFINITY;
    let minIndex = -1;

    for (let i = 0; i < distances.length; i++) {
        if (!visited[i] && distances[i] <= min) {
            min = distances[i];
            minIndex = i;
        }
    }

    return minIndex;
}

function getPath(destination, parent) {
    const path = [];
    for (let v = destination; v !== -1; v = parent[v]) {
        path.push(v);
    }
    return path.reverse();
}
