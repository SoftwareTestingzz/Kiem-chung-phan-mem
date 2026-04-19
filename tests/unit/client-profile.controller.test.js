/**
 * Unit Tests - Client Profile Controller
 * Mock service layer và kiểm tra logic controller client
 */

const profileService = require('../../services/client/profile.service');
const { validationResult } = require('express-validator');

jest.mock('../../services/client/profile.service');
jest.mock('express-validator');

const profileController = require('../../controllers/client/profile.controller');

// ----------------------------- Helpers ----------------------------- //
function makeReq(overrides = {}) {
    return {
        session: {},
        headers: { accept: 'application/json' },
        body: {},
        ...overrides
    };
}

function makeRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        redirect: jest.fn(),
        render: jest.fn(),
    };
}

beforeEach(() => {
    validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
});

afterEach(() => jest.clearAllMocks());

// ===================================================================
// index
// ===================================================================
describe('profileController.index (GET /profile)', () => {
    test('PROFCTRL-01: chưa login, API request → json 400', async () => {
        const req = makeReq({ session: { user: null }, headers: { accept: 'application/json' } });
        const res = makeRes();

        await profileController.index(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Bạn chưa đăng nhập!" });
    });

    test('PROFCTRL-02: chưa login, HTML → redirect /login', async () => {
        const req = makeReq({ session: { user: null }, headers: { accept: 'text/html' } });
        const res = makeRes();

        await profileController.index(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('PROFCTRL-03: đã login, API → json user info', async () => {
        const user = { _id: 'user1', fullName: 'Test User' };
        profileService.checkLogin.mockReturnValue(true);
        const req = makeReq({ session: { user }, headers: { accept: 'application/json' } });
        const res = makeRes();

        await profileController.index(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: true, user });
    });

    test('PROFCTRL-04: đã login, HTML → render profile page', async () => {
        const user = { _id: 'user1' };
        profileService.checkLogin.mockReturnValue(true);
        const req = makeReq({ session: { user }, headers: { accept: 'text/html' } });
        const res = makeRes();

        await profileController.index(req, res);

        expect(res.render).toHaveBeenCalledWith('client/pages/profile/index', expect.objectContaining({ user }));
    });
});

// ===================================================================
// updateProfile
// ===================================================================
describe('profileController.updateProfile (POST /profile)', () => {
    test('PROFCTRL-05: validation error → json 400', async () => {
        validationResult.mockReturnValue({ 
            isEmpty: () => false, 
            array: () => [{ msg: 'Full name required' }]
        });
        const req = makeReq({ session: { user: { _id: 'u1' } } });
        const res = makeRes();

        await profileController.updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Full name required' });
    });

    test('PROFCTRL-06: chưa login → json 401', async () => {
        const req = makeReq({ session: {} });
        const res = makeRes();

        await profileController.updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Bạn chưa đăng nhập!" });
    });

    test('PROFCTRL-07: success flow → prepareUpdateData → updateUserInDatabase → update session → json success', async () => {
        profileService.prepareUpdateData.mockResolvedValue({ id: 'u1', data: { fullName: 'New Name' } });
        profileService.updateUserInDatabase.mockResolvedValue({ _id: 'u1', fullName: 'New Name', email: 'new@test.com' });
        const req = makeReq({ 
            session: { user: { _id: 'u1' } },
            body: { fullName: 'New Name' }
        });
        const res = makeRes();

        await profileController.updateProfile(req, res);

        expect(profileService.prepareUpdateData).toHaveBeenCalledWith(req);
        expect(profileService.updateUserInDatabase).toHaveBeenCalled();
        expect(req.session.user).toEqual(expect.objectContaining({ fullName: 'New Name' }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    test('PROFCTRL-08: service error → json 500', async () => {
        profileService.prepareUpdateData.mockRejectedValue(new Error('DB Error'));
        const req = makeReq({ session: { user: { _id: 'u1' } } });
        const res = makeRes();

        await profileController.updateProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Cập nhật thất bại!' });
    });
});
