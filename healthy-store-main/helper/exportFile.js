const XLSX = require('xlsx');
const { Document, Packer, Table, TableRow, TableCell, Paragraph, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

// Thư mục lưu file tạm
const tempDir = path.join(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Chuẩn hóa tên file
const sanitizeFilename = (filename) => filename.replace(/[^\w.-]/g, '_');

// ===== Xuất Excel =====
const exportToExcel = (filename, data, chartType) => {
    try {
        const safeFilename = sanitizeFilename(filename);
        const filePath = path.join(tempDir, safeFilename);

        const workbook = XLSX.utils.book_new();
        const chartData = [['Thời gian', 'Doanh thu (VND)']];

        data.labels.forEach((label, index) => {
            chartData.push([label, Number(data.data[index] || 0)]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(chartData);
        worksheet['!cols'] = [{ wch: 20 }, { wch: 18 }];
        XLSX.utils.book_append_sheet(workbook, worksheet, `Thống kê ${chartType}`);
        XLSX.writeFile(workbook, filePath);

        console.log('Excel exported to:', filePath);
        return filePath;
    } catch (error) {
        console.error('Excel export error:', error);
        throw error;
    }
};

// ===== Xuất Word =====
const exportToWord = async (filename, data, chartType) => {
    try {
        const safeFilename = sanitizeFilename(filename);
        const filePath = path.join(tempDir, safeFilename);

        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: 'Thời gian', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: 'Doanh thu (VND)', bold: true })] })
                ]
            })
        ];

        data.labels.forEach((label, index) => {
            tableRows.push(
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(label)] }),
                        new TableCell({ children: [new Paragraph(Number(data.data[index] || 0).toLocaleString('vi-VN'))] })
                    ]
                })
            );
        });

        const totalRevenue = data.data.reduce((sum, val) => sum + Number(val || 0), 0);

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        text: 'BÁO CÁO THỐNG KÊ DOANH THU',
                        bold: true,
                        size: 48,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    }),
                    new Paragraph({
                        text: `Thống kê theo ${chartType}`,
                        size: 32,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 }
                    }),
                    new Paragraph({
                        text: `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
                        spacing: { after: 300 }
                    }),
                    new Table({ rows: tableRows }),
                    new Paragraph({ text: '', spacing: { after: 200 } }),
                    new Paragraph({
                        text: `Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VND`,
                        bold: true,
                        size: 36
                    })
                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(filePath, buffer);

        console.log('Word exported to:', filePath);
        return filePath;
    } catch (error) {
        console.error('Word export error:', error);
        throw error;
    }
};

module.exports = {
    exportToExcel,
    exportToWord
};
