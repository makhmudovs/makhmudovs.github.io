// Dynamic Data Store for the Payment API Integration Guide
const guideData = {
    title: "Payment API Integration Guide",
    lead: "Integration reference for Deposit and Auto Withdrawal APIs, including request parameters, signatures, and response examples.",
    legend: [
        { type: "EXTERNAL", label: "External:", desc: "Endpoints that <strong>your system</strong> must implement. The payment platform will send requests to you." },
        { type: "INTERNAL", label: "Internal:", desc: "Endpoints provided by the <strong>payment platform</strong>. Your system will call these." }
    ],
    sections: [
        {
            id: "deposit-api",
            title: "Deposit API",
            type: "ext",
            items: [
                {
                    id: "1-create-pending-deposit-order",
                    title: "1. Create Pending Deposit Order",
                    badge: "EXTERNAL",
                    endpoint: { method: "POST", path: "{your.domain}/{any path your system}/deposit" },
                    contentType: "application/json",
                    paragraphs: ["Create this endpoint in your system to receive pending deposit orders."],
                    parameters: [
                        { name: "billno", type: "String", desc: "Deposit order ID" },
                        { name: "amount", type: "Double", desc: "Order amount" },
                        { name: "userid", type: "String", desc: "Username" },
                        { name: "ip", type: "String", desc: "User IP address" },
                        { name: "type", type: "Integer", desc: "Payment method ID; see Payment Type Appendix" },
                        { name: "remark", type: "String", desc: "Remark" },
                        { name: "usdtAmount", type: "Double", desc: "USDT amount for USDT payment methods" },
                        { name: "usdtRate", type: "Double", desc: "Conversion rate for USDT payment methods" }
                    ],
                    security: {
                        desc: "The payment platform appends <code>RequestTime</code> and <code>Sign</code> to the request URL. Calculate the signature using SHA-256:",
                        formula: "Sign = SHA-256(SECRET_KEY + RequestTime)",
                        codeLang: "java",
                        code: 'String postUrl = url + "?RequestTime=" + RequestTime + "&Sign=" + Sign;'
                    },
                    requestExample: `{\n  "billno": "D20260522202809AMXA",\n  "amount": 250000.0,\n  "userid": "user001",\n  "ip": "7.7.7.7",\n  "type": 43,\n  "remark": "D20260522202809AMXA|test order",\n  "usdtAmount": 0.0,\n  "usdtRate": 0.0\n}`,
                    note: {
                        title: "Payment Page Redirect",
                        html: "<p>We will provide a link to redirect the user along with their username. Then we will create a deposit order in your system and update its status once the user has paid.</p><p>Replace <code>%s</code> with the username before redirecting.</p><p>Example:</p><pre data-lang=\"text\">https://{payment.domain}/page.htm?pid=sp-off&accid=0&lname=%s</pre><p>You can also include the deposit amount using the <code>amount</code> query parameter.</p>"
                    }
                },
                {
                    id: "2-update-pending-deposit-order",
                    title: "2. Update Pending Deposit Order",
                    badge: "EXTERNAL",
                    endpoint: { method: "POST", path: "{your.domain}/{any path your system}/deposit/save" },
                    contentType: "application/json",
                    paragraphs: ["Updates a pending deposit order to successful after payment."],
                    parameters: [
                        { name: "billno", type: "String", desc: "Deposit order ID" },
                        { name: "amount", type: "Double", desc: "Order amount" },
                        { name: "currencytype", type: "String", desc: "Currency code: <code>VND</code>" },
                        { name: "date", type: "String", desc: "Date in <code>yyyyMMdd</code> format" },
                        { name: "type", type: "Integer", desc: "Payment method ID; see Payment Type Appendix" },
                        { name: "succ", type: "String", desc: 'Fixed value: <code>"0000"</code>' }
                    ],
                    security: {
                        desc: "The payment platform appends <code>RequestTime</code> and <code>Sign</code> to the request URL. Calculate the signature using SHA-256:",
                        formula: "Sign = SHA-256(SECRET_KEY + RequestTime)",
                        codeLang: "java",
                        code: 'String postUrl = url + "?RequestTime=" + RequestTime + "&Sign=" + Sign;'
                    },
                    requestExample: `{\n  "billno": "D20260522202809AMXA",\n  "currencytype": "VND",\n  "amount": 250000.0,\n  "date": "20260522",\n  "succ": "0000",\n  "type": 43\n}`,
                    note: {
                        title: "Amount Mismatch",
                        html: "<p>When updating a pending order to successful, return an error if the order amount does not match.</p><p>Use one of the following error messages so the payment platform can handle the amount mismatch:</p><div class=\"tw\"><table><thead><tr><th>Language</th><th>Error message (<code>msg</code>)</th></tr></thead><tbody><tr><td>Vietnamese</td><td><code>Số tiền không khớp với</code></td></tr><tr><td>Chinese</td><td><code>金额不一致</code></td></tr></tbody></table></div>"
                    }
                },
                {
                    id: "response-format",
                    title: "Response Format",
                    paragraphs: ["Your system must return the following response format for both deposit endpoints."],
                    parameters: [
                        { name: "success", type: "Boolean", desc: "Whether the request succeeded" },
                        { name: "msg", type: "String", desc: "Error message" },
                        { name: "error_code", type: "Integer", desc: "<code>0</code> for success; other values indicate an error" },
                        { name: "data", type: "String", desc: "Response data; <code>null</code> in the provided example" }
                    ],
                    requestExample: `{\n  "success": true,\n  "msg": "",\n  "error_code": 0,\n  "data": null\n}`
                },
                {
                    id: "payment-type-appendix",
                    title: "Payment Type Appendix",
                    table: {
                        headers: ["Payment name", "Payment ID"],
                        rows: [
                            ["SafePay Offline", "34"], ["KPay Offline", "43"], ["UPay Offline", "50"],
                            ["UPay USDT", "52"], ["PanPay Offline", "57"], ["AeePay Offline", "58"],
                            ["OKPay Offline", "59"], ["NPay USDT", "60"], ["PPPay Offline", "62"],
                            ["DayangPay Offline", "65"], ["MHpay Offline", "70"], ["YTPay Offline", "71"],
                            ["518Pay Offline", "72"], ["518Pay MOMO", "73"], ["518Pay ZALO", "74"], ["518Pay VIETTEL", "75"]
                        ]
                    }
                }
            ]
        },
        {
            id: "auto-withdrawal-api",
            title: "Auto Withdrawal API",
            type: "int",
            items: [
                {
                    id: "1-submit-withdrawal-order",
                    title: "1. Submit Withdrawal Order",
                    badge: "INTERNAL",
                    endpoint: { method: "POST", path: "{API_DOMAIN}/api/autopayoutvnd" },
                    contentType: "application/x-www-form-urlencoded",
                    paragraphs: ["Your system calls this API to submit a withdrawal order."],
                    parameters: [
                        { name: "agentId", type: "Yes", desc: "PM username processing this order" },
                        { name: "pname", type: "Yes", desc: "Third-party payment name, for example <code>kp-api</code>" },
                        { name: "pid", type: "Yes", desc: "Third-party payment ID" },
                        { name: "wid", type: "Yes", desc: "Withdrawal ID in your system" },
                        { name: "user", type: "Yes", desc: "Username" },
                        { name: "bankCode", type: "Yes", desc: "VN bank code; see Bank Code Appendix" },
                        { name: "accNo", type: "Yes", desc: "User bank account number or crypto wallet address" },
                        { name: "accName", type: "Yes", desc: "User bank account name" },
                        { name: "amount", type: "Yes", desc: "Order amount, supplied as an integer" },
                        { name: "phone", type: "Optional", desc: "Phone number" },
                        { name: "bankBranch", type: "Optional", desc: "Bank branch" }
                    ],
                    note: {
                        title: "USDT Withdrawals",
                        html: "<p>For USDT withdrawals, send <code>amount</code> in VND. The payment platform performs the conversion.</p>"
                    },
                    requestExample: `{\n  "code": "00",\n  "msg": "success"\n}`
                },
                {
                    id: "2-bank-code-appendix",
                    title: "2. Bank Code Appendix",
                    table: {
                        headers: ["Bank code", "Bank name"],
                        rows: [
                            ["VCB", "Vietcombank"], ["ACB", "Asia Commercial Bank"], ["SACOM", "Sacombank"],
                            ["TCB", "Techcombank"], ["DAB", "Dong A Bank"], ["VTB", "Vietinbank"],
                            ["BIDV", "BIDV"], ["EXIM", "Eximbank"], ["AGRI", "Agribank"],
                            ["VPB", "VPBank"], ["MBB", "MBBank"], ["VIB", "Vietnam International Bank"],
                            ["SHB", "SHB Bank"], ["HDB", "HDBank"], ["MSB", "Maritime Bank"],
                            ["TPB", "TPBank"], ["LVB", "LienViet Post Bank"], ["PVCOM", "PVcomBank"],
                            ["NAB", "Nam A Bank"], ["BVB", "BanViet Bank"], ["SEA", "SeABank"],
                            ["SCB", "SCB Bank"], ["OCB", "OCB Bank"], ["ABB", "An Binh Bank"],
                            ["SHIN", "Shinhan Bank Vietnam"], ["KIEN", "Kien Long Bank"], ["NCB", "NCB Bank"],
                            ["BACA", "Bac A Bank"], ["OCEAN", "Ocean Bank"], ["BAOVIET", "BaoViet Bank"],
                            ["HSBC", "HSBC Vietnam"], ["CAKE", "Cake Digital Bank"], ["WOORI", "Woori Bank Vietnam"],
                            ["GPBank", "GPBank"], ["PGBank", "PGBank"], ["LioBank", "LioBank"],
                            ["IVB", "Indovina Bank"], ["TIMO", "Timo Digital Bank"], ["CIMB", "CIMB Bank Vietnam"],
                            ["CITI", "Citibank Vietnam"], ["VIETABANK", "Viet A Bank"], ["VIETBANK", "VietBank"],
                            ["VIKKI", "Vikki Digital Bank"], ["MBV", "Modern Bank of Vietnam"], ["VCCB", "Vietnam Capital Bank"],
                            ["USDT_TRC20", "USDT Tether (TRC20)"], ["USDT_BEP20", "USDT Tether (BEP20)"], ["UCOIN", "UCoin"],
                            ["LPBank", "Lien Phat Bank (LPBank)"], ["COOPBANK", "Cooperative Bank"], ["SaigonBank", "Saigon Bank"],
                            ["MOMO", "MoMo E-Wallet"]
                        ]
                    }
                },
                {
                    id: "3-create-pending-auto-withdrawal",
                    title: "3. Create Pending Auto Withdrawal",
                    badge: "EXTERNAL",
                    endpoint: { method: "POST", path: "{your.domain}/{any path your system}/autowithdrawal/pending" },
                    contentType: "application/json",
                    paragraphs: ["Create this endpoint in your system to handle pending auto withdrawal requests from the payment platform."],
                    parameters: [
                        { name: "agentId", type: "String", desc: "PM username processing this order" },
                        { name: "agentIp", type: "String", desc: "Request IP address" },
                        { name: "wid", type: "String", desc: "Withdrawal ID in your system" },
                        { name: "userName", type: "String", desc: "Username" },
                        { name: "amount", type: "Integer", desc: "Order amount" },
                        { name: "accNo", type: "String", desc: "Bank account number" },
                        { name: "accName", type: "String", desc: "Bank account holder name" },
                        { name: "bankCode", type: "String", desc: "Bank code" },
                        { name: "remark", type: "String", desc: "Remark; save the value exactly as received" },
                        { name: "usdtAmount", type: "Double", desc: "USDT amount for USDT payment methods" },
                        { name: "usdtRate", type: "Double", desc: "Conversion rate for USDT payment methods" },
                        { name: "awId", type: "String", desc: "Auto Withdrawal order ID" }
                    ],
                    security: {
                        desc: "The payment platform appends <code>RequestTime</code> and <code>Sign</code> to the request URL.",
                        formula: "Sign = SHA-256(SECRET_KEY + RequestTime)",
                        codeLang: "java",
                        code: 'String postUrl = url + "?RequestTime=" + RequestTime + "&Sign=" + Sign;'
                    },
                    requestExample: `{\n  "agentId": "payment01",\n  "agentIp": "7.7.7.7",\n  "wid": "wd_001",\n  "userName": "user001",\n  "amount": 500000,\n  "accNo": "7997779977999",\n  "accName": "Tran Su Lee",\n  "bankCode": "TCB",\n  "remark": "sp-api|MC_2020000000|AWSP0PP260622164755SI5V",\n  "usdtAmount": 0.0,\n  "usdtRate": 0.0,\n  "awId": "AWSP0PP260622164755SI5V"\n}`,
                    note: { title: "Note", html: "<p>Save the remark exactly as received. Return the saved <code>remark</code> unchanged when searching for pending withdrawals.</p>" }
                },
                {
                    id: "4-update-auto-withdrawal-order-status-success",
                    title: "4. Update Auto Withdrawal Order Status — Success",
                    badge: "EXTERNAL",
                    endpoint: { method: "POST", path: "{your.domain}/{any path your system}/autowithdrawal/success" },
                    contentType: "application/json",
                    paragraphs: ["Create this endpoint in your system to mark an auto withdrawal order as successful."],
                    parameters: [
                        { name: "wid", type: "String", desc: "Withdrawal ID in your system" },
                        { name: "remark", type: "String", desc: "Remark, if any" }
                    ],
                    requestExample: `{\n  "wid": "wd_001",\n  "remark": "Test purpose only"\n}`
                },
                {
                    id: "5-update-auto-withdrawal-order-status-failed",
                    title: "5. Update Auto Withdrawal Order Status — Failed",
                    badge: "EXTERNAL",
                    endpoint: { method: "POST", path: "{your.domain}/{any path your system}/autowithdrawal/reject" },
                    contentType: "application/json",
                    paragraphs: ["Create this endpoint in your system to mark an auto withdrawal order as rejected."],
                    parameters: [
                        { name: "wid", type: "String", desc: "Withdrawal ID in your system" },
                        { name: "remark", type: "String", desc: "Remark, if any" }
                    ],
                    requestExample: `{\n  "wid": "wd_001",\n  "remark": "Test purpose only"\n}`
                },
                {
                    id: "6-get-pending-withdrawal-order-list",
                    title: "6. Get Pending Withdrawal Order List",
                    badge: "EXTERNAL",
                    endpoint: { method: "POST", path: "{your.domain}/{any path your system}/autowithdrawal/search" },
                    contentType: "application/json",
                    paragraphs: ["Create this endpoint in your system to return pending auto withdrawal orders within the requested date range."],
                    parameters: [
                        { name: "fromDate", type: "String", desc: "Start date in <code>yyyy-MM-dd'T'HH:mm:ssXXX</code> format" },
                        { name: "tillDate", type: "String", desc: "End date in <code>yyyy-MM-dd'T'HH:mm:ssXXX</code> format" }
                    ],
                    requestExample: `{\n  "fromDate": "2026-06-12T16:57:39+08:00",\n  "tillDate": "2026-06-22T16:57:39+08:00"\n}`
                },
                {
                    id: "7-get-balance-api",
                    title: "7. Get Balance API",
                    badge: "INTERNAL",
                    endpoint: { method: "POST", path: "{API_DOMAIN}/api/balancevnd" },
                    contentType: "application/x-www-form-urlencoded",
                    paragraphs: ["Your system calls this API to query a third-party payment provider's balance."],
                    parameters: [
                        { name: "pname", type: "Yes", desc: "Third-party payment name, for example <code>kp-api</code>" },
                        { name: "pid", type: "Yes", desc: "Third-party payment ID" }
                    ],
                    requestExample: `{\n  "msg": "Get balance success",\n  "code": "00",\n  "balance": 0,\n  "pname": "upay-api",\n  "pid": "MC_2020000000"\n}`
                }
            ]
        },
        {
            id: "exchange-rate-api",
            title: "Get Exchange Rate (VND-USDT)",
            type: "int",
            items: [
                {
                    id: "get-exchange-rate-vnd-usdt",
                    title: "Get Exchange Rate (VND-USDT)",
                    badge: "INTERNAL",
                    paragraphs: [
                        "Returns available VND-USDT conversion rates for both deposits and withdrawals, if this service is available.",
                        "<strong>Test URL:</strong> <code>https://test.bankgo.co/get-usdt-vnd-rate</code>",
                        "<strong>Production URL:</strong> Will be provided once available."
                    ],
                    table: {
                        headers: ["Name", "Data type", "Description"],
                        rows: [
                            ["payName", "String", "Third-party payment name"],
                            ["deposit_rate", "Number", "Deposit conversion rate"],
                            ["payout_rate", "Number", "Payout conversion rate"],
                            ["rateType", "String", "<code>fixed</code> or <code>market</code>"]
                        ]
                    },
                    requestExample: `{\n  "data": [\n    {\n      "payName": "npay",\n      "deposit_rate": 26000,\n      "payout_rate": 27500,\n      "rateType": "fixed"\n    }\n  ],\n  "success": true,\n  "msg": "success"\n}`
                }
            ]
        }
    ]
};

