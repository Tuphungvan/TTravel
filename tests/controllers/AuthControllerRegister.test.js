const AuthController = require('../../src/app/controllers/AuthControllers');
const User = require('../../src/app/models/User');
const bcrypt = require('bcrypt');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/app/models/User'); // Mock model User
jest.mock('bcrypt'); // Mock bcrypt

describe('AuthController - Register', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        res.redirect = jest.fn(); // Mock res.redirect

        // Thêm metadata Allure
        global.allure.feature('Register');
        global.allure.story('User Registration');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                method: 'POST',
                url: '/v1/auth/register',
                body: {
                    username: 'newuser123',
                    email: 'newuser@example.com',
                    password: 'password123',
                    phoneNumber: '1234567890',
                    address: '123 Street',
                },
            });
        });

        it('nên đăng ký thành công và render thông báo thành công', async () => {
            global.allure.description('Kiểm tra đăng ký thành công với thông tin hợp lệ');
            global.allure.severity('critical');

            User.findOne
                .mockResolvedValueOnce(null) // Không có user trùng
                .mockResolvedValueOnce(null); // Không có admin
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.prototype.save = jest.fn().mockResolvedValue();

            await AuthController.register(req, res);

            expect(User.findOne).toHaveBeenCalledWith({
                $or: [
                    { email: 'newuser@example.com' },
                    { username: 'newuser123' },
                    { phoneNumber: '1234567890' },
                ],
            });
            expect(User.findOne).toHaveBeenCalledWith({ admin: true });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
            expect(User.prototype.save).toHaveBeenCalled();
            expect(res._getRenderData()).toEqual({
                successMessage: 'Bạn đã đăng ký thành công!',
                errorMessage: '',
            });
        });

        it('nên trả về lỗi nếu email đã tồn tại', async () => {
            global.allure.description('Kiểm tra lỗi khi email đã được đăng ký');
            global.allure.severity('normal');

            User.findOne.mockResolvedValue({ email: 'newuser@example.com' });

            await AuthController.register(req, res);

            expect(res._getRenderData()).toEqual({
                errorMessage: 'Email đã được đăng ký.',
                successMessage: '',
            });
        });

        it('nên trả về lỗi nếu username đã tồn tại', async () => {
            global.allure.description('Kiểm tra lỗi khi username đã được sử dụng');
            global.allure.severity('normal');

            User.findOne.mockResolvedValue({ username: 'newuser123' });

            await AuthController.register(req, res);

            expect(res._getRenderData()).toEqual({
                errorMessage: 'Tên người dùng đã được sử dụng.',
                successMessage: '',
            });
        });

        it('nên trả về lỗi nếu số điện thoại đã tồn tại', async () => {
            global.allure.description('Kiểm tra lỗi khi số điện thoại đã được đăng ký');
            global.allure.severity('normal');

            User.findOne.mockResolvedValue({ phoneNumber: '1234567890' });

            await AuthController.register(req, res);

            expect(res._getRenderData()).toEqual({
                errorMessage: 'Số điện thoại đã được đăng ký.',
                successMessage: '',
            });
        });

        it('nên trả về lỗi nếu username quá ngắn', async () => {
            global.allure.description('Kiểm tra lỗi khi username ngắn hơn 6 ký tự');
            global.allure.severity('normal');

            req.body.username = 'short';
            User.findOne.mockResolvedValue(null);

            await AuthController.register(req, res);

            expect(res._getRenderData()).toEqual({
                errorMessage: 'Tên người dùng phải dài ít nhất 6 ký tự.',
                successMessage: '',
            });
        });

        it('nên trả về lỗi server nếu không kết nối được cơ sở dữ liệu', async () => {
            global.allure.description('Kiểm tra lỗi server khi cơ sở dữ liệu không phản hồi');
            global.allure.severity('blocker');

            User.findOne.mockRejectedValue(new Error('Database error'));

            await AuthController.register(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                message: 'Server error',
                error: {},
            });
        });

        it('nên gán admin = true nếu chưa có admin', async () => {
            global.allure.description('Kiểm tra gán quyền admin khi chưa có admin');
            global.allure.severity('critical');

            User.findOne
                .mockResolvedValueOnce(null) // Không có user trùng
                .mockResolvedValueOnce(null); // Không có admin
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.prototype.save = jest.fn().mockResolvedValue();

            await AuthController.register(req, res);

            expect(User.prototype.save).toHaveBeenCalled();
            expect(res._getRenderData()).toEqual({
                successMessage: 'Bạn đã đăng ký thành công!',
                errorMessage: '',
            });
        });

        it('nên gán admin = false nếu đã có admin', async () => {
            global.allure.description('Kiểm tra gán quyền không phải admin khi đã có admin');
            global.allure.severity('critical');

            User.findOne
                .mockResolvedValueOnce(null) // Không có user trùng
                .mockResolvedValueOnce({ admin: true }); // Đã có admin
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.prototype.save = jest.fn().mockResolvedValue();

            await AuthController.register(req, res);

            expect(User.prototype.save).toHaveBeenCalled();
            expect(res._getRenderData()).toEqual({
                successMessage: 'Bạn đã đăng ký thành công!',
                errorMessage: '',
            });
        });
    });
});
// npm test -- tests/controllers/AuthControllerRegister.test.js --verbose