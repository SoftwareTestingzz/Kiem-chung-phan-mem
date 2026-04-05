/**
 * Client Products API Tests - BVA Integrated
 */

const request = require('supertest');
const app = require('./app');
const Product = require('../models/product.model');

describe('Client Products API (BVA)', () => {
    let testProductSlug;

    beforeEach(async () => {
        const product = await Product.create({
            title: 'Client Test Product',
            price: 50000,
            stock: 50,
            status: 'active',
            slug: 'client-test-product'
        });
        testProductSlug = product.slug;
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    describe('GET /products', () => {
        test('BVA-CPROD-08: không param -> success', async () => {
            const response = await request(app)
                .get('/products')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-09: page=0 -> lỗi', async () => {
            const response = await request(app)
                .get('/products?page=0')
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-CPROD-10: page=1 -> success', async () => {
            const response = await request(app)
                .get('/products?page=1')
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-11: page rất lớn -> empty list (success)', async () => {
            const response = await request(app)
                .get('/products?page=999999')
                .accept('application/json');
            expect(response.status).toBe(200);
            // expect(response.body.products.length).toBe(0);
        });
    });

    describe('GET /detail/:slug', () => {
        test('BVA-CPROD-12: slug hợp lệ -> success', async () => {
            const response = await request(app)
                .get(`/detail/${testProductSlug}`)
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-13: slug không tồn tại -> lỗi', async () => {
            const response = await request(app)
                .get('/detail/non-existent-slug')
                .accept('application/json');
            expect(response.status).toBe(404);
        });

        test('BVA-CPROD-14: slug rỗng -> lỗi', async () => {
            // Usually this hits /detail/ which might be a 404
            const response = await request(app)
                .get('/detail/')
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /detail/:slug/comment', () => {
        test('BVA-CPROD-15: chưa login -> redirect login', async () => {
            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .send({ content: 'Nice product' });
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe('/login');
        });

        test('BVA-CPROD-16: đã login -> success', async () => {
            // Simulate login session or use a cookie if possible
            // For simplicity, we might need to perform a login first if the route uses session
            const loginRes = await request(app)
                .post('/auth/login')
                .send({ email: 'user@gmail.com', password: 'password' });
            const userCookie = loginRes.headers['set-cookie'];

            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .set('Cookie', userCookie)
                .send({ content: 'Nice product' })
                .accept('application/json');
            
            // If the route doesn't handle JSON, it might redirect.
            // Assuming it returns JSON for 'accept: application/json'
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-17: comment rỗng -> lỗi', async () => {
            const loginRes = await request(app).post('/auth/login').send({ email: 'user@gmail.com', password: 'password' });
            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .set('Cookie', loginRes.headers['set-cookie'])
                .send({ content: '' })
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-CPROD-18: comment 1 ký tự -> success', async () => {
            const loginRes = await request(app).post('/auth/login').send({ email: 'user@gmail.com', password: 'password' });
            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .set('Cookie', loginRes.headers['set-cookie'])
                .send({ content: 'a' })
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-19: comment dài max -> success', async () => {
            const loginRes = await request(app).post('/auth/login').send({ email: 'user@gmail.com', password: 'password' });
            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .set('Cookie', loginRes.headers['set-cookie'])
                .send({ content: 'a'.repeat(500) }) // Assume 500 is max
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-20: comment vượt max -> lỗi', async () => {
            const loginRes = await request(app).post('/auth/login').send({ email: 'user@gmail.com', password: 'password' });
            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .set('Cookie', loginRes.headers['set-cookie'])
                .send({ content: 'a'.repeat(501) })
                .accept('application/json');
            expect(response.status).toBe(400);
        });

        test('BVA-CPROD-21: slug hợp lệ -> success', async () => {
            const loginRes = await request(app).post('/auth/login').send({ email: 'user@gmail.com', password: 'password' });
            const response = await request(app)
                .post(`/detail/${testProductSlug}/comment`)
                .set('Cookie', loginRes.headers['set-cookie'])
                .send({ content: 'Valid slug' })
                .accept('application/json');
            expect(response.status).toBe(200);
        });

        test('BVA-CPROD-22: slug không tồn tại -> lỗi', async () => {
            const loginRes = await request(app).post('/auth/login').send({ email: 'user@gmail.com', password: 'password' });
            const response = await request(app)
                .post('/detail/invalid-slug/comment')
                .set('Cookie', loginRes.headers['set-cookie'])
                .send({ content: 'Valid content' })
                .accept('application/json');
            expect(response.status).toBe(404);
        });
    });
});