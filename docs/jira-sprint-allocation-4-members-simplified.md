# 🏃 Phân chia 6 Sprint cho 4 thành viên - SIMPLIFIED VERSION

## 👥 Thông tin Team

| Thành viên | Role | Workload | Skill Level |
|------------|------|----------|-------------|
| **Bạn** | QA Lead / Reviewer | 15% | Senior |
| **Thành viên A** | QA Engineer | 35% | Mid-Senior |
| **Thành viên B** | QA Engineer | 25% | Mid-Level |
| **Thành viên C** | QA Engineer | 25% | Mid-Level |

**Tổng Story Points**: 120 points (20 points/sprint) - GIẢM 50%

---

## 📊 Phân bổ Story Points theo thành viên

### Mỗi Sprint (2 tuần)

| Thành viên | Story Points/Sprint | % Workload | Nhiệm vụ chính |
|------------|---------------------|------------|----------------|
| **Bạn** | 3 points | 15% | Review, Documentation (RẤT NHẸ) |
| **Thành viên A** | 7 points | 35% | Integration tests, E2E tests |
| **Thành viên B** | 5 points | 25% | Integration tests |
| **Thành viên C** | 5 points | 25% | Integration tests, Helper tests |

---

## 🎯 Sprint 1: Setup & Authentication (2 tuần)
**Sprint Goal**: Setup môi trường và test auth core flows

**Total Story Points**: 20

### 📋 Backlog Items

#### Epic: Test Environment Setup
**Assignee: Bạn + Thành viên A**

| Task | Story Points | Assignee | Description |
|------|--------------|----------|-------------|
| KIEM-101: Setup Jest & Supertest | 2 | Bạn | Cài đặt framework, config cơ bản |
| KIEM-102: Create Test Helpers | 1 | Bạn | createTestUser(), loginTestUser() |

**Subtotal Bạn: 3 points**

---

#### Epic: Authentication Integration Tests
**Assignee: Thành viên A**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-103: Test Registration Flow | 3 | POST /register → verify-otp → create-account (1 test dài) |
| KIEM-104: Test Login API | 2 | Test login success + 1 error case |
| KIEM-105: Test Password Reset Flow | 2 | POST /forgot → verify-otp → reset (1 test dài) |

**Subtotal A: 7 points**

---

#### Epic: Helper Functions Testing
**Assignee: Thành viên C**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-106: Test generateOtp() | 1 | Test OTP có 6 digits |
| KIEM-107: Test pagination helper | 2 | Test 1-2 cases cơ bản |
| KIEM-108: Mock Email Service | 2 | Mock nodemailer để không gửi email thật |

**Subtotal C: 5 points**

---

#### Epic: Auth API Additional Tests
**Assignee: Thành viên B**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-109: Test Login Error Cases | 2 | Wrong password, account locked |
| KIEM-110: Test Register Validation | 2 | Invalid email, duplicate email |
| KIEM-111: Test Session Management | 1 | Test cookie, session expiry |

**Subtotal B: 5 points**

---

### 📈 Sprint 1 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 20 |
| Total Tasks | 11 |
| Expected Test Cases | 8-10 |
| Target Coverage | Auth (60%+) |

---

## 🎯 Sprint 2: Product Management (2 tuần)
**Sprint Goal**: Test Product CRUD

**Total Story Points**: 20

### 📋 Backlog Items

#### Epic: Admin Product CRUD
**Assignee: Thành viên A**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-201: Test Create Product API | 2 | POST /admin/products/create |
| KIEM-202: Test Update Product API | 2 | PATCH /admin/products/edit/:id |
| KIEM-203: Test Delete Product API | 2 | DELETE /admin/products/delete-product/:id |
| KIEM-204: Mock Cloudinary Upload | 1 | Mock image upload |

**Subtotal A: 7 points**

---

#### Epic: Client Product View
**Assignee: Thành viên B**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-205: Test Product List API | 2 | GET /products với pagination |
| KIEM-206: Test Product Detail API | 2 | GET /product/:slug |
| KIEM-207: Test Product Search | 1 | Test search by title |

**Subtotal B: 5 points**

---

#### Epic: Product Test Data
**Assignee: Thành viên C**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-208: Create Product Factory | 2 | Helper tạo test products |
| KIEM-209: Test Product Validation | 2 | Test required fields |
| KIEM-210: Test Slug Generation | 1 | Test slug từ title |

