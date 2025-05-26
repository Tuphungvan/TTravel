const SiteController = require('../../src/app/controllers/SiteController');
const Tour = require('../../src/app/models/Tour');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/app/models/Tour'); // Mock Tour model

describe('SiteController - Search (Keyword)', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();

        // Mock res.render
        res.render = jest.fn();

        // Thêm metadata Allure
        global.allure.feature('Search');
        global.allure.story('Search Tours by Keyword');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Search by Keyword', () => {
        beforeEach(() => {
            req = httpMocks.createRequest({
                method: 'GET',
                url: '/search',
                query: {
                    q: 'hanoi',
                },
            });
        });

        it('nên trả về danh sách tour phù hợp với từ khóa tìm kiếm', async () => {
            global.allure.description('Kiểm tra tìm kiếm tour thành công với từ khóa');
            global.allure.severity('critical');

            const mockTours = [
                { _id: 'tour1', name: 'Hanoi City Tour', slug: 'hanoi-city-tour' },
                { _id: 'tour2', name: 'Hanoi Night Tour', slug: 'hanoi-night-tour' },
            ];
            Tour.find.mockResolvedValue(mockTours);

            await SiteController.Search(req, res);

            expect(Tour.find).toHaveBeenCalledWith({ name: { $regex: 'hanoi', $options: 'i' } });
            expect(res.render).toHaveBeenCalledWith('users/search', { tours: mockTours, message: null });
        });

        it('nên trả về thông báo không tìm thấy khi không có tour phù hợp', async () => {
            global.allure.description('Kiểm tra trường hợp không tìm thấy tour với từ khóa');
            global.allure.severity('normal');

            Tour.find.mockResolvedValue([]);

            await SiteController.Search(req, res);

            expect(Tour.find).toHaveBeenCalledWith({ name: { $regex: 'hanoi', $options: 'i' } });
            expect(res.render).toHaveBeenCalledWith('users/search', { tours: [], message: 'Không tìm thấy tour phù hợp.' });
        });

        it('nên trả về lỗi server nếu có lỗi trong quá trình tìm kiếm', async () => {
            global.allure.description('Kiểm tra lỗi server khi cơ sở dữ liệu không phản hồi');
            global.allure.severity('blocker');

            Tour.find.mockRejectedValue(new Error('Database error'));

            await SiteController.Search(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                message: 'Đã xảy ra lỗi trong quá trình tìm kiếm',
                error: 'Database error',
            });
        });

        it('nên xử lý tìm kiếm không có từ khóa (query q rỗng)', async () => {
            global.allure.description('Kiểm tra tìm kiếm khi không có từ khóa');
            global.allure.severity('normal');

            req = httpMocks.createRequest({
                method: 'GET',
                url: '/search',
                query: {
                    q: '',
                },
            });

            const mockTours = [
                { _id: 'tour1', name: 'Hanoi City Tour', slug: 'hanoi-city-tour' },
                { _id: 'tour2', name: 'Saigon Tour', slug: 'saigon-tour' },
            ];
            Tour.find.mockResolvedValue(mockTours);

            await SiteController.Search(req, res);

            expect(Tour.find).toHaveBeenCalledWith({});
            expect(res.render).toHaveBeenCalledWith('users/search', { tours: mockTours, message: null });
        });
    });
});
//npm test -- tests/controllers/SiteControllerSearch.test.js --verbose  