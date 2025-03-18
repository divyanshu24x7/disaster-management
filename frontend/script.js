var map = L.map('map').setView([20, 0], 2);
map.scrollWheelZoom.disable();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function classifyTweet() {
    let input = document.getElementById("tweetInput").value.trim();
    let resultDiv = document.getElementById("result");
    let loadingDiv = document.getElementById("loading");

    if (!input) {
        alert("Please enter a tweet!");
        return;
    }

    // Clear old results & show loading
    resultDiv.innerHTML = "";
    loadingDiv.style.display = "block";

    try {
        let response = await fetch("http://localhost:5000/classify-tweet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tweet: input })
        });

        let data = await response.json();
        loadingDiv.style.display = "none";

        // Display result
        resultDiv.innerHTML = `<strong>Classification:</strong> ${data.classification.toUpperCase()}`;

        // Remove old markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Plot location on map if available
        if (data.coordinates) {
            let [lat, lon] = data.coordinates;
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>Disaster Alert!</b><br>
                            <strong>Tweet:</strong> ${data.tweet}<br>
                            <strong>Location:</strong> ${data.location}`)
                .openPopup();
            map.setView([lat, lon], 5);
        }

    } catch (error) {
        console.error("Error:", error);
        loadingDiv.style.display = "none";
        resultDiv.innerHTML = "❌ Error classifying tweet!";
    }
}
