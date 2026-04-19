/**
 * Unit Tests - Admin Product Service
 * Kiểm tra từng hàm trong product.service.js bằng cách mock Model
 */

jest.mock('../../models/product.model');
jest.mock('../../models/user.model');
jest.mock('../../models/category.model');
jest.mock('../../helper/uploadCloud');
jest.mock('../../helper/createTree');
jest.mock('../../helper/filterStatus');
jest.mock('../../helper/search');
jest.mock('../../helper/pagination');

const Product = require('../../models/product.model');
const Category = require('../../models/category.model');
const Account = require('../../models/user.model');
const filterStatusHelper = require('../../helper/filterStatus');
const searchHelper = require('../../helper/search');
const paginationHelper = require('../../helper/pagination');
const createTreeHelper = require('../../helper/createTree');
const productService = require('../../services/admin/product.service');

const mockObjectId = '64b1f48a76564fe4bb57341a';

function makeProduct(overrides = {}) {
    return {
        _id: mockObjectId,
        title: 'Test Product',
        price: 100000,
        stock: 10,
        status: 'active',
        deleted: false,
        createdBy: { account_id: 'user-id' },
        updatedBy: { account_id: 'user-id' },
        save: jest.fn().mockResolvedValue(true),
        ...overrides
    };
}

// ===================================================================
// getList
// ===================================================================
describe('productService.getList', () => {
    beforeEach(() => {
        filterStatusHelper.mockReturnValue([]);
        searchHelper.mockReturnValue({ keyword: '', regex: null });
        paginationHelper.mockReturnValue({ skip: 0, limitItems: 6 });
        createTreeHelper.createTree = jest.fn().mockReturnValue([]);
    });

    afterEach(() => jest.clearAllMocks());

    test('UC-PRODSER-01: không có query → trả về object có products, filterStatus, pagination', async () => {
        Product.countDocuments = jest.fn().mockResolvedValue(2);
        const prods = [makeProduct()];
        Product.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(prods)
        });

        const result = await productService.getList({});

        expect(result.products).toEqual(prods);
        expect(result.filterStatus).toBeDefined();
        expect(result.pagination).toBeDefined();
    });

    test('UC-PRODSER-02: query có status → lọc theo status', async () => {
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        Product.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        });

        await productService.getList({ status: 'inactive' });

        expect(Product.find).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'inactive' })
        );
    });

    test('UC-PRODSER-03: query có keyword → lọc theo title regex', async () => {
        const regex = /phone/i;
        searchHelper.mockReturnValue({ keyword: 'phone', regex });
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        Product.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        });

        await productService.getList({ keyword: 'phone' });

        expect(Product.find).toHaveBeenCalledWith(
            expect.objectContaining({ title: regex })
        );
    });

    test('UC-PRODSER-04: query có sort → dùng sort field tương ứng', async () => {
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        const mockChain = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        };
        Product.find = jest.fn().mockReturnValue(mockChain);

        await productService.getList({ sort: 'price-asc' });

        expect(mockChain.sort).toHaveBeenCalledWith({ price: 1 });
    });

    test('UC-PRODSER-05: không có sort → mặc định sort theo position desc', async () => {
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        const mockChain = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        };
        Product.find = jest.fn().mockReturnValue(mockChain);

        await productService.getList({});

        expect(mockChain.sort).toHaveBeenCalledWith({ position: -1 });
    });
});

// ===================================================================
// changeStatus
// ===================================================================
describe('productService.changeStatus', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-PRODSER-06: gọi updateOne với id và status đúng', async () => {
        Product.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

        await productService.changeStatus(mockObjectId, 'inactive');

        expect(Product.updateOne).toHaveBeenCalledWith(
            { _id: mockObjectId },
            { status: 'inactive' }
        );
    });

    test('UC-PRODSER-07: status=active → cập nhật active', async () => {
        Product.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

        await productService.changeStatus(mockObjectId, 'active');

        expect(Product.updateOne).toHaveBeenCalledWith(
            { _id: mockObjectId },
            { status: 'active' }
        );
    });
});

