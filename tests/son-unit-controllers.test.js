const { validationResult } = require("express-validator");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("../services/client/login.service", () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("../services/client/register.service", () => ({
  registerStep1: jest.fn(),
  verifyOtpStep2: jest.fn(),
  createAccountStep3: jest.fn(),
  resendOtpRegister: jest.fn(),
}));

jest.mock("../services/client/password.service", () => ({
  forgotPasswordPost: jest.fn(),
  resendOTP: jest.fn(),
  verifyOtpPost: jest.fn(),
  resetPasswordPost: jest.fn(),
}));

jest.mock("../services/client/blog.service", () => ({
  getList: jest.fn(),
  getDetail: jest.fn(),
}));

jest.mock("../services/admin/auth.service", () => ({
  loginPost: jest.fn(),
  logout: jest.fn(),
}));

const loginService = require("../services/client/login.service");
const registerService = require("../services/client/register.service");
const passwordService = require("../services/client/password.service");
const blogService = require("../services/client/blog.service");
const adminAuthService = require("../services/admin/auth.service");
const sysConfig = require("../config/system");

const loginController = require("../controllers/client/login.controller");
const registerController = require("../controllers/client/register.controller");
const passwordController = require("../controllers/client/password.controller");
const blogController = require("../controllers/client/blog.controller");
const adminAuthController = require("../controllers/admin/auth.controller");
const adminLoginValidate = require("../validates/admin/login.validate");

function createMockReq(overrides = {}) {
  return {
    body: {},
    query: {},
    params: {},
    headers: {},
    cookies: {},
    session: {},
    flash: jest.fn(),
    get: jest.fn(),
    ...overrides,
  };
}

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
}

describe("Son Unit Tests - Client Login Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("AUTH-L renderLogin trả đúng view", () => {
    const req = createMockReq();
    const res = createMockRes();

    loginController.renderLogin(req, res);

    expect(res.render).toHaveBeenCalledWith("client/pages/auth/login", {
      pageTitle: "Đăng nhập",
      error: null,
      errors: [],
      oldData: {},
    });
  });

  test("AUTH-L-Validation lỗi -> trả 400 JSON", async () => {
    const req = createMockReq({
      headers: { accept: "application/json" },
      body: { email: "", password: "" },
    });
    const res = createMockRes();
    const errors = [{ msg: "Email không được để trống" }];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    await loginController.handleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, errors });
  });

  test("AUTH-L-01 đăng nhập thành công -> 200 JSON", async () => {
    const req = createMockReq({
      headers: { accept: "application/json" },
      body: { email: "user@example.com", password: "Password@1" },
    });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    loginService.login.mockResolvedValue();

    await loginController.handleLogin(req, res);

    expect(loginService.login).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Đăng nhập thành công!",
    });
  });

  test("AUTH-L-03 email không tồn tại -> 401 JSON", async () => {
    const req = createMockReq({
      headers: { accept: "application/json" },
      body: { email: "missing@example.com", password: "Password@1" },
    });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    loginService.login.mockRejectedValue(new Error("EMAIL_NOT_FOUND"));

    await loginController.handleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email không tồn tại!",
    });
  });

  test("AUTH-L-07 tài khoản bị khóa -> 403 JSON", async () => {
    const req = createMockReq({
      headers: { accept: "application/json" },
      body: { email: "blocked@example.com", password: "Password@1" },
    });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    loginService.login.mockRejectedValue(new Error("ACCOUNT_BLOCK"));

    await loginController.handleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Tài khoản đã bị khóa!",
    });
  });

  test("AUTH-L lỗi không xác định -> 500 JSON", async () => {
    const req = createMockReq({
      headers: { accept: "application/json" },
      body: { email: "user@example.com", password: "Password@1" },
    });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    loginService.login.mockRejectedValue(new Error("UNKNOWN_ERROR"));

    await loginController.handleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Có lỗi xảy ra, vui lòng thử lại!",
    });
  });

  test("logout gọi service và trả success", () => {
    const req = createMockReq({ headers: { accept: "application/json" } });
    const res = createMockRes();

    loginController.logout(req, res);

    expect(loginService.logout).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Đăng xuất thành công!",
    });
  });
});

