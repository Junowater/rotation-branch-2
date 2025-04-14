document.addEventListener('DOMContentLoaded', () => {
    const rotationChartBody = document.getElementById('rotationChartBody');

    // Load schedules from localStorage
    const centerData = JSON.parse(localStorage.getItem('CenterSectionSchedule') || '{}');
    const frontData = JSON.parse(localStorage.getItem('frontLine_' + "teamMembers') || '{}');
    const rearData = JSON.parse(localStorage.getItem('RearLineSchedule') || '{}');

    const allQuarters = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4", "Quarter 5"];
    const teamMembersSet = new Set();

    // Helper function to extract team members from schedules
    const extractMembers = (data) => {
        Object.values(data).forEach(quarterData => {
            Object.values(quarterData).forEach(members => {
                members.forEach(member => teamMembersSet.add(member));
            });
        });
    };

    extractMembers(centerData);
    extractMembers(frontData);
    extractMembers(rearData);

    const teamMembers = Array.from(teamMembersSet).sort();

    // Populate table
    teamMembers.forEach(member => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = member;
        row.appendChild(nameCell);

        allQuarters.forEach(quarter => {
            const cell = document.createElement('td');
            let assignments = [];

            // Find stations for each member across all sections
            [centerData, frontData, rearData].forEach(sectionData => {
                if (sectionData[quarter]) {
                    Object.entries(sectionData[quarter]).forEach(([station, members]) => {
                        if (members.includes(member)) {
                            assignments.push(station);
                        }
                    });
                }
            });

            cell.textContent = assignments.length ? assignments.join(', ') : '-';
            row.appendChild(cell);
        });

        rotationChartBody.appendChild(row);
    });
});
