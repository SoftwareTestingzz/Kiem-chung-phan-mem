/**
 * Unit Tests - Client Product Service
 * Kiểm tra từng hàm trong services/client/product.service.js bằng cách mock Model
 */

jest.mock('../../models/product.model');
jest.mock('../../models/category.model');

const Product = require('../../models/product.model');
const Category = require('../../models/category.model');
const clientProductService = require('../../services/client/product.service');

// ----------------------------- Helper ----------------------------- //
function makeProduct(overrides = {}) {
    return {
        _id: 'prod-id-1',
        title: 'Test Product',
        price: 100000,
        discountPercentage: 0,
        stock: 10,
        status: 'active',
        deleted: false,
        slug: 'test-product',
        product_category: '',
        description: '',
        ...overrides
    };
}

// ===================================================================
// getList
// ===================================================================
describe('clientProductService.getList', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CPRODSER-01: trả về danh sách sản phẩm active, không deleted', async () => {
        const prods = [makeProduct(), makeProduct({ _id: 'prod-id-2', title: 'Product 2' })];
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(prods) });

        const result = await clientProductService.getList();

        expect(Product.find).toHaveBeenCalledWith({ status: 'active', deleted: false });
        expect(result).toHaveLength(2);
    });

    test('UC-CPRODSER-02: sản phẩm có discountPercentage=10 → tính giá mới đúng', async () => {
        const prod = makeProduct({ price: 100000, discountPercentage: 10 });
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([prod]) });

        const result = await clientProductService.getList();

        // price * (100-10)/100 = 90000
        expect(result[0].newPriceNumber).toBe(90000);
        expect(result[0].oldPriceNumber).toBe(100000);
    });

    test('UC-CPRODSER-03: sản phẩm không có discountPercentage → giá mới = giá gốc', async () => {
        const prod = makeProduct({ price: 50000, discountPercentage: 0 });
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([prod]) });

        const result = await clientProductService.getList();

        expect(result[0].newPriceNumber).toBe(50000);
    });

    test('UC-CPRODSER-04: sản phẩm có description HTML → shortDescription được strip HTML', async () => {
        const prod = makeProduct({ description: '<p>Hello <b>World</b></p>' });
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([prod]) });

        const result = await clientProductService.getList();

        expect(result[0].shortDescription).not.toContain('<p>');
        expect(result[0].shortDescription).toContain('Hello');
    });

    test('UC-CPRODSER-05: database trống → trả về mảng rỗng', async () => {
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        const result = await clientProductService.getList();

        expect(result).toEqual([]);
    });

    test('UC-CPRODSER-06: description dài hơn 260 ký tự → shortDescription bị cắt 260', async () => {
        const longDesc = 'a'.repeat(400);
        const prod = makeProduct({ description: longDesc });
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([prod]) });

        const result = await clientProductService.getList();

        expect(result[0].shortDescription.length).toBeLessThanOrEqual(260);
    });
});

// ===================================================================
// getProductsForHome
// ===================================================================
describe('clientProductService.getProductsForHome', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CPRODSER-07: limit=3 → trả về tối đa 3 sản phẩm', async () => {
        const prods = Array(5).fill(null).map((_, i) => makeProduct({ _id: `prod-${i}`, title: `Product ${i}` }));
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(prods) });

        const result = await clientProductService.getProductsForHome(3);

        expect(result).toHaveLength(3);
    });

    test('UC-CPRODSER-08: limit mặc định 10 → trả về tối đa 10 sản phẩm', async () => {
        const prods = Array(15).fill(null).map((_, i) => makeProduct({ _id: `prod-${i}`, title: `P${i}` }));
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(prods) });

        const result = await clientProductService.getProductsForHome();

        expect(result).toHaveLength(10);
    });

    test('UC-CPRODSER-09: có ít hơn limit → trả về tất cả', async () => {
        const prods = [makeProduct(), makeProduct({ _id: 'p2', title: '2' })];
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(prods) });

        const result = await clientProductService.getProductsForHome(10);

        expect(result).toHaveLength(2);
    });
});