// Application Initialization & Dynamic Renderer
document.addEventListener("DOMContentLoaded", () => {
    // Theme Management
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", savedTheme);

    document.getElementById("themeToggle").addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });

    renderApp();
    setupSearch();
});

function renderApp() {
    const docContainer = document.getElementById("docContent");
    const sidebarNav = document.getElementById("sidebarNav");

    let docHTML = `
        <h1 id="payment-api-integration-guide">${guideData.title}</h1>
        <p class="lead">${guideData.lead}</p>
        <div class="legend"><b>API Ownership Legend</b><ul>
    `;
    
    guideData.legend.forEach(item => {
        docHTML += `<li><span class="bg ${item.type}">${item.type}</span> <strong>${item.label}</strong> ${item.desc}</li>`;
    });
    docHTML += `</ul></div>`;

    let navHTML = `<li><a href="#payment-api-integration-guide" class="on">${guideData.title}</a></li>`;
    navHTML += `<li><a href="#contents">Contents</a></li>`;

    guideData.sections.forEach(sec => {
        navHTML += `<li><a href="#${sec.id}">${sec.title}</a><ul>`;
        
        docHTML += `<section class="card ${sec.type || ''}"><h2 id="${sec.id}">${sec.title}</h2>`;

        sec.items.forEach(item => {
            navHTML += `<li><a href="#${item.id}">${item.title.replace(/<[^>]*>?/gm, '')}</a></li>`;
            
            docHTML += `<div id="${item.id}"></div>`;
            docHTML += `<h3>${item.title} ${item.badge ? `<span class="bg ${item.badge}">${item.badge}</span>` : ''}</h3>`;

            if (item.endpoint) {
                docHTML += `<div class="ep"><span class="m">${item.endpoint.method}</span><code>${item.endpoint.path}</code></div>`;
                docHTML += `<p><strong>Content-Type:</strong> <code>${item.contentType}</code></p>`;
            }

            if (item.paragraphs) {
                item.paragraphs.forEach(p => docHTML += `<p>${p}</p>`);
            }

            if (item.parameters) {
                docHTML += `<h4>Parameters</h4><div class="tw"><table><thead><tr><th>Name</th><th>Data type / Req</th><th>Description</th></tr></thead><tbody>`;
                item.parameters.forEach(param => {
                    docHTML += `<tr><td><code>${param.name}</code></td><td>${param.type}</td><td>${param.desc}</td></tr>`;
                });
                docHTML += `</tbody></table></div>`;
            }

            if (item.security) {
                docHTML += `<h4>Security</h4><p>${item.security.desc}</p>`;
                docHTML += `<pre data-lang="text"><code>${item.security.formula}</code></pre>`;
                if (item.security.code) {
                    docHTML += `<p>Java URL construction:</p>`;
                    docHTML += `<pre data-lang="${item.security.codeLang}"><code>${escapeHtml(item.security.code)}</code></pre>`;
                }
            }

            if (item.table) {
                docHTML += `<div class="tw"><table><thead><tr>`;
                item.table.headers.forEach(h => docHTML += `<th>${h}</th>`);
                docHTML += `</tr></thead><tbody>`;
                item.table.rows.forEach(row => {
                    docHTML += `<tr>`;
                    row.forEach(cell => docHTML += `<td>${cell}</td>`);
                    docHTML += `</tr>`;
                });
                docHTML += `</tbody></table></div>`;
            }

            if (item.requestExample) {
                docHTML += `<h4>Request Example / Response Example</h4><pre data-lang="json"><code>${escapeHtml(item.requestExample)}</code></pre>`;
            }

            if (item.note) {
                docHTML += `<div class="note"><b>${item.note.title}</b>${item.note.html}</div>`;
            }
        });

        docHTML += `</section>`;
        navHTML += `</ul></li>`;
    });

    docContainer.innerHTML = docHTML;
    sidebarNav.innerHTML = navHTML;
    setupScrollSpy();
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function setupScrollSpy() {
    const side = document.querySelector('.side');
    if (matchMedia('(max-width:1060px)').matches && side) side.removeAttribute('open');
    
    const links = {};
    document.querySelectorAll('.side a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) links[href.slice(1)] = a;
    });

    let currentActive = null;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const targetLink = links[e.target.id];
                if (targetLink) {
                    if (currentActive) currentActive.classList.remove('on');
                    targetLink.classList.add('on');
                    currentActive = targetLink;
                }
            }
        });
    }, { rootMargin: '0px 0px -75% 0px' });

    document.querySelectorAll('.doc h2[id], .doc h3[id], .doc h1[id]').forEach(h => observer.observe(h));
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".doc .card, .doc h1, .doc .lead, .doc .legend");

        if (!term) {
            document.querySelectorAll(".doc section, .doc .card, .doc h3, .doc p").forEach(el => el.style.display = "");
            return;
        }

        document.querySelectorAll(".doc h3").forEach(h3 => {
            const card = h3.closest(".card") || h3.nextElementSibling;
            const text = h3.textContent.toLowerCase();
            if (text.includes(term)) {
                if (card) card.style.display = "";
                h3.style.display = "";
            } else {
                // Check if any table or content inside matches
                if (card && card.textContent.toLowerCase().includes(term)) {
                    card.style.display = "";
                } else {
                    if (card) card.style.display = "none";
                }
            }
        });
    });
}