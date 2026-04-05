/**
 * Admin Categories API Tests
 * Basic CRUD functionality testing
 */

const request = require('supertest');
const app = require('./app');
const Category = require('../models/category.model');

describe('Admin Categories API', () => {
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

    describe('GET /admin/categories', () => {
        test('should return 200 with categories list', async () => {
            const response = await request(app)
                .get('/admin/categories')
                .set('Cookie', adminSession)
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /admin/categories/create', () => {
        test('should create category with valid data', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('title', 'New Category')
                .field('status', 'active')
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject category without title', async () => {
            const response = await request(app)
                .post('/admin/categories/create')
                .set('Cookie', adminSession)
                .field('status', 'active')
                .accept('application/json');

            expect(response.status).toBe(400);
        });
    });

    describe('PATCH /admin/categories/change-status/:status/:id', () => {
        test('should change category status successfully', async () => {
            const response = await request(app)
                .patch(`/admin/categories/change-status/inactive/${testCategoryId}`)
                .set('Cookie', adminSession)
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('DELETE /admin/categories/delete-category/:id', () => {
        test('should delete category successfully', async () => {
            const response = await request(app)
                .delete(`/admin/categories/delete-category/${testCategoryId}`)
                .set('Cookie', adminSession)
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});