// ===================================================================
// changeMulti
// ===================================================================
describe('productService.changeMulti', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-PRODSER-08: ids tồn tại, type=active → updateMany status active', async () => {
        Product.find = jest.fn().mockResolvedValue([makeProduct()]);
        Product.updateMany = jest.fn().mockResolvedValue({});

        const result = await productService.changeMulti('active', [mockObjectId]);

        expect(Product.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [mockObjectId] } },
            { status: 'active' }
        );
        expect(result.status).toBe('success');
    });

    test('UC-PRODSER-09: ids tồn tại, type=inactive → updateMany status inactive', async () => {
        Product.find = jest.fn().mockResolvedValue([makeProduct()]);
        Product.updateMany = jest.fn().mockResolvedValue({});

        const result = await productService.changeMulti('inactive', [mockObjectId]);

        expect(Product.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [mockObjectId] } },
            { status: 'inactive' }
        );
        expect(result.status).toBe('success');
    });

    test('UC-PRODSER-10: ids tồn tại, type=delete-all → xóa mềm tất cả', async () => {
        Product.find = jest.fn().mockResolvedValue([makeProduct()]);
        Product.updateMany = jest.fn().mockResolvedValue({});

        const result = await productService.changeMulti('delete-all', [mockObjectId]);

        expect(Product.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [mockObjectId] } },
            expect.objectContaining({ deleted: true })
        );
        expect(result.status).toBe('success');
    });

    test('UC-PRODSER-11: ids không tồn tại trong DB → throw NOT_FOUND', async () => {
        Product.find = jest.fn().mockResolvedValue([]); // found 0, expected 1

        const err = await productService.changeMulti('active', [mockObjectId])
            .catch(e => e);

        expect(err.status).toBe(404);
        expect(err.message).toBe('NOT_FOUND');
    });

    test('UC-PRODSER-12: type không hợp lệ → trả về status error', async () => {
        Product.find = jest.fn().mockResolvedValue([makeProduct()]);

        const result = await productService.changeMulti('unknown', [mockObjectId]);

        expect(result.status).toBe('error');
    });

    test('UC-PRODSER-13: nhiều ids hợp lệ → success', async () => {
        const id2 = '64b1f48a76564fe4bb57341b';
        Product.find = jest.fn().mockResolvedValue([makeProduct(), makeProduct({ _id: id2 })]);
        Product.updateMany = jest.fn().mockResolvedValue({});

        const result = await productService.changeMulti('active', [mockObjectId, id2]);

        expect(result.status).toBe('success');
    });
});

// ===================================================================
// deleteProduct
// ===================================================================
describe('productService.deleteProduct', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-PRODSER-14: product tồn tại → xóa mềm thành công', async () => {
        const prod = makeProduct();
        Product.findOne = jest.fn().mockResolvedValue(prod);
        Product.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

        await productService.deleteProduct(mockObjectId);

        expect(Product.updateOne).toHaveBeenCalledWith(
            { _id: mockObjectId },
            expect.objectContaining({ deleted: true })
        );
    });

    test('UC-PRODSER-15: product không tồn tại → throw NOT_FOUND status 404', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);

        const err = await productService.deleteProduct(mockObjectId).catch(e => e);

        expect(err.status).toBe(404);
        expect(err.message).toBe('NOT_FOUND');
    });
});

// ===================================================================
// createProduct
// ===================================================================
describe('productService.createProduct', () => {
    afterEach(() => jest.clearAllMocks());

    function makeCreateReq(body = {}, file = null) {
        return {
            body: { title: 'New Product', price: '100000', stock: '10', ...body },
            file
        };
    }

    const makeRes = (user = null) => ({ locals: { user } });

    test('UC-PRODSER-16: title trùng → throw TITLE_EXISTS', async () => {
        Product.findOne = jest.fn().mockResolvedValue(makeProduct());

        const req = makeCreateReq({ title: 'Existing' });
        const err = await productService.createProduct(req, makeRes()).catch(e => e);

        expect(err.message).toBe('TITLE_EXISTS');
    });

    test('UC-PRODSER-17: title mới, dữ liệu hợp lệ → lưu sản phẩm', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.countDocuments = jest.fn().mockResolvedValue(3);
        const savedProd = makeProduct({ title: 'New Product' });
        Product.mockImplementation(() => savedProd);

        const req = makeCreateReq();
        // Không throw → lưu thành công
        await expect(productService.createProduct(req, makeRes())).resolves.toBeDefined();
        expect(savedProd.save).toHaveBeenCalled();
    });

    test('UC-PRODSER-18: price = -1 → parseInt cho 0 (validate ở tầng trên)', async () => {
        // Service chỉ parse, validation price âm ở validate middleware
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        const savedProd = makeProduct();
        Product.mockImplementation(() => savedProd);

        const req = makeCreateReq({ price: '-1' });
        await productService.createProduct(req, makeRes());

        expect(req.body.price).toBe(-1);
    });

    test('UC-PRODSER-19: không có position → tự assign = count + 1', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.countDocuments = jest.fn().mockResolvedValue(4);
        const savedProd = makeProduct();
        Product.mockImplementation(() => savedProd);

        const req = makeCreateReq({ position: '' });
        await productService.createProduct(req, makeRes());

        expect(req.body.position).toBe(5);
    });

    test('UC-PRODSER-20: có file trong test env → gán thumbnail', async () => {
        process.env.NODE_ENV = 'test';
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        const savedProd = makeProduct();
        Product.mockImplementation(() => savedProd);

        const req = makeCreateReq({}, { filename: 'pic.jpg', path: '/tmp/pic.jpg' });
        await productService.createProduct(req, makeRes());

        expect(req.body.thumbnail).toMatch(/https:\/\/test\.local\//);
    });

    test('UC-PRODSER-21: có user → gán createdBy', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        const savedProd = makeProduct();
        Product.mockImplementation(() => savedProd);

        const req = makeCreateReq();
        const res = makeRes({ _id: 'user-123' });
        await productService.createProduct(req, res);

        expect(req.body.createdBy).toBeDefined();
        expect(req.body.createdBy.account_id).toBe('user-123');
    });

    test('UC-PRODSER-22: không có user → không gán createdBy', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.countDocuments = jest.fn().mockResolvedValue(0);
        const savedProd = makeProduct();
        Product.mockImplementation(() => savedProd);

        const req = makeCreateReq();
        await productService.createProduct(req, makeRes(null));

        expect(req.body.createdBy).toBeUndefined();
    });
});

