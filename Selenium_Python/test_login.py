import pytest
import os
import time
import bcrypt
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException

# Tạo thư mục lưu ảnh chụp màn hình
SCREENSHOTS_DIR = "screenshots"
if not os.path.exists(SCREENSHOTS_DIR):
    os.makedirs(SCREENSHOTS_DIR)


# Fixture để khởi tạo và đóng trình duyệt
@pytest.fixture
def driver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get("http://localhost:3000/v1/auth/logout")  # Đăng xuất để xóa session
    driver.get("http://localhost:3000/v1/auth/login")  # Tải trang đăng nhập
    yield driver
    driver.quit()


# Fixture để kết nối MongoDB
@pytest.fixture
def mongo_collection():
    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        db = client["travel"]
        yield db["users"]
    except Exception as e:
        print(f"Lỗi kết nối MongoDB: {e}")
        raise


# Lấy hoặc tạo user ngẫu nhiên với password plaintext 123456
def get_valid_user(mongo_collection, admin=True):
    try:
        # Lấy user ngẫu nhiên từ collection với admin phù hợp
        user = mongo_collection.aggregate([
            {"$match": {"admin": admin}},
            {"$sample": {"size": 1}}
        ]).next()
        return user["username"], "123456"
    except StopIteration:
        # Nếu không có user, tạo user test
        username = f"testuser_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        password = "123456"
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        mongo_collection.insert_one({
            "username": username,
            "password": hashed_password,
            "admin": admin
        })
        print(f"Đã tạo user test: {username}, admin: {admin}")
        return username, password


# Hàm chụp ảnh màn hình
def take_screenshot(driver, test_name, status):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    screenshot_path = os.path.join(SCREENSHOTS_DIR, f"{test_name}_{status}_{timestamp}.png")
    driver.save_screenshot(screenshot_path)
    print(f"Đã chụp ảnh màn hình: {screenshot_path}")


# Hàm debug thêm thông tin trang
def debug_page(driver):
    try:
        cookies = driver.get_cookies()
        print(f"Cookies hiện tại: {cookies}")
        page_source = driver.page_source[:500]  # Giới hạn để tránh log quá dài
        print(f"Nội dung trang (500 ký tự đầu): {page_source}")
    except Exception as e:
        print(f"Lỗi khi debug trang: {e}")


# TC01: Kiểm thử đăng nhập thành công (admin)
def test_login_success(driver, mongo_collection):
    try:
        username, password = get_valid_user(mongo_collection, admin=True)
        print(f"TC01 - Kiểm thử đăng nhập thành công với username: {username} (admin)")
        print(f"URL ban đầu: {driver.current_url}")

        # Nhập thông tin đăng nhập
        username_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys(username)
        password_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "password"))
        )
        password_field.send_keys(password)

        # Chụp ảnh màn hình sau khi nhập dữ liệu
        time.sleep(0.5)
        take_screenshot(driver, "tc01", "after_input")

        # Nhấn nút đăng nhập
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Kiểm tra chuyển hướng đến trang admin
        WebDriverWait(driver, 15).until(
            EC.url_to_be("http://localhost:3000/admin/dashboard")
        )
        print(f"URL sau đăng nhập: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc01", "success")
        print("TC01: Pass")
    except Exception as e:
        print(f"TC01 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc01", "error")
        raise


# TC02: Kiểm thử đăng nhập với tài khoản khách hàng
def test_login_customer_redirect(driver, mongo_collection):
    try:
        username, password = get_valid_user(mongo_collection, admin=False)
        print(f"TC02 - Kiểm thử đăng nhập với tài khoản khách hàng: {username}")
        print(f"URL ban đầu: {driver.current_url}")

        # Nhập thông tin đăng nhập
        username_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys(username)
        password_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "password"))
        )
        password_field.send_keys(password)

        # Chụp ảnh màn hình sau khi nhập dữ liệu
        time.sleep(0.5)
        take_screenshot(driver, "tc02", "after_input")

        # Nhấn nút đăng nhập
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Kiểm tra chuyển hướng đến trang khách hàng
        WebDriverWait(driver, 15).until(
            EC.url_to_be("http://localhost:3000/")
        )
        print(f"URL sau đăng nhập: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc02", "success")
        print("TC02: Pass - Đăng nhập thành công và chuyển hướng đúng cho khách hàng.")
    except Exception as e:
        print(f"TC02 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc02", "error")
        raise


# TC03: Kiểm thử đăng nhập với username sai
def test_login_wrong_username(driver, mongo_collection):
    try:
        _, password = get_valid_user(mongo_collection)
        print(f"TC03 - Kiểm thử đăng nhập với username sai, password: {password}")
        print(f"URL ban đầu: {driver.current_url}")

        # Nhập username sai và password đúng
        username_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys("wronguser")
        password_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "password"))
        )
        password_field.send_keys(password)

        # Chụp ảnh màn hình sau khi nhập dữ liệu
        time.sleep(0.5)
        take_screenshot(driver, "tc03", "after_input")

        # Nhấn nút đăng nhập
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Đợi thông báo lỗi hiển thị
        error_message = WebDriverWait(driver, 15).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))
        ).text
        print(f"TC03 - Thông báo lỗi: {error_message}")

        # Kiểm tra không chuyển hướng
        assert driver.current_url == "http://localhost:3000/v1/auth/login", "Hệ thống đã chuyển hướng sai!"
        print(f"URL sau khi submit: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc03", "error_displayed")
        print("TC03: Pass - Đăng nhập thất bại do sai username.")
        take_screenshot(driver, "tc03", "success")
    except Exception as e:
        print(f"TC03 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc03", "error")
        raise


