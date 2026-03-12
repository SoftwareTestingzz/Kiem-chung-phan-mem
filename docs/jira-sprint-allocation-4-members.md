# 🏃 Phân chia 6 Sprint Scrum cho 4 thành viên - Jira Planning

## 👥 Thông tin Team

| Thành viên | Role | Workload | Skill Level |
|------------|------|----------|-------------|
| **Bạn** | QA Lead / Reviewer | 20% | Senior |
| **Thành viên A** | QA Engineer | 30% | Mid-Senior |
| **Thành viên B** | QA Engineer | 25% | Mid-Level |
| **Thành viên C** | QA Engineer | 25% | Mid-Level |

**Tổng Story Points**: 240 points (40 points/sprint)

---

## 📊 Phân bổ Story Points theo thành viên

### Mỗi Sprint (2 tuần)

| Thành viên | Story Points/Sprint | % Workload | Nhiệm vụ chính |
|------------|---------------------|------------|----------------|
| **Bạn** | 8 points | 20% | Review, Setup, Documentation, Complex scenarios |
| **Thành viên A** | 12 points | 30% | Integration tests, API testing, Complex features |
| **Thành viên B** | 10 points | 25% | Unit tests, Service layer testing |
| **Thành viên C** | 10 points | 25% | Unit tests, Helper functions testing |

---

## 🎯 Sprint 1: Setup & Authentication (2 tuần)
**Sprint Goal**: Thiết lập môi trường testing và hoàn thành authentication tests

**Total Story Points**: 40

### 📋 Backlog Items

#### Epic: Test Environment Setup
**Assignee: Bạn** (QA Lead)

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-101: Setup Jest & Testing Framework | 3 | Highest | Cài đặt Jest, Supertest, MongoDB Memory Server |
| KIEM-102: Create Test Database Setup | 2 | Highest | Setup test DB, seed data, cleanup utilities |
| KIEM-103: Setup CI/CD Pipeline | 3 | High | GitHub Actions workflow cho automated testing |

**Subtotal: 8 points**

---

#### Epic: Helper Functions Testing
**Assignee: Thành viên C**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-104: Test generateOtp() | 1 | High | Unit test cho OTP generation |
| KIEM-105: Test pagination helper | 2 | High | Test pagination logic với edge cases |
| KIEM-106: Test search helper | 2 | High | Test search functionality |
| KIEM-107: Test filterStatus helper | 1 | Medium | Test status filtering |
| KIEM-108: Test createTree helper | 2 | Medium | Test nested category tree builder |
| KIEM-109: Write helper test documentation | 2 | Low | Document test cases và usage |

**Subtotal: 10 points**

---

#### Epic: Authentication Services Testing
**Assignee: Thành viên B**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-110: Test Register Service | 3 | Highest | Test registration flow, OTP, validation |
| KIEM-111: Test Login Service | 2 | Highest | Test login success/fail scenarios |
| KIEM-112: Test Password Service | 3 | High | Test forgot password, OTP verify, reset |
| KIEM-113: Test Email Validation | 2 | Medium | Test email format, duplicate check |

**Subtotal: 10 points**

---

#### Epic: Authentication API Integration Tests
**Assignee: Thành viên A**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-114: Test POST /register endpoint | 2 | Highest | Test registration step 1 |
| KIEM-115: Test POST /register/verify-otp | 2 | Highest | Test OTP verification |
| KIEM-116: Test POST /register/create-account | 2 | Highest | Test account creation |
| KIEM-117: Test POST /login endpoint | 2 | Highest | Test login API |
| KIEM-118: Test Password Reset APIs | 3 | High | Test forgot/verify/reset endpoints |
| KIEM-119: Test Session Management | 1 | Medium | Test cookie, session expiry |

**Subtotal: 12 points**

---

### 📈 Sprint 1 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 40 |
| Total Tasks | 19 |
| Duration | 2 weeks |
| Expected Test Cases | 25-30 |
| Target Coverage | Helper (100%), Auth (80%+) |

---

## 🎯 Sprint 2: Product & Category Testing (2 tuần)
**Sprint Goal**: Hoàn thành testing cho Product và Category modules

**Total Story Points**: 40

### 📋 Backlog Items

#### Epic: Product Services Testing
**Assignee: Thành viên B**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-201: Test Product Create Service | 2 | Highest | Test tạo product với validation |
| KIEM-202: Test Product Update Service | 2 | High | Test update product, slug generation |
| KIEM-203: Test Product Delete Service | 1 | High | Test soft delete |
| KIEM-204: Test Product Status Change | 1 | Medium | Test change status logic |
| KIEM-205: Test Stock Validation | 2 | High | Test stock management |
| KIEM-206: Test Price Calculation | 2 | Medium | Test price với discount |

