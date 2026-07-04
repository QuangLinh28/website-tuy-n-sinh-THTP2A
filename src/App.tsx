/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  Mail, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { StudentApplication, SchoolQuota } from './types';
import { MOCK_APPLICATIONS, INITIAL_QUOTA } from './data';
import InstructionTab from './components/InstructionTab';
import RegistrationForm from './components/RegistrationForm';
import LookupTab from './components/LookupTab';
import AdminDashboard from './components/AdminDashboard';

type TabId = 'huongdan' | 'dangky' | 'tracuu' | 'admin';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabId>('huongdan');

  // Persistence State
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [quotas, setQuotas] = useState<SchoolQuota>(INITIAL_QUOTA);

  // Success Notification state for parents
  const [recentSubmission, setRecentSubmission] = useState<StudentApplication | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Load and save state to LocalStorage for full persistence in AI Studio
  useEffect(() => {
    const storedApps = localStorage.getItem('tp2a_applications');
    const storedQuotas = localStorage.getItem('tp2a_quotas');

    if (storedApps) {
      try {
        setApplications(JSON.parse(storedApps));
      } catch (e) {
        setApplications(MOCK_APPLICATIONS);
      }
    } else {
      setApplications(MOCK_APPLICATIONS);
      localStorage.setItem('tp2a_applications', JSON.stringify(MOCK_APPLICATIONS));
    }

    if (storedQuotas) {
      try {
        setQuotas(JSON.parse(storedQuotas));
      } catch (e) {
        setQuotas(INITIAL_QUOTA);
      }
    } else {
      setQuotas(INITIAL_QUOTA);
      localStorage.setItem('tp2a_quotas', JSON.stringify(INITIAL_QUOTA));
    }
  }, []);

  const saveApplications = (newApps: StudentApplication[]) => {
    setApplications(newApps);
    localStorage.setItem('tp2a_applications', JSON.stringify(newApps));
  };

  const saveQuotas = (newQuotas: SchoolQuota) => {
    setQuotas(newQuotas);
    localStorage.setItem('tp2a_quotas', JSON.stringify(newQuotas));
  };

  // State manipulation handlers
  const handleAddApplication = (newApp: StudentApplication) => {
    const updated = [newApp, ...applications];
    saveApplications(updated);
    setRecentSubmission(newApp);
  };

  const handleUpdateApplication = (updatedApp: StudentApplication) => {
    const updated = applications.map(app => app.id === updatedApp.id ? updatedApp : app);
    saveApplications(updated);
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(app => app.id !== id);
    saveApplications(updated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      
      {/* 1. PORTAL HEADER */}
      <header className="bg-gradient-to-b from-blue-950 to-blue-900 border-b-4 border-amber-500 text-white shadow-md relative overflow-hidden">
        {/* Background decorative geometry */}
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-20 -translate-y-20">
          <BookOpen size={300} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-5 md:py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & School Title */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 text-blue-950 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl shadow-inner shrink-0 border-2 border-white/20 select-none">
              TP2A
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-bold uppercase text-[10px] md:text-[11px] tracking-widest block font-sans">
                SỞ GIÁO DỤC & ĐÀO TẠO TỈNH ĐỒNG THÁP
              </span>
              <h1 className="text-lg md:text-2xl font-black font-sans tracking-tight text-white uppercase">
                Trường Tiểu Học Thường Phước 2A
              </h1>
              <p className="text-xs md:text-sm text-blue-100 font-medium">
                Cổng thông tin Tuyển sinh Lớp 1 trực tuyến • Niên khóa 2026 - 2027
              </p>
            </div>
          </div>

          {/* Quick Stats / Target indicators */}
          <div className="flex gap-4 text-xs font-semibold bg-blue-950/45 p-3 rounded-xl border border-blue-800/30">
            <div className="text-center">
              <span className="text-slate-400 text-[9px] uppercase font-bold block">Tổng chỉ tiêu tuyển</span>
              <span className="text-amber-400 text-sm font-bold block mt-0.5">{quotas['Tích hợp'] + quotas['Tăng cường'] + quotas['Đại trà']} em</span>
            </div>
            <div className="w-px bg-blue-800/60 self-stretch" />
            <div className="text-center">
              <span className="text-slate-400 text-[9px] uppercase font-bold block">Hồ sơ đã nộp</span>
              <span className="text-white text-sm font-bold block mt-0.5">{applications.filter(a => a.status !== 'Nháp').length} hồ sơ</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. PORTAL MAIN NAVIGATION TABS */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center md:justify-start gap-1.5 md:gap-4 overflow-x-auto py-3 scrollbar-none">
            
            {/* Tab 1: Instructions */}
            <button
              onClick={() => { setActiveTab('huongdan'); setRecentSubmission(null); }}
              id="tab-instructions"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap
                ${activeTab === 'huongdan' 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <BookOpen size={15} />
              Hướng dẫn tuyển sinh
            </button>

            {/* Tab 2: Registration */}
            <button
              onClick={() => { setActiveTab('dangky'); setRecentSubmission(null); }}
              id="tab-registration"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap
                ${activeTab === 'dangky' 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <UserPlus size={15} />
              Đăng ký tuyển sinh
            </button>

            {/* Tab 3: Lookup */}
            <button
              onClick={() => { setActiveTab('tracuu'); setRecentSubmission(null); }}
              id="tab-lookup"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap
                ${activeTab === 'tracuu' 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <Search size={15} />
              Tra cứu hồ sơ
            </button>

            {/* Tab 4: Admin Gate */}
            <button
              onClick={() => { setActiveTab('admin'); setRecentSubmission(null); }}
              id="tab-admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ml-auto
                ${activeTab === 'admin' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
                  : 'text-slate-500 hover:bg-slate-100 border border-dashed border-slate-200'
                }
              `}
            >
              <ShieldCheck size={15} />
              Cán bộ tuyển sinh
            </button>

          </div>
        </div>
      </nav>

      {/* 3. PORTAL CORE CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* Conditional SUCCESS view if parent just submitted */}
        {recentSubmission ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-10 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-100/50">
              <CheckCircle2 size={36} />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest block">Gửi hồ sơ thành công!</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hồ Sơ Đã Được Tiếp Nhận</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Ban tuyển sinh trường Tiểu học Nguyễn Bỉnh Khiêm đã tiếp nhận thành công hồ sơ đăng ký nhập học trực tuyến của bé.
              </p>
            </div>

            {/* Application Voucher Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 md:p-6 text-left space-y-4 max-w-md mx-auto">
              <div className="border-b border-slate-200 pb-2 flex justify-between items-center flex-wrap gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Phiếu tiếp nhận trực tuyến</span>
                <span className="text-xs font-semibold text-blue-900 font-mono bg-blue-50 px-2.5 py-0.5 rounded-full">{recentSubmission.id}</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Học sinh đăng ký:</span>
                  <strong className="text-slate-900 font-bold uppercase">{recentSubmission.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã định danh cá nhân:</span>
                  <strong className="text-slate-900 font-mono font-bold">{recentSubmission.nationalId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chương trình ưu tiên:</span>
                  <strong className="text-blue-900 font-bold">{recentSubmission.programPreference} ({recentSubmission.boardingOption})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian gửi hồ sơ:</span>
                  <strong className="text-slate-800 font-mono">{new Date(recentSubmission.createdAt).toLocaleString('vi-VN')}</strong>
                </div>
              </div>

              {/* Copy codes box */}
              <div className="pt-4 border-t border-slate-200 flex gap-2.5">
                <button
                  onClick={() => copyToClipboard(recentSubmission.nationalId)}
                  className="flex-1 bg-white border border-slate-200 hover:border-slate-300 font-semibold text-[11px] px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-slate-700 shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <Copy size={13} /> {copiedId ? 'Đã sao chép!' : 'Sao chép định danh'}
                </button>
                <button
                  onClick={() => { setActiveTab('tracuu'); setRecentSubmission(null); }}
                  className="flex-1 bg-blue-900 hover:bg-blue-850 text-white font-semibold text-[11px] px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  Tra cứu tiến độ <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100/70 text-left text-[11px] text-amber-800 leading-normal max-w-md mx-auto flex gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý tiếp theo cho Phụ huynh:</strong>
                <p className="mt-1">
                  Vui lòng lưu lại Mã số hồ sơ hoặc Số định danh cá nhân của bé để tra cứu kết quả xét duyệt. Kết quả đúng tuyến chính thức sẽ được công bố vào ngày **10/07/2026** trực tiếp trên cổng thông tin này.
                </p>
              </div>
            </div>

            <button
              onClick={() => { setRecentSubmission(null); setActiveTab('huongdan'); }}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold underline block mx-auto cursor-pointer"
            >
              Quay lại trang chủ hướng dẫn tuyển sinh
            </button>
          </motion.div>
        ) : (
          /* Render Tabs with animation transition */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'huongdan' && (
                <InstructionTab onStartRegistration={() => setActiveTab('dangky')} />
              )}
              
              {activeTab === 'dangky' && (
                <RegistrationForm 
                  onSuccess={handleAddApplication} 
                  onCancel={() => setActiveTab('huongdan')} 
                />
              )}

              {activeTab === 'tracuu' && (
                <LookupTab 
                  applications={applications} 
                  onUpdateApplication={handleUpdateApplication}
                  onNavigateToRegister={() => setActiveTab('dangky')}
                />
              )}

              {activeTab === 'admin' && (
                <AdminDashboard 
                  applications={applications}
                  quotas={quotas}
                  onUpdateApplication={handleUpdateApplication}
                  onUpdateQuotas={saveQuotas}
                  onDeleteApplication={handleDeleteApplication}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

      </main>

      {/* 4. PORTAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 md:space-y-0 md:flex md:justify-between items-start md:items-center">
          
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-blue-950 font-bold flex items-center justify-center">TP2A</span>
              <strong className="text-white text-sm font-sans tracking-tight">TRƯỜNG TIỂU HỌC THƯỜNG PHƯỚC 2A</strong>
            </div>
            <p className="leading-relaxed">
              Cổng thông tin tuyển sinh trực tuyến phục vụ công tác tiếp nhận, xét duyệt hồ sơ nhập học Lớp 1 đúng tuyến của học sinh năm học 2026 - 2027.
            </p>
            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 pt-1.5">
              <span className="flex items-center gap-1"><MapPin size={13} className="text-amber-500 shrink-0" /> Ấp Mương Kinh, xã Thường Phước, tỉnh Đồng Tháp</span>
            </div>
          </div>

          <div className="space-y-2 shrink-0 border-t border-slate-800 pt-4 md:pt-0 md:border-t-0 md:text-right text-slate-500">
            <div className="flex md:justify-end gap-x-4 gap-y-1 flex-wrap text-slate-400">
              <a href="tel:0328232804" className="flex items-center gap-1 hover:text-white transition"><PhoneCall size={13} className="text-amber-500" /> 0328232804</a>
              <a href="mailto:tuyensinh@thuongphuoc2a.edu.vn" className="flex items-center gap-1 hover:text-white transition"><Mail size={13} className="text-amber-500" /> tuyensinh@thuongphuoc2a.edu.vn</a>
            </div>
            <p className="pt-2 text-[10px]">
              © {new Date().getFullYear()} TH Thường Phước 2A, Đồng Tháp. Đã đăng ký bản quyền.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
