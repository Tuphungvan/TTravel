module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Thêm dòng này
    reporters: [
        'default', // Giữ đầu ra terminal mặc định
        [
            'jest-allure2-reporter',
            {
                resultsDir: 'reports/allure-results', // Thư mục lưu kết quả Allure
                environment: {
                    Project: 'Thuctap',
                    Environment: 'Test',
                },
            },
        ],
    ],
};