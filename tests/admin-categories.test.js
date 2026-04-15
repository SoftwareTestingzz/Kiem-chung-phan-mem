/**
 * Admin Categories API Tests - BVA Integrated
 */

const request = require('supertest');
const app = require('./app');
const Category = require('../models/category.model');

describe('Admin Categories API (BVA)', () => {
    let adminSession;
    let testCategoryId;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/admin/auth/login')
            .send({ email: 'verdish@gmail.com', password: 'verdishAdmin' });

        adminSession = loginResponse.headers['set-cookie'];
    });

    beforeEach(async () => {
        const category = await Category.create({
            title: 'Test Category',
            status: 'active'
        });
        testCategoryId = category._id.toString();
    });

    afterEach(async () => {
        await Category.deleteMany({});
    });

    describe('POST /admin/categories/create', () => {
        test('BVA-ACAT-12: name rỗng -> lỗi validate', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', '')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-13: name 1 ký tự -> success', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'a')
                .accept('application/json');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('BVA-ACAT-14: name 255 ký tự -> success', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'a'.repeat(255))
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-15: name 256 ký tự -> lỗi', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'a'.repeat(256))
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-17: thumbnail không upload -> success', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'Valid Category')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-18: thumbnail file ảnh hợp lệ -> success', async () => {
            // Note: In real test we would upload a file, but here we test the field existence or mock
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'Valid Category with Image')
                .attach('thumbnail', Buffer.from('fake-image-content'), 'test.png')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-19: thumbnail file sai định dạng -> lỗi', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'Invalid File Type')
                .attach('thumbnail', Buffer.from('fake-exe-content'), 'test.exe')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-20: thumbnail file vượt max size -> lỗi', async () => {
            const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'Large File')
                .attach('thumbnail', largeBuffer, 'large.png')
                .accept('application/json');
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/categories/edit/:id', () => {
        test('BVA-ACAT-21: id hợp lệ + data hợp lệ -> success', async () => {
            const response = await request(app)
                .patch(`/admin/categories/edit/${testCategoryId}`)
                .set('Cookie', adminSession)
                .field('title', 'Updated Category')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-22: id sai format -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/edit/invalid-id')
                .set('Cookie', adminSession)
                .field('title', 'Updated')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-23: id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/edit/64b1f48a76564fe4bb57341d') // Valid format, non-existent
                .set('Cookie', adminSession)
                .field('title', 'Updated')
                .accept('application/json');
            expect(response.status).toBe(404);
        });

        test('BVA-ACAT-24: name rỗng -> lỗi', async () => {
            const response = await request(app)
                .patch(`/admin/categories/edit/${testCategoryId}`)
                .set('Cookie', adminSession)
                .field('title', '')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-25: name > 255 ký tự -> lỗi', async () => {
            const response = await request(app)
                .patch(`/admin/categories/edit/${testCategoryId}`)
                .set('Cookie', adminSession)
                .field('title', 'a'.repeat(256))
                .accept('application/json');
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/categories/change-status/:status/:id', () => {
        test('BVA-ACAT-26: status=active -> success', async () => {
            const response = await request(app)
                .patch(`/admin/categories/change-status/active/${testCategoryId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-27: status=inactive -> success', async () => {
            const response = await request(app)
                .patch(`/admin/categories/change-status/inactive/${testCategoryId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-28: status=abc -> lỗi', async () => {
            const response = await request(app)
                .patch(`/admin/categories/change-status/abc/${testCategoryId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-29: id sai format -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/change-status/active/invalid-id')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-30: id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/change-status/active/64b1f48a76564fe4bb57341d')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /admin/categories/change-multi', () => {
        test('BVA-ACAT-31: list rỗng -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: [], type: 'active' })
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-32: 1 id hợp lệ -> success', async () => {
            const response = await request(app)
                .patch('/admin/categories/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: [testCategoryId], type: 'inactive' })
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-33: nhiều id hợp lệ -> success', async () => {
            const cat2 = await Category.create({ title: 'Cat 2' });
            const response = await request(app)
                .patch('/admin/categories/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: [testCategoryId, cat2._id.toString()], type: 'active' })
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-34: list có id sai -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: [testCategoryId, 'invalid-id'], type: 'active' })
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-35: list có id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/categories/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: ['64b1f48a76564fe4bb57341d'], type: 'active' })
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /admin/categories/delete-category/:id', () => {
        test('BVA-ACAT-36: id hợp lệ -> success', async () => {
            const response = await request(app)
                .delete(`/admin/categories/delete-category/${testCategoryId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-ACAT-37: id sai format -> lỗi', async () => {
            const response = await request(app)
                .delete('/admin/categories/delete-category/invalid-id')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-ACAT-38: id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .delete('/admin/categories/delete-category/64b1f48a76564fe4bb57341d')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });
});