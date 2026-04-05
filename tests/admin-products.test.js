/**
 * Admin Products API Tests - BVA Integrated
 */

const request = require('supertest');
const app = require('./app');
const Product = require('../models/product.model');

describe('Admin Products API (BVA)', () => {
    let adminSession;
    let testProductId;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/admin/auth/login')
            .send({ email: 'verdish@gmail.com', password: 'verdishAdmin' });

        adminSession = loginResponse.headers['set-cookie'];
    });

    beforeEach(async () => {
        const product = await Product.create({
            title: 'Test Product',
            price: 100000,
            stock: 10,
            status: 'active'
        });
        testProductId = product._id.toString();
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    describe('POST /admin/products/create', () => {
        test('BVA-APROD-11: name rỗng -> lỗi', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', '')
                .field('price', '100000')
                .field('stock', '10')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-12: name 1 ký tự -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'a')
                .field('price', '100000')
                .field('stock', '10')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-13: name 255 ký tự -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'a'.repeat(255))
                .field('price', '100000')
                .field('stock', '10')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-14: name 256 ký tự -> lỗi', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'a'.repeat(256))
                .field('price', '100000')
                .field('stock', '10')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-15: price = -1 -> lỗi', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'Product Price -1')
                .field('price', '-1')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-16: price = 0 -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'Free Product')
                .field('price', '0')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-17: price = 1 -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'Product Price 1')
                .field('price', '1')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-18: price rất lớn -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'Expensive Product')
                .field('price', '999999999')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-19: thumbnail không upload -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'No Image')
                .field('price', '1000')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-20: thumbnail file hợp lệ -> success', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'With Image')
                .attach('thumbnail', Buffer.from('fake-image'), 'test.jpg')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-21: thumbnail file sai định dạng -> lỗi', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'Bad File')
                .attach('thumbnail', Buffer.from('fake-exe'), 'test.exe')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-22: thumbnail file quá size -> lỗi', async () => {
            const largeBuffer = Buffer.alloc(10 * 1024 * 1024);
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'Huge File')
                .attach('thumbnail', largeBuffer, 'huge.jpg')
                .accept('application/json');
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/products/edit/:id', () => {
        test('BVA-APROD-23: id hợp lệ -> success', async () => {
            const response = await request(app)
                .patch(`/admin/products/edit/${testProductId}`)
                .set('Cookie', adminSession)
                .field('title', 'Updated')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-24: id sai format -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/products/edit/invalid-id')
                .set('Cookie', adminSession)
                .field('title', 'Updated')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-25: id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/products/edit/64b1f48a76564fe4bb57341d')
                .set('Cookie', adminSession)
                .field('title', 'Updated')
                .accept('application/json');
            expect(response.status).toBe(404);
        });

        test('BVA-APROD-26: name rỗng -> lỗi', async () => {
            const response = await request(app)
                .patch(`/admin/products/edit/${testProductId}`)
                .set('Cookie', adminSession)
                .field('title', '')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-27: price âm -> lỗi', async () => {
            const response = await request(app)
                .patch(`/admin/products/edit/${testProductId}`)
                .set('Cookie', adminSession)
                .field('price', '-10')
                .accept('application/json');
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/products/change-status/:status/:id', () => {
        test('BVA-APROD-28: status hợp lệ -> success', async () => {
            const response = await request(app)
                .patch(`/admin/products/change-status/inactive/${testProductId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-29: status sai -> lỗi', async () => {
            const response = await request(app)
                .patch(`/admin/products/change-status/badstatus/${testProductId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-30: id sai -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/products/change-status/active/invalid-id')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/products/change-multi', () => {
        test('BVA-APROD-31: list rỗng -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/products/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: [], type: 'active' })
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-32: list hợp lệ -> success', async () => {
            const response = await request(app)
                .patch('/admin/products/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: [testProductId], type: 'inactive' })
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-33: list có id sai -> lỗi', async () => {
            const response = await request(app)
                .patch('/admin/products/change-multi')
                .set('Cookie', adminSession)
                .send({ ids: ['invalid-id'], type: 'active' })
                .accept('application/json');
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /admin/products/delete-product/:id', () => {
        test('BVA-APROD-34: id hợp lệ -> success', async () => {
            const response = await request(app)
                .delete(`/admin/products/delete-product/${testProductId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-35: id sai -> lỗi', async () => {
            const response = await request(app)
                .delete('/admin/products/delete-product/invalid-id')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-36: id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .delete('/admin/products/delete-product/64b1f48a76564fe4bb57341d')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });

    describe('GET /admin/products/detail/:id', () => {
        test('BVA-APROD-37: id hợp lệ -> success', async () => {
            const response = await request(app)
                .get(`/admin/products/detail/${testProductId}`)
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-APROD-38: id sai format -> lỗi', async () => {
            const response = await request(app)
                .get('/admin/products/detail/invalid-id')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-APROD-39: id không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .get('/admin/products/detail/64b1f48a76564fe4bb57341d')
                .set('Cookie', adminSession)
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });
});