**Subtotal C: 5 points**

---

#### Epic: Review & Documentation
**Assignee: Bạn**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-211: Review Product Tests | 2 | Code review tất cả product tests |
| KIEM-212: Update Test Docs | 1 | Document test patterns |

**Subtotal Bạn: 3 points**

---

### 📈 Sprint 2 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 20 |
| Total Tasks | 12 |
| Expected Test Cases | 10-12 |
| Target Coverage | Product (60%+) |

---

## 🎯 Sprint 3: Cart Management (2 tuần)
**Sprint Goal**: Test Cart CRUD

**Total Story Points**: 20

### 📋 Backlog Items

#### Epic: Cart API Tests
**Assignee: Thành viên A**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-301: Test Add to Cart | 2 | POST /cart/add |
| KIEM-302: Test Update Cart Quantity | 2 | POST /cart/update (increase/decrease) |
| KIEM-303: Test Remove from Cart | 2 | POST /cart/delete |
| KIEM-304: Test View Cart | 1 | GET /cart |

**Subtotal A: 7 points**

---

#### Epic: Cart Business Logic
**Assignee: Thành viên B**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-305: Test Cart Total Calculation | 2 | Test tính tổng tiền |
| KIEM-306: Test Add Existing Product | 2 | Test tăng quantity khi add lại |
| KIEM-307: Test Empty Cart | 1 | Test cart rỗng |

**Subtotal B: 5 points**

---

#### Epic: Cart Test Helpers
**Assignee: Thành viên C**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-308: Create Cart Factory | 2 | Helper tạo test cart |
| KIEM-309: Test Cart Middleware | 2 | Test authentication required |
| KIEM-310: Test Cart Edge Cases | 1 | Test với product không tồn tại |

**Subtotal C: 5 points**

---

#### Epic: Review
**Assignee: Bạn**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-311: Review Cart Tests | 2 | Code review |
| KIEM-312: Update Coverage Report | 1 | Check coverage progress |

**Subtotal Bạn: 3 points**

---

### 📈 Sprint 3 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 20 |
| Total Tasks | 12 |
| Expected Test Cases | 8-10 |
| Target Coverage | Cart (60%+) |

---

## 🎯 Sprint 4: Checkout & Orders (2 tuần)
**Sprint Goal**: Test Checkout và Orders view

**Total Story Points**: 20

### 📋 Backlog Items

#### Epic: Checkout API
**Assignee: Thành viên A**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-401: Test Checkout API | 3 | POST /checkout - tạo order |
| KIEM-402: Test Checkout Validation | 2 | Test shipping info validation |
| KIEM-403: Test Cart Clear After Checkout | 2 | Verify cart cleared |

**Subtotal A: 7 points**

---

#### Epic: Client Orders View
**Assignee: Thành viên B**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-404: Test Get User Orders | 2 | GET /orders |
| KIEM-405: Test Get Order Detail | 2 | GET /orders/:id |
| KIEM-406: Test Order Filter | 1 | Filter by status |

**Subtotal B: 5 points**

---

#### Epic: Admin Orders Management
**Assignee: Thành viên C**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-407: Test Admin Get All Orders | 2 | GET /admin/orders |
| KIEM-408: Test Update Order Status | 2 | POST /admin/orders/:id/status |
| KIEM-409: Test Order Status Transitions | 1 | pending → confirmed → shipping |

**Subtotal C: 5 points**

---

#### Epic: Review
**Assignee: Bạn**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-410: Review Checkout & Orders | 2 | Code review |
| KIEM-411: Mid-project Report | 1 | Tạo progress report |

**Subtotal Bạn: 3 points**

---

### 📈 Sprint 4 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 20 |
| Total Tasks | 11 |
| Expected Test Cases | 8-10 |
| Target Coverage | Checkout + Orders (60%+) |

---

## 🎯 Sprint 5: Orders Management & E2E Setup (2 tuần)
**Sprint Goal**: Test order status flow và setup E2E

**Total Story Points**: 20

### 📋 Backlog Items

