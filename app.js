
// ==========================================
// SPACEHEALTH - ASTRONAUT HEALTH DASHBOARD
// Educational demonstration prototype
// ==========================================


// 1. SELECT HTML ELEMENTS

const healthForm = document.getElementById("healthForm");

const heartRateDisplay = document.getElementById("heartRate");
const bloodPressureDisplay = document.getElementById("bloodPressure");
const temperatureDisplay = document.getElementById("temperature");
const glucoseDisplay = document.getElementById("glucose");

const heartStatus = document.getElementById("heartStatus");
const bpStatus = document.getElementById("bpStatus");
const tempStatus = document.getElementById("tempStatus");
const glucoseStatus = document.getElementById("glucoseStatus");

const historyBody = document.getElementById("historyBody");
const clearHistoryButton = document.getElementById("clearHistory");

const moodButtons = document.querySelectorAll(".mood-button");
const moodMessage = document.getElementById("moodMessage");

const heartRateInput = document.getElementById("inputHeartRate");
const bloodPressureInput = document.getElementById("inputBloodPressure");
const temperatureInput = document.getElementById("inputTemperature");
const glucoseInput = document.getElementById("inputGlucose");


// 2. ILLUSTRATIVE DEMO THRESHOLDS
// These are NOT official NASA medical standards.

const demoRanges = {
    heartRate: { min: 50, max: 100 },
    bloodPressure: { min: 90, max: 140 },
    temperature: { min: 36, max: 38 },
    glucose: { min: 70, max: 140 }
};

const criticalRanges = {
    heartRate: { min: 40, max: 120 },
    bloodPressure: { min: 80, max: 180 },
    temperature: { min: 35, max: 40 },
    glucose: { min: 54, max: 250 }
};


// 3. LOAD SAVED HEALTH HISTORY

let healthHistory = [];

try {
    const savedHistory = localStorage.getItem("spaceHealthHistory");
    healthHistory = savedHistory ? JSON.parse(savedHistory) : [];

    if (!Array.isArray(healthHistory)) {
        healthHistory = [];
    }
} catch (error) {
    console.error("Could not load saved history:", error);
    healthHistory = [];
}


// 4. CHECK MEASUREMENT STATUS

function checkStatus(value, range, criticalRange) {
    if (value < criticalRange.min || value > criticalRange.max) {
        return "Critical";
    }

    if (value < range.min || value > range.max) {
        return "Get Checked";
    }

    return "Normal";
}


// 5. DISPLAY MEASUREMENT STATUS

function updateStatus(element, status) {
    if (!element) return;

    element.textContent = status;

    if (status === "Critical") {
        element.style.color = "#ff4d6d";
    } else if (status === "Get Checked") {
        element.style.color = "#ffb45e";
    } else {
        element.style.color = "#40d6a0";
    }
}


// 6. UPDATE DASHBOARD

function updateDashboard(data) {
    heartRateDisplay.innerHTML =
        `${data.heartRate} <small>bpm</small>`;

    bloodPressureDisplay.innerHTML =
        `${data.bloodPressure} <small>mmHg systolic</small>`;

    temperatureDisplay.innerHTML =
        `${data.temperature} <small>°C</small>`;

    glucoseDisplay.innerHTML =
        `${data.glucose} <small>mg/dL</small>`;

    updateStatus(
        heartStatus,
        checkStatus(data.heartRate, demoRanges.heartRate, criticalRanges.heartRate)
    );

    updateStatus(
        bpStatus,
        checkStatus(data.bloodPressure, demoRanges.bloodPressure, criticalRanges.bloodPressure)
    );

    updateStatus(
        tempStatus,
        checkStatus(data.temperature, demoRanges.temperature, criticalRanges.temperature)
    );

    updateStatus(
        glucoseStatus,
        checkStatus(data.glucose, demoRanges.glucose, criticalRanges.glucose)
    );
}


// 7. CREW HEALTH ALERT SYSTEM - REDESIGNED