describe("Son Unit Tests - Client Register Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("renderRegister trả đúng view", () => {
    const req = createMockReq();
    const res = createMockRes();

    registerController.renderRegister(req, res);

    expect(res.render).toHaveBeenCalledWith("client/pages/auth/register", {
      pageTitle: "Đăng ký tài khoản",
      error: null,
      errors: [],
      oldData: {},
    });
  });

  test("AUTH-R validate lỗi với Accept JSON -> success false", async () => {
    const req = createMockReq({
      headers: { accept: "application/json" },
      body: { fullName: "", email: "bad", password: "123" },
    });
    const res = createMockRes();
    const errors = [{ msg: "Email không đúng định dạng" }];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    await registerController.handleRegister(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: false, errors });
  });

  test("AUTH-R validate lỗi với HTML -> render lại form", async () => {
    const req = createMockReq({
      headers: { accept: "text/html" },
      body: { fullName: "", email: "bad", password: "123" },
    });
    const res = createMockRes();
    const errors = [{ msg: "Email không đúng định dạng" }];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    await registerController.handleRegister(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.render).toHaveBeenCalledWith("client/pages/auth/register", {
      pageTitle: "Đăng ký tài khoản",
      error: null,
      errors,
      oldData: req.body,
    });
  });

  test("AUTH-R-02 đăng ký hợp lệ -> gửi OTP thành công", async () => {
    const req = createMockReq({
      body: {
        fullName: "Test User",
        email: "test@example.com",
        password: "Password@1",
        confirmPassword: "Password@1",
      },
    });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    registerService.registerStep1.mockResolvedValue();

    await registerController.handleRegister(req, res);

    expect(registerService.registerStep1).toHaveBeenCalledWith(req);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP đã được gửi tới email của bạn",
    });
  });

  test("AUTH-R email tồn tại -> trả message đúng", async () => {
    const req = createMockReq({ body: { email: "exist@example.com" } });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    registerService.registerStep1.mockRejectedValue(new Error("EMAIL_EXISTS"));

    await registerController.handleRegister(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email đã tồn tại!",
    });
  });

  test("verifyOtp thành công", async () => {
    const req = createMockReq({ body: { otp: "123456" } });
    const res = createMockRes();

    registerService.verifyOtpStep2.mockResolvedValue();

    await registerController.verifyOtp(req, res);

    expect(registerService.verifyOtpStep2).toHaveBeenCalledWith(req);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP xác thực thành công",
    });
  });

  test("createAccount lỗi -> trả message service", async () => {
    const req = createMockReq();
    const res = createMockRes();

    registerService.createAccountStep3.mockRejectedValue(
      new Error("OTP_INVALID"),
    );

    await registerController.createAccount(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "OTP_INVALID",
    });
  });

  test("resendOtp thành công", async () => {
    const req = createMockReq();
    const res = createMockRes();

    registerService.resendOtpRegister.mockResolvedValue();

    await registerController.resendOtp(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP mới đã được gửi tới email của bạn",
    });
  });
});

describe("Son Unit Tests - Client Password Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("forgotPassword render đúng view", async () => {
    const req = createMockReq();
    const res = createMockRes();

    await passwordController.forgotPassword(req, res);

    expect(res.render).toHaveBeenCalledWith(
      "client/pages/auth/forgot-password",
      {
        pageTitle: "Lấy lại mật khẩu",
      },
    );
  });

  test("forgotPasswordPost thành công -> lưu resetPasswordEmail vào session", async () => {
    const req = createMockReq({
      body: { email: "client@example.com" },
      session: {},
    });
    const res = createMockRes();

    passwordService.forgotPasswordPost.mockResolvedValue();

    await passwordController.forgotPasswordPost(req, res);

    expect(passwordService.forgotPasswordPost).toHaveBeenCalledWith(req);
    expect(req.session.resetPasswordEmail).toBe("client@example.com");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Mã OTP đã được gửi vào email của bạn",
    });
  });

  test("resendOTP lỗi -> trả success false", async () => {
    const req = createMockReq();
    const res = createMockRes();

    passwordService.resendOTP.mockRejectedValue(new Error("USER_NOT_FOUND"));

    await passwordController.resendOTP(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "USER_NOT_FOUND",
    });
  });

  test("verityOtp render có email query", async () => {
    const req = createMockReq({ query: { email: "client@example.com" } });
    const res = createMockRes();

    await passwordController.verityOtp(req, res);

    expect(res.render).toHaveBeenCalledWith("client/pages/auth/verify-otp", {
      pageTitle: "Xác nhận OTP",
      email: "client@example.com",
    });
  });

  test("verityOtpPost thành công", async () => {
    const req = createMockReq({ body: { otp: "123456" } });
    const res = createMockRes();

    passwordService.verifyOtpPost.mockResolvedValue();

    await passwordController.verityOtpPost(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP đã được xác thực",
    });
  });

  test("resetPassword render đúng view", async () => {
    const req = createMockReq();
    const res = createMockRes();

    await passwordController.resetPassword(req, res);

    expect(res.render).toHaveBeenCalledWith(
      "client/pages/auth/reset-password",
      {
        pageTitle: "Đặt lại mật khẩu",
      },
    );
  });

  test("AUTH-FP-01 validation lỗi -> trả message đầu tiên", async () => {
    const req = createMockReq();
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Mật khẩu phải có ít nhất 6 ký tự" }],
    });

    await passwordController.resetPasswordPost(req, res);

    expect(passwordService.resetPasswordPost).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    });
  });

  test("AUTH-FP-02 reset mật khẩu thành công", async () => {
    const req = createMockReq({
      body: { password: "Password@1", confirmPassword: "Password@1" },
    });
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    passwordService.resetPasswordPost.mockResolvedValue();

    await passwordController.resetPasswordPost(req, res);

    expect(passwordService.resetPasswordPost).toHaveBeenCalledWith(req);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Đặt lại mật khẩu thành công!",
    });
  });

  test("AUTH-FP-03 confirmPassword sai -> trả lỗi từ service", async () => {
    const req = createMockReq();
    const res = createMockRes();

    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    passwordService.resetPasswordPost.mockRejectedValue(
      new Error("Mật khẩu xác nhận không khớp"),
    );

    await passwordController.resetPasswordPost(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Mật khẩu xác nhận không khớp",
    });
  });
});

