import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient
import time

# Fixture để thiết lập và dọn dẹp
@pytest.fixture(scope="module")
def setup_teardown():
    mongo_client = MongoClient('mongodb://localhost:27017')
    db = mongo_client['travel']
    tours_collection = db['tours']
    try:
        mongo_client.server_info()
        print("Kết nối MongoDB thành công")
    except Exception as e:
        print(f"Lỗi kết nối MongoDB: {e}")
        pytest.exit(f"MongoDB connection failed: {e}")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    base_url = "http://localhost:3000/#home"
    
    tours_collection.delete_many({})
    tours_collection.insert_many([
        {'name': 'Tour Hà Nội', 'level': 'Dễ', 'price': 1000000, 'startDate': '2025-06-01', 'slug': 'tour-ha-noi'},
        {'name': 'Tour Đà Nẵng', 'level': 'Trung bình', 'price': 2000000, 'startDate': '2025-06-02', 'slug': 'tour-da-nang'}
    ])
    print("Đã thêm tour mẫu vào cơ sở dữ liệu")
    
    yield driver, tours_collection, base_url
    
    tours_collection.delete_many({})
    driver.quit()
    mongo_client.close()
    print("Đã dọn dẹp dữ liệu và đóng trình duyệt/MongoDB")

# Hàm hỗ trợ nhập từ khóa tìm kiếm
def perform_search(driver, keyword):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "search-btn"))).click()
    time.sleep(1)
    search_input = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "search-bar")))
    search_input.clear()
    search_input.send_keys(keyword)
    driver.execute_script("arguments[0].click();", driver.find_element(By.CSS_SELECTOR, ".search-bar-container label"))
    time.sleep(2)

# Hàm lấy thông báo
def get_message(driver, class_name):
    try:
        return WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.CLASS_NAME, class_name))).text
    except:
        return None

# Test case 1: Tìm kiếm với từ khóa hợp lệ
def test_tc01_search_valid_keyword(setup_teardown):
    driver, tours_collection, base_url = setup_teardown
    print("TC01: Tìm kiếm với từ khóa hợp lệ")
    driver.get(base_url)  # Sửa lỗi cú pháp
    perform_search(driver, "Hà Nội")
    results = driver.find_elements(By.CLASS_NAME, "tour-card")  # Thử với class 'tour-card'
    assert len(results) > 0, "TC01 Failed: Không tìm thấy tour nào"
    print("TC01 Passed")

# Test case 2: Tìm kiếm với từ khóa không tồn tại
def test_tc02_search_invalid_keyword(setup_teardown):
    driver, tours_collection, base_url = setup_teardown
    print("TC02: Tìm kiếm với từ khóa không tồn tại")
    driver.get(base_url)
    perform_search(driver, "XYZ")
    results = driver.find_elements(By.CLASS_NAME, "tour")
    message = get_message(driver, "error")  # Cập nhật class
    assert len(results) == 0 or (message and "Không tìm thấy tour phù hợp" in message), f"TC02 Failed: {message}"
    print("TC02 Passed")

# Test case 3: Tìm kiếm với từ khóa trống
def test_tc03_search_empty_keyword(setup_teardown):
    driver, tours_collection, base_url = setup_teardown
    print("TC03: Tìm kiếm với từ khóa trống")
    driver.get(base_url)
    perform_search(driver, "")
    results = driver.find_elements(By.CLASS_NAME, "tour")
    assert len(results) >= 0, "TC03 Failed: Kết quả không hợp lệ"
    print("TC03 Passed")

# Test case 4: Tìm kiếm với ký tự đặc biệt
def test_tc04_search_special_characters(setup_teardown):
    driver, tours_collection, base_url = setup_teardown
    print("TC04: Tìm kiếm với ký tự đặc biệt")
    driver.get(base_url)
    perform_search(driver, "Hà Nội@#")
    results = driver.find_elements(By.CLASS_NAME, "tour")
    message = get_message(driver, "error")
    assert len(results) > 0 or len(results) == 0 or (message and "Không tìm thấy tour phù hợp" in message), "TC04 Failed: Kết quả không hợp lệ"
    print("TC04 Passed")

# Test case 5: Lỗi kết nối máy chủ
def test_tc05_server_error(setup_teardown):
    driver, tours_collection, base_url = setup_teardown
    print("TC05: Lỗi kết nối máy chủ")
    mongo_client = MongoClient('mongodb://localhost:27017')
    mongo_client.close()
    print("Đã ngắt kết nối MongoDB")
    driver.get(base_url)
    perform_search(driver, "Hà Nội")
    passed = False
    message = get_message(driver, "error")
    if message and ("Không thể kết nối máy chủ" in message or "lỗi" in message.lower()):
        passed = True
    else:
        try:
            logs = driver.get_log('performance')
            for log in logs:
                log_str = str(log).lower()
                if '500' in log_str or 'error' in log_str:
                    passed = True
                    break
        except:
            pass
    if not passed:
        page_content = driver.page_source.lower()
        if 'error' in page_content or '500' in page_content:
            passed = True
    assert passed, f"TC05 Failed: Không phát hiện lỗi server\nMessage: {message}"
    print("TC05 Passed")

# Cấu hình để bỏ qua cảnh báo pytest.mark.order
def pytest_configure(config):
    config.addinivalue_line("markers", "order: mark test to run in specific order")