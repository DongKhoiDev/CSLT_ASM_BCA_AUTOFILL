// ==UserScript==
// @name         CSLT - DU LỊCH - AutoFill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động điền thông tin khách hàng từ dữ liệu CCCD
// @author       You
// @match        https://mobile.asmbca.vn/ui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asmbca.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Biến toàn cục để lưu dữ liệu người dùng
    let userData = null;

    // Xác định xem trang hiện tại có phải là trang sơ đồ phòng không
    function isRoomMapPage() {
        return window.location.href.includes('/so-do-phong') ||
               document.querySelector('app-residence') !== null;
    }

    // Tạo nút và khung nhập liệu
    function createUI() {
        // Nếu không phải trang sơ đồ phòng thì không tạo UI
        if (!isRoomMapPage()) {
            setTimeout(createUI, 1000);
            return;
        }

        // Tránh tạo nhiều container
        if (document.getElementById('autofill-container')) {
            return;
        }

        // Tạo container cho công cụ
        const container = document.createElement('div');
        container.id = 'autofill-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.background = '#f0f0f0';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        container.style.width = '250px';

        // Tạo tiêu đề
        const title = document.createElement('div');
        title.textContent = 'Tự động điền CCCD';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '8px';
        title.style.textAlign = 'center';
        title.style.color = '#2d78d7';

        // Tạo textarea để dán thông tin
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '100px';
        textarea.style.marginBottom = '10px';
        textarea.placeholder = 'Dán thông tin khách hàng vào đây...';

        // Tạo nút kiểm tra dữ liệu
        const checkButton = document.createElement('button');
        checkButton.textContent = 'Kiểm tra thông tin';
        checkButton.style.width = '100%';
        checkButton.style.padding = '5px';
        checkButton.style.background = '#4CAF50';
        checkButton.style.color = 'white';
        checkButton.style.border = 'none';
        checkButton.style.borderRadius = '3px';
        checkButton.style.cursor = 'pointer';
        checkButton.style.marginBottom = '5px';

        // Tạo nút debug
        const debugButton = document.createElement('button');
        debugButton.textContent = 'Debug Form';
        debugButton.style.width = '48%';
        debugButton.style.padding = '5px';
        debugButton.style.background = '#ff9800';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '3px';
        debugButton.style.cursor = 'pointer';
        debugButton.style.marginRight = '4%';
        debugButton.style.marginBottom = '5px';
        debugButton.style.fontSize = '12px';

        // Tạo nút điền form
        const fillButton = document.createElement('button');
        fillButton.textContent = 'Điền Form';
        fillButton.style.width = '48%';
        fillButton.style.padding = '5px';
        fillButton.style.background = '#2196F3';
        fillButton.style.color = 'white';
        fillButton.style.border = 'none';
        fillButton.style.borderRadius = '3px';
        fillButton.style.cursor = 'pointer';
        fillButton.style.marginBottom = '5px';
        fillButton.style.fontSize = '12px';

        // Tạo nút test ngày sinh
        const testDateButton = document.createElement('button');
        testDateButton.textContent = 'Test Ngày Sinh';
        testDateButton.style.width = '100%';
        testDateButton.style.padding = '5px';
        testDateButton.style.background = '#9C27B0';
        testDateButton.style.color = 'white';
        testDateButton.style.border = 'none';
        testDateButton.style.borderRadius = '3px';
        testDateButton.style.cursor = 'pointer';
        testDateButton.style.marginBottom = '5px';
        testDateButton.style.fontSize = '12px';

        // Tạo nút test địa chỉ
        const testAddressButton = document.createElement('button');
        testAddressButton.textContent = 'Test Địa Chỉ';
        testAddressButton.style.width = '100%';
        testAddressButton.style.padding = '5px';
        testAddressButton.style.background = '#E91E63';
        testAddressButton.style.color = 'white';
        testAddressButton.style.border = 'none';
        testAddressButton.style.borderRadius = '3px';
        testAddressButton.style.cursor = 'pointer';
        testAddressButton.style.marginBottom = '5px';
        testAddressButton.style.fontSize = '12px';

        // Tạo nút test lý do lưu trú và checkout
        const testExtrasButton = document.createElement('button');
        testExtrasButton.textContent = 'Test Lý do & Checkout';
        testExtrasButton.style.width = '100%';
        testExtrasButton.style.padding = '5px';
        testExtrasButton.style.background = '#9C27B0';
        testExtrasButton.style.color = 'white';
        testExtrasButton.style.border = 'none';
        testExtrasButton.style.borderRadius = '3px';
        testExtrasButton.style.cursor = 'pointer';
        testExtrasButton.style.marginBottom = '5px';
        testExtrasButton.style.fontSize = '12px';

        // Tạo nút test prepayment
        const testPrepaymentButton = document.createElement('button');
        testPrepaymentButton.textContent = 'Test Tiền Trả Trước';
        testPrepaymentButton.style.width = '100%';
        testPrepaymentButton.style.padding = '5px';
        testPrepaymentButton.style.background = '#FF5722';
        testPrepaymentButton.style.color = 'white';
        testPrepaymentButton.style.border = 'none';
        testPrepaymentButton.style.borderRadius = '3px';
        testPrepaymentButton.style.cursor = 'pointer';
        testPrepaymentButton.style.marginBottom = '5px';
        testPrepaymentButton.style.fontSize = '12px';

        // Tạo phần hiển thị trạng thái
        const statusDiv = document.createElement('div');
        statusDiv.id = 'autofill-status';
        statusDiv.style.marginTop = '5px';
        statusDiv.style.padding = '5px';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.display = 'none';
        statusDiv.style.borderRadius = '3px';
        statusDiv.style.textAlign = 'center';

        // Tạo nút thu gọn/mở rộng
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '▼';
        toggleButton.style.position = 'absolute';
        toggleButton.style.right = '5px';
        toggleButton.style.top = '5px';
        toggleButton.style.background = 'none';
        toggleButton.style.border = 'none';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.color = '#666';

        // Tạo div chứa nội dung có thể ẩn/hiện
        const contentDiv = document.createElement('div');
        contentDiv.id = 'autofill-content';

        // Thêm các thành phần vào container
        container.appendChild(title);
        container.appendChild(toggleButton);
        container.appendChild(contentDiv);

        contentDiv.appendChild(textarea);
        // Ẩn nút kiểm tra riêng vì đã gộp vào nút chính
        // contentDiv.appendChild(checkButton);

        // Chỉ giữ lại nút Điền Form (đã gộp chức năng kiểm tra)
        fillButton.textContent = 'Kiểm tra & Điền Form';
        fillButton.style.width = '100%';
        fillButton.style.margin = '5px 0';

        contentDiv.appendChild(fillButton);
        contentDiv.appendChild(statusDiv);

        // Thêm container vào trang
        document.body.appendChild(container);

        // Event listeners cho nút kiểm tra đã được gộp vào nút chính
        // checkButton.addEventListener('click', function() { ... });

        // Event listeners cho các nút debug/test đã được ẩn
        // debugButton.addEventListener('click', function() { ... });
        // testDateButton.addEventListener('click', function() { ... });
        // testAddressButton.addEventListener('click', async function() { ... });
        // testExtrasButton.addEventListener('click', async function() { ... });
        // testPrepaymentButton.addEventListener('click', function() { ... });
        // debugDropdownButton.addEventListener('click', function() { ... });

        // Xử lý sự kiện cho nút gộp "Kiểm tra & Điền Form"
        fillButton.addEventListener('click', async function() {
            const inputText = textarea.value.trim();

            if (!inputText) {
                showErrorMessage('Vui lòng nhập dữ liệu CCCD vào khung văn bản!');
                return;
            }

            try {
                // Bước 1: Kiểm tra và parse dữ liệu
                console.log('=== BƯỚC 1: KIỂM TRA THÔNG TIN ===');
                showSuccessMessage('Đang xử lý dữ liệu...');

                const parsedData = parseInputText(inputText);
                userData = parsedData;

                console.log('Dữ liệu đã được xử lý:', userData);
                showSuccessMessage('✅ Dữ liệu hợp lệ!');

                // Đợi 1 giây rồi bắt đầu điền form
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Bước 2: Điền form tự động
                console.log('=== BƯỚC 2: ĐIỀN FORM TỰ ĐỘNG ===');
                showSuccessMessage('Đang điền form...');

                await fillFormFields(userData);
                showSuccessMessage('🎉 Hoàn thành! Form đã được điền tự động.');

            } catch (error) {
                console.error('❌ Lỗi:', error);
                showErrorMessage('Có lỗi xảy ra: ' + error.message);
            }
        });

        // Xử lý sự kiện cho nút test ngày sinh
        testDateButton.addEventListener('click', function() {
            testDateOfBirthFill();
        });

        // Xử lý sự kiện cho nút test địa chỉ
        testAddressButton.addEventListener('click', async function() {
            await testAddressFill();
        });

        // Xử lý sự kiện cho nút test lý do lưu trú và checkout
        testExtrasButton.addEventListener('click', async function() {
            await testExtrasFields();
        });

        // Xử lý sự kiện cho nút test prepayment
        testPrepaymentButton.addEventListener('click', function() {
            testPrepaymentFeature();
        });

        // Xử lý sự kiện cho nút thu gọn/mở rộng
        let isCollapsed = false;
        toggleButton.addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                contentDiv.style.display = 'none';
                toggleButton.textContent = '▲';
                container.style.height = 'auto';
            } else {
                contentDiv.style.display = 'block';
                toggleButton.textContent = '▼';
            }
        });

        // Xử lý sự kiện cho nút debug dropdown
        debugDropdownButton.addEventListener('click', function() {
            debugDropdownContainers();
        });

        // Bắt sự kiện khi người dùng nhấn vào nút check-in
        setupCheckInButtonListener();
    }

    // Thiết lập bắt sự kiện cho các nút check-in
    function setupCheckInButtonListener() {
        document.addEventListener('click', function(e) {
            // Kiểm tra nếu người dùng click vào nút check-in
            if (e.target &&
                (e.target.closest('.ant-btn-primary.ant-btn-circle') ||
                 e.target.closest('a.more.success'))) {

                // Nếu có dữ liệu, chờ modal mở và điền form
                if (userData) {
                    waitForModal();
                }
            }
        }, true);
    }

    // Chờ modal xuất hiện và điền form
    function waitForModal() {
        console.log('Đang chờ modal xuất hiện...');
        let attempts = 0;
        const maxAttempts = 50; // 10 giây (50 * 200ms)

        const checkInterval = setInterval(() => {
            attempts++;

            // Thử nhiều selector khác nhau để tìm modal
            const modalSelectors = [
                'app-check-in-express form',
                'app-check-in-express',
                '.ant-modal-content form',
                '.ant-modal-content',
                'nz-modal form',
                'form[ng-reflect-name]'
            ];

            let foundModal = false;
            for (const selector of modalSelectors) {
                if (document.querySelector(selector)) {
                    console.log(`Modal tìm thấy với selector: ${selector}`);
                    foundModal = true;
                    break;
                }
            }

            if (foundModal || attempts >= maxAttempts) {
                clearInterval(checkInterval);

                if (foundModal) {
                    console.log('Bắt đầu điền form...');
                    setTimeout(() => {
                        fillFormFields(userData);
                        showSuccessMessage('Đã tự động điền thông tin!');
                    }, 800); // Tăng thời gian chờ
                } else {
                    console.log('Không tìm thấy modal sau 10 giây');
                    showErrorMessage('Không tìm thấy form để điền!');
                }
            }
        }, 200);
    }

    // Hiển thị thông báo thành công
    function showSuccessMessage(message) {
        const statusDiv = document.createElement('div');
        statusDiv.textContent = message;
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '50%';
        statusDiv.style.left = '50%';
        statusDiv.style.transform = 'translate(-50%, -50%)';
        statusDiv.style.background = 'rgba(0, 150, 0, 0.9)';
        statusDiv.style.color = 'white';
        statusDiv.style.padding = '15px 25px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.zIndex = '10000';
        statusDiv.style.fontSize = '14px';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(statusDiv);

        setTimeout(() => {
            statusDiv.remove();
        }, 3000);
    }

    // Hiển thị thông báo lỗi
    function showErrorMessage(message) {
        const statusDiv = document.createElement('div');
        statusDiv.textContent = message;
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '50%';
        statusDiv.style.left = '50%';
        statusDiv.style.transform = 'translate(-50%, -50%)';
        statusDiv.style.background = 'rgba(220, 53, 69, 0.9)';
        statusDiv.style.color = 'white';
        statusDiv.style.padding = '15px 25px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.zIndex = '10000';
        statusDiv.style.fontSize = '14px';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        document.body.appendChild(statusDiv);

        setTimeout(() => {
            statusDiv.remove();
        }, 4000);
    }

    // Phân tích văn bản đầu vào để trích xuất thông tin
    function parseInputText(text) {
        const data = {};
        const lines = text.split('\n');

        for (const line of lines) {
            if (line.includes('Số CCCD:')) {
                data.identityNo = line.replace('Số CCCD:', '').trim();
            } else if (line.includes('Họ và tên:')) {
                data.fullName = line.replace('Họ và tên:', '').trim();
            } else if (line.includes('Giới tính:')) {
                data.gender = line.replace('Giới tính:', '').trim();
            } else if (line.includes('Ngày sinh:')) {
                const dateStr = line.replace('Ngày sinh:', '').trim();
                // Giữ nguyên format DD/MM/YYYY cho việc hiển thị
                data.dateOfBirth = dateStr;

                // Tạo thêm format YYYY-MM-DD nếu cần
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    data.dateOfBirthISO = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            } else if (line.includes('Nơi thường trú:')) {
                const fullAddress = line.replace('Nơi thường trú:', '').trim();
                data.fullAddress = fullAddress;

                // Tách địa chỉ thành các cấp hành chính
                const addressParts = fullAddress.split(',').map(part => part.trim());

                if (addressParts.length >= 1) {
                    // Tỉnh (phần cuối cùng)
                    data.city = addressParts[addressParts.length - 1];
                }                if (addressParts.length >= 2) {
                    // Phường/Xã (kế cuối, do đã bỏ cấp huyện)
                    data.village = addressParts[addressParts.length - 2];
                }
                
                if (addressParts.length >= 3) {
                    // Địa chỉ chi tiết (các phần còn lại)
                    data.address = addressParts.slice(0, addressParts.length - 2).join(', ');
                } else {
                    // Nếu không đủ 3 phần, để trống địa chỉ chi tiết
                    data.address = '';
                }

                console.log('Địa chỉ đã tách:', {
                    fullAddress: data.fullAddress,
                    city: data.city,
                    village: data.village,
                    address: data.address
                });

            } else if (line.includes('Ngày cấp CCCD:')) {
                const dateStr = line.replace('Ngày cấp CCCD:', '').trim();
                // Giữ nguyên format DD/MM/YYYY cho việc hiển thị
                data.dateRange = dateStr;

                // Tạo thêm format YYYY-MM-DD nếu cần
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    data.dateRangeISO = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }
        }

        console.log('Dữ liệu đã parse:', data);
        return data;
    }

    // Thực hiện điền các trường trong form - Cập nhật cho cấu trúc địa chỉ mới
    // - Cấu trúc mới: Tỉnh/TP → Xã/Phường → Địa chỉ chi tiết (bỏ cấp huyện)
    // - Tối ưu tốc độ: giảm thời gian chờ và scroll nhanh hơn
    async function fillFormFields(data) {
        if (!data) {
            console.error('Không có dữ liệu để điền');
            return;
        }

        console.log('🚀 Bắt đầu điền form với dữ liệu:', data);

        try {
            // Đợi form render hoàn toàn
            await new Promise(resolve => setTimeout(resolve, 500));

            // Điền Họ và tên
            console.log('📝 Điền Họ và tên...');
            fillCustomInputField('fullName', data.fullName);
            await new Promise(resolve => setTimeout(resolve, 200));

            // Chọn Giới tính
            if (data.gender) {
                console.log('👤 Chọn Giới tính...');
                selectCustomDropdown('gender', data.gender);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Điền Ngày sinh
            console.log('📅 Điền Ngày sinh...');
            fillCustomDateField('dateOfBirth', data.dateOfBirth);
            await new Promise(resolve => setTimeout(resolve, 200));

            // Chọn Loại giấy tờ (CCCD)
            console.log('🆔 Chọn Loại giấy tờ...');
            selectCustomDropdown('identityType', 'CCCD');
            await new Promise(resolve => setTimeout(resolve, 200));

            // Điền Số CCCD
            console.log('🔢 Điền Số CCCD...');
            fillCustomInputField('identityNo', data.identityNo);
            await new Promise(resolve => setTimeout(resolve, 300));            // Chọn Tỉnh/Thành phố với scroll nâng cao
            if (data.city) {
                console.log('🏙️ Chọn Tỉnh/Thành phố...');
                const citySuccess = await selectCustomApiDropdown('city', data.city);
                
                if (citySuccess) {
                    // Chờ dropdown xã/phường load sau khi chọn tỉnh (do đã bỏ cấp huyện)
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Chọn Phường/Xã (trực tiếp sau khi chọn tỉnh)
                    if (data.village) {
                        console.log('🏡 Chọn Phường/Xã...');
                        await selectCustomApiDropdown('village', data.village);
                    }
                }
            }

            // Điền Địa chỉ chi tiết
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('📍 Điền Địa chỉ chi tiết...');
            fillCustomInputField('address', data.address);

            // Chọn lý do lưu trú
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('🎯 Chọn lý do lưu trú...');
            await selectReasonStay('Thăm viếng');

            // Điền thời gian trả phòng
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log('🕐 Điền thời gian trả phòng...');
            await fillCheckoutTime();

            console.log('✅ Hoàn thành điền form!');

            // Bắt đầu theo dõi tóm tắt hóa đơn để tự động điền tiền trả trước
            console.log('👀 Bắt đầu theo dõi tóm tắt hóa đơn...');
            watchForBillSummary();

        } catch (error) {
            console.error('❌ Lỗi khi điền form:', error);
        }
    }

    // Hàm điền input-text custom component
    function fillCustomInputField(formControlName, value) {
        if (!value) {
            console.warn(`Không có giá trị cho field: ${formControlName}`);
            return false;
        }

        console.log(`Đang điền input-text: ${formControlName} với giá trị: ${value}`);

        // Tìm custom component
        const customComponent = document.querySelector(`input-text[formcontrolname="${formControlName}"]`);
        if (customComponent) {
            // Tìm input bên trong component
            const input = customComponent.querySelector('input');
            if (input) {
                console.log(`Tìm thấy input trong ${formControlName}`);
                fillInputValue(input, value);
                return true;
            }
        }

        console.warn(`Không tìm thấy input-text: ${formControlName}`);
        return false;
    }

    // Hàm điền input-date custom component
    function fillCustomDateField(formControlName, value) {
        if (!value) {
            console.warn(`Không có giá trị cho date field: ${formControlName}`);
            return false;
        }

        console.log(`Đang điền input-date: ${formControlName} với giá trị: ${value}`);

        // Tìm custom component
        const customComponent = document.querySelector(`input-date[formcontrolname="${formControlName}"]`);
        if (customComponent) {
            console.log('Tìm thấy input-date component:', customComponent);

            // Tìm input chính với placeholder "__/__/____"
            let targetInput = customComponent.querySelector('input[placeholder="__/__/____"]');

            if (!targetInput) {
                // Thử tìm input đầu tiên trong nz-input-group
                targetInput = customComponent.querySelector('nz-input-group input[type="text"]');
            }

            if (!targetInput) {
                // Thử tìm bất kỳ input nào có class ant-input
                targetInput = customComponent.querySelector('input.ant-input');
            }

            if (targetInput) {
                console.log(`Tìm thấy target input trong ${formControlName}:`, targetInput);
                console.log(`Target input placeholder: "${targetInput.placeholder}"`);

                // Điền giá trị vào input chính
                fillInputValue(targetInput, value);

                // Thêm một số trigger khác cho date component
                setTimeout(() => {
                    // Trigger blur để component nhận biết thay đổi
                    targetInput.blur();
                    targetInput.focus();

                    // Dispatch thêm các event cho date picker
                    const dateChangeEvent = new Event('dateChange', { bubbles: true });
                    targetInput.dispatchEvent(dateChangeEvent);
                }, 200);

                return true;
            } else {
                console.warn(`Không tìm thấy target input trong ${formControlName}`);

                // Debug: liệt kê tất cả input trong component
                const allInputs = customComponent.querySelectorAll('input');
                console.log('Tất cả input trong component:', allInputs);
                allInputs.forEach((inp, idx) => {
                    console.log(`  Input ${idx + 1}:`, {
                        element: inp,
                        type: inp.type,
                        placeholder: inp.placeholder,
                        className: inp.className
                    });
                });
            }
        } else {
            console.warn(`Không tìm thấy input-date component: ${formControlName}`);
        }

        return false;
    }

    // Hàm chọn input-select custom component
    function selectCustomDropdown(formControlName, value) {
        console.log(`Đang chọn input-select: ${formControlName} với giá trị: ${value}`);

        // Tìm custom component
        const customComponent = document.querySelector(`input-select[formcontrolname="${formControlName}"]`);
        if (customComponent) {
            // Tìm nz-select bên trong component
            const select = customComponent.querySelector('nz-select');
            if (select) {
                console.log(`Tìm thấy nz-select trong ${formControlName}`);

                // Click để mở dropdown
                const selector = select.querySelector('.ant-select-selector');
                if (selector) {
                    selector.click();

                    // Chờ dropdown mở và chọn option
                    setTimeout(() => {
                        const options = document.querySelectorAll('.ant-select-item-option');
                        for (const option of options) {
                            const optionText = option.textContent || option.innerText || '';
                            console.log(`Kiểm tra option: "${optionText}" với giá trị cần tìm: "${value}"`);

                            if (
                                optionText.includes(value) ||
                                (value === 'Nam' && optionText.toLowerCase().includes('nam')) ||
                                (value === 'Nữ' && optionText.toLowerCase().includes('nữ')) ||
                                (value === 'CCCD' && optionText.includes('CCCD'))
                            ) {
                                console.log(`Chọn option: ${optionText}`);
                                option.click();
                                return true;
                            }
                        }
                        console.warn(`Không tìm thấy option cho: ${value} trong ${formControlName}`);
                    }, 400);
                }
                return true;
            }
        }

        console.warn(`Không tìm thấy input-select: ${formControlName}`);
        return false;
    }

    // Hàm chọn input-select-api custom component (cho tỉnh, huyện, phường/xã) - Phiên bản cải tiến
    async function selectCustomApiDropdown(formControlName, value) {
        console.log(`🎯 Chọn input-select-api: ${formControlName} với giá trị: ${value}`);

        // Tìm custom component
        const customComponent = document.querySelector(`input-select-api[formcontrolname="${formControlName}"]`);
        if (!customComponent) {
            console.warn(`❌ Không tìm thấy input-select-api: ${formControlName}`);
            return false;
        }

        // Tìm nz-select bên trong component
        const select = customComponent.querySelector('nz-select');
        if (!select) {
            console.warn(`❌ Không tìm thấy nz-select trong ${formControlName}`);
            return false;
        }

        console.log(`✅ Tìm thấy nz-select trong ${formControlName}`);

        // Click để mở dropdown
        const selector = select.querySelector('.ant-select-selector');
        if (!selector) {
            console.warn(`❌ Không tìm thấy selector trong ${formControlName}`);
            return false;
        }

        selector.click();
        console.log(`📂 Đã click mở dropdown ${formControlName}`);

        // Chờ dropdown mở và API load dữ liệu (tối ưu từ 600ms xuống 400ms)
        await new Promise(resolve => setTimeout(resolve, 400));

        // Sử dụng hàm scroll nâng cao để tìm option
        const success = await selectOptionWithScroll(formControlName, value);

        if (!success) {
            console.warn(`❌ Không thể chọn "${value}" trong ${formControlName}`);
            // Đóng dropdown nếu không thành công
            selector.click();
        }

        return success;
    }

    // Hàm helper để thử chọn option
    function trySelectOption(formControlName, value, selector) {
        const options = document.querySelectorAll('.ant-select-item-option');
        console.log(`Tìm thấy ${options.length} options cho ${formControlName}`);

        // In ra tất cả options để debug
        options.forEach((option, index) => {
            const optionText = option.textContent || option.innerText || '';
            console.log(`Option ${index + 1}: "${optionText}"`);
        });

        for (const option of options) {
            const optionText = option.textContent || option.innerText || '';
            console.log(`Kiểm tra option: "${optionText}" với giá trị cần tìm: "${value}"`);

            // So sánh linh hoạt - có thể match một phần
            if (optionText.includes(value) ||
                value.includes(optionText) ||
                optionText.toLowerCase().includes(value.toLowerCase()) ||
                value.toLowerCase().includes(optionText.toLowerCase()) ||
                // Thêm kiểm tra đặc biệt cho "An Giang"
                (value === 'An Giang' && optionText.includes('An Giang')) ||
                // Loại bỏ từ "Tỉnh" hoặc "Thành phố" khi so sánh
                optionText.replace(/^(Tỉnh|Thành phố)\s+/i, '').toLowerCase() === value.toLowerCase()) {
                console.log(`✓ Chọn option: ${optionText} cho ${formControlName}`);
                option.click();
                return true;
            }
        }

        console.warn(`❌ Không tìm thấy option phù hợp cho: ${value} trong ${formControlName}`);
        console.log(`Các options có sẵn:`, Array.from(options).map(opt => opt.textContent));

        // Đóng dropdown nếu không tìm thấy
        if (selector) {
            selector.click();
        }

        return false;
    }

    // Hàm để điền giá trị vào input và kích hoạt sự kiện thay đổi
    function fillInputValue(input, value) {
        if (!input) {
            console.warn('Input element không hợp lệ:', input);
            return;
        }

        if (!value) {
            console.warn('Giá trị không hợp lệ:', value);
            return;
        }

        console.log(`Điền giá trị "${value}" vào input:`, input);

        try {
            // Focus vào input trước
            input.focus();

            // Xóa giá trị cũ
            input.value = '';

            // Điền giá trị mới
            input.value = value;

            // Kích hoạt các sự kiện cần thiết cho Angular
            const events = [
                new Event('input', { bubbles: true, cancelable: true }),
                new Event('change', { bubbles: true, cancelable: true }),
                new Event('blur', { bubbles: true, cancelable: true }),
                new KeyboardEvent('keydown', { bubbles: true, cancelable: true }),
                new KeyboardEvent('keyup', { bubbles: true, cancelable: true })
            ];

            events.forEach(event => {
                try {
                    input.dispatchEvent(event);
                } catch (e) {
                    console.warn('Lỗi khi dispatch event:', e);
                }
            });

            // Thêm sự kiện đặc biệt cho Angular Material/Ant Design
            if (input.hasAttribute('ng-reflect-name') || input.closest('[formcontrolname]')) {
                // Trigger Angular change detection
                setTimeout(() => {
                    try {
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    } catch (e) {
                        console.warn('Lỗi khi dispatch delayed input event:', e);
                    }
                }, 100);
            }

            console.log(`Đã điền giá trị "${value}" thành công`);
        } catch (error) {
            console.error('Lỗi khi điền input:', error);
        }
    }

    // Chờ trang tải xong để bắt đầu
    function init() {
        // Bắt đầu thêm UI khi trang đã load
        window.addEventListener('load', function() {
            setTimeout(createUI, 1000);
        });

        // Nếu trang đã load, thêm UI ngay lập tức
        if (document.readyState === 'complete') {
            setTimeout(createUI, 1000);
        }

        // Theo dõi thay đổi URL để tạo lại UI khi cần
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(createUI, 1000);
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // Khởi tạo script
    init();

    // Hàm debug để kiểm tra cấu trúc form
    function debugFormStructure() {
        console.log('=== DEBUG FORM STRUCTURE ===');

        // Tìm tất cả các modal và form
        const modals = document.querySelectorAll('.ant-modal, nz-modal, app-check-in-express');
        console.log('Số modal tìm thấy:', modals.length);

        modals.forEach((modal, index) => {
            console.log(`Modal ${index + 1}:`, modal);
        });

        // Tìm tất cả các form
        const forms = document.querySelectorAll('form');
        console.log('Số form tìm thấy:', forms.length);

        forms.forEach((form, index) => {
            console.log(`Form ${index + 1}:`, form);

            // Tìm tất cả input trong form
            const inputs = form.querySelectorAll('input, select, textarea');
            console.log(`  Số input trong form ${index + 1}:`, inputs.length);

            inputs.forEach((input, inputIndex) => {
                console.log(`    Input ${inputIndex + 1}:`, {
                    element: input,
                    type: input.type,
                    name: input.name,
                    formControlName: input.getAttribute('formcontrolname'),
                    placeholder: input.placeholder,
                    id: input.id,
                    className: input.className
                });
            });
        });

        // Tìm tất cả element có formcontrolname
        const formControls = document.querySelectorAll('[formcontrolname]');
        console.log('Số form control tìm thấy:', formControls.length);

        formControls.forEach((control, index) => {
            console.log(`Form Control ${index + 1}:`, {
                element: control,
                formControlName: control.getAttribute('formcontrolname'),
                tagName: control.tagName,
                className: control.className
            });

            // Thêm thông tin chi tiết cho input-date
            if (control.tagName === 'INPUT-DATE') {
                console.log(`  === Chi tiết ${control.getAttribute('formcontrolname')} ===`);

                const allInputs = control.querySelectorAll('input');
                console.log(`  -> Số input tìm thấy: ${allInputs.length}`);

                allInputs.forEach((inp, idx) => {
                    console.log(`     Input ${idx + 1}:`, {
                        element: inp,
                        type: inp.type,
                        value: inp.value,
                        placeholder: inp.placeholder,
                        className: inp.className,
                        tabIndex: inp.tabIndex
                    });
                });

                // Tìm input với placeholder "__/__/____"
                const mainInput = control.querySelector('input[placeholder="__/__/____"]');
                if (mainInput) {
                    console.log(`  -> Input chính tìm thấy:`, mainInput);
                } else {
                    console.log(`  -> Không tìm thấy input chính với placeholder "__/__/____"`);
                }

                // Tìm nz-input-group
                const inputGroup = control.querySelector('nz-input-group');
                if (inputGroup) {
                    console.log(`  -> nz-input-group tìm thấy:`, inputGroup);
                }

                console.log(`  === Kết thúc chi tiết ===`);
            }

            // Thêm thông tin chi tiết cho input-select-api
            if (control.tagName === 'INPUT-SELECT-API') {
                console.log(`  === Chi tiết API dropdown ${control.getAttribute('formcontrolname')} ===`);

                const nzSelect = control.querySelector('nz-select');
                if (nzSelect) {
                    console.log(`  -> nz-select tìm thấy:`, nzSelect);

                    const selector = nzSelect.querySelector('.ant-select-selector');
                    if (selector) {
                        console.log(`  -> selector tìm thấy:`, selector);
                    }
                } else {
                    console.log(`  -> Không tìm thấy nz-select`);
                }

                console.log(`  === Kết thúc chi tiết API dropdown ===`);
            }
        });

        showSuccessMessage('Kiểm tra console để xem cấu trúc form!');
    }

    // Hàm debug dropdown containers
    function debugDropdownContainers() {
        console.log('🔍 DEBUG: Tất cả dropdown containers có sẵn:');

        const selectors = [
            '.ant-select-dropdown',
            '.ant-select-dropdown-menu',
            '.rc-virtual-list',
            '.rc-virtual-list-holder',
            '.cdk-virtual-scroll-viewport',
            '.cdk-overlay-pane',
            '.ant-select-dropdown .rc-virtual-list',
            '.ant-select-dropdown .ant-select-dropdown-menu'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`✅ ${selector}: ${elements.length} element(s)`);
                elements.forEach((el, i) => {
                    console.log(`  ${i + 1}. scrollHeight: ${el.scrollHeight}, clientHeight: ${el.clientHeight}, scrollTop: ${el.scrollTop}`);
                });
            } else {
                console.log(`❌ ${selector}: 0 elements`);
            }
        });
    }

    // Hàm test riêng cho ngày sinh
    function testDateOfBirthFill() {
        if (!userData || !userData.dateOfBirth) {
            console.warn('Không có dữ liệu ngày sinh để test');
            return;
        }

        console.log('=== TEST ĐIỀN NGÀY SINH ===');
        console.log('Giá trị cần điền:', userData.dateOfBirth);

        const component = document.querySelector('input-date[formcontrolname="dateOfBirth"]');
        if (!component) {
            console.error('Không tìm thấy component ngày sinh');
            return;
        }

        console.log('Component ngày sinh:', component);

        // Thử các cách khác nhau để điền
        const strategies = [
            () => {
                const input = component.querySelector('input[placeholder="__/__/____"]');
                if (input) {
                    console.log('Thử strategy 1: Input với placeholder __/__/____');
                    fillInputValue(input, userData.dateOfBirth);
                    return true;
                }
                return false;
            },
            () => {
                const input = component.querySelector('nz-input-group input[type="text"]:first-child');
                if (input) {
                    console.log('Thử strategy 2: Input đầu tiên trong nz-input-group');
                    fillInputValue(input, userData.dateOfBirth);
                    return true;
                }
                return false;
            },
            () => {
                const input = component.querySelector('input.ant-input[inputmode="numeric"]');
                if (input) {
                    console.log('Thử strategy 3: Input với inputmode numeric');
                    fillInputValue(input, userData.dateOfBirth);
                    return true;
                }
                return false;
            }
        ];

        for (let i = 0; i < strategies.length; i++) {
            try {
                if (strategies[i]()) {
                    console.log(`Strategy ${i + 1} thành công!`);
                    break;
                }
            } catch (error) {
                console.warn(`Strategy ${i + 1} lỗi:`, error);
            }
        }
    }

    // Hàm test riêng cho địa chỉ với scroll - Phiên bản cải tiến
    async function testAddressFill() {
        if (!userData) {
            console.warn('Không có dữ liệu để test');
            return;
        }

        console.log('=== TEST ĐIỀN ĐỊA CHỈ VỚI SCROLL NÂNG CAO ===');
        console.log('Dữ liệu địa chỉ:', {
            fullAddress: userData.fullAddress,
            city: userData.city,
            village: userData.village,
            address: userData.address
        });

        try {
            // Test Tỉnh/Thành phố với scroll
            if (userData.city) {
                console.log('🏙️ Đang test Tỉnh/Thành phố với scroll...');
                const citySuccess = await selectCustomApiDropdown('city', userData.city);                if (citySuccess) {
                    // Chờ API load dữ liệu xã/phường (do đã bỏ cấp huyện)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Test Phường/Xã (trực tiếp sau khi chọn tỉnh)
                    if (userData.village) {
                        console.log('🏡 Đang test Phường/Xã...');
                        await selectCustomApiDropdown('village', userData.village);
                    }
                }
            }

            // Test địa chỉ chi tiết
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (userData.address) {
                console.log('� Đang test Địa chỉ chi tiết...');
                fillCustomInputField('address', userData.address);
            }

            console.log('✅ Hoàn thành test địa chỉ!');

        } catch (error) {
            console.error('❌ Lỗi khi test địa chỉ:', error);
        }
    }

    // Hàm test riêng cho lý do lưu trú và checkout
    async function testExtrasFields() {
        console.log('=== TEST LÝ DO LƯU TRÚ VÀ CHECKOUT ===');

        try {
            // Test lý do lưu trú
            console.log('🎯 Đang test lý do lưu trú...');
            await selectReasonStay('Thăm viếng');

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test thời gian trả phòng
            console.log('🕐 Đang test thời gian trả phòng...');
            await fillCheckoutTime();

            console.log('✅ Hoàn thành test extras!');

        } catch (error) {
            console.error('❌ Lỗi khi test extras:', error);
        }
    }

    // Hàm test riêng cho tiền trả trước
    async function testPrepaymentFill() {
        console.log('=== TEST TIỀN TRẢ TRƯỚC ===');

        try {
            // Lấy giá phòng từ tóm tắt hóa đơn
            const roomPrice = getRoomPrice();
            if (roomPrice) {
                console.log(`💰 Giá phòng tìm thấy: ${roomPrice}`);

                // Điền số tiền trả trước
                const success = fillPrepayment(roomPrice);
                if (success) {
                    showSuccessMessage('Đã điền tiền trả trước thành công!');
                } else {
                    showErrorMessage('Không thể điền tiền trả trước');
                }
            } else {
                console.warn('⚠️ Không tìm thấy giá phòng để điền tiền trả trước');
            }
        } catch (error) {
            console.error('❌ Lỗi khi test tiền trả trước:', error);
        }
    }

    // Hàm tạo ngày tiếp theo theo định dạng dd/mm/yyyy
    function getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const day = String(tomorrow.getDate()).padStart(2, '0');
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const year = tomorrow.getFullYear();

        return `${day}/${month}/${year}`;
    }

    // Hàm chọn lý do lưu trú
    async function selectReasonStay(reason = 'Thăm viếng') {
        console.log(`🎯 Chọn lý do lưu trú: ${reason}`);

        const success = await selectCustomApiDropdown('reasonStayId', reason);
        if (!success) {
            // Thử với các từ khóa khác
            const alternativeReasons = ['Thăm', 'Du lịch', 'Nghỉ dưỡng', 'Công tác'];
            for (const altReason of alternativeReasons) {
                console.log(`🔄 Thử lý do khác: ${altReason}`);
                const altSuccess = await selectCustomApiDropdown('reasonStayId', altReason);
                if (altSuccess) break;
            }
        }
        return success;
    }

    // Hàm điền thời gian trả phòng
    async function fillCheckoutTime() {
        console.log('🕐 Điền thời gian trả phòng...');

        const tomorrowDate = getTomorrowDate();
        console.log(`📅 Ngày trả phòng: ${tomorrowDate}`);

        // Điền ngày trả phòng
        const dateSuccess = fillCustomDateField('checkOutTime', tomorrowDate);

        // Chọn giờ trả phòng (mặc định 8:00 AM)
        await new Promise(resolve => setTimeout(resolve, 300));

        const hourComponent = document.querySelector('input-select[formcontrolname="checkOutTimeHour"]');
        if (hourComponent) {
            console.log('🕐 Tìm thấy component giờ trả phòng');
            const select = hourComponent.querySelector('nz-select');
            if (select) {
                const selector = select.querySelector('.ant-select-selector');
                if (selector) {
                    console.log('🖱️ Click mở dropdown giờ');
                    selector.click();

                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Tìm option 12:00 PM hoặc tương tự
                    const options = document.querySelectorAll('.ant-select-item-option');
                    console.log(`🕐 Tìm thấy ${options.length} options giờ`);

                    let hourSelected = false;
                    const hourTargets = ['08:00 AM', '08:00', '08 AM', 'AM', '08'];

                    for (const target of hourTargets) {
                        if (hourSelected) break;

                        for (const option of options) {
                            const text = option.textContent?.trim() || '';
                            if (text.includes(target)) {
                                console.log(`✅ Chọn giờ trả phòng: ${text}`);
                                option.click();
                                hourSelected = true;
                                break;
                            }
                        }
                    }

                    if (!hourSelected && options.length > 0) {
                        // Chọn option đầu tiên nếu không tìm thấy
                        console.log(`⚠️ Chọn giờ mặc định: ${options[0].textContent}`);
                        options[0].click();
                    }
                }
            }
        } else {
            console.warn('❌ Không tìm thấy component giờ trả phòng');
        }

        return dateSuccess;
    }

    // Hàm tìm option trong dropdown với scroll nâng cao (tối ưu tốc độ)
    async function findOptionWithScroll(targetValue, maxScrolls = 12, scrollDelay = 200) {
        console.log(`🔍 Tìm option "${targetValue}" với scroll nâng cao...`);

        // Debug dropdown containers trước khi bắt đầu
        debugDropdownContainers();

        let found = null;
        let scrollCount = 0;
        let previousOptionCount = 0;
        let stableCount = 0; // Đếm số lần option count không đổi

        while (scrollCount < maxScrolls && !found && stableCount < 4) {
            // Tìm tất cả containers có thể chứa dropdown
            const containers = [
                document.querySelector('.ant-select-dropdown .rc-virtual-list'),
                document.querySelector('.ant-select-dropdown .ant-select-dropdown-menu'),
                document.querySelector('.ant-select-dropdown'),
                document.querySelector('.cdk-virtual-scroll-viewport'),
                document.querySelector('.cdk-overlay-pane')
            ].filter(Boolean);

            const container = containers[0] || document;

            // Tìm tất cả options
            const optionSelectors = [
                '.ant-select-item-option',
                '.ant-select-item',
                'nz-option-item',
                '.rc-virtual-list-holder-inner > div'
            ];

            let options = [];
            for (const selector of optionSelectors) {
                const found = container.querySelectorAll(selector);
                if (found.length > 0) {
                    options = Array.from(found);
                    break;
                }
            }

            console.log(`🔍 Lần ${scrollCount + 1}: Tìm thấy ${options.length} options trong container`);

            // Log một vài option để debug
            if (options.length > 0) {
                const firstOption = options[0]?.textContent?.trim() || '';
                const lastOption = options[options.length - 1]?.textContent?.trim() || '';
                console.log(`📋 Option đầu: "${firstOption}", cuối: "${lastOption}"`);
            }

            // Tìm option khớp
            for (const option of options) {
                const text = option.textContent?.trim() || '';
                if (compareFlexibly(text, targetValue)) {
                    console.log(`✅ Tìm thấy option: "${text}"`);
                    found = option;
                    break;
                }
            }

            if (found) break;

            // Kiểm tra xem có load thêm option không
            if (options.length === previousOptionCount) {
                stableCount++;
                console.log(`⚠️ Số option không đổi lần ${stableCount}/${4}`);
            } else {
                stableCount = 0;
                previousOptionCount = options.length;
            }

            // Thực hiện scroll với nhiều strategy
            const scrollStrategies = [
                () => {
                    // Strategy 1: Scroll từ từ
                    containers.forEach(c => {
                        c.scrollTop += c.clientHeight / 3;
                    });
                },
                () => {
                    // Strategy 2: Scroll mạnh xuống cuối
                    containers.forEach(c => {
                        c.scrollTop = c.scrollHeight;
                    });
                },
                () => {
                    // Strategy 3: Scroll về đầu rồi xuống giữa
                    containers.forEach(c => {
                        c.scrollTop = 0;
                        setTimeout(() => c.scrollTop = c.scrollHeight / 2, 100);
                    });
                }
            ];

            const strategy = scrollStrategies[scrollCount % 3];
            strategy();

            // Trigger nhiều loại events
            const events = ['scroll', 'mousewheel', 'DOMMouseScroll', 'wheel', 'touchmove'];
            containers.forEach(container => {
                events.forEach(eventType => {
                    container.dispatchEvent(new Event(eventType, {
                        bubbles: true,
                        cancelable: true
                    }));
                });
            });

            // Thử trigger resize để force render
            window.dispatchEvent(new Event('resize'));

            await new Promise(resolve => setTimeout(resolve, scrollDelay));
            scrollCount++;
        }

        if (!found) {
            console.log(`❌ Không tìm thấy "${targetValue}" sau ${scrollCount} lần scroll`);
        }

        return found;
    }

    // Hàm nâng cao để tìm và chọn option với scroll
    async function selectOptionWithScroll(formControlName, value) {
        console.log(`🔧 Đang tìm option cho ${formControlName} với scroll nâng cao...`);

        const option = await findOptionWithScroll(value);
        if (option) {
            console.log(`✅ Tìm thấy và chọn: ${option.textContent}`);
            option.click();

            // Đợi một chút để dropdown cập nhật
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } else {
            console.warn(`❌ Không tìm thấy "${value}" sau khi scroll`);

            // Log tất cả options có sẵn để debug
            const allOptions = document.querySelectorAll('.ant-select-item-option, .ant-select-item');
            console.log(`📋 Tất cả ${allOptions.length} options hiện có:`);
            Array.from(allOptions).slice(0, 10).forEach((opt, i) => {
                console.log(`  ${i + 1}. "${opt.textContent?.trim()}"`);
            });
            if (allOptions.length > 10) {
                console.log(`  ... và ${allOptions.length - 10} options khác`);
            }

            return false;
        }
    }

    // Hàm debug dropdown containers
    function debugDropdownContainers() {
        console.log('🔍 DEBUG: Tất cả dropdown containers có sẵn:');

        const selectors = [
            '.ant-select-dropdown',
            '.ant-select-dropdown-menu',
            '.rc-virtual-list',
            '.rc-virtual-list-holder',
            '.cdk-virtual-scroll-viewport',
            '.cdk-overlay-pane',
            '.ant-select-dropdown .rc-virtual-list',
            '.ant-select-dropdown .ant-select-dropdown-menu'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`✅ ${selector}: ${elements.length} element(s)`);
                elements.forEach((el, i) => {
                    console.log(`  ${i + 1}. scrollHeight: ${el.scrollHeight}, clientHeight: ${el.clientHeight}, scrollTop: ${el.scrollTop}`);
                });
            } else {
                console.log(`❌ ${selector}: 0 elements`);
            }
        });
    }

    // Hàm so sánh linh hoạt cho dropdown options
    function compareFlexibly(optionText, targetValue) {
        if (!optionText || !targetValue) return false;

        const option = optionText.trim();
        const target = targetValue.trim();

        // So sánh trực tiếp
        if (option === target) return true;

        // So sánh không phân biệt hoa thường
        if (option.toLowerCase() === target.toLowerCase()) return true;

        // Kiểm tra chứa substring
        if (option.toLowerCase().includes(target.toLowerCase()) ||
            target.toLowerCase().includes(option.toLowerCase())) return true;

        // Xử lý đặc biệt cho tỉnh/thành phố - bỏ tiền tố
        const cleanOption = option.replace(/^(Tỉnh|Thành phố)\s+/i, '');
        const cleanTarget = target.replace(/^(Tỉnh|Thành phố)\s+/i, '');

        if (cleanOption.toLowerCase() === cleanTarget.toLowerCase()) return true;

        // Kiểm tra đặc biệt cho một số case
        if (target === 'An Giang' && option.includes('An Giang')) return true;
        if (target === 'CCCD' && option.includes('CCCD')) return true;

        return false;
    }

    // Hàm lấy số tiền phòng từ input totalAmount
    function getRoomPrice() {
        console.log('💰 Đang tìm giá phòng từ input totalAmount...');

        // Tìm input giá phòng với formcontrolname="totalAmount"
        const totalAmountInput = document.querySelector('input-number[formcontrolname="totalAmount"] input');

        if (totalAmountInput && totalAmountInput.value) {
            const roomPrice = totalAmountInput.value.replace(/[,.]/g, '');
            console.log(`💰 Tìm thấy giá phòng từ totalAmount: ${totalAmountInput.value} (${roomPrice})`);
            return roomPrice;
        }

        // Fallback: Tìm trong label "Giá phòng"
        const priceLabels = document.querySelectorAll('label');
        for (const label of priceLabels) {
            if (label.textContent.includes('Giá phòng')) {
                const formControl = label.closest('app-form-control');
                if (formControl) {
                    const input = formControl.querySelector('input');
                    if (input && input.value) {
                        const roomPrice = input.value.replace(/[,.]/g, '');
                        console.log(`💰 Tìm thấy giá phòng từ label: ${input.value} (${roomPrice})`);
                        return roomPrice;
                    }
                }
            }
        }

        console.warn('⚠️ Không tìm thấy giá phòng từ input totalAmount');
        return null;
    }

    // Hàm điền số tiền trả trước
    function fillPrepayment(amount) {
        console.log(`💳 Điền số tiền trả trước: ${amount}`);

        // Tìm input số tiền trả trước
        const prepaymentInput = document.querySelector('input-number[formcontrolname="prepayment"] input');

        if (prepaymentInput) {
            console.log('✅ Tìm thấy input số tiền trả trước');

            // Điền giá trị
            prepaymentInput.value = amount;
            prepaymentInput.dispatchEvent(new Event('input', { bubbles: true }));
            prepaymentInput.dispatchEvent(new Event('change', { bubbles: true }));
            prepaymentInput.dispatchEvent(new Event('blur', { bubbles: true }));

            console.log(`💰 Đã điền số tiền trả trước: ${amount}`);
            return true;
        } else {
            console.warn('❌ Không tìm thấy input số tiền trả trước');
            return false;
        }
    }

    // Hàm theo dõi và tự động điền khi tóm tắt hóa đơn xuất hiện
    function watchForBillSummary() {
        console.log('👀 Bắt đầu theo dõi tóm tắt hóa đồn...');

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    // Kiểm tra xem có cả input totalAmount và prepayment không
                    const totalAmountInput = document.querySelector('input-number[formcontrolname="totalAmount"] input');
                    const prepaymentInput = document.querySelector('input-number[formcontrolname="prepayment"] input');

                    if (totalAmountInput && prepaymentInput && totalAmountInput.value) {
                        console.log('🧾 Phát hiện tóm tắt hóa đơn với giá phòng và trường trả trước!');

                        // Đợi một chút để đảm bảo các giá trị đã ổn định
                        setTimeout(() => {
                            const roomPrice = getRoomPrice();
                            if (roomPrice) {
                                fillPrepayment(roomPrice);
                            } else {
                                console.warn('⚠️ Không tìm thấy giá phòng để điền');
                            }
                        }, 1000);

                        // Dừng theo dõi sau khi điền xong
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        // Bắt đầu theo dõi thay đổi DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['value']
        });

        // Kiểm tra ngay lập tức nếu form đã có sẵn
        setTimeout(() => {
            const totalAmountInput = document.querySelector('input-number[formcontrolname="totalAmount"] input');
            const prepaymentInput = document.querySelector('input-number[formcontrolname="prepayment"] input');

            if (totalAmountInput && prepaymentInput && totalAmountInput.value) {
                console.log('🧾 Tóm tắt hóa đơn đã có sẵn!');
                const roomPrice = getRoomPrice();
                if (roomPrice) {
                    fillPrepayment(roomPrice);
                }
                observer.disconnect();
            }
        }, 500);
    }

    // Bắt đầu theo dõi tóm tắt hóa đơn ngay khi script được khởi chạy
    setTimeout(watchForBillSummary, 3000);

    // Hàm test tính năng tiền trả trước
    function testPrepaymentFeature() {
        console.log('=== TEST TÍNH NĂNG TIỀN TRẢ TRƯỚC ===');

        // Kiểm tra xem có input prepayment không
        const prepaymentInput = document.querySelector('input-number[formcontrolname="prepayment"] input');
        if (prepaymentInput) {
            console.log('✅ Tìm thấy input tiền trả trước');

            // Thử lấy giá phòng
            const roomPrice = getRoomPrice();
            if (roomPrice) {
                console.log(`💰 Tìm thấy giá phòng: ${roomPrice}`);
                fillPrepayment(roomPrice);
            } else {
                console.warn('⚠️ Không tìm thấy giá phòng, thử điền số tiền mẫu');
                fillPrepayment('500000'); // Số tiền mẫu để test
            }
        } else {
            console.warn('❌ Không tìm thấy input tiền trả trước. Có thể chưa đến bước tóm tắt hóa đơn.');
            console.log('💡 Hãy điền form trước để đến bước tóm tắt hóa đơn.');

            // Bắt đầu theo dõi để tự động điền khi form xuất hiện
            watchForBillSummary();
        }
    }
})();