#### Epic: E2E Framework Setup
**Assignee: Thành viên A**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-501: Install Puppeteer | 1 | Setup E2E framework |
| KIEM-502: Create E2E Helpers | 2 | loginE2E(), waitForElement() |
| KIEM-503: E2E Registration Flow | 4 | Test full registration UI flow |

**Subtotal A: 7 points**

---

#### Epic: Order Status Flow
**Assignee: Thành viên B**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-504: Test Order Status Update | 3 | Test status transitions |
| KIEM-505: Test Order Completion | 2 | Test completed status |

**Subtotal B: 5 points**

---

#### Epic: Order Edge Cases
**Assignee: Thành viên C**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-506: Test Cancel Order | 2 | Test cancel flow |
| KIEM-507: Test Order Permissions | 2 | User chỉ xem order của mình |
| KIEM-508: Test Invalid Order ID | 1 | Test 404 error |

**Subtotal C: 5 points**

---

#### Epic: Review & E2E Docs
**Assignee: Bạn**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-509: Review Orders Tests | 1 | Code review |
| KIEM-510: Write E2E Documentation | 2 | Document E2E setup |

**Subtotal Bạn: 3 points**

---

### 📈 Sprint 5 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 20 |
| Total Tasks | 11 |
| Expected Test Cases | 6-8 |
| E2E Framework | Ready |

---

## 🎯 Sprint 6: E2E Critical Flows (2 tuần)
**Sprint Goal**: Test 2-3 E2E flows quan trọng nhất

**Total Story Points**: 20

### 📋 Backlog Items

#### Epic: E2E Shopping Flow
**Assignee: Thành viên A**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-601: E2E Complete Shopping Flow | 5 | Login → Browse → Cart → Checkout → Order |
| KIEM-602: E2E Login Flow | 2 | Test login UI |

**Subtotal A: 7 points**

---

#### Epic: E2E Admin Flow
**Assignee: Thành viên B**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-603: E2E Admin Login | 2 | Test admin login UI |
| KIEM-604: E2E Product Management | 3 | Create → View product |

**Subtotal B: 5 points**

---

#### Epic: Final Testing
**Assignee: Thành viên C**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-605: Run Full Test Suite | 2 | Execute all tests |
| KIEM-606: Fix Failing Tests | 2 | Debug và fix issues |
| KIEM-607: Generate Coverage Report | 1 | Final coverage report |

**Subtotal C: 5 points**

---

#### Epic: Final Documentation
**Assignee: Bạn**

| Task | Story Points | Description |
|------|--------------|-------------|
| KIEM-608: Write Test Suite README | 2 | How to run tests, structure |
| KIEM-609: Create Final Report | 1 | Test summary, coverage, recommendations |

**Subtotal Bạn: 3 points**

---

### 📈 Sprint 6 Summary

| Metric | Value |
|--------|-------|
| Total Story Points | 20 |
| Total Tasks | 9 |
| Expected Test Cases | 3-4 E2E |
| Final Coverage | 60%+ |

---

## 📊 Tổng kết 6 Sprints (SIMPLIFIED)

### Phân bổ công việc tổng thể

| Thành viên | Total Story Points | % Workload | Total Tasks |
|------------|-------------------|------------|-------------|
| **Bạn** | 18 points | 15% | ~12 tasks (NHẸ NHẤT) |
| **Thành viên A** | 42 points | 35% | ~21 tasks (NHIỀU NHẤT) |
| **Thành viên B** | 30 points | 25% | ~15 tasks |
| **Thành viên C** | 30 points | 25% | ~15 tasks |
| **TOTAL** | **120 points** | **100%** | **~63 tasks** |

### Breakdown theo loại công việc

#### Bạn (QA Lead) - 18 points (RẤT NHẸ)
- Setup: 3 points
- Code Review: 10 points (chỉ review, không code)
- Documentation: 5 points

#### Thành viên A (Senior QA) - 42 points
- Integration Tests: 25 points
- E2E Tests: 17 points

#### Thành viên B (Mid QA) - 30 points
- Integration Tests: 25 points
- E2E Tests: 5 points

#### Thành viên C (Mid QA) - 30 points
- Helper Tests: 10 points
- Integration Tests: 15 points
- Edge Cases: 5 points

---

## 🎯 Sprint Ceremonies (SIMPLIFIED)

### Daily Standup (10 phút)
- Mỗi người: Yesterday / Today / Blockers
- Bạn facilitate (nhẹ nhàng)

