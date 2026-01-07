document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentPage = 'report-list';

    // --- Mock Data ---
    const mockData = {
        'inventory-query': [
            { id: 1, warehouse: '深圳仓库', pos: 'A001', salesman: '张三', isCustoms: '否', code: 'A001', fullName: '测试客户A', brief: '测试客户A', packageNum: '测试项目AAA', name: '测试商品AAAA', enName: 'TEST PD AA', product: '柜号123', qty: 100, unitWeight: 1.0, totalWeight: 100.0, totalVolume: 15.5, progress: '完成', days: 5, maxDays: 30, sku: 'SKU001' },
            { id: 2, warehouse: '广州仓库', pos: 'B002', salesman: '李四', isCustoms: '是', code: 'A002', fullName: '测试客户B', brief: '测试客户B', packageNum: '测试项目BBB', name: '测试商品BBBB', enName: 'TEST PD BB', product: '柜号456', qty: 200, unitWeight: 0.5, totalWeight: 100.0, totalVolume: 20.0, progress: '进行中', days: 12, maxDays: 30, sku: 'SKU002' },
            { id: 3, warehouse: '佛山仓库', pos: 'C003', salesman: '王五', isCustoms: '否', code: 'A003', fullName: '测试客户C', brief: '测试客户C', packageNum: '测试项目CCC', name: '测试商品CCCC', enName: 'TEST PD CC', product: '柜号789', qty: 150, unitWeight: 1.2, totalWeight: 180.0, totalVolume: 25.5, progress: '完成', days: 2, maxDays: 30, sku: 'SKU003' }
        ],
        'packing-task': [
            { id: 1, warehouse: '广州仓库A', customerId: 'CUST001', salesmanId: 'SALES001', name: '衣服XL', enName: 'Clothes XL', count: 100, totalWeight: 50.5, totalVolume: 1.2, shippingMark: 'MARK-001', packingMethod: '纸箱', sku: 'SKU-CL-01', subInboundNo: 'SUB-001', unitLength: 50, unitWidth: 40, unitHeight: 30, unitWeight: 0.5, unitVolume: 0.012, expressSubNo: 'EXP-SUB-01', fbxNo: 'FBX-101', pos: 'A-01-01', poNo: 'PO-2025-01', warehouseJobNo: 'WJ-001', inboundTime: '2025-12-24 10:00:00' },
            { id: 2, warehouse: '广州仓库A', customerId: 'CUST001', salesmanId: 'SALES001', name: '裤子XL', enName: 'Pants XL', count: 20, totalWeight: 10.2, totalVolume: 0.5, shippingMark: 'MARK-002', packingMethod: '木箱', sku: 'SKU-PT-02', subInboundNo: 'SUB-002', unitLength: 40, unitWidth: 30, unitHeight: 20, unitWeight: 0.5, unitVolume: 0.024, expressSubNo: 'EXP-SUB-02', fbxNo: 'FBX-102', pos: 'A-01-02', poNo: 'PO-2025-02', warehouseJobNo: 'WJ-002', inboundTime: '2025-12-24 11:00:00' },
            { id: 3, warehouse: '广州测试仓库', customerId: 'CUST002', salesmanId: 'SALES002', name: '测试商品', enName: 'Test Goods', count: 10, totalWeight: 300.0, totalVolume: 5.0, shippingMark: 'MARK-003', packingMethod: '托盘', sku: 'SKU-TST-03', subInboundNo: 'SUB-003', unitLength: 100, unitWidth: 100, unitHeight: 100, unitWeight: 30.0, unitVolume: 1.0, expressSubNo: 'EXP-SUB-03', fbxNo: 'FBX-103', pos: 'B-02-01', poNo: 'PO-2025-03', warehouseJobNo: 'WJ-003', inboundTime: '2025-12-22 09:30:00' },
            { id: 4, warehouse: '广州测试仓库', customerId: 'CUST002', salesmanId: 'SALES002', name: '测试商品2', enName: 'Test Goods 2', count: 12, totalWeight: 200.0, totalVolume: 3.5, shippingMark: 'MARK-004', packingMethod: '散货', sku: 'SKU-TST-04', subInboundNo: 'SUB-004', unitLength: 80, unitWidth: 80, unitHeight: 80, unitWeight: 16.6, unitVolume: 0.512, expressSubNo: 'EXP-SUB-04', fbxNo: 'FBX-104', pos: 'B-02-02', poNo: 'PO-2025-04', warehouseJobNo: 'WJ-004', inboundTime: '2025-12-22 14:20:00' }
        ],
        'report-list': [
            { id: 1, warehouse: '深圳仓库', pos: 'A001', salesman: '张三', code: 'A001', name: '测试客户A', brief: '测试客户A', product: '测试柜头AAA', pName: '测试商品AAAA', enName: 'TEST PD AA' },
            { id: 2, warehouse: '广州仓库', pos: 'B002', salesman: '李四', code: 'A002', name: '测试客户B', brief: '测试客户B', product: '测试柜头BBB', pName: '测试商品BBBB', enName: 'TEST PD BB' },
            { id: 3, warehouse: '佛山仓库', pos: 'C003', salesman: '王五', code: 'A003', name: '测试客户C', brief: '测试客户C', product: '测试柜头CCC', pName: '测试商品CCCC', enName: 'TEST PD CC' }
        ]
    };

    // --- Selectors ---
    const pageContent = document.getElementById('page-content');
    const navItems = document.querySelectorAll('.sidebar-nav li[data-page]');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    // --- Initialization ---
    init();

    function init() {
        renderPage(currentPage);
        setupEventListeners();
    }

    function setupEventListeners() {
        // Navigation Click
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const page = item.getAttribute('data-page');
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                renderPage(page);
            });
        });

        // Submenu Toggle
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const parent = toggle.parentElement;
                parent.classList.toggle('open');
                const arrow = toggle.querySelector('.arrow');
                if (parent.classList.contains('open')) {
                    arrow.classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    arrow.classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        });
    }

    function renderPage(pageId) {
        currentPage = pageId;
        let html = '';

        if (pageId === 'inventory-query') {
            html = renderInventoryQuery();
        } else if (pageId === 'packing-task') {
            html = renderPackingTask();
        } else if (pageId === 'report-list') {
            html = renderReportList();
        } else {
            html = `<div class="card"><h2>${pageId} 页面正在开发中...</h2></div>`;
        }

        pageContent.innerHTML = html;
        bindPageEvents(pageId);
    }

    function renderInventoryQuery() {
        return `
            <div class="breadcrumb">
                <span>首页</span><span>仓库</span><span>库存</span>
            </div>
            <div class="card">
                <div class="filter-form">
                    <div class="filter-row">
                        <div class="form-group"><label>仓库</label><select class="form-control"><option>请选择仓库</option></select></div>
                        <div class="form-group"><label>客户</label><input type="text" class="form-control" placeholder=""></div>
                        <div class="form-group"><label>业务员</label><select class="form-control"><option>请选择业务员</option></select></div>
                        <div class="form-group"><label>中文/英文品名</label><input type="text" class="form-control" placeholder=""></div>
                        <button class="btn btn-primary" style="margin-left:auto"><i class="fas fa-search"></i> 查询</button>
                    </div>
                    <div class="filter-row">
                        <div class="form-group"><label>包裹编号</label><input type="text" class="form-control" placeholder=""></div>
                        <div class="form-group radio-group">
                            <label>报单状态</label>
                            <label class="radio-item"><input type="radio" name="inv-report-status" checked> 全部</label>
                            <label class="radio-item"><input type="radio" name="inv-report-status"> 未报单</label>
                            <label class="radio-item"><input type="radio" name="inv-report-status"> 已报单</label>
                        </div>
                        <div class="form-group radio-group">
                            <label>是否裸货</label>
                            <label class="radio-item"><input type="radio" name="inv-bare-status" checked> 全部</label>
                            <label class="radio-item"><input type="radio" name="inv-bare-status"> 成品</label>
                            <label class="radio-item"><input type="radio" name="inv-bare-status"> 裸货</label>
                        </div>
                        <i class="far fa-question-circle" style="color:#ccc; cursor:pointer" title="说明"></i>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox"></th>
                                <th>#</th>
                                <th>仓库</th>
                                <th>库位</th>
                                <th>业务员</th>
                                <th>是否报关</th>
                                <th>客户代码</th>
                                <th>客户名称</th>
                                <th>客户简称</th>
                                <th>包裹编号</th>
                                <th>品名</th>
                                <th>英文品名</th>
                                <th>柜号/唛头</th>
                                <th>件数</th>
                                <th>单件重量</th>
                                <th>总重量</th>
                                <th>总体积</th>
                                <th>包裹进度</th>
                                <th>库存天数</th>
                                <th>最大免库天数</th>
                                <th>SKU NO.</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData['inventory-query'].map((row, index) => `
                                <tr>
                                    <td><input type="checkbox"></td>
                                    <td>${index + 1}</td>
                                    <td>${row.warehouse}</td>
                                    <td>${row.pos}</td>
                                    <td>${row.salesman}</td>
                                    <td>${row.isCustoms}</td>
                                    <td>${row.code}</td>
                                    <td>${row.fullName}</td>
                                    <td>${row.brief}</td>
                                    <td>${row.packageNum}</td>
                                    <td>${row.name}</td>
                                    <td>${row.enName}</td>
                                    <td>${row.product}</td>
                                    <td>${row.qty}</td>
                                    <td>${row.unitWeight}</td>
                                    <td>${row.totalWeight}</td>
                                    <td>${row.totalVolume}</td>
                                    <td>${row.progress}</td>
                                    <td>${row.days}</td>
                                    <td>${row.maxDays}</td>
                                    <td>${row.sku || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="13" style="text-align:right;font-weight:bold">总计</td>
                                <td style="font-weight:bold">100</td>
                                <td></td>
                                <td style="font-weight:bold">20000.00</td>
                                <td style="font-weight:bold">150.05</td>
                                <td colspan="4"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="pagination">
                    <span>100条/页 <i class="fas fa-chevron-down"></i></span>
                    <i class="fas fa-angle-double-left"></i>
                    <i class="fas fa-angle-left"></i>
                    <span class="active" style="color:var(--primary-color)">1</span>
                    <i class="fas fa-angle-right"></i>
                    <i class="fas fa-angle-double-right"></i>
                    <span>前往 <input type="text" value="1" style="width:30px;text-align:center"> 页 共 4 条记录</span>
                </div>
            </div>
        `;
    }

    function renderPackingTask() {
        return `
            <div class="breadcrumb">
                <span>首页</span><span>仓库</span><span>打包作业</span>
            </div>
            <div class="card">
                <div class="tabs">
                    <div class="tab-item active">未打包(4)</div>
                    <div class="tab-item">待打包</div>
                    <div class="tab-item">待重新打包</div>
                    <div class="tab-item">待二次打包确认</div>
                    <div class="tab-item">已打包(1)</div>
                </div>
                <div class="filter-form">
                    <div class="form-group"><label>仓库</label><select class="form-control"><option>请选择仓库</option></select></div>
                    <div class="form-group"><label>入仓日期</label><input type="date" class="form-control"> - <input type="date" class="form-control"></div>
                    <div class="form-group"><label>关键字</label><input type="text" class="form-control" placeholder="入仓单号/快递单号"></div>
                    <div class="form-group"><label>客户</label><input type="text" class="form-control" placeholder="客户代码/名称/简称"></div>
                    <button class="btn btn-primary"><i class="fas fa-search"></i> 查询</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox"></th>
                                <th>仓库</th>
                                <th>客户id</th>
                                <th>业务员id</th>
                                <th>品名</th>
                                <th>英文品名</th>
                                <th>件数</th>
                                <th>总重量</th>
                                <th>总体积</th>
                                <th>包裹唛头</th>
                                <th>打包方式</th>
                                <th>SKU NO</th>
                                <th>入库子编号</th>
                                <th>单件长</th>
                                <th>单件宽</th>
                                <th>单件高</th>
                                <th>单件重量</th>
                                <th>单件体积</th>
                                <th>快递子单号</th>
                                <th>FBX NO</th>
                                <th>库位</th>
                                <th>PO号</th>
                                <th>仓库作业单号</th>
                                <th>入库时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData['packing-task'].map((row, index) => `
                                <tr>
                                    <td><input type="checkbox" class="packing-checkbox" data-index="${index}"></td>
                                    <td>${row.warehouse}</td>
                                    <td>${row.customerId}</td>
                                    <td>${row.salesmanId}</td>
                                    <td>${row.name}</td>
                                    <td>${row.enName}</td>
                                    <td>${row.count}</td>
                                    <td>${row.totalWeight}</td>
                                    <td>${row.totalVolume}</td>
                                    <td>${row.shippingMark}</td>
                                    <td>${row.packingMethod}</td>
                                    <td>${row.sku}</td>
                                    <td>${row.subInboundNo}</td>
                                    <td>${row.unitLength}</td>
                                    <td>${row.unitWidth}</td>
                                    <td>${row.unitHeight}</td>
                                    <td>${row.unitWeight}</td>
                                    <td>${row.unitVolume}</td>
                                    <td>${row.expressSubNo}</td>
                                    <td>${row.fbxNo}</td>
                                    <td>${row.pos}</td>
                                    <td>${row.poNo}</td>
                                    <td>${row.warehouseJobNo}</td>
                                    <td>${row.inboundTime}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" style="text-align:right;font-weight:bold">总计</td>
                                <td style="font-weight:bold">142</td>
                                <td style="font-weight:bold">500.00</td>
                                <td style="font-weight:bold">10.2</td>
                                <td colspan="15"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="footer-actions">
                    <button id="btn-apply-packing" class="btn btn-primary">申请打包</button>
                </div>
                <div class="pagination">
                    <span>100条/页 <i class="fas fa-chevron-down"></i></span>
                    <i class="fas fa-angle-double-left"></i>
                    <i class="fas fa-angle-left"></i>
                    <span class="active" style="color:var(--primary-color)">1</span>
                    <i class="fas fa-angle-right"></i>
                    <i class="fas fa-angle-double-right"></i>
                    <span>前往 <input type="text" value="1" style="width:30px;text-align:center"> 页 共 4 条记录</span>
                </div>
            </div>
        `;
    }

    function renderReportList() {
        return `
            <div class="breadcrumb">
                <span>首页</span><span>仓库</span><span>库存</span>
            </div>
            <div class="card">
                <div class="tabs">
                    <div class="tab-item active">未报单</div>
                    <div class="tab-item">已报单</div>
                </div>
                <div class="filter-form">
                    <div class="form-group"><label>仓库</label><select class="form-control"><option>请选择仓库</option></select></div>
                    <div class="form-group"><label>客户</label><input type="text" class="form-control" placeholder=""></div>
                    <div class="form-group"><label>业务员</label><select class="form-control"><option>请选择业务员</option></select></div>
                    <div class="form-group"><label>中文/英文品名</label><input type="text" class="form-control" placeholder=""></div>
                    <button class="btn btn-primary" style="margin-left:auto"><i class="fas fa-search"></i> 查询</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox"></th>
                                <th>#</th>
                                <th>仓库</th>
                                <th>业务员</th>
                                <th>客户代码</th>
                                <th>客户名称</th>
                                <th>客户简称</th>
                                <th>柜号/唛头</th>
                                <th>品名</th>
                                <th>英文品名</th>
                                <th>单据重(KG)</th>
                                <th>总体积</th>
                                <th>总件数</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData['report-list'].map((row, index) => `
                                <tr>
                                    <td><input type="checkbox"></td>
                                    <td>${index + 1}</td>
                                    <td>${row.warehouse}</td>
                                    <td>${row.salesman}</td>
                                    <td>${row.code}</td>
                                    <td>${row.name}</td>
                                    <td>${row.brief}</td>
                                    <td>${row.product}</td>
                                    <td>${row.pName}</td>
                                    <td>${row.enName}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="10" style="text-align:right;font-weight:bold">总计</td>
                                <td style="font-weight:bold">100</td>
                                <td style="font-weight:bold">20000.00</td>
                                <td style="font-weight:bold">150.05</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="footer-actions">
                    <button class="btn btn-primary">报单</button>
                    <button class="btn">加入运单</button>
                </div>
            </div>
        `;
    }

    function bindPageEvents(pageId) {
        // Bind tab switching within pages
        const tabs = pageContent.querySelectorAll('.tab-item');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                // Could re-filter data here if needed for more realism
            });
        });

        if (pageId === 'packing-task') {
            const btnApply = document.getElementById('btn-apply-packing');
            if (btnApply) {
                btnApply.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.packing-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录', 'error');
                        return;
                    }
                    const selectedIndices = Array.from(checkboxes).map(cb => cb.dataset.index);
                    const selectedData = selectedIndices.map(index => mockData['packing-task'][index]);
                    showPackingModal(selectedData);
                });
            }
        }
    }

    // --- Modal & Toast Functions ---

    function showPackingModal(data) {
        // Create Modal HTML
        let modalHtml = `
            <div class="modal-overlay show" id="packing-modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <span class="modal-title">申请打包</span>
                        <i class="fas fa-times modal-close" id="modal-close-btn"></i>
                    </div>
                    <div class="modal-body">
                        <div class="table-container">
                             <table>
                                <thead>
                                    <tr>
                                        <th>仓库</th>
                                        <th>客户id</th>
                                        <th>业务员id</th>
                                        <th>品名</th>
                                        <th>英文品名</th>
                                        <th>裸货库存数</th>
                                        <th>打包件数</th>
                                        <th>总重量</th>
                                        <th>总体积</th>
                                        <th>包裹唛头</th>
                                        <th>打包方式</th>
                                        <th>SKU NO</th>
                                        <th>入库子编号</th>
                                        <th>单件长</th>
                                        <th>单件宽</th>
                                        <th>单件高</th>
                                        <th>单件重量</th>
                                        <th>单件体积</th>
                                        <th>快递子单号</th>
                                        <th>FBX NO</th>
                                        <th>库位</th>
                                        <th>PO号</th>
                                        <th>仓库作业单号</th>
                                        <th>入库时间</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.map((row, idx) => `
                                        <tr>
                                            <td>${row.warehouse}</td>
                                            <td>${row.customerId}</td>
                                            <td>${row.salesmanId}</td>
                                            <td>${row.name}</td>
                                            <td>${row.enName}</td>
                                            <td>${row.count}</td>
                                            <td>
                                                <input type="number" 
                                                       class="form-control packing-count-input" 
                                                       value="${row.count}" 
                                                       max="${row.count}" 
                                                       min="1"
                                                       data-max="${row.count}"
                                                       style="width: 100px;">
                                            </td>
                                            <td>${row.totalWeight}</td>
                                            <td>${row.totalVolume}</td>
                                            <td>${row.shippingMark}</td>
                                            <td>${row.packingMethod}</td>
                                            <td>${row.sku}</td>
                                            <td>${row.subInboundNo}</td>
                                            <td>${row.unitLength}</td>
                                            <td>${row.unitWidth}</td>
                                            <td>${row.unitHeight}</td>
                                            <td>${row.unitWeight}</td>
                                            <td>${row.unitVolume}</td>
                                            <td>${row.expressSubNo}</td>
                                            <td>${row.fbxNo}</td>
                                            <td>${row.pos}</td>
                                            <td>${row.poNo}</td>
                                            <td>${row.warehouseJobNo}</td>
                                            <td>${row.inboundTime}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn" id="modal-cancel-btn">取消</button>
                        <button class="btn btn-primary" id="modal-save-btn">保存</button>
                    </div>
                </div>
            </div>
        `;

        // Append to body
        const overlay = document.createElement('div');
        overlay.innerHTML = modalHtml;
        document.body.appendChild(overlay.firstElementChild);

        // Bind Modal Events
        document.getElementById('modal-close-btn').addEventListener('click', closePackingModal);
        document.getElementById('modal-cancel-btn').addEventListener('click', closePackingModal);
        document.getElementById('modal-save-btn').addEventListener('click', savePackingTask);
    }

    function closePackingModal() {
        const overlay = document.getElementById('packing-modal-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    function savePackingTask() {
        const inputs = document.querySelectorAll('.packing-count-input');
        let isValid = true;

        inputs.forEach(input => {
            const val = parseInt(input.value);
            const max = parseInt(input.getAttribute('data-max'));

            if (isNaN(val) || val <= 0 || val > max) {
                isValid = false;
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
            }
        });

        if (!isValid) {
            showToast('打包件数无效或超过库存数', 'error');
            return;
        }

        // Simulate Save
        closePackingModal();
        showToast('申请打包成功', 'success');
    }

    function showToast(message, type = 'success') {
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const toastClass = type === 'success' ? 'toast-success' : 'toast-error';

        const toastHtml = `
            <div class="toast ${toastClass} show" id="toast-notification">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = toastHtml;
        const toastEl = tempDiv.firstElementChild;
        document.body.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.remove('show');
            setTimeout(() => {
                toastEl.remove();
            }, 300);
        }, 3000);
    }
});
