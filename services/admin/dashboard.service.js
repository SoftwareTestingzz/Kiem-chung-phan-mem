const Order = require('../../models/order.model');

module.exports.getRevenueByDay = async (days = 30) => {
    const data = [];
    const labels = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['completed'] },
                    createdAt: { $gte: date, $lt: nextDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        const dayName = date.toLocaleDateString('vi-VN', { 
            day: '2-digit',
            month: '2-digit'
        });
        labels.push(dayName);
        data.push(revenue.length > 0 ? Math.round(revenue[0].total) : 0);
    }
    
    return { labels, data };
};

module.exports.getRevenueByMonth = async (months = 12) => {
    const data = [];
    const labels = [];
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setMonth(nextDate.getMonth() + 1);
        
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['completed'] },
                    createdAt: { $gte: date, $lt: nextDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        const monthName = date.toLocaleDateString('vi-VN', { 
            month: '2-digit',
            year: '2-digit'
        });
        labels.push(monthName);
        data.push(revenue.length > 0 ? Math.round(revenue[0].total) : 0);
    }
    
    return { labels, data };
};

module.exports.getRevenueByQuarter = async (quarters = 4) => {
    const data = [];
    const labels = [];
    
    for (let i = quarters - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - (i * 3));
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        date.setMonth(Math.floor(date.getMonth() / 3) * 3);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setMonth(nextDate.getMonth() + 3);
        
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['completed'] },
                    createdAt: { $gte: date, $lt: nextDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        labels.push(`Q${quarter} ${date.getFullYear()}`);
        data.push(revenue.length > 0 ? Math.round(revenue[0].total) : 0);
    }
    
    return { labels, data };
};

module.exports.getRevenueByYear = async (years = 5) => {
    const data = [];
    const labels = [];
    
    for (let i = years - 1; i >= 0; i--) {
        const date = new Date();
        date.setFullYear(date.getFullYear() - i);
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        
        const revenue = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['completed'] },
                    createdAt: { $gte: date, $lt: nextDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        labels.push(date.getFullYear().toString());
        data.push(revenue.length > 0 ? Math.round(revenue[0].total) : 0);
    }
    
    return { labels, data };
};

module.exports.getStatistics = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        const nextMonth = new Date(thisMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        const todayRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        const monthRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: thisMonth, $lt: nextMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        const totalOrders = await Order.countDocuments({ status: 'completed' });
        
        const totalRevenue = await Order.aggregate([
            {
                $match: { status: 'completed' }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);
        
        return {
            todayRevenue: todayRevenue.length > 0 ? Math.round(todayRevenue[0].total) : 0,
            monthRevenue: monthRevenue.length > 0 ? Math.round(monthRevenue[0].total) : 0,
            totalOrders,
            totalRevenue: totalRevenue.length > 0 ? Math.round(totalRevenue[0].total) : 0
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return { todayRevenue: 0, monthRevenue: 0, totalOrders: 0, totalRevenue: 0 };
    }
};
