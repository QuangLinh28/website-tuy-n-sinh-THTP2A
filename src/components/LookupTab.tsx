/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  User, 
  Phone, 
  Upload, 
  Save, 
  RefreshCw,
  Home,
  CheckCircle
} from 'lucide-react';
import { StudentApplication, ApplicationStatus } from '../types';

interface LookupTabProps {
  applications: StudentApplication[];
  onUpdateApplication: (updatedApp: StudentApplication) => void;
  onNavigateToRegister: () => void;
}

export default function LookupTab({ applications, onUpdateApplication, onNavigateToRegister }: LookupTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundApp, setFoundApp] = useState<StudentApplication | null>(null);

  // Correction Mode state (if student has status "Cần bổ sung")
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctedBirth, setCorrectedBirth] = useState('');
  const [correctedResidence, setCorrectedResidence] = useState('');
  const [correctedNotes, setCorrectedNotes] = useState('');
  const [correctingProgress, setCorrectingProgress] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search by 12-digit National ID OR phone number (father or mother)
    const cleanedQuery = searchQuery.trim().replace(/\s+/g, '');
    const app = applications.find(a => 
      a.nationalId === cleanedQuery || 
      a.fatherPhone === cleanedQuery || 
      a.motherPhone === cleanedQuery ||
      a.id.toLowerCase() === cleanedQuery.toLowerCase()
    );

    setFoundApp(app || null);
    setSearched(true);
    setIsCorrecting(false); // reset correction mode

    if (app) {
      setCorrectedBirth(app.documents.birthCertificate);
      setCorrectedResidence(app.documents.residenceCert);
      setCorrectedNotes(app.notes);
    }
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundApp) return;

    setCorrectingProgress(true);

    setTimeout(() => {
      const updatedApp: StudentApplication = {
        ...foundApp,
        status: 'Đã nộp', // Change back to Submitted
        notes: correctedNotes,
        updatedAt: new Date().toISOString(),
        adminComment: 'Phụ huynh đã cập nhật lại bản chụp hồ sơ cư trú / giấy khai sinh. Đang chờ Ban tuyển sinh đối chiếu lại.',
        documents: {
          ...foundApp.documents,
          birthCertificate: correctedBirth || foundApp.documents.birthCertificate,
          residenceCert: correctedResidence || foundApp.documents.residenceCert
        }
      };

      onUpdateApplication(updatedApp);
      setFoundApp(updatedApp);
      setIsCorrecting(false);
      setCorrectingProgress(false);
    }, 1200);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Nháp': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Đã nộp': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Đang duyệt': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cần bổ sung': return 'bg-orange-50 text-orange-800 border-orange-200 animate-pulse';
      case 'Đã duyệt': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Đã nhập học': return 'bg-green-100 text-green-900 border-green-300';
      case 'Từ chối': return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'Nháp': return <Clock size={16} className="text-slate-500" />;
      case 'Đã nộp': return <CheckCircle2 size={16} className="text-blue-600" />;
      case 'Đang duyệt': return <Clock size={16} className="text-amber-600" />;
      case 'Cần bổ sung': return <AlertTriangle size={16} className="text-orange-600" />;
      case 'Đã duyệt': return <CheckCircle size={16} className="text-teal-600" />;
      case 'Đã nhập học': return <CheckCircle size={16} className="text-green-700" />;
      case 'Từ chối': return <XCircle size={16} className="text-red-600" />;
    }
  };

  // Status mapping to timeline steps (0 to 4)
  const getTimelineStepIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'Nháp': return 0;
      case 'Đã nộp': return 1;
      case 'Đang duyệt': return 2;
      case 'Cần bổ sung': return 2; // on same level as reviewing
      case 'Đã duyệt': return 3;
      case 'Đã nhập học': return 4;
      case 'Từ chối': return -1;
    }
  };

  const timelineSteps = [
    { label: 'Gửi hồ sơ', desc: 'Đã hoàn thành nộp trực tuyến' },
    { label: 'Tiếp nhận', desc: 'Đang kiểm tra hồ sơ cư trú' },
    { label: 'Xét tuyển', desc: 'Ban tuyển sinh đối chiếu' },
    { label: 'Được nhận', desc: 'Học sinh trúng tuyển lớp 1' },
    { label: 'Nhập học', desc: 'Hoàn tất bàn giao hồ sơ giấy' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Search Bar Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Tra Cứu Tiến Độ Hồ Sơ Tuyển Sinh</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Nhập số **Mã định danh cá nhân của trẻ (12 chữ số)** hoặc **Số điện thoại** của Cha/Mẹ để xem kết quả xét duyệt lớp 1 mới nhất.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="079220012345 hoặc SĐT phụ huynh"
              id="input-lookup-query"
              className="w-full bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-900/5 transition font-medium"
            />
          </div>
          <button 
            type="submit"
            id="btn-submit-lookup"
            className="bg-blue-900 hover:bg-blue-850 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            Tra cứu hồ sơ
          </button>
        </form>

        <div className="text-[11px] text-slate-400 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>💡 Mã test tìm nhanh:</span>
          <button onClick={() => setSearchQuery('079220012345')} className="underline hover:text-blue-900 font-mono">079220012345</button>
          <span>|</span>
          <button onClick={() => setSearchQuery('079220012567')} className="underline hover:text-blue-900 font-mono text-orange-600">079220012567 (Cần bổ sung)</button>
        </div>
      </div>

      {/* SEARCH RESULTS PANEL */}
      {searched && (
        <div className="max-w-4xl mx-auto">
          {foundApp ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden animate-fade-in divide-y divide-slate-100">
              
              {/* Result Header */}
              <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Mã Hồ Sơ: {foundApp.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{foundApp.studentName}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5 font-medium">
                    <span className="flex items-center gap-1"><User size={13} /> Giới tính: {foundApp.gender}</span>
                    <span>•</span>
                    <span>Ngày sinh: {foundApp.dob}</span>
                    <span>•</span>
                    <span>Mã định danh: <strong className="font-mono">{foundApp.nationalId}</strong></span>
                  </div>
                </div>

                <div className={`border rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 tracking-tight shadow-2xs ${getStatusColor(foundApp.status)}`}>
                  {getStatusIcon(foundApp.status)}
                  <span>{foundApp.status}</span>
                </div>
              </div>

              {/* Status Tracking Flow */}
              {foundApp.status !== 'Từ chối' && (
                <div className="p-6 md:p-8">
                  <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-6">Trạng thái hồ sơ chi tiết</h4>
                  <div className="relative flex flex-col md:flex-row justify-between gap-6 overflow-x-auto pb-4 scrollbar-none">
                    
                    {/* Connecting line for visual pipeline */}
                    <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-100 -z-10 hidden md:block" />
                    
                    {timelineSteps.map((step, idx) => {
                      const currentIdx = getTimelineStepIndex(foundApp.status);
                      const isPast = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      const isMissingDocsStep = foundApp.status === 'Cần bổ sung' && idx === 2;

                      return (
                        <div key={idx} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center md:flex-1">
                          {/* Circle Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 md:mb-2.5
                            ${isPast ? 'bg-teal-600 border-teal-600 text-white shadow-sm ring-4 ring-teal-50' : ''}
                            ${isCurrent && isMissingDocsStep ? 'bg-orange-500 border-orange-500 text-white ring-4 ring-orange-100 animate-pulse' : ''}
                            ${isCurrent && !isMissingDocsStep ? 'bg-blue-900 border-blue-900 text-white shadow-md ring-4 ring-blue-100' : ''}
                            ${(!isPast && !isCurrent) ? 'bg-white border-slate-200 text-slate-400' : ''}
                          `}>
                            {isPast ? (
                              <CheckCircle2 size={18} />
                            ) : isCurrent && isMissingDocsStep ? (
                              <AlertTriangle size={18} />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>

                          {/* Labels */}
                          <div className="space-y-0.5">
                            <span className={`text-xs font-bold block leading-none
                              ${isPast ? 'text-teal-800' : ''}
                              ${isCurrent && isMissingDocsStep ? 'text-orange-600' : ''}
                              ${isCurrent && !isMissingDocsStep ? 'text-blue-900' : ''}
                              ${(!isPast && !isCurrent) ? 'text-slate-400' : ''}
                            `}>
                              {step.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block leading-tight max-w-[120px] md:mx-auto">
                              {isCurrent && isMissingDocsStep ? 'Hồ sơ thiếu chứng minh cư trú' : step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ý kiến Ban tuyển sinh / Admin Comment */}
              <div className="p-6 md:p-8">
                <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start gap-4 
                  ${foundApp.status === 'Cần bổ sung' ? 'bg-orange-50/60 border-orange-200 text-orange-950' : ''}
                  ${foundApp.status === 'Đã duyệt' || foundApp.status === 'Đã nhập học' ? 'bg-teal-50/40 border-teal-200 text-teal-950' : ''}
                  ${foundApp.status === 'Từ chối' ? 'bg-red-50/50 border-red-200 text-red-950' : ''}
                  ${(foundApp.status !== 'Cần bổ sung' && foundApp.status !== 'Đã duyệt' && foundApp.status !== 'Đã nhập học' && foundApp.status !== 'Từ chối') ? 'bg-slate-50 border-slate-200 text-slate-800' : ''}
                `}>
                  <div className={`p-2.5 rounded-lg shrink-0 
                    ${foundApp.status === 'Cần bổ sung' ? 'bg-orange-100 text-orange-700' : ''}
                    ${foundApp.status === 'Đã duyệt' || foundApp.status === 'Đã nhập học' ? 'bg-teal-100 text-teal-700' : ''}
                    ${foundApp.status === 'Từ chối' ? 'bg-red-100 text-red-700' : ''}
                    ${(foundApp.status !== 'Cần bổ sung' && foundApp.status !== 'Đã duyệt' && foundApp.status !== 'Đã nhập học' && foundApp.status !== 'Từ chối') ? 'bg-slate-200 text-slate-700' : ''}
                  `}>
                    {getStatusIcon(foundApp.status)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-xs uppercase tracking-wider">Ý kiến chính thức của Ban tuyển sinh Trường Tiểu Học Thường Phước 2A:</h4>
                    <p className="text-xs leading-relaxed font-medium">
                      {foundApp.adminComment}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                      Cập nhật lúc: {new Date(foundApp.updatedAt).toLocaleDateString('vi-VN')} {new Date(foundApp.updatedAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                </div>

                {/* INTERACTIVE ACTIONS IF "CẦN BỔ SUNG" (Correction Form) */}
                {foundApp.status === 'Cần bổ sung' && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    {!isCorrecting ? (
                      <div className="text-center bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                        <p className="text-xs text-slate-600 mb-3">Hồ sơ này cần bổ sung tài liệu. Bạn muốn cập nhật các bản chụp giấy tờ ngay bây giờ?</p>
                        <button 
                          onClick={() => setIsCorrecting(true)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Cập nhật hồ sơ bổ sung trực tuyến
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveCorrection} className="bg-orange-50/10 border border-orange-200/50 rounded-xl p-5 md:p-6 space-y-4">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <RefreshCw size={14} className="text-orange-500 animate-spin" />
                          Cập nhật bản chụp tài liệu còn thiếu
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">Giấy khai sinh mới (Nếu sai/mờ)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={correctedBirth}
                                onChange={(e) => setCorrectedBirth(e.target.value)}
                                placeholder="GKS_NguyenMinhKhang_BanXoayChieu.pdf"
                                className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                              />
                              <button 
                                type="button"
                                onClick={() => setCorrectedBirth(`GKS_${foundApp.studentName.replace(/\s+/g, '')}_BanXacThucGoc.pdf`)}
                                className="text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-1 rounded"
                              >
                                Upload mới
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">Xác nhận cư trú CT07 mới (Nếu sai/thiếu)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={correctedResidence}
                                onChange={(e) => setCorrectedResidence(e.target.value)}
                                placeholder="CT07_XacNhanCoDauDo.jpg"
                                className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                              />
                              <button 
                                type="button"
                                onClick={() => setCorrectedResidence(`CT07_CongAnPhuongDaKao_XacThuc.jpg`)}
                                className="text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-1 rounded"
                              >
                                Upload mới
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">Ý kiến giải trình của phụ huynh gửi nhà trường</label>
                          <textarea 
                            rows={3}
                            value={correctedNotes}
                            onChange={(e) => setCorrectedNotes(e.target.value)}
                            placeholder="Gửi Ban giám hiệu, gia đình đã nộp lại bản CT07 có đóng dấu đỏ của Công an phường Đa Kao và chụp ảnh Giấy khai sinh bản gốc rõ nét hơn..."
                            className="w-full bg-white border border-slate-200 rounded p-2.5 text-xs text-slate-800 outline-none"
                          />
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setIsCorrecting(false)}
                            className="text-slate-500 hover:text-slate-800 font-semibold text-xs px-4 py-2"
                          >
                            Hủy bỏ
                          </button>
                          <button 
                            type="submit" 
                            disabled={correctingProgress}
                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold text-xs px-5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            {correctingProgress ? (
                              <>Updating...</>
                            ) : (
                              <>Gửi bổ sung lại hồ sơ <Save size={13} /></>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Full Recap Details Accordion */}
              <div className="p-6 md:p-8 bg-slate-50/30">
                <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-4">Chi tiết hồ sơ khai báo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[9px] block">Học sinh</span>
                    <span className="text-slate-800 font-medium block mt-0.5">{foundApp.studentName} ({foundApp.gender})</span>
                    <span className="text-slate-400 block mt-0.5">Sinh ngày: {foundApp.dob} | Dân tộc: {foundApp.ethnic}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[9px] block">Mô hình lớp đăng ký</span>
                    <span className="text-slate-800 font-bold block mt-0.5 text-blue-900">{foundApp.programPreference}</span>
                    <span className="text-slate-400 block mt-0.5">Bán trú: {foundApp.boardingOption} | Xe đưa đón: {foundApp.hasBusService ? 'Có đăng ký' : 'Không'}</span>
                  </div>
                  <div className="md:col-span-2 border-t border-slate-100 pt-3">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] block">Hộ khẩu thường trú</span>
                    <span className="text-slate-800 font-medium block mt-0.5">
                      {[foundApp.permanentAddress.street, foundApp.permanentAddress.ward, foundApp.permanentAddress.district, foundApp.permanentAddress.province].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <div className="md:col-span-2 border-t border-slate-100 pt-3">
                    <span className="text-slate-400 font-semibold uppercase text-[9px] block">Thông tin Cha mẹ</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {foundApp.fatherName && (
                        <div>
                          <strong className="text-slate-700 block">Cha: {foundApp.fatherName}</strong>
                          <span className="text-slate-400 block mt-0.5"><Phone size={10} className="inline mr-1" />{foundApp.fatherPhone} | {foundApp.fatherJob}</span>
                        </div>
                      )}
                      {foundApp.motherName && (
                        <div>
                          <strong className="text-slate-700 block">Mẹ: {foundApp.motherName}</strong>
                          <span className="text-slate-400 block mt-0.5"><Phone size={10} className="inline mr-1" />{foundApp.motherPhone} | {foundApp.motherJob}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Not Found Screen */
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-md text-center max-w-xl mx-auto space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Không tìm thấy hồ sơ tuyển sinh</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Chúng tôi không tìm thấy kết quả hồ sơ nào khớp với Mã định danh cá nhân **"{searchQuery}"** hoặc số điện thoại này trên hệ thống trường Tiểu học Thường Phước 2A.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs space-y-1 text-slate-600">
                <strong>Gợi ý khắc phục:</strong>
                <ul className="list-disc list-inside space-y-1 pt-1">
                  <li>Kiểm tra lại xem đã nhập đúng đủ 12 chữ số định danh chưa</li>
                  <li>Nhập số điện thoại liên lạc của Cha hoặc Mẹ lúc đăng ký</li>
                  <li>Nếu chưa đăng ký trực tuyến, vui lòng nhấn nút bên dưới để khai hồ sơ mới</li>
                </ul>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button 
                  onClick={() => { setSearched(false); setSearchQuery(''); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-lg transition"
                >
                  Thử lại
                </button>
                <button 
                  onClick={onNavigateToRegister}
                  className="bg-blue-900 hover:bg-blue-850 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-sm"
                >
                  Nhập hồ sơ mới ngay
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
