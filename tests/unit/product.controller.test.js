/**
 * Unit Tests - Admin Product Controller
 * Mock service layer và kiểm tra logic controller
 */

jest.mock('../../services/admin/product.service');
jest.mock('../../helper/respond');

const productService = require('../../services/admin/product.service');
const respond = require('../../helper/respond');
const productController = require('../../controllers/admin/product.controller');

// ----------------------------- Helpers ----------------------------- //
const mockObjectId = '64b1f48a76564fe4bb57341a';

function makeReq(overrides = {}) {
    return {
        query: {},
        body: {},
        params: {},
        get: jest.fn().mockReturnValue(null),
        flash: jest.fn(),
        headers: { accept: 'application/json' },
        ...overrides
    };
}

function makeRes(user = null) {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn(),
        render: jest.fn(),
        locals: { user }
    };
}

beforeEach(() => {
    respond.mockImplementation(() => {});
});

afterEach(() => jest.clearAllMocks());

// ===================================================================
// index
// ===================================================================
describe('productController.index', () => {
    test('UC-PRODCTRL-01: service trả về data → respond 200', async () => {
        const data = { products: [{ _id: 'p1', title: 'P1' }], filterStatus: [], keyword: '', pagination: {} };
        productService.getList.mockResolvedValue(data);

        const req = makeReq({ query: {} });
        const res = makeRes();

        await productController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-02: có keyword nhưng không tìm thấy sản phẩm → redirect', async () => {
        const data = { products: [], filterStatus: [], keyword: 'xyz', pagination: {} };
        productService.getList.mockResolvedValue(data);

        const req = makeReq({ query: { keyword: 'xyz' } });
        const res = makeRes();
        res.redirect = jest.fn();

        await productController.index(req, res);

        expect(res.redirect).toHaveBeenCalled();
    });

    test('UC-PRODCTRL-03: service throw lỗi → respond 400', async () => {
        productService.getList.mockRejectedValue(new Error('DB error'));

        const req = makeReq();
        const res = makeRes();

        await productController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// changeStatus
// ===================================================================
describe('productController.changeStatus', () => {
    test('UC-PRODCTRL-04: service thành công → respond 200', async () => {
        productService.changeStatus.mockResolvedValue({ modifiedCount: 1 });

        const req = makeReq({ params: { id: mockObjectId, status: 'inactive' } });
        const res = makeRes();

        await productController.changeStatus(req, res);

        expect(productService.changeStatus).toHaveBeenCalledWith(mockObjectId, 'inactive');
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-05: service throw lỗi → respond 400', async () => {
        productService.changeStatus.mockRejectedValue(new Error('error'));

        const req = makeReq({ params: { id: mockObjectId, status: 'active' } });
        const res = makeRes();

        await productController.changeStatus(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// changeMulti
// ===================================================================
describe('productController.changeMulti', () => {
    test('UC-PRODCTRL-06: ids hợp lệ → gọi service và respond 200', async () => {
        productService.changeMulti.mockResolvedValue({ status: 'success', message: 'Done' });

        const req = makeReq({ body: { type: 'active', ids: [mockObjectId] } });
        const res = makeRes();

        await productController.changeMulti(req, res);

        expect(productService.changeMulti).toHaveBeenCalledWith('active', [mockObjectId]);
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-07: ids rỗng → respond 400 mà không gọi service', async () => {
        const req = makeReq({ body: { type: 'active', ids: [] } });
        const res = makeRes();

        await productController.changeMulti(req, res);

        expect(productService.changeMulti).not.toHaveBeenCalled();
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-PRODCTRL-08: service throw NOT_FOUND → respond 404', async () => {
        const err = new Error('NOT_FOUND');
        err.status = 404;
        productService.changeMulti.mockRejectedValue(err);

        const req = makeReq({ body: { type: 'active', ids: [mockObjectId] } });
        const res = makeRes();

        await productController.changeMulti(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-PRODCTRL-09: ids là string → split và truyền đúng cho service', async () => {
        productService.changeMulti.mockResolvedValue({ status: 'success', message: 'Done' });

        const id2 = '64b1f48a76564fe4bb57341b';
        const req = makeReq({ body: { type: 'inactive', ids: `${mockObjectId},${id2}` } });
        const res = makeRes();

        await productController.changeMulti(req, res);

        expect(productService.changeMulti).toHaveBeenCalledWith(
            'inactive',
            [mockObjectId, id2]
        );
    });
});

// ===================================================================
// deleteProduct
// ===================================================================
describe('productController.deleteProduct', () => {
    test('UC-PRODCTRL-10: service thành công → respond 200', async () => {
        productService.deleteProduct.mockResolvedValue(undefined);

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await productController.deleteProduct(req, res);

        expect(productService.deleteProduct).toHaveBeenCalledWith(mockObjectId);
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-11: service throw NOT_FOUND → respond 404', async () => {
        const err = new Error('NOT_FOUND');
        err.status = 404;
        productService.deleteProduct.mockRejectedValue(err);

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await productController.deleteProduct(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-PRODCTRL-12: service throw lỗi không có status → dùng 400 mặc định', async () => {
        productService.deleteProduct.mockRejectedValue(new Error('unknown'));

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await productController.deleteProduct(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// createProduct
// ===================================================================
describe('productController.createProduct', () => {
    test('UC-PRODCTRL-13: service thành công → flash success + respond 200', async () => {
        const prod = { _id: mockObjectId, title: 'New' };
        productService.createProduct.mockResolvedValue(prod);

        const req = makeReq({ body: { title: 'New', price: '50000' } });
        const res = makeRes();

        await productController.createProduct(req, res);

        expect(req.flash).toHaveBeenCalledWith('success', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-14: service throw TITLE_EXISTS → flash error tên tồn tại + respond 400', async () => {
        productService.createProduct.mockRejectedValue(new Error('TITLE_EXISTS'));

        const req = makeReq({ body: { title: 'Existing' } });
        const res = makeRes();

        await productController.createProduct(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.stringContaining('tồn tại'));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-PRODCTRL-15: service throw lỗi chung → flash error + respond 400', async () => {
        productService.createProduct.mockRejectedValue(new Error('DB error'));

        const req = makeReq({ body: { title: 'Valid' } });
        const res = makeRes();

        await productController.createProduct(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// editProduct
// ===================================================================
describe('productController.editProduct', () => {
    test('UC-PRODCTRL-16: service trả về true (tìm thấy) → flash success + respond 200', async () => {
        productService.editProduct.mockResolvedValue(true);

        const req = makeReq({ params: { id: mockObjectId }, body: { title: 'Updated' } });
        const res = makeRes();

        await productController.editProduct(req, res);

        expect(req.flash).toHaveBeenCalledWith('success', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-17: service trả về false (không tìm thấy) → flash error + respond 404', async () => {
        productService.editProduct.mockResolvedValue(false);

        const req = makeReq({ params: { id: mockObjectId }, body: { title: 'Updated' } });
        const res = makeRes();

        await productController.editProduct(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-PRODCTRL-18: service throw TITLE_EXISTS → flash error tên tồn tại + respond 400', async () => {
        productService.editProduct.mockRejectedValue(new Error('TITLE_EXISTS'));

        const req = makeReq({ params: { id: mockObjectId }, body: { title: 'Existing' } });
        const res = makeRes();

        await productController.editProduct(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.stringContaining('tồn tại'));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-PRODCTRL-19: service throw lỗi chung → respond 400', async () => {
        productService.editProduct.mockRejectedValue(new Error('DB error'));

        const req = makeReq({ params: { id: mockObjectId }, body: { title: 'Updated' } });
        const res = makeRes();

        await productController.editProduct(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// detail
// ===================================================================
describe('productController.detail', () => {
    test('UC-PRODCTRL-20: product tồn tại → respond 200 với data', async () => {
        const prod = { _id: mockObjectId, title: 'My Product' };
        productService.detail.mockResolvedValue(prod);

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await productController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-PRODCTRL-21: product không tồn tại → flash error + respond 404', async () => {
        productService.detail.mockResolvedValue(null);

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await productController.detail(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-PRODCTRL-22: service throw lỗi → respond với status lỗi', async () => {
        productService.detail.mockRejectedValue({ status: 500, message: 'Server error' });

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await productController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 500 }));
    });
});
