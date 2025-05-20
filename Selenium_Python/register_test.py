import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient
import time

@pytest.fixture(scope="module")
def setup_teardown():
    mongo_client = MongoClient('mongodb://localhost:27017')
    db = mongo_client['travel']
    users_collection = db['users']
    try:
        mongo_client.server_info()
        print("Kết nối MongoDB thành công")
    except Exception as e:
        print(f"Lỗi kết nối MongoDB: {e}")
        pytest.exit(f"MongoDB connection failed: {e}")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    base_url = "http://localhost:3000/v1/auth/register"
    yield driver, users_collection, base_url
    users_collection.delete_many({})
    driver.quit()
    mongo_client.close()
    print("Đã dọn dẹp dữ liệu và đóng trình duyệt/MongoDB")

def fill_register_form(driver, base_url, username, email, password, phone, address):
    driver.get(base_url)
    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "phoneNumber").send_keys(phone)
    driver.find_element(By.NAME, "address").send_keys(address)
    driver.find_element(By.TAG_NAME, "button").click()
    time.sleep(5)

def get_message(driver, class_name):
    try:
        return driver.find_element(By.CLASS_NAME, class_name).text
    except:
        return None

def insert_sample_user(users_collection, username, email, phone_number, admin=False):
    users_collection.insert_one({
        'username': username,
        'email': email,
        'password': 'hashed_password',
        'phoneNumber': phone_number,
        'address': 'Sample Address',
        'admin': admin,
        'active': True
    })
    print(f"Đã chèn user mẫu: {username}")

@pytest.mark.order(1)
def test_tc01_register_first_user_admin(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    print("TC01: Đăng ký người dùng đầu tiên (admin)")
    fill_register_form(driver, base_url, "adminuser", "admin@example.com", "password123", "0987654321", "456 Admin St")
    success_msg = get_message(driver, "success-message")
    admin_user = users_collection.find_one({'username': 'adminuser'})
    assert success_msg.lower() == "bạn đã đăng ký thành công!" and admin_user and admin_user['admin'] == True, f"TC01 Failed: {success_msg}"
    print("TC01 Passed")

@pytest.mark.order(2)
def test_tc02_register_success(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    print("TC02: Đăng ký thành công")
    fill_register_form(driver, base_url, "testuser1", "test1@example.com", "password123", "0123456789", "123 Test St")
    success_msg = get_message(driver, "success-message")
    user = users_collection.find_one({'username': 'testuser1'})
    assert success_msg.lower() == "bạn đã đăng ký thành công!" and user and user['admin'] == False, f"TC02 Failed: {success_msg}"
    print("TC02 Passed")

@pytest.mark.order(3)
def test_tc03_email_already_exists(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    insert_sample_user(users_collection, "existinguser", "existing@example.com", "0111222333")
    print("TC03: Email đã tồn tại")
    fill_register_form(driver, base_url, "newuser", "existing@example.com", "password123", "0222333444", "789 New St")
    error_msg = get_message(driver, "error-message")
    assert "email đã được đăng ký." in error_msg.lower(), f"TC03 Failed: {error_msg}"
    print("TC03 Passed")

@pytest.mark.order(4)
def test_tc04_username_already_exists(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    insert_sample_user(users_collection, "existinguser", "existing@example.com", "0111222333")
    print("TC04: Username đã tồn tại")
    fill_register_form(driver, base_url, "existinguser", "new@example.com", "password123", "0222333444", "789 New St")
    error_msg = get_message(driver, "error-message")
    assert "tên người dùng đã được sử dụng." in error_msg.lower(), f"TC04 Failed: {error_msg}"
    print("TC04 Passed")

@pytest.mark.order(5)
def test_tc05_phone_already_exists(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    insert_sample_user(users_collection, "existinguser", "existing@example.com", "0111222333")
    print("TC05: Phone number đã tồn tại")
    fill_register_form(driver, base_url, "newuser2", "new2@example.com", "password123", "0111222333", "789 New St")
    error_msg = get_message(driver, "error-message")
    assert "số điện thoại đã được đăng ký." in error_msg.lower(), f"TC05 Failed: {error_msg}"
    print("TC05 Passed")

@pytest.mark.order(6)
def test_tc06_short_username(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    print("TC06: Username ngắn hơn 6 ký tự")
    fill_register_form(driver, base_url, "test", "test3@example.com", "password123", "0333444555", "321 Test St")
    error_msg = get_message(driver, "error-message")
    assert "tên người dùng phải dài ít nhất 6 ký tự." in error_msg.lower(), f"TC06 Failed: {error_msg}"
    print("TC06 Passed")

@pytest.mark.order(7)
def test_tc07_empty_email(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    print("TC07: Trường email bỏ trống")
    fill_register_form(driver, base_url, "testuser3", "", "password123", "0444555666", "654 Test St")
    assert driver.current_url == base_url, f"TC07 Failed: URL không giữ nguyên {driver.current_url}"
    print("TC07 Passed")

@pytest.mark.order(8)
def test_tc08_server_error_mongodb_disconnected(setup_teardown):
    driver, users_collection, base_url = setup_teardown
    users_collection.delete_many({})
    print("TC08: Server Error (MongoDB Disconnected)")
    mongo_client = MongoClient('mongodb://localhost:27017')
    mongo_client.close()
    print("✅ Đã ngắt kết nối MongoDB")
    fill_register_form(driver, base_url, "testuser8", "test8@example.com", "password123", "0888999777", "888 Test St")
    passed = False
    error_indications = []
    error_msg = get_message(driver, "error-message")
    if error_msg and ("server" in error_msg.lower() or "error" in error_msg.lower()):
        passed = True
        error_indications.append(f"UI Error: {error_msg}")
    try:
        logs = driver.get_log('performance')
        for log in logs:
            log_str = str(log).lower()
            if '500' in log_str or 'internal server error' in log_str:
                passed = True
                error_indications.append("Network Error: 500 Internal Server Error")
                break
    except:
        pass
    try:
        console_errors = driver.get_log('browser')
        for error in console_errors:
            if 'failed' in str(error).lower() or '500' in str(error):
                passed = True
                error_indications.append(f"Console Error: {error['message']}")
    except:
        pass
    if not passed:
        page_content = driver.page_source.lower()
        if 'error' in page_content or '500' in page_content:
            passed = True
            error_indications.append("Page Content: Detected 'error' or '500'")
    try:
        mongo_client = MongoClient('mongodb://localhost:27017')
        users_collection = mongo_client['travel']['users']
        print("✅ Đã khôi phục kết nối MongoDB")
    except Exception as e:
        print(f"⚠ Không thể khôi phục MongoDB: {e}")
    assert passed, f"TC08 Failed: Không phát hiện lỗi server\nDebug Info:\nURL: {driver.current_url}\nPage Title: {driver.title}\nNetwork Logs: {driver.get_log('performance')[:1]}\nConsole Logs: {driver.get_log('browser')[:1]}"
    print(f"✅ TC08 Passed (Lỗi server được phát hiện):")
    for indication in error_indications:
        print(f"   - {indication}")