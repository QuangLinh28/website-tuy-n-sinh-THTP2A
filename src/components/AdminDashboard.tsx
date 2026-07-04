/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Lock, 
  LogOut, 
  FileSpreadsheet, 
  ChevronDown,
  Edit,
  Save,
  Trash2,
  Settings,
  Plus,
  HelpCircle,
  TrendingUp,
  Sliders,
  Check,
  X,
  XSquare,
  Bookmark
} from 'lucide-react';
import { StudentApplication, ApplicationStatus, ProgramPreference, SchoolQuota } from '../types';

interface AdminDashboardProps {
  applications: StudentApplication[];
  quotas: SchoolQuota;
  onUpdateApplication: (updatedApp: StudentApplication) => void;
  onUpdateQuotas: (newQuotas: SchoolQuota) => void;
  onDeleteApplication: (id: string) => void;
}

const COLORS = ['#1e3a8a', '#0d9488', '#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#64748b'];

export default function AdminDashboard({ 
  applications, 
  quotas, 
  onUpdateApplication, 
  onUpdateQuotas, 
  onDeleteApplication 
}: AdminDashboardProps) {
  
  // Security gate
  const [passkey, setPasskey] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [gateError, setGateError] = useState('');

  // Dashboard state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [programFilter, setProgramFilter] = useState<string>('Tất cả');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);

  // Modal Editing state
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus>('Đã nộp');
  const [editingComment, setEditingComment] = useState('');

  // Tab state inside admin panel
  const [adminTab, setAdminTab] = useState<'hoso' | 'thongke' | 'chitieu'>('thongke');

  // Quota Adjuster state
  const [tempQuotaTichHop, setTempQuotaTichHop] = useState(quotas['Tích hợp'].toString());
  const [tempQuotaTangCuong, setTempQuotaTangCuong] = useState(quotas['Tăng cường'].toString());
  const [tempQuotaDaiTra, setTempQuotaDaiTra] = useState(quotas['Đại trà'].toString());
  const [quotaSavedMsg, setQuotaSavedMsg] = useState(false);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey.toLowerCase() === 'admin' || passkey === '123459') {
      setIsAdminUnlocked(true);
      setGateError('');
    } else {
      setGateError('Mật mã cán bộ không chính xác.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminUnlocked(false);
    setPasskey('');
  };

  const handleOpenDetailModal = (app: StudentApplication) => {
    setSelectedApp(app);
    setEditingStatus(app.status);
    setEditingComment(app.adminComment);
  };

  const handleSaveStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const updatedApp: StudentApplication = {
      ...selectedApp,
      status: editingStatus,
      adminComment: editingComment.trim() || 'Hồ sơ tuyển sinh đã được cập nhật trạng thái mới.',
      updatedAt: new Date().toISOString()
    };

    onUpdateApplication(updatedApp);
    setSelectedApp(null);
  };

  const handleSaveQuotas = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuotas: SchoolQuota = {
      'Tích hợp': parseInt(tempQuotaTichHop) || quotas['Tích hợp'],
      'Tăng cường': parseInt(tempQuotaTangCuong) || quotas['Tăng cường'],
      'Đại trà': parseInt(tempQuotaDaiTra) || quotas['Đại trà']
    };
    onUpdateQuotas(newQuotas);
    setQuotaSavedMsg(true);
    setTimeout(() => setQuotaSavedMsg(false), 2500);
  };

  // ---------------- COMPUTED METRICS ----------------
  const totalApps = applications.length;
  const approvedCount = applications.filter(a => a.status === 'Đã duyệt' || a.status === 'Đã nhập học').length;
  const reviewingCount = applications.filter(a => a.status === 'Đang duyệt').length;
  const submittedCount = applications.filter(a => a.status === 'Đã nộp').length;
  const actionRequiredCount = applications.filter(a => a.status === 'Cần bổ sung').length;

  // Filtered applications list
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = 
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.nationalId.includes(searchQuery) ||
        app.fatherPhone.includes(searchQuery) ||
        app.motherPhone.includes(searchQuery);

      const matchStatus = statusFilter === 'Tất cả' ? true : app.status === statusFilter;
      const matchProgram = programFilter === 'Tất cả' ? true : app.programPreference === programFilter;

      return matchSearch && matchStatus && matchProgram;
    });
  }, [applications, searchQuery, statusFilter, programFilter]);

  // ---------------- CHART DATA COMPILATION ----------------
  // Program preference registration counts
  const programChartData = useMemo(() => {
    const counts = { 'Tích hợp': 0, 'Tăng cường': 0, 'Đại trà': 0 };
    applications.forEach(app => {
      if (app.status !== 'Nháp') {
        counts[app.programPreference] = (counts[app.programPreference] || 0) + 1;
      }
    });

    return [
      { name: 'Tiếng Anh Tích hợp', 'Số hồ sơ nộp': counts['Tích hợp'], 'Chỉ tiêu giao': quotas['Tích hợp'] },
      { name: 'Tăng cường Tiếng Anh', 'Số hồ sơ nộp': counts['Tăng cường'], 'Chỉ tiêu giao': quotas['Tăng cường'] },
      { name: 'Đại trà', 'Số hồ sơ nộp': counts['Đại trà'], 'Chỉ tiêu giao': quotas['Đại trà'] }
    ];
  }, [applications, quotas]);

  // Status distribution
  const statusPieData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [applications]);

  // CSV Exporter Simulation
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += "Ma ho so,Ho va ten hoc sinh,Ngay sinh,Gioi tinh,Ma dinh danh,Dan toc,Truong mam non,Nguyen vong,Ban tru,SDT cha,SDT me,Trang thai\n";
    
    // Rows
    applications.forEach(app => {
      // Remove accents for simple csv export representation
      const cleanName = app.studentName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
      const cleanProgram = app.programPreference.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const cleanStatus = app.status.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
    csvContent += `${app.id},"${cleanName}",${app.dob},${app.gender},'${app.nationalId}',${app.ethnic},"${app.kindergartenName}",${cleanProgram},${app.boardingOption},${app.fatherPhone},${app.motherPhone},${cleanStatus}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DS_Tuyen_Sinh_Lop1_Thuong_Phuoc_2A_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case 'Nháp': return 'bg-slate-100 text-slate-700';
      case 'Đã nộp': return 'bg-blue-50 text-blue-800';
      case 'Đang duyệt': return 'bg-amber-50 text-amber-800';
      case 'Cần bổ sung': return 'bg-orange-50 text-orange-800 border-orange-100';
      case 'Đã duyệt': return 'bg-teal-50 text-teal-800';
      case 'Đã nhập học': return 'bg-green-100 text-green-800';
      case 'Từ chối': return 'bg-red-50 text-red-800';
    }
  };

  // Render Passkey Gate if not unlocked
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-md p-6 md:p-8 animate-fade-in text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
          <Lock size={26} />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 font-sans">Bảng Điều Khiển Cán Bộ</h2>
          <p className="text-xs text-slate-500">
            Khu vực hạn chế chỉ dành cho Ban tuyển sinh Trường Tiểu học Thường Phước 2A, Đồng Tháp.
          </p>
        </div>

        <form onSubmit={handleUnlockAdmin} className="space-y-4">
          <div className="text-left">
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1.5">Nhập mật mã cán bộ</label>
            <input 
              type="password" 
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="••••••••"
              id="input-admin-passkey"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-900 transition text-center font-mono tracking-widest"
              required
            />
            {gateError && (
              <p className="text-red-500 text-[11px] mt-1.5 font-medium leading-relaxed">{gateError}</p>
            )}
          </div>

          <button
            type="submit"
            id="btn-unlock-admin"
            className="w-full bg-blue-900 hover:bg-blue-850 text-white font-semibold text-sm py-2.5 rounded-lg transition shadow-sm cursor-pointer"
          >
            Mở khóa dữ liệu tuyển sinh
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Admin Panel Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Hệ thống Cán Bộ Tuyển sinh hoạt động</span>
          </div>
          <h2 className="text-xl font-bold text-slate-950 mt-1">Ban Tuyển Sinh - TH Thường Phước 2A</h2>
          <p className="text-xs text-slate-500 mt-0.5">Báo cáo tổng kết chỉ tiêu & Duyệt hồ sơ Lớp 1 chính thức</p>
        </div>

        <div className="flex gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={handleExportCSV}
            id="btn-export-candidates"
            className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-850 font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 border border-teal-200/50 cursor-pointer"
          >
            <FileSpreadsheet size={15} /> Xuất dữ liệu Excel
          </button>
          
          <button
            onClick={handleLogoutAdmin}
            id="btn-logout-admin"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={15} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* ADMIN INNER TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setAdminTab('thongke')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition border-b-2 cursor-pointer whitespace-nowrap
            ${adminTab === 'thongke' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}
          `}
        >
          📊 Tổng quan thống kê
        </button>
        <button
          onClick={() => setAdminTab('hoso')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition border-b-2 cursor-pointer whitespace-nowrap
            ${adminTab === 'hoso' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}
          `}
        >
          📋 Danh sách hồ sơ ({filteredApps.length})
        </button>
        <button
          onClick={() => setAdminTab('chitieu')}
          className={`pb-3 text-xs font-bold tracking-wider uppercase transition border-b-2 cursor-pointer whitespace-nowrap
            ${adminTab === 'chitieu' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}
          `}
        >
          ⚙️ Cấu hình chỉ tiêu tuyển sinh
        </button>
      </div>

      {/* ================= ADMIN TAB: STATISTICS OVERVIEW ================= */}
      {adminTab === 'thongke' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Total */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-slate-400 font-semibold text-[10px] uppercase">Tổng hồ sơ nộp</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{totalApps}</div>
              <div className="text-[10px] text-slate-400 mt-1">Trực tuyến + Hồ sơ giấy</div>
            </div>

            {/* Approved */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-teal-600 font-semibold text-[10px] uppercase">Đã duyệt / Nhập học</div>
              <div className="text-2xl font-bold text-teal-700 mt-1">{approvedCount}</div>
              <div className="text-[10px] text-teal-400 mt-1">Đạt {Math.round((approvedCount / (totalApps || 1)) * 100)}% tổng số hồ sơ</div>
            </div>

            {/* Reviewing */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-amber-600 font-semibold text-[10px] uppercase">Đang đối chiếu</div>
              <div className="text-2xl font-bold text-amber-700 mt-1">{reviewingCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Hồ sơ chờ xác thực cư trú</div>
            </div>

            {/* Submitted */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-blue-600 font-semibold text-[10px] uppercase">Mới tiếp nhận</div>
              <div className="text-2xl font-bold text-blue-800 mt-1">{submittedCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Đang chờ cán bộ mở kiểm tra</div>
            </div>

            {/* Action Required */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs col-span-2 md:col-span-1">
              <div className="text-orange-600 font-semibold text-[10px] uppercase">Cần bổ sung hồ sơ</div>
              <div className="text-2xl font-bold text-orange-700 mt-1">{actionRequiredCount}</div>
              <div className="text-[10px] text-slate-400 mt-1">Phụ huynh đang tải lên lại</div>
            </div>
          </div>

          {/* Visual Recharts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bar chart: Program vs Quota */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs md:col-span-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <TrendingUp size={16} className="text-blue-900" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Hồ sơ nộp so với Chỉ tiêu từng Chương trình</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={programChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Số hồ sơ nộp" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Chỉ tiêu giao" fill="#0d9488" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie chart: Status distribution */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Sliders size={16} className="text-blue-900" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Tỷ lệ Trạng thái hồ sơ</h3>
              </div>
              <div className="h-72 flex flex-col justify-between">
                <div className="h-56 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend list */}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center text-[10px] text-slate-500 max-w-sm mx-auto">
                  {statusPieData.map((entry, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      {entry.name} ({entry.value})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADMIN TAB: APPLICATIONS LIST TABLE ================= */}
      {adminTab === 'hoso' && (
        <div className="space-y-4">
          
          {/* Controls bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên, mã số, SĐT, định danh..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-900"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter size={13} className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Trạng thái:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 outline-none"
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Nháp">Nháp</option>
                  <option value="Đã nộp">Đã nộp</option>
                  <option value="Đang duyệt">Đang duyệt</option>
                  <option value="Cần bổ sung">Cần bổ sung</option>
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Đã nhập học">Đã nhập học</option>
                  <option value="Từ chối">Từ chối</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Mô hình lớp:</span>
                <select 
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 outline-none"
                >
                  <option value="Tất cả">Tất cả chương trình</option>
                  <option value="Tích hợp">Tiếng Anh Tích hợp</option>
                  <option value="Tăng cường">Tăng cường Tiếng Anh</option>
                  <option value="Đại trà">Chương trình Đại trà</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã số / Học sinh</th>
                    <th className="py-3 px-4">Giới tính / Ngày sinh</th>
                    <th className="py-3 px-4">Nơi cư trú thực tế</th>
                    <th className="py-3 px-4">Nguyện vọng lớp</th>
                    <th className="py-3 px-4">Ngày đăng ký</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition">
                        {/* ID and Name */}
                        <td className="py-3.5 px-4">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block">{app.id}</span>
                          <strong className="text-slate-900 font-semibold block mt-0.5">{app.studentName}</strong>
                          <span className="text-[10px] font-mono text-slate-400 tracking-tight block">CCCD: {app.nationalId}</span>
                        </td>

                        {/* Gender / Dob */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="block font-medium">Giới tính: {app.gender}</span>
                          <span className="block mt-0.5 font-mono text-slate-400 text-[10px]">Ngày sinh: {app.dob}</span>
                        </td>

                        {/* Residence */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                          <span className="block truncate font-medium">{app.currentAddress.street}</span>
                          <span className="block mt-0.5 text-slate-400 text-[10px]">{[app.currentAddress.ward, app.currentAddress.district].filter(Boolean).join(', ')}</span>
                        </td>

                        {/* Preferred program */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-blue-900 block">{app.programPreference}</span>
                          <span className="text-slate-400 text-[10px] block mt-0.5">{app.boardingOption} | Bus: {app.hasBusService ? 'Đăng ký' : 'Không'}</span>
                        </td>

                        {/* Date submitted */}
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[10px]">
                          {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenDetailModal(app)}
                              id={`btn-view-candidate-${app.id}`}
                              className="p-1.5 text-blue-900 hover:bg-blue-50 hover:text-blue-950 rounded-lg transition"
                              title="Xem chi tiết & Phê duyệt"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ tuyển sinh mã số ${app.id} của học sinh ${app.studentName}?`)) {
                                  onDeleteApplication(app.id);
                                }
                              }}
                              id={`btn-delete-candidate-${app.id}`}
                              className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                              title="Xóa hồ sơ"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-slate-400">
                        Không tìm thấy hồ sơ nào phù hợp với bộ lọc tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADMIN TAB: QUOTA CONFIG ================= */}
      {adminTab === 'chitieu' && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-2xs max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
            <Settings size={18} className="text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Cài đặt Chỉ tiêu & Sĩ số tuyển sinh Lớp 1</h3>
          </div>

          <form onSubmit={handleSaveQuotas} className="space-y-6">
            <p className="text-xs text-slate-500 leading-relaxed">
              Cập nhật số lượng chỉ tiêu học sinh phân tuyến được tiếp nhận tối đa cho niên khóa 2026-2027. Sĩ số mặc định mỗi lớp học là 35 em học sinh.
            </p>

            <div className="space-y-4">
              {/* Cambridge */}
              <div className="grid grid-cols-3 gap-4 items-center p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-800">Tiếng Anh Tích hợp (Cambridge):</span>
                <span className="text-[10px] text-slate-400 font-mono">Lớp học 1/1, 1/2, 1/3</span>
                <input 
                  type="number"
                  value={tempQuotaTichHop}
                  onChange={(e) => setTempQuotaTichHop(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-bold"
                />
              </div>

              {/* Intensive English */}
              <div className="grid grid-cols-3 gap-4 items-center p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-800">Tăng cường Tiếng Anh đề án:</span>
                <span className="text-[10px] text-slate-400 font-mono">Lớp học 1/4, 1/5, 1/6, 1/7</span>
                <input 
                  type="number"
                  value={tempQuotaTangCuong}
                  onChange={(e) => setTempQuotaTangCuong(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-bold"
                />
              </div>

              {/* Standard */}
              <div className="grid grid-cols-3 gap-4 items-center p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-800">Chương trình Đại trà (Mẫu mực):</span>
                <span className="text-[10px] text-slate-400 font-mono">Lớp học 1/8, 1/9, 1/10, 1/11, 1/12</span>
                <input 
                  type="number"
                  value={tempQuotaDaiTra}
                  onChange={(e) => setTempQuotaDaiTra(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 font-bold"
                />
              </div>
            </div>

            {quotaSavedMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-medium">
                <Check size={16} /> Lưu cấu hình chỉ tiêu tuyển sinh thành công!
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                type="submit" 
                id="btn-save-quotas"
                className="bg-blue-900 hover:bg-blue-850 text-white font-bold text-xs px-5 py-2 rounded-lg transition shadow-sm cursor-pointer"
              >
                Cập nhật cấu hình chỉ tiêu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= CANDIDATE DETAIL MODAL (APPROVE / REJECT) ================= */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">Mã hồ sơ: {selectedApp.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Xử lý Hồ sơ: {selectedApp.studentName}</h3>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveStatusChange} className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1">
              
              {/* Detailed Data View Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                
                {/* Side 1: Student Information */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-1.5">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider text-blue-900">1. Thông tin Lý lịch học sinh</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Giới tính</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.gender}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Ngày sinh</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.dob}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Dân tộc</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.ethnic}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Mã định danh cá nhân</span>
                      <p className="font-mono font-bold text-slate-900 tracking-wide mt-0.5">{selectedApp.nationalId}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Nơi sinh</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.pob}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Trường mầm non đã học</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.kindergartenName} ({selectedApp.kindergartenDistrict})</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] block">Nơi cư trú thực tế hiện tại</span>
                    <p className="font-medium text-slate-800 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                      {[selectedApp.currentAddress.street, selectedApp.currentAddress.ward, selectedApp.currentAddress.district, selectedApp.currentAddress.province].filter(Boolean).join(', ')}
                    </p>
                    <span className="text-[10px] text-slate-400 italic mt-0.5 block">
                      {selectedApp.isSameAddress ? '✓ Trùng khớp với thông tin trên hộ khẩu thường trú.' : '⚠ Nơi cư trú thực tế khác hộ khẩu thường trú.'}
                    </span>
                  </div>

                  {/* Attached Documents Thumbnails */}
                  <div className="space-y-2">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] block">Tài liệu đã đính kèm</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Đang xem tài liệu: ${selectedApp.documents.birthCertificate}`);}} className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-900 rounded flex items-center gap-1.5 truncate text-blue-900 font-medium">
                        <Bookmark size={12} /> Giấy khai sinh
                      </a>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Đang xem tài liệu: ${selectedApp.documents.residenceCert}`);}} className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-900 rounded flex items-center gap-1.5 truncate text-blue-900 font-medium">
                        <Bookmark size={12} /> Xác nhận CT07
                      </a>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Đang xem tài liệu: ${selectedApp.documents.kindergartenCert}`);}} className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-900 rounded flex items-center gap-1.5 truncate text-blue-900 font-medium">
                        <Bookmark size={12} /> Tốt nghiệp mầm non
                      </a>
                      <a href="#" onClick={(e) => {e.preventDefault(); alert(`Đang xem ảnh chân dung của bé`);}} className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-900 rounded flex items-center gap-1.5 truncate text-blue-900 font-medium">
                        <Bookmark size={12} /> Ảnh chân dung 3x4
                      </a>
                    </div>
                  </div>
                </div>

                {/* Side 2: Parent, preferences & Decision Form */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-1.5">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider text-blue-900">2. Nguyện vọng & Phụ huynh</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Chương trình đăng ký</span>
                      <p className="font-bold text-slate-950 mt-0.5 text-blue-900">{selectedApp.programPreference}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Bán trú</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.boardingOption}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase text-[9px]">Đưa đón bằng xe bus</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.hasBusService ? 'Có đăng ký xe' : 'Không sử dụng'}</p>
                    </div>
                    
                    {selectedApp.fatherName && (
                      <div className="col-span-2 border-t border-slate-200/50 pt-2">
                        <span className="text-slate-400 font-semibold uppercase text-[9px]">Họ tên Cha</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.fatherName} (SĐT: {selectedApp.fatherPhone})</p>
                      </div>
                    )}
                    
                    {selectedApp.motherName && (
                      <div className="col-span-2 border-t border-slate-200/50 pt-2">
                        <span className="text-slate-400 font-semibold uppercase text-[9px]">Họ tên Mẹ</span>
                        <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.motherName} (SĐT: {selectedApp.motherPhone})</p>
                      </div>
                    )}
                  </div>

                  {/* FORM DECISION STATUS GATES */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider">Phê duyệt trạng thái hồ sơ tuyển sinh:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(['Đã nộp', 'Đang duyệt', 'Cần bổ sung', 'Đã duyệt', 'Đã nhập học', 'Từ chối'] as ApplicationStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setEditingStatus(st)}
                            className={`border px-2 py-1.5 rounded-lg font-bold text-[10px] uppercase text-center transition cursor-pointer
                              ${editingStatus === st ? 'border-blue-900 bg-blue-50 text-blue-900 ring-2 ring-blue-900/10' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}
                            `}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider">Ý kiến chính thức / Phản hồi cho Phụ huynh:</label>
                      <textarea
                        rows={4}
                        value={editingComment}
                        onChange={(e) => setEditingComment(e.target.value)}
                        placeholder="Nhập ý kiến ban tuyển sinh (Phụ huynh có thể tra cứu thấy bình luận này ngay lập tức để khắc phục hoặc hoàn tất thủ tục)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-900"
                      />
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-500 hover:text-slate-800 font-semibold text-xs px-4 py-2"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  id="btn-save-decision"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  Lưu phê duyệt hồ sơ <CheckCircle size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
