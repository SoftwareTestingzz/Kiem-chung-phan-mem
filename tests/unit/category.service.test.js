/**
 * Unit Tests - Admin Category Service
 * Kiểm tra từng hàm trong category.service.js bằng cách mock Model
 */

jest.mock('../../models/category.model');
jest.mock('../../models/product.model');
jest.mock('../../helper/uploadCloud');
jest.mock('../../helper/createTree');
jest.mock('../../helper/filterStatus');
jest.mock('../../helper/search');

const Category = require('../../models/category.model');
const Product = require('../../models/product.model');
const createTreeHelper = require('../../helper/createTree');
const filterStatusHelper = require('../../helper/filterStatus');
const searchHelper = require('../../helper/search');
const categoryService = require('../../services/admin/category.service');

// ----------------------------- Helpers ----------------------------- //
const mockObjectId = '64b1f48a76564fe4bb57341a';

function makeCategory(overrides = {}) {
    return {
        _id: mockObjectId,
        title: 'Test Category',
        status: 'active',
        deleted: false,
        position: 1,
        save: jest.fn().mockResolvedValue(true),
        ...overrides
    };
}

// ===================================================================
// getList
// ===================================================================
describe('categoryService.getList', () => {
    beforeEach(() => {
        filterStatusHelper.mockReturnValue([{ name: 'Tất cả', class: 'active', value: '' }]);
        searchHelper.mockReturnValue({ keyword: '', regex: null });
        createTreeHelper.createTree = jest.fn().mockReturnValue([]);
    });

    afterEach(() => jest.clearAllMocks());

    test('UC-CATSER-01: không có query → trả về danh sách categories', async () => {
        const cats = [makeCategory()];
        Category.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(cats) });

        const result = await categoryService.getList({});

        expect(Category.find).toHaveBeenCalledWith({ deleted: false });
        expect(result.categories).toEqual(cats);
        expect(result.filterStatus).toBeDefined();
    });

    test('UC-CATSER-02: query có status → lọc theo status', async () => {
        Category.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        await categoryService.getList({ status: 'active' });

        expect(Category.find).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }));
    });

    test('UC-CATSER-03: query có keyword → lọc theo title bằng regex', async () => {
        const regex = /laptop/i;
        searchHelper.mockReturnValue({ keyword: 'laptop', regex });
        Category.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        await categoryService.getList({ keyword: 'laptop' });

        expect(Category.find).toHaveBeenCalledWith(expect.objectContaining({ title: regex }));
    });

    test('UC-CATSER-04: trả về tree được build từ createTree', async () => {
        const treeData = [{ id: 1, children: [] }];
        createTreeHelper.createTree.mockReturnValue(treeData);
        Category.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        const result = await categoryService.getList({});

        expect(result.tree).toEqual(treeData);
    });
});

// ===================================================================
// changeStatus
// ===================================================================
describe('categoryService.changeStatus', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CATSER-05: id hợp lệ, category tồn tại → cập nhật status thành công', async () => {
        const cat = makeCategory({ status: 'active' });
        Category.findOne = jest.fn().mockResolvedValue(cat);

        const result = await categoryService.changeStatus(mockObjectId, 'inactive');

        expect(cat.status).toBe('inactive');
        expect(cat.save).toHaveBeenCalled();
        expect(result).toBe(cat);
    });

    test('UC-CATSER-06: category không tồn tại → throw 404', async () => {
        Category.findOne = jest.fn().mockResolvedValue(null);

        await expect(categoryService.changeStatus(mockObjectId, 'active'))
            .rejects.toMatchObject({ status: 404, message: 'Danh mục không tồn tại' });
    });

    test('UC-CATSER-07: đổi status từ inactive → active', async () => {
        const cat = makeCategory({ status: 'inactive' });
        Category.findOne = jest.fn().mockResolvedValue(cat);

        await categoryService.changeStatus(mockObjectId, 'active');

        expect(cat.status).toBe('active');
    });
});

