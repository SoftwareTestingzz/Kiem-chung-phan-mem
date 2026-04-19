/**
 * Unit Tests - Admin Category Controller
 * Mock service layer và kiểm tra logic controller
 */

jest.mock('../../services/admin/category.service');
jest.mock('../../helper/respond');

const categoryService = require('../../services/admin/category.service');
const respond = require('../../helper/respond');
const categoryController = require('../../controllers/admin/category.controller');

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

function makeRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn(),
        render: jest.fn(),
        locals: { user: null }
    };
}

beforeEach(() => {
    respond.mockImplementation(() => {});
});

afterEach(() => jest.clearAllMocks());

// ===================================================================
// index
// ===================================================================
describe('categoryController.index', () => {
    test('UC-CATCTRL-01: service trả về data → respond 200 với success', async () => {
        const data = { categories: [], filterStatus: [], keyword: '', tree: [] };
        categoryService.getList.mockResolvedValue(data);

        const req = makeReq({ query: {} });
        const res = makeRes();

        await categoryController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CATCTRL-02: có keyword nhưng không tìm thấy category → redirect', async () => {
        const data = { categories: [], filterStatus: [], keyword: 'xyz', tree: [] };
        categoryService.getList.mockResolvedValue(data);

        const req = makeReq({ query: { keyword: 'xyz' } });
        const res = makeRes();
        res.redirect = jest.fn();

        await categoryController.index(req, res);

        // Controller redirect khi không tìm thấy
        expect(res.redirect).toHaveBeenCalled();
    });

    test('UC-CATCTRL-03: service throw lỗi → respond với status lỗi', async () => {
        categoryService.getList.mockRejectedValue({ status: 500, message: 'DB error' });

        const req = makeReq();
        const res = makeRes();

        await categoryController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 500 }));
    });
});

// ===================================================================
// changeStatus
// ===================================================================
describe('categoryController.changeStatus', () => {
    test('UC-CATCTRL-04: service thành công → respond 200', async () => {
        categoryService.changeStatus.mockResolvedValue({ status: 'active' });

        const req = makeReq({ params: { id: mockObjectId, status: 'active' } });
        const res = makeRes();

        await categoryController.changeStatus(req, res);

        expect(categoryService.changeStatus).toHaveBeenCalledWith(mockObjectId, 'active');
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CATCTRL-05: service throw 404 → respond với status 404', async () => {
        categoryService.changeStatus.mockRejectedValue({ status: 404, message: 'Danh mục không tồn tại' });

        const req = makeReq({ params: { id: mockObjectId, status: 'active' } });
        const res = makeRes();

        await categoryController.changeStatus(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-CATCTRL-06: service throw lỗi không có status → dùng 400 mặc định', async () => {
        categoryService.changeStatus.mockRejectedValue(new Error('unknown'));

        const req = makeReq({ params: { id: mockObjectId, status: 'active' } });
        const res = makeRes();

        await categoryController.changeStatus(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// changeMulti
// ===================================================================
describe('categoryController.changeMulti', () => {
    test('UC-CATCTRL-07: service thành công → respond 200', async () => {
        categoryService.changeMulti.mockResolvedValue({ status: 'success', message: 'OK' });

        const req = makeReq({ body: { type: 'active', ids: [mockObjectId] } });
        const res = makeRes();

        await categoryController.changeMulti(req, res);

        expect(categoryService.changeMulti).toHaveBeenCalledWith('active', [mockObjectId]);
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CATCTRL-08: service throw CATEGORY_HAS_PRODUCTS → flash error + respond lỗi', async () => {
        categoryService.changeMulti.mockRejectedValue({ status: 400, message: 'CATEGORY_HAS_PRODUCTS' });

        const req = makeReq({ body: { type: 'delete-all', ids: [mockObjectId] } });
        const res = makeRes();

        await categoryController.changeMulti(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CATCTRL-09: service throw 404 → respond 404', async () => {
        categoryService.changeMulti.mockRejectedValue({ status: 404, message: 'Danh mục không tồn tại' });

        const req = makeReq({ body: { type: 'active', ids: [mockObjectId] } });
        const res = makeRes();

        await categoryController.changeMulti(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });
});

// ===================================================================
// deleteCategory
// ===================================================================
describe('categoryController.deleteCategory', () => {
    test('UC-CATCTRL-10: service thành công → respond 200', async () => {
        categoryService.deleteCategory.mockResolvedValue(undefined);

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await categoryController.deleteCategory(req, res);

        expect(categoryService.deleteCategory).toHaveBeenCalledWith(mockObjectId);
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CATCTRL-11: service throw 404 → respond 404', async () => {
        categoryService.deleteCategory.mockRejectedValue({ status: 404, message: 'Danh mục không tồn tại' });

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await categoryController.deleteCategory(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-CATCTRL-12: service throw CATEGORY_HAS_PRODUCTS → flash error đặc biệt', async () => {
        categoryService.deleteCategory.mockRejectedValue({ status: 400, message: 'CATEGORY_HAS_PRODUCTS' });

        const req = makeReq({ params: { id: mockObjectId } });
        const res = makeRes();

        await categoryController.deleteCategory(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.stringContaining('sản phẩm'));
    });
});

// ===================================================================
// createCategory
// ===================================================================
describe('categoryController.createCategory', () => {
    test('UC-CATCTRL-13: service thành công → flash success + respond 200', async () => {
        const createdCat = { _id: mockObjectId, title: 'New Cat' };
        categoryService.createCategory.mockResolvedValue(createdCat);

        const req = makeReq({ body: { title: 'New Cat' } });
        const res = makeRes();

        await categoryController.createCategory(req, res);

        expect(req.flash).toHaveBeenCalledWith('success', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CATCTRL-14: service throw lỗi → flash error + respond 400', async () => {
        categoryService.createCategory.mockRejectedValue({ status: 400, message: 'Vui lòng nhập Tên danh mục!' });

        const req = makeReq({ body: { title: '' } });
        const res = makeRes();

        await categoryController.createCategory(req, res);

        expect(req.flash).toHaveBeenCalledWith('error', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });
});

// ===================================================================
// editCategory
// ===================================================================
describe('categoryController.editCategory', () => {
    test('UC-CATCTRL-15: service thành công → flash success + respond 200', async () => {
        categoryService.editCategory.mockResolvedValue({ matchedCount: 1 });

        const req = makeReq({ params: { id: mockObjectId }, body: { title: 'Updated' } });
        const res = makeRes();

        await categoryController.editCategory(req, res);

        expect(req.flash).toHaveBeenCalledWith('success', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CATCTRL-16: service throw 404 → respond với status 404', async () => {
        categoryService.editCategory.mockRejectedValue({ status: 404, message: 'Danh mục không tồn tại' });

        const req = makeReq({ params: { id: mockObjectId }, body: { title: 'Updated' } });
        const res = makeRes();

        await categoryController.editCategory(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });
});