**Subtotal: 10 points**

---

#### Epic: Category Services Testing
**Assignee: Thành viên C**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-207: Test Category CRUD | 3 | Highest | Test create, update, delete category |
| KIEM-208: Test Nested Category | 3 | High | Test parent-child relationships |
| KIEM-209: Test Category Tree Builder | 2 | High | Test createTree với nested data |
| KIEM-210: Test Category Validation | 2 | Medium | Test duplicate names, invalid parent |

**Subtotal: 10 points**

---

#### Epic: Product API Integration Tests
**Assignee: Thành viên A**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-211: Test Admin Product CRUD APIs | 3 | Highest | Test GET, POST, PATCH, DELETE |
| KIEM-212: Test Product Status Change API | 2 | High | Test PATCH change-status endpoint |
| KIEM-213: Test Product History API | 2 | High | Test audit log endpoints |
| KIEM-214: Test Client Product APIs | 2 | High | Test product listing, detail, search |
| KIEM-215: Test Product Pagination & Filter | 2 | Medium | Test pagination, category filter |
| KIEM-216: Test Image Upload Mock | 1 | Medium | Mock Cloudinary upload |

**Subtotal: 12 points**

---

#### Epic: Documentation & Review
**Assignee: Bạn**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-217: Review Product Test Cases | 2 | High | Code review tất cả product tests |
| KIEM-218: Review Category Test Cases | 2 | High | Code review category tests |
| KIEM-219: Update Test Documentation | 2 | Medium | Document test patterns, best practices |
| KIEM-220: Setup Test Data Factories | 2 | Medium | Tạo factory functions cho test data |

**Subtotal: 8 points**

---

### 📈 Sprint 2 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 40 |
| Total Tasks | 20 |
| Duration | 2 weeks |
| Expected Test Cases | 35-40 |
| Target Coverage | Product (85%+), Category (80%+) |

---

## 🎯 Sprint 3: Cart & Checkout Testing (2 tuần)
**Sprint Goal**: Test shopping cart và checkout flow

**Total Story Points**: 40

### 📋 Backlog Items

#### Epic: Cart Services Testing
**Assignee: Thành viên B**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-301: Test Add to Cart Service | 2 | Highest | Test add product, quantity validation |
| KIEM-302: Test Update Cart Service | 2 | Highest | Test increase/decrease quantity |
| KIEM-303: Test Remove from Cart | 1 | High | Test remove product |
| KIEM-304: Test Cart Total Calculation | 2 | High | Test price calculation |
| KIEM-305: Test Stock Availability Check | 2 | High | Test out-of-stock scenarios |
| KIEM-306: Test Cart Edge Cases | 1 | Medium | Test deleted products, empty cart |

**Subtotal: 10 points**

---

#### Epic: Checkout Services Testing
**Assignee: Thành viên C**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-307: Test Order Creation Service | 3 | Highest | Test create order từ cart |
| KIEM-308: Test Shipping Info Validation | 2 | High | Test validate address, phone |
| KIEM-309: Test Stock Reduction | 2 | High | Test reduce stock sau order |
| KIEM-310: Test Cart Clear After Order | 1 | High | Test clear cart logic |
| KIEM-311: Test Insufficient Stock Scenario | 2 | High | Test order khi không đủ hàng |

**Subtotal: 10 points**

---

#### Epic: Cart & Checkout API Tests
**Assignee: Thành viên A**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-312: Test Cart APIs | 3 | Highest | Test add, update, delete, view cart |
| KIEM-313: Test Checkout API | 3 | Highest | Test POST /checkout endpoint |
| KIEM-314: Test Full Checkout Flow | 3 | Highest | Integration test: login → cart → checkout |
| KIEM-315: Test Concurrent Checkout | 2 | High | Test race conditions |
| KIEM-316: Test Authentication Required | 1 | Medium | Test middleware protection |

**Subtotal: 12 points**

---

#### Epic: E2E Cart Flow Setup
**Assignee: Bạn**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-317: Setup Puppeteer/Playwright | 3 | High | Install và config E2E framework |
| KIEM-318: Create E2E Test Helpers | 2 | High | Login helper, navigation helper |
| KIEM-319: Review Cart & Checkout Tests | 2 | High | Code review toàn bộ sprint 3 |
| KIEM-320: Write E2E Test Documentation | 1 | Medium | Document E2E test setup |