// ===================================================================
// changeMulti
// ===================================================================
describe('categoryService.changeMulti', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CATSER-08: ids rỗng → throw 400', async () => {
        await expect(categoryService.changeMulti('active', []))
            .rejects.toMatchObject({ status: 400, message: 'Danh sách ID rỗng' });
    });

    test('UC-CATSER-09: 1 id không valid ObjectId → throw 400', async () => {
        await expect(categoryService.changeMulti('active', ['invalid-id']))
            .rejects.toMatchObject({ status: 400, message: 'ID không hợp lệ' });
    });

    test('UC-CATSER-10: id hợp lệ nhưng không tồn tại trong DB → throw 404', async () => {
        Category.find = jest.fn().mockResolvedValue([]); // 0 found, 1 expected

        await expect(categoryService.changeMulti('active', [mockObjectId]))
            .rejects.toMatchObject({ status: 404, message: 'Danh mục không tồn tại' });
    });

    test('UC-CATSER-11: type=active, ids hợp lệ → updateMany với status active', async () => {
        Category.find = jest.fn().mockResolvedValue([makeCategory()]);
        Category.updateMany = jest.fn().mockResolvedValue({});

        const result = await categoryService.changeMulti('active', [mockObjectId]);

        expect(Category.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [mockObjectId] } },
            { status: 'active' }
        );
        expect(result.status).toBe('success');
    });

    test('UC-CATSER-12: type=inactive → updateMany với status inactive', async () => {
        Category.find = jest.fn().mockResolvedValue([makeCategory()]);
        Category.updateMany = jest.fn().mockResolvedValue({});

        const result = await categoryService.changeMulti('inactive', [mockObjectId]);

        expect(Category.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [mockObjectId] } },
            { status: 'inactive' }
        );
        expect(result.status).toBe('success');
    });

    test('UC-CATSER-13: type=delete-all, không có sản phẩm → xóa mềm', async () => {
        Category.find = jest.fn().mockResolvedValue([makeCategory()]);
        Category.updateMany = jest.fn().mockResolvedValue({});
        Product.findOne = jest.fn().mockResolvedValue(null); // no products

        const result = await categoryService.changeMulti('delete-all', [mockObjectId]);

        expect(Category.updateMany).toHaveBeenCalledWith(
            { _id: { $in: [mockObjectId] } },
            expect.objectContaining({ deleted: true })
        );
        expect(result.status).toBe('success');
    });

    test('UC-CATSER-14: type=delete-all, có sản phẩm thuộc danh mục → throw 400', async () => {
        Category.find = jest.fn().mockResolvedValue([makeCategory()]);
        Product.findOne = jest.fn().mockResolvedValue({ _id: 'some-prod' });

        await expect(categoryService.changeMulti('delete-all', [mockObjectId]))
            .rejects.toMatchObject({ status: 400, message: 'CATEGORY_HAS_PRODUCTS' });
    });

    test('UC-CATSER-15: type không hợp lệ → trả về status error', async () => {
        Category.find = jest.fn().mockResolvedValue([makeCategory()]);

        const result = await categoryService.changeMulti('unknown-type', [mockObjectId]);

        expect(result.status).toBe('error');
    });

    test('UC-CATSER-16: nhiều ids hợp lệ → success', async () => {
        const id2 = '64b1f48a76564fe4bb57341b';
        Category.find = jest.fn().mockResolvedValue([makeCategory(), makeCategory({ _id: id2 })]);
        Category.updateMany = jest.fn().mockResolvedValue({});

        const result = await categoryService.changeMulti('active', [mockObjectId, id2]);

        expect(result.status).toBe('success');
    });
});

// ===================================================================
// deleteCategory
// ===================================================================
describe('categoryService.deleteCategory', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CATSER-17: có sản phẩm thuộc danh mục → throw 400 CATEGORY_HAS_PRODUCTS', async () => {
        Product.findOne = jest.fn().mockResolvedValue({ _id: 'prod1' });

        await expect(categoryService.deleteCategory(mockObjectId))
            .rejects.toMatchObject({ status: 400, message: 'CATEGORY_HAS_PRODUCTS' });

        // Không gọi Category.findOne
        expect(Category.findOne).not.toHaveBeenCalled();
    });

    test('UC-CATSER-18: không có sản phẩm nhưng category không tồn tại → throw 404', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        Category.findOne = jest.fn().mockResolvedValue(null);

        await expect(categoryService.deleteCategory(mockObjectId))
            .rejects.toMatchObject({ status: 404, message: 'Danh mục không tồn tại' });
    });

    test('UC-CATSER-19: category tồn tại, không có sản phẩm → xóa mềm thành công', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);
        const cat = makeCategory();
        Category.findOne = jest.fn().mockResolvedValue(cat);

        await categoryService.deleteCategory(mockObjectId);

        expect(cat.deleted).toBe(true);
        expect(cat.deletedAt).toBeDefined();
        expect(cat.save).toHaveBeenCalled();
    });
});

