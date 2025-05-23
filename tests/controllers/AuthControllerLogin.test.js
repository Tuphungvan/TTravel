const AuthController = require('../../src/app/controllers/AuthControllers');
const User = require('../../src/app/models/User');
const bcrypt = require('bcrypt');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/app/models/User'); // Mock model User
jest.mock('bcrypt'); // Mock bcrypt

describe('AuthController - Login', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        res.redirect = jest.fn(); // Mock res.redirect

        // Thêm metadata Allure
        global.allure.feature('Login');
        global.allure.story('User Login');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                method: 'POST',
                url: '/v1/auth/login',
                body: {
                    username: 'newuser123',
                    password: 'password123',
                },
                session: {}, // Mock session
            });
        });

        it('nên đăng nhập thành công và redirect đến trang chủ nếu không phải admin', async () => {
            global.allure.description('Kiểm tra đăng nhập thành công cho người dùng không phải admin');
            global.allure.severity('critical');

            const mockUser = {
                _id: 'userId',
                username: 'newuser123',
                password: 'hashedPassword',
                active: true,
                admin: false,
                email: 'newuser@example.com',
                phoneNumber: '1234567890',
                address: '123 Street',
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await AuthController.login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'newuser123' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(req.session.user).toEqual({
                id: 'userId',
                username: 'newuser123',
                email: 'newuser@example.com',
                phoneNumber: '1234567890',
                address: '123 Street',
                admin: false,
            });
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('nên đăng nhập thành công và redirect đến dashboard nếu là admin', async () => {
            global.allure.description('Kiểm tra đăng nhập thành công cho người dùng admin');
            global.allure.severity('critical');

            const mockUser = {
                _id: 'adminId',
                username: 'newuser123',
                password: 'hashedPassword',
                active: true,
                admin: true,
                email: 'admin@example.com',
                phoneNumber: '0987654321',
                address: '456 Avenue',
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await AuthController.login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'newuser123' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(req.session.user).toEqual({
                id: 'adminId',
                username: 'newuser123',
                email: 'admin@example.com',
                phoneNumber: '0987654321',
                address: '456 Avenue',
                admin: true,
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/dashboard');
        });

        it('nên trả về lỗi nếu người dùng không tồn tại', async () => {
            global.allure.description('Kiểm tra lỗi khi người dùng không tồn tại');
            global.allure.severity('normal');

            User.findOne.mockResolvedValue(null);

            await AuthController.login(req, res);

            expect(res._getRenderView()).toBe('login');
            expect(res._getRenderData()).toEqual({
                errorMessage: 'Tên người dùng không tồn tại',
            });
        });

        it('nên trả về lỗi nếu tài khoản bị vô hiệu', async () => {
            global.allure.description('Kiểm tra lỗi khi tài khoản bị vô hiệu');
            global.allure.severity('normal');

            const mockUser = {
                username: 'newuser123',
                active: false,
            };
            User.findOne.mockResolvedValue(mockUser);

            await AuthController.login(req, res);

            expect(res._getRenderView()).toBe('login');
            expect(res._getRenderData()).toEqual({
                errorMessage: 'Tài khoản đã bị vô hiệu. Vui lòng liên hệ với quản trị viên.',
            });
        });

        it('nên trả về lỗi nếu mật khẩu không đúng', async () => {
            global.allure.description('Kiểm tra lỗi khi mật khẩu không đúng');
            global.allure.severity('normal');

            const mockUser = {
                username: 'newuser123',
                password: 'hashedPassword',
                active: true,
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await AuthController.login(req, res);

            expect(res._getRenderView()).toBe('login');
            expect(res._getRenderData()).toEqual({
                errorMessage: 'Mật khẩu không đúng',
            });
        });

        it('nên trả về lỗi server nếu không kết nối được cơ sở dữ liệu', async () => {
            global.allure.description('Kiểm tra lỗi server khi cơ sở dữ liệu không phản hồi');
            global.allure.severity('blocker');

            User.findOne.mockRejectedValue(new Error('Database error'));

            await AuthController.login(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                message: 'Server error',
                error: {},
            });
        });
    });
});
// npm test -- tests/controllers/AuthControllerLogin.test.js --verbose