**Subtotal: 8 points**

---

### 📈 Sprint 3 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 40 |
| Total Tasks | 20 |
| Duration | 2 weeks |
| Expected Test Cases | 30-35 |
| Target Coverage | Cart (85%+), Checkout (90%+) |

---

## 🎯 Sprint 4: Order Management & Admin Features (2 tuần)
**Sprint Goal**: Test order management và admin dashboard

**Total Story Points**: 40

### 📋 Backlog Items

#### Epic: Order Services Testing
**Assignee: Thành viên C**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-401: Test Get User Orders Service | 2 | Highest | Test get orders by userId |
| KIEM-402: Test Order Detail Service | 1 | High | Test get order by ID |
| KIEM-403: Test Order Status Update | 3 | Highest | Test status transitions |
| KIEM-404: Test Cancel Order Service | 2 | High | Test cancel và restore stock |
| KIEM-405: Test Order Filter & Search | 2 | Medium | Test filter by status, date |

**Subtotal: 10 points**

---

#### Epic: Dashboard & Statistics Testing
**Assignee: Thành viên B**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-406: Test Revenue by Day | 2 | High | Test daily revenue calculation |
| KIEM-407: Test Revenue by Month | 2 | High | Test monthly stats |
| KIEM-408: Test Revenue by Quarter | 2 | High | Test quarterly stats |
| KIEM-409: Test Revenue by Year | 1 | Medium | Test yearly stats |
| KIEM-410: Test Export to Excel | 2 | Medium | Mock xlsx export |
| KIEM-411: Test Export to Word | 1 | Low | Mock docx export |

**Subtotal: 10 points**

---

#### Epic: Order & Admin API Tests
**Assignee: Thành viên A**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-412: Test Client Order APIs | 2 | Highest | Test GET /orders, /orders/:id |
| KIEM-413: Test Admin Order APIs | 3 | Highest | Test admin order management |
| KIEM-414: Test Order Status Update API | 2 | Highest | Test POST /admin/orders/:id/status |
| KIEM-415: Test Dashboard APIs | 2 | High | Test dashboard statistics endpoints |
| KIEM-416: Test Role-Based Access | 2 | High | Test permission middleware |
| KIEM-417: Test Admin Account APIs | 1 | Medium | Test account management |

**Subtotal: 12 points**

---

#### Epic: Role & Permission Testing
**Assignee: Bạn**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-418: Test Role Service | 2 | High | Test create role, assign permissions |
| KIEM-419: Test Permission Middleware | 2 | High | Test access control logic |
| KIEM-420: Review Order Tests | 2 | High | Code review sprint 4 |
| KIEM-421: Update Coverage Report | 2 | Medium | Generate coverage report, identify gaps |

**Subtotal: 8 points**

---

### 📈 Sprint 4 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 40 |
| Total Tasks | 21 |
| Duration | 2 weeks |
| Expected Test Cases | 30-35 |
| Target Coverage | Orders (85%+), Dashboard (75%+) |

---

## 🎯 Sprint 5: Blog, Profile & E2E Tests (2 tuần)
**Sprint Goal**: Test blog, profile và bắt đầu E2E testing

**Total Story Points**: 40

### 📋 Backlog Items

#### Epic: Blog Services Testing
**Assignee: Thành viên C**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-501: Test Blog CRUD Services | 3 | High | Test create, update, delete blog |
| KIEM-502: Test Blog Publish/Unpublish | 2 | High | Test status change |
| KIEM-503: Test Blog Search Service | 2 | Medium | Test search blogs |
| KIEM-504: Test Blog by Slug | 1 | Medium | Test get blog detail |
| KIEM-505: Test Blog Pagination | 2 | Medium | Test pagination logic |

**Subtotal: 10 points**

---

#### Epic: Profile & Account Testing
**Assignee: Thành viên B**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-506: Test Profile Update Service | 2 | High | Test update user info |
| KIEM-507: Test Change Password Service | 2 | High | Test password change validation |
| KIEM-508: Test Avatar Upload | 2 | High | Mock Cloudinary upload |
| KIEM-509: Test Admin Account Service | 2 | High | Test create, lock, unlock account |
| KIEM-510: Test Phone Validation | 2 | Medium | Test phone number format |

**Subtotal: 10 points**

---

