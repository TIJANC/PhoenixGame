document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    const storedScores = localStorage.getItem('scores');
    const scores = storedScores ? JSON.parse(storedScores) : Array(16).fill(0);
    const labels = [
        'Habitat creation and maintenance',
        'Pollination and dispersal of seed and other propagules',
        'Regulation of air quality', 
        'Regulation of climate', 
        'Regulation of freshwater quantity, location and timing', 
        'Regulation of freshwater and coastal water quality', 
        'Formation, protection and decontamination of soils and sediments',
        'Regulation of hazards and extreme events', 
        'Regulation of detrimental organism and biological processes', 
        'Energy', 
        'Food and feed', 
        'Materials and assistance', 
        'Medicinal, biochemical and genetic resources', 
        'Learning and inspiration', 
        'Physical and psychological experiences', 
        'Supporting identities'
    ];

    const scoreChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'YOUR SCORE',
                data: scores,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    display:false
                },
                y: {
                    display:false
                }
            }
        }
    });
});