// ===================================================================
// detail
// ===================================================================
describe('clientProductService.detail', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CPRODSER-10: slug hợp lệ, product tồn tại → trả về product đã format', async () => {
        const prod = makeProduct({ price: 200000, discountPercentage: 20 });
        Product.findOne = jest.fn().mockResolvedValue(prod);

        const result = await clientProductService.detail('test-product');

        expect(result).toBe(prod);
        expect(result.newPriceNumber).toBe(160000); // 200000 * 80%
        expect(result.newPrice).toBeDefined();
        expect(result.shortDescription).toBeDefined();
    });

    test('UC-CPRODSER-11: slug không tồn tại → trả về null', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);

        const result = await clientProductService.detail('non-existent');

        expect(result).toBeNull();
    });

    test('UC-CPRODSER-12: query với đúng điều kiện (deleted=false, status=active)', async () => {
        Product.findOne = jest.fn().mockResolvedValue(null);

        await clientProductService.detail('some-slug');

        expect(Product.findOne).toHaveBeenCalledWith({
            deleted: false,
            slug: 'some-slug',
            status: 'active'
        });
    });

    test('UC-CPRODSER-13: product không có discountPercentage → giá không đổi', async () => {
        const prod = makeProduct({ price: 80000 });
        delete prod.discountPercentage;
        Product.findOne = jest.fn().mockResolvedValue(prod);

        const result = await clientProductService.detail('test');

        expect(result.newPriceNumber).toBe(80000);
    });
});

// ===================================================================
// getListByCategorySlug
// ===================================================================
describe('clientProductService.getListByCategorySlug', () => {
    afterEach(() => jest.clearAllMocks());

    test('UC-CPRODSER-14: category không tồn tại → trả về mảng rỗng', async () => {
        Category.findOne = jest.fn().mockResolvedValue(null);

        const result = await clientProductService.getListByCategorySlug('non-existent');

        expect(result).toEqual([]);
    });

    test('UC-CPRODSER-15: category cha (không có parent_category) → lấy sản phẩm của cả con', async () => {
        const parentCat = { _id: 'cat-parent-id', parent_category: null };
        const childCat = { _id: 'cat-child-id' };
        const prods = [makeProduct({ product_category: 'cat-child-id' })];

        Category.findOne = jest.fn().mockResolvedValue(parentCat);
        Category.find = jest.fn().mockResolvedValue([childCat]);
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(prods) });

        const result = await clientProductService.getListByCategorySlug('electronics');

        expect(Category.find).toHaveBeenCalledWith(expect.objectContaining({
            parent_category: 'cat-parent-id'
        }));
        expect(result).toHaveLength(1);
    });

    test('UC-CPRODSER-16: category con (có parent_category) → chỉ lấy sản phẩm của nó', async () => {
        const childCat = { _id: 'cat-child-id', parent_category: 'cat-parent-id' };
        const prods = [makeProduct()];

        Category.findOne = jest.fn().mockResolvedValue(childCat);
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(prods) });

        const result = await clientProductService.getListByCategorySlug('phones');

        // Không gọi Category.find để lấy children
        expect(Category.find).not.toHaveBeenCalled();
        expect(result).toHaveLength(1);
    });

    test('UC-CPRODSER-17: category hợp lệ → sản phẩm được format giá', async () => {
        const cat = { _id: 'cat-id', parent_category: 'parent-id' };
        const prod = makeProduct({ price: 300000, discountPercentage: 30 });

        Category.findOne = jest.fn().mockResolvedValue(cat);
        Product.find = jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([prod]) });

        const result = await clientProductService.getListByCategorySlug('category-slug');

        expect(result[0].newPriceNumber).toBe(210000); // 300000 * 70%
    });
});
