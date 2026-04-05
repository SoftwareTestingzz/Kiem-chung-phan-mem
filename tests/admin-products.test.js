/**
 * Admin Products API Tests
 * Basic CRUD functionality testing
 */

const request = require('supertest');
const app = require('./app');
const Product = require('../models/product.model');

describe('Admin Products API', () => {
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

    describe('GET /admin/products', () => {
        test('should return 200 with products list', async () => {
            const response = await request(app)
                .get('/admin/products')
                .set('Cookie', adminSession)
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /admin/products/create', () => {
        test('should create product with valid data', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('title', 'New Product')
                .field('description', 'This is a test product description')
                .field('price', '100000')
                .field('stock', '10')
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject product without title', async () => {
            const response = await request(app)
                .post('/admin/products/create')
                .set('Cookie', adminSession)
                .field('price', '100000')
                .field('stock', '10')
                .accept('application/json');

            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/products/change-status/:status/:id', () => {
        test('should change product status successfully', async () => {
            const response = await request(app)
                .patch(`/admin/products/change-status/inactive/${testProductId}`)
                .set('Cookie', adminSession)
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('DELETE /admin/products/delete-product/:id', () => {
        test('should delete product successfully', async () => {
            const response = await request(app)
                .delete(`/admin/products/delete-product/${testProductId}`)
                .set('Cookie', adminSession)
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});