import pytest
import bcrypt
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Fixture khởi tạo trình duyệt
@pytest.fixture
def driver():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get("http://localhost:3000/v1/auth/logout")
    driver.get("http://localhost:3000/v1/auth/login")
    yield driver
    driver.quit()

# Fixture kết nối MongoDB
@pytest.fixture
def mongo_collection():
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    db = client["travel"]
    yield db["users"]

# Lấy hoặc tạo user ngẫu nhiên
def get_valid_user(mongo_collection, admin=True):
    try:
        user = mongo_collection.aggregate([
            {"$match": {"admin": admin}},
            {"$sample": {"size": 1}}
        ]).next()
        return user["username"], "123456"
    except StopIteration:
        username = f"testuser_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        hashed_password = bcrypt.hashpw("123456".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        mongo_collection.insert_one({"username": username, "password": hashed_password, "admin": admin})
        return username, "123456"

# Hàm nhập thông tin đăng nhập
def login(driver, username, password):
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "username"))).send_keys(username)
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "password"))).send_keys(password)
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()

# TC01: Đăng nhập thành công (admin)
def test_login_success(driver, mongo_collection):
    username, password = get_valid_user(mongo_collection, admin=True)
    login(driver, username, password)
    WebDriverWait(driver, 15).until(EC.url_to_be("http://localhost:3000/admin/dashboard"))
    assert driver.current_url == "http://localhost:3000/admin/dashboard"

# TC02: Đăng nhập tài khoản khách hàng
def test_login_customer_redirect(driver, mongo_collection):
    username, password = get_valid_user(mongo_collection, admin=False)
    login(driver, username, password)
    WebDriverWait(driver, 15).until(EC.url_to_be("http://localhost:3000/"))
    assert driver.current_url == "http://localhost:3000/"

# TC03: Đăng nhập với username sai
def test_login_wrong_username(driver, mongo_collection):
    _, password = get_valid_user(mongo_collection)
    login(driver, "wronguser", password)
    error_message = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))).text
    assert driver.current_url == "http://localhost:3000/v1/auth/login"
    assert error_message

# TC04: Đăng nhập với password sai
def test_login_wrong_password(driver, mongo_collection):
    username, _ = get_valid_user(mongo_collection)
    login(driver, username, "wrongpass")
    error_message = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))).text
    assert driver.current_url == "http://localhost:3000/v1/auth/login"
    assert error_message

# TC05: Đăng nhập với cả username và password sai
def test_login_both_wrong(driver, mongo_collection):
    login(driver, "wronguser", "wrongpass")
    error_message = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))).text
    assert driver.current_url == "http://localhost:3000/v1/auth/login"
    assert error_message

# TC06: Đăng nhập với trường trống
def test_login_empty_fields(driver):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))).click()
    assert driver.current_url == "http://localhost:3000/v1/auth/login"

# TC07: Đăng nhập khi kết nối MongoDB thất bại
def test_login_db_connection_failure(driver, monkeypatch):
    def mock_mongo_client(*args, **kwargs):
        raise ServerSelectionTimeoutError("Không thể kết nối đến MongoDB")
    monkeypatch.setattr("pymongo.MongoClient", mock_mongo_client)
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "username")))
    login(driver, "testuser", "123456")
    error_message = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.CLASS_NAME, "error-message"))).text
    assert driver.current_url == "http://localhost:3000/v1/auth/login"
    assert error_message