describe("Son Unit Tests - Client Blog Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("BLOG-C-04 page=0 fallback về page 1", async () => {
    const req = createMockReq({ query: { page: "0" } });
    const res = createMockRes();

    blogService.getList.mockResolvedValue({
      data: [{ title: "Blog 1" }],
      page: 1,
      totalPages: 3,
      keyword: "",
    });

    await blogController.index(req, res);

    expect(blogService.getList).toHaveBeenCalledWith(req.query);
    expect(res.render).toHaveBeenCalledWith(
      "client/pages/blog/index",
      expect.objectContaining({
        pageTitle: "Tin tức & Blog",
        page: 1,
        totalPages: 3,
        hasPrev: false,
        hasNext: true,
        prevPage: 0,
        nextPage: 2,
      }),
    );
  });

  test("BLOG-C-06 page=1 trả trang đầu", async () => {
    const req = createMockReq({ query: { page: "1" } });
    const res = createMockRes();

    blogService.getList.mockResolvedValue({
      data: [{ title: "Blog 1" }],
      page: 1,
      totalPages: 2,
      keyword: "abc",
    });

    await blogController.index(req, res);

    expect(res.render).toHaveBeenCalledWith(
      "client/pages/blog/index",
      expect.objectContaining({
        hasPrev: false,
        hasNext: true,
        keyword: "abc",
      }),
    );
  });

  test("index lỗi service -> render fallback an toàn", async () => {
    const req = createMockReq({ query: { page: "-1" } });
    const res = createMockRes();
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    blogService.getList.mockRejectedValue(new Error("DB_DOWN"));

    await blogController.index(req, res);

    expect(res.render).toHaveBeenCalledWith("client/pages/blog/index", {
      pageTitle: "Tin tức & Blog",
      blogs: [],
      page: 1,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      keyword: "",
    });

    consoleErrorSpy.mockRestore();
  });

  test("BLOG-C detail slug không tồn tại -> 404", async () => {
    const req = createMockReq({ params: { slug: "missing-slug" } });
    const res = createMockRes();

    blogService.getDetail.mockResolvedValue({
      success: false,
      message: "Không tìm thấy bài viết",
    });

    await blogController.detail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.render).toHaveBeenCalledWith("client/pages/blog/detail", {
      pageTitle: "Không tìm thấy bài viết",
      blog: null,
    });
  });

  test("detail thành công -> render bài viết", async () => {
    const req = createMockReq({ params: { slug: "valid-slug" } });
    const res = createMockRes();

    blogService.getDetail.mockResolvedValue({
      success: true,
      data: { title: "Bài viết A" },
    });

    await blogController.detail(req, res);

    expect(res.render).toHaveBeenCalledWith("client/pages/blog/detail", {
      pageTitle: "Bài viết A",
      blog: { title: "Bài viết A" },
    });
  });

  test("detail ném lỗi -> 500", async () => {
    const req = createMockReq({ params: { slug: "x" } });
    const res = createMockRes();

    blogService.getDetail.mockRejectedValue(new Error("Unexpected"));

    await blogController.detail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.render).toHaveBeenCalledWith("client/pages/blog/detail", {
      pageTitle: "Lỗi hệ thống",
      blog: null,
    });
  });
});

