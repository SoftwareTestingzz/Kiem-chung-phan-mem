const dashboardService = require('../../services/admin/dashboard.service');
const exportFile = require('../../helper/exportFile');
const sysConfig = require('../../config/system');

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    try {
        const [statistics, revenueDay] = await Promise.all([
            dashboardService.getStatistics(),
            dashboardService.getRevenueByDay(30)
        ]);

        res.render('admin/pages/dashboard/index', {
            pageTitle: 'Trang tổng quan',
            statistics,
            revenueDay
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error', 'Có lỗi xảy ra!');
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
    }
};

// [GET] /admin/dashboard/revenue-day
module.exports.revenueDay = async (req, res) => {
    try {
        const data = await dashboardService.getRevenueByDay(30);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};

// [GET] /admin/dashboard/revenue-month
module.exports.revenueMonth = async (req, res) => {
    try {
        const data = await dashboardService.getRevenueByMonth(12);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};

// [GET] /admin/dashboard/revenue-quarter
module.exports.revenueQuarter = async (req, res) => {
    try {
        const data = await dashboardService.getRevenueByQuarter(4);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};

// [GET] /admin/dashboard/revenue-year
module.exports.revenueYear = async (req, res) => {
    try {
        const data = await dashboardService.getRevenueByYear(5);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};

// [POST] /admin/dashboard/export-excel
module.exports.exportExcel = async (req, res) => {
    try {
        const { type } = req.body;
        let data, chartType;

        switch (type) {
            case 'day':
                data = await dashboardService.getRevenueByDay(30);
                chartType = 'ngày';
                break;
            case 'month':
                data = await dashboardService.getRevenueByMonth(12);
                chartType = 'tháng';
                break;
            case 'quarter':
                data = await dashboardService.getRevenueByQuarter(4);
                chartType = 'quý';
                break;
            case 'year':
                data = await dashboardService.getRevenueByYear(5);
                chartType = 'năm';
                break;
            default:
                return res.status(400).json({ error: 'Invalid type' });
        }

        const filename = `thong-ke-doanh-thu-${type}-${Date.now()}.xlsx`;
        const filePath = exportFile.exportToExcel(filename, data, chartType);

        // Kiểm tra file tồn tại
        const fs = require('fs');
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(500).json({ error: 'File creation failed' });
        }
    } catch (error) {
        console.error('Export Excel error:', error);
        res.status(500).json({ error: error.message });
    }
};

// [POST] /admin/dashboard/export-word
module.exports.exportWord = async (req, res) => {
    try {
        const { type } = req.body;
        let data, chartType;

        switch (type) {
            case 'day':
                data = await dashboardService.getRevenueByDay(30);
                chartType = 'ngày';
                break;
            case 'month':
                data = await dashboardService.getRevenueByMonth(12);
                chartType = 'tháng';
                break;
            case 'quarter':
                data = await dashboardService.getRevenueByQuarter(4);
                chartType = 'quý';
                break;
            case 'year':
                data = await dashboardService.getRevenueByYear(5);
                chartType = 'năm';
                break;
            default:
                return res.status(400).json({ error: 'Invalid type' });
        }

        const filename = `thong-ke-doanh-thu-${type}-${Date.now()}.docx`;
        const filePath = await exportFile.exportToWord(filename, data, chartType);

        // Kiểm tra file tồn tại
        const fs = require('fs');
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(500).json({ error: 'File creation failed' });
        }
    } catch (error) {
        console.error('Export Word error:', error);
        res.status(500).json({ error: error.message });
    }
};
