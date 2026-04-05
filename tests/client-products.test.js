/**
 * Client Products API Tests
 * Basic CRUD functionality testing
 */

const request = require('supertest');
const app = require('./app');

describe('Client Products API', () => {
    describe('GET /products', () => {
        test('should return 200 with products list', async () => {
            const response = await request(app)
                .get('/products')
                .accept('application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('GET /detail/:slug', () => {
        test('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .get('/detail/non-existent-product')
                .accept('application/json');

            expect(response.status).toBe(404);
        });
    });
});