// Navigation and Page Rendering Logic

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content');
    const navItems = document.querySelectorAll('.nav-item, .nav-sub-item');
    const parents = document.querySelectorAll('.nav-item.parent');

    // Sidebar interaction
    parents.forEach(parent => {
        parent.addEventListener('click', (e) => {
            e.stopPropagation();
            parent.classList.toggle('expanded');
            const menuId = parent.getAttribute('data-menu');
            const subMenu = document.getElementById(`menu-${menuId}`);
            if (subMenu) {
                subMenu.style.display = parent.classList.contains('expanded') ? 'block' : 'none';
            }
        });
    });

    // Page routing
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('parent')) return;
            e.stopPropagation();

            // Deactivate all
            navItems.forEach(i => i.classList.remove('active'));
            // Activate current
            item.classList.add('active');

            const page = item.getAttribute('data-page');
            if (page) {
                renderPage(page);
            }
        });
    });

    // Initial page
    renderPage('inventory');
});

function renderPage(pageId) {
    const contentArea = document.getElementById('content');
    let html = '';

    switch (pageId) {
        case 'inventory':
            html = renderInventoryPage();
            break;
        case 'packing':
            html = renderPackingPage();
            break;
        case 'declaration':
            html = renderDeclarationPage();
            break;
        default:
            html = `<div class="card"><h2>${pageId} 页面正在开发中...</h2></div>`;
    }

    contentArea.innerHTML = html;

    // Attach event listeners for the new content if needed
    attachPageEvents(pageId);
}

function renderInventoryPage() {
    return `
        <div class="breadcrumb">首页 / 仓库 / 库存查询</div>
        <div class="card">
            <div class="search-form">
                <div class="form-item"><label>仓库</label><select><option>请选择仓库</option></select></div>
                <div class="form-item"><label>客户</label><input type="text" placeholder="客户代码/名称/简称/英文名称"></div>
                <div class="form-item"><label>业务员</label><select><option>请选择</option></select></div>
                <div class="form-item"><label>中文/英文品名</label><input type="text"></div>
                <div class="form-item"><label>包裹编号</label><input type="text"></div>
                <div class="form-item">
                    <label>报单状态</label>
                    <div style="display:flex; gap:10px;">
                        <label style="width:auto;"><input type="radio" name="status" checked> 全部</label>
                        <label style="width:auto;"><input type="radio" name="status"> 未报单</label>
                        <label style="width:auto;"><input type="radio" name="status"> 已报单</label>
                    </div>
                </div>
                <div class="form-item">
                    <label>查询类别</label>
                    <div style="display:flex; gap:10px;">
                        <label style="width:auto;"><input type="radio" name="type" checked> 全部</label>
                        <label style="width:auto;"><input type="radio" name="type"> 成品</label>
                        <label style="width:auto;"><input type="radio" name="type"> 预报</label>
                    </div>
                </div>
                <div class="form-item">
                    <button class="btn-blue" style="width: 80px;">查询</button>
                    <i class="far fa-question-circle" style="color: #ccc; cursor: help; margin-left: 5px;"></i>
                </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 10px;">
                <i class="fas fa-file-export" title="导出" style="cursor:pointer; color: #666;"></i>
                <i class="fas fa-cog" title="列设置" style="cursor:pointer; color: #666;"></i>
            </div>

            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox"></th>
                        <th>#</th>
                        <th>仓库</th>
                        <th>库位</th>
                        <th>业务员</th>
                        <th>是否报单</th>
                        <th>客户代码</th>
                        <th>客户名称</th>
                        <th>客户简称</th>
                        <th>包裹唛头</th>
                        <th>品名</th>
                        <th>英文品名</th>
                        <th>单位</th>
                        <th>单件重量</th>
                        <th>总重量</th>
                        <th>总体积</th>
                        <th>SKU NO</th>
                    </tr>
                </thead>
                <tbody>
                    ${MOCK_DATA.inventory.map((item, index) => `
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>${index + 1}</td>
                            <td>${item.warehouse}</td>
                            <td>${item.pos}</td>
                            <td>${item.business}</td>
                            <td>${item.status}</td>
                            <td>${item.clientCode}</td>
                            <td>${item.clientName}</td>
                            <td>${item.clientAlias}</td>
                            <td>${item.packNo}</td>
                            <td>${item.name}</td>
                            <td>${item.enName}</td>
                            <td>${item.unit}</td>
                            <td>${item.weight}</td>
                            <td>${item.totalWeight}</td>
                            <td>${item.totalVolume}</td>
                            <td>${item.sku}</td>
                        </tr>
                    `).join('')}
                    <tr style="background: #fafafa; font-weight: bold;">
                        <td colspan="13">合计</td>
                        <td></td>
                        <td>100</td>
                        <td>20000.00</td>
                        <td>180.03</td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination">
                <select><option>100条/页</option></select>
                <span class="page-link"><i class="fas fa-chevron-left"></i></span>
                <span class="page-btn active">1</span>
                <span class="page-link"><i class="fas fa-chevron-right"></i></span>
                <span>前往 <input type="text" value="1" style="width: 30px; text-align: center;"> 页 共 4 条记录</span>
            </div>
        </div>
    `;
}