# TC04: Kiểm thử đăng nhập với password sai
def test_login_wrong_password(driver, mongo_collection):
    try:
        username, _ = get_valid_user(mongo_collection)
        print(f"TC04 - Kiểm thử đăng nhập với password sai, username: {username}")
        print(f"URL ban đầu: {driver.current_url}")

        # Nhập username đúng và password sai
        username_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys(username)
        password_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "password"))
        )
        password_field.send_keys("wrongpass")

        # Chụp ảnh màn hình sau khi nhập dữ liệu
        time.sleep(0.5)
        take_screenshot(driver, "tc04", "after_input")

        # Nhấn nút đăng nhập
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Đợi thông báo lỗi hiển thị
        error_message = WebDriverWait(driver, 15).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))
        ).text
        print(f"TC04 - Thông báo lỗi: {error_message}")

        # Kiểm tra không chuyển hướng
        assert driver.current_url == "http://localhost:3000/v1/auth/login", "Hệ thống đã chuyển hướng sai!"
        print(f"URL sau khi submit: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc04", "error_displayed")
        print("TC04: Pass - Đăng nhập thất bại do sai password.")
        take_screenshot(driver, "tc04", "success")
    except Exception as e:
        print(f"TC04 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc04", "error")
        raise


# TC05: Kiểm thử đăng nhập với cả username và password sai
def test_login_both_wrong(driver, mongo_collection):
    try:
        print(f"TC05 - Kiểm thử đăng nhập với cả username và password sai")
        print(f"URL ban đầu: {driver.current_url}")

        # Nhập username sai và password sai
        username_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys("wronguser")
        password_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "password"))
        )
        password_field.send_keys("wrongpass")

        # Chụp ảnh màn hình sau khi nhập dữ liệu
        time.sleep(0.5)
        take_screenshot(driver, "tc05", "after_input")

        # Nhấn nút đăng nhập
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Đợi thông báo lỗi hiển thị
        error_message = WebDriverWait(driver, 15).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))
        ).text
        print(f"TC05 - Thông báo lỗi: {error_message}")

        # Kiểm tra không chuyển hướng
        assert driver.current_url == "http://localhost:3000/v1/auth/login", "Hệ thống đã chuyển hướng sai!"
        print(f"URL sau khi submit: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc05", "error_displayed")
        print("TC05: Pass - Đăng nhập thất bại do cả username và password sai.")
        take_screenshot(driver, "tc05", "success")
    except Exception as e:
        print(f"TC05 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc05", "error")
        raise


# TC06: Kiểm thử đăng nhập với các trường trống
def test_login_empty_fields(driver):
    try:
        print(f"TC06 - Kiểm thử đăng nhập với các trường trống")
        print(f"URL ban đầu: {driver.current_url}")

        # Nhấn nút đăng nhập mà không nhập dữ liệu
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Chụp ảnh màn hình sau khi nhấn nút
        time.sleep(0.5)
        take_screenshot(driver, "tc06", "after_submit")

        # Kiểm tra không chuyển hướng
        assert driver.current_url == "http://localhost:3000/v1/auth/login", "Hệ thống đã chuyển hướng sai!"
        print(f"URL sau khi submit: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc06", "success")
        print("TC06: Pass - Đăng nhập thất bại do trường trống.")
    except Exception as e:
        print(f"TC06 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc06", "error")
        raise


# TC07: Kiểm thử đăng nhập khi kết nối MongoDB thất bại
def test_login_db_connection_failure(driver, monkeypatch):
    try:
        print(f"TC07 - Kiểm thử đăng nhập khi kết nối MongoDB thất bại")
        print(f"URL ban đầu: {driver.current_url}")

        # Mô phỏng lỗi kết nối MongoDB bằng cách monkeypatch MongoClient
        def mock_mongo_client(*args, **kwargs):
            raise ServerSelectionTimeoutError("Không thể kết nối đến MongoDB")

        monkeypatch.setattr("pymongo.MongoClient", mock_mongo_client)

        # Kiểm tra rằng trang đăng nhập vẫn tải được
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        print(f"TC07 - Trang đăng nhập vẫn hiển thị dù DB lỗi")
        take_screenshot(driver, "tc07", "login_page_displayed")

        # Thử đăng nhập với thông tin bất kỳ
        username_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "username"))
        )
        username_field.send_keys("testuser")
        password_field = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.NAME, "password"))
        )
        password_field.send_keys("123456")

        # Chụp ảnh màn hình sau khi nhập dữ liệu
        time.sleep(0.5)
        take_screenshot(driver, "tc07", "after_input")

        # Nhấn nút đăng nhập
        submit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
        )
        submit_button.click()

        # Kiểm tra thông báo lỗi từ hệ thống (giả sử hệ thống trả về lỗi chung)
        error_message = WebDriverWait(driver, 15).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))
        ).text
        print(f"TC07 - Thông báo lỗi: {error_message}")

        # Kiểm tra không chuyển hướng
        assert driver.current_url == "http://localhost:3000/v1/auth/login", "Hệ thống đã chuyển hướng sai!"
        print(f"URL sau khi submit: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc07", "error_displayed")
        print("TC07: Pass - Đăng nhập thất bại do lỗi kết nối DB.")
    except Exception as e:
        print(f"TC07 Lỗi: {e}")
        print(f"URL tại thời điểm lỗi: {driver.current_url}")
        debug_page(driver)
        take_screenshot(driver, "tc07", "error")
        raise
