/**
 * Unit Tests - Client Orders Service
 */

const ordersService = require('../../services/client/orders.service');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const mongoose = require('mongoose');

jest.mock('../../models/order.model');
jest.mock('../../models/product.model');

afterEach(() => jest.clearAllMocks());

describe('ordersService', () => {

    describe('getOrderList', () => {
        test('ORDSER-01: thành công', async () => {
            const mockQuery = { sort: jest.fn().mockResolvedValue(['order1']) };
            Order.find.mockReturnValue(mockQuery);

            const result = await ordersService.getOrderList('u1');
            expect(Order.find).toHaveBeenCalledWith({ userId: 'u1' });
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result).toEqual(['order1']);
        });
    });

    describe('getOrderDetail', () => {
        beforeEach(() => {
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
        });

        test('ORDSER-02: ID đơn hàng không hợp lệ', async () => {
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);
            await expect(ordersService.getOrderDetail('u1', 'invalid')).rejects.toThrow("ID đơn hàng không hợp lệ");
        });

        test('ORDSER-03: không tìm thấy đơn hàng', async () => {
            Order.findOne.mockResolvedValue(null);
            await expect(ordersService.getOrderDetail('u1', 'order1')).rejects.toThrow("Không tìm thấy đơn hàng");
        });

        test('ORDSER-04: thành công', async () => {
            Order.findOne.mockResolvedValue({ _id: 'order1' });
            const result = await ordersService.getOrderDetail('u1', 'order1');
            expect(result._id).toBe('order1');
        });
    });

    describe('cancelOrder', () => {
        beforeEach(() => {
            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
        });

        test('ORDSER-05: ID không hợp lệ', async () => {
            mongoose.Types.ObjectId.isValid.mockReturnValue(false);
            await expect(ordersService.cancelOrder('u1', 'invalid')).rejects.toThrow("ID đơn hàng không hợp lệ");
        });

        test('ORDSER-06: không tìm thấy', async () => {
            Order.findOne.mockResolvedValue(null);
            await expect(ordersService.cancelOrder('u1', 'order1')).rejects.toThrow("Không tìm thấy đơn hàng");
        });

        test('ORDSER-07: trạng thái không hợp lệ', async () => {
            Order.findOne.mockResolvedValue({ status: 'shipped' });
            await expect(ordersService.cancelOrder('u1', 'order1')).rejects.toThrow("Không thể hủy đơn này vì đang giao hoặc đã hoàn tất");
        });

        test('ORDSER-08: thành công (hoàn tồn kho)', async () => {
            const mockOrder = {
                status: 'pending',
                items: [{ productId: 'p1', quantity: 2 }],
                save: jest.fn()
            };
            Order.findOne.mockResolvedValue(mockOrder);
            const mockProduct = { stock: 10, save: jest.fn() };
            Product.findById.mockResolvedValue(mockProduct);

            const result = await ordersService.cancelOrder('u1', 'order1');

            expect(mockProduct.stock).toBe(12);
            expect(mockProduct.save).toHaveBeenCalled();
            expect(mockOrder.status).toBe('cancelled');
            expect(mockOrder.save).toHaveBeenCalled();
            expect(result.status).toBe('cancelled');
        });

        test('ORDSER-09: thành công (product deleted -> skip restore)', async () => {
            const mockOrder = {
                status: 'pending',
                items: [{ productId: 'p1', quantity: 2 }],
                save: jest.fn()
            };
            Order.findOne.mockResolvedValue(mockOrder);
            Product.findById.mockResolvedValue(null);

            const result = await ordersService.cancelOrder('u1', 'order1');

            expect(mockOrder.status).toBe('cancelled');
            expect(mockOrder.save).toHaveBeenCalled();
        });
    });
});
