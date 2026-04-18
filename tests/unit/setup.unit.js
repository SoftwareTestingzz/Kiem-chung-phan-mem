/**
 * Unit Test Setup
 * Không cần MongoDB vì toàn bộ models được mock trong unit tests.
 * File này có thể để trống hoặc chứa các global mock chung.
 */

// Reset tất cả mock sau mỗi test file
afterEach(() => {
    jest.clearAllMocks();
});
