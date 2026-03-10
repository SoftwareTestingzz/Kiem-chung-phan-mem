let chart = null;
let currentChartType = 'day';
const prefixAdmin = '/admin';

async function initChart(type = 'day') {
    try {
        const url = `${prefixAdmin}/dashboard/revenue/${type}`;
        console.log('Fetching data from:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);

        const ctx = document.getElementById('revenueChart');
        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }

        const chartContext = ctx.getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(chartContext, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Doanh thu (VND)',
                    data: data.data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#007bff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Doanh thu: ' + context.parsed.y.toLocaleString('vi-VN') + ' VND';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('vi-VN');
                            }
                        }
                    }
                }
            }
        });

        currentChartType = type;
    } catch (error) {
        console.error('Error initializing chart:', error);
        alert('Lỗi khi tải dữ liệu: ' + error.message);
    }
}

document.querySelectorAll('[data-chart-type]').forEach(button => {
    button.addEventListener('click', function() {
        const type = this.getAttribute('data-chart-type');
        
        document.querySelectorAll('[data-chart-type]').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        initChart(type);
    });
});

document.getElementById('exportExcel').addEventListener('click', async function() {
    try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${prefixAdmin}/dashboard/export-excel`;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'type';
        input.value = currentChartType;
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    } catch (error) {
        console.error('Error exporting:', error);
        alert('Lỗi khi xuất file: ' + error.message);
    }
});

document.getElementById('exportWord').addEventListener('click', async function() {
    try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${prefixAdmin}/dashboard/export-word`;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'type';
        input.value = currentChartType;
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    } catch (error) {
        console.error('Error exporting:', error);
        alert('Lỗi khi xuất file: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded, initializing chart...');
    initChart('day');

    document.querySelector('[data-chart-type="day"]').classList.add('active');
});