// ===================================================================
// editProduct
// ===================================================================
describe('productService.editProduct', () => {
    afterEach(() => jest.clearAllMocks());

    function makeEditReq(body = {}, file = null) {
        return {
            body: { title: 'Updated Title', price: '150000', ...body },
            file
        };
    }

    const makeRes = (user = null) => ({ locals: { user } });

    test('UC-PRODSER-23: title trùng với sản phẩm khác → throw TITLE_EXISTS', async () => {
        Product.findOne = jest.fn().mockResolvedValue(makeProduct({ title: 'Existing' }));

        const err = await productService.editProduct(makeEditReq(), mockObjectId, makeRes())
            .catch(e => e);

        expect(err.message).toBe('TITLE_EXISTS');
    });

    test('UC-PRODSER-24: cập nhật hợp lệ → updateOne thành công, trả về true', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null); // no duplicate
        Product.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });

        const result = await productService.editProduct(makeEditReq(), mockObjectId, makeRes());

        expect(Product.updateOne).toHaveBeenCalledWith(
            { _id: mockObjectId },
            expect.any(Object)
        );
        expect(result).toBe(true);
    });

    test('UC-PRODSER-25: sản phẩm không tồn tại → updateOne matchedCount=0 → trả về false', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.updateOne = jest.fn().mockResolvedValue({ matchedCount: 0 });

        const result = await productService.editProduct(makeEditReq(), mockObjectId, makeRes());

        expect(result).toBe(false);
    });

    test('UC-PRODSER-26: removeThumb=1 → xóa thumbnail', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });

        const req = makeEditReq({ removeThumbnail: '1' });
        await productService.editProduct(req, mockObjectId, makeRes());

        expect(req.body.thumbnail).toBe('');
    });

    test('UC-PRODSER-27: có file trong test env → gán thumbnail mới', async () => {
        process.env.NODE_ENV = 'test';
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });

        const req = makeEditReq({});
        req.file = { filename: 'new.jpg', path: '/tmp/new.jpg' };
        await productService.editProduct(req, mockObjectId, makeRes());

        expect(req.body.thumbnail).toMatch(/https:\/\/test\.local\//);
    });

    test('UC-PRODSER-28: có user → gán updatedBy', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Product.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });

        const req = makeEditReq();
        const res = makeRes({ _id: 'editor-id' });
        await productService.editProduct(req, mockObjectId, res);

        expect(req.body.updatedBy).toBeDefined();
        expect(req.body.updatedBy.account_id).toBe('editor-id');
    });
});

// ===================================================================
// detail (admin)
// ===================================================================
describe('productService.detail', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-PRODSER-29: sản phẩm không tồn tại → trả về null', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);

        const result = await productService.detail(mockObjectId);

        expect(result).toBeNull();
    });

    test('UC-PRODSER-30: sản phẩm tồn tại → trả về product có thông tin đầy đủ', async () => {
        const prod = makeProduct({
            product_category: 'cat-id',
            createdBy: { account_id: 'user-id' },
            updatedBy: { account_id: 'other-id' }
        });
        Product.findOne = jest.fn().mockResolvedValue(prod);
        Category.findOne = jest.fn().mockResolvedValue({ title: 'Electronics' });
        Account.findOne = jest.fn().mockResolvedValue({ fullName: 'Admin User' });

        const result = await productService.detail(mockObjectId);

        expect(result).toBe(prod);
        expect(result.nameCategory).toBe('Electronics');
    });

    test('UC-PRODSER-31: sản phẩm không có category → nameCategory = null', async () => {
        const prod = makeProduct({
            product_category: null,
            createdBy: { account_id: 'user-id' },
            updatedBy: { account_id: 'other-id' }
        });
        Product.findOne = jest.fn().mockResolvedValue(prod);
        Account.findOne = jest.fn().mockResolvedValue(null);

        const result = await productService.detail(mockObjectId);

        expect(result.nameCategory).toBeNull();
    });
});