describe("Son Unit Tests - Admin Auth Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("login có token -> redirect dashboard", async () => {
    const req = createMockReq({ cookies: { token: "jwt-token" } });
    const res = createMockRes();

    await adminAuthController.login(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      `${sysConfig.prefixAdmin}/dashboard`,
    );
  });

  test("login chưa có token -> render trang login", async () => {
    const req = createMockReq({ cookies: {} });
    const res = createMockRes();

    await adminAuthController.login(req, res);

    expect(res.render).toHaveBeenCalledWith("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  });

  test("login gặp lỗi -> flash + redirect login", async () => {
    const req = createMockReq({ cookies: {} });
    const res = createMockRes();
    res.render.mockImplementation(() => {
      throw new Error("Render failed");
    });

    await adminAuthController.login(req, res);

    expect(req.flash).toHaveBeenCalledWith(
      "error",
      "Có lỗi xảy ra, vui lòng thử lại!",
    );
    expect(res.redirect).toHaveBeenCalledWith(
      `${sysConfig.prefixAdmin}/auth/login`,
    );
  });

  test("ADAUTH loginPost thành công -> 200 JSON", async () => {
    const req = createMockReq({ headers: { accept: "application/json" } });
    const res = createMockRes();

    adminAuthService.loginPost.mockResolvedValue();

    await adminAuthController.loginPost(req, res);

    expect(adminAuthService.loginPost).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Đăng nhập thành công!",
    });
  });

  test("ADAUTH loginPost sai mật khẩu -> 401 JSON", async () => {
    const req = createMockReq({ headers: { accept: "application/json" } });
    const res = createMockRes();

    adminAuthService.loginPost.mockRejectedValue(new Error("PASSWORD_ERROR"));

    await adminAuthController.loginPost(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Mật khẩu không đúng!",
    });
  });

  test("ADAUTH loginPost lỗi không xác định -> 500 JSON", async () => {
    const req = createMockReq({ headers: { accept: "application/json" } });
    const res = createMockRes();

    adminAuthService.loginPost.mockRejectedValue(new Error("UNKNOWN_ERROR"));

    await adminAuthController.loginPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Có lỗi xảy ra, vui lòng thử lại!",
    });
  });

  test("logout gọi service và trả success", async () => {
    const req = createMockReq({ headers: { accept: "application/json" } });
    const res = createMockRes();

    adminAuthService.logout.mockResolvedValue();

    await adminAuthController.logout(req, res);

    expect(adminAuthService.logout).toHaveBeenCalledWith(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Đăng xuất thành công!",
    });
  });
});

describe("Son Unit Tests - Admin Login Validate Middleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("ADAUTH-01 email rỗng -> flash + redirect back", () => {
    const req = createMockReq({ body: { email: "", password: "Admin@123" } });
    const res = createMockRes();
    const next = jest.fn();

    adminLoginValidate.loginValidate(req, res, next);

    expect(req.flash).toHaveBeenCalledWith("error", "Vui lòng nhập email!");
    expect(res.redirect).toHaveBeenCalledWith("back");
    expect(next).not.toHaveBeenCalled();
  });

  test("ADAUTH-02 email khoảng trắng -> flash + redirect back", () => {
    const req = createMockReq({
      body: { email: "   ", password: "Admin@123" },
    });
    const res = createMockRes();
    const next = jest.fn();

    adminLoginValidate.loginValidate(req, res, next);

    expect(req.flash).toHaveBeenCalledWith("error", "Vui lòng nhập email!");
    expect(res.redirect).toHaveBeenCalledWith("back");
    expect(next).not.toHaveBeenCalled();
  });

  test("ADAUTH-03 email sai format -> flash + redirect back", () => {
    const req = createMockReq({ body: { email: "a@", password: "Admin@123" } });
    const res = createMockRes();
    const next = jest.fn();

    adminLoginValidate.loginValidate(req, res, next);

    expect(req.flash).toHaveBeenCalledWith("error", "Email không hợp lệ!");
    expect(res.redirect).toHaveBeenCalledWith("back");
    expect(next).not.toHaveBeenCalled();
  });

  test("ADAUTH-05 password rỗng -> flash + redirect back", () => {
    const req = createMockReq({
      body: { email: "admin@example.com", password: "" },
    });
    const res = createMockRes();
    const next = jest.fn();

    adminLoginValidate.loginValidate(req, res, next);

    expect(req.flash).toHaveBeenCalledWith("error", "Vui lòng nhập mật khẩu!");
    expect(res.redirect).toHaveBeenCalledWith("back");
    expect(next).not.toHaveBeenCalled();
  });

  test("dữ liệu hợp lệ -> gọi next", () => {
    const req = createMockReq({
      body: { email: "admin@example.com", password: "Admin@123" },
    });
    const res = createMockRes();
    const next = jest.fn();

    adminLoginValidate.loginValidate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.flash).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