// ===================================================================
// createCategory
// ===================================================================
describe('categoryService.createCategory', () => {
    afterEach(() => jest.clearAllMocks());

    function makeReq(body = {}, file = null) {
        return { body: { title: 'Test', ...body }, file };
    }

    test('UC-CATSER-20: title rỗng → throw 400', async () => {
        const req = makeReq({ title: '' });

        await expect(categoryService.createCategory(req))
            .rejects.toMatchObject({ status: 400 });
    });

    test('UC-CATSER-21: title chỉ có khoảng trắng → throw 400', async () => {
        const req = makeReq({ title: '   ' });

        await expect(categoryService.createCategory(req))
            .rejects.toMatchObject({ status: 400 });
    });

    test('UC-CATSER-22: title > 255 ký tự → throw 400', async () => {
        const req = makeReq({ title: 'a'.repeat(256) });

        await expect(categoryService.createCategory(req))
            .rejects.toMatchObject({ status: 400 });
    });

    test('UC-CATSER-23: title đúng 255 ký tự → không throw lỗi title', async () => {
        Category.countDocuments = jest.fn().mockResolvedValue(0);
        const savedCat = makeCategory({ title: 'a'.repeat(255) });
        // mock Category constructor + save
        Category.mockImplementation(() => savedCat);

        const req = makeReq({ title: 'a'.repeat(255) });
        // Không throw → save được gọi
        await expect(categoryService.createCategory(req)).resolves.toBeDefined();
        expect(savedCat.save).toHaveBeenCalled();
    });

    test('UC-CATSER-24: không có position → tự assign position = count + 1', async () => {
        Category.countDocuments = jest.fn().mockResolvedValue(5);
        const savedCat = makeCategory();
        Category.mockImplementation(() => savedCat);

        const req = makeReq({ title: 'Valid', position: '' });
        await categoryService.createCategory(req);

        expect(req.body.position).toBe(6);
    });

    test('UC-CATSER-25: có position → parse sang int', async () => {
        Category.countDocuments = jest.fn().mockResolvedValue(0);
        const savedCat = makeCategory();
        Category.mockImplementation(() => savedCat);

        const req = makeReq({ title: 'Valid', position: '3' });
        await categoryService.createCategory(req);

        expect(req.body.position).toBe(3);
    });

    test('UC-CATSER-26: có file trong test env → gán thumbnail với test url', async () => {
        process.env.NODE_ENV = 'test';
        Category.countDocuments = jest.fn().mockResolvedValue(0);
        const savedCat = makeCategory();
        Category.mockImplementation(() => savedCat);

        const req = makeReq({ title: 'Valid' }, { filename: 'test.png', path: '/tmp/test.png' });
        await categoryService.createCategory(req);

        expect(req.body.thumbnail).toMatch(/https:\/\/test\.local\//);
    });
});

// ===================================================================
// editCategory
// ===================================================================
describe('categoryService.editCategory', () => {
    afterEach(() => jest.clearAllMocks());

    function makeEditReq(overrides = {}) {
        return {
            params: { id: mockObjectId },
            body: { title: 'Updated Title', ...overrides },
            file: null
        };
    }

    test('UC-CATSER-27: category tồn tại → cập nhật thành công', async () => {
        Category.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
        const req = makeEditReq();

        const result = await categoryService.editCategory(req);

        expect(Category.updateOne).toHaveBeenCalledWith(
            { _id: mockObjectId },
            expect.any(Object)
        );
        expect(result.matchedCount).toBe(1);
    });

    test('UC-CATSER-28: category không tồn tại → throw 404', async () => {
        Category.updateOne = jest.fn().mockResolvedValue({ matchedCount: 0 });
        const req = makeEditReq();

        await expect(categoryService.editCategory(req))
            .rejects.toMatchObject({ status: 404, message: 'Danh mục không tồn tại' });
    });

    test('UC-CATSER-29: có file trong test env → cập nhật thumbnail', async () => {
        process.env.NODE_ENV = 'test';
        Category.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
        const req = makeEditReq();
        req.file = { filename: 'new.jpg', path: '/tmp/new.jpg' };

        await categoryService.editCategory(req);

        expect(req.body.thumbnail).toMatch(/https:\/\/test\.local\//);
    });

    test('UC-CATSER-30: removeThumbnail=1 → xóa thumbnail (set rỗng)', async () => {
        Category.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
        const req = makeEditReq({ removeThumbnail: '1' });

        await categoryService.editCategory(req);

        expect(req.body.thumbnail).toBe('');
    });

    test('UC-CATSER-31: có position trong body → parse sang int', async () => {
        Category.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
        const req = makeEditReq({ position: '7' });

        await categoryService.editCategory(req);

        expect(req.body.position).toBe(7);
    });

    test('UC-CATSER-32: không có position trong body → delete position key', async () => {
        Category.updateOne = jest.fn().mockResolvedValue({ matchedCount: 1 });
        const req = makeEditReq({ position: '' });
        delete req.body.position;

        await categoryService.editCategory(req);

        expect(req.body.position).toBeUndefined();
    });
});
