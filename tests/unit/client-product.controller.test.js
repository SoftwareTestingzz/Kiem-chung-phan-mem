/**
 * Unit Tests - Client Product Controller
 * Mock service layer và kiểm tra logic controller client
 */

jest.mock('../../services/client/product.service');
jest.mock('../../services/client/category.service');
jest.mock('../../models/comment.model');
jest.mock('../../models/order.model');
jest.mock('../../helper/respond');
jest.mock('../../helper/search');

const clientProductService = require('../../services/client/product.service');
const categoryService = require('../../services/client/category.service');
const Comment = require('../../models/comment.model');
const Order = require('../../models/order.model');
const respond = require('../../helper/respond');
const searchHelper = require('../../helper/search');
const clientProductController = require('../../controllers/client/product.controller');

// ----------------------------- Helpers ----------------------------- //
function makeProduct(overrides = {}) {
    return {
        _id: 'prod-id-1',
        title: 'Test Product',
        slug: 'test-product',
        price: 100000,
        status: 'active',
        ...overrides
    };
}

function makeReq(overrides = {}) {
    return {
        query: {},
        body: {},
        params: {},
        session: {},
        cookies: {},
        get: jest.fn().mockReturnValue(null),
        flash: jest.fn(),
        headers: { accept: 'application/json' },
        xhr: false,
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
    searchHelper.mockReturnValue({ keyword: '', regex: null });
    categoryService.getMenuCategories.mockResolvedValue([]);
});

afterEach(() => jest.clearAllMocks());