function updateCrewHealthAlert(record) {
    const alertBox = document.getElementById("crewAlert");
    const alertStatus = document.getElementById("alertStatus");
    const alertTitle = document.getElementById("alertTitle");
    const alertMessage = document.getElementById("alertMessage");
    const alertDetails = document.getElementById("alertDetails");

    if (!alertBox || !alertStatus || !alertTitle || !alertMessage || !alertDetails) {
        return;
    }

    // Default state when no readings are available.

    if (!record) {
        alertBox.className = "panel crew-alert neutral";
        alertStatus.className = "alert-status neutral";
        alertStatus.textContent = "AWAITING READINGS";

        alertTitle.textContent = "No Health Readings Yet";
        alertMessage.textContent =
            "Submit health measurements to see the latest crew health status.";

        alertDetails.innerHTML = `
            <li class="alert-empty">
                <span class="alert-empty-icon">—</span>
                <span>Measurements will appear here after submission.</span>
            </li>
        `;

        return;
    }

    // Prepare all four measurements.

    const measurements = [
        {
            name: "Heart Rate",
            value: record.heartRate,
            unit: "bpm",
            range: demoRanges.heartRate,
            critical: criticalRanges.heartRate
        },
        {
            name: "Blood Pressure",
            value: record.bloodPressure,
            unit: "mmHg",
            range: demoRanges.bloodPressure,
            critical: criticalRanges.bloodPressure
        },
        {
            name: "Body Temperature",
            value: record.temperature,
            unit: "°C",
            range: demoRanges.temperature,
            critical: criticalRanges.temperature
        },
        {
            name: "Blood Glucose",
            value: record.glucose,
            unit: "mg/dL",
            range: demoRanges.glucose,
            critical: criticalRanges.glucose
        }
    ];

    // Calculate the status of every measurement.

    measurements.forEach((measurement) => {
        measurement.status = checkStatus(
            measurement.value,
            measurement.range,
            measurement.critical
        );
    });

    const hasCritical = measurements.some(
        item => item.status === "Critical"
    );

    const hasWarning = measurements.some(
        item => item.status === "Get Checked"
    );

    // Set the overall alert state.

    if (hasCritical) {
        alertBox.className = "panel crew-alert critical";
        alertStatus.className = "alert-status critical";
        alertStatus.textContent = "CRITICAL";

        alertTitle.textContent = "Critical Reading Detected";
        alertMessage.textContent =
            "At least one measurement is outside the illustrative critical limits. Immediate review is recommended.";
    } else if (hasWarning) {
        alertBox.className = "panel crew-alert warning";
        alertStatus.className = "alert-status warning";
        alertStatus.textContent = "GET CHECKED";

        alertTitle.textContent = "Health Review Recommended";
        alertMessage.textContent =
            "Some measurements are outside the normal demonstration ranges. Please review the readings.";
    } else {
        alertBox.className = "panel crew-alert normal";
        alertStatus.className = "alert-status normal";
        alertStatus.textContent = "NORMAL";

        alertTitle.textContent = "All Readings Within Demo Ranges";
        alertMessage.textContent =
            "All four measurements are within the illustrative demonstration ranges.";
    }

    // Display all four measurements in individual cards.

    alertDetails.innerHTML = "";

    measurements.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.className =
            `alert-measurement ${item.status.toLowerCase().replace(" ", "-")}`;

        const measurementInfo = document.createElement("div");
        measurementInfo.className = "alert-measurement-info";

        const measurementName = document.createElement("span");
        measurementName.className = "alert-measurement-name";
        measurementName.textContent = item.name;

        const measurementValue = document.createElement("strong");
        measurementValue.className = "alert-measurement-value";
        measurementValue.textContent = `${item.value} ${item.unit}`;

        const statusBadge = document.createElement("span");
        statusBadge.className =
            `alert-measurement-status ${item.status.toLowerCase().replace(" ", "-")}`;
        statusBadge.textContent = item.status;

        measurementInfo.appendChild(measurementName);
        measurementInfo.appendChild(measurementValue);

        listItem.appendChild(measurementInfo);
        listItem.appendChild(statusBadge);

        alertDetails.appendChild(listItem);
    });
}


// 8. SAVE HEALTH HISTORY

function saveHistory() {
    try {
        localStorage.setItem(
            "spaceHealthHistory",
            JSON.stringify(healthHistory)
        );
    } catch (error) {
        console.error("Could not save health history:", error);
        alert("Could not save data in this browser.");
    }
}


// 9. DISPLAY HEALTH HISTORY WITH COLOURED BADGES

