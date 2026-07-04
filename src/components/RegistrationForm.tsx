/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Users, 
  BookOpen, 
  Paperclip, 
  CheckSquare, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  X, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  StudentApplication, 
  ETHNIC_GROUPS, 
  PROVINCES, 
  HCMC_DISTRICTS, 
  WARDS_QUAN_1,
  DONG_THAP_DISTRICTS,
  WARDS_HONG_NGU,
  ProgramPreference,
  BoardingOption
} from '../types';

interface RegistrationFormProps {
  onSuccess: (newApp: StudentApplication) => void;
  onCancel: () => void;
}

export default function RegistrationForm({ onSuccess, onCancel }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Individual Form Fields State
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('2020-01-01');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [ethnic, setEthnic] = useState('Kinh');
  const [pob, setPob] = useState('Tỉnh Đồng Tháp');
  const [nationalId, setNationalId] = useState('');
  
  const [permProvince, setPermProvince] = useState('Tỉnh Đồng Tháp');
  const [permWard, setPermWard] = useState('Xã Thường Phước');
  const [permStreet, setPermStreet] = useState('');
  const permDistrict = '';
  
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [currProvince, setCurrProvince] = useState('Tỉnh Đồng Tháp');
  const [currWard, setCurrWard] = useState('Xã Thường Phước');
  const [currStreet, setCurrStreet] = useState('');
  const currDistrict = '';

  const [kindergartenName, setKindergartenName] = useState('');
  const [kindergartenDistrict, setKindergartenDistrict] = useState('Huyện Hồng Ngự');

  // Parents State
  const [fatherName, setFatherName] = useState('');
  const [fatherDob, setFatherDob] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [fatherJob, setFatherJob] = useState('');
  const [fatherEmail, setFatherEmail] = useState('');

  const [motherName, setMotherName] = useState('');
  const [motherDob, setMotherDob] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [motherJob, setMotherJob] = useState('');
  const [motherEmail, setMotherEmail] = useState('');

  // Preference State
  const [programPreference, setProgramPreference] = useState<ProgramPreference>('Đại trà');
  const [boardingOption, setBoardingOption] = useState<BoardingOption>('Bán trú');
  const [hasBusService, setHasBusService] = useState(false);
  const [notes, setNotes] = useState('');

  // Documents Upload State (Store names of files to simulate uploads)
  const [docBirthCert, setDocBirthCert] = useState<string>('');
  const [docResidence, setDocResidence] = useState<string>('');
  const [docGraduation, setDocGraduation] = useState<string>('');
  const [docPhoto, setDocPhoto] = useState<string>('');

  // Simulating uploads progress
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleSimulateUpload = (field: 'birth' | 'residence' | 'grad' | 'photo', name: string) => {
    setUploadingField(field);
    setTimeout(() => {
      if (field === 'birth') setDocBirthCert(name);
      if (field === 'residence') setDocResidence(name);
      if (field === 'grad') setDocGraduation(name);
      if (field === 'photo') setDocPhoto(name);
      setUploadingField(null);
    }, 1000);
  };

  const autofillSampleDocuments = () => {
    setDocBirthCert(`KhaiSinh_${studentName.replace(/\s+/g, '') || 'Tre'}.pdf`);
    setDocResidence("CT07_XacNhanCuTru_BanGoc.jpg");
    setDocGraduation("GiayChungNhan_HoanThanhMamNon.png");
    setDocPhoto("AnhThe_3x4_HocSinh.jpg");
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!studentName.trim()) {
        errors.studentName = 'Họ và tên học sinh không được để trống';
      } else if (studentName.trim().split(' ').length < 2) {
        errors.studentName = 'Vui lòng nhập đầy đủ cả Họ, Tên đệm và Tên học sinh';
      }

      if (!dob) {
        errors.dob = 'Vui lòng chọn ngày sinh';
      } else {
        const year = new Date(dob).getFullYear();
        if (year !== 2020) {
          errors.dob = 'Năm sinh của bé bắt buộc phải là năm 2020 (Tuyển sinh Lớp 1 đúng tuổi)';
        }
      }

      if (!pob.trim()) {
        errors.pob = 'Nơi sinh không được để trống';
      }

      if (!nationalId.trim()) {
        errors.nationalId = 'Mã định danh cá nhân bắt buộc phải nhập';
      } else if (!/^\d{12}$/.test(nationalId.trim())) {
        errors.nationalId = 'Mã định danh cá nhân của trẻ gồm đúng 12 chữ số';
      }

      if (!permStreet.trim()) {
        errors.permStreet = 'Vui lòng nhập số nhà và tên đường thường trú';
      }

      if (!isSameAddress && !currStreet.trim()) {
        errors.currStreet = 'Vui lòng nhập số nhà và tên đường của nơi ở hiện tại';
      }

      if (!kindergartenName.trim()) {
        errors.kindergartenName = 'Tên trường Mầm non đã học không được để trống';
      }
    }

    if (step === 2) {
      if (!fatherName.trim() && !motherName.trim()) {
        errors.parents = 'Vui lòng điền thông tin của ít nhất Cha hoặc Mẹ học sinh';
      }

      if (fatherName.trim()) {
        if (!fatherPhone.trim()) {
          errors.fatherPhone = 'Vui lòng nhập số điện thoại liên hệ của cha';
        } else if (!/^(0[35789]\d{8})$/.test(fatherPhone.trim())) {
          errors.fatherPhone = 'Số điện thoại của cha không hợp lệ (độ dài 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)';
        }
        if (fatherEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fatherEmail.trim())) {
          errors.fatherEmail = 'Địa chỉ email của cha không hợp lệ';
        }
      }

      if (motherName.trim()) {
        if (!motherPhone.trim()) {
          errors.motherPhone = 'Vui lòng nhập số điện thoại liên hệ của mẹ';
        } else if (!/^(0[35789]\d{8})$/.test(motherPhone.trim())) {
          errors.motherPhone = 'Số điện thoại của mẹ không hợp lệ (độ dài 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)';
        }
        if (motherEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(motherEmail.trim())) {
          errors.motherEmail = 'Địa chỉ email của mẹ không hợp lệ';
        }
      }
    }

    if (step === 4) {
      if (!docBirthCert) {
        errors.docBirth = 'Bắt buộc tải lên bản chụp Giấy khai sinh của học sinh';
      }
      if (!docResidence) {
        errors.docResidence = 'Bắt buộc tải lên Giấy xác nhận thông tin cư trú CT07 hoặc minh chứng VNeID';
      }
      if (!docPhoto) {
        errors.docPhoto = 'Bắt buộc tải lên ảnh chân dung 3x4 của bé';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    // Build finalized application object
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const newAppId = `TS1-2026-${randomSuffix}`;

    const newApplication: StudentApplication = {
      id: newAppId,
      studentName: studentName.trim(),
      dob,
      gender,
      ethnic,
      pob: pob.trim(),
      nationalId: nationalId.trim(),
      permanentAddress: {
        province: permProvince,
        district: permDistrict,
        ward: permWard,
        street: permStreet.trim()
      },
      currentAddress: isSameAddress ? {
        province: permProvince,
        district: permDistrict,
        ward: permWard,
        street: permStreet.trim()
      } : {
        province: currProvince,
        district: currDistrict,
        ward: currWard,
        street: currStreet.trim()
      },
      isSameAddress,
      kindergartenName: kindergartenName.trim(),
      kindergartenDistrict,
      fatherName: fatherName.trim(),
      fatherDob: fatherDob.trim(),
      fatherPhone: fatherPhone.trim(),
      fatherJob: fatherJob.trim(),
      fatherEmail: fatherEmail.trim(),
      motherName: motherName.trim(),
      motherDob: motherDob.trim(),
      motherPhone: motherPhone.trim(),
      motherJob: motherJob.trim(),
      motherEmail: motherEmail.trim(),
      programPreference,
      boardingOption,
      hasBusService,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Đã nộp',
      adminComment: 'Hồ sơ trực tuyến mới gửi thành công. Đang chờ Ban tuyển sinh tiếp nhận và xác thực thông tin cư trú.',
      documents: {
        birthCertificate: docBirthCert,
        residenceCert: docResidence,
        kindergartenCert: docGraduation || 'Chua_nop_GCN_Mamnon.pdf',
        studentPhoto: docPhoto
      }
    };

    onSuccess(newApplication);
  };

  // Render Step Navigation Indicators
  const steps = [
    { num: 1, name: "Học sinh", icon: <User size={16} /> },
    { num: 2, name: "Gia đình", icon: <Users size={16} /> },
    { num: 3, name: "Nguyện vọng", icon: <BookOpen size={16} /> },
    { num: 4, name: "Đính kèm hồ sơ", icon: <Paperclip size={16} /> },
    { num: 5, name: "Xác nhận", icon: <CheckSquare size={16} /> }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 md:p-8 animate-fade-in">
      {/* Wizard Header */}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="text-blue-900" />
          Phiếu Đăng Ký Tuyển Sinh Trực Tuyến Lớp 1
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Học sinh sinh năm 2020 đăng ký nhập học Trường Tiểu học Thường Phước 2A, Đồng Tháp
        </p>

        {/* Step circles */}
        <div className="mt-8 flex items-center justify-between relative max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-none">
          {/* Progress bar line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-10 hidden sm:block" />
          <div 
            className="absolute top-4 left-4 h-0.5 bg-blue-900 -z-10 transition-all duration-300 hidden sm:block" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;
            
            return (
              <div 
                key={s.num} 
                className="flex flex-col items-center flex-1 min-w-[70px] text-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    // Let user click back steps freely, but validate going forward
                    if (s.num < currentStep) {
                      setCurrentStep(s.num);
                    } else if (s.num > currentStep && validateStep(currentStep)) {
                      // Prevent jumping multiple steps unless previous steps validated
                      let stepVal = true;
                      for (let i = currentStep; i < s.num; i++) {
                        if (!validateStep(i)) {
                          stepVal = false;
                          setCurrentStep(i);
                          break;
                        }
                      }
                      if (stepVal) setCurrentStep(s.num);
                    }
                  }}
                  id={`step-indicator-${s.num}`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer
                    ${isCompleted ? 'bg-blue-900 text-white shadow-sm ring-4 ring-blue-50' : ''}
                    ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md' : ''}
                    ${(!isCompleted && !isActive) ? 'bg-slate-50 text-slate-400 border border-slate-200' : ''}
                  `}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : s.num}
                </button>
                <span className={`text-[11px] mt-2 font-medium tracking-tight whitespace-nowrap
                  ${isActive ? 'text-blue-900 font-semibold' : 'text-slate-400'}
                `}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ================= STEP 1: STUDENT INFO ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                1. Thông tin lý lịch của Học sinh
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  Họ và tên học sinh <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                  placeholder="NGUYỄN MINH KHANG"
                  className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-blue-900
                    ${formErrors.studentName ? 'border-red-300 bg-red-50/20' : 'border-slate-200'}
                  `}
                />
                {formErrors.studentName && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.studentName}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Nhập đầy đủ họ, chữ lót và tên bằng tiếng Việt có dấu, viết in hoa.
                </p>
              </div>

              {/* Dob */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-900
                    ${formErrors.dob ? 'border-red-300 bg-red-50/20' : 'border-slate-200'}
                  `}
                />
                {formErrors.dob && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.dob}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center border border-slate-200 rounded-lg py-2.5 px-4 bg-slate-50 text-slate-700 cursor-pointer text-sm hover:bg-slate-100 transition active:scale-[0.98]">
                    <input 
                      type="radio" 
                      name="gender" 
                      checked={gender === 'Nam'} 
                      onChange={() => setGender('Nam')}
                      className="mr-2 accent-blue-900" 
                    />
                    Nam
                  </label>
                  <label className="flex-1 flex items-center justify-center border border-slate-200 rounded-lg py-2.5 px-4 bg-slate-50 text-slate-700 cursor-pointer text-sm hover:bg-slate-100 transition active:scale-[0.98]">
                    <input 
                      type="radio" 
                      name="gender" 
                      checked={gender === 'Nữ'} 
                      onChange={() => setGender('Nữ')}
                      className="mr-2 accent-blue-900" 
                    />
                    Nữ
                  </label>
                </div>
              </div>

              {/* Ethnic */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  Dân tộc <span className="text-red-500">*</span>
                </label>
                <select 
                  value={ethnic}
                  onChange={(e) => setEthnic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-900"
                >
                  {ETHNIC_GROUPS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Pob */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  Nơi sinh <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  placeholder="TP. Hồ Chí Minh"
                  className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-900
                    ${formErrors.pob ? 'border-red-300 bg-red-50/20' : 'border-slate-200'}
                  `}
                />
                {formErrors.pob && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.pob}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 italic">Theo Giấy khai sinh (ví dụ: Tỉnh/TP hoặc tên bệnh viện)</p>
              </div>

              {/* Student National ID (Mã định danh cá nhân) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase flex items-center gap-1">
                  Mã định danh cá nhân học sinh (12 số) <span className="text-red-500">*</span>
                  <div className="group relative cursor-pointer">
                    <HelpCircle size={13} className="text-slate-400 hover:text-slate-600" />
                    <div className="absolute left-1/2 bottom-full mb-1.5 transform -translate-x-1/2 bg-slate-950 text-white text-[10px] p-2 rounded w-60 opacity-0 group-hover:opacity-100 transition pointer-events-none z-25 leading-normal">
                      Mã định danh cá nhân của học sinh gồm đúng 12 chữ số được in trên Giấy khai sinh mẫu mới hoặc Giấy xác nhận CT07 của Công an phường.
                    </div>
                  </div>
                </label>
                <input 
                  type="text" 
                  maxLength={12}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))} // only digits
                  placeholder="079220012345"
                  className={`w-full bg-slate-50 border font-mono rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-blue-900
                    ${formErrors.nationalId ? 'border-red-300 bg-red-50/20' : 'border-slate-200'}
                  `}
                />
                {formErrors.nationalId && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.nationalId}</p>
                )}
              </div>

              {/* Kindergarten name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">
                  Trường mầm non 5 tuổi đã học <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={kindergartenName}
                  onChange={(e) => setKindergartenName(e.target.value)}
                  placeholder="Trường Mầm non Tân Định"
                  className={`w-full bg-slate-50 border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-900
                    ${formErrors.kindergartenName ? 'border-red-300 bg-red-50/20' : 'border-slate-200'}
                  `}
                />
                {formErrors.kindergartenName && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.kindergartenName}</p>
                )}
              </div>
            </div>

            {/* Address Sections */}
            <div className="bg-slate-50/60 p-5 rounded-xl border border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Hộ khẩu thường trú (Địa chỉ thường trú)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Tỉnh / Thành phố</label>
                  <select 
                    value={permProvince}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPermProvince(val);
                      if (val === 'Tỉnh Đồng Tháp') {
                        setPermWard('Xã Thường Phước');
                      } else {
                        setPermWard('');
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                  >
                    {PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Phường / Xã</label>
                  {permProvince === 'Tỉnh Đồng Tháp' ? (
                    <select 
                      value={permWard}
                      onChange={(e) => setPermWard(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                    >
                      {WARDS_HONG_NGU.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      value={permWard}
                      onChange={(e) => setPermWard(e.target.value)}
                      placeholder="Nhập tên Phường / Xã"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                    />
                  )}
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Số nhà, tên đường, khu phố, tổ dân phố <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={permStreet}
                    onChange={(e) => setPermStreet(e.target.value)}
                    placeholder="Ví dụ: 125/4 Nguyễn Đình Chiểu, Tổ 10, Khu phố 2"
                    className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 outline-none
                      ${formErrors.permStreet ? 'border-red-300' : 'border-slate-200'}
                    `}
                  />
                  {formErrors.permStreet && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.permStreet}</p>
                  )}
                </div>
              </div>

              {/* Checkbox same address */}
              <div className="pt-2 border-t border-slate-200/50">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input 
                    type="checkbox" 
                    checked={isSameAddress}
                    onChange={(e) => setIsSameAddress(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-900 accent-blue-900 cursor-pointer"
                  />
                  Nơi ở hiện tại trùng với hộ khẩu thường trú (Trú thực tế tại hộ khẩu)
                </label>
              </div>

              {/* Conditional Current Address */}
              {!isSameAddress && (
                <div className="space-y-4 pt-2 border-t border-slate-200/50 animate-fade-in">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Nơi ở hiện tại (Chỗ ở thực tế)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Tỉnh / Thành phố</label>
                      <select 
                        value={currProvince}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrProvince(val);
                          if (val === 'Tỉnh Đồng Tháp') {
                            setCurrWard('Xã Thường Phước');
                          } else {
                            setCurrWard('');
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                      >
                        {PROVINCES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Phường / Xã</label>
                      {currProvince === 'Tỉnh Đồng Tháp' ? (
                        <select 
                          value={currWard}
                          onChange={(e) => setCurrWard(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                        >
                          {WARDS_HONG_NGU.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          value={currWard}
                          onChange={(e) => setCurrWard(e.target.value)}
                          placeholder="Nhập tên Phường / Xã"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Số nhà, tên đường, khu phố, tổ dân phố <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={currStreet}
                        onChange={(e) => setCurrStreet(e.target.value)}
                        placeholder="Ví dụ: 189/10 Ung Văn Khiêm, Phường 25"
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 outline-none
                          ${formErrors.currStreet ? 'border-red-300' : 'border-slate-200'}
                        `}
                      />
                      {formErrors.currStreet && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.currStreet}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 2: PARENTS INFO ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                2. Thông tin Cha, Mẹ hoặc Người giám hộ
              </h3>
            </div>

            {formErrors.parents && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {formErrors.parents}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Father card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/30 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase">Thông tin về Cha</h4>
                </div>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Họ và tên cha</label>
                    <input 
                      type="text" 
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Nguyễn Minh Hùng"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Năm sinh</label>
                      <input 
                        type="text" 
                        maxLength={4}
                        value={fatherDob}
                        onChange={(e) => setFatherDob(e.target.value.replace(/\D/g, ''))}
                        placeholder="1988"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Số điện thoại liên hệ</label>
                      <input 
                        type="text" 
                        maxLength={10}
                        value={fatherPhone}
                        onChange={(e) => setFatherPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="0908123456"
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 outline-none
                          ${formErrors.fatherPhone ? 'border-red-300' : 'border-slate-200'}
                        `}
                      />
                      {formErrors.fatherPhone && (
                        <p className="text-red-500 text-[9px] mt-0.5">{formErrors.fatherPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Nghề nghiệp</label>
                      <input 
                        type="text" 
                        value={fatherJob}
                        onChange={(e) => setFatherJob(e.target.value)}
                        placeholder="Kỹ sư xây dựng"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        value={fatherEmail}
                        onChange={(e) => setFatherEmail(e.target.value)}
                        placeholder="hung.nguyen@gmail.com"
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 outline-none
                          ${formErrors.fatherEmail ? 'border-red-300' : 'border-slate-200'}
                        `}
                      />
                      {formErrors.fatherEmail && (
                        <p className="text-red-500 text-[9px] mt-0.5">{formErrors.fatherEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mother card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/30 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-700" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase">Thông tin về Mẹ</h4>
                </div>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Họ và tên mẹ</label>
                    <input 
                      type="text" 
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Lê Thị Thu Thảo"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Năm sinh</label>
                      <input 
                        type="text" 
                        maxLength={4}
                        value={motherDob}
                        onChange={(e) => setMotherDob(e.target.value.replace(/\D/g, ''))}
                        placeholder="1991"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Số điện thoại liên hệ</label>
                      <input 
                        type="text" 
                        maxLength={10}
                        value={motherPhone}
                        onChange={(e) => setMotherPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="0912345678"
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 outline-none
                          ${formErrors.motherPhone ? 'border-red-300' : 'border-slate-200'}
                        `}
                      />
                      {formErrors.motherPhone && (
                        <p className="text-red-500 text-[9px] mt-0.5">{formErrors.motherPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Nghề nghiệp</label>
                      <input 
                        type="text" 
                        value={motherJob}
                        onChange={(e) => setMotherJob(e.target.value)}
                        placeholder="Kế toán viên"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        value={motherEmail}
                        onChange={(e) => setMotherEmail(e.target.value)}
                        placeholder="thao.le@gmail.com"
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 outline-none
                          ${formErrors.motherEmail ? 'border-red-300' : 'border-slate-200'}
                        `}
                      />
                      {formErrors.motherEmail && (
                        <p className="text-red-500 text-[9px] mt-0.5">{formErrors.motherEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PREFERENCES ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                3. Đăng ký Mô hình lớp học & Nguyện vọng học tập
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Program selection */}
              <div className="md:col-span-3 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase">Chương trình học đăng ký nguyện vọng chính <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Cambridge Integrated */}
                  <label 
                    onClick={() => setProgramPreference('Tích hợp')}
                    className={`border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition relative hover:border-blue-300
                      ${programPreference === 'Tích hợp' ? 'border-blue-900 bg-blue-50/30 ring-2 ring-blue-900/10' : 'border-slate-200 bg-white'}
                    `}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 text-sm">Chương trình Tiếng Anh Tích hợp</span>
                        <input 
                          type="radio" 
                          name="programPref" 
                          checked={programPreference === 'Tích hợp'}
                          onChange={() => setProgramPreference('Tích hợp')}
                          className="accent-blue-900 w-4 h-4"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        Chương trình Cambridge chuẩn hóa quốc tế, học Toán và Khoa học hoàn toàn bằng Tiếng Anh với 100% giáo viên bản xứ bản ngữ giàu kinh nghiệm.
                      </p>
                    </div>
                    <span className="text-[10px] mt-4 font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded w-fit">
                      Chỉ tiêu: 105 học sinh
                    </span>
                  </label>

                  {/* Intensive English */}
                  <label 
                    onClick={() => setProgramPreference('Tăng cường')}
                    className={`border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition relative hover:border-blue-300
                      ${programPreference === 'Tăng cường' ? 'border-blue-900 bg-blue-50/30 ring-2 ring-blue-900/10' : 'border-slate-200 bg-white'}
                    `}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 text-sm">Tăng cường Tiếng Anh đề án</span>
                        <input 
                          type="radio" 
                          name="programPref" 
                          checked={programPreference === 'Tăng cường'}
                          onChange={() => setProgramPreference('Tăng cường')}
                          className="accent-blue-900 w-4 h-4"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        Tập trung rèn luyện 4 kỹ năng nghe, nói, đọc, viết tăng giờ học tiếng Anh giao tiếp, rèn luyện tư duy ngôn ngữ độc lập từ sớm.
                      </p>
                    </div>
                    <span className="text-[10px] mt-4 font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded w-fit">
                      Chỉ tiêu: 140 học sinh
                    </span>
                  </label>

                  {/* Standard */}
                  <label 
                    onClick={() => setProgramPreference('Đại trà')}
                    className={`border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition relative hover:border-blue-300
                      ${programPreference === 'Đại trà' ? 'border-blue-900 bg-blue-50/30 ring-2 ring-blue-900/10' : 'border-slate-200 bg-white'}
                    `}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 text-sm">Chương trình Đại trà (Mẫu mực)</span>
                        <input 
                          type="radio" 
                          name="programPref" 
                          checked={programPreference === 'Đại trà'}
                          onChange={() => setProgramPreference('Đại trà')}
                          className="accent-blue-900 w-4 h-4"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        Chương trình giáo dục phổ thông cốt lõi của Bộ GD&ĐT kết hợp giáo dục STEM, phát triển kỹ năng tự chủ và dã ngoại trải nghiệm định kỳ.
                      </p>
                    </div>
                    <span className="text-[10px] mt-4 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded w-fit">
                      Chỉ tiêu: 175 học sinh
                    </span>
                  </label>
                </div>
              </div>

              {/* Boarding and Bus */}
              <div className="md:col-span-1 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">Phương án Bán trú <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center border border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50 text-slate-700 cursor-pointer text-xs hover:bg-slate-100">
                    <input 
                      type="radio" 
                      name="boardingOpt" 
                      checked={boardingOption === 'Bán trú'} 
                      onChange={() => setBoardingOption('Bán trú')}
                      className="mr-2 accent-blue-900" 
                    />
                    Học bán trú (Ăn ngủ trường)
                  </label>
                  <label className="flex-1 flex items-center justify-center border border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50 text-slate-700 cursor-pointer text-xs hover:bg-slate-100">
                    <input 
                      type="radio" 
                      name="boardingOpt" 
                      checked={boardingOption === 'Ngoại trú'} 
                      onChange={() => setBoardingOption('Ngoại trú')}
                      className="mr-2 accent-blue-900" 
                    />
                    Học ngoại trú
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">Đưa đón bằng xe bus trường</label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 pr-4">
                    Gia đình có nguyện vọng sử dụng dịch vụ xe bus đưa đón tại nhà của trường TH Nguyễn Bỉnh Khiêm không?
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasBusService}
                      onChange={(e) => setHasBusService(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900" />
                  </label>
                </div>
              </div>

              {/* Special notes */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase">Lưu ý đặc biệt hoặc thông tin bổ sung của bé</label>
                <textarea 
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gia đình chia sẻ về tình hình sức khỏe đặc biệt, năng khiếu nổi trội, thói quen ăn uống dị ứng thức ăn hoặc nguyện vọng sắp xếp xe đưa đón..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: FILE UPLOADS ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                4. Đính kèm Bản chụp/Scan Hồ Sơ tuyển sinh gốc
              </h3>
              <button
                type="button"
                onClick={autofillSampleDocuments}
                className="text-xs text-blue-900 font-semibold bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
              >
                ⚡ Sử dụng hồ sơ giả định (Demo)
              </button>
            </div>

            <div className="bg-slate-50 text-slate-600 text-xs p-3.5 rounded-xl border border-slate-200/60 leading-normal">
              <strong>Yêu cầu chất lượng ảnh chụp:</strong> Ảnh chụp tài liệu từ điện thoại hoặc bản scan phải vuông vắn, đủ độ sáng, không mờ nhòe chữ, định dạng tệp .PDF, .JPG hoặc .PNG, dung lượng không quá 5MB/tệp.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Doc 1: Birth certificate */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-blue-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      1. Bản sao Giấy khai sinh <span className="text-red-500">*</span>
                    </h4>
                    {docBirthCert && <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">Đã chọn</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Tải lên bản scan hoặc chụp rõ nét đầy đủ toàn bộ mặt trang Giấy khai sinh gốc của học sinh.</p>
                </div>
                
                <div className="mt-4">
                  {docBirthCert ? (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="font-mono text-slate-700 truncate max-w-[200px]">{docBirthCert}</span>
                      <button onClick={() => setDocBirthCert('')} className="text-slate-400 hover:text-red-500"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 hover:bg-blue-50/10 rounded-lg p-6 text-center cursor-pointer transition relative">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleSimulateUpload('birth', e.target.files?.[0]?.name || 'giay_khai_sinh.pdf')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <span className="text-xs font-semibold text-slate-700 block">Kéo thả tệp hoặc click chọn</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Hỗ trợ PDF, JPG, PNG tối đa 5MB</span>
                    </div>
                  )}
                  {formErrors.docBirth && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.docBirth}</p>
                  )}
                </div>
              </div>

              {/* Doc 2: CT07 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-blue-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      2. Xác nhận cư trú CT07 <span className="text-red-500">*</span>
                    </h4>
                    {docResidence && <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">Đã chọn</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Tải lên Giấy xác nhận thông tin cư trú CT07 còn thời hạn hoặc bản in thông tin cá nhân/hộ gia đình xuất xuất từ Cổng VNeID.</p>
                </div>
                
                <div className="mt-4">
                  {docResidence ? (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="font-mono text-slate-700 truncate max-w-[200px]">{docResidence}</span>
                      <button onClick={() => setDocResidence('')} className="text-slate-400 hover:text-red-500"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 hover:bg-blue-50/10 rounded-lg p-6 text-center cursor-pointer transition relative">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleSimulateUpload('residence', e.target.files?.[0]?.name || 'ct07_xac_nhan_cu_tru.jpg')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <span className="text-xs font-semibold text-slate-700 block">Kéo thả tệp hoặc click chọn</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Hỗ trợ PDF, JPG, PNG tối đa 5MB</span>
                    </div>
                  )}
                  {formErrors.docResidence && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.docResidence}</p>
                  )}
                </div>
              </div>

              {/* Doc 3: Graduation cert */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-blue-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      3. Hoàn thành mầm non 5 tuổi <span className="text-slate-400">(Tùy chọn)</span>
                    </h4>
                    {docGraduation && <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">Đã chọn</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Giấy chứng nhận tốt nghiệp mẫu giáo 5 tuổi hoặc kết quả giáo dục mầm non do trường mầm non cấp.</p>
                </div>
                
                <div className="mt-4">
                  {docGraduation ? (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="font-mono text-slate-700 truncate max-w-[200px]">{docGraduation}</span>
                      <button onClick={() => setDocGraduation('')} className="text-slate-400 hover:text-red-500"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 hover:bg-blue-50/10 rounded-lg p-6 text-center cursor-pointer transition relative">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleSimulateUpload('grad', e.target.files?.[0]?.name || 'chung_nhan_tot_nghiep_mam_non.jpg')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <span className="text-xs font-semibold text-slate-700 block">Kéo thả tệp hoặc click chọn</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Hỗ trợ PDF, JPG, PNG tối đa 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Doc 4: Portrait Photo */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-blue-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      4. Ảnh chân dung 3x4 của bé <span className="text-red-500">*</span>
                    </h4>
                    {docPhoto && <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">Đã chọn</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">Ảnh thẻ chân dung 3x4 chất lượng cao, tóc gọn gàng, phông nền trắng hoặc xanh dương để dán vào hồ sơ quản lý lớp.</p>
                </div>
                
                <div className="mt-4">
                  {docPhoto ? (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="font-mono text-slate-700 truncate max-w-[200px]">{docPhoto}</span>
                      <button onClick={() => setDocPhoto('')} className="text-slate-400 hover:text-red-500"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 hover:bg-blue-50/10 rounded-lg p-6 text-center cursor-pointer transition relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleSimulateUpload('photo', e.target.files?.[0]?.name || 'anh_the_3x4.jpg')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <span className="text-xs font-semibold text-slate-700 block">Kéo thả tệp hoặc click chọn</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Ảnh định dạng JPG, PNG tối đa 5MB</span>
                    </div>
                  )}
                  {formErrors.docPhoto && (
                    <p className="text-red-500 text-[10px] mt-1">{formErrors.docPhoto}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Simulated Loading Indicator */}
            {uploadingField && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 flex items-center justify-center gap-2 text-xs">
                <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                Đang nén dữ liệu và tải tệp tin lên máy chủ tuyển sinh...
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 5: REVIEW & CONFIRM ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                5. Xem lại toàn bộ thông tin & Cam đoan
              </h3>
            </div>

            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <strong>Vui lòng kiểm tra lại thật kỹ:</strong> Dưới đây là bảng tổng hợp thông tin đăng ký tuyển sinh Lớp 1 của bé. Hãy đối chiếu chính xác số Mã định danh và số điện thoại liên lạc trước khi nhấp "Gửi hồ sơ".
            </div>

            {/* Recap Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs bg-white">
              {/* Box 1: Student */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <span className="font-semibold text-slate-400 uppercase text-[10px] col-span-1">1. Học sinh:</span>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-slate-800 font-medium">
                  <div>Họ tên: <strong className="text-blue-900 font-bold">{studentName}</strong></div>
                  <div>Giới tính: <strong>{gender}</strong></div>
                  <div>Ngày sinh: <strong>{dob}</strong></div>
                  <div>Dân tộc: <strong>{ethnic}</strong></div>
                  <div>Nơi sinh: <strong>{pob}</strong></div>
                  <div>Mã định danh: <strong className="font-mono text-slate-900 tracking-wide">{nationalId}</strong></div>
                  <div>Trường mầm non: <strong>{kindergartenName}</strong></div>
                </div>
              </div>

              {/* Box 2: Address */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <span className="font-semibold text-slate-400 uppercase text-[10px] col-span-1">2. Hộ khẩu thường trú:</span>
                <div className="md:col-span-3 text-slate-800 font-medium">
                  {[permStreet, permWard, permDistrict, permProvince].filter(Boolean).join(', ')}
                </div>
              </div>

              {/* Box 3: Parents */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <span className="font-semibold text-slate-400 uppercase text-[10px] col-span-1">3. Phụ huynh:</span>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {fatherName && (
                    <div className="space-y-0.5 text-slate-800 font-medium">
                      <div className="text-[10px] text-slate-400 uppercase">Thông tin Cha:</div>
                      <div>Họ tên: <strong>{fatherName} ({fatherDob})</strong></div>
                      <div>SĐT: <strong>{fatherPhone}</strong> | Nghề: <strong>{fatherJob}</strong></div>
                    </div>
                  )}
                  {motherName && (
                    <div className="space-y-0.5 text-slate-800 font-medium">
                      <div className="text-[10px] text-slate-400 uppercase">Thông tin Mẹ:</div>
                      <div>Họ tên: <strong>{motherName} ({motherDob})</strong></div>
                      <div>SĐT: <strong>{motherPhone}</strong> | Nghề: <strong>{motherJob}</strong></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Box 4: Preferences */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <span className="font-semibold text-slate-400 uppercase text-[10px] col-span-1">4. Nguyện vọng đăng ký:</span>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-y-1 text-slate-800 font-medium">
                  <div>Chương trình: <strong className="text-blue-900">{programPreference}</strong></div>
                  <div>Chế độ bán trú: <strong>{boardingOption}</strong></div>
                  <div>Dịch vụ đưa đón xe bus: <strong>{hasBusService ? 'Có đăng ký xe trường' : 'Gia đình tự đưa đón'}</strong></div>
                  {notes && <div className="col-span-2 mt-1 bg-slate-50 p-2 rounded text-slate-500 font-normal italic">Ghi chú: "{notes}"</div>}
                </div>
              </div>

              {/* Box 5: Docs */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <span className="font-semibold text-slate-400 uppercase text-[10px] col-span-1">5. Tệp tài liệu đính kèm:</span>
                <div className="md:col-span-3 flex flex-wrap gap-2 text-slate-800">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">Giấy khai sinh: {docBirthCert}</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">Xác nhận CT07: {docResidence}</span>
                  {docGraduation && <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">Tốt nghiệp MN: {docGraduation}</span>}
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">Ảnh chân dung: {docPhoto}</span>
                </div>
              </div>
            </div>

            {/* Pledge checkbox */}
            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200 space-y-3">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">Lời Cam Đoan của Phụ Huynh</h4>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Tôi xin cam đoan toàn bộ thông tin khai báo lý lịch, nơi cư trú thực tế của học sinh và người thân trên phiếu này là **hoàn toàn đúng sự thật**. Tôi xin chịu hoàn toàn trách nhiệm trước pháp luật và Ban tuyển sinh nhà trường nếu có bất kỳ sự sai lệch hoặc cố tình giả mạo hồ sơ phân tuyến để nhập học trái tuyến.
              </p>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-900 pt-2 border-t border-amber-200/50">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 rounded text-blue-900 accent-blue-900 cursor-pointer mt-0.5 shrink-0"
                />
                Tôi đồng ý với tất cả cam đoan nêu trên và xác nhận gửi hồ sơ trực tuyến.
              </label>
            </div>
          </div>
        )}

        {/* ================= BUTTON PANEL ================= */}
        <div className="border-t border-slate-100 pt-6 flex justify-between items-center flex-wrap gap-4">
          <button
            type="button"
            onClick={onCancel}
            id="btn-cancel-reg"
            className="text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                id="btn-prev-step"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft size={16} /> Quay lại
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                id="btn-next-step"
                className="bg-blue-900 hover:bg-blue-850 text-white font-semibold px-5 py-2 md:px-6 md:py-2.5 rounded-lg text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                Tiếp theo <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                id="btn-submit-application"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2 md:px-8 md:py-2.5 rounded-lg text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                Gửi hồ sơ tuyển sinh <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