#### Epic: E2E Critical Flows
**Assignee: Thành viên A**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-511: E2E Registration Flow | 3 | Highest | Test full registration với OTP |
| KIEM-512: E2E Login Flow | 2 | Highest | Test login UI flow |
| KIEM-513: E2E Shopping Flow | 4 | Highest | Browse → Cart → Checkout → Order |
| KIEM-514: E2E Password Reset Flow | 2 | High | Test forgot password UI |
| KIEM-515: E2E Profile Update Flow | 1 | Medium | Test profile management UI |

**Subtotal: 12 points**

---

#### Epic: Test Infrastructure & Review
**Assignee: Bạn**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-516: Setup E2E Test Environment | 2 | High | Config staging environment |
| KIEM-517: Create E2E Test Data Seeds | 2 | High | Seed data cho E2E tests |
| KIEM-518: Review Blog & Profile Tests | 2 | High | Code review sprint 5 |
| KIEM-519: Review E2E Test Cases | 2 | High | Review E2E scenarios |

**Subtotal: 8 points**

---

### 📈 Sprint 5 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 40 |
| Total Tasks | 19 |
| Duration | 2 weeks |
| Expected Test Cases | 25-30 |
| Target Coverage | Blog (80%+), Profile (85%+) |

---

## 🎯 Sprint 6: E2E, Performance & Final Release (2 tuần)
**Sprint Goal**: Hoàn thiện E2E, performance testing và release production

**Total Story Points**: 40

### 📋 Backlog Items

#### Epic: E2E Admin Panel
**Assignee: Thành viên A**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-601: E2E Admin Login | 2 | Highest | Test admin authentication UI |
| KIEM-602: E2E Product Management | 3 | Highest | Create → Edit → Delete product |
| KIEM-603: E2E Order Management | 3 | High | View → Update status → Export |
| KIEM-604: E2E Category Management | 2 | High | Test category CRUD UI |
| KIEM-605: E2E User Management | 2 | Medium | Test account management UI |

**Subtotal: 12 points**

---

#### Epic: Performance Testing
**Assignee: Thành viên B**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-606: Setup Artillery/k6 | 2 | High | Install performance testing tool |
| KIEM-607: Load Test Product APIs | 2 | High | Test 100 concurrent users |
| KIEM-608: Load Test Cart/Checkout | 3 | High | Test checkout under load |
| KIEM-609: API Response Time Test | 2 | High | Verify < 500ms response |
| KIEM-610: Generate Performance Report | 1 | Medium | Document performance metrics |

**Subtotal: 10 points**

---

#### Epic: Security Testing
**Assignee: Thành viên C**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-611: Test SQL Injection Prevention | 2 | Highest | Test malicious inputs |
| KIEM-612: Test XSS Prevention | 2 | Highest | Test script injection |
| KIEM-613: Test CSRF Protection | 2 | High | Test cross-site requests |
| KIEM-614: Test Authentication Bypass | 2 | High | Test unauthorized access |
| KIEM-615: Test Rate Limiting | 2 | Medium | Test API rate limits |

**Subtotal: 10 points**

---

#### Epic: Final Integration & Documentation
**Assignee: Bạn**

| Task | Story Points | Priority | Description |
|------|--------------|----------|-------------|
| KIEM-616: Run Full Regression Suite | 2 | Highest | Execute all 180+ tests |
| KIEM-617: Fix Failing Tests | 2 | Highest | Debug và fix issues |
| KIEM-618: Generate Final Coverage Report | 1 | High | Verify 85%+ coverage |
| KIEM-619: Write Test Suite Documentation | 2 | High | Complete README, guides |
| KIEM-620: Create Test Report Template | 1 | Medium | Template cho future reports |

**Subtotal: 8 points**

---

### 📈 Sprint 6 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 40 |
| Total Tasks | 20 |
| Duration | 2 weeks |
| Expected Test Cases | 20-25 E2E + Performance |
| Target Coverage | 85%+ overall |

---

## 📊 Tổng kết 6 Sprints

### Phân bổ công việc tổng thể

| Thành viên | Total Story Points | % Workload | Total Tasks |
|------------|-------------------|------------|-------------|
| **Bạn** | 48 points | 20% | ~24 tasks |
| **Thành viên A** | 72 points | 30% | ~36 tasks |
| **Thành viên B** | 60 points | 25% | ~30 tasks |
| **Thành viên C** | 60 points | 25% | ~30 tasks |
| **TOTAL** | **240 points** | **100%** | **~120 tasks** |

### Breakdown theo loại công việc