function displayHistory() {
    historyBody.innerHTML = "";

    if (healthHistory.length === 0) {
        historyBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No measurements recorded yet.
                </td>
            </tr>
        `;
        return;
    }

    healthHistory.forEach((record) => {
        const row = document.createElement("tr");

        const displayStatus =
            record.overallStatus === "Review"
                ? "Get Checked"
                : record.overallStatus;

        const values = [
            record.time,
            `${record.heartRate} bpm`,
            `${record.bloodPressure} mmHg`,
            `${record.temperature} °C`,
            `${record.glucose} mg/dL`
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.classList.add("status-badge");

        if (displayStatus === "Critical") {
            statusBadge.classList.add("status-critical");
        } else if (displayStatus === "Get Checked") {
            statusBadge.classList.add("status-checked");
        } else {
            statusBadge.classList.add("status-normal");
        }

        statusBadge.textContent = displayStatus;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        historyBody.appendChild(row);
    });
}


// 10. CREATE FOUR HEALTH TREND CHARTS

let heartRateChart = null;
let bloodPressureChart = null;
let temperatureChart = null;
let glucoseChart = null;

function createHealthChart(canvasId, oldChart, label, values, color, unit) {
    const canvas = document.getElementById(canvasId);

    if (!canvas || typeof Chart === "undefined") {
        console.warn("Chart unavailable:", canvasId);
        return oldChart;
    }

    if (oldChart) {
        oldChart.destroy();
    }

    return new Chart(canvas, {
        type: "line",

        data: {
            labels: healthHistory
                .slice()
                .reverse()
                .map((record, index) => `Reading ${index + 1}`),

            datasets: [{
                label: label,
                data: values,
                borderColor: color,
                backgroundColor: color + "22",
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        color: "#edf5ff"
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#91a6bd"
                    },
                    grid: {
                        color: "rgba(145,166,189,0.1)"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: unit,
                        color: "#91a6bd"
                    },
                    ticks: {
                        color: "#91a6bd"
                    },
                    grid: {
                        color: "rgba(145,166,189,0.1)"
                    }
                }
            }
        }
    });
}


// 11. UPDATE ALL FOUR CHARTS

function updateHealthChart() {
    const records = healthHistory.slice().reverse();

    heartRateChart = createHealthChart(
        "heartRateChart",
        heartRateChart,
        "Heart Rate",
        records.map(record => record.heartRate),
        "#35d5e8",
        "Heart Rate (bpm)"
    );

    bloodPressureChart = createHealthChart(
        "bloodPressureChart",
        bloodPressureChart,
        "Systolic Blood Pressure",
        records.map(record => record.bloodPressure),
        "#ffb45e",
        "Systolic Pressure (mmHg)"
    );

    temperatureChart = createHealthChart(
        "temperatureChart",
        temperatureChart,
        "Body Temperature",
        records.map(record => record.temperature),
        "#40d6a0",
        "Temperature (°C)"
    );

    glucoseChart = createHealthChart(
        "glucoseChart",
        glucoseChart,
        "Blood Glucose",
        records.map(record => record.glucose),
        "#b69cff",
        "Glucose (mg/dL)"
    );
}


// 12. HANDLE HEALTH FORM SUBMISSION

if (healthForm) {
    healthForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const heartRate = Number(heartRateInput.value);
        const bloodPressure = Number(bloodPressureInput.value);
        const temperature = Number(temperatureInput.value);
        const glucose = Number(glucoseInput.value);

        if (
            !Number.isFinite(heartRate) ||
            !Number.isFinite(bloodPressure) ||
            !Number.isFinite(temperature) ||
            !Number.isFinite(glucose) ||
            heartRate <= 0 ||
            bloodPressure <= 0 ||
            temperature <= 0 ||
            glucose <= 0
        ) {
            alert("Please enter valid positive numbers for all measurements.");
            return;
        }

        const statuses = [
            checkStatus(heartRate, demoRanges.heartRate, criticalRanges.heartRate),
            checkStatus(bloodPressure, demoRanges.bloodPressure, criticalRanges.bloodPressure),
            checkStatus(temperature, demoRanges.temperature, criticalRanges.temperature),
            checkStatus(glucose, demoRanges.glucose, criticalRanges.glucose)
        ];

        const overallStatus = statuses.includes("Critical")
            ? "Critical"
            : statuses.includes("Get Checked")
                ? "Get Checked"
                : "Normal";

        const newRecord = {
            time: new Date().toLocaleString(),
            heartRate: heartRate,
            bloodPressure: bloodPressure,
            temperature: temperature,
            glucose: glucose,
            overallStatus: overallStatus
        };

        healthHistory.unshift(newRecord);
        healthHistory = healthHistory.slice(0, 50);

        saveHistory();
        updateDashboard(newRecord);
        updateCrewHealthAlert(newRecord);
        displayHistory();
        updateHealthChart();

        healthForm.reset();

        alert("Health measurements updated successfully!");
    });
}


// 13. PSYCHOLOGICAL WELLNESS CHECK-IN

moodButtons.forEach((button) => {
    button.addEventListener("click", function() {
        const selectedMood = button.dataset.mood;

        moodButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        if (moodMessage) {
            moodMessage.textContent =
                `Your mood check-in has been recorded: ${selectedMood}.`;
        }

        try {
            const savedMoods = JSON.parse(
                localStorage.getItem("spaceHealthMoods") || "[]"
            );

            const moods = Array.isArray(savedMoods) ? savedMoods : [];

            moods.unshift({
                mood: selectedMood,
                time: new Date().toLocaleString()
            });

            localStorage.setItem(
                "spaceHealthMoods",
                JSON.stringify(moods.slice(0, 50))
            );
        } catch (error) {
            console.error("Could not save mood:", error);

            if (moodMessage) {
                moodMessage.textContent =
                    "Mood selected, but browser storage was unavailable.";
            }
        }
    });
});


// 14. CLEAR HEALTH HISTORY

if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", function() {
        if (healthHistory.length === 0) {
            alert("There is no health history to clear.");
            return;
        }

        const confirmClear = confirm(
            "Are you sure you want to clear all health history?"
        );

        if (confirmClear) {
            healthHistory = [];

            saveHistory();
            displayHistory();
            updateHealthChart();
            updateCrewHealthAlert(null);

            alert("Health history cleared successfully.");
        }
    });
}


// 15. LOAD SAVED DATA WHEN WEBSITE OPENS

displayHistory();
updateHealthChart();

if (healthHistory.length > 0) {
    updateDashboard(healthHistory[0]);
    updateCrewHealthAlert(healthHistory[0]);
} else {
    updateCrewHealthAlert(null);
}

console.log("SpaceHealth dashboard initialized successfully.");
