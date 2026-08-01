// ================================================================
// واجهة المستخدم مع التصميم الجديد (Chrona 4.0) - نسخة مصححة
// ================================================================

export const HTML_PAGE = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrona — Calendar & Task Command Center</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=DM+Sans:wght@400;500;700;800&family=Noto+Sans+Arabic:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
        /* هنا سيتم وضع محتوى style.css كاملاً - اختصاراً سأضع جزءاً بسيطاً، لكن يفضل نسخ style.css بالكامل */
        /* لضمان عدم حدوث أخطاء، سأضع جميع الأنماط الأساسية مباشرة */
        :root{--accent:#7c3aed}*{box-sizing:border-box}body{font-family:'DM Sans',sans-serif}button,input,select,textarea{font:inherit}.font-display{font-family:'Space Grotesk',sans-serif}.logo-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:13px;background:linear-gradient(135deg,#8b5cf6,#4f46e5 55%,#22d3ee);color:#fff;font-family:'Space Grotesk';font-weight:800;box-shadow:0 10px 25px rgba(124,58,237,.3)}.icon-btn{display:grid;place-items:center;min-width:38px;height:38px;border-radius:12px;color:#64748b;transition:.2s}.icon-btn:hover{background:rgba(139,92,246,.11);color:#7c3aed;transform:translateY(-1px)}.dark .icon-btn{color:#a1a1aa}.avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#f43f5e);color:#fff;font-size:12px;font-weight:800;border:2px solid rgba(255,255,255,.7);box-shadow:0 4px 15px rgba(244,63,94,.22)}kbd{border:1px solid #e2e8f0;border-bottom-width:2px;border-radius:6px;padding:1px 5px;font-size:10px}.dark kbd{border-color:rgba(255,255,255,.16)}.orb{position:absolute;border-radius:999px;filter:blur(90px);opacity:.12;animation:drift 15s ease-in-out infinite}.orb-a{width:460px;height:460px;background:#8b5cf6;right:-120px;top:-150px}.orb-b{width:380px;height:380px;background:#06b6d4;left:20%;bottom:-180px;animation-delay:-6s}@keyframes drift{50%{transform:translate(40px,30px) scale(1.12)}}.mini-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}.mini-day{display:grid;place-items:center;aspect-ratio:1;border-radius:9px;font-size:11px;color:#64748b;transition:.2s}.mini-day:hover{background:rgba(139,92,246,.12);color:#7c3aed}.mini-day.is-today{background:#7c3aed;color:#fff;font-weight:700}.mini-day.is-selected{box-shadow:inset 0 0 0 1px #8b5cf6;color:#7c3aed}.cal-toggle{display:flex;align-items:center;gap:10px;width:100%;border-radius:12px;padding:9px 12px;font-size:13px;color:#64748b;transition:.2s}.cal-toggle:hover{background:rgba(139,92,246,.08)}.cal-toggle.off{opacity:.45}.dot{width:9px;height:9px;border-radius:50%}.view-btn{flex:1;border-radius:9px;padding:7px 11px;font-size:12px;font-weight:700;color:#64748b;transition:.2s}.view-btn.active{background:#ede9fe;color:#6d28d9;box-shadow:0 2px 7px rgba(124,58,237,.12)}.dark .view-btn.active{background:rgba(139,92,246,.24);color:#c4b5fd}.month-head,.month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.month-head>div{padding:12px 8px;text-align:center;font-size:11px;font-weight:800;letter-spacing:.12em;color:#94a3b8;border-bottom:1px solid #e2e8f0}.dark .month-head>div{border-color:rgba(255,255,255,.08)}.month-cell{position:relative;min-height:128px;padding:9px;border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;transition:background .2s}.month-cell:nth-child(7n){border-right:0}.dark .month-cell{border-color:rgba(255,255,255,.075)}.month-cell:hover{background:rgba(139,92,246,.045)}.day-num{display:grid;place-items:center;width:27px;height:27px;border-radius:9px;font-size:12px;font-weight:700;color:#475569}.dark .day-num{color:#d4d4d8}.outside .day-num{opacity:.28}.today .day-num{background:#7c3aed;color:#fff;box-shadow:0 5px 12px rgba(124,58,237,.35)}.event-chip{position:relative;margin-top:5px;width:100%;overflow:hidden;border-radius:7px;padding:5px 7px;text-align:left;font-size:11px;font-weight:700;white-space:nowrap;text-overflow:ellipsis;transition:.2s;animation:chipIn .3s both}.event-chip:hover{filter:brightness(1.08);transform:translateX(2px)}@keyframes chipIn{from{opacity:0;transform:translateY(4px)}}.more-chip{margin-top:4px;padding:3px;font-size:10px;font-weight:700;color:#8b5cf6}.week-wrap{overflow:auto}.week-grid{display:grid;grid-template-columns:64px repeat(7,minmax(110px,1fr));min-width:850px}.week-grid>div{border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}.dark .week-grid>div{border-color:rgba(255,255,255,.08)}.week-day-head{position:sticky;top:0;z-index:2;background:rgba(255,255,255,.95);padding:13px;text-align:center}.dark .week-day-head{background:rgba(18,18,27,.95)}.hour-label{height:64px;padding:5px 9px;text-align:right;font-size:10px;color:#94a3b8}.hour-slot{position:relative;height:64px}.hour-slot:hover{background:rgba(139,92,246,.045)}.week-event{position:absolute;z-index:1;left:4px;right:4px;border-radius:8px;padding:5px 7px;font-size:10px;font-weight:700;overflow:hidden}.agenda{padding:8px 20px 30px}.agenda-date{position:sticky;top:65px;z-index:3;padding:18px 2px 10px;background:rgba(255,255,255,.9);font:700 13px 'Space Grotesk';color:#64748b;backdrop-filter:blur(12px)}.dark .agenda-date{background:rgba(18,18,27,.9);color:#a1a1aa}.agenda-card{display:flex;align-items:center;gap:14px;margin-bottom:8px;border:1px solid #e2e8f0;border-radius:15px;padding:13px;transition:.2s}.dark .agenda-card{border-color:rgba(255,255,255,.09)}.agenda-card:hover{border-color:#a78bfa;transform:translateY(-1px);box-shadow:0 8px 24px rgba(124,58,237,.1)}.modal-backdrop{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:16px;background:rgba(5,5,12,.66);backdrop-filter:blur(8px);animation:fade .2s}.modal-card{width:min(620px,100%);max-height:90vh;overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:#fff;padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.35);animation:pop .25s cubic-bezier(.2,.8,.2,1)}.dark .modal-card{background:#15151f}@keyframes fade{from{opacity:0}}@keyframes pop{from{opacity:0;transform:translateY(15px) scale(.97)}}.field{width:100%;border:1px solid #e2e8f0;border-radius:12px;background:transparent;padding:10px 12px;outline:none;transition:.2s}.field:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.12)}.dark .field{border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.03)}.field-label{display:block;margin-bottom:6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8}.primary{border-radius:12px;background:#7c3aed;padding:10px 17px;font-weight:700;color:white;transition:.2s}.primary:hover{background:#6d28d9;transform:translateY(-1px)}.secondary{border:1px solid #e2e8f0;border-radius:12px;padding:10px 17px;font-weight:700;color:#64748b}.dark .secondary{border-color:rgba(255,255,255,.12);color:#d4d4d8}.danger{color:#e11d48}.toast{pointer-events:auto;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:#18181f;color:#fff;padding:11px 16px;font-size:13px;box-shadow:0 12px 35px rgba(0,0,0,.3);animation:toast .3s both}@keyframes toast{from{opacity:0;transform:translateY(12px)}}.search-item{display:flex;width:100%;align-items:center;gap:12px;border-radius:13px;padding:11px;text-align:left;transition:.15s}.search-item:hover,.search-item.active{background:rgba(139,92,246,.1)}.empty-state{display:grid;place-items:center;min-height:420px;text-align:center;color:#94a3b8}@media(max-width:767px){.month-cell{min-height:92px;padding:5px}.month-head>div{padding:9px 2px;font-size:9px}.event-chip{padding:4px;font-size:9px}.month-cell .event-chip:nth-of-type(n+3){display:none}.calendar-shell{border-radius:16px}.agenda{padding:5px 10px 20px}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}

        /* أنماط المصادقة والمساحة الرئيسية (اختصار) */
        .auth-screen{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 20% 20%,rgba(124,58,237,.22),transparent 38%),radial-gradient(circle at 80% 80%,rgba(6,182,212,.16),transparent 36%),#09090f;transition:opacity .3s,visibility .3s}.auth-screen.is-hidden{opacity:0;visibility:hidden}.auth-layout{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(430px,.82fr);width:min(1180px,100%);min-height:720px;overflow:hidden;border:1px solid rgba(255,255,255,.105);border-radius:34px;background:rgba(14,14,22,.88);box-shadow:0 55px 150px rgba(0,0,0,.55),0 1px 0 rgba(255,255,255,.05) inset;backdrop-filter:blur(28px)}.auth-showcase{position:relative;display:flex;overflow:hidden;flex-direction:column;padding:48px 54px;background:linear-gradient(150deg,rgba(124,58,237,.95),rgba(79,70,229,.84) 48%,rgba(20,25,48,.96));isolation:isolate}.auth-showcase-copy{margin:auto 0 52px}.eyebrow-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.09);padding:8px 12px;color:#ede9fe;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(12px)}.auth-showcase-copy h1{margin-top:22px;color:#fff;font:700 clamp(42px,5vw,66px)/.99 'Space Grotesk';letter-spacing:-.055em}.auth-showcase-copy h1 em{color:#a5f3fc;font-style:normal}.auth-showcase-copy p{max-width:500px;margin-top:24px;color:rgba(255,255,255,.72);font-size:15px;line-height:1.75}.auth-feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.auth-feature-grid>div{min-height:132px;border:1px solid rgba(255,255,255,.12);border-radius:20px;background:rgba(8,8,20,.13);padding:15px;backdrop-filter:blur(15px)}.auth-feature-grid span{display:block;color:#a5f3fc;font:800 9px 'Space Grotesk';letter-spacing:.14em}.auth-feature-grid strong{display:block;margin-top:23px;color:#fff;font-size:12px}.auth-feature-grid small{display:block;margin-top:5px;color:rgba(255,255,255,.55);font-size:9px;line-height:1.45}.auth-showcase-orbit{position:absolute;border:1px solid rgba(255,255,255,.13);border-radius:50%;pointer-events:none}.orbit-one{top:80px;right:-150px;width:390px;height:390px;animation:authOrbit 16s linear infinite}.orbit-two{top:132px;right:-92px;width:275px;height:275px;animation:authOrbit 12s linear reverse infinite}@keyframes authOrbit{to{transform:rotate(360deg)}}.auth-card-premium{width:auto;max-width:none;border:0;border-radius:0;background:linear-gradient(160deg,rgba(20,20,30,.98),rgba(12,12,19,.98));padding:54px 48px;color:#fff;box-shadow:none;backdrop-filter:none}.auth-heading{margin-top:20px}.auth-step{display:block;color:#a78bfa;font-size:9px;font-weight:900;letter-spacing:.18em}.auth-heading h2{margin-top:8px;font:700 31px 'Space Grotesk';letter-spacing:-.035em}.auth-heading p{margin-top:9px;color:#85859a;font-size:12px;line-height:1.65}.auth-tabs{display:grid;grid-template-columns:1fr 1fr;margin:27px 0 24px;border:1px solid rgba(255,255,255,.06);border-radius:13px;background:rgba(255,255,255,.035);padding:5px}.auth-tab{border-radius:10px;padding:11px;font-size:12px;font-weight:800;color:#71717a;background:transparent;border:0;cursor:pointer;transition:.2s}.auth-tab.active{background:linear-gradient(135deg,rgba(139,92,246,.28),rgba(99,102,241,.17));color:#f5f3ff;box-shadow:0 6px 20px rgba(40,20,90,.15)}.auth-field{height:48px;width:100%;border:1px solid rgba(255,255,255,.09)!important;border-radius:14px!important;background:rgba(255,255,255,.035)!important;padding:0 14px!important;color:#fff;outline:none}.auth-field::placeholder{color:#565665}.auth-field:focus{border-color:#8b5cf6!important;background:rgba(139,92,246,.055)!important;box-shadow:0 0 0 4px rgba(139,92,246,.1)!important}.auth-primary{min-height:49px;width:100%;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#6366f1 62%,#4f46e5);color:#fff;font-weight:700;border:0;cursor:pointer;transition:.2s}.auth-primary:hover{background:linear-gradient(135deg,#7c3aed,#5855e7);transform:translateY(-1px)}.auth-text-link{color:#a78bfa;font-size:11px;font-weight:800;background:transparent;border:0;cursor:pointer;transition:.2s}.auth-text-link:hover{color:#c4b5fd}.password-rule{color:#626275;font-size:9px;font-weight:800}.workspace-hidden{display:none!important}
        .task-command-shell{overflow:hidden;border:1px solid #e2e8f0;border-radius:30px;background:rgba(255,255,255,.82);box-shadow:0 28px 80px rgba(15,23,42,.09);backdrop-filter:blur(20px)}.dark .task-command-shell{border-color:rgba(255,255,255,.085);background:linear-gradient(155deg,rgba(20,20,31,.94),rgba(12,13,21,.91));box-shadow:0 30px 90px rgba(0,0,0,.27)}.task-command-top{display:flex;align-items:flex-end;justify-content:space-between;gap:25px;padding:28px 30px 18px}.task-command-kicker{color:#7c3aed;font:900 9px 'Space Grotesk';letter-spacing:.18em}.task-command-top h2{margin-top:7px;font:700 27px 'Space Grotesk';letter-spacing:-.04em}.task-command-top p{margin-top:6px;color:#94a3b8;font-size:10px}.task-command-top p b{color:#7c3aed;font-weight:900}.task-stat-ribbon{display:flex;overflow:hidden;border:1px solid #e2e8f0;border-radius:17px;background:#f8fafc}.task-stat-ribbon div{min-width:78px;padding:11px 16px;text-align:center}.task-stat-ribbon div+div{border-left:1px solid #e2e8f0}.task-stat-ribbon strong{display:block;font:700 18px 'Space Grotesk'}.task-stat-ribbon small{display:block;margin-top:2px;color:#94a3b8;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.quick-task-form{display:flex;align-items:center;gap:10px;margin:0 30px;border:1px solid rgba(124,58,237,.23);border-radius:20px;background:linear-gradient(135deg,rgba(139,92,246,.065),rgba(34,211,238,.035));padding:7px 8px 7px 14px;box-shadow:0 12px 30px rgba(99,102,241,.06);transition:.2s}.quick-task-form:focus-within{border-color:#8b5cf6;box-shadow:0 0 0 4px rgba(139,92,246,.09),0 16px 35px rgba(99,102,241,.1)}.quick-task-icon{display:grid;width:32px;height:32px;flex:0 0 auto;place-items:center;border-radius:11px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-size:18px}.quick-task-form input{min-width:0;flex:1;background:transparent;padding:8px 4px;font-size:12px;outline:0;color:inherit}.quick-task-form input::placeholder{color:#94a3b8}.quick-task-form>button{display:flex;align-items:center;gap:8px;border-radius:13px;background:#111827;padding:10px 14px;color:#fff;font-size:9px;font-weight:900;border:0;cursor:pointer;transition:.2s}.quick-task-form>button:hover{transform:translateY(-1px)}.task-toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px;border-top:1px solid #edf0f5;border-bottom:1px solid #edf0f5;padding:13px 30px}.task-filter-row,.task-category-filter{display:flex;align-items:center;gap:5px}.task-filter-row button,.task-category-filter button{border-radius:999px;padding:7px 11px;color:#94a3b8;font-size:9px;font-weight:800;text-transform:capitalize;background:transparent;border:0;cursor:pointer;transition:.18s}.task-filter-row button:hover,.task-category-filter button:hover{background:rgba(139,92,246,.07);color:#7c3aed}.task-filter-row button.active{background:#111827;color:#fff}.task-category-filter button.active{background:rgba(139,92,246,.11);color:#7c3aed}.task-search{display:flex;width:210px;align-items:center;gap:7px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;padding:7px 10px;color:#94a3b8}.task-search input{min-width:0;flex:1;background:transparent;font-size:9px;outline:0;color:inherit}.task-search small{font-size:7px;white-space:nowrap}.task-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;padding:22px 30px 30px}.task-group{min-width:0;border:1px solid #e8ebf1;border-radius:22px;background:linear-gradient(145deg,rgba(248,250,252,.88),rgba(255,255,255,.68));padding:13px}.task-group.focus-group{border-color:rgba(244,63,94,.15);background:linear-gradient(145deg,rgba(244,63,94,.045),rgba(251,146,60,.025))}.task-group.today-group{border-color:rgba(139,92,246,.17);background:linear-gradient(145deg,rgba(139,92,246,.055),rgba(99,102,241,.025))}.task-group.completed-group{opacity:.78}.task-group-head{display:flex;align-items:center;justify-content:space-between;padding:3px 4px 11px}.task-group-head span{display:block;font:700 12px 'Space Grotesk'}.task-group-head small{display:block;margin-top:2px;color:#94a3b8;font-size:8px}.task-group-head b{display:grid;width:24px;height:24px;place-items:center;border-radius:8px;background:rgba(148,163,184,.1);color:#64748b;font-size:9px}.task-list{display:grid;gap:8px}.task-card{--task-color:#8b5cf6;position:relative;display:flex;align-items:flex-start;gap:10px;border:1px solid #e5e7eb;border-radius:17px;background:rgba(255,255,255,.94);padding:12px;box-shadow:0 8px 23px rgba(15,23,42,.045);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.task-card:before{position:absolute;left:0;top:14px;bottom:14px;width:2px;border-radius:0 4px 4px 0;background:var(--task-color);content:"";opacity:.75}.task-card:hover{border-color:rgba(139,92,246,.3);transform:translateY(-2px);box-shadow:0 15px 32px rgba(15,23,42,.09)}.task-card.is-overdue{border-color:rgba(244,63,94,.2)}.task-card.is-complete{opacity:.62}.task-check{display:grid;width:25px;height:25px;flex:0 0 auto;place-items:center;border:1.5px solid #cbd5e1;border-radius:9px;color:transparent;font-size:10px;font-weight:900;cursor:pointer;transition:.18s}.task-check:hover{border-color:#10b981;background:rgba(16,185,129,.08);color:#10b981}.task-card.is-complete .task-check{border-color:#10b981;background:linear-gradient(135deg,#10b981,#0d9488);color:#fff}.task-card-body{min-width:0;flex:1}.task-title-button{display:block;width:100%;background:transparent;border:0;text-align:left;cursor:pointer;padding:0}.task-title-button strong{display:block;color:#1e293b;font-size:11px;line-height:1.45}.task-title-button small{display:-webkit-box;overflow:hidden;margin-top:3px;color:#94a3b8;font-size:8px;line-height:1.45;-webkit-line-clamp:2;-webkit-box-orient:vertical}.task-card.is-complete .task-title-button strong{text-decoration:line-through}.task-meta{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin-top:9px}.task-meta>span{display:inline-flex;align-items:center;gap:4px;border-radius:999px;padding:4px 7px;font-size:7px;font-weight:900}.task-priority{background:#f1f5f9;color:#64748b}.priority-urgent{background:rgba(244,63,94,.1)!important;color:#e11d48!important}.priority-high{background:rgba(249,115,22,.1)!important;color:#ea580c!important}.priority-low{background:rgba(14,165,233,.1)!important;color:#0284c7!important}.task-due{background:rgba(99,102,241,.08);color:#4f46e5}.task-due.overdue{background:rgba(244,63,94,.09);color:#e11d48}.task-category{background:rgba(148,163,184,.08);color:#64748b;text-transform:capitalize}.task-category i{width:5px;height:5px;border-radius:50%}.task-linked{background:rgba(16,185,129,.08);color:#059669}.subtask-progress{display:flex;align-items:center;gap:7px;margin-top:9px}.subtask-progress>span{position:relative;display:block;width:64px;height:4px;overflow:hidden;border-radius:99px;background:#e2e8f0}.subtask-progress i{position:absolute;inset:0 auto 0 0;border-radius:99px;background:linear-gradient(90deg,#10b981,#22d3ee)}.subtask-progress small{color:#94a3b8;font-size:7px}.task-card-actions{display:flex;flex:0 0 auto;align-items:center;gap:2px}.task-card-actions button{display:grid;width:25px;height:25px;place-items:center;border-radius:8px;color:#94a3b8;font-size:10px;background:transparent;border:0;cursor:pointer;transition:.18s}.task-card-actions button:hover,.task-card-actions button.active{background:rgba(139,92,246,.09);color:#7c3aed}.task-empty{grid-column:1/-1;display:grid;min-height:340px;place-items:center;align-content:center;text-align:center}.task-empty>span{display:grid;width:68px;height:68px;place-items:center;border:1px solid rgba(16,185,129,.16);border-radius:24px;background:linear-gradient(135deg,rgba(16,185,129,.11),rgba(34,211,238,.06));color:#10b981;font-size:26px}.task-empty h3{margin-top:17px;font:700 20px 'Space Grotesk'}.task-empty p{margin-top:5px;color:#94a3b8;font-size:10px}.task-empty button{margin-top:17px}.workspace-hero{position:relative;display:flex;min-height:154px;align-items:center;gap:30px;overflow:hidden;margin-bottom:18px;border:1px solid rgba(139,92,246,.18);border-radius:28px;background:linear-gradient(120deg,#171125 0%,#181730 46%,#0d2630 110%);padding:27px 30px;color:#fff;box-shadow:0 24px 70px rgba(48,28,95,.18)}.workspace-hero:before{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px);background-size:38px 38px;mask-image:linear-gradient(to right,#000,transparent 78%);content:""}.hero-glow{position:absolute;right:-70px;top:-150px;width:370px;height:370px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.26),rgba(139,92,246,.1) 42%,transparent 70%);filter:blur(5px)}.workspace-hero-copy{position:relative;z-index:2;min-width:250px;flex:1}.hero-kicker{color:#a5f3fc;font:800 9px 'Space Grotesk';letter-spacing:.18em}.workspace-hero h2{margin-top:7px;font:700 clamp(24px,3vw,36px) 'Space Grotesk';letter-spacing:-.045em}.workspace-hero p{max-width:610px;margin-top:7px;color:rgba(255,255,255,.58);font-size:11px;line-height:1.6}.hero-metrics{position:relative;z-index:2;display:flex;flex:0 0 auto;align-items:stretch;gap:8px}.hero-metric{min-width:92px;border:1px solid rgba(255,255,255,.09);border-radius:17px;background:rgba(255,255,255,.055);padding:13px 15px;text-align:left;backdrop-filter:blur(12px);transition:.2s}.hero-metric:hover{border-color:rgba(165,243,252,.3);background:rgba(255,255,255,.085);transform:translateY(-2px)}.hero-metric strong{display:block;font:700 22px 'Space Grotesk'}.hero-metric span{display:block;margin-top:3px;color:rgba(255,255,255,.48);font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.hero-action{display:flex;min-width:128px;align-items:center;justify-content:center;gap:8px;border-radius:17px;background:linear-gradient(135deg,#a78bfa,#6366f1 58%,#22d3ee 140%);padding:13px 17px;color:#fff;font-size:10px;font-weight:900;border:0;cursor:pointer;box-shadow:0 15px 32px rgba(99,102,241,.28);transition:.2s}.hero-action:hover{transform:translateY(-2px);box-shadow:0 21px 40px rgba(99,102,241,.38)}.hero-action span{font-size:18px}.admin-user-item{border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}.warning{background:#f59e0b;color:#fff;border:0;padding:6px 12px;border-radius:8px;font-weight:700;cursor:pointer}.danger{background:#ef4444;color:#fff;border:0;padding:6px 12px;border-radius:8px;font-weight:700;cursor:pointer}.language-switcher{display:inline-flex;height:38px;align-items:center;gap:5px;border:1px solid #e2e8f0;border-radius:13px;background:rgba(255,255,255,.82);padding:0 7px;color:#64748b;box-shadow:0 7px 20px rgba(15,23,42,.05);backdrop-filter:blur(14px)}.language-switcher select{cursor:pointer;border:0;background:transparent;color:inherit;font-size:9px;font-weight:900;letter-spacing:.08em;outline:0}.language-switcher>span{display:grid;width:20px;height:20px;place-items:center;border-radius:7px;background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(34,211,238,.1));color:#7c3aed;font-size:10px;font-weight:900}.logout-btn{background:#e67e22;border:0;padding:6px 14px;border-radius:10px;color:#fff;font-weight:800;font-size:12px;cursor:pointer;transition:.2s}.logout-btn:hover{background:#d35400}.alert{padding:12px;border-radius:8px;margin-bottom:16px}.alert.error{background:#fde0e0;color:#c0392b;border:1px solid #e74c3c}.alert.success{background:#d5f5e3;color:#1e8449;border:1px solid #2ecc71}.hidden{display:none!important}.tab-content{display:none}.tab-content.active{display:block}
        @media(max-width:1020px){.auth-layout{grid-template-columns:1fr;max-width:560px;min-height:0}.auth-showcase{display:none}.auth-card-premium{padding:42px;border-radius:32px}}@media(max-width:760px){.workspace-hero{min-height:0;padding:22px;flex-direction:column;align-items:flex-start}.hero-metrics{width:100%;flex-wrap:wrap;display:grid;grid-template-columns:repeat(2,1fr)}.hero-metric,.hero-action{min-width:0}.task-command-shell{border-radius:23px}.task-command-top{flex-direction:column;align-items:flex-start;padding:22px 18px 15px}.task-stat-ribbon{width:100%}.task-stat-ribbon div{min-width:0;flex:1}.quick-task-form{margin:0 18px}.quick-task-form>button{padding:10px}.task-toolbar{flex-direction:column;align-items:flex-start;padding:12px 18px}.task-toolbar-right{width:100%}.task-search{width:100%}.task-groups{grid-template-columns:1fr;padding:18px}.task-card{padding:11px}.task-card-actions{flex-direction:column}}
    </style>
</head>
<body>

<!-- شاشة المصادقة (تظهر عند عدم تسجيل الدخول) -->
<div id="authScreen" class="auth-screen">
    <div class="auth-layout">
        <!-- القسم الأيسر: العرض الترويجي -->
        <div class="auth-showcase">
            <div class="auth-brand" style="display:flex;align-items:center;gap:12px;color:#fff;">
                <div class="auth-logo logo-mark" style="width:44px;height:44px;background:rgba(255,255,255,.18);box-shadow:0 12px 35px rgba(20,10,60,.25);backdrop-filter:blur(15px);">C</div>
                <div><strong style="display:block;font:700 22px 'Space Grotesk';">Chrona</strong><small style="display:block;margin-top:1px;font-size:8px;font-weight:900;letter-spacing:.22em;opacity:.62;">PLAN · FOCUS · ACHIEVE</small></div>
            </div>
            <div class="auth-showcase-copy">
                <div class="eyebrow-pill"><i style="display:block;width:6px;height:6px;border-radius:50%;background:#67e8f9;box-shadow:0 0 15px #67e8f9;"></i> Local-first productivity</div>
                <h1>Time, <em>designed</em><br>around you.</h1>
                <p>A premium calendar with smart reminders, secure recovery and a beautifully fast workspace.</p>
            </div>
            <div class="auth-feature-grid">
                <div><span>01</span><strong>Everything in one place</strong><small>Your calendar and tasks stay synchronized automatically.</small></div>
                <div><span>02</span><strong>Private recovery</strong><small>Telegram code or your personal question.</small></div>
                <div><span>03</span><strong>Smart reminders</strong><small>Browser and Telegram, without reloads.</small></div>
            </div>
            <div class="auth-showcase-orbit orbit-one"></div>
            <div class="auth-showcase-orbit orbit-two"></div>
        </div>

        <!-- القسم الأيمن: بطاقة المصادقة -->
        <div class="auth-card-premium">
            <div class="auth-mobile-brand" style="display:flex;align-items:center;gap:10px;">
                <div class="logo-mark" style="width:38px;height:38px;font-size:16px;">C</div>
                <strong style="font:700 20px 'Space Grotesk';">Chrona</strong>
            </div>
            <div class="auth-heading">
                <span class="auth-step" id="authStep">SECURE ACCESS</span>
                <h2 id="authTitle">Welcome back</h2>
                <p id="authSubtitle">Plan time, complete tasks and keep every reminder in one calm workspace.</p>
            </div>

            <!-- أزرار التبويب -->
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="loginTab" id="loginTabBtn">Log in</button>
                <button class="auth-tab" data-tab="registerTab" id="registerTabBtn">Create account</button>
            </div>

            <!-- تبويب تسجيل الدخول -->
            <div id="loginTab" class="tab-content active">
                <div id="loginError" class="alert error hidden" data-i18n-skip></div>
                <div class="auth-form-body">
                    <div class="form-group">
                        <label class="field-label">Email</label>
                        <input type="email" id="loginUsername" class="auth-field" placeholder="you@example.com">
                    </div>
                    <div class="form-group">
                        <label class="field-label">Password</label>
                        <input type="password" id="loginPassword" class="auth-field" placeholder="Enter your password">
                    </div>
                    <button id="loginBtn" class="primary auth-primary" style="width:100%;">Log in</button>
                    <div style="margin-top:14px; display:flex; justify-content:space-between;">
                        <button id="showResetBtn" class="auth-text-link" style="background:transparent;border:0;padding:0;">Forgot password?</button>
                        <span class="password-rule">🔒 8+ characters</span>
                    </div>
                </div>
            </div>

            <!-- تبويب إنشاء حساب -->
            <div id="registerTab" class="tab-content">
                <div id="registerError" class="alert error hidden" data-i18n-skip></div>
                <div class="auth-form-body">
                    <div class="form-group">
                        <label class="field-label">Username</label>
                        <input type="text" id="regUsername" class="auth-field" placeholder="Choose a username (3+ chars)">
                    </div>
                    <div class="form-group">
                        <label class="field-label">Password</label>
                        <input type="password" id="regPassword" class="auth-field" placeholder="8+ characters">
                    </div>
                    <div class="form-group">
                        <label class="field-label">Telegram ID (for activation)</label>
                        <input type="text" id="regTelegram" class="auth-field" placeholder="Your Telegram chat_id">
                    </div>
                    <button id="registerBtn" class="primary auth-primary" style="width:100%;">Create account</button>
                    <div id="verifySection" class="hidden" style="margin-top:16px; border-top:1px solid rgba(255,255,255,.07); padding-top:16px;">
                        <h4 style="font-size:12px;">Activate account</h4>
                        <div class="form-group">
                            <label class="field-label">Verification code</label>
                            <input type="text" id="verifyCode" class="auth-field" placeholder="6-digit code from Telegram">
                        </div>
                        <button id="verifyBtn" class="secondary" style="width:100%;">Activate</button>
                    </div>
                </div>
            </div>

            <!-- تبويب استرجاع كلمة المرور (مخفى) -->
            <div id="resetTab" class="tab-content" style="display:none;">
                <div id="resetError" class="alert error hidden"></div>
                <div class="auth-form-body">
                    <div class="form-group">
                        <label class="field-label">Username or Telegram ID</label>
                        <input type="text" id="resetIdentifier" class="auth-field" placeholder="Enter your username or Telegram ID">
                    </div>
                    <button id="resetRequestBtn" class="primary auth-primary" style="width:100%;">Request reset</button>
                    <div id="resetPasswordSection" class="hidden" style="margin-top:16px; border-top:1px solid rgba(255,255,255,.07); padding-top:16px;">
                        <div class="form-group">
                            <label class="field-label">Verification code</label>
                            <input type="text" id="resetCode" class="auth-field" placeholder="6-digit code">
                        </div>
                        <div class="form-group">
                            <label class="field-label">New password</label>
                            <input type="password" id="resetNewPassword" class="auth-field" placeholder="8+ characters">
                        </div>
                        <button id="resetConfirmBtn" class="secondary" style="width:100%;">Confirm reset</button>
                    </div>
                    <button id="backToLoginBtn" class="auth-text-link" style="margin-top:12px; background:transparent; border:0; padding:0;">← Back to login</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ====== مساحة العمل ====== -->
<div id="tasksSection" class="workspace-hidden">
    <!-- الشريط العلوي -->
    <header style="display:flex; align-items:center; justify-content:space-between; padding:14px 24px; background:rgba(255,255,255,.72); backdrop-filter:blur(20px); border-bottom:1px solid #e2e8f0;">
        <div style="display:flex; align-items:center; gap:14px;">
            <button id="sidebarToggle" class="icon-btn" aria-label="Toggle sidebar">☰</button>
            <div class="logo-mark" style="width:32px; height:32px; font-size:14px;">C</div>
            <span style="font-weight:800; font-size:18px; letter-spacing:-.03em;">Chrona</span>
            <div class="language-switcher">
                <span>🌐</span>
                <select id="languageSelect" aria-label="Language">
                    <option value="en">EN</option>
                    <option value="fr">FR</option>
                    <option value="ar">AR</option>
                </select>
            </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
            <span id="displayUsername" style="font-weight:700; font-size:14px;"></span>
            <button id="logoutBtn" class="logout-btn">Sign out</button>
        </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main style="max-width:1400px; margin:0 auto; padding:20px 24px;">

        <!-- بطاقة الترحيب (Workspace Hero) -->
        <div class="workspace-hero">
            <div class="hero-glow"></div>
            <div class="workspace-hero-copy">
                <div class="hero-kicker">📋 YOUR DAILY ORBIT</div>
                <h2>Design a calmer day.</h2>
                <p id="heroStats">0 open tasks, 0 due today.</p>
            </div>
            <div class="hero-metrics">
                <div class="hero-metric">
                    <strong id="openTasksCount">0</strong>
                    <span>Open tasks</span>
                </div>
                <div class="hero-metric">
                    <strong id="todayLoad">0%</strong>
                    <span>Today's load</span>
                </div>
                <div class="hero-metric">
                    <strong id="taskProgress">0%</strong>
                    <span>Task progress</span>
                </div>
                <button id="addTaskQuickBtn" class="hero-action"><span>+</span> Create event</button>
            </div>
        </div>

        <!-- مركز المهام (Task Command Center) -->
        <div class="task-command-shell">
            <div class="task-command-top">
                <div>
                    <div class="task-command-kicker">⚡ EXECUTION STUDIO</div>
                    <h2>Move what matters.</h2>
                    <p><b id="taskCount">0</b> open tasks, <b id="dueTodayCount">0</b> due today.</p>
                </div>
                <div class="task-stat-ribbon">
                    <div><strong id="statTotal">0</strong><small>All</small></div>
                    <div><strong id="statCompleted">0</strong><small>Done</small></div>
                    <div><strong id="statPending">0</strong><small>Pending</small></div>
                </div>
            </div>

            <!-- نموذج الإضافة السريعة -->
            <div class="quick-task-form">
                <span class="quick-task-icon">+</span>
                <input type="text" id="taskTitle" placeholder="Capture a task… e.g. Send proposal @tomorrow !high #work">
                <button id="addTaskBtn">Add <kbd>⌘↵</kbd></button>
            </div>

            <!-- شريط التصفية -->
            <div class="task-toolbar">
                <div class="task-filter-row" id="taskFilterRow">
                    <button class="active" data-filter="all">All</button>
                    <button data-filter="open">Open</button>
                    <button data-filter="upcoming">Upcoming</button>
                    <button data-filter="completed">Completed</button>
                </div>
                <div class="task-toolbar-right" style="display:flex;align-items:center;gap:12px;">
                    <div class="task-category-filter" id="taskCategoryFilter">
                        <button class="active" data-category="all">All lists</button>
                        <button data-category="work">Work</button>
                        <button data-category="personal">Personal</button>
                        <button data-category="health">Health</button>
                        <button data-category="birthdays">Birthdays</button>
                    </div>
                    <div class="task-search">
                        <span>🔍</span>
                        <input type="text" id="taskSearchInput" placeholder="Filter tasks">
                        <small>⌘F</small>
                    </div>
                </div>
            </div>

            <!-- مجموعات المهام -->
            <div class="task-groups" id="taskGroups">
                <!-- سيتم ملؤها بواسطة JavaScript -->
            </div>
        </div>

        <!-- قسم المشرف (مخفي) -->
        <div id="adminSection" class="workspace-hidden" style="margin-top:30px;">
            <h2 style="color:var(--accent);">🔧 Admin Dashboard</h2>
            <button id="adminRefreshBtn" class="primary" style="margin-bottom:16px;">Refresh</button>
            <div id="adminUsersList"></div>
            <hr style="margin:20px 0;border-color:rgba(255,255,255,.1);">
            <div id="adminAllTasks"></div>
        </div>

    </main>
</div>

<script>
    // ============================================================
    // JavaScript الخاص بواجهة المستخدم (مصحح لاستخدام علامات اقتباس)
    // ============================================================

    (function() {
        // المتغيرات العامة
        let currentUser = localStorage.getItem('chrona_user') || null;
        const API_BASE = window.location.origin;
        let allTasks = [];
        let currentFilter = 'all';
        let currentCategory = 'all';
        let searchTerm = '';

        // عناصر DOM
        const authScreen = document.getElementById('authScreen');
        const tasksSection = document.getElementById('tasksSection');
        const displayUsername = document.getElementById('displayUsername');
        const openTasksCount = document.getElementById('openTasksCount');
        const todayLoad = document.getElementById('todayLoad');
        const taskProgress = document.getElementById('taskProgress');
        const heroStats = document.getElementById('heroStats');
        const taskCount = document.getElementById('taskCount');
        const dueTodayCount = document.getElementById('dueTodayCount');
        const statTotal = document.getElementById('statTotal');
        const statCompleted = document.getElementById('statCompleted');
        const statPending = document.getElementById('statPending');
        const taskGroups = document.getElementById('taskGroups');
        const adminSection = document.getElementById('adminSection');
        const adminUsersList = document.getElementById('adminUsersList');
        const adminAllTasks = document.getElementById('adminAllTasks');
        const taskTitleInput = document.getElementById('taskTitle');

        // دوال مساعدة
        function showAlert(element, message, type) {
            element.textContent = message;
            element.className = 'alert ' + (type || 'error');
            element.classList.remove('hidden');
        }
        function hideAlert(element) {
            element.classList.add('hidden');
        }

        async function apiCall(endpoint, method, body, username) {
            const headers = { 'Content-Type': 'application/json' };
            if (username) headers['X-Username'] = username;
            const options = { method: method || 'GET', headers: headers };
            if (body) options.body = JSON.stringify(body);
            const res = await fetch(API_BASE + endpoint, options);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'حدث خطأ');
            return data;
        }

        // المصادقة
        async function login(username, password) {
            const data = await apiCall('/auth/login', 'POST', { username: username, password: password });
            if (data.success) {
                currentUser = username;
                localStorage.setItem('chrona_user', username);
                showApp();
            } else {
                throw new Error(data.error || 'فشل تسجيل الدخول');
            }
        }

        async function register(username, password, telegramId) {
            const data = await apiCall('/auth/register', 'POST', { username: username, password: password, telegramId: telegramId });
            if (data.success) {
                alert('✅ تم التسجيل بنجاح. تم إرسال رمز التفعيل إلى تيليجرام.');
                document.getElementById('verifySection').classList.remove('hidden');
                document.getElementById('regUsername').disabled = true;
                document.getElementById('regPassword').disabled = true;
                document.getElementById('regTelegram').disabled = true;
                document.getElementById('registerBtn').disabled = true;
            } else {
                throw new Error(data.error || 'فشل التسجيل');
            }
        }

        async function verify(username, code) {
            const data = await apiCall('/auth/verify', 'POST', { username: username, code: code });
            if (data.success) {
                alert('✅ تم تفعيل الحساب بنجاح. يمكنك تسجيل الدخول الآن.');
                document.getElementById('verifySection').classList.add('hidden');
                switchTab('loginTab');
                document.getElementById('loginUsername').value = username;
            } else {
                throw new Error(data.error || 'فشل التفعيل');
            }
        }

        async function requestReset(identifier) {
            const data = await apiCall('/auth/reset-request', 'POST', { username: identifier, telegramId: identifier });
            if (data.success) {
                alert('✅ تم إرسال رمز إعادة التعيين إلى تيليجرام.');
                document.getElementById('resetPasswordSection').classList.remove('hidden');
            } else {
                throw new Error(data.error || 'فشل الطلب');
            }
        }

        async function confirmReset(username, code, newPassword) {
            const data = await apiCall('/auth/reset', 'POST', { username: username, code: code, newPassword: newPassword });
            if (data.success) {
                alert('✅ تم تغيير كلمة المرور بنجاح.');
                document.getElementById('resetPasswordSection').classList.add('hidden');
                switchTab('loginTab');
            } else {
                throw new Error(data.error || 'فشل التغيير');
            }
        }

        function logout() {
            currentUser = null;
            localStorage.removeItem('chrona_user');
            showAuth();
        }

        // المهام
        async function loadTasks() {
            if (!currentUser) return;
            try {
                const data = await apiCall('/tasks', 'GET', null, currentUser);
                allTasks = data.tasks || [];
                renderTasks(allTasks);
                updateStats(allTasks);
            } catch (err) {
                taskGroups.innerHTML = '<div class="alert error">' + err.message + '</div>';
            }
        }

        function updateStats(tasks) {
            var total = tasks.length;
            var completed = tasks.filter(function(t) { return t.status === 'completed'; }).length;
            var pending = tasks.filter(function(t) { return t.status === 'pending'; }).length;
            var inProgress = tasks.filter(function(t) { return t.status === 'in-progress'; }).length;
            var open = total - completed;
            var today = new Date().toISOString().split('T')[0];
            var dueToday = tasks.filter(function(t) { return t.date === today; }).length;

            openTasksCount.textContent = open;
            taskCount.textContent = open;
            dueTodayCount.textContent = dueToday;
            heroStats.textContent = open + ' open tasks, ' + dueToday + ' due today.';
            statTotal.textContent = total;
            statCompleted.textContent = completed;
            statPending.textContent = pending;

            var load = total > 0 ? Math.round((open / total) * 100) : 0;
            todayLoad.textContent = load + '%';
            var progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            taskProgress.textContent = progress + '%';
        }

        function renderTasks(tasks) {
            // تطبيق الفلاتر
            var filtered = tasks.slice();
            if (currentFilter === 'open') filtered = filtered.filter(function(t) { return t.status !== 'completed'; });
            else if (currentFilter === 'completed') filtered = filtered.filter(function(t) { return t.status === 'completed'; });
            else if (currentFilter === 'upcoming') {
                var today = new Date().toISOString().split('T')[0];
                filtered = filtered.filter(function(t) { return t.date > today && t.status !== 'completed'; });
            }
            if (currentCategory !== 'all') filtered = filtered.filter(function(t) { return t.type === currentCategory; });
            if (searchTerm) {
                var term = searchTerm.toLowerCase();
                filtered = filtered.filter(function(t) {
                    return t.title.toLowerCase().indexOf(term) !== -1 || (t.description || '').toLowerCase().indexOf(term) !== -1;
                });
            }

            var today = new Date().toISOString().split('T')[0];
            var focus = filtered.filter(function(t) { return t.status !== 'completed' && (t.pinned || t.date < today); });
            var upcoming = filtered.filter(function(t) { return t.status !== 'completed' && !t.pinned && t.date >= today; });
            var done = filtered.filter(function(t) { return t.status === 'completed'; });

            var html = '';
            if (focus.length) html += buildTaskGroup('Focus lane', 'Pinned and overdue work', focus, true);
            if (upcoming.length) html += buildTaskGroup('Today', 'The next commitments in your orbit', upcoming, false);
            if (done.length) html += buildTaskGroup('Completed', 'Momentum already created', done, false);

            if (!filtered.length) {
                html = '<div class="task-empty">' +
                    '<span>📭</span>' +
                    '<h3>No tasks in this view</h3>' +
                    '<p>Capture a task to keep your momentum visible.</p>' +
                    '<button class="primary" onclick="document.getElementById(\'taskTitle\').focus()">Add task</button>' +
                    '</div>';
            }
            taskGroups.innerHTML = html;
        }

        function buildTaskGroup(title, subtitle, tasks, isFocus) {
            if (!tasks.length) return '';
            var cls = isFocus ? 'task-group focus-group' : 'task-group today-group';
            var items = tasks.map(function(task) { return buildTaskCard(task); }).join('');
            return '<div class="' + cls + '">' +
                '<div class="task-group-head">' +
                '<div><span>' + title + '</span><small>' + subtitle + '</small></div>' +
                '<b>' + tasks.length + '</b>' +
                '</div>' +
                '<div class="task-list">' + items + '</div>' +
                '</div>';
        }

        function buildTaskCard(task) {
            var statusClass = task.status || 'pending';
            var isComplete = statusClass === 'completed';
            var overdue = task.date && task.date < new Date().toISOString().split('T')[0] && !isComplete;
            var color = task.color || '#8b5cf6';
            var priority = task.priority || 'normal';
            var priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
            var dueDate = task.date ? new Date(task.date).toLocaleDateString() : 'No due date';
            var checked = isComplete ? '✓' : '';
            var pinClass = task.pinned ? 'active' : '';

            return '<div class="task-card ' + (isComplete ? 'is-complete' : '') + (overdue ? ' is-overdue' : '') + '" style="--task-color:' + color + ';" data-id="' + task.id + '">' +
                '<div class="task-check" onclick="toggleTaskStatus(\'' + task.id + '\')">' + checked + '</div>' +
                '<div class="task-card-body">' +
                '<button class="task-title-button" onclick="openTaskDetails(\'' + task.id + '\')">' +
                '<strong>' + task.title + '</strong>' +
                '<small>' + (task.description || '') + '</small>' +
                '</button>' +
                '<div class="task-meta">' +
                '<span class="task-priority ' + (priority === 'urgent' ? 'priority-urgent' : priority === 'high' ? 'priority-high' : priority === 'low' ? 'priority-low' : '') + '">' + priorityLabel + '</span>' +
                '<span class="task-due ' + (overdue ? 'overdue' : '') + '">📅 ' + dueDate + ' ' + (task.time || '') + '</span>' +
                (task.type && task.type !== 'other' ? '<span class="task-category"><i style="background:' + color + ';"></i> ' + task.type + '</span>' : '') +
                '</div>' +
                (task.subtasks && task.subtasks.length ? '<div class="subtask-progress"><span><i style="width:' + Math.round(task.subtasks.filter(function(s) { return s.done; }).length / task.subtasks.length * 100) + '%;"></i></span><small>' + task.subtasks.filter(function(s) { return s.done; }).length + '/' + task.subtasks.length + '</small></div>' : '') +
                '</div>' +
                '<div class="task-card-actions">' +
                '<button onclick="editTask(\'' + task.id + '\')" title="Edit">✏️</button>' +
                '<button onclick="deleteTask(\'' + task.id + '\')" title="Delete">🗑️</button>' +
                '<button onclick="pinTask(\'' + task.id + '\')" class="' + pinClass + '" title="Pin">📌</button>' +
                '</div>' +
                '</div>';
        }

        // دوال إدارة المهام
        async function addTask() {
            var title = taskTitleInput.value.trim();
            if (!title) { alert('Please enter a task title'); return; }
            var description = '';
            var date = new Date().toISOString().split('T')[0];
            var time = '08:00';
            var endTime = '';
            var notes = '';
            var alertType = 'now';
            var notifyVia = ['telegram'];
            var color = '#8b5cf6';
            var type = 'other';

            try {
                var data = await apiCall('/tasks', 'POST', {
                    title: title,
                    description: description,
                    date: date,
                    time: time,
                    endTime: endTime,
                    notes: notes,
                    alert: alertType,
                    notifyVia: notifyVia,
                    color: color,
                    type: type
                }, currentUser);
                if (data.success) {
                    taskTitleInput.value = '';
                    loadTasks();
                }
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        }

        async function deleteTask(id) {
            if (!confirm('Delete this task?')) return;
            try {
                await apiCall('/tasks/' + id, 'DELETE', null, currentUser);
                loadTasks();
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        }

        async function toggleTaskStatus(id) {
            var task = allTasks.find(function(t) { return t.id === id; });
            if (!task) return;
            var newStatus = task.status === 'completed' ? 'pending' : 'completed';
            try {
                await apiCall('/tasks/' + id, 'PUT', { status: newStatus }, currentUser);
                loadTasks();
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        }

        async function pinTask(id) {
            var task = allTasks.find(function(t) { return t.id === id; });
            if (!task) return;
            try {
                await apiCall('/tasks/' + id, 'PUT', { pinned: !task.pinned }, currentUser);
                loadTasks();
            } catch (err) {
                alert('❌ Error: ' + err.message);
            }
        }

        function editTask(id) {
            var task = allTasks.find(function(t) { return t.id === id; });
            if (!task) return;
            var newTitle = prompt('Edit task title:', task.title);
            if (newTitle !== null) {
                apiCall('/tasks/' + id, 'PUT', { title: newTitle }, currentUser)
                    .then(function() { loadTasks(); })
                    .catch(function(err) { alert('❌ Error: ' + err.message); });
            }
        }

        function openTaskDetails(id) {
            alert('Task details: ' + id);
        }

        // دوال المشرف
        async function loadAdminData() {
            try {
                var users = await apiCall('/admin/users', 'GET', null, currentUser);
                var html = '';
                users.forEach(function(u) {
                    html += '<div class="admin-user-item">' +
                        '<span><strong>' + u.username + '</strong> ' + (u.isAdmin ? '👑' : '') + (u.isActive ? ' ✅' : ' ❌') + '</span>' +
                        '<span>Telegram: ' + u.telegramId + '</span>' +
                        '<span>Joined: ' + new Date(u.createdAt).toLocaleDateString() + '</span>' +
                        '<div>' +
                        '<button onclick="toggleAdmin(\'' + u.username + '\', ' + (!u.isAdmin) + ')" class="warning">' + (u.isAdmin ? 'Remove admin' : 'Make admin') + '</button>' +
                        '<button onclick="deleteUser(\'' + u.username + '\')" class="danger">Delete</button>' +
                        '</div>' +
                        '</div>';
                });
                adminUsersList.innerHTML = html;

                var allTasks = await apiCall('/admin/tasks', 'GET', null, currentUser);
                var tasksHtml = '';
                allTasks.forEach(function(t) {
                    tasksHtml += '<div class="task-item" style="border-right-color:' + (t.color || '#8b5cf6') + ';padding:8px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px;">' +
                        '<div class="title"><strong>' + t.title + '</strong></div>' +
                        '<div class="meta" style="font-size:10px;color:#94a3b8;">👤 ' + t.user + ' — 📅 ' + t.date + ' ' + t.time + '</div>' +
                        '</div>';
                });
                adminAllTasks.innerHTML = tasksHtml || '<p>No tasks found.</p>';
            } catch (err) {
                alert('Admin error: ' + err.message);
            }
        }

        async function toggleAdmin(username, isAdmin) {
            try {
                await apiCall('/admin/users/' + username + '/admin', 'PUT', { isAdmin: isAdmin }, currentUser);
                loadAdminData();
            } catch (err) {
                alert('Error: ' + err.message);
            }
        }

        async function deleteUser(username) {
            if (!confirm('Delete user ' + username + '?')) return;
            try {
                await apiCall('/admin/users/' + username, 'DELETE', null, currentUser);
                loadAdminData();
            } catch (err) {
                alert('Error: ' + err.message);
            }
        }

        // تبديل الواجهات
        function showApp() {
            authScreen.classList.add('is-hidden');
            tasksSection.classList.remove('workspace-hidden');
            displayUsername.textContent = currentUser;
            loadTasks();
            // التحقق من صلاحية المشرف
            apiCall('/admin/users', 'GET', null, currentUser)
                .then(function() {
                    adminSection.classList.remove('workspace-hidden');
                    loadAdminData();
                })
                .catch(function() {
                    adminSection.classList.add('workspace-hidden');
                });
        }

        function showAuth() {
            authScreen.classList.remove('is-hidden');
            tasksSection.classList.add('workspace-hidden');
            document.querySelectorAll('.alert').forEach(function(el) { el.classList.add('hidden'); });
            // إعادة ضبط حقول التسجيل
            document.getElementById('regUsername').disabled = false;
            document.getElementById('regPassword').disabled = false;
            document.getElementById('regTelegram').disabled = false;
            document.getElementById('registerBtn').disabled = false;
            document.getElementById('verifySection').classList.add('hidden');
            document.getElementById('resetPasswordSection').classList.add('hidden');
        }

        function switchTab(tabId) {
            document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
            document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.remove('active'); });
            var tabBtn = document.querySelector('[data-tab="' + tabId + '"]');
            if (tabBtn) tabBtn.classList.add('active');
            var tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.classList.add('active');
        }

        // ربط الأحداث
        document.addEventListener('DOMContentLoaded', function() {
            // التبويبات في المصادقة
            document.querySelectorAll('.auth-tab').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var tabId = this.dataset.tab;
                    switchTab(tabId);
                });
            });

            // تسجيل الدخول
            document.getElementById('loginBtn').addEventListener('click', async function() {
                var username = document.getElementById('loginUsername').value.trim();
                var password = document.getElementById('loginPassword').value;
                var errorEl = document.getElementById('loginError');
                hideAlert(errorEl);
                try {
                    await login(username, password);
                } catch (err) {
                    showAlert(errorEl, err.message, 'error');
                }
            });

            // التسجيل
            document.getElementById('registerBtn').addEventListener('click', async function() {
                var username = document.getElementById('regUsername').value.trim();
                var password = document.getElementById('regPassword').value;
                var telegramId = document.getElementById('regTelegram').value.trim();
                var errorEl = document.getElementById('registerError');
                hideAlert(errorEl);
                try {
                    await register(username, password, telegramId);
                } catch (err) {
                    showAlert(errorEl, err.message, 'error');
                }
            });

            // تفعيل الحساب
            document.getElementById('verifyBtn').addEventListener('click', async function() {
                var username = document.getElementById('regUsername').value.trim();
                var code = document.getElementById('verifyCode').value.trim();
                var errorEl = document.getElementById('registerError');
                hideAlert(errorEl);
                try {
                    await verify(username, code);
                } catch (err) {
                    showAlert(errorEl, err.message, 'error');
                }
            });

            // طلب إعادة تعيين
            document.getElementById('resetRequestBtn').addEventListener('click', async function() {
                var identifier = document.getElementById('resetIdentifier').value.trim();
                var errorEl = document.getElementById('resetError');
                hideAlert(errorEl);
                try {
                    await requestReset(identifier);
                } catch (err) {
                    showAlert(errorEl, err.message, 'error');
                }
            });

            document.getElementById('resetConfirmBtn').addEventListener('click', async function() {
                var identifier = document.getElementById('resetIdentifier').value.trim();
                var code = document.getElementById('resetCode').value.trim();
                var newPassword = document.getElementById('resetNewPassword').value;
                var errorEl = document.getElementById('resetError');
                hideAlert(errorEl);
                try {
                    await confirmReset(identifier, code, newPassword);
                } catch (err) {
                    showAlert(errorEl, err.message, 'error');
                }
            });

            // العودة إلى تسجيل الدخول
            document.getElementById('backToLoginBtn').addEventListener('click', function() {
                switchTab('loginTab');
            });

            // إظهار تبويب استرجاع كلمة المرور
            document.getElementById('showResetBtn').addEventListener('click', function() {
                switchTab('resetTab');
            });

            // إضافة مهمة سريعة
            document.getElementById('addTaskBtn').addEventListener('click', addTask);
            taskTitleInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') addTask();
            });

            // تسجيل الخروج
            document.getElementById('logoutBtn').addEventListener('click', logout);

            // أحداث التصفية
            document.querySelectorAll('#taskFilterRow button').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#taskFilterRow button').forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    renderTasks(allTasks);
                });
            });

            document.querySelectorAll('#taskCategoryFilter button').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#taskCategoryFilter button').forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    currentCategory = this.dataset.category;
                    renderTasks(allTasks);
                });
            });

            document.getElementById('taskSearchInput').addEventListener('input', function() {
                searchTerm = this.value;
                renderTasks(allTasks);
            });

            // تحديث المشرف
            document.getElementById('adminRefreshBtn').addEventListener('click', loadAdminData);

            // تحقق من المستخدم
            if (currentUser) {
                showApp();
            } else {
                showAuth();
            }

            // اختيار اللغة
            document.getElementById('languageSelect').addEventListener('change', function() {
                if (window.ChronaI18n) {
                    window.ChronaI18n.setLanguage(this.value);
                }
            });
        });

        // جعل الدوال عامة للاستخدام في الأحداث المضمنة (onclick)
        window.addTask = addTask;
        window.deleteTask = deleteTask;
        window.toggleTaskStatus = toggleTaskStatus;
        window.pinTask = pinTask;
        window.editTask = editTask;
        window.openTaskDetails = openTaskDetails;
        window.toggleAdmin = toggleAdmin;
        window.deleteUser = deleteUser;
        window.loadAdminData = loadAdminData;
        window.loadTasks = loadTasks;

    })();
</script>
</body>
</html>`;