#### Bạn (QA Lead) - 48 points
- Setup & Infrastructure: 15 points
- Code Review: 18 points
- Documentation: 10 points
- Complex Testing: 5 points

#### Thành viên A (Senior QA) - 72 points
- Integration Tests: 40 points
- E2E Tests: 25 points
- API Testing: 7 points

#### Thành viên B (Mid QA) - 60 points
- Unit Tests (Services): 30 points
- Performance Testing: 10 points
- Dashboard Testing: 10 points
- Profile Testing: 10 points

#### Thành viên C (Mid QA) - 60 points
- Unit Tests (Helpers): 15 points
- Service Layer Tests: 25 points
- Security Testing: 10 points
- Blog Testing: 10 points

---

## 🎯 Sprint Ceremonies

### Daily Standup (15 phút)
- Mỗi người báo cáo: Yesterday / Today / Blockers
- Bạn (Scrum Master) facilitate

### Sprint Planning (2 giờ)
- Review backlog
- Estimate story points (Planning Poker)
- Commit to sprint goal
- Assign tasks

### Sprint Review (1 giờ)
- Demo completed tests
- Show coverage report
- Stakeholder feedback

### Sprint Retrospective (1 giờ)
- What went well?
- What can improve?
- Action items

---

## 📈 Definition of Done (DoD)

Một task được coi là DONE khi:

✅ Code được viết và pass tất cả tests  
✅ Test coverage đạt target (80%+)  
✅ Code được review bởi QA Lead (Bạn)  
✅ Documentation được update  
✅ CI/CD pipeline pass  
✅ No critical bugs  

---

## 🚀 Jira Board Setup

### Columns
1. **Backlog** - Chưa bắt đầu
2. **To Do** - Sprint backlog
3. **In Progress** - Đang làm
4. **Code Review** - Chờ review
5. **Testing** - Đang test
6. **Done** - Hoàn thành

### Labels
- `unit-test`
- `integration-test`
- `e2e-test`
- `performance`
- `security`
- `documentation`
- `setup`
- `review`

### Priority
- **Highest** (P0) - Blocker
- **High** (P1) - Critical
- **Medium** (P2) - Major
- **Low** (P3) - Minor

---

## 📝 Jira Ticket Template

```
Title: [KIEM-XXX] Test [Feature Name] [Service/API/E2E]

Description:
Test the [feature] functionality to ensure it works correctly.

Acceptance Criteria:
- [ ] Unit tests written for all functions
- [ ] Edge cases covered
- [ ] Test coverage > 80%
- [ ] All tests pass
- [ ] Code reviewed

Test Scenarios:
1. Happy path: ...
2. Error case: ...
3. Edge case: ...

Technical Notes:
- Mock external dependencies (Cloudinary, Email)
- Use test database
- Clean up after tests

Story Points: X
Assignee: [Name]
Sprint: Sprint X
Labels: unit-test, [module-name]
```

---

## 🎓 Best Practices cho Team

### 1. Communication
- Daily standup đúng giờ
- Update Jira tickets hàng ngày
- Báo blockers sớm
- Pair programming khi cần

### 2. Code Quality
- Follow naming conventions
- Write descriptive test names
- Keep tests independent
- Clean up test data

### 3. Time Management
- Break down large tasks
- Focus on high priority first
- Don't over-commit
- Ask for help early

### 4. Documentation
- Comment complex logic
- Update README
- Document test patterns
- Share knowledge

---

## 🏆 Success Metrics

### Sprint Level
- ✅ Velocity: 40 points/sprint
- ✅ Sprint completion: 90%+
- ✅ Bug escape rate: < 5%
- ✅ Code review turnaround: < 1 day

### Project Level (6 sprints)
- ✅ 180-200 test cases
- ✅ 85%+ code coverage
- ✅ 0 critical bugs
- ✅ All E2E flows tested
- ✅ Performance benchmarks met
- ✅ Security tests passed

---

## 🎉 Kết luận

Kế hoạch này đảm bảo:

✅ **Bạn** có workload nhẹ nhàng (20%) với vai trò Lead/Reviewer  
✅ **Thành viên A** handle các task phức tạp (Integration, E2E)  
✅ **Thành viên B & C** chia đều unit tests và service testing  
✅ Công việc được phân bổ công bằng và hợp lý  
✅ Mỗi sprint có mục tiêu rõ ràng  
✅ Team có thể track progress dễ dàng trên Jira  

**Lưu ý**: Story points có thể điều chỉnh sau Sprint Planning dựa trên team estimation.

---

**Good luck với project! 🚀**
