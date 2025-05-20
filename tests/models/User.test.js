const mongoose = require('mongoose');
const User = require('../../src/app/models/User');

describe('User Model', () => {
    it('nên có schema đúng định nghĩa', () => {
        const schema = User.schema.obj;

        expect(schema).toHaveProperty('username', {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 50,
            unique: true,
        });
        expect(schema).toHaveProperty('email', {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 50,
            unique: true,
        });
        expect(schema).toHaveProperty('password', {
            type: String,
            required: true,
            minlength: 6,
        });
        expect(schema).toHaveProperty('phoneNumber', {
            type: String,
            required: false,
            maxlength: 20,
        });
        expect(schema).toHaveProperty('address', {
            type: String,
            required: false,
            maxlength: 200,
        });
        expect(schema).toHaveProperty('admin', { type: Boolean, default: false });
        expect(schema).toHaveProperty('active', { type: Boolean, default: true });
    });

    it('nên xác thực dữ liệu hợp lệ', async () => {
        const user = new User({
            username: 'testuser123',
            email: 'test@example.com',
            password: 'password123',
            phoneNumber: '1234567890',
            address: '123 Street',
        });

        await expect(user.validate()).resolves.toBeUndefined();
    });

    it('nên không xác thực dữ liệu không hợp lệ', async () => {
        const user = new User({
            username: 'test', // Quá ngắn
            email: 'test@example.com',
            password: 'pass', // Quá ngắn
        });

        await expect(user.validate()).rejects.toThrow();
    });
});