function renderPackingPage() {
    return `
        <div class="breadcrumb">首页 / 仓库 / 打包作业</div>
        <div class="card">
            <div class="tabs">
                <div class="tab active">未打包(4)</div>
                <div class="tab">待打包</div>
                <div class="tab">待二次打包确认</div>
                <div class="tab">待重新打包</div>
                <div class="tab">已打包(1)</div>
            </div>
            
            <div class="search-form">
                <div class="form-item"><label>筛选仓库</label><select><option>请选择仓库</option></select></div>
                <div class="form-item"><label>入仓日期</label><input type="date"> <span style="margin: 0 5px;">至</span> <input type="date"></div>
                <div class="form-item"><label>关键字</label><select style="width: 80px;"><option>入仓单号</option></select><input type="text" placeholder="入仓单号/快递单号"></div>
                <div class="form-item"><label>客户</label><input type="text" placeholder="客户代码/客户名称/简称/英文名称"></div>
                <div class="form-item"><label>作业完成</label><select><option>请选择</option></select></div>
                <div class="form-item"><button class="btn-blue"><i class="fas fa-search"></i> 查询</button></div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 10px;">
                <i class="fas fa-file-export" title="导出" style="cursor:pointer; color: #666;"></i>
                <i class="fas fa-cog" title="列设置" style="cursor:pointer; color: #666;"></i>
            </div>

            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox"></th>
                        <th>所在仓库</th>
                        <th>现属机构</th>
                        <th>入仓单号</th>
                        <th>客户名称</th>
                        <th>业务员</th>
                        <th>入仓小单号</th>
                        <th>品名</th>
                        <th>快递单号</th>
                        <th>件数</th>
                        <th>总重量(KG)</th>
                        <th>总体积</th>
                    </tr>
                </thead>
                <tbody>
                    ${MOCK_DATA.packing.map(item => `
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>${item.warehouse}</td>
                            <td>${item.currentOrg}</td>
                            <td>${item.entryNo} <i class="far fa-edit" style="color: var(--primary-color);"></i></td>
                            <td>${item.client}</td>
                            <td>${item.sales}</td>
                            <td>${item.packSubNo}</td>
                            <td>${item.packName}</td>
                            <td>${item.expressNo}</td>
                            <td>${item.quantity}</td>
                            <td>${item.weight.toFixed(3)}</td>
                            <td>${item.volume.toFixed(3)}</td>
                        </tr>
                    `).join('')}
                    <tr style="background: #fafafa; font-weight: bold;">
                        <td colspan="9"></td>
                        <td>142</td>
                        <td>500.000</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <div class="action-bar">
                <button class="btn-blue">申请打包</button>
            </div>

            <div class="pagination">
                <select><option>100条/页</option></select>
                <span class="page-link"><i class="fas fa-chevron-left"></i></span>
                <span class="page-btn active">1</span>
                <span class="page-link"><i class="fas fa-chevron-right"></i></span>
                <span>前往 <input type="text" value="1" style="width: 30px; text-align: center;"> 页 共 4 条记录</span>
            </div>
        </div>
    `;
}

function renderDeclarationPage() {
    return `
        <div class="breadcrumb">首页 / 仓库 / 库存</div>
        <div class="card">
            <div class="tabs">
                <div class="tab active">未报单</div>
                <div class="tab">已报单</div>
            </div>
            
            <div class="search-form">
                <div class="form-item"><label>仓库</label><select><option>请选择仓库</option></select></div>
                <div class="form-item"><label>客户</label><input type="text"></div>
                <div class="form-item"><label>业务员</label><select><option>请选择</option></select></div>
                <div class="form-item"><label>中文/英文品名</label><input type="text"></div>
                <div class="form-item"><label>包裹唛头</label><input type="text"></div>
                <div class="form-item"><button class="btn-blue" style="width: 80px;">查询</button></div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-bottom: 10px; gap: 10px;">
                <i class="fas fa-file-export" title="导出" style="cursor:pointer; color: #666;"></i>
                <i class="fas fa-cog" title="列设置" style="cursor:pointer; color: #666;"></i>
            </div>

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
                        <th>包裹唛头</th>
                        <th>品名</th>
                        <th>英文品名</th>
                        <th>条件/官方品名</th>
                        <th>件数</th>
                        <th>单件重量</th>
                        <th>总重量</th>
                        <th>总体积</th>
                        <th>包裹长度</th>
                        <th>入仓单号</th>
                        <th>最大库存天数</th>
                        <th>SKU NO</th>
                    </tr>
                </thead>
                <tbody>
                    ${MOCK_DATA.declaration.map((item, index) => `
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>${index + 1}</td>
                            <td>${item.warehouse}</td>
                            <td>${item.pos}</td>
                            <td>${item.business}</td>
                            <td>${item.clientCode}</td>
                            <td>${item.clientName}</td>
                            <td>${item.clientAlias}</td>
                            <td>${item.packNo}</td>
                            <td>${item.name}</td>
                            <td>${item.enName}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>${item.totalWeight}</td>
                            <td>${item.totalVolume}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    `).join('')}
                    <tr style="background: #fafafa; font-weight: bold;">
                        <td colspan="14">合计</td>
                        <td>100</td>
                        <td>20000.00</td>
                        <td>180.03</td>
                    </tr>
                </tbody>
            </table>

            <div class="action-bar">
                <button class="btn-blue">报单</button>
                <button style="background: white; border: 1px solid #d9d9d9; padding: 5px 12px; border-radius: 4px; cursor: pointer;">加入运单</button>
            </div>

            <div class="pagination">
                <select><option>100条/页</option></select>
                <span class="page-link"><i class="fas fa-chevron-left"></i></span>
                <span class="page-btn active">1</span>
                <span class="page-link"><i class="fas fa-chevron-right"></i></span>
                <span>前往 <input type="text" value="1" style="width: 30px; text-align: center;"> 页 共 4 条记录</span>
            </div>
        </div>
    `;
}

function attachPageEvents(pageId) {
    // Add logic for tab switching within pages
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // In a real app, this might trigger a data re-fetch
        });
    });
}
