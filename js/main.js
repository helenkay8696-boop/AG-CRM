document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentPage = 'report-list';
    let currentReportListTab = 'unreported'; // 'unreported', 'reported', 'cargo-claim'
    let currentPackingTaskTab = 'unpacked'; // 'unpacked', 'packed', etc.
    let inventoryTab = 'batch'; // 'realtime' or 'batch'
    let inventoryReportStatus = '未报单';
    let inventoryBareStatus = '裸货'; // '成品', '裸货'

    const allAvailableColumns = [
        { id: 'warehouse', label: '仓库' },
        { id: 'jobNo', label: '仓库作业单号' },
        { id: 'inboundTime', label: '入仓时间' },
        { id: 'pos', label: '库位' },
        { id: 'salesman', label: '业务员' },
        { id: 'shippingMark', label: '是否裸货' },
        { id: 'isReport', label: '是否报单' },
        { id: 'code', label: '客户代码' },
        { id: 'fullName', label: '客户名称' },
        { id: 'brief', label: '客户简称' },
        { id: 'pkgMark', label: '包裹唛头' },
        { id: 'name', label: '品名' },
        { id: 'enName', label: '英文品名' },
        { id: 'dim', label: '单件长*宽*高' },
        { id: 'qty', label: '件数' },
        { id: 'unitWeight', label: '单件重量' },
        { id: 'totalWeight', label: '总重量' },
        { id: 'totalVolume', label: '总体积' },
        { id: 'density', label: '包裹密度' },
        { id: 'batchNo', label: '库存批次' },
        { id: 'maxDays', label: '最大在库天数' },
        { id: 'sku', label: 'SKU NO.' },
        { id: 'expressNo', label: '关联运单号' }
    ];

    let currentColumnConfig = [
        { id: 'warehouse', label: '仓库', fixed: false },
        { id: 'jobNo', label: '仓库作业单号', fixed: false },
        { id: 'inboundTime', label: '入仓时间', fixed: false },
        { id: 'pos', label: '库位', fixed: false },
        { id: 'salesman', label: '业务员', fixed: false },
        { id: 'shippingMark', label: '是否裸货', fixed: false },
        { id: 'isReport', label: '是否报单', fixed: false },
        { id: 'code', label: '客户代码', fixed: false },
        { id: 'fullName', label: '客户名称', fixed: false },
        { id: 'brief', label: '客户简称', fixed: false },
        { id: 'pkgMark', label: '包裹唛头', fixed: false },
        { id: 'name', label: '品名', fixed: false },
        { id: 'enName', label: '英文品名', fixed: false },
        { id: 'dim', label: '单件长*宽*高', fixed: false },
        { id: 'qty', label: '件数', fixed: false },
        { id: 'unitWeight', label: '单件重量', fixed: false },
        { id: 'totalWeight', label: '总重量', fixed: false },
        { id: 'totalVolume', label: '总体积', fixed: false },
        { id: 'density', label: '包裹密度', fixed: false },
        { id: 'batchNo', label: '库存批次', fixed: false },
        { id: 'maxDays', label: '最大在库天数', fixed: false },
        { id: 'sku', label: 'SKU NO.', fixed: false },
        { id: 'expressNo', label: '关联运单号', fixed: false }
    ];

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
            { id: 1, warehouse: '深圳仓库', pos: 'A001', salesman: '张三', code: 'A001', name: '测试客户A', brief: '测试客户A', pkgNum: 'PKG001', pName: '测试商品AAAA', enName: 'TEST PD AA', shippingMark: 'MARK-001', totalCount: 100, totalWeight: 50.5, totalVolume: 1.2, inNo: 'IN2025001', maxDays: 30 },
            { id: 2, warehouse: '广州仓库', pos: 'B002', salesman: '李四', code: 'A002', name: '测试客户B', brief: '测试客户B', pkgNum: 'PKG002', pName: '测试商品BBBB', enName: 'TEST PD BB', shippingMark: 'MARK-002', totalCount: 200, totalWeight: 100.0, totalVolume: 2.5, inNo: 'IN2025002', maxDays: 30 },
            { id: 3, warehouse: '佛山仓库', pos: 'C003', salesman: '王五', code: 'A003', name: '测试客户C', brief: '测试客户C', pkgNum: 'PKG003', pName: '测试商品CCCC', enName: 'TEST PD CC', shippingMark: 'MARK-001', totalCount: 150, totalWeight: 75.2, totalVolume: 1.8, inNo: 'IN2025003', maxDays: 30 },
            { id: 4, warehouse: '深圳仓库', pos: 'D004', salesman: '张三', code: 'A001', name: '测试客户A', brief: '测试客户A', pkgNum: 'PKG004', pName: '测试商品DDDD', enName: 'TEST PD DD', shippingMark: 'MARK-001', totalCount: 120, totalWeight: 60.0, totalVolume: 1.5, inNo: 'IN2025004', maxDays: 30 },
            { id: 5, warehouse: '广州仓库', pos: 'E005', salesman: '李四', code: 'A002', name: '测试客户B', brief: '测试客户B', pkgNum: 'PKG005', pName: '测试商品EEEE', enName: 'TEST PD EE', shippingMark: 'MARK-001', totalCount: 80, totalWeight: 40.0, totalVolume: 1.0, inNo: 'IN2025005', maxDays: 30 },
            { id: 6, warehouse: '佛山仓库', pos: 'F006', salesman: '王五', code: 'A003', name: '测试客户C', brief: '测试客户C', pkgNum: 'PKG006', pName: '测试商品FFFF', enName: 'TEST PD FF', shippingMark: 'MARK-001', totalCount: 200, totalWeight: 100.0, totalVolume: 2.2, inNo: 'IN2025006', maxDays: 30 }
        ],
        'cargo-claim': [
            { id: 1, warehouse: '佛山仓库', sku: '', qty: 4, weight: 220.000, volume: 0.419, density: 525.000, inDate: '2023-12-23 11:30', trackingNo: '', plateNo: '', inNote: '', refNo: '', img: '' },
            { id: 2, warehouse: '总仓库', sku: '', qty: 1, weight: 0, volume: 0, density: 0, inDate: '2023-10-14 15:08', trackingNo: '', plateNo: '', inNote: '', refNo: '', img: '' },
            { id: 3, warehouse: '总仓库', sku: '', qty: 0, weight: 0, volume: 0, density: 0, inDate: '2023-10-14 14:56', trackingNo: '', plateNo: '', inNote: '', refNo: '', img: '' },
            { id: 4, warehouse: '总仓库', sku: '', qty: 10, weight: 0, volume: 0, density: 0, inDate: '2023-10-13 20:10', trackingNo: '', plateNo: '', inNote: '', refNo: '', img: '' },
            { id: 5, warehouse: '总仓库', sku: '', qty: 10, weight: 0, volume: 0, density: 0, inDate: '2023-10-13 20:07', trackingNo: '', plateNo: '', inNote: '', refNo: '', img: '' },
            { id: 6, warehouse: '总仓库', sku: '', qty: 0, weight: 0, volume: 0, density: 0, inDate: '2023-10-13 18:24', trackingNo: '', plateNo: '', inNote: '', refNo: '', img: '' },
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
        const isBatch = inventoryTab === 'batch';
        return `
            <div class="breadcrumb">
                <span>首页</span><span>仓库</span><span>库存</span>
            </div>
            <div class="card">
                <div class="tabs" style="margin-bottom: 0; border-bottom: 1px solid var(--border-color);">
                    <div class="tab-item active" data-inventory-tab="batch">批次库存</div>
                    <div class="tab-item" style="color: #ccc; cursor: not-allowed;">实时库存</div>
                </div>
                <div class="filter-form" style="padding-top: 20px;">
                    <div class="filter-row">
                        <div class="form-group"><label>仓库</label><select class="form-control"><option>请选择仓库</option></select></div>
                        <div class="form-group"><label>客户</label><input type="text" class="form-control" placeholder="代码/简称/英文名称"></div>
                        <div class="form-group"><label>业务员</label><select class="form-control"><option>请选择业务员</option></select></div>
                        <div class="form-group"><label>中文/英文品名</label><input type="text" class="form-control" placeholder=""></div>
                        <button class="btn btn-primary" style="margin-left:auto"><i class="fas fa-search"></i> 查询</button>
                    </div>
                    <div class="filter-row">
                        <div class="form-group"><label>包裹编号</label><input type="text" class="form-control" placeholder=""></div>
                        <div class="form-group"><label>包裹唛头</label><input type="text" class="form-control" placeholder=""></div>
                        <div class="form-group radio-group">
                            <label>报单状态</label>
                            <label class="radio-item"><input type="radio" name="inv-report-status" value="未报单" ${inventoryReportStatus === '未报单' ? 'checked' : ''}> 未报单</label>
                            <label class="radio-item"><input type="radio" name="inv-report-status" value="已报单" ${inventoryReportStatus === '已报单' ? 'checked' : ''}> 已报单</label>
                        </div>
                        <div class="form-group radio-group">
                            <label>状态确认</label>
                            <label class="radio-item"><input type="radio" name="inv-bare-status" value="裸货" ${inventoryBareStatus === '裸货' ? 'checked' : ''} ${inventoryReportStatus === '已报单' ? 'disabled' : ''}> 裸货</label>
                            <label class="radio-item"><input type="radio" name="inv-bare-status" value="入库成品" ${inventoryBareStatus === '入库成品' ? 'checked' : ''}> 入库成品</label>
                            <label class="radio-item"><input type="radio" name="inv-bare-status" value="打包成品" ${inventoryBareStatus === '打包成品' ? 'checked' : ''}> 打包成品</label>
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
                                ${currentColumnConfig.map(col => {
            if (col.id === 'jobNo' && isBatch) {
                return `
                                            <th style="position:relative">
                                                <div style="display:flex; align-items:center; justify-content:center">
                                                    仓库作业单号
                                                    <span class="sort-icons">
                                                        <i class="fas fa-caret-up"></i>
                                                        <i class="fas fa-caret-down"></i>
                                                    </span>
                                                    <i class="fas fa-filter filter-icon-btn" data-filter="jobNo"></i>
                                                </div>
                                                <div class="filter-popover" id="filter-popover-jobNo">
                                                    <div class="filter-popover-header">
                                                        <button class="btn btn-primary filter-submit">筛选</button>
                                                        <button class="btn btn-default filter-reset" style="border:1px solid #d9d9d9">重置</button>
                                                    </div>
                                                    <div class="filter-popover-content">
                                                        <select class="form-control"><option>请选择</option></select>
                                                    </div>
                                                </div>
                                            </th>`;
            }
            if (col.id === 'inboundTime' && isBatch) {
                return `
                                            <th style="position:relative">
                                                <div style="display:flex; align-items:center; justify-content:center">
                                                    入仓时间
                                                    <span class="sort-icons">
                                                        <i class="fas fa-caret-up"></i>
                                                        <i class="fas fa-caret-down"></i>
                                                    </span>
                                                    <i class="fas fa-filter filter-icon-btn" data-filter="inboundTime"></i>
                                                </div>
                                                <div class="filter-popover" id="filter-popover-inboundTime" style="min-width: 280px;">
                                                    <div class="filter-popover-header">
                                                        <button class="btn btn-primary filter-submit">筛选</button>
                                                        <button class="btn btn-default filter-reset" style="border:1px solid #d9d9d9">重置</button>
                                                    </div>
                                                    <div class="filter-popover-content" style="flex-direction:row; gap:0;">
                                                        <input type="text" class="form-control" placeholder="开始日期" style="border-radius:4px 0 0 4px">
                                                        <input type="text" class="form-control" placeholder="结束日期" style="border-radius:0 4px 4px 0; border-left:0">
                                                    </div>
                                                </div>
                                            </th>`;
            }
            return `<th>${col.label}</th>`;
        }).join('')}
                                <th>操作 <i class="fas fa-cog" id="btn-col-config" style="cursor:pointer; color:var(--primary-color); margin-left:5px"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData['inventory-query'].map((row, index) => `
                                <tr>
                                    <td><input type="checkbox" class="inventory-checkbox" data-index="${index}"></td>
                                    <td>${index + 1}</td>
                                    ${currentColumnConfig.map(col => {
            let val = row[col.id] || '';
            if (col.id === 'name') return `<td style="color: #ff9900">${val}</td>`;
            if (col.id === 'enName') return `<td style="color: #33cc33">${val}</td>`;
            if (col.id === 'jobNo') return `<td>DH2023102400${index + 1}</td>`;
            if (col.id === 'inboundTime') return `<td>2023-10-24 10:00</td>`;
            return `<td>${val}</td>`;
        }).join('')}
                                    <td>
                                        <i class="fas fa-edit" style="color:var(--primary-color); cursor:pointer; margin-right:10px" title="编辑"></i>
                                        <i class="fas fa-trash-alt" style="color:#ff4d4f; cursor:pointer" title="删除"></i>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="footer-actions-container" style="display:flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <div style="font-weight:bold">合计</div>
                    <div style="display:flex; gap: 80px; margin-right: 400px;">
                        <span>100</span>
                        <span>20000.00</span>
                        <span>180.03</span>
                    </div>
                </div>
                <div class="footer-actions" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div class="buttons">
                        ${inventoryReportStatus === '已报单' ? '' : `
                            ${inventoryBareStatus === '裸货' ? `
                                <button class="btn btn-primary" id="btn-apply-packing-inventory">申请打包</button>
                                <button class="btn">客户退库</button>
                            ` : `
                                <button class="btn btn-primary" id="btn-apply-report-inventory">报单</button>
                                <button class="btn" id="btn-join-waybill-inventory">加入运单</button>
                            `}
                            <button class="btn" id="btn-send-message">发送消息</button>
                        `}
                    </div>
                    ${renderPagination(3, 1, 100)}
                </div>
            </div>
        `;
    }


    function renderPackingTask() {
        const activeTab = currentPackingTaskTab;
        return `
            <div class="breadcrumb">
                <span>首页</span><span>仓库</span><span>打包作业</span>
            </div>
            <div class="card">
                <div class="tabs">
                    <div class="tab-item ${activeTab === 'unpacked' ? 'active' : ''}" data-tab="unpacked">未打包(4)</div>
                    <div class="tab-item ${activeTab === 'to-be-packed' ? 'active' : ''}" data-tab="to-be-packed">待打包</div>
                    <div class="tab-item ${activeTab === 'repacking' ? 'active' : ''}" data-tab="repacking">待重新打包</div>
                    <div class="tab-item ${activeTab === 'reconfirming' ? 'active' : ''}" data-tab="reconfirming">待二次打包确认</div>
                    <div class="tab-item ${activeTab === 'packed' ? 'active' : ''}" data-tab="packed">已打包(1)</div>
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
                    ${activeTab === 'unpacked' ? `
                        <button id="btn-apply-packing" class="btn btn-primary">申请打包</button>
                        <button id="btn-warehouse-job" class="btn" style="border:1px solid #d9d9d9">库作业</button>
                    ` : ''}
                    ${activeTab === 'packed' ? `
                        <button id="btn-apply-report-packing" class="btn btn-primary">报单</button>
                        <button id="btn-join-waybill-packing" class="btn" style="border:1px solid #d9d9d9">加入运单</button>
                    ` : ''}
                </div>
                ${renderPagination(4, 1, 100)}
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
                    <div class="tab-item ${currentReportListTab === 'unreported' ? 'active' : ''}" data-tab="unreported">未报单</div>
                    <div class="tab-item ${currentReportListTab === 'reported' ? 'active' : ''}" data-tab="reported">已报单</div>
                    <div class="tab-item ${currentReportListTab === 'cargo-claim' ? 'active' : ''}" data-tab="cargo-claim">货物认领(16)</div>
                </div>
                ${currentReportListTab === 'cargo-claim' ? renderCargoClaimTabContent() : `
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
                                <th>库位</th>
                                <th>业务员</th>
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
                                <th>入库编号</th>
                                <th>最大免库天数</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockData['report-list'].map((row, index) => `
                                <tr>
                                    <td><input type="checkbox" class="report-checkbox" data-index="${index}"></td>
                                    <td>${index + 1}</td>
                                    <td>${row.warehouse}</td>
                                    <td>${row.pos}</td>
                                    <td>${row.salesman}</td>
                                    <td>${row.code}</td>
                                    <td>${row.name}</td>
                                    <td>${row.brief}</td>
                                    <td>${row.pkgNum}</td>
                                    <td>${row.pName}</td>
                                    <td>${row.enName}</td>
                                    <td>${row.shippingMark}</td>
                                    <td>${row.totalCount}</td>
                                    <td></td>
                                    <td>${row.totalWeight}</td>
                                    <td>${row.totalVolume}</td>
                                    <td></td>
                                    <td>${row.inNo}</td>
                                    <td>${row.maxDays}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        </tfoot>
                    </table>
                </div>
                ${renderPagination(6, 1, 100)}
                ${currentReportListTab === 'unreported' ? `
                <div class="footer-actions">
                    <button id="btn-apply-report" class="btn btn-primary">报单</button>
                    <button id="btn-join-waybill-report" class="btn" style="border:1px solid #d9d9d9">加入运单</button>
                </div>
                ` : ''}
                `}
            </div>
        `;
    }

    function renderCargoClaimTabContent() {
        return `
            <div class="filter-form" style="padding-top: 20px;">
                <div class="filter-row">
                    <div class="form-group"><select class="form-control"><option>请选择仓库</option></select></div>
                    <div class="form-group"><label>入仓日期</label><input type="date" class="form-control"> - <input type="date" class="form-control"></div>
                    <div class="form-group"><label>参考号</label><input type="text" class="form-control" placeholder="请输入"></div>
                    <div class="form-group"><label>快递单号</label><input type="text" class="form-control" placeholder="请输入"></div>
                    <div class="form-group"><label>名称</label><input type="text" class="form-control" placeholder="客户代码/客户名称/简称/英文名称"></div>
                    <div class="form-group"><label>入库备注</label><input type="text" class="form-control" placeholder="请输入"></div>
                    <button class="btn btn-primary" style="margin-left:auto"><i class="fas fa-search"></i> 查询</button>
                </div>
            </div>
            <div class="table-container">
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th><input type="checkbox"></th>
                            <th>所在仓库</th>
                            <th>品名</th>
                            <th>件数</th>
                            <th>总重量(KG)</th>
                            <th>总体积(CBM)</th>
                            <th>密度</th>
                            <th>入库日期</th>
                            <th>快递单号</th>
                            <th>车牌</th>
                            <th>入库备注</th>
                            <th>参考号</th>
                            <th>图片</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${mockData['cargo-claim'].map(row => `
                            <tr>
                                <td><input type="checkbox" class="cargo-claim-checkbox"></td>
                                <td>${row.warehouse}</td>
                                <td>${row.sku}</td>
                                <td>${row.qty || ''}</td>
                                <td>${row.weight || ''}</td>
                                <td>${row.volume || ''}</td>
                                <td>${row.density || ''}</td>
                                <td>${row.inDate}</td>
                                <td>${row.trackingNo}</td>
                                <td>${row.plateNo}</td>
                                <td>${row.inNote}</td>
                                <td>${row.refNo}</td>
                                <td><i class="fas fa-plus" style="color: #ccc; cursor: pointer;"></i></td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align:right;font-weight:bold"></td>
                            <td style="font-weight:bold">25</td>
                            <td style="font-weight:bold">220.000</td>
                            <td style="font-weight:bold">0.419</td>
                            <td colspan="7"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="footer-actions" style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                <button class="btn btn-primary" id="btn-confirm-claim">认领</button>
                ${renderPagination(16, 1, 100)}
            </div>
        `;
    }

    function renderPagination(total, current, size) {
        return `
            <div class="pagination">
                <div class="pagination-size">
                    <select class="form-control" style="width: auto; height: 32px; padding: 0 10px;">
                        <option value="10" ${size === 10 ? 'selected' : ''}>10条/页</option>
                        <option value="20" ${size === 20 ? 'selected' : ''}>20条/页</option>
                        <option value="50" ${size === 50 ? 'selected' : ''}>50条/页</option>
                        <option value="100" ${size === 100 ? 'selected' : ''}>100条/页</option>
                        <option value="500" ${size === 500 ? 'selected' : ''}>500条/页</option>
                        <option value="1000" ${size === 1000 ? 'selected' : ''}>1000条/页</option>
                    </select>
                </div>
                <div class="pagination-nav">
                    <i class="fas fa-angle-double-left" title="首页"></i>
                    <i class="fas fa-angle-left" title="上一页"></i>
                    <span class="page-num active">${current}</span>
                    <i class="fas fa-angle-right" title="下一页"></i>
                    <i class="fas fa-angle-double-right" title="末页"></i>
                </div>
                <div class="pagination-jump">
                    <span>前往</span>
                    <input type="text" value="${current}" class="form-control" style="width: 40px; text-align: center; height: 32px; padding: 0;">
                    <span>页</span>
                    <span class="total-info">共 ${total} 条记录</span>
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
            const tabs = pageContent.querySelectorAll('.tab-item');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    currentPackingTaskTab = tab.dataset.tab;
                    renderPage('packing-task');
                });
            });

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

            const btnWarehouseJob = document.getElementById('btn-warehouse-job');
            if (btnWarehouseJob) {
                btnWarehouseJob.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.packing-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录进行库作业', 'warning');
                        return;
                    }
                    showWarehouseJobModal();
                });
            }

            const btnApplyReportPacking = document.getElementById('btn-apply-report-packing');
            if (btnApplyReportPacking) {
                btnApplyReportPacking.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.packing-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录进行报单', 'warning');
                        return;
                    }
                    // Simulate selecting data for report
                    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
                    showReportModal(mockData['report-list'].slice(0, selectedIndices.length));
                });
            }

            const btnJoinWaybillPacking = document.getElementById('btn-join-waybill-packing');
            if (btnJoinWaybillPacking) {
                btnJoinWaybillPacking.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.packing-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录加入运单', 'warning');
                        return;
                    }
                    showAddWaybillModal();
                });
            }
        }

        if (pageId === 'report-list') {
            const btnReport = document.getElementById('btn-apply-report');
            if (btnReport) {
                btnReport.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.report-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录', 'error');
                        return;
                    }

                    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
                    const selectedData = selectedIndices.map(index => mockData['report-list'][index]);

                    showReportModal(selectedData);
                });
            }

            const btnJoinWaybillReport = document.getElementById('btn-join-waybill-report');
            if (btnJoinWaybillReport) {
                btnJoinWaybillReport.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.report-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录加入运单', 'warning');
                        return;
                    }
                    showAddWaybillModal();
                });
            }
        }

        if (pageId === 'inventory-query') {
            const queryTabs = pageContent.querySelectorAll('[data-inventory-tab]');
            queryTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    inventoryTab = tab.dataset.inventoryTab;
                    renderPage('inventory-query');
                });
            });

            const bareRadios = pageContent.querySelectorAll('input[name="inv-bare-status"]');
            bareRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    inventoryBareStatus = radio.value;
                    renderPage('inventory-query');
                });
            });

            const reportRadios = pageContent.querySelectorAll('input[name="inv-report-status"]');
            reportRadios.forEach(reportRadio => {
                reportRadio.addEventListener('change', () => {
                    inventoryReportStatus = reportRadio.value;
                    if (inventoryReportStatus === '已报单') {
                        inventoryBareStatus = '入库成品';
                    }
                    renderPage('inventory-query');
                });
            });

            const btnSendMessage = document.getElementById('btn-send-message');
            if (btnSendMessage) {
                btnSendMessage.addEventListener('click', () => {
                    showMessageModal();
                });
            }

            const btnColConfig = document.getElementById('btn-col-config');
            if (btnColConfig) {
                btnColConfig.addEventListener('click', () => {
                    showColConfigModal();
                });
            }

            const btnApplyPacking = document.getElementById('btn-apply-packing-inventory');
            if (btnApplyPacking) {
                btnApplyPacking.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.inventory-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录', 'error');
                        return;
                    }
                    const selectedData = Array.from(checkboxes).map(cb => {
                        const row = mockData['inventory-query'][parseInt(cb.dataset.index)];
                        return {
                            warehouse: row.warehouse,
                            customerId: row.code,
                            salesmanId: row.salesman,
                            name: row.name,
                            enName: row.enName,
                            count: row.qty,
                            totalWeight: row.totalWeight,
                            totalVolume: row.totalVolume,
                            shippingMark: row.pkgMark || '',
                            packingMethod: '纸箱',
                            sku: row.sku,
                            subInboundNo: 'SUB-001',
                            unitLength: 50,
                            unitWidth: 40,
                            unitHeight: 30,
                            unitWeight: row.unitWeight,
                            unitVolume: 0.012,
                            expressSubNo: row.expressNo || 'EXP-001',
                            fbxNo: 'FBX-101',
                            pos: row.pos,
                            poNo: 'PO-001',
                            warehouseJobNo: row.jobNo || 'WJ-001',
                            inboundTime: row.inboundTime || '2023-10-24 10:00'
                        };
                    });
                    showPackingModal(selectedData);
                });
            }

            const btnApplyReport = document.getElementById('btn-apply-report-inventory');
            if (btnApplyReport) {
                btnApplyReport.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.inventory-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录', 'error');
                        return;
                    }
                    // Map to report-list format roughly
                    const selectedData = Array.from(checkboxes).map(cb => {
                        const row = mockData['inventory-query'][parseInt(cb.dataset.index)];
                        return {
                            id: row.id,
                            warehouse: row.warehouse,
                            pos: row.pos,
                            salesman: row.salesman,
                            code: row.code,
                            name: row.fullName,
                            brief: row.brief,
                            pkgNum: row.packageNum,
                            pName: row.name,
                            enName: row.enName,
                            shippingMark: row.product,
                            totalCount: row.qty,
                            totalWeight: row.totalWeight,
                            totalVolume: row.totalVolume,
                            inNo: 'IN2023001',
                            maxDays: row.maxDays
                        };
                    });
                    showReportModal(selectedData);
                });
            }

            const btnJoinWaybill = document.getElementById('btn-join-waybill-inventory');
            if (btnJoinWaybill) {
                btnJoinWaybill.addEventListener('click', () => {
                    const checkboxes = pageContent.querySelectorAll('.inventory-checkbox:checked');
                    if (checkboxes.length === 0) {
                        showToast('请至少选择一条记录', 'error');
                        return;
                    }
                    showAddWaybillModal();
                });
            }

            // Bind Column Filters
            const filterBtns = pageContent.querySelectorAll('.filter-icon-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const filterId = btn.dataset.filter;
                    const popover = document.getElementById(`filter-popover-${filterId}`);

                    // Close all other popovers
                    document.querySelectorAll('.filter-popover').forEach(p => {
                        if (p !== popover) p.classList.remove('active');
                    });

                    popover.classList.toggle('active');
                });
            });

            // Handle filter popover clicks (prevent closing when clicking inside)
            const popovers = pageContent.querySelectorAll('.filter-popover');
            popovers.forEach(popover => {
                popover.addEventListener('click', (e) => e.stopPropagation());

                const submitBtn = popover.querySelector('.filter-submit');
                const resetBtn = popover.querySelector('.filter-reset');

                submitBtn.addEventListener('click', () => {
                    popover.classList.remove('active');
                    showToast('筛选成功', 'success');
                });

                resetBtn.addEventListener('click', () => {
                    const inputs = popover.querySelectorAll('input, select');
                    inputs.forEach(input => input.value = '');
                    popover.classList.remove('active');
                    showToast('已重置', 'info');
                });
            });

            // Close popover when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.filter-popover') && !e.target.closest('.filter-icon-btn')) {
                    document.querySelectorAll('.filter-popover').forEach(p => p.classList.remove('active'));
                }
            });
        }

        if (pageId === 'report-list') {
            const tabs = pageContent.querySelectorAll('.tab-item');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    currentReportListTab = tab.dataset.tab;
                    renderPage('report-list');
                });
            });

            const btnConfirmClaim = document.getElementById('btn-confirm-claim');
            if (btnConfirmClaim) {
                btnConfirmClaim.addEventListener('click', () => {
                    const selected = pageContent.querySelectorAll('.cargo-claim-checkbox:checked');
                    if (selected.length === 0) {
                        showToast('请选择要认领的货物', 'warning');
                        return;
                    }
                    showToast('认领成功', 'success');
                });
            }

            // Re-bind report list buttons if on unreported tab
            if (currentReportListTab === 'unreported') {
                const btnReport = document.getElementById('btn-apply-report');
                if (btnReport) {
                    btnReport.addEventListener('click', () => {
                        const checkboxes = pageContent.querySelectorAll('.report-checkbox:checked');
                        if (checkboxes.length === 0) {
                            showToast('请至少选择一条记录', 'error');
                            return;
                        }
                        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
                        const selectedData = selectedIndices.map(index => mockData['report-list'][index]);
                        showReportModal(selectedData);
                    });
                }
            }
        }

    }

    function showMessageModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay show';
        modalOverlay.id = 'message-modal-overlay';

        modalOverlay.innerHTML = `
            <div class="modal" style="width: 600px; max-width: 90vw;">
                <div class="modal-header">
                    <span class="modal-title">消息通知</span>
                    <i class="fas fa-times modal-close" id="message-modal-close-btn"></i>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div style="margin-bottom: 25px;">
                        <div style="color: var(--text-secondary); margin-bottom: 15px;">人员范围</div>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="radio" name="msg-scope" checked style="width: 18px; height: 18px;">
                                <span>所选客户的业务员</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="radio" name="msg-scope" style="width: 18px; height: 18px;">
                                <span>其他人员</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary); margin-bottom: 10px;">通知内容</div>
                        <textarea class="form-control" style="width: 100%; height: 150px; padding: 10px; resize: none; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="">库存超期了，请向客户确认尽快发货</textarea>
                    </div>
                </div>
                <div class="modal-footer" style="justify-content: flex-end; gap: 10px;">
                    <button class="btn" id="message-modal-cancel-btn">取消</button>
                    <button class="btn btn-primary" id="message-modal-send-btn">发送</button>
                </div>
            </div>
        `;

        const closeModal = () => {
            modalOverlay.classList.remove('show');
            setTimeout(() => modalOverlay.remove(), 300);
        };

        document.body.appendChild(modalOverlay);

        document.getElementById('message-modal-close-btn').addEventListener('click', closeModal);
        document.getElementById('message-modal-cancel-btn').addEventListener('click', closeModal);
        document.getElementById('message-modal-send-btn').addEventListener('click', () => {
            closeModal();
            showToast('消息发送成功', 'success');
        });
    }

    // --- Helper Functions ---


    function closeReportModal() {
        const overlay = document.getElementById('report-modal-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    function showReportModal(selectedItems = []) {
        const allData = mockData['report-list'];
        const initialSelectedIds = new Set(selectedItems.map(i => i.id));
        const selectedMarks = new Set(selectedItems.map(i => i.shippingMark));

        // Find other items with same marks
        let sameMarkData = allData.filter(item =>
            !initialSelectedIds.has(item.id) && selectedMarks.has(item.shippingMark)
        );

        let topList = JSON.parse(JSON.stringify(selectedItems));
        let bottomList = [...sameMarkData];

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay show';
        modalOverlay.id = 'report-modal-overlay';

        const renderTableRows = (data, isTop) => {
            return data.map((row) => `
                <tr>
                    <td style="text-align: center;">
                        <i class="fas ${isTop ? 'fa-minus-square' : 'fa-plus-square'} btn-icon" 
                           style="color: ${isTop ? '#999' : 'var(--primary-color)'}; cursor: pointer; font-size: 16px;"
                           data-action="${isTop ? 'delete' : 'add'}" 
                           data-id="${row.id}"></i>
                    </td>
                    <td>${row.warehouse}</td>
                    <td>${row.pos}</td>
                    <td>${row.salesman}</td>
                    <td>${row.code}</td>
                    <td>${row.name}</td>
                    <td>${row.brief}</td>
                    <td>${row.pkgNum}</td>
                    <td>${row.pName}</td>
                    <td>${row.enName}</td>
                    <td>${row.shippingMark}</td>
                    ${isTop ? `
                    <td><input type="number" class="form-control report-count-input" value="${row.reportCount || row.totalCount}" data-id="${row.id}" data-max="${row.totalCount}" style="width: 70px; height: 24px; padding: 2px 5px; font-size: 12px; border: 1px solid #ddd; border-radius: 2px;"></td>
                    <td class="remain-count" data-id="${row.id}">${row.totalCount - (row.reportCount || row.totalCount)}</td>
                    ` : `
                    <td>${row.totalCount}</td>
                    <td>-</td>
                    `}
                    <td>${row.totalWeight}</td>
                    <td>${row.totalVolume}</td>
                    <td>${row.inNo}</td>
                    <td>${row.maxDays || '-'}</td>
                </tr>
            `).join('');
        };

        const renderModalBody = () => {
            return `
                <div class="modal" style="width: 1200px; max-width: 95vw;">
                    <div class="modal-header">
                        <span class="modal-title">成品报单</span>
                        <i class="fas fa-times modal-close" id="report-modal-close-btn"></i>
                    </div>
                    <div class="modal-body" style="padding: 15px;">
                        <div style="margin-bottom: 20px;">
                            <div style="color: #333; font-weight: bold; font-size: 13px; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                                <i class="fas fa-list-ul"></i> 未报单
                            </div>
                            <div class="table-container" style="overflow-x: auto; border: 1px solid #eee;">
                                <table style="min-width: 1400px; font-size: 12px;">
                                    <thead style="background: #fafafa;">
                                        <tr>
                                            <th>操作</th>
                                            <th>仓库</th><th>库位</th><th>业务员</th><th>客户代码</th><th>客户名称</th><th>客户简称</th>
                                            <th>包裹编号</th><th>品名</th><th>英文品名</th><th>柜号/唛头</th>
                                            <th>本次报单数</th><th>剩余库存数</th>
                                            <th>总重量</th><th>总体积</th><th>入库编号</th><th>最大在库天数</th>
                                        </tr>
                                    </thead>
                                    <tbody id="report-top-body">${renderTableRows(topList, true)}</tbody>
                                </table>
                            </div>
                            ${topList.length === 0 ? '<div style="text-align:center; padding: 20px; color:#999; border: 1px solid #eee; border-top:0;">暂无数据</div>' : ''}
                        </div>
                        <div>
                            <div style="color: #333; font-weight: bold; font-size: 13px; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
                                <i class="fas fa-link"></i> 相同唛头未报单
                            </div>
                            <div class="table-container" style="overflow-x: auto; border: 1px solid #eee;">
                                <table style="min-width: 1400px; font-size: 12px;">
                                    <thead style="background: #fafafa;">
                                        <tr>
                                            <th>操作</th>
                                            <th>仓库</th><th>库位</th><th>业务员</th><th>客户代码</th><th>客户名称</th><th>客户简称</th>
                                            <th>包裹编号</th><th>品名</th><th>英文品名</th><th>柜号/唛头</th>
                                            <th>件数</th><th>剩余库存数</th>
                                            <th>总重量</th><th>总体积</th><th>入库编号</th><th>最大在库天数</th>
                                        </tr>
                                    </thead>
                                    <tbody id="report-bottom-body">${renderTableRows(bottomList, false)}</tbody>
                                </table>
                            </div>
                            ${bottomList.length === 0 ? '<div style="text-align:center; padding: 20px; color:#999; border: 1px solid #eee; border-top:0;">暂无数据</div>' : ''}
                        </div>
                    </div>
                    <div class="modal-footer" style="padding: 10px 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #666; font-size: 13px;">
                            共选择 <span style="font-weight: bold; color: var(--primary-color);">${topList.length}</span> 条数据
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn" id="report-modal-cancel-btn" style="border: 1px solid #d9d9d9; background: #fff; padding: 4px 20px; border-radius: 4px;">取消</button>
                            <button class="btn btn-primary" id="report-modal-confirm-btn" style="padding: 4px 20px; border-radius: 4px;" ${topList.length === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed"' : ''}>报单</button>
                        </div>
                    </div>
                </div>
            `;
        };

        const updateModal = () => {
            modalOverlay.innerHTML = renderModalBody();
            bindModalEvents();
        };

        const bindModalEvents = () => {
            modalOverlay.querySelector('#report-modal-close-btn').addEventListener('click', closeReportModal);
            modalOverlay.querySelector('#report-modal-cancel-btn').addEventListener('click', closeReportModal);
            modalOverlay.querySelector('#report-modal-confirm-btn').addEventListener('click', () => {
                closeReportModal();
                showToast('报单申请成功', 'success');
            });

            // Action icons
            modalOverlay.querySelectorAll('.btn-icon').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const action = btn.dataset.action;
                    if (action === 'delete') {
                        const item = topList.find(i => i.id === id);
                        topList = topList.filter(i => i.id !== id);
                        if (!initialSelectedIds.has(id)) {
                            bottomList.push(item);
                        }
                    } else {
                        const item = bottomList.find(i => i.id === id);
                        bottomList = bottomList.filter(i => i.id !== id);
                        topList.push(item);
                    }
                    updateModal();
                });
            });

            // Quantity input
            modalOverlay.querySelectorAll('.report-count-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const id = parseInt(input.dataset.id);
                    const val = parseInt(e.target.value) || 0;
                    const max = parseInt(input.dataset.max);
                    const item = topList.find(i => i.id === id);
                    if (item) {
                        item.reportCount = val;
                        const remainTd = modalOverlay.querySelector(`.remain-count[data-id="${id}"]`);
                        if (remainTd) remainTd.textContent = Math.max(0, max - val);
                    }
                });
            });
        };

        document.body.appendChild(modalOverlay);
        updateModal();
    }


    function closeReportModal() {
        const overlay = document.getElementById('report-modal-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    }

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

    function showColConfigModal() {
        const modalHtml = `
            <div class="col-config-modal-overlay show" id="col-config-modal">
                <div class="modal-content">
                    <div class="modal-header" style="padding: 15px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; font-size: 16px;">列配置</span>
                        <div style="display: flex; gap: 15px; color: #888;">
                            <i class="far fa-window-maximize" style="cursor: pointer;"></i>
                            <i class="fas fa-times" id="close-col-modal" style="cursor: pointer;"></i>
                        </div>
                    </div>
                    <div class="modal-body" style="flex: 1; display: flex; overflow: hidden;">
                        <div class="col-config-left">
                            <div style="padding: 15px;">
                                <div style="position: relative;">
                                    <input type="text" class="form-control" placeholder="查询" id="col-search-input" style="padding-left: 30px;">
                                    <i class="fas fa-search" style="position: absolute; left: 10px; top: 10px; color: #ccc;"></i>
                                </div>
                            </div>
                            <div id="available-col-list" style="overflow-y: auto; height: calc(100% - 70px);">
                                ${allAvailableColumns.map(col => {
            const isSelected = currentColumnConfig.find(item => item.id === col.id);
            return `
                                        <div class="col-list-item ${isSelected ? 'selected' : ''}" data-id="${col.id}">
                                            ${col.label}
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        </div>
                        <div class="col-config-right" style="flex: 1; display: flex; flex-direction: column;">
                            <div style="flex: 1; overflow-y: auto; padding: 15px;">
                                <table class="config-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 50px; text-align: center;"><i class="fas fa-question-circle" style="color: #ccc;"></i></th>
                                            <th>字段</th>
                                            <th style="width: 80px; text-align: center;">固定</th>
                                            <th style="width: 80px; text-align: center;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody id="config-table-body">
                                        ${currentColumnConfig.map((col, index) => `
                                            <tr data-id="${col.id}">
                                                <td style="text-align: center; color: #ccc;"><i class="fas fa-grip-vertical"></i></td>
                                                <td>${col.label}</td>
                                                <td style="text-align: center;"><input type="checkbox" class="fix-col-check" ${col.fixed ? 'checked' : ''}></td>
                                                <td style="text-align: center;"><i class="fas fa-trash-alt remove-col-btn" style="color: #ff4d4f; cursor: pointer;"></i></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding: 15px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
                        <button class="btn btn-primary" id="save-col-config-btn" style="padding: 8px 25px;">确认</button>
                    </div>
                </div>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.innerHTML = modalHtml;
        document.body.appendChild(overlay.firstElementChild);

        const modalElement = document.getElementById('col-config-modal');
        const searchInput = document.getElementById('col-search-input');
        const availableList = document.getElementById('available-col-list');
        const configTableBody = document.getElementById('config-table-body');
        const saveBtn = document.getElementById('save-col-config-btn');
        const closeBtn = document.getElementById('close-col-modal');

        closeBtn.onclick = () => modalElement.remove();

        searchInput.oninput = () => {
            const val = searchInput.value.toLowerCase();
            const items = availableList.querySelectorAll('.col-list-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(val) ? 'flex' : 'none';
            });
        };

        availableList.onclick = (e) => {
            const item = e.target.closest('.col-list-item');
            if (!item) return;
            const id = item.dataset.id;
            const label = item.textContent.trim();
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                const tr = configTableBody.querySelector(`tr[data-id="${id}"]`);
                if (tr) tr.remove();
            } else {
                item.classList.add('selected');
                const tr = document.createElement('tr');
                tr.dataset.id = id;
                tr.innerHTML = `
                    <td style="text-align: center; color: #ccc;"><i class="fas fa-grip-vertical"></i></td>
                    <td>${label}</td>
                    <td style="text-align: center;"><input type="checkbox" class="fix-col-check"></td>
                    <td style="text-align: center;"><i class="fas fa-trash-alt remove-col-btn" style="color: #ff4d4f; cursor: pointer;"></i></td>
                `;
                configTableBody.appendChild(tr);
            }
        };

        configTableBody.onclick = (e) => {
            const btn = e.target.closest('.remove-col-btn');
            if (!btn) return;
            const tr = btn.closest('tr');
            const id = tr.dataset.id;
            tr.remove();
            const leftItem = availableList.querySelector(`.col-list-item[data-id="${id}"]`);
            if (leftItem) leftItem.classList.remove('selected');
        };

        saveBtn.onclick = () => {
            const newConfig = [];
            const rows = configTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const id = row.dataset.id;
                const label = row.cells[1].textContent;
                const fixed = row.querySelector('.fix-col-check').checked;
                newConfig.push({ id, label, fixed });
            });
            currentColumnConfig = newConfig;
            modalElement.remove();
            renderPage('inventory-query');
            showToast('设置已保存', 'success');
        };
    }

    function showWarehouseJobModal() {
        const modalHtml = `
            <div class="modal-overlay show" id="warehouse-job-modal-overlay">
                <div class="modal" style="width: 450px;">
                    <div class="modal-header">
                        <span class="modal-title">库作业</span>
                        <i class="fas fa-times modal-close" id="warehouse-job-modal-close-btn"></i>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="display:block; margin-bottom:10px; font-weight:500">库作业</label>
                            <select class="form-control" style="width: 100%; color: #888;">
                                <option>请选择</option>
                                <option>重新打包</option>
                                <option>库位调整</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:10px; font-weight:500">库作业备注</label>
                            <textarea class="form-control" style="width: 100%; height: 120px; padding: 10px;" placeholder="请输入"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding: 15px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
                        <button class="btn" id="warehouse-job-modal-cancel-btn" style="border: 1px solid #d9d9d9; padding: 8px 20px;">取消</button>
                        <button class="btn btn-primary" id="warehouse-job-modal-confirm-btn" style="padding: 8px 20px;">确认</button>
                    </div>
                </div>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.innerHTML = modalHtml;
        document.body.appendChild(overlay.firstElementChild);

        const closeModal = () => {
            const el = document.getElementById('warehouse-job-modal-overlay');
            if (el) {
                el.classList.remove('show');
                setTimeout(() => el.remove(), 300);
            }
        };

        document.getElementById('warehouse-job-modal-close-btn').onclick = closeModal;
        document.getElementById('warehouse-job-modal-cancel-btn').onclick = closeModal;
        document.getElementById('warehouse-job-modal-confirm-btn').onclick = () => {
            closeModal();
            showToast('库作业操作成功', 'success');
        };
    }

    function showAddWaybillModal() {
        const modalHtml = `
            <div class="modal-overlay show" id="join-waybill-modal-overlay">
                <div class="modal" style="width: 1000px; max-width: 95vw;">
                    <div class="modal-header" style="justify-content: space-between; align-items: center; display: flex; padding: 10px 20px;">
                        <span class="modal-title" style="font-size: 16px; font-weight: bold;">加入已有运单</span>
                        <div style="display: flex; gap: 10px; color: #999;">
                            <i class="far fa-window-restore" style="cursor: pointer;"></i>
                            <i class="fas fa-times modal-close" id="join-waybill-modal-close-btn" style="cursor: pointer;"></i>
                        </div>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <label style="white-space: nowrap;">业务类型</label>
                                <select class="form-control" style="width: 150px;">
                                    <option>俄线</option>
                                    <option>海运</option>
                                    <option>空运</option>
                                </select>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; flex: 1; position: relative;">
                                <label style="white-space: nowrap;">订单号</label>
                                <div style="position: relative; flex: 1;">
                                    <input type="text" class="form-control" placeholder="请选择" id="order-no-input" style="width: 100%; border-radius: 4px;">
                                    <i class="fas fa-chevron-down" style="position: absolute; right: 10px; top: 10px; color: #ccc;"></i>
                                    
                                    <!-- Order Selection Dropdown Table -->
                                    <div id="order-dropdown" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; border: 1px solid #d9d9d9; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 100; border-radius: 4px; margin-top: 5px;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <thead style="background: #fafafa;">
                                                <tr>
                                                    <th style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: left;">工作单号</th>
                                                    <th style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: left;">客户</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style="cursor: pointer; background: #e6f7ff;" onmouseover="this.style.background='#e6f7ff'" onmouseout="this.style.background='#e6f7ff'">
                                                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">12512-0002</td>
                                                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">贝塔测试科技有限公司/操作部</td>
                                                </tr>
                                                <tr style="cursor: pointer;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                                                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">Hebao0001</td>
                                                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">贝塔测试科技有限公司/操作部</td>
                                                </tr>
                                                <tr style="cursor: pointer;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                                                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">HebaoTest03</td>
                                                    <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">贝塔测试科技有限公司/操作部</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style="padding: 8px; display: flex; align-items: center; justify-content: flex-end; gap: 10px; border-top: 1px solid #f0f0f0; font-size: 12px;">
                                            <select class="form-control" style="width: auto; height: 24px; padding: 0 5px; font-size: 12px;"><option>100条/页</option></select>
                                            <i class="fas fa-angle-double-left"></i>
                                            <i class="fas fa-angle-left"></i>
                                            <span style="color: var(--primary-color);">1</span>
                                            <i class="fas fa-angle-right"></i>
                                            <i class="fas fa-angle-double-right"></i>
                                            <span>前往 <input type="text" value="1" style="width: 20px; text-align: center;"> 页 共 12 条记录</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="table-container" style="border: 1px solid #f0f0f0; border-radius: 4px;">
                            <table style="width: 100%;">
                                <thead style="background: #fafafa;">
                                    <tr>
                                        <th style="width: 50px;">#</th>
                                        <th>入库单号</th>
                                        <th>客户</th>
                                        <th>品名</th>
                                        <th>件数</th>
                                        <th>毛重</th>
                                        <th>体积</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>20251201115</td>
                                        <td>MSK</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
                        <button class="btn" id="join-waybill-modal-cancel-btn" style="border: 1px solid #d9d9d9; padding: 6px 20px; border-radius: 4px;">取消</button>
                        <button class="btn btn-primary" id="join-waybill-modal-confirm-btn" style="padding: 6px 20px; border-radius: 4px;">确认</button>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div.firstElementChild);

        const overlay = document.getElementById('join-waybill-modal-overlay');
        const closeModal = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };

        document.getElementById('join-waybill-modal-close-btn').onclick = closeModal;
        document.getElementById('join-waybill-modal-cancel-btn').onclick = closeModal;
        document.getElementById('join-waybill-modal-confirm-btn').onclick = () => {
            closeModal();
            showToast('已成功加入运单', 'success');
        };

        // Dropdown toggle logic
        const input = document.getElementById('order-no-input');
        const dropdown = document.getElementById('order-dropdown');
        input.onclick = (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== input) {
                dropdown.style.display = 'none';
            }
        });
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