### Sprint Planning (1 giờ)
- Review backlog
- Assign tasks (đã plan sẵn rồi)
- Clarify questions

### Sprint Review (30 phút)
- Demo tests đã viết
- Show coverage report

### Sprint Retrospective (30 phút)
- What went well?
- What to improve?

---

## 📈 Definition of Done (DoD) - SIMPLIFIED

Một task được coi là DONE khi:

✅ Code được viết và tests pass  
✅ Code được review bởi QA Lead (Bạn)  
✅ KHÔNG CẦN: High coverage, documentation chi tiết  

---

## 🚀 Jira Board Setup

### Columns
1. **To Do** - Chưa bắt đầu
2. **In Progress** - Đang làm
3. **Review** - Chờ review
4. **Done** - Hoàn thành

### Labels
- `integration-test`
- `e2e-test`
- `helper-test`
- `setup`
- `review`
- `documentation`

### Priority
- **High** (P1) - Làm trước
- **Medium** (P2) - Làm sau
- **Low** (P3) - Optional

---

## 📝 Jira Ticket Template (SIMPLIFIED)

```
Title: [KIEM-XXX] Test [Feature Name]

Description:
Test [feature] functionality.

Acceptance Criteria:
- [ ] Tests written
- [ ] Tests pass
- [ ] Code reviewed

Story Points: X
Assignee: [Name]
Sprint: Sprint X
```

---

## 🎓 Best Practices (SIMPLIFIED)

### 1. Keep It Simple
- Chỉ test happy path + 1-2 error cases
- Không cần test tất cả edge cases
- Mock external services (Cloudinary, Email)

### 2. Communication
- Update Jira daily
- Ask for help early
- Pair programming nếu stuck

### 3. Time Management
- Đừng over-engineer
- Focus on core features
- Done is better than perfect

---

## 🏆 Success Metrics (REALISTIC)

### Sprint Level
- ✅ Complete 80% tasks (không cần 100%)
- ✅ Tests pass
- ✅ Code reviewed

### Project Level (6 sprints)
- ✅ 80-100 test cases
- ✅ 60%+ code coverage
- ✅ Core flows tested
- ✅ 2-3 E2E tests
- ✅ Simple documentation

---

## 🎉 So sánh: Full vs Simplified

| Metric | Full Plan | Simplified | Giảm |
|--------|-----------|------------|------|
| Test Cases | 180-200 | 80-100 | 50% |
| Story Points | 240 | 120 | 50% |
| Coverage Target | 85%+ | 60%+ | -25% |
| Tasks | ~120 | ~63 | 47% |
| Bạn Workload | 48 pts (20%) | 18 pts (15%) | 62% |
| E2E Tests | 20-25 | 3-4 | 80% |

---

## 💡 Tại sao Simplified tốt hơn?

### ✅ Ưu điểm
1. **Dễ hoàn thành**: 80-100 tests thay vì 180-200
2. **Ít áp lực**: 60% coverage thay vì 85%
3. **Focus core**: Chỉ test features quan trọng
4. **Bạn nhẹ hơn**: 15% workload thay vì 20%
5. **Realistic**: Team không bị overwhelm

### ⚠️ Trade-offs
1. Không test hết features (Blog, Profile, Category)
2. Không test edge cases nhiều
3. Không có Performance/Security testing
4. Coverage thấp hơn

### 🎯 Kết luận
**Simplified plan phù hợp cho team mới bắt đầu automation testing!**

---

## 📞 Tips cho Bạn (QA Lead)

### Làm sao để "nhẹ" mà vẫn "có ích"?

1. **Sprint 1-2**: Setup framework (quan trọng, làm 1 lần)
2. **Sprint 3-6**: Chỉ review code (30-60 phút/ngày)
3. **Cuối mỗi sprint**: Viết docs ngắn (1-2 giờ)

### Khi review code:
- Đọc test cases
- Check logic đúng không
- Suggest improvements
- Approve nhanh (đừng quá khắt khe)

### Khi viết docs:
- Copy-paste từ template
- Update numbers (coverage, test count)
- Keep it short

**Tổng thời gian/sprint**: ~10-15 giờ (thay vì 40 giờ) 🎉

---

**Good luck! Bạn sẽ làm được! 🚀**