// ===================================================================
// index
// ===================================================================
describe('clientProductController.index (GET /products)', () => {
    test('UC-CPRODCTRL-01: không có query → trả về danh sách sản phẩm + respond 200', async () => {
        clientProductService.getList.mockResolvedValue([makeProduct()]);

        const req = makeReq({ query: {} });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-02: page=0 → respond 400 (page không hợp lệ)', async () => {
        clientProductService.getList.mockResolvedValue([]);

        const req = makeReq({ query: { page: '0' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-03: page=-1 → respond 400', async () => {
        clientProductService.getList.mockResolvedValue([]);

        const req = makeReq({ query: { page: '-1' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-04: page=1 → respond 200', async () => {
        clientProductService.getList.mockResolvedValue([makeProduct()]);

        const req = makeReq({ query: { page: '1' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-05: page rất lớn → clamp về totalPages, respond 200 với list rỗng', async () => {
        clientProductService.getList.mockResolvedValue([makeProduct()]);

        const req = makeReq({ query: { page: '999999' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-06: có keyword → lọc sản phẩm theo keyword (không phân biệt dấu)', async () => {
        searchHelper.mockReturnValue({ keyword: 'phone', regex: /phone/i });
        const prods = [
            makeProduct({ title: 'Phone Pro' }),
            makeProduct({ _id: 'p2', title: 'Laptop' })
        ];
        clientProductService.getList.mockResolvedValue(prods);

        const req = makeReq({ query: { keyword: 'phone' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        // Chỉ Phone Pro phù hợp khi filter
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-07: có category slug → gọi getListByCategorySlug', async () => {
        clientProductService.getListByCategorySlug.mockResolvedValue([makeProduct()]);

        const req = makeReq({ query: { category: 'electronics' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(clientProductService.getListByCategorySlug).toHaveBeenCalledWith('electronics');
    });

    test('UC-CPRODCTRL-08: service throw lỗi → respond 500', async () => {
        clientProductService.getList.mockRejectedValue(new Error('DB Error'));

        const req = makeReq({ query: {}, headers: { accept: 'application/json' } });
        const res = makeRes();

        await clientProductController.index(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
});

// ===================================================================
// detail
// ===================================================================
describe('clientProductController.detail (GET /detail/:slug)', () => {
    test('UC-CPRODCTRL-09: slug hợp lệ, product tồn tại → respond 200', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });

        const req = makeReq({ params: { slug: 'test-product' } });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-10: slug không tồn tại → respond 404', async () => {
        clientProductService.detail.mockResolvedValue(null);

        const req = makeReq({ params: { slug: 'non-existent' } });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-CPRODCTRL-11: user chưa đăng nhập → canReview=false, hasReviewed=false', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });

        const req = makeReq({ params: { slug: 'test-product' }, session: {} });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res,
            expect.objectContaining({
                status: 200,
                json: expect.objectContaining({ data: expect.objectContaining({ canReview: false, hasReviewed: false }) })
            })
        );
    });

    test('UC-CPRODCTRL-12: user đã đăng nhập, chưa mua → canReview=false', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });
        Comment.findOne = jest.fn().mockResolvedValue(null); // chưa review
        Order.findOne = jest.fn().mockResolvedValue(null);   // chưa mua

        const req = makeReq({
            params: { slug: 'test-product' },
            session: { user: { _id: 'user-id' } }
        });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res,
            expect.objectContaining({
                status: 200,
                json: expect.objectContaining({ data: expect.objectContaining({ canReview: false }) })
            })
        );
    });

    test('UC-CPRODCTRL-13: user đã mua và chưa review → canReview=true', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });
        Comment.findOne = jest.fn().mockResolvedValue(null);  // chưa review
        Order.findOne = jest.fn().mockResolvedValue({ _id: 'order-id', status: 'completed' }); // đã mua

        const req = makeReq({
            params: { slug: 'test-product' },
            session: { user: { _id: 'user-id' } }
        });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res,
            expect.objectContaining({
                status: 200,
                json: expect.objectContaining({ data: expect.objectContaining({ canReview: true }) })
            })
        );
    });

    test('UC-CPRODCTRL-14: user đã review → hasReviewed=true, canReview=false', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([])
        });
        Comment.findOne = jest.fn().mockResolvedValue({ _id: 'comment-id' }); // đã review

        const req = makeReq({
            params: { slug: 'test-product' },
            session: { user: { _id: 'user-id' } }
        });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(respond).toHaveBeenCalledWith(req, res,
            expect.objectContaining({
                status: 200,
                json: expect.objectContaining({
                    data: expect.objectContaining({ hasReviewed: true, canReview: false })
                })
            })
        );
    });

    test('UC-CPRODCTRL-15: có comments với ratings → tính avgRating đúng', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        const comments = [{ rating: 4, deleted: false }, { rating: 2, deleted: false }];
        Comment.find = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(comments)
        });

        const req = makeReq({ params: { slug: 'test-product' }, session: {} });
        const res = makeRes();

        await clientProductController.detail(req, res);

        // avgRating = (4+2)/2 = 3
        expect(respond).toHaveBeenCalledWith(req, res,
            expect.objectContaining({
                json: expect.objectContaining({ data: expect.objectContaining({ avgRating: 3 }) })
            })
        );
    });

    test('UC-CPRODCTRL-16: service throw lỗi → respond 500', async () => {
        clientProductService.detail.mockRejectedValue(new Error('DB Error'));

        const req = makeReq({ params: { slug: 'test' }, headers: { accept: 'application/json' } });
        const res = makeRes();

        await clientProductController.detail(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ===================================================================
// comment
// ===================================================================
describe('clientProductController.comment (POST /detail/:slug/comment)', () => {
    test('UC-CPRODCTRL-17: chưa đăng nhập → redirect /login', async () => {
        const req = makeReq({
            params: { slug: 'test-product' },
            session: {} // không có user
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({
            status: 401,
            redirect: '/login'
        }));
    });

    test('UC-CPRODCTRL-18: đã đăng nhập, product không tồn tại → respond 404', async () => {
        clientProductService.detail.mockResolvedValue(null);

        const req = makeReq({
            params: { slug: 'bad-slug' },
            body: { content: 'Great', rating: '5' },
            session: { user: { _id: 'user-id', fullName: 'User', email: 'u@x.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 404 }));
    });

    test('UC-CPRODCTRL-19: đã review rồi → respond 400 không thể review lại', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue({ _id: 'existing-comment' });

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'Again', rating: '4' },
            session: { user: { _id: 'user-id', fullName: 'User', email: 'u@x.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-20: rating = 0 (nhỏ hơn 1) → respond 400', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'Bad rating', rating: '0' },
            session: { user: { _id: 'user-id', fullName: 'A', email: 'a@b.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-21: rating = 6 (lớn hơn 5) → respond 400', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'Too high', rating: '6' },
            session: { user: { _id: 'user-id', fullName: 'A', email: 'a@b.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-22: content rỗng → respond 400', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: '', rating: '4' },
            session: { user: { _id: 'user-id', fullName: 'A', email: 'a@b.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-23: content > 500 ký tự → respond 400', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'a'.repeat(501), rating: '4' },
            session: { user: { _id: 'user-id', fullName: 'A', email: 'a@b.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 400 }));
    });

    test('UC-CPRODCTRL-24: dữ liệu hợp lệ → tạo comment + flash success + respond 200', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);
        Comment.create = jest.fn().mockResolvedValue({ _id: 'new-comment' });

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'Great product!', rating: '5' },
            session: { user: { _id: 'user-id', fullName: 'User A', email: 'ua@test.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(Comment.create).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Great product!',
            rating: 5
        }));
        expect(req.flash).toHaveBeenCalledWith('success', expect.any(String));
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-25: content đúng 500 ký tự → thành công (biên trên)', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);
        Comment.create = jest.fn().mockResolvedValue({ _id: 'c1' });

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'a'.repeat(500), rating: '3' },
            session: { user: { _id: 'u1', fullName: 'A', email: 'a@x.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(Comment.create).toHaveBeenCalled();
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-26: rating không truyền (undefined) → tạo comment không có rating', async () => {
        clientProductService.detail.mockResolvedValue(makeProduct());
        Comment.findOne = jest.fn().mockResolvedValue(null);
        Comment.create = jest.fn().mockResolvedValue({ _id: 'c2' });

        const req = makeReq({
            params: { slug: 'test-product' },
            body: { content: 'Good product' }, // không có rating
            session: { user: { _id: 'u1', fullName: 'A', email: 'a@x.com' } }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        const createCall = Comment.create.mock.calls[0][0];
        expect(createCall.rating).toBeUndefined();
        expect(respond).toHaveBeenCalledWith(req, res, expect.objectContaining({ status: 200 }));
    });

    test('UC-CPRODCTRL-27: service throw lỗi → respond 500', async () => {
        clientProductService.detail.mockRejectedValue(new Error('DB error'));

        const req = makeReq({
            params: { slug: 'test' },
            body: { content: 'Nice', rating: '5' },
            session: { user: { _id: 'u1', fullName: 'A', email: 'a@x.com' } },
            headers: { accept: 'application/json' }
        });
        const res = makeRes();

        await clientProductController.comment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
